# 用 Streamlit 快速搭建一个 AI 智能伴侣项目

> **阅读说明**：这是一篇面向**零基础读者**的教程。我们会从最最基础的概念讲起，每一步都会解释"这是什么"和"为什么这样做"。不要担心，跟着做就能学会！

---

## 第一章：前置知识——我们在做什么

### 1.1 先认识一下我们的"积木"

在开始搭建之前，先让我们认识一下要用到的三个核心工具：

#### Python 是什么？

**Python** 是一种**编程语言**——你可以把它理解为一种"和电脑说话的方式"。它最大的特点是**简单易学、代码读起来像英语**，非常适合用来快速实现想法。

打个比方：如果写代码像盖房子，Python 就是一种用很少材料就能搭出漂亮房子的建筑方式。

#### pip 是什么？

**pip** 是 Python 的"应用商店"。当你想要使用别人写好的工具（比如 Streamlit）时，只需要用 pip 下载安装，Python 就能使用这些工具了。

安装命令格式：
```bash
pip install 工具名称
```

#### Streamlit 是什么？

**Streamlit** 是一个专门用来快速创建**数据可视化网页应用**的 Python 工具。它的厉害之处在于：你只需要写普通的 Python 代码，不需要懂 HTML、CSS、JavaScript，就能做出漂亮的网页界面。

打个比方：Streamlit 就像乐高积木里的"基础板"，你只需要把各种积木（按钮、输入框、文字、图片）往上插，一个网页应用就出来了。

#### DeepSeek 是什么？

**DeepSeek** 是一个国产的大语言模型（LLM）服务商，类似于 OpenAI 的 GPT。v4-flash 是它的一个快速版本，适合日常对话和轻量级应用。

### 1.2 为什么要选这个组合？

| 工具 | 优点 | 适合场景 |
|------|------|----------|
| **Streamlit** | 零前端基础可用、代码量极少 | 快速原型、个人项目 |
| **DeepSeek v4-flash** | 速度快、价格便宜、中文好 | AI 对话应用 |

> **开发小提示**：Streamlit + DeepSeek 是目前个人开发者快速搭建 AI 应用的最佳组合之一。开发效率高，成本低！

---

## 第二章：开发工具准备

### 2.1 下载安装 Trae IDE

**Trae IDE** 是一款免费的智能开发工具，内置 AI 能力，适合初学者使用。

**下载地址**：https://trae.ai/

安装步骤：
1. 访问官网，点击"下载"按钮
2. 下载对应系统的版本（Windows / macOS / Linux）
3. 双击安装包，按照提示完成安装
4. 打开 Trae IDE，创建一个新项目

