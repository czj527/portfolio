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
# ============================================================
# 第 1 步：导入 Streamlit 库
# ============================================================
import streamlit as st
from openai import OpenAI  # 导入 OpenAI 库，用来调用 AI 模型

# ============================================================
# 第 2 步：设置页面基本信息
# ============================================================
st.set_page_config(
    page_title="我的 AI 伴侣",      # 浏览器标签页上显示的标题
    page_icon="🤖",                 # 浏览器标签页上的小图标
    layout="centered"               # 页面布局："centered"(居中) 或 "wide"(全宽)
)

# ============================================================
# 第 3 步：设置 AI 的"角色设定"
# ============================================================
system_prompt = """你是一个友善、热情的 AI 助手。
你的风格：
1. 用轻松友好的语气和用户聊天
2. 回答问题耐心详细，不懂就诚实说
3. 偶尔可以开玩笑，让对话更有趣"""

# ============================================================
# 第 4 步：初始化"会话状态"（让 AI 能记住对话）
# ============================================================
if "messages" not in st.session_state:
    st.session_state.messages = []  # 创建了一个空列表，用来存放对话记录

# ============================================================
# 第 5 步：显示页面标题
# ============================================================
st.title("🤖 我的 AI 伴侣")
st.markdown("—— 基于 DeepSeek v4-flash 构建的智能对话助手")
st.divider()

# ============================================================
# 第 6 步：显示历史对话
# ============================================================
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# ============================================================
# 第 7 步：获取用户输入
# ============================================================
user_input = st.chat_input(placeholder="请输入你的问题...")

# ============================================================
# 第 8 步：如果用户输入了内容，就处理对话
# ============================================================
if user_input:
    # 显示用户的消息
    with st.chat_message("user"):
        st.markdown(user_input)
    
    # 保存用户消息
    st.session_state.messages.append({"role": "user", "content": user_input})
    
    # 准备发送给 AI 的消息列表
    messages_for_api = [{"role": "system", "content": system_prompt}]
    for msg in st.session_state.messages:
        messages_for_api.append({"role": msg["role"], "content": msg["content"]})
    
    # 调用 AI
    client = OpenAI(
        api_key="your-api-key-here",  # ← 替换为你的 API Key
        base_url="https://api.deepseek.com"
    )
    
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
            reply_container.error(f"出错了：{e}")
            full_reply = ""

    # 保存 AI 回复
    if full_reply:
        st.session_state.messages.append({"role": "assistant", "content": full_reply})
