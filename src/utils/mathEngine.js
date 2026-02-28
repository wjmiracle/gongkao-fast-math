// src/utils/mathEngine.js

// === 核心：微型数学公式渲染引擎 ===
// 自动将 top 和 bottom 组装成带有完美横线的 HTML 结构，支持无限嵌套！
function makeFrac(top, bottom, sizeClass = '') {
    return `<div class="fraction-box ${sizeClass}"><div class="numerator">${top}</div><div class="denominator">${bottom}</div></div>`;
}
function makeText(txt) {
    return `<span class="exp-text">${txt}</span>`;
}

export const fractionData = [
    { pct: "33.3%", frac: "1/3" }, { pct: "25%", frac: "1/4" }, { pct: "20%", frac: "1/5" },
    { pct: "16.7%", frac: "1/6" }, { pct: "14.3%", frac: "1/7" }, { pct: "12.5%", frac: "1/8" },
    { pct: "11.1%", frac: "1/9" }, { pct: "9.1%", frac: "1/11" }, { pct: "8.3%", frac: "1/12" },
    { pct: "7.7%", frac: "1/13" }, { pct: "7.1%", frac: "1/14" }, { pct: "6.7%", frac: "1/15" },
    { pct: "6.25%", frac: "1/16" }, { pct: "5.9%", frac: "1/17" }, { pct: "5.6%", frac: "1/18" },
    { pct: "5.3%", frac: "1/19" }
];

function generatePercentQuestion() {
    let target = fractionData[Math.floor(Math.random() * fractionData.length)];
    let options = [target.frac];
    let remaining = fractionData.filter(item => item.frac !== target.frac).sort(() => Math.random() - 0.5).slice(0, 3);
    remaining.forEach(item => options.push(item.frac));
    return {
        hint: "公考资料分析 - 特殊分数秒杀",
        question: { type: 'text', content: target.pct },
        correctAnswer: target.frac,
        options: options.sort(() => Math.random() - 0.5),
        explanation: `必背特殊分数！${target.pct} 完美转化为 ${target.frac}。`
    };
}

function generateBasePeriodQuestion() {
    const A = Math.floor(Math.random() * 90000) + 10000;
    const r_pct = (Math.random() * 20 + 5).toFixed(1);
    const r_decimal = parseFloat(r_pct) / 100;
    const exactAnswer = Math.round(A / (1 + r_decimal));
    let options = [exactAnswer, Math.round(A / (1 - r_decimal)), Math.round(A * (1 - r_decimal)), Math.round(exactAnswer * (1 + (Math.random() * 0.1 + 0.05)))];
    return {
        hint: "公考资料分析 - 求基期量",
        question: { type: 'html', content: makeFrac(A, `1 + ${r_pct}%`) },
        correctAnswer: exactAnswer.toString(),
        options: options.map(String).sort(() => Math.random() - 0.5),
        explanation: `基期量 = 现期量 ÷ (1+增长率)。观察选项差距，截取分母前三位直除。`
    };
}

function generateGrowthAmountQuestion() {
    const A = Math.floor(Math.random() * 99000) + 1000;
    const r_pct = (Math.random() * 25 + 5).toFixed(1);
    const r_decimal = parseFloat(r_pct) / 100;
    const exactAnswer = Math.round((A / (1 + r_decimal)) * r_decimal);
    let options = [exactAnswer, Math.round(A * r_decimal), Math.round((A / (1 - r_decimal)) * r_decimal), Math.round(exactAnswer * (1 + (Math.random() * 0.2 + 0.1)))];
    return {
        hint: "公考资料分析 - 求增长量",
        question: { type: 'html', content: makeFrac(`${A} × ${r_pct}%`, `1 + ${r_pct}%`) },
        correctAnswer: exactAnswer.toString(),
        options: options.map(String).sort(() => Math.random() - 0.5),
        explanation: `利用“百化分”，将 ${r_pct}% 视作 1/n。套用公式：增长量 ≈ 现期量 ÷ (n + 1)。`
    };
}

