# 用 Streamlit 快速搭建一个 AI 智能伴侣项目

> 适合对象：有一定 Python 基础的开发者。全文基于 Streamlit + DeepSeek v4-flash，带你从零构建一个完整的 AI 对话应用。

---

## 一、前置知识与工具选型

### 1.1 核心工具选型

**Streamlit**：Python 原生 Web 框架，以极低的代码量著称。相比 Flask/FastAPI，Streamlit 绕过了前端开发的整套技术栈——你不需要写 HTML/CSS/JS，只需要 Python 就能完成一个完整的 Web 界面。适合快速原型和内部工具。

**DeepSeek v4-flash**：DeepSeek 最新的快速对话模型，延迟低、上下文支持 128K 窗口、中文效果好。DeepSeek API 兼容 OpenAI 格式，使用成本低，开发者友好。

两者组合的优势：**开发效率极高 + 成本可控**，非常适合个人项目和小团队产品原型。

### 1.2 技术栈概览

```
Streamlit（前端界面）
    ↓
OpenAI SDK（调用层，DeepSeek 兼容）
    ↓
DeepSeek API（模型服务）
```

---

## 二、开发环境准备

### 2.1 IDE：推荐 Trae IDE

Trae IDE 内置 AI 能力，支持智能补全，适合快速开发。也可以使用 PyCharm、VS Code 等主流 IDE。

下载地址：https://trae.ai/

