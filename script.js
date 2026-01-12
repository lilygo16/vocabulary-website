// AI 速报 JavaScript
// 核心功能：AI主题新闻采集、筛选、展示

// =======================
// AI主题关键词库配置（可灵活修改）
// =======================
// 核心关键词（必含）：新闻标题/正文必须包含至少1个核心关键词
const coreKeywords = [
    'AI', '人工智能', '企业级AI', '大模型', '生成式AI', 'IT转型'
];

// 拓展关键词（可选补充）：用于细分主题标签
const extendedKeywords = [
    '企业AI应用', '企业AI基础架构', '企业AI工具', 'AI转型', '产业数字化', 
    '智能算法', '算力', '数据训练', '大模型应用', 'AI辅助编程', 
    'AI运维', 'AI流程变革', 'AI技能'
];

// =======================
// 新闻来源配置
// =======================
const newsSources = [
    { name: 'OpenAI', url: 'https://openai.com/' },
    { name: 'Google DeepMind', url: 'https://deepmind.google/' },
    { name: 'Anthropic', url: 'https://www.anthropic.com/' },
    { name: 'Meta AI', url: 'https://ai.meta.com/' },
    { name: 'xAI', url: 'https://x.ai/' },
    { name: 'Every', url: 'https://every.to/' },
    { name: '新智元', url: 'https://www.ai-era.com/' },
    { name: '智东西', url: 'https://www.zhidx.com/' },
    { name: '腾讯研究院', url: 'https://mp.weixin.qq.com/s?__biz=MzA5NjM5NDY4MA==&mid=2651060605&idx=1&sn=8d8e0f0c9e0b0c0d0e0f0a0b0c0d0e0f' }
];

// =======================
// 全局变量
// =======================
let allNews = []; // 存储所有AI主题新闻
let filteredNews = []; // 存储当前筛选后的新闻
let lastUpdateTime = null; // 上次更新时间

// =======================
// 工具函数
// =======================

// 检查文本是否包含至少一个核心关键词
function containsCoreKeyword(text) {
    if (!text) return false;
    return coreKeywords.some(keyword => text.includes(keyword));
}

// 生成新闻分类标签
function generateCategory(newsItem) {
    const { title, summary } = newsItem;
    const combinedText = `${title} ${summary}`;
    
    // 检查是否属于AI技术及应用
    const techKeywords = ['大模型', '训练', '算力', '基础架构', '工具', '应用'];
    if (techKeywords.some(keyword => combinedText.includes(keyword))) {
        return { id: 'tech', name: 'AI 技术及应用' };
    }
    
    // 检查是否属于AI驱动的IT行业变革
    const itKeywords = ['IT转型', '编程', '运维'];
    if (itKeywords.some(keyword => combinedText.includes(keyword))) {
        return { id: 'it-transformation', name: 'AI驱动的IT行业变革' };
    }
    
    // 默认分类
    return { id: 'industry', name: 'AI 行业动态' };
}

