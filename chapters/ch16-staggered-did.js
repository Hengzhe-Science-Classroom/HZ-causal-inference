// ============================================================
// Chapter 16 · 交错DID与事件研究
// Staggered DiD & Event Studies
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch16',
    number: 16,
    title: 'Staggered DiD & Event Studies',
    subtitle: 'Modern Methods for Differential Timing 交错DID与事件研究',
    sections: [
        // --------------------------------------------------------
        // Section 1: Problems with TWFE Under Staggered Treatment
        // --------------------------------------------------------
        {
            id: 'ch16-sec01',
            title: 'Problems with TWFE Under Staggered Treatment',
            content: `<h2>Problems with TWFE Under Staggered Treatment</h2>

<p>In many real-world policy evaluations, treatment does not arrive simultaneously for all treated units. States adopt minimum wage increases in different years; hospitals implement new protocols at different times; firms adopt technologies on their own schedules. This setting is called <strong>staggered treatment adoption</strong>.</p>

<div class="env-block definition">
<div class="env-title">Definition (Staggered Adoption)</div>
<div class="env-body">
<p>Units \\(i = 1, \\ldots, N\\) are observed over periods \\(t = 1, \\ldots, T\\). Each unit has a treatment adoption time \\(G_i \\in \\{2, 3, \\ldots, T, \\infty\\}\\), where \\(G_i = \\infty\\) means unit \\(i\\) is never treated. The treatment indicator is:</p>
\\[D_{it} = \\mathbf{1}\\{t \\ge G_i\\}\\]
<p>Treatment is <strong>absorbing</strong>: once a unit is treated, it remains treated for all subsequent periods.</p>
</div>
</div>

<p>The standard approach in applied economics has been to run a <strong>two-way fixed effects (TWFE)</strong> regression:</p>
\\[Y_{it} = \\alpha_i + \\lambda_t + \\beta^{\\text{TWFE}} D_{it} + \\varepsilon_{it}\\]
<p>where \\(\\alpha_i\\) are unit fixed effects, \\(\\lambda_t\\) are time fixed effects, and \\(\\beta^{\\text{TWFE}}\\) is the coefficient of interest.</p>

<div class="env-block warning">
<div class="env-title">The Problem: Negative Weights</div>
<div class="env-body">
<p>Under staggered adoption with <strong>heterogeneous treatment effects</strong>, the TWFE estimator \\(\\hat{\\beta}^{\\text{TWFE}}\\) is a weighted average of many underlying 2\\(\\times\\)2 DiD estimates, and some of these weights can be <strong>negative</strong>.</p>
<p>This means \\(\\hat{\\beta}^{\\text{TWFE}}\\) can be negative even when the true treatment effect is positive for every unit in every period.</p>
</div>
</div>

<p>Why do negative weights arise? The TWFE regression implicitly uses <strong>already-treated units</strong> as controls for later-treated units. When treatment effects change over time (e.g., they grow with exposure), the outcome of an already-treated unit in a later period reflects both the time trend and the evolving treatment effect. Differencing this away contaminates the estimate.</p>

<div class="env-block theorem">
<div class="env-title">Theorem (de Chaisemartin & D'Haultfoeuille, 2020)</div>
<div class="env-body">
<p>The TWFE estimator can be decomposed as:</p>
\\[\\hat{\\beta}^{\\text{TWFE}} = \\sum_{(i,t): D_{it}=1} w_{it} \\cdot \\tau_{it}\\]
<p>where \\(\\tau_{it}\\) is the true unit-time treatment effect, and the weights \\(w_{it}\\) sum to one but can be negative. Specifically, weights are negative for units that are treated in period \\(t\\) when the share of treated units is far from 0.5.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example: Minimum Wage Study</div>
<div class="env-body">
<p>Suppose three states adopt a minimum wage increase: State A in 2010, State B in 2015, and State C never. In a TWFE regression for the year 2016:</p>
<ul>
<li>State C (never-treated) serves as a clean control.</li>
<li>State A (treated since 2010) is also implicitly used as a "control" for State B, but State A's outcome in 2016 includes 6 years of treatment effect accumulation.</li>
</ul>
<p>If the effect grows with exposure, differencing out State A's outcome in 2016 over-subtracts, yielding a contaminated (possibly negative) comparison for State B.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-twfe-weights"></div>

<div class="env-block remark">
<div class="env-title">Key Takeaway</div>
<div class="env-body">
<p>TWFE is reliable under staggered adoption <strong>only if treatment effects are homogeneous</strong> across all groups and time periods. When effects vary by cohort or grow over time, TWFE can produce severely misleading estimates, including wrong signs. This realization, formalized around 2018-2021, sparked a revolution in DiD methodology.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch16-viz-twfe-weights',
                    title: 'Negative Weights in TWFE with Staggered Adoption',
                    description: 'Visualize how TWFE assigns weights, including negative ones, to different 2x2 DiD comparisons',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 720, height: 440, scale: 50, originX: 80, originY: 380});
                        var hetero = 3.0;
                        var growthRate = 0.5;

                        function simulate(het, growth) {
                            var T = 10;
                            var groups = [
                                {name: 'Early (g=3)', gTime: 3, color: viz.colors.blue},
                                {name: 'Late (g=7)', gTime: 7, color: viz.colors.orange},
                                {name: 'Never treated', gTime: Infinity, color: viz.colors.text}
                            ];
                            var outcomes = [];
                            for (var gi = 0; gi < groups.length; gi++) {
                                var g = groups[gi];
                                var series = [];
                                for (var t = 1; t <= T; t++) {
                                    var base = 2 + t * 0.3;
                                    if (gi === 0) base += 1;
                                    if (gi === 1) base += 0.5;
                                    var te = 0;
                                    if (t >= g.gTime) {
                                        var exposure = t - g.gTime + 1;
                                        te = het + growth * (exposure - 1);
                                    }
                                    series.push({t: t, y: base + te, te: te});
                                }
                                outcomes.push({group: g, series: series});
                            }
                            // Compute 2x2 DiD weights
                            var comparisons = [];
                            // Early vs Never (clean)
                            comparisons.push({
                                label: 'Early vs Never',
                                type: 'clean',
                                weight: 0.35,
                                estimate: het
                            });
                            // Late vs Never (clean)
                            comparisons.push({
                                label: 'Late vs Never',
                                type: 'clean',
                                weight: 0.30,
                                estimate: het
                            });
                            // Late vs Early (contaminated)
                            var contaminatedEst = het - growth * 4;
                            comparisons.push({
                                label: 'Late vs Early',
                                type: 'contaminated',
                                weight: 0.20,
                                estimate: contaminatedEst
                            });
                            // Early vs Late (contaminated, negative weight possible)
                            var negWeight = -0.15 * (growth > 0 ? 1 : 0.3);
                            comparisons.push({
                                label: 'Early vs Late (neg wt)',
                                type: 'negative',
                                weight: negWeight,
                                estimate: het + growth * 2
                            });
                            // Normalize
                            var totalW = comparisons.reduce(function(s, c) { return s + c.weight; }, 0);
                            comparisons.forEach(function(c) { c.weight = c.weight / totalW; });
                            var twfeBeta = comparisons.reduce(function(s, c) { return s + c.weight * c.estimate; }, 0);
                            return {outcomes: outcomes, comparisons: comparisons, twfeBeta: twfeBeta, trueATT: het + growth * 2};
                        }

                        function draw() {
                            var sim = simulate(hetero, growthRate);
                            viz.clear();

                            // Title
                            viz.screenText('TWFE Weights Under Staggered Adoption', viz.width / 2, 18, viz.colors.white, 14);

                            // Left panel: time series
                            var panelW = 340;
                            var ctx = viz.ctx;

                            // Draw time series
                            var xOff = 60, yOff = 50;
                            var xScale = 28, yScale = 28;
                            var T = 10;

                            // Background grid
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var t = 1; t <= T; t++) {
                                var px = xOff + t * xScale;
                                ctx.beginPath(); ctx.moveTo(px, yOff); ctx.lineTo(px, yOff + 280); ctx.stroke();
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(xOff + xScale, yOff + 280); ctx.lineTo(xOff + T * xScale + 10, yOff + 280); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(xOff + xScale, yOff); ctx.lineTo(xOff + xScale, yOff + 280); ctx.stroke();

                            // Time labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var t = 1; t <= T; t++) {
                                ctx.fillText('t=' + t, xOff + t * xScale, yOff + 284);
                            }

                            // Treatment onset lines
                            ctx.strokeStyle = viz.colors.blue + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            var px3 = xOff + 3 * xScale;
                            ctx.beginPath(); ctx.moveTo(px3, yOff); ctx.lineTo(px3, yOff + 280); ctx.stroke();
                            var px7 = xOff + 7 * xScale;
                            ctx.strokeStyle = viz.colors.orange + '44';
                            ctx.beginPath(); ctx.moveTo(px7, yOff); ctx.lineTo(px7, yOff + 280); ctx.stroke();
                            ctx.setLineDash([]);

                            // Plot each group
                            for (var gi = 0; gi < sim.outcomes.length; gi++) {
                                var grp = sim.outcomes[gi];
                                var col = grp.group.color;
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var si = 0; si < grp.series.length; si++) {
                                    var pt = grp.series[si];
                                    var sx = xOff + pt.t * xScale;
                                    var sy = yOff + 280 - (pt.y - 1) * yScale;
                                    if (si === 0) ctx.moveTo(sx, sy);
                                    else ctx.lineTo(sx, sy);
                                }
                                ctx.stroke();
                                // Dots
                                for (var si = 0; si < grp.series.length; si++) {
                                    var pt = grp.series[si];
                                    var sx = xOff + pt.t * xScale;
                                    var sy = yOff + 280 - (pt.y - 1) * yScale;
                                    ctx.fillStyle = col;
                                    ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
                                }
                                // Label
                                var lastPt = grp.series[grp.series.length - 1];
                                var lsx = xOff + lastPt.t * xScale + 5;
                                var lsy = yOff + 280 - (lastPt.y - 1) * yScale;
                                ctx.fillStyle = col;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(grp.group.name, lsx, lsy);
                            }

                            viz.screenText('Y(t)', xOff + 10, yOff + 10, viz.colors.text, 10, 'left');

                            // Right panel: weight bar chart
                            var barX = 420, barY = 60, barW = 260, barH = 300;
                            viz.screenText('2x2 DiD Weights', barX + barW / 2, 42, viz.colors.white, 12);

                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(barX, barY + barH); ctx.lineTo(barX + barW, barY + barH); ctx.stroke();

                            // Zero line
                            var zeroY = barY + barH * 0.75;
                            ctx.strokeStyle = viz.colors.text + '44';
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(barX, zeroY); ctx.lineTo(barX + barW, zeroY); ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('0', barX - 4, zeroY);

                            var bw = 50;
                            var gap = 12;
                            var maxW = 0.5;
                            var wScale = (barH * 0.7) / maxW;

                            for (var ci = 0; ci < sim.comparisons.length; ci++) {
                                var comp = sim.comparisons[ci];
                                var bx = barX + 15 + ci * (bw + gap);
                                var bHeight = Math.abs(comp.weight) * wScale;
                                var by = comp.weight >= 0 ? zeroY - bHeight : zeroY;

                                var barColor;
                                if (comp.type === 'clean') barColor = viz.colors.green;
                                else if (comp.type === 'contaminated') barColor = viz.colors.yellow;
                                else barColor = viz.colors.red;

                                ctx.fillStyle = barColor + '88';
                                ctx.fillRect(bx, by, bw, bHeight);
                                ctx.strokeStyle = barColor;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(bx, by, bw, bHeight);

                                // Weight value
                                ctx.fillStyle = barColor;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                var labelY = comp.weight >= 0 ? by - 8 : by + bHeight + 12;
                                ctx.fillText(comp.weight.toFixed(2), bx + bw / 2, labelY);

                                // Comparison label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                var lines = comp.label.split(' ');
                                for (var li = 0; li < lines.length; li++) {
                                    ctx.fillText(lines[li], bx + bw / 2, barY + barH + 12 + li * 11);
                                }
                            }

                            // Summary stats
                            var sumY = barY + barH + 50;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillText('TWFE estimate: ' + sim.twfeBeta.toFixed(2), barX, sumY);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('True avg ATT: ' + sim.trueATT.toFixed(2), barX, sumY + 16);

                            // Legend
                            var legY = sumY + 40;
                            var legItems = [
                                {color: viz.colors.green, text: 'Clean (vs never-treated)'},
                                {color: viz.colors.yellow, text: 'Contaminated (late vs early)'},
                                {color: viz.colors.red, text: 'Negative weight'}
                            ];
                            for (var li = 0; li < legItems.length; li++) {
                                ctx.fillStyle = legItems[li].color;
                                ctx.fillRect(barX, legY + li * 15, 10, 10);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillText(legItems[li].text, barX + 15, legY + li * 15 + 9);
                            }
                        }

                        VizEngine.createSlider(controls, 'Treatment effect size', 0.5, 6, hetero, 0.5, function(v) { hetero = v; draw(); });
                        VizEngine.createSlider(controls, 'Effect growth rate', 0, 2, growthRate, 0.1, function(v) { growthRate = v; draw(); });
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch16-ex01',
                    type: 'concept',
                    difficulty: 2,
                    question: 'In a staggered DiD setting with three timing groups (early, late, never-treated), which comparison is "contaminated" when running TWFE?',
                    hints: ['Think about which units serve as implicit controls in TWFE.', 'An already-treated unit has treatment effects embedded in its outcome.'],
                    answer: 'The comparison of late-treated vs early-treated units is contaminated. TWFE uses early-treated units (which are already treated and have accumulated treatment effects) as controls for the late-treated group. If treatment effects grow with exposure, the early-treated group\'s outcome over-subtracts, biasing the estimate.'
                },
                {
                    id: 'ch16-ex02',
                    type: 'concept',
                    difficulty: 2,
                    question: 'Under what condition is the TWFE estimator unbiased under staggered treatment adoption?',
                    hints: ['Think about what makes negative weights irrelevant.', 'If all treatment effects are the same, does the weighting matter?'],
                    answer: 'TWFE is unbiased when treatment effects are homogeneous across all groups and time periods. If the ATT is a constant (no variation by cohort or time since treatment), then even with negative weights the weighted average still equals the true constant effect.'
                },
                {
                    id: 'ch16-ex03',
                    type: 'calculation',
                    difficulty: 3,
                    question: 'Suppose TWFE produces weights w = (0.4, 0.3, 0.15, -0.15) on four 2x2 DiD estimates with values (3, 3, 1, 5). Compute the TWFE estimate and the simple average of the positive-weight estimates. Which is closer to the true ATT of 3?',
                    hints: ['Compute the weighted sum.', 'The negative weight on the largest estimate pulls the TWFE down.'],
                    answer: 'TWFE = 0.4(3) + 0.3(3) + 0.15(1) + (-0.15)(5) = 1.2 + 0.9 + 0.15 - 0.75 = 1.5. Simple average of positive-weight estimates = (3 + 3 + 1)/3 = 2.33. True ATT = 3. The simple average (2.33) is much closer. The negative weight on 5 pulls TWFE down to 1.5, demonstrating severe bias from negative weighting.'
                },
                {
                    id: 'ch16-ex04',
                    type: 'concept',
                    difficulty: 3,
                    question: 'Explain why treatment effects that grow with exposure duration are particularly problematic for TWFE in staggered settings.',
                    hints: ['Consider what happens to the already-treated group\'s outcome over time.', 'The gap between an early-treated unit and a never-treated unit widens, but TWFE does not account for this.'],
                    answer: 'When treatment effects grow with exposure, early-treated units accumulate larger and larger effects over time. When TWFE uses these early-treated units as controls for later-treated units, it subtracts an outcome that includes a large accumulated treatment effect. This creates a negative bias for the late-treated group\'s estimated effect and assigns negative implicit weights. The longer the gap between early and late adoption, the worse the contamination becomes.'
                }
            ]
        },
        // --------------------------------------------------------
        // Section 2: Goodman-Bacon Decomposition
        // --------------------------------------------------------
        {
            id: 'ch16-sec02',
            title: 'Goodman-Bacon Decomposition',
            content: `<h2>Goodman-Bacon Decomposition</h2>

<p>Andrew Goodman-Bacon (2021) provided a fundamental insight: the TWFE DiD estimator in a staggered setting can be exactly decomposed into a weighted average of <strong>all possible 2\\(\\times\\)2 DiD estimators</strong> formed from pairs of timing groups.</p>

<div class="env-block theorem">
<div class="env-title">Theorem (Goodman-Bacon, 2021)</div>
<div class="env-body">
<p>In a balanced panel with staggered treatment, the TWFE estimator satisfies:</p>
\\[\\hat{\\beta}^{\\text{TWFE}} = \\sum_{k \\neq \\ell} s_{k\\ell} \\cdot \\hat{\\beta}^{2\\times 2}_{k\\ell}\\]
<p>where the sum is over all ordered pairs of timing groups \\((k, \\ell)\\), \\(\\hat{\\beta}^{2\\times 2}_{k\\ell}\\) is the standard 2\\(\\times\\)2 DiD estimate using group \\(k\\) as "treatment" and group \\(\\ell\\) as "control", and the weights \\(s_{k\\ell}\\) depend on:</p>
<ul>
<li><strong>Group size</strong>: \\(n_k\\) and \\(n_\\ell\\)</li>
<li><strong>Timing variance</strong>: how far the treatment adoption time is from the panel midpoint</li>
</ul>
\\[s_{k\\ell} \\propto (n_k + n_\\ell)^2 \\cdot \\widehat{\\text{Var}}(D_{k\\ell,t})\\]
</div>
</div>

<p>The variance of the treatment indicator \\(D_{k\\ell,t}\\) in the sub-panel is maximized when the treatment switch happens near the middle of the time horizon. Groups that switch treatment in the middle of the panel therefore receive more weight.</p>

<div class="env-block definition">
<div class="env-title">Types of 2\\(\\times\\)2 Comparisons</div>
<div class="env-body">
<p>The Bacon decomposition reveals three types of 2\\(\\times\\)2 DiD comparisons:</p>
<ol>
<li><strong>Treated vs. Never-Treated</strong>: Clean comparison. Group \\(k\\) (treated at some point) vs. group \\(U\\) (never treated). This is uncontaminated.</li>
<li><strong>Earlier vs. Later Treated (before late treatment)</strong>: Group \\(k\\) (early) as treated, group \\(\\ell\\) (late) as control, using time period before \\(\\ell\\) is treated. This is also clean.</li>
<li><strong>Later vs. Earlier Treated (after early treatment)</strong>: Group \\(\\ell\\) (late) as treated, group \\(k\\) (early) as "control", but group \\(k\\) is already treated. This comparison is <strong>contaminated</strong> because the "control" group has a non-zero treatment effect.</li>
</ol>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example: Two Treated Groups + Never Treated</div>
<div class="env-body">
<p>Consider groups: Early (\\(g=2005\\)), Late (\\(g=2010\\)), Never. The decomposition yields:</p>
<table style="width:100%;text-align:center;margin:8px 0;">
<tr><th>Comparison</th><th>Type</th><th>Weight</th></tr>
<tr><td>Early vs Never</td><td>Clean</td><td>\\(s_1\\)</td></tr>
<tr><td>Late vs Never</td><td>Clean</td><td>\\(s_2\\)</td></tr>
<tr><td>Early vs Late (pre-2010)</td><td>Clean</td><td>\\(s_3\\)</td></tr>
<tr><td>Late vs Early (post-2005)</td><td>Contaminated</td><td>\\(s_4\\)</td></tr>
</table>
<p>If treatment effects grow over time, the contaminated comparison (Late vs. Early post-2005) can have a downward-biased estimate because the "control" (Early group) has accumulated treatment effects that get subtracted.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-bacon-decomp"></div>

<div class="env-block remark">
<div class="env-title">Diagnostic Use</div>
<div class="env-body">
<p>The Bacon decomposition is primarily a <strong>diagnostic tool</strong>: it tells you whether your TWFE estimate is driven by clean or contaminated comparisons. If contaminated comparisons have large weight and very different estimates from clean comparisons, this signals that TWFE is unreliable and you should switch to a modern estimator (Sections 3-4).</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch16-viz-bacon-decomp',
                    title: 'Bacon Decomposition: 2x2 Components and Weights',
                    description: 'See each 2x2 DiD component, its weight, and how they aggregate to the TWFE estimate',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 720, height: 460, scale: 1, originX: 0, originY: 0});
                        var effectEarly = 3.0;
                        var effectLate = 3.0;
                        var growthRate = 0.5;
                        var earlyG = 3;
                        var lateG = 7;
                        var T = 10;

                        function computeDecomp() {
                            // Simulate group outcomes
                            var nE = 30, nL = 30, nU = 40;
                            var totalN = nE + nL + nU;

                            // True treatment effects
                            function tauE(t) { return t >= earlyG ? effectEarly + growthRate * (t - earlyG) : 0; }
                            function tauL(t) { return t >= lateG ? effectLate + growthRate * (t - lateG) : 0; }

                            // 2x2 comparisons
                            var comps = [];

                            // Early vs Never: use periods around earlyG
                            var preE = earlyG - 1, postE = Math.min(earlyG + 2, T);
                            var estEN = tauE(postE);
                            var wEN = Math.pow(nE + nU, 2) * (earlyG - 1) * (T - earlyG + 1) / (T * T);

                            comps.push({
                                label: 'Early vs Never',
                                estimate: estEN,
                                weight: wEN,
                                type: 'clean',
                                color: viz.colors.green
                            });

                            // Late vs Never
                            var postL = Math.min(lateG + 2, T);
                            var estLN = tauL(postL);
                            var wLN = Math.pow(nL + nU, 2) * (lateG - 1) * (T - lateG + 1) / (T * T);

                            comps.push({
                                label: 'Late vs Never',
                                estimate: estLN,
                                weight: wLN,
                                type: 'clean',
                                color: viz.colors.teal
                            });

                            // Early vs Late (using pre-late period) - clean
                            var midClean = Math.floor((earlyG + lateG) / 2);
                            var estEL = tauE(midClean);
                            var wEL = Math.pow(nE + nL, 2) * (lateG - earlyG) * (earlyG - 1) / (T * T);

                            comps.push({
                                label: 'Early vs Late (clean)',
                                estimate: estEL,
                                weight: wEL,
                                type: 'timing_clean',
                                color: viz.colors.blue
                            });

                            // Late vs Early (post-early, contaminated)
                            var postBoth = Math.min(lateG + 1, T);
                            var estLE = tauL(postBoth) - (tauE(postBoth) - tauE(lateG - 1));
                            var wLE = Math.pow(nE + nL, 2) * (T - lateG + 1) * (lateG - earlyG) / (T * T);

                            comps.push({
                                label: 'Late vs Early (contam.)',
                                estimate: estLE,
                                weight: wLE,
                                type: 'contaminated',
                                color: viz.colors.red
                            });

                            // Normalize weights
                            var totalW = comps.reduce(function(s, c) { return s + c.weight; }, 0);
                            comps.forEach(function(c) { c.weight = c.weight / totalW; });

                            var twfe = comps.reduce(function(s, c) { return s + c.weight * c.estimate; }, 0);
                            var trueATT = (tauE(T) + tauL(T)) / 2;

                            return {comparisons: comps, twfe: twfe, trueATT: trueATT};
                        }

                        function draw() {
                            var dec = computeDecomp();
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Goodman-Bacon Decomposition', viz.width / 2, 20, viz.colors.white, 14);
                            viz.screenText('TWFE = weighted average of all 2x2 DiD estimates', viz.width / 2, 38, viz.colors.text, 11);

                            // Scatter plot: weight (x) vs estimate (y)
                            var plotL = 80, plotR = 420, plotT = 70, plotB = 370;
                            var plotW = plotR - plotL, plotH = plotB - plotT;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Weight', (plotL + plotR) / 2, plotB + 25);
                            ctx.save();
                            ctx.translate(plotL - 35, (plotT + plotB) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('2x2 DiD Estimate', 0, 0);
                            ctx.restore();

                            // Scale
                            var maxEst = 0, maxW = 0;
                            dec.comparisons.forEach(function(c) {
                                if (Math.abs(c.estimate) > maxEst) maxEst = Math.abs(c.estimate);
                                if (Math.abs(c.weight) > maxW) maxW = Math.abs(c.weight);
                            });
                            maxEst = Math.max(maxEst * 1.3, 1);
                            maxW = Math.max(maxW * 1.2, 0.1);

                            var estToY = function(e) { return plotT + plotH / 2 - (e / maxEst) * (plotH / 2); };
                            var wToX = function(w) { return plotL + (w / maxW) * plotW; };

                            // Zero line for estimate
                            ctx.strokeStyle = viz.colors.text + '33';
                            ctx.lineWidth = 0.5;
                            ctx.setLineDash([3, 3]);
                            var zeroY = estToY(0);
                            ctx.beginPath(); ctx.moveTo(plotL, zeroY); ctx.lineTo(plotR, zeroY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('0', plotL - 4, zeroY);
                            ctx.fillText(maxEst.toFixed(1), plotL - 4, plotT + 5);
                            ctx.fillText((-maxEst).toFixed(1), plotL - 4, plotB - 2);

                            // TWFE horizontal line
                            var twfeY = estToY(dec.twfe);
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 3]);
                            ctx.beginPath(); ctx.moveTo(plotL, twfeY); ctx.lineTo(plotR, twfeY); ctx.stroke();
                            ctx.setLineDash([]);

                            // True ATT line
                            var attY = estToY(dec.trueATT);
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 3]);
                            ctx.beginPath(); ctx.moveTo(plotL, attY); ctx.lineTo(plotR, attY); ctx.stroke();
                            ctx.setLineDash([]);

                            // Plot points (sized by weight)
                            for (var i = 0; i < dec.comparisons.length; i++) {
                                var c = dec.comparisons[i];
                                var px = wToX(c.weight);
                                var py = estToY(c.estimate);
                                var rad = Math.max(8, Math.abs(c.weight) * 60);

                                ctx.fillStyle = c.color + '55';
                                ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = c.color;
                                ctx.beginPath(); ctx.arc(px, py, rad * 0.6, 0, Math.PI * 2); ctx.fill();

                                // Label
                                ctx.fillStyle = c.color;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(c.label, px, py - rad - 6);
                                ctx.fillText('w=' + c.weight.toFixed(2) + ', est=' + c.estimate.toFixed(2), px, py + rad + 10);
                            }

                            // Right panel: summary
                            var rX = 450, rY = 80;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Decomposition Summary', rX, rY);

                            ctx.font = '11px -apple-system,sans-serif';
                            for (var i = 0; i < dec.comparisons.length; i++) {
                                var c = dec.comparisons[i];
                                var y = rY + 30 + i * 45;
                                ctx.fillStyle = c.color;
                                ctx.fillRect(rX, y - 5, 12, 12);
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText(c.label, rX + 18, y + 4);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('Weight: ' + c.weight.toFixed(3), rX + 18, y + 18);
                                ctx.fillText('Estimate: ' + c.estimate.toFixed(2), rX + 140, y + 18);
                                ctx.font = '11px -apple-system,sans-serif';
                            }

                            var sumY = rY + 30 + dec.comparisons.length * 45 + 15;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(rX, sumY - 5); ctx.lineTo(rX + 240, sumY - 5); ctx.stroke();

                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.fillText('TWFE = ' + dec.twfe.toFixed(3), rX, sumY + 12);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('True ATT = ' + dec.trueATT.toFixed(3), rX, sumY + 30);

                            var bias = dec.twfe - dec.trueATT;
                            ctx.fillStyle = Math.abs(bias) > 0.3 ? viz.colors.red : viz.colors.teal;
                            ctx.fillText('Bias = ' + bias.toFixed(3), rX, sumY + 48);

                            // Legend for lines
                            var legY = sumY + 75;
                            ctx.setLineDash([5, 3]);
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.beginPath(); ctx.moveTo(rX, legY); ctx.lineTo(rX + 20, legY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillText('TWFE estimate', rX + 25, legY + 3);

                            ctx.setLineDash([5, 3]);
                            ctx.strokeStyle = viz.colors.green;
                            ctx.beginPath(); ctx.moveTo(rX, legY + 18); ctx.lineTo(rX + 20, legY + 18); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('True ATT', rX + 25, legY + 21);
                        }

                        VizEngine.createSlider(controls, 'Early group effect', 1, 6, effectEarly, 0.5, function(v) { effectEarly = v; draw(); });
                        VizEngine.createSlider(controls, 'Late group effect', 1, 6, effectLate, 0.5, function(v) { effectLate = v; draw(); });
                        VizEngine.createSlider(controls, 'Growth rate', 0, 2, growthRate, 0.1, function(v) { growthRate = v; draw(); });
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch16-ex05',
                    type: 'concept',
                    difficulty: 3,
                    question: 'In the Goodman-Bacon decomposition, which 2x2 comparisons receive the largest weights? What determines weight magnitude?',
                    hints: ['Think about when the treatment variance is maximized.', 'Consider both group size and timing.'],
                    answer: 'Weights are proportional to (n_k + n_l)^2 times the variance of the treatment dummy in the 2x2 sub-panel. Treatment variance is maximized when the switch point is near the middle of the time period. So comparisons involving large groups that switch treatment near the midpoint of the panel receive the largest weights.'
                },
                {
                    id: 'ch16-ex06',
                    type: 'concept',
                    difficulty: 3,
                    question: 'Explain why the "Late vs. Early (post-early treatment)" comparison is called "contaminated" in the Bacon decomposition.',
                    hints: ['What is the outcome of an early-treated unit in a period after both groups are treated?', 'The control group is supposed to be untreated.'],
                    answer: 'In this comparison, the early-treated group serves as the "control" for the late-treated group. But after the early group has been treated, its outcomes already contain a treatment effect. The 2x2 DiD differences out the early group\'s post-treatment outcome changes, which include both time trends and evolving treatment effects. This means the resulting estimate does not recover the true ATT for the late group; instead, it captures the difference in treatment effects between late and early groups.'
                },
                {
                    id: 'ch16-ex07',
                    type: 'calculation',
                    difficulty: 3,
                    question: 'With 3 timing groups (Early g=2, Late g=6, Never-treated) and T=8, how many distinct 2x2 DiD comparisons appear in the Bacon decomposition? List them.',
                    hints: ['Each ordered pair of groups yields a comparison.', 'There are both (Early vs Late) and (Late vs Early) comparisons.'],
                    answer: 'There are 4 comparisons: (1) Early vs Never-treated, (2) Late vs Never-treated, (3) Early vs Late (pre-period t<6, Early treated, Late as control, clean), (4) Late vs Early (post-period t>=2, Late treated, Early as control, contaminated). Each pair of timing groups contributes one comparison from each direction in the relevant time windows.'
                },
                {
                    id: 'ch16-ex08',
                    type: 'concept',
                    difficulty: 2,
                    question: 'If you run the Bacon decomposition and find that 80% of TWFE weight comes from clean (treated vs. never-treated) comparisons, should you be concerned about TWFE bias?',
                    hints: ['What matters is not just the weight but the difference in estimates.', 'Even small-weight comparisons can bias if their estimates are very different.'],
                    answer: 'You should still check whether the contaminated comparisons have very different estimates from the clean ones. If the remaining 20% weight is on comparisons with drastically different estimates (e.g., negative when clean estimates are positive), the bias can still be substantial. However, if all comparisons yield similar estimates, the 80% dominance of clean comparisons is reassuring. The Bacon decomposition is a diagnostic: examine both weights AND estimates.'
                }
            ]
        },
        // --------------------------------------------------------
        // Section 3: Callaway-Sant'Anna Estimator
        // --------------------------------------------------------
        {
            id: 'ch16-sec03',
            title: "Callaway-Sant'Anna Estimator",
            content: `<h2>Callaway-Sant'Anna Estimator</h2>

<p>Callaway and Sant'Anna (2021) proposed a solution that avoids the pitfalls of TWFE by estimating <strong>group-time average treatment effects</strong> as the fundamental building blocks.</p>

<div class="env-block definition">
<div class="env-title">Definition (Group-Time ATT)</div>
<div class="env-body">
<p>For each group \\(g\\) (defined by treatment adoption time) and each time period \\(t \\ge g\\), define:</p>
\\[\\text{ATT}(g, t) = E[Y_t(1) - Y_t(0) \\mid G_i = g]\\]
<p>This is the average treatment effect on the treated for units in cohort \\(g\\) at time \\(t\\). It captures how the treatment effect varies both across cohorts and over time.</p>
</div>
</div>

<p>The key insight is to estimate each \\(\\text{ATT}(g, t)\\) separately using an appropriate control group, then aggregate these into summary measures.</p>

<div class="env-block theorem">
<div class="env-title">Identification of ATT(g,t)</div>
<div class="env-body">
<p>Under parallel trends conditional on covariates \\(X\\), and using the <strong>not-yet-treated</strong> (or never-treated) group as controls:</p>
\\[\\text{ATT}(g, t) = E\\left[\\frac{G_g}{E[G_g]} - \\frac{\\frac{p_g(X) C}{1 - p_g(X)}}{E\\left[\\frac{p_g(X) C}{1 - p_g(X)}\\right]}\\right](Y_t - Y_{g-1})\\]
<p>where \\(G_g = \\mathbf{1}\\{G_i = g\\}\\), \\(C\\) indicates control units, and \\(p_g(X) = P(G_i = g \\mid X, G_i \\in \\{g, C\\})\\) is the generalized propensity score. This is the <strong>doubly robust</strong> version: consistent if either the propensity score or the outcome model is correctly specified.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Control Group Choices</div>
<div class="env-body">
<p>Two main options for the control group \\(C\\):</p>
<ol>
<li><strong>Never-treated</strong>: \\(C = \\{i : G_i = \\infty\\}\\). Clean but requires a never-treated group exists.</li>
<li><strong>Not-yet-treated</strong>: \\(C = \\{i : G_i > t\\}\\). Larger control group (more power) but control set changes over time. Valid under stronger parallel trends assumption.</li>
</ol>
</div>
</div>

<h3>Aggregation Schemes</h3>
<p>Once you have the full set of \\(\\text{ATT}(g, t)\\) estimates, you can aggregate them in various ways depending on the research question:</p>

<div class="env-block definition">
<div class="env-title">Common Aggregations</div>
<div class="env-body">
<p><strong>1. Overall ATT</strong> (simple weighted average):</p>
\\[\\text{ATT}^{\\text{overall}} = \\sum_{g} \\sum_{t \\ge g} w_{g,t} \\cdot \\text{ATT}(g, t)\\]
<p>where \\(w_{g,t} = P(G_i = g, t \\ge g) / P(t \\ge G_i)\\).</p>

<p><strong>2. Dynamic (event-time) aggregation</strong>: averaging across cohorts at the same relative time \\(e = t - g\\):</p>
\\[\\theta(e) = \\sum_{g} w_g \\cdot \\text{ATT}(g, g + e)\\]
<p>This produces event study-style estimates without the TWFE contamination.</p>

<p><strong>3. Group-specific aggregation</strong>: averaging over time for each group:</p>
\\[\\theta(g) = \\frac{1}{T - g + 1} \\sum_{t=g}^{T} \\text{ATT}(g, t)\\]
</div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-cs-heatmap"></div>

<div class="env-block remark">
<div class="env-title">Practical Considerations</div>
<div class="env-body">
<p>The Callaway-Sant'Anna estimator is implemented in the R package <code>did</code> and the Stata command <code>csdid</code>. Key choices include:</p>
<ul>
<li>Control group: never-treated vs. not-yet-treated</li>
<li>Estimand: unconditional vs. conditional on covariates</li>
<li>Inference: analytical standard errors vs. multiplier bootstrap</li>
<li>Aggregation: overall, dynamic, group-specific, or calendar-time</li>
</ul>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch16-viz-cs-heatmap',
                    title: 'Group-Time ATT Heatmap',
                    description: 'Interactive heatmap showing ATT(g,t) for each cohort-time pair',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 720, height: 460, scale: 1, originX: 0, originY: 0});
                        var baseEffect = 2.0;
                        var growthRate = 0.5;
                        var cohortHet = 0.0;
                        var T = 10;
                        var groups = [3, 5, 7];

                        function computeATT(g, t) {
                            if (t < g) return null;
                            var exposure = t - g;
                            var cohortBonus = (g - 3) * cohortHet;
                            return baseEffect + cohortBonus + growthRate * exposure;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('ATT(g, t) Heatmap - Callaway-Sant\'Anna', viz.width / 2, 20, viz.colors.white, 14);

                            // Heatmap layout
                            var hmL = 120, hmT = 60, cellW = 48, cellH = 55;
                            var hmW = T * cellW, hmH = groups.length * cellH;

                            // Find range for color mapping
                            var minATT = Infinity, maxATT = -Infinity;
                            for (var gi = 0; gi < groups.length; gi++) {
                                for (var t = 1; t <= T; t++) {
                                    var att = computeATT(groups[gi], t);
                                    if (att !== null) {
                                        if (att < minATT) minATT = att;
                                        if (att > maxATT) maxATT = att;
                                    }
                                }
                            }
                            if (minATT === Infinity) { minATT = 0; maxATT = 1; }
                            var attRange = Math.max(maxATT - minATT, 0.1);

                            // Time labels (columns)
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            for (var t = 1; t <= T; t++) {
                                ctx.fillText('t=' + t, hmL + (t - 0.5) * cellW, hmT - 4);
                            }

                            // Group labels (rows)
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var gi = 0; gi < groups.length; gi++) {
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.fillText('g=' + groups[gi], hmL - 8, hmT + (gi + 0.5) * cellH);
                            }

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Time period (t)', hmL + hmW / 2, hmT - 22);
                            ctx.save();
                            ctx.translate(hmL - 55, hmT + hmH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('Cohort (g)', 0, 0);
                            ctx.restore();

                            // Draw cells
                            for (var gi = 0; gi < groups.length; gi++) {
                                for (var t = 1; t <= T; t++) {
                                    var cx = hmL + (t - 1) * cellW;
                                    var cy = hmT + gi * cellH;
                                    var att = computeATT(groups[gi], t);

                                    if (att === null) {
                                        // Pre-treatment: gray
                                        ctx.fillStyle = '#1a1a30';
                                        ctx.fillRect(cx + 1, cy + 1, cellW - 2, cellH - 2);
                                        ctx.fillStyle = viz.colors.text + '66';
                                        ctx.font = '9px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText('pre', cx + cellW / 2, cy + cellH / 2);
                                    } else {
                                        // Color by ATT value
                                        var frac = (att - minATT) / attRange;
                                        frac = Math.max(0, Math.min(1, frac));
                                        // Blue to orange gradient
                                        var r = Math.round(40 + frac * 200);
                                        var g = Math.round(100 + frac * 40);
                                        var b = Math.round(200 - frac * 150);
                                        ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                                        ctx.fillRect(cx + 1, cy + 1, cellW - 2, cellH - 2);

                                        // Value text
                                        ctx.fillStyle = frac > 0.5 ? '#ffffff' : '#e0e0e0';
                                        ctx.font = 'bold 11px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText(att.toFixed(1), cx + cellW / 2, cy + cellH / 2 - 6);

                                        // Event time label
                                        var e = t - groups[gi];
                                        ctx.fillStyle = frac > 0.5 ? '#ffffffaa' : '#c0c0c0aa';
                                        ctx.font = '8px -apple-system,sans-serif';
                                        ctx.fillText('e=' + e, cx + cellW / 2, cy + cellH / 2 + 10);
                                    }

                                    // Treatment onset border
                                    if (t === groups[gi]) {
                                        ctx.strokeStyle = viz.colors.yellow;
                                        ctx.lineWidth = 2.5;
                                        ctx.strokeRect(cx, cy, cellW, cellH);
                                    }
                                }
                            }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var t = 0; t <= T; t++) {
                                ctx.beginPath(); ctx.moveTo(hmL + t * cellW, hmT); ctx.lineTo(hmL + t * cellW, hmT + hmH); ctx.stroke();
                            }
                            for (var gi = 0; gi <= groups.length; gi++) {
                                ctx.beginPath(); ctx.moveTo(hmL, hmT + gi * cellH); ctx.lineTo(hmL + hmW, hmT + gi * cellH); ctx.stroke();
                            }

                            // Aggregation panel on right
                            var aX = hmL + hmW + 30, aY = hmT;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Aggregations', aX, aY);

                            // Dynamic aggregation (event time)
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Dynamic ATT(e):', aX, aY + 22);

                            var maxE = T - groups[0];
                            for (var e = 0; e <= Math.min(maxE, 5); e++) {
                                var sum = 0, count = 0;
                                for (var gi = 0; gi < groups.length; gi++) {
                                    var t = groups[gi] + e;
                                    if (t <= T) {
                                        sum += computeATT(groups[gi], t);
                                        count++;
                                    }
                                }
                                if (count > 0) {
                                    var avg = sum / count;
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fillText('e=' + e + ': ' + avg.toFixed(2), aX + 8, aY + 40 + e * 16);
                                }
                            }

                            // Group-specific
                            var gsY = aY + 140;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillText('Group ATT:', aX, gsY);

                            for (var gi = 0; gi < groups.length; gi++) {
                                var gSum = 0, gCount = 0;
                                for (var t = groups[gi]; t <= T; t++) {
                                    gSum += computeATT(groups[gi], t);
                                    gCount++;
                                }
                                var gAvg = gCount > 0 ? gSum / gCount : 0;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('g=' + groups[gi] + ': ' + gAvg.toFixed(2), aX + 8, gsY + 18 + gi * 16);
                            }

                            // Overall ATT
                            var oY = gsY + 80;
                            var oSum = 0, oCount = 0;
                            for (var gi = 0; gi < groups.length; gi++) {
                                for (var t = groups[gi]; t <= T; t++) {
                                    oSum += computeATT(groups[gi], t);
                                    oCount++;
                                }
                            }
                            var overallATT = oCount > 0 ? oSum / oCount : 0;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.fillText('Overall ATT: ' + overallATT.toFixed(2), aX, oY);

                            // Color bar legend
                            var cbY = oY + 35;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.fillText('ATT scale:', aX, cbY);
                            for (var ci = 0; ci < 60; ci++) {
                                var f = ci / 59;
                                var cr = Math.round(40 + f * 200);
                                var cg = Math.round(100 + f * 40);
                                var cb = Math.round(200 - f * 150);
                                ctx.fillStyle = 'rgb(' + cr + ',' + cg + ',' + cb + ')';
                                ctx.fillRect(aX + ci * 2, cbY + 10, 2, 12);
                            }
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText(minATT.toFixed(1), aX, cbY + 32);
                            ctx.textAlign = 'right';
                            ctx.fillText(maxATT.toFixed(1), aX + 120, cbY + 32);
                            ctx.textAlign = 'left';

                            // Yellow border = treatment onset note
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(aX, cbY + 42, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('= treatment onset', aX + 18, cbY + 52);
                        }

                        VizEngine.createSlider(controls, 'Base effect', 0.5, 5, baseEffect, 0.5, function(v) { baseEffect = v; draw(); });
                        VizEngine.createSlider(controls, 'Growth with exposure', 0, 2, growthRate, 0.1, function(v) { growthRate = v; draw(); });
                        VizEngine.createSlider(controls, 'Cohort heterogeneity', -2, 2, cohortHet, 0.5, function(v) { cohortHet = v; draw(); });
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch16-ex09',
                    type: 'concept',
                    difficulty: 3,
                    question: 'What is ATT(g,t) and why is it a more natural building block than a single TWFE coefficient for staggered DiD?',
                    hints: ['Think about what heterogeneity TWFE forces you to ignore.', 'ATT(g,t) lets the effect vary by both cohort and calendar time.'],
                    answer: 'ATT(g,t) = E[Y_t(1) - Y_t(0) | G_i = g] is the average treatment effect for cohort g at time t. It is a more natural building block because it allows treatment effects to vary freely across cohorts (group heterogeneity) and over time (dynamic effects). TWFE collapses all this variation into a single coefficient, potentially producing a meaningless weighted average with negative weights. By estimating ATT(g,t) separately for each cell, Callaway-Sant\'Anna avoids contamination and lets the researcher choose how to aggregate.'
                },
                {
                    id: 'ch16-ex10',
                    type: 'concept',
                    difficulty: 3,
                    question: 'Compare using never-treated vs. not-yet-treated units as the control group in the Callaway-Sant\'Anna framework. What are the tradeoffs?',
                    hints: ['Think about the parallel trends assumption.', 'Consider statistical power.'],
                    answer: 'Never-treated controls: (1) Cleaner because they never receive treatment, so parallel trends is more plausible. (2) But the control group may be smaller, reducing statistical power. (3) Requires that a never-treated group exists. Not-yet-treated controls: (1) Larger control group gives more power. (2) But requires a stronger assumption: parallel trends must hold between group g and all not-yet-treated groups at time t. (3) More susceptible to anticipation effects if soon-to-be-treated units change behavior before treatment.'
                },
                {
                    id: 'ch16-ex11',
                    type: 'calculation',
                    difficulty: 3,
                    question: 'You have three cohorts g=2, g=4, g=6 with T=7. How many distinct ATT(g,t) parameters can be estimated? List the (g,t) pairs.',
                    hints: ['ATT(g,t) is defined for t >= g.', 'Count all cells where treatment has occurred.'],
                    answer: 'For g=2: t = 2,3,4,5,6,7 (6 parameters). For g=4: t = 4,5,6,7 (4 parameters). For g=6: t = 6,7 (2 parameters). Total: 6 + 4 + 2 = 12 distinct ATT(g,t) parameters. These 12 cells form the "treatment region" of the group-time heatmap.'
                }
            ]
        },
        // --------------------------------------------------------
        // Section 4: Sun-Abraham & de Chaisemartin
        // --------------------------------------------------------
        {
            id: 'ch16-sec04',
            title: 'Sun-Abraham & de Chaisemartin-D\'Haultfoeuille',
            content: `<h2>Sun-Abraham & de Chaisemartin-D'Haultfoeuille</h2>

<p>Beyond Callaway-Sant'Anna, two other major frameworks address staggered DiD: the <strong>interaction-weighted (IW) estimator</strong> of Sun and Abraham (2021) and the <strong>DID\\(_M\\) estimator</strong> of de Chaisemartin and D'Haultfoeuille (2020).</p>

<h3>Sun-Abraham Interaction-Weighted Estimator</h3>

<div class="env-block definition">
<div class="env-title">Specification (Sun & Abraham, 2021)</div>
<div class="env-body">
<p>Instead of a single treatment dummy, interact cohort indicators with relative time (event-time) indicators:</p>
\\[Y_{it} = \\alpha_i + \\lambda_t + \\sum_{g \\neq \\infty} \\sum_{e \\neq -1} \\delta_{g,e} \\cdot \\mathbf{1}\\{G_i = g\\} \\cdot \\mathbf{1}\\{t - G_i = e\\} + \\varepsilon_{it}\\]
<p>The cohort-specific event-time effects \\(\\delta_{g,e}\\) recover \\(\\text{ATT}(g, g+e)\\) under parallel trends. These are then aggregated across cohorts with proper weights:</p>
\\[\\hat{\\theta}_{\\text{IW}}(e) = \\sum_g \\hat{w}_g \\cdot \\hat{\\delta}_{g,e}\\]
<p>where \\(\\hat{w}_g = P(G_i = g \\mid G_i \\neq \\infty)\\) are cohort share weights.</p>
</div>
</div>

<div class="env-block remark">
<div class="env-title">Why Not Just Event-Study TWFE?</div>
<div class="env-body">
<p>The standard event-study regression:</p>
\\[Y_{it} = \\alpha_i + \\lambda_t + \\sum_{e \\neq -1} \\mu_e \\cdot D_{it}^e + \\varepsilon_{it}\\]
<p>looks similar but <strong>does not include cohort interactions</strong>. Sun and Abraham (2021) show that the OLS coefficients \\(\\hat{\\mu}_e\\) are contaminated weighted averages of effects at <em>different</em> relative times. For instance, \\(\\hat{\\mu}_3\\) (the effect at 3 periods post-treatment) may include effects from 1 or 5 periods post-treatment for different cohorts.</p>
</div>
</div>

<h3>de Chaisemartin-D'Haultfoeuille DID\\(_M\\) Estimator</h3>

<div class="env-block definition">
<div class="env-title">The DID\\(_M\\) Estimator</div>
<div class="env-body">
<p>de Chaisemartin and D'Haultfoeuille (2020, 2022) propose:</p>
\\[\\text{DID}_M = \\sum_{\\ell=0}^{M} \\delta_\\ell\\]
<p>where each \\(\\delta_\\ell\\) estimates the average effect at relative time \\(\\ell\\):</p>
\\[\\delta_\\ell = \\sum_g w_{g,\\ell} \\left[ E[Y_{g+\\ell} - Y_{g-1} \\mid G = g] - E[Y_{g+\\ell} - Y_{g-1} \\mid \\text{control}] \\right]\\]
<p>The control group consists of units that are not yet treated at time \\(g + \\ell\\). Key feature: each \\(\\delta_\\ell\\) uses a <strong>different, appropriate</strong> control group, ensuring no contamination.</p>
</div>
</div>

<h3>Comparison of Modern Estimators</h3>

<div class="env-block">
<table style="width:100%;text-align:left;font-size:0.9rem;border-collapse:collapse;">
<tr style="border-bottom:1px solid #30363d;"><th style="padding:6px;">Feature</th><th style="padding:6px;">Callaway-Sant'Anna</th><th style="padding:6px;">Sun-Abraham</th><th style="padding:6px;">dCDH</th></tr>
<tr><td style="padding:6px;">Building block</td><td style="padding:6px;">ATT(g,t)</td><td style="padding:6px;">Cohort-by-event-time</td><td style="padding:6px;">Event-time \\(\\delta_\\ell\\)</td></tr>
<tr><td style="padding:6px;">Covariates</td><td style="padding:6px;">Doubly robust</td><td style="padding:6px;">Regression-based</td><td style="padding:6px;">Matching/regression</td></tr>
<tr><td style="padding:6px;">Control group</td><td style="padding:6px;">Never/not-yet-treated</td><td style="padding:6px;">Never-treated (last cohort)</td><td style="padding:6px;">Not-yet-treated</td></tr>
<tr><td style="padding:6px;">Software</td><td style="padding:6px;">R: did; Stata: csdid</td><td style="padding:6px;">R: fixest; Stata: eventstudyinteract</td><td style="padding:6px;">Stata: did_multiplegt_dyn</td></tr>
<tr><td style="padding:6px;">Non-absorbing treatment?</td><td style="padding:6px;">No (absorbing only)</td><td style="padding:6px;">No (absorbing only)</td><td style="padding:6px;">Yes</td></tr>
</table>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-compare-estimators"></div>

<div class="env-block remark">
<div class="env-title">Which Estimator to Use?</div>
<div class="env-body">
<p>All three modern estimators give similar results when treatment effects are homogeneous. They diverge primarily when effects are heterogeneous. Practical guidance:</p>
<ul>
<li>If you need covariate adjustment with doubly robust properties, use <strong>Callaway-Sant'Anna</strong>.</li>
<li>If you want a regression-based approach that integrates with existing <code>fixest</code> workflows, use <strong>Sun-Abraham</strong>.</li>
<li>If treatment is non-absorbing (units can switch in and out), use <strong>de Chaisemartin-D'Haultfoeuille</strong>.</li>
</ul>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch16-viz-compare-estimators',
                    title: 'TWFE vs Modern Estimators on Simulated Data',
                    description: 'Compare TWFE, Callaway-Sant\'Anna, Sun-Abraham, and dCDH estimates side by side',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 720, height: 460, scale: 1, originX: 0, originY: 0});
                        var trueEffect = 3.0;
                        var growthRate = 0.8;
                        var cohortHet = 1.0;

                        function simulate() {
                            var T = 10;
                            var groups = [{g: 3, n: 100}, {g: 6, n: 100}, {g: 9, n: 80}];
                            var nNever = 120;

                            // True ATT(g,t)
                            function tau(g, t) {
                                if (t < g) return 0;
                                var base = trueEffect + (g - 3) * cohortHet * 0.3;
                                return base + growthRate * (t - g);
                            }

                            // True overall ATT
                            var trueSum = 0, trueCount = 0;
                            for (var gi = 0; gi < groups.length; gi++) {
                                for (var t = groups[gi].g; t <= T; t++) {
                                    trueSum += tau(groups[gi].g, t);
                                    trueCount++;
                                }
                            }
                            var trueATT = trueSum / trueCount;

                            // TWFE: contaminated estimate
                            var twfeWeightedSum = 0;
                            var totalWeight = 0;
                            for (var gi = 0; gi < groups.length; gi++) {
                                var g = groups[gi].g;
                                for (var t = g; t <= T; t++) {
                                    var w = groups[gi].n * (1 - (g - 1) / T);
                                    // Contamination: subtract effect from earlier-treated controls
                                    var contamination = 0;
                                    for (var gj = 0; gj < gi; gj++) {
                                        var earlyG = groups[gj].g;
                                        if (t >= earlyG) {
                                            contamination += tau(earlyG, t) * 0.15;
                                        }
                                    }
                                    twfeWeightedSum += w * (tau(g, t) - contamination);
                                    totalWeight += w;
                                }
                            }
                            var twfeEst = totalWeight > 0 ? twfeWeightedSum / totalWeight : 0;

                            // CS estimator: clean ATT(g,t) average
                            var csEst = trueATT + (Math.random() - 0.5) * 0.15;

                            // Sun-Abraham: similar to CS but slightly different weighting
                            var saEst = trueATT + (Math.random() - 0.5) * 0.18;

                            // dCDH
                            var dchEst = trueATT + (Math.random() - 0.5) * 0.2;

                            // Event-time estimates
                            var maxE = T - 3;
                            var eventTime = [];
                            for (var e = -3; e <= maxE; e++) {
                                var trueDynamic = e < 0 ? 0 : trueEffect + growthRate * e;
                                var twfeDynamic = e < 0 ? (Math.random() - 0.5) * 0.3 : trueDynamic * (1 - 0.15 * e / maxE);
                                var csDynamic = e < 0 ? (Math.random() - 0.5) * 0.15 : trueDynamic + (Math.random() - 0.5) * 0.2;
                                eventTime.push({
                                    e: e,
                                    true_val: trueDynamic,
                                    twfe: twfeDynamic,
                                    cs: csDynamic
                                });
                            }

                            return {
                                trueATT: trueATT,
                                twfe: twfeEst,
                                cs: csEst,
                                sa: saEst,
                                dch: dchEst,
                                eventTime: eventTime
                            };
                        }

                        var simData = simulate();

                        function draw() {
                            simData = simulate();
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('TWFE vs Modern Estimators', viz.width / 2, 20, viz.colors.white, 14);

                            // Left panel: Overall ATT comparison (bar chart)
                            var barL = 50, barT = 60, barW = 250, barH = 350;
                            viz.screenText('Overall ATT Estimates', barL + barW / 2, 45, viz.colors.text, 11);

                            var estimates = [
                                {name: 'True ATT', value: simData.trueATT, color: viz.colors.white},
                                {name: 'TWFE', value: simData.twfe, color: viz.colors.red},
                                {name: 'CS', value: simData.cs, color: viz.colors.green},
                                {name: 'Sun-Abr.', value: simData.sa, color: viz.colors.blue},
                                {name: 'dCDH', value: simData.dch, color: viz.colors.purple}
                            ];

                            var maxVal = 0;
                            estimates.forEach(function(e) { if (Math.abs(e.value) > maxVal) maxVal = Math.abs(e.value); });
                            maxVal = Math.max(maxVal * 1.2, 1);

                            var bw = 36;
                            var gap = 10;
                            var totalBarsW = estimates.length * bw + (estimates.length - 1) * gap;
                            var startX = barL + (barW - totalBarsW) / 2;
                            var zeroY = barT + barH * 0.75;
                            var valScale = (barH * 0.6) / maxVal;

                            // Zero line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(barL, zeroY); ctx.lineTo(barL + barW, zeroY); ctx.stroke();

                            for (var i = 0; i < estimates.length; i++) {
                                var est = estimates[i];
                                var bx = startX + i * (bw + gap);
                                var bHeight = Math.abs(est.value) * valScale;
                                var by = est.value >= 0 ? zeroY - bHeight : zeroY;

                                ctx.fillStyle = est.color + '66';
                                ctx.fillRect(bx, by, bw, bHeight);
                                ctx.strokeStyle = est.color;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(bx, by, bw, bHeight);

                                // Value
                                ctx.fillStyle = est.color;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(est.value.toFixed(2), bx + bw / 2, by - 6);

                                // Label
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillText(est.name, bx + bw / 2, zeroY + bHeight + 16);
                            }

                            // Bias annotation
                            var biasVal = simData.twfe - simData.trueATT;
                            ctx.fillStyle = viz.colors.red;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('TWFE bias: ' + biasVal.toFixed(2), barL + barW / 2, barT + barH + 10);

                            // Right panel: event study comparison
                            var esL = 380, esT = 60, esW = 310, esH = 330;
                            viz.screenText('Event Study: TWFE vs CS', esL + esW / 2, 45, viz.colors.text, 11);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(esL, esT + esH); ctx.lineTo(esL + esW, esT + esH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(esL, esT); ctx.lineTo(esL, esT + esH); ctx.stroke();

                            // Scale
                            var minE = -3, maxE = simData.eventTime[simData.eventTime.length - 1].e;
                            var eRange = maxE - minE;
                            var maxY = 0;
                            simData.eventTime.forEach(function(et) {
                                maxY = Math.max(maxY, Math.abs(et.true_val), Math.abs(et.twfe), Math.abs(et.cs));
                            });
                            maxY = Math.max(maxY * 1.2, 1);

                            var eToX = function(e) { return esL + 20 + (e - minE) / eRange * (esW - 40); };
                            var yToScreen = function(y) { return esT + esH * 0.8 - (y / maxY) * (esH * 0.7); };

                            // Zero lines
                            var esZeroY = yToScreen(0);
                            ctx.strokeStyle = viz.colors.text + '33';
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(esL, esZeroY); ctx.lineTo(esL + esW, esZeroY); ctx.stroke();

                            // Treatment onset line
                            var x0 = eToX(0);
                            ctx.strokeStyle = viz.colors.yellow + '55';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath(); ctx.moveTo(x0, esT); ctx.lineTo(x0, esT + esH); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('e=0', x0, esT + esH + 12);

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            for (var e = minE; e <= maxE; e++) {
                                ctx.fillText(e.toString(), eToX(e), esT + esH + 12);
                            }
                            ctx.fillText('Event time (e)', esL + esW / 2, esT + esH + 28);

                            // Draw lines: true, twfe, cs
                            var series = [
                                {key: 'true_val', color: viz.colors.white, lw: 2, dash: [3, 3]},
                                {key: 'twfe', color: viz.colors.red, lw: 2, dash: []},
                                {key: 'cs', color: viz.colors.green, lw: 2, dash: []}
                            ];

                            for (var si = 0; si < series.length; si++) {
                                var s = series[si];
                                ctx.strokeStyle = s.color;
                                ctx.lineWidth = s.lw;
                                if (s.dash.length > 0) ctx.setLineDash(s.dash);
                                ctx.beginPath();
                                for (var ei = 0; ei < simData.eventTime.length; ei++) {
                                    var et = simData.eventTime[ei];
                                    var px = eToX(et.e);
                                    var py = yToScreen(et[s.key]);
                                    if (ei === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // Points
                                for (var ei = 0; ei < simData.eventTime.length; ei++) {
                                    var et = simData.eventTime[ei];
                                    var px = eToX(et.e);
                                    var py = yToScreen(et[s.key]);
                                    ctx.fillStyle = s.color;
                                    ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
                                }
                            }

                            // Legend
                            var legX = esL + 20, legY = esT + 10;
                            var legItems = [
                                {color: viz.colors.white, text: 'True effect', dash: [3, 3]},
                                {color: viz.colors.red, text: 'TWFE event study', dash: []},
                                {color: viz.colors.green, text: 'CS event study', dash: []}
                            ];
                            for (var li = 0; li < legItems.length; li++) {
                                var item = legItems[li];
                                ctx.strokeStyle = item.color;
                                ctx.lineWidth = 2;
                                if (item.dash.length > 0) ctx.setLineDash(item.dash);
                                ctx.beginPath(); ctx.moveTo(legX, legY + li * 16); ctx.lineTo(legX + 20, legY + li * 16); ctx.stroke();
                                ctx.setLineDash([]);
                                ctx.fillStyle = item.color;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(item.text, legX + 25, legY + li * 16 + 3);
                            }
                        }

                        VizEngine.createSlider(controls, 'True base effect', 1, 6, trueEffect, 0.5, function(v) { trueEffect = v; draw(); });
                        VizEngine.createSlider(controls, 'Effect growth rate', 0, 2, growthRate, 0.1, function(v) { growthRate = v; draw(); });
                        VizEngine.createSlider(controls, 'Cohort heterogeneity', 0, 3, cohortHet, 0.5, function(v) { cohortHet = v; draw(); });
                        VizEngine.createButton(controls, 'Re-simulate', function() { draw(); });
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch16-ex12',
                    type: 'concept',
                    difficulty: 3,
                    question: 'How does the Sun-Abraham interaction-weighted estimator fix the contamination problem in standard event-study TWFE regressions?',
                    hints: ['Think about what the cohort interactions achieve.', 'Without interactions, OLS averages across cohorts at each event time.'],
                    answer: 'The standard event-study TWFE regression estimates a single coefficient for each event time e, which OLS computes as a weighted average across all cohorts, potentially mixing effects from different relative times. Sun-Abraham saturates the model with cohort-by-event-time interactions, estimating a separate coefficient for each (g,e) pair. These cohort-specific effects are then aggregated with proper (non-negative) weights proportional to cohort shares. This ensures that the estimate at event time e only reflects effects at relative time e, with no contamination from other event times.'
                },
                {
                    id: 'ch16-ex13',
                    type: 'concept',
                    difficulty: 3,
                    question: 'What is a key advantage of the de Chaisemartin-D\'Haultfoeuille DID_M estimator over Callaway-Sant\'Anna and Sun-Abraham?',
                    hints: ['Think about what happens when units can switch treatment on and off.', 'Most DiD methods assume treatment is permanent once adopted.'],
                    answer: 'The key advantage of DID_M is that it can handle non-absorbing (switching) treatments, where units can move in and out of treatment status over time. Both Callaway-Sant\'Anna and Sun-Abraham require treatment to be absorbing (once treated, always treated). DID_M achieves this by constructing appropriate control groups period-by-period, comparing units whose treatment status changes to those whose status remains the same.'
                },
                {
                    id: 'ch16-ex14',
                    type: 'concept',
                    difficulty: 2,
                    question: 'Under what conditions do TWFE, Callaway-Sant\'Anna, Sun-Abraham, and dCDH all produce the same estimate?',
                    hints: ['When does the negative-weight problem disappear?', 'Think about what homogeneity means.'],
                    answer: 'All four estimators coincide when treatment effects are homogeneous: the same constant treatment effect for all cohorts at all post-treatment times. Under homogeneity, the weighting scheme does not matter because every 2x2 comparison yields the same estimate. Negative weights in TWFE become irrelevant when all underlying effects being weighted are identical. The estimators diverge precisely when effects are heterogeneous across cohorts or dynamic over time.'
                },
                {
                    id: 'ch16-ex15',
                    type: 'concept',
                    difficulty: 3,
                    question: 'A researcher has a staggered DiD with covariates and wants doubly robust estimation. The treatment is absorbing, and there is a large never-treated group. Which modern estimator should they choose, and why?',
                    hints: ['Which estimator has built-in doubly robust properties?', 'Consider the available features of each estimator.'],
                    answer: 'Callaway-Sant\'Anna is the best choice. It offers built-in doubly robust estimation (consistent if either the propensity score model or the outcome regression is correctly specified). The large never-treated group provides a clean control. Sun-Abraham is regression-based without formal doubly robust properties. dCDH can handle covariates but is primarily designed for non-absorbing treatments. Since treatment is absorbing here, CS\'s restrictions are satisfied and it provides the strongest covariate adjustment framework.'
                }
            ]
        },
        // --------------------------------------------------------
        // Section 5: Event Study Design
        // --------------------------------------------------------
        {
            id: 'ch16-sec05',
            title: 'Event Study Design',
            content: `<h2>Event Study Design</h2>

<p>The <strong>event study</strong> is both a research design and a visualization tool that traces out treatment effects at each relative time (event time) \\(e = t - G_i\\). It is arguably the most common way to present DiD results in applied economics.</p>

<h3>Event Study Specification</h3>

<div class="env-block definition">
<div class="env-title">Event Study Regression</div>
<div class="env-body">
<p>The standard event study regression estimates:</p>
\\[Y_{it} = \\alpha_i + \\lambda_t + \\sum_{e = -K}^{-2} \\mu_e \\cdot D^e_{it} + \\sum_{e=0}^{L} \\mu_e \\cdot D^e_{it} + \\varepsilon_{it}\\]
<p>where \\(D^e_{it} = \\mathbf{1}\\{t - G_i = e\\}\\) indicates that unit \\(i\\) is \\(e\\) periods from treatment at time \\(t\\). The reference period is \\(e = -1\\) (one period before treatment), so \\(\\mu_{-1} = 0\\) by normalization.</p>
<ul>
<li><strong>Pre-treatment coefficients</strong> \\(\\mu_{-K}, \\ldots, \\mu_{-2}\\): test the parallel trends assumption. Should be close to zero.</li>
<li><strong>Post-treatment coefficients</strong> \\(\\mu_0, \\mu_1, \\ldots, \\mu_L\\): trace out the dynamic treatment effect path.</li>
</ul>
</div>
</div>

<div class="env-block warning">
<div class="env-title">TWFE Event Study Contamination</div>
<div class="env-body">
<p>As shown in Section 4, running this event study via OLS with TWFE leads to contaminated estimates. The \\(\\hat{\\mu}_e\\) coefficients mix effects from different event times across cohorts. Use Sun-Abraham or Callaway-Sant'Anna for clean event study estimates.</p>
</div>
</div>

<h3>Pre-Trend Testing</h3>

<p>The pre-treatment coefficients provide a <strong>falsification test</strong> for the parallel trends assumption:</p>

<div class="env-block definition">
<div class="env-title">Pre-Trend Test</div>
<div class="env-body">
<p>If parallel trends holds, then for all \\(e < 0\\):</p>
\\[\\mu_e = 0\\]
<p>In practice, we test \\(H_0: \\mu_{-K} = \\mu_{-K+1} = \\cdots = \\mu_{-2} = 0\\) jointly (F-test) or examine individual confidence intervals.</p>
<p><strong>Important caveats</strong>:</p>
<ul>
<li>Failing to reject \\(H_0\\) does not prove parallel trends; the test may lack power.</li>
<li>Pre-trends close to zero but trending toward significance suggest potential violations.</li>
<li>Roth (2022) shows that pre-testing can distort inference on the post-treatment effects (pre-test bias).</li>
</ul>
</div>
</div>

<h3>Endpoint Binning</h3>

<div class="env-block definition">
<div class="env-title">Binned Endpoints</div>
<div class="env-body">
<p>With a finite panel, not all cohorts contribute to every event time. At the extremes (large \\(|e|\\)), only a few cohorts are represented. Standard practice is to <strong>bin</strong> the endpoints:</p>
\\[D^{\\le -K}_{it} = \\mathbf{1}\\{t - G_i \\le -K\\}, \\quad D^{\\ge L}_{it} = \\mathbf{1}\\{t - G_i \\ge L\\}\\]
<p>These bins collect all distant pre- and post-treatment periods into single categories. This:</p>
<ul>
<li>Avoids multicollinearity from having too many relative time dummies</li>
<li>Ensures each coefficient is estimated with adequate sample size</li>
<li>Absorbs composition effects from unbalanced event-time panels</li>
</ul>
</div>
</div>

<h3>Visualization Best Practices</h3>

<div class="env-block remark">
<div class="env-title">How to Present Event Studies</div>
<div class="env-body">
<p>Good event study plots should include:</p>
<ol>
<li><strong>Point estimates</strong> at each event time with <strong>confidence intervals</strong> (typically 95%).</li>
<li>A <strong>vertical line at \\(e = 0\\)</strong> (or between \\(e = -1\\) and \\(e = 0\\)) marking treatment onset.</li>
<li>A <strong>horizontal line at 0</strong> to judge magnitude and significance.</li>
<li><strong>Clear labeling</strong> of whether estimates are from TWFE or a modern estimator.</li>
<li><strong>Sensible endpoint binning</strong> (report how endpoints are handled).</li>
<li><strong>Both individual and joint</strong> significance of pre-trends.</li>
</ol>
</div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-event-study"></div>

<div class="env-block example">
<div class="env-title">Reading an Event Study Plot</div>
<div class="env-body">
<p>An ideal event study shows:</p>
<ul>
<li>Pre-treatment coefficients centered around zero (supporting parallel trends)</li>
<li>A jump at \\(e = 0\\) indicating an immediate treatment effect</li>
<li>Post-treatment coefficients that may grow, shrink, or remain constant depending on effect dynamics</li>
<li>Narrowing confidence intervals at event times with more observations</li>
</ul>
<p>Warning signs: trending pre-treatment coefficients (suggests violation of parallel trends), a discontinuity at \\(e = -1\\) vs \\(e = -2\\) (anticipation effects), or extremely wide confidence intervals (insufficient power).</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch16-viz-event-study',
                    title: 'Interactive Event Study Plot',
                    description: 'Explore event study dynamics with adjustable treatment effects, pre-trends, and confidence intervals',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 720, height: 460, scale: 1, originX: 0, originY: 0});
                        var immediateEffect = 2.0;
                        var growthRate = 0.3;
                        var preTrend = 0.0;
                        var noise = 0.3;
                        var showCI = true;

                        var seedData = null;
                        function regenerate() {
                            var K = 5; // pre-treatment periods
                            var L = 7; // post-treatment periods
                            seedData = [];
                            for (var e = -K; e <= L; e++) {
                                var trueEffect;
                                if (e < 0) {
                                    trueEffect = preTrend * e;
                                } else if (e === 0) {
                                    trueEffect = immediateEffect;
                                } else {
                                    trueEffect = immediateEffect + growthRate * e;
                                }
                                var se = noise * (1 + 0.3 * Math.abs(e) / Math.max(K, L));
                                var estimate = trueEffect + (Math.random() - 0.5) * 2 * se;
                                seedData.push({
                                    e: e,
                                    truth: trueEffect,
                                    estimate: estimate,
                                    se: se,
                                    ci_lo: estimate - 1.96 * se,
                                    ci_hi: estimate + 1.96 * se
                                });
                            }
                        }

                        regenerate();

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Event Study Plot', viz.width / 2, 20, viz.colors.white, 14);
                            viz.screenText('Coefficients relative to e = -1 (one period before treatment)', viz.width / 2, 38, viz.colors.text, 10);

                            // Plot area
                            var pL = 90, pT = 60, pW = 560, pH = 340;
                            var pR = pL + pW, pB = pT + pH;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(pL, pB); ctx.lineTo(pR, pB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pL, pT); ctx.lineTo(pL, pB); ctx.stroke();

                            // Determine scales
                            var minE = seedData[0].e, maxE = seedData[seedData.length - 1].e;
                            var eRange = maxE - minE;
                            var minY = Infinity, maxY = -Infinity;
                            for (var i = 0; i < seedData.length; i++) {
                                var d = seedData[i];
                                if (d.ci_lo < minY) minY = d.ci_lo;
                                if (d.ci_hi > maxY) maxY = d.ci_hi;
                                if (d.truth < minY) minY = d.truth;
                                if (d.truth > maxY) maxY = d.truth;
                            }
                            minY = Math.min(minY - 0.5, -1);
                            maxY = Math.max(maxY + 0.5, 1);
                            var yRange = maxY - minY;

                            var eToX = function(e) { return pL + 30 + (e - minE) / eRange * (pW - 60); };
                            var yToSc = function(y) { return pB - 20 - (y - minY) / yRange * (pH - 40); };

                            // Zero horizontal line
                            var zeroSy = yToSc(0);
                            ctx.strokeStyle = viz.colors.text + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(pL, zeroSy); ctx.lineTo(pR, zeroSy); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('0', pL - 6, zeroSy);

                            // Y-axis ticks
                            var yStep = yRange > 10 ? 2 : (yRange > 5 ? 1 : 0.5);
                            var yStart = Math.ceil(minY / yStep) * yStep;
                            for (var y = yStart; y <= maxY; y += yStep) {
                                var sy = yToSc(y);
                                if (sy > pT + 5 && sy < pB - 5) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'right';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(y.toFixed(1), pL - 6, sy);
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.3;
                                    ctx.beginPath(); ctx.moveTo(pL, sy); ctx.lineTo(pR, sy); ctx.stroke();
                                }
                            }

                            // Treatment onset vertical line (between e=-1 and e=0)
                            var treatX = (eToX(-0.5));
                            ctx.fillStyle = viz.colors.yellow + '18';
                            ctx.fillRect(treatX, pT, pR - treatX, pH);
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 3]);
                            ctx.beginPath(); ctx.moveTo(treatX, pT); ctx.lineTo(treatX, pB); ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Treatment', treatX, pT - 6);

                            // Pre/post labels
                            ctx.fillStyle = viz.colors.text + '66';
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Pre-treatment', (pL + treatX) / 2, pT + 14);
                            ctx.fillText('Post-treatment', (treatX + pR) / 2, pT + 14);

                            // True effect line (dashed)
                            ctx.strokeStyle = viz.colors.white + '55';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            for (var i = 0; i < seedData.length; i++) {
                                var d = seedData[i];
                                var px = eToX(d.e);
                                var py = yToSc(d.truth);
                                if (i === 0) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Confidence intervals
                            if (showCI) {
                                for (var i = 0; i < seedData.length; i++) {
                                    var d = seedData[i];
                                    if (d.e === -1) continue;
                                    var px = eToX(d.e);
                                    var pyLo = yToSc(d.ci_lo);
                                    var pyHi = yToSc(d.ci_hi);

                                    // CI band
                                    ctx.fillStyle = viz.colors.blue + '18';
                                    ctx.fillRect(px - 8, pyHi, 16, pyLo - pyHi);

                                    // CI lines
                                    ctx.strokeStyle = viz.colors.blue + '66';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath(); ctx.moveTo(px, pyLo); ctx.lineTo(px, pyHi); ctx.stroke();
                                    // Caps
                                    ctx.beginPath(); ctx.moveTo(px - 5, pyLo); ctx.lineTo(px + 5, pyLo); ctx.stroke();
                                    ctx.beginPath(); ctx.moveTo(px - 5, pyHi); ctx.lineTo(px + 5, pyHi); ctx.stroke();
                                }
                            }

                            // Point estimates (connected line + dots)
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var first = true;
                            for (var i = 0; i < seedData.length; i++) {
                                var d = seedData[i];
                                if (d.e === -1) continue;
                                var px = eToX(d.e);
                                var py = yToSc(d.estimate);
                                if (first) { ctx.moveTo(px, py); first = false; }
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            for (var i = 0; i < seedData.length; i++) {
                                var d = seedData[i];
                                if (d.e === -1) continue;
                                var px = eToX(d.e);
                                var py = yToSc(d.estimate);
                                var isSignificant = d.ci_lo > 0 || d.ci_hi < 0;
                                ctx.fillStyle = isSignificant ? viz.colors.blue : viz.colors.blue + '88';
                                ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = viz.colors.white;
                                ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.stroke();
                            }

                            // Reference point at e=-1
                            var refX = eToX(-1);
                            var refY = yToSc(0);
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.beginPath(); ctx.arc(refX, refY, 5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '8px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('ref', refX, refY - 10);

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var i = 0; i < seedData.length; i++) {
                                var d = seedData[i];
                                ctx.fillText(d.e.toString(), eToX(d.e), pB + 4);
                            }
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Event time (e = t - g)', pL + pW / 2, pB + 20);

                            // Y-axis label
                            ctx.save();
                            ctx.translate(pL - 50, pT + pH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('Estimated effect', 0, 0);
                            ctx.restore();

                            // Legend
                            var legX = pR - 180, legY = pB - 60;
                            ctx.fillStyle = '#0c0c20cc';
                            ctx.fillRect(legX - 5, legY - 5, 185, 55);

                            ctx.setLineDash([4, 4]);
                            ctx.strokeStyle = viz.colors.white + '55';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(legX, legY + 6); ctx.lineTo(legX + 18, legY + 6); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('True effect', legX + 23, legY + 9);

                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(legX + 9, legY + 22, 3, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(legX, legY + 22); ctx.lineTo(legX + 18, legY + 22); ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Estimated (with 95% CI)', legX + 23, legY + 25);

                            ctx.fillStyle = viz.colors.yellow;
                            ctx.beginPath(); ctx.arc(legX + 9, legY + 38, 3, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Reference (e = -1)', legX + 23, legY + 41);
                        }

                        VizEngine.createSlider(controls, 'Immediate effect (e=0)', 0, 5, immediateEffect, 0.5, function(v) {
                            immediateEffect = v; regenerate(); draw();
                        });
                        VizEngine.createSlider(controls, 'Effect growth per period', -0.5, 1.5, growthRate, 0.1, function(v) {
                            growthRate = v; regenerate(); draw();
                        });
                        VizEngine.createSlider(controls, 'Pre-trend slope', -0.5, 0.5, preTrend, 0.05, function(v) {
                            preTrend = v; regenerate(); draw();
                        });
                        VizEngine.createSlider(controls, 'Noise level', 0.1, 1.5, noise, 0.1, function(v) {
                            noise = v; regenerate(); draw();
                        });
                        VizEngine.createButton(controls, 'Re-draw (new random)', function() {
                            regenerate(); draw();
                        });
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch16-ex16',
                    type: 'concept',
                    difficulty: 2,
                    question: 'In an event study plot, what do the pre-treatment coefficients tell us? What should we see if the parallel trends assumption holds?',
                    hints: ['The reference period is e = -1.', 'Pre-treatment coefficients measure the outcome difference between treated and control groups before treatment.'],
                    answer: 'Pre-treatment coefficients measure the deviation of the treated-control outcome gap from its level at e = -1. If parallel trends holds, these deviations should be zero, because the treated and control groups would have been evolving in parallel before treatment. In practice, we look for pre-treatment coefficients that are close to zero and not statistically significant, both individually and jointly. Trending pre-treatment coefficients (e.g., steadily increasing toward the treatment date) suggest that parallel trends may be violated.'
                },
                {
                    id: 'ch16-ex17',
                    type: 'concept',
                    difficulty: 3,
                    question: 'Why is binning the endpoints of an event study important? What happens if you do not bin?',
                    hints: ['Think about which cohorts contribute to extreme event times.', 'Consider sample size at the endpoints.'],
                    answer: 'At extreme event times (large negative or positive e), only a few cohorts contribute. For example, only the earliest-treated cohort contributes to the largest positive event time. Without binning: (1) The estimates at extreme event times have large standard errors due to small effective sample sizes. (2) The composition of cohorts changes across event times, potentially confounding dynamic effects with cohort heterogeneity. (3) Multicollinearity can arise from too many event-time indicators relative to the number of time periods. Binning the endpoints collects extreme event times into single categories, improving precision and avoiding these composition issues.'
                },
                {
                    id: 'ch16-ex18',
                    type: 'concept',
                    difficulty: 3,
                    question: 'Roth (2022) warns about "pre-test bias." What is it, and why does it matter for event study inference?',
                    hints: ['What happens if you only report results when pre-trends pass a test?', 'Think about conditional inference.'],
                    answer: 'Pre-test bias arises when researchers condition on passing a pre-trend test before reporting post-treatment estimates. If pre-trends happen to be close to zero by chance (even though parallel trends is slightly violated), the researcher proceeds with biased post-treatment estimates while falsely believing parallel trends holds. The act of conditioning on passing the pre-test distorts the sampling distribution of the post-treatment estimates: you systematically select samples where noise happens to mask the true pre-trend. This means confidence intervals for post-treatment effects have incorrect coverage. Roth suggests using sensitivity analysis (e.g., bounding the amount of pre-trend violation) rather than binary pre-test decisions.'
                },
                {
                    id: 'ch16-ex19',
                    type: 'concept',
                    difficulty: 2,
                    question: 'List three features that a well-constructed event study plot should include and explain why each is important.',
                    hints: ['Think about what helps the reader assess both the pattern of effects and the credibility of the design.'],
                    answer: '(1) Confidence intervals at each event time: essential for judging statistical significance and precision. Without them, readers cannot distinguish large effects from noisy zeros. (2) A vertical line at treatment onset (e = 0): clearly separates the pre-treatment falsification region from the post-treatment effect region, making it easy to visually assess pre-trends and the timing of effects. (3) A horizontal line at zero: provides a reference for judging whether coefficients are meaningfully different from no effect. Together, these features allow readers to evaluate the parallel trends assumption (pre-treatment coefficients near zero), the treatment effect magnitude (post-treatment coefficients), and the statistical precision of the estimates.'
                }
            ]
        }
    ]
});
