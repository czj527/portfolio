# 用 Streamlit 快速搭建一个 AI 智能伴侣项目

> 适合对象：有丰富开发经验的工程师。本文聚焦架构设计决策、Streamlit 局限性、生产部署考量、性能优化与可扩展性。

---

## 一、工具选型决策

### 技术选型分析

| 维度 | Streamlit | FastAPI + HTMX | Next.js + API Routes |
|------|-----------|----------------|-----------------------|
| 前端开发量 | ★★★★★（极低） | ★★★☆☆ | ★★☆☆☆ |
| 实时能力 | 原生支持 | 需 WebSocket | 需 Server-Sent Events |
| 可定制性 | 受限 | 高 | 高 |
| 部署复杂度 | ★☆☆☆☆ | ★★★☆☆ | ★★★☆☆ |
| 生产级可靠性 | 中 | 高 | 高 |

**选择 Streamlit 的理由**：快速验证 AI 应用的核心交互逻辑（对话式问答）。当产品方向明确后，再迁移到更灵活的架构。

**DeepSeek v4-flash 定位**：作为快速、轻量的后端模型，适合：
- MVP 阶段降低 API 调用成本
- 需要快速迭代的中文对话场景
- 长上下文（128K）的文档理解任务

---

## 二、项目结构设计

```
ai-companion/
├── app.py                    # Streamlit 入口
├── config.py                 # 配置管理（API Key、超参）
├── llm/
│   ├── __init__.py
│   ├── client.py             # LLM 客户端封装
│   └── prompts.py             # Prompt 模板管理
├── utils/
│   ├── __init__.py
│   └── session.py            # 会话状态工具
├── .env.example              # 环境变量模板
└── requirements.txt
```

---

## 三、核心实现

### 3.1 配置管理

```python
# config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    deepseek_api_key: str = ""
    deepseek_base_url: str = "https://api.deepseek.com"
    model: str = "deepseek-chat"
    max_tokens: int = 2048
    temperature: float = 0.7
    stream: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
```

### 3.2 LLM 客户端封装

核心原则：**错误处理全面化、重试机制合理化、超时控制精确化**。

```python
# llm/client.py
from openai import OpenAI
from openai import APIError, RateLimitError, APITimeoutError
import logging
from typing import Generator
from config import get_settings

logger = logging.getLogger(__name__)

class LLMClient:
    def __init__(self):
        settings = get_settings()
        self.client = OpenAI(
            api_key=settings.deepseek_api_key,
            base_url=settings.deepseek_base_url,
            timeout=30.0,          # 全局超时 30s
            max_retries=2          # 自动重试 2 次
        )
        self.model = settings.model

    def chat_stream(
        self,
        messages: list[dict],
        **kwargs
    ) -> Generator[str, None, None]:
        """流式对话，yield 每个 delta content"""
        try:
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=True,
                **{"max_tokens": 2048, "temperature": 0.7, **kwargs}
            )
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield delta
        except RateLimitError:
            logger.warning("API 速率限制，短暂等待后重试")
            raise
        except APITimeoutError:
            logger.error("API 请求超时")
            raise
        except APIError as e:
            logger.error(f"API 错误：{e}")
            raise
```

### 3.3 会话状态管理

Streamlit 的 `st.session_state` 本质是 per-session 的内存存储，适用于轻量对话应用。但需注意：

- `st.session_state` **不是持久化存储**——用户刷新页面或关闭标签页后状态丢失
- 如果需要真正的多轮对话持久化，需要接入数据库（SQLite/PostgreSQL + Supabase）

```python
# utils/session.py
import streamlit as st
from typing import TypedDict
from datetime import datetime

class Message(TypedDict):
    role: str
    content: str
    timestamp: str

def init_session() -> None:
    """初始化会话状态"""
    defaults = {
        "messages": [],
        "session_id": datetime.now().isoformat(),
        "token_count": 0,
    }
    for key, val in defaults.items():
        st.session_state.setdefault(key, val)

def append_message(role: str, content: str) -> None:
    st.session_state.messages.append({
        "role": role,
        "content": content,
        "timestamp": datetime.now().isoformat()
    })

def build_messages(system_prompt: str) -> list[dict]:
    """构建发送给 API 的消息列表"""
    return [{"role": "system", "content": system_prompt}] + [
        {"role": m["role"], "content": m["content"]}
        for m in st.session_state.messages
    ]
```

### 3.4 页面布局与流式输出

