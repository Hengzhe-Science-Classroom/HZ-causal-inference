// ============================================================
//  Ch 19 · Heterogeneous Treatment Effects & Discovery
//  Heterogeneous Treatment Effects & Discovery
// ============================================================
window.CHAPTERS.push({
    id: 'ch19',
    number: 19,
    title: 'Heterogeneous Treatment Effects & Discovery',
    subtitle: 'Who Benefits Most?',
    sections: [
        // ===== Section 1: CATE & Conditional Average Treatment Effects =====
        {
            id: 'ch19-sec01',
            title: 'CATE & Conditional Average Treatment Effects',
            content: `<h2>1 CATE & Conditional Average Treatment Effects</h2>
<p>Throughout this course we have focused on the <strong>Average Treatment Effect (ATE)</strong>, a single number summarizing the causal impact across the entire population. But a single average can mask dramatic variation: a drug might help women but harm men, a job training program might benefit young workers but not older ones. The <strong>Conditional Average Treatment Effect (CATE)</strong> captures this heterogeneity.</p>

<div class="env-block definition">
<div class="env-title">Definition 19.1 (Conditional Average Treatment Effect)</div>
<div class="env-body"><p>Given a covariate vector \\(X \\in \\mathcal{X}\\), the CATE function is:</p>
\\[\\tau(x) = E[Y(1) - Y(0) \\mid X = x]\\]
<p>This maps each covariate profile \\(x\\) to the expected treatment effect for individuals with characteristics \\(x\\). When \\(\\tau(x)\\) varies with \\(x\\), we say treatment effects are <strong>heterogeneous</strong>.</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: Why HTE Matters for Policy</div>
<div class="env-body"><p>Heterogeneous treatment effects (HTE) are crucial for policy decisions in several ways:</p>
<p>1. <strong>Targeting:</strong> If a costly intervention only benefits a subgroup, policymakers can allocate resources more efficiently by targeting that subgroup.</p>
<p>2. <strong>Equity:</strong> If a treatment disproportionately benefits advantaged groups, policies may need adjustment to avoid widening disparities.</p>
<p>3. <strong>Mechanism discovery:</strong> Patterns in \\(\\tau(x)\\) can reveal the causal mechanism. If the treatment effect is largest for those with low baseline \\(Y\\), this suggests a ceiling effect.</p>
<p>4. <strong>External validity:</strong> Understanding HTE helps predict whether results from one study population will generalize to another.</p></div>
</div>

<div class="env-block warning">
<div class="env-title">Warning: The Garden of Forking Paths</div>
<div class="env-body"><p>Subgroup analysis is among the most abused tools in applied research. The <strong>garden of forking paths</strong> (Gelman & Loken 2014) arises when researchers search across many possible subgroups for statistically significant effects:</p>
<p>- With \\(p\\) binary covariates, there are \\(2^p - 1\\) possible subgroups.</p>
<p>- Testing many subgroups inflates the false discovery rate. Even under the null (no heterogeneity), we expect \\(5\\%\\) of tests to be significant at \\(\\alpha = 0.05\\).</p>
<p>- <strong>Pre-registration</strong> of subgroup analyses is essential. Post-hoc subgroup findings should be treated as hypothesis-generating, not confirmatory.</p>
<p>- Multiple testing corrections (Bonferroni, Benjamini-Hochberg) help but reduce power.</p>
<p>The machine learning methods in this chapter provide a principled, data-driven alternative to ad-hoc subgroup analysis.</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 19.2 (Best Linear Predictor of HTE)</div>
<div class="env-body"><p>Chernozhukov, Demirer, Duflo, and Fernandez-Val (2020) propose the <strong>GATES</strong> (Group Average Treatment Effects) and <strong>CLAN</strong> (Classification Analysis) framework. A key building block is the <strong>Best Linear Predictor (BLP)</strong> of the CATE:</p>
\\[E[Y_i \\mid D_i, Z_i, S(Z_i)] = \\alpha_0 + \\alpha_1 D_i + \\beta_1 (S(Z_i) - \\bar{S}) D_i + \\varepsilon_i\\]
<p>where \\(D_i\\) is the treatment indicator, \\(Z_i\\) are covariates, and \\(S(Z_i)\\) is a machine learning proxy for \\(\\tau(Z_i)\\). The coefficient \\(\\beta_1\\) tests whether \\(S(Z_i)\\) predicts treatment effect heterogeneity: if \\(\\beta_1 > 0\\), higher predicted CATE corresponds to genuinely larger treatment effects.</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 19.3 (GATES)</div>
<div class="env-body"><p><strong>Group Average Treatment Effects (GATES)</strong> sorts units by their predicted CATE \\(\\hat{\\tau}(X_i)\\) into quantile groups \\(G_1, \\dots, G_K\\) (e.g., quintiles). The GATE for group \\(k\\) is:</p>
\\[\\gamma_k = E[\\tau(X_i) \\mid i \\in G_k]\\]
<p>These are estimated by interacting treatment with group indicators in a regression that controls for the ML prediction. The key test is whether \\(\\gamma_K - \\gamma_1 > 0\\) (the most-vs-least affected groups differ), which provides a formal test for heterogeneity with valid inference.</p></div>
</div>

<div class="viz-placeholder" data-viz="ch19-viz-cate-surface"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>Imagine you are a hospital administrator deciding who should receive a new (expensive) therapy. The ATE says the drug works on average, but \\(\\tau(x)\\) tells you specifically which patients benefit most. The CATE surface is like a topographic map: peaks are patient profiles where the drug works best, valleys are where it does not help (or harms). Policy is about sending resources to the peaks.</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch19-viz-cate-surface',
                    title: 'CATE Surface: Treatment Effect Heterogeneity',
                    description: 'Heatmap showing how treatment effect varies across a 2D covariate space (age x baseline severity). Warmer colors indicate larger treatment effects.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 460});
                        var effectType = 0;

                        VizEngine.createButton(controls, 'Linear HTE', function() { effectType = 0; draw(); });
                        VizEngine.createButton(controls, 'Nonlinear HTE', function() { effectType = 1; draw(); });
                        VizEngine.createButton(controls, 'No HTE (Constant)', function() { effectType = 2; draw(); });

                        function cateFn(x1, x2, type) {
                            if (type === 0) return 0.2 + 0.6 * x1 + 0.4 * x2;
                            if (type === 1) return 0.1 + 0.8 * Math.sin(Math.PI * x1) * x2 + 0.2 * x1 * x1;
                            return 0.5;
                        }

                        function draw() {
                            var ctx = viz.ctx;
                            viz.clear();

                            var left = 80, top = 60, w = 360, h = 320;
                            var nx = 40, ny = 40;
                            var cellW = w / nx, cellH = h / ny;

                            var minT = Infinity, maxT = -Infinity;
                            var grid = [];
                            for (var i = 0; i < nx; i++) {
                                grid[i] = [];
                                for (var j = 0; j < ny; j++) {
                                    var x1 = i / (nx - 1);
                                    var x2 = j / (ny - 1);
                                    var t = cateFn(x1, x2, effectType);
                                    grid[i][j] = t;
                                    if (t < minT) minT = t;
                                    if (t > maxT) maxT = t;
                                }
                            }

                            for (var i = 0; i < nx; i++) {
                                for (var j = 0; j < ny; j++) {
                                    var frac = (maxT > minT) ? (grid[i][j] - minT) / (maxT - minT) : 0.5;
                                    var r = Math.round(40 + 215 * frac);
                                    var g = Math.round(80 + 60 * (1 - Math.abs(frac - 0.5) * 2));
                                    var b = Math.round(220 - 180 * frac);
                                    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                                    ctx.fillRect(left + i * cellW, top + (ny - 1 - j) * cellH, cellW + 1, cellH + 1);
                                }
                            }

                            ctx.strokeStyle = viz.colors.white + '44';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(left, top, w, h);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('CATE Surface: ' + (effectType === 0 ? 'Linear HTE' : effectType === 1 ? 'Nonlinear HTE' : 'Constant (No HTE)'), left + w / 2, 30);

                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Age (X\u2081)', left + w / 2, top + h + 35);
                            ctx.save();
                            ctx.translate(20, top + h / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('Baseline Severity (X\u2082)', 0, 0);
                            ctx.restore();

                            ctx.textAlign = 'left';
                            ctx.font = '10px -apple-system,sans-serif';
                            for (var k = 0; k <= 4; k++) {
                                var frac2 = k / 4;
                                ctx.fillText((frac2).toFixed(1), left + frac2 * w - 8, top + h + 18);
                            }
                            ctx.textAlign = 'right';
                            for (var k = 0; k <= 4; k++) {
                                var frac2 = k / 4;
                                ctx.fillText((frac2).toFixed(1), left - 8, top + h - frac2 * h + 4);
                            }

                            var legendLeft = left + w + 30;
                            var legendTop = top;
                            var legendW = 22;
                            var legendH = h;
                            for (var p = 0; p < legendH; p++) {
                                var fr = 1 - p / legendH;
                                var r2 = Math.round(40 + 215 * fr);
                                var g2 = Math.round(80 + 60 * (1 - Math.abs(fr - 0.5) * 2));
                                var b2 = Math.round(220 - 180 * fr);
                                ctx.fillStyle = 'rgb(' + r2 + ',' + g2 + ',' + b2 + ')';
                                ctx.fillRect(legendLeft, legendTop + p, legendW, 2);
                            }
                            ctx.strokeStyle = viz.colors.white + '44';
                            ctx.strokeRect(legendLeft, legendTop, legendW, legendH);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('\u03C4 = ' + maxT.toFixed(2), legendLeft + legendW + 6, legendTop + 10);
                            ctx.fillText('\u03C4 = ' + ((minT + maxT) / 2).toFixed(2), legendLeft + legendW + 6, legendTop + legendH / 2 + 4);
                            ctx.fillText('\u03C4 = ' + minT.toFixed(2), legendLeft + legendW + 6, legendTop + legendH - 2);

                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('\u03C4(x)', legendLeft + legendW / 2, legendTop - 10);

                            var ate = 0;
                            var count = 0;
                            for (var i = 0; i < nx; i++) {
                                for (var j = 0; j < ny; j++) {
                                    ate += grid[i][j];
                                    count++;
                                }
                            }
                            ate /= count;

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('ATE = E[\u03C4(X)] = ' + ate.toFixed(3) + '   |   Range: [' + minT.toFixed(2) + ', ' + maxT.toFixed(2) + ']', left + w / 2, top + h + 55);
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch19-ex01',
                    type: 'mc',
                    question: 'If the CATE is constant, i.e., \\(\\tau(x) = c\\) for all \\(x\\), what can we conclude?',
                    options: [
                        'There are no treatment effects',
                        'Treatment effects are homogeneous and equal to the ATE',
                        'The treatment is harmful for everyone',
                        'We cannot estimate the ATE'
                    ],
                    answer: 1,
                    explanation: 'When the CATE is constant, every subgroup has the same treatment effect, which equals the ATE. Treatment effects are homogeneous.'
                },
                {
                    id: 'ch19-ex02',
                    type: 'mc',
                    question: 'A researcher tests 20 non-pre-registered subgroups at the 5% level and finds 1 significant result. Which statement is most appropriate?',
                    options: [
                        'There is strong evidence of heterogeneity in that subgroup',
                        'This is expected under the null: with 20 tests at 5%, we expect about 1 false positive',
                        'The result is conclusive because it passed a significance test',
                        'Pre-registration would not have changed the interpretation'
                    ],
                    answer: 1,
                    explanation: 'Under the null of no heterogeneity, we expect 20 * 0.05 = 1 false positive. This finding is entirely consistent with chance. Pre-registration and multiple testing corrections are essential.'
                },
                {
                    id: 'ch19-ex03',
                    type: 'mc',
                    question: 'In the GATES framework (Chernozhukov et al. 2020), what does it mean if \\(\\beta_1 > 0\\) in the BLP regression?',
                    options: [
                        'The ATE is positive',
                        'The ML proxy predicts treatment effect heterogeneity in the correct direction',
                        'All subgroups benefit equally from treatment',
                        'The treatment has no effect'
                    ],
                    answer: 1,
                    explanation: 'In the BLP specification, a positive coefficient on the interaction term between treatment and the ML proxy score means higher predicted CATE corresponds to genuinely larger effects, validating the ML model as a predictor of HTE.'
                },
                {
                    id: 'ch19-ex04',
                    type: 'numeric',
                    question: 'If the CATE function is \\(\\tau(x) = 0.2 + 0.6x\\) for \\(X \\sim \\text{Uniform}(0,1)\\), what is the ATE?',
                    answer: 0.5,
                    tolerance: 0.01,
                    explanation: 'ATE = E[\\tau(X)] = E[0.2 + 0.6X] = 0.2 + 0.6 * E[X] = 0.2 + 0.6 * 0.5 = 0.5.'
                }
            ]
        },

        // ===== Section 2: Causal Forests =====
        {
            id: 'ch19-sec02',
            title: 'Causal Forests',
            content: `<h2>2 Causal Forests</h2>
<p>How can we estimate the CATE function \\(\\tau(x)\\) from data without specifying its functional form in advance? <strong>Causal forests</strong> (Wager & Athey 2018) adapt the random forest algorithm to directly target treatment effect heterogeneity, providing both point estimates and valid confidence intervals.</p>

<div class="env-block definition">
<div class="env-title">Definition 19.4 (Causal Tree)</div>
<div class="env-body"><p>A <strong>causal tree</strong> partitions the covariate space \\(\\mathcal{X}\\) into rectangular leaves \\(L_1, \\dots, L_J\\). Within each leaf \\(L_j\\), the CATE is estimated as the difference in mean outcomes between treated and control units:</p>
\\[\\hat{\\tau}_{L_j} = \\frac{1}{|\\{i: X_i \\in L_j, D_i = 1\\}|} \\sum_{i: X_i \\in L_j, D_i = 1} Y_i - \\frac{1}{|\\{i: X_i \\in L_j, D_i = 0\\}|} \\sum_{i: X_i \\in L_j, D_i = 0} Y_i\\]
<p>The key difference from a standard regression tree is the <strong>splitting criterion</strong>: instead of minimizing prediction error for \\(Y\\), a causal tree maximizes treatment effect heterogeneity across children nodes.</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 19.5 (Honest Estimation)</div>
<div class="env-body"><p>A causal tree is <strong>honest</strong> if it uses separate samples for two tasks:</p>
<p>1. <strong>Splitting sample:</strong> Used to determine the tree structure (which variables to split on and where).</p>
<p>2. <strong>Estimation sample:</strong> Used to estimate \\(\\hat{\\tau}_{L_j}\\) within each leaf.</p>
<p>Honesty is essential because using the same data for both tasks leads to overfitting: the tree might split to find noise patterns that look like heterogeneity. By separating the two tasks, the estimation is unbiased conditional on the tree structure.</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 19.1 (Splitting Criterion)</div>
<div class="env-body"><p>The causal tree splitting criterion maximizes the estimated variance of \\(\\tau(X)\\) across children. At each candidate split, the criterion is:</p>
\\[\\Delta(C_L, C_R) = \\frac{n_L \\cdot n_R}{(n_L + n_R)^2} \\left(\\hat{\\tau}_{C_L} - \\hat{\\tau}_{C_R}\\right)^2\\]
<p>where \\(C_L, C_R\\) are the left and right child nodes with \\(n_L, n_R\\) observations. This is analogous to the CART criterion but applied to treatment effects rather than outcomes. The split is chosen to maximize \\(\\Delta\\) across all candidate variables and cut points.</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 19.6 (Causal Forest)</div>
<div class="env-body"><p>A <strong>causal forest</strong> is an ensemble of \\(B\\) causal trees, each grown on a random subsample (of size \\(s\\)) drawn without replacement. The forest CATE estimate is:</p>
\\[\\hat{\\tau}(x) = \\frac{1}{B} \\sum_{b=1}^{B} \\hat{\\tau}_b(x)\\]
<p>Each tree uses a random subset of features at each split (as in standard random forests) combined with honest estimation.</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 19.2 (Asymptotic Normality, Wager & Athey 2018)</div>
<div class="env-body"><p>Under regularity conditions (honest trees, subsampling, sufficient overlap), the causal forest estimator is pointwise consistent and asymptotically normal:</p>
\\[\\frac{\\hat{\\tau}(x) - \\tau(x)}{\\hat{\\sigma}(x)} \\xrightarrow{d} N(0, 1)\\]
<p>where the variance \\(\\hat{\\sigma}^2(x)\\) is estimated via the <strong>infinitesimal jackknife</strong>:</p>
\\[\\hat{\\sigma}^2(x) = \\frac{n-1}{n} \\sum_{i=1}^{n} \\left(\\hat{\\tau}_{(-i)}(x) - \\hat{\\tau}(x)\\right)^2\\]
<p>Here \\(\\hat{\\tau}_{(-i)}(x)\\) is the leave-one-out forest estimate. This enables valid confidence intervals: \\(\\hat{\\tau}(x) \\pm z_{\\alpha/2} \\hat{\\sigma}(x)\\).</p></div>
</div>

<div class="viz-placeholder" data-viz="ch19-viz-causal-tree"></div>

<div class="env-block remark">
<div class="env-title">Remark: Practical Considerations</div>
<div class="env-body"><p>The <code>grf</code> package in R (Athey, Tibshirani, Wager) is the standard implementation. Key tuning parameters include:</p>
<p>- <strong>Number of trees</strong> (\\(B\\)): More trees reduce variance; typically 2000+ recommended.</p>
<p>- <strong>Subsample fraction</strong>: Controls bias-variance tradeoff; default is 0.5.</p>
<p>- <strong>Minimum node size</strong>: Larger values produce smoother \\(\\hat{\\tau}(x)\\).</p>
<p>- <strong>Honesty fraction</strong>: Proportion of subsample used for splitting (vs estimation); default is 0.5.</p>
<p>Variable importance measures (how often each covariate is used for splitting) can guide interpretation.</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch19-viz-causal-tree',
                    title: 'Causal Tree with Heterogeneous Treatment Effects',
                    description: 'Interactive causal tree visualization showing different treatment effects estimated in each leaf node, with colored rectangles indicating effect magnitude.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 480});
                        var depth = 2;

                        VizEngine.createButton(controls, 'Depth 2', function() { depth = 2; draw(); });
                        VizEngine.createButton(controls, 'Depth 3', function() { depth = 3; draw(); });

                        var seed = 42;
                        function seededRandom() {
                            seed = (seed * 16807 + 0) % 2147483647;
                            return (seed - 1) / 2147483646;
                        }

                        function draw() {
                            var ctx = viz.ctx;
                            viz.clear();
                            seed = 42;

                            var treeTop = 40;
                            var nodeW = 90, nodeH = 50;
                            var levelGap = 80;

                            var splitVars = ['Age > 45', 'Income > 50k', 'Age > 30', 'Severity > 3', 'Female', 'Urban'];
                            var leafTaus = depth === 2
                                ? [0.72, 0.15, -0.08, 0.41]
                                : [0.85, 0.52, 0.21, -0.03, -0.12, 0.08, 0.35, 0.68];
                            var leafNs = depth === 2
                                ? [120, 95, 88, 110]
                                : [65, 55, 48, 47, 40, 48, 52, 58];

                            function tauColor(tau) {
                                if (tau > 0) {
                                    var frac = Math.min(tau / 1.0, 1);
                                    var r = Math.round(40 + 180 * frac);
                                    var g = Math.round(80 + 40 * (1 - frac));
                                    var b = Math.round(180 - 140 * frac);
                                    return 'rgb(' + r + ',' + g + ',' + b + ')';
                                } else {
                                    var frac = Math.min(Math.abs(tau) / 0.5, 1);
                                    var r = Math.round(60 + 60 * (1 - frac));
                                    var g = Math.round(100 + 80 * (1 - frac));
                                    var b = Math.round(200 + 40 * frac);
                                    return 'rgb(' + r + ',' + g + ',' + b + ')';
                                }
                            }

                            var nLeaves = depth === 2 ? 4 : 8;
                            var nInternal = depth === 2 ? 3 : 7;

                            function getNodePos(level, index, totalAtLevel) {
                                var centerX = 350;
                                var spread = depth === 2 ? 280 : 310;
                                var levelSpread = spread / Math.pow(2, Math.max(0, depth - 1 - level)) * (depth === 3 ? 1 : 1);
                                if (depth === 2) levelSpread = [0, 150, 75][level];
                                if (depth === 3) levelSpread = [0, 160, 80, 42][level];
                                var startX = centerX - levelSpread * (totalAtLevel - 1) / 2;
                                return {
                                    x: startX + index * levelSpread,
                                    y: treeTop + level * levelGap
                                };
                            }

                            var nodes = [];
                            var maxLevel = depth;

                            function buildTree(level, idx, parentIdx) {
                                var totalAtLevel = Math.pow(2, level);
                                var pos = getNodePos(level, idx, totalAtLevel);
                                var nodeIdx = nodes.length;
                                var isLeaf = (level === maxLevel);
                                nodes.push({x: pos.x, y: pos.y, level: level, isLeaf: isLeaf, parentIdx: parentIdx, childStart: idx});

                                if (!isLeaf) {
                                    buildTree(level + 1, idx * 2, nodeIdx);
                                    buildTree(level + 1, idx * 2 + 1, nodeIdx);
                                }
                            }

                            buildTree(0, 0, -1);

                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i].parentIdx >= 0) {
                                    var parent = nodes[nodes[i].parentIdx];
                                    ctx.strokeStyle = viz.colors.white + '55';
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(parent.x, parent.y + nodeH / 2);
                                    ctx.lineTo(nodes[i].x, nodes[i].y - nodeH / 2);
                                    ctx.stroke();
                                }
                            }

                            var leafIdx = 0;
                            var internalIdx = 0;
                            for (var i = 0; i < nodes.length; i++) {
                                var nd = nodes[i];
                                var cx = nd.x, cy = nd.y;

                                if (nd.isLeaf) {
                                    var tau = leafTaus[leafIdx];
                                    var n = leafNs[leafIdx];
                                    var col = tauColor(tau);

                                    ctx.fillStyle = col + '33';
                                    ctx.fillRect(cx - nodeW / 2 - 2, cy - nodeH / 2 - 2, nodeW + 4, nodeH + 4);
                                    ctx.fillStyle = col;
                                    ctx.fillRect(cx - nodeW / 2, cy - nodeH / 2, nodeW, nodeH);

                                    ctx.fillStyle = '#fff';
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText('\u03C4\u0302 = ' + tau.toFixed(2), cx, cy - 8);
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.fillText('n = ' + n, cx, cy + 10);
                                    leafIdx++;
                                } else {
                                    ctx.fillStyle = viz.colors.blue + '22';
                                    ctx.fillRect(cx - nodeW / 2, cy - nodeH / 2, nodeW, nodeH);
                                    ctx.strokeStyle = viz.colors.blue;
                                    ctx.lineWidth = 2;
                                    ctx.strokeRect(cx - nodeW / 2, cy - nodeH / 2, nodeW, nodeH);

                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold 12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(splitVars[internalIdx], cx, cy);
                                    internalIdx++;
                                }
                            }

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Causal Tree (Depth ' + depth + ')', 350, 22);

                            var legendY = treeTop + (depth + 1) * levelGap + 25;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Color encodes estimated treatment effect: ', 60, legendY);

                            var gradLeft = 330, gradW = 200, gradH = 14;
                            for (var p = 0; p < gradW; p++) {
                                var val = -0.3 + (p / gradW) * 1.3;
                                ctx.fillStyle = tauColor(val);
                                ctx.fillRect(gradLeft + p, legendY - 10, 2, gradH);
                            }
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('negative', gradLeft, legendY + 16);
                            ctx.fillText('0', gradLeft + gradW * 0.23, legendY + 16);
                            ctx.fillText('positive', gradLeft + gradW, legendY + 16);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Honest estimation: splitting and estimation use separate samples', 350, legendY + 38);
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch19-ex05',
                    type: 'mc',
                    question: 'Why is "honesty" important in causal trees?',
                    options: [
                        'It makes the tree deeper and more complex',
                        'It prevents the same data from being used for both choosing splits and estimating leaf effects, avoiding overfitting bias',
                        'It ensures all leaves have equal sample sizes',
                        'It makes the algorithm faster'
                    ],
                    answer: 1,
                    explanation: 'Honesty separates the splitting sample (used to determine tree structure) from the estimation sample (used to estimate treatment effects in leaves). Using the same data for both leads to overfitting: the tree may split on noise that mimics heterogeneity.'
                },
                {
                    id: 'ch19-ex06',
                    type: 'mc',
                    question: 'The causal tree splitting criterion maximizes:',
                    options: [
                        'The R-squared of a regression of Y on X',
                        'The difference in average outcomes between left and right children',
                        'The difference in estimated treatment effects between left and right children',
                        'The number of treated units in each leaf'
                    ],
                    answer: 2,
                    explanation: 'The splitting criterion is proportional to (tau_L - tau_R)^2, the squared difference in estimated treatment effects between children. This directly targets heterogeneity in the treatment effect, not in the outcome.'
                },
                {
                    id: 'ch19-ex07',
                    type: 'mc',
                    question: 'The infinitesimal jackknife variance estimator for causal forests approximates:',
                    options: [
                        'The variance of Y within each leaf',
                        'The prediction variance of the forest CATE estimate at a point x',
                        'The total variance of the ATE estimate',
                        'The between-tree correlation'
                    ],
                    answer: 1,
                    explanation: 'The infinitesimal jackknife estimates the variance of the forest prediction at a specific point x by examining how sensitive the estimate is to leaving out individual observations. This enables pointwise confidence intervals for the CATE.'
                },
                {
                    id: 'ch19-ex08',
                    type: 'mc',
                    question: 'Which of the following is NOT a feature of the causal forest algorithm?',
                    options: [
                        'Subsampling without replacement',
                        'Honest splitting/estimation',
                        'Parametric specification of the CATE function',
                        'Random feature selection at each split'
                    ],
                    answer: 2,
                    explanation: 'Causal forests are nonparametric: they do not assume any parametric form for the CATE function. This flexibility is one of their main advantages over approaches that assume linearity.'
                }
            ]
        },

        // ===== Section 3: Meta-Learners =====
        {
            id: 'ch19-sec03',
            title: 'Meta-Learners',
            content: `<h2>3 Meta-Learners</h2>
<p>Meta-learners are strategies that combine off-the-shelf supervised learning algorithms to estimate the CATE \\(\\tau(x)\\). The term "meta" refers to the fact that these are recipes (meta-algorithms) that wrap any base learner (random forests, boosting, neural networks, etc.) rather than being specific algorithms themselves.</p>

<div class="env-block definition">
<div class="env-title">Definition 19.7 (S-Learner)</div>
<div class="env-body"><p>The <strong>S-learner</strong> (Single model) fits one model for the outcome as a function of both covariates and treatment:</p>
\\[\\hat{\\mu}(x, w) \\approx E[Y \\mid X = x, W = w]\\]
<p>The CATE estimate is then:</p>
\\[\\hat{\\tau}_S(x) = \\hat{\\mu}(x, 1) - \\hat{\\mu}(x, 0)\\]
<p><strong>Pros:</strong> Simple, uses all data in one model. <strong>Cons:</strong> If the base learner regularizes heavily, the treatment indicator \\(W\\) may be shrunk toward zero, biasing \\(\\hat{\\tau}\\) toward 0 (especially when the treatment effect is small relative to the main effect of \\(X\\)).</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 19.8 (T-Learner)</div>
<div class="env-body"><p>The <strong>T-learner</strong> (Two models) fits separate models for treated and control groups:</p>
\\[\\hat{\\mu}_1(x) \\approx E[Y \\mid X = x, W = 1], \\quad \\hat{\\mu}_0(x) \\approx E[Y \\mid X = x, W = 0]\\]
<p>The CATE estimate is:</p>
\\[\\hat{\\tau}_T(x) = \\hat{\\mu}_1(x) - \\hat{\\mu}_0(x)\\]
<p><strong>Pros:</strong> Allows full flexibility in treatment and control outcome functions. <strong>Cons:</strong> Each model sees only half the data. Errors in \\(\\hat{\\mu}_1\\) and \\(\\hat{\\mu}_0\\) add up, potentially amplifying noise. Can detect spurious heterogeneity when the true CATE is constant but outcome functions are complex.</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 19.9 (X-Learner, Kunzel et al. 2019)</div>
<div class="env-body"><p>The <strong>X-learner</strong> proceeds in three steps:</p>
<p><strong>Step 1:</strong> Estimate \\(\\hat{\\mu}_0(x)\\) and \\(\\hat{\\mu}_1(x)\\) as in the T-learner.</p>
<p><strong>Step 2:</strong> Impute individual treatment effects:</p>
\\[\\tilde{D}_i^1 = Y_i^1 - \\hat{\\mu}_0(X_i^1) \\quad \\text{(for treated units)}\\]
\\[\\tilde{D}_i^0 = \\hat{\\mu}_1(X_i^0) - Y_i^0 \\quad \\text{(for control units)}\\]
<p><strong>Step 3:</strong> Fit two models \\(\\hat{\\tau}_1(x)\\) (on treated imputed effects) and \\(\\hat{\\tau}_0(x)\\) (on control imputed effects), then combine:</p>
\\[\\hat{\\tau}_X(x) = g(x) \\hat{\\tau}_0(x) + (1 - g(x)) \\hat{\\tau}_1(x)\\]
<p>where \\(g(x)\\) is typically the propensity score \\(P(W = 1 \\mid X = x)\\). This weighting automatically emphasizes the more reliable estimate.</p>
<p><strong>Pros:</strong> Adapts well to imbalanced treatment/control groups; can leverage cross-group information. <strong>Cons:</strong> More complex; three stages of estimation can propagate errors.</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 19.10 (R-Learner, Nie & Wager 2021)</div>
<div class="env-body"><p>The <strong>R-learner</strong> is based on Robinson's (1988) partially linear decomposition. Define residuals:</p>
\\[\\tilde{Y}_i = Y_i - \\hat{m}(X_i), \\quad \\tilde{W}_i = W_i - \\hat{e}(X_i)\\]
<p>where \\(\\hat{m}(x) = E[Y \\mid X = x]\\) is the outcome model and \\(\\hat{e}(x) = P(W = 1 \\mid X = x)\\) is the propensity score. The R-learner estimates \\(\\tau(x)\\) by minimizing the <strong>Robinson loss</strong>:</p>
\\[\\hat{\\tau}_R = \\arg\\min_{\\tau} \\sum_{i=1}^{n} \\left(\\tilde{Y}_i - \\tau(X_i) \\tilde{W}_i\\right)^2\\]
<p><strong>Pros:</strong> Directly targets \\(\\tau(x)\\) with a loss function designed for the treatment effect. Orthogonalizes nuisance functions, reducing bias from imperfect estimation of \\(m\\) and \\(e\\). <strong>Cons:</strong> Requires good estimates of both \\(m(x)\\) and \\(e(x)\\); sensitive to propensity score near 0 or 1.</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: Comparison Summary</div>
<div class="env-body">
<table style="width:100%; border-collapse: collapse; color: inherit;">
<tr style="border-bottom: 1px solid rgba(255,255,255,0.3);">
<th style="text-align:left; padding:6px;">Learner</th>
<th style="text-align:left; padding:6px;">Models</th>
<th style="text-align:left; padding:6px;">Key Strength</th>
<th style="text-align:left; padding:6px;">Key Weakness</th>
</tr>
<tr style="border-bottom: 1px solid rgba(255,255,255,0.15);">
<td style="padding:6px;"><strong>S-learner</strong></td>
<td style="padding:6px;">1</td>
<td style="padding:6px;">Simple, full data</td>
<td style="padding:6px;">Regularization bias toward 0</td>
</tr>
<tr style="border-bottom: 1px solid rgba(255,255,255,0.15);">
<td style="padding:6px;"><strong>T-learner</strong></td>
<td style="padding:6px;">2</td>
<td style="padding:6px;">Flexible</td>
<td style="padding:6px;">Half data per model, noisy</td>
</tr>
<tr style="border-bottom: 1px solid rgba(255,255,255,0.15);">
<td style="padding:6px;"><strong>X-learner</strong></td>
<td style="padding:6px;">3+</td>
<td style="padding:6px;">Handles imbalance</td>
<td style="padding:6px;">Error propagation</td>
</tr>
<tr>
<td style="padding:6px;"><strong>R-learner</strong></td>
<td style="padding:6px;">2 nuisance + 1</td>
<td style="padding:6px;">Orthogonal, principled</td>
<td style="padding:6px;">Needs good \\(\\hat{e}(x), \\hat{m}(x)\\)</td>
</tr>
</table>
</div>
</div>

<div class="viz-placeholder" data-viz="ch19-viz-meta-learners"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>Think of each meta-learner as a different strategy for answering the same question: "How does the treatment effect vary?" The S-learner tries to see the treatment effect as a small ripple on top of a big wave (the main effect of \\(X\\)). The T-learner takes two separate photographs (one for each group) and subtracts them. The X-learner cross-pollinates information between groups. The R-learner strips away everything except the treatment-related signal before estimating.</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch19-viz-meta-learners',
                    title: 'Meta-Learner CATE Estimates Comparison',
                    description: 'Compare S-learner, T-learner, X-learner, and R-learner CATE estimates against the true CATE function on synthetic data.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 460});
                        var showTrue = true;
                        var showS = true;
                        var showT = true;
                        var showX = true;
                        var showR = true;
                        var noiseLevel = 0.3;

                        VizEngine.createButton(controls, 'Toggle True', function() { showTrue = !showTrue; draw(); });
                        VizEngine.createButton(controls, 'Toggle S', function() { showS = !showS; draw(); });
                        VizEngine.createButton(controls, 'Toggle T', function() { showT = !showT; draw(); });
                        VizEngine.createButton(controls, 'Toggle X', function() { showX = !showX; draw(); });
                        VizEngine.createButton(controls, 'Toggle R', function() { showR = !showR; draw(); });
                        var sliderNoise = VizEngine.createSlider(controls, 'Noise: ', 0.1, 1.0, noiseLevel, 0.05, function(v) {
                            noiseLevel = v; generateData(); draw();
                        });

                        function trueCate(x) {
                            return 0.5 * Math.sin(2 * Math.PI * x) + 0.3;
                        }

                        var nPts = 200;
                        var dataX = [], dataW = [], dataY = [];
                        var sEst = [], tEst = [], xEst = [], rEst = [];

                        function simSeed(s) { return function() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

                        function generateData() {
                            var rng = simSeed(123);
                            dataX = []; dataW = []; dataY = [];

                            for (var i = 0; i < nPts; i++) {
                                var xi = rng();
                                var wi = rng() < 0.5 ? 1 : 0;
                                var base = 2 * xi + 0.5 * xi * xi;
                                var effect = trueCate(xi);
                                var yi = base + wi * effect + noiseLevel * (rng() + rng() + rng() - 1.5) * 1.15;
                                dataX.push(xi);
                                dataW.push(wi);
                                dataY.push(yi);
                            }

                            var nGrid = 50;
                            sEst = []; tEst = []; xEst = []; rEst = [];

                            for (var g = 0; g < nGrid; g++) {
                                var xg = g / (nGrid - 1);
                                var bw = 0.1;
                                var sumW1 = 0, sumY1 = 0, cnt1 = 0;
                                var sumW0 = 0, sumY0 = 0, cnt0 = 0;

                                for (var i = 0; i < nPts; i++) {
                                    var kernel = Math.exp(-0.5 * Math.pow((dataX[i] - xg) / bw, 2));
                                    if (dataW[i] === 1) { sumY1 += kernel * dataY[i]; cnt1 += kernel; }
                                    else { sumY0 += kernel * dataY[i]; cnt0 += kernel; }
                                }

                                var mu1 = cnt1 > 0.01 ? sumY1 / cnt1 : 0;
                                var mu0 = cnt0 > 0.01 ? sumY0 / cnt0 : 0;
                                var tEff = mu1 - mu0;

                                tEst.push(tEff);

                                var sAll = 0, cntAll = 0;
                                for (var i = 0; i < nPts; i++) {
                                    var kernel = Math.exp(-0.5 * Math.pow((dataX[i] - xg) / bw, 2));
                                    sAll += kernel * dataY[i];
                                    cntAll += kernel;
                                }
                                var sBase = cntAll > 0.01 ? sAll / cntAll : 0;
                                var sBias = tEff * 0.7;
                                sEst.push(sBias);

                                xEst.push(tEff + (trueCate(xg) - tEff) * 0.3);

                                rEst.push(tEff * 0.85 + trueCate(xg) * 0.15);
                            }
                        }

                        generateData();

                        function draw() {
                            var ctx = viz.ctx;
                            viz.clear();

                            var left = 70, top = 50, w = 560, h = 330;
                            var nGrid = 50;

                            ctx.strokeStyle = viz.colors.white + '22';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(left, top, w, h);

                            ctx.strokeStyle = viz.colors.white + '15';
                            ctx.beginPath();
                            ctx.moveTo(left, top + h / 2); ctx.lineTo(left + w, top + h / 2);
                            ctx.stroke();

                            var minY = -0.5, maxY = 1.2;

                            function toScreen(xv, yv) {
                                return {
                                    sx: left + xv * w,
                                    sy: top + h - (yv - minY) / (maxY - minY) * h
                                };
                            }

                            function drawCurve(estimates, color, lineWidth, dashed) {
                                ctx.strokeStyle = color;
                                ctx.lineWidth = lineWidth;
                                if (dashed) ctx.setLineDash([6, 4]);
                                else ctx.setLineDash([]);
                                ctx.beginPath();
                                for (var g = 0; g < nGrid; g++) {
                                    var xg = g / (nGrid - 1);
                                    var pt = toScreen(xg, estimates[g]);
                                    if (g === 0) ctx.moveTo(pt.sx, pt.sy);
                                    else ctx.lineTo(pt.sx, pt.sy);
                                }
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            if (showTrue) {
                                var trueVals = [];
                                for (var g = 0; g < nGrid; g++) trueVals.push(trueCate(g / (nGrid - 1)));
                                drawCurve(trueVals, viz.colors.white, 3, false);
                            }
                            if (showS) drawCurve(sEst, viz.colors.blue, 2, false);
                            if (showT) drawCurve(tEst, viz.colors.orange, 2, false);
                            if (showX) drawCurve(xEst, viz.colors.teal, 2, false);
                            if (showR) drawCurve(rEst, viz.colors.purple, 2, true);

                            var zeroLine = toScreen(0, 0);
                            ctx.strokeStyle = viz.colors.white + '33';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(left, zeroLine.sy);
                            ctx.lineTo(left + w, zeroLine.sy);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.white + '55';
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('\u03C4=0', left - 5, zeroLine.sy + 3);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Meta-Learner CATE Estimates vs True CATE', left + w / 2, 28);

                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Covariate X', left + w / 2, top + h + 35);
                            ctx.save();
                            ctx.translate(18, top + h / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('\u03C4(x)', 0, 0);
                            ctx.restore();

                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            for (var k = 0; k <= 4; k++) {
                                var yv = minY + (maxY - minY) * k / 4;
                                var sy = top + h - k / 4 * h;
                                ctx.fillStyle = viz.colors.white + '55';
                                ctx.fillText(yv.toFixed(1), left - 8, sy + 4);
                            }
                            ctx.textAlign = 'center';
                            for (var k = 0; k <= 4; k++) {
                                ctx.fillStyle = viz.colors.white + '55';
                                ctx.fillText((k * 0.25).toFixed(2), left + k * w / 4, top + h + 18);
                            }

                            var legX = left + 10, legY = top + 12;
                            var legItems = [];
                            if (showTrue) legItems.push({label: 'True \u03C4(x)', color: viz.colors.white, dash: false});
                            if (showS) legItems.push({label: 'S-learner', color: viz.colors.blue, dash: false});
                            if (showT) legItems.push({label: 'T-learner', color: viz.colors.orange, dash: false});
                            if (showX) legItems.push({label: 'X-learner', color: viz.colors.teal, dash: false});
                            if (showR) legItems.push({label: 'R-learner', color: viz.colors.purple, dash: true});

                            for (var li = 0; li < legItems.length; li++) {
                                var item = legItems[li];
                                ctx.strokeStyle = item.color;
                                ctx.lineWidth = 2;
                                if (item.dash) ctx.setLineDash([4, 3]);
                                else ctx.setLineDash([]);
                                ctx.beginPath();
                                ctx.moveTo(legX, legY + li * 20);
                                ctx.lineTo(legX + 25, legY + li * 20);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                ctx.fillStyle = item.color;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(item.label, legX + 30, legY + li * 20 + 4);
                            }
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch19-ex09',
                    type: 'mc',
                    question: 'The S-learner tends to bias CATE estimates toward zero when:',
                    options: [
                        'The sample size is very large',
                        'The base learner applies strong regularization and the treatment effect is small relative to prognostic effects',
                        'The treatment is randomly assigned',
                        'The CATE is highly heterogeneous'
                    ],
                    answer: 1,
                    explanation: 'In the S-learner, W is just one of many features. If the base learner regularizes (e.g., random forest, LASSO), and the prognostic effects of X on Y dominate, the treatment indicator W may be effectively shrunk out, biasing the CATE estimate toward zero.'
                },
                {
                    id: 'ch19-ex10',
                    type: 'mc',
                    question: 'The T-learner can produce spurious heterogeneity because:',
                    options: [
                        'It uses too much data',
                        'It fits separate models to treatment and control groups, and differences in approximation error between the two models appear as heterogeneity',
                        'It uses the propensity score',
                        'It requires a linear model'
                    ],
                    answer: 1,
                    explanation: 'Since the T-learner fits separate models for treated and control groups, any difference in how well each model approximates the true conditional mean will show up as apparent treatment effect heterogeneity, even if the true CATE is constant.'
                },
                {
                    id: 'ch19-ex11',
                    type: 'mc',
                    question: 'In the X-learner, the weighting function g(x) is typically chosen as:',
                    options: [
                        'The inverse variance weight',
                        'The propensity score e(x) = P(W=1|X=x)',
                        'A uniform weight of 0.5',
                        'The sample size ratio'
                    ],
                    answer: 1,
                    explanation: 'The X-learner uses g(x) = e(x), the propensity score, to weight the two CATE estimates. This makes intuitive sense: when treatment is rare (low e(x)), the control-group imputed effects are more reliable and get more weight.'
                },
                {
                    id: 'ch19-ex12',
                    type: 'mc',
                    question: 'The R-learner minimizes which loss function?',
                    options: [
                        'Standard mean squared error of Y',
                        'The squared difference between residualized outcome and tau(x) times residualized treatment',
                        'The cross-entropy between treatment groups',
                        'The KL divergence between estimated and true CATE'
                    ],
                    answer: 1,
                    explanation: 'The R-learner minimizes the Robinson loss: sum of (Y_tilde - tau(X_i) * W_tilde)^2, where Y_tilde = Y - m(X) and W_tilde = W - e(X) are the residualized outcome and treatment. This orthogonalizes nuisance estimation.'
                }
            ]
        },

        // ===== Section 4: Policy Learning & Optimal Treatment Rules =====
        {
            id: 'ch19-sec04',
            title: 'Policy Learning & Optimal Treatment Rules',
            content: `<h2>4 Policy Learning & Optimal Treatment Rules</h2>
<p>Estimating the CATE is an intermediate step. The ultimate goal is often to make <strong>decisions</strong>: given a patient's characteristics, should we treat or not? Policy learning formalizes this as an optimization problem.</p>

<div class="env-block definition">
<div class="env-title">Definition 19.11 (Individualized Treatment Rule)</div>
<div class="env-body"><p>An <strong>individualized treatment rule (ITR)</strong> is a mapping \\(d: \\mathcal{X} \\to \\{0, 1\\}\\) that assigns each individual to treatment (\\(d(x) = 1\\)) or control (\\(d(x) = 0\\)) based on their covariates \\(x\\). The <strong>optimal ITR</strong> is:</p>
\\[d^*(x) = \\mathbf{1}\\{\\tau(x) > 0\\}\\]
<p>That is, treat whenever the individual treatment effect is positive. Under a cost \\(c\\) per treatment, the optimal rule becomes:</p>
\\[d^*_c(x) = \\mathbf{1}\\{\\tau(x) > c\\}\\]</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 19.12 (Policy Value)</div>
<div class="env-body"><p>The <strong>value</strong> of a policy \\(d\\) is the expected outcome under that policy:</p>
\\[V(d) = E[Y(d(X))] = E[Y(0)] + E[\\tau(X) \\cdot d(X)]\\]
<p>The optimal policy maximizes \\(V(d)\\). Note that \\(V(d^*) \\geq V(d)\\) for any rule \\(d\\), and \\(V(d^*) \\geq E[Y(1)]\\) (treating everyone) and \\(V(d^*) \\geq E[Y(0)]\\) (treating no one), since the optimal rule selectively treats those who benefit.</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 19.13 (Empirical Welfare Maximization)</div>
<div class="env-body"><p>In practice, \\(\\tau(x)\\) is unknown and must be estimated. <strong>Empirical welfare maximization (EWM)</strong> searches over a policy class \\(\\mathcal{D}\\) to maximize an estimator of the policy value:</p>
\\[\\hat{d} = \\arg\\max_{d \\in \\mathcal{D}} \\hat{V}(d) = \\arg\\max_{d \\in \\mathcal{D}} \\frac{1}{n} \\sum_{i=1}^{n} \\hat{\\Gamma}_i \\cdot d(X_i)\\]
<p>where \\(\\hat{\\Gamma}_i\\) is a doubly robust score for the individual treatment effect:</p>
\\[\\hat{\\Gamma}_i = \\hat{\\tau}(X_i) + \\frac{W_i - \\hat{e}(X_i)}{\\hat{e}(X_i)(1 - \\hat{e}(X_i))} \\left(Y_i - \\hat{\\mu}_{W_i}(X_i)\\right)\\]
<p>This is an <strong>augmented inverse propensity weighted (AIPW)</strong> score that is more robust to misspecification of either the outcome or propensity model.</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 19.3 (Policy Trees, Athey & Wager 2021)</div>
<div class="env-body"><p><strong>Policy trees</strong> restrict the policy class \\(\\mathcal{D}\\) to depth-\\(k\\) decision trees. For depth \\(k\\), the algorithm performs an <strong>exhaustive search</strong> over all possible tree-based rules to maximize \\(\\hat{V}(d)\\). Key properties:</p>
<p>1. <strong>Interpretability:</strong> The resulting rule is a simple decision tree that practitioners can understand and implement.</p>
<p>2. <strong>Regret bound:</strong> The regret \\(V(d^*) - V(\\hat{d})\\) of the estimated policy relative to the oracle optimal policy converges to zero at rate:</p>
\\[V(d^*) - V(\\hat{d}) = O_p\\left(\\sqrt{\\frac{|\\mathcal{D}|}{n}}\\right)\\]
<p>where \\(|\\mathcal{D}|\\) is the complexity of the policy class (grows polynomially with \\(n\\) for fixed tree depth).</p>
<p>3. <strong>Double robustness:</strong> The AIPW scoring ensures valid results even if either the outcome model or propensity model (but not both) is misspecified.</p></div>
</div>

<div class="viz-placeholder" data-viz="ch19-viz-policy-tree"></div>

<div class="env-block remark">
<div class="env-title">Remark: Practical Policy Considerations</div>
<div class="env-body"><p>Moving from CATE estimation to policy deployment involves additional considerations:</p>
<p>- <strong>Fairness constraints:</strong> The optimal rule \\(d^*(x)\\) may disparately impact protected groups. Constrained optimization can enforce fairness (e.g., treatment rates must be similar across groups).</p>
<p>- <strong>Budget constraints:</strong> If only a fraction \\(B\\) of the population can be treated, the problem becomes: treat the top-\\(B\\) fraction by \\(\\hat{\\tau}(x)\\).</p>
<p>- <strong>Implementation:</strong> A complex, high-dimensional policy may be optimal but impractical. Depth-limited policy trees trade off some welfare for interpretability.</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch19-viz-policy-tree',
                    title: 'Optimal Policy Tree: Treatment Regions',
                    description: '2D covariate space partitioned by a policy tree showing treatment/no-treatment regions with expected outcomes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 480});
                        var budget = 1.0;

                        var sliderBudget = VizEngine.createSlider(controls, 'Budget (fraction treatable): ', 0.1, 1.0, budget, 0.05, function(v) {
                            budget = v; draw();
                        });

                        function trueCate(x1, x2) {
                            return 0.4 * x1 - 0.3 * (1 - x2) + 0.2 * x1 * x2 - 0.05;
                        }

                        function draw() {
                            var ctx = viz.ctx;
                            viz.clear();

                            var left = 80, top = 55, w = 340, h = 340;
                            var nx = 50, ny = 50;
                            var cellW = w / nx, cellH = h / ny;

                            var allTaus = [];
                            for (var i = 0; i < nx; i++) {
                                for (var j = 0; j < ny; j++) {
                                    var x1 = i / (nx - 1);
                                    var x2 = j / (ny - 1);
                                    allTaus.push({i: i, j: j, tau: trueCate(x1, x2)});
                                }
                            }

                            allTaus.sort(function(a, b) { return b.tau - a.tau; });
                            var nTreat = Math.round(budget * allTaus.length);

                            var treatGrid = [];
                            for (var i = 0; i < nx; i++) {
                                treatGrid[i] = [];
                                for (var j = 0; j < ny; j++) treatGrid[i][j] = false;
                            }
                            for (var k = 0; k < nTreat; k++) {
                                var item = allTaus[k];
                                if (item.tau > 0) treatGrid[item.i][item.j] = true;
                            }

                            for (var i = 0; i < nx; i++) {
                                for (var j = 0; j < ny; j++) {
                                    var tau = trueCate(i / (nx - 1), j / (ny - 1));
                                    if (treatGrid[i][j]) {
                                        var intensity = Math.min(Math.abs(tau) / 0.5, 1);
                                        ctx.fillStyle = 'rgba(76, 175, 80, ' + (0.3 + 0.5 * intensity) + ')';
                                    } else {
                                        if (tau > 0) {
                                            ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
                                        } else {
                                            var intensity = Math.min(Math.abs(tau) / 0.4, 1);
                                            ctx.fillStyle = 'rgba(244, 67, 54, ' + (0.2 + 0.3 * intensity) + ')';
                                        }
                                    }
                                    ctx.fillRect(left + i * cellW, top + (ny - 1 - j) * cellH, cellW + 1, cellH + 1);
                                }
                            }

                            var splitX1 = 0.35;
                            var splitX2 = 0.45;
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            var sx = left + splitX1 * w;
                            ctx.beginPath(); ctx.moveTo(sx, top); ctx.lineTo(sx, top + h); ctx.stroke();
                            var sy = top + h - splitX2 * h;
                            ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(left + w, sy); ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.strokeStyle = viz.colors.white + '44';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(left, top, w, h);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Policy Tree: Treatment Assignment Regions', 350, 28);

                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Risk Score (X\u2081)', left + w / 2, top + h + 35);
                            ctx.save();
                            ctx.translate(22, top + h / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('Biomarker (X\u2082)', 0, 0);
                            ctx.restore();

                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var k = 0; k <= 4; k++) {
                                ctx.fillStyle = viz.colors.white + '66';
                                ctx.fillText((k * 0.25).toFixed(2), left + k * w / 4, top + h + 18);
                            }
                            ctx.textAlign = 'right';
                            for (var k = 0; k <= 4; k++) {
                                ctx.fillStyle = viz.colors.white + '66';
                                ctx.fillText((k * 0.25).toFixed(2), left - 8, top + h - k * h / 4 + 4);
                            }

                            var treeLeft = left + w + 40;
                            var treeTop = top + 10;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Policy Tree', treeLeft + 100, treeTop - 5);

                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.fillRect(treeLeft + 50, treeTop + 10, 100, 36);
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1.5;
                            ctx.strokeRect(treeLeft + 50, treeTop + 10, 100, 36);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('X\u2081 > 0.35?', treeLeft + 100, treeTop + 32);

                            ctx.strokeStyle = viz.colors.white + '44';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(treeLeft + 70, treeTop + 46); ctx.lineTo(treeLeft + 40, treeTop + 76); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(treeLeft + 130, treeTop + 46); ctx.lineTo(treeLeft + 160, treeTop + 76); ctx.stroke();

                            ctx.fillStyle = 'rgba(244,67,54,0.3)';
                            ctx.fillRect(treeLeft - 5, treeTop + 76, 90, 36);
                            ctx.strokeStyle = viz.colors.red;
                            ctx.strokeRect(treeLeft - 5, treeTop + 76, 90, 36);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillText('No Treat', treeLeft + 40, treeTop + 97);

                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.fillRect(treeLeft + 115, treeTop + 76, 100, 36);
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.strokeRect(treeLeft + 115, treeTop + 76, 100, 36);
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('X\u2082 > 0.45?', treeLeft + 165, treeTop + 97);

                            ctx.strokeStyle = viz.colors.white + '44';
                            ctx.beginPath(); ctx.moveTo(treeLeft + 135, treeTop + 112); ctx.lineTo(treeLeft + 110, treeTop + 142); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(treeLeft + 195, treeTop + 112); ctx.lineTo(treeLeft + 210, treeTop + 142); ctx.stroke();

                            ctx.fillStyle = 'rgba(244,67,54,0.3)';
                            ctx.fillRect(treeLeft + 65, treeTop + 142, 90, 36);
                            ctx.strokeStyle = viz.colors.red;
                            ctx.strokeRect(treeLeft + 65, treeTop + 142, 90, 36);
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('No Treat', treeLeft + 110, treeTop + 163);

                            ctx.fillStyle = 'rgba(76,175,80,0.4)';
                            ctx.fillRect(treeLeft + 170, treeTop + 142, 80, 36);
                            ctx.strokeStyle = viz.colors.green;
                            ctx.strokeRect(treeLeft + 170, treeTop + 142, 80, 36);
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Treat', treeLeft + 210, treeTop + 163);

                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Yes', treeLeft + 15, treeTop + 68);
                            ctx.fillText('No', treeLeft + 138, treeTop + 68);
                            ctx.fillText('Yes', treeLeft + 85, treeTop + 135);
                            ctx.fillText('No', treeLeft + 198, treeTop + 135);

                            var nTreated = 0, sumWelfare = 0;
                            for (var i = 0; i < nx; i++) {
                                for (var j = 0; j < ny; j++) {
                                    var tau = trueCate(i / (nx - 1), j / (ny - 1));
                                    if (treatGrid[i][j]) { nTreated++; sumWelfare += tau; }
                                }
                            }
                            var treatFrac = nTreated / (nx * ny);
                            var avgWelfare = nTreated > 0 ? sumWelfare / nTreated : 0;

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            var infoY = treeTop + 210;
                            ctx.fillText('Treated: ' + (treatFrac * 100).toFixed(0) + '% of pop.', treeLeft + 20, infoY);
                            ctx.fillText('Avg \u03C4 (treated): ' + avgWelfare.toFixed(3), treeLeft + 20, infoY + 20);
                            ctx.fillText('Budget: ' + (budget * 100).toFixed(0) + '%', treeLeft + 20, infoY + 40);

                            ctx.textAlign = 'center';
                            ctx.font = '11px -apple-system,sans-serif';

                            ctx.fillStyle = 'rgba(76,175,80,0.6)';
                            ctx.fillRect(left + 10, top + h + 50, 14, 14);
                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'left';
                            ctx.fillText('Treat (d=1)', left + 30, top + h + 62);

                            ctx.fillStyle = 'rgba(244,67,54,0.4)';
                            ctx.fillRect(left + 130, top + h + 50, 14, 14);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('No treat (d=0, \u03C4<0)', left + 150, top + h + 62);

                            ctx.fillStyle = 'rgba(100,100,100,0.5)';
                            ctx.fillRect(left + 310, top + h + 50, 14, 14);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('No treat (budget limit)', left + 330, top + h + 62);
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch19-ex13',
                    type: 'mc',
                    question: 'The optimal individualized treatment rule without cost constraints is:',
                    options: [
                        'd*(x) = 1 for all x (treat everyone)',
                        'd*(x) = 1 if and only if tau(x) > 0',
                        'd*(x) = 1 if and only if E[Y(1)] > E[Y(0)]',
                        'd*(x) = 1 if and only if the propensity score exceeds 0.5'
                    ],
                    answer: 1,
                    explanation: 'The optimal rule treats individual x if and only if their CATE is positive: d*(x) = 1{tau(x) > 0}. This maximizes the policy value by treating exactly those who benefit.'
                },
                {
                    id: 'ch19-ex14',
                    type: 'mc',
                    question: 'Why do Athey & Wager (2021) restrict the policy class to depth-limited trees?',
                    options: [
                        'Because deep trees always perform better',
                        'To ensure interpretability and control the regret bound through limited complexity',
                        'Because the exhaustive search only works for linear models',
                        'To maximize the number of treated individuals'
                    ],
                    answer: 1,
                    explanation: 'Depth-limited trees balance two goals: (1) interpretability, so practitioners can understand and implement the rule, and (2) statistical guarantees, since the regret bound depends on the complexity of the policy class.'
                },
                {
                    id: 'ch19-ex15',
                    type: 'numeric',
                    question: 'Consider a population where 60% have tau(x)=0.8 and 40% have tau(x)=-0.3. What is the policy value V(d*) of the optimal ITR, relative to no treatment (i.e., V(d*) - V(0))?',
                    answer: 0.48,
                    tolerance: 0.01,
                    explanation: 'The optimal rule treats only those with tau > 0, i.e., the 60% with tau = 0.8. V(d*) - V(0) = 0.6 * 0.8 + 0.4 * 0 = 0.48. We do not treat the 40% with negative effects.'
                }
            ]
        },

        // ===== Section 5: Double/Debiased Machine Learning =====
        {
            id: 'ch19-sec05',
            title: 'Double/Debiased Machine Learning',
            content: `<h2>5 Double/Debiased Machine Learning</h2>
<p>The methods in the previous sections estimate the full CATE function \\(\\tau(x)\\). But sometimes we care about a <strong>single low-dimensional parameter</strong>, such as the ATE \\(\\theta = E[Y(1) - Y(0)]\\), while allowing high-dimensional or nonparametric nuisance functions. <strong>Double/Debiased Machine Learning (DML)</strong> (Chernozhukov et al. 2018) provides a general framework for \\(\\sqrt{n}\\)-consistent, asymptotically normal inference on such parameters, even when nuisance functions are estimated with machine learning.</p>

<div class="env-block definition">
<div class="env-title">Definition 19.14 (Partially Linear Model)</div>
<div class="env-body"><p>The canonical DML setting is the <strong>partially linear model</strong>:</p>
\\[Y = \\theta D + g(X) + \\varepsilon, \\quad E[\\varepsilon \\mid X, D] = 0\\]
\\[D = m(X) + V, \\quad E[V \\mid X] = 0\\]
<p>Here \\(\\theta\\) is the causal parameter of interest (the treatment effect), \\(g(X)\\) and \\(m(X)\\) are <strong>nuisance functions</strong> that may be complex and high-dimensional, \\(D\\) is the treatment, and \\(X\\) are covariates.</p>
<p>The challenge: if we naively estimate \\(g\\) and \\(m\\) with ML and plug in, the resulting \\(\\hat{\\theta}\\) is generally <strong>biased</strong> due to regularization and overfitting in the nuisance estimates.</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 19.15 (Neyman Orthogonal Score)</div>
<div class="env-body"><p>A score function \\(\\psi(W; \\theta, \\eta)\\) is <strong>Neyman orthogonal</strong> at the true nuisance \\(\\eta_0\\) if:</p>
\\[\\frac{\\partial}{\\partial \\eta} E[\\psi(W; \\theta_0, \\eta)]\\bigg|_{\\eta = \\eta_0} = 0\\]
<p>Orthogonality means that small errors in estimating \\(\\eta\\) (first-order perturbations) do not affect the score's expected value. This is the key property that makes DML robust to imperfect ML estimation of nuisance functions.</p>
<p>For the partially linear model, the Neyman orthogonal score is:</p>
\\[\\psi(W; \\theta, g, m) = (Y - g(X) - \\theta D)(D - m(X))\\]
<p>which is the product of the outcome residual and the treatment residual (the Frisch-Waugh-Lovell principle generalized to nonparametric nuisance).</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 19.4 (DML Procedure & Guarantee)</div>
<div class="env-body"><p>The DML algorithm with \\(K\\)-fold <strong>cross-fitting</strong> proceeds as follows:</p>
<p><strong>Step 1: Partition.</strong> Randomly split the data into \\(K\\) folds \\(I_1, \\dots, I_K\\).</p>
<p><strong>Step 2: Cross-fit nuisance estimation.</strong> For each fold \\(k\\):</p>
<p>(a) Using all data <em>except</em> fold \\(k\\), estimate nuisance functions \\(\\hat{g}_{-k}\\) and \\(\\hat{m}_{-k}\\) with any ML method.</p>
<p>(b) Form residuals on fold \\(k\\): \\(\\tilde{Y}_i = Y_i - \\hat{g}_{-k}(X_i)\\) and \\(\\tilde{D}_i = D_i - \\hat{m}_{-k}(X_i)\\).</p>
<p><strong>Step 3: Estimate \\(\\theta\\).</strong> The DML estimator is:</p>
\\[\\hat{\\theta}_{\\text{DML}} = \\frac{\\sum_{k=1}^{K} \\sum_{i \\in I_k} \\tilde{D}_i \\tilde{Y}_i}{\\sum_{k=1}^{K} \\sum_{i \\in I_k} \\tilde{D}_i^2}\\]
<p><strong>Guarantee:</strong> Under regularity conditions, if the nuisance estimators satisfy \\(\\|\\hat{g} - g_0\\| \\cdot \\|\\hat{m} - m_0\\| = o_p(n^{-1/2})\\), then:</p>
\\[\\sqrt{n}(\\hat{\\theta}_{\\text{DML}} - \\theta_0) \\xrightarrow{d} N(0, \\sigma^2)\\]
<p>This is \\(\\sqrt{n}\\)-consistent inference: the nuisance estimation error is second-order (\\(\\|\\hat{g} - g\\| \\cdot \\|\\hat{m} - m\\|\\) appears as a product, not a sum), so both can converge at rates slower than \\(n^{-1/2}\\) and the final estimator is still \\(\\sqrt{n}\\)-consistent.</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: Why Cross-Fitting?</div>
<div class="env-body"><p>Cross-fitting is essential because:</p>
<p>1. <strong>Overfitting bias:</strong> If we estimate \\(\\hat{g}\\) on the same data we use to compute residuals, ML methods that overfit will produce residuals that are systematically too small, biasing \\(\\hat{\\theta}\\).</p>
<p>2. <strong>Donsker condition:</strong> Without cross-fitting, we would need the nuisance estimator class to satisfy a Donsker condition (bounded complexity), which excludes many modern ML methods (random forests, neural networks, boosting).</p>
<p>3. <strong>Sample splitting vs cross-fitting:</strong> Simple sample splitting (train nuisance on half, estimate \\(\\theta\\) on the other half) wastes data. Cross-fitting uses all data for both tasks by cycling through folds, achieving full efficiency.</p></div>
</div>

<div class="viz-placeholder" data-viz="ch19-viz-dml-crossfit"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>Imagine you want to measure how much fertilizer (\\(D\\)) affects crop yield (\\(Y\\)), but soil quality (\\(X\\)) affects both. The naive approach: predict \\(Y\\) from \\(X\\) with ML, then look at what is left over. But if the ML overfits, the residuals are artificially small and the fertilizer effect is biased. DML says: "Residualize <em>both</em> the outcome and the treatment against \\(X\\), using a different fold for prediction, and then regress the outcome residual on the treatment residual." The double residualization (Frisch-Waugh on steroids) plus cross-fitting removes the bias.</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch19-viz-dml-crossfit',
                    title: 'DML Cross-Fitting Procedure',
                    description: 'Visualizes the K-fold cross-fitting procedure and compares naive ML vs DML estimates across repeated simulations.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 480});
                        var K = 5;
                        var showComparison = false;

                        VizEngine.createButton(controls, 'K=3 Folds', function() { K = 3; showComparison = false; draw(); });
                        VizEngine.createButton(controls, 'K=5 Folds', function() { K = 5; showComparison = false; draw(); });
                        VizEngine.createButton(controls, 'Show Naive vs DML', function() { showComparison = true; draw(); });

                        function simSeed(s) { return function() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

                        function draw() {
                            var ctx = viz.ctx;
                            viz.clear();

                            if (!showComparison) {
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('DML Cross-Fitting with K = ' + K + ' Folds', 350, 28);

                                var foldTop = 60;
                                var foldH = 40;
                                var foldGap = 12;
                                var left = 60;
                                var totalW = 580;
                                var foldW = totalW / K;

                                var foldColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green];

                                for (var iter = 0; iter < K; iter++) {
                                    var yPos = foldTop + iter * (foldH + foldGap + 30);

                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'right';
                                    ctx.fillText('Iter ' + (iter + 1) + ':', left - 8, yPos + foldH / 2 + 4);

                                    for (var f = 0; f < K; f++) {
                                        var fx = left + f * foldW + 2;
                                        var fw = foldW - 4;

                                        if (f === iter) {
                                            ctx.fillStyle = foldColors[f % foldColors.length] + '88';
                                            ctx.fillRect(fx, yPos, fw, foldH);
                                            ctx.strokeStyle = foldColors[f % foldColors.length];
                                            ctx.lineWidth = 2;
                                            ctx.strokeRect(fx, yPos, fw, foldH);

                                            ctx.fillStyle = '#fff';
                                            ctx.font = 'bold 11px -apple-system,sans-serif';
                                            ctx.textAlign = 'center';
                                            ctx.fillText('Estimate \u03B8', fx + fw / 2, yPos + 16);
                                            ctx.font = '10px -apple-system,sans-serif';
                                            ctx.fillText('(test fold)', fx + fw / 2, yPos + 30);
                                        } else {
                                            ctx.fillStyle = viz.colors.white + '15';
                                            ctx.fillRect(fx, yPos, fw, foldH);
                                            ctx.strokeStyle = viz.colors.white + '33';
                                            ctx.lineWidth = 1;
                                            ctx.strokeRect(fx, yPos, fw, foldH);

                                            ctx.fillStyle = viz.colors.text;
                                            ctx.font = '10px -apple-system,sans-serif';
                                            ctx.textAlign = 'center';
                                            ctx.fillText('Train g\u0302, m\u0302', fx + fw / 2, yPos + foldH / 2 + 4);
                                        }
                                    }

                                    var arrowX = left + totalW + 15;
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('\u2192 \u03B8\u0302\u2096 on fold ' + (iter + 1), arrowX, yPos + foldH / 2 + 4);
                                }

                                var summaryY = foldTop + K * (foldH + foldGap + 30) + 10;

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Final: \u03B8\u0302_DML = aggregate across all K folds', 350, summaryY);

                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('Key: Nuisance functions (g\u0302, m\u0302) are never evaluated on their own training data', 350, summaryY + 25);
                                ctx.fillText('This eliminates overfitting bias while using ALL data for both training and estimation', 350, summaryY + 45);

                            } else {
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Naive ML vs DML Estimates (True \u03B8 = 0.50)', 350, 28);

                                var rng = simSeed(777);
                                var nSim = 30;
                                var trueTheta = 0.5;
                                var naiveEsts = [], dmlEsts = [];

                                for (var s = 0; s < nSim; s++) {
                                    var naiveBias = -0.15 + 0.08 * (rng() + rng() + rng() - 1.5);
                                    naiveEsts.push(trueTheta + naiveBias + 0.12 * (rng() - 0.5));

                                    var dmlNoise = 0.08 * (rng() + rng() - 1.0);
                                    dmlEsts.push(trueTheta + dmlNoise);
                                }

                                var plotLeft = 80, plotTop = 60, plotW = 540, plotH = 160;
                                var xMin = 0.1, xMax = 0.8;

                                function toX(val) { return plotLeft + (val - xMin) / (xMax - xMin) * plotW; }

                                ctx.strokeStyle = viz.colors.yellow;
                                ctx.lineWidth = 2;
                                var trueX = toX(trueTheta);
                                ctx.beginPath(); ctx.moveTo(trueX, plotTop - 5); ctx.lineTo(trueX, plotTop + plotH + 5); ctx.stroke();
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('True \u03B8 = 0.50', trueX, plotTop - 10);

                                var naiveY = plotTop + 40;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('Naive ML:', plotLeft - 10, naiveY + 4);

                                for (var s = 0; s < nSim; s++) {
                                    ctx.fillStyle = viz.colors.orange + '99';
                                    ctx.beginPath();
                                    ctx.arc(toX(naiveEsts[s]), naiveY + (s % 3 - 1) * 6, 4, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                var naiveMean = 0;
                                for (var s = 0; s < nSim; s++) naiveMean += naiveEsts[s];
                                naiveMean /= nSim;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.moveTo(toX(naiveMean), naiveY - 12);
                                ctx.lineTo(toX(naiveMean) - 5, naiveY - 20);
                                ctx.lineTo(toX(naiveMean) + 5, naiveY - 20);
                                ctx.closePath();
                                ctx.fill();
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('mean=' + naiveMean.toFixed(3), toX(naiveMean), naiveY - 24);

                                var dmlY = plotTop + 120;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('DML:', plotLeft - 10, dmlY + 4);

                                for (var s = 0; s < nSim; s++) {
                                    ctx.fillStyle = viz.colors.teal + '99';
                                    ctx.beginPath();
                                    ctx.arc(toX(dmlEsts[s]), dmlY + (s % 3 - 1) * 6, 4, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                var dmlMean = 0;
                                for (var s = 0; s < nSim; s++) dmlMean += dmlEsts[s];
                                dmlMean /= nSim;
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.moveTo(toX(dmlMean), dmlY - 12);
                                ctx.lineTo(toX(dmlMean) - 5, dmlY - 20);
                                ctx.lineTo(toX(dmlMean) + 5, dmlY - 20);
                                ctx.closePath();
                                ctx.fill();
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('mean=' + dmlMean.toFixed(3), toX(dmlMean), dmlY - 24);

                                ctx.strokeStyle = viz.colors.white + '22';
                                ctx.lineWidth = 1;
                                ctx.strokeRect(plotLeft, plotTop, plotW, plotH);

                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.white + '66';
                                ctx.textAlign = 'center';
                                for (var k = 0; k <= 7; k++) {
                                    var v = xMin + (xMax - xMin) * k / 7;
                                    ctx.fillText(v.toFixed(2), toX(v), plotTop + plotH + 16);
                                }
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('\u03B8\u0302', plotLeft + plotW / 2, plotTop + plotH + 35);

                                var boxTop = plotTop + plotH + 55;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';

                                var naiveVar = 0, dmlVar = 0;
                                for (var s = 0; s < nSim; s++) {
                                    naiveVar += Math.pow(naiveEsts[s] - naiveMean, 2);
                                    dmlVar += Math.pow(dmlEsts[s] - dmlMean, 2);
                                }
                                naiveVar /= nSim; dmlVar /= nSim;
                                var naiveBiasVal = naiveMean - trueTheta;
                                var dmlBiasVal = dmlMean - trueTheta;
                                var naiveMSE = naiveBiasVal * naiveBiasVal + naiveVar;
                                var dmlMSE = dmlBiasVal * dmlBiasVal + dmlVar;

                                ctx.fillStyle = viz.colors.orange;
                                ctx.textAlign = 'left';
                                ctx.fillText('Naive: Bias = ' + naiveBiasVal.toFixed(3) + ', Var = ' + naiveVar.toFixed(4) + ', MSE = ' + naiveMSE.toFixed(4), 100, boxTop);

                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText('DML:   Bias = ' + dmlBiasVal.toFixed(3) + ', Var = ' + dmlVar.toFixed(4) + ', MSE = ' + dmlMSE.toFixed(4), 100, boxTop + 22);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Naive ML suffers from regularization bias (biased toward 0). DML uses orthogonalization + cross-fitting to eliminate this bias.', 350, boxTop + 55);
                            }
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch19-ex16',
                    type: 'mc',
                    question: 'In the partially linear model Y = \\(\\theta\\)D + g(X) + \\(\\varepsilon\\), what role does g(X) play?',
                    options: [
                        'It is the parameter of interest',
                        'It is a nuisance function capturing confounding effects of X on Y',
                        'It is the treatment assignment mechanism',
                        'It represents the treatment effect heterogeneity'
                    ],
                    answer: 1,
                    explanation: 'The function g(X) captures the (potentially complex, high-dimensional) confounding effect of X on Y. It is a nuisance because we need to account for it to estimate theta, but we do not directly care about its form.'
                },
                {
                    id: 'ch19-ex17',
                    type: 'mc',
                    question: 'Neyman orthogonality ensures that:',
                    options: [
                        'The nuisance functions are perfectly estimated',
                        'First-order errors in nuisance estimation do not affect the score expectation, making the target parameter robust to imperfect ML',
                        'The estimator converges at rate n^{-1}',
                        'Cross-fitting is unnecessary'
                    ],
                    answer: 1,
                    explanation: 'Neyman orthogonality means the score is locally insensitive to perturbations in nuisance parameters: the derivative of E[score] with respect to the nuisance is zero at the truth. This means first-order nuisance errors only produce second-order bias in the target parameter.'
                },
                {
                    id: 'ch19-ex18',
                    type: 'mc',
                    question: 'Why is cross-fitting (rather than using the same data for nuisance estimation and inference) essential in DML?',
                    options: [
                        'It reduces computation time',
                        'It ensures nuisance estimates are never evaluated on their own training data, avoiding overfitting bias',
                        'It allows using only linear models for nuisance estimation',
                        'It makes the standard errors smaller'
                    ],
                    answer: 1,
                    explanation: 'Cross-fitting ensures that the ML-estimated nuisance functions are evaluated only on held-out data. Without this, overfitting in the nuisance estimates (which is typical for flexible ML methods) biases the residuals and hence the target parameter estimate.'
                },
                {
                    id: 'ch19-ex19',
                    type: 'mc',
                    question: 'The DML guarantee requires that the product of nuisance estimation errors satisfies \\(\\|\\hat{g}-g\\| \\cdot \\|\\hat{m}-m\\| = o_p(n^{-1/2})\\). If both nuisance functions converge at rate \\(n^{-1/4}\\), is this condition satisfied?',
                    options: [
                        'No, because n^{-1/4} is too slow',
                        'Yes, because n^{-1/4} * n^{-1/4} = n^{-1/2} = o_p(n^{-1/2}) is borderline but the product condition is met under slightly stronger conditions',
                        'Yes, because the product is n^{-1/2} which is exactly the requirement',
                        'No, both nuisance functions must converge at rate n^{-1/2}'
                    ],
                    answer: 1,
                    explanation: 'If both converge at exactly n^{-1/4}, the product is n^{-1/2}. The condition requires o_p(n^{-1/2}), which is strictly faster. So the borderline case needs slightly faster rates (e.g., n^{-1/4} * log(n) factors). In practice, many ML estimators achieve this under sparsity or smoothness assumptions.'
                }
            ]
        }
    ]
});
