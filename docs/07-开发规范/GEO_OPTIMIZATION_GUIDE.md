# GEO (Generative Engine Optimization) 优化指南

**版本**: 1.0  
**日期**: 2026-03-21  
**优先级**: P0 - 关键要求  
**适用范围**: 所有内容页面

---

## 🎯 GEO 目标

针对 AI 搜索引擎（如 Google SGE、Bing Chat、Perplexity）进行优化，提高在生成式搜索结果中的曝光率。

---

## 📋 GEO 核心策略

### 1. 内容结构优化

#### 1.1 答案导向写作

**原则**: 直接、明确地回答问题，便于 AI 提取。

**示例**:
```markdown
<!-- ✅ GEO 优化示例 -->
## What is a Planetary Ball Mill?

A planetary ball mill is a type of grinding equipment that uses planetary motion to grind materials. 
It features one or more grinding jars that rotate around their own axis while simultaneously revolving 
around a central sun wheel. This dual motion creates high energy impacts, making it ideal for fine 
and ultra-fine grinding applications.

**Key Features:**
- Planetary motion for high energy grinding
- Variable speed control (0-800 rpm)
- Multiple grinding jar options (50ml - 2000ml)
- Suitable for wet and dry grinding
- Particle size down to 0.1μm

**Applications:**
- Geological sample preparation
- Mineral processing
- Ceramic materials
- Chemical compounds
- Pharmaceutical ingredients
```

**对比**:
```markdown
<!-- ❌ 非 GEO 优化示例 -->
## About Our Mill

Our company makes ball mills. They are good quality and many customers use them. 
Contact us for more information.
```

---

#### 1.2 FAQ 结构化

**要求**:
- 使用自然语言提问
- 提供完整答案
- 包含关键词
- 使用 FAQPage Schema

**示例**:
```typescript
// apps/web/src/components/faq/FAQSection.tsx
const faqs = [
  {
    question: 'What is the maximum speed of the PM-400 Planetary Ball Mill?',
    answer: 'The PM-400 Planetary Ball Mill has a maximum speed of 800 rpm (revolutions per minute). The speed is variable from 0 to 800 rpm, allowing precise control for different grinding applications.'
  },
  {
    question: 'How many grinding jars can the PM-400 accommodate?',
    answer: 'The PM-400 can accommodate up to 4 grinding jars simultaneously. Each jar has a maximum capacity of 500ml, giving a total working volume of 2000ml. The jars are available in various materials including agate, stainless steel, zirconia, and tungsten carbide.'
  },
  {
    question: 'What is the minimum particle size achievable with this mill?',
    answer: 'The PM-400 can achieve particle sizes down to 0.1 micrometers (μm) depending on the material being ground and the grinding media used. For most applications, a particle size of 1-10 μm is commonly achieved within 30-60 minutes of grinding time.'
  }
];

// 生成 FAQPage Schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
};
```

---

### 2. 数据呈现优化

#### 2.1 表格化数据

**原则**: AI 更容易从结构化的表格中提取信息。

**示例**:
```typescript
// apps/web/src/components/products/SpecificationsTable.tsx
const specifications = {
  'Model': 'PM-400',
  'Power Supply': '220V/50Hz',
  'Motor Power': '2.2 kW',
  'Speed Range': '0-800 rpm',
  'Jar Capacity': '4 x 500ml',
  'Max Loading Capacity': '2/3 of jar volume',
  'Feeding Size': '< 10mm',
  'Discharging Size': '0.1μm',
  'Noise Level': '< 60dB',
  'Weight': '180kg',
  'Dimensions': '650 x 550 x 850mm'
};

export function SpecificationsTable({ specs }: { specs: typeof specifications }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Specification</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(specs).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

#### 2.2 列表化内容

**原则**: 使用清晰的列表呈现信息。

**示例**:
```markdown
## Advantages of Planetary Ball Mills

**High Energy Efficiency:**
- Planetary motion creates centrifugal forces up to 40g
- Impact energy 3-5x higher than conventional ball mills
- Faster grinding time (typically 30-60 minutes)

**Versatile Applications:**
- Suitable for hard, soft, brittle, and fibrous materials
- Compatible with wet and dry grinding
- Supports cryogenic grinding

**Precise Control:**
- Variable speed control (0-800 rpm)
- Programmable grinding cycles
- Automatic direction reversal

**Safety Features:**
- Safety lock system
- Overload protection
- Emergency stop button
- Ventilated safety cover
```

---

### 3. 权威性建立

#### 3.1 引用和数据来源

**原则**: 提供可验证的数据和引用，增强可信度。

**示例**:
```markdown
## Industry Recognition

**Certifications:**
- ISO 9001:2015 Quality Management System (Certificate No: ISO-2024-001)
- CE Certification (EU Safety Standards)
- SGS Testing Report (Report No: SGS-2024-PM400)

**Market Presence:**
- 500+ enterprise customers worldwide (as of 2026)
- Exported to 50+ countries across 6 continents
- 10,000+ units sold since 2006

**Industry Partnerships:**
- Member of China Association of Heavy Machinery Industry
- Strategic partner with 10+ research institutions
- Authorized supplier for Fortune 500 companies
```

---

#### 3.2 专家观点

**示例**:
```markdown
## Expert Insights

**Dr. John Smith**, Professor of Materials Science at MIT:
> "Planetary ball mills have become essential equipment for advanced materials research. 
> The PM-400 series offers excellent performance-to-cost ratio for laboratory applications."

