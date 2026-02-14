# 因果推断 · Interactive

**Rubin framework, DAG, IV, DID, RDD — modern causal inference**

[Open the App](https://hengzhe-science-classroom.github.io/HZ-causal-inference/) (coming soon)

Part of [Hengzhe's Science Classroom](https://hengzhe-science-classroom.github.io/hub/) · Tier 4 · Graduate

---

## Chapters

| # | Topic | Sections | Viz | Exercises |
|---|-------|----------|-----|-----------|
| **Part A** | **因果推断框架 (Causal Inference Frameworks)** | | | |
| 0 | 因果之问 (The Causal Question) | Simpson's paradox, correlation vs. causation, three eras of causal inference, identification strategies | 2 | 3 |
| 1 | 潜在结果框架 (Potential Outcomes & Rubin Causal Model) | Potential outcomes notation, individual/average treatment effects, SATE/PATE, SUTVA, assignment mechanisms | 3 | 4 |
| 2 | 结构因果模型与DAG (Structural Causal Models & DAGs) | SCM definition, DAG construction, chain/fork/collider, ladder of causation | 3 | 4 |
| 3 | d-分离与后门准则 (d-Separation & Backdoor Criterion) | d-separation rules, conditioning effects, backdoor criterion, front-door criterion, adjustment formula | 3 | 5 |
| 4 | do-演算基础 (Basics of do-Calculus) | do-operator, three rules, truncated factorization, identifiability | 2 | 4 |
| **Part B** | **随机化实验 (Randomized Experiments)** | | | |
| 5 | 随机对照试验 (Randomized Controlled Trials) | Fisher exact test, Neyman inference, variance estimation, finite-sample vs. super-population | 3 | 4 |
| 6 | 实验设计进阶 (Advanced Experimental Design) | Stratified randomization, cluster randomization, factorial designs, CATE, multiple testing | 3 | 4 |
| 7 | 统计功效与A/B测试 (Power Analysis & A/B Testing) | Power curves, MDE, sequential testing, peeking problem, multi-armed bandits | 3 | 4 |
| **Part C** | **选择偏差与匹配 (Selection Bias & Matching)** | | | |
| 8 | 选择偏差与混杂 (Selection Bias & Confounding) | Selection bias, omitted variable bias, ignorability, overlap/positivity | 3 | 4 |
| 9 | 倾向得分方法 (Propensity Score Methods) | PS estimation, matching, subclassification, IPW, covariate balance diagnostics | 4 | 5 |
| 10 | 双重稳健估计 (Doubly Robust Estimation) | AIPW, double robustness, TMLE, cross-fitting, efficiency bounds | 3 | 4 |
| **Part D** | **工具变量与回归断点 (IV & RDD)** | | | |
| 11 | 工具变量 (Instrumental Variables) | IV conditions, Wald estimator, 2SLS, LATE, complier types, classic examples | 4 | 5 |
| 12 | 弱工具变量与过度识别 (Weak Instruments & Overidentification) | Weak IV bias, Stock-Yogo, Anderson-Rubin, Sargan/Hansen J-test, LIML | 3 | 3 |
| 13 | 回归断点设计 (Regression Discontinuity Design) | Sharp/fuzzy RDD, local polynomial, bandwidth selection, McCrary test | 4 | 4 |
| **Part E** | **面板数据方法 (Panel Data Methods)** | | | |
| 14 | 固定效应与面板数据 (Fixed Effects & Panel Data) | Within estimator, TWFE, strict exogeneity, Hausman test, Mundlak | 3 | 4 |
| 15 | 双重差分法 (Difference-in-Differences) | Canonical DID, parallel trends, event study, placebo tests, triple differences | 3 | 4 |
| 16 | 交错处理双重差分 (Staggered DID & Modern Extensions) | TWFE problems, Goodman-Bacon, Callaway-Sant'Anna, Sun-Abraham, de Chaisemartin-D'Haultfoeuille | 4 | 4 |
| 17 | 合成控制法 (Synthetic Control Method) | Synthetic control weights, placebo inference, augmented/generalized synthetic control | 3 | 4 |
| **Part F** | **高级主题 (Advanced Topics)** | | | |
| 18 | 中介分析与敏感性分析 (Mediation & Sensitivity Analysis) | NDE/NIE, sequential ignorability, Rosenbaum bounds, E-value, Cinelli-Hazlett benchmarking | 3 | 4 |
| 19 | 异质处理效应与因果发现 (Heterogeneous Effects & Causal Discovery) | CATE, causal forests, meta-learners, PC algorithm, interference, Bayesian causal inference | 4 | 4 |
| | **Total** | | **~65** | **~80** |

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
- **Potential Outcomes Lab** — Fill in counterfactual tables, compute treatment effects, explore SUTVA violations
- **Propensity Score Suite** — Overlap plots, love plots, IPW weight diagnostics, all linked and reactive
- **RDD Toolkit** — Scatter plots with adjustable bandwidth, polynomial order, McCrary density tests
- **DID Studio** — Parallel trends, event studies, Goodman-Bacon decomposition, staggered adoption timelines
- **Synthetic Control Lab** — Construct synthetic units, visualize gaps, run placebo spaghetti plots
- **Causal Forest Explorer** — CATE surfaces, variable importance, sorted group effects (GATES)
- **Sensitivity Dashboard** — Rosenbaum bounds, E-values, bias contour plots
- **Monte Carlo Engine** — Run simulations for every estimator, compare bias/variance/coverage across methods
- **do-Calculus Derivation Stepper** — Step through identification proofs rule by rule with animated DAGs

---

## Quick Start

```bash
git clone https://github.com/Hengzhe-Science-Classroom/HZ-causal-inference.git
cd HZ-causal-inference
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## License

MIT
