window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch08',
    number: 8,
    title: 'Selection Bias & Confounding',
    subtitle: 'Understanding and Addressing Systematic Differences',
    sections: [
        // ================================================================
        // SECTION 1: Sources of Selection Bias
        // ================================================================
        {
            id: 'ch08-sec01',
            title: 'Sources of Selection Bias',
            content: `
                <h2>Sources of Selection Bias</h2>

                <p>Selection bias arises whenever the process by which units enter a study (or a dataset) is systematically related to the potential outcomes. Unlike random measurement error, selection bias produces <strong>systematic</strong> distortions that do not vanish with larger samples. Understanding the taxonomy of selection bias is the first step toward credible causal inference in observational studies.</p>

                <h3>Self-Selection Bias</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.1 (Self-Selection Bias)</div>
                    <div class="env-body">
                        <p>Self-selection bias occurs when individuals choose their own treatment status based on characteristics that also affect the outcome. Formally, if \\(D_i\\) denotes treatment and \\(Y_i(0), Y_i(1)\\) are potential outcomes, self-selection means</p>
                        \\[\\mathbb{E}[Y_i(0) \\mid D_i = 1] \\neq \\mathbb{E}[Y_i(0) \\mid D_i = 0].\\]
                        <p>The naive comparison \\(\\mathbb{E}[Y_i \\mid D_i = 1] - \\mathbb{E}[Y_i \\mid D_i = 0]\\) then captures both the treatment effect and the selection bias:</p>
                        \\[\\underbrace{\\mathbb{E}[Y_i(1) \\mid D_i=1] - \\mathbb{E}[Y_i(0) \\mid D_i=0]}_{\\text{Observed difference}} = \\underbrace{\\mathbb{E}[Y_i(1) - Y_i(0) \\mid D_i=1]}_{\\text{ATT}} + \\underbrace{\\mathbb{E}[Y_i(0) \\mid D_i=1] - \\mathbb{E}[Y_i(0) \\mid D_i=0]}_{\\text{Selection bias}}.\\]
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 8.2 (Returns to Education)</div>
                    <div class="env-body">
                        <p>Individuals who attend college may have higher innate ability, motivation, and family resources. Even without college, they would earn more than those who did not attend. The naive earnings gap between college and non-college workers overstates the causal effect of education because it includes positive selection bias: \\(\\mathbb{E}[Y_i(0) \\mid \\text{College}] > \\mathbb{E}[Y_i(0) \\mid \\text{No college}]\\).</p>
                    </div>
                </div>

                <h3>Sample Selection Bias</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.3 (Sample Selection Bias)</div>
                    <div class="env-body">
                        <p>Sample selection bias arises when the sample under study is not representative of the target population because inclusion in the sample depends on the outcome or on variables affected by treatment. This is formalized as \\(S_i \\not\\perp Y_i \\mid D_i\\) where \\(S_i\\) indicates sample inclusion.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 8.4 (Wage Equations)</div>
                    <div class="env-body">
                        <p>Heckman (1979) noted that wage regressions using only employed workers suffer from sample selection: employment status depends on the reservation wage, which correlates with unobserved ability. Women with low market wages may exit the labor force, so observed female wages overstate the population average, biasing gender wage gap estimates.</p>
                    </div>
                </div>

                <h3>Survivorship Bias</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.5 (Survivorship Bias)</div>
                    <div class="env-body">
                        <p>Survivorship bias is a form of sample selection where only units that "survive" a selection process are observed. The missing failures lead to systematically distorted inferences about what drives success.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 8.6 (WWII Aircraft Armor)</div>
                    <div class="env-body">
                        <p>Abraham Wald's famous analysis: the military observed bullet holes on returning aircraft and planned to armor those areas. Wald recognized that the planes that did not return were hit in the areas <em>without</em> holes on survivors. The correct inference was to armor the areas where survivors had <em>no</em> damage, because planes hit there did not survive to be observed.</p>
                    </div>
                </div>

                <h3>Collider Bias (Berkson's Paradox)</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.7 (Collider Bias)</div>
                    <div class="env-body">
                        <p>Collider bias occurs when we condition on (or select based on) a common effect of two variables. If \\(X \\to C \\leftarrow Y\\), then \\(X \\perp Y\\) marginally, but \\(X \\not\\perp Y \\mid C\\). Conditioning on the collider \\(C\\) induces a spurious association between its causes.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 8.8 (Berkson's Paradox in Hospital Data)</div>
                    <div class="env-body">
                        <p>Consider two diseases \\(A\\) and \\(B\\) that are independent in the general population. Hospitalization \\(H\\) is a collider: \\(A \\to H \\leftarrow B\\) (either disease can cause hospitalization). Among hospitalized patients, \\(A\\) and \\(B\\) appear negatively correlated: if a patient does not have disease \\(A\\), they must have disease \\(B\\) (otherwise why are they in the hospital?). This spurious negative correlation is Berkson's paradox.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark (Selection on Post-Treatment Variables)</div>
                    <div class="env-body">
                        <p>More generally, any conditioning on a post-treatment variable can introduce collider bias. If treatment \\(D\\) affects both mediator \\(M\\) and outcome \\(Y\\), then conditioning on \\(M\\) opens a backdoor path through unobserved common causes of \\(M\\) and \\(Y\\). This is one reason why the "bad controls" problem is so pernicious in applied work.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-berksons-paradox"></div>
            `,
            visualizations: [
                {
                    id: 'viz-berksons-paradox',
                    title: "Berkson's Paradox: Induced Correlation in Hospital Data",
                    description: "Two independent diseases become negatively correlated when we condition on hospitalization (a collider). Adjust the disease prevalences and observe the spurious correlation among hospitalized patients.",
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: Math.min(container.clientWidth - 32, 700),
                            height: 420,
                            originX: 60,
                            originY: 380,
                            scale: 55
                        });
                        var pA = 0.15;
                        var pB = 0.10;
                        var seed = 42;

                        function mulberry32(s) {
                            return function() {
                                s |= 0; s = s + 0x6D2B79F5 | 0;
                                var t = Math.imul(s ^ s >>> 15, 1 | s);
                                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                                return ((t ^ t >>> 14) >>> 0) / 4294967296;
                            };
                        }

                        function generateData() {
                            var rng = mulberry32(seed);
                            var pop = [];
                            var N = 400;
                            for (var i = 0; i < N; i++) {
                                var hasA = rng() < pA ? 1 : 0;
                                var hasB = rng() < pB ? 1 : 0;
                                var hospProb = 0.02 + 0.7 * hasA + 0.7 * hasB;
                                var hosp = rng() < Math.min(hospProb, 1) ? 1 : 0;
                                pop.push({
                                    sevA: hasA ? 0.3 + rng() * 0.7 : rng() * 0.3,
                                    sevB: hasB ? 0.3 + rng() * 0.7 : rng() * 0.3,
                                    hasA: hasA, hasB: hasB, hosp: hosp
                                });
                            }
                            return pop;
                        }

                        function corrCoef(pts) {
                            if (pts.length < 3) return 0;
                            var n = pts.length;
                            var sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
                            for (var i = 0; i < n; i++) {
                                sx += pts[i][0]; sy += pts[i][1];
                                sxx += pts[i][0] * pts[i][0]; syy += pts[i][1] * pts[i][1];
                                sxy += pts[i][0] * pts[i][1];
                            }
                            var num = n * sxy - sx * sy;
                            var den = Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy));
                            return den < 1e-10 ? 0 : num / den;
                        }

                        function draw() {
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            var padL = 60, padR = 30, padT = 40, padB = 50;
                            var plotW = (W - padL - padR - 40) / 2;
                            var plotH = H - padT - padB;

                            var data = generateData();

                            function drawScatter(x0, title, pts, color, showCorr) {
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(x0, padT + plotH);
                                ctx.lineTo(x0 + plotW, padT + plotH);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(x0, padT);
                                ctx.lineTo(x0, padT + plotH);
                                ctx.stroke();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(title, x0 + plotW / 2, padT - 8);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('Disease A severity', x0 + plotW / 2, padT + plotH + 8);
                                ctx.save();
                                ctx.translate(x0 - 30, padT + plotH / 2);
                                ctx.rotate(-Math.PI / 2);
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('Disease B severity', 0, 0);
                                ctx.restore();

                                var coordPairs = [];
                                for (var i = 0; i < pts.length; i++) {
                                    var px = x0 + pts[i][0] * plotW;
                                    var py = padT + plotH - pts[i][1] * plotH;
                                    ctx.fillStyle = color + '88';
                                    ctx.beginPath();
                                    ctx.arc(px, py, 3, 0, Math.PI * 2);
                                    ctx.fill();
                                    coordPairs.push([pts[i][0], pts[i][1]]);
                                }

                                if (showCorr) {
                                    var r = corrCoef(coordPairs);
                                    ctx.fillStyle = Math.abs(r) > 0.05 ? viz.colors.orange : viz.colors.green;
                                    ctx.font = 'bold 12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText('r = ' + r.toFixed(3), x0 + plotW / 2, padT + plotH + 24);
                                }
                            }

                            var allPts = data.map(function(d) { return [d.sevA, d.sevB]; });
                            var hospPts = data.filter(function(d) { return d.hosp; }).map(function(d) { return [d.sevA, d.sevB]; });

                            drawScatter(padL, 'General Population', allPts, viz.colors.blue, true);
                            drawScatter(padL + plotW + 40, 'Hospitalized Only (Collider!)', hospPts, viz.colors.orange, true);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'P(Disease A)', 0.05, 0.50, pA, 0.05, function(v) { pA = v; draw(); });
                        VizEngine.createSlider(controls, 'P(Disease B)', 0.05, 0.50, pB, 0.05, function(v) { pB = v; draw(); });

                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: '<strong>Exercise 8.1.</strong> In the returns-to-education example, suppose ability \\(A_i\\) is unobserved, \\(D_i = \\mathbf{1}(A_i > c)\\) for some threshold \\(c\\), and \\(Y_i(0) = \\alpha + \\beta A_i + \\varepsilon_i\\). Derive the sign and magnitude of the selection bias \\(\\mathbb{E}[Y_i(0) \\mid D_i = 1] - \\mathbb{E}[Y_i(0) \\mid D_i = 0]\\) in terms of \\(\\beta\\) and the conditional expectations of \\(A_i\\).',
                    hint: 'Substitute \\(Y_i(0) = \\alpha + \\beta A_i + \\varepsilon_i\\) into the selection bias term and use \\(\\mathbb{E}[\\varepsilon_i \\mid D_i] = 0\\) (if ability is the only source of selection).',
                    solution: '<p>The selection bias is</p>\\[\\mathbb{E}[Y_i(0) \\mid D_i=1] - \\mathbb{E}[Y_i(0) \\mid D_i=0] = \\beta\\bigl(\\mathbb{E}[A_i \\mid A_i > c] - \\mathbb{E}[A_i \\mid A_i \\leq c]\\bigr).\\]<p>Since \\(\\mathbb{E}[A_i \\mid A_i > c] > \\mathbb{E}[A_i \\mid A_i \\leq c]\\), the sign of the bias matches the sign of \\(\\beta\\). If ability positively affects earnings (\\(\\beta > 0\\)), the selection bias is positive, and the naive difference overstates the causal effect of education.</p>'
                },
                {
                    question: '<strong>Exercise 8.2.</strong> Consider a randomized trial where treated units with bad outcomes are more likely to drop out. Let \\(S_i\\) be the indicator for remaining in the study. Show that \\(\\mathbb{E}[Y_i \\mid D_i = 1, S_i = 1] - \\mathbb{E}[Y_i \\mid D_i = 0, S_i = 1]\\) is a biased estimator of the ATE even though treatment was randomized.',
                    hint: 'Write out the DAG: \\(D \\to Y \\to S\\) (and possibly \\(D \\to S\\)). Conditioning on \\(S\\) opens a path or selects on a descendant of \\(Y\\).',
                    solution: '<p>Even with random assignment, conditioning on \\(S_i = 1\\) introduces sample selection bias. The DAG has \\(D \\to Y\\) and \\(Y \\to S\\) (bad outcomes lead to dropout). Among survivors in the treated group, we observe only those with relatively good outcomes, so \\(\\mathbb{E}[Y_i \\mid D_i=1, S_i=1] > \\mathbb{E}[Y_i(1)]\\). The control group survivors may be less selected (if dropout is mainly in the treated arm). The resulting comparison is biased upward, making the treatment appear more effective than it truly is.</p>'
                },
                {
                    question: '<strong>Exercise 8.3.</strong> (Berkson\'s paradox) Let \\(A \\sim \\text{Bernoulli}(p)\\) and \\(B \\sim \\text{Bernoulli}(q)\\) be independent. Let \\(H = \\max(A, B)\\) (hospitalized if either disease). Show that \\(\\text{Cov}(A, B \\mid H = 1) < 0\\).',
                    hint: 'Compute \\(P(A=1, B=1 \\mid H=1)\\) and \\(P(A=1 \\mid H=1) \\cdot P(B=1 \\mid H=1)\\) using Bayes\' rule. Note that \\(P(H=1) = p + q - pq\\).',
                    solution: '<p>We have \\(P(H=1) = 1 - (1-p)(1-q) = p + q - pq\\). Then:</p>\\[P(A=1 \\mid H=1) = \\frac{P(A=1, H=1)}{P(H=1)} = \\frac{p}{p+q-pq},\\]\\[P(B=1 \\mid H=1) = \\frac{q}{p+q-pq},\\]\\[P(A=1, B=1 \\mid H=1) = \\frac{pq}{p+q-pq}.\\]<p>Now \\(P(A=1 \\mid H=1) \\cdot P(B=1 \\mid H=1) = \\frac{pq}{(p+q-pq)^2}\\). Since \\(p+q-pq > 1 \\cdot 1\\) is not necessarily true, we compare directly:</p>\\[P(A=1,B=1 \\mid H=1) - P(A=1 \\mid H=1)P(B=1 \\mid H=1) = \\frac{pq}{p+q-pq}\\left(1 - \\frac{1}{p+q-pq}\\right) < 0\\]<p>since \\(p+q-pq < 1\\) when \\(p,q < 1\\). Thus \\(\\text{Cov}(A,B \\mid H=1) < 0\\).</p>'
                },
                {
                    question: '<strong>Exercise 8.4.</strong> Survivorship bias in mutual funds: suppose each year, funds with below-median returns are shut down. After 10 years, what is the expected average annual return of surviving funds relative to the true population mean? Assume returns are i.i.d. \\(N(\\mu, \\sigma^2)\\) across funds and years.',
                    hint: 'Each year, the bottom half is removed. After \\(k\\) years of selection, the surviving funds have had above-median returns in every year. Use the fact that \\(\\mathbb{E}[X \\mid X > \\text{median}] = \\mu + \\sigma \\sqrt{2/\\pi}\\) for \\(X \\sim N(\\mu, \\sigma^2)\\).',
                    solution: '<p>In each year, surviving funds had above-median returns. For a normal distribution, \\(\\mathbb{E}[X \\mid X > \\mu] = \\mu + \\sigma\\sqrt{2/\\pi}\\). The average return among survivors in any given year is biased upward by \\(\\sigma\\sqrt{2/\\pi} \\approx 0.798\\sigma\\). Over 10 years, the average of the annual returns of survivors is approximately \\(\\mu + \\sigma\\sqrt{2/\\pi}\\), because the selection operates independently each year. The survivorship bias is approximately \\(\\sigma\\sqrt{2/\\pi}\\) per year, regardless of the number of years (since returns are i.i.d.). With typical \\(\\sigma \\approx 15\\%\\), the bias is about \\(12\\%\\) per year -- a massive distortion.</p>'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Confounders vs Mediators vs Colliders
        // ================================================================
        {
            id: 'ch08-sec02',
            title: 'Confounders vs Mediators vs Colliders',
            content: `
                <h2>Confounders vs Mediators vs Colliders</h2>

                <p>A central skill in applied causal inference is correctly classifying the variables in a causal graph. The same variable can play different roles depending on the causal structure, and the correct adjustment strategy depends critically on this classification. Adjusting for the wrong type of variable can <em>introduce</em> bias rather than remove it.</p>

                <h3>The Three Archetypes</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.9 (Confounder)</div>
                    <div class="env-body">
                        <p>A variable \\(W\\) is a <strong>confounder</strong> of the effect of \\(D\\) on \\(Y\\) if it is a common cause of both: \\(D \\leftarrow W \\rightarrow Y\\). In the DAG, \\(W\\) opens a backdoor path from \\(D\\) to \\(Y\\). We must <strong>adjust for confounders</strong> to block the spurious association.</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.10 (Mediator)</div>
                    <div class="env-body">
                        <p>A variable \\(M\\) is a <strong>mediator</strong> if it lies on the causal path from \\(D\\) to \\(Y\\): \\(D \\rightarrow M \\rightarrow Y\\). Adjusting for a mediator blocks part of the causal effect, so we should <strong>not adjust for mediators</strong> when estimating the total effect.</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.11 (Collider)</div>
                    <div class="env-body">
                        <p>A variable \\(C\\) is a <strong>collider</strong> on a path if both arrows on that path point into \\(C\\): \\(D \\rightarrow C \\leftarrow Y\\). A collider <em>blocks</em> the path by default. Conditioning on \\(C\\) (or its descendants) <strong>opens</strong> the path, creating a spurious association. We should <strong>never adjust for colliders</strong>.</p>
                    </div>
                </div>

                <h3>The Adjustment Decision</h3>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 8.12 (Backdoor Adjustment Rules)</div>
                    <div class="env-body">
                        <p>To estimate the causal effect of \\(D\\) on \\(Y\\):</p>
                        <ol>
                            <li><strong>Adjust for confounders</strong>: Variables that are common causes of \\(D\\) and \\(Y\\), blocking all backdoor paths.</li>
                            <li><strong>Do not adjust for mediators</strong>: Variables on the causal pathway \\(D \\to \\cdots \\to Y\\). Adjusting removes part of the total effect.</li>
                            <li><strong>Do not adjust for colliders</strong>: Variables that are common effects. Adjusting opens blocked paths and introduces bias.</li>
                        </ol>
                        <p>This is a direct consequence of Pearl's backdoor criterion (Chapter 4).</p>
                    </div>
                </div>

                <h3>The Bad Controls Problem</h3>

                <div class="env-block example">
                    <div class="env-title">Example 8.13 (Bad Controls)</div>
                    <div class="env-body">
                        <p>Angrist and Pischke (2009) define a <strong>bad control</strong> as a variable that is itself an outcome of the treatment. Consider estimating the effect of college (\\(D\\)) on wages (\\(Y\\)). Occupation (\\(M\\)) is a mediator: \\(D \\to M \\to Y\\). Controlling for occupation blocks the indirect effect of college that works through occupational choice, yielding a biased estimate of the total effect.</p>
                        <p>Even worse, if there are unobserved variables \\(U\\) such that \\(U \\to M\\) and \\(U \\to Y\\), conditioning on \\(M\\) opens the path \\(D \\to M \\leftarrow U \\to Y\\), introducing collider bias on top of the lost indirect effect.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark (M-Bias)</div>
                    <div class="env-body">
                        <p>M-bias is a subtle form of collider bias. Consider: \\(U_1 \\to D\\), \\(U_1 \\to W\\), \\(U_2 \\to Y\\), \\(U_2 \\to W\\), forming an "M" shape with \\(W\\) as a collider on the path \\(U_1 \\to W \\leftarrow U_2\\). If \\(D\\) and \\(Y\\) are not directly connected through \\(U_1\\) or \\(U_2\\), then \\(D \\perp Y\\) marginally. But conditioning on \\(W\\) opens the path \\(D \\leftarrow U_1 \\to W \\leftarrow U_2 \\to Y\\), creating a spurious association. This is a real danger in applied work where researchers "control for everything available."</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-dag-classification"></div>
            `,
            visualizations: [
                {
                    id: 'viz-dag-classification',
                    title: 'Interactive DAG: Effect of Conditioning on Confounders, Mediators, and Colliders',
                    description: 'Select which variable type to condition on and observe how it affects the association between treatment \\(D\\) and outcome \\(Y\\). Green paths are blocked; red paths transmit association.',
                    setup: function(container, controls) {
                        var width = Math.min(container.clientWidth - 32, 720);
                        var height = 480;
                        var canvas = document.createElement('canvas');
                        var dpr = window.devicePixelRatio || 1;
                        canvas.width = width * dpr;
                        canvas.height = height * dpr;
                        canvas.style.width = width + 'px';
                        canvas.style.height = height + 'px';
                        var ctx = canvas.getContext('2d');
                        ctx.scale(dpr, dpr);
                        container.appendChild(canvas);

                        var condOn = 'none';

                        var nodes = {
                            D: { x: 100, y: 240, label: 'D (Treatment)' },
                            Y: { x: 620, y: 240, label: 'Y (Outcome)' },
                            W: { x: 360, y: 60, label: 'W (Confounder)' },
                            M: { x: 360, y: 240, label: 'M (Mediator)' },
                            C: { x: 360, y: 420, label: 'C (Collider)' }
                        };

                        function scaleNodes() {
                            var s = width / 720;
                            nodes.D.x = 100 * s; nodes.D.y = 240;
                            nodes.Y.x = 620 * s; nodes.Y.y = 240;
                            nodes.W.x = 360 * s; nodes.W.y = 60;
                            nodes.M.x = 360 * s; nodes.M.y = 240;
                            nodes.C.x = 360 * s; nodes.C.y = 420;
                        }
                        scaleNodes();

                        function drawArrow(fromX, fromY, toX, toY, color, lw) {
                            var dx = toX - fromX, dy = toY - fromY;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            var endX = toX - ux * 22, endY = toY - uy * 22;
                            var startX = fromX + ux * 22, startY = fromY + uy * 22;
                            ctx.strokeStyle = color;
                            ctx.lineWidth = lw || 2.5;
                            ctx.beginPath();
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                            ctx.stroke();
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            var angle = Math.atan2(dy, dx);
                            ctx.moveTo(endX + ux * 10, endY + uy * 10);
                            ctx.lineTo(endX - 10 * Math.cos(angle - Math.PI / 6), endY - 10 * Math.sin(angle - Math.PI / 6));
                            ctx.lineTo(endX - 10 * Math.cos(angle + Math.PI / 6), endY - 10 * Math.sin(angle + Math.PI / 6));
                            ctx.closePath();
                            ctx.fill();
                        }

                        function drawNode(n, conditioned) {
                            ctx.beginPath();
                            ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);
                            if (conditioned) {
                                ctx.fillStyle = '#f0883e44';
                                ctx.fill();
                                ctx.strokeStyle = '#f0883e';
                                ctx.lineWidth = 3;
                                ctx.stroke();
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                ctx.arc(n.x, n.y, 26, 0, Math.PI * 2);
                                ctx.strokeStyle = '#f0883e88';
                                ctx.lineWidth = 1.5;
                                ctx.stroke();
                                ctx.setLineDash([]);
                            } else {
                                ctx.fillStyle = '#1a1a40';
                                ctx.fill();
                                ctx.strokeStyle = '#58a6ff';
                                ctx.lineWidth = 2;
                                ctx.stroke();
                            }
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(n.label.split(' ')[0], n.x, n.y);
                        }

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, width, height);

                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 15px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('DAG: Confounder, Mediator, and Collider', width / 2, 10);

                            var confActive = '#3fb950';
                            var confBlocked = '#f8514966';
                            var openPath = '#f85149';

                            // Confounder path: W -> D, W -> Y
                            var confColor = condOn === 'confounder' ? confBlocked : '#bc8cff';
                            drawArrow(nodes.W.x, nodes.W.y, nodes.D.x, nodes.D.y, confColor);
                            drawArrow(nodes.W.x, nodes.W.y, nodes.Y.x, nodes.Y.y, confColor);

                            // Mediator path: D -> M -> Y
                            var medColor = condOn === 'mediator' ? confBlocked : '#3fb9a0';
                            drawArrow(nodes.D.x, nodes.D.y, nodes.M.x, nodes.M.y, medColor);
                            drawArrow(nodes.M.x, nodes.M.y, nodes.Y.x, nodes.Y.y, medColor);

                            // Collider path: D -> C <- Y
                            var colColor = condOn === 'collider' ? openPath : '#58a6ff88';
                            drawArrow(nodes.D.x, nodes.D.y, nodes.C.x, nodes.C.y, colColor);
                            drawArrow(nodes.Y.x, nodes.Y.y, nodes.C.x, nodes.C.y, colColor);

                            // Direct effect
                            drawArrow(nodes.D.x, nodes.D.y + 5, nodes.Y.x, nodes.Y.y + 5, '#3fb950', 3);

                            drawNode(nodes.D, false);
                            drawNode(nodes.Y, false);
                            drawNode(nodes.W, condOn === 'confounder');
                            drawNode(nodes.M, condOn === 'mediator');
                            drawNode(nodes.C, condOn === 'collider');

                            // Labels
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = '#8b949e';
                            ctx.fillText(nodes.W.label, nodes.W.x, nodes.W.y + 28);
                            ctx.fillText(nodes.M.label, nodes.M.x, nodes.M.y + 28);
                            ctx.fillText(nodes.C.label, nodes.C.x, nodes.C.y + 28);
                            ctx.fillText(nodes.D.label, nodes.D.x, nodes.D.y + 28);
                            ctx.fillText(nodes.Y.label, nodes.Y.x, nodes.Y.y + 28);

                            // Status text
                            var statusY = height - 20;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            if (condOn === 'none') {
                                ctx.fillStyle = '#8b949e';
                                ctx.fillText('Click a button to condition on a variable and see the effect on causal paths.', width / 2, statusY);
                            } else if (condOn === 'confounder') {
                                ctx.fillStyle = '#3fb950';
                                ctx.fillText('Conditioning on W BLOCKS the backdoor path D <- W -> Y. Correct adjustment!', width / 2, statusY);
                            } else if (condOn === 'mediator') {
                                ctx.fillStyle = '#d29922';
                                ctx.fillText('Conditioning on M BLOCKS the causal path D -> M -> Y. Loses indirect effect!', width / 2, statusY);
                            } else if (condOn === 'collider') {
                                ctx.fillStyle = '#f85149';
                                ctx.fillText('Conditioning on C OPENS the path D -> C <- Y. Introduces spurious association!', width / 2, statusY);
                            }
                        }

                        draw();

                        VizEngine.createButton(controls, 'No Conditioning', function() { condOn = 'none'; draw(); });
                        VizEngine.createButton(controls, 'Condition on Confounder W', function() { condOn = 'confounder'; draw(); });
                        VizEngine.createButton(controls, 'Condition on Mediator M', function() { condOn = 'mediator'; draw(); });
                        VizEngine.createButton(controls, 'Condition on Collider C', function() { condOn = 'collider'; draw(); });

                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: '<strong>Exercise 8.5.</strong> Consider the DAG: \\(Z \\to D \\to Y\\), \\(Z \\to Y\\). Is \\(Z\\) a confounder, mediator, or collider? Should you adjust for \\(Z\\) to estimate the effect of \\(D\\) on \\(Y\\)?',
                    hint: 'Check whether \\(Z\\) is a common cause of \\(D\\) and \\(Y\\) (confounder), on the causal path (mediator), or a common effect (collider).',
                    solution: '<p>\\(Z\\) is a <strong>confounder</strong>: it causes both \\(D\\) (via \\(Z \\to D\\)) and \\(Y\\) (via \\(Z \\to Y\\)), creating the backdoor path \\(D \\leftarrow Z \\to Y\\). We <strong>should adjust</strong> for \\(Z\\) to block this backdoor path and identify the causal effect of \\(D\\) on \\(Y\\).</p>'
                },
                {
                    question: '<strong>Exercise 8.6.</strong> In the DAG \\(D \\to M \\to Y\\), \\(D \\to Y\\), what happens to the estimated effect if we control for \\(M\\)? Express the bias in terms of path coefficients.',
                    hint: 'With linear structural equations \\(M = aD + \\varepsilon_M\\) and \\(Y = bM + cD + \\varepsilon_Y\\), compute the total effect and the partial effect holding \\(M\\) fixed.',
                    solution: '<p>The total effect of \\(D\\) on \\(Y\\) is \\(c + ab\\) (direct effect \\(c\\) plus indirect effect \\(ab\\) through \\(M\\)). Controlling for \\(M\\) yields only the direct effect \\(c\\), so we lose the indirect component \\(ab\\). The bias from controlling for the mediator is \\(-ab\\). If the indirect effect is large, this can severely understate the total causal effect.</p>'
                },
                {
                    question: '<strong>Exercise 8.7.</strong> Explain M-bias with a concrete example. Let \\(U_1\\) = genetic risk, \\(U_2\\) = environmental exposure (both unobserved), \\(W\\) = a biomarker caused by both, \\(D\\) = a drug (caused by \\(U_1\\) through physician awareness), \\(Y\\) = health outcome (caused by \\(U_2\\)). Should a researcher control for \\(W\\)?',
                    hint: 'Draw the DAG and check whether \\(W\\) is a collider on any path from \\(D\\) to \\(Y\\).',
                    solution: '<p>The DAG is: \\(U_1 \\to D\\), \\(U_1 \\to W\\), \\(U_2 \\to W\\), \\(U_2 \\to Y\\). There is no backdoor path from \\(D\\) to \\(Y\\) because the path \\(D \\leftarrow U_1 \\to W \\leftarrow U_2 \\to Y\\) is blocked at the collider \\(W\\). If we condition on \\(W\\), we open this path, creating a spurious association between \\(D\\) and \\(Y\\). The researcher should <strong>not</strong> control for \\(W\\). This is M-bias: controlling for the biomarker introduces bias that did not exist before.</p>'
                },
                {
                    question: '<strong>Exercise 8.8.</strong> A researcher studying the effect of exercise (\\(D\\)) on cardiovascular health (\\(Y\\)) controls for blood pressure (\\(M\\)) and BMI (\\(C\\)). Exercise affects blood pressure (\\(D \\to M \\to Y\\)) and both exercise and genetics affect BMI (\\(D \\to C \\leftarrow G \\to Y\\) where \\(G\\) = genetics). Identify the problems with this specification.',
                    hint: 'Classify \\(M\\) and \\(C\\) using the DAG structure. Are they mediators, confounders, or colliders?',
                    solution: '<p>Two problems:</p><ol><li>\\(M\\) (blood pressure) is a <strong>mediator</strong>: \\(D \\to M \\to Y\\). Controlling for it blocks the indirect effect of exercise through blood pressure, underestimating the total effect.</li><li>\\(C\\) (BMI) is a <strong>collider</strong> on the path \\(D \\to C \\leftarrow G \\to Y\\). Conditioning on BMI opens this path, creating a spurious association through genetics \\(G\\). Even if exercise has no direct effect on \\(Y\\) beyond through \\(M\\) and \\(C\\), conditioning on both introduces two sources of bias.</li></ol><p>The researcher should control for neither \\(M\\) nor \\(C\\), and instead seek true confounders (common causes of \\(D\\) and \\(Y\\) not on the causal path).</p>'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Omitted Variable Bias Formula
        // ================================================================
        {
            id: 'ch08-sec03',
            title: 'Omitted Variable Bias Formula',
            content: `
                <h2>Omitted Variable Bias Formula</h2>

                <p>When a confounder is omitted from a regression, the resulting coefficient on the treatment variable is biased. The <strong>omitted variable bias (OVB) formula</strong> precisely quantifies this bias as the product of two quantities: the effect of the omitted variable on the outcome and its relationship with the treatment.</p>

                <h3>The OVB Formula</h3>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 8.14 (Omitted Variable Bias)</div>
                    <div class="env-body">
                        <p>Consider the true model \\(Y_i = \\alpha + \\tau D_i + \\gamma W_i + \\varepsilon_i\\) where \\(\\mathbb{E}[\\varepsilon_i \\mid D_i, W_i] = 0\\). If we run the short regression \\(Y_i = \\tilde{\\alpha} + \\tilde{\\tau} D_i + \\tilde{\\varepsilon}_i\\) omitting \\(W_i\\), then</p>
                        \\[\\tilde{\\tau} \\xrightarrow{p} \\tau + \\gamma \\cdot \\delta\\]
                        <p>where \\(\\delta = \\frac{\\text{Cov}(D_i, W_i)}{\\text{Var}(D_i)}\\) is the coefficient from regressing \\(W_i\\) on \\(D_i\\). The bias is</p>
                        \\[\\text{OVB} = \\gamma \\cdot \\delta = (\\text{effect of } W \\text{ on } Y) \\times (\\text{relationship of } D \\text{ with } W).\\]
                    </div>
                </div>

                <div class="env-block proof">
                    <div class="env-title">Proof</div>
                    <div class="env-body">
                        <p>The short regression coefficient is</p>
                        \\[\\tilde{\\tau} = \\frac{\\text{Cov}(D_i, Y_i)}{\\text{Var}(D_i)} = \\frac{\\text{Cov}(D_i, \\alpha + \\tau D_i + \\gamma W_i + \\varepsilon_i)}{\\text{Var}(D_i)} = \\tau + \\gamma \\cdot \\frac{\\text{Cov}(D_i, W_i)}{\\text{Var}(D_i)} = \\tau + \\gamma \\delta.\\]
                        <div class="qed">∎</div>
                    </div>
                </div>

                <h3>Signing the Bias</h3>

                <div class="env-block remark">
                    <div class="env-title">Remark 8.15 (Signing OVB)</div>
                    <div class="env-body">
                        <p>The direction of OVB is determined by the signs of \\(\\gamma\\) and \\(\\delta\\):</p>
                        <table style="margin:12px auto;border-collapse:collapse;color:#c9d1d9;">
                            <tr style="border-bottom:1px solid #30363d;"><th style="padding:4px 12px;"></th><th style="padding:4px 12px;">\\(\\delta > 0\\) (D, W positively related)</th><th style="padding:4px 12px;">\\(\\delta < 0\\) (D, W negatively related)</th></tr>
                            <tr><td style="padding:4px 12px;font-weight:bold;">\\(\\gamma > 0\\) (W helps Y)</td><td style="padding:4px 12px;color:#3fb950;">Positive bias (overestimate)</td><td style="padding:4px 12px;color:#f85149;">Negative bias (underestimate)</td></tr>
                            <tr><td style="padding:4px 12px;font-weight:bold;">\\(\\gamma < 0\\) (W hurts Y)</td><td style="padding:4px 12px;color:#f85149;">Negative bias (underestimate)</td><td style="padding:4px 12px;color:#3fb950;">Positive bias (overestimate)</td></tr>
                        </table>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 8.16 (Returns to Education Revisited)</div>
                    <div class="env-body">
                        <p>Let \\(D\\) = years of education, \\(Y\\) = log wages, \\(W\\) = ability. Then \\(\\gamma > 0\\) (ability raises wages) and \\(\\delta > 0\\) (more able people get more education). Therefore OVB \\(= \\gamma \\delta > 0\\): the naive regression overstates the return to education.</p>
                    </div>
                </div>

                <h3>Oster (2019) Bounds</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.17 (Coefficient Stability and R-Squared Movements)</div>
                    <div class="env-body">
                        <p>Oster (2019) extends the OVB logic to bound the bias from unobservables using the observed change in coefficients and \\(R^2\\) when controls are added. Let \\(\\tilde{\\tau}\\) and \\(\\tilde{R}^2\\) be from the short regression, and \\(\\hat{\\tau}\\) and \\(\\hat{R}^2\\) from the long regression (with observed controls). If the relationship between unobservables and \\(D\\) is proportional to the relationship between observables and \\(D\\) (with proportionality factor \\(\\delta_{\\text{Oster}}\\)), then the bias-adjusted estimate is:</p>
                        \\[\\tau^* = \\hat{\\tau} - \\delta_{\\text{Oster}} \\cdot (\\tilde{\\tau} - \\hat{\\tau}) \\cdot \\frac{R_{\\max} - \\hat{R}^2}{\\hat{R}^2 - \\tilde{R}^2}\\]
                        <p>where \\(R_{\\max}\\) is the hypothetical \\(R^2\\) from a regression with all relevant controls (both observed and unobserved). Oster recommends \\(\\delta_{\\text{Oster}} = 1\\) (equal selection) and \\(R_{\\max} = \\min(1, 1.3\\hat{R}^2)\\) as a default.</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition</div>
                    <div class="env-body">
                        <p>The key insight is that if adding observed controls barely moves the coefficient (\\(\\hat{\\tau} \\approx \\tilde{\\tau}\\)) but substantially increases \\(R^2\\), then unobservables would need to be much more strongly correlated with treatment than observables to generate large bias. Conversely, if the coefficient changes substantially when adding controls, unobservables might cause similar shifts. Oster's method formalizes this reasoning to produce bounds on the true causal effect.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-ovb-formula"></div>
            `,
            visualizations: [
                {
                    id: 'viz-ovb-formula',
                    title: 'Omitted Variable Bias: How Confounder Strength Affects Bias',
                    description: 'Adjust the strength of the confounder\'s effect on the outcome (\\(\\gamma\\)) and its correlation with treatment (\\(\\delta\\)) to see how OVB changes.',
                    setup: function(container, controls) {
                        var width = Math.min(container.clientWidth - 32, 700);
                        var height = Math.round(width * 0.6);
                        var canvas = document.createElement('canvas');
                        var dpr = window.devicePixelRatio || 1;
                        canvas.width = width * dpr;
                        canvas.height = height * dpr;
                        canvas.style.width = width + 'px';
                        canvas.style.height = height + 'px';
                        var ctx = canvas.getContext('2d');
                        ctx.scale(dpr, dpr);
                        container.appendChild(canvas);

                        var gamma = 0.5;
                        var delta = 0.4;
                        var trueTau = 1.0;

                        function draw() {
                            var padL = 70, padR = 30, padT = 40, padB = 55;
                            var plotW = width - padL - padR;
                            var plotH = height - padT - padB;

                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, width, height);

                            // Draw OVB as function of gamma for fixed delta
                            ctx.strokeStyle = '#1a1a4066';
                            ctx.lineWidth = 0.5;
                            for (var i = 0; i <= 10; i++) {
                                var gy = padT + plotH * i / 10;
                                ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(padL + plotW, gy); ctx.stroke();
                                var gx = padL + plotW * i / 10;
                                ctx.beginPath(); ctx.moveTo(gx, padT); ctx.lineTo(gx, padT + plotH); ctx.stroke();
                            }

                            // Axes
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke();

                            // x-axis: gamma from -2 to 2
                            var gMin = -2, gMax = 2;
                            // y-axis: estimated tau
                            var biasMax = 2;
                            var tauMin = trueTau - biasMax;
                            var tauMax = trueTau + biasMax;

                            function toX(g) { return padL + plotW * (g - gMin) / (gMax - gMin); }
                            function toY(t) { return padT + plotH * (1 - (t - tauMin) / (tauMax - tauMin)); }

                            // X-axis labels
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var xi = gMin; xi <= gMax; xi += 0.5) {
                                ctx.fillText(xi.toFixed(1), toX(xi), padT + plotH + 6);
                            }
                            ctx.fillText('gamma (effect of W on Y)', padL + plotW / 2, padT + plotH + 28);

                            // Y-axis labels
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yi = tauMin; yi <= tauMax; yi += 0.5) {
                                ctx.fillText(yi.toFixed(1), padL - 8, toY(yi));
                            }
                            ctx.save();
                            ctx.translate(18, padT + plotH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Estimated tau (short reg)', 0, 0);
                            ctx.restore();

                            // True tau line
                            ctx.strokeStyle = '#3fb95088';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(padL, toY(trueTau));
                            ctx.lineTo(padL + plotW, toY(trueTau));
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = '#3fb950';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('True tau = ' + trueTau.toFixed(1), padL + 8, toY(trueTau) - 4);

                            // OVB curve: tilde_tau = tau + gamma * delta
                            ctx.strokeStyle = '#58a6ff';
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var g = gMin; g <= gMax; g += 0.02) {
                                var est = trueTau + g * delta;
                                if (est < tauMin || est > tauMax) { started = false; continue; }
                                var px = toX(g);
                                var py = toY(est);
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Current point
                            var curEst = trueTau + gamma * delta;
                            var bias = gamma * delta;
                            if (curEst >= tauMin && curEst <= tauMax) {
                                ctx.fillStyle = '#f0883e';
                                ctx.beginPath();
                                ctx.arc(toX(gamma), toY(curEst), 7, 0, Math.PI * 2);
                                ctx.fill();

                                // Bias arrow
                                if (Math.abs(bias) > 0.05) {
                                    ctx.strokeStyle = '#f85149';
                                    ctx.lineWidth = 2;
                                    ctx.setLineDash([3, 3]);
                                    ctx.beginPath();
                                    ctx.moveTo(toX(gamma), toY(trueTau));
                                    ctx.lineTo(toX(gamma), toY(curEst));
                                    ctx.stroke();
                                    ctx.setLineDash([]);
                                }
                            }

                            // Info box
                            ctx.fillStyle = '#161b22';
                            ctx.fillRect(padL + plotW - 230, padT + 8, 220, 80);
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(padL + plotW - 230, padT + 8, 220, 80);
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            var bx = padL + plotW - 220;
                            ctx.fillText('gamma = ' + gamma.toFixed(2) + ', delta = ' + delta.toFixed(2), bx, padT + 16);
                            ctx.fillText('OVB = gamma * delta = ' + bias.toFixed(3), bx, padT + 34);
                            ctx.fillStyle = bias > 0 ? '#3fb950' : bias < 0 ? '#f85149' : '#8b949e';
                            ctx.fillText('Estimated tau = ' + curEst.toFixed(3), bx, padT + 52);
                            ctx.fillStyle = '#8b949e';
                            ctx.fillText(bias > 0.01 ? 'Overestimate' : bias < -0.01 ? 'Underestimate' : 'No bias', bx, padT + 70);

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            ctx.fillText('OVB = gamma * delta', padL + 4, padT - 30);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'gamma (W -> Y)', -2, 2, gamma, 0.1, function(v) { gamma = v; draw(); });
                        VizEngine.createSlider(controls, 'delta (D ~ W)', -1, 1, delta, 0.05, function(v) { delta = v; draw(); });
                        VizEngine.createSlider(controls, 'True tau', 0, 3, trueTau, 0.1, function(v) { trueTau = v; draw(); });

                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: '<strong>Exercise 8.9.</strong> Derive the OVB formula for the multivariate case: the true model is \\(Y = X\\beta + W\\gamma + \\varepsilon\\) with \\(X\\) being \\(n \\times k\\), and the short regression omits \\(W\\). Show that \\(\\tilde{\\beta} \\xrightarrow{p} \\beta + (X\'X)^{-1}X\'W \\cdot \\gamma\\).',
                    hint: 'Use the Frisch-Waugh-Lovell theorem or direct algebra on the OLS formula. The matrix \\((X\'X)^{-1}X\'W\\) plays the role of \\(\\delta\\).',
                    solution: '<p>The short regression OLS estimator is</p>\\[\\tilde{\\beta} = (X\'X)^{-1}X\'Y = (X\'X)^{-1}X\'(X\\beta + W\\gamma + \\varepsilon) = \\beta + (X\'X)^{-1}X\'W \\cdot \\gamma + (X\'X)^{-1}X\'\\varepsilon.\\]<p>Taking the probability limit (assuming \\(\\text{plim} \\, (X\'X/n)^{-1}(X\'\\varepsilon/n) = 0\\)):</p>\\[\\text{plim} \\, \\tilde{\\beta} = \\beta + \\underbrace{\\Sigma_{XX}^{-1}\\Sigma_{XW}}_{\\Delta} \\cdot \\gamma\\]<p>where \\(\\Delta = \\Sigma_{XX}^{-1}\\Sigma_{XW}\\) is the matrix of regression coefficients from regressing \\(W\\) on \\(X\\). The OVB is \\(\\Delta \\gamma\\).</p>'
                },
                {
                    question: '<strong>Exercise 8.10.</strong> Consider estimating the effect of class size (\\(D\\)) on test scores (\\(Y\\)). Family income (\\(W\\)) is a confounder: wealthier families choose schools with smaller classes (\\(\\delta < 0\\)) and family income positively affects test scores (\\(\\gamma > 0\\)). What is the sign of OVB? Does the naive regression overstate or understate the harm of large classes?',
                    hint: 'Compute the sign of \\(\\gamma \\delta\\). Remember that larger \\(D\\) means larger classes (presumably worse outcomes).',
                    solution: '<p>We have \\(\\gamma > 0\\) (income helps scores) and \\(\\delta < 0\\) (larger classes are in poorer areas). So OVB = \\(\\gamma \\delta < 0\\). The short regression coefficient \\(\\tilde{\\tau} = \\tau + \\gamma\\delta < \\tau\\). Since the true \\(\\tau\\) is likely negative (large classes hurt scores), the estimated \\(\\tilde{\\tau}\\) is even more negative. The naive regression <strong>overstates the harm</strong> of large classes because it conflates the class-size effect with the income effect: students in large classes are also poorer, which independently lowers scores.</p>'
                },
                {
                    question: '<strong>Exercise 8.11.</strong> Explain how the Oster (2019) method uses coefficient movements and \\(R^2\\) changes to assess the potential for OVB. If adding demographic controls changes the coefficient from \\(\\tilde{\\tau} = 0.8\\) to \\(\\hat{\\tau} = 0.6\\) and \\(R^2\\) from \\(0.05\\) to \\(0.25\\), with \\(R_{\\max} = 1\\), compute the bias-adjusted \\(\\tau^*\\) under \\(\\delta_{\\text{Oster}} = 1\\).',
                    hint: 'Apply the formula \\(\\tau^* = \\hat{\\tau} - \\delta_{\\text{Oster}} \\cdot (\\tilde{\\tau} - \\hat{\\tau}) \\cdot \\frac{R_{\\max} - \\hat{R}^2}{\\hat{R}^2 - \\tilde{R}^2}\\).',
                    solution: '<p>Substituting:</p>\\[\\tau^* = 0.6 - 1 \\cdot (0.8 - 0.6) \\cdot \\frac{1 - 0.25}{0.25 - 0.05} = 0.6 - 0.2 \\cdot \\frac{0.75}{0.20} = 0.6 - 0.75 = -0.15.\\]<p>The bias-adjusted estimate is \\(-0.15\\), suggesting the true effect might be close to zero or even negative. The large drop from \\(\\tilde{\\tau}\\) to \\(\\hat{\\tau}\\) combined with modest \\(R^2\\) gain signals that unobservables could easily explain the remaining coefficient. Under the less conservative \\(R_{\\max} = 1.3 \\times 0.25 = 0.325\\):</p>\\[\\tau^* = 0.6 - 0.2 \\cdot \\frac{0.325 - 0.25}{0.20} = 0.6 - 0.075 = 0.525.\\]<p>The conclusion depends sensitively on the assumed \\(R_{\\max}\\).</p>'
                },
                {
                    question: '<strong>Exercise 8.12.</strong> Can OVB ever be zero even when a confounder exists? Give conditions under which \\(\\gamma \\delta = 0\\) despite \\(W\\) being a genuine confounder (i.e., \\(W\\) causes both \\(D\\) and \\(Y\\)).',
                    hint: 'Think about what \\(\\delta = 0\\) means in the regression context, versus \\(W\\) being a cause of \\(D\\).',
                    solution: '<p>OVB = 0 requires \\(\\gamma = 0\\) or \\(\\delta = 0\\). If \\(W\\) is a genuine confounder (causes both \\(D\\) and \\(Y\\)), then \\(\\gamma \\neq 0\\). However, \\(\\delta = \\text{Cov}(D, W)/\\text{Var}(D) = 0\\) is possible if \\(W\\) affects \\(D\\) nonlinearly but the linear projection is zero (e.g., \\(D = W^2 + \\varepsilon\\) with \\(W\\) symmetric around zero). In this case, the linear OVB formula gives zero, but the bias in a nonparametric sense is still present. This shows the OVB formula is a linear approximation: it captures bias in the linear projection sense, not all forms of confounding.</p>'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Matching Methods
        // ================================================================
        {
            id: 'ch08-sec04',
            title: 'Matching Methods',
            content: `
                <h2>Matching Methods</h2>

                <p>Matching methods attempt to construct a comparison group that is similar to the treated group in terms of observed covariates. The intuition is simple: for each treated unit, find one or more control units with similar covariate values, and compare their outcomes. If the covariates are rich enough to capture all confounders (conditional independence / selection on observables), matching can estimate causal effects.</p>

                <h3>Conditional Independence Assumption</h3>

                <div class="env-block definition">
                    <div class="env-title">Assumption 8.18 (Conditional Independence / Unconfoundedness)</div>
                    <div class="env-body">
                        <p>For a vector of pre-treatment covariates \\(X_i\\):</p>
                        \\[(Y_i(0), Y_i(1)) \\perp D_i \\mid X_i.\\]
                        <p>This means that, conditional on observables \\(X_i\\), treatment assignment is as good as random. Combined with <strong>overlap</strong> (\\(0 < P(D_i = 1 \\mid X_i) < 1\\)), this identifies the ATE:</p>
                        \\[\\tau = \\mathbb{E}[\\mathbb{E}[Y_i \\mid D_i = 1, X_i] - \\mathbb{E}[Y_i \\mid D_i = 0, X_i]].\\]
                    </div>
                </div>

                <h3>Exact Matching</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.19 (Exact Matching)</div>
                    <div class="env-body">
                        <p>Exact matching pairs each treated unit with control units that have <em>identical</em> covariate values: \\(X_i = X_j\\) for matched pairs \\((i, j)\\). The ATT estimator is:</p>
                        \\[\\hat{\\tau}_{\\text{ATT}} = \\frac{1}{N_1} \\sum_{i: D_i = 1} \\left(Y_i - \\bar{Y}_{0}(X_i)\\right)\\]
                        <p>where \\(\\bar{Y}_0(X_i)\\) is the average outcome of control units with \\(X_j = X_i\\).</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark (Curse of Dimensionality)</div>
                    <div class="env-body">
                        <p>Exact matching fails when covariates are continuous or high-dimensional: with \\(p\\) binary covariates, there are \\(2^p\\) cells, and many will be empty. Even with \\(p = 20\\) binary covariates, there are over a million cells. This motivates coarser matching methods and the use of propensity scores (Chapter 9).</p>
                    </div>
                </div>

                <h3>Coarsened Exact Matching (CEM)</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.20 (CEM)</div>
                    <div class="env-body">
                        <p>Coarsened exact matching (Iacus, King, and Porro, 2012) temporarily coarsens continuous covariates into bins, performs exact matching on the coarsened values, then uses the original (uncoarsened) values in the outcome analysis. This reduces the dimensionality problem while maintaining close matches. CEM satisfies the <strong>congruence principle</strong>: the coarsening determines the maximum imbalance ex ante.</p>
                    </div>
                </div>

                <h3>Nearest-Neighbor Matching</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.21 (Nearest-Neighbor Matching)</div>
                    <div class="env-body">
                        <p>For each treated unit \\(i\\), find the control unit \\(j\\) that minimizes a distance metric \\(\\|X_i - X_j\\|\\):</p>
                        \\[j^*(i) = \\arg\\min_{j: D_j = 0} \\|X_i - X_j\\|.\\]
                        <p>Variants include:</p>
                        <ul>
                            <li><strong>With replacement</strong>: A control unit can be matched to multiple treated units. Reduces bias but increases variance.</li>
                            <li><strong>Without replacement</strong>: Each control unit is used at most once. Lower variance but potentially higher bias.</li>
                            <li><strong>k-nearest neighbors</strong>: Average over the \\(k\\) closest matches to reduce variance.</li>
                            <li><strong>Caliper matching</strong>: Only match if \\(\\|X_i - X_j\\| < c\\) for some threshold \\(c\\).</li>
                        </ul>
                    </div>
                </div>

                <h3>Mahalanobis Distance Matching</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.22 (Mahalanobis Distance)</div>
                    <div class="env-body">
                        <p>The Mahalanobis distance between covariate vectors \\(X_i\\) and \\(X_j\\) is:</p>
                        \\[d_M(X_i, X_j) = \\sqrt{(X_i - X_j)' \\hat{\\Sigma}^{-1} (X_i - X_j)}\\]
                        <p>where \\(\\hat{\\Sigma}\\) is the sample covariance matrix of \\(X\\). This accounts for correlations and different scales among covariates. Nearest-neighbor matching on Mahalanobis distance is more robust than Euclidean distance when covariates have different variances.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark (Abadie and Imbens, 2006)</div>
                    <div class="env-body">
                        <p>Nearest-neighbor matching estimators are not \\(\\sqrt{n}\\)-consistent when matching on multiple continuous covariates, due to the matching discrepancy (the fact that matches are not exact). Abadie and Imbens (2011) propose a bias-corrected matching estimator that adjusts for the remaining imbalance using a regression within matched pairs:</p>
                        \\[\\hat{\\tau}_{\\text{bc}} = \\frac{1}{N_1} \\sum_{i: D_i=1} \\left(Y_i - \\hat{Y}_j^{\\text{adj}}\\right)\\]
                        <p>where \\(\\hat{Y}_j^{\\text{adj}}\\) adjusts the matched control's outcome for the covariate difference \\(X_i - X_j\\).</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-matching-scatter"></div>
            `,
            visualizations: [
                {
                    id: 'viz-matching-scatter',
                    title: '2D Matching: Nearest-Neighbor Pairs Between Treated and Control',
                    description: 'Observe how nearest-neighbor matching pairs treated units (orange) with their closest control units (blue) in covariate space. Toggle matching with/without replacement.',
                    setup: function(container, controls) {
                        var width = Math.min(container.clientWidth - 32, 700);
                        var height = Math.round(width * 0.75);
                        var canvas = document.createElement('canvas');
                        var dpr = window.devicePixelRatio || 1;
                        canvas.width = width * dpr;
                        canvas.height = height * dpr;
                        canvas.style.width = width + 'px';
                        canvas.style.height = height + 'px';
                        var ctx = canvas.getContext('2d');
                        ctx.scale(dpr, dpr);
                        container.appendChild(canvas);

                        var withReplacement = true;

                        function mulberry32(s) {
                            return function() {
                                s |= 0; s = s + 0x6D2B79F5 | 0;
                                var t = Math.imul(s ^ s >>> 15, 1 | s);
                                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                                return ((t ^ t >>> 14) >>> 0) / 4294967296;
                            };
                        }

                        var rng = mulberry32(123);
                        function rnorm() {
                            var u = rng(), v = rng();
                            return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
                        }

                        // Generate data
                        var treated = [];
                        var control = [];
                        for (var i = 0; i < 20; i++) {
                            treated.push({ x: 0.5 + 0.15 * rnorm(), y: 0.55 + 0.15 * rnorm() });
                        }
                        for (var j = 0; j < 40; j++) {
                            control.push({ x: 0.4 + 0.18 * rnorm(), y: 0.4 + 0.18 * rnorm() });
                        }
                        // Clamp
                        treated.forEach(function(p) { p.x = Math.max(0.02, Math.min(0.98, p.x)); p.y = Math.max(0.02, Math.min(0.98, p.y)); });
                        control.forEach(function(p) { p.x = Math.max(0.02, Math.min(0.98, p.x)); p.y = Math.max(0.02, Math.min(0.98, p.y)); });

                        function dist(a, b) { return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)); }

                        function match(withRepl) {
                            var pairs = [];
                            var used = {};
                            for (var i = 0; i < treated.length; i++) {
                                var bestJ = -1, bestD = Infinity;
                                for (var j = 0; j < control.length; j++) {
                                    if (!withRepl && used[j]) continue;
                                    var d = dist(treated[i], control[j]);
                                    if (d < bestD) { bestD = d; bestJ = j; }
                                }
                                if (bestJ >= 0) {
                                    pairs.push({ ti: i, ci: bestJ, d: bestD });
                                    used[bestJ] = true;
                                }
                            }
                            return pairs;
                        }

                        function draw() {
                            var padL = 50, padR = 20, padT = 40, padB = 50;
                            var plotW = width - padL - padR;
                            var plotH = height - padT - padB;

                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, width, height);

                            // Grid
                            ctx.strokeStyle = '#1a1a4044';
                            ctx.lineWidth = 0.5;
                            for (var i = 0; i <= 10; i++) {
                                var gy = padT + plotH * i / 10;
                                ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(padL + plotW, gy); ctx.stroke();
                                var gx = padL + plotW * i / 10;
                                ctx.beginPath(); ctx.moveTo(gx, padT); ctx.lineTo(gx, padT + plotH); ctx.stroke();
                            }

                            // Axes
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke();

                            ctx.fillStyle = '#8b949e';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Covariate X1', padL + plotW / 2, padT + plotH + 25);
                            ctx.save();
                            ctx.translate(16, padT + plotH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.fillText('Covariate X2', 0, 0);
                            ctx.restore();

                            function toSx(v) { return padL + v * plotW; }
                            function toSy(v) { return padT + plotH - v * plotH; }

                            // Draw matching lines
                            var pairs = match(withReplacement);
                            for (var k = 0; k < pairs.length; k++) {
                                var p = pairs[k];
                                ctx.strokeStyle = '#ffffff22';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(toSx(treated[p.ti].x), toSy(treated[p.ti].y));
                                ctx.lineTo(toSx(control[p.ci].x), toSy(control[p.ci].y));
                                ctx.stroke();
                            }

                            // Count how many times each control is used
                            var useCounts = {};
                            for (var k = 0; k < pairs.length; k++) {
                                useCounts[pairs[k].ci] = (useCounts[pairs[k].ci] || 0) + 1;
                            }

                            // Draw control points
                            for (var j = 0; j < control.length; j++) {
                                var matched = useCounts[j] || 0;
                                var r = matched > 0 ? 4 + matched * 1.5 : 3;
                                ctx.fillStyle = matched > 0 ? '#58a6ff' : '#58a6ff44';
                                ctx.beginPath();
                                ctx.arc(toSx(control[j].x), toSy(control[j].y), r, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Draw treated points
                            for (var i = 0; i < treated.length; i++) {
                                ctx.fillStyle = '#f0883e';
                                ctx.beginPath();
                                ctx.arc(toSx(treated[i].x), toSy(treated[i].y), 5, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Legend
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = '#f0883e';
                            ctx.beginPath(); ctx.arc(padL + 15, padT + 18, 5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillText('Treated (n=' + treated.length + ')', padL + 26, padT + 18);
                            ctx.fillStyle = '#58a6ff';
                            ctx.beginPath(); ctx.arc(padL + 15, padT + 38, 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillText('Control (n=' + control.length + ')', padL + 26, padT + 38);

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var titleText = withReplacement ? 'NN Matching (with replacement)' : 'NN Matching (without replacement)';
                            ctx.fillText(titleText, width / 2, 8);

                            // Stats
                            var avgDist = 0;
                            for (var k = 0; k < pairs.length; k++) avgDist += pairs[k].d;
                            avgDist /= pairs.length || 1;
                            var uniqueControls = Object.keys(useCounts).length;
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Avg match distance: ' + avgDist.toFixed(4), width - padR - 5, padT + 12);
                            ctx.fillText('Unique controls used: ' + uniqueControls, width - padR - 5, padT + 28);
                        }

                        draw();

                        VizEngine.createButton(controls, 'With Replacement', function() { withReplacement = true; draw(); });
                        VizEngine.createButton(controls, 'Without Replacement', function() { withReplacement = false; draw(); });

                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: '<strong>Exercise 8.13.</strong> Explain why matching with replacement reduces bias compared to matching without replacement, but increases variance. What is the bias-variance tradeoff?',
                    hint: 'With replacement, each treated unit gets its closest possible match. Without replacement, some treated units may get worse matches if their best match was already used.',
                    solution: '<p><strong>Bias reduction</strong>: With replacement, every treated unit is matched to its nearest control, regardless of whether that control has been used before. Without replacement, once a good control is matched, later treated units may be forced to match with dissimilar controls, increasing the average covariate imbalance and thus bias.</p><p><strong>Variance increase</strong>: With replacement, a single control unit may appear multiple times in the matched sample. If control \\(j\\) is matched to \\(k\\) treated units, its outcome \\(Y_j\\) enters the estimator \\(k\\) times, reducing the effective sample size. The variance of the estimator increases because fewer distinct control observations are used. The extreme case: if all treated units match to the same control, the variance depends on a single observation.</p>'
                },
                {
                    question: '<strong>Exercise 8.14.</strong> Consider two covariates \\(X_1 \\sim N(0, 1)\\) and \\(X_2 \\sim N(0, 100)\\). Why is Euclidean distance matching problematic here? How does Mahalanobis distance matching resolve this?',
                    hint: 'Compare the typical magnitude of \\(|X_{1i} - X_{1j}|\\) versus \\(|X_{2i} - X_{2j}|\\). Which covariate dominates the Euclidean distance?',
                    solution: '<p>With Euclidean distance \\(d = \\sqrt{(X_{1i}-X_{1j})^2 + (X_{2i}-X_{2j})^2}\\), the second covariate dominates because \\(\\text{Var}(X_2) = 100 \\gg \\text{Var}(X_1) = 1\\). Typical differences in \\(X_2\\) are about 10 times larger than in \\(X_1\\). The matching effectively ignores \\(X_1\\), even if \\(X_1\\) is an important confounder.</p><p>Mahalanobis distance uses \\(d_M = \\sqrt{(X_i - X_j)\' \\Sigma^{-1} (X_i - X_j)}\\). With \\(\\Sigma = \\text{diag}(1, 100)\\), we get \\(d_M = \\sqrt{(X_{1i}-X_{1j})^2 + (X_{2i}-X_{2j})^2/100}\\), effectively standardizing each covariate to unit variance. Both covariates contribute equally to the distance metric, ensuring balanced matches on both dimensions.</p>'
                },
                {
                    question: '<strong>Exercise 8.15.</strong> With \\(p = 10\\) continuous covariates and \\(n = 500\\) observations per group, what is the expected nearest-neighbor distance in \\(p\\)-dimensional space? Explain why this illustrates the curse of dimensionality for matching.',
                    hint: 'In a unit hypercube \\([0,1]^p\\) with \\(n\\) points, the expected nearest-neighbor distance scales as \\(n^{-1/p}\\). Compute this for \\(p = 10, n = 500\\).',
                    solution: '<p>For \\(n\\) uniformly distributed points in \\([0,1]^p\\), the expected nearest-neighbor distance scales as \\(d_{\\text{NN}} \\sim c_p \\cdot n^{-1/p}\\) where \\(c_p\\) is a constant depending on \\(p\\). For \\(p = 10\\) and \\(n = 500\\):</p>\\[d_{\\text{NN}} \\approx 500^{-1/10} = 500^{-0.1} \\approx 0.535.\\]<p>This means the nearest neighbor is at distance \\(\\approx 0.54\\) in a unit cube -- more than halfway across! The match quality is terrible because in 10 dimensions, points are essentially isolated. For comparison, with \\(p = 2\\): \\(500^{-0.5} \\approx 0.045\\), giving much tighter matches. This curse of dimensionality motivates propensity score methods (Chapter 9), which reduce matching to a single dimension.</p>'
                },
                {
                    question: '<strong>Exercise 8.16.</strong> (Abadie-Imbens bias correction) Suppose we match treated unit \\(i\\) to control unit \\(j\\) with \\(X_i \\neq X_j\\). The matching discrepancy contributes bias of order \\(O(n^{-1/p})\\). Describe how bias correction works: fit a regression \\(\\hat{\\mu}_0(x) = \\hat{\\alpha} + \\hat{\\beta}\'x\\) on the control group and replace \\(Y_j\\) with \\(Y_j + \\hat{\\mu}_0(X_i) - \\hat{\\mu}_0(X_j)\\). Why does this reduce bias?',
                    hint: 'The adjustment \\(\\hat{\\mu}_0(X_i) - \\hat{\\mu}_0(X_j) = \\hat{\\beta}\'(X_i - X_j)\\) corrects for the linear component of the outcome difference due to covariate imbalance.',
                    solution: '<p>The raw matching estimator for the ATT at unit \\(i\\) is \\(Y_i - Y_{j(i)}\\). Due to matching discrepancy, \\(\\mathbb{E}[Y_{j(i)} \\mid X_i] \\neq \\mathbb{E}[Y_i(0) \\mid X_i]\\) -- the matched control has different covariates. The bias is approximately:</p>\\[Y_{j(i)} - \\mu_0(X_i) \\approx \\mu_0(X_{j(i)}) - \\mu_0(X_i) \\approx \\nabla\\mu_0(X_i)\'(X_{j(i)} - X_i).\\]<p>The bias correction replaces \\(Y_{j(i)}\\) with \\(Y_{j(i)} + \\hat{\\mu}_0(X_i) - \\hat{\\mu}_0(X_{j(i)})\\), which subtracts the estimated linear trend due to the covariate gap. If \\(\\mu_0\\) is approximately linear, this removes the first-order bias, leaving only higher-order terms of order \\(O(\\|X_i - X_{j(i)}\\|^2)\\). This makes the estimator \\(\\sqrt{n}\\)-consistent under regularity conditions, even when raw matching is not.</p>'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Subclassification & Weighting
        // ================================================================
        {
            id: 'ch08-sec05',
            title: 'Subclassification & Weighting',
            content: `
                <h2>Subclassification & Weighting</h2>

                <p>Subclassification (stratification) and weighting are alternatives to matching that also aim to balance observed covariates between treated and control groups. While matching creates individual pairs, subclassification creates groups, and weighting adjusts the contribution of each observation to the estimator.</p>

                <h3>Subclassification</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.23 (Subclassification Estimator)</div>
                    <div class="env-body">
                        <p>Partition the covariate space into \\(K\\) strata \\(\\{S_1, \\ldots, S_K\\}\\). Within each stratum, compute the within-stratum treatment effect:</p>
                        \\[\\hat{\\tau}_k = \\bar{Y}_{1k} - \\bar{Y}_{0k}\\]
                        <p>where \\(\\bar{Y}_{dk}\\) is the sample mean outcome for group \\(d \\in \\{0,1\\}\\) in stratum \\(k\\). The overall ATE estimator is the weighted average:</p>
                        \\[\\hat{\\tau}_{\\text{sub}} = \\sum_{k=1}^K \\frac{n_k}{n} \\hat{\\tau}_k\\]
                        <p>where \\(n_k\\) is the number of observations in stratum \\(k\\). Cochran (1968) showed that 5 subclasses remove approximately 90% of the bias due to a single covariate.</p>
                    </div>
                </div>

                <h3>Inverse Probability Weighting (IPW)</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.24 (IPW / Horvitz-Thompson Estimator)</div>
                    <div class="env-body">
                        <p>The inverse probability weighted estimator reweights observations by the inverse of their probability of receiving the treatment they actually received:</p>
                        \\[\\hat{\\tau}_{\\text{IPW}} = \\frac{1}{n} \\sum_{i=1}^n \\frac{D_i Y_i}{e(X_i)} - \\frac{1}{n} \\sum_{i=1}^n \\frac{(1-D_i) Y_i}{1 - e(X_i)}\\]
                        <p>where \\(e(X_i) = P(D_i = 1 \\mid X_i)\\) is the propensity score. This creates a <strong>pseudo-population</strong> where treatment is independent of \\(X\\).</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition (IPW as Pseudo-Population)</div>
                    <div class="env-body">
                        <p>Consider a treated unit with \\(e(X_i) = 0.1\\): this individual is unlikely to be treated given their covariates, but was treated anyway. In the control group, individuals with similar covariates are abundant (90% chance of being control). The IPW weight \\(1/0.1 = 10\\) means this treated unit "represents" 10 similar units in the population -- it receives high weight because treated individuals with these covariates are rare. The weighting creates a pseudo-population where covariates are balanced between treated and control groups.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark (Connection to Survey Sampling)</div>
                    <div class="env-body">
                        <p>The Horvitz-Thompson estimator was originally developed for survey sampling, where \\(\\pi_i = P(\\text{unit } i \\text{ is sampled})\\) plays the role of the propensity score. Each sampled unit receives weight \\(1/\\pi_i\\), representing the \\(1/\\pi_i\\) units in the population it "stands for." The causal inference IPW estimator applies this same logic, with treatment assignment playing the role of sampling.</p>
                    </div>
                </div>

                <h3>Normalized Weights (Hajek Estimator)</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.25 (Hajek / Normalized IPW Estimator)</div>
                    <div class="env-body">
                        <p>The Hajek estimator uses normalized weights that sum to one within each group:</p>
                        \\[\\hat{\\tau}_{\\text{Hajek}} = \\frac{\\sum_{i=1}^n D_i Y_i / e(X_i)}{\\sum_{i=1}^n D_i / e(X_i)} - \\frac{\\sum_{i=1}^n (1-D_i) Y_i / (1-e(X_i))}{\\sum_{i=1}^n (1-D_i) / (1-e(X_i))}.\\]
                        <p>The Hajek estimator is more stable than Horvitz-Thompson, especially when propensity scores are extreme, though it introduces a small bias.</p>
                    </div>
                </div>

                <h3>Entropy Balancing</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 8.26 (Entropy Balancing)</div>
                    <div class="env-body">
                        <p>Entropy balancing (Hainmueller, 2012) finds weights \\(\\{w_i\\}\\) for the control group that directly balance covariate moments between treated and reweighted control groups:</p>
                        \\[\\min_{w} \\sum_{i: D_i=0} w_i \\log(w_i)\\]
                        \\[\\text{s.t.} \\quad \\sum_{i: D_i=0} w_i \\, c_r(X_i) = \\bar{c}_{r,1} \\quad \\text{for } r = 1, \\ldots, R\\]
                        <p>where \\(c_r(X_i)\\) are moment conditions (means, variances, etc.) and \\(\\bar{c}_{r,1}\\) are the corresponding moments in the treated group. The entropy objective ensures weights stay close to uniform (maximum entropy), while the constraints guarantee exact balance on specified moments.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark (Entropy Balancing vs IPW)</div>
                    <div class="env-body">
                        <p>Unlike IPW, which achieves balance approximately (and only in large samples), entropy balancing achieves <em>exact</em> finite-sample balance on the targeted moments. It avoids the need to specify a propensity score model: the researcher directly specifies which covariate moments should be balanced. Entropy balancing is a special case of the broader class of <strong>balancing weights</strong> (Zubizarreta, 2015) that includes stable balancing weights and calibration estimators.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-weighting-balance"></div>
            `,
            visualizations: [
                {
                    id: 'viz-weighting-balance',
                    title: 'Before/After Weighting: Covariate Balance',
                    description: 'Compare covariate distributions between treated and control groups before and after IPW reweighting. The standardized mean difference (SMD) measures balance.',
                    setup: function(container, controls) {
                        var width = Math.min(container.clientWidth - 32, 720);
                        var height = Math.round(width * 0.7);
                        var canvas = document.createElement('canvas');
                        var dpr = window.devicePixelRatio || 1;
                        canvas.width = width * dpr;
                        canvas.height = height * dpr;
                        canvas.style.width = width + 'px';
                        canvas.style.height = height + 'px';
                        var ctx = canvas.getContext('2d');
                        ctx.scale(dpr, dpr);
                        container.appendChild(canvas);

                        var showWeighted = false;

                        // Covariate names and imbalance
                        var covNames = ['Age', 'Income', 'Education', 'Health Score', 'Urban'];
                        var nCov = covNames.length;

                        // Unweighted SMDs
                        var smdRaw = [0.45, -0.38, 0.62, -0.25, 0.51];
                        // After IPW weighting
                        var smdWeighted = [0.04, -0.02, 0.06, -0.03, 0.01];

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, width, height);

                            var padL = 110, padR = 40, padT = 50, padB = 60;
                            var plotW = width - padL - padR;
                            var plotH = height - padT - padB;
                            var barH = plotH / nCov * 0.5;
                            var gap = plotH / nCov;

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText(showWeighted ? 'After IPW Weighting' : 'Before Weighting (Raw)', width / 2, 10);

                            // Axes
                            var smdRange = 0.8;
                            function toX(smd) { return padL + plotW * (smd + smdRange) / (2 * smdRange); }

                            // Zero line
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(toX(0), padT);
                            ctx.lineTo(toX(0), padT + plotH);
                            ctx.stroke();

                            // Threshold lines at +/-0.1
                            ctx.strokeStyle = '#f8514944';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(toX(0.1), padT);
                            ctx.lineTo(toX(0.1), padT + plotH);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(toX(-0.1), padT);
                            ctx.lineTo(toX(-0.1), padT + plotH);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // X-axis labels
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var s = -0.8; s <= 0.81; s += 0.2) {
                                ctx.fillText(s.toFixed(1), toX(s), padT + plotH + 8);
                            }
                            ctx.fillText('Standardized Mean Difference (SMD)', width / 2, padT + plotH + 30);

                            var smdVals = showWeighted ? smdWeighted : smdRaw;

                            for (var i = 0; i < nCov; i++) {
                                var cy = padT + gap * i + gap / 2;
                                var smd = smdVals[i];

                                // Covariate name
                                ctx.fillStyle = '#c9d1d9';
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(covNames[i], padL - 10, cy);

                                // Bar
                                var x0 = toX(0);
                                var x1 = toX(smd);
                                var barColor = Math.abs(smd) > 0.1 ? '#f85149' : '#3fb950';
                                ctx.fillStyle = barColor + '99';
                                ctx.fillRect(Math.min(x0, x1), cy - barH / 2, Math.abs(x1 - x0), barH);
                                ctx.strokeStyle = barColor;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(Math.min(x0, x1), cy - barH / 2, Math.abs(x1 - x0), barH);

                                // Value label
                                ctx.fillStyle = '#f0f6fc';
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = smd >= 0 ? 'left' : 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(smd.toFixed(2), x1 + (smd >= 0 ? 6 : -6), cy);
                            }

                            // Legend
                            ctx.fillStyle = '#3fb950';
                            ctx.fillRect(padL, padT + plotH + 42, 12, 10);
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('|SMD| < 0.1 (balanced)', padL + 16, padT + plotH + 47);

                            ctx.fillStyle = '#f85149';
                            ctx.fillRect(padL + 160, padT + plotH + 42, 12, 10);
                            ctx.fillStyle = '#8b949e';
                            ctx.fillText('|SMD| >= 0.1 (imbalanced)', padL + 176, padT + plotH + 47);
                        }

                        draw();

                        VizEngine.createButton(controls, 'Before Weighting (Raw)', function() { showWeighted = false; draw(); });
                        VizEngine.createButton(controls, 'After IPW Weighting', function() { showWeighted = true; draw(); });

                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: '<strong>Exercise 8.17.</strong> Cochran (1968) showed that subclassification into 5 groups on a single covariate removes about 90% of the bias. Verify this for a normal confounder: if \\(X \\mid D=1 \\sim N(\\mu_1, 1)\\) and \\(X \\mid D=0 \\sim N(0, 1)\\), compute the residual bias after stratifying into quintiles of \\(X\\).',
                    hint: 'Within each quintile stratum, the bias is \\(\\mathbb{E}[X \\mid D=1, X \\in S_k] - \\mathbb{E}[X \\mid D=0, X \\in S_k]\\). For normal distributions truncated to the same interval, this difference is small.',
                    solution: '<p>Let the quintile boundaries be \\(q_1 < q_2 < q_3 < q_4\\) based on the pooled distribution. Within stratum \\(k = [q_{k-1}, q_k]\\), the conditional expectations are \\(\\mathbb{E}[X \\mid X \\in S_k, D=d]\\) for \\(d \\in \\{0,1\\}\\). For \\(N(\\mu_1, 1)\\) vs \\(N(0,1)\\) both truncated to the same interval, the means differ by approximately \\(\\mu_1 \\cdot \\text{Var}(X \\mid X \\in S_k) / \\text{Var}(X)\\). Since \\(\\text{Var}(X \\mid X \\in S_k) \\approx \\text{Var}(X) / K^2\\) for fine strata, the within-stratum bias scales as \\(\\mu_1 / K^2\\). With \\(K = 5\\), the residual bias is roughly \\(\\mu_1 / 25 \\approx 4\\%\\) of the original \\(\\mu_1\\), confirming that about \\(96\\%\\) of the bias is removed (even better than 90% for normal distributions).</p>'
                },
                {
                    question: '<strong>Exercise 8.18.</strong> Show that the Horvitz-Thompson IPW estimator \\(\\hat{\\tau}_{\\text{IPW}} = \\frac{1}{n}\\sum_i \\frac{D_i Y_i}{e(X_i)} - \\frac{1}{n}\\sum_i \\frac{(1-D_i)Y_i}{1-e(X_i)}\\) is unbiased for the ATE under unconfoundedness and known propensity scores.',
                    hint: 'Use iterated expectations: \\(\\mathbb{E}\\left[\\frac{D_i Y_i}{e(X_i)}\\right] = \\mathbb{E}\\left[\\mathbb{E}\\left[\\frac{D_i Y_i}{e(X_i)} \\mid X_i\\right]\\right]\\). Then use \\(\\mathbb{E}[D_i \\mid X_i] = e(X_i)\\) and unconfoundedness.',
                    solution: '<p>By iterated expectations:</p>\\[\\mathbb{E}\\left[\\frac{D_i Y_i}{e(X_i)}\\right] = \\mathbb{E}\\left[\\frac{\\mathbb{E}[D_i Y_i \\mid X_i]}{e(X_i)}\\right] = \\mathbb{E}\\left[\\frac{e(X_i) \\cdot \\mathbb{E}[Y_i \\mid D_i=1, X_i]}{e(X_i)}\\right] = \\mathbb{E}[\\mathbb{E}[Y_i(1) \\mid X_i]] = \\mathbb{E}[Y_i(1)]\\]<p>where we used unconfoundedness (\\(\\mathbb{E}[Y_i \\mid D_i=1, X_i] = \\mathbb{E}[Y_i(1) \\mid X_i]\\)) in the third step. Similarly, \\(\\mathbb{E}\\left[\\frac{(1-D_i)Y_i}{1-e(X_i)}\\right] = \\mathbb{E}[Y_i(0)]\\). Therefore \\(\\mathbb{E}[\\hat{\\tau}_{\\text{IPW}}] = \\mathbb{E}[Y_i(1)] - \\mathbb{E}[Y_i(0)] = \\tau_{\\text{ATE}}\\).</p>'
                },
                {
                    question: '<strong>Exercise 8.19.</strong> Why are extreme propensity scores (near 0 or 1) problematic for IPW? What is the practical consequence, and how does trimming or truncation help?',
                    hint: 'Consider the weight \\(1/e(X_i)\\) when \\(e(X_i) \\approx 0.01\\). What does this imply for the variance of the estimator?',
                    solution: '<p>When \\(e(X_i) \\approx 0\\), the weight \\(1/e(X_i) \\to \\infty\\). A single treated unit with \\(e(X_i) = 0.01\\) receives weight 100, dominating the entire estimator. This causes:</p><ol><li><strong>High variance</strong>: The effective sample size \\(n_{\\text{eff}} = (\\sum w_i)^2 / \\sum w_i^2\\) can be very small.</li><li><strong>Sensitivity to misspecification</strong>: If the propensity score model is even slightly wrong for these extreme cases, the bias can be large.</li><li><strong>Violation of overlap</strong>: \\(e(X_i) \\approx 0\\) means no comparable controls exist -- we are extrapolating rather than interpolating.</li></ol><p><strong>Trimming</strong> discards observations with \\(e(X_i) < \\alpha\\) or \\(e(X_i) > 1 - \\alpha\\) (e.g., \\(\\alpha = 0.05\\)), changing the estimand to a "trimmed ATE" for the overlap population. <strong>Truncation</strong> caps weights at a maximum value. Both reduce variance at the cost of some bias and a change in the target population.</p>'
                }
            ]
        }
    ]
});
