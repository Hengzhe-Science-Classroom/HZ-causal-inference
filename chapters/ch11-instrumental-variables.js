// ============================================================
// Chapter 11 · Instrumental Variables
// Exploiting Exogenous Variation 工具变量
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch11',
    number: 11,
    title: 'Instrumental Variables',
    subtitle: 'Exploiting Exogenous Variation 工具变量',
    sections: [
        // --------------------------------------------------------
        // Section 1: Endogeneity & the IV Idea
        // --------------------------------------------------------
        {
            id: 'ch11-sec01',
            title: 'Endogeneity & the IV Idea',
            content: `<h2>Endogeneity & the IV Idea</h2>

<p>Throughout the previous chapters we assumed that, after conditioning on observables, treatment assignment was as good as random. But what happens when an <strong>unobserved confounder</strong> \\(U\\) affects both the treatment \\(X\\) and the outcome \\(Y\\)? In that case, OLS is <strong>biased and inconsistent</strong> &mdash; no matter how large the sample.</p>

<div class="env-block definition">
<div class="env-title">Definition (Endogeneity)</div>
<div class="env-body">
<p>A regressor \\(X\\) is <strong>endogenous</strong> if it is correlated with the error term \\(\\varepsilon\\) in the structural equation \\(Y = \\beta_0 + \\beta_1 X + \\varepsilon\\), i.e. \\(\\text{Cov}(X, \\varepsilon) \\neq 0\\). Sources of endogeneity include omitted variable bias, simultaneity, and measurement error.</p>
</div>
</div>

<p>Consider the canonical DAG with endogeneity:</p>
\\[Z \\longrightarrow X \\longrightarrow Y, \\qquad U \\longrightarrow X, \\quad U \\longrightarrow Y\\]
<p>Because \\(U\\) creates a back-door path \\(X \\leftarrow U \\rightarrow Y\\), a naive regression of \\(Y\\) on \\(X\\) conflates the causal effect \\(\\beta_1\\) with the confounding bias from \\(U\\).</p>

<div class="env-block intuition">
<div class="env-title">Intuition: The Key IV Idea</div>
<div class="env-body">
<p>An <strong>instrumental variable</strong> \\(Z\\) is a source of exogenous variation that "nudges" \\(X\\) without directly affecting \\(Y\\). Since \\(Z\\) only reaches \\(Y\\) through \\(X\\), the part of the variation in \\(X\\) driven by \\(Z\\) is free from confounding. By isolating this clean variation, we can recover the causal effect.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Classic IV Examples</div>
<div class="env-body">
<ul>
<li><strong>Weather as instrument for attendance:</strong> Rain affects whether people go to a baseball game (\\(X\\)) but has no direct effect on team performance (\\(Y\\)).</li>
<li><strong>Judge leniency:</strong> Random assignment to harsh vs. lenient judges affects incarceration (\\(X\\)) but does not directly affect future recidivism (\\(Y\\)), conditional on case type.</li>
<li><strong>Draft lottery number:</strong> Vietnam-era draft lottery numbers affected military service (\\(X\\)) but had no direct effect on later earnings (\\(Y\\)).</li>
</ul>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Instrumental Variable)</div>
<div class="env-body">
<p>A variable \\(Z\\) is an <strong>instrument</strong> for the causal effect of \\(X\\) on \\(Y\\) if:</p>
<ol>
<li><strong>Relevance:</strong> \\(\\text{Cov}(Z, X) \\neq 0\\)</li>
<li><strong>Exclusion restriction:</strong> \\(Z\\) affects \\(Y\\) only through \\(X\\)</li>
<li><strong>Independence:</strong> \\(Z \\perp\\!\\!\\perp U\\) (the instrument is exogenous)</li>
</ol>
</div>
</div>

<p>When these conditions hold, the causal effect can be identified even when unobserved confounders are present. The visualization below shows the IV DAG structure interactively.</p>

<div class="viz-placeholder" data-viz="ch11-viz-iv-dag"></div>

<p>The power of IV is that it turns an identification problem &mdash; the inability to close the back-door path through \\(U\\) &mdash; into a solvable problem by exploiting a <em>front-door-style</em> source of exogenous variation. We next formalize this idea through Two-Stage Least Squares.</p>`,
            visualizations: [
                {
                    id: 'ch11-viz-iv-dag',
                    title: 'IV DAG: Instrument, Treatment, Outcome & Confounder',
                    description: 'Toggle confounder and instrument paths to see how endogeneity arises and how IV resolves it.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var showConfounder = true;
                        var showInstrument = true;

                        VizEngine.createButton(controls, 'Toggle Confounder U', function() {
                            showConfounder = !showConfounder;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Toggle Instrument Z', function() {
                            showInstrument = !showInstrument;
                            draw();
                        });

                        function drawArrow(ctx, x1, y1, x2, y2, color, lw, dashed) {
                            var dx = x2 - x1, dy = y2 - y1;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            var headLen = 14;
                            ctx.strokeStyle = color;
                            ctx.lineWidth = lw || 2.5;
                            if (dashed) ctx.setLineDash([8, 5]);
                            ctx.beginPath();
                            ctx.moveTo(x1, y1);
                            ctx.lineTo(x2 - ux * headLen, y2 - uy * headLen);
                            ctx.stroke();
                            if (dashed) ctx.setLineDash([]);
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.moveTo(x2, y2);
                            ctx.lineTo(x2 - headLen * Math.cos(Math.atan2(dy, dx) - Math.PI / 7), y2 - headLen * Math.sin(Math.atan2(dy, dx) - Math.PI / 7));
                            ctx.lineTo(x2 - headLen * Math.cos(Math.atan2(dy, dx) + Math.PI / 7), y2 - headLen * Math.sin(Math.atan2(dy, dx) + Math.PI / 7));
                            ctx.closePath();
                            ctx.fill();
                        }

                        function drawNode(ctx, x, y, label, color, active) {
                            var r = 30;
                            ctx.fillStyle = active ? color + '33' : viz.colors.bg;
                            ctx.strokeStyle = active ? color : viz.colors.axis;
                            ctx.lineWidth = active ? 3 : 1.5;
                            ctx.beginPath();
                            ctx.arc(x, y, r, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                            ctx.fillStyle = active ? color : viz.colors.text;
                            ctx.font = 'bold 20px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(label, x, y);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            viz.screenText('Instrumental Variables DAG', W / 2, 25, viz.colors.white, 17);

                            // Node positions
                            var zx = 120, zy = 240;
                            var xx = 320, xy = 240;
                            var yx = 520, yy = 240;
                            var ux = 420, uy = 100;

                            // Edges
                            // Z -> X
                            if (showInstrument) {
                                drawArrow(ctx, zx + 32, zy, xx - 32, xy, viz.colors.teal, 3, false);
                                viz.screenText('First stage', (zx + xx) / 2, zy + 30, viz.colors.teal, 12);
                            }
                            // X -> Y (causal effect)
                            drawArrow(ctx, xx + 32, xy, yx - 32, yy, viz.colors.blue, 3, false);
                            viz.screenText('Causal effect', (xx + yx) / 2, xy + 30, viz.colors.blue, 12);

                            // U -> X and U -> Y (confounding)
                            if (showConfounder) {
                                drawArrow(ctx, ux - 20, uy + 28, xx + 10, xy - 28, viz.colors.red, 2.5, true);
                                drawArrow(ctx, ux + 20, uy + 28, yx - 10, yy - 28, viz.colors.red, 2.5, true);
                                viz.screenText('Confounding', ux, uy - 42, viz.colors.red, 12);
                            }

                            // Nodes
                            if (showInstrument) {
                                drawNode(ctx, zx, zy, 'Z', viz.colors.teal, true);
                                viz.screenText('Instrument', zx, zy + 48, viz.colors.teal, 12);
                            } else {
                                drawNode(ctx, zx, zy, 'Z', viz.colors.axis, false);
                                viz.screenText('Instrument', zx, zy + 48, viz.colors.axis, 12);
                            }
                            drawNode(ctx, xx, xy, 'X', viz.colors.blue, true);
                            viz.screenText('Treatment', xx, xy + 48, viz.colors.blue, 12);
                            drawNode(ctx, yx, yy, 'Y', viz.colors.green, true);
                            viz.screenText('Outcome', yx, yy + 48, viz.colors.green, 12);

                            if (showConfounder) {
                                drawNode(ctx, ux, uy, 'U', viz.colors.red, true);
                                viz.screenText('Unobserved', ux, uy + 48, viz.colors.red, 12);
                            } else {
                                drawNode(ctx, ux, uy, 'U', viz.colors.axis, false);
                                viz.screenText('Unobserved', ux, uy + 48, viz.colors.axis, 12);
                            }

                            // Status text
                            var statusY = H - 50;
                            if (showConfounder && !showInstrument) {
                                viz.screenText('OLS is biased: back-door path X <- U -> Y is open, no instrument to help', W / 2, statusY, viz.colors.red, 13);
                            } else if (showConfounder && showInstrument) {
                                viz.screenText('IV works: Z provides exogenous variation in X, bypassing the confounding from U', W / 2, statusY, viz.colors.teal, 13);
                            } else if (!showConfounder && !showInstrument) {
                                viz.screenText('No confounding: OLS is consistent (no need for IV)', W / 2, statusY, viz.colors.green, 13);
                            } else {
                                viz.screenText('No confounding: OLS is consistent, IV also valid but less efficient', W / 2, statusY, viz.colors.green, 13);
                            }

                            // Exclusion restriction note
                            if (showInstrument) {
                                ctx.setLineDash([4, 4]);
                                ctx.strokeStyle = viz.colors.axis + '44';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(zx + 25, zy - 25);
                                ctx.quadraticCurveTo(350, 340, yx - 25, yy + 15);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('No direct path (exclusion)', 320, 355, viz.colors.axis, 11);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the structural equation \\(Y = \\beta_0 + \\beta_1 X + \\varepsilon\\), suppose \\(\\text{Cov}(X, \\varepsilon) = 0.5\\), \\(\\text{Var}(X) = 2\\), and the true \\(\\beta_1 = 1\\). What does OLS converge to?',
                    hint: 'Recall that \\(\\text{plim}\\,\\hat{\\beta}_1^{OLS} = \\beta_1 + \\frac{\\text{Cov}(X, \\varepsilon)}{\\text{Var}(X)}\\).',
                    solution: `<p>The OLS estimator converges in probability to:</p>
\\[\\text{plim}\\,\\hat{\\beta}_1^{OLS} = \\beta_1 + \\frac{\\text{Cov}(X,\\varepsilon)}{\\text{Var}(X)} = 1 + \\frac{0.5}{2} = 1.25\\]
<p>OLS overstates the true effect by 0.25 due to endogeneity.</p>`
                },
                {
                    question: 'Why is "ability" a classic example of an omitted variable that creates endogeneity in estimating the returns to education? Draw the DAG.',
                    hint: 'Think about what ability affects: both education choices and wages.',
                    solution: `<p>Ability \\(U\\) is an unobserved confounder: individuals with higher ability tend to get more education (\\(U \\to X\\)) and also earn more independent of education (\\(U \\to Y\\)). The DAG is:</p>
\\[U \\to \\text{Education}(X), \\quad U \\to \\text{Wages}(Y), \\quad X \\to Y\\]
<p>The back-door path \\(X \\leftarrow U \\rightarrow Y\\) means regressing wages on education conflates the causal effect of schooling with ability bias.</p>`
                },
                {
                    question: 'Explain why "distance to the nearest college" might serve as an instrument for education in a wage regression. Which IV assumptions does it need to satisfy?',
                    hint: 'Think about Card (1993). Does distance to college plausibly affect wages only through education?',
                    solution: `<p>Card (1993) argued that distance to the nearest college affects years of schooling (relevance) because proximity reduces the cost of attendance. The key assumptions are:</p>
<ol>
<li><strong>Relevance:</strong> Living closer to a college increases educational attainment &mdash; verified empirically.</li>
<li><strong>Exclusion:</strong> Distance affects wages only through education, not directly. This is debatable: proximity to colleges may correlate with urbanicity, which affects wages.</li>
<li><strong>Independence:</strong> Distance is exogenous &mdash; not determined by individuals' potential outcomes. This requires that families do not sort based on children's future earnings potential.</li>
</ol>`
                },
                {
                    question: 'Suppose you have an instrument \\(Z\\) but \\(\\text{Cov}(Z, X) = 0\\). What goes wrong with IV estimation?',
                    hint: 'Think about the Wald estimator formula.',
                    solution: `<p>The Wald estimator is \\(\\hat{\\beta}_{IV} = \\frac{\\text{Cov}(Y, Z)}{\\text{Cov}(X, Z)}\\). If \\(\\text{Cov}(Z, X) = 0\\), we are dividing by zero (or near-zero in finite samples). This means:</p>
<ul>
<li>The instrument is <strong>irrelevant</strong> &mdash; it does not predict \\(X\\).</li>
<li>The IV estimator is undefined or has enormous variance.</li>
<li>In finite samples, even small violations of exclusion restriction are amplified, producing severe bias. This is the <strong>weak instrument</strong> problem (Chapter 12).</li>
</ul>`
                }
            ]
        },

        // --------------------------------------------------------
        // Section 2: Two-Stage Least Squares
        // --------------------------------------------------------
        {
            id: 'ch11-sec02',
            title: 'Two-Stage Least Squares',
            content: `<h2>Two-Stage Least Squares (2SLS)</h2>

<p>The IV idea can be operationalized through a simple two-step procedure called <strong>Two-Stage Least Squares</strong> (2SLS). The name tells you exactly what it does.</p>

<div class="env-block definition">
<div class="env-title">Definition (2SLS Procedure)</div>
<div class="env-body">
<p>Given structural equation \\(Y = \\beta_0 + \\beta_1 X + \\varepsilon\\) with instrument(s) \\(Z\\):</p>
<p><strong>First Stage:</strong> Regress the endogenous variable on the instrument(s):</p>
\\[X = \\pi_0 + \\pi_1 Z + v\\]
<p>Obtain the fitted values \\(\\hat{X} = \\hat{\\pi}_0 + \\hat{\\pi}_1 Z\\).</p>
<p><strong>Second Stage:</strong> Regress the outcome on the fitted values:</p>
\\[Y = \\beta_0 + \\beta_1 \\hat{X} + \\text{error}\\]
<p>The coefficient \\(\\hat{\\beta}_1^{2SLS}\\) is a consistent estimator of the causal effect \\(\\beta_1\\).</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Why Does 2SLS Work?</div>
<div class="env-body">
<p>The first stage decomposes \\(X\\) into two parts: \\(\\hat{X}\\) (the part predicted by \\(Z\\), which is exogenous) and the residual \\(v\\) (which contains the endogenous variation correlated with \\(\\varepsilon\\)). By using only \\(\\hat{X}\\) in the second stage, we discard the contaminated variation and isolate the causal effect.</p>
</div>
</div>

<h3>The Wald Estimator</h3>
<p>With a single binary instrument \\(Z \\in \\{0,1\\}\\), the IV estimator reduces to the <strong>Wald estimator</strong>:</p>
\\[\\hat{\\beta}_{IV} = \\frac{\\bar{Y}_{Z=1} - \\bar{Y}_{Z=0}}{\\bar{X}_{Z=1} - \\bar{X}_{Z=0}} = \\frac{\\text{Reduced-form effect on } Y}{\\text{First-stage effect on } X}\\]
<p>This ratio has a beautiful intuition: the numerator is the <em>intention-to-treat</em> (ITT) effect of \\(Z\\) on \\(Y\\), and the denominator scales it by how strongly \\(Z\\) actually shifts \\(X\\).</p>

<h3>With Multiple Instruments</h3>
<p>When we have multiple instruments \\(Z_1, Z_2, \\ldots, Z_L\\) for a single endogenous variable \\(X\\):</p>
\\[\\text{First stage: } X = \\pi_0 + \\pi_1 Z_1 + \\pi_2 Z_2 + \\cdots + \\pi_L Z_L + v\\]
<p>The fitted values \\(\\hat{X}\\) combine information from all instruments optimally. The general 2SLS estimator is:</p>
\\[\\hat{\\beta}^{2SLS} = (\\hat{X}'\\hat{X})^{-1}\\hat{X}' Y\\]
<p>where \\(\\hat{X}\\) denotes the matrix of fitted values from the first stage. With more instruments than endogenous variables (\\(L > 1\\)), we say the model is <strong>overidentified</strong>, and we can test the validity of instruments using the Sargan-Hansen J-test.</p>

<div class="env-block theorem">
<div class="env-title">Theorem (Consistency of 2SLS)</div>
<div class="env-body">
<p>Under the assumptions of instrument relevance (\\(\\pi_1 \\neq 0\\)), exclusion restriction, and exogeneity of \\(Z\\), the 2SLS estimator is consistent:</p>
\\[\\hat{\\beta}_1^{2SLS} \\xrightarrow{p} \\beta_1\\]
<p>Moreover, \\(\\sqrt{n}(\\hat{\\beta}_1^{2SLS} - \\beta_1) \\xrightarrow{d} N(0, V)\\) where \\(V = \\sigma^2_{\\varepsilon}(\\text{Var}(\\hat{X}))^{-1}\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch11-viz-2sls"></div>

<p>A critical point: standard errors from the second-stage OLS regression are <strong>incorrect</strong> &mdash; they ignore the estimation uncertainty from the first stage. Proper 2SLS standard errors adjust for this, and most statistical software handles this automatically.</p>`,
            visualizations: [
                {
                    id: 'ch11-viz-2sls',
                    title: 'Interactive Two-Stage Least Squares',
                    description: 'Adjust instrument strength and confounding to see how 2SLS isolates the causal effect. Red = OLS (biased), Blue = 2SLS (consistent).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 500, scale: 30, originX: 80, originY: 420});
                        var confoundStrength = 0.8;
                        var instrumentStrength = 0.7;
                        var trueBeta = 1.0;
                        var n = 200;
                        var seed = 42;
                        var data = null;

                        function seededRandom(s) {
                            return function() {
                                s = (s * 16807 + 0) % 2147483647;
                                return (s - 1) / 2147483646;
                            };
                        }

                        function boxMuller(rng) {
                            var u1 = rng(), u2 = rng();
                            while (u1 === 0) u1 = rng();
                            return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                        }

                        function generateData() {
                            var rng = seededRandom(seed);
                            var pts = [];
                            for (var i = 0; i < n; i++) {
                                var z = rng() > 0.5 ? 1 : 0;
                                var u = boxMuller(rng);
                                var vx = boxMuller(rng);
                                var ey = boxMuller(rng);
                                var x = 2 + instrumentStrength * 3 * z + confoundStrength * 2 * u + vx;
                                var y = 1 + trueBeta * x + confoundStrength * 2 * u + ey;
                                pts.push({z: z, x: x, y: y, u: u});
                            }
                            return pts;
                        }

                        function olsCoef(xs, ys) {
                            var mx = VizEngine.mean(xs), my = VizEngine.mean(ys);
                            var num = 0, den = 0;
                            for (var i = 0; i < xs.length; i++) {
                                num += (xs[i] - mx) * (ys[i] - my);
                                den += (xs[i] - mx) * (xs[i] - mx);
                            }
                            var slope = den > 0 ? num / den : 0;
                            var intercept = my - slope * mx;
                            return {slope: slope, intercept: intercept};
                        }

                        VizEngine.createSlider(controls, 'Confounding', 0, 1.5, confoundStrength, 0.1, function(v) {
                            confoundStrength = v;
                            data = null;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Instrument Strength', 0.1, 2.0, instrumentStrength, 0.1, function(v) {
                            instrumentStrength = v;
                            data = null;
                            draw();
                        });
                        VizEngine.createButton(controls, 'New Sample', function() {
                            seed = Math.floor(Math.random() * 100000);
                            data = null;
                            draw();
                        });

                        function draw() {
                            if (!data) data = generateData();
                            viz.clear();
                            var ctx = viz.ctx;

                            // Axes labels
                            viz.screenText('X (Treatment)', viz.width / 2, viz.height - 10, viz.colors.text, 12);
                            ctx.save();
                            ctx.translate(15, viz.height / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Y (Outcome)', 0, 0);
                            ctx.restore();

                            // Draw grid
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var gx = 0; gx <= 12; gx += 2) {
                                var sx = viz.originX + gx * viz.scale;
                                ctx.beginPath(); ctx.moveTo(sx, 30); ctx.lineTo(sx, viz.originY); ctx.stroke();
                                viz.screenText(String(gx), sx, viz.originY + 12, viz.colors.text, 10);
                            }
                            for (var gy = 0; gy <= 12; gy += 2) {
                                var sy = viz.originY - gy * viz.scale;
                                ctx.beginPath(); ctx.moveTo(viz.originX, sy); ctx.lineTo(viz.width - 10, sy); ctx.stroke();
                                viz.screenText(String(gy), viz.originX - 15, sy, viz.colors.text, 10);
                            }

                            // Scatter points
                            var xs = data.map(function(d) { return d.x; });
                            var ys = data.map(function(d) { return d.y; });
                            var zs = data.map(function(d) { return d.z; });

                            for (var i = 0; i < data.length; i++) {
                                var px = viz.originX + data[i].x * viz.scale;
                                var py = viz.originY - data[i].y * viz.scale;
                                if (px < viz.originX || px > viz.width - 10 || py < 30 || py > viz.originY) continue;
                                ctx.fillStyle = data[i].z === 1 ? viz.colors.teal + '66' : viz.colors.orange + '66';
                                ctx.beginPath();
                                ctx.arc(px, py, 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // OLS line
                            var olsResult = olsCoef(xs, ys);
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2.5;
                            ctx.setLineDash([]);
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, viz.originY - olsResult.intercept * viz.scale);
                            ctx.lineTo(viz.originX + 12 * viz.scale, viz.originY - (olsResult.intercept + olsResult.slope * 12) * viz.scale);
                            ctx.stroke();

                            // 2SLS: first stage
                            var firstStage = olsCoef(zs, xs);
                            var xHat = zs.map(function(z) { return firstStage.intercept + firstStage.slope * z; });
                            var ivResult = olsCoef(xHat, ys);

                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, viz.originY - ivResult.intercept * viz.scale);
                            ctx.lineTo(viz.originX + 12 * viz.scale, viz.originY - (ivResult.intercept + ivResult.slope * 12) * viz.scale);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // True line
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([3, 3]);
                            var trueIntercept = 1;
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, viz.originY - trueIntercept * viz.scale);
                            ctx.lineTo(viz.originX + 12 * viz.scale, viz.originY - (trueIntercept + trueBeta * 12) * viz.scale);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Legend
                            var lx = viz.width - 220, ly = 45;
                            ctx.fillStyle = viz.colors.bg + 'cc';
                            ctx.fillRect(lx - 10, ly - 15, 220, 100);

                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(lx, ly, 20, 3);
                            viz.screenText('OLS: slope = ' + olsResult.slope.toFixed(2), lx + 30, ly + 2, viz.colors.red, 12, 'left');

                            ctx.fillStyle = viz.colors.blue;
                            ctx.setLineDash([6, 4]);
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(lx, ly + 25); ctx.lineTo(lx + 20, ly + 25); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('2SLS: slope = ' + ivResult.slope.toFixed(2), lx + 30, ly + 27, viz.colors.blue, 12, 'left');

                            ctx.setLineDash([3, 3]);
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(lx, ly + 50); ctx.lineTo(lx + 20, ly + 50); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('True: slope = ' + trueBeta.toFixed(2), lx + 30, ly + 52, viz.colors.green, 12, 'left');

                            // Point legend
                            ctx.fillStyle = viz.colors.teal + '99';
                            ctx.beginPath(); ctx.arc(lx + 10, ly + 75, 4, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('Z=1', lx + 30, ly + 77, viz.colors.teal, 11, 'left');
                            ctx.fillStyle = viz.colors.orange + '99';
                            ctx.beginPath(); ctx.arc(lx + 70, ly + 75, 4, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('Z=0', lx + 90, ly + 77, viz.colors.orange, 11, 'left');
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show algebraically that the Wald estimator \\(\\hat{\\beta}_{IV} = \\frac{\\text{Cov}(Y,Z)}{\\text{Cov}(X,Z)}\\) is consistent for \\(\\beta_1\\) under the three IV assumptions.',
                    hint: 'Substitute \\(Y = \\beta_0 + \\beta_1 X + \\varepsilon\\) into the numerator and use the assumption that \\(\\text{Cov}(Z, \\varepsilon) = 0\\).',
                    solution: `<p>Substitute \\(Y = \\beta_0 + \\beta_1 X + \\varepsilon\\):</p>
\\[\\frac{\\text{Cov}(Y,Z)}{\\text{Cov}(X,Z)} = \\frac{\\text{Cov}(\\beta_0 + \\beta_1 X + \\varepsilon, Z)}{\\text{Cov}(X,Z)} = \\frac{\\beta_1 \\text{Cov}(X,Z) + \\text{Cov}(\\varepsilon,Z)}{\\text{Cov}(X,Z)}\\]
<p>By exogeneity, \\(\\text{Cov}(\\varepsilon,Z) = 0\\), and by relevance, \\(\\text{Cov}(X,Z) \\neq 0\\). Thus:</p>
\\[\\hat{\\beta}_{IV} \\xrightarrow{p} \\frac{\\beta_1 \\text{Cov}(X,Z)}{\\text{Cov}(X,Z)} = \\beta_1\\]`
                },
                {
                    question: 'In the first stage of 2SLS, the R-squared is 0.02. Should you be concerned? Why?',
                    hint: 'Think about the Stock-Yogo weak instruments test and the rule of thumb for the first-stage F-statistic.',
                    solution: `<p>Yes, this is very concerning. A first-stage R-squared of 0.02 suggests a <strong>weak instrument</strong>. The key diagnostic is the first-stage F-statistic. Stock and Yogo (2005) recommend \\(F > 10\\) as a rule of thumb. With weak instruments:</p>
<ul>
<li>2SLS is biased toward OLS (in the direction of the endogeneity bias).</li>
<li>Confidence intervals have incorrect coverage (actual rejection rates far exceed nominal levels).</li>
<li>The Anderson-Rubin test provides valid inference even with weak instruments.</li>
</ul>`
                },
                {
                    question: 'You have two instruments \\(Z_1, Z_2\\) for a single endogenous variable \\(X\\). Write down the 2SLS procedure and explain what "overidentification" means.',
                    hint: 'The first stage uses both instruments. Overidentification means more instruments than endogenous regressors.',
                    solution: `<p><strong>First stage:</strong> \\(X = \\pi_0 + \\pi_1 Z_1 + \\pi_2 Z_2 + v\\). Compute \\(\\hat{X}\\).</p>
<p><strong>Second stage:</strong> \\(Y = \\beta_0 + \\beta_1 \\hat{X} + \\text{error}\\).</p>
<p><strong>Overidentification</strong> means we have more instruments (\\(L = 2\\)) than endogenous variables (\\(K = 1\\)). The model is overidentified by \\(L - K = 1\\) degrees of freedom. This allows a testable restriction: if both instruments are valid, they should yield similar estimates. The <strong>Sargan-Hansen J-test</strong> tests \\(H_0\\): all instruments are valid. Rejection suggests at least one instrument violates the exclusion restriction.</p>`
                },
                {
                    question: 'Why are 2SLS standard errors from simply running the second-stage OLS regression incorrect? What do they miss?',
                    hint: 'The second stage uses \\(\\hat{X}\\), not \\(X\\). How does this affect the residual variance estimate?',
                    solution: `<p>Naive second-stage OLS uses residuals \\(\\hat{e} = Y - \\hat{\\beta}_0 - \\hat{\\beta}_1 \\hat{X}\\), but the true residuals are \\(e = Y - \\hat{\\beta}_0 - \\hat{\\beta}_1 X\\). Since \\(\\hat{X} \\neq X\\), the naive residuals are computed at the wrong point, leading to:</p>
<ul>
<li>An incorrect estimate of \\(\\sigma^2_{\\varepsilon}\\) (typically too small).</li>
<li>Standard errors that are too narrow, giving overly optimistic confidence intervals.</li>
</ul>
<p>Proper 2SLS standard errors use \\(\\hat{\\sigma}^2 = \\frac{1}{n-k}\\sum(Y_i - \\hat{\\beta}_0 - \\hat{\\beta}_1 X_i)^2\\) (residuals based on actual \\(X\\), not \\(\\hat{X}\\)), combined with the variance formula that accounts for the first-stage estimation.</p>`
                }
            ]
        },

        // --------------------------------------------------------
        // Section 3: IV Assumptions
        // --------------------------------------------------------
        {
            id: 'ch11-sec03',
            title: 'IV Assumptions',
            content: `<h2>IV Assumptions in Depth</h2>

<p>The validity of IV estimation rests on three core assumptions. Violating any one of them can invalidate the entire analysis. Let us examine each assumption carefully, understand what can go wrong, and discuss how to assess their plausibility.</p>

<div class="env-block definition">
<div class="env-title">Assumption 1: Relevance</div>
<div class="env-body">
\\[\\text{Cov}(Z, X) \\neq 0\\]
<p>The instrument must be correlated with the endogenous variable. This is the <strong>only testable</strong> IV assumption &mdash; we can check it by examining the first-stage regression coefficient and F-statistic.</p>
</div>
</div>

<p>When relevance is weak (\\(\\text{Cov}(Z,X) \\approx 0\\)), we have a <strong>weak instrument</strong>. The consequences are severe:</p>
<ul>
<li>2SLS bias toward OLS: \\(\\text{Bias}_{2SLS} \\approx \\frac{1}{F} \\times \\text{Bias}_{OLS}\\)</li>
<li>Hugely inflated variance and unreliable confidence intervals</li>
<li>Rule of thumb: first-stage \\(F > 10\\) (Stock, Wright & Yogo, 2002)</li>
</ul>

<div class="env-block definition">
<div class="env-title">Assumption 2: Exclusion Restriction</div>
<div class="env-body">
<p>\\(Z\\) affects \\(Y\\) <strong>only through</strong> \\(X\\). Formally, in the structural equation \\(Y = \\beta_0 + \\beta_1 X + \\gamma Z + \\varepsilon\\), we require \\(\\gamma = 0\\). This assumption is <strong>not testable</strong> with a single instrument and must be justified by domain knowledge and economic reasoning.</p>
</div>
</div>

<p>The exclusion restriction is typically the most controversial and debated assumption. Consider:</p>
<ul>
<li><strong>Quarter of birth as IV for education:</strong> Does birth quarter affect wages only through education? Possibly not if it affects other early-life conditions.</li>
<li><strong>Rainfall as IV for conflict:</strong> Does rainfall affect economic outcomes only through conflict? It could also directly affect agriculture.</li>
</ul>

<div class="env-block definition">
<div class="env-title">Assumption 3: Independence (Exogeneity)</div>
<div class="env-body">
\\[Z \\perp\\!\\!\\perp (Y^0, Y^1) \\quad \\text{or equivalently} \\quad \\text{Cov}(Z, \\varepsilon) = 0\\]
<p>The instrument must be independent of potential outcomes &mdash; i.e., it is "as good as randomly assigned." This rules out confounders that affect both \\(Z\\) and \\(Y\\).</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Assumption 4: Monotonicity (for Heterogeneous Effects)</div>
<div class="env-body">
<p>When treatment effects are heterogeneous, we additionally need monotonicity: for all units \\(i\\),</p>
\\[X_i(Z=1) \\geq X_i(Z=0) \\quad \\text{or} \\quad X_i(Z=1) \\leq X_i(Z=0)\\]
<p>This rules out <strong>defiers</strong> &mdash; units who do the opposite of what the instrument encourages. Monotonicity is required for the LATE interpretation (Section 4).</p>
</div>
</div>

<p>The visualization below demonstrates what happens when each assumption is violated.</p>

<div class="viz-placeholder" data-viz="ch11-viz-assumptions"></div>

<div class="env-block example">
<div class="env-title">Assessing IV Assumptions in Practice</div>
<div class="env-body">
<table style="width:100%; border-collapse:collapse; margin:10px 0;">
<tr style="border-bottom:1px solid #333;"><th style="text-align:left;padding:4px;">Assumption</th><th style="text-align:left;padding:4px;">Testable?</th><th style="text-align:left;padding:4px;">Diagnostic</th></tr>
<tr><td style="padding:4px;">Relevance</td><td style="padding:4px;">Yes</td><td style="padding:4px;">First-stage F-statistic</td></tr>
<tr><td style="padding:4px;">Exclusion</td><td style="padding:4px;">No (with 1 IV)</td><td style="padding:4px;">Economic reasoning; overid test with multiple IVs</td></tr>
<tr><td style="padding:4px;">Independence</td><td style="padding:4px;">Partially</td><td style="padding:4px;">Balance tests on observables; falsification tests</td></tr>
<tr><td style="padding:4px;">Monotonicity</td><td style="padding:4px;">No</td><td style="padding:4px;">Domain knowledge; check for defiers</td></tr>
</table>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch11-viz-assumptions',
                    title: 'What Happens When IV Assumptions Fail?',
                    description: 'Select which assumption to violate and observe the effect on the IV estimate. The green dashed line is the true causal effect.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 460});
                        var violation = 'none';
                        var violationDegree = 0.5;

                        var btnNone = VizEngine.createButton(controls, 'No Violation', function() { violation = 'none'; draw(); });
                        var btnWeak = VizEngine.createButton(controls, 'Weak Instrument', function() { violation = 'weak'; draw(); });
                        var btnExcl = VizEngine.createButton(controls, 'Exclusion Violated', function() { violation = 'exclusion'; draw(); });
                        var btnExog = VizEngine.createButton(controls, 'Exogeneity Violated', function() { violation = 'exogeneity'; draw(); });
                        VizEngine.createSlider(controls, 'Violation Severity', 0, 1, violationDegree, 0.05, function(v) { violationDegree = v; draw(); });

                        function seededRandom(s) {
                            return function() { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
                        }
                        function boxMuller(rng) {
                            var u1 = rng(), u2 = rng();
                            while (u1 === 0) u1 = rng();
                            return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                        }

                        function simulate() {
                            var rng = seededRandom(12345);
                            var trueBeta = 1.0;
                            var nSim = 500;
                            var estimates = [];
                            for (var rep = 0; rep < nSim; rep++) {
                                var rng2 = seededRandom(rep * 137 + 7);
                                var pts = [];
                                var nPts = 200;
                                for (var i = 0; i < nPts; i++) {
                                    var u = boxMuller(rng2);
                                    var ez = boxMuller(rng2);
                                    var ex = boxMuller(rng2);
                                    var ey = boxMuller(rng2);

                                    var zBase = rng2() > 0.5 ? 1 : 0;
                                    var z = zBase;
                                    if (violation === 'exogeneity') {
                                        z = (rng2() < 0.5 + violationDegree * 0.4 * u) ? 1 : 0;
                                    }

                                    var piStrength = violation === 'weak' ? 0.1 * (1 - violationDegree) + 0.01 : 0.8;
                                    var x = 2 + piStrength * 3 * z + 0.7 * u + ex;

                                    var directEffect = violation === 'exclusion' ? violationDegree * 2 : 0;
                                    var y = 1 + trueBeta * x + 0.7 * u + directEffect * z + ey;

                                    pts.push({z: z, x: x, y: y});
                                }

                                var xs = pts.map(function(d) { return d.x; });
                                var ys = pts.map(function(d) { return d.y; });
                                var zs = pts.map(function(d) { return d.z; });

                                var covyz = 0, covxz = 0, mz = VizEngine.mean(zs), mx = VizEngine.mean(xs), my = VizEngine.mean(ys);
                                for (var j = 0; j < nPts; j++) {
                                    covyz += (ys[j] - my) * (zs[j] - mz);
                                    covxz += (xs[j] - mx) * (zs[j] - mz);
                                }
                                covyz /= nPts;
                                covxz /= nPts;
                                var est = Math.abs(covxz) > 0.001 ? covyz / covxz : NaN;
                                if (isFinite(est) && Math.abs(est) < 20) estimates.push(est);
                            }
                            return estimates;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            var titleMap = {
                                'none': 'All Assumptions Satisfied',
                                'weak': 'Weak Instrument (Relevance Violated)',
                                'exclusion': 'Exclusion Restriction Violated',
                                'exogeneity': 'Instrument Exogeneity Violated'
                            };
                            viz.screenText(titleMap[violation], W / 2, 25, viz.colors.white, 16);
                            viz.screenText('Sampling Distribution of IV Estimator (500 replications)', W / 2, 48, viz.colors.text, 12);

                            var estimates = simulate();
                            if (estimates.length === 0) {
                                viz.screenText('Estimates are too unstable to display', W / 2, H / 2, viz.colors.red, 14);
                                return;
                            }

                            // Histogram
                            var lo = -2, hi = 6;
                            var nBins = 40;
                            var binW = (hi - lo) / nBins;
                            var counts = new Array(nBins).fill(0);
                            for (var i = 0; i < estimates.length; i++) {
                                var bin = Math.floor((estimates[i] - lo) / binW);
                                if (bin >= 0 && bin < nBins) counts[bin]++;
                            }
                            var maxCount = Math.max.apply(null, counts);

                            var plotL = 60, plotR = W - 30, plotT = 70, plotB = H - 80;
                            var plotW = plotR - plotL, plotH = plotB - plotT;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotL, plotT); ctx.stroke();

                            // X axis labels
                            for (var tick = -2; tick <= 6; tick++) {
                                var tx = plotL + (tick - lo) / (hi - lo) * plotW;
                                ctx.beginPath(); ctx.moveTo(tx, plotB); ctx.lineTo(tx, plotB + 5); ctx.stroke();
                                viz.screenText(String(tick), tx, plotB + 18, viz.colors.text, 10);
                            }
                            viz.screenText('IV Estimate', (plotL + plotR) / 2, H - 20, viz.colors.text, 12);

                            // Bars
                            for (var b = 0; b < nBins; b++) {
                                if (counts[b] === 0) continue;
                                var bx = plotL + b / nBins * plotW;
                                var bw = plotW / nBins - 1;
                                var bh = counts[b] / maxCount * plotH * 0.9;
                                ctx.fillStyle = viz.colors.blue + '88';
                                ctx.fillRect(bx, plotB - bh, bw, bh);
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 0.5;
                                ctx.strokeRect(bx, plotB - bh, bw, bh);
                            }

                            // True value line
                            var trueBeta = 1.0;
                            var trueX = plotL + (trueBeta - lo) / (hi - lo) * plotW;
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(trueX, plotT); ctx.lineTo(trueX, plotB); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('True = 1.0', trueX, plotT - 10, viz.colors.green, 11);

                            // Mean of estimates
                            var meanEst = VizEngine.mean(estimates);
                            var meanX = plotL + (meanEst - lo) / (hi - lo) * plotW;
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(meanX, plotT + 20); ctx.lineTo(meanX, plotB); ctx.stroke();
                            viz.screenText('Mean = ' + meanEst.toFixed(2), meanX, plotT + 10, viz.colors.orange, 11);

                            // Stats box
                            var sdEst = Math.sqrt(VizEngine.variance(estimates));
                            var bias = meanEst - trueBeta;
                            viz.screenText('Bias: ' + bias.toFixed(3) + '   SD: ' + sdEst.toFixed(3) + '   RMSE: ' + Math.sqrt(bias * bias + sdEst * sdEst).toFixed(3), W / 2, H - 45, viz.colors.white, 12);

                            // Description of what is happening
                            var descMap = {
                                'none': 'IV estimator is centered on truth with moderate variance.',
                                'weak': 'Weak instrument inflates variance and biases IV toward OLS.',
                                'exclusion': 'Direct Z->Y effect biases the IV estimator upward.',
                                'exogeneity': 'Correlation between Z and U biases the IV estimator.'
                            };
                            viz.screenText(descMap[violation], W / 2, H - 25, viz.colors.text, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Suppose the true model is \\(Y = 1 + X + 2Z + \\varepsilon\\) but you assume \\(Z\\) satisfies the exclusion restriction. What does the IV estimator converge to?',
                    hint: 'Compute \\(\\text{plim}\\,\\hat{\\beta}_{IV} = \\frac{\\text{Cov}(Y,Z)}{\\text{Cov}(X,Z)}\\) with \\(Y = 1 + X + 2Z + \\varepsilon\\).',
                    solution: `<p>Substituting:</p>
\\[\\text{plim}\\,\\hat{\\beta}_{IV} = \\frac{\\text{Cov}(1 + X + 2Z + \\varepsilon, Z)}{\\text{Cov}(X,Z)} = \\frac{\\text{Cov}(X,Z) + 2\\text{Var}(Z)}{\\text{Cov}(X,Z)} = 1 + \\frac{2\\text{Var}(Z)}{\\text{Cov}(X,Z)}\\]
<p>The IV estimator is biased upward by \\(\\frac{2\\text{Var}(Z)}{\\text{Cov}(X,Z)}\\). The direction and magnitude of bias depend on the direct effect (2) and the first-stage strength. Weaker instruments amplify the bias from exclusion restriction violations.</p>`
                },
                {
                    question: 'You are studying the effect of class size on test scores. Propose an instrument and carefully argue whether each IV assumption is plausible.',
                    hint: 'Think about Angrist and Lavy (1999) and Maimonides\' rule.',
                    solution: `<p>Angrist and Lavy (1999) used <strong>Maimonides' rule</strong>: Israeli schools split classes when enrollment exceeds 40. So enrollment just above 40 creates a sharp reduction in class size.</p>
<ul>
<li><strong>Relevance:</strong> Enrollment thresholds mechanically determine class size &mdash; strong first stage.</li>
<li><strong>Exclusion:</strong> The threshold affects test scores only through class size, not through other channels. Concern: schools near thresholds may differ in resources or sorting.</li>
<li><strong>Independence:</strong> The threshold is a deterministic function of enrollment, which is approximately exogenous if families cannot precisely manipulate enrollment counts.</li>
<li><strong>Monotonicity:</strong> Higher enrollment always weakly increases class size (or triggers a split), so no defiers.</li>
</ul>`
                },
                {
                    question: 'Explain the Sargan-Hansen J-test for overidentifying restrictions. When can it be applied, and what are its limitations?',
                    hint: 'You need more instruments than endogenous variables. The test uses 2SLS residuals.',
                    solution: `<p>The <strong>Sargan-Hansen J-test</strong> applies when the model is overidentified (\\(L > K\\)). The procedure:</p>
<ol>
<li>Estimate the model by 2SLS, obtain residuals \\(\\hat{e}\\).</li>
<li>Regress \\(\\hat{e}\\) on all instruments \\(Z_1, \\ldots, Z_L\\) and exogenous controls.</li>
<li>The test statistic \\(J = nR^2\\) from this regression follows \\(\\chi^2(L-K)\\) under \\(H_0\\): all instruments are valid.</li>
</ol>
<p><strong>Limitations:</strong></p>
<ul>
<li>Only detects violations if instruments are <em>differently</em> invalid. If all instruments are invalid in the same direction, the test has no power.</li>
<li>It tests a joint null; rejection does not tell you <em>which</em> instrument is bad.</li>
<li>Low power with weak instruments.</li>
</ul>`
                },
                {
                    question: 'If the instrument \\(Z\\) is correlated with the confounder \\(U\\) such that \\(\\text{Cov}(Z,U) = \\delta\\), derive the asymptotic bias of the IV estimator.',
                    hint: 'Start from \\(\\text{plim}\\,\\hat{\\beta}_{IV}\\) and do not set \\(\\text{Cov}(Z,\\varepsilon)\\) to zero.',
                    solution: `<p>With \\(Y = \\beta_0 + \\beta_1 X + \\varepsilon\\) where \\(\\varepsilon\\) contains \\(U\\):</p>
\\[\\text{plim}\\,\\hat{\\beta}_{IV} = \\beta_1 + \\frac{\\text{Cov}(Z,\\varepsilon)}{\\text{Cov}(Z,X)}\\]
<p>If \\(\\varepsilon = \\gamma U + e\\) with \\(e \\perp Z\\), then \\(\\text{Cov}(Z,\\varepsilon) = \\gamma \\delta\\). Thus:</p>
\\[\\text{Bias}_{IV} = \\frac{\\gamma \\delta}{\\text{Cov}(Z,X)}\\]
<p>Key insight: the bias is proportional to \\(\\delta\\) (exogeneity violation) and inversely proportional to \\(\\text{Cov}(Z,X)\\) (instrument strength). Weak instruments amplify even small exogeneity violations.</p>`
                }
            ]
        },

        // --------------------------------------------------------
        // Section 4: Local Average Treatment Effect (LATE)
        // --------------------------------------------------------
        {
            id: 'ch11-sec04',
            title: 'Local Average Treatment Effect',
            content: `<h2>Local Average Treatment Effect (LATE)</h2>

<p>When treatment effects are <strong>heterogeneous</strong> &mdash; different people respond differently to treatment &mdash; what exactly does IV estimate? The answer, given by the landmark <strong>Imbens and Angrist (1994)</strong> theorem, is the <strong>Local Average Treatment Effect</strong> (LATE): the average causal effect for a specific subpopulation.</p>

<h3>Compliance Strata</h3>
<p>Consider a binary instrument \\(Z \\in \\{0,1\\}\\) and binary treatment \\(X \\in \\{0,1\\}\\). Each unit \\(i\\) has two potential treatment values: \\(X_i(0)\\) (treatment when \\(Z=0\\)) and \\(X_i(1)\\) (treatment when \\(Z=1\\)). This defines four compliance strata:</p>

<div class="env-block definition">
<div class="env-title">Definition (Compliance Strata)</div>
<div class="env-body">
<table style="width:100%; border-collapse:collapse;">
<tr style="border-bottom:1px solid #444;"><th style="text-align:left;padding:6px;">Stratum</th><th style="text-align:center;padding:6px;">\\(X_i(0)\\)</th><th style="text-align:center;padding:6px;">\\(X_i(1)\\)</th><th style="text-align:left;padding:6px;">Behavior</th></tr>
<tr><td style="padding:6px;"><strong>Compliers</strong></td><td style="text-align:center;padding:6px;">0</td><td style="text-align:center;padding:6px;">1</td><td style="padding:6px;">Take treatment if and only if encouraged</td></tr>
<tr><td style="padding:6px;"><strong>Always-takers</strong></td><td style="text-align:center;padding:6px;">1</td><td style="text-align:center;padding:6px;">1</td><td style="padding:6px;">Always take treatment regardless of \\(Z\\)</td></tr>
<tr><td style="padding:6px;"><strong>Never-takers</strong></td><td style="text-align:center;padding:6px;">0</td><td style="text-align:center;padding:6px;">0</td><td style="padding:6px;">Never take treatment regardless of \\(Z\\)</td></tr>
<tr><td style="padding:6px;"><strong>Defiers</strong></td><td style="text-align:center;padding:6px;">1</td><td style="text-align:center;padding:6px;">0</td><td style="padding:6px;">Do the opposite of encouragement</td></tr>
</table>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (Imbens-Angrist LATE Theorem, 1994)</div>
<div class="env-body">
<p>Under independence \\(Z \\perp\\!\\!\\perp (Y^{00}, Y^{01}, Y^{10}, Y^{11}, X(0), X(1))\\), exclusion restriction, and monotonicity (no defiers), the IV/Wald estimator identifies the <strong>LATE</strong>:</p>
\\[\\frac{E[Y|Z=1] - E[Y|Z=0]}{E[X|Z=1] - E[X|Z=0]} = E[Y_i(1) - Y_i(0) \\mid \\text{Complier}_i]\\]
<p>That is, IV estimates the average treatment effect <strong>for compliers only</strong>.</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Why Only Compliers?</div>
<div class="env-body">
<p>The instrument \\(Z\\) only changes the treatment status of compliers. Always-takers and never-takers have the same treatment regardless of \\(Z\\), so \\(Z\\) provides no information about their treatment effects. By exclusion, \\(Z\\) does not directly affect \\(Y\\) for any group, so the reduced-form difference \\(E[Y|Z=1] - E[Y|Z=0]\\) is entirely driven by compliers switching treatment. Dividing by the share of compliers (the first-stage) gives the average effect for compliers.</p>
</div>
</div>

<h3>LATE vs. ATE</h3>
<p>In general, LATE \\(\\neq\\) ATE. The LATE is the effect for compliers, who may be a non-representative subset. Whether LATE is close to ATE depends on:</p>
<ul>
<li><strong>Fraction of compliers:</strong> If most people are compliers, LATE \\(\\approx\\) ATE.</li>
<li><strong>Effect heterogeneity:</strong> If effects are constant (\\(\\beta_i = \\beta\\) for all \\(i\\)), then LATE = ATE = ATT.</li>
<li><strong>Selection into compliance:</strong> If compliers are "marginal" individuals, their effects may differ from always/never-takers.</li>
</ul>

<p>The Wald estimator can be decomposed as:</p>
\\[\\text{Wald} = \\frac{\\text{ITT on } Y}{\\text{ITT on } X} = \\frac{\\pi_c \\cdot \\text{LATE}}{\\pi_c} = \\text{LATE}\\]
<p>where \\(\\pi_c = P(\\text{Complier})\\) is the compliance rate (the first-stage coefficient with a binary instrument).</p>

<div class="viz-placeholder" data-viz="ch11-viz-late"></div>

<div class="env-block example">
<div class="env-title">LATE in the Draft Lottery</div>
<div class="env-body">
<p>In Angrist (1990), \\(Z\\) = draft eligibility, \\(X\\) = military service. Compliers are men who served <em>because</em> they were drafted (would not have volunteered otherwise). The LATE is the earnings effect of military service for this group. It excludes volunteers (always-takers who would serve regardless) and draft resisters (never-takers who avoided service despite eligibility).</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch11-viz-late',
                    title: 'Compliance Strata & LATE Identification',
                    description: 'Adjust the proportions of compliance strata and individual treatment effects to see how LATE relates to ATE.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 480});
                        var pComplier = 0.40;
                        var pAlwaysTaker = 0.20;
                        var pNeverTaker = 0.35;
                        var pDefier = 0.05;

                        var effectComplier = 3.0;
                        var effectAlwaysTaker = 5.0;
                        var effectNeverTaker = 1.0;

                        VizEngine.createSlider(controls, 'Complier %', 10, 80, pComplier * 100, 5, function(v) {
                            pComplier = v / 100;
                            normalizeProportions('complier');
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Complier Effect', -2, 8, effectComplier, 0.5, function(v) {
                            effectComplier = v;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Always-taker Effect', -2, 8, effectAlwaysTaker, 0.5, function(v) {
                            effectAlwaysTaker = v;
                            draw();
                        });

                        function normalizeProportions(fixed) {
                            var remaining = 1 - pComplier;
                            if (remaining < 0) { pComplier = 1; remaining = 0; }
                            var total = pAlwaysTaker + pNeverTaker + pDefier;
                            if (total > 0) {
                                pAlwaysTaker = remaining * (pAlwaysTaker / total);
                                pNeverTaker = remaining * (pNeverTaker / total);
                                pDefier = remaining * (pDefier / total);
                            } else {
                                pAlwaysTaker = remaining / 3;
                                pNeverTaker = remaining / 3;
                                pDefier = remaining / 3;
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            viz.screenText('Compliance Strata & LATE', W / 2, 25, viz.colors.white, 17);

                            // Stacked bar chart
                            var barL = 80, barR = 350, barT = 70, barB = 350;
                            var barW = barR - barL, barH = barB - barT;

                            var strata = [
                                {name: 'Compliers', prop: pComplier, color: viz.colors.blue, effect: effectComplier},
                                {name: 'Always-takers', prop: pAlwaysTaker, color: viz.colors.orange, effect: effectAlwaysTaker},
                                {name: 'Never-takers', prop: pNeverTaker, color: viz.colors.teal, effect: effectNeverTaker},
                                {name: 'Defiers', prop: pDefier, color: viz.colors.red, effect: 0}
                            ];

                            // Draw stacked bar
                            var cumY = barT;
                            for (var i = 0; i < strata.length; i++) {
                                var sh = strata[i].prop * barH;
                                if (sh < 1) { cumY += sh; continue; }
                                ctx.fillStyle = strata[i].color + '55';
                                ctx.fillRect(barL, cumY, barW, sh);
                                ctx.strokeStyle = strata[i].color;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(barL, cumY, barW, sh);

                                if (sh > 20) {
                                    viz.screenText(strata[i].name, (barL + barR) / 2, cumY + sh / 2 - 8, strata[i].color, 13);
                                    viz.screenText((strata[i].prop * 100).toFixed(0) + '%', (barL + barR) / 2, cumY + sh / 2 + 10, strata[i].color, 11);
                                }
                                cumY += sh;
                            }
                            viz.screenText('Population Strata', (barL + barR) / 2, barB + 20, viz.colors.text, 12);

                            // Effect comparison on right side
                            var rightL = 400, rightR = W - 30;
                            var effT = 70, effB = 350;

                            // ATE vs LATE comparison
                            var ate = pComplier * effectComplier + pAlwaysTaker * effectAlwaysTaker + pNeverTaker * effectNeverTaker;
                            var late = effectComplier;

                            // Scale for effects
                            var maxEff = Math.max(Math.abs(ate), Math.abs(late), Math.abs(effectAlwaysTaker), Math.abs(effectNeverTaker), 1) * 1.3;
                            var effMid = (effT + effB) / 2;
                            var effScale = (effB - effT) / 2 / maxEff;

                            // Axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(rightL, effMid); ctx.lineTo(rightR, effMid); ctx.stroke();
                            viz.screenText('0', rightL - 12, effMid, viz.colors.text, 10);

                            // Draw effect bars
                            var barWidth = 40;
                            var positions = [rightL + 30, rightL + 85, rightL + 140, rightL + 210];
                            var labels = ['Comp.', 'Always', 'Never', 'LATE'];
                            var effects = [effectComplier, effectAlwaysTaker, effectNeverTaker, late];
                            var colors = [viz.colors.blue, viz.colors.orange, viz.colors.teal, viz.colors.purple];

                            for (var j = 0; j < 4; j++) {
                                var bx = positions[j];
                                var bh = effects[j] * effScale;
                                var by = bh > 0 ? effMid - bh : effMid;
                                ctx.fillStyle = colors[j] + '77';
                                ctx.fillRect(bx, by, barWidth, Math.abs(bh));
                                ctx.strokeStyle = colors[j];
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(bx, by, barWidth, Math.abs(bh));
                                viz.screenText(labels[j], bx + barWidth / 2, effB + 15, colors[j], 10);
                                viz.screenText(effects[j].toFixed(1), bx + barWidth / 2, bh > 0 ? by - 10 : by + Math.abs(bh) + 14, colors[j], 11);
                            }

                            viz.screenText('Treatment Effects by Stratum', (rightL + rightR) / 2, effT - 10, viz.colors.text, 12);

                            // Summary stats at bottom
                            var sumY = barB + 50;
                            viz.screenText('LATE (IV estimates) = E[Y(1)-Y(0) | Complier] = ' + late.toFixed(2), W / 2, sumY, viz.colors.purple, 13);
                            viz.screenText('ATE = ' + ate.toFixed(2) + '   (weighted average over all strata)', W / 2, sumY + 25, viz.colors.white, 13);

                            var diff = late - ate;
                            var diffColor = Math.abs(diff) < 0.5 ? viz.colors.green : viz.colors.yellow;
                            viz.screenText('LATE - ATE = ' + diff.toFixed(2) + (Math.abs(diff) < 0.5 ? '  (similar)' : '  (different!)'), W / 2, sumY + 50, diffColor, 13);

                            if (pDefier > 0.01) {
                                viz.screenText('Warning: Defiers present (' + (pDefier * 100).toFixed(0) + '%) - monotonicity violated!', W / 2, sumY + 75, viz.colors.red, 12);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In a randomized encouragement design, 60% are encouraged (\\(Z=1\\)) and 40% are not (\\(Z=0\\)). Among encouraged, 50% take treatment; among not encouraged, 10% take treatment. Calculate the compliance rate and identify each stratum\'s share.',
                    hint: 'The first stage is \\(E[X|Z=1] - E[X|Z=0]\\). This equals the fraction of compliers (under monotonicity). Always-takers are those treated even when \\(Z=0\\).',
                    solution: `<p>First stage: \\(E[X|Z=1] - E[X|Z=0] = 0.50 - 0.10 = 0.40\\).</p>
<p>Under monotonicity (no defiers):</p>
<ul>
<li><strong>Compliers:</strong> \\(\\pi_c = 0.40\\) (40%)</li>
<li><strong>Always-takers:</strong> \\(P(X=1|Z=0) = 0.10\\) (10%)</li>
<li><strong>Never-takers:</strong> \\(1 - \\pi_c - \\pi_a = 1 - 0.40 - 0.10 = 0.50\\) (50%)</li>
<li><strong>Defiers:</strong> 0% (by monotonicity)</li>
</ul>
<p>Verification: \\(P(X=1|Z=1) = \\pi_c + \\pi_a = 0.40 + 0.10 = 0.50\\). Correct.</p>`
                },
                {
                    question: 'Suppose LATE = 5 and ATE = 2. What does this imply about the treatment effect heterogeneity across compliance strata?',
                    hint: 'LATE is the effect for compliers. If LATE > ATE, what does that say about compliers relative to the rest?',
                    solution: `<p>Since LATE (effect for compliers) exceeds ATE (population average effect), compliers have <strong>above-average treatment effects</strong>. This means:</p>
<ul>
<li>Always-takers and/or never-takers must have below-average effects.</li>
<li>This pattern is consistent with <strong>selection on gains</strong>: people who are swayed by the instrument (compliers) may be those who would benefit most from treatment.</li>
<li>Extrapolating the LATE to the full population (as ATE) would overstate the average effect by 150%.</li>
<li>Policy implication: expanding treatment beyond the complier population would yield diminishing returns.</li>
</ul>`
                },
                {
                    question: 'Prove that the Wald estimator equals LATE under the LATE assumptions. Start from the definitions of ITT and first stage.',
                    hint: 'Decompose \\(E[Y|Z=1] - E[Y|Z=0]\\) by stratum using the law of total expectation. Use exclusion to simplify.',
                    solution: `<p>By the law of total expectation (decomposing by stratum):</p>
\\[E[Y|Z=1] - E[Y|Z=0]\\]
<p>For always-takers: \\(X_i(1) = X_i(0) = 1\\), so by exclusion \\(E[Y|Z=1, AT] - E[Y|Z=0, AT] = 0\\).</p>
<p>For never-takers: \\(X_i(1) = X_i(0) = 0\\), so by exclusion \\(E[Y|Z=1, NT] - E[Y|Z=0, NT] = 0\\).</p>
<p>For compliers: \\(X_i(1) = 1, X_i(0) = 0\\), so \\(E[Y|Z=1, C] - E[Y|Z=0, C] = E[Y(1) - Y(0)|C]\\).</p>
<p>Therefore:</p>
\\[E[Y|Z=1] - E[Y|Z=0] = \\pi_c \\cdot E[Y(1) - Y(0)|C] = \\pi_c \\cdot \\text{LATE}\\]
<p>The first stage \\(E[X|Z=1] - E[X|Z=0] = \\pi_c\\). Dividing:</p>
\\[\\text{Wald} = \\frac{\\pi_c \\cdot \\text{LATE}}{\\pi_c} = \\text{LATE}\\]`
                },
                {
                    question: 'Why is the monotonicity assumption necessary for the LATE theorem? What happens if there are defiers?',
                    hint: 'Without monotonicity, the first stage captures compliers minus defiers. The numerator mixes effects in an uninterpretable way.',
                    solution: `<p>Without monotonicity, we have:</p>
\\[E[X|Z=1] - E[X|Z=0] = \\pi_c - \\pi_d\\]
<p>where \\(\\pi_d\\) is the defier share. The reduced form becomes:</p>
\\[E[Y|Z=1] - E[Y|Z=0] = \\pi_c \\cdot E[Y(1)-Y(0)|C] - \\pi_d \\cdot E[Y(1)-Y(0)|D]\\]
<p>The Wald estimator then converges to:</p>
\\[\\frac{\\pi_c \\cdot \\text{LATE}_C - \\pi_d \\cdot \\text{LATE}_D}{\\pi_c - \\pi_d}\\]
<p>This is an uninterpretable weighted average with <em>negative</em> weight on defiers. Even if \\(\\pi_d\\) is small, the denominator could be close to zero, amplifying the defier effect. With defiers, IV does not estimate a well-defined causal parameter for any identifiable subpopulation.</p>`
                }
            ]
        },

        // --------------------------------------------------------
        // Section 5: Classic IV Applications
        // --------------------------------------------------------
        {
            id: 'ch11-sec05',
            title: 'Classic IV Applications',
            content: `<h2>Classic IV Applications</h2>

<p>The history of instrumental variables is rich with creative applications that have shaped our understanding of causal relationships. Here we examine four landmark studies that illustrate the power &mdash; and the challenges &mdash; of IV methods.</p>

<h3>1. Vietnam Draft Lottery &mdash; Angrist (1990)</h3>
<div class="env-block example">
<div class="env-title">Angrist (1990): Lifetime Earnings Effects of Vietnam Era Conscription</div>
<div class="env-body">
<p><strong>Question:</strong> What is the effect of military service on lifetime earnings?</p>
<p><strong>Endogeneity problem:</strong> Men who volunteer differ from non-volunteers in motivation, risk preference, and socioeconomic background.</p>
<p><strong>Instrument:</strong> Vietnam-era draft lottery number. In 1970, men born 1950 were randomly assigned lottery numbers 1-365. Numbers below a cutoff (195) were draft-eligible.</p>
<p><strong>Why it works:</strong></p>
<ul>
<li><strong>Relevance:</strong> Draft eligibility strongly predicts military service (first-stage \\(F \\gg 10\\)).</li>
<li><strong>Exclusion:</strong> Lottery numbers were randomly assigned, so they should not directly affect earnings.</li>
<li><strong>Independence:</strong> Lottery is literally random.</li>
</ul>
<p><strong>Result:</strong> LATE \\(\\approx\\) &minus;15% earnings for white veterans. Military service reduced long-run earnings for men who served because they were drafted (compliers).</p>
</div>
</div>

<h3>2. Quarter of Birth &mdash; Angrist & Krueger (1991)</h3>
<div class="env-block example">
<div class="env-title">Angrist & Krueger (1991): Does Compulsory School Attendance Affect Schooling and Earnings?</div>
<div class="env-body">
<p><strong>Question:</strong> What is the causal return to schooling?</p>
<p><strong>Instrument:</strong> Quarter of birth. Compulsory schooling laws require attendance until age 16. Since school entry depends on birthday cutoffs, Q4-born children reach legal dropout age with slightly less schooling than Q1-born children.</p>
<p><strong>Relevance:</strong> Q4-born men have about 0.1 fewer years of schooling on average.</p>
<p><strong>Controversy:</strong></p>
<ul>
<li>Very weak instrument (tiny first stage).</li>
<li>Bound, Jaeger & Baker (1995) showed that with 180 quarter-of-birth instruments, 2SLS is severely biased toward OLS.</li>
<li>Season of birth may have direct effects on development and health.</li>
</ul>
</div>
</div>

<h3>3. Distance to College &mdash; Card (1993)</h3>
<div class="env-block example">
<div class="env-title">Card (1993): Using Geographic Variation in College Proximity</div>
<div class="env-body">
<p><strong>Question:</strong> Returns to education.</p>
<p><strong>Instrument:</strong> Growing up near a four-year college. Proximity reduces costs of attendance.</p>
<p><strong>Result:</strong> IV estimates (about 13%) exceed OLS (about 7%), suggesting either measurement error attenuation in OLS or that marginal compliers (those induced to attend college by proximity) have above-average returns.</p>
<p><strong>Concern:</strong> Proximity to college may correlate with family background and local labor market conditions.</p>
</div>
</div>

<h3>4. Judge/Examiner Designs</h3>
<div class="env-block example">
<div class="env-title">Judge Leniency as Instrumental Variable</div>
<div class="env-body">
<p><strong>Setting:</strong> Random assignment to judges with different sentencing tendencies creates exogenous variation in incarceration.</p>
<p><strong>Applications:</strong></p>
<ul>
<li>Kling (2006): incarceration on labor market outcomes</li>
<li>Dobbie, Goldin & Yang (2018): pretrial detention on case outcomes</li>
<li>Maestas, Mullen & Strand (2013): disability insurance on labor supply</li>
</ul>
<p><strong>Key assumption:</strong> Conditional on case characteristics, judge assignment is as good as random. The LATE is for "marginal defendants" whose incarceration depends on judge assignment.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch11-viz-angrist"></div>

<div class="env-block intuition">
<div class="env-title">Lessons from Classic IV Studies</div>
<div class="env-body">
<ol>
<li><strong>Clever instruments come from institutional knowledge.</strong> The best IVs exploit natural experiments: lotteries, arbitrary rules, geographic variation.</li>
<li><strong>Exclusion is always debatable.</strong> No instrument is perfect; the question is how plausible exclusion is.</li>
<li><strong>LATE depends on the instrument.</strong> Different instruments identify effects for different complier populations.</li>
<li><strong>Weak instruments are dangerous.</strong> The quarter-of-birth debate shows that weak first stages can undermine even creative IV designs.</li>
</ol>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch11-viz-angrist',
                    title: 'Draft Lottery IV: Angrist (1990) Stylized Replication',
                    description: 'Simulated data inspired by Angrist (1990). Lottery numbers below the cutoff predict military service, which causally affects earnings.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 480});
                        var cutoff = 195;
                        var showIV = true;
                        var showOLS = true;

                        VizEngine.createSlider(controls, 'Draft Cutoff', 50, 300, cutoff, 5, function(v) {
                            cutoff = v;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Toggle OLS', function() {
                            showOLS = !showOLS;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Toggle IV', function() {
                            showIV = !showIV;
                            draw();
                        });

                        // Generate stylized data
                        function seededRandom(s) {
                            return function() { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
                        }
                        function boxMuller(rng) {
                            var u1 = rng(), u2 = rng();
                            while (u1 === 0) u1 = rng();
                            return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                        }

                        var rng = seededRandom(1990);
                        var nObs = 365;
                        var lottoData = [];
                        for (var i = 0; i < nObs; i++) {
                            var lottoNum = i + 1;
                            var eligible = lottoNum <= cutoff ? 1 : 0;
                            // Unobserved: motivation/ability
                            var ability = boxMuller(rng);
                            // Service probability depends on eligibility + ability (endogeneity)
                            var serviceProb = eligible ? 0.5 + 0.1 * ability : 0.08 + 0.05 * ability;
                            serviceProb = Math.max(0, Math.min(1, serviceProb));
                            var served = rng() < serviceProb ? 1 : 0;
                            // Earnings: causal effect of service = -3000, ability effect = +2000
                            var earnings = 20000 + 2000 * ability - 3000 * served + 3000 * boxMuller(rng);
                            lottoData.push({num: lottoNum, eligible: eligible, served: served, earnings: earnings, ability: ability});
                        }

                        function draw() {
                            // Recompute eligibility based on cutoff
                            for (var k = 0; k < lottoData.length; k++) {
                                lottoData[k].eligible = lottoData[k].num <= cutoff ? 1 : 0;
                            }

                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            viz.screenText('Angrist (1990): Draft Lottery & Earnings (Stylized)', W / 2, 22, viz.colors.white, 15);

                            // Plot: Lottery number (x) vs Earnings (y)
                            var plotL = 70, plotR = W - 30, plotT = 55, plotB = H - 90;
                            var plotW = plotR - plotL, plotH = plotB - plotT;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotL, plotT); ctx.stroke();

                            // X axis
                            for (var xt = 0; xt <= 365; xt += 50) {
                                var sxp = plotL + xt / 365 * plotW;
                                ctx.beginPath(); ctx.moveTo(sxp, plotB); ctx.lineTo(sxp, plotB + 4); ctx.stroke();
                                viz.screenText(String(xt), sxp, plotB + 16, viz.colors.text, 9);
                            }
                            viz.screenText('Lottery Number', (plotL + plotR) / 2, plotB + 35, viz.colors.text, 12);

                            // Y axis (earnings in thousands)
                            var yMin = 8000, yMax = 35000;
                            for (var yt = 10000; yt <= 35000; yt += 5000) {
                                var syp = plotB - (yt - yMin) / (yMax - yMin) * plotH;
                                ctx.beginPath(); ctx.moveTo(plotL - 4, syp); ctx.lineTo(plotL, syp); ctx.stroke();
                                viz.screenText(String(yt / 1000) + 'k', plotL - 8, syp, viz.colors.text, 9, 'right');
                            }
                            ctx.save();
                            ctx.translate(15, (plotT + plotB) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Earnings ($)', 0, 0);
                            ctx.restore();

                            // Cutoff line
                            var cutX = plotL + cutoff / 365 * plotW;
                            ctx.strokeStyle = viz.colors.yellow + '88';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(cutX, plotT); ctx.lineTo(cutX, plotB); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('Cutoff = ' + cutoff, cutX, plotT - 8, viz.colors.yellow, 11);

                            // Scatter points
                            for (var di = 0; di < lottoData.length; di++) {
                                var d = lottoData[di];
                                var px = plotL + d.num / 365 * plotW;
                                var py = plotB - (d.earnings - yMin) / (yMax - yMin) * plotH;
                                if (py < plotT || py > plotB) continue;
                                ctx.fillStyle = d.served ? viz.colors.red + '55' : viz.colors.teal + '55';
                                ctx.beginPath();
                                ctx.arc(px, py, 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Compute group means for IV
                            var eligEarn = [], notEligEarn = [];
                            var eligServe = [], notEligServe = [];
                            for (var ei = 0; ei < lottoData.length; ei++) {
                                if (lottoData[ei].eligible) {
                                    eligEarn.push(lottoData[ei].earnings);
                                    eligServe.push(lottoData[ei].served);
                                } else {
                                    notEligEarn.push(lottoData[ei].earnings);
                                    notEligServe.push(lottoData[ei].served);
                                }
                            }

                            var meanEligEarn = eligEarn.length > 0 ? VizEngine.mean(eligEarn) : 0;
                            var meanNotEligEarn = notEligEarn.length > 0 ? VizEngine.mean(notEligEarn) : 0;
                            var meanEligServe = eligServe.length > 0 ? VizEngine.mean(eligServe) : 0;
                            var meanNotEligServe = notEligServe.length > 0 ? VizEngine.mean(notEligServe) : 0;

                            var waldNum = meanEligEarn - meanNotEligEarn;
                            var waldDen = meanEligServe - meanNotEligServe;
                            var waldEst = Math.abs(waldDen) > 0.001 ? waldNum / waldDen : NaN;

                            // OLS: regress earnings on served
                            var allServed = lottoData.map(function(d) { return d.served; });
                            var allEarnings = lottoData.map(function(d) { return d.earnings; });
                            var olsSlope = 0, olsIntercept = 0;
                            if (showOLS) {
                                var ms = VizEngine.mean(allServed), me = VizEngine.mean(allEarnings);
                                var num2 = 0, den2 = 0;
                                for (var oi = 0; oi < allServed.length; oi++) {
                                    num2 += (allServed[oi] - ms) * (allEarnings[oi] - me);
                                    den2 += (allServed[oi] - ms) * (allServed[oi] - ms);
                                }
                                olsSlope = den2 > 0 ? num2 / den2 : 0;
                                olsIntercept = me - olsSlope * ms;
                            }

                            // Draw eligible/not-eligible mean lines
                            if (showIV && eligEarn.length > 0 && notEligEarn.length > 0) {
                                var yElig = plotB - (meanEligEarn - yMin) / (yMax - yMin) * plotH;
                                var yNotElig = plotB - (meanNotEligEarn - yMin) / (yMax - yMin) * plotH;

                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(plotL, yElig); ctx.lineTo(cutX, yElig); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(cutX, yNotElig); ctx.lineTo(plotR, yNotElig); ctx.stroke();
                            }

                            // Results panel
                            var panelY = plotB + 50;
                            viz.screenText('Reduced form (ITT on Y): $' + waldNum.toFixed(0), W / 4, panelY, viz.colors.blue, 12);
                            viz.screenText('First stage (ITT on X): ' + waldDen.toFixed(3), W / 4, panelY + 18, viz.colors.teal, 12);

                            if (showIV && isFinite(waldEst)) {
                                viz.screenText('Wald IV estimate: $' + waldEst.toFixed(0), W * 3 / 4, panelY, viz.colors.purple, 13);
                            }
                            if (showOLS) {
                                viz.screenText('OLS estimate: $' + olsSlope.toFixed(0), W * 3 / 4, panelY + 18, viz.colors.red, 13);
                            }
                            viz.screenText('True causal effect: -$3,000', W / 2, panelY + 40, viz.colors.green, 13);

                            // Legend
                            ctx.fillStyle = viz.colors.teal + '99';
                            ctx.beginPath(); ctx.arc(plotR - 140, plotT + 10, 4, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('Did not serve', plotR - 128, plotT + 10, viz.colors.teal, 10, 'left');
                            ctx.fillStyle = viz.colors.red + '99';
                            ctx.beginPath(); ctx.arc(plotR - 140, plotT + 26, 4, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('Served', plotR - 128, plotT + 26, viz.colors.red, 10, 'left');
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In Angrist (1990), the reduced-form effect of draft eligibility on earnings is about &minus;$1,500 and the first stage is about 0.16. Compute the Wald estimate and interpret it as a LATE.',
                    hint: 'Wald = reduced form / first stage. The LATE is for compliers: men who served because they were drafted.',
                    solution: `<p>Wald estimate:</p>
\\[\\hat{\\beta}_{IV} = \\frac{-1500}{0.16} = -\\$9,375\\]
<p><strong>Interpretation:</strong> Among men who served in the military <em>because</em> they were drafted (compliers), military service reduced annual earnings by approximately $9,375. This is the LATE &mdash; the effect for compliers, not for volunteers (always-takers) or those who avoided service despite being drafted (never-takers).</p>`
                },
                {
                    question: 'Angrist and Krueger (1991) used 180 quarter-of-birth instruments (3 quarters times 10 birth cohorts times 50 states plus interactions). Why did Bound, Jaeger & Baker (1995) criticize this approach?',
                    hint: 'What happens to 2SLS with many weak instruments? Think about the formula for the bias of 2SLS.',
                    solution: `<p>Bound, Jaeger & Baker (1995) demonstrated that with many weak instruments:</p>
<ol>
<li><strong>2SLS bias toward OLS:</strong> The bias of 2SLS is approximately \\(\\frac{L}{F}\\) times the OLS bias, where \\(L\\) is the number of instruments and \\(F\\) is the first-stage F-statistic. With 180 instruments and modest relevance, \\(L/F\\) can be close to 1.</li>
<li><strong>Overfitting in first stage:</strong> With 180 instruments, the first stage can fit noise in \\(X\\) that correlates with \\(\\varepsilon\\), negating the IV rationale.</li>
<li><strong>Size distortions:</strong> Conventional tests reject far too often.</li>
</ol>
<p>They showed that random numbers produced "significant" IV estimates when used as instruments with the same many-IV procedure, demonstrating the fragility of the approach.</p>`
                },
                {
                    question: 'In a judge leniency design, explain who the "compliers" are and why the LATE may differ substantially from the ATE of incarceration.',
                    hint: 'Compliers are marginal defendants whose incarceration depends on which judge they are assigned to.',
                    solution: `<p><strong>Compliers</strong> in a judge leniency design are <em>marginal defendants</em>: those who would be incarcerated by a strict judge but released by a lenient judge. Their incarceration depends on the judge (instrument), unlike:</p>
<ul>
<li><strong>Always-takers:</strong> Serious offenders incarcerated regardless of judge.</li>
<li><strong>Never-takers:</strong> Minor offenders released regardless of judge.</li>
</ul>
<p><strong>Why LATE differs from ATE:</strong> Marginal defendants are likely moderate-severity cases. Their treatment effects may differ from always-takers (who may be hardened criminals with smaller rehabilitation potential) or never-takers (who face different outside options). The LATE reflects the causal effect for this "marginal" group, which is policy-relevant if one considers marginal changes to sentencing guidelines, but may not generalize to the full defendant population.</p>`
                }
            ]
        }
    ]
});
