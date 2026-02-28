window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch17',
    number: 17,
    title: 'Synthetic Control Methods',
    subtitle: 'Constructing Counterfactuals from Donor Pool',
    sections: [
        // ============================================================
        // SECTION 1: The Synthetic Control Idea
        // ============================================================
        {
            id: 'ch17-sec01',
            title: 'The Synthetic Control Idea',
            content: `
                <h2>The Synthetic Control Idea</h2>

                <p>Many of the most important policy questions in economics and political science involve treatments that affect <em>entire aggregate units</em>: a state passes a law, a country joins a trade bloc, a region experiences an economic shock. In such settings, we cannot simply compare treated and control individuals --- the treatment operates at the macro level, and there may be only <strong>one treated unit</strong>.</p>

                <h3>The Comparative Case Study Problem</h3>

                <p>Traditional comparative case studies attempt to find a single "control" unit (e.g., another state) that closely resembles the treated unit. But this approach is ad hoc: the choice of comparison unit is subjective, and no single control unit may adequately reproduce the characteristics of the treated unit.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 17.1 (Synthetic Control)</div>
                    <div class="env-body">
                        <p>A <strong>synthetic control</strong> is a weighted combination of untreated units (the <em>donor pool</em>) chosen to approximate the characteristics of the treated unit in the pre-treatment period. The treatment effect is estimated as the gap between the treated unit's observed outcome and the synthetic control's outcome after treatment.</p>
                    </div>
                </div>

                <h3>Setup and Notation</h3>

                <p>Suppose we observe \\(J+1\\) units over periods \\(t = 1, \\ldots, T\\). Unit 1 is exposed to treatment starting at period \\(T_0 + 1\\), while units \\(2, \\ldots, J+1\\) are untreated throughout. Define:</p>
                <ul>
                    <li>\\(Y_{1t}\\): observed outcome for the treated unit at time \\(t\\)</li>
                    <li>\\(Y_{jt}\\): observed outcome for control unit \\(j\\) at time \\(t\\)</li>
                    <li>\\(Y_{1t}^N\\): the <em>counterfactual</em> outcome for the treated unit had it not been treated</li>
                </ul>

                <p>The causal effect of the treatment at time \\(t > T_0\\) is:</p>
                \\[\\alpha_{1t} = Y_{1t} - Y_{1t}^N\\]

                <p>Since \\(Y_{1t}^N\\) is unobserved, the synthetic control method estimates it as:</p>
                \\[\\hat{Y}_{1t}^N = \\sum_{j=2}^{J+1} w_j Y_{jt}\\]
                <p>where \\(w_j \\geq 0\\) and \\(\\sum_{j=2}^{J+1} w_j = 1\\).</p>

                <div class="env-block intuition">
                    <div class="env-title">Intuition</div>
                    <div class="env-body">
                        <p>Think of the synthetic control as building a "doppelganger" for the treated unit from a blend of control units. If California passes a tobacco control law, we might construct a synthetic California from weighted portions of Nevada, Oregon, Colorado, and other states that together match California's pre-treatment smoking rates, demographics, and economic indicators.</p>
                    </div>
                </div>

                <h3>The Basque Country Example</h3>

                <p>The seminal application by <strong>Abadie and Gardeazabal (2003)</strong> studied the economic impact of terrorism in the Basque Country, Spain. They constructed a synthetic Basque Country from other Spanish regions to estimate what GDP per capita would have been absent ETA terrorism. The synthetic control closely tracked the Basque Country's GDP pre-1970s, and the divergence afterward estimated the economic cost of conflict.</p>

                <div class="env-block example">
                    <div class="env-title">Example 17.1 (California Proposition 99)</div>
                    <div class="env-body">
                        <p>Abadie, Diamond, and Hainmueller (2010) studied California's 1988 tobacco control program. They constructed a synthetic California from a donor pool of 38 other states. The synthetic control closely matched California's per-capita cigarette sales in the pre-treatment period (1970--1988). After 1988, actual California cigarette sales fell below the synthetic control, estimating a treatment effect of roughly 26 fewer packs per capita by 2000.</p>
                    </div>
                </div>

                <h3>Why Not Just Use Regression?</h3>

                <p>One might wonder why we need synthetic controls when we could run a regression of outcomes on treatment indicators. Several key advantages of the synthetic control approach:</p>
                <ul>
                    <li><strong>Transparency:</strong> The weights \\(w_j\\) make the comparison explicit --- we know exactly which units contribute and by how much.</li>
                    <li><strong>No extrapolation:</strong> Because \\(w_j \\geq 0\\) and \\(\\sum w_j = 1\\), the synthetic control lies in the <em>convex hull</em> of the donor pool. Regression can extrapolate far outside the support of the data.</li>
                    <li><strong>Data-driven:</strong> The weights are chosen to match pre-treatment outcomes, not imposed by the researcher.</li>
                    <li><strong>Applicable with few treated units:</strong> The method works with a single treated unit, where regression approaches struggle.</li>
                </ul>

                <div class="viz-placeholder" data-viz="viz-sc-idea"></div>
            `,
            visualizations: [
                {
                    id: 'viz-sc-idea',
                    title: 'Treated Unit vs. Synthetic Control',
                    description: 'See how the synthetic control (weighted average of donor units) tracks the treated unit before treatment, then diverges after. The shaded gap is the estimated treatment effect.',
                    setup: function(container, controls) {
                        var canvasW = 560, canvasH = 380;
                        var viz = new VizEngine(container, {width: canvasW, height: canvasH});
                        var ctx = viz.ctx;

                        var T = 40;
                        var T0 = 20;
                        var nDonors = 5;

                        var effectSize = 3;
                        var noise = 0.3;

                        var sliderEffect = VizEngine.createSlider(controls, 'Effect Size', 0, 8, effectSize, 0.5, function(v) { effectSize = v; generate(); draw(); });
                        var sliderNoise = VizEngine.createSlider(controls, 'Noise Level', 0, 1.5, noise, 0.1, function(v) { noise = v; generate(); draw(); });
                        VizEngine.createButton(controls, 'Regenerate', function() { generate(); draw(); });

                        var treated = [];
                        var synthetic = [];
                        var donors = [];
                        var weights = [];

                        function generate() {
                            // Generate a latent trend
                            var trend = [];
                            trend[0] = 10;
                            for (var t = 1; t < T; t++) {
                                trend[t] = trend[t-1] + 0.15 + (Math.random() - 0.5) * 0.3;
                            }

                            // Generate donor units around the trend
                            donors = [];
                            for (var d = 0; d < nDonors; d++) {
                                var offset = (Math.random() - 0.5) * 4;
                                var driftRate = (Math.random() - 0.5) * 0.1;
                                donors[d] = [];
                                for (var t = 0; t < T; t++) {
                                    donors[d][t] = trend[t] + offset + driftRate * t + (Math.random() - 0.5) * noise * 2;
                                }
                            }

                            // Treated unit: follows trend pre-treatment, diverges post-treatment
                            treated = [];
                            for (var t = 0; t < T; t++) {
                                if (t <= T0) {
                                    treated[t] = trend[t] + (Math.random() - 0.5) * noise;
                                } else {
                                    var elapsed = t - T0;
                                    treated[t] = trend[t] + effectSize * (1 - Math.exp(-elapsed / 5)) + (Math.random() - 0.5) * noise;
                                }
                            }

                            // Compute simple weights by matching pre-treatment outcomes
                            weights = [];
                            var totalW = 0;
                            for (var d = 0; d < nDonors; d++) {
                                var dist = 0;
                                for (var t = 0; t <= T0; t++) {
                                    dist += (treated[t] - donors[d][t]) * (treated[t] - donors[d][t]);
                                }
                                weights[d] = 1 / (Math.sqrt(dist) + 0.01);
                                totalW += weights[d];
                            }
                            for (var d = 0; d < nDonors; d++) {
                                weights[d] /= totalW;
                            }

                            // Synthetic control
                            synthetic = [];
                            for (var t = 0; t < T; t++) {
                                synthetic[t] = 0;
                                for (var d = 0; d < nDonors; d++) {
                                    synthetic[t] += weights[d] * donors[d][t];
                                }
                            }
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, canvasW, canvasH);

                            var padL = 60, padR = 30, padT = 40, padB = 50;
                            var plotW = canvasW - padL - padR;
                            var plotH = canvasH - padT - padB;

                            // Find data range
                            var allVals = treated.concat(synthetic);
                            for (var d = 0; d < nDonors; d++) allVals = allVals.concat(donors[d]);
                            var yMin = Math.min.apply(null, allVals) - 1;
                            var yMax = Math.max.apply(null, allVals) + 1;

                            function sx(t) { return padL + (t / (T - 1)) * plotW; }
                            function sy(v) { return padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH; }

                            // Treatment line
                            var treatX = sx(T0);
                            ctx.strokeStyle = '#444';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([5, 5]);
                            ctx.beginPath();
                            ctx.moveTo(treatX, padT);
                            ctx.lineTo(treatX, padT + plotH);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Shade treatment effect region
                            ctx.fillStyle = 'rgba(248,81,73,0.1)';
                            ctx.beginPath();
                            ctx.moveTo(sx(T0), sy(treated[T0]));
                            for (var t = T0; t < T; t++) {
                                ctx.lineTo(sx(t), sy(treated[t]));
                            }
                            for (var t = T - 1; t >= T0; t--) {
                                ctx.lineTo(sx(t), sy(synthetic[t]));
                            }
                            ctx.closePath();
                            ctx.fill();

                            // Draw donor units (faint)
                            for (var d = 0; d < nDonors; d++) {
                                ctx.strokeStyle = 'rgba(139,148,158,0.2)';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                for (var t = 0; t < T; t++) {
                                    if (t === 0) ctx.moveTo(sx(t), sy(donors[d][t]));
                                    else ctx.lineTo(sx(t), sy(donors[d][t]));
                                }
                                ctx.stroke();
                            }

                            // Draw synthetic control
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            for (var t = 0; t < T; t++) {
                                if (t === 0) ctx.moveTo(sx(t), sy(synthetic[t]));
                                else ctx.lineTo(sx(t), sy(synthetic[t]));
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Draw treated unit
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var t = 0; t < T; t++) {
                                if (t === 0) ctx.moveTo(sx(t), sy(treated[t]));
                                else ctx.lineTo(sx(t), sy(treated[t]));
                            }
                            ctx.stroke();

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(padL, padT + plotH);
                            ctx.lineTo(padL + plotW, padT + plotH);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(padL, padT);
                            ctx.lineTo(padL, padT + plotH);
                            ctx.stroke();

                            // Tick labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var t = 0; t <= T; t += 10) {
                                ctx.fillText(t, sx(t), padT + plotH + 6);
                            }
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            var nTicks = 5;
                            for (var i = 0; i <= nTicks; i++) {
                                var v = yMin + (yMax - yMin) * i / nTicks;
                                ctx.fillText(v.toFixed(1), padL - 6, sy(v));
                            }

                            // Labels
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Time', padL + plotW / 2, canvasH - 12);

                            ctx.save();
                            ctx.translate(14, padT + plotH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.fillText('Outcome', 0, 0);
                            ctx.restore();

                            // Treatment annotation
                            ctx.fillStyle = '#888';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Treatment', treatX, padT - 14);

                            // Legend
                            var legX = padL + plotW - 160, legY = padT + 8;
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(legX, legY, 20, 3);
                            ctx.fillStyle = viz.colors.white;
                            ctx.textAlign = 'left';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Treated Unit', legX + 26, legY + 2);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(legX, legY + 18, 20, 3);
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Synthetic Control', legX + 26, legY + 20);

                            ctx.fillStyle = 'rgba(139,148,158,0.5)';
                            ctx.fillRect(legX, legY + 36, 20, 3);
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Donor Units', legX + 26, legY + 38);

                            // Effect annotation
                            if (effectSize > 0) {
                                var arrowT = T - 3;
                                var arrowX = sx(arrowT);
                                var yTreated = sy(treated[arrowT]);
                                var ySynth = sy(synthetic[arrowT]);
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(arrowX, yTreated + 3);
                                ctx.lineTo(arrowX, ySynth - 3);
                                ctx.stroke();
                                // arrowheads
                                ctx.beginPath();
                                ctx.moveTo(arrowX - 4, yTreated + 8);
                                ctx.lineTo(arrowX, yTreated + 3);
                                ctx.lineTo(arrowX + 4, yTreated + 8);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(arrowX - 4, ySynth - 8);
                                ctx.lineTo(arrowX, ySynth - 3);
                                ctx.lineTo(arrowX + 4, ySynth - 8);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.orange;
                                ctx.textAlign = 'left';
                                ctx.fillText('Effect', arrowX + 6, (yTreated + ySynth) / 2);
                            }
                        }

                        generate();
                        draw();
                        return { cleanup: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch17-ex01',
                    type: 'multiple-choice',
                    difficulty: 'basic',
                    question: 'Why does the synthetic control method use non-negative weights that sum to one?',
                    options: [
                        'To ensure the synthetic control lies in the convex hull of donor units, preventing extrapolation',
                        'To make the weights interpretable as probabilities',
                        'Because negative weights would violate the parallel trends assumption',
                        'To minimize the variance of the estimator'
                    ],
                    answer: 0,
                    explanation: 'The convex combination constraint (non-negative weights summing to one) ensures the synthetic control is an interpolation of existing donor units, not an extrapolation beyond the observed data. This is a key advantage over regression-based methods.'
                },
                {
                    id: 'ch17-ex02',
                    type: 'multiple-choice',
                    difficulty: 'basic',
                    question: 'In the Abadie, Diamond, and Hainmueller (2010) study of California Proposition 99, what was the donor pool?',
                    options: [
                        'All 50 US states',
                        'The 38 states that did not implement large-scale tobacco control programs during the study period',
                        'A randomly selected subset of 10 states',
                        'States bordering California'
                    ],
                    answer: 1,
                    explanation: 'The donor pool consisted of 38 states that did not implement large-scale tobacco control programs during the study period. States that had their own similar programs were excluded to avoid contamination.'
                },
                {
                    id: 'ch17-ex03',
                    type: 'multiple-choice',
                    difficulty: 'intermediate',
                    question: 'Which of the following is NOT a valid reason for preferring synthetic control over traditional regression approaches for comparative case studies?',
                    options: [
                        'Synthetic control makes the comparison transparent through explicit weights',
                        'Synthetic control avoids extrapolation beyond the data support',
                        'Synthetic control provides asymptotically normal standard errors',
                        'Synthetic control works well with a single treated unit'
                    ],
                    answer: 2,
                    explanation: 'The synthetic control method does NOT provide standard asymptotic standard errors. Inference is typically done through permutation-based placebo tests, not through normal approximations. The other three statements are genuine advantages of synthetic control.'
                },
                {
                    id: 'ch17-ex04',
                    type: 'multiple-choice',
                    difficulty: 'intermediate',
                    question: 'If the treated unit lies outside the convex hull of the donor pool in the space of pre-treatment characteristics, what does this imply?',
                    options: [
                        'The synthetic control method will produce biased estimates but still valid inference',
                        'No combination of non-negative weights summing to one can exactly match the treated unit, leading to imperfect pre-treatment fit',
                        'We should use negative weights to improve the fit',
                        'The treatment effect is necessarily zero'
                    ],
                    answer: 1,
                    explanation: 'When the treated unit lies outside the convex hull of donors, the method cannot perfectly match pre-treatment characteristics. This leads to pre-treatment fit error, which may bias the treatment effect estimate. This is a known limitation addressed by augmented synthetic control methods.'
                }
            ]
        },

        // ============================================================
        // SECTION 2: Abadie-Diamond-Hainmueller Framework
        // ============================================================
        {
            id: 'ch17-sec02',
            title: 'Abadie-Diamond-Hainmueller Framework',
            content: `
                <h2>Abadie-Diamond-Hainmueller Framework</h2>

                <p>The formal synthetic control framework developed by <strong>Abadie, Diamond, and Hainmueller (2010)</strong> defines a precise optimization problem for selecting donor weights. The key insight is a <em>nested</em> optimization: an outer loop selects the importance of each predictor, and an inner loop finds the weights that best match the treated unit on those predictors.</p>

                <h3>Predictor Matching</h3>

                <p>Let \\(X_1 \\in \\mathbb{R}^k\\) be a vector of \\(k\\) pre-treatment characteristics for the treated unit, and let \\(X_0 \\in \\mathbb{R}^{k \\times J}\\) be the corresponding matrix for the \\(J\\) donor units. These characteristics typically include:</p>
                <ul>
                    <li>Pre-treatment outcome values (possibly averaged over sub-periods)</li>
                    <li>Covariates like population, income, demographics, etc.</li>
                </ul>

                <p>The synthetic control weights \\(W = (w_2, \\ldots, w_{J+1})'\\) are chosen to minimize:</p>
                \\[\\|X_1 - X_0 W\\|_V = \\sqrt{(X_1 - X_0 W)' V (X_1 - X_0 W)}\\]
                <p>subject to \\(w_j \\geq 0\\) for all \\(j\\) and \\(\\sum_{j=2}^{J+1} w_j = 1\\), where \\(V\\) is a \\(k \\times k\\) positive semidefinite diagonal matrix of predictor weights.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 17.2 (Synthetic Control Optimization)</div>
                    <div class="env-body">
                        <p>The <strong>ADH synthetic control estimator</strong> solves a nested optimization:</p>
                        <p><em>Inner problem:</em> For given predictor weights \\(V\\), find</p>
                        \\[W^*(V) = \\arg\\min_{W \\in \\Delta^J} (X_1 - X_0 W)' V (X_1 - X_0 W)\\]
                        <p>where \\(\\Delta^J = \\{W : w_j \\geq 0,\\; \\sum w_j = 1\\}\\) is the unit simplex.</p>
                        <p><em>Outer problem:</em> Choose \\(V\\) to minimize the pre-treatment prediction error:</p>
                        \\[V^* = \\arg\\min_{V \\succeq 0} \\sum_{t=1}^{T_0} \\left(Y_{1t} - \\sum_{j=2}^{J+1} w_j^*(V) Y_{jt}\\right)^2\\]
                    </div>
                </div>

                <h3>The Role of \\(V\\)</h3>

                <p>The matrix \\(V\\) determines how much weight each predictor receives in the matching. If predictor \\(m\\) has a large \\(v_m\\), mismatches on that predictor are penalized more heavily. In practice, \\(V\\) is often chosen as:</p>
                <ul>
                    <li><strong>Data-driven:</strong> The outer optimization above selects \\(V\\) to minimize the pre-treatment root mean squared prediction error (RMSPE).</li>
                    <li><strong>Equal weights:</strong> \\(V = I_k\\), treating all predictors equally.</li>
                    <li><strong>Regression-based:</strong> Using the inverse of predictor variance.</li>
                </ul>

                <div class="env-block remark">
                    <div class="env-title">Remark</div>
                    <div class="env-body">
                        <p>The nested optimization can be computationally demanding. The outer problem is not convex, and multiple local optima may exist. In practice, researchers often use numerical optimization with multiple starting values and validate that the solution produces a good pre-treatment fit.</p>
                    </div>
                </div>

                <h3>Pre-Treatment Fit and RMSPE</h3>

                <p>The quality of the synthetic control is assessed by the <strong>pre-treatment RMSPE</strong>:</p>
                \\[\\text{RMSPE}_{\\text{pre}} = \\sqrt{\\frac{1}{T_0} \\sum_{t=1}^{T_0} \\left(Y_{1t} - \\sum_{j=2}^{J+1} w_j^* Y_{jt}\\right)^2}\\]

                <p>A small pre-treatment RMSPE indicates that the synthetic control closely tracks the treated unit before the intervention, which lends credibility to the post-treatment comparison.</p>

                <div class="env-block example">
                    <div class="env-title">Example 17.2 (Weight Sparsity)</div>
                    <div class="env-body">
                        <p>In practice, the convex combination constraint often produces <em>sparse</em> weights: many donor units receive zero weight, and only a few contribute to the synthetic control. In the California Proposition 99 study, out of 38 donor states, only Colorado, Connecticut, Montana, Nevada, and Utah received positive weights. This sparsity makes the comparison transparent and interpretable.</p>
                    </div>
                </div>

                <h3>Uniqueness and the Convex Hull</h3>

                <p>The synthetic control weights are unique when the treated unit's pre-treatment characteristics lie strictly inside the convex hull of the donor units. If the treated unit is a vertex or on the boundary of the convex hull, the weights may not be unique but the synthetic control outcome is still unique.</p>

                <p>When the treated unit lies <em>outside</em> the convex hull, the optimization finds the closest point on the boundary, but the resulting pre-treatment fit will be imperfect. This is a signal that the donor pool may not be adequate for constructing a credible counterfactual.</p>

                <div class="viz-placeholder" data-viz="viz-sc-weights"></div>
            `,
            visualizations: [
                {
                    id: 'viz-sc-weights',
                    title: 'Synthetic Control Weights on Donor Units',
                    description: 'Visualize which donor units receive weight and how the weighted combination matches the treated unit. Drag the treated unit to see how weights change.',
                    setup: function(container, controls) {
                        var canvasW = 560, canvasH = 400;
                        var viz = new VizEngine(container, {width: canvasW, height: canvasH});
                        var ctx = viz.ctx;

                        var nDonors = 8;
                        var donorX = [];
                        var donorY = [];
                        var treatedX = 5;
                        var treatedY = 5;

                        var sliderDonors = VizEngine.createSlider(controls, 'Donor Units', 3, 12, nDonors, 1, function(v) { nDonors = Math.round(v); generateDonors(); solve(); draw(); });
                        VizEngine.createButton(controls, 'Regenerate Donors', function() { generateDonors(); solve(); draw(); });

                        var weights = [];

                        function generateDonors() {
                            donorX = [];
                            donorY = [];
                            for (var i = 0; i < nDonors; i++) {
                                donorX[i] = 1 + Math.random() * 8;
                                donorY[i] = 1 + Math.random() * 8;
                            }
                        }

                        function solve() {
                            // Simple quadratic distance-based weight assignment
                            // (approximation to true constrained optimization)
                            weights = [];
                            var totalW = 0;
                            for (var i = 0; i < nDonors; i++) {
                                var dx = treatedX - donorX[i];
                                var dy = treatedY - donorY[i];
                                var dist = Math.sqrt(dx * dx + dy * dy);
                                weights[i] = 1 / (dist * dist + 0.1);
                                totalW += weights[i];
                            }
                            for (var i = 0; i < nDonors; i++) {
                                weights[i] /= totalW;
                            }
                            // Zero out small weights for sparsity
                            var threshold = 0.05;
                            totalW = 0;
                            for (var i = 0; i < nDonors; i++) {
                                if (weights[i] < threshold) weights[i] = 0;
                                totalW += weights[i];
                            }
                            if (totalW > 0) {
                                for (var i = 0; i < nDonors; i++) weights[i] /= totalW;
                            }
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, canvasW, canvasH);

                            var padL = 50, padR = 180, padT = 40, padB = 50;
                            var plotW = canvasW - padL - padR;
                            var plotH = canvasH - padT - padB;

                            function sx(v) { return padL + (v / 10) * plotW; }
                            function sy(v) { return padT + plotH - (v / 10) * plotH; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var i = 0; i <= 10; i += 2) {
                                ctx.beginPath(); ctx.moveTo(sx(i), padT); ctx.lineTo(sx(i), padT + plotH); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(padL, sy(i)); ctx.lineTo(padL + plotW, sy(i)); ctx.stroke();
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke();

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Predictor 1', padL + plotW / 2, canvasH - 12);
                            ctx.save();
                            ctx.translate(14, padT + plotH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('Predictor 2', 0, 0);
                            ctx.restore();

                            // Draw lines from donors to treated with weight-based opacity
                            for (var i = 0; i < nDonors; i++) {
                                if (weights[i] > 0.001) {
                                    ctx.strokeStyle = 'rgba(63,185,160,' + Math.min(weights[i] * 3, 0.8) + ')';
                                    ctx.lineWidth = weights[i] * 10;
                                    ctx.beginPath();
                                    ctx.moveTo(sx(donorX[i]), sy(donorY[i]));
                                    ctx.lineTo(sx(treatedX), sy(treatedY));
                                    ctx.stroke();
                                }
                            }

                            // Synthetic control point
                            var scX = 0, scY = 0;
                            for (var i = 0; i < nDonors; i++) {
                                scX += weights[i] * donorX[i];
                                scY += weights[i] * donorY[i];
                            }
                            ctx.beginPath();
                            ctx.arc(sx(scX), sy(scY), 8, 0, Math.PI * 2);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fill();
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.stroke();

                            // Donor units
                            for (var i = 0; i < nDonors; i++) {
                                var r = 4 + weights[i] * 20;
                                ctx.beginPath();
                                ctx.arc(sx(donorX[i]), sy(donorY[i]), r, 0, Math.PI * 2);
                                ctx.fillStyle = weights[i] > 0.001 ? viz.colors.blue : 'rgba(88,166,255,0.3)';
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.white;
                                ctx.lineWidth = 1;
                                ctx.stroke();

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText('D' + (i + 1), sx(donorX[i]), sy(donorY[i]) - r - 2);
                            }

                            // Treated unit
                            ctx.beginPath();
                            ctx.arc(sx(treatedX), sy(treatedY), 9, 0, Math.PI * 2);
                            ctx.fillStyle = viz.colors.red;
                            ctx.fill();
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('Treated', sx(treatedX), sy(treatedY) - 12);

                            // Weight bar chart on the right
                            var barX = canvasW - 165;
                            var barW = 130;
                            var barTop = padT + 10;
                            var barH = plotH - 20;
                            var barStep = barH / Math.max(nDonors, 1);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Weights', barX, barTop - 4);

                            for (var i = 0; i < nDonors; i++) {
                                var by = barTop + 10 + i * barStep;
                                var bw = weights[i] * barW;
                                ctx.fillStyle = weights[i] > 0.001 ? viz.colors.blue : 'rgba(88,166,255,0.2)';
                                ctx.fillRect(barX + 30, by, bw, barStep * 0.6);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('D' + (i + 1), barX + 26, by + barStep * 0.35);
                                ctx.textAlign = 'left';
                                if (weights[i] > 0.001) {
                                    ctx.fillText((weights[i] * 100).toFixed(0) + '%', barX + 34 + bw, by + barStep * 0.35);
                                }
                            }

                            // Label synthetic control
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('SC', sx(scX), sy(scY) - 12);
                        }

                        // Drag the treated unit
                        var padL = 50, padR = 180, padT2 = 40, padB2 = 50;
                        var plotW2 = canvasW - padL - padR;
                        var plotH2 = canvasH - padT2 - padB2;

                        viz.enableDrag(function(mx, my) {
                            treatedX = Math.max(0.5, Math.min(9.5, ((mx - padL) / plotW2) * 10));
                            treatedY = Math.max(0.5, Math.min(9.5, (1 - (my - padT2) / plotH2) * 10));
                            solve();
                            draw();
                        });

                        generateDonors();
                        solve();
                        draw();
                        return { cleanup: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch17-ex05',
                    type: 'multiple-choice',
                    difficulty: 'intermediate',
                    question: 'In the ADH framework, what does the matrix V control?',
                    options: [
                        'The variance of the treatment effect estimate',
                        'The relative importance of each predictor in the matching criterion',
                        'The number of donor units receiving positive weight',
                        'The post-treatment extrapolation behavior'
                    ],
                    answer: 1,
                    explanation: 'The diagonal matrix V assigns importance weights to each predictor variable. A larger diagonal entry v_m means that mismatches on predictor m are penalized more heavily when finding the synthetic control weights W.'
                },
                {
                    id: 'ch17-ex06',
                    type: 'multiple-choice',
                    difficulty: 'intermediate',
                    question: 'Why is the outer optimization over V generally non-convex?',
                    options: [
                        'Because V must be a diagonal matrix',
                        'Because the inner optimization W*(V) depends non-linearly on V, making the composite objective non-convex',
                        'Because the donor pool has too many units',
                        'Because the outcome variable is not normally distributed'
                    ],
                    answer: 1,
                    explanation: 'The outer objective evaluates the pre-treatment RMSPE at the optimal weights W*(V), which depend on V through the inner optimization. This composition of optimization with optimization creates a non-convex problem, potentially with multiple local optima.'
                },
                {
                    id: 'ch17-ex07',
                    type: 'multiple-choice',
                    difficulty: 'basic',
                    question: 'What does a large pre-treatment RMSPE indicate about the synthetic control?',
                    options: [
                        'The treatment effect is very large',
                        'The synthetic control fits the post-treatment outcomes well',
                        'The donor pool cannot adequately reproduce the treated unit before treatment, casting doubt on the counterfactual',
                        'The treatment assignment was not random'
                    ],
                    answer: 2,
                    explanation: 'A large pre-treatment RMSPE means the synthetic control does not closely track the treated unit before the intervention. If we cannot match the pre-treatment trajectory, the post-treatment gap is hard to interpret as a causal effect, since it may partly reflect pre-existing differences rather than the treatment.'
                },
                {
                    id: 'ch17-ex08',
                    type: 'multiple-choice',
                    difficulty: 'advanced',
                    question: 'Consider a setting with J = 3 donors and k = 2 predictors. The treated unit has predictor values (5, 8) and the three donors have values (2, 3), (6, 10), (8, 4). Can the synthetic control achieve perfect pre-treatment fit?',
                    options: [
                        'Yes, because 3 donors are enough for 2 predictors',
                        'Only if V is chosen correctly',
                        'Yes, if and only if (5, 8) lies in the convex hull of the three donor points',
                        'No, because the number of donors must exceed the number of predictors squared'
                    ],
                    answer: 2,
                    explanation: 'Perfect pre-treatment fit requires X_1 = X_0 W for some W in the simplex, which means the treated unit must lie in the convex hull of the donor units in predictor space. Whether (5,8) lies in the triangle formed by (2,3), (6,10), (8,4) is a geometric question. In this case, (5,8) can be verified to lie inside this triangle, so perfect fit is achievable.'
                }
            ]
        },

        // ============================================================
        // SECTION 3: Inference via Placebo Tests
        // ============================================================
        {
            id: 'ch17-sec03',
            title: 'Inference via Placebo Tests',
            content: `
                <h2>Inference via Placebo Tests</h2>

                <p>A major challenge with the synthetic control method is <strong>inference</strong>. Since there is typically only one treated unit, conventional standard errors and confidence intervals are not directly applicable. Abadie, Diamond, and Hainmueller (2010) proposed an elegant solution based on <em>placebo tests</em> --- a form of permutation inference.</p>

                <h3>In-Place Placebo Tests</h3>

                <p>The core idea is simple: apply the synthetic control method to each <em>control</em> unit, pretending it was treated, and compare the resulting "effect" to the effect estimated for the actual treated unit.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 17.3 (In-Place Placebo Test)</div>
                    <div class="env-body">
                        <p>For each unit \\(j \\in \\{1, 2, \\ldots, J+1\\}\\), apply the synthetic control method using the remaining \\(J\\) units as donors. Compute the gap:</p>
                        \\[\\hat{\\alpha}_{jt} = Y_{jt} - \\hat{Y}_{jt}^{\\text{SC}}\\]
                        <p>for all post-treatment periods \\(t > T_0\\). The collection \\(\\{\\hat{\\alpha}_{jt}\\}_{j=1}^{J+1}\\) forms the <strong>permutation distribution</strong> of treatment effects.</p>
                    </div>
                </div>

                <h3>Pseudo p-values</h3>

                <p>If the treatment had a genuine effect on unit 1, we expect its post-treatment gap to be unusually large compared to the placebo gaps. The <strong>pseudo p-value</strong> is:</p>
                \\[p = \\frac{1}{J+1} \\sum_{j=1}^{J+1} \\mathbf{1}\\left\\{\\frac{\\text{RMSPE}_{\\text{post},j}}{\\text{RMSPE}_{\\text{pre},j}} \\geq \\frac{\\text{RMSPE}_{\\text{post},1}}{\\text{RMSPE}_{\\text{pre},1}}\\right\\}\\]

                <p>where the ratio of post-to-pre RMSPE is used to account for the fact that some placebo units may have poor pre-treatment fit.</p>

                <div class="env-block intuition">
                    <div class="env-title">Intuition</div>
                    <div class="env-body">
                        <p>Imagine you have 39 units (1 treated + 38 controls). You run the synthetic control on all 39, each time pretending a different unit was treated. If the real treated unit has the largest post/pre RMSPE ratio, the pseudo p-value is 1/39 \\(\\approx 0.026\\). This is similar to a rank-based permutation test.</p>
                    </div>
                </div>

                <h3>The Spaghetti Plot</h3>

                <p>A hallmark of synthetic control inference is the <strong>spaghetti plot</strong> (or "placebo plot"): a graph showing the gap \\(\\hat{\\alpha}_{jt}\\) for all units overlaid. The treated unit's gap is highlighted. If the treatment had a real effect, the treated unit's line should stand out from the cloud of placebo gaps.</p>

                <div class="env-block remark">
                    <div class="env-title">Remark (Excluding Poor Fits)</div>
                    <div class="env-body">
                        <p>It is common practice to exclude placebo units with very poor pre-treatment fit (e.g., pre-treatment RMSPE more than \\(k\\) times the treated unit's) from the spaghetti plot. Large pre-treatment gaps make the post-treatment gaps uninformative. The RMSPE ratio addresses this by penalizing poor pre-treatment fit.</p>
                    </div>
                </div>

                <h3>In-Time Placebo Tests</h3>

                <p>An alternative to in-place placebos is to apply the treatment at a <em>fake date</em> before the actual treatment:</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 17.4 (In-Time Placebo Test)</div>
                    <div class="env-body">
                        <p>Choose a pseudo-treatment date \\(T_0' < T_0\\). Apply the synthetic control using data from \\(t = 1\\) to \\(T_0'\\) as the pre-period, and examine the "effect" in \\(t = T_0' + 1, \\ldots, T_0\\). If a large gap appears before the actual treatment, the synthetic control may be unreliable.</p>
                    </div>
                </div>

                <p>In-time placebos serve as a <strong>falsification test</strong>: if the method finds an "effect" where there should be none, the pre-treatment fit is not capturing the true data-generating process, and the post-treatment estimates are suspect.</p>

                <div class="env-block example">
                    <div class="env-title">Example 17.3 (Inference for Proposition 99)</div>
                    <div class="env-body">
                        <p>In the California tobacco study, the placebo test applied SCM to each of the 38 control states. California's post/pre RMSPE ratio ranked first (highest), yielding a pseudo p-value of 1/39 \\(\\approx 0.026\\). The spaghetti plot showed California's gap clearly separated from the cloud of placebo gaps, providing strong evidence of a significant treatment effect.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-placebo"></div>
            `,
            visualizations: [
                {
                    id: 'viz-placebo',
                    title: 'Placebo Test Spaghetti Plot',
                    description: 'The highlighted line shows the treated unit gap. Gray lines show placebo gaps from applying SCM to each control unit. A real treatment effect stands out from the placebo distribution.',
                    setup: function(container, controls) {
                        var canvasW = 560, canvasH = 400;
                        var viz = new VizEngine(container, {width: canvasW, height: canvasH});
                        var ctx = viz.ctx;

                        var T = 40;
                        var T0 = 20;
                        var nPlacebos = 20;
                        var effectSize = 4;

                        var sliderEffect = VizEngine.createSlider(controls, 'True Effect Size', 0, 10, effectSize, 0.5, function(v) { effectSize = v; generate(); draw(); });
                        var sliderPlacebos = VizEngine.createSlider(controls, 'Number of Placebos', 5, 40, nPlacebos, 1, function(v) { nPlacebos = Math.round(v); generate(); draw(); });
                        VizEngine.createButton(controls, 'Regenerate', function() { generate(); draw(); });

                        var treatedGap = [];
                        var placeboGaps = [];

                        function generate() {
                            // Treated unit gap: near zero pre-treatment, diverging post-treatment
                            treatedGap = [];
                            for (var t = 0; t < T; t++) {
                                if (t <= T0) {
                                    treatedGap[t] = (Math.random() - 0.5) * 0.8;
                                } else {
                                    var elapsed = t - T0;
                                    treatedGap[t] = effectSize * (1 - Math.exp(-elapsed / 5)) + (Math.random() - 0.5) * 0.8;
                                }
                            }

                            // Placebo gaps: noise around zero throughout
                            placeboGaps = [];
                            for (var p = 0; p < nPlacebos; p++) {
                                placeboGaps[p] = [];
                                var drift = (Math.random() - 0.5) * 0.05;
                                var plNoise = 0.5 + Math.random() * 1.5;
                                for (var t = 0; t < T; t++) {
                                    placeboGaps[p][t] = drift * (t - T0) + (Math.random() - 0.5) * plNoise;
                                }
                            }
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, canvasW, canvasH);

                            var padL = 60, padR = 30, padT = 40, padB = 50;
                            var plotW = canvasW - padL - padR;
                            var plotH = canvasH - padT - padB;

                            // Find range
                            var allVals = treatedGap.slice();
                            for (var p = 0; p < nPlacebos; p++) allVals = allVals.concat(placeboGaps[p]);
                            var yMin = Math.min.apply(null, allVals) - 0.5;
                            var yMax = Math.max.apply(null, allVals) + 0.5;

                            function sx(t) { return padL + (t / (T - 1)) * plotW; }
                            function sy(v) { return padT + plotH / 2 - (v / Math.max(Math.abs(yMax), Math.abs(yMin))) * (plotH / 2); }

                            // Treatment time line
                            var treatX = sx(T0);
                            ctx.strokeStyle = '#444';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([5, 5]);
                            ctx.beginPath();
                            ctx.moveTo(treatX, padT);
                            ctx.lineTo(treatX, padT + plotH);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Zero line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(padL, sy(0));
                            ctx.lineTo(padL + plotW, sy(0));
                            ctx.stroke();

                            // Placebo gaps
                            for (var p = 0; p < nPlacebos; p++) {
                                ctx.strokeStyle = 'rgba(139,148,158,0.25)';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                for (var t = 0; t < T; t++) {
                                    if (t === 0) ctx.moveTo(sx(t), sy(placeboGaps[p][t]));
                                    else ctx.lineTo(sx(t), sy(placeboGaps[p][t]));
                                }
                                ctx.stroke();
                            }

                            // Treated gap (highlighted)
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            for (var t = 0; t < T; t++) {
                                if (t === 0) ctx.moveTo(sx(t), sy(treatedGap[t]));
                                else ctx.lineTo(sx(t), sy(treatedGap[t]));
                            }
                            ctx.stroke();

                            // Axes frame
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(padL, padT + plotH);
                            ctx.lineTo(padL + plotW, padT + plotH);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(padL, padT);
                            ctx.lineTo(padL, padT + plotH);
                            ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var t = 0; t <= T; t += 10) {
                                ctx.fillText(t, sx(t), padT + plotH + 6);
                            }
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            var yRange = Math.max(Math.abs(yMax), Math.abs(yMin));
                            for (var v = -Math.floor(yRange); v <= Math.floor(yRange); v += Math.max(1, Math.floor(yRange / 4))) {
                                ctx.fillText(v.toFixed(0), padL - 6, sy(v));
                            }

                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Time', padL + plotW / 2, canvasH - 12);

                            ctx.save();
                            ctx.translate(14, padT + plotH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.fillText('Gap (Y - Synthetic Y)', 0, 0);
                            ctx.restore();

                            // Annotation
                            ctx.fillStyle = '#888';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Treatment', treatX, padT - 14);

                            // Legend
                            var legX = padL + 10, legY = padT + 8;
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 3;
                            ctx.beginPath(); ctx.moveTo(legX, legY); ctx.lineTo(legX + 20, legY); ctx.stroke();
                            ctx.fillStyle = viz.colors.white;
                            ctx.textAlign = 'left';
                            ctx.fillText('Treated Unit Gap', legX + 26, legY + 1);

                            ctx.strokeStyle = 'rgba(139,148,158,0.5)';
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(legX, legY + 18); ctx.lineTo(legX + 20, legY + 18); ctx.stroke();
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Placebo Gaps', legX + 26, legY + 19);

                            // p-value annotation
                            // Count how many placebos have larger post/pre RMSPE ratio
                            var postRMSPE_treated = 0, preRMSPE_treated = 0;
                            for (var t = 0; t <= T0; t++) preRMSPE_treated += treatedGap[t] * treatedGap[t];
                            for (var t = T0 + 1; t < T; t++) postRMSPE_treated += treatedGap[t] * treatedGap[t];
                            preRMSPE_treated = Math.sqrt(preRMSPE_treated / (T0 + 1));
                            postRMSPE_treated = Math.sqrt(postRMSPE_treated / (T - T0 - 1));
                            var ratio_treated = preRMSPE_treated > 0.001 ? postRMSPE_treated / preRMSPE_treated : 999;

                            var rank = 1;
                            for (var p = 0; p < nPlacebos; p++) {
                                var preR = 0, postR = 0;
                                for (var t = 0; t <= T0; t++) preR += placeboGaps[p][t] * placeboGaps[p][t];
                                for (var t = T0 + 1; t < T; t++) postR += placeboGaps[p][t] * placeboGaps[p][t];
                                preR = Math.sqrt(preR / (T0 + 1));
                                postR = Math.sqrt(postR / (T - T0 - 1));
                                var ratio_p = preR > 0.001 ? postR / preR : 0;
                                if (ratio_p >= ratio_treated) rank++;
                            }
                            var pval = rank / (nPlacebos + 1);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('Pseudo p-value: ' + pval.toFixed(3), padL + plotW - 5, padT + 8);
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Rank: ' + rank + '/' + (nPlacebos + 1), padL + plotW - 5, padT + 24);
                        }

                        generate();
                        draw();
                        return { cleanup: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch17-ex09',
                    type: 'multiple-choice',
                    difficulty: 'basic',
                    question: 'In a placebo test with 38 control states and 1 treated state, what is the smallest possible pseudo p-value?',
                    options: [
                        '1/38',
                        '1/39',
                        '0',
                        '2/39'
                    ],
                    answer: 1,
                    explanation: 'With J + 1 = 39 total units, the smallest p-value occurs when the treated unit has the most extreme post/pre RMSPE ratio. Since we count the treated unit itself, the minimum p-value is 1/39. This limits the resolution of inference --- with few donors, we cannot achieve very small p-values.'
                },
                {
                    id: 'ch17-ex10',
                    type: 'multiple-choice',
                    difficulty: 'intermediate',
                    question: 'Why does the standard placebo test use the ratio of post-treatment RMSPE to pre-treatment RMSPE rather than just the post-treatment RMSPE?',
                    options: [
                        'To normalize for different outcome scales across units',
                        'To account for the fact that units with poor pre-treatment fit may mechanically have large post-treatment gaps unrelated to treatment',
                        'To make the test invariant to linear transformations of the outcome',
                        'To ensure the test statistic follows a known distribution'
                    ],
                    answer: 1,
                    explanation: 'If a placebo unit has a poor pre-treatment fit (large pre-treatment RMSPE), its post-treatment gap is likely large even without treatment, simply because the synthetic control is a poor match. The ratio adjusts for this: a large post-treatment gap is only meaningful if the pre-treatment fit was good.'
                },
                {
                    id: 'ch17-ex11',
                    type: 'multiple-choice',
                    difficulty: 'intermediate',
                    question: 'An in-time placebo test applies the synthetic control at a fake treatment date before the actual treatment. What does finding a large "effect" at the fake date indicate?',
                    options: [
                        'The actual treatment effect is very large',
                        'The treatment may have had anticipation effects',
                        'The synthetic control is not adequately capturing the treated unit trajectory, undermining the credibility of the actual treatment effect estimate',
                        'The donor pool contains too many units'
                    ],
                    answer: 2,
                    explanation: 'An in-time placebo test is a falsification check. If the synthetic control finds a gap before the actual treatment occurred (when there should be no effect), it suggests the pre-treatment fit is not capturing the true data-generating process. This casts doubt on whether the post-treatment gap reflects the treatment rather than pre-existing divergence.'
                }
            ]
        },

        // ============================================================
        // SECTION 4: Augmented Synthetic Control
        // ============================================================
        {
            id: 'ch17-sec04',
            title: 'Augmented Synthetic Control',
            content: `
                <h2>Augmented Synthetic Control</h2>

                <p>A well-known limitation of the standard synthetic control is that it requires a good pre-treatment fit. When the treated unit lies outside the convex hull of the donor pool or the number of pre-treatment periods is limited, the synthetic control may produce a biased estimate. The <strong>augmented synthetic control method (ASCM)</strong> addresses this by combining the synthetic control with an outcome model to correct for residual imbalance.</p>

                <h3>The Bias Problem</h3>

                <p>Recall that the standard SCM estimate of the treatment effect at time \\(t > T_0\\) is:</p>
                \\[\\hat{\\alpha}_{1t} = Y_{1t} - \\sum_{j=2}^{J+1} \\hat{w}_j Y_{jt}\\]

                <p>If the pre-treatment fit is imperfect, i.e., \\(X_1 \\neq X_0 \\hat{W}\\), then the estimator may be biased because the synthetic control does not fully account for the treated unit's characteristics. The bias is approximately:</p>
                \\[\\text{Bias} \\approx (X_1 - X_0 \\hat{W})' \\beta\\]
                <p>where \\(\\beta\\) relates the predictors to the outcome.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 17.5 (Augmented Synthetic Control)</div>
                    <div class="env-body">
                        <p>The <strong>augmented synthetic control estimator</strong> (Ben-Michael, Feller, and Rothstein, 2021) adds a bias correction term:</p>
                        \\[\\hat{\\alpha}_{1t}^{\\text{aug}} = Y_{1t} - \\sum_{j=2}^{J+1} \\hat{w}_j Y_{jt} - \\hat{\\eta}' (X_1 - X_0 \\hat{W})\\]
                        <p>where \\(\\hat{\\eta}\\) is an estimate of the outcome model coefficients, obtained for instance by ridge regression of \\(Y_{jt}\\) on \\(X_j\\) among the donor units.</p>
                    </div>
                </div>

                <h3>Ridge-ASCM</h3>

                <p>The most common implementation uses <strong>ridge regression</strong> for the outcome model. Specifically, Ridge-ASCM solves:</p>
                \\[\\hat{W}^{\\text{ridge}} = \\arg\\min_{W \\in \\Delta^J} \\sum_{t=1}^{T_0} \\left(Y_{1t} - \\sum_j w_j Y_{jt}\\right)^2 + \\lambda \\|W\\|_2^2\\]

                <p>The ridge penalty \\(\\lambda \\|W\\|_2^2\\) serves two purposes:</p>
                <ul>
                    <li><strong>Regularization:</strong> It prevents overfitting the pre-treatment periods and distributes weights more evenly.</li>
                    <li><strong>Bias-variance tradeoff:</strong> As \\(\\lambda \\to 0\\), we get the standard SCM (low bias, potentially high variance). As \\(\\lambda \\to \\infty\\), we approach uniform weighting (high bias, low variance).</li>
                </ul>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 17.1 (ASCM Bias Bound)</div>
                    <div class="env-body">
                        <p>Under regularity conditions, the augmented synthetic control estimator satisfies:</p>
                        \\[|\\hat{\\alpha}_{1t}^{\\text{aug}} - \\alpha_{1t}| \\leq \\|X_1 - X_0 \\hat{W}\\| \\cdot \\|\\hat{\\eta} - \\eta\\| + o_p(1)\\]
                        <p>The bias is the product of the residual imbalance and the outcome model error. If either is small, the estimator is approximately unbiased. This is the <strong>double robustness</strong> property: ASCM is consistent if either the SCM weights or the outcome model is well-specified.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 17.4 (ASCM in Practice)</div>
                    <div class="env-body">
                        <p>Consider a setting where the treated state has an unusually high GDP per capita that no convex combination of donors can match. Standard SCM will have a large pre-treatment RMSPE. ASCM uses the outcome model to extrapolate: the ridge regression learns how GDP relates to the predictors, and the bias correction term adjusts for the imperfect match. In simulations, Ben-Michael et al. show that ASCM can reduce bias by 50--80% compared to standard SCM when pre-treatment fit is poor.</p>
                    </div>
                </div>

                <h3>Choosing the Regularization Parameter</h3>

                <p>The hyperparameter \\(\\lambda\\) can be chosen via cross-validation. A common approach:</p>
                <ol>
                    <li>Split the pre-treatment period into a training set (early periods) and a validation set (later pre-treatment periods).</li>
                    <li>For each \\(\\lambda\\), fit the ASCM on the training set and evaluate prediction error on the validation set.</li>
                    <li>Choose \\(\\lambda\\) minimizing validation error.</li>
                </ol>

                <div class="viz-placeholder" data-viz="viz-ascm"></div>
            `,
            visualizations: [
                {
                    id: 'viz-ascm',
                    title: 'SCM vs. Augmented SCM Fit Quality',
                    description: 'Compare the standard synthetic control and augmented synthetic control. When the treated unit is hard to match, ASCM uses bias correction to improve the fit.',
                    setup: function(container, controls) {
                        var canvasW = 560, canvasH = 400;
                        var viz = new VizEngine(container, {width: canvasW, height: canvasH});
                        var ctx = viz.ctx;

                        var T = 40;
                        var T0 = 20;
                        var mismatch = 2;
                        var trueEffect = 3;

                        var sliderMismatch = VizEngine.createSlider(controls, 'Convex Hull Gap', 0, 5, mismatch, 0.5, function(v) { mismatch = v; generate(); draw(); });
                        var sliderEffect = VizEngine.createSlider(controls, 'True Effect', 0, 8, trueEffect, 0.5, function(v) { trueEffect = v; generate(); draw(); });
                        VizEngine.createButton(controls, 'Regenerate', function() { generate(); draw(); });

                        var treated = [];
                        var scmLine = [];
                        var ascmLine = [];
                        var counterfactual = [];

                        function generate() {
                            // True counterfactual: smooth trend
                            counterfactual = [];
                            counterfactual[0] = 10 + mismatch;
                            for (var t = 1; t < T; t++) {
                                counterfactual[t] = counterfactual[t - 1] + 0.1 + (Math.random() - 0.5) * 0.2;
                            }

                            // Treated: follows counterfactual pre-treatment, adds effect post-treatment
                            treated = [];
                            for (var t = 0; t < T; t++) {
                                if (t <= T0) {
                                    treated[t] = counterfactual[t] + (Math.random() - 0.5) * 0.3;
                                } else {
                                    treated[t] = counterfactual[t] + trueEffect * (1 - Math.exp(-(t - T0) / 4)) + (Math.random() - 0.5) * 0.3;
                                }
                            }

                            // SCM: biased due to mismatch - tracks below the counterfactual by ~mismatch
                            scmLine = [];
                            var scmBias = mismatch * 0.6; // SCM can't fully close the gap
                            for (var t = 0; t < T; t++) {
                                scmLine[t] = counterfactual[t] - scmBias + (Math.random() - 0.5) * 0.4;
                            }

                            // ASCM: corrects the bias
                            ascmLine = [];
                            var ascmBias = mismatch * 0.1; // Much smaller residual bias
                            for (var t = 0; t < T; t++) {
                                ascmLine[t] = counterfactual[t] - ascmBias + (Math.random() - 0.5) * 0.3;
                            }
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, canvasW, canvasH);

                            var padL = 60, padR = 30, padT = 40, padB = 50;
                            var plotW = canvasW - padL - padR;
                            var plotH = canvasH - padT - padB;

                            var allVals = treated.concat(scmLine).concat(ascmLine).concat(counterfactual);
                            var yMin = Math.min.apply(null, allVals) - 1;
                            var yMax = Math.max.apply(null, allVals) + 1;

                            function sx(t) { return padL + (t / (T - 1)) * plotW; }
                            function sy(v) { return padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH; }

                            // Treatment line
                            var treatX = sx(T0);
                            ctx.strokeStyle = '#444';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([5, 5]);
                            ctx.beginPath();
                            ctx.moveTo(treatX, padT);
                            ctx.lineTo(treatX, padT + plotH);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Counterfactual (true, dashed thin)
                            ctx.strokeStyle = 'rgba(139,148,158,0.5)';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            for (var t = 0; t < T; t++) {
                                if (t === 0) ctx.moveTo(sx(t), sy(counterfactual[t]));
                                else ctx.lineTo(sx(t), sy(counterfactual[t]));
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // SCM line
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([8, 4]);
                            ctx.beginPath();
                            for (var t = 0; t < T; t++) {
                                if (t === 0) ctx.moveTo(sx(t), sy(scmLine[t]));
                                else ctx.lineTo(sx(t), sy(scmLine[t]));
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // ASCM line
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var t = 0; t < T; t++) {
                                if (t === 0) ctx.moveTo(sx(t), sy(ascmLine[t]));
                                else ctx.lineTo(sx(t), sy(ascmLine[t]));
                            }
                            ctx.stroke();

                            // Treated line
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var t = 0; t < T; t++) {
                                if (t === 0) ctx.moveTo(sx(t), sy(treated[t]));
                                else ctx.lineTo(sx(t), sy(treated[t]));
                            }
                            ctx.stroke();

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(padL, padT + plotH);
                            ctx.lineTo(padL + plotW, padT + plotH);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(padL, padT);
                            ctx.lineTo(padL, padT + plotH);
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var t = 0; t <= T; t += 10) ctx.fillText(t, sx(t), padT + plotH + 6);

                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            var nTicks = 5;
                            for (var i = 0; i <= nTicks; i++) {
                                var v = yMin + (yMax - yMin) * i / nTicks;
                                ctx.fillText(v.toFixed(1), padL - 6, sy(v));
                            }

                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Time', padL + plotW / 2, canvasH - 12);

                            ctx.save();
                            ctx.translate(14, padT + plotH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('Outcome', 0, 0);
                            ctx.restore();

                            ctx.fillStyle = '#888';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Treatment', treatX, padT - 14);

                            // Legend
                            var legX = padL + 10, legY = padT + 8;
                            var items = [
                                {color: viz.colors.red, label: 'Treated Unit', dash: false},
                                {color: viz.colors.teal, label: 'ASCM', dash: false},
                                {color: viz.colors.orange, label: 'Standard SCM', dash: true},
                                {color: 'rgba(139,148,158,0.5)', label: 'True Counterfactual', dash: true}
                            ];
                            for (var i = 0; i < items.length; i++) {
                                var ly = legY + i * 16;
                                ctx.strokeStyle = items[i].color;
                                ctx.lineWidth = 2;
                                if (items[i].dash) ctx.setLineDash([5, 3]);
                                ctx.beginPath(); ctx.moveTo(legX, ly); ctx.lineTo(legX + 20, ly); ctx.stroke();
                                ctx.setLineDash([]);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(items[i].label, legX + 26, ly + 1);
                            }

                            // Pre-treatment RMSPE comparison
                            var scmRMSPE = 0, ascmRMSPE = 0;
                            for (var t = 0; t <= T0; t++) {
                                var scmErr = treated[t] - scmLine[t];
                                var ascmErr = treated[t] - ascmLine[t];
                                scmRMSPE += scmErr * scmErr;
                                ascmRMSPE += ascmErr * ascmErr;
                            }
                            scmRMSPE = Math.sqrt(scmRMSPE / (T0 + 1));
                            ascmRMSPE = Math.sqrt(ascmRMSPE / (T0 + 1));

                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('SCM pre-RMSPE: ' + scmRMSPE.toFixed(2), padL + plotW - 5, padT + plotH - 30);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('ASCM pre-RMSPE: ' + ascmRMSPE.toFixed(2), padL + plotW - 5, padT + plotH - 14);
                        }

                        generate();
                        draw();
                        return { cleanup: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch17-ex12',
                    type: 'multiple-choice',
                    difficulty: 'intermediate',
                    question: 'What is the "double robustness" property of the augmented synthetic control?',
                    options: [
                        'It produces consistent estimates if either the SCM weights or the outcome model is correctly specified',
                        'It uses two separate donor pools for robustness',
                        'It applies both in-place and in-time placebo tests',
                        'It is robust to both heteroskedasticity and serial correlation'
                    ],
                    answer: 0,
                    explanation: 'The augmented SCM has a product-form bias: Bias is proportional to (imbalance) times (outcome model error). If the SCM weights produce good balance (small imbalance), the outcome model need not be perfect. If the outcome model is correct, the bias correction fixes any imbalance. Consistency requires only one of the two to be well-specified.'
                },
                {
                    id: 'ch17-ex13',
                    type: 'multiple-choice',
                    difficulty: 'advanced',
                    question: 'In Ridge-ASCM, what happens as the regularization parameter lambda goes to infinity?',
                    options: [
                        'The weights converge to the standard SCM solution',
                        'All donor weights become equal (uniform weighting)',
                        'The weights converge to zero',
                        'The estimator becomes equivalent to a simple difference-in-means'
                    ],
                    answer: 1,
                    explanation: 'As lambda grows, the ridge penalty dominates, pushing all weights toward equality. In the limit, each donor gets weight 1/J. This is a high-bias, low-variance extreme. The standard SCM (lambda = 0) is the opposite: low bias (optimal pre-treatment fit) but potentially high variance (concentrated weights).'
                },
                {
                    id: 'ch17-ex14',
                    type: 'multiple-choice',
                    difficulty: 'intermediate',
                    question: 'When is augmented synthetic control most beneficial compared to standard SCM?',
                    options: [
                        'When the donor pool is very large',
                        'When the treated unit has perfect pre-treatment fit with the donor pool',
                        'When the treated unit lies outside or near the boundary of the convex hull of donors, leading to imperfect pre-treatment fit',
                        'When the post-treatment period is very short'
                    ],
                    answer: 2,
                    explanation: 'ASCM is specifically designed to correct bias from imperfect pre-treatment fit. When the treated unit lies outside the convex hull of donors, standard SCM cannot achieve a good match. The outcome model in ASCM extrapolates to correct this gap. When pre-treatment fit is already good, ASCM and SCM produce similar results.'
                }
            ]
        },

        // ============================================================
        // SECTION 5: Matrix Completion & Generalized SCM
        // ============================================================
        {
            id: 'ch17-sec05',
            title: 'Matrix Completion & Generalized SCM',
            content: `
                <h2>Matrix Completion & Generalized SCM</h2>

                <p>The synthetic control method can be viewed through the lens of <strong>matrix completion</strong>. This connection leads to powerful generalizations, including methods that handle multiple treated units, flexible factor structures, and missing data.</p>

                <h3>The Matrix Completion View</h3>

                <p>Arrange all outcomes in a matrix \\(Y \\in \\mathbb{R}^{N \\times T}\\), where \\(Y_{jt}\\) is the outcome for unit \\(j\\) at time \\(t\\). For a single treated unit (unit 1) treated after \\(T_0\\), the missing entries are \\(\\{Y_{1t}^N : t > T_0\\}\\) --- the counterfactual outcomes we wish to estimate. All other entries are observed.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 17.6 (Panel Data as Matrix Completion)</div>
                    <div class="env-body">
                        <p>Let \\(\\mathcal{O} \\subset \\{1, \\ldots, N\\} \\times \\{1, \\ldots, T\\}\\) denote the set of observed entries (all entries except the treated unit's post-treatment outcomes). The <strong>matrix completion approach</strong> to causal inference estimates the missing counterfactuals by completing the matrix under a low-rank assumption:</p>
                        \\[\\hat{Y} = \\arg\\min_{M} \\sum_{(j,t) \\in \\mathcal{O}} (Y_{jt} - M_{jt})^2 \\quad \\text{s.t. } \\operatorname{rank}(M) \\leq r\\]
                    </div>
                </div>

                <h3>Nuclear Norm Minimization</h3>

                <p>Since rank minimization is NP-hard, we use the <strong>nuclear norm</strong> (sum of singular values) as a convex relaxation:</p>
                \\[\\hat{Y} = \\arg\\min_{M} \\sum_{(j,t) \\in \\mathcal{O}} (Y_{jt} - M_{jt})^2 + \\lambda \\|M\\|_*\\]
                <p>where \\(\\|M\\|_* = \\sum_{i} \\sigma_i(M)\\) is the nuclear norm. This is analogous to how the \\(\\ell_1\\) norm relaxes sparsity in LASSO regression.</p>

                <div class="env-block intuition">
                    <div class="env-title">Intuition</div>
                    <div class="env-body">
                        <p>Panel data outcomes are often generated by a small number of latent factors (e.g., national economic trends, regional shocks). This means the outcome matrix is approximately low-rank. Matrix completion exploits this structure to fill in the missing counterfactuals, much like how Netflix predicts your movie ratings from the ratings of similar users.</p>
                    </div>
                </div>

                <h3>Connection to Synthetic Control</h3>

                <p>The standard synthetic control can be seen as a special case. When we estimate \\(Y_{1t}^N = \\sum_j w_j Y_{jt}\\), we are essentially saying that row 1 of the completed matrix is a weighted combination of other rows. Matrix completion generalizes this by:</p>
                <ul>
                    <li>Allowing the counterfactual to depend on both <em>rows</em> (units) and <em>columns</em> (time periods), not just rows.</li>
                    <li>Not requiring the weights to be non-negative or sum to one.</li>
                    <li>Handling multiple treated units naturally.</li>
                </ul>

                <h3>Athey et al. (2021): Matrix Completion for Causal Panels</h3>

                <p>Athey, Bayati, Doudchenko, Imbens, and Khosravi (2021) formalized the matrix completion approach for panel data:</p>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 17.2 (MC Estimator Consistency)</div>
                    <div class="env-body">
                        <p>Under a factor model \\(Y_{jt}^N = \\mu_j + \\gamma_t + \\sum_{k=1}^r \\lambda_{jk} f_{tk} + \\varepsilon_{jt}\\) with sub-Gaussian noise and incoherence conditions on the factors, the nuclear-norm regularized estimator satisfies:</p>
                        \\[\\frac{1}{|\\mathcal{M}|} \\sum_{(j,t) \\in \\mathcal{M}} (\\hat{Y}_{jt} - Y_{jt}^N)^2 = O_p\\left(\\frac{r(N+T) \\log(NT)}{|\\mathcal{O}|}\\right)\\]
                        <p>where \\(\\mathcal{M}\\) is the set of missing entries. The error decreases as the number of observed entries \\(|\\mathcal{O}|\\) grows.</p>
                    </div>
                </div>

                <h3>Multiple Treated Units</h3>

                <p>A major advantage of the matrix completion approach is that it naturally handles <strong>multiple treated units</strong> and <strong>staggered adoption</strong>. When several units are treated at different times, the pattern of missing entries becomes more complex, but the matrix completion framework simply treats all missing counterfactuals identically and fills them in simultaneously.</p>

                <div class="env-block example">
                    <div class="env-title">Example 17.5 (Staggered Treatment with MC)</div>
                    <div class="env-body">
                        <p>Consider 50 states, where 10 adopt a policy at different times between 2000 and 2010. The outcome matrix has a block of observed entries and a staircase-shaped pattern of missing entries. Matrix completion fills in the entire staircase simultaneously, estimating unit-specific treatment effects. This is more efficient than running separate synthetic controls for each treated unit because it borrows information across units and time periods.</p>
                    </div>
                </div>

                <h3>Comparison of Methods</h3>

                <table class="env-table" style="width:100%;border-collapse:collapse;margin:16px 0;">
                    <tr style="border-bottom:2px solid #333;">
                        <th style="padding:8px;text-align:left;color:#8b949e;">Feature</th>
                        <th style="padding:8px;text-align:center;color:#8b949e;">SCM</th>
                        <th style="padding:8px;text-align:center;color:#8b949e;">ASCM</th>
                        <th style="padding:8px;text-align:center;color:#8b949e;">MC</th>
                    </tr>
                    <tr style="border-bottom:1px solid #222;">
                        <td style="padding:6px;">Convex hull constraint</td>
                        <td style="padding:6px;text-align:center;">Yes</td>
                        <td style="padding:6px;text-align:center;">Relaxed</td>
                        <td style="padding:6px;text-align:center;">No</td>
                    </tr>
                    <tr style="border-bottom:1px solid #222;">
                        <td style="padding:6px;">Multiple treated units</td>
                        <td style="padding:6px;text-align:center;">One at a time</td>
                        <td style="padding:6px;text-align:center;">One at a time</td>
                        <td style="padding:6px;text-align:center;">Simultaneously</td>
                    </tr>
                    <tr style="border-bottom:1px solid #222;">
                        <td style="padding:6px;">Factor structure</td>
                        <td style="padding:6px;text-align:center;">Implicit</td>
                        <td style="padding:6px;text-align:center;">Explicit correction</td>
                        <td style="padding:6px;text-align:center;">Explicit</td>
                    </tr>
                    <tr style="border-bottom:1px solid #222;">
                        <td style="padding:6px;">Weights interpretability</td>
                        <td style="padding:6px;text-align:center;">High</td>
                        <td style="padding:6px;text-align:center;">Medium</td>
                        <td style="padding:6px;text-align:center;">Low</td>
                    </tr>
                    <tr>
                        <td style="padding:6px;">Inference</td>
                        <td style="padding:6px;text-align:center;">Placebo</td>
                        <td style="padding:6px;text-align:center;">Conformal</td>
                        <td style="padding:6px;text-align:center;">Asymptotic</td>
                    </tr>
                </table>

                <div class="viz-placeholder" data-viz="viz-matrix-completion"></div>
            `,
            visualizations: [
                {
                    id: 'viz-matrix-completion',
                    title: 'Matrix Completion for Causal Panels',
                    description: 'Visualize an outcome matrix with observed and missing (counterfactual) entries. The low-rank structure allows completion of the missing entries.',
                    setup: function(container, controls) {
                        var canvasW = 560, canvasH = 420;
                        var viz = new VizEngine(container, {width: canvasW, height: canvasH});
                        var ctx = viz.ctx;

                        var N = 12;  // units
                        var T = 20;  // time periods
                        var nTreated = 3;
                        var rank = 2;

                        var sliderTreated = VizEngine.createSlider(controls, 'Treated Units', 1, 6, nTreated, 1, function(v) { nTreated = Math.round(v); generate(); draw(); });
                        var sliderRank = VizEngine.createSlider(controls, 'Latent Rank', 1, 5, rank, 1, function(v) { rank = Math.round(v); generate(); draw(); });
                        VizEngine.createButton(controls, 'Regenerate', function() { generate(); draw(); });

                        var Y = [];          // full matrix
                        var Yobs = [];       // observed (with NaN for missing)
                        var Ycompleted = []; // completed matrix
                        var treatTimes = [];

                        function generate() {
                            // Generate low-rank matrix via factor model
                            var Lambda = [];
                            var F = [];
                            for (var j = 0; j < N; j++) {
                                Lambda[j] = [];
                                for (var k = 0; k < rank; k++) {
                                    Lambda[j][k] = (Math.random() - 0.5) * 3;
                                }
                            }
                            for (var t = 0; t < T; t++) {
                                F[t] = [];
                                for (var k = 0; k < rank; k++) {
                                    F[t][k] = (Math.random() - 0.5) * 3;
                                }
                            }

                            // Unit and time fixed effects
                            var mu = [];
                            var gamma = [];
                            for (var j = 0; j < N; j++) mu[j] = (Math.random() - 0.5) * 2;
                            for (var t = 0; t < T; t++) gamma[t] = t * 0.1;

                            Y = [];
                            for (var j = 0; j < N; j++) {
                                Y[j] = [];
                                for (var t = 0; t < T; t++) {
                                    var val = mu[j] + gamma[t];
                                    for (var k = 0; k < rank; k++) {
                                        val += Lambda[j][k] * F[t][k];
                                    }
                                    val += (Math.random() - 0.5) * 0.5;
                                    Y[j][t] = val;
                                }
                            }

                            // Staggered treatment times for first nTreated units
                            treatTimes = [];
                            for (var j = 0; j < N; j++) {
                                if (j < nTreated) {
                                    treatTimes[j] = Math.floor(T * 0.4) + Math.floor(Math.random() * (T * 0.3));
                                } else {
                                    treatTimes[j] = T; // never treated
                                }
                            }

                            // Build observed matrix (NaN for missing counterfactuals)
                            Yobs = [];
                            for (var j = 0; j < N; j++) {
                                Yobs[j] = [];
                                for (var t = 0; t < T; t++) {
                                    if (t >= treatTimes[j]) {
                                        Yobs[j][t] = NaN;
                                    } else {
                                        Yobs[j][t] = Y[j][t];
                                    }
                                }
                            }

                            // Simple matrix completion simulation:
                            // Use column means for missing entries as a basic approximation
                            Ycompleted = [];
                            for (var j = 0; j < N; j++) {
                                Ycompleted[j] = [];
                                for (var t = 0; t < T; t++) {
                                    if (!isNaN(Yobs[j][t])) {
                                        Ycompleted[j][t] = Yobs[j][t];
                                    } else {
                                        // Average of observed units at this time
                                        var sum = 0, cnt = 0;
                                        for (var jj = 0; jj < N; jj++) {
                                            if (!isNaN(Yobs[jj][t])) {
                                                // Weight by similarity in pre-treatment
                                                sum += Y[jj][t];
                                                cnt++;
                                            }
                                        }
                                        Ycompleted[j][t] = cnt > 0 ? sum / cnt + (Y[j][0] - sum / cnt) * 0.5 : 0;
                                    }
                                }
                            }
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, canvasW, canvasH);

                            var padL = 80, padR = 30, padT = 50, padB = 60;
                            var matW = canvasW - padL - padR;
                            var matH = canvasH - padT - padB;

                            var cellW = matW / T;
                            var cellH = matH / N;

                            // Find value range for color mapping
                            var allVals = [];
                            for (var j = 0; j < N; j++) {
                                for (var t = 0; t < T; t++) {
                                    allVals.push(Y[j][t]);
                                }
                            }
                            var vMin = Math.min.apply(null, allVals);
                            var vMax = Math.max.apply(null, allVals);
                            var vRange = vMax - vMin || 1;

                            function valToColor(v, missing) {
                                var norm = (v - vMin) / vRange;
                                norm = Math.max(0, Math.min(1, norm));
                                if (missing) {
                                    // Use a different colormap for completed entries
                                    var r = Math.round(30 + norm * 180);
                                    var g = Math.round(80 + norm * 100);
                                    var b = Math.round(60 + norm * 50);
                                    return 'rgb(' + r + ',' + g + ',' + b + ')';
                                } else {
                                    var r2 = Math.round(20 + norm * 60);
                                    var g2 = Math.round(40 + norm * 120);
                                    var b2 = Math.round(120 + norm * 135);
                                    return 'rgb(' + r2 + ',' + g2 + ',' + b2 + ')';
                                }
                            }

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Outcome Matrix Y (N = ' + N + ', T = ' + T + ')', padL + matW / 2, 20);

                            // Draw cells
                            for (var j = 0; j < N; j++) {
                                for (var t = 0; t < T; t++) {
                                    var cx = padL + t * cellW;
                                    var cy = padT + j * cellH;
                                    var isMissing = isNaN(Yobs[j][t]);
                                    var val = isMissing ? Ycompleted[j][t] : Yobs[j][t];

                                    ctx.fillStyle = valToColor(val, isMissing);
                                    ctx.fillRect(cx + 0.5, cy + 0.5, cellW - 1, cellH - 1);

                                    // Mark missing entries with a small cross or dot
                                    if (isMissing) {
                                        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
                                        ctx.lineWidth = 0.8;
                                        var midX = cx + cellW / 2;
                                        var midY = cy + cellH / 2;
                                        var s = Math.min(cellW, cellH) * 0.2;
                                        ctx.beginPath();
                                        ctx.moveTo(midX - s, midY - s);
                                        ctx.lineTo(midX + s, midY + s);
                                        ctx.moveTo(midX + s, midY - s);
                                        ctx.lineTo(midX - s, midY + s);
                                        ctx.stroke();
                                    }
                                }
                            }

                            // Draw staggered treatment boundary
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var j = 0; j < N; j++) {
                                if (treatTimes[j] < T) {
                                    var bx = padL + treatTimes[j] * cellW;
                                    var by1 = padT + j * cellH;
                                    var by2 = padT + (j + 1) * cellH;
                                    ctx.moveTo(bx, by1);
                                    ctx.lineTo(bx, by2);
                                    // Connect horizontally
                                    if (j < N - 1 && treatTimes[j + 1] < T) {
                                        ctx.lineTo(padL + treatTimes[j + 1] * cellW, by2);
                                    } else if (j < N - 1) {
                                        ctx.lineTo(padL + matW, by2);
                                    }
                                }
                            }
                            ctx.stroke();

                            // Row labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var j = 0; j < N; j++) {
                                var label = j < nTreated ? 'Treated ' + (j + 1) : 'Control ' + (j - nTreated + 1);
                                ctx.fillStyle = j < nTreated ? viz.colors.red : viz.colors.text;
                                ctx.fillText(label, padL - 5, padT + j * cellH + cellH / 2);
                            }

                            // Column labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var t = 0; t < T; t += 5) {
                                ctx.fillText('t=' + t, padL + t * cellW + cellW / 2, padT + matH + 6);
                            }

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Time Periods', padL + matW / 2, canvasH - 12);

                            // Legend
                            var legX = padL, legY = padT + matH + 26;
                            ctx.fillStyle = valToColor((vMin + vMax) / 2, false);
                            ctx.fillRect(legX, legY, 14, 14);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Observed', legX + 18, legY + 8);

                            ctx.fillStyle = valToColor((vMin + vMax) / 2, true);
                            ctx.fillRect(legX + 90, legY, 14, 14);
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Completed (x = missing)', legX + 108, legY + 8);

                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(legX + 260, legY + 7); ctx.lineTo(legX + 280, legY + 7); ctx.stroke();
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Treatment', legX + 284, legY + 8);
                        }

                        generate();
                        draw();
                        return { cleanup: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch17-ex15',
                    type: 'multiple-choice',
                    difficulty: 'basic',
                    question: 'Why is the outcome matrix in a causal panel data setting expected to be approximately low-rank?',
                    options: [
                        'Because the treatment effects are always small',
                        'Because outcomes are driven by a small number of common latent factors (economic trends, shared shocks, etc.)',
                        'Because most units are untreated',
                        'Because the noise is normally distributed'
                    ],
                    answer: 1,
                    explanation: 'Panel data outcomes are typically generated by a factor model with a few latent factors (e.g., national economic growth, regional trends, sector-specific shocks). When the number of factors r is much smaller than min(N, T), the outcome matrix is approximately rank r, making matrix completion feasible.'
                },
                {
                    id: 'ch17-ex16',
                    type: 'multiple-choice',
                    difficulty: 'intermediate',
                    question: 'The nuclear norm is used as a convex relaxation of which quantity?',
                    options: [
                        'The Frobenius norm',
                        'The matrix rank',
                        'The spectral norm (largest singular value)',
                        'The trace of the matrix'
                    ],
                    answer: 1,
                    explanation: 'The nuclear norm (sum of singular values) is the tightest convex relaxation of the rank function, analogous to how the L1 norm is the convex relaxation of the L0 (sparsity) penalty. Minimizing rank directly is NP-hard, but nuclear norm minimization is a convex program solvable in polynomial time.'
                },
                {
                    id: 'ch17-ex17',
                    type: 'multiple-choice',
                    difficulty: 'intermediate',
                    question: 'What is a key advantage of the matrix completion approach over standard synthetic control when multiple units adopt treatment at different times?',
                    options: [
                        'Matrix completion does not require pre-treatment data',
                        'Matrix completion estimates all missing counterfactuals simultaneously, borrowing information across units and time periods',
                        'Matrix completion always produces smaller standard errors',
                        'Matrix completion does not require a donor pool'
                    ],
                    answer: 1,
                    explanation: 'With staggered treatment adoption, standard SCM would need to be run separately for each treated unit. Matrix completion fills in the entire pattern of missing counterfactuals simultaneously, exploiting the shared low-rank structure. This is statistically more efficient because it borrows strength across both the unit and time dimensions.'
                },
                {
                    id: 'ch17-ex18',
                    type: 'multiple-choice',
                    difficulty: 'advanced',
                    question: 'Which condition on the latent factor structure is required for successful matrix completion in causal panels?',
                    options: [
                        'The factors must be orthogonal to each other',
                        'The factors must follow a Gaussian distribution',
                        'An incoherence condition: the factor loadings and factors must be spread out (not concentrated on a few units or time periods)',
                        'The number of factors must equal the number of treated units'
                    ],
                    answer: 2,
                    explanation: 'Incoherence is a standard condition in matrix completion theory. It requires that the singular vectors of the matrix are not too aligned with the standard basis --- intuitively, the information content is spread across many entries. If the factors were concentrated on a few units or times, the missing entries might contain too little information for recovery. This is analogous to the identifiability issues in Robust PCA.'
                }
            ]
        }
    ]
});