```python
# app.py
import streamlit as st
from llm.client import LLMClient
from utils.session import init_session, append_message, build_messages
from config import get_settings

st.set_page_config(page_title="AI Companion", layout="wide")

def main():
    init_session()
    settings = get_settings()

    # 侧边栏：配置面板
    with st.sidebar:
        st.title("⚙️ 设置")
        model = st.selectbox("模型", ["deepseek-chat", "deepseek-coder"])
        temperature = st.slider("温度", 0.0, 1.0, 0.7)
        max_tokens = st.slider("最大输出", 256, 4096, 2048)
        if st.button("🗑️ 清空对话"):
            st.session_state.messages = []
            st.rerun()

    st.title("🤖 AI 智能伴侣")
    st.divider()

    # 渲染历史消息
    for msg in st.session_state.messages:
        avatar = "user" if msg["role"] == "user" else "assistant"
        with st.chat_message(avatar):
            st.markdown(msg["content"])

    # 聊天输入
    if prompt := st.chat_input("输入问题..."):
        append_message("user", prompt)
        with st.chat_message("user"):
            st.markdown(prompt)

        messages = build_messages(settings.system_prompt)
        with st.chat_message("assistant"):
            container = st.empty()
            full_reply = ""
            try:
                client = LLMClient()
                for token in client.chat_stream(messages, temperature=temperature):
                    full_reply += token
                    container.markdown(full_reply + "▌")
                container.markdown(full_reply)
                append_message("assistant", full_reply)
            except Exception as e:
                st.error(f"请求失败：{str(e)}")

if __name__ == "__main__":
    main()
```

---

## 四、Streamlit 的局限性 & 生产环境注意事项

### 4.1 已知局限性

| 问题 | 影响 | 应对方案 |
|------|------|----------|
| 页面刷新状态丢失 | 对话历史丢失 | 接入 Supabase/SQLite |
| 并发能力有限 | 高并发下性能下降 | 部署多个实例 + 负载均衡 |
| 前端定制受限 | 无法实现精细 UI | 必要时迁移 Next.js |
| 不支持 SSR | SEO 不友好 | 仅适合内部工具/AI 应用 |

### 4.2 生产部署考量

**环境变量安全**：
```bash
# 永远不要提交 .env 到版本库
echo ".env" >> .gitignore
```

**Docker 部署**：
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8501
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

**健康检查**：Streamlit 没有内置健康检查端点，可通过 Nginx 探测 `/health` 路由：
```nginx
location /health {
    return 200 'OK';
    add_header Content-Type text/plain;
}
```

### 4.3 性能优化

**Token 消耗控制**：在 `build_messages` 中实现滑动窗口，超过 128K token 时截断早期消息：
```python
def build_messages(system_prompt: str, max_context: int = 120000) -> list[dict]:
    messages = [{"role": "system", "content": system_prompt}]
    # 倒序加入历史消息，控制总 token 量
    for msg in reversed(st.session_state.messages):
        messages.insert(1, {"role": msg["role"], "content": msg["content"]})
        # 粗略估算：1 token ≈ 2 中文字符
        if sum(len(m["content"]) for m in messages) > max_context:
            messages.pop(1)  # 移除最早的非 system 消息
    return messages
```

**连接池**：`OpenAI` SDK 内部维护连接池，不需要额外配置。

**缓存 Prompt 模板**：使用 `@lru_cache` 避免重复解析：
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_prompt_template(role: str) -> str:
    ...
```

### 4.4 错误处理策略

```python
# 分层错误处理
class LLMError(Exception):
    """LLM 相关错误的基类"""
    pass

class APIAuthError(LLMError):
    """API Key 无效或过期"""
    pass

class RateLimitError(LLMError):
    """触发速率限制"""
    pass

class TimeoutError(LLMError):
    """请求超时"""
    pass
```

在 UI 层优雅降级：
```python
try:
    for token in client.chat_stream(messages):
        yield token
except RateLimitError:
    st.warning("请求过于频繁，请稍后再试")
except TimeoutError:
    st.error("请求超时，请检查网络连接")
except Exception:
    st.error("发生未知错误，请重试")
```

---

## 五、可扩展性方向

### 5.1 多模态扩展

DeepSeek 支持图片输入，扩展输入处理：
```python
def handle_multimodal_input(user_input: str, uploaded_file=None):
    messages = [...]
    if uploaded_file:
        import base64
        image_data = base64.b64encode(uploaded_file.read()).decode()
        messages[-1]["content"] = [
            {"type": "text", "text": user_input},
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}
            }
        ]
```

### 5.2 多 Agent 路由

当应用复杂度提升时，可以设计 Agent 路由层：
```python
def route_to_agent(user_message: str) -> str:
    """根据用户意图路由到不同 Agent"""
    intent = classify_intent(user_message)  # 调用轻量模型分类
    return {
        "code": code_agent,
        "writing": writing_agent,
        "default": general_agent,
    }.get(intent, general_agent)
```

### 5.3 会话持久化（Supabase）

```python
# 保存到 Supabase
from supabase import create_client

def save_message(session_id: str, role: str, content: str):
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    supabase.table("messages").insert({
        "session_id": session_id,
        "role": role,
        "content": content
    }).execute()
```

---

## 六、运行方式

```bash
streamlit run app.py --server.port 8501
```

开发热重载：Streamlit 默认开启，修改代码后页面自动刷新。

![应用界面](https://www.coze.site/snapshots/20250612162300.png)