**Industry Report** (Grand View Research, 2024):
> "The global ball mill market is expected to reach $1.2 billion by 2030, growing at a CAGR of 5.2%. 
> Planetary ball mills represent the fastest-growing segment due to their versatility and efficiency."
```

---

### 4. 自然语言优化

#### 4.1 对话式写作

**原则**: 使用自然、对话式的语言，便于 AI 理解和提取。

**示例**:
```markdown
<!-- ✅ 对话式写作 -->
## How Does It Work?

Here's how the PM-400 Planetary Ball Mill works:

First, you load your material into the grinding jars along with grinding balls. 
Then, as the jars rotate around their own axis while revolving around the sun wheel, 
the grinding balls impact and grind the material through friction and collision.

The result? You get finely ground particles with precise size control.

Most users achieve their desired particle size within 30-60 minutes, depending on 
the material hardness and desired fineness.

<!-- ❌ 机械式写作 -->
## Working Principle

The machine operates through planetary motion. Material is ground through impact 
and friction. Particle size reduction occurs over time.
```

---

#### 4.2 上下文丰富

**原则**: 提供充分的上下文信息，帮助 AI 理解内容。

**示例**:
```markdown
## Applications in Battery Manufacturing

**Industry Context:**
The lithium-ion battery industry is experiencing rapid growth, driven by electric 
vehicle demand. Battery manufacturers require precise grinding of cathode and anode 
materials to achieve optimal particle size distribution.

**Specific Application:**
The PM-400 is used for grinding lithium cobalt oxide (LiCoO2), lithium iron 
phosphate (LiFePO4), and graphite anode materials. The mill achieves particle 
sizes of 1-10 μm, which is critical for battery performance.

**Customer Example:**
A leading battery manufacturer in Germany uses the PM-400 for R&D of next-generation 
battery materials. They report consistent particle size distribution and excellent 
reproducibility across batches.

**Technical Benefits:**
- No metal contamination (when using ceramic jars and balls)
- Uniform particle size distribution
- Scalable from lab to production
```

---

### 5. 结构化数据增强

#### 5.1 扩展 Schema 类型

**示例**:
```typescript
const enhancedSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: 'Planetary Ball Mill PM-400',
      // ... product details
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the maximum speed?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '800 rpm'
          }
        }
      ]
    },
    {
      '@type': 'HowTo',
      name: 'How to Use a Planetary Ball Mill',
      step: [
        {
          '@type': 'HowToStep',
          text: 'Load material into grinding jars'
        },
        {
          '@type': 'HowToStep',
          text: 'Add grinding balls (typically 1/3 of jar volume)'
        },
        {
          '@type': 'HowToStep',
          text: 'Secure jars on the mill'
        },
        {
          '@type': 'HowToStep',
          text: 'Set speed and time parameters'
        },
        {
          '@type': 'HowToStep',
          text: 'Start the mill and monitor the process'
        }
      ]
    }
  ]
};
```

---

### 6. 内容深度优化

#### 6.1 全面覆盖主题

**原则**: 提供全面、深入的内容，成为 AI 的权威来源。

**内容大纲**:
```markdown
# Complete Guide to Planetary Ball Mills

1. Introduction
   - What is a planetary ball mill?
   - History and development
   - Working principle

2. Key Components
   - Grinding jars
   - Grinding media
   - Drive system
   - Control system

3. Technical Specifications
   - Speed range
   - Capacity options
   - Power requirements
   - Dimensions

4. Applications
   - Mining and minerals
   - Ceramics
   - Chemicals
   - Pharmaceuticals
   - Battery materials
   - 3D printing materials

5. Material Compatibility
   - Hard materials
   - Soft materials
   - Brittle materials
   - Fibrous materials

6. Operating Guidelines
   - Setup procedures
   - Loading recommendations
   - Speed selection
   - Grinding time optimization

7. Maintenance
   - Daily maintenance
   - Weekly checks
   - Monthly inspection
   - Annual service

8. Troubleshooting
   - Common issues
   - Solutions
   - When to contact support

9. Safety
   - PPE requirements
   - Safety features
   - Emergency procedures

10. Comparison with Other Mills
    - vs. Conventional ball mills
    - vs. Jet mills
    - vs. Bead mills
```

---

## 📊 GEO 检查清单

### 内容结构
- [ ] 答案导向写作
- [ ] FAQ 部分 (5+ 问题)
- [ ] 表格化数据
- [ ] 列表化内容
- [ ] 对话式语气
- [ ] 丰富的上下文

### 权威性
- [ ] 引用数据来源
- [ ] 专家观点
- [ ] 客户案例
- [ ] 行业认证
- [ ] 统计数据

### 结构化数据
- [ ] Product Schema
- [ ] FAQPage Schema
- [ ] HowTo Schema
- [ ] Article Schema
- [ ] Organization Schema

### 自然语言
- [ ] 自然问题形式
- [ ] 完整答案
- [ ] 对话式写作
- [ ] 上下文丰富
- [ ] 易于理解

---

## ⚠️ 全英文网站约束

**所有 GEO 相关内容必须使用英文**:
- ✅ FAQ 问题和答案：英文
- ✅ 表格内容：英文
- ✅ 列表内容：英文
- ✅ 结构化数据：英文
- ✅ 引用和案例：英文

---

## 📈 GEO 监控

### 监控指标
- AI 搜索结果曝光率
- 生成答案引用率
- 品牌提及率
- 问题排名位置

### 工具
- Google Search Console (SGE 报告)
- Bing Webmaster Tools
- Perplexity Business
- SEMrush (AI 跟踪功能)

---

**文档维护**: 技术部 + 市场部  
**最后更新**: 2026-03-21  
**下次审查**: 2026-04-21