![Trae IDE 下载页面](https://www.coze.site/snapshots/20250612162725.png)

### 2.2 Python 环境

确保本地安装了 Python 3.10+：

```bash
python --version
```

### 2.3 安装依赖

```bash
pip install streamlit openai
```

验证安装：
```bash
streamlit --version
```

### 2.4 项目初始化

```bash
mkdir ai-companion && cd ai-companion
touch app.py
```

---

## 三、页面开发

### 3.1 页面配置

`st.set_page_config` 必须放在脚本第一行，用于配置页面的基本信息。

```python
import streamlit as st

st.set_page_config(
    page_title="AI 智能伴侣",
    page_icon="🤖",
    layout="centered"
)
```

- `layout` 可选 `centered`（居中，窄宽度）或 `wide`（全宽）
- `page_icon` 支持 emoji 或本地图片路径

### 3.2 页面标题与输入框

```python
st.title("🤖 AI 智能伴侣")
st.markdown("基于 **DeepSeek v4-flash** 的轻量对话助手")

user_input = st.text_input(
    label="你的问题",
    placeholder="输入任意问题...",
)
```

### 3.3 调用 DeepSeek API

#### API Key 管理

**生产环境必须使用环境变量**，不要硬编码 Key：

```python
import os

# 从环境变量读取，第二个参数为默认值（仅本地开发用）
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
if not DEEPSEEK_API_KEY:
    st.error("请设置 DEEPSEEK_API_KEY 环境变量")
    st.stop()
```

设置环境变量的方式：
```bash
# Linux/macOS
export DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxx"

# Windows PowerShell
$env:DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxx"
```

> **提示**：也可以在项目根目录创建 `.env` 文件，使用 `python-dotenv` 加载，但记得把 `.env` 加入 `.gitignore`。

#### 创建客户端

```python
from openai import OpenAI

client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com"   # DeepSeek 兼容 OpenAI API
)
```

DeepSeek 常用模型：

| 模型 | 适用场景 | 特点 |
|------|----------|------|
| `deepseek-chat` | 对话应用 | 通用对话，支持 128K 上下文 |
| `deepseek-coder` | 代码相关 | 擅长编程任务 |

#### System Prompt 设计

System Prompt 决定了 AI 的角色定位和行为风格，建议根据实际场景精心设计：

```python
SYSTEM_PROMPT = """你是一个专业、简洁的 AI 助手。
回答原则：
- 直接回答问题，不废话
- 复杂问题分点说明
- 不确定的问题明确告知"""
```

### 3.4 会话状态管理

Streamlit 的 `st.session_state` 是实现对话记忆的关键。它在整个会话生命周期内保持状态。

```python
# 初始化消息列表
if "messages" not in st.session_state:
    st.session_state.messages = []

# 渲染历史消息
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# 用户提交后，保存用户消息并显示
if user_input:
    with st.chat_message("user"):
        st.markdown(user_input)
    st.session_state.messages.append({"role": "user", "content": user_input})
```

构建发送给 API 的消息历史时，注意 system prompt 的位置和列表拼接方式：

```python
# 构建完整的消息列表（system + history）
messages_for_api = [{"role": "system", "content": SYSTEM_PROMPT}]
messages_for_api += [
    {"role": msg["role"], "content": msg["content"]}
    for msg in st.session_state.messages
]
# 最后一轮用户消息已在上方 append，这里直接调用
```

> **注意**：这里使用列表推导式 + `+=` 解包，与 `[*history, new_msg]` 解包写法效果相同。

### 3.5 流式输出

流式输出（Streaming）是提升用户体验的关键——用户在 AI 回复过程中就能看到内容逐字出现，而非等待数秒后一次性显示。

```python
# 开启 stream=True
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages_for_api,
    stream=True
)

# 使用 st.empty() 创建动态容器
reply_container = st.empty()
full_reply = ""

with st.chat_message("assistant"):
    for chunk in stream:
        if chunk.choices[0].delta.content:
            full_reply += chunk.choices[0].delta.content
            reply_container.markdown(full_reply + "▌")
    reply_container.markdown(full_reply)  # 去掉光标

    # 保存 AI 回复到会话状态
    st.session_state.messages.append({"role": "assistant", "content": full_reply})
```

**核心参数说明**：

| 参数 | 含义 | 建议值 |
|------|------|--------|
| `stream=True` | 开启流式输出 | 必须开启 |
| `max_tokens` | 最大生成 token 数 | 1000-2000 |
| `temperature` | 创造性/确定性 | 0.7（日常对话） |

---

## 四、完整代码

```python
import streamlit as st
from openai import OpenAI
import os

# ========== 1. 页面配置 ==========
st.set_page_config(
    page_title="AI 智能伴侣",
    page_icon="🤖",
    layout="centered"
)

# ========== 2. 初始化 ==========
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
if not DEEPSEEK_API_KEY:
    st.error("请设置 DEEPSEEK_API_KEY 环境变量")
    st.stop()

client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com"
)

SYSTEM_PROMPT = """你是一个专业、简洁的 AI 助手。
- 直接回答，不废话
- 复杂问题分点说明
- 不确定的问题明确告知"""

# ========== 3. 会话状态 ==========
if "messages" not in st.session_state:
    st.session_state.messages = []

# ========== 4. UI ==========
st.title("🤖 AI 智能伴侣")
st.markdown("基于 **DeepSeek v4-flash** 的轻量对话助手")
st.divider()

# 渲染历史
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# ========== 5. 输入 & 调用 ==========
user_input = st.chat_input(placeholder="输入你的问题...")

if user_input:
    # 保存并显示用户消息
    with st.chat_message("user"):
        st.markdown(user_input)
    st.session_state.messages.append({"role": "user", "content": user_input})

    # 构建 API 消息列表
    messages_for_api = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages_for_api += [
        {"role": msg["role"], "content": msg["content"]}
        for msg in st.session_state.messages
    ]

    # 流式调用 AI
    with st.chat_message("assistant"):
        reply_container = st.empty()
        full_reply = ""
        try:
            stream = client.chat.completions.create(
                model="deepseek-chat",
                messages=messages_for_api,
                stream=True
            )
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    full_reply += chunk.choices[0].delta.content
                    reply_container.markdown(full_reply + "▌")
            reply_container.markdown(full_reply)
        except Exception as e:
            reply_container.error(f"请求失败：{e}")
            full_reply = ""

    # 保存 AI 回复
    if full_reply:
        st.session_state.messages.append({"role": "assistant", "content": full_reply})
```

---

## 五、运行与部署

### 5.1 本地运行

```bash
streamlit run app.py
```

浏览器会自动打开，默认地址：`http://localhost:8501`

### 5.2 效果预览

![应用界面](https://www.coze.site/snapshots/20250612162300.png)

### 5.3 实用 Tips

**环境变量持久化**：在项目根目录创建 `.env` 文件：
```
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
```
配合 `python-dotenv` 使用：
```bash
pip install python-dotenv
```

```python
from dotenv import load_dotenv
load_dotenv()  # 在 app.py 顶部调用
```

**多角色切换**：可以扩展 `session_state`，保存当前选中的角色 prompt：
```python
if "current_role" not in st.session_state:
    st.session_state.current_role = "assistant"
```

**异常处理**：生产环境务必捕获 API 异常，包括网络超时、API 限流（429）、Key 失效（401）等。

### 5.4 部署选项

| 方案 | 成本 | 适用场景 |
|------|------|----------|
| Streamlit Community Cloud | 免费 | 个人项目、开源项目 |
| 阿里云/腾讯云 ECS | 低 | 需要自定义域名 |
| Docker 容器化部署 | 中 | 有 DevOps 能力 |

---

## 六、常见问题

**Q：提示 `streamlit: command not found`**
A：`pip install streamlit` 未成功执行，或需要刷新终端环境。

**Q：`Invalid API Key` 错误**
A：确认 Key 正确且有效，检查是否达到 DeepSeek 免费额度上限。

**Q：流式输出不稳定，有时中断**
A：可能是网络问题或 `max_tokens` 设置过低，适当调整参数。

**Q：如何清除对话历史？**
A：添加一个按钮，清空 `session_state.messages`：
```python
if st.button("🗑️ 清空对话"):
    st.session_state.messages = []
    st.rerun()
```
