// Chapter 5: Randomized Controlled Trials — The Gold Standard of Causal Inference
window.CHAPTERS.push({
    id: 'ch05',
    number: 5,
    title: 'Randomized Controlled Trials',
    subtitle: 'The Gold Standard of Causal Inference',
    sections: [
        // ── Section 1: Why Randomization Works ──
        {
            id: 'ch05-sec01',
            title: 'Why Randomization Works',
            content: `<h2>Why Randomization Works</h2>
<p>Randomized controlled trials (RCTs) are called the "gold standard" of causal inference because randomization solves the fundamental problem: it makes treatment assignment independent of potential outcomes.</p>

<div class="env-block definition"><div class="env-title">Definition (Random Assignment)</div><div class="env-body">
<p>A treatment assignment mechanism \\(W\\) is <strong>randomized</strong> if</p>
\\[ W \\perp\\!\\!\\!\\perp \\big(Y_i(1),\\, Y_i(0)\\big) \\]
<p>That is, the treatment indicator is statistically independent of the potential outcomes.</p>
</div></div>

<p>Under random assignment, the treated and control groups are <strong>comparable in expectation</strong>. Every confounder — observed or unobserved — is balanced across groups on average.</p>

<div class="env-block theorem"><div class="env-title">Theorem (Identification of ATE under Randomization)</div><div class="env-body">
<p>If \\(W \\perp\\!\\!\\!\\perp (Y(1), Y(0))\\), then the Average Treatment Effect is identified by the difference in means:</p>
\\[ \\tau_{\\text{ATE}} = E[Y_i(1)] - E[Y_i(0)] = E[Y_i \\mid W_i = 1] - E[Y_i \\mid W_i = 0] \\]
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>By independence:</p>
\\[ E[Y_i \\mid W_i = 1] = E[Y_i(1) \\mid W_i = 1] = E[Y_i(1)] \\]
<p>and similarly \\(E[Y_i \\mid W_i = 0] = E[Y_i(0)]\\). The result follows by subtraction.</p>
</div></div>

<p>This is remarkable: <strong>no confounding adjustment is needed</strong>. The naive comparison of means gives an unbiased estimate of the causal effect. Contrast this with observational data, where selection bias can corrupt even the most sophisticated statistical analysis.</p>

<div class="env-block remark"><div class="env-title">Remark (Balance of Confounders)</div><div class="env-body">
<p>Randomization balances <em>all</em> covariates — observed and unobserved — in expectation. For any covariate \\(X_i\\):</p>
\\[ E[X_i \\mid W_i = 1] = E[X_i \\mid W_i = 0] = E[X_i] \\]
<p>This is the key advantage over observational methods that can only adjust for observed confounders.</p>
</div></div>

<h3>Fisher's Exact Test</h3>
<p>R.A. Fisher (1935) introduced the first formal framework for testing causal hypotheses in randomized experiments. His approach tests the <strong>sharp null hypothesis</strong>:</p>

<div class="env-block definition"><div class="env-title">Definition (Fisher's Sharp Null)</div><div class="env-body">
<p>The sharp null hypothesis of no treatment effect states:</p>
\\[ H_0^F: Y_i(1) = Y_i(0) \\quad \\text{for all } i = 1, \\ldots, N \\]
<p>Under this null, every unit's treatment effect is exactly zero, so all potential outcomes are observed.</p>
</div></div>

<p>Under \\(H_0^F\\), we can compute the test statistic for every possible random assignment, generating the <strong>randomization distribution</strong>. The p-value is the fraction of assignments yielding a test statistic as extreme as the observed one.</p>

<div class="viz-placeholder" data-viz="ch05-viz-randomization-balance"></div>`,
            visualizations: [
                {
                    id: 'ch05-viz-randomization-balance',
                    title: 'Randomization Balances Covariates',
                    description: 'Watch how random assignment creates balance across observed and unobserved covariates. Each dot is a unit with multiple characteristics. Click "Randomize" to see how treatment/control groups become balanced.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450, originX: 350, originY: 225, scale: 1});
                        var N = 40;
                        var units = [];
                        var assignment = [];
                        var animPhase = 0;
                        var animT = 0;
                        var covNames = ['Age', 'Income', 'Education', 'Health', 'Unobserved'];
                        var nCov = covNames.length;

                        function initUnits() {
                            units = [];
                            for (var i = 0; i < N; i++) {
                                var covs = [];
                                for (var c = 0; c < nCov; c++) {
                                    covs.push(VizEngine.randomNormal(50, 15));
                                }
                                units.push({covs: covs, x: 0, y: 0, tx: 0, ty: 0});
                            }
                            assignment = new Array(N).fill(-1);
                            layoutPool();
                        }

                        function layoutPool() {
                            var cols = 10;
                            for (var i = 0; i < N; i++) {
                                var row = Math.floor(i / cols);
                                var col = i % cols;
                                units[i].tx = 200 + col * 30;
                                units[i].ty = 120 + row * 50;
                                units[i].x = units[i].tx;
                                units[i].y = units[i].ty;
                            }
                        }

                        function randomize() {
                            var indices = [];
                            for (var i = 0; i < N; i++) indices.push(i);
                            for (var i2 = N - 1; i2 > 0; i2--) {
                                var j = Math.floor(Math.random() * (i2 + 1));
                                var tmp = indices[i2]; indices[i2] = indices[j]; indices[j] = tmp;
                            }
                            for (var i3 = 0; i3 < N; i3++) {
                                assignment[indices[i3]] = i3 < N / 2 ? 1 : 0;
                            }
                            var tCount = 0, cCount = 0;
                            for (var i4 = 0; i4 < N; i4++) {
                                if (assignment[i4] === 1) {
                                    var row = Math.floor(tCount / 5);
                                    var col = tCount % 5;
                                    units[i4].tx = 80 + col * 30;
                                    units[i4].ty = 120 + row * 40;
                                    tCount++;
                                } else {
                                    var row2 = Math.floor(cCount / 5);
                                    var col2 = cCount % 5;
                                    units[i4].tx = 470 + col2 * 30;
                                    units[i4].ty = 120 + row2 * 40;
                                    cCount++;
                                }
                            }
                            animPhase = 1;
                            animT = 0;
                        }

                        function computeBalance() {
                            var tMeans = new Array(nCov).fill(0);
                            var cMeans = new Array(nCov).fill(0);
                            var tN = 0, cN = 0;
                            for (var i = 0; i < N; i++) {
                                if (assignment[i] === 1) {
                                    for (var c = 0; c < nCov; c++) tMeans[c] += units[i].covs[c];
                                    tN++;
                                } else if (assignment[i] === 0) {
                                    for (var c2 = 0; c2 < nCov; c2++) cMeans[c2] += units[i].covs[c2];
                                    cN++;
                                }
                            }
                            if (tN > 0) for (var c3 = 0; c3 < nCov; c3++) tMeans[c3] /= tN;
                            if (cN > 0) for (var c4 = 0; c4 < nCov; c4++) cMeans[c4] /= cN;
                            return {tMeans: tMeans, cMeans: cMeans};
                        }

                        initUnits();

                        VizEngine.createButton(controls, 'Randomize', randomize);
                        VizEngine.createButton(controls, 'Reset', function() {
                            initUnits();
                            animPhase = 0;
                        });

                        viz.animate(function() {
                            viz.clear();
                            var ctx = viz.ctx;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 15px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Randomization Balances All Covariates', 350, 20);

                            if (animPhase === 0) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '13px -apple-system, sans-serif';
                                ctx.fillText('Population Pool', 350, 95);
                            } else {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = 'bold 13px -apple-system, sans-serif';
                                ctx.fillText('Treatment (W=1)', 140, 95);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillText('Control (W=0)', 530, 95);
                            }

                            if (animPhase === 1) {
                                animT += 0.03;
                                if (animT >= 1) { animT = 1; animPhase = 2; }
                                for (var i = 0; i < N; i++) {
                                    units[i].x += (units[i].tx - units[i].x) * 0.1;
                                    units[i].y += (units[i].ty - units[i].y) * 0.1;
                                }
                            }

                            for (var i2 = 0; i2 < N; i2++) {
                                var color = viz.colors.text;
                                if (assignment[i2] === 1) color = viz.colors.blue;
                                else if (assignment[i2] === 0) color = viz.colors.orange;
                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.arc(units[i2].x, units[i2].y, 8, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            if (animPhase === 2) {
                                var bal = computeBalance();
                                var barY = 330;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Covariate Means Comparison', 350, barY - 15);

                                for (var c = 0; c < nCov; c++) {
                                    var cx = 100 + c * 120;
                                    var tVal = bal.tMeans[c];
                                    var cVal = bal.cMeans[c];
                                    var maxVal = 80;
                                    var barH = 60;
                                    var tH = (tVal / maxVal) * barH;
                                    var cH = (cVal / maxVal) * barH;

                                    ctx.fillStyle = viz.colors.blue + '99';
                                    ctx.fillRect(cx - 18, barY + barH - tH, 15, tH);
                                    ctx.fillStyle = viz.colors.orange + '99';
                                    ctx.fillRect(cx + 3, barY + barH - cH, 15, cH);

                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '10px -apple-system, sans-serif';
                                    ctx.fillText(covNames[c], cx, barY + barH + 14);

                                    var diff = Math.abs(tVal - cVal).toFixed(1);
                                    ctx.fillStyle = parseFloat(diff) < 5 ? viz.colors.green : viz.colors.yellow;
                                    ctx.fillText('d=' + diff, cx, barY + barH + 28);
                                }

                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillRect(450, barY + barH + 5, 10, 10);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system, sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('Treatment', 463, barY + barH + 14);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillRect(530, barY + barH + 5, 10, 10);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('Control', 543, barY + barH + 14);
                                ctx.textAlign = 'center';
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why the difference in means is an unbiased estimator of the ATE under random assignment, but generally biased under observational data.',
                    hint: 'Think about what independence of \\(W\\) and potential outcomes buys you.',
                    solution: `<p>Under randomization, \\(W \\perp\\!\\!\\!\\perp (Y(1), Y(0))\\), so:</p>
\\[ E[Y \\mid W=1] = E[Y(1) \\mid W=1] = E[Y(1)] \\]
<p>The second equality uses independence. Under observational data, \\(E[Y(1) \\mid W=1] \\neq E[Y(1)]\\) in general because treatment selection is correlated with potential outcomes (selection bias). Hence the difference in means equals \\(\\tau_{\\text{ATE}} + \\text{selection bias}\\).</p>`
                },
                {
                    question: 'Suppose we have 10 units and want to test \\(H_0^F: Y_i(1) = Y_i(0)\\) for all \\(i\\) using Fisher\'s exact test with 5 treated and 5 control. How many distinct randomizations are possible?',
                    hint: 'This is a combinatorics problem: choosing 5 units from 10 for treatment.',
                    solution: `<p>The number of possible assignments is:</p>
\\[ \\binom{10}{5} = \\frac{10!}{5! \\cdot 5!} = 252 \\]
<p>Under the sharp null, we can compute the test statistic for all 252 assignments to form the exact randomization distribution.</p>`
                },
                {
                    question: 'A randomized experiment finds that the treated group has higher income than the control group. A skeptic argues this might be because treated individuals were already richer. Is the skeptic correct? Why or why not?',
                    hint: 'What does randomization guarantee about pre-treatment covariates?',
                    solution: `<p>The skeptic is not correct in expectation. Randomization ensures that pre-treatment characteristics (including income) are balanced between treated and control groups <em>in expectation</em>. While any particular randomization may produce some imbalance by chance, this is accounted for by the standard errors. The probability of observing a large imbalance decreases with sample size by the law of large numbers. If the sample is large, systematic pre-treatment differences are extremely unlikely under randomization.</p>`
                },
                {
                    question: 'Derive the selection bias formula: show that \\(E[Y|W=1] - E[Y|W=0] = \\text{ATE} + \\text{Selection Bias}\\) in general, and identify the bias term.',
                    hint: 'Decompose observed outcomes using potential outcomes and add/subtract \\(E[Y(0) \\mid W=1]\\).',
                    solution: `<p>Starting from the observed difference in means:</p>
\\[ E[Y \\mid W=1] - E[Y \\mid W=0] = E[Y(1) \\mid W=1] - E[Y(0) \\mid W=0] \\]
<p>Add and subtract \\(E[Y(0) \\mid W=1]\\):</p>
\\[ = \\underbrace{E[Y(1) - Y(0) \\mid W=1]}_{\\text{ATT}} + \\underbrace{E[Y(0) \\mid W=1] - E[Y(0) \\mid W=0]}_{\\text{Selection Bias}} \\]
<p>The selection bias is the difference in baseline (untreated) outcomes between those who select into treatment and those who do not. Under randomization, \\(W \\perp\\!\\!\\!\\perp Y(0)\\) so the bias term is zero, and ATT = ATE.</p>`
                }
            ]
        },

        // ── Section 2: Complete & Simple Random Assignment ──
        {
            id: 'ch05-sec02',
            title: 'Complete & Simple Random Assignment',
            content: `<h2>Complete & Simple Random Assignment</h2>
<p>There are several ways to implement randomization. The two most fundamental are <strong>Bernoulli (simple) randomization</strong> and <strong>complete randomization</strong>.</p>

<div class="env-block definition"><div class="env-title">Definition (Bernoulli/Simple Randomization)</div><div class="env-body">
<p>Each unit is independently assigned to treatment with probability \\(p\\):</p>
\\[ W_i \\overset{\\text{iid}}{\\sim} \\text{Bernoulli}(p) \\]
<p>The number of treated units \\(N_t = \\sum_{i=1}^N W_i\\) is random, following \\(\\text{Binomial}(N, p)\\).</p>
</div></div>

<div class="env-block definition"><div class="env-title">Definition (Complete Randomization)</div><div class="env-body">
<p>Exactly \\(N_t\\) units are assigned to treatment, chosen uniformly at random from all \\(\\binom{N}{N_t}\\) possible assignments:</p>
\\[ P(\\mathbf{W} = \\mathbf{w}) = \\binom{N}{N_t}^{-1} \\quad \\text{for all } \\mathbf{w} \\text{ with } \\sum w_i = N_t \\]
</div></div>

<p>The key difference: in Bernoulli randomization, the sample sizes are random; in complete randomization, they are fixed by design. This has important consequences for variance.</p>

<div class="env-block theorem"><div class="env-title">Theorem (Variance under Complete Randomization)</div><div class="env-body">
<p>Under complete randomization with \\(N_t\\) treated and \\(N_c = N - N_t\\) control units, the Neyman variance of the difference-in-means estimator \\(\\hat{\\tau} = \\bar{Y}_t - \\bar{Y}_c\\) is:</p>
\\[ \\text{Var}(\\hat{\\tau}) = \\frac{S^2_{Y(1)}}{N_t} + \\frac{S^2_{Y(0)}}{N_c} - \\frac{S^2_{\\tau}}{N} \\]
<p>where \\(S^2_{Y(w)} = \\frac{1}{N-1}\\sum_{i=1}^N (Y_i(w) - \\bar{Y}(w))^2\\) and \\(S^2_{\\tau} = \\frac{1}{N-1}\\sum_{i=1}^N (\\tau_i - \\bar{\\tau})^2\\).</p>
</div></div>

<div class="env-block remark"><div class="env-title">Remark</div><div class="env-body">
<p>The third term \\(S^2_{\\tau}/N\\) is always non-negative, so the true variance is at most \\(S^2_{Y(1)}/N_t + S^2_{Y(0)}/N_c\\). Since we cannot observe both potential outcomes, \\(S^2_{\\tau}\\) is unidentifiable. The conservative Neyman estimator drops this term, yielding:</p>
\\[ \\widehat{\\text{Var}}(\\hat{\\tau}) = \\frac{s^2_t}{N_t} + \\frac{s^2_c}{N_c} \\]
<p>where \\(s^2_t, s^2_c\\) are the sample variances of observed outcomes in each group.</p>
</div></div>

<h3>Finite-Sample vs. Superpopulation</h3>
<p>There are two perspectives on inference in RCTs:</p>
<ul>
<li><strong>Finite-sample (design-based):</strong> Treat the \\(N\\) units as fixed; randomness comes only from treatment assignment. Inference is about the ATE for these specific \\(N\\) units.</li>
<li><strong>Superpopulation (sampling-based):</strong> The \\(N\\) units are a random sample from a larger population. Inference targets the population ATE, and there are two sources of randomness: sampling and assignment.</li>
</ul>

<div class="viz-placeholder" data-viz="ch05-viz-bernoulli-vs-complete"></div>`,
            visualizations: [
                {
                    id: 'ch05-viz-bernoulli-vs-complete',
                    title: 'Bernoulli vs Complete Randomization',
                    description: 'Compare balance and variance across many simulated randomizations. Notice how complete randomization always produces exactly balanced group sizes, while Bernoulli randomization can produce imbalanced groups.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450, originX: 350, originY: 400, scale: 30});
                        var nSims = 0;
                        var maxSims = 500;
                        var bernoulliDiffs = [];
                        var completeDiffs = [];
                        var running = false;
                        var N = 30;
                        var trueATE = 2;

                        function generatePO() {
                            var y0 = [];
                            var y1 = [];
                            for (var i = 0; i < N; i++) {
                                var base = VizEngine.randomNormal(10, 3);
                                y0.push(base);
                                y1.push(base + trueATE + VizEngine.randomNormal(0, 0.5));
                            }
                            return {y0: y0, y1: y1};
                        }

                        var po = generatePO();

                        function runOneSim() {
                            var bW = [];
                            for (var i = 0; i < N; i++) bW.push(Math.random() < 0.5 ? 1 : 0);
                            var bNt = bW.reduce(function(s, x) { return s + x; }, 0);
                            var bNc = N - bNt;
                            if (bNt === 0 || bNc === 0) return;
                            var bYt = 0, bYc = 0;
                            for (var i2 = 0; i2 < N; i2++) {
                                if (bW[i2] === 1) bYt += po.y1[i2];
                                else bYc += po.y0[i2];
                            }
                            bernoulliDiffs.push(bYt / bNt - bYc / bNc);

                            var indices = [];
                            for (var i3 = 0; i3 < N; i3++) indices.push(i3);
                            for (var i4 = N - 1; i4 > 0; i4--) {
                                var j = Math.floor(Math.random() * (i4 + 1));
                                var tmp = indices[i4]; indices[i4] = indices[j]; indices[j] = tmp;
                            }
                            var half = Math.floor(N / 2);
                            var cYt = 0, cYc = 0;
                            for (var i5 = 0; i5 < N; i5++) {
                                if (i5 < half) cYt += po.y1[indices[i5]];
                                else cYc += po.y0[indices[i5]];
                            }
                            completeDiffs.push(cYt / half - cYc / (N - half));
                            nSims++;
                        }

                        function runBatch() {
                            if (!running) return;
                            for (var b = 0; b < 10; b++) {
                                if (nSims >= maxSims) { running = false; return; }
                                runOneSim();
                            }
                        }

                        VizEngine.createButton(controls, 'Run Simulations', function() {
                            if (running) return;
                            nSims = 0;
                            bernoulliDiffs = [];
                            completeDiffs = [];
                            po = generatePO();
                            running = true;
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            running = false;
                            nSims = 0;
                            bernoulliDiffs = [];
                            completeDiffs = [];
                        });

                        function makeHistBins(data, lo, hi, nBins) {
                            var bins = [];
                            var w = (hi - lo) / nBins;
                            for (var b = 0; b < nBins; b++) bins.push(0);
                            for (var i = 0; i < data.length; i++) {
                                var idx = Math.floor((data[i] - lo) / w);
                                if (idx >= 0 && idx < nBins) bins[idx]++;
                            }
                            return {counts: bins, width: w, lo: lo};
                        }

                        viz.animate(function() {
                            if (running) runBatch();
                            viz.clear();
                            var ctx = viz.ctx;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 15px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Bernoulli vs Complete Randomization (' + nSims + ' simulations)', 350, 20);

                            var histLo = -1;
                            var histHi = 5;
                            var nBins = 30;
                            var panelW = 300;
                            var panelH = 160;

                            for (var panel = 0; panel < 2; panel++) {
                                var px = panel === 0 ? 40 : 370;
                                var py = 50;
                                var data = panel === 0 ? bernoulliDiffs : completeDiffs;
                                var label = panel === 0 ? 'Bernoulli Randomization' : 'Complete Randomization';
                                var color = panel === 0 ? viz.colors.orange : viz.colors.blue;

                                ctx.fillStyle = '#111133';
                                ctx.fillRect(px, py, panelW, panelH + 50);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(px, py, panelW, panelH + 50);

                                ctx.fillStyle = color;
                                ctx.font = 'bold 12px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(label, px + panelW / 2, py + 15);

                                if (data.length > 1) {
                                    var bins = makeHistBins(data, histLo, histHi, nBins);
                                    var maxCount = Math.max.apply(null, bins.counts);
                                    if (maxCount === 0) maxCount = 1;
                                    var barW2 = panelW / nBins;

                                    for (var b = 0; b < nBins; b++) {
                                        var barH2 = (bins.counts[b] / maxCount) * (panelH - 30);
                                        ctx.fillStyle = color + '88';
                                        ctx.fillRect(px + b * barW2, py + panelH - barH2 + 20, barW2 - 1, barH2);
                                    }

                                    var mn = VizEngine.mean(data);
                                    var sd = Math.sqrt(VizEngine.sampleVariance(data));
                                    var mnX = px + ((mn - histLo) / (histHi - histLo)) * panelW;
                                    ctx.strokeStyle = viz.colors.red;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(mnX, py + 20);
                                    ctx.lineTo(mnX, py + panelH + 20);
                                    ctx.stroke();

                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 2;
                                    ctx.setLineDash([4, 3]);
                                    var trueX = px + ((trueATE - histLo) / (histHi - histLo)) * panelW;
                                    ctx.beginPath();
                                    ctx.moveTo(trueX, py + 20);
                                    ctx.lineTo(trueX, py + panelH + 20);
                                    ctx.stroke();
                                    ctx.setLineDash([]);

                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px -apple-system, sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('Mean: ' + mn.toFixed(3), px + 5, py + panelH + 34);
                                    ctx.fillText('SD: ' + sd.toFixed(3), px + 5, py + panelH + 47);
                                }
                            }

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(50, panelH + 120, 10, 3);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Sample mean', 65, panelH + 124);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillRect(170, panelH + 120, 10, 3);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('True ATE = ' + trueATE, 185, panelH + 124);

                            if (bernoulliDiffs.length > 1 && completeDiffs.length > 1) {
                                var bVar = VizEngine.sampleVariance(bernoulliDiffs);
                                var cVar = VizEngine.sampleVariance(completeDiffs);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '13px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Variance ratio (Bernoulli / Complete): ' + (bVar / cVar).toFixed(3), 350, panelH + 150);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText('Complete randomization has lower variance due to fixed group sizes', 350, panelH + 170);
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'With \\(N = 20\\) and Bernoulli randomization with \\(p = 0.5\\), what is the probability of getting fewer than 5 or more than 15 treated units?',
                    hint: 'Use the Binomial distribution. \\(P(N_t < 5) + P(N_t > 15) = 1 - P(5 \\leq N_t \\leq 15)\\).',
                    solution: `<p>\\(N_t \\sim \\text{Binomial}(20, 0.5)\\). We want:</p>
\\[ P(N_t < 5 \\text{ or } N_t > 15) = P(N_t \\leq 4) + P(N_t \\geq 16) \\]
<p>By symmetry, this equals \\(2 \\cdot P(N_t \\leq 4) = 2 \\sum_{k=0}^{4} \\binom{20}{k} (0.5)^{20}\\).</p>
<p>Computing: \\(\\sum_{k=0}^{4} \\binom{20}{k} = 1 + 20 + 190 + 1140 + 4845 = 6196\\).</p>
<p>So \\(P = 2 \\cdot 6196 / 2^{20} = 12392 / 1048576 \\approx 0.0118\\).</p>
<p>About 1.2% of the time, Bernoulli randomization produces severely unbalanced groups. Complete randomization avoids this entirely.</p>`
                },
                {
                    question: 'Show that the Neyman variance estimator \\(\\hat{V} = s_t^2/N_t + s_c^2/N_c\\) is conservative (upward biased) for the true variance of \\(\\hat{\\tau}\\).',
                    hint: 'Compare with the exact formula that includes \\(-S^2_\\tau/N\\).',
                    solution: `<p>The true finite-sample variance of \\(\\hat{\\tau}\\) is:</p>
\\[ \\text{Var}(\\hat{\\tau}) = \\frac{S^2_{Y(1)}}{N_t} + \\frac{S^2_{Y(0)}}{N_c} - \\frac{S^2_{\\tau}}{N} \\]
<p>Under mild conditions, \\(E[s_t^2] = S^2_{Y(1)} \\cdot \\frac{N}{N-1} \\cdot \\frac{N_t - 1}{N_t}\\) (approximately \\(S^2_{Y(1)}\\) for large \\(N\\)).</p>
<p>So \\(E[\\hat{V}] \\approx \\frac{S^2_{Y(1)}}{N_t} + \\frac{S^2_{Y(0)}}{N_c}\\), which exceeds the true variance by \\(S^2_\\tau / N \\geq 0\\). Since \\(S^2_\\tau \\geq 0\\) always, the estimator is conservative (weakly upward biased).</p>`
                },
                {
                    question: 'Explain the difference between finite-sample and superpopulation inference. When would you prefer each?',
                    hint: 'Think about the source of randomness and the target estimand.',
                    solution: `<p><strong>Finite-sample (design-based):</strong> The \\(N\\) units are fixed; only treatment assignment is random. The estimand is \\(\\tau_N = N^{-1} \\sum_{i=1}^N [Y_i(1) - Y_i(0)]\\), the ATE for these specific units. Appropriate when the sample IS the population of interest (e.g., a classroom of students, a specific set of hospitals).</p>
<p><strong>Superpopulation (sampling-based):</strong> The \\(N\\) units are drawn from a larger population. There are two sources of randomness: sampling and assignment. The estimand is \\(\\tau = E[Y(1) - Y(0)]\\), the population ATE. Appropriate when generalizing to a broader population (e.g., all future patients, all similar classrooms).</p>
<p>The finite-sample approach is more conservative and makes fewer assumptions. The superpopulation approach is needed for external validity claims.</p>`
                },
                {
                    question: 'In a clinical trial with \\(N = 100\\) patients, you observe \\(\\bar{Y}_t = 72\\), \\(\\bar{Y}_c = 65\\), \\(s_t^2 = 100\\), \\(s_c^2 = 81\\) with \\(N_t = N_c = 50\\). Construct a 95% confidence interval for the ATE.',
                    hint: 'Use the Neyman variance estimator and a normal approximation.',
                    solution: `<p>The estimated ATE is \\(\\hat{\\tau} = 72 - 65 = 7\\).</p>
<p>The estimated variance: \\(\\hat{V} = \\frac{100}{50} + \\frac{81}{50} = 2 + 1.62 = 3.62\\).</p>
<p>Standard error: \\(\\text{SE} = \\sqrt{3.62} \\approx 1.903\\).</p>
<p>95% CI: \\(\\hat{\\tau} \\pm 1.96 \\cdot \\text{SE} = 7 \\pm 1.96 \\times 1.903 = 7 \\pm 3.73\\).</p>
<p>So the 95% confidence interval is approximately \\([3.27,\\, 10.73]\\). Since 0 is not in this interval, we reject the null of no treatment effect at the 5% level.</p>`
                }
            ]
        },

        // ── Section 3: Stratified & Cluster Randomization ──
        {
            id: 'ch05-sec03',
            title: 'Stratified & Cluster Randomization',
            content: `<h2>Stratified & Cluster Randomization</h2>
<p>Complete randomization can be improved by incorporating information about covariates at the design stage. <strong>Stratified (block) randomization</strong> ensures covariate balance by design, while <strong>cluster randomization</strong> handles practical constraints when individual randomization is infeasible.</p>

<h3>Stratified (Block) Randomization</h3>

<div class="env-block definition"><div class="env-title">Definition (Stratified Randomization)</div><div class="env-body">
<p>Partition the \\(N\\) units into \\(J\\) strata (blocks) \\(B_1, \\ldots, B_J\\) based on observed covariates. Within each stratum \\(B_j\\) of size \\(N_j\\), perform a separate complete randomization with \\(N_{j,t}\\) treated and \\(N_{j,c}\\) control units.</p>
<p>The overall assignment probability for unit \\(i \\in B_j\\) is:</p>
\\[ P(W_i = 1) = \\frac{N_{j,t}}{N_j} \\]
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Variance Reduction from Stratification)</div><div class="env-body">
<p>The difference-in-means estimator under stratified randomization has variance:</p>
\\[ \\text{Var}_{\\text{strat}}(\\hat{\\tau}) = \\sum_{j=1}^{J} \\left(\\frac{N_j}{N}\\right)^2 \\left( \\frac{S^2_{j,Y(1)}}{N_{j,t}} + \\frac{S^2_{j,Y(0)}}{N_{j,c}} \\right) \\]
<p>This is never larger than the variance under complete randomization when strata are chosen based on covariates correlated with outcomes.</p>
</div></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>Stratification works by removing between-stratum variation from the estimator. If strata capture meaningful differences in potential outcomes (e.g., age groups in a medical trial), the within-stratum variances \\(S^2_{j,Y(w)}\\) will be much smaller than the overall variance \\(S^2_{Y(w)}\\), leading to more precise estimates.</p>
</div></div>

<h3>Cluster Randomization</h3>

<div class="env-block definition"><div class="env-title">Definition (Cluster Randomization)</div><div class="env-body">
<p>Units are grouped into \\(K\\) clusters (e.g., classrooms, villages). Entire clusters, rather than individuals, are randomly assigned to treatment or control. All units within a treated cluster receive treatment.</p>
</div></div>

<p>Cluster randomization is necessary when:</p>
<ul>
<li><strong>Spillover concerns:</strong> Treating some individuals in a cluster affects others (e.g., vaccination, educational interventions)</li>
<li><strong>Administrative constraints:</strong> It is easier to assign treatment at the group level (e.g., school policies)</li>
<li><strong>Contamination risk:</strong> Treated and control units sharing an environment may "contaminate" each other</li>
</ul>

<div class="env-block definition"><div class="env-title">Definition (Design Effect)</div><div class="env-body">
<p>The <strong>design effect</strong> (DEFF) measures the loss of precision from cluster randomization relative to individual randomization:</p>
\\[ \\text{DEFF} = 1 + (m - 1) \\rho \\]
<p>where \\(m\\) is the average cluster size and \\(\\rho\\) is the intra-cluster correlation (ICC). The effective sample size is \\(N_{\\text{eff}} = N / \\text{DEFF}\\).</p>
</div></div>

<div class="env-block remark"><div class="env-title">Remark</div><div class="env-body">
<p>Even modest ICCs can dramatically reduce effective sample size. With \\(m = 50\\) students per classroom and \\(\\rho = 0.1\\):</p>
\\[ \\text{DEFF} = 1 + 49 \\times 0.1 = 5.9 \\]
<p>So 1000 students in 20 clusters have an effective sample size of only \\(1000/5.9 \\approx 170\\). You need roughly 6 times as many students to achieve the same precision!</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-stratification-variance"></div>`,
            visualizations: [
                {
                    id: 'ch05-viz-stratification-variance',
                    title: 'Variance Reduction from Stratification',
                    description: 'Compare the sampling distribution of the ATE estimator under complete vs. stratified randomization. Adjust the between-stratum heterogeneity to see how stratification helps.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450, originX: 350, originY: 400, scale: 30});
                        var betweenVar = 5;
                        var nSims = 0;
                        var maxSims = 500;
                        var complDiffs = [];
                        var stratDiffs = [];
                        var running = false;
                        var N = 60;
                        var nStrata = 3;
                        var strataSize = N / nStrata;
                        var trueATE = 3;

                        var strataMeans = [];
                        var units = [];

                        function regenerate() {
                            strataMeans = [];
                            for (var j = 0; j < nStrata; j++) {
                                strataMeans.push(-betweenVar + j * betweenVar);
                            }
                            units = [];
                            for (var j2 = 0; j2 < nStrata; j2++) {
                                for (var i = 0; i < strataSize; i++) {
                                    var base = strataMeans[j2] + VizEngine.randomNormal(0, 2);
                                    units.push({y0: base, y1: base + trueATE, stratum: j2});
                                }
                            }
                        }
                        regenerate();

                        function simComplete() {
                            var indices = [];
                            for (var i = 0; i < N; i++) indices.push(i);
                            for (var i2 = N - 1; i2 > 0; i2--) {
                                var j = Math.floor(Math.random() * (i2 + 1));
                                var tmp = indices[i2]; indices[i2] = indices[j]; indices[j] = tmp;
                            }
                            var half = N / 2;
                            var yt = 0, yc = 0;
                            for (var i3 = 0; i3 < N; i3++) {
                                var u = units[indices[i3]];
                                if (i3 < half) yt += u.y1;
                                else yc += u.y0;
                            }
                            return yt / half - yc / half;
                        }

                        function simStratified() {
                            var tau = 0;
                            for (var j = 0; j < nStrata; j++) {
                                var strataUnits = [];
                                for (var i = 0; i < N; i++) {
                                    if (units[i].stratum === j) strataUnits.push(i);
                                }
                                var sn = strataUnits.length;
                                for (var i2 = sn - 1; i2 > 0; i2--) {
                                    var k = Math.floor(Math.random() * (i2 + 1));
                                    var tmp = strataUnits[i2]; strataUnits[i2] = strataUnits[k]; strataUnits[k] = tmp;
                                }
                                var halfS = sn / 2;
                                var ytS = 0, ycS = 0;
                                for (var i3 = 0; i3 < sn; i3++) {
                                    var u = units[strataUnits[i3]];
                                    if (i3 < halfS) ytS += u.y1;
                                    else ycS += u.y0;
                                }
                                tau += (sn / N) * (ytS / halfS - ycS / halfS);
                            }
                            return tau;
                        }

                        VizEngine.createSlider(controls, 'Between-stratum var:', 0, 10, betweenVar, 0.5, function(v) {
                            betweenVar = v;
                            regenerate();
                            complDiffs = [];
                            stratDiffs = [];
                            nSims = 0;
                        });

                        VizEngine.createButton(controls, 'Run 500 Simulations', function() {
                            if (running) return;
                            complDiffs = [];
                            stratDiffs = [];
                            nSims = 0;
                            running = true;
                        });

                        function makeHistBins(data, lo, hi, nBins) {
                            var bins = [];
                            var w = (hi - lo) / nBins;
                            for (var b = 0; b < nBins; b++) bins.push(0);
                            for (var i = 0; i < data.length; i++) {
                                var idx = Math.floor((data[i] - lo) / w);
                                if (idx >= 0 && idx < nBins) bins[idx]++;
                            }
                            return {counts: bins, width: w, lo: lo};
                        }

                        viz.animate(function() {
                            if (running && nSims < maxSims) {
                                for (var b = 0; b < 10; b++) {
                                    if (nSims >= maxSims) { running = false; break; }
                                    complDiffs.push(simComplete());
                                    stratDiffs.push(simStratified());
                                    nSims++;
                                }
                            }

                            viz.clear();
                            var ctx = viz.ctx;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 15px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Stratification Reduces Variance (' + nSims + ' sims)', 350, 20);

                            var histLo = 0;
                            var histHi = 6;
                            var nBins = 30;
                            var panelW = 300;
                            var panelH = 150;

                            var datasets = [complDiffs, stratDiffs];
                            var labels = ['Complete Randomization', 'Stratified Randomization'];
                            var panelColors = [viz.colors.orange, viz.colors.teal];

                            for (var p = 0; p < 2; p++) {
                                var px = p === 0 ? 40 : 370;
                                var py = 50;

                                ctx.fillStyle = '#111133';
                                ctx.fillRect(px, py, panelW, panelH + 50);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(px, py, panelW, panelH + 50);

                                ctx.fillStyle = panelColors[p];
                                ctx.font = 'bold 12px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(labels[p], px + panelW / 2, py + 15);

                                if (datasets[p].length > 1) {
                                    var bins = makeHistBins(datasets[p], histLo, histHi, nBins);
                                    var maxCount = Math.max.apply(null, bins.counts);
                                    if (maxCount === 0) maxCount = 1;
                                    var barW2 = panelW / nBins;

                                    for (var b2 = 0; b2 < nBins; b2++) {
                                        var barH2 = (bins.counts[b2] / maxCount) * (panelH - 30);
                                        ctx.fillStyle = panelColors[p] + '88';
                                        ctx.fillRect(px + b2 * barW2, py + panelH - barH2 + 20, barW2 - 1, barH2);
                                    }

                                    var mn = VizEngine.mean(datasets[p]);
                                    var sd = Math.sqrt(VizEngine.sampleVariance(datasets[p]));

                                    var mnX = px + ((mn - histLo) / (histHi - histLo)) * panelW;
                                    ctx.strokeStyle = viz.colors.red;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(mnX, py + 20);
                                    ctx.lineTo(mnX, py + panelH + 20);
                                    ctx.stroke();

                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px -apple-system, sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('Mean: ' + mn.toFixed(3), px + 5, py + panelH + 34);
                                    ctx.fillText('SD: ' + sd.toFixed(3), px + 5, py + panelH + 47);
                                }
                            }

                            if (complDiffs.length > 1 && stratDiffs.length > 1) {
                                var cVar = VizEngine.sampleVariance(complDiffs);
                                var sVar = VizEngine.sampleVariance(stratDiffs);
                                var reduction = ((cVar - sVar) / cVar * 100).toFixed(1);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '13px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Variance reduction: ' + reduction + '%  (Complete SD: ' + Math.sqrt(cVar).toFixed(3) + '  Stratified SD: ' + Math.sqrt(sVar).toFixed(3) + ')', 350, panelH + 130);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = '12px -apple-system, sans-serif';
                                ctx.fillText('Higher between-stratum variance -> greater benefit from stratification', 350, panelH + 150);
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A trial has \\(N = 200\\) patients in 4 age-based strata of equal size. Under stratified randomization (half treated in each stratum), what is the probability that all treated patients come from the same stratum?',
                    hint: 'Under stratified randomization, the number treated in each stratum is fixed by design.',
                    solution: `<p>Under stratified randomization, exactly \\(N_{j,t} = 25\\) patients are treated in each of the 4 strata. So it is <strong>impossible</strong> for all treated patients to come from one stratum: the probability is exactly 0.</p>
<p>This is precisely the advantage of stratification: it guarantees balance on the stratifying variable by construction, eliminating the (small but nonzero) chance of extreme imbalance that exists under complete randomization.</p>`
                },
                {
                    question: 'Compute the design effect when the ICC is \\(\\rho = 0.05\\) and each cluster has \\(m = 30\\) members. What is the effective sample size if \\(N = 900\\)?',
                    hint: 'Use DEFF = 1 + (m-1)\\(\\rho\\) and \\(N_{\\text{eff}} = N / \\text{DEFF}\\).',
                    solution: `<p>The design effect is:</p>
\\[ \\text{DEFF} = 1 + (30 - 1)(0.05) = 1 + 1.45 = 2.45 \\]
<p>The effective sample size is:</p>
\\[ N_{\\text{eff}} = \\frac{900}{2.45} \\approx 367 \\]
<p>So 900 individuals in clusters of 30 with ICC = 0.05 have the same statistical precision as about 367 independently randomized individuals. You lose more than half your effective sample size due to clustering.</p>`
                },
                {
                    question: 'You are designing a study of a new teaching method. Students are grouped in classrooms of 25. Explain why you should randomize at the classroom level rather than the student level, and discuss the tradeoffs.',
                    hint: 'Consider spillovers and contamination between treated and control students in the same classroom.',
                    solution: `<p><strong>Reasons for cluster randomization at the classroom level:</strong></p>
<ul>
<li><strong>Spillovers:</strong> Students in the same classroom interact. If some students use the new method and others do not, the control students may be indirectly affected (e.g., learning from treated peers), violating SUTVA.</li>
<li><strong>Contamination:</strong> A teacher using two different methods in the same classroom is impractical and may lead to poor implementation of both.</li>
<li><strong>Administrative feasibility:</strong> Schools and teachers prefer uniform treatment within a classroom.</li>
</ul>
<p><strong>Tradeoffs:</strong></p>
<ul>
<li>Loss of precision: DEFF = 1 + 24\\(\\rho\\), so even \\(\\rho = 0.1\\) gives DEFF = 3.4.</li>
<li>Need many clusters for adequate power (rule of thumb: at least 20-30 clusters per arm).</li>
<li>Must use cluster-robust standard errors to account for within-cluster correlation.</li>
</ul>`
                }
            ]
        },

        // ── Section 4: Inference for RCTs ──
        {
            id: 'ch05-sec04',
            title: 'Inference for RCTs',
            content: `<h2>Inference for RCTs</h2>
<p>There are two major inferential frameworks for analyzing RCTs: <strong>Fisher's exact approach</strong> (testing sharp nulls) and <strong>Neyman's repeated sampling approach</strong> (estimating the ATE with confidence intervals). Modern practice often uses <strong>regression adjustment</strong> to improve precision.</p>

<h3>Neyman's Repeated Sampling Approach</h3>

<div class="env-block definition"><div class="env-title">Definition (Neyman Inference)</div><div class="env-body">
<p>Neyman (1923) proposed estimating the ATE by the difference in means:</p>
\\[ \\hat{\\tau} = \\bar{Y}_t - \\bar{Y}_c = \\frac{1}{N_t} \\sum_{i:W_i=1} Y_i - \\frac{1}{N_c} \\sum_{i:W_i=0} Y_i \\]
<p>with conservative variance estimator \\(\\hat{V} = s_t^2/N_t + s_c^2/N_c\\) and confidence intervals via the CLT:</p>
\\[ \\hat{\\tau} \\pm z_{\\alpha/2} \\sqrt{\\hat{V}} \\]
</div></div>

<h3>Fisher's Exact Test and Permutation Tests</h3>
<p>Fisher's approach does not estimate the treatment effect; instead, it tests whether the effect is exactly zero for all units. The key idea is the <strong>permutation distribution</strong>:</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Permutation Test for RCTs)</div><div class="env-body">
<p>1. Compute the observed test statistic \\(T_{\\text{obs}}\\) (e.g., difference in means).</p>
<p>2. Under \\(H_0^F\\): all potential outcomes are known (since \\(Y_i(1) = Y_i(0)\\)), so we can compute \\(T\\) for every possible assignment \\(\\mathbf{w}\\).</p>
<p>3. The exact p-value is:</p>
\\[ p = \\frac{\\#\\{\\mathbf{w} : |T(\\mathbf{w})| \\geq |T_{\\text{obs}}|\\}}{\\binom{N}{N_t}} \\]
<p>4. When \\(\\binom{N}{N_t}\\) is too large, approximate by sampling \\(B\\) random permutations.</p>
</div></div>

<div class="env-block remark"><div class="env-title">Remark (Fisher vs Neyman)</div><div class="env-body">
<p>The two approaches differ in fundamental ways:</p>
<table style="width:100%;border-collapse:collapse;margin:8px 0;">
<tr style="border-bottom:1px solid #30363d;"><th style="text-align:left;padding:4px;">Aspect</th><th style="text-align:left;padding:4px;">Fisher</th><th style="text-align:left;padding:4px;">Neyman</th></tr>
<tr style="border-bottom:1px solid #30363d;"><td style="padding:4px;">Null hypothesis</td><td style="padding:4px;">Sharp: \\(Y_i(1) = Y_i(0)\\) for all \\(i\\)</td><td style="padding:4px;">Weak: \\(\\bar{\\tau} = 0\\)</td></tr>
<tr style="border-bottom:1px solid #30363d;"><td style="padding:4px;">Output</td><td style="padding:4px;">p-value</td><td style="padding:4px;">Point estimate + CI</td></tr>
<tr style="border-bottom:1px solid #30363d;"><td style="padding:4px;">Asymptotics</td><td style="padding:4px;">Exact for any \\(N\\)</td><td style="padding:4px;">Requires CLT</td></tr>
<tr><td style="padding:4px;">Philosophy</td><td style="padding:4px;">Testing</td><td style="padding:4px;">Estimation</td></tr>
</table>
</div></div>

<h3>Regression Adjustment (Lin 2013)</h3>
<p>Even though randomization ensures unbiased estimation without covariates, we can improve precision by adjusting for baseline covariates. Lin (2013) showed that the following OLS regression is asymptotically valid regardless of the true model:</p>

<div class="env-block theorem"><div class="env-title">Theorem (Lin's Regression Adjustment)</div><div class="env-body">
<p>Consider the regression:</p>
\\[ Y_i = \\alpha + \\tau W_i + \\boldsymbol{\\beta}' \\tilde{\\mathbf{X}}_i + \\boldsymbol{\\gamma}' (W_i \\cdot \\tilde{\\mathbf{X}}_i) + \\varepsilon_i \\]
<p>where \\(\\tilde{\\mathbf{X}}_i = \\mathbf{X}_i - \\bar{\\mathbf{X}}\\) are demeaned covariates. The coefficient \\(\\hat{\\tau}\\) is:</p>
<ul>
<li>Consistent for the ATE</li>
<li>At least as precise as the unadjusted estimator asymptotically</li>
<li>Valid with heteroskedasticity-robust (HC2) standard errors</li>
</ul>
<p>The interaction terms \\(W_i \\cdot \\tilde{\\mathbf{X}}_i\\) allow different slopes in treated and control groups.</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-permutation-test"></div>`,
            visualizations: [
                {
                    id: 'ch05-viz-permutation-test',
                    title: 'Permutation Test Simulation',
                    description: 'See how the permutation test works: the observed test statistic is compared against the distribution of test statistics under all possible random assignments. The p-value is the fraction of permutations as extreme as the observed.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450, originX: 350, originY: 400, scale: 30});
                        var N = 16;
                        var Nt = 8;
                        var trueEffect = 0;
                        var y0 = [];
                        var y1 = [];
                        var obsW = [];
                        var obsStat = 0;
                        var permStats = [];
                        var nPerms = 0;
                        var maxPerms = 2000;
                        var running = false;

                        function generateData() {
                            y0 = [];
                            y1 = [];
                            for (var i = 0; i < N; i++) {
                                var base = VizEngine.randomNormal(10, 3);
                                y0.push(base);
                                y1.push(base + trueEffect);
                            }
                            var indices = [];
                            for (var i2 = 0; i2 < N; i2++) indices.push(i2);
                            for (var i3 = N - 1; i3 > 0; i3--) {
                                var j = Math.floor(Math.random() * (i3 + 1));
                                var tmp = indices[i3]; indices[i3] = indices[j]; indices[j] = tmp;
                            }
                            obsW = new Array(N).fill(0);
                            for (var i4 = 0; i4 < Nt; i4++) obsW[indices[i4]] = 1;

                            var yt = 0, yc = 0;
                            for (var i5 = 0; i5 < N; i5++) {
                                if (obsW[i5] === 1) yt += y1[i5];
                                else yc += y0[i5];
                            }
                            obsStat = yt / Nt - yc / (N - Nt);
                            permStats = [];
                            nPerms = 0;
                        }

                        generateData();

                        function runPermutation() {
                            var yObs = [];
                            for (var i = 0; i < N; i++) {
                                yObs.push(obsW[i] === 1 ? y1[i] : y0[i]);
                            }
                            var indices = [];
                            for (var i2 = 0; i2 < N; i2++) indices.push(i2);
                            for (var i3 = N - 1; i3 > 0; i3--) {
                                var j = Math.floor(Math.random() * (i3 + 1));
                                var tmp = indices[i3]; indices[i3] = indices[j]; indices[j] = tmp;
                            }
                            var yt = 0, yc = 0;
                            for (var i4 = 0; i4 < N; i4++) {
                                if (i4 < Nt) yt += yObs[indices[i4]];
                                else yc += yObs[indices[i4]];
                            }
                            permStats.push(yt / Nt - yc / (N - Nt));
                            nPerms++;
                        }

                        VizEngine.createSlider(controls, 'True Effect:', 0, 5, trueEffect, 0.5, function(v) {
                            trueEffect = v;
                            generateData();
                        });

                        VizEngine.createButton(controls, 'Run Permutation Test', function() {
                            if (running) return;
                            generateData();
                            running = true;
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            running = false;
                            generateData();
                        });

                        function makeHistBins(data, lo, hi, nBins) {
                            var bins = [];
                            var w = (hi - lo) / nBins;
                            for (var b = 0; b < nBins; b++) bins.push(0);
                            for (var i = 0; i < data.length; i++) {
                                var idx = Math.floor((data[i] - lo) / w);
                                if (idx >= 0 && idx < nBins) bins[idx]++;
                            }
                            return {counts: bins, width: w, lo: lo};
                        }

                        viz.animate(function() {
                            if (running && nPerms < maxPerms) {
                                for (var b = 0; b < 20; b++) {
                                    if (nPerms >= maxPerms) { running = false; break; }
                                    runPermutation();
                                }
                            }

                            viz.clear();
                            var ctx = viz.ctx;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 15px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Permutation Test (' + nPerms + ' permutations)', 350, 20);

                            var dataY = 55;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Observed Data (N=' + N + ', Nt=' + Nt + ')', 350, dataY);

                            for (var i = 0; i < N; i++) {
                                var cx = 120 + i * 30;
                                var cy = dataY + 25;
                                var yVal = obsW[i] === 1 ? y1[i] : y0[i];
                                var color = obsW[i] === 1 ? viz.colors.blue : viz.colors.orange;
                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.arc(cx, cy, 8, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '8px -apple-system, sans-serif';
                                ctx.fillText(yVal.toFixed(1), cx, cy + 18);
                            }

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Observed T = ' + obsStat.toFixed(3), 350, dataY + 55);

                            if (permStats.length > 5) {
                                var allVals = permStats.concat([obsStat]);
                                var lo = Math.min.apply(null, allVals) - 0.5;
                                var hi = Math.max.apply(null, allVals) + 0.5;
                                var nBins = 40;
                                var bins = makeHistBins(permStats, lo, hi, nBins);
                                var maxCount = Math.max.apply(null, bins.counts);
                                if (maxCount === 0) maxCount = 1;

                                var histX = 50;
                                var histY = dataY + 80;
                                var histW = 600;
                                var histH = 180;

                                ctx.fillStyle = '#111133';
                                ctx.fillRect(histX, histY, histW, histH);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Permutation Distribution under H0', histX + histW / 2, histY + 15);

                                var barW2 = histW / nBins;
                                for (var b2 = 0; b2 < nBins; b2++) {
                                    var barH2 = (bins.counts[b2] / maxCount) * (histH - 40);
                                    var bLo = lo + b2 * bins.width;
                                    var bHi = bLo + bins.width;
                                    var isExtreme = (Math.abs(bLo + bins.width / 2) >= Math.abs(obsStat) - bins.width / 2);
                                    ctx.fillStyle = isExtreme ? viz.colors.red + '88' : viz.colors.purple + '66';
                                    ctx.fillRect(histX + b2 * barW2, histY + histH - 20 - barH2, barW2 - 1, barH2);
                                }

                                var obsX = histX + ((obsStat - lo) / (hi - lo)) * histW;
                                ctx.strokeStyle = viz.colors.yellow;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.moveTo(obsX, histY + 20);
                                ctx.lineTo(obsX, histY + histH - 20);
                                ctx.stroke();

                                ctx.fillStyle = viz.colors.yellow;
                                ctx.font = 'bold 11px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('T_obs', obsX, histY + histH - 5);

                                var nExtreme = 0;
                                for (var k = 0; k < permStats.length; k++) {
                                    if (Math.abs(permStats[k]) >= Math.abs(obsStat)) nExtreme++;
                                }
                                var pval = nExtreme / permStats.length;

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Two-sided p-value: ' + pval.toFixed(4) + '  (' + nExtreme + '/' + permStats.length + ' as extreme)', 350, histY + histH + 20);

                                var sigColor = pval < 0.05 ? viz.colors.green : viz.colors.red;
                                ctx.fillStyle = sigColor;
                                ctx.font = '13px -apple-system, sans-serif';
                                ctx.fillText(pval < 0.05 ? 'Reject H0 at 5% level' : 'Fail to reject H0 at 5% level', 350, histY + histH + 40);
                            }

                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(50, 440, 6, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Treated', 60, 443);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(120, 440, 6, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Control', 130, 443);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why can\'t we use Fisher\'s exact test to construct a confidence interval for the ATE?',
                    hint: 'Think about what the sharp null specifies vs. what a CI requires.',
                    solution: `<p>Fisher's exact test tests the <strong>sharp null</strong> that \\(Y_i(1) = Y_i(0)\\) for <em>every</em> unit. It gives a p-value for this specific hypothesis but does not estimate the magnitude of the treatment effect. To construct a CI, one could invert a family of sharp null tests (e.g., test \\(H_0: Y_i(1) - Y_i(0) = \\tau_0\\) for each \\(\\tau_0\\)) and take all values not rejected, yielding a "Fisherian CI." However, this requires the assumption of constant treatment effects. The Neyman approach directly provides CIs without this assumption.</p>`
                },
                {
                    question: 'In the Lin (2013) regression, why do we include interaction terms \\(W_i \\cdot \\tilde{\\mathbf{X}}_i\\) rather than just main effects \\(\\tilde{\\mathbf{X}}_i\\)?',
                    hint: 'Consider what happens if the relationship between covariates and outcomes differs between treated and control groups.',
                    solution: `<p>Without interactions, the regression imposes the constraint that covariates have the same relationship with outcomes in both treatment and control groups. If this is wrong (i.e., \\(E[Y(1)|X] - E[Y(0)|X]\\) varies with \\(X\\)), the treatment effect estimate can be biased even in randomized experiments (Freedman 2008). The interaction terms allow different slopes for treated and control groups, making \\(\\hat{\\tau}\\) consistent regardless of the true functional form. This is Lin's key insight: with interactions and demeaned covariates, the regression estimator is (a) consistent, (b) at least as precise as the unadjusted estimator, and (c) robust to model misspecification.</p>`
                },
                {
                    question: 'You run 2000 permutations and find that 45 have test statistics as extreme as the observed one. What is the approximate p-value? Is the result significant at the 1% level?',
                    hint: 'The p-value is the fraction of permutations at least as extreme as the observed statistic.',
                    solution: `<p>The approximate p-value is:</p>
\\[ p \\approx \\frac{45}{2000} = 0.0225 \\]
<p>This is significant at the 5% level (\\(p < 0.05\\)) but NOT at the 1% level (\\(p > 0.01\\)).</p>
<p>Note: with only 2000 permutations, the precision of the p-value estimate is limited. The Monte Carlo standard error of the p-value is approximately \\(\\sqrt{p(1-p)/B} = \\sqrt{0.0225 \\times 0.9775/2000} \\approx 0.0033\\). For precise p-values near significance thresholds, more permutations are recommended.</p>`
                },
                {
                    question: 'Prove that the Neyman confidence interval has at least \\(1 - \\alpha\\) coverage asymptotically when the treatment effect is constant (\\(\\tau_i = \\tau\\) for all \\(i\\)).',
                    hint: 'When the treatment effect is constant, \\(S^2_\\tau = 0\\), so the conservative estimator is exact.',
                    solution: `<p>When \\(\\tau_i = \\tau\\) for all \\(i\\), we have \\(Y_i(1) = Y_i(0) + \\tau\\), so:</p>
\\[ S^2_\\tau = \\frac{1}{N-1} \\sum_{i=1}^N (\\tau_i - \\bar{\\tau})^2 = 0 \\]
<p>The true variance becomes:</p>
\\[ \\text{Var}(\\hat{\\tau}) = \\frac{S^2_{Y(1)}}{N_t} + \\frac{S^2_{Y(0)}}{N_c} \\]
<p>Since \\(Y_i(1) = Y_i(0) + \\tau\\), we have \\(S^2_{Y(1)} = S^2_{Y(0)}\\). The Neyman estimator \\(\\hat{V} = s_t^2/N_t + s_c^2/N_c\\) is now unbiased for the true variance (the \\(S^2_\\tau/N\\) term is zero). By the CLT:</p>
\\[ \\frac{\\hat{\\tau} - \\tau}{\\sqrt{\\hat{V}}} \\to N(0,1) \\]
<p>so the CI \\(\\hat{\\tau} \\pm z_{\\alpha/2}\\sqrt{\\hat{V}}\\) has exactly \\(1-\\alpha\\) coverage asymptotically. In general (heterogeneous effects), \\(\\hat{V}\\) overestimates the variance, so coverage is at least \\(1-\\alpha\\).</p>`
                }
            ]
        },

        // ── Section 5: Practical Challenges ──
        {
            id: 'ch05-sec05',
            title: 'Practical Challenges',
            content: `<h2>Practical Challenges in RCTs</h2>
<p>Real-world RCTs face many practical complications that can undermine the clean theoretical results. Understanding these challenges is essential for both designing and interpreting experiments.</p>

<h3>Non-Compliance</h3>
<p>Participants may not follow their assigned treatment. In a drug trial, some patients assigned to treatment may not take the drug (non-compliers), and some assigned to control may obtain it elsewhere (crossovers).</p>

<div class="env-block definition"><div class="env-title">Definition (Three Estimands under Non-Compliance)</div><div class="env-body">
<p>Let \\(Z_i\\) = assignment and \\(W_i\\) = actual treatment received.</p>
<ul>
<li><strong>ITT (Intent-to-Treat):</strong> \\(\\tau_{\\text{ITT}} = E[Y_i(Z=1) - Y_i(Z=0)]\\) — effect of being <em>assigned</em> to treatment</li>
<li><strong>Per-Protocol:</strong> Compare outcomes of those who actually complied — biased because compliance is endogenous</li>
<li><strong>CACE/LATE:</strong> \\(\\tau_{\\text{CACE}} = E[Y_i(1) - Y_i(0) \\mid \\text{Complier}_i]\\) — effect among those who would comply under both assignments</li>
</ul>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (IV/Wald Estimator for CACE)</div><div class="env-body">
<p>Under the assumptions of (1) random assignment, (2) exclusion restriction, (3) monotonicity (no defiers), and (4) nonzero compliance rate:</p>
\\[ \\hat{\\tau}_{\\text{CACE}} = \\frac{\\hat{\\tau}_{\\text{ITT}}}{\\hat{\\pi}_c} = \\frac{\\bar{Y}_{Z=1} - \\bar{Y}_{Z=0}}{\\bar{W}_{Z=1} - \\bar{W}_{Z=0}} \\]
<p>where \\(\\hat{\\pi}_c\\) is the estimated proportion of compliers.</p>
</div></div>

<h3>Attrition</h3>
<p><strong>Attrition</strong> (dropout, loss to follow-up) is problematic when it is differential — i.e., different rates or patterns of attrition in treatment vs. control groups.</p>

<div class="env-block definition"><div class="env-title">Definition (Bounds under Attrition)</div><div class="env-body">
<p>Lee (2009) proposed <strong>trimming bounds</strong>: if attrition is higher in group \\(g\\), trim the best/worst outcomes from the lower-attrition group to equalize attrition rates, yielding bounds \\([\\hat{\\tau}_{\\text{lower}}, \\hat{\\tau}_{\\text{upper}}]\\).</p>
</div></div>

<h3>Spillovers</h3>
<p>The <strong>Stable Unit Treatment Value Assumption (SUTVA)</strong> requires that one unit's treatment does not affect another's outcome. When this fails (e.g., vaccination programs, social network interventions), standard estimators are biased.</p>

<div class="env-block remark"><div class="env-title">Remark (Addressing Spillovers)</div><div class="env-body">
<p>Strategies for dealing with spillovers include:</p>
<ul>
<li><strong>Cluster randomization:</strong> Randomize at a level where spillovers are contained within clusters</li>
<li><strong>Two-stage randomization:</strong> Randomize clusters to different saturation levels, then individuals within clusters</li>
<li><strong>Explicit modeling:</strong> Use interference models (e.g., partial interference, exposure mappings) to define and estimate causal effects in the presence of spillovers</li>
</ul>
</div></div>

<h3>Hawthorne Effects & External Validity</h3>
<p>The <strong>Hawthorne effect</strong> occurs when participants change behavior simply because they know they are being observed or studied. This can inflate treatment effects relative to real-world settings.</p>

<p><strong>External validity</strong> asks: would the same treatment effect hold in a different population, setting, or time? Even a perfectly conducted RCT may have limited external validity if:</p>
<ul>
<li>The study sample is not representative of the target population</li>
<li>The experimental setting differs from real-world conditions</li>
<li>Effects are heterogeneous across subpopulations</li>
<li>General equilibrium effects emerge at scale but not in small trials</li>
</ul>

<div class="viz-placeholder" data-viz="ch05-viz-itt-cace"></div>`,
            visualizations: [
                {
                    id: 'ch05-viz-itt-cace',
                    title: 'ITT vs Per-Protocol vs CACE',
                    description: 'Compare the three estimands under non-compliance. Adjust the compliance rate and true treatment effect to see how ITT is diluted and per-protocol is biased, while CACE recovers the complier effect.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450, originX: 350, originY: 400, scale: 30});
                        var complianceRate = 0.7;
                        var trueEffect = 5;
                        var selectionBias = 2;
                        var N = 500;

                        function simulate() {
                            var compliersT = [], compliersC = [];
                            var noncomplT = [], noncomplC = [];
                            var allT = [], allC = [];
                            var tookDrugT = [], noDrugT = [];

                            for (var i = 0; i < N; i++) {
                                var isComplier = Math.random() < complianceRate;
                                var baseline = VizEngine.randomNormal(50, 10);
                                if (isComplier) baseline += selectionBias;

                                var y0 = baseline + VizEngine.randomNormal(0, 3);
                                var y1 = isComplier ? baseline + trueEffect + VizEngine.randomNormal(0, 3) : baseline + VizEngine.randomNormal(0, 3);

                                if (i < N / 2) {
                                    allT.push(isComplier ? y1 : y0);
                                    if (isComplier) { compliersT.push(y1); tookDrugT.push(y1); }
                                    else { noncomplT.push(y0); noDrugT.push(y0); }
                                } else {
                                    allC.push(y0);
                                    if (isComplier) compliersC.push(y0);
                                    else noncomplC.push(y0);
                                }
                            }

                            var itt = VizEngine.mean(allT) - VizEngine.mean(allC);

                            var perProtocol = 0;
                            if (tookDrugT.length > 0 && allC.length > 0) {
                                perProtocol = VizEngine.mean(tookDrugT) - VizEngine.mean(allC);
                            }

                            var actualCompliance = tookDrugT.length / (N / 2);
                            var cace = actualCompliance > 0 ? itt / actualCompliance : 0;

                            return {
                                itt: itt,
                                perProtocol: perProtocol,
                                cace: cace,
                                complianceActual: actualCompliance,
                                nT: allT.length,
                                nC: allC.length,
                                nCompliers: tookDrugT.length
                            };
                        }

                        var results = simulate();

                        VizEngine.createSlider(controls, 'Compliance Rate:', 0.2, 1.0, complianceRate, 0.05, function(v) {
                            complianceRate = v;
                            results = simulate();
                        });

                        VizEngine.createSlider(controls, 'True Effect:', 0, 10, trueEffect, 0.5, function(v) {
                            trueEffect = v;
                            results = simulate();
                        });

                        VizEngine.createSlider(controls, 'Selection Bias:', 0, 5, selectionBias, 0.5, function(v) {
                            selectionBias = v;
                            results = simulate();
                        });

                        VizEngine.createButton(controls, 'Re-simulate', function() {
                            results = simulate();
                        });

                        viz.animate(function() {
                            viz.clear();
                            var ctx = viz.ctx;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 15px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Non-Compliance: ITT vs Per-Protocol vs CACE', 350, 25);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.fillText('True CACE = ' + trueEffect.toFixed(1) + '    Compliance = ' + (complianceRate * 100).toFixed(0) + '%    Selection Bias = ' + selectionBias.toFixed(1), 350, 50);

                            var barNames = ['ITT', 'Per-Protocol', 'CACE (IV)'];
                            var barValues = [results.itt, results.perProtocol, results.cace];
                            var barColors = [viz.colors.blue, viz.colors.red, viz.colors.green];
                            var barX = 120;
                            var barW = 140;
                            var barGap = 30;
                            var baseY = 280;
                            var maxH = 160;
                            var maxVal = Math.max(trueEffect + selectionBias + 5, 12);

                            for (var i = 0; i < 3; i++) {
                                var x = barX + i * (barW + barGap);
                                var val = barValues[i];
                                var h = Math.abs(val) / maxVal * maxH;
                                var y = val >= 0 ? baseY - h : baseY;

                                ctx.fillStyle = barColors[i] + '88';
                                ctx.fillRect(x, y, barW, h);
                                ctx.strokeStyle = barColors[i];
                                ctx.lineWidth = 2;
                                ctx.strokeRect(x, y, barW, h);

                                ctx.fillStyle = barColors[i];
                                ctx.font = 'bold 13px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(barNames[i], x + barW / 2, baseY + 25);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system, sans-serif';
                                ctx.fillText(val.toFixed(2), x + barW / 2, y - 8);
                            }

                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(barX - 20, baseY);
                            ctx.lineTo(barX + 3 * (barW + barGap), baseY);
                            ctx.stroke();

                            var trueY = baseY - (trueEffect / maxVal * maxH);
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(barX - 20, trueY);
                            ctx.lineTo(barX + 3 * (barW + barGap), trueY);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('True CACE = ' + trueEffect.toFixed(1), barX - 25, trueY + 4);

                            var explanations = [
                                'Diluted by non-compliers',
                                'Biased by selection',
                                'Recovers complier effect'
                            ];
                            var expColors = [viz.colors.text, viz.colors.text, viz.colors.text];

                            for (var j = 0; j < 3; j++) {
                                var ex = barX + j * (barW + barGap);
                                ctx.fillStyle = expColors[j];
                                ctx.font = '10px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(explanations[j], ex + barW / 2, baseY + 42);
                            }

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            var infoY = 340;
                            ctx.fillText('ITT = E[Y|Z=1] - E[Y|Z=0] (unbiased for assignment effect)', 60, infoY);
                            ctx.fillText('Per-Protocol compares compliers in treatment to everyone in control (biased!)', 60, infoY + 18);
                            ctx.fillText('CACE = ITT / compliance rate (Wald/IV estimator, unbiased for complier effect)', 60, infoY + 36);
                            ctx.fillText('Note: Higher selection bias makes Per-Protocol more upward biased', 60, infoY + 58);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In a job training RCT, 60% of those assigned to treatment actually attend the training, and no one in the control group attends. The ITT estimate is 1500 dollars in annual earnings. What is the CACE?',
                    hint: 'Use the Wald estimator: CACE = ITT / compliance rate.',
                    solution: `<p>The compliance rate is \\(\\hat{\\pi}_c = 0.60 - 0 = 0.60\\) (fraction who take treatment when assigned to treatment minus fraction who take treatment when assigned to control).</p>
\\[ \\hat{\\tau}_{\\text{CACE}} = \\frac{\\hat{\\tau}_{\\text{ITT}}}{\\hat{\\pi}_c} = \\frac{1500}{0.60} = 2500 \\text{ dollars} \\]
<p>For those who would actually attend training when offered, the estimated effect is $2,500 per year. The ITT understates this because it averages over the 40% who were assigned to training but never attended.</p>`
                },
                {
                    question: 'Explain why per-protocol analysis (comparing only those who actually took the treatment to the control group) can be biased even in a randomized trial.',
                    hint: 'Think about who chooses to comply with treatment assignment.',
                    solution: `<p>Per-protocol analysis conditions on a <strong>post-treatment variable</strong> (actual treatment received), which destroys the randomization guarantee. Compliance is endogenous: people who comply with their treatment assignment may differ systematically from those who do not.</p>
<p>For example, in a drug trial, non-compliers in the treatment group may be sicker (too sick to tolerate the drug) or healthier (don't feel they need it). Dropping them creates a non-random subsample that is no longer comparable to the full control group. The resulting estimate confounds the treatment effect with selection into compliance.</p>
<p>This is why ITT analysis preserves the randomization guarantee (at the cost of estimating the effect of assignment rather than treatment), and CACE uses the IV framework to properly handle non-compliance.</p>`
                },
                {
                    question: 'A vaccination trial finds a large positive effect. A critic argues the result might be due to the Hawthorne effect. Describe how you could design a trial to address this concern.',
                    hint: 'Consider using a placebo or active control.',
                    solution: `<p>To address the Hawthorne effect, use a <strong>placebo-controlled double-blind design</strong>:</p>
<ul>
<li><strong>Placebo group:</strong> The control group receives an inert injection (saline) that is indistinguishable from the vaccine. Both groups believe they might be receiving the real treatment.</li>
<li><strong>Double-blinding:</strong> Neither the participants nor the outcome assessors know who received the vaccine vs. placebo. This ensures that any Hawthorne effect (behavior change from being studied) affects both groups equally.</li>
<li><strong>Active control:</strong> In some cases, giving the control group a different vaccine (for an unrelated disease) ensures that any effect of "receiving a shot" is held constant.</li>
</ul>
<p>With proper blinding, the Hawthorne effect is equalized across groups and cancels out in the comparison, isolating the biological effect of the vaccine.</p>`
                },
                {
                    question: 'In a trial with 1000 subjects, 50 drop out from the treatment group and 20 from the control group. Describe how to construct Lee (2009) trimming bounds for the ATE.',
                    hint: 'The key idea is to equalize attrition rates by trimming outcomes from the group with lower attrition.',
                    solution: `<p>Lee bounds address differential attrition by making the analysis comparable:</p>
<p><strong>Step 1:</strong> Identify the group with lower attrition. Here, control has lower attrition (20/500 = 4% vs 50/500 = 10%).</p>
<p><strong>Step 2:</strong> Compute the excess attrition in treatment: \\(50/500 - 20/500 = 0.06\\), or 30 additional units.</p>
<p><strong>Step 3:</strong> In the control group (480 observed), trim 30 units (6% of 480 \\(\\approx\\) 29 units) to equalize effective attrition rates.</p>
<p><strong>Step 4:</strong> For the <strong>upper bound</strong>, trim the 29 lowest-outcome control units (making the control mean lower, maximizing the treatment-control difference).</p>
<p><strong>Step 5:</strong> For the <strong>lower bound</strong>, trim the 29 highest-outcome control units (making the control mean higher, minimizing the difference).</p>
<p>The resulting interval \\([\\hat{\\tau}_{\\text{lower}}, \\hat{\\tau}_{\\text{upper}}]\\) bounds the true ATE under the assumption that attrition is caused only by treatment assignment (monotonicity of sample selection).</p>`
                }
            ]
        }
    ]
});
