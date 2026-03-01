import { AIProcessResult, ArticleStructure, Note } from '@/types'

const SILICON_FLOW_KEY = 'sk-tvfmeafikjtcxsoysgkwaahpafxekduumewvbylyvfaixehq'
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions'
const MODEL_NAME = 'deepseek-ai/DeepSeek-V3'

/**
 * 将 structure 转换为完整文章内容
 */
const structureToContent = (structure: ArticleStructure[]): string => {
	if (!structure || structure.length === 0) return ''

	return structure
		.map((item) => {
			// 每个章节格式：标题 + 换行 + 内容
			const content = item.content?.trim() || ''
			return `## ${item.title}\n\n${content}`
		})
		.join('\n\n---\n\n') // 章节之间用分隔线
}

/**
 * 使用硅基流动AI处理笔记内容
 * 输入 → 作为概要/核心要点
 * AI → 扩写为完整知识文章
 */
export const processNoteWithAI = async (
	content: string,
): Promise<Partial<Note>> => {
	const prompt = `
你是一位专业的知识整理助手。请将用户的简短输入扩写为一篇结构完整的知识笔记。

## 任务要求

**输入内容（用户原始想法）：**
${content}

**你需要输出：**

1. **title**: 标题（15字以内，抓住核心）
2. **summary**: 概要（50字以内，**必须基于用户输入**，精简提炼核心观点）
3. **keywords**: 关键词标签（3-5个）
4. **category**: 分类（工作/学习/灵感/待办/会议/技术/读书笔记/生活/其他）
5. **structure**: 文章结构（4-6个章节，每个章节包含详细内容）

**structure 章节要求：**
每个章节必须包含：
- id: 序号（1, 2, 3...）
- title: 章节标题（简洁有力）
- content: 章节正文（200-500字，详细展开）

**建议章节模板（根据内容类型自动选择）：**

技术/学习类：
1. 核心概念（解释是什么）
2. 工作原理/背景知识（解释为什么）
3. 详细说明/实现方式（解释怎么做）
4. 应用场景/案例分析（实际例子）
5. 注意事项/常见问题（避坑指南）
6. 总结与延伸（关键要点 + 后续学习方向）

灵感/想法类：
1. 核心灵感（用户输入的详细展开）
2. 背景思考（为什么有这个想法）
3. 可行性分析（优势与挑战）
4. 实现路径（具体步骤）
5. 相关资源/工具推荐
6. 下一步行动

工作/项目类：
1. 项目/任务概述
2. 目标与预期成果
3. 关键步骤拆解
4. 时间节点规划
5. 所需资源/协作方
6. 风险预案

**重要规则：**
- summary 必须严格基于用户输入，不要添加输入中没有的信息
- structure 里的 content 要详细、完整、有深度，像一篇专业文章
- 使用 Markdown 格式：段落之间空行，关键概念用**加粗**，列表用 - 开头

## 输出格式（严格JSON）

{
  "title": "简洁标题",
  "summary": "基于用户输入的概要",
  "keywords": ["标签1", "标签2", "标签3"],
  "category": "分类",
  "structure": [
    {
      "id": "1",
      "title": "章节标题",
      "content": "章节正文内容，要求详细完整，200-500字，包含专业知识和实用建议..."
    }
  ]
}
`

	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${SILICON_FLOW_KEY}`,
			},
			body: JSON.stringify({
				model: MODEL_NAME,
				messages: [{ role: 'user', content: prompt }],
				temperature: 0.7,
				response_format: { type: 'json_object' },
			}),
		})

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(`API请求失败: ${response.status} - ${errorText}`)
		}

		const data = await response.json()
		const aiResult: AIProcessResult = JSON.parse(
			data.choices[0].message.content,
		)

		// 数据校验
		if (!aiResult.structure || aiResult.structure.length === 0) {
			aiResult.structure = generateDefaultStructure(content)
		}

		// 确保每个章节有 content
		aiResult.structure = aiResult.structure.map((item, index) => ({
			id: item.id || `${index + 1}`,
			title: item.title || `章节${index + 1}`,
			content: item.content?.trim() || '（待补充详细内容）',
		}))

		// 生成完整文章内容
		const fullContent = structureToContent(aiResult.structure)

		return {
			title:
				aiResult.title ||
				content.slice(0, 15) + (content.length > 15 ? '...' : ''),
			summary: aiResult.summary || content.slice(0, 50), // 用户输入的精简版
			content: fullContent, // 从 structure 生成的完整文章
			structure: aiResult.structure,
			tags: aiResult.keywords || ['未分类'],
			category: aiResult.category || '其他',
		}
	} catch (error) {
		console.error('AI处理失败:', error)
		// 降级处理
		const fallbackStructure = generateDefaultStructure(content)
		return {
			title: content.slice(0, 15) || '未命名笔记',
			summary: content.slice(0, 50), // 原文作为概要
			content: structureToContent(fallbackStructure), // 从降级 structure 生成
			tags: ['未分类'],
			category: '其他',
			structure: fallbackStructure,
		}
	}
}

// 降级方案
const generateDefaultStructure = (content: string): ArticleStructure[] => {
	return [
		{
			id: '1',
			title: '核心要点',
			content: content,
		},
		{
			id: '2',
			title: '详细说明',
			content:
				'AI处理失败，请稍后重试或手动编辑补充详细内容。建议从核心要点出发，扩展相关背景知识、应用场景和具体案例。',
		},
		{
			id: '3',
			title: '相关思考',
			content: '可以在这里记录与此相关的其他想法、延伸思考或待解决的问题。',
		},
	]
}