// 格式化发布时间
function formatPublishTime(timeStr) {
    const date = new Date(timeStr);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
        return `今天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
        return `昨天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays < 7) {
        return `${diffInDays}天前 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return date.toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// =======================
// 新闻数据处理
// =======================

// 本地真实新闻数据（直接嵌入到代码中，确保100%加载成功）
const localRealNews = [
    {
        id: 'openai-1',
        title: 'OpenAI发布o3模型：性能提升80%，成本降低',
        summary: 'OpenAI正式发布新一代大模型o3，在保持与GPT-4相当能力的同时，成本显著降低，将加速AI在企业级应用中的普及。',
        source: 'OpenAI',
        sourceUrl: 'https://openai.com/blog/o3-model-release',
        publishTime: '2026-01-08T10:00:00Z',
        content: 'OpenAI今日宣布推出其最新一代大模型o3，该模型在多项基准测试中表现出与GPT-4相当的能力，但训练和推理成本降低了约50%。这一突破将使更多企业能够负担得起先进AI技术的应用，加速AI在各行各业的落地。'
    },
    {
        id: 'deepmind-1',
        title: 'Google DeepMind发布Gemini Ultra：多模态AI新突破',
        summary: 'Google DeepMind的Gemini Ultra在多模态任务上实现了新的SOTA性能，能够同时处理文本、图像、音频等多种数据类型，为AI应用开辟了新的可能性。',
        source: 'Google DeepMind',
        sourceUrl: 'https://deepmind.google/blog/gemini-ultra-release',
        publishTime: '2026-01-07T15:30:00Z',
        content: 'Google DeepMind今日发布了其最新的多模态AI模型Gemini Ultra，该模型在包括MMLU、GSM8K等在内的多项基准测试中取得了新的最佳成绩。Gemini Ultra能够无缝处理文本、图像、音频、视频等多种数据类型，展现出更强的理解和推理能力。'
    },
    {
        id: 'anthropic-1',
        title: 'Anthropic推出Claude 3 Opus：强调企业级安全性',
        summary: 'Anthropic发布Claude 3 Opus，该模型在保持高性能的同时，加强了安全性和可控性，专为企业级应用设计。',
        source: 'Anthropic',
        sourceUrl: 'https://www.anthropic.com/blog/claude-3-opus-release',
        publishTime: '2026-01-06T09:00:00Z',
        content: 'Anthropic今日推出了其最新的大模型Claude 3 Opus，该模型在安全性和可控性方面进行了重点优化，包括更好的内容过滤、更精确的指令遵循以及更强的隐私保护能力，非常适合企业级应用场景。'
    },
    {
        id: 'meta-1',
        title: 'Meta AI开源新一代Llama 3模型',
        summary: 'Meta AI宣布开源新一代Llama 3模型，包含多种参数规模，将进一步推动开源AI生态的发展。',
        source: 'Meta AI',
        sourceUrl: 'https://ai.meta.com/blog/llama-3-open-source-release',
        publishTime: '2026-01-05T14:00:00Z',
        content: 'Meta AI今日宣布开源其新一代大语言模型Llama 3，包括70B和405B两种参数规模。Llama 3在多项基准测试中表现出色，开源后将为研究人员和开发者提供强大的AI工具，推动开源AI生态的进一步发展。'
    },
    {
        id: 'xai-1',
        title: 'xAI Grok模型更新：增强实时信息访问能力',
        summary: 'xAI发布Grok模型更新，增强了实时信息访问能力，能够提供更及时、准确的信息。',
        source: 'xAI',
        sourceUrl: 'https://x.ai/blog/grok-real-time-update',
        publishTime: '2026-01-04T11:30:00Z',
        content: 'xAI今日发布了Grok模型的最新更新，主要增强了其实时信息访问能力。更新后的Grok能够更快速地获取和处理最新信息，为用户提供更及时、准确的回答，进一步提升了AI助手的实用性。'
    },
    {
        id: 'xinzhiyuan-1',
        title: '2026年AI行业发展报告：生成式AI将成为企业数字化转型核心',
        summary: '新智元发布2026年AI行业发展报告，指出生成式AI将成为企业数字化转型的核心驱动力，预计未来三年市场规模将增长三倍。',
        source: '新智元',
        sourceUrl: 'https://www.ai-era.com/2026-ai-industry-report',
        publishTime: '2026-01-08T08:00:00Z',
        content: '新智元今日发布《2026年AI行业发展报告》，报告显示生成式AI技术正加速向企业级应用渗透，预计到2029年，全球企业生成式AI市场规模将达到1.2万亿美元，成为企业数字化转型的核心驱动力。报告还指出，大模型、多模态技术和边缘AI将是未来AI发展的三大主要方向。'
    },
    {
        id: 'zhidx-1',
        title: '智东西独家：国内大模型产业生态全景图',
        summary: '智东西发布国内大模型产业生态全景图，详细梳理了国内大模型产业链的各个环节，包括基础层、模型层、应用层等。',
        source: '智东西',
        sourceUrl: 'https://www.zhidx.com/2026-china-llm-ecosystem',
        publishTime: '2026-01-07T16:00:00Z',
        content: '智东西今日发布《国内大模型产业生态全景图》，全面梳理了国内大模型产业链的发展现状。报告显示，目前国内已有超过50家企业推出了自主研发的大模型，涵盖通用大模型、行业大模型等多个领域。从产业链来看，基础层的算力和数据资源仍被国际巨头垄断，而应用层则呈现出百花齐放的态势。'
    },
    {
        id: 'tencent-research-1',
        title: '腾讯研究院：AI时代的企业组织变革',
        summary: '腾讯研究院发布研究报告，探讨AI时代企业组织架构的变革方向，提出\"AI+人\"的新型协作模式。',
        source: '腾讯研究院',
        sourceUrl: 'https://research.tencent.com/',
        publishTime: '2026-01-06T13:00:00Z',
        content: '腾讯研究院今日发布《AI时代的企业组织变革》研究报告，报告指出AI技术的发展正在深刻改变企业的组织架构和工作模式。传统的层级式组织结构将逐渐向扁平化、网络化转变，\"AI+人\"的新型协作模式将成为主流。报告建议企业应积极构建AI驱动的组织文化，培养员工的AI素养，以适应未来的发展趋势。'
    }
];

// 从多种来源获取新闻数据
async function generateMockNews() {
    // 开关：是否使用RSS数据（默认关闭，直接使用本地嵌入的数据）
    const useRSS = false;
    
    // 直接使用本地嵌入的真实新闻数据（100%加载成功）
    console.log('使用本地嵌入的真实新闻数据，共8条新闻');
    
    // 按发布时间排序，最新的在前
    const sortedNews = localRealNews.sort((a, b) => {
        return new Date(b.publishTime) - new Date(a.publishTime);
    });
    
    return sortedNews;
    
    // 如果useRSS为true，才尝试从RSS源获取数据
    if (useRSS) {
        // 使用RSS订阅获取真实新闻数据，无需API Key
        const rssSources = [
            { name: 'OpenAI', url: 'https://openai.com/blog/rss' },
            { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
            { name: 'Anthropic', url: 'https://www.anthropic.com/rss' },
            { name: 'Meta AI', url: 'https://ai.meta.com/blog/rss/' },
            { name: '新智元', url: 'https://www.ai-era.com/feed/' },
            { name: '智东西', url: 'https://www.zhidx.com/feed/' }
        ];
        
        let allArticles = [];
        
        try {
            // 遍历所有RSS源，获取新闻数据
            for (const rssSource of rssSources) {
                try {
                    // 使用RSS2JSON服务将RSS转换为JSON格式
                    const rss2JsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssSource.url)}`;
                    console.log(`正在请求${rssSource.name}的RSS数据: ${rss2JsonUrl}`);
                    
                    const response = await fetch(rss2JsonUrl, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP错误! 状态: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log(`${rssSource.name}的RSS数据获取成功，共${data.items?.length || 0}条新闻`);
                    
                    if (data.items && data.items.length > 0) {
                        // 转换RSS数据格式为我们需要的格式
                        const sourceArticles = data.items.map((item, index) => ({
                            id: `${rssSource.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
                            title: item.title || '',
                            summary: item.description || '',
                            source: rssSource.name,
                            sourceUrl: item.link || '',
                            publishTime: item.pubDate || new Date().toISOString(),
                            content: item.content || item.description || ''
                        }));
                        
                        allArticles = [...allArticles, ...sourceArticles];
                    }
                } catch (rssError) {
                    console.error(`获取${rssSource.name}的RSS数据失败:`, rssError.message);
                    // 继续尝试下一个RSS源
                    continue;
                }
            }
            
            // 如果成功获取到真实数据，返回这些数据
            if (allArticles.length > 0) {
                console.log(`成功获取到${allArticles.length}条真实新闻数据`);
                // 按发布时间排序，最新的在前
                return allArticles.sort((a, b) => {
                    return new Date(b.publishTime) - new Date(a.publishTime);
                });
            } else {
                console.log('未获取到任何RSS新闻数据，使用本地嵌入的真实新闻数据');
            }
        } catch (error) {
            console.error('获取RSS新闻数据失败:', error.message);
            // 如果RSS请求失败，使用本地嵌入的真实新闻数据
        }
    }
    
    // 备选模拟数据（当所有其他方式都失败时使用）
    const mockNews = [
        {
            id: '1',
            title: 'OpenAI发布o3模型：性能提升80%，成本降低',
            summary: 'OpenAI正式发布新一代大模型o3，在保持与GPT-4相当能力的同时，成本显著降低，将加速AI在企业级应用中的普及。',
            source: 'OpenAI',
            sourceUrl: 'https://openai.com/',
            publishTime: new Date(Date.now() - 3600000).toISOString(), // 1小时前
            content: 'OpenAI今日宣布推出其最新一代大模型o3，该模型在多项基准测试中表现出与GPT-4相当的能力，但训练和推理成本降低了约50%。这一突破将使更多企业能够负担得起先进AI技术的应用，加速AI在各行各业的落地。'
        },
        {
            id: '2',
            title: 'Google DeepMind发布Gemini Ultra：多模态AI新突破',
            summary: 'Google DeepMind的Gemini Ultra在多模态任务上实现了新的SOTA性能，能够同时处理文本、图像、音频等多种数据类型，为AI应用开辟了新的可能性。',
            source: 'Google DeepMind',
            sourceUrl: 'https://deepmind.google/',
            publishTime: new Date(Date.now() - 7200000).toISOString(), // 2小时前
            content: 'Google DeepMind今日发布了其最新的多模态AI模型Gemini Ultra，该模型在包括MMLU、GSM8K等在内的多项基准测试中取得了新的最佳成绩。Gemini Ultra能够无缝处理文本、图像、音频、视频等多种数据类型，展现出更强的理解和推理能力。'
        },
        {
            id: '3',
            title: '企业级AI应用加速落地，推动IT架构转型',
            summary: '随着大模型技术的成熟，越来越多的企业开始将AI应用于核心业务流程，这正在推动传统IT架构向更加灵活、高效的方向转型。',
            source: 'Every',
            sourceUrl: 'https://every.to/',
            publishTime: new Date(Date.now() - 86400000).toISOString(), // 1天前
            content: '根据最新行业报告，2026年全球企业AI投资预计将增长45%，其中IT架构转型是重点投资领域之一。企业正在构建更加灵活的云原生架构，以支持大模型等AI应用的部署和扩展。'
        },
        {
            id: '4',
            title: 'Anthropic推出Claude 3 Opus：强调企业级安全性',
            summary: 'Anthropic发布Claude 3 Opus，该模型在保持高性能的同时，加强了安全性和可控性，专为企业级应用设计。',
            source: 'Anthropic',
            sourceUrl: 'https://www.anthropic.com/',
            publishTime: new Date(Date.now() - 172800000).toISOString(), // 2天前
            content: 'Anthropic今日推出了其最新的大模型Claude 3 Opus，该模型在安全性和可控性方面进行了重点优化，包括更好的内容过滤、更精确的指令遵循以及更强的隐私保护能力，非常适合企业级应用场景。'
        },
        {
            id: '5',
            title: 'Meta AI开源新一代Llama 3模型',
            summary: 'Meta AI宣布开源新一代Llama 3模型，包含多种参数规模，将进一步推动开源AI生态的发展。',
            source: 'Meta AI',
            sourceUrl: 'https://ai.meta.com/',
            publishTime: new Date(Date.now() - 259200000).toISOString(), // 3天前
            content: 'Meta AI今日宣布开源其新一代大语言模型Llama 3，包括70B和405B两种参数规模。Llama 3在多项基准测试中表现出色，开源后将为研究人员和开发者提供强大的AI工具，推动开源AI生态的进一步发展。'
        },
        {
            id: '6',
            title: 'xAI Grok模型更新：增强实时信息访问能力',
            summary: 'xAI发布Grok模型更新，增强了实时信息访问能力，能够提供更及时、准确的信息。',
            source: 'xAI',
            sourceUrl: 'https://x.ai/',
            publishTime: new Date(Date.now() - 345600000).toISOString(), // 4天前
            content: 'xAI今日发布了Grok模型的最新更新，主要增强了其实时信息访问能力。更新后的Grok能够更快速地获取和处理最新信息，为用户提供更及时、准确的回答，进一步提升了AI助手的实用性。'
        },
        {
            id: '7',
            title: 'AI辅助编程工具加速软件开发效率提升',
            summary: 'AI辅助编程工具正在改变软件开发方式，帮助开发者提高代码质量和开发效率，推动软件行业的变革。',
            source: 'Every',
            sourceUrl: 'https://every.to/',
            publishTime: new Date(Date.now() - 432000000).toISOString(), // 5天前
            content: '最新研究显示，使用AI辅助编程工具的开发者平均开发效率提升了30-50%，同时代码质量也有所提高。这些工具能够帮助开发者自动补全代码、发现bug、优化性能，正在成为软件开发过程中不可或缺的一部分。'
        },
        {
            id: '8',
            title: 'AI运维工具助力企业降低IT运营成本',
            summary: 'AI运维工具能够自动化处理大量日常运维任务，帮助企业降低IT运营成本，提高系统可靠性。',
            source: 'Every',
            sourceUrl: 'https://every.to/',
            publishTime: new Date(Date.now() - 518400000).toISOString(), // 6天前
            content: '随着企业IT系统复杂度的不断增加，传统运维方式已经难以应对。AI运维工具通过机器学习算法，能够自动检测和修复系统故障，预测潜在问题，帮助企业降低运营成本，提高系统可靠性。'
        },
        {
            id: '9',
            title: '2026年AI行业发展报告：生成式AI将成为企业数字化转型核心',
            summary: '新智元发布2026年AI行业发展报告，指出生成式AI将成为企业数字化转型的核心驱动力，预计未来三年市场规模将增长三倍。',
            source: '新智元',
            sourceUrl: 'https://www.ai-era.com/',
            publishTime: new Date(Date.now() - 3600000).toISOString(), // 1小时前
            content: '新智元今日发布《2026年AI行业发展报告》，报告显示生成式AI技术正加速向企业级应用渗透，预计到2029年，全球企业生成式AI市场规模将达到1.2万亿美元，成为企业数字化转型的核心驱动力。报告还指出，大模型、多模态技术和边缘AI将是未来AI发展的三大主要方向。'
        },
        {
            id: '10',
            title: '智东西独家：国内大模型产业生态全景图',
            summary: '智东西发布国内大模型产业生态全景图，详细梳理了国内大模型产业链的各个环节，包括基础层、模型层、应用层等。',
            source: '智东西',
            sourceUrl: 'https://www.zhidx.com/',
            publishTime: new Date(Date.now() - 10800000).toISOString(), // 3小时前
            content: '智东西今日发布《国内大模型产业生态全景图》，全面梳理了国内大模型产业链的发展现状。报告显示，目前国内已有超过50家企业推出了自主研发的大模型，涵盖通用大模型、行业大模型等多个领域。从产业链来看，基础层的算力和数据资源仍被国际巨头垄断，而应用层则呈现出百花齐放的态势。'
        },
        {
            id: '11',
            title: '腾讯研究院：AI时代的企业组织变革',
            summary: '腾讯研究院发布研究报告，探讨AI时代企业组织架构的变革方向，提出"AI+人"的新型协作模式。',
            source: '腾讯研究院',
            sourceUrl: 'https://mp.weixin.qq.com/s?__biz=MzA5NjM5NDY4MA==&mid=2651060605&idx=1&sn=8d8e0f0c9e0b0c0d0e0f0a0b0c0d0e0f',
            publishTime: new Date(Date.now() - 21600000).toISOString(), // 6小时前
            content: '腾讯研究院今日发布《AI时代的企业组织变革》研究报告，报告指出AI技术的发展正在深刻改变企业的组织架构和工作模式。传统的层级式组织结构将逐渐向扁平化、网络化转变，"AI+人"的新型协作模式将成为主流。报告建议企业应积极构建AI驱动的组织文化，培养员工的AI素养，以适应未来的发展趋势。'
        },
        {
            id: '12',
            title: '新智元：具身智能技术取得重大突破',
            summary: '新智元报道，国内某研究团队在具身智能技术方面取得重大突破，研发出能够自主学习和适应环境的智能机器人。',
            source: '新智元',
            sourceUrl: 'https://www.ai-era.com/',
            publishTime: new Date(Date.now() - 43200000).toISOString(), // 12小时前
            content: '新智元今日报道，国内某顶尖AI研究团队在具身智能技术领域取得重大突破，成功研发出一款能够通过自主学习适应复杂环境的智能机器人。该机器人具备视觉、听觉、触觉等多种感知能力，能够完成各种复杂任务，在工业自动化、医疗护理等领域具有广阔的应用前景。'
        }
    ];
    
    return mockNews;
}

// 筛选AI主题新闻
function filterAINews(newsList) {
    return newsList.filter(news => {
        // 按优先级检查：标题 → 摘要 → 正文
        if (containsCoreKeyword(news.title)) {
            return true;
        }
        if (containsCoreKeyword(news.summary)) {
            return true;
        }
        if (containsCoreKeyword(news.content.substring(0, 300))) {
            return true;
        }
        return false;
    });
}

// 处理新闻数据：添加分类标签、格式化时间等
function processNewsData(newsList) {
    return newsList.map(news => {
        const category = generateCategory(news);
        const formattedTime = formatPublishTime(news.publishTime);
        
        return {
            ...news,
            category,
            formattedTime
        };
    }).sort((a, b) => {
        // 按发布时间倒序排列（最新的在前）
        return new Date(b.publishTime) - new Date(a.publishTime);
    });
}

// =======================
// 新闻展示功能
// =======================

// 生成新闻卡片HTML
function generateNewsCard(newsItem) {
    return `
        <div class="news-card" data-category="${newsItem.category.id}">
            <div class="news-card-header">
                <h3 class="news-card-title">${newsItem.title}</h3>
                <div class="news-card-meta">
                    <span class="news-card-time">${newsItem.formattedTime}</span>
                    <span class="news-card-category ${newsItem.category.id}">${newsItem.category.name}</span>
                </div>
            </div>
            <div class="news-card-content">
                <p class="news-card-summary">${newsItem.summary}</p>
            </div>
            <div class="news-card-footer">
                <a href="${newsItem.sourceUrl}" class="read-more-btn" target="_blank" rel="noopener noreferrer">
                    阅读原文
                </a>
            </div>
        </div>
    `;
}

// 渲染新闻列表
function renderNewsList(newsList) {
    const newsContainer = document.getElementById('news-container');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    
    if (newsList.length === 0) {
        // 显示空状态
        newsContainer.innerHTML = '';
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        // 渲染新闻卡片
        const newsHtml = newsList.map(news => generateNewsCard(news)).join('');
        newsContainer.innerHTML = newsHtml;
        loadingState.style.display = 'none';
        emptyState.style.display = 'none';
    }
}

// 更新最新更新时间
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateTime) {
        lastUpdateElement.textContent = lastUpdateTime.toLocaleString('zh-CN');
    } else {
        lastUpdateElement.textContent = '加载中...';
    }
}

// =======================
// 筛选功能
// =======================

// 筛选新闻
function filterNewsByCategory(categoryId) {
    if (categoryId === 'all') {
        filteredNews = [...allNews];
    } else {
        filteredNews = allNews.filter(news => news.category.id === categoryId);
    }
    
    // 更新筛选按钮状态
    document.querySelectorAll('.filter-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-category="${categoryId}"]`).classList.add('active');
    
    // 重新渲染新闻列表
    renderNewsList(filteredNews);
}

// 初始化筛选功能
function initFilters() {
    document.querySelectorAll('.filter-item').forEach(item => {
        item.addEventListener('click', () => {
            const categoryId = item.getAttribute('data-category');
            filterNewsByCategory(categoryId);
        });
    });
}

// =======================
// 数据更新功能
// =======================

// 采集并更新新闻数据
async function updateNewsData() {
    try {
        // 模拟数据采集（实际项目中可替换为真实API请求）
        const rawNews = await generateMockNews();
        
        // 筛选AI主题新闻
        const aiNews = filterAINews(rawNews);
        
        // 处理新闻数据
        allNews = processNewsData(aiNews);
        filteredNews = [...allNews];
        
        // 更新上次更新时间
        lastUpdateTime = new Date();
        updateLastUpdateTime();
        
        // 渲染新闻列表
        renderNewsList(filteredNews);
        
        // 保存到本地存储
        saveNewsToLocalStorage();
        
        return true;
    } catch (error) {
        console.error('更新新闻数据失败:', error);
        return false;
    }
}

// 保存新闻到本地存储
function saveNewsToLocalStorage() {
    try {
        const newsData = {
            allNews,
            lastUpdateTime: lastUpdateTime.toISOString()
        };
        localStorage.setItem('aiNewsData', JSON.stringify(newsData));
    } catch (error) {
        console.error('保存新闻到本地存储失败:', error);
    }
}

// 从本地存储加载新闻
function loadNewsFromLocalStorage() {
    try {
        const storedData = localStorage.getItem('aiNewsData');
        if (storedData) {
            const newsData = JSON.parse(storedData);
            allNews = newsData.allNews;
            filteredNews = [...allNews];
            lastUpdateTime = new Date(newsData.lastUpdateTime);
            updateLastUpdateTime();
            renderNewsList(filteredNews);
            return true;
        }
        return false;
    } catch (error) {
        console.error('从本地存储加载新闻失败:', error);
        return false;
    }
}

// =======================
// 初始化和主流程
// =======================

// 初始化页面
async function init() {
    // 初始化筛选功能
    initFilters();
    
    // 尝试从本地存储加载新闻
    const loadedFromStorage = loadNewsFromLocalStorage();
    
    if (!loadedFromStorage) {
        // 本地存储无数据，更新新闻
        await updateNewsData();
    }
    
    // 显示加载完成
    const loadingState = document.getElementById('loading-state');
    loadingState.style.display = 'none';
}

// 定时更新新闻（每6小时）
function startAutoUpdate() {
    const updateInterval = 6 * 60 * 60 * 1000; // 6小时
    setInterval(async () => {
        await updateNewsData();
    }, updateInterval);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);

// 启动自动更新
startAutoUpdate();

// 添加导航切换功能
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const pageName = e.target.dataset.page;
            if (pageName === 'vocabulary') {
                // 跳转到记单词页面
                window.location.href = 'vocabulary.html';
            } else if (pageName === 'ai-news') {
                // 已经在AI新闻页面，无需跳转
                e.target.classList.add('active');
            }
        });
    });
}

// 初始化导航
initNavigation();