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
# ============================================================
# 第 1 步：导入 Streamlit 库
# ============================================================
# import 是 Python 的"导入"命令，意思是"我要使用这个工具"
# as st 的意思是"给它起个小名，叫 st"，这样后面写起来更方便
import streamlit as st
from openai import OpenAI  # 导入 OpenAI 库，用来调用 AI 模型

# ============================================================
# 第 2 步：设置页面基本信息
# ============================================================
# st.set_page_config() 是 Streamlit 的"页面配置"函数
# 必须放在整个脚本的最最前面！
# 参数说明：
#   - page_title：浏览器标签页上显示的标题（就像网页的名字）
#   - page_icon：浏览器标签页上的小图标，可以用表情 😄
#   - layout：页面布局，"centered"表示内容居中显示
st.set_page_config(
    page_title="我的 AI 伴侣",      # 浏览器标签页上显示的标题
    page_icon="🤖",                 # 浏览器标签页上的小图标
    layout="centered"               # 页面布局："centered"(居中) 或 "wide"(全宽)
)

# ============================================================
# 第 3 步：设置 AI 的"角色设定"
# ============================================================
# system_prompt 就是给 AI 定义一个"人设"
# 告诉 AI："你是一个什么样的人，应该怎么说话"
# """ 三个引号之间可以写多行文字 """
system_prompt = """你是一个友善、热情的 AI 助手。
你的风格：
1. 用轻松友好的语气和用户聊天
2. 回答问题耐心详细，不懂就诚实说
3. 偶尔可以开玩笑，让对话更有趣"""

# ============================================================
# 第 4 步：初始化"会话状态"（让 AI 能记住对话）
# ============================================================
# st.session_state 是 Streamlit 提供的"记忆盒子"
# 我们用它来保存对话历史，这样刷新页面也不会丢失
# if "messages" not in st.session_state 的意思是：
#   "如果记忆盒子里还没有'messages'，就创建一个空盒子"
if "messages" not in st.session_state:
    st.session_state.messages = []  # 创建了一个空列表，用来存放对话记录

# ============================================================
# 第 5 步：显示页面标题
# ============================================================
# st.title() 在页面上显示一个大标题
# st.markdown() 显示带格式的文字（支持 Markdown 语法）
# st.divider() 画一条分隔线，让页面更美观
st.title("🤖 我的 AI 伴侣")
st.markdown("—— 基于 DeepSeek v4-flash 构建的智能对话助手")
st.divider()

# ============================================================
# 第 6 步：显示历史对话
# ============================================================
# for message in st.session_state.messages 的意思是：
#   "遍历记忆盒子里的每一条消息"
# for 是"循环"，in 是"在...里面"
for message in st.session_state.messages:
    # st.chat_message() 会创建一个聊天气泡
    # "user" 表示用户的消息（显示在右边）
    # "assistant" 表示 AI 的消息（显示在左边）
    with st.chat_message(message["role"]):
        # st.markdown() 显示消息内容
        st.markdown(message["content"])

# ============================================================
# 第 7 步：获取用户输入
# ============================================================
# st.chat_input() 创建一个聊天输入框
# 用户输入的内容会保存到 user_input 变量里
# placeholder 是输入框为空时显示的提示文字
user_input = st.chat_input(placeholder="请输入你的问题...")