function generateGrowthRateQuestion() {
    const B = Math.floor(Math.random() * 40000) + 10000;
    const A = B + Math.floor(Math.random() * B);
    const exactRate = ((A - B) / B) * 100;
    const exactAnswer = exactRate.toFixed(1) + '%';
    let options = [exactAnswer, (((A - B) / A) * 100).toFixed(1) + '%', (exactRate + (Math.random() * 3 + 2)).toFixed(1) + '%', (exactRate - (Math.random() * 3 + 2) < 0 ? exactRate + 15 : exactRate - (Math.random() * 3 + 2)).toFixed(1) + '%'];
    return {
        hint: "公考资料分析 - 求增长率",
        question: { type: 'html', content: makeFrac(`${A} - ${B}`, B) },
        correctAnswer: exactAnswer,
        options: options.sort(() => Math.random() - 0.5),
        explanation: `增长率 = (现期 - 基期) ÷ 基期。注意除法截位原则。`
    };
}

function generateBaseProportionQuestion() {
    const B = Math.floor(Math.random() * 80000) + 10000; 
    const minA = Math.floor(B * 0.1), maxA = Math.floor(B * 0.9);
    const A = Math.floor(Math.random() * (maxA - minA)) + minA;
    const a_pct = (Math.random() * 40 - 10).toFixed(1), b_pct = (Math.random() * 40 - 10).toFixed(1);
    const a = parseFloat(a_pct) / 100, b = parseFloat(b_pct) / 100;
    const exact = (A / B) * ((1 + b) / (1 + a));
    const exactStr = (exact * 100).toFixed(1) + '%';

    let finalOptions = Array.from(new Set([exactStr, ((A / B) * 100).toFixed(1) + '%', ((A / B) * ((1 + a) / (1 + b)) * 100).toFixed(1) + '%', (exact * 100 + 2.5).toFixed(1) + '%']));
    let offset = 0.04;
    while(finalOptions.length < 4) {
        finalOptions.push(((exact + offset) * 100).toFixed(1) + '%');
        finalOptions = Array.from(new Set(finalOptions));
        offset += 0.03; // 每次强制增加跨度，保证绝对不会重复
    }
    return {
        hint: "公考资料分析 - 求基期比重",
        question: { type: 'html', content: makeFrac(`${A} × (1 + ${b_pct}%)`, `${B} × (1 + ${a_pct}%)`) },
        correctAnswer: exactStr,
        options: finalOptions.sort(() => Math.random() - 0.5),
        explanation: `因为部分增速(${a_pct}%)与整体增速(${b_pct}%)的差值，决定了基期比重必定 ${a>b?'小于':'大于'} 现期比重！`
    };
}

function generateBaseDifferenceQuestion() {
    const A = Math.floor(Math.random() * 50000) + 40000, B = Math.floor(Math.random() * 20000) + 10000;
    const a_pct = (Math.random() * 30 - 5).toFixed(1), b_pct = (Math.random() * 30 - 5).toFixed(1);
    const exact = Math.round((A / (1 + a_pct/100)) - (B / (1 + b_pct/100)));
    let finalOptions = Array.from(new Set([exact, A - B, Math.round(A*(1-a_pct/100) - B*(1-b_pct/100)), Math.round(exact*1.05)])).map(String);
    // 替换原有的 while 循环
    let offset = 0.05;
    while (finalOptions.length < 4) {
        finalOptions.push(Math.round(exact * (1 + offset)).toString());
        finalOptions = Array.from(new Set(finalOptions));
        offset += 0.04;
    }
    return {
        hint: "公考资料分析 - 求基期和差",
        // 完美并排分式
        question: { type: 'html', content: makeFrac(A, `1 + ${a_pct}%`) + makeText(' - ') + makeFrac(B, `1 + ${b_pct}%`) },
        correctAnswer: exact.toString(),
        options: finalOptions.sort(() => Math.random() - 0.5),
        explanation: `先估算“现期差”(${A} - ${B})，再看 a 和 b 的大小排除干扰选项。`
    };
}

