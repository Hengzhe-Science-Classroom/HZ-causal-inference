# 因果推断 · Interactive

**Causal Inference — from potential outcomes & DAGs to modern panel data methods**

[Open the App](https://hengzhe-science-classroom.github.io/HZ-causal-inference/) · [Visit the website](https://hengzhe-science-classroom.github.io/hub/)

Part of [Hengzhe's Science Classroom](https://hengzhe-science-classroom.github.io/hub/) · Tier 4 · Graduate

---

## Chapters

| # | Topic | Sections | Viz | Exercises |
|---|-------|----------|-----|-----------|
| **Part A** | **因果推断框架 (Causal Inference Frameworks)** | | | |
| 0 | The Causal Question 因果问题 | 5 | 4 | 18 |
| 1 | Potential Outcomes Framework 潜在结果框架 | 5 | 5 | 19 |
| 2 | Structural Causal Models & DAGs 结构因果模型与有向无环图 | 5 | 5 | 18 |
| 3 | d-Separation & Conditional Independence d-分离与条件独立 | 5 | 5 | 19 |
| 4 | do-Calculus & Identification do-演算与可识别性 | 5 | 4 | 18 |
| **Part B** | **随机化实验 (Randomized Experiments)** | | | |
| 5 | Randomized Controlled Trials 随机对照试验 | 5 | 5 | 19 |
| 6 | Advanced Experimental Design 高级实验设计 | 5 | 5 | 18 |
| 7 | Statistical Power & A/B Testing 统计功效与A/B测试 | 5 | 5 | 19 |
| **Part C** | **选择偏差与匹配 (Selection Bias & Matching)** | | | |
| 8 | Selection Bias & Confounding 选择偏差与混杂 | 5 | 5 | 19 |
| 9 | Propensity Score Methods 倾向得分方法 | 5 | 5 | 19 |
| 10 | Doubly Robust Estimation 双重稳健估计 | 5 | 5 | 18 |
| **Part D** | **工具变量与回归断点 (IV & RDD)** | | | |
| 11 | Instrumental Variables 工具变量 | 5 | 5 | 19 |
| 12 | Weak Instruments & Many IVs 弱工具变量与多工具变量 | 5 | 5 | 18 |
| 13 | Regression Discontinuity Design 回归断点设计 | 5 | 5 | 18 |
| **Part E** | **面板数据方法 (Panel Data Methods)** | | | |
| 14 | Fixed Effects & Within Estimation 固定效应与组内估计 | 5 | 5 | 18 |
| 15 | Difference-in-Differences 双重差分 | 5 | 5 | 19 |
| 16 | Staggered DiD & Event Studies 交错DID与事件研究 | 5 | 5 | 19 |
| 17 | Synthetic Control Methods 合成控制法 | 5 | 5 | 18 |
| **Part F** | **高级主题 (Advanced Topics)** | | | |
| 18 | Mediation Analysis & Sensitivity 中介分析与敏感性分析 | 5 | 5 | 19 |
| 19 | Heterogeneous Treatment Effects & Discovery 异质性处理效应与发现 | 5 | 5 | 19 |
| | **Total** | **95** | **93** | **375** |

---

## References

1. **Imbens, G. W. & Rubin, D. B.** (2015). *Causal Inference for Statistics, Social, and Biomedical Sciences: An Introduction.* Cambridge University Press.
2. **Pearl, J.** (2009). *Causality: Models, Reasoning, and Inference* (2nd ed.). Cambridge University Press.
3. **Cunningham, S.** (2021). *Causal Inference: The Mixtape.* Yale University Press. [Free online](https://mixtape.scunning.com/)
4. **Hernan, M. A. & Robins, J. M.** (2020). *Causal Inference: What If.* Chapman & Hall/CRC. [Free online](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/)
5. **Angrist, J. D. & Pischke, J.-S.** (2009). *Mostly Harmless Econometrics: An Empiricist's Companion.* Princeton University Press.

---

## Features

- **Interactive DAG Editor** — Build, edit, and test d-separation on causal graphs with real-time feedback
- **Potential Outcomes Lab** — Explore counterfactual tables, compute ATE/ATT/ATU, visualize selection bias
- **Propensity Score Suite** — Overlap plots, Love plots, IPW weight diagnostics
- **RDD Toolkit** — Scatter plots with adjustable bandwidth, polynomial order, McCrary density tests
- **DiD Studio** — Parallel trends, event studies, Goodman-Bacon decomposition, staggered adoption
- **Synthetic Control Lab** — Construct synthetic units, visualize gaps, run placebo spaghetti plots
- **Causal Forest Explorer** — CATE surfaces, causal trees, meta-learner comparison
- **Sensitivity Dashboard** — Rosenbaum bounds, E-values, bias contour plots
- **do-Calculus Stepper** — Step through identification proofs rule by rule with animated DAGs

---

## Quick Start

No build tools needed — just open `index.html` in your browser.

```bash
git clone https://github.com/Hengzhe-Science-Classroom/HZ-causal-inference.git
cd HZ-causal-inference
open index.html
```

---

## License

AGPL-3.0 & Commercial — see [LICENSE-AGPL](LICENSE-AGPL) and [LICENSE-COMMERCIAL](LICENSE-COMMERCIAL).
