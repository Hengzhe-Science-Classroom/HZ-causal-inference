window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch09',
    number: 9,
    title: 'Propensity Score Methods',
    subtitle: 'Dimension Reduction for Causal Inference',
    sections: [
        // ============================================================
        // Section 1: Propensity Score Definition & Properties
        // ============================================================
        {
            id: 'ch09-sec01',
            title: 'Propensity Score Definition & Properties',
            content: `
                <h2>Propensity Score Definition & Properties</h2>

                <p>In observational studies, treatment assignment depends on a potentially high-dimensional vector of covariates \\(X \\in \\mathbb{R}^p\\). When \\(p\\) is large, exact matching or stratification on \\(X\\) becomes infeasible — a manifestation of the <strong>curse of dimensionality</strong>. The propensity score, introduced by Rosenbaum and Rubin (1983), provides a remarkable solution: it reduces the \\(p\\)-dimensional matching problem to a one-dimensional one.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 9.1 (Propensity Score)</div>
                    <div class="env-body">
                        <p>The <strong>propensity score</strong> is the conditional probability of receiving treatment given observed covariates:</p>
                        \\[e(x) = P(W = 1 \\mid X = x)\\]
                        <p>where \\(W \\in \\{0, 1\\}\\) is the treatment indicator and \\(X\\) is the vector of pre-treatment covariates.</p>
                    </div>
                </div>

                <p>The propensity score is a <strong>balancing score</strong>: it is the coarsest function of \\(X\\) that makes treatment assignment independent of the covariates. This means that within strata defined by the same propensity score value, the distribution of covariates is the same for treated and control units.</p>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 9.1 (Balancing Property)</div>
                    <div class="env-body">
                        <p>The propensity score \\(e(X)\\) satisfies:</p>
                        \\[W \\perp\\!\\!\\!\\perp X \\mid e(X)\\]
                        <p>That is, conditional on the propensity score, treatment assignment is independent of all observed covariates.</p>
                    </div>
                </div>

                <div class="env-block proof">
                    <div class="env-title">Proof</div>
                    <div class="env-body">
                        <p>For any measurable set \\(A\\) in the covariate space:</p>
                        \\[P(W = 1 \\mid X \\in A,\\, e(X) = e) = E[W \\mid X \\in A,\\, e(X) = e]\\]
                        <p>Since \\(e(X) = e\\) implies \\(P(W=1 \\mid X) = e\\) for any \\(X\\) in the conditioning set, we get:</p>
                        \\[E[W \\mid X \\in A,\\, e(X) = e] = E\\bigl[E[W \\mid X] \\mid X \\in A,\\, e(X) = e\\bigr] = E[e(X) \\mid X \\in A,\\, e(X) = e] = e\\]
                        <p>This does not depend on \\(A\\), establishing the result. \\(\\square\\)</p>
                    </div>
                </div>

                <p>The key theoretical result that justifies propensity score methods for causal inference is the following:</p>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 9.2 (Rosenbaum & Rubin, 1983)</div>
                    <div class="env-body">
                        <p>If unconfoundedness holds given \\(X\\):</p>
                        \\[(Y(1), Y(0)) \\perp\\!\\!\\!\\perp W \\mid X\\]
                        <p>then unconfoundedness also holds given the propensity score alone:</p>
                        \\[(Y(1), Y(0)) \\perp\\!\\!\\!\\perp W \\mid e(X)\\]
                    </div>
                </div>

                <div class="env-block proof">
                    <div class="env-title">Proof sketch</div>
                    <div class="env-body">
                        <p>By iterated expectations, for any event \\(B\\) in the outcome space:</p>
                        \\[P(Y(w) \\in B, W = 1 \\mid e(X)) = E\\bigl[P(Y(w) \\in B, W = 1 \\mid X) \\mid e(X)\\bigr]\\]
                        <p>By unconfoundedness given \\(X\\), this equals:</p>
                        \\[E\\bigl[P(Y(w) \\in B \\mid X) \\cdot P(W = 1 \\mid X) \\mid e(X)\\bigr] = E\\bigl[P(Y(w) \\in B \\mid X) \\cdot e(X) \\mid e(X)\\bigr]\\]
                        \\[= e(X) \\cdot E\\bigl[P(Y(w) \\in B \\mid X) \\mid e(X)\\bigr] = P(W = 1 \\mid e(X)) \\cdot P(Y(w) \\in B \\mid e(X))\\]
                        <p>which establishes the conditional independence. \\(\\square\\)</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition: Why Is This Remarkable?</div>
                    <div class="env-body">
                        <p>The propensity score theorem says that we can replace a high-dimensional conditioning set \\(X = (X_1, \\ldots, X_p)\\) with a single scalar \\(e(X) \\in [0, 1]\\). Instead of matching on all \\(p\\) covariates simultaneously, we need only match on a single number. This is a dramatic reduction in complexity — but it comes with an important caveat: we must know or correctly estimate \\(e(X)\\).</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 9.2 (Sufficient Dimension Reduction)</div>
                    <div class="env-body">
                        <p>A function \\(b(X)\\) is a <strong>balancing score</strong> if \\(W \\perp\\!\\!\\!\\perp X \\mid b(X)\\). The propensity score \\(e(X)\\) is the <strong>coarsest</strong> balancing score: every other balancing score \\(b(X)\\) is at least as fine as \\(e(X)\\), meaning \\(e(X) = g(b(X))\\) for some function \\(g\\).</p>
                    </div>
                </div>

                <p>This coarseness property means the propensity score achieves the maximal dimension reduction while preserving the balancing property. Any finer summary (such as \\(X\\) itself) also balances, but at the cost of higher dimensionality.</p>

                <div class="viz-placeholder" data-viz="ch09-viz-dimension-reduction"></div>
            `,
            visualizations: [
                {
                    id: 'ch09-viz-dimension-reduction',
                    title: 'Dimension Reduction via Propensity Score',
                    description: 'High-dimensional covariates are mapped to a single scalar propensity score. Drag the slider to change the number of covariates and observe how the propensity score compresses all information relevant for treatment assignment into one dimension.',
                    setup(container, controls) {
                        const viz = new VizEngine(container, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 1
                        });

                        let nCovariates = 5;
                        let seed = 42;

                        function seededRandom(s) {
                            s = Math.sin(s) * 10000;
                            return s - Math.floor(s);
                        }

                        function generateData(p, n) {
                            const treated = [];
                            const control = [];
                            for (let i = 0; i < n; i++) {
                                const covs = [];
                                let score = 0;
                                for (let j = 0; j < p; j++) {
                                    const v = seededRandom(seed + i * 100 + j) * 2 - 1;
                                    covs.push(v);
                                    score += v * (0.5 + 0.3 * seededRandom(seed + j * 7));
                                }
                                const ps = 1 / (1 + Math.exp(-score));
                                const w = seededRandom(seed + i * 200 + 99) < ps ? 1 : 0;
                                if (w === 1) treated.push({ covs, ps });
                                else control.push({ covs, ps });
                            }
                            return { treated, control };
                        }

                        function draw() {
                            const ctx = viz.ctx;
                            viz.clear();

                            const data = generateData(nCovariates, 120);
                            const { treated, control } = data;

                            // Left panel: High-dimensional space (show first 2 dims)
                            const lx = 140, ly = 170;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(`Covariate Space (p = ${nCovariates})`, lx, 30);
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Showing first 2 of p dimensions', lx, 48);

                            // Axes for left panel
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(40, ly + 120);
                            ctx.lineTo(240, ly + 120);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(40, ly - 100);
                            ctx.lineTo(40, ly + 120);
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('X\u2081', 140, ly + 135);
                            ctx.save();
                            ctx.translate(28, ly + 10);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('X\u2082', 0, 0);
                            ctx.restore();

                            // Plot points in 2D projection
                            for (const t of treated) {
                                const sx = lx + t.covs[0] * 80;
                                const sy = ly - (t.covs.length > 1 ? t.covs[1] : 0) * 80;
                                ctx.fillStyle = viz.colors.blue + '99';
                                ctx.beginPath();
                                ctx.arc(sx, sy, 4, 0, Math.PI * 2);
                                ctx.fill();
                            }
                            for (const c of control) {
                                const sx = lx + c.covs[0] * 80;
                                const sy = ly - (c.covs.length > 1 ? c.covs[1] : 0) * 80;
                                ctx.fillStyle = viz.colors.orange + '99';
                                ctx.beginPath();
                                ctx.arc(sx, sy, 4, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Arrow
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(260, ly);
                            ctx.lineTo(320, ly);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            // Arrowhead
                            ctx.fillStyle = viz.colors.green;
                            ctx.beginPath();
                            ctx.moveTo(325, ly);
                            ctx.lineTo(315, ly - 6);
                            ctx.lineTo(315, ly + 6);
                            ctx.closePath();
                            ctx.fill();

                            ctx.fillStyle = viz.colors.green;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('e(X)', 293, ly - 12);

                            // Right panel: 1D propensity score
                            const rx = 430, ry = 60;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Propensity Score (1D)', rx, 30);

                            // Vertical axis for PS
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(rx, ry);
                            ctx.lineTo(rx, ry + 280);
                            ctx.stroke();

                            // Labels 0 and 1
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system, sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('1.0', rx - 8, ry);
                            ctx.fillText('0.5', rx - 8, ry + 140);
                            ctx.fillText('0.0', rx - 8, ry + 280);

                            // Tick marks
                            ctx.strokeStyle = viz.colors.text;
                            ctx.lineWidth = 0.5;
                            for (let v = 0; v <= 1; v += 0.5) {
                                const yy = ry + 280 - v * 280;
                                ctx.beginPath();
                                ctx.moveTo(rx - 4, yy);
                                ctx.lineTo(rx + 4, yy);
                                ctx.stroke();
                            }

                            // Plot PS values with jitter
                            for (let i = 0; i < treated.length; i++) {
                                const t = treated[i];
                                const sy = ry + 280 - t.ps * 280;
                                const jx = rx + 10 + seededRandom(seed + i * 300) * 30;
                                ctx.fillStyle = viz.colors.blue + '99';
                                ctx.beginPath();
                                ctx.arc(jx, sy, 3.5, 0, Math.PI * 2);
                                ctx.fill();
                            }
                            for (let i = 0; i < control.length; i++) {
                                const c = control[i];
                                const sy = ry + 280 - c.ps * 280;
                                const jx = rx - 10 - seededRandom(seed + i * 400) * 30;
                                ctx.fillStyle = viz.colors.orange + '99';
                                ctx.beginPath();
                                ctx.arc(jx, sy, 3.5, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(60, 375, 5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Treated (W=1)', 70, 378);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(200, 375, 5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Control (W=0)', 210, 378);

                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'center';
                            ctx.font = '10px -apple-system, sans-serif';
                            ctx.fillText(`${nCovariates}D covariates \u2192 1D score`, 280, 395);
                        }

                        VizEngine.createSlider(controls, 'Covariates (p)', 2, 20, nCovariates, 1, v => {
                            nCovariates = v;
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Sample', () => {
                            seed = Math.floor(Math.random() * 10000);
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove the balancing property of the propensity score: show that \\(W \\perp\\!\\!\\!\\perp X \\mid e(X)\\). That is, show \\(P(W = 1 \\mid X, e(X)) = P(W = 1 \\mid e(X))\\).',
                    hint: 'Start with \\(P(W=1 \\mid X, e(X))\\). Since \\(e(X)\\) is a deterministic function of \\(X\\), conditioning on both \\(X\\) and \\(e(X)\\) is the same as conditioning on \\(X\\) alone.',
                    solution: `Since \\(e(X)\\) is a function of \\(X\\), conditioning on \\((X, e(X))\\) is the same as conditioning on \\(X\\):
                        \\[P(W=1 \\mid X, e(X)) = P(W=1 \\mid X) = e(X)\\]
                        Now consider \\(P(W=1 \\mid e(X))\\):
                        \\[P(W=1 \\mid e(X)) = E[W \\mid e(X)] = E[E[W \\mid X] \\mid e(X)] = E[e(X) \\mid e(X)] = e(X)\\]
                        Both equal \\(e(X)\\), so \\(P(W=1 \\mid X, e(X)) = P(W=1 \\mid e(X))\\), establishing \\(W \\perp\\!\\!\\!\\perp X \\mid e(X)\\).`
                },
                {
                    question: 'Suppose \\(X \\in \\mathbb{R}^{100}\\) (100 covariates). Explain why exact matching on \\(X\\) is practically impossible, but matching on \\(e(X)\\) is feasible. What assumption must hold for the propensity score approach to be valid?',
                    hint: 'Think about the curse of dimensionality: how many cells would a 100-dimensional grid require? Then consider what the Rosenbaum-Rubin theorem guarantees.',
                    solution: `With 100 covariates, even coarsely discretizing each into just 2 bins would create \\(2^{100} \\approx 10^{30}\\) cells. With any realistic sample size, almost all cells would be empty, making exact matching on \\(X\\) impossible. In contrast, \\(e(X) \\in [0,1]\\) is a scalar, so matching treated to control units with similar propensity scores is computationally and statistically feasible. The critical assumption is <strong>unconfoundedness</strong> \\((Y(1), Y(0)) \\perp\\!\\!\\!\\perp W \\mid X\\): all confounders must be included in \\(X\\). Without this, \\(e(X)\\) would not balance unmeasured confounders.`
                },
                {
                    question: 'Show that if \\(b(X)\\) is any balancing score (i.e., \\(W \\perp\\!\\!\\!\\perp X \\mid b(X)\\)), then \\(e(X) = g(b(X))\\) for some function \\(g\\). This shows the propensity score is the coarsest balancing score.',
                    hint: 'Compute \\(e(X) = P(W=1 \\mid X)\\) and use the fact that \\(W \\perp\\!\\!\\!\\perp X \\mid b(X)\\) to simplify.',
                    solution: `Since \\(b(X)\\) is a balancing score, \\(P(W=1 \\mid X, b(X)) = P(W=1 \\mid b(X))\\). But \\(b(X)\\) is a function of \\(X\\), so conditioning on \\((X, b(X))\\) equals conditioning on \\(X\\):
                        \\[e(X) = P(W=1 \\mid X) = P(W=1 \\mid X, b(X)) = P(W=1 \\mid b(X))\\]
                        The last expression depends on \\(X\\) only through \\(b(X)\\). Defining \\(g(b) = P(W=1 \\mid b(X) = b)\\), we get \\(e(X) = g(b(X))\\). This means the propensity score is a function of any balancing score, making it the coarsest.`
                },
                {
                    question: 'Let \\(X = (X_1, X_2)\\) where \\(X_1 \\sim \\text{Bernoulli}(0.5)\\) and \\(X_2 \\sim N(0,1)\\), with \\(W \\mid X \\sim \\text{Bernoulli}(\\text{logit}^{-1}(X_1 + 0.5 X_2))\\). Compute \\(e(x_1, x_2)\\) and verify the balancing property by computing \\(E[X_1 \\mid e(X) = e_0]\\) for a fixed \\(e_0\\).',
                    hint: 'The propensity score is simply the logistic function of the linear predictor. For the balancing property, note that fixing \\(e(X) = e_0\\) constrains the relationship between \\(X_1\\) and \\(X_2\\).',
                    solution: `The propensity score is \\(e(x_1, x_2) = \\frac{1}{1 + \\exp(-(x_1 + 0.5 x_2))}\\). To verify balancing, fix \\(e(X) = e_0\\). This means \\(x_1 + 0.5 x_2 = \\text{logit}(e_0)\\). For \\(x_1 = 1\\): \\(x_2 = 2(\\text{logit}(e_0) - 1)\\), and for \\(x_1 = 0\\): \\(x_2 = 2 \\text{logit}(e_0)\\). The conditional distribution of \\(X_1\\) given \\(e(X) = e_0\\) depends on the joint density, and we can verify:
                        \\[P(W=1 \\mid X_1 = 1, e(X)=e_0) = P(W=1 \\mid X_1 = 0, e(X)=e_0) = e_0\\]
                        This holds because both cases have the same propensity score \\(e_0\\) by construction.`
                }
            ]
        },

        // ============================================================
        // Section 2: Propensity Score Estimation
        // ============================================================
        {
            id: 'ch09-sec02',
            title: 'Propensity Score Estimation',
            content: `
                <h2>Propensity Score Estimation</h2>

                <p>The propensity score \\(e(x) = P(W=1 \\mid X=x)\\) is almost never known in practice. It must be <strong>estimated</strong> from the observed data \\(\\{(X_i, W_i)\\}_{i=1}^n\\). The quality of propensity score estimation directly affects the validity of downstream causal estimates.</p>

                <h3>Logistic Regression</h3>

                <p>The most common approach is <strong>logistic regression</strong>:</p>
                \\[\\log \\frac{e(x)}{1 - e(x)} = \\beta_0 + \\beta_1 x_1 + \\cdots + \\beta_p x_p\\]
                <p>yielding the estimated propensity score:</p>
                \\[\\hat{e}(x) = \\frac{1}{1 + \\exp(-x^\\top \\hat{\\beta})}\\]
                <p>where \\(\\hat{\\beta}\\) is obtained by maximum likelihood.</p>

                <div class="env-block warning">
                    <div class="env-title">The Goal Is Balance, Not Prediction</div>
                    <div class="env-body">
                        <p>A crucial insight is that the goal of propensity score estimation is <strong>not</strong> to maximize predictive accuracy for \\(W\\). The goal is to achieve <strong>covariate balance</strong> between treated and control groups after conditioning on \\(\\hat{e}(X)\\). A highly predictive model may even be harmful if it produces extreme propensity scores near 0 or 1.</p>
                    </div>
                </div>

                <h3>Model Selection Considerations</h3>

                <p>The overfit/underfit tradeoff for propensity score models differs from standard prediction problems:</p>

                <ul>
                    <li><strong>Underfitting</strong>: If the model is too simple, important confounders may not be adequately captured in the propensity score, leading to residual confounding and biased treatment effect estimates.</li>
                    <li><strong>Overfitting</strong>: If the model is too complex, estimated propensity scores may be very close to 0 or 1. This creates <strong>extreme weights</strong> in IPW (Section 4) and poor matches in PS matching (Section 3). It can also increase variance substantially.</li>
                </ul>

                <div class="env-block definition">
                    <div class="env-title">Guideline: Variable Selection for PS Models</div>
                    <div class="env-body">
                        <p>Include variables that:</p>
                        <ol>
                            <li>Affect the <strong>outcome</strong> (even if they do not predict treatment) — these reduce variance.</li>
                            <li>Affect <strong>both</strong> treatment and outcome (confounders) — these reduce bias.</li>
                        </ol>
                        <p>Avoid variables that affect treatment assignment only (instruments), as including them can <strong>increase variance</strong> without reducing bias, and in finite samples may amplify bias.</p>
                    </div>
                </div>

                <h3>Machine Learning Methods</h3>

                <p>More flexible methods can capture nonlinear relationships in \\(e(x)\\):</p>

                <ul>
                    <li><strong>Gradient boosting (GBM)</strong>: Iteratively fits shallow trees to the treatment indicator. Controls complexity via tree depth and number of iterations. Often achieves good covariate balance.</li>
                    <li><strong>LASSO logistic regression</strong>: Penalizes the log-likelihood with \\(\\ell_1\\) penalty: \\(\\hat{\\beta} = \\arg\\min_{\\beta} \\left\\{-\\ell(\\beta) + \\lambda \\|\\beta\\|_1\\right\\}\\). Automatically performs variable selection.</li>
                    <li><strong>Random forests</strong>: Ensemble of trees. Provides probability estimates via vote fractions. Less prone to extreme scores than single trees.</li>
                    <li><strong>Generalized Additive Models (GAMs)</strong>: Model \\(\\text{logit}(e(x)) = \\sum_j f_j(x_j)\\) with smooth functions \\(f_j\\). Balances flexibility and interpretability.</li>
                </ul>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 9.3 (Asymptotic Efficiency of Estimated PS)</div>
                    <div class="env-body">
                        <p>Remarkably, using an estimated propensity score \\(\\hat{e}(X)\\) can yield <strong>more efficient</strong> estimates of the ATE than using the true \\(e(X)\\). For the IPW estimator with a correctly specified parametric model:</p>
                        \\[\\text{Var}(\\hat{\\tau}_{\\text{IPW}}^{\\hat{e}}) \\leq \\text{Var}(\\hat{\\tau}_{\\text{IPW}}^{e})\\]
                        <p>This counterintuitive result (Hirano, Imbens, and Ridder, 2003) arises because estimation of the PS uses information in the data about the relationship between \\(X\\) and \\(W\\).</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="ch09-viz-ps-distribution"></div>
            `,
            visualizations: [
                {
                    id: 'ch09-viz-ps-distribution',
                    title: 'Propensity Score Distribution: Treated vs Control',
                    description: 'The overlap of PS distributions between treated and control groups is crucial. Poor overlap indicates positivity violations. Adjust the separation and sample size to explore.',
                    setup(container, controls) {
                        const viz = new VizEngine(container, {
                            width: 560, height: 380,
                            originX: 60, originY: 330, scale: 480
                        });

                        let separation = 1.0;
                        let nSample = 200;
                        let seed = 7;

                        function seededRandom(s) {
                            s = Math.sin(s) * 10000;
                            return s - Math.floor(s);
                        }

                        function boxMuller(s) {
                            const u1 = seededRandom(s);
                            const u2 = seededRandom(s + 0.5);
                            return Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.cos(2 * Math.PI * u2);
                        }

                        function draw() {
                            const ctx = viz.ctx;
                            viz.clear();

                            // Generate PS values
                            const treatedPS = [];
                            const controlPS = [];
                            for (let i = 0; i < nSample; i++) {
                                const x = boxMuller(seed + i * 3) * 0.8;
                                const logit = separation * x;
                                const ps = 1 / (1 + Math.exp(-logit));
                                const w = seededRandom(seed + i * 5 + 999) < ps ? 1 : 0;
                                if (w === 1) treatedPS.push(ps);
                                else controlPS.push(ps);
                            }

                            // Build histograms
                            const nBins = 25;
                            function buildHist(vals) {
                                const bins = new Array(nBins).fill(0);
                                for (const v of vals) {
                                    const idx = Math.min(Math.floor(v * nBins), nBins - 1);
                                    bins[idx]++;
                                }
                                const maxCount = Math.max(...bins, 1);
                                return { bins, maxCount };
                            }

                            const tHist = buildHist(treatedPS);
                            const cHist = buildHist(controlPS);
                            const maxH = Math.max(tHist.maxCount, cHist.maxCount);
                            const scaleY = 250 / maxH;
                            const barW = 480 / nBins;

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Propensity Score Distributions', 300, 22);

                            // Draw control histogram (bottom, orange)
                            for (let i = 0; i < nBins; i++) {
                                const x = 60 + i * barW;
                                const h = cHist.bins[i] * scaleY;
                                ctx.fillStyle = viz.colors.orange + '66';
                                ctx.fillRect(x, 330 - h, barW - 1, h);
                                ctx.strokeStyle = viz.colors.orange + '99';
                                ctx.lineWidth = 0.5;
                                ctx.strokeRect(x, 330 - h, barW - 1, h);
                            }

                            // Draw treated histogram (top, blue)
                            for (let i = 0; i < nBins; i++) {
                                const x = 60 + i * barW;
                                const h = tHist.bins[i] * scaleY;
                                ctx.fillStyle = viz.colors.blue + '66';
                                ctx.fillRect(x, 330 - h, barW - 1, h);
                                ctx.strokeStyle = viz.colors.blue + '99';
                                ctx.lineWidth = 0.5;
                                ctx.strokeRect(x, 330 - h, barW - 1, h);
                            }

                            // X axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(60, 330);
                            ctx.lineTo(540, 330);
                            ctx.stroke();

                            // X labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            for (let v = 0; v <= 1; v += 0.2) {
                                const x = 60 + v * 480;
                                ctx.fillText(v.toFixed(1), x, 345);
                                ctx.beginPath();
                                ctx.moveTo(x, 330);
                                ctx.lineTo(x, 334);
                                ctx.stroke();
                            }
                            ctx.fillText('e(X)', 300, 362);

                            // Overlap region
                            const tMin = treatedPS.length > 0 ? Math.min(...treatedPS) : 0;
                            const tMax = treatedPS.length > 0 ? Math.max(...treatedPS) : 1;
                            const cMin = controlPS.length > 0 ? Math.min(...controlPS) : 0;
                            const cMax = controlPS.length > 0 ? Math.max(...controlPS) : 1;
                            const overlapLow = Math.max(tMin, cMin);
                            const overlapHigh = Math.min(tMax, cMax);
                            const overlapFrac = Math.max(0, overlapHigh - overlapLow);

                            // Info text
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText(`Treated: n=${treatedPS.length}, mean PS = ${(treatedPS.reduce((a,b)=>a+b,0)/treatedPS.length).toFixed(3)}`, 65, 375);

                            ctx.fillText(`Control: n=${controlPS.length}, mean PS = ${(controlPS.reduce((a,b)=>a+b,0)/controlPS.length).toFixed(3)}`, 310, 375);

                            // Legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(80, 42, 5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Treated', 90, 45);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(160, 42, 5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Control', 170, 45);

                            // Overlap indicator
                            const overlapColor = overlapFrac > 0.5 ? viz.colors.green :
                                                 overlapFrac > 0.2 ? viz.colors.yellow : viz.colors.red;
                            ctx.fillStyle = overlapColor;
                            ctx.textAlign = 'right';
                            ctx.font = '11px -apple-system, sans-serif';
                            const overlapLabel = overlapFrac > 0.5 ? 'Good overlap' :
                                                 overlapFrac > 0.2 ? 'Moderate overlap' : 'Poor overlap!';
                            ctx.fillText(overlapLabel, 530, 45);
                        }

                        VizEngine.createSlider(controls, 'Separation', 0, 4, separation, 0.2, v => {
                            separation = v;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'Sample size', 50, 500, nSample, 50, v => {
                            nSample = Math.round(v);
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Sample', () => {
                            seed = Math.floor(Math.random() * 10000);
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Consider a logistic regression model for the propensity score with \\(p = 50\\) covariates and \\(n = 200\\) observations. What problems might arise, and how could LASSO help?',
                    hint: 'Think about the ratio \\(p/n\\) and the behavior of maximum likelihood in moderately high-dimensional settings.',
                    solution: `With \\(p/n = 0.25\\), standard logistic regression may suffer from: (1) <strong>Separation or quasi-separation</strong>, where some covariate combinations perfectly predict treatment, leading to infinite MLE coefficients and extreme PS near 0 or 1. (2) <strong>High variance</strong> in coefficient estimates, propagating to high variance in PS. (3) <strong>Overfitting</strong>, producing PS too close to 0 or 1. LASSO logistic regression addresses these by adding \\(\\lambda \\|\\beta\\|_1\\), which: shrinks coefficients toward zero, preventing separation; performs variable selection by setting some \\(\\hat{\\beta}_j = 0\\); and reduces variance at the cost of small bias, typically improving PS estimation. The penalty \\(\\lambda\\) should be chosen to optimize covariate balance rather than prediction accuracy.`
                },
                {
                    question: 'Why should we generally avoid including instrumental variables (variables that affect treatment but not outcome) in the propensity score model? Illustrate with an example.',
                    hint: 'Consider the variance of the IPW estimator and how it depends on the propensity score distribution.',
                    solution: `Including an instrument \\(Z\\) in the PS model makes \\(\\hat{e}(X,Z)\\) more variable (values closer to 0 and 1), because \\(Z\\) strongly predicts \\(W\\). Since the IPW estimator weights by \\(1/\\hat{e}\\) and \\(1/(1-\\hat{e})\\), more extreme PS values lead to <strong>larger weights and higher variance</strong>. Example: In a drug effectiveness study, suppose insurance plan (\\(Z\\)) determines which drug patients get but has no direct effect on health outcomes. Including \\(Z\\) in the PS model would push PS toward 0 or 1 for patients on certain plans, creating extreme weights. Meanwhile, \\(Z\\) provides no bias reduction since it does not confound the treatment-outcome relationship. The IPW estimate would be unbiased but have much larger variance.`
                },
                {
                    question: 'Explain the counterintuitive result of Hirano, Imbens, and Ridder (2003) that using the estimated propensity score can be more efficient than using the true score. When does this result hold?',
                    hint: 'The key insight involves the semiparametric efficiency bound. Think about what information the estimation step adds.',
                    solution: `When the PS model is correctly specified, estimating \\(\\hat{e}(x)\\) effectively incorporates information about the relationship between \\(X\\) and \\(W\\). The IPW estimator with the known \\(e(X)\\) uses only marginal moments, while estimating \\(e(X)\\) via maximum likelihood "learns" the full conditional distribution \\(P(W|X)\\). The resulting estimator achieves the <strong>semiparametric efficiency bound</strong>. Formally, the estimated-PS IPW estimator has asymptotic variance equal to the efficient influence function variance, while the known-PS IPW estimator has variance that exceeds this bound. This result holds when: (1) the parametric PS model is <strong>correctly specified</strong>, and (2) regular asymptotic conditions apply. If the PS model is misspecified, the estimated PS can lead to both biased and less efficient estimators.`
                },
                {
                    question: 'You estimate a propensity score model using gradient boosting and find that 15% of treated units have \\(\\hat{e}(X) > 0.95\\) and 10% of control units have \\(\\hat{e}(X) < 0.05\\). What does this suggest about your data, and what steps would you take?',
                    hint: 'Think about the overlap (positivity) assumption and practical tradeoffs between bias and variance.',
                    solution: `This suggests <strong>positivity violations</strong>: there are subpopulations where treatment assignment is nearly deterministic. Units with \\(\\hat{e} > 0.95\\) are almost always treated (few comparable controls), and units with \\(\\hat{e} < 0.05\\) are almost always controls (few comparable treated). Steps: (1) <strong>Examine these units</strong> to understand why they have extreme PS. They may represent populations outside the region of common support. (2) <strong>Trim or truncate</strong>: restrict analysis to units with \\(0.05 \\leq \\hat{e} \\leq 0.95\\), changing the estimand to a treatment effect for the "overlap population." (3) <strong>Check the model</strong>: overfitting can produce extreme scores. Try a simpler model and check if extremity persists. (4) <strong>Consider alternative estimands</strong>: ATT (which only requires \\(P(W=0|X) > 0\\)) may be more appropriate than ATE. (5) <strong>Report sensitivity</strong>: show how results change under different trimming thresholds.`
                }
            ]
        },

        // ============================================================
        // Section 3: PS Matching & Stratification
        // ============================================================
        {
            id: 'ch09-sec03',
            title: 'PS Matching & Stratification',
            content: `
                <h2>PS Matching & Stratification</h2>

                <p>Given estimated propensity scores \\(\\hat{e}(X_i)\\), two fundamental strategies for estimating treatment effects are <strong>matching</strong> and <strong>stratification</strong>. Both exploit the dimension-reduction property of the propensity score to create comparable groups of treated and control units.</p>

                <h3>Propensity Score Matching</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 9.3 (1:1 Nearest-Neighbor Matching)</div>
                    <div class="env-body">
                        <p>For each treated unit \\(i\\) with \\(W_i = 1\\), find the control unit \\(j\\) that minimizes:</p>
                        \\[j(i) = \\arg\\min_{j: W_j = 0} |\\hat{e}(X_i) - \\hat{e}(X_j)|\\]
                        <p>The matched estimator of the ATT is:</p>
                        \\[\\hat{\\tau}_{\\text{ATT}}^{\\text{match}} = \\frac{1}{n_1} \\sum_{i: W_i = 1} \\bigl(Y_i - Y_{j(i)}\\bigr)\\]
                    </div>
                </div>

                <p>Matching can be done with or without replacement:</p>
                <ul>
                    <li><strong>With replacement</strong>: A control unit can serve as a match for multiple treated units. Reduces bias (always finds the closest match) but increases variance.</li>
                    <li><strong>Without replacement</strong>: Each control is used at most once. Order of matching matters, potentially increases bias but reduces variance.</li>
                </ul>

                <div class="env-block definition">
                    <div class="env-title">Definition 9.4 (Caliper Matching)</div>
                    <div class="env-body">
                        <p>Caliper matching imposes a maximum distance for acceptable matches:</p>
                        \\[j(i) = \\arg\\min_{j: W_j = 0,\\, |\\hat{e}(X_i) - \\hat{e}(X_j)| < \\delta} |\\hat{e}(X_i) - \\hat{e}(X_j)|\\]
                        <p>where \\(\\delta > 0\\) is the <strong>caliper width</strong>. Treated units without a match within the caliper are discarded. A common choice is \\(\\delta = 0.2 \\cdot \\text{SD}(\\hat{e})\\).</p>
                    </div>
                </div>

                <div class="env-block warning">
                    <div class="env-title">Matching Creates a Design, Not a Final Estimator</div>
                    <div class="env-body">
                        <p>After matching, one should still check covariate balance. If balance is inadequate, one can:</p>
                        <ul>
                            <li>Re-specify the propensity score model</li>
                            <li>Use a tighter caliper</li>
                            <li>Match on additional covariates (exact matching on key confounders + PS matching)</li>
                            <li>Apply regression adjustment within matched pairs</li>
                        </ul>
                    </div>
                </div>

                <h3>Optimal Matching</h3>

                <p><strong>Optimal matching</strong> minimizes the total distance across all matched pairs simultaneously, rather than greedily matching each treated unit to its nearest neighbor. This solves the assignment problem:</p>
                \\[\\min_{\\pi} \\sum_{i: W_i=1} |\\hat{e}(X_i) - \\hat{e}(X_{\\pi(i)})|\\]
                <p>where \\(\\pi\\) is a bijection from treated units to a subset of control units. This can be solved in \\(O(n^3)\\) using the Hungarian algorithm.</p>

                <h3>Propensity Score Stratification</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 9.5 (Stratification / Subclassification)</div>
                    <div class="env-body">
                        <p>Partition the propensity score range into \\(K\\) strata (commonly \\(K = 5\\) quintiles). Within each stratum \\(k\\), estimate the treatment effect:</p>
                        \\[\\hat{\\tau}_k = \\bar{Y}_{1k} - \\bar{Y}_{0k}\\]
                        <p>where \\(\\bar{Y}_{wk}\\) is the mean outcome among units with treatment status \\(w\\) in stratum \\(k\\). The overall ATE estimate is:</p>
                        \\[\\hat{\\tau}_{\\text{strat}} = \\sum_{k=1}^K \\frac{n_k}{n} \\hat{\\tau}_k\\]
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Result (Cochran, 1968; Rosenbaum & Rubin, 1984)</div>
                    <div class="env-body">
                        <p>With \\(K = 5\\) strata based on the propensity score, <strong>approximately 90% of the bias</strong> due to a single covariate is removed. Increasing the number of strata removes additional bias but at the cost of increased variance within each stratum.</p>
                    </div>
                </div>

                <h3>Bias-Variance Tradeoff</h3>

                <p>The tradeoff between matching and stratification involves several considerations:</p>

                <table style="width:100%; border-collapse:collapse; margin:15px 0;">
                    <thead>
                        <tr style="border-bottom:1px solid #30363d;">
                            <th style="text-align:left; padding:8px; color:#c9d1d9;">Method</th>
                            <th style="text-align:left; padding:8px; color:#c9d1d9;">Bias</th>
                            <th style="text-align:left; padding:8px; color:#c9d1d9;">Variance</th>
                            <th style="text-align:left; padding:8px; color:#c9d1d9;">Efficiency</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style="padding:8px; color:#8b949e;">1:1 Matching</td><td style="padding:8px; color:#8b949e;">Low (closest match)</td><td style="padding:8px; color:#8b949e;">Higher (discards data)</td><td style="padding:8px; color:#8b949e;">Lower</td></tr>
                        <tr><td style="padding:8px; color:#8b949e;">k:1 Matching</td><td style="padding:8px; color:#8b949e;">Moderate</td><td style="padding:8px; color:#8b949e;">Lower</td><td style="padding:8px; color:#8b949e;">Moderate</td></tr>
                        <tr><td style="padding:8px; color:#8b949e;">Stratification (K=5)</td><td style="padding:8px; color:#8b949e;">Some residual</td><td style="padding:8px; color:#8b949e;">Lower (uses all data)</td><td style="padding:8px; color:#8b949e;">Higher</td></tr>
                        <tr><td style="padding:8px; color:#8b949e;">Stratification (K=20)</td><td style="padding:8px; color:#8b949e;">Very low</td><td style="padding:8px; color:#8b949e;">Higher (thin strata)</td><td style="padding:8px; color:#8b949e;">Moderate</td></tr>
                    </tbody>
                </table>

                <div class="viz-placeholder" data-viz="ch09-viz-ps-matching"></div>
            `,
            visualizations: [
                {
                    id: 'ch09-viz-ps-matching',
                    title: 'Interactive Propensity Score Matching',
                    description: 'Treated (blue) and control (orange) units are placed by their propensity score. Lines show matched pairs. Adjust the caliper width to see how it affects the number of matches and match quality.',
                    setup(container, controls) {
                        const viz = new VizEngine(container, {
                            width: 560, height: 400,
                            originX: 60, originY: 200, scale: 1
                        });

                        let caliper = 0.15;
                        let seed = 123;

                        function seededRandom(s) {
                            s = Math.sin(s) * 10000;
                            return s - Math.floor(s);
                        }

                        function boxMuller(s) {
                            const u1 = seededRandom(s);
                            const u2 = seededRandom(s + 0.5);
                            return Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.cos(2 * Math.PI * u2);
                        }

                        function draw() {
                            const ctx = viz.ctx;
                            viz.clear();

                            // Generate data
                            const treated = [];
                            const control = [];
                            for (let i = 0; i < 60; i++) {
                                const x = boxMuller(seed + i * 3) * 0.6 + 0.3;
                                const ps = Math.max(0.02, Math.min(0.98, 1 / (1 + Math.exp(-2 * x))));
                                const w = seededRandom(seed + i * 7 + 500) < ps ? 1 : 0;
                                if (w === 1) treated.push({ ps, idx: i });
                                else control.push({ ps, idx: i });
                            }

                            treated.sort((a, b) => a.ps - b.ps);
                            control.sort((a, b) => a.ps - b.ps);

                            const leftX = 80;
                            const rightX = 480;
                            const topY = 55;
                            const botY = 350;
                            const rangeY = botY - topY;

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('1:1 Nearest-Neighbor PS Matching', 280, 22);

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Treated (W=1)', leftX, 42);
                            ctx.fillText('Control (W=0)', rightX, 42);

                            // PS axis (left side)
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(leftX - 25, topY);
                            ctx.lineTo(leftX - 25, botY);
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system, sans-serif';
                            ctx.textAlign = 'right';
                            for (let v = 0; v <= 1; v += 0.2) {
                                const y = botY - v * rangeY;
                                ctx.fillText(v.toFixed(1), leftX - 30, y + 3);
                                ctx.beginPath();
                                ctx.moveTo(leftX - 28, y);
                                ctx.lineTo(leftX - 22, y);
                                ctx.stroke();
                            }

                            ctx.save();
                            ctx.translate(20, 200);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Propensity Score e(X)', 0, 0);
                            ctx.restore();

                            // Match treated to control (greedy, with replacement)
                            const matches = [];
                            const usedControl = new Set();
                            let nMatched = 0;
                            let totalDist = 0;

                            for (const t of treated) {
                                let bestJ = -1;
                                let bestDist = Infinity;
                                for (let j = 0; j < control.length; j++) {
                                    const d = Math.abs(t.ps - control[j].ps);
                                    if (d < bestDist) {
                                        bestDist = d;
                                        bestJ = j;
                                    }
                                }
                                if (bestJ >= 0 && bestDist <= caliper) {
                                    matches.push({ t, c: control[bestJ], dist: bestDist });
                                    nMatched++;
                                    totalDist += bestDist;
                                }
                            }

                            // Draw match lines
                            for (const m of matches) {
                                const ty = botY - m.t.ps * rangeY;
                                const cy = botY - m.c.ps * rangeY;
                                const alpha = Math.max(0.15, 1 - m.dist * 5);
                                ctx.strokeStyle = viz.colors.green + Math.round(alpha * 255).toString(16).padStart(2, '0');
                                ctx.lineWidth = 1.2;
                                ctx.beginPath();
                                ctx.moveTo(leftX + 8, ty);
                                ctx.lineTo(rightX - 8, cy);
                                ctx.stroke();
                            }

                            // Draw treated points
                            for (const t of treated) {
                                const y = botY - t.ps * rangeY;
                                const matched = matches.some(m => m.t === t);
                                ctx.fillStyle = matched ? viz.colors.blue : viz.colors.blue + '44';
                                ctx.beginPath();
                                ctx.arc(leftX, y, 5, 0, Math.PI * 2);
                                ctx.fill();
                                if (!matched) {
                                    ctx.strokeStyle = viz.colors.red + '88';
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.moveTo(leftX - 3, y - 3);
                                    ctx.lineTo(leftX + 3, y + 3);
                                    ctx.moveTo(leftX + 3, y - 3);
                                    ctx.lineTo(leftX - 3, y + 3);
                                    ctx.stroke();
                                }
                            }

                            // Draw control points
                            for (const c of control) {
                                const y = botY - c.ps * rangeY;
                                const matched = matches.some(m => m.c === c);
                                ctx.fillStyle = matched ? viz.colors.orange : viz.colors.orange + '44';
                                ctx.beginPath();
                                ctx.arc(rightX, y, 5, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Caliper indicator
                            ctx.fillStyle = viz.colors.green + '11';
                            const caliperPx = caliper * rangeY;
                            ctx.fillRect(leftX - 15, botY / 2 - caliperPx / 2, rightX - leftX + 30, caliperPx);

                            // Stats
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText(`Matched: ${nMatched}/${treated.length} treated units`, 70, 375);
                            ctx.fillText(`Avg distance: ${nMatched > 0 ? (totalDist / nMatched).toFixed(4) : 'N/A'}`, 280, 375);
                            ctx.fillText(`Caliper: ${caliper.toFixed(2)}`, 460, 375);

                            // Unmatched warning
                            const nUnmatched = treated.length - nMatched;
                            if (nUnmatched > 0) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.font = '10px -apple-system, sans-serif';
                                ctx.fillText(`${nUnmatched} treated units unmatched (marked with X)`, 70, 393);
                            }
                        }

                        VizEngine.createSlider(controls, 'Caliper', 0.01, 0.5, caliper, 0.01, v => {
                            caliper = v;
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Sample', () => {
                            seed = Math.floor(Math.random() * 10000);
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain the bias-variance tradeoff in choosing between 1:1 matching and 5:1 matching. Under what conditions would you prefer each?',
                    hint: 'Consider what happens to the quality of the worst match as you increase the number of matches per treated unit.',
                    solution: `In <strong>1:1 matching</strong>, each treated unit is paired with its single closest control, minimizing the PS distance within each pair. This produces <strong>low bias</strong> (best possible matches) but <strong>higher variance</strong> because many control units are discarded, reducing the effective sample size. In <strong>5:1 matching</strong>, each treated unit is matched to 5 controls. The average of 5 outcomes reduces variance, but the 2nd through 5th matches are progressively worse (farther in PS), introducing <strong>more bias</strong>. Prefer 1:1 when: (1) there is good overlap (close matches are available), (2) bias reduction is paramount, (3) sample sizes are large. Prefer k:1 when: (1) the control pool is much larger than the treated group, (2) variance reduction is needed (small treated group), (3) the PS distribution of controls is dense, so even the k-th nearest neighbor is reasonably close.`
                },
                {
                    question: 'Show that the stratification estimator \\(\\hat{\\tau}_{\\text{strat}} = \\sum_{k=1}^K \\frac{n_k}{n} \\hat{\\tau}_k\\) is consistent for the ATE under unconfoundedness and correct PS specification, as \\(K \\to \\infty\\) and \\(n \\to \\infty\\).',
                    hint: 'Within each stratum, if the PS is approximately constant, what does unconfoundedness imply about \\(\\bar{Y}_{1k} - \\bar{Y}_{0k}\\)?',
                    solution: `Within stratum \\(k\\), all units have approximately the same propensity score \\(e_k\\). By the Rosenbaum-Rubin theorem, unconfoundedness holds conditional on \\(e(X)\\), so within stratum \\(k\\):
                        \\[E[\\bar{Y}_{1k} - \\bar{Y}_{0k}] \\approx E[Y(1) - Y(0) \\mid e(X) \\approx e_k] = \\tau(e_k)\\]
                        The approximation becomes exact as the strata become infinitely fine (\\(K \\to \\infty\\)). The overall estimator is:
                        \\[\\hat{\\tau}_{\\text{strat}} = \\sum_k \\frac{n_k}{n} \\hat{\\tau}_k \\xrightarrow{p} \\sum_k P(e(X) \\in \\text{stratum } k) \\cdot \\tau(e_k) \\to E[\\tau(e(X))] = E[Y(1) - Y(0)] = \\tau_{\\text{ATE}}\\]
                        The last equality uses the law of iterated expectations. Consistency requires \\(K \\to \\infty\\) slowly enough that each stratum has many observations (\\(n_k \\to \\infty\\)).`
                },
                {
                    question: 'A researcher performs PS matching and finds that treated and control groups are well-balanced on propensity scores but poorly balanced on a specific covariate \\(X_3\\). What could explain this, and what should the researcher do?',
                    hint: 'Think about what it means for the PS model to correctly specify the relationship between covariates and treatment.',
                    solution: `Poor balance on \\(X_3\\) despite good PS balance suggests the <strong>PS model is misspecified</strong>. Specifically, the model may not correctly capture how \\(X_3\\) relates to treatment. Possible causes: (1) \\(X_3\\) enters the true PS model nonlinearly (e.g., quadratically) but was included only linearly. (2) \\(X_3\\) interacts with other covariates in determining treatment, but interactions were omitted. (3) \\(X_3\\) has a non-monotonic relationship with treatment. The researcher should: (1) Add polynomial terms (\\(X_3^2\\)) and interactions (\\(X_3 \\times X_j\\)) to the PS model. (2) Re-estimate PS and re-match. (3) Check balance iteratively until \\(X_3\\) (and all other covariates) are balanced. (4) Consider exact matching on \\(X_3\\) combined with PS matching on remaining covariates. This illustrates why balance checking is essential: <strong>the PS is only as good as the model used to estimate it</strong>.`
                }
            ]
        },

        // ============================================================
        // Section 4: Inverse Probability Weighting (IPW)
        // ============================================================
        {
            id: 'ch09-sec04',
            title: 'Inverse Probability Weighting (IPW)',
            content: `
                <h2>Inverse Probability Weighting (IPW)</h2>

                <p>Instead of matching or stratifying on the propensity score, we can use it to <strong>reweight</strong> the observed outcomes. Inverse probability weighting creates a pseudo-population in which treatment is independent of covariates, mimicking a randomized experiment.</p>

                <h3>The Horvitz-Thompson Estimator</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 9.6 (IPW Estimator of ATE)</div>
                    <div class="env-body">
                        <p>The <strong>Horvitz-Thompson (HT) IPW estimator</strong> of the average treatment effect is:</p>
                        \\[\\hat{\\tau}_{\\text{IPW}} = \\frac{1}{n} \\sum_{i=1}^n \\left[\\frac{W_i Y_i}{\\hat{e}(X_i)} - \\frac{(1 - W_i) Y_i}{1 - \\hat{e}(X_i)}\\right]\\]
                    </div>
                </div>

                <div class="env-block proof">
                    <div class="env-title">Why IPW Works</div>
                    <div class="env-body">
                        <p>The key identity underlying IPW is:</p>
                        \\[E\\left[\\frac{W Y}{e(X)}\\right] = E\\left[\\frac{W Y(1)}{e(X)}\\right] = E\\left[E\\left[\\frac{W}{e(X)} \\mid X\\right] Y(1)\\right] = E[Y(1)]\\]
                        <p>The second equality uses \\(Y = WY(1) + (1-W)Y(0)\\) and \\(W \\cdot Y = W \\cdot Y(1)\\). The third uses unconfoundedness: \\(E[W/e(X) \\mid X] = e(X)/e(X) = 1\\). Similarly, \\(E[(1-W)Y / (1-e(X))] = E[Y(0)]\\). Thus:</p>
                        \\[E[\\hat{\\tau}_{\\text{IPW}}] = E[Y(1)] - E[Y(0)] = \\tau_{\\text{ATE}}\\]
                    </div>
                </div>

                <h3>The Hajek (Normalized) Estimator</h3>

                <p>The HT estimator can be unstable because the weights \\(1/\\hat{e}(X_i)\\) and \\(1/(1-\\hat{e}(X_i))\\) do not necessarily sum to \\(n\\). The <strong>Hajek estimator</strong> normalizes the weights:</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 9.7 (Hajek / Normalized IPW Estimator)</div>
                    <div class="env-body">
                        \\[\\hat{\\tau}_{\\text{Hajek}} = \\frac{\\sum_{i=1}^n \\frac{W_i Y_i}{\\hat{e}(X_i)}}{\\sum_{i=1}^n \\frac{W_i}{\\hat{e}(X_i)}} - \\frac{\\sum_{i=1}^n \\frac{(1-W_i) Y_i}{1 - \\hat{e}(X_i)}}{\\sum_{i=1}^n \\frac{1-W_i}{1 - \\hat{e}(X_i)}}\\]
                        <p>The Hajek estimator is <strong>biased but more stable</strong> than HT, with typically lower MSE. It is the ratio of two consistent estimators, and the bias vanishes as \\(n \\to \\infty\\).</p>
                    </div>
                </div>

                <h3>The Extreme Weight Problem</h3>

                <p>The fundamental challenge with IPW is <strong>extreme weights</strong>. When \\(\\hat{e}(X_i)\\) is close to 0 or 1, the corresponding weight \\(1/\\hat{e}(X_i)\\) or \\(1/(1-\\hat{e}(X_i))\\) becomes very large:</p>

                <div class="env-block example">
                    <div class="env-title">Example 9.1 (Extreme Weights)</div>
                    <div class="env-body">
                        <p>Consider a treated unit with \\(\\hat{e}(X_i) = 0.01\\). Its weight is \\(1/0.01 = 100\\), meaning this single unit represents 100 individuals in the pseudo-population. If \\(Y_i\\) happens to be an outlier, it can dominate the entire estimate. The effective sample size decreases dramatically:</p>
                        \\[n_{\\text{eff}} = \\frac{\\left(\\sum_i w_i\\right)^2}{\\sum_i w_i^2}\\]
                        <p>With extreme weights, \\(n_{\\text{eff}} \\ll n\\), leading to high variance and instability.</p>
                    </div>
                </div>

                <h3>Trimming and Truncation</h3>

                <p>Several strategies address extreme weights:</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 9.8 (Weight Trimming Strategies)</div>
                    <div class="env-body">
                        <ul>
                            <li><strong>Hard trimming</strong>: Discard units with \\(\\hat{e}(X_i) < \\alpha\\) or \\(\\hat{e}(X_i) > 1 - \\alpha\\) (e.g., \\(\\alpha = 0.05\\)). Changes the estimand to \\(E[Y(1) - Y(0) \\mid \\alpha \\leq e(X) \\leq 1-\\alpha]\\).</li>
                            <li><strong>Weight truncation</strong>: Cap weights at a maximum value \\(w_{\\max}\\): \\(\\tilde{w}_i = \\min(w_i, w_{\\max})\\). Introduces bias but reduces variance.</li>
                            <li><strong>Stabilized weights</strong>: Replace \\(1/\\hat{e}(X_i)\\) with \\(P(W=1)/\\hat{e}(X_i)\\) for treated and \\(P(W=0)/(1-\\hat{e}(X_i))\\) for control. These have expectation 1 and are typically more stable.</li>
                        </ul>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 9.4 (Asymptotic Normality of IPW)</div>
                    <div class="env-body">
                        <p>Under regularity conditions (correct PS specification, positivity \\(0 < e(x) < 1\\), finite outcome variance), the IPW estimator is asymptotically normal:</p>
                        \\[\\sqrt{n}(\\hat{\\tau}_{\\text{IPW}} - \\tau_{\\text{ATE}}) \\xrightarrow{d} N(0, V_{\\text{IPW}})\\]
                        <p>where \\(V_{\\text{IPW}} = E\\left[\\frac{\\text{Var}(Y(1) \\mid X)}{e(X)} + \\frac{\\text{Var}(Y(0) \\mid X)}{1-e(X)} + (\\tau(X) - \\tau_{\\text{ATE}})^2\\right]\\)</p>
                        <p>with \\(\\tau(X) = E[Y(1) - Y(0) \\mid X]\\) being the conditional treatment effect.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="ch09-viz-ipw-weights"></div>
            `,
            visualizations: [
                {
                    id: 'ch09-viz-ipw-weights',
                    title: 'IPW Weight Distribution and the Extreme Weight Problem',
                    description: 'Visualize how IPW weights are computed from propensity scores. Extreme PS values (near 0 or 1) produce large weights. Use the trimming slider to cap extreme weights.',
                    setup(container, controls) {
                        const viz = new VizEngine(container, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 1
                        });

                        let trimThreshold = 0.0;
                        let seed = 55;

                        function seededRandom(s) {
                            s = Math.sin(s) * 10000;
                            return s - Math.floor(s);
                        }

                        function boxMuller(s) {
                            const u1 = seededRandom(s);
                            const u2 = seededRandom(s + 0.5);
                            return Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.cos(2 * Math.PI * u2);
                        }

                        function draw() {
                            const ctx = viz.ctx;
                            viz.clear();

                            // Generate units with PS
                            const units = [];
                            for (let i = 0; i < 80; i++) {
                                const x = boxMuller(seed + i * 3) * 1.2;
                                let ps = 1 / (1 + Math.exp(-x));
                                ps = Math.max(0.01, Math.min(0.99, ps));
                                const w = seededRandom(seed + i * 7 + 100) < ps ? 1 : 0;
                                units.push({ ps, w, idx: i });
                            }

                            // Compute weights
                            const lo = trimThreshold;
                            const hi = 1 - trimThreshold;

                            for (const u of units) {
                                const ePrime = Math.max(lo || 0.01, Math.min(hi || 0.99, u.ps));
                                u.weight = u.w === 1 ? 1 / ePrime : 1 / (1 - ePrime);
                                u.trimmed = (u.ps < lo || u.ps > hi) && lo > 0;
                            }

                            const maxWeight = Math.max(...units.map(u => u.trimmed ? 0 : u.weight));

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('IPW Weights by Propensity Score', 280, 22);

                            // Left panel: PS -> Weight function
                            const plotL = 30, plotR = 260, plotT = 50, plotB = 300;
                            const plotW = plotR - plotL, plotH = plotB - plotT;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotL, plotB);
                            ctx.lineTo(plotR, plotB);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotL, plotT);
                            ctx.lineTo(plotL, plotB);
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Propensity Score e(X)', (plotL + plotR) / 2, plotB + 15);
                            ctx.save();
                            ctx.translate(15, (plotT + plotB) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('IPW Weight', 0, 0);
                            ctx.restore();

                            // X axis labels
                            for (let v = 0; v <= 1; v += 0.2) {
                                const x = plotL + v * plotW;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(v.toFixed(1), x, plotB + 28);
                            }

                            // Draw 1/e(x) curve (for treated)
                            const wCap = 30;
                            const wScale = plotH / wCap;
                            ctx.strokeStyle = viz.colors.blue + '88';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (let px = 0; px <= plotW; px++) {
                                const e = px / plotW;
                                if (e < 0.02) continue;
                                const w = Math.min(1 / e, wCap);
                                const x = plotL + px;
                                const y = plotB - w * wScale;
                                px <= 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                            }
                            ctx.stroke();

                            // Draw 1/(1-e(x)) curve (for control)
                            ctx.strokeStyle = viz.colors.orange + '88';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            let started = false;
                            for (let px = 0; px <= plotW; px++) {
                                const e = px / plotW;
                                if (e > 0.98) continue;
                                const w = Math.min(1 / (1 - e), wCap);
                                const x = plotL + px;
                                const y = plotB - w * wScale;
                                if (!started) { ctx.moveTo(x, y); started = true; }
                                else ctx.lineTo(x, y);
                            }
                            ctx.stroke();

                            // Draw trim lines
                            if (trimThreshold > 0) {
                                ctx.strokeStyle = viz.colors.red + '88';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([4, 3]);
                                const xLo = plotL + lo * plotW;
                                const xHi = plotL + hi * plotW;
                                ctx.beginPath();
                                ctx.moveTo(xLo, plotT);
                                ctx.lineTo(xLo, plotB);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(xHi, plotT);
                                ctx.lineTo(xHi, plotB);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // Shade trimmed regions
                                ctx.fillStyle = viz.colors.red + '11';
                                ctx.fillRect(plotL, plotT, lo * plotW, plotH);
                                ctx.fillRect(plotL + hi * plotW, plotT, (1 - hi) * plotW, plotH);
                            }

                            // Y axis labels for weight
                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'right';
                            ctx.font = '9px -apple-system, sans-serif';
                            for (let w = 0; w <= wCap; w += 5) {
                                const y = plotB - w * wScale;
                                ctx.fillText(w.toString(), plotL - 5, y + 3);
                            }

                            // Right panel: Weight distribution (bar chart)
                            const rPlotL = 310, rPlotR = 540, rPlotT = 50, rPlotB = 300;
                            const rPlotW = rPlotR - rPlotL;
                            const rPlotH = rPlotB - rPlotT;

                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(rPlotL, rPlotB);
                            ctx.lineTo(rPlotR, rPlotB);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(rPlotL, rPlotT);
                            ctx.lineTo(rPlotL, rPlotB);
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Unit (sorted by weight)', (rPlotL + rPlotR) / 2, rPlotB + 15);

                            // Sort units by weight, draw bars
                            const activeUnits = units.filter(u => !u.trimmed);
                            activeUnits.sort((a, b) => a.weight - b.weight);
                            const maxW = activeUnits.length > 0 ? Math.max(...activeUnits.map(u => u.weight)) : 1;
                            const barWidth = rPlotW / activeUnits.length;
                            const barScale = rPlotH / Math.max(maxW, 1);

                            for (let i = 0; i < activeUnits.length; i++) {
                                const u = activeUnits[i];
                                const x = rPlotL + i * barWidth;
                                const h = u.weight * barScale;
                                const color = u.w === 1 ? viz.colors.blue : viz.colors.orange;
                                ctx.fillStyle = color + '88';
                                ctx.fillRect(x, rPlotB - h, barWidth - 0.5, h);
                            }

                            // Effective sample size
                            const sumW = activeUnits.reduce((s, u) => s + u.weight, 0);
                            const sumW2 = activeUnits.reduce((s, u) => s + u.weight * u.weight, 0);
                            const nEff = sumW2 > 0 ? (sumW * sumW) / sumW2 : 0;

                            // Stats
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText(`n = ${units.length}, active = ${activeUnits.length}`, 40, 330);
                            ctx.fillText(`Max weight: ${maxW.toFixed(1)}`, 40, 348);
                            ctx.fillText(`Eff. sample size: ${nEff.toFixed(1)}`, 40, 366);

                            const trimmedCount = units.filter(u => u.trimmed).length;
                            if (trimmedCount > 0) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.fillText(`Trimmed: ${trimmedCount} units`, 40, 384);
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(320, 330, 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '10px -apple-system, sans-serif';
                            ctx.fillText('1/e(X) for treated', 328, 333);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(320, 348, 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('1/(1-e(X)) for control', 328, 351);
                        }

                        VizEngine.createSlider(controls, 'Trim threshold', 0, 0.2, trimThreshold, 0.01, v => {
                            trimThreshold = v;
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Sample', () => {
                            seed = Math.floor(Math.random() * 10000);
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that the Horvitz-Thompson IPW estimator is unbiased for the ATE under unconfoundedness and positivity: \\(E\\left[\\frac{WY}{e(X)} - \\frac{(1-W)Y}{1-e(X)}\\right] = E[Y(1)] - E[Y(0)]\\).',
                    hint: 'Use the tower property \\(E[Z] = E[E[Z \\mid X]]\\) and the fact that \\(E[W \\mid X] = e(X)\\).',
                    solution: `We show \\(E[WY/e(X)] = E[Y(1)]\\). Using iterated expectations:
                        \\[E\\left[\\frac{WY}{e(X)}\\right] = E\\left[E\\left[\\frac{WY}{e(X)} \\bigg| X\\right]\\right] = E\\left[\\frac{1}{e(X)} E[WY \\mid X]\\right]\\]
                        Since \\(Y = WY(1) + (1-W)Y(0)\\), we have \\(WY = WY(1)\\). By unconfoundedness \\(W \\perp\\!\\!\\!\\perp Y(1) \\mid X\\):
                        \\[E[WY(1) \\mid X] = E[W \\mid X] \\cdot E[Y(1) \\mid X] = e(X) \\cdot E[Y(1) \\mid X]\\]
                        Therefore:
                        \\[E\\left[\\frac{WY}{e(X)}\\right] = E\\left[\\frac{e(X) \\cdot E[Y(1) \\mid X]}{e(X)}\\right] = E[E[Y(1) \\mid X]] = E[Y(1)]\\]
                        Similarly, \\(E[(1-W)Y/(1-e(X))] = E[Y(0)]\\). Subtracting gives the result.`
                },
                {
                    question: 'Explain why the Hajek estimator has lower variance but introduces bias compared to the Horvitz-Thompson estimator. When is the bias negligible?',
                    hint: 'The Hajek estimator is a ratio of two random variables. Use the delta method or the expansion of a ratio estimator.',
                    solution: `The Hajek estimator is \\(\\hat{\\mu}_1^H = \\frac{\\sum W_i Y_i / \\hat{e}_i}{\\sum W_i / \\hat{e}_i}\\). This is a ratio of two sample means: \\(\\bar{A}/\\bar{B}\\) where \\(E[\\bar{A}] = E[Y(1)]\\) and \\(E[\\bar{B}] = 1\\). By the delta method:
                        \\[E[\\bar{A}/\\bar{B}] \\approx E[\\bar{A}]/E[\\bar{B}] - \\text{Cov}(\\bar{A}, \\bar{B})/E[\\bar{B}]^2 + E[\\bar{A}] \\text{Var}(\\bar{B})/E[\\bar{B}]^3\\]
                        The bias terms are \\(O(1/n)\\) and vanish asymptotically. The Hajek estimator has <strong>lower variance</strong> because normalizing the weights forces them to sum to 1 within each treatment group, preventing the total weight from fluctuating. This stabilization removes a source of variability present in the HT estimator. The bias is negligible when: (1) \\(n\\) is large, (2) weights are not too variable (good overlap), and (3) the ratio \\(\\bar{A}/\\bar{B}\\) is well-behaved. In practice, the Hajek estimator almost always has lower MSE.`
                },
                {
                    question: 'Suppose the true propensity score satisfies \\(0.1 \\leq e(x) \\leq 0.9\\) for all \\(x\\) in the population. A researcher trims all units with \\(\\hat{e}(X) < 0.05\\) or \\(\\hat{e}(X) > 0.95\\). In a sample of \\(n = 1000\\), they trim 50 units. Discuss the implications for (a) the estimand, (b) external validity, and (c) potential bias.',
                    hint: 'Why would estimated PS fall outside the true range? What does trimming these units imply about what population the estimate applies to?',
                    solution: `(a) <strong>Estimand change</strong>: Trimming restricts the analysis to units with \\(0.05 \\leq \\hat{e}(X) \\leq 0.95\\). The estimand shifts from the population ATE to the ATE for this subpopulation. Since the true PS satisfies \\(0.1 \\leq e(x) \\leq 0.9\\), the trimmed units likely have extreme <em>estimated</em> PS due to sampling variability or model misspecification, not truly extreme treatment probabilities.
                        (b) <strong>External validity</strong>: The trimmed sample may differ systematically from the full population. If the 50 trimmed units share characteristics (e.g., extreme covariate values), the estimate does not generalize to those subgroups. However, since the true PS is bounded away from 0 and 1, the overlap population is actually the full population.
                        (c) <strong>Bias considerations</strong>: Since the true PS is in \\([0.1, 0.9]\\), the extreme \\(\\hat{e}\\) values likely reflect estimation error. Trimming these units removes observations that are <em>estimated</em> to be extreme but may actually have moderate true PS. This introduces a subtle selection bias but reduces variance. A better approach might be to improve the PS model, or use stabilized weights, rather than trimming.`
                },
                {
                    question: 'Derive the IPW estimator for the ATT (Average Treatment Effect on the Treated) and explain why it requires a weaker positivity assumption than the ATE estimator.',
                    hint: 'For the ATT, we only need \\(E[Y(0) \\mid W=1]\\), not \\(E[Y(0)]\\) for the entire population.',
                    solution: `The ATT is \\(\\tau_{\\text{ATT}} = E[Y(1) - Y(0) \\mid W = 1]\\). We observe \\(Y(1)\\) for treated units directly. For \\(E[Y(0) \\mid W=1]\\), we use IPW on control units:
                        \\[E[Y(0) \\mid W=1] = E\\left[\\frac{(1-W) Y \\cdot e(X)}{(1-e(X)) \\cdot P(W=1)}\\right]\\]
                        The IPW-ATT estimator is:
                        \\[\\hat{\\tau}_{\\text{ATT}} = \\frac{1}{n_1} \\sum_{i:W_i=1} Y_i - \\frac{\\sum_{i:W_i=0} Y_i \\cdot \\hat{e}(X_i)/(1-\\hat{e}(X_i))}{\\sum_{i:W_i=0} \\hat{e}(X_i)/(1-\\hat{e}(X_i))}\\]
                        This requires only \\(P(W=0 \\mid X=x) > 0\\) for \\(x\\) in the support of \\(X \\mid W=1\\) — a weaker positivity condition. For the ATE, we need \\(0 < e(x) < 1\\) everywhere. For the ATT, we only need \\(e(x) < 1\\) (some control units exist at each covariate value for treated units). We do NOT need \\(e(x) > 0\\) because we never need to find treated units to match against controls.`
                }
            ]
        },

        // ============================================================
        // Section 5: Diagnostics & Balance Checking
        // ============================================================
        {
            id: 'ch09-sec05',
            title: 'Diagnostics & Balance Checking',
            content: `
                <h2>Diagnostics & Balance Checking</h2>

                <p>Propensity score methods are only as good as the model behind them. <strong>Balance checking</strong> is the essential diagnostic step that verifies whether the propensity score has successfully eliminated confounding. Unlike traditional statistical tests that assess treatment effects, balance diagnostics assess the <em>design</em> of the observational study.</p>

                <h3>Standardized Mean Differences</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 9.9 (Standardized Mean Difference)</div>
                    <div class="env-body">
                        <p>For each covariate \\(X_j\\), the <strong>standardized mean difference (SMD)</strong> before adjustment is:</p>
                        \\[d_j = \\frac{\\bar{X}_{j,1} - \\bar{X}_{j,0}}{\\sqrt{(s_{j,1}^2 + s_{j,0}^2)/2}}\\]
                        <p>where \\(\\bar{X}_{j,w}\\) and \\(s_{j,w}^2\\) are the sample mean and variance of \\(X_j\\) in treatment group \\(w\\). After PS adjustment (matching or weighting), the adjusted SMD uses the post-adjustment means and the <strong>unadjusted</strong> pooled standard deviation in the denominator.</p>
                    </div>
                </div>

                <div class="env-block warning">
                    <div class="env-title">Rules of Thumb for SMD</div>
                    <div class="env-body">
                        <ul>
                            <li>\\(|d_j| < 0.1\\): <strong>Good balance</strong>. The covariate is well-balanced between groups.</li>
                            <li>\\(0.1 \\leq |d_j| < 0.25\\): <strong>Moderate imbalance</strong>. May require attention.</li>
                            <li>\\(|d_j| \\geq 0.25\\): <strong>Substantial imbalance</strong>. The PS model likely needs revision.</li>
                        </ul>
                        <p>Note: Unlike p-values, SMDs do not depend on sample size, making them the preferred balance measure.</p>
                    </div>
                </div>

                <h3>Love Plots</h3>

                <p>A <strong>Love plot</strong> (named after Thomas Love) displays the absolute SMD for each covariate before and after PS adjustment side by side. It provides an immediate visual assessment of whether the PS adjustment has improved balance.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 9.10 (Love Plot)</div>
                    <div class="env-body">
                        <p>A Love plot shows:</p>
                        <ul>
                            <li>One row per covariate (including transformations and interactions)</li>
                            <li>Two points per row: the unadjusted SMD (before) and the adjusted SMD (after PS method)</li>
                            <li>A vertical reference line at \\(|d| = 0.1\\) (or \\(0.25\\))</li>
                        </ul>
                        <p>Successful PS adjustment shows all "after" points moving toward zero and crossing below the reference line.</p>
                    </div>
                </div>

                <h3>Overlap Assessment</h3>

                <p>The <strong>overlap</strong> (or <strong>positivity</strong>) assumption \\(0 < e(x) < 1\\) must hold for valid causal inference. Practical assessments include:</p>

                <ul>
                    <li><strong>PS distribution comparison</strong>: Plot histograms or density curves of \\(\\hat{e}(X)\\) for treated and control groups. Large non-overlapping regions indicate positivity violations.</li>
                    <li><strong>Effective sample size</strong>: For IPW, compute \\(n_{\\text{eff}} = (\\sum w_i)^2 / \\sum w_i^2\\). If \\(n_{\\text{eff}} \\ll n\\), extreme weights dominate.</li>
                    <li><strong>Crump et al. (2009) rule</strong>: Optimal trimming discards units with \\(\\hat{e}(X)\\) outside \\([\\alpha, 1-\\alpha]\\) where \\(\\alpha\\) solves \\(E[1/(e(X)(1-e(X))) \\cdot \\mathbf{1}_{e(X) \\in [\\alpha, 1-\\alpha]}] \\cdot P(e(X) \\in [\\alpha, 1-\\alpha]) = 2/\\alpha\\). In practice, \\(\\alpha \\approx 0.1\\) often works.</li>
                </ul>

                <h3>When Propensity Score Methods Fail</h3>

                <div class="env-block warning">
                    <div class="env-title">Situations Where PS Methods May Fail</div>
                    <div class="env-body">
                        <ol>
                            <li><strong>Unmeasured confounding</strong>: PS methods assume all confounders are observed. If \\((Y(1), Y(0)) \\not\\perp\\!\\!\\!\\perp W \\mid X\\), no amount of PS adjustment can remove the bias.</li>
                            <li><strong>PS model misspecification</strong>: If \\(\\hat{e}(X)\\) does not approximate the true \\(e(X)\\), balance may not be achieved. Iterative model improvement guided by balance diagnostics is essential.</li>
                            <li><strong>Lack of overlap</strong>: If the supports of \\(X \\mid W=1\\) and \\(X \\mid W=0\\) have little overlap, no statistical method can reliably estimate the ATE. The estimand may need to change (e.g., to ATT or to the overlap-weighted ATE).</li>
                            <li><strong>Treatment effect heterogeneity in thin-support regions</strong>: Even with some overlap, if few units exist in certain PS strata, estimates in those strata are highly variable.</li>
                        </ol>
                    </div>
                </div>

                <h3>Sensitivity Analysis</h3>

                <p>Since unconfoundedness is untestable, sensitivity analyses quantify how robust conclusions are to potential unmeasured confounding:</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 9.11 (Rosenbaum Bounds)</div>
                    <div class="env-body">
                        <p>Rosenbaum bounds parameterize unmeasured confounding by a sensitivity parameter \\(\\Gamma \\geq 1\\). For matched pairs, if an unmeasured confounder creates differential odds of treatment by at most \\(\\Gamma\\):</p>
                        \\[\\frac{1}{\\Gamma} \\leq \\frac{e(X_i)/(1-e(X_i))}{e(X_j)/(1-e(X_j))} \\leq \\Gamma\\]
                        <p>for matched units \\(i, j\\). When \\(\\Gamma = 1\\), there is no unmeasured confounding. The analysis reports the largest \\(\\Gamma\\) at which the treatment effect remains statistically significant. Large \\(\\Gamma\\) values indicate robust findings.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="ch09-viz-love-plot"></div>
            `,
            visualizations: [
                {
                    id: 'ch09-viz-love-plot',
                    title: 'Love Plot: Covariate Balance Before and After PS Adjustment',
                    description: 'A Love plot showing standardized mean differences for each covariate before (red) and after (green) propensity score adjustment. The dashed line marks the |SMD| = 0.1 threshold. Adjust the PS model quality to see how it affects balance.',
                    setup(container, controls) {
                        const viz = new VizEngine(container, {
                            width: 560, height: 420,
                            originX: 280, originY: 200, scale: 1
                        });

                        let modelQuality = 0.7;
                        let seed = 42;

                        function seededRandom(s) {
                            s = Math.sin(s) * 10000;
                            return s - Math.floor(s);
                        }

                        const covariateNames = [
                            'Age', 'Income', 'Education', 'BMI',
                            'Smoking', 'Exercise', 'Prev. Diagnosis',
                            'Insurance', 'Urban/Rural', 'Married'
                        ];

                        function draw() {
                            const ctx = viz.ctx;
                            viz.clear();

                            const nCov = covariateNames.length;

                            // Generate before/after SMDs
                            const beforeSMD = [];
                            const afterSMD = [];
                            for (let j = 0; j < nCov; j++) {
                                const raw = 0.1 + seededRandom(seed + j * 11) * 0.7;
                                beforeSMD.push(raw * (seededRandom(seed + j * 17) > 0.5 ? 1 : -1));

                                const reduction = modelQuality * (0.7 + 0.3 * seededRandom(seed + j * 23));
                                const residual = raw * (1 - reduction);
                                afterSMD.push(residual * (seededRandom(seed + j * 29) > 0.5 ? 1 : -1));
                            }

                            // Plot dimensions
                            const leftMargin = 130;
                            const rightMargin = 30;
                            const topMargin = 55;
                            const botMargin = 70;
                            const plotW = viz.width - leftMargin - rightMargin;
                            const plotH = viz.height - topMargin - botMargin;
                            const rowH = plotH / nCov;

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Love Plot: Covariate Balance Diagnostics', 280, 22);

                            // X axis: absolute SMD
                            const maxSMD = 0.8;
                            const xScale = plotW / maxSMD;

                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(leftMargin, topMargin + plotH);
                            ctx.lineTo(leftMargin + plotW, topMargin + plotH);
                            ctx.stroke();

                            // X axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            for (let v = 0; v <= maxSMD; v += 0.1) {
                                const x = leftMargin + v * xScale;
                                ctx.fillText(v.toFixed(1), x, topMargin + plotH + 15);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.3;
                                ctx.beginPath();
                                ctx.moveTo(x, topMargin);
                                ctx.lineTo(x, topMargin + plotH);
                                ctx.stroke();
                            }
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.fillText('Absolute Standardized Mean Difference', leftMargin + plotW / 2, topMargin + plotH + 35);

                            // Reference line at 0.1
                            const refX = leftMargin + 0.1 * xScale;
                            ctx.strokeStyle = viz.colors.yellow + 'aa';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 3]);
                            ctx.beginPath();
                            ctx.moveTo(refX, topMargin);
                            ctx.lineTo(refX, topMargin + plotH);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '9px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('threshold = 0.1', refX + 3, topMargin + 10);

                            // Draw each covariate row
                            for (let j = 0; j < nCov; j++) {
                                const y = topMargin + (j + 0.5) * rowH;
                                const absBefore = Math.abs(beforeSMD[j]);
                                const absAfter = Math.abs(afterSMD[j]);

                                // Row label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system, sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(covariateNames[j], leftMargin - 10, y + 4);

                                // Horizontal grid line
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.3;
                                ctx.beginPath();
                                ctx.moveTo(leftMargin, y);
                                ctx.lineTo(leftMargin + plotW, y);
                                ctx.stroke();

                                // Arrow from before to after
                                const bx = leftMargin + Math.min(absBefore, maxSMD) * xScale;
                                const ax = leftMargin + Math.min(absAfter, maxSMD) * xScale;

                                ctx.strokeStyle = viz.colors.text + '44';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(bx, y);
                                ctx.lineTo(ax, y);
                                ctx.stroke();

                                // Before point (red circle)
                                ctx.fillStyle = viz.colors.red;
                                ctx.beginPath();
                                ctx.arc(bx, y, 5, 0, Math.PI * 2);
                                ctx.fill();

                                // After point (green circle)
                                ctx.fillStyle = viz.colors.green;
                                ctx.beginPath();
                                ctx.arc(ax, y, 5, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Legend
                            const legY = topMargin + plotH + 48;
                            ctx.fillStyle = viz.colors.red;
                            ctx.beginPath(); ctx.arc(leftMargin + 40, legY, 5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Before PS adjustment', leftMargin + 50, legY + 3);

                            ctx.fillStyle = viz.colors.green;
                            ctx.beginPath(); ctx.arc(leftMargin + 220, legY, 5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('After PS adjustment', leftMargin + 230, legY + 3);

                            // Summary stat
                            const nBalanced = afterSMD.filter(s => Math.abs(s) < 0.1).length;
                            const balColor = nBalanced === nCov ? viz.colors.green :
                                             nBalanced >= nCov * 0.7 ? viz.colors.yellow : viz.colors.red;
                            ctx.fillStyle = balColor;
                            ctx.textAlign = 'right';
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.fillText(`${nBalanced}/${nCov} covariates balanced (|SMD| < 0.1)`, viz.width - 20, 42);
                        }

                        VizEngine.createSlider(controls, 'PS model quality', 0, 1, modelQuality, 0.05, v => {
                            modelQuality = v;
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Data', () => {
                            seed = Math.floor(Math.random() * 10000);
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why standardized mean differences (SMDs) are preferred over t-tests for assessing covariate balance after propensity score adjustment.',
                    hint: 'Consider what happens to the p-value of a t-test as the sample size changes, even if the actual imbalance stays the same.',
                    solution: `SMDs are preferred for several reasons: (1) <strong>Independence from sample size</strong>: A t-test p-value depends on both effect size and sample size. With large samples, trivially small imbalances produce statistically significant p-values, while with small samples, substantial imbalances may be "non-significant." The SMD measures the magnitude of imbalance directly. (2) <strong>Comparability</strong>: SMDs allow comparison of balance across covariates on different scales (e.g., age in years vs. income in dollars). (3) <strong>Pre-post comparison</strong>: SMDs can be compared before and after PS adjustment to show improvement, whereas p-values are not directly comparable. (4) <strong>Design vs. analysis</strong>: Balance assessment is a <em>design</em> question (are groups comparable?), not an inferential question (is there a treatment effect?). SMDs measure what we care about: whether the distributions of covariates are similar. The threshold |SMD| < 0.1 corresponds to a "small" effect size by Cohen's convention.`
                },
                {
                    question: 'A Love plot shows that after PS matching, all covariate SMDs are below 0.1 except for the interaction term \\(X_1 \\times X_2\\) (SMD = 0.35). What should the researcher do?',
                    hint: 'Think about what the PS model may have missed and how to incorporate higher-order terms.',
                    solution: `The imbalance on \\(X_1 \\times X_2\\) means the PS model failed to capture this interaction's effect on treatment assignment. Steps: (1) <strong>Add the interaction</strong> \\(X_1 \\times X_2\\) as a covariate in the PS model (if not already included). (2) <strong>Re-estimate PS</strong> with the augmented model including \\(X_1 \\times X_2\\) and potentially other interactions. (3) <strong>Re-match and re-check balance</strong> on all terms including the interaction. (4) <strong>Consider adding polynomial terms</strong> for \\(X_1\\) and \\(X_2\\) as well, since the interaction imbalance may signal nonlinearities. (5) If matching alone cannot achieve balance on this interaction, consider <strong>exact matching</strong> on discretized versions of \\(X_1\\) and \\(X_2\\) combined with PS matching on other covariates. This iterative process of model specification, balance assessment, and re-specification is a core feature of PS analysis and should continue until adequate balance is achieved on all terms.`
                },
                {
                    question: 'Interpret a Rosenbaum sensitivity analysis that reports \\(\\Gamma = 2.3\\). What does this mean substantively, and would you consider the finding robust?',
                    hint: 'Recall that \\(\\Gamma\\) parameterizes the maximum odds ratio by which an unmeasured confounder could differentially affect treatment.',
                    solution: `\\(\\Gamma = 2.3\\) means the treatment effect finding remains statistically significant even if an unmeasured confounder could make two matched individuals (identical on observed covariates) differ in their odds of treatment by up to a factor of 2.3. More precisely, if \\(e_i/(1-e_i)\\) could differ from \\(e_j/(1-e_j)\\) by at most \\(\\Gamma = 2.3\\) due to an unmeasured factor, the conclusion still holds. At \\(\\Gamma = 2.4\\) or higher, the result would become non-significant. <strong>Interpretation</strong>: this is moderately robust. An unmeasured confounder would need to more than double the odds of treatment (controlling for observed covariates) to explain away the finding. Whether 2.3 is "robust enough" depends on context: in a well-designed observational study where key confounders are measured, \\(\\Gamma = 2.3\\) is reasonably reassuring. In a study with obvious missing confounders, it may not be sufficient. For comparison, landmark studies in epidemiology (e.g., smoking and lung cancer) achieve \\(\\Gamma > 5\\), which is very robust.`
                },
                {
                    question: 'Design a complete PS analysis workflow. Given observational data with treatment \\(W\\), outcome \\(Y\\), and covariates \\(X_1, \\ldots, X_{10}\\), describe each step from PS estimation to final inference, including all diagnostic checks.',
                    hint: 'Consider the iterative nature of PS analysis: estimate PS, check balance, revise if necessary, then estimate the treatment effect.',
                    solution: `<strong>Step 1: Estimate PS.</strong> Fit logistic regression of \\(W\\) on \\(X_1, \\ldots, X_{10}\\). Include squared terms for continuous covariates and key interactions. Compute \\(\\hat{e}(X_i)\\) for all units.
                        <strong>Step 2: Check overlap.</strong> Plot PS distributions for treated vs control. Check for regions of non-overlap. Compute effective sample size. If overlap is poor, consider trimming or changing the estimand to ATT.
                        <strong>Step 3: Apply PS method.</strong> Choose matching, stratification, or IPW based on goals. For matching: perform 1:1 caliper matching (\\(\\delta = 0.2 \\cdot \\text{SD}(\\hat{e})\\)). For IPW: compute weights and check for extreme values.
                        <strong>Step 4: Check balance.</strong> Compute SMDs for all covariates (including squared terms and interactions). Create a Love plot. If any SMD > 0.1: return to Step 1 and revise the PS model (add nonlinear terms, interactions).
                        <strong>Step 5: Estimate treatment effect.</strong> Using the matched sample or weighted sample, estimate \\(\\hat{\\tau}\\). For matching: \\(\\hat{\\tau} = n_1^{-1} \\sum (Y_{i,\\text{treated}} - Y_{i,\\text{matched control}})\\). For IPW: use Hajek estimator.
                        <strong>Step 6: Standard errors.</strong> For matching: use Abadie-Imbens SE (accounts for matching uncertainty). For IPW: use sandwich/robust SE or bootstrap.
                        <strong>Step 7: Sensitivity analysis.</strong> Compute Rosenbaum bounds. Report the critical \\(\\Gamma\\) value. Discuss plausible unmeasured confounders.
                        <strong>Step 8: Report.</strong> Present the Love plot, PS overlap plot, treatment effect with CI, sensitivity parameter, and effective sample size.`
                }
            ]
        }
    ]
});
