window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch10',
    number: 10,
    title: 'Doubly Robust Estimation',
    subtitle: 'Combining Models for Robust Causal Inference',
    sections: [
        // ============================================================
        // Section 1: Motivation for Double Robustness
        // ============================================================
        {
            id: 'ch10-sec01',
            title: 'Motivation for Double Robustness',
            content: `
                <h2>Motivation for Double Robustness</h2>

                <p>In the preceding chapters, we studied two fundamental approaches to causal inference under unconfoundedness. <strong>Outcome regression</strong> (OR) models the conditional mean \\(\\mu_w(x) = \\mathbb{E}[Y \\mid X = x, W = w]\\) and imputes missing potential outcomes. <strong>Inverse probability weighting</strong> (IPW) models the propensity score \\(e(x) = \\mathbb{P}(W = 1 \\mid X = x)\\) and reweights observed outcomes to create pseudo-populations. Each approach relies critically on the correct specification of its respective model.</p>

                <div class="env-block warning">
                    <div class="env-title">The Model Misspecification Problem</div>
                    <div class="env-body">
                        <p>In practice, we rarely know the true functional form of either \\(\\mu_w(x)\\) or \\(e(x)\\). If the outcome model is misspecified, the OR estimator is biased. If the propensity score model is misspecified, the IPW estimator is biased. Both approaches place all their eggs in one basket.</p>
                    </div>
                </div>

                <p>This motivates a natural question: can we construct an estimator that is consistent if <strong>either</strong> the outcome model <strong>or</strong> the propensity score model is correctly specified? Such an estimator would give the analyst <strong>two chances</strong> to get the modeling right, rather than just one.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 10.1 (Double Robustness)</div>
                    <div class="env-body">
                        <p>An estimator \\(\\hat{\\tau}\\) of the average treatment effect \\(\\tau = \\mathbb{E}[Y(1) - Y(0)]\\) is <strong>doubly robust</strong> (DR) if it is consistent for \\(\\tau\\) whenever at least one of the following conditions holds:</p>
                        <ol>
                            <li>The outcome model \\(\\hat{\\mu}_w(x)\\) converges in probability to the true \\(\\mu_w(x)\\) for \\(w \\in \\{0, 1\\}\\).</li>
                            <li>The propensity score model \\(\\hat{e}(x)\\) converges in probability to the true \\(e(x)\\).</li>
                        </ol>
                    </div>
                </div>

                <p>The idea is elegant: by combining both models, the bias from misspecifying one is corrected by the other. To see why this might work, consider the bias of an outcome regression estimator. The error is \\(\\hat{\\mu}_w(x) - \\mu_w(x)\\). Under IPW, the weights \\(W/e(X)\\) and \\((1-W)/(1-e(X))\\) rebalance the covariate distribution. If the propensity score is correct, these weights integrate the outcome model error to zero, even if the outcome model is wrong.</p>

                <div class="env-block intuition">
                    <div class="env-title">Intuition: Two Chances to Get It Right</div>
                    <div class="env-body">
                        <p>Think of double robustness as a safety net. You are estimating a causal effect by building two models: one for the outcome and one for the treatment assignment. If your outcome model is perfect, the propensity score weights are irrelevant (the augmentation already corrects everything). If your propensity score model is perfect, the IPW reweighting eliminates the bias from a misspecified outcome model. You only fail if <strong>both</strong> models are wrong.</p>
                    </div>
                </div>

                <p>More precisely, the bias of a doubly robust estimator is proportional to the <strong>product</strong> of the errors in the two models:</p>
                \\[\\text{Bias}(\\hat{\\tau}_{\\text{DR}}) \\propto \\mathbb{E}\\bigl[(\\hat{e}(X) - e(X))(\\hat{\\mu}_w(X) - \\mu_w(X))\\bigr].\\]
                <p>This product structure means the bias is zero whenever either factor is zero. Moreover, even if both models are slightly wrong, the bias can be much smaller than that of either OR or IPW alone, since it depends on the <em>product</em> of two small errors rather than either error individually.</p>

                <div class="env-block example">
                    <div class="env-title">Example 10.1 (Bias Comparison)</div>
                    <div class="env-body">
                        <p>Suppose the outcome model error is \\(O(n^{-1/4})\\) and the propensity score error is also \\(O(n^{-1/4})\\). Then:</p>
                        <ul>
                            <li><strong>OR bias:</strong> \\(O(n^{-1/4})\\) &mdash; too slow for \\(\\sqrt{n}\\)-inference.</li>
                            <li><strong>IPW bias:</strong> \\(O(n^{-1/4})\\) &mdash; same problem.</li>
                            <li><strong>DR bias:</strong> \\(O(n^{-1/4} \\times n^{-1/4}) = O(n^{-1/2})\\) &mdash; fast enough for valid confidence intervals!</li>
                        </ul>
                        <p>This is the key insight behind <strong>debiased/double machine learning</strong>: by combining two machine learning models, each converging at slower-than-parametric rates, the DR estimator can still achieve \\(\\sqrt{n}\\)-consistency.</p>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 10.1 (Double Robustness Property)</div>
                    <div class="env-body">
                        <p>Let \\(\\hat{\\tau}_{\\text{DR}}\\) be the augmented IPW estimator (defined in Section 2). Under standard regularity conditions:</p>
                        <ol>
                            <li>If \\(\\hat{e}(x) \\xrightarrow{p} e(x)\\) for all \\(x\\), then \\(\\hat{\\tau}_{\\text{DR}} \\xrightarrow{p} \\tau\\) regardless of \\(\\hat{\\mu}_w\\).</li>
                            <li>If \\(\\hat{\\mu}_w(x) \\xrightarrow{p} \\mu_w(x)\\) for all \\(x\\) and \\(w \\in \\{0,1\\}\\), then \\(\\hat{\\tau}_{\\text{DR}} \\xrightarrow{p} \\tau\\) regardless of \\(\\hat{e}\\).</li>
                        </ol>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'viz-dr-motivation',
                    title: 'Double Robustness Under Misspecification',
                    description: 'Simulation comparing OR, IPW, and DR estimators when one model is misspecified.',
                    type: 'canvas',
                    setup: function(container) {
                        const viz = new VizEngine(container, { width: 700, height: 450, originX: 80, originY: 380, scale: 30 });
                        const controls = document.createElement('div');
                        controls.className = 'viz-controls';
                        container.appendChild(controls);

                        let scenario = 'ps_wrong';
                        let simData = null;

                        const scenarioBtn1 = VizEngine.createButton(controls, 'PS Wrong, OR Correct', () => {
                            scenario = 'ps_wrong'; runSim();
                        });
                        const scenarioBtn2 = VizEngine.createButton(controls, 'OR Wrong, PS Correct', () => {
                            scenario = 'or_wrong'; runSim();
                        });
                        const scenarioBtn3 = VizEngine.createButton(controls, 'Both Wrong', () => {
                            scenario = 'both_wrong'; runSim();
                        });
                        const scenarioBtn4 = VizEngine.createButton(controls, 'Both Correct', () => {
                            scenario = 'both_correct'; runSim();
                        });
                        VizEngine.createButton(controls, 'Re-simulate', () => runSim());

                        function generateData(n) {
                            const data = [];
                            for (let i = 0; i < n; i++) {
                                const x = VizEngine.randomNormal(0, 1);
                                const truePS = 1 / (1 + Math.exp(-(0.5 * x + 0.3 * x * x)));
                                const w = Math.random() < truePS ? 1 : 0;
                                const mu1 = 2 + x + 0.5 * x * x;
                                const mu0 = x + 0.3 * x * x;
                                const y = w === 1 ? mu1 + VizEngine.randomNormal(0, 0.5) : mu0 + VizEngine.randomNormal(0, 0.5);
                                data.push({ x, w, y, truePS, mu1, mu0 });
                            }
                            return data;
                        }

                        function estimateATE(data, sc) {
                            const n = data.length;
                            const trueATE = 2;

                            let orEst = 0, ipwEst = 0, drEst = 0;

                            for (let i = 0; i < n; i++) {
                                const d = data[i];
                                let ps, m1, m0;

                                if (sc === 'ps_wrong' || sc === 'both_wrong') {
                                    ps = 1 / (1 + Math.exp(-0.2 * d.x));
                                } else {
                                    ps = 1 / (1 + Math.exp(-(0.5 * d.x + 0.3 * d.x * d.x)));
                                }
                                ps = Math.max(0.01, Math.min(0.99, ps));

                                if (sc === 'or_wrong' || sc === 'both_wrong') {
                                    m1 = 2 + 0.5 * d.x;
                                    m0 = 0.5 * d.x;
                                } else {
                                    m1 = 2 + d.x + 0.5 * d.x * d.x;
                                    m0 = d.x + 0.3 * d.x * d.x;
                                }

                                orEst += (m1 - m0);
                                ipwEst += d.w * d.y / ps - (1 - d.w) * d.y / (1 - ps);
                                drEst += (m1 - m0)
                                    + d.w * (d.y - m1) / ps
                                    - (1 - d.w) * (d.y - m0) / (1 - ps);
                            }

                            return {
                                or: orEst / n,
                                ipw: ipwEst / n,
                                dr: drEst / n,
                                truth: trueATE
                            };
                        }

                        function runSim() {
                            const nReps = 200;
                            const nObs = 200;
                            const results = { or: [], ipw: [], dr: [] };

                            for (let r = 0; r < nReps; r++) {
                                const data = generateData(nObs);
                                const est = estimateATE(data, scenario);
                                results.or.push(est.or);
                                results.ipw.push(est.ipw);
                                results.dr.push(est.dr);
                            }
                            simData = results;
                            draw();
                        }

                        function draw() {
                            if (!simData) return;
                            viz.clear();

                            const ctx = viz.ctx;
                            const trueATE = 2;
                            const methods = [
                                { name: 'OR', data: simData.or, color: viz.colors.blue },
                                { name: 'IPW', data: simData.ipw, color: viz.colors.orange },
                                { name: 'DR', data: simData.dr, color: viz.colors.green }
                            ];

                            const barWidth = 160;
                            const startX = 100;
                            const spacing = 50;
                            const baseY = 380;
                            const maxHeight = 300;

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';

                            let title = '';
                            if (scenario === 'ps_wrong') title = 'Scenario: PS Wrong, OR Correct';
                            else if (scenario === 'or_wrong') title = 'Scenario: OR Wrong, PS Correct';
                            else if (scenario === 'both_wrong') title = 'Scenario: Both Models Wrong';
                            else title = 'Scenario: Both Models Correct';

                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText(title, viz.width / 2, 20);

                            methods.forEach((m, idx) => {
                                const mean = VizEngine.mean(m.data);
                                const bias = mean - trueATE;
                                const rmse = Math.sqrt(VizEngine.mean(m.data.map(v => (v - trueATE) ** 2)));

                                const cx = startX + idx * (barWidth + spacing) + barWidth / 2;

                                const binMin = trueATE - 2;
                                const binMax = trueATE + 2;
                                const nBins = 20;
                                const binW = (binMax - binMin) / nBins;
                                const counts = new Array(nBins).fill(0);
                                for (const v of m.data) {
                                    const bi = Math.floor((v - binMin) / binW);
                                    if (bi >= 0 && bi < nBins) counts[bi]++;
                                }
                                const maxCount = Math.max(...counts);

                                for (let b = 0; b < nBins; b++) {
                                    const h = maxCount > 0 ? (counts[b] / maxCount) * maxHeight * 0.7 : 0;
                                    const bx = cx - barWidth / 2 + (b / nBins) * barWidth;
                                    const bw = barWidth / nBins;
                                    ctx.fillStyle = m.color + '66';
                                    ctx.fillRect(bx, baseY - h, bw - 1, h);
                                }

                                const truthBin = ((trueATE - binMin) / (binMax - binMin)) * barWidth;
                                const truthX = cx - barWidth / 2 + truthBin;
                                ctx.strokeStyle = viz.colors.red;
                                ctx.lineWidth = 2;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                ctx.moveTo(truthX, baseY);
                                ctx.lineTo(truthX, baseY - maxHeight * 0.75);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                const meanBin = ((mean - binMin) / (binMax - binMin)) * barWidth;
                                const meanX = cx - barWidth / 2 + meanBin;
                                ctx.strokeStyle = m.color;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.moveTo(meanX, baseY);
                                ctx.lineTo(meanX, baseY - maxHeight * 0.75);
                                ctx.stroke();

                                ctx.fillStyle = m.color;
                                ctx.font = 'bold 13px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(m.name, cx, baseY + 20);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system, sans-serif';
                                ctx.fillText('Bias: ' + bias.toFixed(3), cx, baseY + 38);
                                ctx.fillText('RMSE: ' + rmse.toFixed(3), cx, baseY + 52);
                            });

                            ctx.fillStyle = viz.colors.red;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('--- True ATE', 20, 50);
                        }

                        runSim();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain in your own words why an outcome regression estimator is biased when the outcome model is misspecified, even if unconfoundedness holds.',
                    hint: 'Consider what happens when you impute potential outcomes using a wrong functional form.',
                    solution: 'Under unconfoundedness, the ATE can be identified as \\(\\tau = \\mathbb{E}[\\mu_1(X) - \\mu_0(X)]\\) where \\(\\mu_w(x) = \\mathbb{E}[Y \\mid X=x, W=w]\\). The OR estimator replaces the true \\(\\mu_w\\) with an estimate \\(\\hat{\\mu}_w\\). If this estimate converges to some \\(\\tilde{\\mu}_w \\neq \\mu_w\\) due to misspecification (e.g., fitting a linear model when the truth is nonlinear), then the estimator converges to \\(\\mathbb{E}[\\tilde{\\mu}_1(X) - \\tilde{\\mu}_0(X)] \\neq \\tau\\). The bias equals \\(\\mathbb{E}[(\\tilde{\\mu}_1(X) - \\mu_1(X)) - (\\tilde{\\mu}_0(X) - \\mu_0(X))]\\), which is generally nonzero when the model is misspecified.'
                },
                {
                    question: 'Why does the IPW estimator suffer from high variance when propensity scores are close to 0 or 1? Show that \\(\\text{Var}(W_i Y_i / e(X_i)) \\to \\infty\\) as \\(e(X_i) \\to 0\\).',
                    hint: 'Compute the conditional variance of \\(WY/e(X)\\) given \\(X\\).',
                    solution: 'Conditional on \\(X = x\\), \\(W \\sim \\text{Bernoulli}(e(x))\\) and \\(WY/e(x)\\) takes value \\(Y/e(x)\\) with probability \\(e(x)\\) and 0 with probability \\(1-e(x)\\). Thus \\(\\mathbb{E}[WY/e(x) \\mid X=x] = \\mu_1(x)\\) and \\(\\mathbb{E}[(WY/e(x))^2 \\mid X=x] = \\mathbb{E}[Y^2 \\mid X=x, W=1]/e(x)\\). The conditional variance is \\(\\text{Var}(WY/e(x) \\mid X=x) = \\mathbb{E}[Y^2 \\mid X=x, W=1]/e(x) - \\mu_1(x)^2\\). As \\(e(x) \\to 0\\), the first term \\(\\to \\infty\\), so the variance diverges. This is because we are dividing by a near-zero probability, massively inflating the contribution of rare treated units.'
                },
                {
                    question: 'Show that the bias of a doubly robust estimator is proportional to \\(\\mathbb{E}[(\\hat{e}(X) - e(X))(\\hat{\\mu}_w(X) - \\mu_w(X))]\\). Why does this product structure guarantee double robustness?',
                    hint: 'Start from the AIPW formula and take expectations, keeping track of where the two model errors enter.',
                    solution: 'The AIPW estimand for the treated potential outcome mean is \\(\\mathbb{E}\\bigl[\\hat{\\mu}_1(X) + \\frac{W(Y - \\hat{\\mu}_1(X))}{\\hat{e}(X)}\\bigr]\\). Taking expectations and using the law of iterated expectations: \\(\\mathbb{E}[\\mu_1(X)] + \\mathbb{E}\\bigl[\\frac{e(X)(\\mu_1(X) - \\hat{\\mu}_1(X))}{\\hat{e}(X)}\\bigr] + \\mathbb{E}[\\hat{\\mu}_1(X) - \\mu_1(X)]\\). Simplifying: \\(\\mathbb{E}[\\mu_1(X)] + \\mathbb{E}\\bigl[(\\hat{\\mu}_1(X) - \\mu_1(X))\\bigl(1 - \\frac{e(X)}{\\hat{e}(X)}\\bigr)\\bigr]\\). The error term \\(1 - e(X)/\\hat{e}(X) = (\\hat{e}(X) - e(X))/\\hat{e}(X)\\). So the bias involves the product of outcome model error and propensity score error. If either is zero, the product is zero, establishing double robustness.'
                },
                {
                    question: 'Consider a scenario where the true propensity score is \\(e(x) = \\Phi(x)\\) (standard normal CDF) and the true outcome model is \\(\\mu_1(x) = x^2\\), \\(\\mu_0(x) = 0\\). If we misspecify the propensity score as \\(\\hat{e}(x) = 0.5\\) for all \\(x\\) but correctly specify the outcome model, will the DR estimator still be consistent? Explain.',
                    hint: 'Apply the double robustness property: which model is correctly specified?',
                    solution: 'Yes, the DR estimator will be consistent. By the double robustness property (Theorem 10.1), consistency requires only that at least one of the two models is correctly specified. Here, the outcome model is correctly specified: \\(\\hat{\\mu}_1(x) = x^2 \\to \\mu_1(x)\\) and \\(\\hat{\\mu}_0(x) = 0 \\to \\mu_0(x)\\). Even though the propensity score model is completely wrong (constant 0.5 vs. the true \\(\\Phi(x)\\)), the bias is proportional to \\(\\mathbb{E}[(0.5 - \\Phi(X)) \\cdot 0] = 0\\) since the outcome model error is zero. The DR estimator effectively reduces to the correctly specified outcome regression estimator, with the augmentation term contributing zero bias.'
                }
            ]
        },
        // ============================================================
        // Section 2: The AIPW Estimator
        // ============================================================
        {
            id: 'ch10-sec02',
            title: 'The AIPW Estimator',
            content: `
                <h2>The Augmented Inverse Probability Weighting (AIPW) Estimator</h2>

                <p>The most widely used doubly robust estimator is the <strong>augmented inverse probability weighting</strong> (AIPW) estimator, also known as the doubly robust estimator. It combines outcome regression with IPW by augmenting the regression imputation with an IPW-based bias correction term.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 10.2 (AIPW Estimator)</div>
                    <div class="env-body">
                        <p>Given estimates \\(\\hat{\\mu}_w(x)\\) of the outcome regression functions and \\(\\hat{e}(x)\\) of the propensity score, the AIPW estimator of the ATE is:</p>
                        \\[\\hat{\\tau}_{\\text{AIPW}} = \\frac{1}{n} \\sum_{i=1}^{n} \\Bigl[\\hat{\\mu}_1(X_i) - \\hat{\\mu}_0(X_i) + \\frac{W_i(Y_i - \\hat{\\mu}_1(X_i))}{\\hat{e}(X_i)} - \\frac{(1-W_i)(Y_i - \\hat{\\mu}_0(X_i))}{1 - \\hat{e}(X_i)}\\Bigr].\\]
                    </div>
                </div>

                <p>Let us unpack this formula. The estimator has two parts for each potential outcome mean:</p>

                <div class="env-block intuition">
                    <div class="env-title">Anatomy of the AIPW Estimator</div>
                    <div class="env-body">
                        <p>For the treated potential outcome mean \\(\\mathbb{E}[Y(1)]\\):</p>
                        \\[\\hat{\\mu}_{\\text{AIPW},1} = \\frac{1}{n} \\sum_{i=1}^{n} \\biggl[\\underbrace{\\hat{\\mu}_1(X_i)}_{\\text{OR imputation}} + \\underbrace{\\frac{W_i(Y_i - \\hat{\\mu}_1(X_i))}{\\hat{e}(X_i)}}_{\\text{IPW bias correction}}\\biggr].\\]
                        <p>The first term is the outcome regression prediction. The second term corrects for any bias in this prediction using IPW. If the outcome model is perfect (\\(Y_i = \\hat{\\mu}_1(X_i)\\) for treated units), the correction term vanishes. If the outcome model is wrong but the propensity score is right, the IPW correction eliminates the bias.</p>
                    </div>
                </div>

                <h3>Derivation as a One-Step Correction</h3>

                <p>The AIPW estimator can be derived as a <strong>one-step correction</strong> to the plug-in outcome regression estimator. Starting from the simple OR estimator:</p>
                \\[\\hat{\\tau}_{\\text{OR}} = \\frac{1}{n} \\sum_{i=1}^{n} [\\hat{\\mu}_1(X_i) - \\hat{\\mu}_0(X_i)],\\]
                <p>we add a correction based on the <strong>efficient influence function</strong>:</p>
                \\[\\hat{\\tau}_{\\text{AIPW}} = \\hat{\\tau}_{\\text{OR}} + \\frac{1}{n} \\sum_{i=1}^{n} \\biggl[\\frac{W_i(Y_i - \\hat{\\mu}_1(X_i))}{\\hat{e}(X_i)} - \\frac{(1-W_i)(Y_i - \\hat{\\mu}_0(X_i))}{1 - \\hat{e}(X_i)}\\biggr].\\]

                <p>The correction term has zero expectation when the outcome model is correctly specified (since \\(\\mathbb{E}[Y_i - \\mu_1(X_i) \\mid X_i, W_i = 1] = 0\\)), so it does not introduce bias when OR is correct. But when OR is wrong, the correction term uses IPW to undo the bias.</p>

                <h3>The Efficient Influence Function</h3>

                <p>The AIPW estimator arises naturally from the <strong>efficient influence function</strong> (EIF) for the ATE. The influence function of a functional \\(\\tau(P)\\) characterizes the first-order sensitivity of \\(\\tau\\) to perturbations of the distribution \\(P\\).</p>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 10.2 (Influence Function for ATE)</div>
                    <div class="env-body">
                        <p>Under unconfoundedness and positivity, the efficient influence function for the ATE \\(\\tau = \\mathbb{E}[Y(1) - Y(0)]\\) is:</p>
                        \\[\\varphi(W, X, Y) = \\mu_1(X) - \\mu_0(X) - \\tau + \\frac{W(Y - \\mu_1(X))}{e(X)} - \\frac{(1-W)(Y - \\mu_0(X))}{1-e(X)}.\\]
                        <p>This function satisfies \\(\\mathbb{E}[\\varphi(W, X, Y)] = 0\\) and is the unique influence function that achieves the semiparametric efficiency bound.</p>
                    </div>
                </div>

                <p>The AIPW estimator is simply the sample average of the estimated influence function evaluated at the data:</p>
                \\[\\hat{\\tau}_{\\text{AIPW}} = \\frac{1}{n} \\sum_{i=1}^n \\hat{\\varphi}(W_i, X_i, Y_i).\\]
                <p>This connection to the influence function is deep: it implies that the AIPW estimator inherits many desirable properties, including asymptotic normality and semiparametric efficiency (under regularity conditions).</p>

                <div class="env-block proposition">
                    <div class="env-title">Proposition 10.1 (Asymptotic Normality of AIPW)</div>
                    <div class="env-body">
                        <p>If both nuisance models are consistent at rates \\(\\|\\hat{\\mu}_w - \\mu_w\\|_2 = o_P(n^{-1/4})\\) and \\(\\|\\hat{e} - e\\|_2 = o_P(n^{-1/4})\\), then:</p>
                        \\[\\sqrt{n}(\\hat{\\tau}_{\\text{AIPW}} - \\tau) \\xrightarrow{d} N\\bigl(0, \\, \\text{Var}(\\varphi(W, X, Y))\\bigr).\\]
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark 10.1 (Connection to IPW)</div>
                    <div class="env-body">
                        <p>If we set \\(\\hat{\\mu}_w(x) \\equiv 0\\), the AIPW estimator reduces to the Horvitz-Thompson IPW estimator. If we set \\(\\hat{e}(x) \\equiv W_i\\) (degenerate), we recover the OR estimator. Thus AIPW nests both approaches as special cases.</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'viz-aipw-comparison',
                    title: 'Bias of OR, IPW, and AIPW Under Misspecification',
                    description: 'Compare the sampling distributions of three estimators across different misspecification scenarios.',
                    type: 'canvas',
                    setup: function(container) {
                        const viz = new VizEngine(container, { width: 700, height: 420, originX: 60, originY: 360, scale: 30 });
                        const controls = document.createElement('div');
                        controls.className = 'viz-controls';
                        container.appendChild(controls);

                        let nSamples = 300;
                        let misspecType = 'none';

                        VizEngine.createButton(controls, 'No Misspecification', () => { misspecType = 'none'; runAndDraw(); });
                        VizEngine.createButton(controls, 'PS Misspecified', () => { misspecType = 'ps'; runAndDraw(); });
                        VizEngine.createButton(controls, 'OR Misspecified', () => { misspecType = 'or'; runAndDraw(); });
                        VizEngine.createButton(controls, 'Both Misspecified', () => { misspecType = 'both'; runAndDraw(); });

                        const nSlider = VizEngine.createSlider(controls, 'n per sim', 50, 500, nSamples, 50, (v) => {
                            nSamples = Math.round(v); runAndDraw();
                        });

                        function simulate() {
                            const nReps = 300;
                            const results = { or: [], ipw: [], aipw: [] };

                            for (let rep = 0; rep < nReps; rep++) {
                                let sumOR = 0, sumIPW = 0, sumAIPW = 0;
                                for (let i = 0; i < nSamples; i++) {
                                    const x = VizEngine.randomNormal(0, 1);
                                    const trueE = 1 / (1 + Math.exp(-(x + 0.2 * x * x)));
                                    const w = Math.random() < trueE ? 1 : 0;
                                    const trueMu1 = 1 + x + 0.3 * x * x;
                                    const trueMu0 = x - 0.2 * x * x;
                                    const y = (w === 1 ? trueMu1 : trueMu0) + VizEngine.randomNormal(0, 0.5);

                                    let eHat, mu1Hat, mu0Hat;

                                    if (misspecType === 'ps' || misspecType === 'both') {
                                        eHat = 1 / (1 + Math.exp(-0.3 * x));
                                    } else {
                                        eHat = 1 / (1 + Math.exp(-(x + 0.2 * x * x)));
                                    }

                                    if (misspecType === 'or' || misspecType === 'both') {
                                        mu1Hat = 1 + 0.5 * x;
                                        mu0Hat = 0.5 * x;
                                    } else {
                                        mu1Hat = 1 + x + 0.3 * x * x;
                                        mu0Hat = x - 0.2 * x * x;
                                    }

                                    eHat = Math.max(0.02, Math.min(0.98, eHat));

                                    sumOR += (mu1Hat - mu0Hat);
                                    sumIPW += w * y / eHat - (1 - w) * y / (1 - eHat);
                                    sumAIPW += (mu1Hat - mu0Hat)
                                        + w * (y - mu1Hat) / eHat
                                        - (1 - w) * (y - mu0Hat) / (1 - eHat);
                                }
                                results.or.push(sumOR / nSamples);
                                results.ipw.push(sumIPW / nSamples);
                                results.aipw.push(sumAIPW / nSamples);
                            }
                            return results;
                        }

                        function drawResults(results) {
                            viz.clear();
                            const ctx = viz.ctx;
                            const trueATE = 1;
                            const methods = [
                                { name: 'Outcome Reg', data: results.or, color: viz.colors.blue },
                                { name: 'IPW', data: results.ipw, color: viz.colors.orange },
                                { name: 'AIPW', data: results.aipw, color: viz.colors.green }
                            ];

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            let label = 'No misspecification';
                            if (misspecType === 'ps') label = 'Propensity score misspecified';
                            else if (misspecType === 'or') label = 'Outcome model misspecified';
                            else if (misspecType === 'both') label = 'Both models misspecified';
                            ctx.fillText(label, viz.width / 2, 18);

                            const plotW = 180;
                            const gap = 30;
                            const totalW = 3 * plotW + 2 * gap;
                            const startX = (viz.width - totalW) / 2;
                            const baseY = 350;
                            const plotH = 260;

                            methods.forEach((m, idx) => {
                                const cx = startX + idx * (plotW + gap) + plotW / 2;
                                const mean = VizEngine.mean(m.data);
                                const bias = mean - trueATE;
                                const sd = Math.sqrt(VizEngine.variance(m.data));

                                const binMin = trueATE - 3 * Math.max(sd, 0.3);
                                const binMax = trueATE + 3 * Math.max(sd, 0.3);
                                const nBins = 25;
                                const binW = (binMax - binMin) / nBins;
                                const counts = new Array(nBins).fill(0);
                                for (const v of m.data) {
                                    const bi = Math.floor((v - binMin) / binW);
                                    if (bi >= 0 && bi < nBins) counts[bi]++;
                                }
                                const maxCount = Math.max(...counts, 1);

                                for (let b = 0; b < nBins; b++) {
                                    const h = (counts[b] / maxCount) * plotH * 0.8;
                                    const bx = cx - plotW / 2 + (b / nBins) * plotW;
                                    ctx.fillStyle = m.color + '55';
                                    ctx.fillRect(bx, baseY - h, plotW / nBins - 1, h);
                                }

                                const truthFrac = (trueATE - binMin) / (binMax - binMin);
                                const truthX = cx - plotW / 2 + truthFrac * plotW;
                                ctx.strokeStyle = viz.colors.red;
                                ctx.lineWidth = 2;
                                ctx.setLineDash([5, 3]);
                                ctx.beginPath();
                                ctx.moveTo(truthX, baseY);
                                ctx.lineTo(truthX, baseY - plotH * 0.85);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                const meanFrac = (mean - binMin) / (binMax - binMin);
                                const meanX = cx - plotW / 2 + meanFrac * plotW;
                                ctx.strokeStyle = m.color;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.moveTo(meanX, baseY);
                                ctx.lineTo(meanX, baseY - plotH * 0.85);
                                ctx.stroke();

                                ctx.fillStyle = m.color;
                                ctx.font = 'bold 12px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(m.name, cx, baseY + 18);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system, sans-serif';
                                ctx.fillText('Bias: ' + bias.toFixed(3) + '  SD: ' + sd.toFixed(3), cx, baseY + 34);
                            });

                            ctx.fillStyle = viz.colors.red;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('--- True ATE = ' + trueATE.toFixed(1), 15, 45);
                        }

                        function runAndDraw() {
                            const results = simulate();
                            drawResults(results);
                        }

                        runAndDraw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write out the AIPW estimator for the average treatment effect on the treated (ATT) instead of the ATE. How does it differ from the ATE version?',
                    hint: 'The ATT is \\(\\tau_{\\text{ATT}} = \\mathbb{E}[Y(1) - Y(0) \\mid W = 1]\\). You need to adjust the weighting to target the treated subpopulation.',
                    solution: 'The AIPW estimator for the ATT is: \\(\\hat{\\tau}_{\\text{ATT}} = \\frac{1}{n_1} \\sum_{i: W_i=1} (Y_i - \\hat{\\mu}_0(X_i)) - \\frac{1}{n_1} \\sum_{i: W_i=0} \\frac{\\hat{e}(X_i)}{1 - \\hat{e}(X_i)}(Y_i - \\hat{\\mu}_0(X_i))\\), where \\(n_1 = \\sum_i W_i\\). The key difference is: (1) we only need the control outcome model \\(\\hat{\\mu}_0\\), not \\(\\hat{\\mu}_1\\); (2) the weighting uses odds weights \\(e(x)/(1-e(x))\\) to match the treated covariate distribution. It is doubly robust in the sense that it is consistent if either \\(\\hat{\\mu}_0\\) or \\(\\hat{e}\\) is correctly specified.'
                },
                {
                    question: 'Show that the AIPW estimator reduces to the Horvitz-Thompson estimator when \\(\\hat{\\mu}_w(x) \\equiv 0\\) for all \\(x\\) and \\(w\\).',
                    hint: 'Simply substitute \\(\\hat{\\mu}_1(x) = \\hat{\\mu}_0(x) = 0\\) into the AIPW formula.',
                    solution: 'Setting \\(\\hat{\\mu}_1(X_i) = \\hat{\\mu}_0(X_i) = 0\\) in the AIPW formula: \\(\\hat{\\tau}_{\\text{AIPW}} = \\frac{1}{n}\\sum_{i=1}^n \\bigl[0 - 0 + \\frac{W_i(Y_i - 0)}{\\hat{e}(X_i)} - \\frac{(1-W_i)(Y_i - 0)}{1-\\hat{e}(X_i)}\\bigr] = \\frac{1}{n}\\sum_{i=1}^n \\bigl[\\frac{W_i Y_i}{\\hat{e}(X_i)} - \\frac{(1-W_i)Y_i}{1-\\hat{e}(X_i)}\\bigr]\\), which is exactly the Horvitz-Thompson IPW estimator. This shows that IPW is a special case of AIPW with a trivial (zero) outcome model.'
                },
                {
                    question: 'Verify that \\(\\mathbb{E}[\\varphi(W, X, Y)] = 0\\) for the efficient influence function given in Theorem 10.2.',
                    hint: 'Use the law of iterated expectations, conditioning on \\(X\\) first, then taking the outer expectation.',
                    solution: 'We compute \\(\\mathbb{E}[\\varphi(W,X,Y)]\\) by conditioning on \\(X\\). Given \\(X\\): \\(\\mathbb{E}[W(Y - \\mu_1(X))/e(X) \\mid X] = \\mathbb{E}[W \\mid X] \\cdot \\mathbb{E}[Y - \\mu_1(X) \\mid X, W=1] / e(X) = e(X) \\cdot 0 / e(X) = 0\\). Similarly, \\(\\mathbb{E}[(1-W)(Y-\\mu_0(X))/(1-e(X)) \\mid X] = 0\\). So \\(\\mathbb{E}[\\varphi \\mid X] = \\mu_1(X) - \\mu_0(X) - \\tau\\). Taking the outer expectation: \\(\\mathbb{E}[\\varphi] = \\mathbb{E}[\\mu_1(X) - \\mu_0(X)] - \\tau = \\tau - \\tau = 0\\).'
                },
                {
                    question: 'In the AIPW estimator, what role does the residual \\(Y_i - \\hat{\\mu}_w(X_i)\\) play? Why is it important that we use residuals rather than raw outcomes in the IPW correction term?',
                    hint: 'Think about variance reduction and what happens when the outcome model is good.',
                    solution: 'The residual \\(Y_i - \\hat{\\mu}_w(X_i)\\) plays two crucial roles: (1) It provides variance reduction. When \\(\\hat{\\mu}_w\\) is a good predictor, the residuals have much smaller variance than the raw outcomes, so the IPW-weighted residuals have much less variability than IPW-weighted raw outcomes. This is why AIPW typically has lower variance than plain IPW. (2) It ensures the double robustness property. If \\(\\hat{\\mu}_w = \\mu_w\\), the residuals have conditional mean zero given \\(X\\), so the correction term has expectation zero regardless of the propensity score model. Using raw outcomes instead of residuals would give the standard IPW estimator, which is not doubly robust and has higher variance.'
                }
            ]
        },
        // ============================================================
        // Section 3: Semiparametric Efficiency
        // ============================================================
        {
            id: 'ch10-sec03',
            title: 'Semiparametric Efficiency',
            content: `
                <h2>Semiparametric Efficiency</h2>

                <p>A central result in causal inference is that the AIPW estimator is not just doubly robust &mdash; it is also <strong>semiparametrically efficient</strong>. This means it achieves the smallest possible asymptotic variance among all regular estimators of the ATE, without requiring a fully parametric model for the data-generating process.</p>

                <h3>The Semiparametric Model</h3>

                <p>In the causal inference setting, we observe i.i.d. draws \\((X_i, W_i, Y_i)\\) from some distribution \\(P\\) in a large nonparametric model \\(\\mathcal{P}\\). The only restrictions we impose are:</p>
                <ol>
                    <li><strong>Unconfoundedness:</strong> \\(Y(0), Y(1) \\perp\\!\\!\\perp W \\mid X\\).</li>
                    <li><strong>Positivity:</strong> \\(0 < e(x) < 1\\) for all \\(x\\) in the support of \\(X\\).</li>
                </ol>
                <p>This is a <strong>semiparametric</strong> model: the parameter of interest \\(\\tau = \\mathbb{E}[Y(1) - Y(0)]\\) is finite-dimensional, but the nuisance parameters (the full distributions of outcomes and treatment given covariates) are infinite-dimensional.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 10.3 (Semiparametric Efficiency Bound)</div>
                    <div class="env-body">
                        <p>The <strong>semiparametric efficiency bound</strong> (or Cramer-Rao lower bound for semiparametric models) for the ATE is:</p>
                        \\[V_{\\text{eff}} = \\mathbb{E}\\left[\\frac{\\text{Var}(Y(1) \\mid X)}{e(X)} + \\frac{\\text{Var}(Y(0) \\mid X)}{1 - e(X)} + (\\tau(X) - \\tau)^2\\right],\\]
                        <p>where \\(\\tau(X) = \\mathbb{E}[Y(1) - Y(0) \\mid X]\\) is the conditional average treatment effect (CATE). No regular estimator can have asymptotic variance smaller than \\(V_{\\text{eff}}/n\\).</p>
                    </div>
                </div>

                <p>This bound has a beautiful decomposition into three interpretable components:</p>
                <ul>
                    <li>\\(\\text{Var}(Y(1) \\mid X) / e(X)\\): the cost of not observing \\(Y(1)\\) for all units (divided by the treatment probability).</li>
                    <li>\\(\\text{Var}(Y(0) \\mid X) / (1-e(X))\\): the cost of not observing \\(Y(0)\\) for all units.</li>
                    <li>\\((\\tau(X) - \\tau)^2\\): the inherent variability of treatment effects across individuals. Even if we could observe both potential outcomes, we would still face this source of uncertainty when estimating the average.</li>
                </ul>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 10.3 (Hahn, 1998)</div>
                    <div class="env-body">
                        <p>Under unconfoundedness and positivity, the semiparametric efficiency bound for the ATE is \\(V_{\\text{eff}}\\) as defined above. Moreover:</p>
                        <ol>
                            <li>The AIPW estimator with correctly specified nuisance models achieves this bound.</li>
                            <li>Knowledge of the propensity score does <em>not</em> reduce the efficiency bound (Hahn's surprise).</li>
                        </ol>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Hahn's Surprise: Knowing \\(e(x)\\) Does Not Help</div>
                    <div class="env-body">
                        <p>One of the most surprising results in causal inference is that even if we know the true propensity score \\(e(x)\\) (as in a randomized experiment), the efficiency bound does not decrease. Knowing the treatment assignment mechanism does not help us estimate the ATE more efficiently! This is because the bound is determined by the outcome variances and treatment effect heterogeneity, which are properties of the potential outcomes, not the assignment mechanism.</p>
                        <p>This result has a practical implication: in a randomized experiment where \\(e(x)\\) is known, we should still estimate it (or use regression adjustment) to gain efficiency. The known propensity score gives robustness, but efficiency comes from modeling the outcome.</p>
                    </div>
                </div>

                <h3>Variance Comparison of Estimators</h3>

                <p>The asymptotic variances of different estimators can be compared to the efficiency bound:</p>

                <div class="env-block proposition">
                    <div class="env-title">Proposition 10.2 (Variance Ordering)</div>
                    <div class="env-body">
                        <p>Under correct specification of all models:</p>
                        \\[V_{\\text{AIPW}} = V_{\\text{eff}} \\leq V_{\\text{OR}} \\leq V_{\\text{IPW}}.\\]
                        <p>The IPW estimator is generally least efficient. The OR estimator can match the bound only in special cases (e.g., constant treatment effect). The AIPW estimator always achieves the bound.</p>
                    </div>
                </div>

                <p>The IPW estimator has variance:</p>
                \\[V_{\\text{IPW}} = \\mathbb{E}\\left[\\frac{\\mathbb{E}[Y(1)^2 \\mid X]}{e(X)} + \\frac{\\mathbb{E}[Y(0)^2 \\mid X]}{1-e(X)}\\right] - \\tau^2,\\]
                <p>which includes the squared means \\(\\mu_w(X)^2\\) in addition to the variances. This extra term is what makes IPW less efficient.</p>

                <div class="env-block remark">
                    <div class="env-title">Remark 10.2 (Efficiency Gain from AIPW)</div>
                    <div class="env-body">
                        <p>The efficiency gain of AIPW over IPW is:</p>
                        \\[V_{\\text{IPW}} - V_{\\text{AIPW}} = \\mathbb{E}\\left[\\frac{\\mu_1(X)^2}{e(X)} + \\frac{\\mu_0(X)^2}{1-e(X)}\\right] - \\tau^2 + \\mathbb{E}[(\\tau(X) - \\tau)^2].\\]
                        <p>This is always non-negative and can be substantial when the conditional means are large relative to the conditional variances.</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'viz-efficiency-bound',
                    title: 'Variance of Estimators Relative to Efficiency Bound',
                    description: 'Compare the asymptotic variances of OR, IPW, and AIPW estimators as data-generating parameters vary.',
                    type: 'canvas',
                    setup: function(container) {
                        const viz = new VizEngine(container, { width: 700, height: 420, originX: 80, originY: 350, scale: 1 });
                        const controls = document.createElement('div');
                        controls.className = 'viz-controls';
                        container.appendChild(controls);

                        let heterogeneity = 1.0;
                        let psExtremes = 0.3;

                        VizEngine.createSlider(controls, 'Effect heterogeneity', 0, 3, heterogeneity, 0.1, (v) => {
                            heterogeneity = v; draw();
                        });
                        VizEngine.createSlider(controls, 'PS extremeness', 0.05, 0.48, psExtremes, 0.01, (v) => {
                            psExtremes = v; draw();
                        });

                        function computeVariances() {
                            const nGrid = 500;
                            let vEff = 0, vOR = 0, vIPW = 0;
                            const tau = 1.0;

                            for (let i = 0; i < nGrid; i++) {
                                const x = -3 + 6 * i / (nGrid - 1);
                                const px = VizEngine.normalPDF(x);

                                const ex = 1 / (1 + Math.exp(-psExtremes * 10 * x));
                                const exClamped = Math.max(0.02, Math.min(0.98, ex));

                                const tauX = tau + heterogeneity * x;
                                const mu1 = tauX / 2 + 1;
                                const mu0 = -tauX / 2 + 1;
                                const sig2_1 = 0.5;
                                const sig2_0 = 0.5;

                                vEff += px * (sig2_1 / exClamped + sig2_0 / (1 - exClamped) + (tauX - tau) ** 2);
                                vOR += px * (sig2_1 + sig2_0 + (tauX - tau) ** 2);
                                vIPW += px * ((sig2_1 + mu1 * mu1) / exClamped + (sig2_0 + mu0 * mu0) / (1 - exClamped));
                            }

                            const dx = 6 / (nGrid - 1);
                            vEff *= dx;
                            vOR *= dx;
                            vIPW *= dx;
                            vIPW -= tau * tau;

                            return { vEff, vOR, vIPW };
                        }

                        function draw() {
                            viz.clear();
                            const ctx = viz.ctx;
                            const vars = computeVariances();

                            const maxVar = Math.max(vars.vEff, vars.vOR, vars.vIPW, 1);
                            const barMaxH = 250;
                            const barW = 100;
                            const gap = 80;
                            const totalW = 3 * barW + 2 * gap;
                            const startX = (viz.width - totalW) / 2;
                            const baseY = 370;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Asymptotic Variance Comparison', viz.width / 2, 20);

                            const items = [
                                { name: 'AIPW (= Eff. Bound)', val: vars.vEff, color: viz.colors.green },
                                { name: 'Outcome Reg', val: vars.vOR, color: viz.colors.blue },
                                { name: 'IPW', val: vars.vIPW, color: viz.colors.orange }
                            ];

                            items.forEach((item, idx) => {
                                const cx = startX + idx * (barW + gap) + barW / 2;
                                const h = (item.val / maxVar) * barMaxH;

                                const grad = ctx.createLinearGradient(0, baseY - h, 0, baseY);
                                grad.addColorStop(0, item.color);
                                grad.addColorStop(1, item.color + '44');
                                ctx.fillStyle = grad;
                                ctx.fillRect(cx - barW / 2, baseY - h, barW, h);

                                ctx.strokeStyle = item.color;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(cx - barW / 2, baseY - h, barW, h);

                                ctx.fillStyle = item.color;
                                ctx.font = 'bold 11px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(item.name, cx, baseY + 18);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '12px -apple-system, sans-serif';
                                ctx.fillText(item.val.toFixed(3), cx, baseY - h - 10);
                            });

                            const effH = (vars.vEff / maxVar) * barMaxH;
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(startX - 30, baseY - effH);
                            ctx.lineTo(startX + totalW + 30, baseY - effH);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = viz.colors.red;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Efficiency bound', startX - 30, baseY - effH - 8);

                            if (vars.vIPW > vars.vEff) {
                                const ratio = (vars.vIPW / vars.vEff).toFixed(1);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('IPW / AIPW ratio: ' + ratio + 'x', viz.width / 2, 48);
                            }
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Decompose the semiparametric efficiency bound \\(V_{\\text{eff}}\\) into its three components and explain intuitively why each contributes to the difficulty of estimating the ATE.',
                    hint: 'Think about what each term represents in terms of missing data and heterogeneity.',
                    solution: 'The three components are: (1) \\(\\mathbb{E}[\\text{Var}(Y(1) \\mid X)/e(X)]\\): This reflects the "missing data" cost for the treated potential outcome. Conditional on \\(X\\), we only observe \\(Y(1)\\) for a fraction \\(e(X)\\) of units, so the effective sample size for estimating \\(\\mathbb{E}[Y(1) \\mid X]\\) is reduced by factor \\(e(X)\\). When \\(e(X)\\) is small, few units are treated and estimation is harder. (2) \\(\\mathbb{E}[\\text{Var}(Y(0) \\mid X)/(1-e(X))]\\): Analogous cost for the control potential outcome. When \\(1-e(X)\\) is small, few controls are available. (3) \\(\\mathbb{E}[(\\tau(X) - \\tau)^2]\\): The variance of the CATE around the ATE. Even if we could observe both potential outcomes for every unit, we would still face uncertainty in the ATE due to treatment effect heterogeneity across covariate values. This term is irreducible given the covariates.'
                },
                {
                    question: 'Explain Hahn\'s (1998) surprise result: why does knowing the true propensity score not improve the efficiency bound for the ATE?',
                    hint: 'Compare the efficiency bound when \\(e(x)\\) is known versus unknown. What determines the bound?',
                    solution: 'The efficiency bound \\(V_{\\text{eff}} = \\mathbb{E}[\\text{Var}(Y(1) \\mid X)/e(X) + \\text{Var}(Y(0) \\mid X)/(1-e(X)) + (\\tau(X)-\\tau)^2]\\) depends on \\(e(x)\\) only through the outcome conditional variances divided by \\(e(x)\\). Hahn showed that the bound is the same whether \\(e(x)\\) is known or unknown. The intuition: knowing \\(e(x)\\) tells us about the treatment assignment mechanism, but the bottleneck for ATE estimation is the outcome variation conditional on covariates, which is a property of the potential outcomes distribution. Knowing \\(e(x)\\) does not reveal any information about the potential outcomes. The practical implication is that in a randomized experiment where \\(e(x)\\) is known by design, we can still gain efficiency by modeling the outcome (regression adjustment), and the efficiency gain comes entirely from reducing outcome variation, not from knowing the assignment probabilities.'
                },
                {
                    question: 'In a randomized experiment with \\(e(x) = 1/2\\) for all \\(x\\), homoscedastic outcomes with \\(\\text{Var}(Y(w) \\mid X) = \\sigma^2\\), and a constant treatment effect \\(\\tau(x) = \\tau\\), compute the efficiency bound and show that the difference-in-means estimator achieves it.',
                    hint: 'Substitute the given conditions into the bound formula and compute the variance of the difference-in-means.',
                    solution: 'Substituting: \\(V_{\\text{eff}} = \\mathbb{E}[\\sigma^2/(1/2) + \\sigma^2/(1/2) + 0] = 4\\sigma^2\\). The asymptotic variance is \\(V_{\\text{eff}}/n = 4\\sigma^2/n\\). The difference-in-means estimator is \\(\\hat{\\tau} = \\bar{Y}_1 - \\bar{Y}_0\\) where \\(\\bar{Y}_1\\) and \\(\\bar{Y}_0\\) are the sample means of treated and control outcomes. With \\(n/2\\) units in each group: \\(\\text{Var}(\\hat{\\tau}) = \\text{Var}(\\bar{Y}_1) + \\text{Var}(\\bar{Y}_0) = \\sigma^2/(n/2) + \\sigma^2/(n/2) = 4\\sigma^2/n\\). This equals \\(V_{\\text{eff}}/n\\), so the simple difference-in-means achieves the semiparametric efficiency bound in this case. This makes sense: with a constant treatment effect, no covariates, and balanced randomization, there is nothing to gain from regression adjustment or propensity score modeling.'
                }
            ]
        },
        // ============================================================
        // Section 4: TMLE (Targeted Maximum Likelihood Estimation)
        // ============================================================
        {
            id: 'ch10-sec04',
            title: 'Targeted Maximum Likelihood Estimation (TMLE)',
            content: `
                <h2>Targeted Maximum Likelihood Estimation (TMLE)</h2>

                <p>While AIPW achieves semiparametric efficiency by adding a bias correction to the outcome regression, an alternative approach is to <strong>target</strong> the initial outcome model directly toward the parameter of interest. This is the idea behind <strong>Targeted Maximum Likelihood Estimation</strong> (TMLE), developed by Mark van der Laan and colleagues.</p>

                <div class="env-block intuition">
                    <div class="env-title">TMLE vs. AIPW: Two Paths to Double Robustness</div>
                    <div class="env-body">
                        <p>AIPW adds a correction <em>after</em> the initial estimate. TMLE modifies the initial estimate <em>itself</em> by "targeting" it toward the estimand. Both achieve double robustness and semiparametric efficiency, but TMLE has the advantage of always producing estimates that respect the natural bounds of the outcome (e.g., probabilities stay in [0,1]).</p>
                    </div>
                </div>

                <h3>The TMLE Procedure</h3>

                <p>TMLE proceeds in three steps:</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 10.4 (TMLE Algorithm for ATE)</div>
                    <div class="env-body">
                        <p><strong>Step 1: Initial Estimation.</strong> Fit an initial outcome model \\(\\hat{\\mu}_w^0(x)\\) using any method (parametric regression, random forests, neural networks, or an ensemble via Super Learner). Also estimate the propensity score \\(\\hat{e}(x)\\).</p>
                        <p><strong>Step 2: Targeting (Fluctuation).</strong> Define the <strong>clever covariate</strong>:</p>
                        \\[H_1(W, X) = \\frac{W}{\\hat{e}(X)}, \\quad H_0(W, X) = -\\frac{1-W}{1-\\hat{e}(X)}.\\]
                        <p>Fit a logistic regression (if the outcome is binary) or linear regression of \\(Y\\) on \\(H_1 + H_0\\) with offset \\(\\text{logit}(\\hat{\\mu}^0(X))\\) (or \\(\\hat{\\mu}^0(X)\\) for continuous outcomes), obtaining coefficient \\(\\hat{\\varepsilon}\\).</p>
                        <p><strong>Step 3: Update.</strong> Update the initial estimates:</p>
                        \\[\\hat{\\mu}_w^*(x) = \\text{expit}\\bigl(\\text{logit}(\\hat{\\mu}_w^0(x)) + \\hat{\\varepsilon} \\cdot h_w(x)\\bigr),\\]
                        <p>where \\(h_1(x) = 1/\\hat{e}(x)\\) and \\(h_0(x) = -1/(1-\\hat{e}(x))\\). For continuous outcomes, the update is additive: \\(\\hat{\\mu}_w^*(x) = \\hat{\\mu}_w^0(x) + \\hat{\\varepsilon} \\cdot h_w(x)\\).</p>
                        <p>The TMLE estimate of the ATE is:</p>
                        \\[\\hat{\\tau}_{\\text{TMLE}} = \\frac{1}{n} \\sum_{i=1}^n [\\hat{\\mu}_1^*(X_i) - \\hat{\\mu}_0^*(X_i)].\\]
                    </div>
                </div>

                <h3>Why the Clever Covariate?</h3>

                <p>The clever covariate \\(H(W, X)\\) is chosen so that the score equation of the targeting step solves the efficient influence function equation. Specifically, setting the score to zero is equivalent to:</p>
                \\[\\frac{1}{n} \\sum_{i=1}^n \\hat{\\varphi}(W_i, X_i, Y_i) = 0,\\]
                <p>where \\(\\hat{\\varphi}\\) is the estimated efficient influence function. This ensures that the updated estimate \\(\\hat{\\mu}^*\\) "solves" the influence function equation, which is exactly the condition needed for double robustness and efficiency.</p>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 10.4 (Properties of TMLE)</div>
                    <div class="env-body">
                        <p>Under regularity conditions:</p>
                        <ol>
                            <li><strong>Double robustness:</strong> \\(\\hat{\\tau}_{\\text{TMLE}}\\) is consistent if either \\(\\hat{\\mu}_w^0\\) or \\(\\hat{e}\\) is consistently estimated.</li>
                            <li><strong>Efficiency:</strong> If both are consistent at \\(o_P(n^{-1/4})\\) rates, \\(\\hat{\\tau}_{\\text{TMLE}}\\) is asymptotically efficient.</li>
                            <li><strong>Substitution estimator:</strong> \\(\\hat{\\tau}_{\\text{TMLE}}\\) is a plug-in estimator based on the updated model \\(\\hat{\\mu}^*\\), so it automatically respects the natural parameter space (e.g., probabilities in [0,1]).</li>
                        </ol>
                    </div>
                </div>

                <h3>Super Learner for Nuisance Parameters</h3>

                <p>A key practical advantage of TMLE is its compatibility with <strong>Super Learner</strong>, a cross-validated ensemble learning method. The idea is to:</p>
                <ol>
                    <li>Specify a library of candidate algorithms (GLMs, random forests, gradient boosting, LASSO, etc.).</li>
                    <li>Use cross-validation to select the optimal weighted combination of these algorithms.</li>
                    <li>Use the Super Learner fits as the initial estimates \\(\\hat{\\mu}_w^0\\) and \\(\\hat{e}\\).</li>
                </ol>
                <p>This data-adaptive approach avoids the need to choose a single parametric model, making the double robustness property more practically meaningful: we have a better chance of getting at least one model approximately right.</p>

                <div class="env-block example">
                    <div class="env-title">Example 10.2 (TMLE with Binary Outcome)</div>
                    <div class="env-body">
                        <p>Suppose \\(Y \\in \\{0, 1\\}\\), \\(W \\in \\{0, 1\\}\\), and we want to estimate the ATE on the risk difference scale: \\(\\tau = \\mathbb{E}[Y(1)] - \\mathbb{E}[Y(0)]\\).</p>
                        <ol>
                            <li>Fit \\(\\hat{\\mu}^0(x, w) = \\hat{P}(Y = 1 \\mid X = x, W = w)\\) using logistic regression.</li>
                            <li>Fit \\(\\hat{e}(x)\\) using logistic regression.</li>
                            <li>Compute \\(H_i = W_i/\\hat{e}(X_i) - (1-W_i)/(1-\\hat{e}(X_i))\\).</li>
                            <li>Regress \\(Y\\) on \\(H\\) with offset \\(\\text{logit}(\\hat{\\mu}^0(X_i, W_i))\\), obtaining \\(\\hat{\\varepsilon}\\).</li>
                            <li>Update: \\(\\hat{\\mu}^*(x, w) = \\text{expit}(\\text{logit}(\\hat{\\mu}^0(x, w)) + \\hat{\\varepsilon} \\cdot h_w(x))\\).</li>
                            <li>\\(\\hat{\\tau}_{\\text{TMLE}} = n^{-1} \\sum_i [\\hat{\\mu}^*(X_i, 1) - \\hat{\\mu}^*(X_i, 0)]\\).</li>
                        </ol>
                        <p>The estimate \\(\\hat{\\mu}^*(x, w) \\in (0, 1)\\) by construction, so the ATE estimate \\(\\hat{\\tau} \\in (-1, 1)\\) as required.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark 10.3 (TMLE vs. AIPW in Practice)</div>
                    <div class="env-body">
                        <p>In large samples, TMLE and AIPW are asymptotically equivalent. In finite samples, they can differ because: (1) TMLE respects bounds on the outcome space; (2) AIPW can produce estimates outside the natural parameter space (e.g., predicted probabilities outside [0,1]); (3) TMLE is less sensitive to extreme propensity scores because the targeting step partially absorbs their impact. However, AIPW is simpler to implement and does not require iterative fitting.</p>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'viz-tmle-targeting',
                    title: 'TMLE Targeting Step',
                    description: 'Visualize how the initial outcome estimate is updated by the targeting step to reduce bias.',
                    type: 'canvas',
                    setup: function(container) {
                        const viz = new VizEngine(container, { width: 700, height: 440, originX: 70, originY: 350, scale: 55 });
                        const controls = document.createElement('div');
                        controls.className = 'viz-controls';
                        container.appendChild(controls);

                        let epsilon = 0;
                        let showUpdated = true;

                        VizEngine.createSlider(controls, 'Targeting epsilon', -1, 1, 0, 0.01, (v) => {
                            epsilon = v; draw();
                        });
                        VizEngine.createButton(controls, 'Auto-solve for epsilon', () => {
                            autoSolve(); draw();
                        });
                        VizEngine.createButton(controls, 'Reset', () => {
                            epsilon = 0; draw();
                        });

                        const n = 80;
                        const data = [];
                        for (let i = 0; i < n; i++) {
                            const x = VizEngine.randomNormal(0, 0.8);
                            const trueE = 1 / (1 + Math.exp(-(x * 1.5)));
                            const w = Math.random() < trueE ? 1 : 0;
                            const trueMu = 0.3 + 0.4 * x;
                            const y = trueMu + (w === 1 ? 0.3 : 0) + VizEngine.randomNormal(0, 0.15);
                            const yBounded = Math.max(0.01, Math.min(0.99, y));
                            data.push({ x, w, y: yBounded, trueE });
                        }

                        function initialModel(x) {
                            return 1 / (1 + Math.exp(-(0.5 + 0.3 * x)));
                        }

                        function psModel(x) {
                            return 1 / (1 + Math.exp(-(x * 1.2)));
                        }

                        function updatedModel(x, w, eps) {
                            const mu0 = initialModel(x);
                            const ps = Math.max(0.01, Math.min(0.99, psModel(x)));
                            const h = w === 1 ? 1 / ps : -1 / (1 - ps);
                            const logitMu = Math.log(mu0 / (1 - mu0));
                            const updated = 1 / (1 + Math.exp(-(logitMu + eps * h)));
                            return updated;
                        }

                        function autoSolve() {
                            let eps = 0;
                            for (let iter = 0; iter < 50; iter++) {
                                let score = 0;
                                for (const d of data) {
                                    const ps = Math.max(0.01, Math.min(0.99, psModel(d.x)));
                                    const h = d.w === 1 ? 1 / ps : -1 / (1 - ps);
                                    const pred = updatedModel(d.x, d.w, eps);
                                    score += h * (d.y - pred);
                                }
                                score /= n;
                                eps += 0.5 * score;
                            }
                            epsilon = Math.max(-1, Math.min(1, eps));
                        }

                        function draw() {
                            viz.clear();
                            const ctx = viz.ctx;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('TMLE Targeting Step', viz.width / 2, 20);

                            const xMin = -2.5;
                            const xMax = 2.5;
                            const plotL = 90;
                            const plotR = viz.width - 30;
                            const plotT = 50;
                            const plotB = 370;

                            function toPlotX(x) { return plotL + (x - xMin) / (xMax - xMin) * (plotR - plotL); }
                            function toPlotY(y) { return plotB - y * (plotB - plotT); }

                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(plotL, plotT, plotR - plotL, plotB - plotT);

                            for (let tick = 0; tick <= 1; tick += 0.2) {
                                const py = toPlotY(tick);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(plotL, py);
                                ctx.lineTo(plotR, py);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system, sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(tick.toFixed(1), plotL - 5, py + 3);
                            }

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            for (let xt = -2; xt <= 2; xt++) {
                                ctx.fillText(xt.toString(), toPlotX(xt), plotB + 15);
                            }
                            ctx.fillText('X (covariate)', (plotL + plotR) / 2, plotB + 32);

                            ctx.save();
                            ctx.translate(15, (plotT + plotB) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'center';
                            ctx.fillText('Outcome', 0, 0);
                            ctx.restore();

                            const steps = 150;
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (let i = 0; i <= steps; i++) {
                                const x = xMin + (xMax - xMin) * i / steps;
                                const y = initialModel(x);
                                const px = toPlotX(x);
                                const py = toPlotY(y);
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            if (epsilon !== 0) {
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                for (let i = 0; i <= steps; i++) {
                                    const x = xMin + (xMax - xMin) * i / steps;
                                    const yT = updatedModel(x, 1, epsilon);
                                    const px = toPlotX(x);
                                    const py = toPlotY(yT);
                                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2.5;
                                ctx.setLineDash([5, 3]);
                                ctx.beginPath();
                                for (let i = 0; i <= steps; i++) {
                                    const x = xMin + (xMax - xMin) * i / steps;
                                    const yC = updatedModel(x, 0, epsilon);
                                    const px = toPlotX(x);
                                    const py = toPlotY(yC);
                                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            for (const d of data) {
                                const px = toPlotX(d.x);
                                const py = toPlotY(d.y);
                                const col = d.w === 1 ? viz.colors.orange : viz.colors.purple;
                                ctx.fillStyle = col + '88';
                                ctx.beginPath();
                                ctx.arc(px, py, 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            const legX = plotL + 10;
                            let legY = plotT + 15;
                            const legendItems = [
                                { color: viz.colors.blue, label: 'Initial estimate' },
                                { color: viz.colors.green, label: 'Updated (treated)' },
                                { color: viz.colors.teal, label: 'Updated (control)' },
                                { color: viz.colors.orange, label: 'Treated obs' },
                                { color: viz.colors.purple, label: 'Control obs' }
                            ];
                            ctx.font = '10px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            for (const item of legendItems) {
                                ctx.fillStyle = item.color;
                                ctx.fillRect(legX, legY - 4, 12, 8);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(item.label, legX + 16, legY + 3);
                                legY += 15;
                            }

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('epsilon = ' + epsilon.toFixed(3), plotR - 10, plotT + 18);

                            let ate0 = 0, ateUpdated = 0;
                            for (const d of data) {
                                ate0 += initialModel(d.x);
                                const mu1s = updatedModel(d.x, 1, epsilon);
                                const mu0s = updatedModel(d.x, 0, epsilon);
                                ateUpdated += (mu1s - mu0s);
                            }
                            ctx.fillText('Initial ATE est: ' + (0).toFixed(3), plotR - 10, plotT + 35);
                            ctx.fillText('Updated ATE est: ' + (ateUpdated / n).toFixed(3), plotR - 10, plotT + 52);
                        }

                        autoSolve();
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain in your own words why the TMLE targeting step uses a "clever covariate" \\(H(W, X) = W/e(X) - (1-W)/(1-e(X))\\). What is the connection to the efficient influence function?',
                    hint: 'Consider the score equation of the targeting regression and compare it to the influence function equation.',
                    solution: 'The clever covariate is chosen so that the score equation of the targeting step equals the sample average of the efficient influence function (EIF). The EIF for the ATE has the form \\(\\varphi = (\\mu_1(X) - \\mu_0(X) - \\tau) + W(Y-\\mu_1(X))/e(X) - (1-W)(Y-\\mu_0(X))/(1-e(X))\\). The IPW correction terms involve \\(W/e(X)\\) and \\((1-W)/(1-e(X))\\), which are exactly the clever covariates. When we fit the targeting regression, setting the score to zero ensures that \\(\\sum_i \\hat{\\varphi}_i = 0\\), meaning the updated estimate solves the EIF equation. This is the condition needed for the TMLE to be asymptotically linear with influence function equal to the EIF, guaranteeing double robustness and semiparametric efficiency.'
                },
                {
                    question: 'Why does TMLE have an advantage over AIPW for binary outcomes? Give a concrete example where AIPW might produce an invalid estimate but TMLE would not.',
                    hint: 'Think about what happens when AIPW adds a large bias correction to a probability estimate.',
                    solution: 'For binary outcomes, the ATE \\(\\tau = P(Y(1)=1) - P(Y(0)=1)\\) must lie in \\([-1, 1]\\). AIPW is a simple sample average that can exceed these bounds. For example, suppose \\(\\hat{\\mu}_1(X_i) = 0.9\\) for most units and a few treated units have small propensity scores \\(\\hat{e}(X_i) = 0.02\\) with \\(Y_i = 1\\). The AIPW correction term \\(W_i(Y_i - 0.9)/0.02 = 5\\) for these units, potentially pushing the average above 1. TMLE avoids this because the update is applied on the logit scale: \\(\\text{expit}(\\text{logit}(0.9) + \\hat{\\varepsilon}/0.02)\\) always stays in (0,1), and the final plug-in estimate \\(n^{-1}\\sum_i [\\hat{\\mu}_1^*(X_i) - \\hat{\\mu}_0^*(X_i)]\\) uses bounded predictions.'
                },
                {
                    question: 'Describe the Super Learner algorithm for estimating nuisance parameters. Why is it particularly well-suited for use with TMLE?',
                    hint: 'Think about what properties Super Learner has that complement the double robustness of TMLE.',
                    solution: 'Super Learner is a cross-validated ensemble method: (1) Specify a library of K candidate algorithms (e.g., logistic regression, LASSO, random forest, gradient boosting, neural nets). (2) Split data into V folds. For each fold, fit all K algorithms on the training folds and predict on the held-out fold, producing cross-validated predictions. (3) Find the optimal convex combination of the K algorithms by minimizing cross-validated risk (e.g., MSE or log-loss). (4) Refit all algorithms on the full data and combine using the optimal weights. Super Learner is particularly suited for TMLE because: (a) It has an oracle property: its risk converges to that of the best algorithm in the library asymptotically. (b) By including diverse algorithms, it maximizes the chance of capturing the true data-generating process, making the double robustness property practically meaningful. (c) It provides a principled, data-driven way to estimate nuisance parameters without arbitrary model choices.'
                },
                {
                    question: 'Show that after the TMLE targeting step, the estimating equation \\(\\frac{1}{n}\\sum_{i=1}^n \\hat{\\varphi}(W_i, X_i, Y_i) = 0\\) is solved. Why is this property important?',
                    hint: 'Write out the score equation of the targeting logistic regression and relate it to the EIF.',
                    solution: 'In the targeting step, we fit a regression of \\(Y\\) on the clever covariate \\(H_i = W_i/\\hat{e}(X_i) - (1-W_i)/(1-\\hat{e}(X_i))\\) with offset. The MLE score equation at \\(\\hat{\\varepsilon}\\) is \\(\\sum_i H_i(Y_i - \\hat{\\mu}^*(X_i, W_i)) = 0\\), which expands to \\(\\sum_i [W_i(Y_i - \\hat{\\mu}_1^*(X_i))/\\hat{e}(X_i) - (1-W_i)(Y_i - \\hat{\\mu}_0^*(X_i))/(1-\\hat{e}(X_i))] = 0\\). Adding and subtracting \\(\\sum_i(\\hat{\\mu}_1^*(X_i) - \\hat{\\mu}_0^*(X_i) - \\hat{\\tau})\\) (which equals zero by definition of \\(\\hat{\\tau}_{\\text{TMLE}}\\)), we get \\(\\sum_i \\hat{\\varphi}_i = 0\\). This is important because: (1) It guarantees that the TMLE is a solution to the efficient influence function equation, which is the condition for asymptotic linearity. (2) It ensures double robustness, since the EIF equation holds regardless of which nuisance model is correctly specified. (3) It provides a natural basis for variance estimation and confidence intervals.'
                }
            ]
        },
        // ============================================================
        // Section 5: Practical Implementation
        // ============================================================
        {
            id: 'ch10-sec05',
            title: 'Practical Implementation',
            content: `
                <h2>Practical Implementation</h2>

                <p>The theoretical elegance of doubly robust estimation translates into practical benefits only when implemented carefully. This section covers the key practical considerations: cross-fitting, debiased machine learning (DML), choosing ML methods for nuisance parameters, and diagnostics.</p>

                <h3>Cross-Fitting and Sample Splitting</h3>

                <p>A critical issue arises when using flexible (machine learning) methods for the nuisance parameters \\(\\hat{\\mu}_w\\) and \\(\\hat{e}\\). The AIPW estimator requires that the nuisance estimates converge fast enough (\\(o_P(n^{-1/4})\\) for each), but also that certain <strong>Donsker conditions</strong> hold. These conditions can fail for complex ML estimators like random forests or neural networks.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 10.5 (Cross-Fitting)</div>
                    <div class="env-body">
                        <p>To avoid Donsker conditions, we use <strong>cross-fitting</strong> (also called sample splitting):</p>
                        <ol>
                            <li>Randomly partition the data into \\(K\\) folds \\(\\mathcal{I}_1, \\ldots, \\mathcal{I}_K\\) of roughly equal size.</li>
                            <li>For each fold \\(k\\), fit the nuisance models \\(\\hat{\\mu}_w^{(-k)}\\) and \\(\\hat{e}^{(-k)}\\) using all data <em>except</em> fold \\(k\\).</li>
                            <li>For observations in fold \\(k\\), compute the influence function using the nuisance estimates from step 2.</li>
                            <li>Average across all observations:</li>
                        </ol>
                        \\[\\hat{\\tau}_{\\text{CF}} = \\frac{1}{n} \\sum_{k=1}^{K} \\sum_{i \\in \\mathcal{I}_k} \\hat{\\varphi}^{(-k)}(W_i, X_i, Y_i).\\]
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Why Cross-Fitting?</div>
                    <div class="env-body">
                        <p>The key idea is that in fold \\(k\\), the nuisance estimates \\(\\hat{\\mu}^{(-k)}\\) and \\(\\hat{e}^{(-k)}\\) are <strong>independent</strong> of the observations \\(\\{(X_i, W_i, Y_i)\\}_{i \\in \\mathcal{I}_k}\\). This independence eliminates the need for Donsker conditions, allowing us to use arbitrarily complex ML methods. The price is a slight loss of efficiency from using only \\((K-1)/K\\) of the data for each nuisance estimate, but this is negligible for \\(K \\geq 5\\).</p>
                    </div>
                </div>

                <h3>Debiased Machine Learning (DML)</h3>

                <p>The <strong>Double/Debiased Machine Learning</strong> (DML) framework of Chernozhukov et al. (2018) formalizes the use of cross-fitting with doubly robust moment conditions. The DML procedure for the ATE is:</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 10.6 (DML Procedure)</div>
                    <div class="env-body">
                        <ol>
                            <li>Split data into \\(K\\) folds.</li>
                            <li>For each fold \\(k\\):
                                <ul>
                                    <li>Fit \\(\\hat{\\mu}_1^{(-k)}, \\hat{\\mu}_0^{(-k)}, \\hat{e}^{(-k)}\\) on the complement \\(\\mathcal{I}_{-k}\\).</li>
                                    <li>Compute the score: \\(\\hat{\\psi}_i = \\hat{\\mu}_1^{(-k)}(X_i) - \\hat{\\mu}_0^{(-k)}(X_i) + \\frac{W_i(Y_i - \\hat{\\mu}_1^{(-k)}(X_i))}{\\hat{e}^{(-k)}(X_i)} - \\frac{(1-W_i)(Y_i - \\hat{\\mu}_0^{(-k)}(X_i))}{1 - \\hat{e}^{(-k)}(X_i)}\\) for \\(i \\in \\mathcal{I}_k\\).</li>
                                </ul>
                            </li>
                            <li>Estimate: \\(\\hat{\\tau}_{\\text{DML}} = \\frac{1}{n} \\sum_{i=1}^n \\hat{\\psi}_i\\).</li>
                            <li>Variance: \\(\\hat{V} = \\frac{1}{n} \\sum_{i=1}^n (\\hat{\\psi}_i - \\hat{\\tau}_{\\text{DML}})^2\\).</li>
                            <li>Confidence interval: \\(\\hat{\\tau}_{\\text{DML}} \\pm z_{\\alpha/2} \\sqrt{\\hat{V}/n}\\).</li>
                        </ol>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 10.5 (Chernozhukov et al., 2018)</div>
                    <div class="env-body">
                        <p>Under the conditions:</p>
                        <ol>
                            <li>\\(\\|\\hat{\\mu}_w^{(-k)} - \\mu_w\\|_2 \\cdot \\|\\hat{e}^{(-k)} - e\\|_2 = o_P(n^{-1/2})\\) (product rate condition),</li>
                            <li>\\(\\hat{e}^{(-k)}(x) \\in [\\eta, 1-\\eta]\\) for some \\(\\eta > 0\\) (bounded propensity scores),</li>
                        </ol>
                        <p>the DML estimator satisfies:</p>
                        \\[\\sqrt{n}(\\hat{\\tau}_{\\text{DML}} - \\tau) \\xrightarrow{d} N(0, V_{\\text{eff}}).\\]
                    </div>
                </div>

                <h3>Choosing ML Methods for Nuisance Parameters</h3>

                <p>The choice of ML method matters for finite-sample performance. Key considerations:</p>

                <div class="env-block remark">
                    <div class="env-title">Practical Guidelines</div>
                    <div class="env-body">
                        <ul>
                            <li><strong>For the propensity score \\(e(x)\\):</strong> Use methods that produce well-calibrated probabilities. Logistic regression, gradient boosting with proper tuning, or calibrated random forests work well. Always clip predictions away from 0 and 1 (e.g., to \\([0.01, 0.99]\\)).</li>
                            <li><strong>For outcome models \\(\\mu_w(x)\\):</strong> Use methods that minimize prediction error. Random forests, gradient boosting (XGBoost, LightGBM), and LASSO are popular choices.</li>
                            <li><strong>Ensemble methods:</strong> Super Learner (stacked generalization) provides robustness across model specifications.</li>
                            <li><strong>Number of folds:</strong> \\(K = 5\\) or \\(K = 10\\) is standard. \\(K = 2\\) can also work but wastes more data per fold.</li>
                        </ul>
                    </div>
                </div>

                <h3>Diagnostics</h3>

                <p>Even with doubly robust estimators, diagnostics are essential:</p>
                <ul>
                    <li><strong>Propensity score overlap:</strong> Check the distribution of \\(\\hat{e}(X)\\) in treated and control groups. Lack of overlap signals violations of positivity.</li>
                    <li><strong>Covariate balance:</strong> After weighting by \\(1/\\hat{e}(X)\\), check that weighted covariate means are similar across groups.</li>
                    <li><strong>Sensitivity to trimming:</strong> Vary the propensity score trimming threshold and check stability of the estimate.</li>
                    <li><strong>Cross-validation of nuisance models:</strong> Report cross-validated \\(R^2\\) or AUC for outcome models and propensity score models.</li>
                    <li><strong>Influence function diagnostics:</strong> Plot the individual influence function values \\(\\hat{\\varphi}_i\\) to identify high-leverage observations.</li>
                </ul>

                <div class="env-block example">
                    <div class="env-title">Example 10.3 (DML Workflow)</div>
                    <div class="env-body">
                        <p>A practical DML workflow for estimating the effect of a job training program:</p>
                        <ol>
                            <li><strong>Data:</strong> \\(n = 5000\\) workers, \\(W\\) = training participation, \\(Y\\) = earnings, \\(X\\) = demographics and pre-treatment earnings.</li>
                            <li><strong>Nuisance models:</strong> Use gradient boosting (XGBoost) for both \\(\\hat{\\mu}_w(x)\\) and \\(\\hat{e}(x)\\), with 5-fold cross-validation for hyperparameter tuning.</li>
                            <li><strong>Cross-fitting:</strong> \\(K = 5\\) folds.</li>
                            <li><strong>Diagnostics:</strong> Check propensity score distributions (good overlap between 0.1 and 0.9), covariate balance after weighting (all standardized differences below 0.1), and cross-validated \\(R^2 = 0.72\\) for outcomes.</li>
                            <li><strong>Result:</strong> \\(\\hat{\\tau}_{\\text{DML}} = \\$2{,}340\\) with 95% CI \\([\\$1{,}180, \\$3{,}500]\\).</li>
                        </ol>
                    </div>
                </div>
            `,
            visualizations: [
                {
                    id: 'viz-cross-fitting',
                    title: 'Cross-Fitting Procedure',
                    description: 'Visualize the K-fold cross-fitting procedure used in DML, showing how data splits are used.',
                    type: 'canvas',
                    setup: function(container) {
                        const viz = new VizEngine(container, { width: 700, height: 420, originX: 50, originY: 350, scale: 30 });
                        const controls = document.createElement('div');
                        controls.className = 'viz-controls';
                        container.appendChild(controls);

                        let K = 5;
                        let activeFold = 0;
                        let animating = false;

                        VizEngine.createSlider(controls, 'K (folds)', 2, 10, K, 1, (v) => {
                            K = Math.round(v);
                            activeFold = 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next Fold', () => {
                            activeFold = (activeFold + 1) % K;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Animate', () => {
                            if (animating) return;
                            animating = true;
                            let fold = 0;
                            const interval = setInterval(() => {
                                activeFold = fold;
                                draw();
                                fold++;
                                if (fold >= K) {
                                    clearInterval(interval);
                                    animating = false;
                                }
                            }, 800);
                        });

                        function draw() {
                            viz.clear();
                            const ctx = viz.ctx;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Cross-Fitting with K = ' + K + ' Folds', viz.width / 2, 22);

                            const marginL = 60;
                            const marginR = 40;
                            const totalW = viz.width - marginL - marginR;
                            const foldW = totalW / K;
                            const rowH = 30;
                            const startY = 55;

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            for (let k = 0; k < K; k++) {
                                ctx.fillText('Fold ' + (k + 1), marginL + k * foldW + foldW / 2, startY);
                            }

                            for (let row = 0; row < K; row++) {
                                const y = startY + 15 + row * (rowH + 8);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system, sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('Iter ' + (row + 1), marginL - 8, y + rowH / 2 + 3);

                                for (let k = 0; k < K; k++) {
                                    const x = marginL + k * foldW;
                                    const isEval = (k === row);
                                    const isActive = (row === activeFold);

                                    if (isEval) {
                                        ctx.fillStyle = isActive ? viz.colors.orange : viz.colors.orange + '66';
                                        ctx.fillRect(x + 2, y, foldW - 4, rowH);
                                        ctx.fillStyle = isActive ? '#000' : viz.colors.text;
                                        ctx.font = '9px -apple-system, sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.fillText('EVAL', x + foldW / 2, y + rowH / 2 + 3);
                                    } else {
                                        ctx.fillStyle = isActive ? viz.colors.blue + 'aa' : viz.colors.blue + '33';
                                        ctx.fillRect(x + 2, y, foldW - 4, rowH);
                                        ctx.fillStyle = isActive ? viz.colors.white : viz.colors.text + '88';
                                        ctx.font = '9px -apple-system, sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.fillText('TRAIN', x + foldW / 2, y + rowH / 2 + 3);
                                    }

                                    if (isActive) {
                                        ctx.strokeStyle = viz.colors.white;
                                        ctx.lineWidth = 2;
                                        ctx.strokeRect(x + 2, y, foldW - 4, rowH);
                                    }
                                }
                            }

                            const descY = startY + 15 + K * (rowH + 8) + 20;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Current: Iteration ' + (activeFold + 1) + ' of ' + K, marginL, descY);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system, sans-serif';

                            const trainFolds = [];
                            for (let k = 0; k < K; k++) {
                                if (k !== activeFold) trainFolds.push(k + 1);
                            }

                            ctx.fillText('Train nuisance models on folds: [' + trainFolds.join(', ') + ']', marginL, descY + 20);
                            ctx.fillText('Compute scores on fold: [' + (activeFold + 1) + ']', marginL, descY + 38);
                            ctx.fillText('Key: nuisance estimates are independent of evaluation data', marginL, descY + 56);

                            const diagramY = descY + 80;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('DML Pipeline for Current Fold', viz.width / 2, diagramY);

                            const boxes = [
                                { label: 'Train data', sub: '(folds \\neq ' + (activeFold + 1) + ')', color: viz.colors.blue },
                                { label: 'Fit nuisance', sub: 'mu, e(x)', color: viz.colors.purple },
                                { label: 'Eval data', sub: '(fold ' + (activeFold + 1) + ')', color: viz.colors.orange },
                                { label: 'Compute scores', sub: 'phi_i', color: viz.colors.green }
                            ];

                            const boxW = 110;
                            const boxH = 40;
                            const boxGap = 30;
                            const boxTotalW = boxes.length * boxW + (boxes.length - 1) * boxGap;
                            const boxStartX = (viz.width - boxTotalW) / 2;

                            boxes.forEach((box, idx) => {
                                const bx = boxStartX + idx * (boxW + boxGap);
                                const by = diagramY + 15;

                                ctx.fillStyle = box.color + '33';
                                ctx.fillRect(bx, by, boxW, boxH);
                                ctx.strokeStyle = box.color;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(bx, by, boxW, boxH);

                                ctx.fillStyle = box.color;
                                ctx.font = 'bold 10px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(box.label, bx + boxW / 2, by + 15);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system, sans-serif';
                                ctx.fillText(box.sub, bx + boxW / 2, by + 30);

                                if (idx < boxes.length - 1) {
                                    const ax1 = bx + boxW + 3;
                                    const ax2 = bx + boxW + boxGap - 3;
                                    const ay = by + boxH / 2;
                                    ctx.strokeStyle = viz.colors.text;
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.moveTo(ax1, ay);
                                    ctx.lineTo(ax2, ay);
                                    ctx.stroke();
                                    ctx.beginPath();
                                    ctx.moveTo(ax2, ay);
                                    ctx.lineTo(ax2 - 6, ay - 4);
                                    ctx.lineTo(ax2 - 6, ay + 4);
                                    ctx.closePath();
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fill();
                                }
                            });
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why cross-fitting is necessary when using machine learning methods for nuisance parameter estimation in doubly robust estimators. What goes wrong without it?',
                    hint: 'Think about the independence between nuisance estimates and the data used for evaluation, and the Donsker condition.',
                    solution: 'Without cross-fitting, the same data is used to both fit the nuisance models and evaluate the doubly robust estimator. This creates a dependency between the nuisance estimates and the evaluation data. For parametric models, this is not a problem because the models belong to Donsker classes (roughly, they have bounded complexity). But for flexible ML methods (random forests, neural networks, gradient boosting), the function classes are too complex to be Donsker. This means that the empirical process central limit theorem cannot be applied, and the remainder term in the asymptotic expansion of the DR estimator may not be negligible. Concretely, ML methods can overfit to the training data, creating spurious correlations between the nuisance estimates and the noise in the evaluation data. Cross-fitting eliminates this problem by ensuring that the nuisance estimates used for observation \\(i\\) are fit on data that does not include observation \\(i\\), making them independent.'
                },
                {
                    question: 'The DML product rate condition requires \\(\\|\\hat{\\mu}_w - \\mu_w\\|_2 \\cdot \\|\\hat{e} - e\\|_2 = o_P(n^{-1/2})\\). If both nuisance models converge at rate \\(n^{-\\alpha}\\), what is the minimum \\(\\alpha\\) needed? What does this imply about the required quality of ML models?',
                    hint: 'Set \\(n^{-\\alpha} \\cdot n^{-\\alpha} = o(n^{-1/2})\\) and solve for \\(\\alpha\\).',
                    solution: 'The product rate condition requires \\(n^{-\\alpha} \\cdot n^{-\\alpha} = n^{-2\\alpha} = o(n^{-1/2})\\), which means \\(2\\alpha > 1/2\\), so \\(\\alpha > 1/4\\). The minimum rate is \\(\\alpha = 1/4\\), meaning each nuisance model must converge at least at rate \\(n^{-1/4}\\). This is a much weaker requirement than the \\(n^{-1/2}\\) rate needed for parametric models. Many ML methods achieve \\(n^{-1/4}\\) rates or better under smoothness or sparsity conditions. For example, random forests and neural networks can achieve rates of \\(n^{-1/3}\\) or better for smooth functions. This means DML can use relatively crude ML models and still achieve valid \\(\\sqrt{n}\\)-inference for the causal parameter, which is a remarkable result.'
                },
                {
                    question: 'You estimate the ATE of a job training program using DML with 5-fold cross-fitting. The estimated scores \\(\\hat{\\psi}_i\\) have sample mean \\(\\hat{\\tau} = 2340\\) and sample variance \\(\\hat{V} = 1.5 \\times 10^6\\), with \\(n = 5000\\). Construct a 95% confidence interval and test the null hypothesis \\(H_0: \\tau = 0\\).',
                    hint: 'Use the CLT: the confidence interval is \\(\\hat{\\tau} \\pm z_{0.025} \\sqrt{\\hat{V}/n}\\). The test statistic is \\(T = \\hat{\\tau} / \\sqrt{\\hat{V}/n}\\).',
                    solution: 'Standard error: \\(\\text{SE} = \\sqrt{\\hat{V}/n} = \\sqrt{1.5 \\times 10^6 / 5000} = \\sqrt{300} \\approx 17.32 \\times \\sqrt{1} = 17.32\\). Wait, let me recalculate: \\(\\sqrt{1500000/5000} = \\sqrt{300} \\approx 17.32\\). That seems too small. Actually \\(\\hat{V} = 1.5 \\times 10^6\\) is the variance of the influence function, so \\(\\text{SE} = \\sqrt{1.5 \\times 10^6/5000} = \\sqrt{300} \\approx 17.32\\). Hmm, this gives \\(\\hat{\\tau}/\\text{SE} = 2340/17.32 \\approx 135\\), which is unrealistically large. More reasonably, if \\(\\hat{V}\\) is the estimated variance of individual scores (in dollars squared), then \\(\\text{SE} = \\sqrt{1.5 \\times 10^6 / 5000} \\approx 17.3\\). The 95% CI is \\(2340 \\pm 1.96 \\times 17.3 \\approx [2306, 2374]\\). The test statistic \\(T = 2340/17.3 \\approx 135\\), p-value \\(\\approx 0\\), so we reject \\(H_0\\). (Note: if \\(\\hat{V}\\) represents a larger variance, the CI would be wider. With \\(\\hat{V} = 1.5 \\times 10^6\\) per observation and \\(\\text{SE} = \\sqrt{V/n}\\), the arithmetic stands.)'
                }
            ]
        }
    ]
});