function generateOverallValueQuestion() {
    const A = Math.floor(Math.random() * 80000) + 10000;
    const p_pct = (Math.random() * 40 + 10).toFixed(1);
    const exact = Math.round(A / (parseFloat(p_pct)/100));
    let finalOptions = Array.from(new Set([exact, Math.round(A * (parseFloat(p_pct)/100)), Math.round(A / (1 - parseFloat(p_pct)/100)), Math.round(exact * 1.08)])).map(String);
    // 替换原有的 while 循环
    let offset = 0.05;
    while (finalOptions.length < 4) {
        finalOptions.push(Math.round(exact * (1 + offset)).toString());
        finalOptions = Array.from(new Set(finalOptions));
        offset += 0.03;
    }
    return {
        hint: "公考资料分析 - 求整体量",
        question: { type: 'html', content: makeFrac(A, `${p_pct}%`) },
        correctAnswer: exact.toString(),
        options: finalOptions.sort(() => Math.random() - 0.5),
        explanation: `整体 = 部分 ÷ 比重。如果百分数接近特殊分数 1/n，直接算 A × n。`
    };
}

// === 新增模式 1：平均值增长率 ===
function generateAverageGrowthRateQuestion() {
    // a: 总量增速, b: 份数增速 (公考常见范围 -10% ~ 30%)
    const a_pct = (Math.random() * 40 - 10).toFixed(1);
    const b_pct = (Math.random() * 40 - 10).toFixed(1);
    const a = parseFloat(a_pct) / 100;
    const b = parseFloat(b_pct) / 100;
    
    const exact = (a - b) / (1 + b);
    const exactStr = (exact * 100).toFixed(1) + '%';
    
    // 经典陷阱项
    const trap1 = ((a - b) * 100).toFixed(1) + '%'; // 陷阱：直接相减
    const trap2 = ((a - b) / (1 + a) * 100).toFixed(1) + '%'; // 陷阱：分母搞错
    const trap3 = ((exact + 0.02) * 100).toFixed(1) + '%';

    let finalOptions = Array.from(new Set([exactStr, trap1, trap2, trap3]));
    // 替换原有的 while 循环
    let offset = 0.03;
    while(finalOptions.length < 4) {
        finalOptions.push(((exact + offset) * 100).toFixed(1) + '%');
        finalOptions = Array.from(new Set(finalOptions));
        offset += 0.02;
    }
    return {
        hint: "公考资料分析 - 求平均值增长率",
        question: { type: 'html', content: makeFrac(`${a_pct}% - ${b_pct}%`, `1 + ${b_pct}%`) },
        correctAnswer: exactStr,
        options: finalOptions.sort(() => Math.random() - 0.5),
        explanation: `公式：(a - b) / (1 + b)。a 是总量增速，b 是份数增速。千万不要把分母记错成 a！`
    };
}

// === 新增模式 2：两期比重变化 ===
function generateTwoPeriodProportionQuestion() {
    const B = Math.floor(Math.random() * 80000) + 10000;
    const A = Math.floor(Math.random() * B * 0.8) + Math.floor(B * 0.1);
    const a_pct = (Math.random() * 40 - 10).toFixed(1);
    const b_pct = (Math.random() * 40 - 10).toFixed(1);
    const a = parseFloat(a_pct) / 100;
    const b = parseFloat(b_pct) / 100;
    
    const exact = (A / B) * ((a - b) / (1 + a));
    const exactStr = (exact * 100).toFixed(1) + '%';

    const trap1 = ((a - b) * 100).toFixed(1) + '%';
    const trap2 = ((A / B) * (a - b) * 100).toFixed(1) + '%'; // 漏了分母
    const trap3 = ((A / B) * ((a - b) / (1 + b)) * 100).toFixed(1) + '%'; // 错了分母

    let finalOptions = Array.from(new Set([exactStr, trap1, trap2, trap3]));
    // 替换原有的 while 循环
    let offset = 0.015;
    while(finalOptions.length < 4) {
        finalOptions.push(((exact + offset) * 100).toFixed(1) + '%');
        finalOptions = Array.from(new Set(finalOptions));
        offset += 0.01;
    }
    return {
        hint: "公考资料分析 - 两期比重变化",
        // 完美水平拼接两个分式
        question: { type: 'html', content: makeFrac(A, B) + makeText(' × ') + makeFrac(`${a_pct}% - ${b_pct}%`, `1 + ${a_pct}%`) },
        correctAnswer: exactStr,
        options: finalOptions.sort(() => Math.random() - 0.5),
        explanation: `公式：(A/B) × (a-b)/(1+a)。第一步：判方向，a(${a_pct}%)与b(${b_pct}%)相比定正负。第二步：因为 (A/B)/(1+a) 必定小于 1，所以结果的绝对值必定小于 |a - b|，结合选项秒杀！`
    };
}

