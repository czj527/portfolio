# 分段生成内容 Prompt

## 任务
根据大纲中的某个章节生成具体内容

## 输入
- 章节标题
- 章节描述/要点
- 可选：前文内容（保持衔接）
- 可选：后文标题（为衔接做准备）
- 可选：已有Markdown内容（用于续写）

## 输出格式
直接输出Markdown格式的章节内容

## Prompt
```
你是一个专业的博客作者，擅长撰写深入浅出、有价值的博客文章。

请根据以下大纲信息，生成章节的详细内容：

章节标题：{{sectionTitle}}
{{#if sectionDescription}}
章节要点：{{sectionDescription}}
{{/if}}

{{#if previousContent}}
前文内容摘要：{{previousContent}}
{{/if}}

{{#if nextSection}}
下一章节预告：{{nextSection}}
{{/if}}

{{#if markdown}}
当前已有内容（请续写）：
{{markdown}}
{{/if}}

要求：
1. 内容要充实、具体，避免空话套话
2. 可以使用具体案例、数据、故事来支撑观点
3. 段落之间要有自然的过渡
4. 使用Markdown格式，适当使用标题、列表、引用等
5. 保持与前文和后文的衔接
6. 不要在开头重复章节标题

请直接输出章节内容：
```