![Trae IDE 下载页面](https://www.coze.site/snapshots/20250612162725.png)

### 2.2 安装 Python

Trae IDE 需要本地有 Python 环境。

**下载地址**：https://www.python.org/downloads/

安装步骤：
1. 下载最新版本的 Python 3.10+
2. 安装时**务必勾选**"Add Python to PATH"（添加到环境变量）
3. 验证安装：打开终端，输入以下命令：
```bash
python --version
```

如果看到类似 `Python 3.12.3` 的版本号，说明安装成功 ✅

### 2.3 创建项目文件夹

建议把项目放在一个固定的文件夹里，方便管理：

```bash
# 创建一个项目文件夹
mkdir ai-companion

# 进入这个文件夹
cd ai-companion
```

### 2.4 安装 Streamlit 和 OpenAI 工具包

打开终端，在项目文件夹下运行：

```bash
# 安装 streamlit 和 openai（DeepSeek 兼容 OpenAI 的 API 格式）
pip install streamlit openai
```

> **常见问题**：如果提示 `pip` 命令找不到，请确认 Python 安装时勾选了"Add Python to PATH"，或者重启终端。

安装完成后，验证一下：
```bash
streamlit --version
```

看到版本号就说明安装成功了 ✅

---

## 第三章：页面开发——一步步搭出 AI 对话应用

> 从这里开始，我们就要写代码了！不要害怕，代码没有想象中那么复杂，跟着做就好。

### 3.1 创建 Python 文件

在项目文件夹里，创建一个新文件：`app.py`

在 Trae IDE 中：
1. 点击"新建文件"按钮
2. 命名为 `app.py`
3. 开始编写代码

### 3.2 页面配置（必须放在第一行）

```python
# 导入 streamlit 库，简写为 st，方便后续使用
import streamlit as st

# 设置页面的基本信息
st.set_page_config(
    page_title="我的 AI 伴侣",      # 浏览器标签页上显示的标题
    page_icon="🤖",                 # 浏览器标签页上的小图标
    layout="centered"               # 页面布局："centered"(居中) 或 "wide"(全宽)
)
```

#### 这里发生了什么？

- `import streamlit as st`：告诉 Python"我要使用 Streamlit 这个工具"，并给它起个简短的名字 `st`
- `st.set_page_config()`：这是 Streamlit 的**页面配置函数**，必须放在脚本最前面
  - `page_title`：网页标签页上显示的文字
  - `page_icon`：网页标签页上显示的表情或图标
  - `layout`：决定页面内容的宽度

### 3.3 页面标题 + 输入框

```python
# 在页面上显示一个一级大标题
st.title("🤖 我的 AI 伴侣")

# 在标题下方显示一行提示文字
st.markdown("—— 基于 DeepSeek v4-flash 构建的智能对话助手")

# 创建一个文本输入框，供用户输入问题
# user_input 是用户输入的内容
user_input = st.text_input(
    label="请输入你的问题：",       # 输入框前的标签文字
    placeholder="比如：今天天气怎么样？",  # 空时显示的占位文字
)
```

#### 这里发生了什么？

- `st.title()`：显示页面主标题
- `st.markdown()`：显示带格式的文字（Markdown 格式）
- `st.text_input()`：创建一个输入框，**用户输入的内容会保存在 `user_input` 变量里**

### 3.4 调用大模型——让 AI 真正"思考"

#### 3.4.1 设置 API Key

**API Key** 是什么？

> API Key 就像是一张"身份证"——当你使用 DeepSeek 的服务时，需要用 API Key 来证明"我是一个合法用户"。每个用户都有自己独特的 Key，不能和别人共用。

DeepSeek API Key 的获取方式：
1. 访问 https://platform.deepseek.com/
2. 注册并登录账号
3. 在控制台找到"API Keys"，点击创建
4. 复制生成的 Key（以 `sk-` 开头）

> **重要提醒**：API Key 非常重要，就像你的账号密码一样！不要分享给他人，不要直接写在代码里（生产环境应该用环境变量）。

```python
# 从环境变量读取 API Key
import os

# 这里填入你的 DeepSeek API Key（开发测试用）
# 格式：os.getenv("DEEPSEEK_API_KEY", "你的Key")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "sk-xxxxxxxxxxxxxxxx")
```

#### 3.4.2 创建 AI 客户端

```python
from openai import OpenAI

# 创建一个客户端，用于和 DeepSeek 通信
# DeepSeek 的 API 兼容 OpenAI 格式，所以可以直接用 OpenAI 客户端
client = OpenAI(
    api_key=DEEPSEEK_API_KEY,                          # 填入你的 API Key
    base_url="https://api.deepseek.com"                # DeepSeek 的 API 地址
)
```

#### 3.4.3 设置系统提示词（System Prompt）

**System Prompt** 是什么？

> System Prompt 就像是给 AI 设定一个"角色"或"行为准则"。你可以告诉 AI："你是一个乐于助人的助手"、"你是一个幽默的朋友"等等。

```python
# 定义 AI 的角色设定
SYSTEM_PROMPT = """你是一个友善、热情的 AI 助手。
你的目标是：
1. 准确回答用户的问题
2. 用简单易懂的语言解释复杂概念
3. 如果不确定，就诚实告诉用户
"""
```

#### 3.4.4 发送请求并获取回复

```python
# 当用户点击按钮或按下回车时，发送请求
if user_input:
    # 显示一个"思考中"的气泡，模拟打字效果
    with st.spinner("🤔 AI 正在思考中..."):
        response = client.chat.completions.create(
            model="deepseek-chat",          # 使用 DeepSeek 的对话模型
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},  # 系统设定
                {"role": "user", "content": user_input},       # 用户的问题
            ],
            max_tokens=1000,                # 回复最大字数（token 是文字的计量单位）
            temperature=0.7,               # 创造性程度：0~1，越高越有创意
        )
    
    # 从回复中提取 AI 的回答
    answer = response.choices[0].message.content
    st.chat_message("assistant").write(answer)
```

### 3.5 会话状态管理——让 AI"记住"对话

#### 什么是会话状态？

> 想象一下：你和朋友聊天，朋友需要记住你们之前聊过的内容，才能继续对话。`st.session_state` 就是 Streamlit 用来"记住"对话内容的工具。

```python
# 初始化会话状态（如果还没有这个列表，就创建一个空列表）
# st.session_state 就像一个小盒子，专门用来存放我们需要"记住"的东西
if "messages" not in st.session_state:
    st.session_state.messages = []

# 在页面上显示所有历史对话
for message in st.session_state.messages:
    # 根据消息的"角色"（是用户还是AI）决定显示在哪一边
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 把用户刚才输入的内容，添加到对话历史中
if user_input:
    # 先显示用户的消息（在右侧）
    with st.chat_message("user"):
        st.markdown(user_input)
    
    # 把用户消息存入"记忆盒"
    st.session_state.messages.append({
        "role": "user",
        "content": user_input
    })
```

#### 发送消息时，让 AI"看到"完整的对话历史

```python
# 调用 AI 时，把整个对话历史都传过去
messages_for_api = [{"role": "system", "content": SYSTEM_PROMPT}]
messages_for_api += [
    {"role": msg["role"], "content": msg["content"]}
    for msg in st.session_state.messages    # 用*解包*的方式，把历史消息逐条加入
]
messages_for_api.append({"role": "user", "content": user_input})
```

> **什么是解包（`*`）？**
> 想象你有一盒水果（`st.session_state.messages`），`*` 的作用是把盒子里所有水果一个个拿出来，放在桌子上。这就是"解包"。

### 3.6 流式输出——让回复"一个字一个字"地出现

#### 什么是流式输出？

> 普通的方式是等 AI **全部回答完**再一次性显示。流式输出则是 AI 说一个字我们就显示一个字，就像有人在实时打字一样，体验更好！

```python
# 用 stream=True 开启流式输出
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages_for_api,
    stream=True                    # 开启流式输出模式
)

# 创建一个"空容器"，用于动态显示 AI 的回复
reply_container = st.empty()

# 逐步接收并显示 AI 的回复
full_reply = ""                    # 初始化一个空字符串，用来累积回复
for chunk in stream:               # 遍历每一个"回复片段"
    if chunk.choices[0].delta.content:
        # 累积新的文字
        full_reply += chunk.choices[0].delta.content
        # 把累积的内容显示在空容器中（实现实时打字效果）
        reply_container.markdown(full_reply + "▌")

# 回复完成后，去掉最后的光标
reply_container.markdown(full_reply)

# 把 AI 的回复也存入"记忆盒"，这样下次对话时 AI 就能记住了
st.session_state.messages.append({
    "role": "assistant",
    "content": full_reply
})
```

#### 这里发生了什么？

- `st.empty()`：创建一个空的"容器"，之后可以往里面放内容
- `stream=True`：告诉 API"我要流式接收回复"
- `for chunk in stream`：一个一个地接收回复片段
- `full_reply += ...`：把每个片段的文字加到完整回复里
- `"▌"`：在末尾加一个闪烁的光标字符，模拟打字效果

---

## 第四章：完整代码

把所有代码整合在一起，这就是我们的完整应用：

```python
import streamlit as st
from openai import OpenAI
import os

# ==================== 1. 页面配置 ====================
st.set_page_config(
    page_title="我的 AI 伴侣",
    page_icon="🤖",
    layout="centered"
)

# ==================== 2. 初始化设置 ====================
# 从环境变量读取 API Key（安全做法）
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "sk-your-key-here")
client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com")

SYSTEM_PROMPT = """你是一个友善、热情的 AI 助手。
你的目标是：
1. 准确回答用户的问题
2. 用简单易懂的语言解释复杂概念
3. 如果不确定，就诚实告诉用户"""

# ==================== 3. 初始化会话状态 ====================
if "messages" not in st.session_state:
    st.session_state.messages = []

# ==================== 4. 页面 UI ====================
st.title("🤖 我的 AI 伴侣")
st.markdown("—— 基于 DeepSeek v4-flash 构建的智能对话助手")
st.divider()

# ==================== 5. 显示历史消息 ====================
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# ==================== 6. 输入框 & 发送请求 ====================
user_input = st.chat_input(placeholder="请输入你的问题...")

if user_input:
    # ① 显示用户消息
    with st.chat_message("user"):
        st.markdown(user_input)
    st.session_state.messages.append({"role": "user", "content": user_input})

    # ② 构建消息历史
    messages_for_api = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages_for_api += [
        {"role": msg["role"], "content": msg["content"]}
        for msg in st.session_state.messages
    ]

    # ③ 流式调用 AI
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
            reply_container.error(f"出错了：{e}")
            full_reply = ""

    # ④ 保存 AI 回复
    if full_reply:
        st.session_state.messages.append({"role": "assistant", "content": full_reply})
```

---

## 第五章：运行你的应用

### 5.1 启动应用

在终端中，进入项目文件夹，然后运行：

```bash
streamlit run app.py
```

几秒钟后，浏览器会自动打开，你就能看到自己的 AI 对话应用了！

### 5.2 效果预览

![应用界面](https://www.coze.site/snapshots/20250612162300.png)

### 5.3 修改代码后刷新

修改 `app.py` 的代码后，页面会自动刷新，不需要重启服务。

> **小技巧**：如果页面没有自动刷新，可以按 `Ctrl + R`（或 `Cmd + R`）手动刷新。

---

## 常见问题 & 踩坑提醒

### Q1：运行 `streamlit run app.py` 报错 `command not found`
**原因**：pip 安装 Streamlit 时出错，或者 Python 环境变量没有配置好。

**解决方法**：
```bash
# 重新安装 streamlit
pip install streamlit
```

### Q2：API Key 报错 `Invalid API Key`
**原因**：Key 填错了，或者 Key 已经失效/过期。

**解决方法**：
1. 检查 Key 是否正确复制（不要有多余空格）
2. 去 DeepSeek 平台确认 Key 状态
3. 如果是免费额度用完了，需要充值或等待次月刷新

### Q3：页面能打开，但 AI 不回复
**原因**：可能是 API Key 没有正确读取，或者网络连接问题。

**解决方法**：
1. 在代码里临时直接写 Key 测试（仅开发环境）
2. 检查网络连接
3. 查看终端里的错误日志

### Q4：回复速度很慢
**原因**：可能是模型选择不对，或者网络延迟。

**解决方法**：
1. 确认使用的是 `deepseek-chat` 模型（v4-flash 版本）
2. 降低 `max_tokens` 参数
3. 尝试使用代理或更好的网络

### Q5：如何停止运行？
**方法**：在终端按 `Ctrl + C`

---

## 结语

恭喜你！🎉 你已经成功搭建了一个功能完整的 AI 对话应用！

这个应用目前运行在你的本地电脑上。如果想让它可以被更多人访问，你需要把它部署到云服务器上。关于部署的话题我们以后再聊。

**你学到了什么**：
- Streamlit 的基本用法
- 如何调用 DeepSeek API
- 会话状态管理（AI 的"记忆"）
- 流式输出的原理

继续探索，你还可以为它添加：语音输入、图片识别、更多对话角色设定……可能性是无穷的！

> **下一步**：试着给 AI 添加一个"角色切换"功能，让用户可以选择不同的对话风格吧！
