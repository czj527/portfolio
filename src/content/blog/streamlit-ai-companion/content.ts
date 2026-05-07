// Auto-generated from markdown files - DO NOT EDIT directly
// Run: python3 scripts/generate-blog-content.py to regenerate

export const BLOG_CONTENT = {
  beginner: `# 用 Streamlit 快速搭建一个 AI 智能伴侣项目

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
\`\`\`bash
pip install 工具名称
\`\`\`

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
\`\`\`bash
python --version
\`\`\`

如果看到类似 \`Python 3.12.3\` 的版本号，说明安装成功 ✅

### 2.3 创建项目文件夹

建议把项目放在一个固定的文件夹里，方便管理：

\`\`\`bash
# 创建一个项目文件夹
mkdir ai-companion

# 进入这个文件夹
cd ai-companion
\`\`\`

### 2.4 安装 Streamlit 和 OpenAI 工具包

打开终端，在项目文件夹下运行：

\`\`\`bash
# 安装 streamlit 和 openai（DeepSeek 兼容 OpenAI 的 API 格式）
pip install streamlit openai
\`\`\`

> **常见问题**：如果提示 \`pip\` 命令找不到，请确认 Python 安装时勾选了"Add Python to PATH"，或者重启终端。

安装完成后，验证一下：
\`\`\`bash
streamlit --version
\`\`\`

看到版本号就说明安装成功了 ✅

---

## 第三章：页面开发——一步步搭出 AI 对话应用

> 从这里开始，我们就要写代码了！不要害怕，代码没有想象中那么复杂，跟着做就好。

### 3.1 创建 Python 文件

在项目文件夹里，创建一个新文件：\`app.py\`

在 Trae IDE 中：
1. 点击"新建文件"按钮
2. 命名为 \`app.py\`
3. 开始编写代码

### 3.2 页面配置（必须放在第一行）

\`\`\`python
# 导入 streamlit 库，简写为 st，方便后续使用
import streamlit as st

# 设置页面的基本信息
st.set_page_config(
    page_title="我的 AI 伴侣",      # 浏览器标签页上显示的标题
    page_icon="🤖",                 # 浏览器标签页上的小图标
    layout="centered"               # 页面布局："centered"(居中) 或 "wide"(全宽)
)
\`\`\`

#### 这里发生了什么？

- \`import streamlit as st\`：告诉 Python"我要使用 Streamlit 这个工具"，并给它起个简短的名字 \`st\`
- \`st.set_page_config()\`：这是 Streamlit 的**页面配置函数**，必须放在脚本最前面
  - \`page_title\`：网页标签页上显示的文字
  - \`page_icon\`：网页标签页上显示的表情或图标
  - \`layout\`：决定页面内容的宽度

### 3.3 页面标题 + 输入框

\`\`\`python
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
\`\`\`

#### 这里发生了什么？

- \`st.title()\`：显示页面主标题
- \`st.markdown()\`：显示带格式的文字（Markdown 格式）
- \`st.text_input()\`：创建一个输入框，**用户输入的内容会保存在 \`user_input\` 变量里**

### 3.4 调用大模型——让 AI 真正"思考"

#### 3.4.1 设置 API Key

**API Key** 是什么？

> API Key 就像是一张"身份证"——当你使用 DeepSeek 的服务时，需要用 API Key 来证明"我是一个合法用户"。每个用户都有自己独特的 Key，不能和别人共用。

DeepSeek API Key 的获取方式：
1. 访问 https://platform.deepseek.com/
2. 注册并登录账号
3. 在控制台找到"API Keys"，点击创建
4. 复制生成的 Key（以 \`sk-\` 开头）

> **重要提醒**：API Key 非常重要，就像你的账号密码一样！不要分享给他人，不要直接写在代码里（生产环境应该用环境变量）。

\`\`\`python
# 从环境变量读取 API Key
import os

# 这里填入你的 DeepSeek API Key（开发测试用）
# 格式：os.getenv("DEEPSEEK_API_KEY", "你的Key")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "sk-xxxxxxxxxxxxxxxx")
\`\`\`

#### 3.4.2 创建 AI 客户端

\`\`\`python
from openai import OpenAI

# 创建一个客户端，用于和 DeepSeek 通信
# DeepSeek 的 API 兼容 OpenAI 格式，所以可以直接用 OpenAI 客户端
client = OpenAI(
    api_key=DEEPSEEK_API_KEY,                          # 填入你的 API Key
    base_url="https://api.deepseek.com"                # DeepSeek 的 API 地址
)
\`\`\`

#### 3.4.3 设置系统提示词（System Prompt）

**System Prompt** 是什么？

> System Prompt 就像是给 AI 设定一个"角色"或"行为准则"。你可以告诉 AI："你是一个乐于助人的助手"、"你是一个幽默的朋友"等等。

\`\`\`python
# 定义 AI 的角色设定
SYSTEM_PROMPT = """你是一个友善、热情的 AI 助手。
你的目标是：
1. 准确回答用户的问题
2. 用简单易懂的语言解释复杂概念
3. 如果不确定，就诚实告诉用户
"""
\`\`\`

#### 3.4.4 发送请求并获取回复

\`\`\`python
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
\`\`\`

### 3.5 会话状态管理——让 AI"记住"对话

#### 什么是会话状态？

> 想象一下：你和朋友聊天，朋友需要记住你们之前聊过的内容，才能继续对话。\`st.session_state\` 就是 Streamlit 用来"记住"对话内容的工具。

\`\`\`python
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
\`\`\`

#### 发送消息时，让 AI"看到"完整的对话历史

\`\`\`python
# 调用 AI 时，把整个对话历史都传过去
messages_for_api = [{"role": "system", "content": SYSTEM_PROMPT}]
messages_for_api += [
    {"role": msg["role"], "content": msg["content"]}
    for msg in st.session_state.messages    # 用*解包*的方式，把历史消息逐条加入
]
messages_for_api.append({"role": "user", "content": user_input})
\`\`\`

> **什么是解包（\`*\`）？**
> 想象你有一盒水果（\`st.session_state.messages\`），\`*\` 的作用是把盒子里所有水果一个个拿出来，放在桌子上。这就是"解包"。

### 3.6 流式输出——让回复"一个字一个字"地出现

#### 什么是流式输出？

> 普通的方式是等 AI **全部回答完**再一次性显示。流式输出则是 AI 说一个字我们就显示一个字，就像有人在实时打字一样，体验更好！

\`\`\`python
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
\`\`\`

#### 这里发生了什么？

- \`st.empty()\`：创建一个空的"容器"，之后可以往里面放内容
- \`stream=True\`：告诉 API"我要流式接收回复"
- \`for chunk in stream\`：一个一个地接收回复片段
- \`full_reply += ...\`：把每个片段的文字加到完整回复里
- \`"▌"\`：在末尾加一个闪烁的光标字符，模拟打字效果

---

## 第四章：完整代码

把所有代码整合在一起，这就是我们的完整应用：

\`\`\`python
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
\`\`\`

---

## 第五章：运行你的应用

### 5.1 启动应用

在终端中，进入项目文件夹，然后运行：

\`\`\`bash
streamlit run app.py
\`\`\`

几秒钟后，浏览器会自动打开，你就能看到自己的 AI 对话应用了！

### 5.2 效果预览

![应用界面](https://www.coze.site/snapshots/20250612162300.png)

### 5.3 修改代码后刷新

修改 \`app.py\` 的代码后，页面会自动刷新，不需要重启服务。

> **小技巧**：如果页面没有自动刷新，可以按 \`Ctrl + R\`（或 \`Cmd + R\`）手动刷新。

---

## 常见问题 & 踩坑提醒

### Q1：运行 \`streamlit run app.py\` 报错 \`command not found\`
**原因**：pip 安装 Streamlit 时出错，或者 Python 环境变量没有配置好。

**解决方法**：
\`\`\`bash
# 重新安装 streamlit
pip install streamlit
\`\`\`

### Q2：API Key 报错 \`Invalid API Key\`
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
1. 确认使用的是 \`deepseek-chat\` 模型（v4-flash 版本）
2. 降低 \`max_tokens\` 参数
3. 尝试使用代理或更好的网络

### Q5：如何停止运行？
**方法**：在终端按 \`Ctrl + C\`

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
`,
  intermediate: `# 用 Streamlit 快速搭建一个 AI 智能伴侣项目

> 适合对象：有一定 Python 基础的开发者。全文基于 Streamlit + DeepSeek v4-flash，带你从零构建一个完整的 AI 对话应用。

---

## 一、前置知识与工具选型

### 1.1 核心工具选型

**Streamlit**：Python 原生 Web 框架，以极低的代码量著称。相比 Flask/FastAPI，Streamlit 绕过了前端开发的整套技术栈——你不需要写 HTML/CSS/JS，只需要 Python 就能完成一个完整的 Web 界面。适合快速原型和内部工具。

**DeepSeek v4-flash**：DeepSeek 最新的快速对话模型，延迟低、上下文支持 128K 窗口、中文效果好。DeepSeek API 兼容 OpenAI 格式，使用成本低，开发者友好。

两者组合的优势：**开发效率极高 + 成本可控**，非常适合个人项目和小团队产品原型。

### 1.2 技术栈概览

\`\`\`
Streamlit（前端界面）
    ↓
OpenAI SDK（调用层，DeepSeek 兼容）
    ↓
DeepSeek API（模型服务）
\`\`\`

---

## 二、开发环境准备

### 2.1 IDE：推荐 Trae IDE

Trae IDE 内置 AI 能力，支持智能补全，适合快速开发。也可以使用 PyCharm、VS Code 等主流 IDE。

下载地址：https://trae.ai/

![Trae IDE 下载页面](https://www.coze.site/snapshots/20250612162725.png)

### 2.2 Python 环境

确保本地安装了 Python 3.10+：

\`\`\`bash
python --version
\`\`\`

### 2.3 安装依赖

\`\`\`bash
pip install streamlit openai
\`\`\`

验证安装：
\`\`\`bash
streamlit --version
\`\`\`

### 2.4 项目初始化

\`\`\`bash
mkdir ai-companion && cd ai-companion
touch app.py
\`\`\`

---

## 三、页面开发

### 3.1 页面配置

\`st.set_page_config\` 必须放在脚本第一行，用于配置页面的基本信息。

\`\`\`python
import streamlit as st

st.set_page_config(
    page_title="AI 智能伴侣",
    page_icon="🤖",
    layout="centered"
)
\`\`\`

- \`layout\` 可选 \`centered\`（居中，窄宽度）或 \`wide\`（全宽）
- \`page_icon\` 支持 emoji 或本地图片路径

### 3.2 页面标题与输入框

\`\`\`python
st.title("🤖 AI 智能伴侣")
st.markdown("基于 **DeepSeek v4-flash** 的轻量对话助手")

user_input = st.text_input(
    label="你的问题",
    placeholder="输入任意问题...",
)
\`\`\`

### 3.3 调用 DeepSeek API

#### API Key 管理

**生产环境必须使用环境变量**，不要硬编码 Key：

\`\`\`python
import os

# 从环境变量读取，第二个参数为默认值（仅本地开发用）
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
if not DEEPSEEK_API_KEY:
    st.error("请设置 DEEPSEEK_API_KEY 环境变量")
    st.stop()
\`\`\`

设置环境变量的方式：
\`\`\`bash
# Linux/macOS
export DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxx"

# Windows PowerShell
$env:DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxx"
\`\`\`

> **提示**：也可以在项目根目录创建 \`.env\` 文件，使用 \`python-dotenv\` 加载，但记得把 \`.env\` 加入 \`.gitignore\`。

#### 创建客户端

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com"   # DeepSeek 兼容 OpenAI API
)
\`\`\`

DeepSeek 常用模型：

| 模型 | 适用场景 | 特点 |
|------|----------|------|
| \`deepseek-chat\` | 对话应用 | 通用对话，支持 128K 上下文 |
| \`deepseek-coder\` | 代码相关 | 擅长编程任务 |

#### System Prompt 设计

System Prompt 决定了 AI 的角色定位和行为风格，建议根据实际场景精心设计：

\`\`\`python
SYSTEM_PROMPT = """你是一个专业、简洁的 AI 助手。
回答原则：
- 直接回答问题，不废话
- 复杂问题分点说明
- 不确定的问题明确告知"""
\`\`\`

### 3.4 会话状态管理

Streamlit 的 \`st.session_state\` 是实现对话记忆的关键。它在整个会话生命周期内保持状态。

\`\`\`python
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
\`\`\`

构建发送给 API 的消息历史时，注意 system prompt 的位置和列表拼接方式：

\`\`\`python
# 构建完整的消息列表（system + history）
messages_for_api = [{"role": "system", "content": SYSTEM_PROMPT}]
messages_for_api += [
    {"role": msg["role"], "content": msg["content"]}
    for msg in st.session_state.messages
]
# 最后一轮用户消息已在上方 append，这里直接调用
\`\`\`

> **注意**：这里使用列表推导式 + \`+=\` 解包，与 \`[*history, new_msg]\` 解包写法效果相同。

### 3.5 流式输出

流式输出（Streaming）是提升用户体验的关键——用户在 AI 回复过程中就能看到内容逐字出现，而非等待数秒后一次性显示。

\`\`\`python
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
\`\`\`

**核心参数说明**：

| 参数 | 含义 | 建议值 |
|------|------|--------|
| \`stream=True\` | 开启流式输出 | 必须开启 |
| \`max_tokens\` | 最大生成 token 数 | 1000-2000 |
| \`temperature\` | 创造性/确定性 | 0.7（日常对话） |

---

## 四、完整代码

\`\`\`python
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
\`\`\`

---

## 五、运行与部署

### 5.1 本地运行

\`\`\`bash
streamlit run app.py
\`\`\`

浏览器会自动打开，默认地址：\`http://localhost:8501\`

### 5.2 效果预览

![应用界面](https://www.coze.site/snapshots/20250612162300.png)

### 5.3 实用 Tips

**环境变量持久化**：在项目根目录创建 \`.env\` 文件：
\`\`\`
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
\`\`\`
配合 \`python-dotenv\` 使用：
\`\`\`bash
pip install python-dotenv
\`\`\`

\`\`\`python
from dotenv import load_dotenv
load_dotenv()  # 在 app.py 顶部调用
\`\`\`

**多角色切换**：可以扩展 \`session_state\`，保存当前选中的角色 prompt：
\`\`\`python
if "current_role" not in st.session_state:
    st.session_state.current_role = "assistant"
\`\`\`

**异常处理**：生产环境务必捕获 API 异常，包括网络超时、API 限流（429）、Key 失效（401）等。

### 5.4 部署选项

| 方案 | 成本 | 适用场景 |
|------|------|----------|
| Streamlit Community Cloud | 免费 | 个人项目、开源项目 |
| 阿里云/腾讯云 ECS | 低 | 需要自定义域名 |
| Docker 容器化部署 | 中 | 有 DevOps 能力 |

---

## 六、常见问题

**Q：提示 \`streamlit: command not found\`**
A：\`pip install streamlit\` 未成功执行，或需要刷新终端环境。

**Q：\`Invalid API Key\` 错误**
A：确认 Key 正确且有效，检查是否达到 DeepSeek 免费额度上限。

**Q：流式输出不稳定，有时中断**
A：可能是网络问题或 \`max_tokens\` 设置过低，适当调整参数。

**Q：如何清除对话历史？**
A：添加一个按钮，清空 \`session_state.messages\`：
\`\`\`python
if st.button("🗑️ 清空对话"):
    st.session_state.messages = []
    st.rerun()
\`\`\`
`,
  advanced: `# 用 Streamlit 快速搭建一个 AI 智能伴侣项目

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

\`\`\`
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
\`\`\`

---

## 三、核心实现

### 3.1 配置管理

\`\`\`python
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
\`\`\`

### 3.2 LLM 客户端封装

核心原则：**错误处理全面化、重试机制合理化、超时控制精确化**。

\`\`\`python
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
\`\`\`

### 3.3 会话状态管理

Streamlit 的 \`st.session_state\` 本质是 per-session 的内存存储，适用于轻量对话应用。但需注意：

- \`st.session_state\` **不是持久化存储**——用户刷新页面或关闭标签页后状态丢失
- 如果需要真正的多轮对话持久化，需要接入数据库（SQLite/PostgreSQL + Supabase）

\`\`\`python
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
\`\`\`

### 3.4 页面布局与流式输出

\`\`\`python
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
\`\`\`

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
\`\`\`bash
# 永远不要提交 .env 到版本库
echo ".env" >> .gitignore
\`\`\`

**Docker 部署**：
\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8501
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
\`\`\`

**健康检查**：Streamlit 没有内置健康检查端点，可通过 Nginx 探测 \`/health\` 路由：
\`\`\`nginx
location /health {
    return 200 'OK';
    add_header Content-Type text/plain;
}
\`\`\`

### 4.3 性能优化

**Token 消耗控制**：在 \`build_messages\` 中实现滑动窗口，超过 128K token 时截断早期消息：
\`\`\`python
def build_messages(system_prompt: str, max_context: int = 120000) -> list[dict]:
    messages = [{"role": "system", "content": system_prompt}]
    # 倒序加入历史消息，控制总 token 量
    for msg in reversed(st.session_state.messages):
        messages.insert(1, {"role": msg["role"], "content": msg["content"]})
        # 粗略估算：1 token ≈ 2 中文字符
        if sum(len(m["content"]) for m in messages) > max_context:
            messages.pop(1)  # 移除最早的非 system 消息
    return messages
\`\`\`

**连接池**：\`OpenAI\` SDK 内部维护连接池，不需要额外配置。

**缓存 Prompt 模板**：使用 \`@lru_cache\` 避免重复解析：
\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_prompt_template(role: str) -> str:
    ...
\`\`\`

### 4.4 错误处理策略

\`\`\`python
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
\`\`\`

在 UI 层优雅降级：
\`\`\`python
try:
    for token in client.chat_stream(messages):
        yield token
except RateLimitError:
    st.warning("请求过于频繁，请稍后再试")
except TimeoutError:
    st.error("请求超时，请检查网络连接")
except Exception:
    st.error("发生未知错误，请重试")
\`\`\`

---

## 五、可扩展性方向

### 5.1 多模态扩展

DeepSeek 支持图片输入，扩展输入处理：
\`\`\`python
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
\`\`\`

### 5.2 多 Agent 路由

当应用复杂度提升时，可以设计 Agent 路由层：
\`\`\`python
def route_to_agent(user_message: str) -> str:
    """根据用户意图路由到不同 Agent"""
    intent = classify_intent(user_message)  # 调用轻量模型分类
    return {
        "code": code_agent,
        "writing": writing_agent,
        "default": general_agent,
    }.get(intent, general_agent)
\`\`\`

### 5.3 会话持久化（Supabase）

\`\`\`python
# 保存到 Supabase
from supabase import create_client

def save_message(session_id: str, role: str, content: str):
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    supabase.table("messages").insert({
        "session_id": session_id,
        "role": role,
        "content": content
    }).execute()
\`\`\`

---

## 六、运行方式

\`\`\`bash
streamlit run app.py --server.port 8501
\`\`\`

开发热重载：Streamlit 默认开启，修改代码后页面自动刷新。

![应用界面](https://www.coze.site/snapshots/20250612162300.png)
`,
} as const;

export type BlogVersion = keyof typeof BLOG_CONTENT;