\`\`\`

### 3.3 运行效果截图

![应用界面](/blog/streamlit-ai-companion/initial-page.png)

![对话效果](/blog/streamlit-ai-companion/chat-demo.png)

---

## 第四章：完整代码（可复制直接运行）

\`\`\`python
# ============================================================
# AI 智能伴侣 - 零基础版
# 完整可运行代码，直接复制到 app.py 即可使用
# ============================================================

import streamlit as st
from openai import OpenAI

# ============================================================
# 第 1 步：页面配置（必须放在最前面）
# ============================================================
st.set_page_config(
    page_title="我的 AI 伴侣",
    page_icon="🤖",
    layout="centered"
)

# ============================================================
# 第 2 步：AI 角色设定
# ============================================================
system_prompt = """你是一个友善、热情的 AI 助手。
你的风格：
1. 用轻松友好的语气和用户聊天
2. 回答问题耐心详细，不懂就诚实说
3. 偶尔可以开玩笑，让对话更有趣"""

# ============================================================
# 第 3 步：初始化会话状态
# ============================================================
if "messages" not in st.session_state:
    st.session_state.messages = []

# ============================================================
# 第 4 步：页面 UI
# ============================================================
st.title("🤖 我的 AI 伴侣")
st.markdown("—— 基于 DeepSeek v4-flash 构建的智能对话助手")
st.divider()

# 显示历史消息
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# ============================================================
# 第 5 步：输入框 & AI 对话
# ============================================================
user_input = st.chat_input(placeholder="请输入你的问题...")

if user_input:
    # 显示并保存用户消息
    with st.chat_message("user"):
        st.markdown(user_input)
    st.session_state.messages.append({"role": "user", "content": user_input})

    # 准备发送给 API 的消息列表
    messages_for_api = [{"role": "system", "content": system_prompt}]
    for msg in st.session_state.messages:
        messages_for_api.append({"role": msg["role"], "content": msg["content"]})

    # 创建 AI 客户端（替换为你的 API Key）
    client = OpenAI(
        api_key="your-api-key-here",  # ← 替换为你的 DeepSeek API Key
        base_url="https://api.deepseek.com"
    )

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
            reply_container.error(f"出错了：{e}")
            full_reply = ""

    # 保存 AI 回复
    if full_reply:
        st.session_state.messages.append({"role": "assistant", "content": full_reply})
\`\`\`

> **如何使用**：把上面的代码完整复制到 \`app.py\` 文件中，**把 \`your-api-key-here\` 替换成你从 DeepSeek 获得的 API Key**，然后运行 \`streamlit run app.py\` 即可！

---

## 第五章：运行你的应用

### 5.1 启动应用

在终端中，进入项目文件夹，然后运行：

\`\`\`bash
streamlit run app.py
\`\`\`

几秒钟后，浏览器会自动打开，你就能看到自己的 AI 对话应用了！

### 5.2 修改代码后刷新

修改 \`app.py\` 的代码后，页面会自动刷新，不需要重启服务。

> **小技巧**：如果页面没有自动刷新，可以按 \`Ctrl + R\`（或 \`Cmd + R\`）手动刷新。

---

## 第六章：常见问题 & 踩坑提醒

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
1. 确认代码中的 API Key 已替换为你的真实 Key
2. 检查网络连接
3. 查看终端里的错误日志

### Q4：如何停止运行？
**方法**：在终端按 \`Ctrl + C\`

---

## 第七章：后续计划 🚀

> 恭喜你完成了第一个版本！🎉 这只是一个开始，接下来我们还会继续升级这个应用。

### 7.1 添加对话侧边栏

**目标**：支持在不同对话之间切换，就像微信可以创建多个聊天窗口一样。

**功能预览**：
- 在页面左侧添加一个侧边栏
- 显示所有历史对话列表
- 点击可以切换到不同的对话
- 支持创建新的对话

**为什么需要**：目前每次打开页面都会重新开始，无法查看之前的对话。加了侧边栏就能像真正的聊天软件一样，随时切换到任何一个历史对话。

### 7.2 会话管理

**目标**：创建、切换、删除对话，全部都能自己控制。

**功能预览**：
- 点击"新建对话"按钮开始一个新话题
- 给对话起个名字，方便识别
- 删除不需要的对话
- 切换对话时自动保存当前位置

**为什么需要**：想象你用 AI 学习编程、聊天解闷、写作辅助——这些是不同的场景，放在一个对话里会乱。会话管理让你可以井井有条地处理各种需求。

### 7.3 会话持久化存储

**目标**：把对话记录保存到文件里，下次打开应用可以恢复。

**功能预览**：
- 对话数据保存为 JSON 文件
- 重新打开应用自动加载历史记录
- 不再担心刷新页面丢失对话

**技术思路**（先剧透一下）：
- 用 Python 的 \`json\` 模块读写文件
- 每个对话保存为一个 \`.json\` 文件
- 文件名可以用时间戳或对话标题命名

> **预告**：下一期教程我们就会实现这些功能！敬请期待~

---

## 结语

恭喜你！🎉 你已经成功搭建了一个功能完整的 AI 对话应用！

这个应用目前运行在你的本地电脑上。如果想让它可以被更多人访问，你需要把它部署到云服务器上。关于部署的话题我们以后再聊。

**你学到了什么**：
- Streamlit 的基本用法
- 如何调用 DeepSeek API
- 会话状态管理（AI 的"记忆"）
- 流式输出的原理

**这只是开始**！我们的 AI 智能伴侣还会继续进化：
- 会话管理（多个对话随时切换）
- 历史记录保存（刷新也不丢）
- 更多有趣的 AI 能力

继续探索，你还可以为它添加：语音输入、图片识别、更多对话角色设定……可能性是无穷的！`,
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
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "your-api-key-here")
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

### 3.6 运行效果截图

![应用界面](/blog/streamlit-ai-companion/initial-page.png)

![对话效果](/blog/streamlit-ai-companion/chat-demo.png)

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
# 从环境变量读取 API Key（生产环境必须使用）
# 开发测试时可以直接填入你的 Key
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "your-api-key-here")
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

