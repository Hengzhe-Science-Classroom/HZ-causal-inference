window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch13',
    number: 13,
    title: 'Regression Discontinuity Design',
    subtitle: 'Causal Inference at the Cutoff 回归断点设计',
    sections: [
        // ============================================================
        // SECTION 1: Sharp RDD
        // ============================================================
        {
            id: 'ch13-sec01',
            title: 'Sharp RDD',
            content: `
                <h2>Sharp RDD</h2>

                <p>The <strong>Regression Discontinuity Design</strong> (RDD) is one of the most credible quasi-experimental methods for causal inference. It exploits a known rule that assigns treatment based on whether a continuous <strong>running variable</strong> (also called the forcing variable or score) crosses a known <strong>cutoff</strong>.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 13.1 (Sharp RDD Setup)</div>
                    <div class="env-body">
                        <p>Let \\(X_i\\) be a continuous running variable and \\(c\\) a known cutoff. In a <strong>sharp RDD</strong>, treatment assignment is a deterministic function of the running variable:</p>
                        \\[W_i = \\mathbf{1}(X_i \\geq c),\\]
                        <p>so that every unit with \\(X_i \\geq c\\) is treated and every unit with \\(X_i < c\\) is untreated. There is no deviation from the assignment rule.</p>
                    </div>
                </div>

                <p>The key insight is that units just above and just below the cutoff are nearly identical in all respects except treatment status. By comparing outcomes of units infinitesimally close to the cutoff on either side, we can identify a causal effect.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 13.2 (Sharp RDD Estimand)</div>
                    <div class="env-body">
                        <p>The sharp RDD estimand is the <strong>average treatment effect at the cutoff</strong>:</p>
                        \\[\\tau_{\\text{SRD}} = \\lim_{x \\downarrow c} \\mathbb{E}[Y_i \\mid X_i = x] \\;-\\; \\lim_{x \\uparrow c} \\mathbb{E}[Y_i \\mid X_i = x].\\]
                        <p>This is the difference between the right-limit and the left-limit of the conditional expectation function \\(\\mathbb{E}[Y \\mid X = x]\\) at the cutoff \\(c\\).</p>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 13.1 (Identification in Sharp RDD)</div>
                    <div class="env-body">
                        <p>Suppose the conditional expectation functions \\(\\mathbb{E}[Y_i(1) \\mid X_i = x]\\) and \\(\\mathbb{E}[Y_i(0) \\mid X_i = x]\\) are <strong>continuous at \\(x = c\\)</strong>. Then</p>
                        \\[\\tau_{\\text{SRD}} = \\mathbb{E}[Y_i(1) - Y_i(0) \\mid X_i = c].\\]
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition: Continuity as Local Randomization</div>
                    <div class="env-body">
                        <p>The continuity assumption means that in the absence of treatment, the outcome would change smoothly as we pass through the cutoff. Any <em>discontinuous jump</em> in the outcome at the cutoff must therefore be caused by the treatment. Think of units near the cutoff as being "as-if randomly assigned" &mdash; a student who scored 89.9 on an exam is essentially identical to one who scored 90.1, except that the latter crosses a scholarship threshold.</p>
                    </div>
                </div>

                <h3>Classic Examples</h3>

                <ul>
                    <li><strong>Election margins:</strong> Lee (2008) studied the effect of incumbency by comparing candidates who barely won vs. barely lost elections. The running variable is the vote margin; the cutoff is 50%.</li>
                    <li><strong>Test score cutoffs:</strong> Students scoring above a threshold receive scholarships, remedial programs, or admission to selective schools. The running variable is the test score.</li>
                    <li><strong>Age-based policies:</strong> Many policies use age cutoffs (e.g., legal drinking age at 21, Medicare eligibility at 65). The running variable is age.</li>
                    <li><strong>Geographic boundaries:</strong> Comparing outcomes just inside vs. outside a policy zone (minimum wage differences across state borders).</li>
                </ul>

                <h3>Estimation</h3>

                <p>In practice, we do not observe units exactly at the cutoff. Instead, we use units in a <strong>bandwidth</strong> \\(h\\) around the cutoff and fit local regressions:</p>
                \\[Y_i = \\alpha + \\tau \\cdot W_i + f(X_i - c) + \\varepsilon_i, \\quad \\text{for } |X_i - c| \\leq h,\\]
                <p>where \\(f(\\cdot)\\) is a flexible function (often a local linear or local polynomial). The coefficient \\(\\tau\\) estimates the treatment effect at the cutoff.</p>

                <div class="env-block remark">
                    <div class="env-title">Remark: Local Nature of RDD</div>
                    <div class="env-body">
                        <p>The RDD identifies a treatment effect only at the cutoff \\(x = c\\), not the average treatment effect across the entire population. This is both a strength (high internal validity) and a limitation (restricted external validity). The estimated effect applies to the subpopulation of units with \\(X_i\\) near \\(c\\).</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-sharp-rdd"></div>
            `,
            visualizations: [
                {
                    id: 'viz-sharp-rdd',
                    title: 'Interactive Sharp RDD',
                    description: 'Observe the discontinuity in outcomes at the cutoff. Adjust the bandwidth and polynomial order to see how the local regression fit changes.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { width: 700, height: 450, scale: 1, originX: 60, originY: 390 });
                        var ctx = viz.ctx;

                        var bandwidth = 2.0;
                        var polyOrder = 1;
                        var trueEffect = 3.0;
                        var nPoints = 200;

                        VizEngine.createSlider(controls, 'Bandwidth h', 0.5, 5.0, 2.0, 0.1, function(v) {
                            bandwidth = parseFloat(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Poly Order', 1, 3, 1, 1, function(v) {
                            polyOrder = parseInt(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'True Effect', 0, 6, 3.0, 0.5, function(v) {
                            trueEffect = parseFloat(v);
                            generateData();
                            draw();
                        });

                        function mulberry32(a) {
                            return function() {
                                a |= 0; a = a + 0x6D2B79F5 | 0;
                                var t = Math.imul(a ^ a >>> 15, 1 | a);
                                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                                return ((t ^ t >>> 14) >>> 0) / 4294967296;
                            };
                        }

                        function randn(rng) {
                            var u = rng(), v = rng();
                            return Math.sqrt(-2 * Math.log(u + 1e-10)) * Math.cos(2 * Math.PI * v);
                        }

                        var data = [];
                        var cutoff = 5;
                        var xMin = 0, xMax = 10;

                        function generateData() {
                            var rng = mulberry32(42);
                            data = [];
                            for (var i = 0; i < nPoints; i++) {
                                var x = xMin + (xMax - xMin) * rng();
                                var treated = x >= cutoff ? 1 : 0;
                                var y0 = 2 + 0.8 * (x - cutoff) + 0.1 * Math.pow(x - cutoff, 2) + 1.2 * randn(rng);
                                var y = y0 + treated * trueEffect;
                                data.push({ x: x, y: y, w: treated });
                            }
                        }

                        function polyFit(pts, order) {
                            if (pts.length < order + 1) return null;
                            var n = pts.length;
                            var k = order + 1;
                            var X = [];
                            var Y = [];
                            for (var i = 0; i < n; i++) {
                                var row = [];
                                for (var j = 0; j < k; j++) {
                                    row.push(Math.pow(pts[i].x, j));
                                }
                                X.push(row);
                                Y.push(pts[i].y);
                            }
                            var XtX = [];
                            var XtY = [];
                            for (var i = 0; i < k; i++) {
                                XtX.push([]);
                                XtY.push(0);
                                for (var j = 0; j < k; j++) {
                                    var s = 0;
                                    for (var m = 0; m < n; m++) s += X[m][i] * X[m][j];
                                    XtX[i].push(s);
                                }
                                for (var m = 0; m < n; m++) XtY[i] += X[m][i] * Y[m];
                            }
                            // Solve with Gaussian elimination
                            var A = [];
                            for (var i = 0; i < k; i++) {
                                A.push(XtX[i].concat(XtY[i]));
                            }
                            for (var col = 0; col < k; col++) {
                                var maxRow = col;
                                for (var row = col + 1; row < k; row++) {
                                    if (Math.abs(A[row][col]) > Math.abs(A[maxRow][col])) maxRow = row;
                                }
                                var tmp = A[col]; A[col] = A[maxRow]; A[maxRow] = tmp;
                                if (Math.abs(A[col][col]) < 1e-12) return null;
                                for (var row = col + 1; row < k; row++) {
                                    var f = A[row][col] / A[col][col];
                                    for (var j = col; j <= k; j++) A[row][j] -= f * A[col][j];
                                }
                            }
                            var beta = new Array(k);
                            for (var i = k - 1; i >= 0; i--) {
                                beta[i] = A[i][k];
                                for (var j = i + 1; j < k; j++) beta[i] -= A[i][j] * beta[j];
                                beta[i] /= A[i][i];
                            }
                            return beta;
                        }

                        function evalPoly(beta, x) {
                            var v = 0;
                            for (var j = 0; j < beta.length; j++) v += beta[j] * Math.pow(x, j);
                            return v;
                        }

                        function toScreenX(x) { return 60 + (x - xMin) / (xMax - xMin) * 580; }
                        function toScreenY(y) { return 390 - (y + 2) / 14 * 350; }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, 700, 450);

                            // Bandwidth region
                            var bwLeft = toScreenX(cutoff - bandwidth);
                            var bwRight = toScreenX(cutoff + bandwidth);
                            ctx.fillStyle = '#58a6ff11';
                            ctx.fillRect(bwLeft, 30, bwRight - bwLeft, 370);

                            // Cutoff line
                            var cx = toScreenX(cutoff);
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(cx, 30);
                            ctx.lineTo(cx, 400);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(60, 390);
                            ctx.lineTo(640, 390);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(60, 390);
                            ctx.lineTo(60, 30);
                            ctx.stroke();

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var t = 0; t <= 10; t += 2) {
                                var tx = toScreenX(t);
                                ctx.fillText(t.toString(), tx, 394);
                            }
                            ctx.textAlign = 'center';
                            ctx.fillText('Running Variable X', 350, 430);

                            ctx.save();
                            ctx.translate(15, 210);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.fillText('Outcome Y', 0, 0);
                            ctx.restore();

                            // Data points
                            for (var i = 0; i < data.length; i++) {
                                var d = data[i];
                                var sx = toScreenX(d.x);
                                var sy = toScreenY(d.y);
                                var inBand = Math.abs(d.x - cutoff) <= bandwidth;
                                var col = d.w ? viz.colors.blue : viz.colors.orange;
                                ctx.fillStyle = inBand ? col + 'aa' : col + '33';
                                ctx.beginPath();
                                ctx.arc(sx, sy, inBand ? 4 : 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Fit local polynomials
                            var leftPts = [];
                            var rightPts = [];
                            for (var i = 0; i < data.length; i++) {
                                var d = data[i];
                                if (d.x >= cutoff - bandwidth && d.x < cutoff) leftPts.push({ x: d.x - cutoff, y: d.y });
                                if (d.x >= cutoff && d.x <= cutoff + bandwidth) rightPts.push({ x: d.x - cutoff, y: d.y });
                            }

                            var betaL = polyFit(leftPts, polyOrder);
                            var betaR = polyFit(rightPts, polyOrder);

                            if (betaL) {
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                var started = false;
                                for (var px = cutoff - bandwidth; px <= cutoff - 0.01; px += 0.05) {
                                    var fy = evalPoly(betaL, px - cutoff);
                                    var sx = toScreenX(px);
                                    var sy = toScreenY(fy);
                                    if (!started) { ctx.moveTo(sx, sy); started = true; }
                                    else ctx.lineTo(sx, sy);
                                }
                                ctx.stroke();
                            }

                            if (betaR) {
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                var started2 = false;
                                for (var px = cutoff; px <= cutoff + bandwidth; px += 0.05) {
                                    var fy = evalPoly(betaR, px - cutoff);
                                    var sx = toScreenX(px);
                                    var sy = toScreenY(fy);
                                    if (!started2) { ctx.moveTo(sx, sy); started2 = true; }
                                    else ctx.lineTo(sx, sy);
                                }
                                ctx.stroke();
                            }

                            // Estimated effect
                            if (betaL && betaR) {
                                var yLeft = evalPoly(betaL, 0);
                                var yRight = evalPoly(betaR, 0);
                                var est = yRight - yLeft;

                                var syL = toScreenY(yLeft);
                                var syR = toScreenY(yRight);

                                // Arrow showing the jump
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.moveTo(cx + 10, syL);
                                ctx.lineTo(cx + 10, syR);
                                ctx.stroke();
                                // Arrowhead
                                ctx.fillStyle = viz.colors.green;
                                ctx.beginPath();
                                ctx.moveTo(cx + 10, syR);
                                ctx.lineTo(cx + 5, syR + 8);
                                ctx.lineTo(cx + 15, syR + 8);
                                ctx.closePath();
                                ctx.fill();

                                // Horizontal dashes at limit points
                                ctx.setLineDash([3, 3]);
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(cx - 20, syL);
                                ctx.lineTo(cx + 5, syL);
                                ctx.stroke();
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.moveTo(cx - 5, syR);
                                ctx.lineTo(cx + 25, syR);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // Effect label
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('tau = ' + est.toFixed(2), cx + 20, (syL + syR) / 2);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('(true: ' + trueEffect.toFixed(1) + ')', cx + 20, (syL + syR) / 2 + 16);
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.arc(490, 50, 5, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Control (X < c)', 500, 50);

                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath();
                            ctx.arc(490, 70, 5, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Treated (X >= c)', 500, 70);

                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('Cutoff c = ' + cutoff, cx, 28);
                        }

                        generateData();
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Consider the sharp RDD where \\(W_i = \\mathbf{1}(X_i \\geq c)\\). Under the continuity assumption, show that \\(\\tau_{\\text{SRD}} = \\mathbb{E}[Y_i(1) - Y_i(0) \\mid X_i = c]\\). Why is the continuity of \\(\\mathbb{E}[Y_i(0) \\mid X_i = x]\\) at \\(c\\) essential?',
                    hint: 'Use the fact that for \\(x \\geq c\\), \\(\\mathbb{E}[Y \\mid X = x] = \\mathbb{E}[Y(1) \\mid X = x]\\), and for \\(x < c\\), \\(\\mathbb{E}[Y \\mid X = x] = \\mathbb{E}[Y(0) \\mid X = x]\\). Take limits and apply continuity.',
                    solution: 'For \\(x \\geq c\\), \\(\\mathbb{E}[Y \\mid X = x] = \\mathbb{E}[Y(1) \\mid X = x]\\) since all units are treated. For \\(x < c\\), \\(\\mathbb{E}[Y \\mid X = x] = \\mathbb{E}[Y(0) \\mid X = x]\\). So \\(\\tau_{\\text{SRD}} = \\lim_{x \\downarrow c} \\mathbb{E}[Y(1) \\mid X = x] - \\lim_{x \\uparrow c} \\mathbb{E}[Y(0) \\mid X = x]\\). By continuity of both conditional expectations at \\(c\\), these limits equal \\(\\mathbb{E}[Y(1) \\mid X = c]\\) and \\(\\mathbb{E}[Y(0) \\mid X = c]\\). Without continuity of \\(\\mathbb{E}[Y(0) \\mid X = x]\\) at \\(c\\), the left-limit might differ from \\(\\mathbb{E}[Y(0) \\mid X = c]\\), and we could not attribute the jump solely to treatment.'
                },
                {
                    question: 'Why is the RDD treatment effect inherently local? Explain why \\(\\tau_{\\text{SRD}}\\) may differ from the average treatment effect \\(\\mathbb{E}[Y(1) - Y(0)]\\) and when this matters for policy.',
                    hint: 'Think about heterogeneous treatment effects: the effect for units near the cutoff may differ from effects for units far from the cutoff.',
                    solution: 'The RDD identifies the treatment effect only at \\(X = c\\), i.e., for the subpopulation of units with running variable values near the cutoff. If treatment effects vary with \\(X\\) (heterogeneous effects), then \\(\\mathbb{E}[Y(1) - Y(0) \\mid X = c] \\neq \\mathbb{E}[Y(1) - Y(0)]\\). For example, if a scholarship cutoff is at 80 points, the RDD estimates the effect for students scoring near 80, which may differ from the effect for students scoring 60 or 95. This matters when policymakers want to know the effect of extending the program to a broader population.'
                },
                {
                    question: 'In a sharp RDD with running variable \\(X_i\\) (exam score) and cutoff \\(c = 70\\), explain why using a global polynomial regression \\(Y_i = \\sum_{k=0}^{p} \\beta_k X_i^k + \\tau W_i + \\varepsilon_i\\) on the full sample is problematic. What is the recommended alternative?',
                    hint: 'High-order global polynomials can produce erratic behavior, especially at boundaries. Think about the Runge phenomenon.',
                    solution: 'Global polynomial regression can lead to overfitting and is sensitive to observations far from the cutoff (Gelman and Imbens, 2019). High-order polynomials exhibit Runge-type oscillations near boundaries, producing noisy and unreliable estimates. The estimates are also highly sensitive to polynomial order. The recommended alternative is local linear (or local polynomial) regression within a bandwidth \\(h\\) of the cutoff, using kernel weights that give more influence to observations closer to \\(c\\). This approach focuses on the most informative observations and avoids extrapolation artifacts.'
                },
                {
                    question: 'Suppose you observe a dataset where students who score above 60 on a placement test are assigned to an advanced math class (treatment). You want to estimate the effect of the advanced class on final grades using an RDD. Describe the key assumptions, the estimand, and potential threats to validity.',
                    hint: 'Think about whether students can manipulate their score, whether the assignment rule is sharp, and what the continuity assumption requires here.',
                    solution: 'The running variable is the placement test score, cutoff \\(c = 60\\), and \\(W_i = \\mathbf{1}(\\text{score}_i \\geq 60)\\). The estimand is the causal effect of the advanced class on final grades for students scoring near 60. Key assumptions: (1) Continuity: potential outcomes are continuous in the test score at 60, meaning students just above and below 60 have similar academic potential. (2) No manipulation: students cannot precisely control their score to land just above or below 60. Threats include: students retaking the test to cross the threshold (manipulation), teachers knowing the cutoff and adjusting scores (running variable contamination), or the cutoff coinciding with other policy changes (confounded discontinuity).'
                }
            ]
        },

        // ============================================================
        // SECTION 2: Fuzzy RDD
        // ============================================================
        {
            id: 'ch13-sec02',
            title: 'Fuzzy RDD',
            content: `
                <h2>Fuzzy RDD</h2>

                <p>In many real-world settings, crossing the cutoff does not deterministically determine treatment. Instead, the <em>probability</em> of treatment jumps at the cutoff, but does not go from 0 to 1. This is the <strong>fuzzy RDD</strong>.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 13.3 (Fuzzy RDD)</div>
                    <div class="env-body">
                        <p>In a <strong>fuzzy RDD</strong>, the probability of treatment has a discontinuity at the cutoff \\(c\\), but some units above the cutoff remain untreated and/or some units below the cutoff are treated:</p>
                        \\[\\lim_{x \\downarrow c} \\mathbb{E}[W_i \\mid X_i = x] \\neq \\lim_{x \\uparrow c} \\mathbb{E}[W_i \\mid X_i = x],\\]
                        <p>but the gap is strictly between 0 and 1 (rather than exactly 1 as in the sharp case).</p>
                    </div>
                </div>

                <h3>The Fuzzy RDD Estimand</h3>

                <p>When treatment take-up is imperfect, we cannot simply compare outcomes at the cutoff. Instead, we use the ratio of the jump in the outcome to the jump in treatment probability:</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 13.4 (Fuzzy RDD Estimand)</div>
                    <div class="env-body">
                        <p>The fuzzy RDD estimand is</p>
                        \\[\\tau_{\\text{FRD}} = \\frac{\\lim_{x \\downarrow c} \\mathbb{E}[Y_i \\mid X_i = x] - \\lim_{x \\uparrow c} \\mathbb{E}[Y_i \\mid X_i = x]}{\\lim_{x \\downarrow c} \\mathbb{E}[W_i \\mid X_i = x] - \\lim_{x \\uparrow c} \\mathbb{E}[W_i \\mid X_i = x]}.\\]
                        <p>This is the ratio of the <strong>reduced-form jump</strong> (in \\(Y\\)) to the <strong>first-stage jump</strong> (in \\(W\\)).</p>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 13.2 (Fuzzy RDD as Local Wald Estimator)</div>
                    <div class="env-body">
                        <p>Under the continuity assumption and a local monotonicity condition (crossing the cutoff can only increase, or only decrease, the probability of treatment), the fuzzy RDD estimand equals a <strong>local Wald/IV estimand</strong>:</p>
                        \\[\\tau_{\\text{FRD}} = \\mathbb{E}[Y_i(1) - Y_i(0) \\mid X_i = c, \\text{complier}],\\]
                        <p>where "compliers" are units whose treatment status changes at the cutoff. This is a <strong>local average treatment effect</strong> (LATE) for compliers at \\(X = c\\).</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition: Fuzzy RDD as Local IV</div>
                    <div class="env-body">
                        <p>Think of the indicator \\(Z_i = \\mathbf{1}(X_i \\geq c)\\) as an <strong>instrument</strong> for the actual treatment \\(W_i\\). Crossing the cutoff (the instrument) encourages treatment but does not perfectly determine it. The reduced form is the effect of crossing the cutoff on the outcome; the first stage is the effect of crossing the cutoff on treatment take-up. Their ratio &mdash; the Wald estimator &mdash; recovers the LATE for compliers, just as in a standard IV framework.</p>
                    </div>
                </div>

                <h3>Estimation via 2SLS</h3>

                <p>The fuzzy RDD is often estimated using two-stage least squares (2SLS) within the bandwidth:</p>

                <p><strong>First stage:</strong></p>
                \\[W_i = \\gamma_0 + \\gamma_1 \\cdot Z_i + g(X_i - c) + \\nu_i, \\quad |X_i - c| \\leq h,\\]

                <p><strong>Second stage:</strong></p>
                \\[Y_i = \\alpha + \\tau \\cdot \\hat{W}_i + f(X_i - c) + \\varepsilon_i, \\quad |X_i - c| \\leq h,\\]

                <p>where \\(Z_i = \\mathbf{1}(X_i \\geq c)\\) is the instrument and \\(\\hat{W}_i\\) is the first-stage predicted value. The functions \\(f\\) and \\(g\\) are typically local linear, allowed to differ on either side of the cutoff.</p>

                <div class="env-block example">
                    <div class="env-title">Example 13.1 (Financial Aid Eligibility)</div>
                    <div class="env-body">
                        <p>Students scoring above 1200 on a standardized test are <em>eligible</em> for financial aid, but not all eligible students apply. Suppose \\(\\Pr(W = 1 \\mid X \\geq 1200) = 0.7\\) and \\(\\Pr(W = 1 \\mid X < 1200) = 0.2\\). The first-stage jump is \\(0.7 - 0.2 = 0.5\\). If the outcome jump (in GPA) at the cutoff is 0.15, then \\(\\tau_{\\text{FRD}} = 0.15 / 0.5 = 0.30\\). Financial aid increases GPA by 0.30 for compliers at the cutoff.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-fuzzy-rdd"></div>
            `,
            visualizations: [
                {
                    id: 'viz-fuzzy-rdd',
                    title: 'Fuzzy RDD: First Stage and Reduced Form',
                    description: 'The top panel shows the first-stage jump in treatment probability. The bottom panel shows the reduced-form jump in outcomes. The fuzzy RDD estimate is the ratio of the two jumps.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { width: 700, height: 520, scale: 1, originX: 60, originY: 260 });
                        var ctx = viz.ctx;

                        var compliance = 0.6;
                        var trueEffect = 3.0;

                        VizEngine.createSlider(controls, 'Compliance Rate', 0.2, 1.0, 0.6, 0.05, function(v) {
                            compliance = parseFloat(v);
                            generateFuzzyData();
                            draw();
                        });
                        VizEngine.createSlider(controls, 'True LATE', 0, 6, 3.0, 0.5, function(v) {
                            trueEffect = parseFloat(v);
                            generateFuzzyData();
                            draw();
                        });

                        function mulberry32(a) {
                            return function() {
                                a |= 0; a = a + 0x6D2B79F5 | 0;
                                var t = Math.imul(a ^ a >>> 15, 1 | a);
                                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                                return ((t ^ t >>> 14) >>> 0) / 4294967296;
                            };
                        }

                        function randn(rng) {
                            var u = rng(), v = rng();
                            return Math.sqrt(-2 * Math.log(u + 1e-10)) * Math.cos(2 * Math.PI * v);
                        }

                        var cutoff = 5;
                        var xMin = 0, xMax = 10;
                        var nPoints = 200;
                        var fuzzyData = [];

                        function generateFuzzyData() {
                            var rng = mulberry32(123);
                            fuzzyData = [];
                            var baselineCompliance = 0.1;
                            for (var i = 0; i < nPoints; i++) {
                                var x = xMin + (xMax - xMin) * rng();
                                var eligible = x >= cutoff ? 1 : 0;
                                var pTreat = eligible ? (baselineCompliance + compliance) : baselineCompliance;
                                pTreat = Math.min(pTreat, 1);
                                var w = rng() < pTreat ? 1 : 0;
                                var y0 = 2 + 0.5 * (x - cutoff) + 1.0 * randn(rng);
                                var y = y0 + w * trueEffect;
                                fuzzyData.push({ x: x, y: y, w: w, eligible: eligible });
                            }
                        }

                        function toSX(x) { return 60 + (x - xMin) / (xMax - xMin) * 580; }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, 700, 520);

                            var cx = toSX(cutoff);

                            // === Top panel: First stage (treatment probability) ===
                            var topY0 = 20, topY1 = 230;
                            var topH = topY1 - topY0;

                            function toTopY(p) { return topY1 - p * (topH - 30); }

                            // Panel label
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            ctx.fillText('First Stage: P(Treatment | X)', 65, topY0 + 2);

                            // Cutoff line
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 3]);
                            ctx.beginPath();
                            ctx.moveTo(cx, topY0 + 20);
                            ctx.lineTo(cx, topY1);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(60, topY1);
                            ctx.lineTo(640, topY1);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(60, topY1);
                            ctx.lineTo(60, topY0 + 15);
                            ctx.stroke();

                            // Compute binned treatment probabilities
                            var nBins = 20;
                            var binWidth = (xMax - xMin) / nBins;
                            var bins = [];
                            for (var b = 0; b < nBins; b++) {
                                var lo = xMin + b * binWidth;
                                var hi = lo + binWidth;
                                var treated = 0, total = 0;
                                for (var i = 0; i < fuzzyData.length; i++) {
                                    if (fuzzyData[i].x >= lo && fuzzyData[i].x < hi) {
                                        total++;
                                        if (fuzzyData[i].w) treated++;
                                    }
                                }
                                bins.push({ xMid: (lo + hi) / 2, p: total > 0 ? treated / total : 0, n: total });
                            }

                            // Plot binned probabilities
                            for (var b = 0; b < bins.length; b++) {
                                if (bins[b].n < 2) continue;
                                var sx = toSX(bins[b].xMid);
                                var sy = toTopY(bins[b].p);
                                var col = bins[b].xMid >= cutoff ? viz.colors.blue : viz.colors.orange;
                                ctx.fillStyle = col;
                                ctx.beginPath();
                                ctx.arc(sx, sy, 5, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // First-stage jump annotation
                            var pLeft = 0.1;
                            var pRight = Math.min(0.1 + compliance, 1);
                            var syLeft = toTopY(pLeft);
                            var syRight = toTopY(pRight);

                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(cx + 12, syLeft);
                            ctx.lineTo(cx + 12, syRight);
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Jump = ' + compliance.toFixed(2), cx + 18, (syLeft + syRight) / 2);

                            // Y-axis labels for top panel
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var p = 0; p <= 1.0; p += 0.25) {
                                ctx.fillText(p.toFixed(2), 56, toTopY(p));
                            }

                            // === Bottom panel: Reduced form (outcome) ===
                            var botY0 = 260, botY1 = 490;

                            function toBotY(y) { return botY1 - (y + 2) / 12 * (botY1 - botY0 - 20); }

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Reduced Form: E[Y | X]', 65, botY0 + 2);

                            // Cutoff
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 3]);
                            ctx.beginPath();
                            ctx.moveTo(cx, botY0 + 20);
                            ctx.lineTo(cx, botY1);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(60, botY1);
                            ctx.lineTo(640, botY1);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(60, botY1);
                            ctx.lineTo(60, botY0 + 15);
                            ctx.stroke();

                            // Data points
                            for (var i = 0; i < fuzzyData.length; i++) {
                                var d = fuzzyData[i];
                                var sx = toSX(d.x);
                                var sy = toBotY(d.y);
                                var col = d.eligible ? viz.colors.blue : viz.colors.orange;
                                ctx.fillStyle = col + '55';
                                ctx.beginPath();
                                ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Compute binned outcome means
                            var yBins = [];
                            for (var b = 0; b < nBins; b++) {
                                var lo = xMin + b * binWidth;
                                var hi = lo + binWidth;
                                var sum = 0, cnt = 0;
                                for (var i = 0; i < fuzzyData.length; i++) {
                                    if (fuzzyData[i].x >= lo && fuzzyData[i].x < hi) {
                                        sum += fuzzyData[i].y;
                                        cnt++;
                                    }
                                }
                                yBins.push({ xMid: (lo + hi) / 2, mean: cnt > 0 ? sum / cnt : 0, n: cnt });
                            }

                            // Left and right means at cutoff (simple averages of bins near cutoff)
                            var leftBinMeans = [];
                            var rightBinMeans = [];
                            for (var b = 0; b < yBins.length; b++) {
                                if (yBins[b].n < 2) continue;
                                if (yBins[b].xMid < cutoff) leftBinMeans.push(yBins[b].mean);
                                else rightBinMeans.push(yBins[b].mean);
                            }

                            // Simple linear extrapolation to cutoff
                            var reducedFormJump = 0;
                            if (leftBinMeans.length > 0 && rightBinMeans.length > 0) {
                                var leftAtC = leftBinMeans[leftBinMeans.length - 1];
                                var rightAtC = rightBinMeans[0];
                                reducedFormJump = rightAtC - leftAtC;

                                var syL2 = toBotY(leftAtC);
                                var syR2 = toBotY(rightAtC);

                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(cx + 12, syL2);
                                ctx.lineTo(cx + 12, syR2);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('Jump = ' + reducedFormJump.toFixed(2), cx + 18, (syL2 + syR2) / 2);
                            }

                            // Fuzzy RDD estimate
                            var frdEstimate = compliance > 0.01 ? reducedFormJump / compliance : NaN;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var estText = isFinite(frdEstimate) ? frdEstimate.toFixed(2) : 'N/A';
                            ctx.fillText('Fuzzy RDD Estimate: ' + reducedFormJump.toFixed(2) + ' / ' + compliance.toFixed(2) + ' = ' + estText, 350, 500);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('(True LATE = ' + trueEffect.toFixed(1) + ')', 350, 516);
                        }

                        generateFuzzyData();
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the fuzzy RDD estimand \\(\\tau_{\\text{FRD}}\\) can be written as a Wald/IV estimand with instrument \\(Z_i = \\mathbf{1}(X_i \\geq c)\\). What are the exclusion restriction and relevance condition in this context?',
                    hint: 'The instrument \\(Z\\) is being above/below the cutoff. Map the standard IV assumptions (relevance, exclusion, independence) to the RDD setting.',
                    solution: 'With \\(Z_i = \\mathbf{1}(X_i \\geq c)\\), the Wald estimator is \\(\\frac{\\mathbb{E}[Y | Z = 1] - \\mathbb{E}[Y | Z = 0]}{\\mathbb{E}[W | Z = 1] - \\mathbb{E}[W | Z = 0]}\\). In the RDD, this is evaluated locally at \\(X = c\\), giving the fuzzy RDD ratio. Relevance requires a nonzero first-stage jump in treatment probability at the cutoff. The exclusion restriction (in RDD context) requires that crossing the cutoff affects outcomes only through its effect on treatment, not directly. This is encoded in the continuity assumption: both \\(\\mathbb{E}[Y(0) | X = x]\\) and \\(\\mathbb{E}[Y(1) | X = x]\\) are continuous at \\(c\\), so any outcome discontinuity at \\(c\\) must work through the treatment channel.'
                },
                {
                    question: 'In a fuzzy RDD, the first-stage jump is 0.4 and the reduced-form outcome jump is 1.2. Compute the fuzzy RDD estimate. If the first-stage jump were only 0.05, what concern would arise?',
                    hint: 'Think about weak instruments and the implications for the variance of the IV estimator.',
                    solution: 'The fuzzy RDD estimate is \\(1.2 / 0.4 = 3.0\\). If the first-stage jump were only 0.05, the estimate would be \\(1.2 / 0.05 = 24\\), but with very large standard errors. A small first-stage jump is the RDD analog of a weak instrument problem: the denominator is near zero, making the ratio estimator unstable with high variance. Standard errors become very large, confidence intervals become wide, and the estimator may have poor finite-sample properties (bias toward the OLS estimate).'
                },
                {
                    question: 'Compare the interpretation of \\(\\tau_{\\text{SRD}}\\) and \\(\\tau_{\\text{FRD}}\\). For whom is each estimand identified? Which design requires stronger assumptions, and why?',
                    hint: 'The sharp RDD identifies an ATE at the cutoff, while the fuzzy RDD identifies a LATE for a particular subgroup. What additional assumption does the fuzzy RDD require?',
                    solution: 'In sharp RDD, \\(\\tau_{\\text{SRD}} = \\mathbb{E}[Y(1) - Y(0) | X = c]\\) is the ATE for units at the cutoff &mdash; all units at \\(c\\) change treatment status. In fuzzy RDD, \\(\\tau_{\\text{FRD}} = \\mathbb{E}[Y(1) - Y(0) | X = c, \\text{complier}]\\) is the LATE for compliers at the cutoff &mdash; units whose treatment status is changed by crossing the cutoff. The fuzzy RDD requires the additional monotonicity assumption (crossing the cutoff can only increase, or only decrease, treatment probability), analogous to the monotonicity condition in IV. Without monotonicity, the ratio may not have a causal interpretation.'
                },
                {
                    question: 'Suppose a policy makes individuals eligible for a training program if their income is below $30,000. In practice, about 70% of eligible individuals enroll and 10% of ineligible individuals also enroll (through errors or exceptions). Set up the fuzzy RDD formally: define the running variable, cutoff, instrument, and the estimand.',
                    hint: 'Identify each component. Note that treatment assignment is imperfect, making this a fuzzy rather than sharp design.',
                    solution: 'The running variable is \\(X_i = \\text{income}_i\\), the cutoff is \\(c = 30{,}000\\). Since higher \\(X\\) means less likely to be treated, define \\(Z_i = \\mathbf{1}(X_i \\leq c)\\) (indicator for being below the cutoff, i.e., eligible). The actual treatment is \\(W_i = 1\\) if enrolled in the program. First-stage: \\(\\Pr(W = 1 | X \\leq c) - \\Pr(W = 1 | X > c) = 0.70 - 0.10 = 0.60\\). The fuzzy RDD estimand is \\(\\tau_{\\text{FRD}} = \\frac{\\lim_{x \\uparrow c}\\mathbb{E}[Y|X=x] - \\lim_{x \\downarrow c}\\mathbb{E}[Y|X=x]}{0.60}\\), measuring the effect of the training program on outcomes (e.g., future earnings) for compliers near the $30,000 income threshold.'
                }
            ]
        },

        // ============================================================
        // SECTION 3: Bandwidth Selection
        // ============================================================
        {
            id: 'ch13-sec03',
            title: 'Bandwidth Selection',
            content: `
                <h2>Bandwidth Selection</h2>

                <p>The choice of <strong>bandwidth</strong> \\(h\\) &mdash; the window around the cutoff within which data are used &mdash; is the most consequential methodological decision in RDD. Too small a bandwidth wastes data and inflates variance; too large a bandwidth introduces bias from observations far from the cutoff.</p>

                <h3>The Bias-Variance Tradeoff</h3>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 13.3 (Bias-Variance Tradeoff in Local Linear RDD)</div>
                    <div class="env-body">
                        <p>Consider a local linear estimator with kernel \\(K\\) and bandwidth \\(h\\). Under standard smoothness conditions, the conditional MSE of the RDD estimator \\(\\hat{\\tau}\\) satisfies</p>
                        \\[\\text{MSE}(\\hat{\\tau}) \\approx h^4 \\cdot B^2 + \\frac{V}{nh},\\]
                        <p>where \\(B\\) captures the curvature (second derivative) of the conditional expectation function at the cutoff, and \\(V\\) is a variance constant depending on the kernel and the density of \\(X\\) at \\(c\\). The bias term grows as \\(h^4\\) (wider bandwidth includes more remote observations), while the variance term shrinks as \\(1/(nh)\\) (more data reduces noise).</p>
                    </div>
                </div>

                <p>The MSE-optimal bandwidth balances these two forces:</p>
                \\[h_{\\text{opt}} \\propto \\left(\\frac{V}{B^2 \\cdot n}\\right)^{1/5} = O(n^{-1/5}).\\]

                <h3>Local Linear Regression</h3>

                <p>The standard estimation approach in RDD is <strong>local linear regression</strong>, which fits separate linear functions on each side of the cutoff:</p>
                \\[\\hat{\\tau}_{\\text{LL}} = \\hat{\\mu}_+(c) - \\hat{\\mu}_-(c),\\]
                <p>where \\(\\hat{\\mu}_+(c)\\) and \\(\\hat{\\mu}_-(c)\\) are obtained from weighted least squares regressions using a kernel function \\(K\\left(\\frac{X_i - c}{h}\\right)\\) that assigns higher weight to observations closer to the cutoff.</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 13.5 (Local Linear RDD Estimator)</div>
                    <div class="env-body">
                        <p>For each side \\(s \\in \\{+, -\\}\\), solve</p>
                        \\[(\\hat{\\alpha}_s, \\hat{\\beta}_s) = \\arg\\min_{\\alpha, \\beta} \\sum_{i: X_i \\in \\text{side } s} K\\left(\\frac{X_i - c}{h}\\right) \\left(Y_i - \\alpha - \\beta(X_i - c)\\right)^2.\\]
                        <p>The RDD estimate is \\(\\hat{\\tau} = \\hat{\\alpha}_+ - \\hat{\\alpha}_-\\).</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition: Why Local Linear?</div>
                    <div class="env-body">
                        <p>Local linear regression (rather than local constant / Nadaraya-Watson) is preferred because it has better <strong>boundary bias</strong> properties. At the cutoff, we are estimating at a <em>boundary point</em> (we only have data on one side). Local constant estimators suffer from large boundary bias, while local linear estimators automatically adapt and have bias of order \\(h^2\\) rather than \\(h\\).</p>
                    </div>
                </div>

                <h3>Imbens-Kalyanaraman (IK) Optimal Bandwidth</h3>

                <p>Imbens and Kalyanaraman (2012) proposed a practical procedure for selecting the MSE-optimal bandwidth:</p>
                <ol>
                    <li>Estimate the second derivatives \\(m''_+(c)\\) and \\(m''_-(c)\\) of the conditional expectation on each side, using a pilot bandwidth.</li>
                    <li>Estimate the conditional variance \\(\\sigma^2_+(c)\\) and \\(\\sigma^2_-(c)\\) at the cutoff.</li>
                    <li>Plug these into the MSE-optimal bandwidth formula.</li>
                </ol>

                <h3>Calonico-Cattaneo-Titiunik (CCT) Robust Inference</h3>

                <p>Calonico, Cattaneo, and Titiunik (2014) showed that conventional confidence intervals based on the MSE-optimal bandwidth are <strong>not valid</strong> because the bias does not vanish at the \\(\\sqrt{nh}\\) rate. Their solution involves:</p>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 13.4 (Bias-Corrected Robust Inference)</div>
                    <div class="env-body">
                        <p>The CCT approach constructs <strong>bias-corrected</strong> estimates and <strong>robust standard errors</strong> that account for the remaining bias. The resulting confidence intervals have correct coverage even when using the MSE-optimal bandwidth. The key steps are:</p>
                        <ol>
                            <li>Estimate the RDD effect using local linear regression with bandwidth \\(h\\).</li>
                            <li>Estimate the bias using local quadratic regression with a (larger) pilot bandwidth \\(b\\).</li>
                            <li>Subtract the estimated bias and compute standard errors that account for the additional variability from bias estimation.</li>
                        </ol>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark: Practical Recommendation</div>
                    <div class="env-body">
                        <p>The current best practice is to use the CCT procedure (implemented in the <code>rdrobust</code> package in R/Stata). Report the bias-corrected estimate with robust confidence intervals, and show sensitivity to bandwidth choice as a robustness check.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-bandwidth"></div>
            `,
            visualizations: [
                {
                    id: 'viz-bandwidth',
                    title: 'Bandwidth Sensitivity Plot',
                    description: 'See how the RDD estimate changes as the bandwidth varies. Narrow bandwidths have high variance but low bias; wide bandwidths have low variance but may be biased.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { width: 700, height: 450, scale: 1, originX: 80, originY: 380 });
                        var ctx = viz.ctx;

                        var trueEffect = 3.0;

                        VizEngine.createSlider(controls, 'True Effect', 0, 6, 3.0, 0.5, function(v) {
                            trueEffect = parseFloat(v);
                            generateBWData();
                            draw();
                        });

                        var reSampleBtn = VizEngine.createButton(controls, 'Resample Data', function() {
                            seed++;
                            generateBWData();
                            draw();
                        });

                        var seed = 42;

                        function mulberry32(a) {
                            return function() {
                                a |= 0; a = a + 0x6D2B79F5 | 0;
                                var t = Math.imul(a ^ a >>> 15, 1 | a);
                                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                                return ((t ^ t >>> 14) >>> 0) / 4294967296;
                            };
                        }

                        function randn(rng) {
                            var u = rng(), v = rng();
                            return Math.sqrt(-2 * Math.log(u + 1e-10)) * Math.cos(2 * Math.PI * v);
                        }

                        var cutoff = 5;
                        var xMin = 0, xMax = 10;
                        var nPoints = 400;
                        var allData = [];

                        function generateBWData() {
                            var rng = mulberry32(seed);
                            allData = [];
                            for (var i = 0; i < nPoints; i++) {
                                var x = xMin + (xMax - xMin) * rng();
                                var treated = x >= cutoff ? 1 : 0;
                                var y0 = 2 + 0.6 * (x - cutoff) + 0.15 * Math.pow(x - cutoff, 2) - 0.02 * Math.pow(x - cutoff, 3) + 1.0 * randn(rng);
                                var y = y0 + treated * trueEffect;
                                allData.push({ x: x, y: y, w: treated });
                            }
                        }

                        function estimateRDD(h) {
                            var leftX = [], leftY = [];
                            var rightX = [], rightY = [];
                            for (var i = 0; i < allData.length; i++) {
                                var d = allData[i];
                                var dx = d.x - cutoff;
                                if (dx >= -h && dx < 0) { leftX.push(dx); leftY.push(d.y); }
                                if (dx >= 0 && dx <= h) { rightX.push(dx); rightY.push(d.y); }
                            }
                            if (leftX.length < 3 || rightX.length < 3) return { est: NaN, se: NaN };

                            function localLinear(xs, ys) {
                                var n = xs.length;
                                var sx = 0, sy = 0, sxx = 0, sxy = 0;
                                for (var i = 0; i < n; i++) {
                                    sx += xs[i]; sy += ys[i];
                                    sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i];
                                }
                                var denom = n * sxx - sx * sx;
                                if (Math.abs(denom) < 1e-12) return { a: sy / n, se: 1 };
                                var a = (sxx * sy - sx * sxy) / denom;
                                var b = (n * sxy - sx * sy) / denom;
                                var sse = 0;
                                for (var i = 0; i < n; i++) {
                                    var r = ys[i] - a - b * xs[i];
                                    sse += r * r;
                                }
                                var sigma2 = sse / Math.max(n - 2, 1);
                                var seA = Math.sqrt(sigma2 * sxx / denom);
                                return { a: a, se: seA };
                            }

                            var fitL = localLinear(leftX, leftY);
                            var fitR = localLinear(rightX, rightY);
                            var est = fitR.a - fitL.a;
                            var se = Math.sqrt(fitL.se * fitL.se + fitR.se * fitR.se);
                            return { est: est, se: se };
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, 700, 450);

                            // Compute estimates across bandwidths
                            var bws = [];
                            var ests = [];
                            var ses = [];
                            for (var h = 0.4; h <= 4.5; h += 0.1) {
                                var res = estimateRDD(h);
                                if (isFinite(res.est)) {
                                    bws.push(h);
                                    ests.push(res.est);
                                    ses.push(res.se);
                                }
                            }

                            if (bws.length === 0) return;

                            var plotLeft = 80, plotRight = 650;
                            var plotTop = 40, plotBot = 380;

                            var hMin = 0.4, hMax = 4.5;
                            var yMin = -2, yMax = 8;

                            function toPlotX(h) { return plotLeft + (h - hMin) / (hMax - hMin) * (plotRight - plotLeft); }
                            function toPlotY(y) { return plotBot - (y - yMin) / (yMax - yMin) * (plotBot - plotTop); }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBot);
                            ctx.lineTo(plotRight, plotBot);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBot);
                            ctx.lineTo(plotLeft, plotTop);
                            ctx.stroke();

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var h = 0.5; h <= 4.5; h += 0.5) {
                                ctx.fillText(h.toFixed(1), toPlotX(h), plotBot + 4);
                            }
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Bandwidth h', (plotLeft + plotRight) / 2, plotBot + 22);

                            // Y-axis labels
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.font = '11px -apple-system,sans-serif';
                            for (var y = -2; y <= 8; y += 2) {
                                ctx.fillText(y.toString(), plotLeft - 6, toPlotY(y));
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(plotLeft, toPlotY(y));
                                ctx.lineTo(plotRight, toPlotY(y));
                                ctx.stroke();
                            }

                            ctx.save();
                            ctx.translate(20, (plotTop + plotBot) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('RDD Estimate', 0, 0);
                            ctx.restore();

                            // True effect line
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([8, 4]);
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, toPlotY(trueEffect));
                            ctx.lineTo(plotRight, toPlotY(trueEffect));
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('True effect = ' + trueEffect.toFixed(1), plotRight - 140, toPlotY(trueEffect) - 4);

                            // Confidence bands (95% CI)
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.beginPath();
                            for (var i = 0; i < bws.length; i++) {
                                var sx = toPlotX(bws[i]);
                                var syHi = toPlotY(ests[i] + 1.96 * ses[i]);
                                if (i === 0) ctx.moveTo(sx, syHi);
                                else ctx.lineTo(sx, syHi);
                            }
                            for (var i = bws.length - 1; i >= 0; i--) {
                                var sx = toPlotX(bws[i]);
                                var syLo = toPlotY(ests[i] - 1.96 * ses[i]);
                                ctx.lineTo(sx, syLo);
                            }
                            ctx.closePath();
                            ctx.fill();

                            // Estimate line
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var i = 0; i < bws.length; i++) {
                                var sx = toPlotX(bws[i]);
                                var sy = toPlotY(ests[i]);
                                if (i === 0) ctx.moveTo(sx, sy);
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // CI boundary lines
                            ctx.strokeStyle = viz.colors.blue + '66';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath();
                            for (var i = 0; i < bws.length; i++) {
                                var sx = toPlotX(bws[i]);
                                var sy = toPlotY(ests[i] + 1.96 * ses[i]);
                                if (i === 0) ctx.moveTo(sx, sy);
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();
                            ctx.beginPath();
                            for (var i = 0; i < bws.length; i++) {
                                var sx = toPlotX(bws[i]);
                                var sy = toPlotY(ests[i] - 1.96 * ses[i]);
                                if (i === 0) ctx.moveTo(sx, sy);
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('RDD Estimate Sensitivity to Bandwidth', 365, 8);

                            // Legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(plotLeft + 10, plotTop + 5, 20, 3);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Point estimate', plotLeft + 35, plotTop + 7);
                            ctx.fillStyle = viz.colors.blue + '44';
                            ctx.fillRect(plotLeft + 10, plotTop + 20, 20, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('95% CI', plotLeft + 35, plotTop + 25);
                        }

                        generateBWData();
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain the bias-variance tradeoff in RDD bandwidth selection. Why does the MSE-optimal bandwidth shrink as \\(n \\to \\infty\\)?',
                    hint: 'Consider the rates at which bias and variance change with \\(h\\). The optimal \\(h\\) balances these two terms.',
                    solution: 'A larger bandwidth \\(h\\) includes more data, reducing variance (proportional to \\(1/(nh)\\)), but also includes observations further from the cutoff, increasing bias (proportional to \\(h^2\\) for local linear). The MSE is approximately \\(h^4 B^2 + V/(nh)\\). Differentiating with respect to \\(h\\) and setting to zero gives \\(h_{\\text{opt}} \\propto n^{-1/5}\\). As \\(n \\to \\infty\\), we can afford a smaller bandwidth because we have more data near the cutoff, so we choose a narrower window to reduce bias while still controlling variance.'
                },
                {
                    question: 'Why is local linear regression preferred over local constant (Nadaraya-Watson) estimation at the boundary in RDD? What is the order of the boundary bias for each estimator?',
                    hint: 'At the cutoff, the RDD estimator evaluates at a boundary point. Consider what happens to the bias of kernel regression at boundaries.',
                    solution: 'At the cutoff \\(c\\), we estimate the conditional expectation at a boundary: data exists only on one side (left or right of \\(c\\) for each regression). The local constant estimator has boundary bias of order \\(O(h)\\) because the kernel weights are asymmetrically distributed, pulling the estimate away from the true value. Local linear regression automatically corrects for this by fitting a line, achieving boundary bias of order \\(O(h^2)\\) &mdash; the same as its interior bias. This makes local linear the dominant choice for RDD, as recognized by Fan and Gijbels (1996) and adopted universally in the RDD literature.'
                },
                {
                    question: 'Explain why conventional confidence intervals using the MSE-optimal bandwidth are invalid. How does the CCT procedure fix this problem?',
                    hint: 'For valid inference, the bias must be negligible relative to the standard error. What is the rate of the bias at the MSE-optimal bandwidth?',
                    solution: 'At the MSE-optimal bandwidth \\(h \\propto n^{-1/5}\\), the bias is of order \\(h^2 = n^{-2/5}\\) and the standard deviation is of order \\((nh)^{-1/2} = n^{-2/5}\\). Since bias and standard deviation are of the same order, the bias does not vanish relative to the standard error. Conventional CIs centered at the point estimate have incorrect coverage because they ignore this non-negligible bias. The CCT procedure estimates the bias explicitly using a higher-order (local quadratic) fit with a separate pilot bandwidth, subtracts it, and constructs "robust" standard errors that account for the additional variability from bias estimation. The resulting CIs have correct asymptotic coverage.'
                },
                {
                    question: 'A researcher reports an RDD estimate using only bandwidth \\(h = 1\\). A referee asks for a "bandwidth sensitivity analysis." Describe what this analysis involves and why it is important.',
                    hint: 'Think about what happens if the estimate changes dramatically when the bandwidth changes slightly.',
                    solution: 'A bandwidth sensitivity analysis involves re-estimating the RDD effect across a range of bandwidths (e.g., \\(h/2, 3h/4, h, 5h/4, 3h/2, 2h\\)) and plotting the estimates with confidence intervals. If the estimate is stable across bandwidths near the chosen one, this suggests the result is not an artifact of a particular bandwidth choice. If the estimate swings wildly or changes sign, this raises concerns about robustness. The analysis is important because: (1) the MSE-optimal bandwidth is just a point estimate itself, subject to uncertainty; (2) different bandwidths trade off bias and variance differently; (3) dramatic sensitivity suggests the result may be driven by functional form assumptions rather than a genuine discontinuity.'
                }
            ]
        },

        // ============================================================
        // SECTION 4: Validation & McCrary Test
        // ============================================================
        {
            id: 'ch13-sec04',
            title: 'Validation & McCrary Test',
            content: `
                <h2>Validation &amp; McCrary Test</h2>

                <p>The credibility of an RDD rests on the assumption that units cannot precisely manipulate the running variable to sort around the cutoff. Several diagnostic tests and validation exercises can strengthen (or undermine) this assumption.</p>

                <h3>Testing for Manipulation: The McCrary (2008) Test</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 13.6 (McCrary Density Test)</div>
                    <div class="env-body">
                        <p>The <strong>McCrary test</strong> checks whether the density of the running variable \\(X\\) is continuous at the cutoff. Under no manipulation,</p>
                        \\[\\lim_{x \\downarrow c} f_X(x) = \\lim_{x \\uparrow c} f_X(x),\\]
                        <p>where \\(f_X\\) is the density of the running variable. A discontinuity (jump) in the density at the cutoff suggests that units are bunching on one side, which indicates manipulation.</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition: Why Manipulation Invalidates RDD</div>
                    <div class="env-body">
                        <p>If individuals can manipulate the running variable to be just above (or just below) the cutoff, then units on different sides of the cutoff are no longer comparable &mdash; those who manipulate may have different potential outcomes than those who do not. The "local randomization" analogy breaks down. For example, if students can retake an exam until they pass a scholarship threshold, those just above the cutoff may be more motivated (systematic selection).</p>
                    </div>
                </div>

                <p>The McCrary test procedure:</p>
                <ol>
                    <li>Construct a histogram of the running variable using small bins.</li>
                    <li>Estimate the density on each side of the cutoff using local polynomial smoothing.</li>
                    <li>Test whether the estimated density has a discontinuity at \\(c\\).</li>
                </ol>

                <h3>Covariate Balance at the Cutoff</h3>

                <p>Even if the density test passes, we should check that <strong>predetermined covariates</strong> (variables determined before the running variable) are balanced at the cutoff. If covariates \\(Z_i\\) (age, gender, prior test scores, etc.) show a discontinuity at \\(c\\), this suggests either manipulation or a confounding discontinuity.</p>

                <p>Formally, run the RDD with each covariate \\(Z_i\\) as the outcome:</p>
                \\[\\hat{\\delta}_Z = \\lim_{x \\downarrow c} \\mathbb{E}[Z_i \\mid X_i = x] - \\lim_{x \\uparrow c} \\mathbb{E}[Z_i \\mid X_i = x].\\]
                <p>We should find \\(\\hat{\\delta}_Z \\approx 0\\) for all predetermined covariates.</p>

                <h3>Placebo Cutoffs</h3>

                <p>As a falsification test, estimate the RDD at <strong>placebo cutoffs</strong> where no treatment discontinuity exists. If we find significant "effects" at these placebo points, this casts doubt on the result at the true cutoff. For example, if the true cutoff is \\(c = 70\\), also run the RDD at \\(c = 60\\) and \\(c = 80\\) (within the control or treated group only).</p>

                <h3>Donut-Hole RDD</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 13.7 (Donut-Hole RDD)</div>
                    <div class="env-body">
                        <p>The <strong>donut-hole RDD</strong> excludes observations within a small window \\(\\epsilon\\) of the cutoff:</p>
                        \\[\\text{Use data with } |X_i - c| > \\epsilon \\text{ and } |X_i - c| \\leq h.\\]
                        <p>This addresses concerns about manipulation that affects only observations very close to the cutoff. If the estimate is robust to removing observations in the "donut," this increases confidence that manipulation is not driving the result.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark: Validation Checklist</div>
                    <div class="env-body">
                        <p>A thorough RDD analysis should include: (1) McCrary density test; (2) covariate balance tests at the cutoff; (3) placebo cutoff tests; (4) bandwidth sensitivity analysis; (5) donut-hole robustness check. Failure of any of these tests raises concerns, though passing all of them does not definitively prove validity.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-mccrary"></div>
            `,
            visualizations: [
                {
                    id: 'viz-mccrary',
                    title: 'McCrary Density Test',
                    description: 'Examine the density of the running variable around the cutoff. Increase the manipulation parameter to see bunching appear, indicating that units are sorting around the cutoff.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { width: 700, height: 420, scale: 1, originX: 70, originY: 370 });
                        var ctx = viz.ctx;

                        var manipulation = 0;
                        var nObs = 1000;

                        VizEngine.createSlider(controls, 'Manipulation', 0, 0.5, 0, 0.02, function(v) {
                            manipulation = parseFloat(v);
                            generateDensityData();
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Sample Size', 200, 2000, 1000, 100, function(v) {
                            nObs = parseInt(v);
                            generateDensityData();
                            draw();
                        });

                        function mulberry32(a) {
                            return function() {
                                a |= 0; a = a + 0x6D2B79F5 | 0;
                                var t = Math.imul(a ^ a >>> 15, 1 | a);
                                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                                return ((t ^ t >>> 14) >>> 0) / 4294967296;
                            };
                        }

                        function randn(rng) {
                            var u = rng(), v = rng();
                            return Math.sqrt(-2 * Math.log(u + 1e-10)) * Math.cos(2 * Math.PI * v);
                        }

                        var cutoff = 5;
                        var xMin = 0, xMax = 10;
                        var runData = [];

                        function generateDensityData() {
                            var rng = mulberry32(77);
                            runData = [];
                            for (var i = 0; i < nObs; i++) {
                                var x = xMin + (xMax - xMin) * rng();
                                // Manipulation: units just below cutoff get pushed above
                                if (x >= cutoff - 1 && x < cutoff && rng() < manipulation) {
                                    x = cutoff + rng() * 0.5;
                                }
                                runData.push(x);
                            }
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, 700, 420);

                            // Histogram bins
                            var nBins = 40;
                            var binW = (xMax - xMin) / nBins;
                            var counts = new Array(nBins).fill(0);
                            for (var i = 0; i < runData.length; i++) {
                                var b = Math.floor((runData[i] - xMin) / binW);
                                if (b >= 0 && b < nBins) counts[b]++;
                            }

                            var maxCount = 0;
                            for (var b = 0; b < nBins; b++) {
                                if (counts[b] > maxCount) maxCount = counts[b];
                            }
                            maxCount = Math.max(maxCount, 1);

                            var plotLeft = 70, plotRight = 650;
                            var plotTop = 40, plotBot = 370;

                            function toSX(x) { return plotLeft + (x - xMin) / (xMax - xMin) * (plotRight - plotLeft); }
                            function toSY(c) { return plotBot - (c / maxCount) * (plotBot - plotTop - 20); }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBot);
                            ctx.lineTo(plotRight, plotBot);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBot);
                            ctx.lineTo(plotLeft, plotTop);
                            ctx.stroke();

                            // Cutoff line
                            var cx = toSX(cutoff);
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(cx, plotTop);
                            ctx.lineTo(cx, plotBot);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('Cutoff c = ' + cutoff, cx, plotTop - 2);

                            // Draw histogram bars
                            for (var b = 0; b < nBins; b++) {
                                var xLeft = xMin + b * binW;
                                var xRight = xLeft + binW;
                                var sx1 = toSX(xLeft) + 1;
                                var sx2 = toSX(xRight) - 1;
                                var sy = toSY(counts[b]);
                                var isLeft = (xLeft + binW / 2) < cutoff;
                                var col = isLeft ? viz.colors.orange : viz.colors.blue;

                                ctx.fillStyle = col + '88';
                                ctx.fillRect(sx1, sy, sx2 - sx1, plotBot - sy);
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(sx1, sy, sx2 - sx1, plotBot - sy);
                            }

                            // Compute densities on each side near the cutoff for the test
                            var leftNear = 0, rightNear = 0;
                            var leftTotal = 0, rightTotal = 0;
                            var nearW = 1.0;
                            for (var i = 0; i < runData.length; i++) {
                                if (runData[i] < cutoff) leftTotal++;
                                else rightTotal++;
                                if (runData[i] >= cutoff - nearW && runData[i] < cutoff) leftNear++;
                                if (runData[i] >= cutoff && runData[i] < cutoff + nearW) rightNear++;
                            }

                            var leftDens = leftNear / (nObs * nearW);
                            var rightDens = rightNear / (nObs * nearW);
                            var logRatio = rightDens > 0 && leftDens > 0 ? Math.log(rightDens / leftDens) : 0;

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var t = 0; t <= 10; t += 2) {
                                ctx.fillText(t.toString(), toSX(t), plotBot + 4);
                            }
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Running Variable X', (plotLeft + plotRight) / 2, plotBot + 22);

                            // Density label on y-axis
                            ctx.save();
                            ctx.translate(20, (plotTop + plotBot) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.fillText('Frequency', 0, 0);
                            ctx.restore();

                            // McCrary test result
                            var testResult = Math.abs(logRatio) < 0.2 ? 'PASS' : 'FAIL';
                            var testColor = testResult === 'PASS' ? viz.colors.green : viz.colors.red;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('McCrary Density Test', 350, 395);

                            ctx.fillStyle = testColor;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.fillText('Log density ratio at cutoff: ' + logRatio.toFixed(3) + '  [' + testResult + ']', 350, 412);

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Density of Running Variable', plotLeft + 5, plotTop - 18);
                        }

                        generateDensityData();
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why a discontinuity in the density of the running variable at the cutoff threatens the validity of an RDD. Give a concrete example of manipulation that would produce such a discontinuity.',
                    hint: 'Think about what it means if more units appear just above (or below) the cutoff than expected. What does this imply about comparability?',
                    solution: 'A density discontinuity means units are selectively sorting around the cutoff. If \\(f_X(c^+) > f_X(c^-)\\), there is excess mass just above the cutoff, suggesting some units manipulated their running variable to cross the threshold. These manipulators likely differ systematically from non-manipulators in their potential outcomes (e.g., more motivated, better-connected). This breaks the comparability of units just above and below the cutoff. Example: if a scholarship requires a GPA of 3.5 and professors round grades up for borderline students, students just above 3.5 include some whose "true" GPA was below 3.5. These rounded-up students may differ from students genuinely scoring 3.5+, invalidating the comparison.'
                },
                {
                    question: 'A researcher finds that in an RDD of the effect of a remedial reading program (assigned when test scores fall below 50), predetermined covariates such as parental income and prior-year grades show discontinuities at the cutoff. What does this suggest, and what should the researcher do?',
                    hint: 'Covariate imbalance at the cutoff suggests a violation of the RDD assumptions. Consider what might cause it.',
                    solution: 'Covariate discontinuities at the cutoff suggest either: (1) manipulation of the running variable (students or teachers adjusting scores), or (2) a confounded discontinuity (another policy or sorting mechanism also operates at score = 50). The researcher should: investigate the score assignment mechanism for manipulation opportunities; run the McCrary test on the score density; consider donut-hole RDD excluding observations very close to 50; examine whether the covariate imbalance can be explained by known institutional features; and potentially include the unbalanced covariates as controls (though this is a weaker fix since it relies on functional form). If manipulation is confirmed, the RDD is likely invalid.'
                },
                {
                    question: 'Describe the donut-hole RDD and explain when it is useful. What is the tradeoff compared to the standard RDD?',
                    hint: 'The donut-hole removes observations closest to the cutoff. Think about when these observations are problematic.',
                    solution: 'The donut-hole RDD excludes observations within a small window \\([c - \\epsilon, c + \\epsilon]\\) while still using observations in \\([c - h, c - \\epsilon) \\cup (c + \\epsilon, c + h]\\). It is useful when manipulation is suspected to affect only observations very close to the cutoff (e.g., precise score manipulation). By removing potentially manipulated observations, we may recover a valid comparison at the cost of: (1) discarding the most informative observations (those closest to the cutoff carry the most weight for identification); (2) increasing reliance on extrapolation from \\(\\pm \\epsilon\\) to the cutoff; (3) increased variance and greater sensitivity to functional form. The tradeoff is between robustness to manipulation and statistical precision.'
                }
            ]
        },

        // ============================================================
        // SECTION 5: RDD Extensions
        // ============================================================
        {
            id: 'ch13-sec05',
            title: 'RDD Extensions',
            content: `
                <h2>RDD Extensions</h2>

                <p>The basic RDD framework has been extended in several important directions that expand its applicability to a wider range of empirical settings.</p>

                <h3>Regression Kink Design (RKD)</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 13.8 (Regression Kink Design)</div>
                    <div class="env-body">
                        <p>In a <strong>regression kink design</strong> (Card et al., 2015), the treatment is a continuous function of the running variable with a <strong>kink</strong> (change in slope) at the cutoff, rather than a jump. The policy function \\(B(X)\\) satisfies:</p>
                        \\[B'(c^+) \\neq B'(c^-), \\quad \\text{but} \\quad B(c^+) = B(c^-).\\]
                        <p>The RKD estimand is</p>
                        \\[\\tau_{\\text{RKD}} = \\frac{\\lim_{x \\downarrow c} m'(x) - \\lim_{x \\uparrow c} m'(x)}{\\lim_{x \\downarrow c} B'(x) - \\lim_{x \\uparrow c} B'(x)},\\]
                        <p>where \\(m(x) = \\mathbb{E}[Y \\mid X = x]\\) is the conditional expectation of the outcome. The numerator is the <strong>kink in the outcome</strong> and the denominator is the <strong>kink in the policy</strong>.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 13.2 (Unemployment Insurance Benefits)</div>
                    <div class="env-body">
                        <p>Unemployment insurance benefits are often a kinked function of prior earnings: benefits equal a replacement rate times earnings up to a cap, then remain flat. If \\(B(X) = \\min(\\rho X, \\bar{B})\\), there is a kink at \\(X = \\bar{B}/\\rho\\). The RKD estimates the causal effect of benefit generosity on unemployment duration by examining whether the outcome also has a kink at this point.</p>
                    </div>
                </div>

                <h3>Multi-Cutoff and Multi-Score RDD</h3>

                <p>In <strong>multi-cutoff RDD</strong>, the same running variable has different cutoffs for different subpopulations (e.g., different test score thresholds across school districts). The treatment effects at each cutoff can be estimated separately and then combined.</p>

                <p>In <strong>multi-score RDD</strong> (also called multivariate RDD), treatment depends on multiple running variables simultaneously. For example, college admission might depend on both a math score and a verbal score:</p>
                \\[W_i = \\mathbf{1}(X_{1i} \\geq c_1 \\text{ and } X_{2i} \\geq c_2).\\]
                <p>The identification is at the boundary of the eligibility region, which is now a curve or surface rather than a single point.</p>

                <h3>Geographic RDD</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 13.9 (Geographic RDD)</div>
                    <div class="env-body">
                        <p>In a <strong>geographic RDD</strong>, the running variable is geographic location, and the cutoff is a political or administrative boundary. Units just inside and just outside the boundary are compared. The running variable is typically the distance to the boundary (positive on one side, negative on the other).</p>
                    </div>
                </div>

                <p>Examples include: comparing outcomes across state borders with different policies (e.g., minimum wage, school funding formulas), studying effects of being inside vs. outside an enterprise zone, and examining the impact of political jurisdictions.</p>

                <div class="env-block remark">
                    <div class="env-title">Remark: Challenges of Geographic RDD</div>
                    <div class="env-body">
                        <p>Geographic RDD faces unique challenges: (1) the "distance to boundary" running variable can be defined in multiple ways (Euclidean distance, road distance); (2) sorting across boundaries is common (people choose where to live); (3) spillover effects may cross boundaries; (4) multiple differences may coincide at administrative borders (tax rates, school quality, etc.).</p>
                    </div>
                </div>

                <h3>Extrapolation Away from the Cutoff</h3>

                <p>A fundamental limitation of RDD is that it identifies effects only at the cutoff. Recent work has explored conditions under which RDD estimates can be <strong>extrapolated</strong> to units further from the cutoff:</p>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 13.5 (Extrapolation under Bounded Derivatives)</div>
                    <div class="env-body">
                        <p>If the conditional average treatment effect \\(\\tau(x) = \\mathbb{E}[Y(1) - Y(0) \\mid X = x]\\) has a bounded derivative, \\(|\\tau'(x)| \\leq L\\), then for any \\(x\\) near the cutoff,</p>
                        \\[|\\tau(x) - \\tau(c)| \\leq L \\cdot |x - c|.\\]
                        <p>This provides a bound on how much the treatment effect can vary as we move away from the cutoff, allowing partial extrapolation with known uncertainty.</p>
                    </div>
                </div>

                <p>Angrist and Rokkanen (2015) proposed an alternative approach: if the running variable is conditionally independent of potential outcomes given covariates (i.e., the running variable only affects outcomes through treatment), then the treatment effect can be identified away from the cutoff using regression adjustment.</p>

                <div class="viz-placeholder" data-viz="viz-rkd"></div>
            `,
            visualizations: [
                {
                    id: 'viz-rkd',
                    title: 'Regression Kink Design',
                    description: 'The policy function has a kink (change in slope) at the cutoff. If the outcome also shows a kink, this identifies a causal effect. Adjust the treatment effect to see how the outcome kink responds.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { width: 700, height: 450, scale: 1, originX: 70, originY: 390 });
                        var ctx = viz.ctx;

                        var kinkEffect = 0.5;
                        var noiseLevel = 0.8;

                        VizEngine.createSlider(controls, 'Treatment Effect', 0, 1.5, 0.5, 0.05, function(v) {
                            kinkEffect = parseFloat(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Noise Level', 0.2, 2.0, 0.8, 0.1, function(v) {
                            noiseLevel = parseFloat(v);
                            draw();
                        });

                        function mulberry32(a) {
                            return function() {
                                a |= 0; a = a + 0x6D2B79F5 | 0;
                                var t = Math.imul(a ^ a >>> 15, 1 | a);
                                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                                return ((t ^ t >>> 14) >>> 0) / 4294967296;
                            };
                        }

                        function randn(rng) {
                            var u = rng(), v = rng();
                            return Math.sqrt(-2 * Math.log(u + 1e-10)) * Math.cos(2 * Math.PI * v);
                        }

                        var cutoff = 5;
                        var xMin = 0, xMax = 10;
                        var nPoints = 250;

                        var plotLeft = 70, plotRight = 340;
                        var plotLeft2 = 380, plotRight2 = 650;
                        var plotTop = 50, plotBot = 390;

                        function toSX1(x) { return plotLeft + (x - xMin) / (xMax - xMin) * (plotRight - plotLeft); }
                        function toSX2(x) { return plotLeft2 + (x - xMin) / (xMax - xMin) * (plotRight2 - plotLeft2); }

                        // Policy function: B(x) = slope1 * x for x < c, slope1 * c + slope2 * (x - c) for x >= c
                        var slope1 = 0.6;
                        function policyB(x) {
                            if (x < cutoff) return slope1 * x;
                            return slope1 * cutoff + (slope1 + kinkEffect) * (x - cutoff);
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, 700, 450);

                            var rng = mulberry32(55);

                            // Compute policy range for scaling
                            var bMin = 0, bMax = policyB(xMax);
                            bMax = Math.max(bMax, 8);

                            function toSY1(b) { return plotBot - (b - bMin) / (bMax - bMin) * (plotBot - plotTop); }

                            // === Left panel: Policy function B(X) ===
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Policy B(X)', (plotLeft + plotRight) / 2, 10);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBot);
                            ctx.lineTo(plotRight, plotBot);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBot);
                            ctx.lineTo(plotLeft, plotTop);
                            ctx.stroke();

                            // Cutoff line
                            var cx1 = toSX1(cutoff);
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 3]);
                            ctx.beginPath();
                            ctx.moveTo(cx1, plotTop);
                            ctx.lineTo(cx1, plotBot);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Draw policy function
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            for (var px = xMin; px <= xMax; px += 0.05) {
                                var sx = toSX1(px);
                                var sy = toSY1(policyB(px));
                                if (px === xMin) ctx.moveTo(sx, sy);
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Slope labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('slope = ' + slope1.toFixed(1), toSX1(2.5), toSY1(policyB(2.5)) - 18);
                            ctx.fillText('slope = ' + (slope1 + kinkEffect).toFixed(1), toSX1(7.5), toSY1(policyB(7.5)) - 18);

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.textBaseline = 'top';
                            for (var t = 0; t <= 10; t += 5) {
                                ctx.fillText(t.toString(), toSX1(t), plotBot + 4);
                            }
                            ctx.fillText('X', (plotLeft + plotRight) / 2, plotBot + 18);

                            // === Right panel: Outcome Y(X) ===
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Outcome E[Y | X]', (plotLeft2 + plotRight2) / 2, 10);

                            // Generate outcome data
                            var outcomeSlope = 0.4;
                            var outcomeKink = kinkEffect * 0.8; // causal response
                            function trueOutcome(x) {
                                if (x < cutoff) return 2 + outcomeSlope * (x - cutoff);
                                return 2 + (outcomeSlope + outcomeKink) * (x - cutoff);
                            }

                            var yMin2 = -3, yMax2 = 7;
                            function toSY2(y) { return plotBot - (y - yMin2) / (yMax2 - yMin2) * (plotBot - plotTop); }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft2, plotBot);
                            ctx.lineTo(plotRight2, plotBot);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotLeft2, plotBot);
                            ctx.lineTo(plotLeft2, plotTop);
                            ctx.stroke();

                            // Cutoff
                            var cx2 = toSX2(cutoff);
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 3]);
                            ctx.beginPath();
                            ctx.moveTo(cx2, plotTop);
                            ctx.lineTo(cx2, plotBot);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Data points
                            rng = mulberry32(55);
                            for (var i = 0; i < nPoints; i++) {
                                var x = xMin + (xMax - xMin) * rng();
                                var y = trueOutcome(x) + noiseLevel * randn(rng);
                                var sx = toSX2(x);
                                var sy = toSY2(y);
                                var col = x < cutoff ? viz.colors.orange : viz.colors.blue;
                                ctx.fillStyle = col + '55';
                                ctx.beginPath();
                                ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // True outcome function
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            for (var px = xMin; px <= cutoff; px += 0.05) {
                                var sx = toSX2(px);
                                var sy = toSY2(trueOutcome(px));
                                if (px === xMin) ctx.moveTo(sx, sy);
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            for (var px = cutoff; px <= xMax; px += 0.05) {
                                var sx = toSX2(px);
                                var sy = toSY2(trueOutcome(px));
                                if (px === cutoff) ctx.moveTo(sx, sy);
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Slope annotations
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('slope = ' + outcomeSlope.toFixed(2), toSX2(2.5), toSY2(trueOutcome(2.5)) - 18);
                            ctx.fillText('slope = ' + (outcomeSlope + outcomeKink).toFixed(2), toSX2(7.5), toSY2(trueOutcome(7.5)) - 18);

                            // X-axis labels
                            ctx.textBaseline = 'top';
                            for (var t = 0; t <= 10; t += 5) {
                                ctx.fillText(t.toString(), toSX2(t), plotBot + 4);
                            }
                            ctx.fillText('X', (plotLeft2 + plotRight2) / 2, plotBot + 18);

                            // RKD estimate
                            var rkdEst = outcomeKink / kinkEffect;
                            var rkdText = kinkEffect > 0.01 ? rkdEst.toFixed(2) : 'N/A';
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('RKD Estimate = (outcome kink) / (policy kink) = ' + outcomeKink.toFixed(2) + ' / ' + kinkEffect.toFixed(2) + ' = ' + rkdText, 350, 420);

                            // Kink indicator at cutoff in right panel
                            if (kinkEffect > 0.01) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.beginPath();
                                ctx.arc(cx2, toSY2(trueOutcome(cutoff)), 6, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain the key difference between a regression discontinuity design (RDD) and a regression kink design (RKD). What type of policy variation does each exploit, and what continuity assumptions does each require?',
                    hint: 'In RDD, the treatment jumps at the cutoff; in RKD, the slope of treatment changes. Think about what must be continuous for identification.',
                    solution: 'RDD exploits a discontinuous jump in the treatment variable at the cutoff, requiring that the conditional expectation functions \\(\\mathbb{E}[Y(w) | X = x]\\) are continuous at \\(c\\). RKD exploits a kink (change in slope) in a continuous treatment variable at the cutoff. RKD requires stronger smoothness: the first derivative of the conditional expectation of potential outcomes must be continuous at \\(c\\) (not just the function itself). The RDD estimand is a ratio of jumps (in outcome and treatment level), while the RKD estimand is a ratio of kinks (in outcome slope and treatment slope). RKD applies when treatment is continuous (e.g., benefit amounts) rather than binary.'
                },
                {
                    question: 'In a geographic RDD comparing house prices across a school district boundary, discuss three specific threats to identification that are unique to the geographic setting.',
                    hint: 'Consider selection/sorting, spillovers, and the multidimensionality of geographic location.',
                    solution: 'Three specific threats: (1) Residential sorting: families choose which side of the boundary to live on based on school quality (or other district-level policies), so homes on different sides may have systematically different types of residents. Unlike test score RDD where the score is often fixed, geographic location is a choice variable, making manipulation (sorting) more likely. (2) Spillover effects: good schools may raise property values on the other side of the boundary through neighborhood amenities, commuting access, or social networks, biasing the RDD estimate downward. (3) Confounded boundaries: school district boundaries often coincide with municipal boundaries, which means multiple policies change simultaneously (tax rates, zoning, services), making it impossible to isolate the effect of school quality alone.'
                },
                {
                    question: 'A researcher uses an RDD to estimate the effect of a scholarship (awarded to students scoring above 80 on an entrance exam) on college GPA. The estimate is \\(\\hat{\\tau} = 0.3\\) GPA points. A policymaker asks: "Would expanding the scholarship to students scoring above 70 have a similar effect?" Explain the extrapolation challenge and under what assumptions you might provide a partial answer.',
                    hint: 'The RDD identifies the effect only at the cutoff. Consider what assumptions about treatment effect heterogeneity would allow extrapolation.',
                    solution: 'The RDD identifies the effect for students near score = 80, not for students near score = 70. Students scoring around 70 may differ in unobserved ways (motivation, preparation, financial need) that affect how they respond to the scholarship, so \\(\\tau(70)\\) may differ from \\(\\tau(80)\\). Partial answers: (1) Under a bounded-derivative assumption \\(|\\tau\'(x)| \\leq L\\), we can bound \\(|\\tau(70) - \\tau(80)| \\leq 10L\\), providing an interval for the extrapolated effect. (2) Under the Angrist-Rokkanen conditional independence assumption (the running variable is independent of potential outcomes conditional on covariates), we can identify \\(\\tau(70)\\) using regression adjustment. (3) If there are multiple cutoffs across years or programs, we can estimate \\(\\tau\\) at each cutoff and examine the pattern. Without such assumptions, the RDD alone cannot answer the extrapolation question.'
                }
            ]
        }
    ]
});