# ============================================================
# 第 8 步：如果用户输入了内容，就处理对话
# ============================================================
if user_input:
    # -------- 第 8.1 步：显示用户的消息 --------
    # 先把用户的消息显示出来
    with st.chat_message("user"):
        st.markdown(user_input)
    
    # -------- 第 8.2 步：保存用户消息 --------
    # 把用户的消息存到"记忆盒子"里
    st.session_state.messages.append({
        "role": "user",           # "role" 表示这条消息是谁说的
        "content": user_input      # "content" 是消息的内容
    })
    
    # -------- 第 8.3 步：准备发送给 AI 的消息列表 --------
    # 我们要把整个对话历史都发给 AI，这样它才知道之前的对话内容
    # 首先放系统设定（AI 的人设）
    messages_for_api = [{"role": "system", "content": system_prompt}]
    # 然后把之前的所有对话都加进去
    for msg in st.session_state.messages:
        messages_for_api.append({"role": msg["role"], "content": msg["content"]})
    
    # -------- 第 8.4 步：调用 AI --------
    # 创建一个 AI 客户端
    # 注意：把 "your-api-key-here" 换成你从 DeepSeek 获得的 API Key！
    client = OpenAI(
        api_key="your-api-key-here",  # ← 替换为你的 API Key
        base_url="https://api.deepseek.com"  # DeepSeek 的 API 地址
    )
    
    # 显示 AI 的回复区域
    with st.chat_message("assistant"):
        # 创建一个"空容器"，用来动态显示 AI 的回复
        reply_container = st.empty()
        full_reply = ""  # 初始化一个空字符串，用来累积 AI 的回复
        
        try:
            # -------- 第 8.5 步：流式调用 AI（一个字一个字显示） --------
            # stream=True 表示开启"流式输出"
            # 意思是 AI 说一个字我们就显示一个字，就像有人在打字
            stream = client.chat.completions.create(
                model="deepseek-chat",        # 使用 DeepSeek 的对话模型
                messages=messages_for_api,    # 把对话历史都发给 AI
                stream=True                   # 开启流式输出！
            )
            
            # 遍历 AI 返回的每一个"片段"
            for chunk in stream:
                # 检查这个片段有没有内容
                if chunk.choices[0].delta.content:
                    # 把新的文字加到完整回复里
                    full_reply += chunk.choices[0].delta.content
                    # 在页面上显示（+ "▌" 是闪烁的光标效果）
                    reply_container.markdown(full_reply + "▌")
            
            # AI 说完了，去掉最后的光标
            reply_container.markdown(full_reply)
            
        except Exception as e:
            # 如果出错了，显示错误信息
            reply_container.error(f"出错了：{e}")
            full_reply = ""  # 出错了就把回复设为空
    
    # -------- 第 8.6 步：保存 AI 的回复 --------
    # 把 AI 的回复也存到"记忆盒子"里，这样下次对话 AI 就能记住了
    if full_reply:  # 只有当 AI 成功回复了才保存
        st.session_state.messages.append({
            "role": "assistant",
            "content": full_reply
        })
```

### 3.3 运行效果截图

![应用界面](/blog/streamlit-ai-companion/initial-page.png)

![对话效果](/blog/streamlit-ai-companion/chat-demo.png)

---

## 第四章：完整代码（可复制直接运行）

把上面的代码整合在一起，就是可以直接运行的完整版本：

```python
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
```

> **如何使用**：把上面的代码完整复制到 `app.py` 文件中，**把 `your-api-key-here` 替换成你从 DeepSeek 获得的 API Key**，然后运行 `streamlit run app.py` 即可！

---

## 第五章：运行你的应用

### 5.1 启动应用

在终端中，进入项目文件夹，然后运行：

```bash
streamlit run app.py
```

几秒钟后，浏览器会自动打开，你就能看到自己的 AI 对话应用了！

### 5.2 修改代码后刷新

修改 `app.py` 的代码后，页面会自动刷新，不需要重启服务。

> **小技巧**：如果页面没有自动刷新，可以按 `Ctrl + R`（或 `Cmd + R`）手动刷新。

---

## 第六章：常见问题 & 踩坑提醒

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
1. 确认代码中的 API Key 已替换为你的真实 Key
2. 检查网络连接
3. 查看终端里的错误日志

### Q4：如何停止运行？
**方法**：在终端按 `Ctrl + C`

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
- 用 Python 的 `json` 模块读写文件
- 每个对话保存为一个 `.json` 文件
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

继续探索，你还可以为它添加：语音输入、图片识别、更多对话角色设定……可能性是无穷的！
