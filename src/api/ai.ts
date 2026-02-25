const SILICON_FLOW_KEY = 'sk-tvfmeafikjtcxsoysgkwaahpafxekduumewvbylyvfaixehq' // 从硅基流动后台获取
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions'
// 硅基流动支持很多模型，推荐使用 deepseek-ai/DeepSeek-V3 (性能强且便宜)
// 或者使用免费模型，如 vendor/model-name (具体看官方文档列表)
const MODEL_NAME = 'tencent/Hunyuan-MT-7B'

export const processNoteWithAI = async (content: string) => {
	const prompt = `
    你是一个闪念笔记助手。请对以下内容进行处理，直接返回 JSON 格式，不要包含任何 Markdown 代码块标签：
    {
      "summary": "一句简短的摘要",
      "keywords": ["标签1", "标签2"],
      "category": "分类名称"
    }
    待处理内容：${content}
  `

	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${SILICON_FLOW_KEY}`, // 注意这里是 Bearer 格式
			},
			body: JSON.stringify({
				model: MODEL_NAME,
				messages: [{ role: 'user', content: prompt }],
				temperature: 0.7,
			}),
		})

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(`API 请求失败: ${response.status} - ${errorText}`)
		}

		const data = await response.json()

		// 解析返回的内容（OpenAI 格式的标准路径）
		let resultString = data.choices[0].message.content
		resultString = resultString.replace(/```json|```/g, '').trim()

		return JSON.parse(resultString)
	} catch (error) {
		console.error('硅基流动 AI 处理失败', error)
		// return null;
		return {
			summary: 'AI 处理失败，无法生成摘要',
			keywords: [],
			category: '未知',
		}
	}
}