> **如何使用**：把上面的代码复制到 \`app.py\`，将 \`your-api-key-here\` 替换为你的 DeepSeek API Key，然后运行 \`streamlit run app.py\`

---

## 五、运行与部署

### 5.1 本地运行

\`\`\`bash
streamlit run app.py
\`\`\`

浏览器会自动打开，默认地址：\`http://localhost:8501\`

### 5.2 实用 Tips

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

### 5.3 部署选项

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

---

## 七、后续计划 🚀

> 这只是 MVP 版本！我们的 AI 智能伴侣还有很大的进化空间。

### 7.1 对话侧边栏

**目标**：实现多会话管理，支持在不同对话之间切换。

**实现思路**：
- 使用 \`st.sidebar\` 创建侧边栏区域
- 在侧边栏显示会话列表
- 点击切换当前活跃会话
- 添加"新建会话"按钮

**技术要点**：
\`\`\`python
# 侧边栏基础结构
with st.sidebar:
    st.title("会话列表")
    if st.button("➕ 新建对话"):
        # 创建新会话
        pass
    # 遍历显示历史会话
    for session in sessions:
        if st.button(session["title"]):
            # 切换到该会话
            pass
\`\`\`

### 7.2 会话管理

**目标**：完整的 CRUD 操作——创建、读取、更新、删除会话。

**功能清单**：
- 新建对话（自动生成时间戳标题）
- 重命名对话
- 删除对话（带确认提示）
- 切换对话（保留当前位置）

**状态管理扩展**：
\`\`\`python
# 扩展 session_state 结构
if "sessions" not in st.session_state:
    st.session_state.sessions = [{"id": "default", "title": "默认对话", "messages": []}]

if "current_session_id" not in st.session_state:
    st.session_state.current_session_id = "default"
\`\`\`

### 7.3 会话持久化

**目标**：将会话数据保存到本地文件，实现真正的数据持久化。

**实现方案**：
- 使用 JSON 文件存储会话数据
- 每个会话保存为独立文件：\`sessions/{session_id}.json\`
- 启动时自动加载历史会话
- 每次对话后自动保存

**核心代码思路**：
\`\`\`python
import json
import os
from datetime import datetime

SESSIONS_DIR = "sessions"

def save_session(session_id: str, messages: list):
    """保存会话到 JSON 文件"""
    os.makedirs(SESSIONS_DIR, exist_ok=True)
    filepath = os.path.join(SESSIONS_DIR, f"{session_id}.json")
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump({"messages": messages, "updated_at": datetime.now().isoformat()}, f, ensure_ascii=False, indent=2)

def load_sessions() -> dict:
    """从文件加载所有会话"""
    sessions = {}
    if os.path.exists(SESSIONS_DIR):
        for filename in os.listdir(SESSIONS_DIR):
            if filename.endswith(".json"):
                session_id = filename[:-5]
                filepath = os.path.join(SESSIONS_DIR, session_id + ".json")
                with open(filepath, "r", encoding="utf-8") as f:
                    sessions[session_id] = json.load(f)
    return sessions
\`\`\`

**数据格式示例**：
\`\`\`json
{
  "id": "20250607-143022",
  "title": "Python 编程问题",
  "messages": [
    {"role": "user", "content": "如何理解 Python 的装饰器？"},
    {"role": "assistant", "content": "装饰器是 Python 的一个强大特性..."}
  ],
  "created_at": "2026-06-07T14:30:22",
  "updated_at": "2026-06-07T14:32:15"
}
\`\`\`

> **预告**：下一期教程我们将实现完整的会话管理系统，敬请期待！

---

## 八、结语

恭喜你完成了基础版 AI 对话应用的搭建！🎉

**已掌握的技能**：
- Streamlit 页面配置与组件使用
- OpenAI SDK 调用 DeepSeek API
- \`st.session_state\` 会话状态管理
- 流式输出的实现原理

**下一步探索方向**：
- 多会话侧边栏（即将推出）
- 会话持久化存储
- 语音输入/图片识别
- 自定义 AI 角色

继续加油，AI 应用开发的世界很精彩！`,
} as const;

export type BlogVersion = keyof typeof BLOG_CONTENT;
