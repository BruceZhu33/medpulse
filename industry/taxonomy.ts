// 这个行业的分类体系：类别、标签词表、公司与机构（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（观点、解读）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 */
export const CATEGORIES = [
  { key: "approval", label: "注册获批", section: "注册与获批", guide: "注册审批与获批：NMPA、FDA、CE 等监管机构的注册获批、创新与优先通道进入转出、审评公示、注册法规落地。发布新产品但还没获批归产品技术；获批后的集采中标归集采医保。" },
  { key: "policy", label: "政策法规", section: "政策与法规", guide: "法规、规章、指导原则、强制性标准的发布与修订，分类目录调整，监管机构政策与人事。具体产品的获批归注册获批；集采与医保支付规则归集采医保。" },
  { key: "procurement", label: "集采医保", section: "集采与支付", guide: "集中采购、接续采购、开标结果、医保支付、收费定价、医保目录与支付政策。集采政策文件本身若改变普遍规则，按影响面可归政策法规。" },
  { key: "quality", label: "质量安全", section: "质量与安全", guide: "召回、飞行检查通报、警告信、监管处罚、不良事件与警戒信息。涉及具体产品的合规判定改变（如分类调整）归政策法规。" },
  { key: "industry", label: "行业动态", section: "行业动态", guide: "已发生的公司经营、投融资并购、人事、合作、诉讼、业绩、产能与出海的商业动作。新闻由当事方发布、带有态度，也不因此变成观点。" },
  { key: "tech", label: "产品技术", section: "产品与技术", guide: "新产品与新技术发布、重大产品更新、AI 医疗软件与平台进展。产品获批上市归注册获批；只有宣称和预测而无实际发布归观点解读。" },
  { key: "research", label: "临床研究", section: "临床与观点", guide: "以临床试验结果、真实世界研究、学术发现为核心的研究与技术报告。产品发布时附带的临床数据归注册获批或产品技术。" },
  { key: "opinion", label: "观点解读", section: "临床与观点", guide: "重点是作者的解释、判断、主张、预测、评论、访谈，以及法规实务与实操指南。讨论市场不自动归行业动态；作者是专家不自动归观点。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（AI 行业是新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = { category: "approval", tag: "注册获批", unit: "项新获批" };

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["nmpa", "fda", "ivd", "samd", "ce", "ct", "mri", "pet", "pcr", "ngs", "poct", "udi", "cdmo", "ra", "qa", "ai", "api", "ipo", "ceo"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["regulatory_approval", "policy_payment", "recall_quality", "product_tech", "clinical_research", "industry_event", "opinion_analysis"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "注册获批", "政策/法规", "集采/医保", "召回/质量安全", "行业动态", "产品/技术", "临床/研究", "观点/解读",
  "出海/全球化", "法规实务", "展会/活动", "非医械内容", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "影像与超声", "IVD/体外诊断", "心血管与介入", "骨科与植入", "手术机器人", "AI医疗/SaMD", "家用器械", "眼科", "口腔",
  "内窥镜", "监护与麻醉", "康复", "分子诊断/基因", "核心零部件", "CDMO/代工",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = ["迈瑞医疗", "联影医疗", "微创医疗", "美敦力", "雅培", "强生", "西门子医疗", "GE医疗", "波士顿科学", "罗氏诊断", "NMPA", "FDA"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  获批: "注册获批", 批准: "注册获批", 注册: "注册获批", 审批: "注册获批",
  政策: "政策/法规", 法规: "政策/法规", 监管: "政策/法规", 指导原则: "政策/法规", 标准: "政策/法规",
  集采: "集采/医保", 招采: "集采/医保", 医保: "集采/医保", 带量采购: "集采/医保", 支付: "集采/医保", 降价: "集采/医保",
  召回: "召回/质量安全", 飞检: "召回/质量安全", 飞行检查: "召回/质量安全", 处罚: "召回/质量安全", 警告信: "召回/质量安全", 不良事件: "召回/质量安全",
  融资: "行业动态", 收购: "行业动态", 并购: "行业动态", 投资: "行业动态", 人事: "行业动态", 业绩: "行业动态", 合作: "行业动态",
  新品: "产品/技术", 发布: "产品/技术", 技术: "产品/技术", 产品: "产品/技术",
  临床: "临床/研究", 研究: "临床/研究", 论文: "临床/研究", 试验: "临床/研究",
  观点: "观点/解读", 解读: "观点/解读", 分析: "观点/解读", 访谈: "观点/解读", 实操: "法规实务", 指南: "法规实务",
  出海: "出海/全球化", 海外: "出海/全球化", 国际化: "出海/全球化", 展会: "展会/活动", 会议: "展会/活动",
  "非医械": "非医械内容", "无关": "非医械内容",
};

// ── 公司与机构 ──────────────────────────────────────────────────────────────────────────

/** 公司与机构主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; otherNames?: string[] }> = {
  mindray: { name: "迈瑞医疗", displayTag: "迈瑞医疗", aliases: ["迈瑞", "Mindray"] },
  "united-imaging": { name: "联影医疗", displayTag: "联影医疗", aliases: ["联影", "United Imaging"] },
  microport: { name: "微创医疗", displayTag: "微创医疗", aliases: ["微创", "MicroPort", "微创医疗科学"] },
  lepu: { name: "乐普医疗", displayTag: null, aliases: ["乐普", "Lepu"] },
  yuyue: { name: "鱼跃医疗", displayTag: null, aliases: ["鱼跃", "Yuwell"] },
  medtronic: { name: "美敦力", displayTag: "美敦力", aliases: ["美敦力", "Medtronic"] },
  abbott: { name: "雅培", displayTag: "雅培", aliases: ["雅培", "Abbott"] },
  jnj: { name: "强生医疗", displayTag: "强生", aliases: ["强生", "Johnson & Johnson", "Ethicon", "DePuy"] },
  stryker: { name: "史赛克", displayTag: null, aliases: ["史赛克", "Stryker"] },
  "boston-scientific": { name: "波士顿科学", displayTag: "波士顿科学", aliases: ["波士顿科学", "Boston Scientific"] },
  "siemens-healthineers": { name: "西门子医疗", displayTag: "西门子医疗", aliases: ["西门子医疗", "Siemens Healthineers"] },
  "ge-healthcare": { name: "GE 医疗", displayTag: "GE医疗", aliases: ["GE 医疗", "GE HealthCare"] },
  philips: { name: "飞利浦医疗", displayTag: null, aliases: ["飞利浦医疗", "Philips Healthcare"] },
  "roche-diagnostics": { name: "罗氏诊断", displayTag: "罗氏诊断", aliases: ["罗氏诊断", "Roche Diagnostics"] },
  danaher: { name: "丹纳赫", displayTag: null, aliases: ["丹纳赫", "Danaher", "Cepheid", "Beckman Coulter"] },
  "thermo-fisher": { name: "赛默飞", displayTag: null, aliases: ["赛默飞", "Thermo Fisher"] },
  nmpa: { name: "国家药监局", displayTag: "NMPA", aliases: ["国家药监局", "NMPA", "国家药品监督管理局"] },
  cmde: { name: "器审中心", displayTag: null, aliases: ["器审中心", "CMDE", "医疗器械技术审评中心"] },
  nhsa: { name: "国家医保局", displayTag: null, aliases: ["国家医保局", "医保局", "NHSA"] },
  fda: { name: "美国 FDA", displayTag: "FDA", aliases: ["FDA", "美国食品药品监督管理局"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "mindray", name: "迈瑞医疗", patterns: [/迈瑞|mindray/i] },
  { id: "united-imaging", name: "联影医疗", patterns: [/联影|united\s?imaging/i] },
  { id: "microport", name: "微创医疗", patterns: [/微创|microport/i] },
  { id: "lepu", name: "乐普医疗", patterns: [/乐普|lepu/i] },
  { id: "yuyue", name: "鱼跃医疗", patterns: [/鱼跃|yuwell/i] },
  { id: "medtronic", name: "美敦力", patterns: [/美敦力|medtronic|\bHugo\b/i] },
  { id: "abbott", name: "雅培", patterns: [/雅培|abbott|FreeStyle\s?Libre|\bAlinity\b|\bPanbio\b/i] },
  { id: "jnj", name: "强生医疗", patterns: [/强生|johnson\s?&\s?johnson|\bJ&J\b|ethicon|depuy|\bAbiomed\b|\bShockwave\b/i] },
  { id: "stryker", name: "史赛克", patterns: [/史赛克|stryker|\bMako\b/i] },
  { id: "boston-scientific", name: "波士顿科学", patterns: [/波士顿科学|boston\s?scientific|\bWatchman\b|\bFarapulse\b/i] },
  { id: "siemens-healthineers", name: "西门子医疗", patterns: [/西门子医疗|siemens\s?healthineers/i] },
  { id: "ge-healthcare", name: "GE 医疗", patterns: [/ge\s?医疗|ge\s?healthcare/i] },
  { id: "philips", name: "飞利浦医疗", patterns: [/飞利浦|philips/i] },
  { id: "roche-diagnostics", name: "罗氏诊断", patterns: [/罗氏|roche|\bcobas\b/i] },
  { id: "danaher", name: "丹纳赫", patterns: [/丹纳赫|danaher|cepheid|beckman\s?coulter/i] },
  { id: "thermo-fisher", name: "赛默飞", patterns: [/赛默飞|thermo\s?fisher/i] },
  { id: "nmpa", name: "国家药监局", patterns: [/国家药监局|药监局|nmpa|国家药品监督管理局/i] },
  { id: "cmde", name: "器审中心", patterns: [/器审中心|cmde|医疗器械技术审评中心|器审/i] },
  { id: "nhsa", name: "国家医保局", patterns: [/国家医保局|医保局|nhsa/i] },
  { id: "fda", name: "美国 FDA", patterns: [/\bfda\b|美国食品药品监督管理局/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台如官媒门户不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "nmpa", domains: ["nmpa.gov.cn"] },
  { entityId: "cmde", domains: ["cmde.org.cn"] },
  { entityId: "nhsa", domains: ["nhsa.gov.cn"] },
  { entityId: "fda", domains: ["fda.gov"] },
  { entityId: "medtronic", domains: ["medtronic.com", "news.medtronic.com"] },
  { entityId: "abbott", domains: ["abbott.com", "media.abbott.com"] },
  { entityId: "jnj", domains: ["jnj.com"] },
  { entityId: "boston-scientific", domains: ["bostonscientific.com", "news.bostonscientific.com"] },
  { entityId: "siemens-healthineers", domains: ["siemens-healthineers.com", "press.siemens-healthineers.com"] },
  { entityId: "ge-healthcare", domains: ["gehealthcare.com"] },
  { entityId: "philips", domains: ["philips.com", "philips.com.cn"] },
  { entityId: "mindray", domains: ["mindray.com"] },
  { entityId: "united-imaging", domains: ["united-imaging.com"] },
  { entityId: "microport", domains: ["microport.com"] },
  { entityId: "roche-diagnostics", domains: ["roche.com", "diagnostics.roche.com"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "ge-healthcare", pattern: /\bGE\s?HealthCare\b/i },
  { entityId: "jnj", pattern: /\bJohnson(?:\s?&\s?|\s+and\s+)Johnson\b/i },
];
