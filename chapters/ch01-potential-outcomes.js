// ============================================================
// Chapter 1
// Potential Outcomes Framework — The Rubin Causal Model
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch01',
    number: 1,
    title: 'Potential Outcomes Framework',
    subtitle: 'The Rubin Causal Model',
    sections: [
        // --------------------------------------------------------
        // Section 1: Rubin Causal Model & Notation
        // --------------------------------------------------------
        {
            id: 'ch01-sec01',
            title: 'Rubin Causal Model & Notation',
            content: `<h2>Rubin Causal Model & Notation</h2>
<p>The <strong>potential outcomes framework</strong> (also called the <strong>Rubin Causal Model</strong>) provides a precise mathematical language for defining causal effects at the individual level. It was pioneered by Jerzy Neyman (1923) for randomized experiments and extended to observational studies by Donald Rubin (1974).</p>

<div class="env-block definition">
<div class="env-title">Definition (Potential Outcomes)</div>
<div class="env-body">
<p>For each unit \\(i\\) in a population of size \\(N\\), we define two <strong>potential outcomes</strong>:</p>
<ul>
<li>\\(Y_i(1)\\): the outcome unit \\(i\\) <em>would</em> experience under treatment (\\(W_i = 1\\))</li>
<li>\\(Y_i(0)\\): the outcome unit \\(i\\) <em>would</em> experience under control (\\(W_i = 0\\))</li>
</ul>
<p>These are fixed attributes of the unit — they exist regardless of which treatment is actually assigned.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Treatment Indicator)</div>
<div class="env-body">
<p>The <strong>treatment indicator</strong> \\(W_i \\in \\{0, 1\\}\\) records which treatment unit \\(i\\) actually receives. The <strong>observed outcome</strong> is:</p>
\\[Y_i^{\\text{obs}} = W_i \\cdot Y_i(1) + (1 - W_i) \\cdot Y_i(0)\\]
<p>This is sometimes called the <strong>switching equation</strong>: nature "switches" between the two potential outcomes based on treatment assignment.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Individual Treatment Effect)</div>
<div class="env-body">
<p>The <strong>individual causal effect</strong> (ICE) of the treatment for unit \\(i\\) is:</p>
\\[\\tau_i = Y_i(1) - Y_i(0)\\]
</div>
</div>

<div class="env-block warning">
<div class="env-title">The Fundamental Problem of Causal Inference</div>
<div class="env-body">
<p>For any unit \\(i\\), we can observe at most one of \\(Y_i(1)\\) or \\(Y_i(0)\\), never both simultaneously. The unobserved potential outcome is called the <strong>counterfactual</strong>. This means we can <em>never</em> directly observe the individual treatment effect \\(\\tau_i\\).</p>
<p>This fundamental problem, articulated by Holland (1986), is why causal inference is inherently a <strong>missing data problem</strong>.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-potential-outcomes-table"></div>

<div class="env-block example">
<div class="env-title">Example (Drug Trial)</div>
<div class="env-body">
<p>Consider a clinical trial with 6 patients. Patient \\(i = 3\\) receives the drug (\\(W_3 = 1\\)) and recovers in 5 days (\\(Y_3^{\\text{obs}} = 5\\)). We know \\(Y_3(1) = 5\\), but \\(Y_3(0)\\) — how long recovery would have taken without the drug — is forever unknown. The individual treatment effect \\(\\tau_3 = 5 - Y_3(0)\\) cannot be computed.</p>
</div>
</div>

<div class="env-block remark">
<div class="env-title">Historical Note</div>
<div class="env-body">
<p>Neyman introduced potential outcomes in 1923 (in Polish!) for agricultural experiments. Rubin (1974, 1978) generalized the framework to observational studies, connecting it to missing data theory. The framework is sometimes called the <strong>Neyman-Rubin Causal Model</strong>.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch01-viz-potential-outcomes-table',
                    title: 'Potential Outcomes Table',
                    description: 'Interactive table showing observed and missing (counterfactual) potential outcomes',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 1, originX: 0, originY: 0});
                        var N = 8;
                        var seed = 42;

                        function seededRandom(s) {
                            var x = Math.sin(s) * 10000;
                            return x - Math.floor(x);
                        }

                        function generateData(sd) {
                            var data = [];
                            for (var i = 0; i < N; i++) {
                                var y0 = Math.round(40 + seededRandom(sd + i * 7) * 30);
                                var tau = Math.round(-5 + seededRandom(sd + i * 13 + 100) * 20);
                                var y1 = y0 + tau;
                                var w = seededRandom(sd + i * 19 + 200) > 0.5 ? 1 : 0;
                                data.push({i: i + 1, y0: y0, y1: y1, tau: tau, w: w});
                            }
                            return data;
                        }

                        var data = generateData(seed);
                        var showCounterfactuals = false;

                        function draw() {
                            var ctx = viz.ctx;
                            viz.clear();

                            var colWidths = [50, 55, 85, 85, 105, 70];
                            var headers = ['Unit i', 'Wi', 'Yi(1)', 'Yi(0)', 'Yi(obs)', 'tau_i'];
                            var startX = 50;
                            var startY = 55;
                            var rowH = 38;
                            var totalW = 0;
                            for (var c = 0; c < colWidths.length; c++) totalW += colWidths[c];

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Potential Outcomes Table', startX + totalW / 2, 25);

                            // Header row
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(startX, startY, totalW, rowH);
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(startX, startY, totalW, rowH);

                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            var hx = startX;
                            for (var h = 0; h < headers.length; h++) {
                                ctx.fillText(headers[h], hx + colWidths[h] / 2, startY + rowH / 2);
                                hx += colWidths[h];
                            }

                            // Data rows
                            for (var r = 0; r < data.length; r++) {
                                var row = data[r];
                                var ry = startY + (r + 1) * rowH;
                                var bgColor = r % 2 === 0 ? '#0e0e28' : '#12122e';
                                ctx.fillStyle = bgColor;
                                ctx.fillRect(startX, ry, totalW, rowH);
                                ctx.strokeStyle = '#2a2a4a';
                                ctx.lineWidth = 0.5;
                                ctx.strokeRect(startX, ry, totalW, rowH);

                                var cx = startX;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';

                                // Unit
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText(row.i.toString(), cx + colWidths[0] / 2, ry + rowH / 2);
                                cx += colWidths[0];

                                // Wi
                                ctx.fillStyle = row.w === 1 ? viz.colors.teal : viz.colors.orange;
                                ctx.fillText(row.w.toString(), cx + colWidths[1] / 2, ry + rowH / 2);
                                cx += colWidths[1];

                                // Yi(1)
                                if (row.w === 1 || showCounterfactuals) {
                                    ctx.fillStyle = row.w === 1 ? viz.colors.white : viz.colors.purple + '99';
                                    ctx.fillText(row.y1.toString(), cx + colWidths[2] / 2, ry + rowH / 2);
                                } else {
                                    ctx.fillStyle = viz.colors.red + '88';
                                    ctx.fillText('?', cx + colWidths[2] / 2, ry + rowH / 2);
                                }
                                cx += colWidths[2];

                                // Yi(0)
                                if (row.w === 0 || showCounterfactuals) {
                                    ctx.fillStyle = row.w === 0 ? viz.colors.white : viz.colors.purple + '99';
                                    ctx.fillText(row.y0.toString(), cx + colWidths[3] / 2, ry + rowH / 2);
                                } else {
                                    ctx.fillStyle = viz.colors.red + '88';
                                    ctx.fillText('?', cx + colWidths[3] / 2, ry + rowH / 2);
                                }
                                cx += colWidths[3];

                                // Yi(obs)
                                ctx.fillStyle = viz.colors.green;
                                var yObs = row.w === 1 ? row.y1 : row.y0;
                                ctx.fillText(yObs.toString(), cx + colWidths[4] / 2, ry + rowH / 2);
                                cx += colWidths[4];

                                // tau_i
                                if (showCounterfactuals) {
                                    ctx.fillStyle = viz.colors.yellow;
                                    ctx.fillText(row.tau.toString(), cx + colWidths[5] / 2, ry + rowH / 2);
                                } else {
                                    ctx.fillStyle = viz.colors.red + '88';
                                    ctx.fillText('?', cx + colWidths[5] / 2, ry + rowH / 2);
                                }
                            }

                            // Legend
                            var ly = startY + (N + 1) * rowH + 15;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Treated (W=1)', startX, ly);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Control (W=0)', startX + 110, ly);
                            ctx.fillStyle = viz.colors.red + '88';
                            ctx.fillText('? = Counterfactual (missing)', startX + 230, ly);
                            if (showCounterfactuals) {
                                ctx.fillStyle = viz.colors.purple + '99';
                                ctx.fillText('Purple = revealed counterfactuals', startX + 430, ly);
                            }
                        }

                        draw();

                        VizEngine.createButton(controls, 'Toggle Counterfactuals', function() {
                            showCounterfactuals = !showCounterfactuals;
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Random Assignment', function() {
                            seed += 37;
                            data = generateData(seed);
                            draw();
                        });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch01-ex01',
                    type: 'multiple-choice',
                    question: 'Why is the individual treatment effect impossible to observe directly?',
                    options: [
                        'Because the sample size is always too small',
                        'Because we can never observe both Y_i(1) and Y_i(0) for the same unit simultaneously',
                        'Because treatment effects are always zero',
                        'Because potential outcomes are random variables'
                    ],
                    correct: 1,
                    explanation: 'This is the Fundamental Problem of Causal Inference (Holland, 1986): each unit is either treated or not, so only one potential outcome is ever observed. The other remains a counterfactual.'
                },
                {
                    id: 'ch01-ex02',
                    type: 'multiple-choice',
                    question: 'In the switching equation Y_i = W_i * Y_i(1) + (1 - W_i) * Y_i(0), what happens when W_i = 0?',
                    options: [
                        'Y_i = Y_i(1)',
                        'Y_i = Y_i(0)',
                        'Y_i = Y_i(1) + Y_i(0)',
                        'Y_i = 0'
                    ],
                    correct: 1,
                    explanation: 'When W_i = 0, the equation becomes Y_i = 0 * Y_i(1) + 1 * Y_i(0) = Y_i(0). The unit is in the control group, so we observe the control potential outcome.'
                },
                {
                    id: 'ch01-ex03',
                    type: 'numeric',
                    question: 'Suppose Y_i(1) = 8 and Y_i(0) = 5. What is the individual treatment effect tau_i?',
                    answer: 3,
                    tolerance: 0.01,
                    explanation: 'The individual treatment effect is tau_i = Y_i(1) - Y_i(0) = 8 - 5 = 3.'
                },
                {
                    id: 'ch01-ex04',
                    type: 'multiple-choice',
                    question: 'Which of the following is NOT a key contribution of the Rubin Causal Model?',
                    options: [
                        'Defining causal effects as comparisons of potential outcomes',
                        'Connecting causal inference to missing data problems',
                        'Providing a framework for observational studies beyond experiments',
                        'Proving that all causal effects can be estimated without assumptions'
                    ],
                    correct: 3,
                    explanation: 'The Rubin Causal Model explicitly acknowledges that causal inference requires assumptions (like SUTVA, unconfoundedness). It never claims assumptions are unnecessary; rather, it makes the required assumptions transparent.'
                }
            ]
        },
        // --------------------------------------------------------
        // Section 2: Causal Estimands: ATE, ATT, ATU
        // --------------------------------------------------------
        {
            id: 'ch01-sec02',
            title: 'Causal Estimands: ATE, ATT, ATU',
            content: `<h2>Causal Estimands: ATE, ATT, ATU</h2>
<p>Since individual treatment effects \\(\\tau_i\\) are unobservable, we focus on <strong>population-level summaries</strong> of treatment effects — called <strong>causal estimands</strong>.</p>

<div class="env-block definition">
<div class="env-title">Definition (Average Treatment Effect)</div>
<div class="env-body">
<p>The <strong>Average Treatment Effect</strong> (ATE) is the expected causal effect across the entire population:</p>
\\[\\text{ATE} = E[Y_i(1) - Y_i(0)] = E[Y_i(1)] - E[Y_i(0)]\\]
<p>This answers: "What is the average effect of treatment if we were to treat <em>everyone</em>?"</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (ATT and ATU)</div>
<div class="env-body">
<p>The <strong>Average Treatment Effect on the Treated</strong> (ATT):</p>
\\[\\text{ATT} = E[Y_i(1) - Y_i(0) \\mid W_i = 1]\\]
<p>The <strong>Average Treatment Effect on the Untreated</strong> (ATU):</p>
\\[\\text{ATU} = E[Y_i(1) - Y_i(0) \\mid W_i = 0]\\]
</div>
</div>

<div class="env-block proposition">
<div class="env-title">Proposition (Decomposition of ATE)</div>
<div class="env-body">
<p>The ATE decomposes as a weighted average of ATT and ATU:</p>
\\[\\text{ATE} = P(W=1) \\cdot \\text{ATT} + P(W=0) \\cdot \\text{ATU}\\]
<p>If treatment effects are <strong>homogeneous</strong> (\\(\\tau_i = \\tau\\) for all \\(i\\)), then ATE = ATT = ATU = \\(\\tau\\).</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Selection Bias Decomposition</div>
<div class="env-body">
<p>The naive comparison of group means is <strong>not</strong> the ATE in general:</p>
\\[\\underbrace{E[Y_i \\mid W_i = 1] - E[Y_i \\mid W_i = 0]}_{\\text{Naive difference}} = \\underbrace{\\text{ATT}}_{\\text{Causal effect}} + \\underbrace{E[Y_i(0) \\mid W_i = 1] - E[Y_i(0) \\mid W_i = 0]}_{\\text{Selection Bias}}\\]
<p>The <strong>selection bias</strong> term captures systematic differences between the treated and control groups in their baseline potential outcomes. Only when selection bias is zero does the naive comparison recover the ATT.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-ate-att-comparison"></div>

<div class="env-block example">
<div class="env-title">Example (Job Training Program)</div>
<div class="env-body">
<p>Consider a voluntary job training program. Participants (\\(W = 1\\)) may be more motivated. Their baseline earnings \\(E[Y(0) \\mid W = 1]\\) would be higher even without training. The naive earnings comparison overstates the ATT because selection bias is positive.</p>
<p>Conversely, if the program targets disadvantaged workers, \\(E[Y(0) \\mid W = 1] < E[Y(0) \\mid W = 0]\\), and selection bias is negative — the naive comparison may understate the causal effect.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch01-viz-ate-att-comparison',
                    title: 'ATE vs ATT with Treatment Effect Heterogeneity',
                    description: 'Visualize how ATE and ATT differ depending on treatment effect heterogeneity and selection',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 40, originX: 80, originY: 380});
                        var heterogeneity = 0.5;
                        var selectionBias = 1.0;
                        var N = 200;

                        function seededRandom(s) {
                            var x = Math.sin(s) * 10000;
                            return x - Math.floor(x);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('ATE vs ATT: Treatment Effect Heterogeneity & Selection', viz.width / 2, 18, viz.colors.white, 13);

                            // Generate population
                            var treated = [];
                            var control = [];
                            var allTaus = [];

                            for (var i = 0; i < N; i++) {
                                var u = seededRandom(i * 7 + 1);
                                var x = -2 + 4 * u;
                                var y0 = 2 + 0.5 * x + (seededRandom(i * 13 + 3) - 0.5);
                                var tau = 1.5 + heterogeneity * x;
                                var y1 = y0 + tau;
                                var pTreat = 1 / (1 + Math.exp(-(selectionBias * x)));
                                var w = seededRandom(i * 19 + 5) < pTreat ? 1 : 0;

                                allTaus.push(tau);
                                if (w === 1) {
                                    treated.push({x: x, y0: y0, y1: y1, tau: tau});
                                } else {
                                    control.push({x: x, y0: y0, y1: y1, tau: tau});
                                }
                            }

                            // Compute estimands
                            var ate = 0;
                            for (var a = 0; a < allTaus.length; a++) ate += allTaus[a];
                            ate /= allTaus.length;

                            var att = 0;
                            for (var t = 0; t < treated.length; t++) att += treated[t].tau;
                            att = treated.length > 0 ? att / treated.length : 0;

                            var atu = 0;
                            for (var u2 = 0; u2 < control.length; u2++) atu += control[u2].tau;
                            atu = control.length > 0 ? atu / control.length : 0;

                            // Draw scatter
                            for (var ti = 0; ti < treated.length; ti++) {
                                var pt = treated[ti];
                                viz.drawPoint(pt.x, pt.tau, viz.colors.teal + '88', null, 3);
                            }
                            for (var ci = 0; ci < control.length; ci++) {
                                var pc = control[ci];
                                viz.drawPoint(pc.x, pc.tau, viz.colors.orange + '88', null, 3);
                            }

                            // Draw horizontal lines for ATE, ATT, ATU
                            var xMin = -2.5, xMax = 2.5;
                            viz.drawSegment(xMin, ate, xMax, ate, viz.colors.white, 2.5);
                            viz.drawSegment(xMin, att, xMax, att, viz.colors.teal, 2, true);
                            viz.drawSegment(xMin, atu, xMax, atu, viz.colors.orange, 2, true);

                            // Labels
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            var lx = viz.toScreen(xMax + 0.1, 0)[0];
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('ATE = ' + ate.toFixed(2), lx, viz.toScreen(0, ate)[1]);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('ATT = ' + att.toFixed(2), lx, viz.toScreen(0, att)[1]);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('ATU = ' + atu.toFixed(2), lx, viz.toScreen(0, atu)[1]);

                            // Axes labels
                            viz.screenText('Covariate X', viz.width / 2, viz.height - 8, viz.colors.text, 11);
                            ctx.save();
                            ctx.translate(15, viz.height / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Treatment Effect tau_i', 0, 0);
                            ctx.restore();

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Treated', 100, viz.height - 8);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Control', 170, viz.height - 8);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'Heterogeneity', -2, 2, heterogeneity, 0.1, function(v) {
                            heterogeneity = v;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'Selection Bias', -3, 3, selectionBias, 0.1, function(v) {
                            selectionBias = v;
                            draw();
                        });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch01-ex05',
                    type: 'multiple-choice',
                    question: 'If treatment effects are homogeneous (the same for everyone), which statement is true?',
                    options: [
                        'ATE > ATT always',
                        'ATE = ATT = ATU',
                        'ATT = 0',
                        'ATE cannot be estimated'
                    ],
                    correct: 1,
                    explanation: 'When tau_i = tau for all i, the conditional expectations E[tau | W=1] and E[tau | W=0] both equal tau. Hence ATE = ATT = ATU = tau.'
                },
                {
                    id: 'ch01-ex06',
                    type: 'multiple-choice',
                    question: 'In the selection bias decomposition, what does the term E[Y(0)|W=1] - E[Y(0)|W=0] represent?',
                    options: [
                        'The average treatment effect',
                        'The difference in treatment effects between groups',
                        'The systematic baseline difference between treated and control groups',
                        'The variance of the treatment effect'
                    ],
                    correct: 2,
                    explanation: 'This term captures how the treated and control groups differ in their baseline (untreated) outcomes. If treated units would have had higher outcomes even without treatment, this bias is positive.'
                },
                {
                    id: 'ch01-ex07',
                    type: 'multiple-choice',
                    question: 'A hospital wants to evaluate a new surgery. Sicker patients are more likely to receive it. What is the likely direction of selection bias when comparing outcomes (higher = better)?',
                    options: [
                        'Positive: naive comparison overstates the surgical benefit',
                        'Negative: naive comparison understates the surgical benefit',
                        'Zero: selection bias is always zero in medical settings',
                        'Cannot be determined without more information'
                    ],
                    correct: 1,
                    explanation: 'Sicker patients receive surgery (W=1) and would have worse outcomes even without surgery: E[Y(0)|W=1] < E[Y(0)|W=0]. The selection bias is negative, so the naive comparison understates (or even reverses) the true benefit.'
                },
                {
                    id: 'ch01-ex08',
                    type: 'numeric',
                    question: 'Suppose ATE = 5, P(W=1) = 0.4, and ATT = 7. Using ATE = P(W=1)*ATT + P(W=0)*ATU, what is ATU?',
                    answer: 3.67,
                    tolerance: 0.05,
                    explanation: 'From 5 = 0.4 * 7 + 0.6 * ATU, we get 5 = 2.8 + 0.6 * ATU, so ATU = (5 - 2.8) / 0.6 = 2.2 / 0.6 = 3.67.'
                }
            ]
        },
        // --------------------------------------------------------
        // Section 3: SUTVA & Consistency
        // --------------------------------------------------------
        {
            id: 'ch01-sec03',
            title: 'SUTVA & Consistency',
            content: `<h2>SUTVA & Consistency</h2>
<p>The potential outcomes framework rests on a critical assumption called <strong>SUTVA</strong> — the Stable Unit Treatment Value Assumption. Without it, potential outcomes are not even well-defined.</p>

<div class="env-block definition">
<div class="env-title">Definition (SUTVA)</div>
<div class="env-body">
<p>The <strong>Stable Unit Treatment Value Assumption</strong> (Rubin, 1980) has two components:</p>
<ol>
<li><strong>No interference</strong>: The potential outcomes for unit \\(i\\) depend only on unit \\(i\\)'s own treatment assignment, not on the treatment assignments of other units:
\\[Y_i(W_1, \\ldots, W_N) = Y_i(W_i)\\]</li>
<li><strong>No hidden versions of treatment</strong>: There is only one version of each treatment level. If \\(W_i = W_j = 1\\), then both units receive the same treatment.</li>
</ol>
</div>
</div>

<div class="env-block warning">
<div class="env-title">SUTVA Violations</div>
<div class="env-body">
<p><strong>Interference (spillover) examples</strong>:</p>
<ul>
<li><strong>Vaccines</strong>: If your neighbor is vaccinated, your infection risk drops even without vaccination (herd immunity). \\(Y_i(0)\\) depends on how many others are vaccinated.</li>
<li><strong>Classroom interventions</strong>: Tutoring one student may help their study group.</li>
<li><strong>General equilibrium</strong>: A job training program that trains many workers may depress wages for all workers in that field.</li>
</ul>
<p><strong>Multiple treatment versions</strong>:</p>
<ul>
<li>A "drug" can be taken at different dosages, different times, or from different manufacturers.</li>
<li>A "college degree" can come from vastly different institutions.</li>
</ul>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Consistency)</div>
<div class="env-body">
<p>The <strong>consistency assumption</strong> ties potential outcomes to observed data:</p>
\\[W_i = w \\implies Y_i^{\\text{obs}} = Y_i(w)\\]
<p>In words: the observed outcome for a unit assigned to treatment \\(w\\) is exactly the potential outcome under that treatment. This follows from SUTVA but is sometimes stated separately.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-interference-network"></div>

<div class="env-block example">
<div class="env-title">Example (Vaccine Trial)</div>
<div class="env-body">
<p>In a village of 100 people, suppose 80 are vaccinated. Person \\(i\\) is not vaccinated (\\(W_i = 0\\)). Under SUTVA, \\(Y_i(0)\\) should not depend on how many neighbors are vaccinated. But in reality, herd immunity means \\(Y_i(0)\\) when 80 are vaccinated differs from \\(Y_i(0)\\) when 10 are vaccinated. SUTVA is violated.</p>
<p>To handle this, we can redefine potential outcomes to condition on the full treatment vector: \\(Y_i(W_i, \\mathbf{W}_{-i})\\). But this explosion of potential outcomes (\\(2^{N}\\) for each unit) requires structural restrictions to be tractable.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch01-viz-interference-network',
                    title: 'Interference Between Units',
                    description: 'Network showing how treatment on one unit can affect outcomes of connected units',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 1, originX: 0, originY: 0});
                        var nNodes = 12;
                        var spilloverStrength = 0.5;

                        // Fixed positions in a circle-ish layout
                        var positions = [];
                        for (var i = 0; i < nNodes; i++) {
                            var angle = 2 * Math.PI * i / nNodes - Math.PI / 2;
                            var r = 150;
                            positions.push({
                                x: 350 + r * Math.cos(angle),
                                y: 220 + r * Math.sin(angle)
                            });
                        }

                        // Edges (connections)
                        var edges = [];
                        for (var e = 0; e < nNodes; e++) {
                            edges.push([e, (e + 1) % nNodes]);
                            if (e % 3 === 0) edges.push([e, (e + 3) % nNodes]);
                        }

                        var treatments = [];
                        for (var t = 0; t < nNodes; t++) treatments.push(0);
                        treatments[0] = 1;
                        treatments[3] = 1;
                        treatments[7] = 1;

                        function countTreatedNeighbors(node) {
                            var count = 0;
                            for (var ei = 0; ei < edges.length; ei++) {
                                if (edges[ei][0] === node && treatments[edges[ei][1]] === 1) count++;
                                if (edges[ei][1] === node && treatments[edges[ei][0]] === 1) count++;
                            }
                            return count;
                        }

                        function draw() {
                            var ctx = viz.ctx;
                            viz.clear();

                            viz.screenText('Interference Network: SUTVA Violations', viz.width / 2, 20, viz.colors.white, 14, 'center', 'middle');

                            // Draw edges
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 1.5;
                            for (var ei = 0; ei < edges.length; ei++) {
                                var a = positions[edges[ei][0]];
                                var b = positions[edges[ei][1]];
                                ctx.beginPath();
                                ctx.moveTo(a.x, a.y);
                                ctx.lineTo(b.x, b.y);
                                ctx.stroke();
                            }

                            // Draw spillover halos
                            for (var ni = 0; ni < nNodes; ni++) {
                                var p = positions[ni];
                                var treatedNeighbors = countTreatedNeighbors(ni);
                                if (treatments[ni] === 0 && treatedNeighbors > 0) {
                                    var intensity = Math.min(treatedNeighbors * spilloverStrength * 0.15, 0.5);
                                    ctx.fillStyle = viz.colors.purple + Math.round(intensity * 255).toString(16).padStart(2, '0');
                                    ctx.beginPath();
                                    ctx.arc(p.x, p.y, 28 + treatedNeighbors * 5, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Draw nodes
                            for (var ni2 = 0; ni2 < nNodes; ni2++) {
                                var p2 = positions[ni2];
                                var color = treatments[ni2] === 1 ? viz.colors.teal : viz.colors.orange;
                                var tn = countTreatedNeighbors(ni2);

                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.arc(p2.x, p2.y, 18, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.fillStyle = '#ffffff';
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('i=' + (ni2 + 1), p2.x, p2.y - 2);

                                // Show spillover info
                                if (treatments[ni2] === 0 && tn > 0 && spilloverStrength > 0) {
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.fillStyle = viz.colors.purple;
                                    ctx.fillText('spill:' + tn, p2.x, p2.y + 30);
                                }
                            }

                            // Info panel
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Treated (W=1)', 20, viz.height - 50);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Control (W=0)', 20, viz.height - 35);
                            ctx.fillStyle = viz.colors.purple;
                            ctx.fillText('Purple halo = spillover from treated neighbors', 20, viz.height - 20);

                            // SUTVA status
                            ctx.textAlign = 'right';
                            if (spilloverStrength > 0) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.fillText('SUTVA VIOLATED: Y_i(0) depends on neighbors\' treatment', viz.width - 20, viz.height - 20);
                            } else {
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('SUTVA holds: no interference between units', viz.width - 20, viz.height - 20);
                            }
                        }

                        draw();

                        VizEngine.createSlider(controls, 'Spillover Strength', 0, 1, spilloverStrength, 0.1, function(v) {
                            spilloverStrength = v;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Toggle Unit Treatment', function() {
                            // Cycle through toggling each unit
                            var found = false;
                            for (var i = 0; i < nNodes; i++) {
                                if (treatments[i] === 0) {
                                    treatments[i] = 1;
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                for (var j = 0; j < nNodes; j++) treatments[j] = 0;
                                treatments[0] = 1;
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            for (var i = 0; i < nNodes; i++) treatments[i] = 0;
                            treatments[0] = 1;
                            treatments[3] = 1;
                            treatments[7] = 1;
                            draw();
                        });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch01-ex09',
                    type: 'multiple-choice',
                    question: 'Which of the following is a component of SUTVA?',
                    options: [
                        'Treatment effects must be positive',
                        'No interference between units',
                        'Random assignment of treatment',
                        'Normality of outcomes'
                    ],
                    correct: 1,
                    explanation: 'SUTVA has two components: (1) no interference between units, and (2) no hidden versions of treatment. Random assignment is a separate assumption (related to identification), not part of SUTVA.'
                },
                {
                    id: 'ch01-ex10',
                    type: 'multiple-choice',
                    question: 'Which scenario most clearly violates SUTVA?',
                    options: [
                        'A drug trial where pills are identical across patients',
                        'A social media experiment where treated users share content with control users',
                        'A randomized experiment with perfect compliance',
                        'An observational study with large sample size'
                    ],
                    correct: 1,
                    explanation: 'When treated users share content with control users, the control users\' outcomes depend on others\' treatment assignments. This is interference (spillover), violating the no-interference component of SUTVA.'
                },
                {
                    id: 'ch01-ex11',
                    type: 'multiple-choice',
                    question: 'The consistency assumption states that:',
                    options: [
                        'Treatment effects are constant across individuals',
                        'If W_i = w, then the observed outcome equals Y_i(w)',
                        'Potential outcomes must have finite variance',
                        'The treatment assignment mechanism is known'
                    ],
                    correct: 1,
                    explanation: 'Consistency says that the observed outcome for a unit assigned treatment w is exactly the potential outcome under w: W_i = w implies Y_i(obs) = Y_i(w). This connects the abstract potential outcomes to observable data.'
                },
                {
                    id: 'ch01-ex12',
                    type: 'multiple-choice',
                    question: 'Without SUTVA, how many potential outcomes does each unit have in a study with N units and binary treatment?',
                    options: [
                        '2 (one per treatment level)',
                        'N (one per other unit)',
                        '2^N (one per possible treatment vector)',
                        'N^2'
                    ],
                    correct: 2,
                    explanation: 'Without SUTVA, unit i\'s outcome can depend on the full treatment vector (W_1, ..., W_N). With binary treatment and N units, there are 2^N possible treatment vectors, so unit i has 2^N potential outcomes — making inference intractable without structural restrictions.'
                }
            ]
        },
        // --------------------------------------------------------
        // Section 4: Assignment Mechanisms
        // --------------------------------------------------------
        {
            id: 'ch01-sec04',
            title: 'Assignment Mechanisms',
            content: `<h2>Assignment Mechanisms</h2>
<p>The <strong>assignment mechanism</strong> describes the process by which units are assigned to treatment or control. It is the key to identification of causal effects.</p>

<div class="env-block definition">
<div class="env-title">Definition (Assignment Mechanism)</div>
<div class="env-body">
<p>An <strong>assignment mechanism</strong> is a function that maps covariates and potential outcomes to a probability of treatment:</p>
\\[P(W_i = 1 \\mid \\mathbf{X}, \\mathbf{Y}(0), \\mathbf{Y}(1))\\]
<p>Different restrictions on this function define different study designs.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Randomized Experiment)</div>
<div class="env-body">
<p>In a <strong>completely randomized experiment</strong>, treatment is assigned independently of potential outcomes:</p>
\\[(Y_i(1), Y_i(0)) \\perp\\!\\!\\!\\perp W_i\\]
<p>This ensures that \\(E[Y(0) \\mid W = 1] = E[Y(0) \\mid W = 0]\\), eliminating selection bias. The naive difference in means is an unbiased estimator of the ATE.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Strong Ignorability / Unconfoundedness)</div>
<div class="env-body">
<p>In observational studies, we assume <strong>unconfoundedness</strong> (Rosenbaum & Rubin, 1983): conditional on observed covariates \\(\\mathbf{X}\\), treatment is independent of potential outcomes:</p>
\\[(Y_i(1), Y_i(0)) \\perp\\!\\!\\!\\perp W_i \\mid X_i\\]
<p>This is also called <strong>conditional independence</strong>, <strong>selection on observables</strong>, or <strong>ignorability</strong>. Combined with the overlap condition, it is called <strong>strong ignorability</strong>.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Propensity Score)</div>
<div class="env-body">
<p>The <strong>propensity score</strong> (Rosenbaum & Rubin, 1983) is the probability of treatment conditional on covariates:</p>
\\[e(x) = P(W_i = 1 \\mid X_i = x)\\]
<p><strong>Key theorem</strong>: If unconfoundedness holds given \\(X\\), then it also holds given \\(e(X)\\) alone:</p>
\\[(Y(1), Y(0)) \\perp\\!\\!\\!\\perp W \\mid X \\implies (Y(1), Y(0)) \\perp\\!\\!\\!\\perp W \\mid e(X)\\]
<p>This dimensionality reduction is the foundation of propensity score methods.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-assignment-mechanism"></div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body">
<p>Unconfoundedness is <strong>untestable</strong>: we can never verify from data alone that there are no unobserved confounders. Domain knowledge and careful study design are essential to argue for its plausibility. This is a core tension in observational causal inference.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch01-viz-assignment-mechanism',
                    title: 'Random vs Confounded Assignment',
                    description: 'Compare covariate distributions under random assignment versus confounded (observational) assignment',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 50, originX: 100, originY: 350});
                        var confounding = 0;
                        var N = 300;

                        function seededRandom(s) {
                            var x = Math.sin(s) * 10000;
                            return x - Math.floor(x);
                        }

                        function boxMuller(s1, s2) {
                            var u1 = seededRandom(s1);
                            var u2 = seededRandom(s2);
                            if (u1 === 0) u1 = 0.001;
                            return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var title = confounding === 0 ? 'Random Assignment: X balanced across groups' : 'Confounded Assignment: X predicts treatment';
                            viz.screenText(title, viz.width / 2, 18, viz.colors.white, 13);

                            var treated = [];
                            var control = [];

                            for (var i = 0; i < N; i++) {
                                var x = boxMuller(i * 7 + 1, i * 11 + 3);
                                x = Math.max(-3, Math.min(3, x));
                                var pTreat = 1 / (1 + Math.exp(-confounding * x));
                                var w = seededRandom(i * 19 + 100) < pTreat ? 1 : 0;

                                if (w === 1) treated.push(x);
                                else control.push(x);
                            }

                            // Draw histograms
                            var bins = 20;
                            var binW = 6 / bins;
                            var treatedHist = new Array(bins).fill(0);
                            var controlHist = new Array(bins).fill(0);

                            for (var ti = 0; ti < treated.length; ti++) {
                                var bi = Math.floor((treated[ti] + 3) / binW);
                                if (bi >= 0 && bi < bins) treatedHist[bi]++;
                            }
                            for (var ci = 0; ci < control.length; ci++) {
                                var bj = Math.floor((control[ci] + 3) / binW);
                                if (bj >= 0 && bj < bins) controlHist[bj]++;
                            }

                            // Normalize
                            var maxCount = 1;
                            for (var b = 0; b < bins; b++) {
                                if (treatedHist[b] > maxCount) maxCount = treatedHist[b];
                                if (controlHist[b] > maxCount) maxCount = controlHist[b];
                            }

                            var barScale = 5 / maxCount;

                            // Draw bars
                            for (var b2 = 0; b2 < bins; b2++) {
                                var xLeft = -3 + b2 * binW;
                                // Treated bars (upper)
                                var hT = treatedHist[b2] * barScale;
                                if (hT > 0) {
                                    viz.drawBar(xLeft, binW * 0.45, hT, viz.colors.teal + '88', viz.colors.teal, 1);
                                }
                                // Control bars (slightly offset)
                                var hC = controlHist[b2] * barScale;
                                if (hC > 0) {
                                    viz.drawBar(xLeft + binW * 0.45, binW * 0.45, hC, viz.colors.orange + '88', viz.colors.orange, 1);
                                }
                            }

                            // Means
                            var treatedMean = 0;
                            for (var tm = 0; tm < treated.length; tm++) treatedMean += treated[tm];
                            treatedMean = treated.length > 0 ? treatedMean / treated.length : 0;

                            var controlMean = 0;
                            for (var cm = 0; cm < control.length; cm++) controlMean += control[cm];
                            controlMean = control.length > 0 ? controlMean / control.length : 0;

                            // Draw mean lines
                            viz.drawSegment(treatedMean, 0, treatedMean, 5.5, viz.colors.teal, 2, true);
                            viz.drawSegment(controlMean, 0, controlMean, 5.5, viz.colors.orange, 2, true);

                            // Labels
                            viz.screenText('Covariate X', viz.width / 2, viz.height - 8, viz.colors.text, 11);

                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Treated (n=' + treated.length + ', mean=' + treatedMean.toFixed(2) + ')', 20, 50);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Control (n=' + control.length + ', mean=' + controlMean.toFixed(2) + ')', 20, 65);

                            if (confounding !== 0) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.textAlign = 'right';
                                ctx.fillText('Selection bias: groups differ on X!', viz.width - 20, 55);
                            } else {
                                ctx.fillStyle = viz.colors.green;
                                ctx.textAlign = 'right';
                                ctx.fillText('No selection bias: groups balanced on X', viz.width - 20, 55);
                            }
                        }

                        draw();

                        VizEngine.createSlider(controls, 'Confounding Strength', 0, 3, confounding, 0.1, function(v) {
                            confounding = v;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Randomize Again', function() {
                            N = 300;
                            draw();
                        });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch01-ex13',
                    type: 'multiple-choice',
                    question: 'Under a completely randomized experiment, why does the naive difference in means identify the ATE?',
                    options: [
                        'Because the sample size is infinite',
                        'Because randomization ensures (Y(1),Y(0)) is independent of W, eliminating selection bias',
                        'Because treatment effects are always constant',
                        'Because potential outcomes are normally distributed'
                    ],
                    correct: 1,
                    explanation: 'Random assignment ensures independence: (Y(1),Y(0)) independent of W. This means E[Y(0)|W=1] = E[Y(0)|W=0], so the selection bias term in the decomposition is zero, and the naive difference equals the ATT = ATE.'
                },
                {
                    id: 'ch01-ex14',
                    type: 'multiple-choice',
                    question: 'The propensity score e(x) = P(W=1|X=x) is useful because:',
                    options: [
                        'It eliminates all confounding automatically',
                        'It reduces the dimensionality of conditioning: unconfoundedness given X implies unconfoundedness given e(X)',
                        'It guarantees SUTVA holds',
                        'It makes treatment effects homogeneous'
                    ],
                    correct: 1,
                    explanation: 'The key theorem of Rosenbaum & Rubin (1983) shows that if (Y(1),Y(0)) is independent of W given X, then it is also independent of W given e(X) alone. This reduces a potentially high-dimensional conditioning problem to a scalar.'
                },
                {
                    id: 'ch01-ex15',
                    type: 'multiple-choice',
                    question: 'Why is unconfoundedness (selection on observables) untestable?',
                    options: [
                        'Because it involves unobserved confounders, which by definition cannot be verified from data',
                        'Because it requires infinite data to test',
                        'Because the propensity score is never exactly known',
                        'Because all statistical tests require normality'
                    ],
                    correct: 0,
                    explanation: 'Unconfoundedness asserts that no unobserved variable confounds the treatment-outcome relationship. Since we cannot observe unobserved variables, we can never confirm from data that they do not exist. This assumption must be justified by domain knowledge and study design.'
                }
            ]
        },
        // --------------------------------------------------------
        // Section 5: Estimation Under Unconfoundedness
        // --------------------------------------------------------
        {
            id: 'ch01-sec05',
            title: 'Estimation Under Unconfoundedness',
            content: `<h2>Estimation Under Unconfoundedness</h2>
<p>Given unconfoundedness and SUTVA, several estimation strategies can identify and estimate causal effects. Each embeds different modeling assumptions and has different robustness properties.</p>

<div class="env-block definition">
<div class="env-title">Definition (Overlap / Positivity)</div>
<div class="env-body">
<p>The <strong>overlap condition</strong> (also called <strong>positivity</strong> or <strong>common support</strong>) requires that for all values of covariates in the population:</p>
\\[0 < e(x) < 1 \\quad \\text{for all } x \\text{ in the support of } X\\]
<p>Without overlap, there exist covariate strata where we observe only treated (or only control) units, making causal comparisons impossible in those strata.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Estimator 1: Regression Adjustment</div>
<div class="env-body">
<p>Model the conditional expectation of the outcome given treatment and covariates:</p>
\\[\\hat{\\text{ATE}} = \\frac{1}{N} \\sum_{i=1}^N \\left[\\hat{\\mu}_1(X_i) - \\hat{\\mu}_0(X_i)\\right]\\]
<p>where \\(\\hat{\\mu}_w(x) = \\hat{E}[Y \\mid W = w, X = x]\\). This relies on correctly specifying the outcome model.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Estimator 2: Matching</div>
<div class="env-body">
<p>For each treated unit, find the closest control unit(s) in covariate space and impute the missing potential outcome:</p>
\\[\\hat{\\tau}_i = Y_i - Y_{j(i)} \\quad \\text{where } j(i) = \\arg\\min_{j: W_j = 0} \\|X_i - X_j\\|\\]
<p>Matching is intuitive and nonparametric, but suffers from the curse of dimensionality when \\(X\\) is high-dimensional.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Estimator 3: Inverse Probability Weighting (IPW)</div>
<div class="env-body">
<p>The <strong>Horvitz-Thompson estimator</strong> reweights observations by the inverse propensity score:</p>
\\[\\hat{\\text{ATE}}_{\\text{IPW}} = \\frac{1}{N} \\sum_{i=1}^N \\left[\\frac{W_i Y_i}{e(X_i)} - \\frac{(1 - W_i) Y_i}{1 - e(X_i)}\\right]\\]
<p>This relies on correctly specifying the propensity score model. It creates a <strong>pseudo-population</strong> where treatment is independent of covariates.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Estimator 4: Doubly Robust (AIPW)</div>
<div class="env-body">
<p>The <strong>Augmented IPW</strong> estimator combines regression and IPW, and is consistent if <em>either</em> the outcome model or the propensity score model is correctly specified:</p>
\\[\\hat{\\text{ATE}}_{\\text{DR}} = \\frac{1}{N} \\sum_{i=1}^N \\left[\\hat{\\mu}_1(X_i) - \\hat{\\mu}_0(X_i) + \\frac{W_i(Y_i - \\hat{\\mu}_1(X_i))}{e(X_i)} - \\frac{(1-W_i)(Y_i - \\hat{\\mu}_0(X_i))}{1-e(X_i)}\\right]\\]
<p>This "double robustness" property makes AIPW the gold standard in modern causal inference.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-overlap-propensity"></div>

<div class="env-block warning">
<div class="env-title">Practical Warning: Overlap Violations</div>
<div class="env-body">
<p>When \\(e(x)\\) is close to 0 or 1, IPW weights become extreme (\\(1/e(x) \\to \\infty\\)), leading to highly variable estimates. In practice:</p>
<ul>
<li><strong>Trimming</strong>: Discard units with extreme propensity scores (e.g., \\(e(x) < 0.1\\) or \\(e(x) > 0.9\\))</li>
<li><strong>Truncation</strong>: Cap weights at some maximum value</li>
<li><strong>Normalized weights</strong> (Hajek estimator): Divide by sum of weights</li>
</ul>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch01-viz-overlap-propensity',
                    title: 'Propensity Score Overlap',
                    description: 'Visualize the distribution of propensity scores for treated and control groups and the overlap region',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 60, originX: 60, originY: 340});
                        var separation = 1.0;
                        var spread = 0.8;
                        var N = 500;

                        function seededRandom(s) {
                            var x = Math.sin(s) * 10000;
                            return x - Math.floor(x);
                        }

                        function boxMuller(s1, s2) {
                            var u1 = seededRandom(s1);
                            var u2 = seededRandom(s2);
                            if (u1 === 0) u1 = 0.001;
                            return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Propensity Score Distributions: Overlap Condition', viz.width / 2, 18, viz.colors.white, 13);

                            // Generate propensity scores
                            var treatedScores = [];
                            var controlScores = [];

                            for (var i = 0; i < N; i++) {
                                var x = boxMuller(i * 7 + 1, i * 11 + 3);
                                var logit = separation * x;
                                var ps = 1 / (1 + Math.exp(-logit));
                                ps = Math.max(0.001, Math.min(0.999, ps));
                                var noise = boxMuller(i * 13 + 5, i * 17 + 7) * spread * 0.1;
                                ps = Math.max(0.001, Math.min(0.999, ps + noise));
                                var w = seededRandom(i * 19 + 100) < ps ? 1 : 0;
                                if (w === 1) treatedScores.push(ps);
                                else controlScores.push(ps);
                            }

                            // Build histograms on [0,1]
                            var bins = 30;
                            var binW = 1 / bins;
                            var treatedHist = new Array(bins).fill(0);
                            var controlHist = new Array(bins).fill(0);

                            for (var ti = 0; ti < treatedScores.length; ti++) {
                                var bi = Math.min(Math.floor(treatedScores[ti] / binW), bins - 1);
                                treatedHist[bi]++;
                            }
                            for (var ci = 0; ci < controlScores.length; ci++) {
                                var bj = Math.min(Math.floor(controlScores[ci] / binW), bins - 1);
                                controlHist[bj]++;
                            }

                            // Normalize to density
                            var maxDensity = 1;
                            for (var b = 0; b < bins; b++) {
                                var dT = treatedScores.length > 0 ? treatedHist[b] / (treatedScores.length * binW) : 0;
                                var dC = controlScores.length > 0 ? controlHist[b] / (controlScores.length * binW) : 0;
                                if (dT > maxDensity) maxDensity = dT;
                                if (dC > maxDensity) maxDensity = dC;
                            }

                            var yScale = 4.5 / maxDensity;

                            // Draw overlap region
                            var overlapMin = 1, overlapMax = 0;
                            for (var b2 = 0; b2 < bins; b2++) {
                                if (treatedHist[b2] > 0 && controlHist[b2] > 0) {
                                    var xLeft = b2 * binW;
                                    var xRight = (b2 + 1) * binW;
                                    if (xLeft < overlapMin) overlapMin = xLeft;
                                    if (xRight > overlapMax) overlapMax = xRight;
                                }
                            }

                            if (overlapMax > overlapMin) {
                                var sx1 = viz.toScreen(overlapMin * 10, 0)[0];
                                var sx2 = viz.toScreen(overlapMax * 10, 0)[0];
                                ctx.fillStyle = viz.colors.green + '15';
                                ctx.fillRect(sx1, 30, sx2 - sx1, viz.height - 60);
                            }

                            // Draw histograms
                            for (var b3 = 0; b3 < bins; b3++) {
                                var xPos = b3 * binW * 10; // scale to [0, 10] math coords
                                var wBar = binW * 10;

                                // Treated (positive direction)
                                var hT = (treatedScores.length > 0 ? treatedHist[b3] / (treatedScores.length * binW) : 0) * yScale;
                                if (hT > 0) {
                                    viz.drawBar(xPos, wBar * 0.9, hT, viz.colors.teal + '66', viz.colors.teal, 1);
                                }

                                // Control (same direction, slightly offset)
                                var hC = (controlScores.length > 0 ? controlHist[b3] / (controlScores.length * binW) : 0) * yScale;
                                if (hC > 0) {
                                    viz.drawBar(xPos + wBar * 0.05, wBar * 0.9, -hC * 0.7, viz.colors.orange + '66', viz.colors.orange, 1);
                                }
                            }

                            // Draw zero line
                            viz.drawSegment(0, 0, 10, 0, viz.colors.axis, 1);

                            // X-axis labels
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.text;
                            for (var xl = 0; xl <= 10; xl += 2) {
                                var sxl = viz.toScreen(xl, 0)[0];
                                ctx.fillText((xl / 10).toFixed(1), sxl, viz.toScreen(0, 0)[1] + 15);
                            }

                            viz.screenText('Propensity Score e(x)', viz.width / 2, viz.height - 8, viz.colors.text, 11);

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Treated (above axis)', 20, 50);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Control (below axis)', 20, 65);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('Overlap region', 20, 80);

                            // Overlap assessment
                            ctx.textAlign = 'right';
                            var overlapFrac = (overlapMax - overlapMin);
                            if (overlapFrac > 0.6) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('Good overlap: estimands well-identified', viz.width - 20, 55);
                            } else if (overlapFrac > 0.3) {
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.fillText('Limited overlap: estimates may be imprecise', viz.width - 20, 55);
                            } else {
                                ctx.fillStyle = viz.colors.red;
                                ctx.fillText('Poor overlap: positivity violated!', viz.width - 20, 55);
                            }
                        }

                        draw();

                        VizEngine.createSlider(controls, 'Separation', 0, 4, separation, 0.1, function(v) {
                            separation = v;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'Noise', 0.1, 2, spread, 0.1, function(v) {
                            spread = v;
                            draw();
                        });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch01-ex16',
                    type: 'multiple-choice',
                    question: 'What does the overlap (positivity) condition 0 < e(x) < 1 ensure?',
                    options: [
                        'That the sample size is large enough',
                        'That for every covariate value, both treatment and control are possible',
                        'That treatment effects are positive',
                        'That SUTVA holds'
                    ],
                    correct: 1,
                    explanation: 'Overlap ensures that at every point in the covariate space, there is a positive probability of being treated and a positive probability of being control. Without this, we cannot make causal comparisons for units in those regions.'
                },
                {
                    id: 'ch01-ex17',
                    type: 'multiple-choice',
                    question: 'Why is the AIPW (doubly robust) estimator preferred over pure IPW or pure regression?',
                    options: [
                        'It always has the smallest variance',
                        'It is consistent if either the outcome model or the propensity score model is correct',
                        'It does not require the overlap condition',
                        'It works even when SUTVA is violated'
                    ],
                    correct: 1,
                    explanation: 'The AIPW estimator has the "double robustness" property: it is consistent if either the outcome model or the propensity score model is correctly specified (but not necessarily both). This provides an extra layer of protection against model misspecification.'
                },
                {
                    id: 'ch01-ex18',
                    type: 'multiple-choice',
                    question: 'When e(x) is very close to 0 for some units, what happens to the IPW estimator?',
                    options: [
                        'It becomes more efficient',
                        'It becomes biased toward zero',
                        'The weights 1/e(x) become extremely large, causing high variance',
                        'It automatically corrects for selection bias'
                    ],
                    correct: 2,
                    explanation: 'When e(x) approaches 0, the weight 1/e(x) approaches infinity, giving a single observation enormous influence. This leads to highly variable (unstable) estimates. Practical remedies include weight trimming or truncation.'
                },
                {
                    id: 'ch01-ex19',
                    type: 'multiple-choice',
                    question: 'The matching estimator imputes the missing potential outcome by finding similar units in the other treatment group. What is its main weakness?',
                    options: [
                        'It cannot handle binary treatments',
                        'It requires parametric assumptions',
                        'It suffers from the curse of dimensionality when X is high-dimensional',
                        'It only works with randomized experiments'
                    ],
                    correct: 2,
                    explanation: 'In high dimensions, "nearest neighbors" become very far apart (curse of dimensionality), so matched pairs may not be similar at all. The matching estimator is most effective when the covariate space is low-dimensional or when matching on the propensity score.'
                }
            ]
        }
    ]
});
