// ============================================================
// Chapter 14 · Fixed Effects & Within Estimation
// Controlling for Unobserved Heterogeneity
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch14',
    number: 14,
    title: 'Fixed Effects & Within Estimation',
    subtitle: 'Controlling for Unobserved Heterogeneity',
    sections: [
        // --------------------------------------------------------
        // Section 1: Panel Data Structure
        // --------------------------------------------------------
        {
            id: 'ch14-sec01',
            title: 'Panel Data Structure',
            content: `<h2>Panel Data Structure</h2>
<p>Panel data (also called longitudinal data) tracks the same set of individuals (firms, countries, people) over multiple time periods. This structure provides powerful tools for causal inference that cross-sectional data alone cannot offer.</p>

<div class="env-block definition">
<div class="env-title">Definition (Panel Data Model)</div>
<div class="env-body">
<p>The basic panel data model is:</p>
$$Y_{it} = \\alpha_i + \\beta X_{it} + \\varepsilon_{it}$$
<p>where \\(i = 1, \\ldots, N\\) indexes <strong>individuals</strong> and \\(t = 1, \\ldots, T\\) indexes <strong>time periods</strong>. The term \\(\\alpha_i\\) is an individual-specific <strong>unobserved effect</strong> (fixed effect) that does not vary over time.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Balanced vs. Unbalanced Panels)</div>
<div class="env-body">
<p>A panel is <strong>balanced</strong> if every individual is observed in every time period, giving \\(N \\times T\\) total observations. A panel is <strong>unbalanced</strong> if some individuals have missing observations in certain periods.</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition: Why Panel Data?</div>
<div class="env-body">
<p>The key advantage of panel data is that by observing the same individual at multiple points in time, we can control for <strong>time-invariant unobserved characteristics</strong> \\(\\alpha_i\\). For example:</p>
<ul>
<li>Innate ability when studying returns to education</li>
<li>Firm culture when studying management practices</li>
<li>Geography when studying policy effects across regions</li>
</ul>
<p>Cross-sectional data cannot separate \\(\\alpha_i\\) from the treatment effect \\(\\beta\\), leading to omitted variable bias whenever \\(\\text{Cov}(X_{it}, \\alpha_i) \\neq 0\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch14-viz-panel-trajectories"></div>

<div class="env-block example">
<div class="env-title">Example (Wage Panel)</div>
<div class="env-body">
<p>Suppose we observe \\(N = 500\\) workers over \\(T = 10\\) years. Let \\(Y_{it}\\) be log wages and \\(X_{it}\\) be years of job tenure. Each worker has an unobserved ability \\(\\alpha_i\\). If high-ability workers also tend to accumulate more tenure (e.g., they stay in better jobs longer), then a cross-sectional OLS regression of \\(Y\\) on \\(X\\) would be biased upward:</p>
$$\\hat{\\beta}_{OLS} = \\beta + \\underbrace{\\frac{\\text{Cov}(X_{it}, \\alpha_i)}{\\text{Var}(X_{it})}}_{\\text{omitted variable bias}}.$$
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch14-viz-panel-trajectories',
                    title: 'Panel Data: Individual Trajectories Over Time',
                    description: 'Visualize how panel data tracks individuals over time, each with a different fixed effect',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 50, originX: 80, originY: 370});
                        var N = 6;
                        var T = 8;
                        var beta = 0.5;
                        var showPooled = false;

                        var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.green, viz.colors.purple, viz.colors.pink];

                        // Seed data
                        function seedRandom(s) {
                            var x = Math.sin(s * 9301 + 49297) * 49297;
                            return x - Math.floor(x);
                        }

                        function generateData() {
                            var data = [];
                            for (var i = 0; i < N; i++) {
                                var alpha = 0.5 + seedRandom(i * 17 + 3) * 4;
                                var indiv = [];
                                for (var t = 0; t < T; t++) {
                                    var x = 1 + t * 0.8 + (seedRandom(i * 100 + t * 7 + 42) - 0.5) * 1.5;
                                    var eps = (seedRandom(i * 200 + t * 13 + 77) - 0.5) * 0.6;
                                    var y = alpha + beta * x + eps;
                                    indiv.push({x: x, y: y, t: t, i: i, alpha: alpha});
                                }
                                data.push(indiv);
                            }
                            return data;
                        }

                        var data = generateData();

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();
                            viz.screenText('Panel Data: Individual Trajectories', viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText('X (treatment)', viz.width / 2, viz.height - 8, viz.colors.text, 11);
                            viz.screenText('Y (outcome)', 14, viz.height / 2, viz.colors.text, 11);

                            // Draw individual trajectories
                            for (var i = 0; i < N; i++) {
                                var col = colors[i % colors.length];
                                var indiv = data[i];

                                // Connect points with lines (trajectory)
                                var ctx = viz.ctx;
                                ctx.strokeStyle = col + '80';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                for (var t = 0; t < T; t++) {
                                    var pt = viz.toScreen(indiv[t].x, indiv[t].y);
                                    if (t === 0) ctx.moveTo(pt[0], pt[1]);
                                    else ctx.lineTo(pt[0], pt[1]);
                                }
                                ctx.stroke();

                                // Draw points
                                for (var t2 = 0; t2 < T; t2++) {
                                    var label = t2 === T - 1 ? 'i=' + (i + 1) : null;
                                    viz.drawPoint(indiv[t2].x, indiv[t2].y, col, label, 4);
                                }
                            }

                            // Pooled OLS line
                            if (showPooled) {
                                var allX = [], allY = [];
                                for (var i2 = 0; i2 < N; i2++) {
                                    for (var t3 = 0; t3 < T; t3++) {
                                        allX.push(data[i2][t3].x);
                                        allY.push(data[i2][t3].y);
                                    }
                                }
                                var mx = VizEngine.mean(allX), my = VizEngine.mean(allY);
                                var num = 0, den = 0;
                                for (var k = 0; k < allX.length; k++) {
                                    num += (allX[k] - mx) * (allY[k] - my);
                                    den += (allX[k] - mx) * (allX[k] - mx);
                                }
                                var bPool = num / den;
                                var aPool = my - bPool * mx;

                                viz.drawFunction(function(x) { return aPool + bPool * x; }, 0, 10, viz.colors.red, 2, 100);
                                viz.screenText('Pooled OLS slope = ' + bPool.toFixed(3) + ' (biased)', viz.width / 2, 38, viz.colors.red, 12);
                                viz.screenText('True beta = ' + beta.toFixed(1), viz.width / 2, 54, viz.colors.yellow, 12);
                            }

                            // Legend
                            viz.screenText('Each color = one individual tracked over T=' + T + ' periods', viz.width / 2, viz.height - 24, viz.colors.text, 10);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'True beta: ', 0, 2, beta, 0.1, function(v) { beta = v; data = generateData(); draw(); });
                        VizEngine.createButton(controls, 'Toggle Pooled OLS', function() { showPooled = !showPooled; draw(); });
                        VizEngine.createButton(controls, 'Regenerate Data', function() { data = generateData(); draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Suppose you have a balanced panel with \\(N = 100\\) firms and \\(T = 5\\) years. How many total observations do you have? What if 20 firms each drop out for exactly 1 year (unbalanced)?',
                    hint: 'Balanced: \\(N \\times T\\). Unbalanced: subtract the missing observations.',
                    solution: 'Balanced: 100 * 5 = 500 observations. Unbalanced: 500 - 20 = 480 observations (each of the 20 firms loses one year of data).'
                },
                {
                    question: 'In the model \\(Y_{it} = \\alpha_i + \\beta X_{it} + \\varepsilon_{it}\\), suppose \\(\\text{Cov}(X_{it}, \\alpha_i) > 0\\). Will pooled OLS overestimate or underestimate \\(\\beta\\)?',
                    hint: 'Think about the omitted variable bias formula.',
                    solution: 'Pooled OLS estimates beta_hat = beta + Cov(X_it, alpha_i)/Var(X_it). Since Cov(X_it, alpha_i) > 0, pooled OLS will overestimate beta (upward bias).'
                },
                {
                    question: 'Give a real-world example where the fixed effect \\(\\alpha_i\\) is plausibly correlated with the treatment \\(X_{it}\\), making cross-sectional estimates biased.',
                    hint: 'Think about individual characteristics that affect both the treatment and the outcome.',
                    solution: 'Example: Studying the effect of training programs (X) on productivity (Y). Firms with better management culture (alpha_i) may invest more in training AND have higher productivity, creating upward bias. Another example: studying the effect of class size (X) on student performance (Y), where school quality (alpha_i) correlates with both.'
                },
                {
                    question: 'Why is panel data sometimes called "longitudinal data"? What is the key distinction from repeated cross-sections?',
                    hint: 'Think about whether the same units are tracked over time.',
                    solution: 'Panel/longitudinal data tracks the SAME individuals over time, allowing us to observe within-individual changes. Repeated cross-sections draw a NEW random sample each period (e.g., a new survey each year), so we cannot link observations across time. The key distinction: panel data enables fixed effects estimation because we see how the same unit changes, whereas repeated cross-sections only reveal aggregate trends.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 2: Fixed Effects Estimator
        // --------------------------------------------------------
        {
            id: 'ch14-sec02',
            title: 'Fixed Effects Estimator',
            content: `<h2>Fixed Effects Estimator</h2>
<p>The fixed effects (FE) estimator removes the unobserved individual heterogeneity \\(\\alpha_i\\) through a <strong>within transformation</strong>: demeaning each variable by its individual-specific time average.</p>

<div class="env-block definition">
<div class="env-title">Definition (Within Transformation)</div>
<div class="env-body">
<p>Define the individual time averages:</p>
$$\\bar{Y}_i = \\frac{1}{T} \\sum_{t=1}^{T} Y_{it}, \\qquad \\bar{X}_i = \\frac{1}{T} \\sum_{t=1}^{T} X_{it}, \\qquad \\bar{\\varepsilon}_i = \\frac{1}{T} \\sum_{t=1}^{T} \\varepsilon_{it}.$$
<p>Subtracting the time-averaged equation from the original:</p>
$$(Y_{it} - \\bar{Y}_i) = \\beta (X_{it} - \\bar{X}_i) + (\\varepsilon_{it} - \\bar{\\varepsilon}_i).$$
<p>Writing \\(\\ddot{Y}_{it} = Y_{it} - \\bar{Y}_i\\), \\(\\ddot{X}_{it} = X_{it} - \\bar{X}_i\\), \\(\\ddot{\\varepsilon}_{it} = \\varepsilon_{it} - \\bar{\\varepsilon}_i\\):</p>
$$\\ddot{Y}_{it} = \\beta \\, \\ddot{X}_{it} + \\ddot{\\varepsilon}_{it}.$$
<p>The fixed effect \\(\\alpha_i\\) has been <strong>eliminated</strong> because \\(\\alpha_i - \\bar{\\alpha}_i = \\alpha_i - \\alpha_i = 0\\).</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (FE Estimator)</div>
<div class="env-body">
<p>The fixed effects estimator is:</p>
$$\\hat{\\beta}_{FE} = \\frac{\\sum_{i=1}^{N} \\sum_{t=1}^{T} (X_{it} - \\bar{X}_i)(Y_{it} - \\bar{Y}_i)}{\\sum_{i=1}^{N} \\sum_{t=1}^{T} (X_{it} - \\bar{X}_i)^2}.$$
<p>Under the <strong>strict exogeneity</strong> assumption \\(E[\\varepsilon_{it} | X_{i1}, \\ldots, X_{iT}, \\alpha_i] = 0\\), the FE estimator is unbiased and consistent as \\(N \\to \\infty\\) for fixed \\(T\\).</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (LSDV — Least Squares Dummy Variables)</div>
<div class="env-body">
<p>An equivalent approach is to include a dummy variable for each individual:</p>
$$Y_{it} = \\sum_{i=1}^{N} \\alpha_i D_i + \\beta X_{it} + \\varepsilon_{it}$$
<p>where \\(D_i = 1\\) if observation belongs to individual \\(i\\). The OLS estimate of \\(\\beta\\) in this regression is <strong>numerically identical</strong> to \\(\\hat{\\beta}_{FE}\\). This is the Frisch-Waugh-Lovell theorem at work.</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning: Strict Exogeneity</div>
<div class="env-body">
<p>The FE estimator requires <strong>strict exogeneity</strong>: \\(E[\\varepsilon_{it} | \\mathbf{X}_i, \\alpha_i] = 0\\) for all \\(t\\). This means current errors are uncorrelated with past, present, and future values of \\(X\\). This rules out:</p>
<ul>
<li><strong>Feedback effects</strong>: \\(Y_{it-1}\\) affecting \\(X_{it}\\)</li>
<li><strong>Lagged dependent variables</strong>: \\(Y_{it} = \\alpha_i + \\beta X_{it} + \\gamma Y_{it-1} + \\varepsilon_{it}\\)</li>
</ul>
</div>
</div>

<div class="viz-placeholder" data-viz="ch14-viz-within-transformation"></div>

<div class="env-block example">
<div class="env-title">Example (FE in Practice)</div>
<div class="env-body">
<p>Consider estimating the effect of police spending \\(X_{it}\\) on crime rates \\(Y_{it}\\) across \\(N\\) cities over \\(T\\) years. Cities with inherently higher crime (due to poverty, urbanization) may also spend more on police (\\(\\text{Cov}(X_{it}, \\alpha_i) > 0\\)), creating a spurious positive correlation in cross-sectional data. The FE estimator removes \\(\\alpha_i\\) and identifies \\(\\beta\\) from <em>within-city variation</em> over time.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch14-viz-within-transformation',
                    title: 'Within Transformation: Before and After Demeaning',
                    description: 'See how demeaning removes individual fixed effects and reveals the true slope',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 40, originX: 80, originY: 340});
                        var trueBeta = 0.8;
                        var showDemeaned = false;
                        var showFELine = false;

                        var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.green, viz.colors.purple];
                        var N = 5;
                        var T = 8;

                        function seedRandom(s) {
                            var x = Math.sin(s * 9301 + 49297) * 49297;
                            return x - Math.floor(x);
                        }

                        function generateData() {
                            var groups = [];
                            for (var i = 0; i < N; i++) {
                                var alpha = 1 + i * 1.2;
                                var pts = [];
                                for (var t = 0; t < T; t++) {
                                    var x = 1 + t * 0.7 + i * 0.5 + (seedRandom(i * 100 + t * 7) - 0.5) * 1.0;
                                    var eps = (seedRandom(i * 200 + t * 13 + 50) - 0.5) * 0.5;
                                    var y = alpha + trueBeta * x + eps;
                                    pts.push({x: x, y: y});
                                }
                                groups.push({alpha: alpha, pts: pts});
                            }
                            return groups;
                        }

                        var groups = generateData();

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            if (!showDemeaned) {
                                viz.screenText('Original Data (with fixed effects)', viz.width / 2, 18, viz.colors.white, 14);
                                viz.screenText('X', viz.width - 15, viz.originY + 5, viz.colors.text, 12);
                                viz.screenText('Y', viz.originX + 5, 15, viz.colors.text, 12);

                                for (var i = 0; i < N; i++) {
                                    var col = colors[i % colors.length];
                                    var pts = groups[i].pts;
                                    for (var t = 0; t < T; t++) {
                                        viz.drawPoint(pts[t].x, pts[t].y, col, null, 4);
                                    }
                                    // Individual mean marker
                                    var mx = 0, my = 0;
                                    for (var t2 = 0; t2 < T; t2++) { mx += pts[t2].x; my += pts[t2].y; }
                                    mx /= T; my /= T;
                                    viz.drawPoint(mx, my, col, 'i=' + (i + 1), 6);
                                }

                                // Pooled OLS
                                var allX = [], allY = [];
                                for (var i2 = 0; i2 < N; i2++) {
                                    for (var t3 = 0; t3 < T; t3++) {
                                        allX.push(groups[i2].pts[t3].x);
                                        allY.push(groups[i2].pts[t3].y);
                                    }
                                }
                                var meanX = VizEngine.mean(allX), meanY = VizEngine.mean(allY);
                                var numP = 0, denP = 0;
                                for (var k = 0; k < allX.length; k++) {
                                    numP += (allX[k] - meanX) * (allY[k] - meanY);
                                    denP += (allX[k] - meanX) * (allX[k] - meanX);
                                }
                                var bPooled = numP / denP;
                                var aPooled = meanY - bPooled * meanX;
                                viz.drawFunction(function(x) { return aPooled + bPooled * x; }, 0, 10, viz.colors.red, 2, 100);
                                viz.screenText('Pooled OLS: slope = ' + bPooled.toFixed(3), viz.width - 150, 38, viz.colors.red, 11);
                                viz.screenText('True beta = ' + trueBeta.toFixed(2), viz.width - 150, 54, viz.colors.yellow, 11);

                            } else {
                                viz.screenText('After Within Transformation (demeaned)', viz.width / 2, 18, viz.colors.white, 14);

                                // Recenter axes for demeaned data
                                var allDX = [], allDY = [];
                                for (var i3 = 0; i3 < N; i3++) {
                                    var pts3 = groups[i3].pts;
                                    var mxD = 0, myD = 0;
                                    for (var t4 = 0; t4 < T; t4++) { mxD += pts3[t4].x; myD += pts3[t4].y; }
                                    mxD /= T; myD /= T;
                                    for (var t5 = 0; t5 < T; t5++) {
                                        allDX.push(pts3[t5].x - mxD);
                                        allDY.push(pts3[t5].y - myD);
                                    }
                                }

                                // Draw demeaned points
                                var idx = 0;
                                for (var i4 = 0; i4 < N; i4++) {
                                    var col2 = colors[i4 % colors.length];
                                    for (var t6 = 0; t6 < T; t6++) {
                                        viz.drawPoint(allDX[idx], allDY[idx], col2, null, 4);
                                        idx++;
                                    }
                                }

                                // FE regression on demeaned data
                                if (showFELine) {
                                    var numFE = 0, denFE = 0;
                                    for (var j = 0; j < allDX.length; j++) {
                                        numFE += allDX[j] * allDY[j];
                                        denFE += allDX[j] * allDX[j];
                                    }
                                    var bFE = denFE > 0 ? numFE / denFE : 0;
                                    viz.drawFunction(function(x) { return bFE * x; }, -4, 4, viz.colors.green, 2.5, 100);
                                    viz.screenText('FE slope = ' + bFE.toFixed(3), viz.width - 130, 38, viz.colors.green, 11);
                                    viz.screenText('True beta = ' + trueBeta.toFixed(2), viz.width - 130, 54, viz.colors.yellow, 11);
                                }

                                viz.screenText('Demeaned X', viz.width - 15, viz.originY + 5, viz.colors.text, 11);
                                viz.screenText('Demeaned Y', viz.originX + 5, 15, viz.colors.text, 11);
                            }
                        }

                        draw();

                        VizEngine.createSlider(controls, 'True beta: ', 0, 2, trueBeta, 0.1, function(v) { trueBeta = v; groups = generateData(); draw(); });
                        VizEngine.createButton(controls, 'Toggle Demeaned View', function() { showDemeaned = !showDemeaned; draw(); });
                        VizEngine.createButton(controls, 'Toggle FE Line', function() { showFELine = !showFELine; draw(); });
                        VizEngine.createButton(controls, 'Regenerate Data', function() { groups = generateData(); draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show algebraically that the within transformation eliminates the fixed effect \\(\\alpha_i\\) from the equation \\(Y_{it} = \\alpha_i + \\beta X_{it} + \\varepsilon_{it}\\).',
                    hint: 'Average the equation over \\(t\\), then subtract.',
                    solution: 'Average over t: Y_bar_i = alpha_i + beta * X_bar_i + eps_bar_i. Subtract from original: (Y_it - Y_bar_i) = beta * (X_it - X_bar_i) + (eps_it - eps_bar_i). Since alpha_i - alpha_i = 0, the fixed effect is eliminated. QED.'
                },
                {
                    question: 'Consider the FE estimator with \\(N = 2\\) individuals and \\(T = 3\\) periods. Individual 1 has data \\((X, Y) = \\{(1,3), (2,5), (3,6)\\}\\) and individual 2 has \\((X, Y) = \\{(2,7), (3,8), (4,10)\\}\\). Compute \\(\\hat{\\beta}_{FE}\\).',
                    hint: 'Demean each individual separately, then run OLS on the pooled demeaned data.',
                    solution: 'Individual 1: X_bar = 2, Y_bar = 14/3. Demeaned: (-1, 3-14/3), (0, 5-14/3), (1, 6-14/3) = (-1, -5/3), (0, 1/3), (1, 4/3). Individual 2: X_bar = 3, Y_bar = 25/3. Demeaned: (-1, 7-25/3), (0, 8-25/3), (1, 10-25/3) = (-1, -4/3), (0, -1/3), (1, 5/3). Numerator = (-1)(-5/3) + 0 + (1)(4/3) + (-1)(-4/3) + 0 + (1)(5/3) = 5/3 + 4/3 + 4/3 + 5/3 = 18/3 = 6. Denominator = 1 + 0 + 1 + 1 + 0 + 1 = 4. beta_FE = 6/4 = 1.5.'
                },
                {
                    question: 'Why does the FE estimator require strict exogeneity rather than just contemporaneous exogeneity? What can go wrong if \\(E[\\varepsilon_{it} | X_{it}, \\alpha_i] = 0\\) but \\(E[\\varepsilon_{it} | X_{is}, \\alpha_i] \\neq 0\\) for \\(s \\neq t\\)?',
                    hint: 'The within transformation involves time averages, which mix observations from different periods.',
                    solution: 'The demeaned error is eps_ddot_it = eps_it - eps_bar_i = eps_it - (1/T) sum_s eps_is. Even if eps_it is uncorrelated with X_it, the demeaned error eps_ddot_it contains eps_is for s != t. If these are correlated with X_is (which appears in X_ddot_it through X_bar_i), the FE estimator is biased. This is why we need E[eps_it | X_i1, ..., X_iT, alpha_i] = 0 for ALL t, not just the contemporaneous condition.'
                },
                {
                    question: 'The LSDV approach includes \\(N\\) dummy variables. Why is this computationally wasteful for large \\(N\\), and how does the within transformation solve this?',
                    hint: 'Think about the size of the design matrix.',
                    solution: 'LSDV requires estimating N + k parameters (N intercepts plus k slope coefficients). For large N (e.g., millions of individuals), inverting the (N+k) x (N+k) matrix is infeasible. The within transformation reduces this to estimating only k parameters on demeaned data, an enormous computational savings. The FE estimates of alpha_i can be recovered afterward as alpha_hat_i = Y_bar_i - beta_hat * X_bar_i.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 3: First-Differencing
        // --------------------------------------------------------
        {
            id: 'ch14-sec03',
            title: 'First-Differencing',
            content: `<h2>First-Differencing</h2>
<p>An alternative to the within transformation is <strong>first-differencing</strong>, which also eliminates the fixed effect \\(\\alpha_i\\).</p>

<div class="env-block definition">
<div class="env-title">Definition (First-Difference Estimator)</div>
<div class="env-body">
<p>Subtract the equation at \\(t-1\\) from the equation at \\(t\\):</p>
$$Y_{it} - Y_{i,t-1} = \\beta(X_{it} - X_{i,t-1}) + (\\varepsilon_{it} - \\varepsilon_{i,t-1}).$$
<p>Writing \\(\\Delta Y_{it} = Y_{it} - Y_{i,t-1}\\), etc.:</p>
$$\\Delta Y_{it} = \\beta \\, \\Delta X_{it} + \\Delta \\varepsilon_{it}.$$
<p>The fixed effect \\(\\alpha_i\\) cancels because \\(\\alpha_i - \\alpha_i = 0\\). OLS on this differenced equation yields the FD estimator \\(\\hat{\\beta}_{FD}\\).</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (FE = FD when T = 2)</div>
<div class="env-body">
<p>When there are exactly \\(T = 2\\) time periods, the FE and FD estimators are <strong>numerically identical</strong>:</p>
$$\\hat{\\beta}_{FE} = \\hat{\\beta}_{FD} \\quad \\text{when } T = 2.$$
<p>This is because demeaning with two periods is equivalent to differencing: \\(Y_{i1} - \\bar{Y}_i = (Y_{i1} - Y_{i2})/2\\) and \\(\\Delta Y_{i2} = Y_{i2} - Y_{i1}\\), which are proportional.</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (Efficiency Comparison for T > 2)</div>
<div class="env-body">
<p>When \\(T > 2\\) and both estimators are consistent:</p>
<ul>
<li>If \\(\\varepsilon_{it}\\) are <strong>serially uncorrelated</strong> (i.e., \\(\\text{Cov}(\\varepsilon_{it}, \\varepsilon_{is}) = 0\\) for \\(t \\neq s\\)), then FE is more efficient than FD.</li>
<li>If \\(\\varepsilon_{it}\\) follows a <strong>random walk</strong> (i.e., \\(\\varepsilon_{it} = \\varepsilon_{i,t-1} + u_{it}\\) with \\(u_{it}\\) i.i.d.), then FD is more efficient because \\(\\Delta \\varepsilon_{it} = u_{it}\\) is i.i.d.</li>
</ul>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>First-differencing uses only <em>consecutive</em> pairs of observations, while the within estimator uses all time periods simultaneously. When errors are uncorrelated, FE extracts more information. But when errors are highly persistent (random walk), consecutive differences remove the persistence efficiently, making FD preferred.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch14-viz-fe-vs-fd"></div>

<div class="env-block example">
<div class="env-title">Example</div>
<div class="env-body">
<p>Consider estimating the effect of environmental regulation \\(X_{it}\\) on factory emissions \\(Y_{it}\\). If idiosyncratic shocks to emissions are transient (serially uncorrelated), use FE. If emission levels tend to drift (random walk), FD is preferred because \\(\\Delta \\varepsilon_{it}\\) will be well-behaved.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch14-viz-fe-vs-fd',
                    title: 'FE vs. FD Estimator Comparison',
                    description: 'Compare fixed effects and first-differencing under different error structures',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 1, originX: 80, originY: 340});
                        var trueBeta = 1.0;
                        var errorType = 'iid'; // 'iid' or 'rw'
                        var nSim = 200;
                        var N = 30;
                        var T = 10;

                        function seedRandom(s) {
                            var x = Math.sin(s * 9301 + 49297) * 49297;
                            return x - Math.floor(x);
                        }

                        function normalApprox(s) {
                            var u1 = seedRandom(s);
                            var u2 = seedRandom(s + 1000);
                            if (u1 < 0.001) u1 = 0.001;
                            return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                        }

                        function simulate(simSeed) {
                            var feEstimates = [];
                            var fdEstimates = [];

                            for (var sim = 0; sim < nSim; sim++) {
                                var seed = simSeed + sim * 10000;
                                // Generate panel data
                                var feNum = 0, feDen = 0;
                                var fdNum = 0, fdDen = 0;

                                for (var i = 0; i < N; i++) {
                                    var alpha = normalApprox(seed + i * 500) * 2;
                                    var xArr = [], yArr = [];
                                    var prevEps = 0;

                                    for (var t = 0; t < T; t++) {
                                        var x = 2 + normalApprox(seed + i * 500 + t * 3 + 1) + 0.3 * alpha;
                                        var epsNew;
                                        if (errorType === 'iid') {
                                            epsNew = normalApprox(seed + i * 500 + t * 3 + 2) * 0.8;
                                        } else {
                                            epsNew = prevEps + normalApprox(seed + i * 500 + t * 3 + 2) * 0.5;
                                            prevEps = epsNew;
                                        }
                                        var y = alpha + trueBeta * x + epsNew;
                                        xArr.push(x);
                                        yArr.push(y);
                                    }

                                    // FE: within transformation
                                    var xMean = 0, yMean = 0;
                                    for (var t2 = 0; t2 < T; t2++) { xMean += xArr[t2]; yMean += yArr[t2]; }
                                    xMean /= T; yMean /= T;
                                    for (var t3 = 0; t3 < T; t3++) {
                                        var xd = xArr[t3] - xMean;
                                        var yd = yArr[t3] - yMean;
                                        feNum += xd * yd;
                                        feDen += xd * xd;
                                    }

                                    // FD: first differencing
                                    for (var t4 = 1; t4 < T; t4++) {
                                        var dX = xArr[t4] - xArr[t4 - 1];
                                        var dY = yArr[t4] - yArr[t4 - 1];
                                        fdNum += dX * dY;
                                        fdDen += dX * dX;
                                    }
                                }

                                feEstimates.push(feDen > 0 ? feNum / feDen : trueBeta);
                                fdEstimates.push(fdDen > 0 ? fdNum / fdDen : trueBeta);
                            }

                            return {fe: feEstimates, fd: fdEstimates};
                        }

                        var results = simulate(42);

                        function draw() {
                            viz.clear();

                            var ctx = viz.ctx;
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, viz.width, viz.height);

                            viz.screenText('Sampling Distribution: FE vs FD (' + (errorType === 'iid' ? 'i.i.d. Errors' : 'Random Walk Errors') + ')', viz.width / 2, 18, viz.colors.white, 14);

                            // Compute histograms
                            var binWidth = 0.04;
                            var minVal = trueBeta - 0.8;
                            var maxVal = trueBeta + 0.8;
                            var nBins = Math.ceil((maxVal - minVal) / binWidth);

                            function makeHist(arr) {
                                var bins = [];
                                for (var b = 0; b < nBins; b++) bins.push(0);
                                for (var k = 0; k < arr.length; k++) {
                                    var bi = Math.floor((arr[k] - minVal) / binWidth);
                                    if (bi >= 0 && bi < nBins) bins[bi]++;
                                }
                                return bins;
                            }

                            var feHist = makeHist(results.fe);
                            var fdHist = makeHist(results.fd);
                            var maxCount = 0;
                            for (var b = 0; b < nBins; b++) {
                                if (feHist[b] > maxCount) maxCount = feHist[b];
                                if (fdHist[b] > maxCount) maxCount = fdHist[b];
                            }
                            if (maxCount === 0) maxCount = 1;

                            // Chart area
                            var chartLeft = 100, chartRight = viz.width - 40;
                            var chartTop = 50, chartBottom = viz.height - 80;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBottom - chartTop;

                            // Draw axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartBottom);
                            ctx.lineTo(chartRight, chartBottom);
                            ctx.stroke();

                            // True beta line
                            var trueBetaX = chartLeft + (trueBeta - minVal) / (maxVal - minVal) * chartW;
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(trueBetaX, chartTop);
                            ctx.lineTo(trueBetaX, chartBottom);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('True beta = ' + trueBeta.toFixed(2), trueBetaX, chartTop - 8, viz.colors.yellow, 11);

                            // Draw histograms
                            var barW = chartW / nBins;
                            for (var b2 = 0; b2 < nBins; b2++) {
                                var bx = chartLeft + b2 * barW;
                                // FE bars
                                var feH = feHist[b2] / maxCount * chartH * 0.9;
                                if (feH > 0) {
                                    ctx.fillStyle = viz.colors.blue + '88';
                                    ctx.fillRect(bx, chartBottom - feH, barW * 0.45, feH);
                                }
                                // FD bars
                                var fdH = fdHist[b2] / maxCount * chartH * 0.9;
                                if (fdH > 0) {
                                    ctx.fillStyle = viz.colors.orange + '88';
                                    ctx.fillRect(bx + barW * 0.45, chartBottom - fdH, barW * 0.45, fdH);
                                }
                            }

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var lbl = minVal; lbl <= maxVal + 0.001; lbl += 0.2) {
                                var lx = chartLeft + (lbl - minVal) / (maxVal - minVal) * chartW;
                                ctx.fillText(lbl.toFixed(1), lx, chartBottom + 4);
                            }
                            viz.screenText('beta estimate', viz.width / 2, viz.height - 28, viz.colors.text, 11);

                            // Compute stats
                            var feMean = VizEngine.mean(results.fe);
                            var fdMean = VizEngine.mean(results.fd);
                            var feSD = Math.sqrt(VizEngine.variance(results.fe));
                            var fdSD = Math.sqrt(VizEngine.variance(results.fd));

                            // Legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(viz.width - 250, 50, 12, 12);
                            viz.screenText('FE: mean=' + feMean.toFixed(3) + ', sd=' + feSD.toFixed(3), viz.width - 170, 56, viz.colors.blue, 11, 'left', 'middle');

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(viz.width - 250, 70, 12, 12);
                            viz.screenText('FD: mean=' + fdMean.toFixed(3) + ', sd=' + fdSD.toFixed(3), viz.width - 170, 76, viz.colors.orange, 11, 'left', 'middle');

                            var winner = feSD < fdSD ? 'FE more efficient' : 'FD more efficient';
                            viz.screenText(winner, viz.width / 2, viz.height - 48, viz.colors.green, 12);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'True beta: ', 0, 2, trueBeta, 0.1, function(v) { trueBeta = v; results = simulate(42); draw(); });
                        VizEngine.createButton(controls, 'i.i.d. Errors', function() { errorType = 'iid'; results = simulate(42); draw(); });
                        VizEngine.createButton(controls, 'Random Walk Errors', function() { errorType = 'rw'; results = simulate(42); draw(); });
                        VizEngine.createButton(controls, 'Re-simulate', function() { results = simulate(Math.floor(Math.random() * 100000)); draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that when \\(T = 2\\), the FE and FD estimators are identical.',
                    hint: 'With \\(T = 2\\), \\(\\bar{X}_i = (X_{i1} + X_{i2})/2\\). Compute the demeaned values and compare to the first differences.',
                    solution: 'With T=2: X_ddot_i1 = X_i1 - (X_i1+X_i2)/2 = (X_i1-X_i2)/2 = -Delta_X_i2/2 and X_ddot_i2 = (X_i2-X_i1)/2 = Delta_X_i2/2. Similarly for Y. The FE numerator is sum_i [(-DX/2)(-DY/2) + (DX/2)(DY/2)] = sum_i DX*DY/2 and denominator is sum_i DX^2/2. So beta_FE = sum_i DX*DY / sum_i DX^2 = beta_FD.'
                },
                {
                    question: 'If \\(\\varepsilon_{it}\\) are i.i.d. with variance \\(\\sigma^2\\), what is the variance of \\(\\Delta \\varepsilon_{it} = \\varepsilon_{it} - \\varepsilon_{i,t-1}\\)? How does this relate to the efficiency of FD?',
                    hint: 'Use the fact that the variance of a difference of independent variables is the sum of their variances.',
                    solution: 'Var(Delta eps_it) = Var(eps_it) + Var(eps_{i,t-1}) = 2 * sigma^2 (since they are independent). Furthermore, Cov(Delta eps_it, Delta eps_{i,t-1}) = Cov(eps_it - eps_{i,t-1}, eps_{i,t-1} - eps_{i,t-2}) = -Var(eps_{i,t-1}) = -sigma^2. So first-differencing INTRODUCES negative serial correlation (-0.5) in the errors even when original errors are i.i.d., which inflates variance relative to FE.'
                },
                {
                    question: 'Propose a practical diagnostic to decide between FE and FD in an empirical application.',
                    hint: 'Think about testing for serial correlation in the errors.',
                    solution: 'Run the FD regression and test for serial correlation in the residuals Delta_eps_hat_it. Under i.i.d. original errors, the FD residuals should have first-order autocorrelation of -0.5. If the estimated autocorrelation is close to -0.5, original errors are likely i.i.d. and FE is preferred. If the autocorrelation is close to 0, then Delta eps is approximately i.i.d., suggesting original errors follow a random walk, and FD is preferred. This is Wooldridge (2010) test approach.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 4: Two-Way Fixed Effects
        // --------------------------------------------------------
        {
            id: 'ch14-sec04',
            title: 'Two-Way Fixed Effects',
            content: `<h2>Two-Way Fixed Effects</h2>
<p>Two-way fixed effects (TWFE) extends the basic FE model by including both <strong>individual fixed effects</strong> \\(\\alpha_i\\) and <strong>time fixed effects</strong> \\(\\gamma_t\\), controlling for unobserved heterogeneity in both dimensions.</p>

<div class="env-block definition">
<div class="env-title">Definition (TWFE Model)</div>
<div class="env-body">
<p>The two-way fixed effects model is:</p>
$$Y_{it} = \\alpha_i + \\gamma_t + \\beta X_{it} + \\varepsilon_{it}$$
<p>where \\(\\alpha_i\\) absorbs all time-invariant individual characteristics and \\(\\gamma_t\\) absorbs all individual-invariant time shocks (e.g., business cycles, policy changes affecting everyone equally).</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (TWFE Estimation)</div>
<div class="env-body">
<p>The TWFE estimator can be computed by:</p>
<ol>
<li><strong>Double demeaning</strong>: subtract both individual means and time means, add back the grand mean:</li>
</ol>
$$\\tilde{Y}_{it} = Y_{it} - \\bar{Y}_{i\\cdot} - \\bar{Y}_{\\cdot t} + \\bar{Y}_{\\cdot\\cdot}$$
<p>and similarly for \\(X_{it}\\). Then \\(\\hat{\\beta}_{TWFE}\\) is OLS on the double-demeaned data.</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Connection to Difference-in-Differences</div>
<div class="env-body">
<p>TWFE is closely connected to DiD. In the canonical 2x2 DiD setup (2 groups, 2 periods), the TWFE regression:</p>
$$Y_{it} = \\alpha_i + \\gamma_t + \\beta \\cdot D_{it} + \\varepsilon_{it}$$
<p>where \\(D_{it} = 1\\) if unit \\(i\\) is treated at time \\(t\\), recovers exactly the standard DiD estimator. With multiple periods and staggered treatment adoption, TWFE generalizes DiD but can produce <strong>biased estimates</strong> when treatment effects are heterogeneous across cohorts (see Chapter 16 on Staggered DiD).</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning: Heterogeneous Treatment Effects</div>
<div class="env-body">
<p>Recent research (de Chaisemartin and d'Haultfoeuille 2020; Goodman-Bacon 2021) shows that with staggered treatment timing, TWFE can produce <strong>negative weights</strong> on some group-time treatment effects, leading to estimates that may not represent any interpretable causal parameter. Always check for treatment effect heterogeneity in TWFE applications.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch14-viz-twfe-decomposition"></div>

<div class="env-block example">
<div class="env-title">Example</div>
<div class="env-body">
<p>Consider studying the effect of a minimum wage increase on employment across U.S. states. The model:</p>
$$\\text{Employment}_{it} = \\alpha_i + \\gamma_t + \\beta \\cdot \\text{MinWage}_{it} + \\varepsilon_{it}$$
<p>Here \\(\\alpha_i\\) controls for state-specific factors (industry composition, climate) and \\(\\gamma_t\\) controls for national economic trends (recessions, federal policy). The coefficient \\(\\beta\\) is identified from within-state variation in minimum wages, after removing common time trends.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch14-viz-twfe-decomposition',
                    title: 'TWFE Decomposition: Unit and Time Effects',
                    description: 'Visualize how TWFE decomposes variation into individual effects, time effects, and the treatment effect',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 1, originX: 0, originY: 0});
                        var trueBeta = 2.0;
                        var showUnit = true;
                        var showTime = true;
                        var showResidual = false;

                        var N = 5;
                        var T = 6;
                        var alphas = [1, 2.5, 4, 5.5, 3];
                        var gammas = [0, 0.5, 1.2, 1.8, 2.5, 3.0];

                        function seedRandom(s) {
                            var x = Math.sin(s * 9301 + 49297) * 49297;
                            return x - Math.floor(x);
                        }

                        // Treatment: units 3,4 treated starting period 3
                        function treated(i, t) {
                            return (i >= 2) && (t >= 3);
                        }

                        function generateY(i, t) {
                            var eps = (seedRandom(i * 100 + t * 7 + 42) - 0.5) * 0.6;
                            return alphas[i] + gammas[t] + (treated(i, t) ? trueBeta : 0) + eps;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Two-Way Fixed Effects Decomposition', viz.width / 2, 18, viz.colors.white, 14);

                            var cellW = (viz.width - 140) / T;
                            var cellH = (viz.height - 130) / N;
                            var left = 100;
                            var top = 55;

                            var unitLabels = ['Unit 1', 'Unit 2', 'Unit 3 (treated)', 'Unit 4 (treated)', 'Unit 5'];
                            var timeLabels = ['t=1', 't=2', 't=3', 't=4', 't=5', 't=6'];

                            // Column headers
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            for (var t = 0; t < T; t++) {
                                ctx.fillText(timeLabels[t], left + t * cellW + cellW / 2, top - 10);
                            }

                            // Row labels
                            ctx.textAlign = 'right';
                            for (var i = 0; i < N; i++) {
                                var yPos = top + i * cellH + cellH / 2;
                                ctx.fillStyle = i >= 2 ? viz.colors.orange : viz.colors.text;
                                ctx.fillText(unitLabels[i], left - 8, yPos);
                            }

                            // Draw cells
                            for (var i2 = 0; i2 < N; i2++) {
                                for (var t2 = 0; t2 < T; t2++) {
                                    var cx = left + t2 * cellW;
                                    var cy = top + i2 * cellH;
                                    var y = generateY(i2, t2);

                                    // Color by treatment status
                                    var isTreated = treated(i2, t2);
                                    var bgColor;
                                    if (isTreated) {
                                        bgColor = viz.colors.orange + '33';
                                    } else {
                                        bgColor = viz.colors.blue + '22';
                                    }
                                    ctx.fillStyle = bgColor;
                                    ctx.fillRect(cx + 1, cy + 1, cellW - 2, cellH - 2);

                                    // Cell border
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.5;
                                    ctx.strokeRect(cx, cy, cellW, cellH);

                                    // Show decomposition
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    var centerX = cx + cellW / 2;
                                    var centerY = cy + cellH / 2;

                                    if (showResidual) {
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.font = '11px -apple-system,sans-serif';
                                        ctx.fillText('Y=' + y.toFixed(1), centerX, centerY - 8);

                                        var parts = [];
                                        if (showUnit) parts.push('a=' + alphas[i2].toFixed(1));
                                        if (showTime) parts.push('g=' + gammas[t2].toFixed(1));
                                        if (isTreated) parts.push('b=' + trueBeta.toFixed(1));

                                        ctx.fillStyle = viz.colors.text;
                                        ctx.font = '9px -apple-system,sans-serif';
                                        ctx.fillText(parts.join(' + '), centerX, centerY + 10);
                                    } else {
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.font = '12px -apple-system,sans-serif';
                                        ctx.fillText(y.toFixed(1), centerX, centerY);
                                    }
                                }
                            }

                            // Annotations
                            if (showUnit) {
                                // Draw alpha_i bracket on the left
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 1.5;
                                var bracketX = left - 55;
                                ctx.beginPath();
                                ctx.moveTo(bracketX, top);
                                ctx.lineTo(bracketX - 6, top);
                                ctx.lineTo(bracketX - 6, top + N * cellH);
                                ctx.lineTo(bracketX, top + N * cellH);
                                ctx.stroke();
                                viz.screenText('alpha_i', bracketX - 22, top + N * cellH / 2, viz.colors.teal, 10);
                            }

                            if (showTime) {
                                // Draw gamma_t bracket on top
                                ctx.strokeStyle = viz.colors.purple;
                                ctx.lineWidth = 1.5;
                                var bracketY = top - 22;
                                ctx.beginPath();
                                ctx.moveTo(left, bracketY);
                                ctx.lineTo(left, bracketY - 6);
                                ctx.lineTo(left + T * cellW, bracketY - 6);
                                ctx.lineTo(left + T * cellW, bracketY);
                                ctx.stroke();
                                viz.screenText('gamma_t', left + T * cellW / 2, bracketY - 14, viz.colors.purple, 10);
                            }

                            // Treatment region label
                            var treatLeft = left + 3 * cellW;
                            var treatTop = top + 2 * cellH;
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([4, 3]);
                            ctx.strokeRect(treatLeft, treatTop, 3 * cellW, 2 * cellH);
                            ctx.setLineDash([]);
                            viz.screenText('Treatment region (D_it=1)', treatLeft + 1.5 * cellW, top + N * cellH + 20, viz.colors.orange, 11);

                            // Legend
                            viz.screenText('Blue = control, Orange = treated | TWFE identifies beta from within-unit, within-time variation', viz.width / 2, viz.height - 12, viz.colors.text, 10);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'Treatment effect: ', 0, 5, trueBeta, 0.2, function(v) { trueBeta = v; draw(); });
                        VizEngine.createButton(controls, 'Toggle Decomposition', function() { showResidual = !showResidual; draw(); });
                        VizEngine.createButton(controls, 'Toggle Unit FE', function() { showUnit = !showUnit; draw(); });
                        VizEngine.createButton(controls, 'Toggle Time FE', function() { showTime = !showTime; draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write out the double-demeaning formula for the TWFE estimator. Verify that both \\(\\alpha_i\\) and \\(\\gamma_t\\) are eliminated.',
                    hint: 'Define \\(\\bar{Y}_{i\\cdot}\\), \\(\\bar{Y}_{\\cdot t}\\), and \\(\\bar{Y}_{\\cdot\\cdot}\\) as individual, time, and grand means.',
                    solution: 'Y_tilde_it = Y_it - Y_bar_i. - Y_bar_.t + Y_bar_.. Substitute Y_it = alpha_i + gamma_t + beta*X_it + eps_it: Y_bar_i. = alpha_i + gamma_bar + beta*X_bar_i. + eps_bar_i.; Y_bar_.t = alpha_bar + gamma_t + beta*X_bar_.t + eps_bar_.t; Y_bar_.. = alpha_bar + gamma_bar + beta*X_bar_.. + eps_bar_... Subtracting: Y_tilde_it = (alpha_i - alpha_i - alpha_bar + alpha_bar) + (gamma_t - gamma_bar - gamma_t + gamma_bar) + beta*X_tilde_it + eps_tilde_it = beta*X_tilde_it + eps_tilde_it. Both alpha_i and gamma_t cancel.'
                },
                {
                    question: 'In a 2x2 DiD setup with groups \\(i \\in \\{0,1\\}\\) and periods \\(t \\in \\{0,1\\}\\), show that the TWFE coefficient \\(\\hat{\\beta}\\) from regressing \\(Y_{it}\\) on \\(\\alpha_i + \\gamma_t + \\beta D_{it}\\) equals the standard DiD estimator \\((\\bar{Y}_{11} - \\bar{Y}_{10}) - (\\bar{Y}_{01} - \\bar{Y}_{00})\\).',
                    hint: 'Set up the four moment conditions from the TWFE model with 2 groups and 2 periods.',
                    solution: 'With 2 groups and 2 periods: E[Y_00] = alpha_0 + gamma_0, E[Y_01] = alpha_0 + gamma_1, E[Y_10] = alpha_1 + gamma_0, E[Y_11] = alpha_1 + gamma_1 + beta. The DiD estimator: (E[Y_11] - E[Y_10]) - (E[Y_01] - E[Y_00]) = (alpha_1 + gamma_1 + beta - alpha_1 - gamma_0) - (alpha_0 + gamma_1 - alpha_0 - gamma_0) = (gamma_1 - gamma_0 + beta) - (gamma_1 - gamma_0) = beta. This equals the TWFE coefficient.'
                },
                {
                    question: 'Explain the "negative weighting" problem with TWFE under staggered treatment adoption. Why might \\(\\hat{\\beta}_{TWFE}\\) be negative even if all individual treatment effects are positive?',
                    hint: 'Think about what happens when already-treated units serve as controls for later-treated units.',
                    solution: 'TWFE with staggered adoption implicitly compares: (1) newly treated vs never-treated (proper DiD), (2) newly treated vs already-treated. In comparison (2), already-treated units act as "controls." If treatment effects grow over time, the already-treated units have rising Y, making the newly-treated look worse by comparison. Goodman-Bacon (2021) shows TWFE is a weighted average of all 2x2 DiD comparisons, and some comparisons (already-treated as control) receive NEGATIVE weights. So even if every unit has a positive treatment effect, the weighted average can be negative.'
                },
                {
                    question: 'Consider a panel with \\(N = 50\\) states and \\(T = 20\\) years. How many parameters does the TWFE model estimate (including all fixed effects and \\(\\beta\\))?',
                    hint: 'Count individual FEs, time FEs, and the treatment coefficient. Remember that one FE in each dimension is absorbed by the intercept.',
                    solution: 'With normalization (one unit and one time FE set to zero as reference): (N-1) unit FEs + (T-1) time FEs + 1 treatment coefficient = 49 + 19 + 1 = 69 parameters. Without normalization, it is N + T + 1 = 71, but 2 are not identified (collinear with the constant), so effectively 69 free parameters.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 5: Correlated Random Effects & Hausman Test
        // --------------------------------------------------------
        {
            id: 'ch14-sec05',
            title: 'Correlated Random Effects & Hausman Test',
            content: `<h2>Correlated Random Effects & Hausman Test</h2>
<p>The random effects (RE) model treats \\(\\alpha_i\\) as a random variable uncorrelated with the regressors. When this assumption holds, RE is more efficient than FE. The Hausman test helps decide between the two.</p>

<div class="env-block definition">
<div class="env-title">Definition (Random Effects Model)</div>
<div class="env-body">
<p>The RE model is:</p>
$$Y_{it} = \\mu + \\beta X_{it} + \\alpha_i + \\varepsilon_{it}$$
<p>where \\(\\alpha_i \\sim (0, \\sigma_\\alpha^2)\\) is treated as a <strong>random</strong> error component, with the key assumption:</p>
$$E[\\alpha_i | X_{i1}, \\ldots, X_{iT}] = 0.$$
<p>Under this assumption, the RE (GLS) estimator is consistent and more efficient than FE because it uses both within and between variation.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Mundlak (1978) Device)</div>
<div class="env-body">
<p>Mundlak proposed modeling the correlation between \\(\\alpha_i\\) and \\(X_{it}\\) directly:</p>
$$\\alpha_i = \\delta + \\xi \\bar{X}_i + a_i, \\qquad a_i \\perp X_{it}.$$
<p>Substituting into the original model:</p>
$$Y_{it} = (\\mu + \\delta) + \\beta X_{it} + \\xi \\bar{X}_i + (a_i + \\varepsilon_{it}).$$
<p>Key insight: if \\(\\xi = 0\\), then \\(\\alpha_i\\) is uncorrelated with \\(X\\) and RE is valid. If \\(\\xi \\neq 0\\), the fixed effect is correlated with the regressor. Moreover, applying RE to this augmented model yields the <strong>FE estimator</strong> for \\(\\beta\\).</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (Hausman Test)</div>
<div class="env-body">
<p>The Hausman (1978) test compares FE and RE estimates:</p>
$$H_0: E[\\alpha_i | X_{i1}, \\ldots, X_{iT}] = 0 \\quad (\\text{RE is consistent})$$
$$H_1: E[\\alpha_i | X_{i1}, \\ldots, X_{iT}] \\neq 0 \\quad (\\text{only FE is consistent})$$
<p>The test statistic is:</p>
$$H = (\\hat{\\beta}_{FE} - \\hat{\\beta}_{RE})^\\top [\\widehat{\\text{Var}}(\\hat{\\beta}_{FE}) - \\widehat{\\text{Var}}(\\hat{\\beta}_{RE})]^{-1} (\\hat{\\beta}_{FE} - \\hat{\\beta}_{RE}) \\sim \\chi^2_k$$
<p>under \\(H_0\\), where \\(k\\) is the number of time-varying regressors. Under \\(H_0\\), both estimators are consistent but RE is efficient, so the difference should be small. Under \\(H_1\\), RE is inconsistent and the difference is large.</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition: FE vs. RE Trade-off</div>
<div class="env-body">
<table style="width:100%;border-collapse:collapse;margin:8px 0;">
<tr style="border-bottom:1px solid #30363d;"><th style="padding:6px;text-align:left;">Criterion</th><th style="padding:6px;">Fixed Effects</th><th style="padding:6px;">Random Effects</th></tr>
<tr><td style="padding:6px;">Consistency</td><td style="padding:6px;">Always (if strict exogeneity)</td><td style="padding:6px;">Only if \\(\\alpha_i \\perp X_{it}\\)</td></tr>
<tr><td style="padding:6px;">Efficiency</td><td style="padding:6px;">Lower</td><td style="padding:6px;">Higher (uses between variation)</td></tr>
<tr><td style="padding:6px;">Time-invariant regressors</td><td style="padding:6px;">Cannot estimate</td><td style="padding:6px;">Can estimate</td></tr>
<tr><td style="padding:6px;">Small \\(T\\), large \\(N\\)</td><td style="padding:6px;">Incidental parameters issue</td><td style="padding:6px;">Well-behaved</td></tr>
</table>
</div>
</div>

<div class="viz-placeholder" data-viz="ch14-viz-hausman-test"></div>

<div class="env-block example">
<div class="env-title">Example (Hausman Test in Practice)</div>
<div class="env-body">
<p>Studying returns to education using worker panel data: \\(Y_{it} = \\log(\\text{wage}_{it})\\), \\(X_{it} = \\text{experience}_{it}\\). We suspect unobserved ability \\(\\alpha_i\\) correlates with experience (higher-ability workers accumulate experience faster). Running the Hausman test: if we reject \\(H_0\\), use FE. If we fail to reject, RE is more efficient and can also estimate the effect of time-invariant variables like education level.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch14-viz-hausman-test',
                    title: 'Hausman Test: FE vs RE Decision with Simulation',
                    description: 'Simulate data under different correlation structures and see how the Hausman test performs',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 1, originX: 0, originY: 0});
                        var trueBeta = 1.0;
                        var correlation = 0.0; // correlation between alpha_i and X_it
                        var N = 50;
                        var T = 8;

                        function normalApprox(s) {
                            var u1 = Math.sin(s * 9301 + 49297) * 49297;
                            u1 = u1 - Math.floor(u1);
                            var u2 = Math.sin((s + 500) * 9301 + 49297) * 49297;
                            u2 = u2 - Math.floor(u2);
                            if (u1 < 0.001) u1 = 0.001;
                            return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                        }

                        function simulate(seed) {
                            // Generate data
                            var allX = [], allY = [], allI = [];
                            for (var i = 0; i < N; i++) {
                                var alpha = normalApprox(seed + i * 300) * 1.5;
                                for (var t = 0; t < T; t++) {
                                    var xBase = normalApprox(seed + i * 300 + t * 3 + 1) * 1.0;
                                    var x = xBase + correlation * alpha; // correlation with FE
                                    var eps = normalApprox(seed + i * 300 + t * 3 + 2) * 0.5;
                                    var y = alpha + trueBeta * x + eps;
                                    allX.push(x);
                                    allY.push(y);
                                    allI.push(i);
                                }
                            }

                            // FE estimator
                            var feNum = 0, feDen = 0;
                            for (var i2 = 0; i2 < N; i2++) {
                                var xm = 0, ym = 0;
                                for (var t2 = 0; t2 < T; t2++) {
                                    xm += allX[i2 * T + t2];
                                    ym += allY[i2 * T + t2];
                                }
                                xm /= T; ym /= T;
                                for (var t3 = 0; t3 < T; t3++) {
                                    var xd = allX[i2 * T + t3] - xm;
                                    var yd = allY[i2 * T + t3] - ym;
                                    feNum += xd * yd;
                                    feDen += xd * xd;
                                }
                            }
                            var betaFE = feDen > 0 ? feNum / feDen : trueBeta;

                            // RE estimator (simplified: weighted average of within and between)
                            // Between estimator
                            var xMeans = [], yMeans = [];
                            for (var i3 = 0; i3 < N; i3++) {
                                var xm2 = 0, ym2 = 0;
                                for (var t4 = 0; t4 < T; t4++) {
                                    xm2 += allX[i3 * T + t4];
                                    ym2 += allY[i3 * T + t4];
                                }
                                xMeans.push(xm2 / T);
                                yMeans.push(ym2 / T);
                            }
                            var bwNum = 0, bwDen = 0;
                            var gx = VizEngine.mean(xMeans), gy = VizEngine.mean(yMeans);
                            for (var i4 = 0; i4 < N; i4++) {
                                bwNum += (xMeans[i4] - gx) * (yMeans[i4] - gy);
                                bwDen += (xMeans[i4] - gx) * (xMeans[i4] - gx);
                            }
                            var betaBW = bwDen > 0 ? bwNum / bwDen : trueBeta;

                            // Estimate sigma_eps^2 and sigma_alpha^2
                            var ssr = 0;
                            for (var i5 = 0; i5 < N; i5++) {
                                var xm3 = xMeans[i5], ym3 = yMeans[i5];
                                for (var t5 = 0; t5 < T; t5++) {
                                    var resid = (allY[i5 * T + t5] - ym3) - betaFE * (allX[i5 * T + t5] - xm3);
                                    ssr += resid * resid;
                                }
                            }
                            var sigmaEps2 = ssr / (N * T - N - 1);

                            var ssrBW = 0;
                            for (var i6 = 0; i6 < N; i6++) {
                                var residBW = (yMeans[i6] - gy) - betaBW * (xMeans[i6] - gx);
                                ssrBW += residBW * residBW;
                            }
                            var sigmaTotal2 = ssrBW / (N - 2);
                            var sigmaAlpha2 = Math.max(0, sigmaTotal2 - sigmaEps2 / T);

                            // RE weight (theta)
                            var theta = 1 - Math.sqrt(sigmaEps2 / (sigmaEps2 + T * sigmaAlpha2));
                            if (!isFinite(theta) || theta < 0) theta = 0;
                            if (theta > 1) theta = 1;

                            // RE estimator (quasi-demeaning)
                            var reNum = 0, reDen = 0;
                            for (var i7 = 0; i7 < N; i7++) {
                                for (var t6 = 0; t6 < T; t6++) {
                                    var xTilde = allX[i7 * T + t6] - theta * xMeans[i7];
                                    var yTilde = allY[i7 * T + t6] - theta * yMeans[i7];
                                    var gxTilde = (1 - theta) * gx;
                                    var gyTilde = (1 - theta) * gy;
                                    reNum += (xTilde - gxTilde) * (yTilde - gyTilde);
                                    reDen += (xTilde - gxTilde) * (xTilde - gxTilde);
                                }
                            }
                            var betaRE = reDen > 0 ? reNum / reDen : trueBeta;

                            // Hausman statistic (simplified scalar case)
                            var varFE = sigmaEps2 / feDen;
                            var varRE = sigmaEps2 / reDen;
                            var varDiff = Math.max(varFE - varRE, 0.0001);
                            var hausman = (betaFE - betaRE) * (betaFE - betaRE) / varDiff;

                            return {
                                betaFE: betaFE,
                                betaRE: betaRE,
                                betaBW: betaBW,
                                hausman: hausman,
                                theta: theta,
                                pValue: Math.exp(-hausman / 2) // approximate
                            };
                        }

                        var result = simulate(42);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Hausman Test: FE vs RE', viz.width / 2, 18, viz.colors.white, 14);

                            // Decision flowchart area
                            var centerX = viz.width / 2;

                            // Step 1: Run FE and RE
                            var boxW = 200, boxH = 36;

                            // FE box
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(80, 55, boxW, boxH);
                            viz.screenText('FE estimate: ' + result.betaFE.toFixed(3), 80 + boxW / 2, 55 + boxH / 2, viz.colors.blue, 12);

                            // RE box
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.strokeRect(viz.width - 80 - boxW, 55, boxW, boxH);
                            viz.screenText('RE estimate: ' + result.betaRE.toFixed(3), viz.width - 80 - boxW / 2, 55 + boxH / 2, viz.colors.teal, 12);

                            // Arrow down to Hausman box
                            ctx.strokeStyle = viz.colors.text;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(80 + boxW / 2, 91);
                            ctx.lineTo(centerX, 120);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(viz.width - 80 - boxW / 2, 91);
                            ctx.lineTo(centerX, 120);
                            ctx.stroke();

                            // Hausman test box
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(centerX - 150, 120, 300, boxH);
                            viz.screenText('Hausman H = ' + result.hausman.toFixed(2) + ' (chi-sq, df=1)', centerX, 120 + boxH / 2, viz.colors.yellow, 12);

                            // Decision
                            var reject = result.hausman > 3.84; // chi-sq critical value at 5%
                            ctx.beginPath();
                            ctx.moveTo(centerX, 156);
                            ctx.lineTo(centerX, 180);
                            ctx.stroke();

                            var decisionColor = reject ? viz.colors.red : viz.colors.green;
                            var decisionText = reject ? 'REJECT H0: Use Fixed Effects' : 'FAIL TO REJECT H0: RE is acceptable';
                            ctx.strokeStyle = decisionColor;
                            ctx.lineWidth = 2.5;
                            ctx.strokeRect(centerX - 180, 180, 360, boxH);
                            viz.screenText(decisionText, centerX, 180 + boxH / 2, decisionColor, 13);

                            // Critical value annotation
                            viz.screenText('Critical value (5%): 3.84', centerX, 230, viz.colors.text, 10);

                            // Simulation panel: run many Hausman tests
                            var nSim = 100;
                            var hausmanStats = [];
                            for (var s = 0; s < nSim; s++) {
                                var r = simulate(s * 997 + 7);
                                hausmanStats.push(r.hausman);
                            }

                            // Draw distribution of Hausman stats
                            var chartLeft = 80, chartRight = viz.width - 40;
                            var chartTop = 260, chartBottom = viz.height - 40;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBottom - chartTop;

                            viz.screenText('Distribution of H statistic across ' + nSim + ' simulations (corr = ' + correlation.toFixed(2) + ')', viz.width / 2, chartTop - 8, viz.colors.text, 11);

                            // Histogram
                            var binWidth = 2;
                            var maxH = 30;
                            var nBins = Math.ceil(maxH / binWidth);
                            var bins = [];
                            for (var b = 0; b < nBins; b++) bins.push(0);
                            for (var k = 0; k < hausmanStats.length; k++) {
                                var bi = Math.floor(hausmanStats[k] / binWidth);
                                if (bi >= 0 && bi < nBins) bins[bi]++;
                            }
                            var maxBin = 1;
                            for (var b2 = 0; b2 < nBins; b2++) { if (bins[b2] > maxBin) maxBin = bins[b2]; }

                            var barW2 = chartW / nBins;
                            for (var b3 = 0; b3 < nBins; b3++) {
                                var bx = chartLeft + b3 * barW2;
                                var bh = bins[b3] / maxBin * chartH * 0.85;
                                var inReject = (b3 + 0.5) * binWidth > 3.84;
                                ctx.fillStyle = inReject ? viz.colors.red + '77' : viz.colors.blue + '77';
                                ctx.fillRect(bx + 1, chartBottom - bh, barW2 - 2, bh);
                            }

                            // Critical value line
                            var critX = chartLeft + (3.84 / maxH) * chartW;
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(critX, chartTop);
                            ctx.lineTo(critX, chartBottom);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('3.84', critX + 14, chartTop + 10, viz.colors.yellow, 10);

                            // x-axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartBottom);
                            ctx.lineTo(chartRight, chartBottom);
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var lbl = 0; lbl <= maxH; lbl += 4) {
                                var lx = chartLeft + (lbl / maxH) * chartW;
                                ctx.fillText(lbl.toString(), lx, chartBottom + 3);
                            }
                            viz.screenText('H statistic', viz.width / 2, viz.height - 8, viz.colors.text, 10);

                            // Rejection rate
                            var rejectCount = 0;
                            for (var k2 = 0; k2 < hausmanStats.length; k2++) {
                                if (hausmanStats[k2] > 3.84) rejectCount++;
                            }
                            viz.screenText('Rejection rate: ' + (rejectCount / nSim * 100).toFixed(0) + '%', viz.width - 100, chartTop + 10, viz.colors.white, 11);
                            viz.screenText('True beta: ' + trueBeta.toFixed(2), viz.width - 100, chartTop + 26, viz.colors.yellow, 10);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'Corr(alpha, X): ', 0, 2, correlation, 0.1, function(v) { correlation = v; result = simulate(42); draw(); });
                        VizEngine.createSlider(controls, 'True beta: ', 0, 3, trueBeta, 0.1, function(v) { trueBeta = v; result = simulate(42); draw(); });
                        VizEngine.createButton(controls, 'Re-simulate', function() { result = simulate(Math.floor(Math.random() * 100000)); draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why the RE estimator is more efficient than FE when \\(E[\\alpha_i | X_{i1}, \\ldots, X_{iT}] = 0\\). What additional variation does RE exploit?',
                    hint: 'Think about within vs. between variation.',
                    solution: 'FE uses only WITHIN variation (deviations from individual means). RE uses both within AND between variation (differences across individual means). When alpha_i is uncorrelated with X, the between variation is informative about beta, so using it improves efficiency. Specifically, RE is a weighted average of the within (FE) and between estimators, with optimal GLS weights that minimize variance.'
                },
                {
                    question: 'Using the Mundlak (1978) device, show how testing \\(\\xi = 0\\) in \\(Y_{it} = \\mu + \\beta X_{it} + \\xi \\bar{X}_i + (a_i + \\varepsilon_{it})\\) is equivalent to the Hausman test.',
                    hint: 'What does \\(\\xi \\neq 0\\) imply about the correlation between \\(\\alpha_i\\) and \\(X_{it}\\)?',
                    solution: 'If alpha_i = delta + xi * X_bar_i + a_i, then Cov(alpha_i, X_it) = xi * Var(X_bar_i) + Cov(a_i, X_it) = xi * Var(X_bar_i) (since a_i is independent of X by construction). So xi = 0 iff alpha_i is uncorrelated with X, which is exactly H0 of the Hausman test. Moreover, in the Mundlak regression, the coefficient on X_it is beta (same as FE), and when xi = 0, RE on the original model gives the same beta. The t-test on xi in the Mundlak regression is asymptotically equivalent to the Hausman chi-squared test.'
                },
                {
                    question: 'The FE estimator cannot identify the effect of time-invariant regressors (e.g., gender, race). Explain why, and describe how the Mundlak/CRE approach can recover these effects.',
                    hint: 'What happens to a time-invariant variable under the within transformation?',
                    solution: 'If Z_i is time-invariant, then Z_it - Z_bar_i = Z_i - Z_i = 0 for all t. So the within transformation eliminates Z entirely, making its coefficient unidentifiable. The CRE/Mundlak approach works differently: Y_it = mu + beta*X_it + gamma*Z_i + xi*X_bar_i + (a_i + eps_it). Since Z_i is included explicitly (not demeaned away), gamma is identifiable. The inclusion of X_bar_i controls for the correlation between alpha_i and X, so gamma is consistently estimated under the CRE assumption.'
                }
            ]
        }
    ]
});