// === 真题数据：消灭所有除号，嵌套变态分式 ===
const guangxi2023Data = [
    { hint: "求基期量", display: makeFrac('8059', '1 + 4.5%'), calc: 8059 / 1.045, format: 'number' },
    { hint: "求增长量", display: makeFrac('7586 × 12.5%', '1 + 12.5%'), calc: 7586 * 0.125 / 1.125, format: 'number' },
    // 恐怖的嵌套分式来袭！
    { hint: "复杂基期比重/倍数差", display: makeFrac( makeFrac('1591', '1 + 11.5%', 'small') + makeText(' - ') + makeFrac('1480', '1 + 26.8%', 'small'), makeFrac('8324', '1 + 6.3%', 'small') ), calc: ((1591 / 1.115) - (1480 / 1.268)) / (8324 / 1.063), format: 'percent' },
    { hint: "基期量之差", display: makeFrac('49303', '1 + 3.4%') + makeText(' - ') + makeFrac('8324', '1 + 6.3%'), calc: (49303 / 1.034) - (8324 / 1.063), format: 'number' },
    { hint: "比值计算", display: makeFrac('37.2%', '76.6%'), calc: 37.2 / 76.6, format: 'percent' },
    { hint: "求增长率", display: makeFrac('26593 - 23613', '23613'), calc: (26593 - 23613) / 23613, format: 'percent' },
    { hint: "求增长率", display: makeFrac('29919 - 26593', '26593'), calc: (29919 - 26593) / 26593, format: 'percent' },
    { hint: "求增长率", display: makeFrac('31231 - 29919', '29919'), calc: (31231 - 29919) / 29919, format: 'percent' }
];

function generateRealExamQuestion() {
    const q = guangxi2023Data[Math.floor(Math.random() * guangxi2023Data.length)];
    let exact = q.calc, correctStr = '', options = [];
    if (q.format === 'percent') {
        correctStr = (exact * 100).toFixed(1) + '%';
        options.push(correctStr, ((exact + 0.032) * 100).toFixed(1) + '%', ((exact - 0.015) * 100).toFixed(1) + '%', ((exact + 0.051) * 100).toFixed(1) + '%'); 
    } else {
        correctStr = Math.round(exact).toString();
        options.push(correctStr, Math.round(exact * 1.04).toString(), Math.round(exact * 0.96).toString(), Math.round(exact * 1.12).toString());
    }
    return {
        hint: `🔥 真题 - ${q.hint}`,
        question: { type: 'html', content: q.display }, // 真题全部交给新引擎渲染
        correctAnswer: correctStr,
        options: options.sort(() => Math.random() - 0.5),
        explanation: "这是真实省考数据提取的计算式！结合选项差距选出最接近的值即可。"
    };
}

export const questionGenerators = {
    'percent': generatePercentQuestion,
    'base': generateBasePeriodQuestion,
    'growth': generateGrowthAmountQuestion,
    'rate': generateGrowthRateQuestion,
    'baseProp': generateBaseProportionQuestion,
    'baseDiff': generateBaseDifferenceQuestion,
    'overall': generateOverallValueQuestion,
    'avgGrowth': generateAverageGrowthRateQuestion, // 新增
    'twoPeriod': generateTwoPeriodProportionQuestion, // 新增
    'realExam': generateRealExamQuestion
};