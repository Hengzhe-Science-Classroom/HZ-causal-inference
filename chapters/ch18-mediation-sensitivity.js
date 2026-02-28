// ============================================================
//  Ch 18 · Mediation Analysis & Sensitivity
//  中介分析与敏感性分析
// ============================================================
window.CHAPTERS.push({
    id: 'ch18',
    number: 18,
    title: 'Mediation Analysis & Sensitivity',
    subtitle: 'Mechanisms and Robustness 中介分析与敏感性分析',
    sections: [
        // ===== Section 1: Direct & Indirect Effects =====
        {
            id: 'ch18-sec01',
            title: 'Direct & Indirect Effects',
            content: `<h2>1 Direct & Indirect Effects 直接与间接效应</h2>
<p>When we find that a treatment \\(X\\) affects an outcome \\(Y\\), a natural follow-up question is <strong>why</strong> and <strong>through what mechanism</strong>. Mediation analysis decomposes the total effect into a <strong>direct effect</strong> (the pathway \\(X \\to Y\\)) and an <strong>indirect effect</strong> (the pathway \\(X \\to M \\to Y\\) through a mediator \\(M\\)).</p>

<div class="env-block definition">
<div class="env-title">Definition 18.1 (Total, Direct, and Indirect Effects)</div>
<div class="env-body"><p>Using potential outcomes notation, let \\(Y(x, m)\\) denote the potential outcome when treatment is set to \\(x\\) and mediator to \\(m\\), and let \\(M(x)\\) be the potential mediator under treatment \\(x\\). Then:</p>
<p><strong>Total Effect (TE):</strong></p>
\\[\\text{TE} = E[Y(1, M(1)) - Y(0, M(0))]\\]
<p><strong>Natural Direct Effect (NDE):</strong></p>
\\[\\text{NDE} = E[Y(1, M(0)) - Y(0, M(0))]\\]
<p>The NDE captures the effect of changing \\(X\\) from 0 to 1 while holding the mediator at the value it would naturally take under control \\(M(0)\\).</p>
<p><strong>Natural Indirect Effect (NIE):</strong></p>
\\[\\text{NIE} = E[Y(1, M(1)) - Y(1, M(0))]\\]
<p>The NIE captures the effect of changing the mediator from \\(M(0)\\) to \\(M(1)\\) while holding treatment at 1.</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 18.1 (Total Effect Decomposition)</div>
<div class="env-body"><p>Under the potential outcomes framework, the total effect decomposes as:</p>
\\[\\text{TE} = \\text{NDE} + \\text{NIE}\\]
<p>This follows immediately from adding and subtracting \\(E[Y(1, M(0))]\\).</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: Baron-Kenny vs Modern Causal Mediation</div>
<div class="env-body"><p>The classical <strong>Baron-Kenny (1986)</strong> approach estimates mediation through a series of linear regressions:</p>
<p>1. Regress \\(Y\\) on \\(X\\): coefficient \\(c\\) (total effect)</p>
<p>2. Regress \\(M\\) on \\(X\\): coefficient \\(a\\)</p>
<p>3. Regress \\(Y\\) on \\(X\\) and \\(M\\): coefficients \\(c'\\) (direct) and \\(b\\)</p>
<p>The indirect effect is estimated as \\(ab\\) or equivalently \\(c - c'\\). While intuitive, this approach:</p>
<p>- Assumes linear models with no interactions</p>
<p>- Does not clearly articulate causal assumptions</p>
<p>- Breaks down for nonlinear models (e.g., logistic regression)</p>
<p>Modern causal mediation (Pearl 2001, Robins & Greenland 1992) provides a formal framework using potential outcomes and structural models that handles nonlinearities and interactions.</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 18.2 (Controlled Direct Effect)</div>
<div class="env-body"><p>The <strong>Controlled Direct Effect (CDE)</strong> at mediator level \\(m\\) is:</p>
\\[\\text{CDE}(m) = E[Y(1, m) - Y(0, m)]\\]
<p>Unlike the NDE, the CDE sets the mediator to a fixed value \\(m\\) rather than its natural value. The CDE is easier to identify but does not support a clean TE = NDE + NIE decomposition.</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-mediation-dag"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>Think of a job training program (\\(X\\)) that improves earnings (\\(Y\\)). The program might work through two channels: (1) directly, by signaling commitment to employers, and (2) indirectly, by increasing skills (\\(M\\)). The NDE asks: "What if we gave the training but magically kept skills unchanged?" The NIE asks: "What if we could give the skill boost without the training?"</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch18-viz-mediation-dag',
                    title: 'Mediation DAG & Effect Decomposition',
                    description: 'Interactive DAG showing X -> M -> Y with direct path X -> Y, and bar chart decomposing total effect into direct and indirect components.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var directEffect = 0.4;
                        var indirectA = 0.6;
                        var indirectB = 0.5;

                        var sliderDirect = VizEngine.createSlider(controls, 'Direct (X->Y): ', 0, 1, directEffect, 0.05, function(v) {
                            directEffect = v; draw();
                        });
                        var sliderA = VizEngine.createSlider(controls, 'X->M (a): ', 0, 1, indirectA, 0.05, function(v) {
                            indirectA = v; draw();
                        });
                        var sliderB = VizEngine.createSlider(controls, 'M->Y (b): ', 0, 1, indirectB, 0.05, function(v) {
                            indirectB = v; draw();
                        });

                        function draw() {
                            var ctx = viz.ctx;
                            viz.clear();

                            // --- DAG Section (left half) ---
                            var dagCx = 200;
                            var dagCy = 160;

                            // Node positions
                            var xNode = {x: dagCx - 130, y: dagCy};
                            var mNode = {x: dagCx, y: dagCy - 100};
                            var yNode = {x: dagCx + 130, y: dagCy};

                            // Draw arrows
                            function drawArrow(x1, y1, x2, y2, color, lw) {
                                var dx = x2 - x1, dy = y2 - y1;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var ux = dx / len, uy = dy / len;
                                var sx = x1 + ux * 28, sy = y1 + uy * 28;
                                var ex = x2 - ux * 28, ey = y2 - uy * 28;
                                ctx.strokeStyle = color; ctx.lineWidth = lw;
                                ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
                                var angle = Math.atan2(ey - sy, ex - sx);
                                ctx.fillStyle = color; ctx.beginPath();
                                ctx.moveTo(ex, ey);
                                ctx.lineTo(ex - 10 * Math.cos(angle - 0.4), ey - 10 * Math.sin(angle - 0.4));
                                ctx.lineTo(ex - 10 * Math.cos(angle + 0.4), ey - 10 * Math.sin(angle + 0.4));
                                ctx.closePath(); ctx.fill();
                            }

                            // X -> M (indirect leg a)
                            var aWidth = 1.5 + indirectA * 3;
                            drawArrow(xNode.x, xNode.y, mNode.x, mNode.y, viz.colors.teal, aWidth);
                            // M -> Y (indirect leg b)
                            var bWidth = 1.5 + indirectB * 3;
                            drawArrow(mNode.x, mNode.y, yNode.x, yNode.y, viz.colors.teal, bWidth);
                            // X -> Y (direct)
                            var dWidth = 1.5 + directEffect * 3;
                            drawArrow(xNode.x, xNode.y, yNode.x, yNode.y, viz.colors.orange, dWidth);

                            // Draw nodes
                            function drawNode(nx, ny, label, color) {
                                ctx.fillStyle = color + '33'; ctx.beginPath(); ctx.arc(nx, ny, 26, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = color; ctx.beginPath(); ctx.arc(nx, ny, 22, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = '#fff'; ctx.font = 'bold 18px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(label, nx, ny);
                            }
                            drawNode(xNode.x, xNode.y, 'X', viz.colors.blue);
                            drawNode(mNode.x, mNode.y, 'M', viz.colors.teal);
                            drawNode(yNode.x, yNode.y, 'Y', viz.colors.purple);

                            // Edge labels
                            ctx.font = '13px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('a = ' + indirectA.toFixed(2), (xNode.x + mNode.x) / 2 - 25, (xNode.y + mNode.y) / 2 - 10);
                            ctx.fillText('b = ' + indirectB.toFixed(2), (mNode.x + yNode.x) / 2 + 25, (mNode.y + yNode.y) / 2 - 10);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText("c' = " + directEffect.toFixed(2), (xNode.x + yNode.x) / 2, (xNode.y + yNode.y) / 2 + 22);

                            // --- Bar Chart Section (right half + bottom) ---
                            var barLeft = 430;
                            var barTop = 40;
                            var barWidth = 60;
                            var barMaxH = 200;

                            var indirect = indirectA * indirectB;
                            var total = directEffect + indirect;
                            var maxVal = Math.max(total, 1.2);

                            function barH(val) { return (val / maxVal) * barMaxH; }

                            // Total effect bar
                            var th = barH(total);
                            ctx.fillStyle = viz.colors.white + '22';
                            ctx.fillRect(barLeft, barTop + barMaxH - th, barWidth, th);
                            ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 1;
                            ctx.strokeRect(barLeft, barTop + barMaxH - th, barWidth, th);
                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('TE', barLeft + barWidth / 2, barTop + barMaxH + 18);
                            ctx.fillText(total.toFixed(2), barLeft + barWidth / 2, barTop + barMaxH - th - 8);

                            // Direct effect bar
                            var dh = barH(directEffect);
                            var bx2 = barLeft + 90;
                            ctx.fillStyle = viz.colors.orange + '66';
                            ctx.fillRect(bx2, barTop + barMaxH - dh, barWidth, dh);
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1;
                            ctx.strokeRect(bx2, barTop + barMaxH - dh, barWidth, dh);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('NDE', bx2 + barWidth / 2, barTop + barMaxH + 18);
                            ctx.fillText(directEffect.toFixed(2), bx2 + barWidth / 2, barTop + barMaxH - dh - 8);

                            // Indirect effect bar
                            var ih = barH(indirect);
                            var bx3 = barLeft + 180;
                            ctx.fillStyle = viz.colors.teal + '66';
                            ctx.fillRect(bx3, barTop + barMaxH - ih, barWidth, ih);
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1;
                            ctx.strokeRect(bx3, barTop + barMaxH - ih, barWidth, ih);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('NIE', bx3 + barWidth / 2, barTop + barMaxH + 18);
                            ctx.fillText(indirect.toFixed(2), bx3 + barWidth / 2, barTop + barMaxH - ih - 8);

                            // Title and equation
                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Mediation DAG', dagCx, 30);
                            ctx.fillText('Effect Decomposition', barLeft + 120, 25);

                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('TE = NDE + NIE = ' + directEffect.toFixed(2) + ' + ' + indirect.toFixed(2) + ' = ' + total.toFixed(2), 350, 390);

                            // Percentage decomposition
                            if (total > 0.001) {
                                var pctDirect = (directEffect / total * 100).toFixed(0);
                                var pctIndirect = (indirect / total * 100).toFixed(0);
                                ctx.fillText('Direct: ' + pctDirect + '%   Indirect: ' + pctIndirect + '%', 350, 408);
                            }
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch18-ex01',
                    type: 'numeric',
                    question: 'Suppose the direct effect of X on Y is 0.3, the effect of X on M is 0.5, and the effect of M on Y is 0.4 (all linear, no interaction). What is the total effect?',
                    answer: 0.5,
                    tolerance: 0.01,
                    explanation: 'TE = NDE + NIE = direct + a*b = 0.3 + 0.5*0.4 = 0.3 + 0.2 = 0.5.'
                },
                {
                    id: 'ch18-ex02',
                    type: 'mc',
                    question: 'The Natural Direct Effect (NDE) holds the mediator at which value?',
                    options: [
                        'A fixed arbitrary value m',
                        'The value it would naturally take under treatment, M(1)',
                        'The value it would naturally take under control, M(0)',
                        'The average mediator value in the population'
                    ],
                    answer: 2,
                    explanation: 'The NDE = E[Y(1,M(0)) - Y(0,M(0))] holds the mediator at M(0), the value it would naturally take under control.'
                },
                {
                    id: 'ch18-ex03',
                    type: 'mc',
                    question: 'Which of the following is a key limitation of the Baron-Kenny approach compared to modern causal mediation?',
                    options: [
                        'It cannot estimate the total effect',
                        'It requires randomization of the mediator',
                        'It breaks down for nonlinear models and does not handle treatment-mediator interactions',
                        'It requires larger sample sizes'
                    ],
                    answer: 2,
                    explanation: 'The Baron-Kenny approach assumes linearity with no interactions. The product ab = c - c\' identity fails for nonlinear models like logistic regression, and the method cannot handle treatment-mediator interactions.'
                },
                {
                    id: 'ch18-ex04',
                    type: 'mc',
                    question: 'How does the Controlled Direct Effect (CDE) differ from the Natural Direct Effect (NDE)?',
                    options: [
                        'CDE is always larger than NDE',
                        'CDE sets the mediator to a fixed value m for everyone, while NDE sets it to the individual-specific M(0)',
                        'CDE does not require any causal assumptions',
                        'CDE and NDE are always equal'
                    ],
                    answer: 1,
                    explanation: 'CDE(m) = E[Y(1,m) - Y(0,m)] intervenes to set M=m for everyone, while NDE = E[Y(1,M(0)) - Y(0,M(0))] uses the natural control value M(0), which varies across individuals. They are equal only in linear models with no interaction.'
                }
            ]
        },

        // ===== Section 2: Causal Mediation Analysis =====
        {
            id: 'ch18-sec02',
            title: 'Causal Mediation Analysis',
            content: `<h2>2 Causal Mediation Analysis 因果中介分析</h2>
<p>Modern causal mediation analysis, developed by Imai, Keele, and Tingley (2010), provides a rigorous framework for identifying and estimating mediation effects under clearly stated assumptions.</p>

<div class="env-block definition">
<div class="env-title">Definition 18.3 (Average Causal Mediation Effect)</div>
<div class="env-body"><p>The <strong>Average Causal Mediation Effect (ACME)</strong> is the population-level NIE:</p>
\\[\\text{ACME}(x) = E[Y(x, M(1)) - Y(x, M(0))]\\]
<p>When \\(x = 1\\), this is the NIE; when \\(x = 0\\), it measures the indirect effect under control.</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 18.2 (Sequential Ignorability — Imai et al. 2010)</div>
<div class="env-body"><p>Identification of the ACME requires <strong>sequential ignorability</strong>:</p>
<p><strong>Assumption 1 (Treatment ignorability):</strong> Given pre-treatment covariates \\(W\\),</p>
\\[\\{Y(x', m), M(x)\\} \\perp\\!\\!\\!\\perp X \\mid W\\]
<p>This says treatment assignment is as-if random given covariates.</p>
<p><strong>Assumption 2 (Mediator ignorability):</strong> Given pre-treatment covariates \\(W\\) and treatment \\(X\\),</p>
\\[Y(x', m) \\perp\\!\\!\\!\\perp M \\mid X = x, W\\]
<p>This says the mediator is as-if random given treatment and covariates. This is the <strong>stronger and more controversial</strong> assumption, as it rules out unobserved confounders of the M-Y relationship.</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: Cross-World Independence</div>
<div class="env-body"><p>The identification of natural direct and indirect effects involves <strong>cross-world counterfactuals</strong> like \\(Y(1, M(0))\\) — the outcome when treated but with the mediator value from the untreated world. This quantity can never be directly observed for any individual, making it fundamentally different from standard treatment effects.</p>
<p>This cross-world nature means that even a perfect RCT randomizing treatment \\(X\\) is not enough to identify the NDE/NIE without additional assumptions about the mediator. Sequential ignorability provides sufficient conditions, but it is <strong>untestable</strong> from data alone.</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 18.4 (Mediation Formula)</div>
<div class="env-body"><p>Under sequential ignorability, the ACME is identified as:</p>
\\[\\text{ACME} = \\int \\int E[Y \\mid X = 1, M = m, W = w] \\, \\big(f(m \\mid X = 1, w) - f(m \\mid X = 0, w)\\big) \\, dm \\, dF(w)\\]
<p>This shows the ACME is estimated by examining how the treatment shifts the distribution of the mediator, and how that shift propagates to the outcome.</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: Sensitivity Analysis is Essential</div>
<div class="env-body"><p>Because sequential ignorability is untestable, Imai et al. (2010) strongly advocate for <strong>sensitivity analysis</strong>: how much would a violation of the mediator-ignorability assumption change the estimated ACME? The sensitivity parameter \\(\\rho\\) captures the correlation between the residuals of the mediator and outcome models that would arise from an unobserved confounder.</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-acme-sensitivity"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>Sequential ignorability says: (1) treatment is as good as randomly assigned given covariates, and (2) the mediator is as good as randomly assigned given treatment and covariates. The first is often plausible in observational studies with rich covariates. The second is much harder to justify — any unobserved confounder of the mediator-outcome relationship violates it.</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch18-viz-acme-sensitivity',
                    title: 'ACME Sensitivity to Unobserved Confounding',
                    description: 'Shows how the ACME estimate changes as the sensitivity parameter rho (residual correlation from unobserved confounders) varies.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, originX: 80, originY: 340, scale: 280});
                        var trueACME = 0.3;
                        var seACME = 0.08;

                        var sliderACME = VizEngine.createSlider(controls, 'True ACME: ', 0.05, 0.8, trueACME, 0.05, function(v) {
                            trueACME = v; draw();
                        });
                        var sliderSE = VizEngine.createSlider(controls, 'SE: ', 0.02, 0.2, seACME, 0.01, function(v) {
                            seACME = v; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var leftM = 80, rightM = W - 40;
                            var topM = 40, botM = 340;
                            var plotW = rightM - leftM;
                            var plotH = botM - topM;

                            // rho from -0.9 to 0.9
                            var rhoMin = -0.9, rhoMax = 0.9;
                            function rhoToX(r) { return leftM + (r - rhoMin) / (rhoMax - rhoMin) * plotW; }

                            // ACME(rho) model: the ACME decreases as |rho| increases
                            // Simple model: ACME(rho) = trueACME * (1 - rho^2) when there is residual confounding
                            // More realistic: ACME shifts by rho * sigma_m * sigma_y
                            // We use: ACME(rho) = trueACME - rho * 0.5 (linear sensitivity)
                            function acmeAtRho(rho) {
                                return trueACME - rho * trueACME * 1.1;
                            }
                            function ciLo(rho) { return acmeAtRho(rho) - 1.96 * seACME; }
                            function ciHi(rho) { return acmeAtRho(rho) + 1.96 * seACME; }

                            // Y-axis range
                            var yMin = -0.6, yMax = 0.8;
                            function valToY(v) { return botM - (v - yMin) / (yMax - yMin) * plotH; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var g = -0.5; g <= 0.7; g += 0.1) {
                                var gy = valToY(g);
                                if (gy > topM && gy < botM) {
                                    ctx.beginPath(); ctx.moveTo(leftM, gy); ctx.lineTo(rightM, gy); ctx.stroke();
                                }
                            }

                            // CI band
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.beginPath();
                            var steps = 100;
                            for (var i = 0; i <= steps; i++) {
                                var rho = rhoMin + (rhoMax - rhoMin) * i / steps;
                                var px = rhoToX(rho);
                                var py = valToY(ciHi(rho));
                                py = Math.max(topM, Math.min(botM, py));
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            for (var i = steps; i >= 0; i--) {
                                var rho = rhoMin + (rhoMax - rhoMin) * i / steps;
                                var px = rhoToX(rho);
                                var py = valToY(ciLo(rho));
                                py = Math.max(topM, Math.min(botM, py));
                                ctx.lineTo(px, py);
                            }
                            ctx.closePath(); ctx.fill();

                            // ACME curve
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var i = 0; i <= steps; i++) {
                                var rho = rhoMin + (rhoMax - rhoMin) * i / steps;
                                var px = rhoToX(rho);
                                var py = valToY(acmeAtRho(rho));
                                py = Math.max(topM, Math.min(botM, py));
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Zero line
                            var zeroY = valToY(0);
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(leftM, zeroY); ctx.lineTo(rightM, zeroY); ctx.stroke();
                            ctx.setLineDash([]);

                            // rho=0 line (no confounding)
                            var rho0x = rhoToX(0);
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath(); ctx.moveTo(rho0x, topM); ctx.lineTo(rho0x, botM); ctx.stroke();
                            ctx.setLineDash([]);

                            // Find where ACME crosses zero
                            var crossRho = trueACME / (trueACME * 1.1);
                            if (crossRho >= rhoMin && crossRho <= rhoMax) {
                                var crossX = rhoToX(crossRho);
                                ctx.fillStyle = viz.colors.red; ctx.beginPath();
                                ctx.arc(crossX, zeroY, 5, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.red; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('ACME=0 at rho=' + crossRho.toFixed(2), crossX, zeroY - 12);
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(leftM, topM); ctx.lineTo(leftM, botM); ctx.lineTo(rightM, botM); ctx.stroke();

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var r = -0.8; r <= 0.8; r += 0.2) {
                                var lx = rhoToX(r);
                                ctx.fillText(r.toFixed(1), lx, botM + 5);
                                ctx.beginPath(); ctx.moveTo(lx, botM); ctx.lineTo(lx, botM + 3); ctx.stroke();
                            }
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('Sensitivity parameter rho', (leftM + rightM) / 2, botM + 22);

                            // Y-axis labels
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.font = '11px -apple-system,sans-serif';
                            for (var v = -0.4; v <= 0.6; v += 0.2) {
                                var ly = valToY(v);
                                if (ly > topM + 5 && ly < botM - 5) {
                                    ctx.fillText(v.toFixed(1), leftM - 6, ly);
                                }
                            }
                            ctx.save(); ctx.translate(18, (topM + botM) / 2);
                            ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center';
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('ACME', 0, 0); ctx.restore();

                            // Title
                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('ACME Sensitivity Analysis', W / 2, 20);

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(W - 200, topM + 5, 12, 3);
                            ctx.fillText('ACME(rho)', W - 200 + 50, topM + 10);
                            ctx.fillStyle = viz.colors.blue + '44';
                            ctx.fillRect(W - 200, topM + 22, 12, 8);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('95% CI', W - 200 + 50, topM + 28);
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillText('--- ACME = 0', W - 200 + 50, topM + 45);
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch18-ex05',
                    type: 'mc',
                    question: 'Which assumption in sequential ignorability is typically hardest to justify?',
                    options: [
                        'Treatment ignorability: treatment is as-if random given covariates',
                        'Mediator ignorability: mediator is as-if random given treatment and covariates',
                        'SUTVA: no interference between units',
                        'Positivity: all units have positive probability of each treatment'
                    ],
                    answer: 1,
                    explanation: 'Mediator ignorability (Assumption 2) is the harder assumption because the mediator is typically NOT randomized. Any unobserved confounder of the M-Y relationship violates it, and unlike treatment ignorability, it cannot be addressed by experimental randomization of X alone.'
                },
                {
                    id: 'ch18-ex06',
                    type: 'mc',
                    question: 'Why are natural direct and indirect effects called "cross-world" counterfactuals?',
                    options: [
                        'They require data from multiple countries',
                        'They involve potential outcomes under different treatment assignments that cannot simultaneously exist for the same individual',
                        'They require both experimental and observational data',
                        'They assume parallel universes in quantum mechanics'
                    ],
                    answer: 1,
                    explanation: 'Y(1,M(0)) involves the outcome under treatment (world 1) but with the mediator value from the control condition (world 0). This cross-world combination is fundamentally unobservable for any individual.'
                },
                {
                    id: 'ch18-ex07',
                    type: 'mc',
                    question: 'In the sensitivity analysis for the ACME, the parameter rho represents:',
                    options: [
                        'The correlation between treatment and mediator',
                        'The correlation between the mediator and outcome residuals attributable to unobserved confounding',
                        'The correlation between treatment and outcome',
                        'The signal-to-noise ratio of the mediator model'
                    ],
                    answer: 1,
                    explanation: 'The sensitivity parameter rho represents the correlation between the residuals of the mediator and outcome models that would be induced by an unobserved confounder. When rho = 0, sequential ignorability holds.'
                },
                {
                    id: 'ch18-ex08',
                    type: 'mc',
                    question: 'If an RCT randomly assigns the treatment X, which mediation assumptions does this guarantee?',
                    options: [
                        'Both treatment and mediator ignorability',
                        'Only treatment ignorability',
                        'Only mediator ignorability',
                        'Neither assumption — RCTs cannot identify mediation'
                    ],
                    answer: 1,
                    explanation: 'Randomizing X guarantees treatment ignorability (Assumption 1), but NOT mediator ignorability (Assumption 2). The mediator M is post-treatment and not randomized, so confounders of M-Y can still exist.'
                }
            ]
        },

        // ===== Section 3: Sensitivity Analysis for Unobserved Confounding =====
        {
            id: 'ch18-sec03',
            title: 'Sensitivity Analysis for Unobserved Confounding',
            content: `<h2>3 Sensitivity Analysis for Unobserved Confounding 未观测混杂的敏感性分析</h2>
<p>Every observational causal inference rests on the assumption of <strong>no unobserved confounding</strong>. Since this assumption is untestable, we need tools to assess how robust our conclusions are to potential violations. Sensitivity analysis asks: <em>"How strong would unobserved confounding need to be to change our conclusion?"</em></p>

<div class="env-block definition">
<div class="env-title">Definition 18.5 (Cornfield Conditions)</div>
<div class="env-body"><p>The earliest formal sensitivity analysis comes from <strong>Cornfield et al. (1959)</strong> in the smoking-lung cancer debate. The Cornfield condition states:</p>
<p>To explain away an observed risk ratio \\(\\text{RR}_{obs}\\), an unobserved confounder \\(U\\) must satisfy:</p>
\\[\\text{RR}_{UD} > \\text{RR}_{obs}\\]
<p>where \\(\\text{RR}_{UD}\\) is the risk ratio between the confounder and the outcome. That is, the confounder must be a stronger predictor of the outcome than the observed treatment-outcome association itself.</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 18.6 (Rosenbaum Sensitivity Framework)</div>
<div class="env-body"><p><strong>Rosenbaum (2002)</strong> introduced a general sensitivity analysis framework for matched observational studies. The key idea:</p>
<p>In a matched pair \\((i, j)\\) with the same observed covariates, the odds of treatment assignment may differ due to an unobserved confounder \\(U\\):</p>
\\[\\frac{1}{\\Gamma} \\le \\frac{\\pi_i / (1 - \\pi_i)}{\\pi_j / (1 - \\pi_j)} \\le \\Gamma\\]
<p>where \\(\\pi_k = P(X_k = 1 \\mid \\text{observed covariates}, U_k)\\) and \\(\\Gamma \\ge 1\\) is the sensitivity parameter.</p>
<p>When \\(\\Gamma = 1\\), there is no hidden bias (treatment assignment depends only on observed covariates). As \\(\\Gamma\\) increases, we allow for greater hidden bias.</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 18.3 (Sensitivity Bounds on p-values)</div>
<div class="env-body"><p>For a given \\(\\Gamma\\), the p-value from a randomization test is bounded:</p>
\\[p^{-}(\\Gamma) \\le p \\le p^{+}(\\Gamma)\\]
<p>where \\(p^{+}(\\Gamma)\\) is the worst-case p-value assuming hidden bias of magnitude \\(\\Gamma\\). If \\(p^{+}(\\Gamma) < \\alpha\\) for a given \\(\\Gamma\\), the finding is robust to hidden bias of that magnitude.</p>
<p>The <strong>sensitivity value</strong> \\(\\tilde{\\Gamma}\\) is the smallest \\(\\Gamma\\) at which \\(p^{+}(\\Gamma) = \\alpha\\). Larger \\(\\tilde{\\Gamma}\\) indicates greater robustness.</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: Interpreting Gamma</div>
<div class="env-body"><p>A value of \\(\\Gamma = 2\\) means that within a matched pair, an unobserved confounder could make one individual up to <strong>twice as likely</strong> to be treated as the other. Typical benchmarks:</p>
<p>- \\(\\Gamma < 1.2\\): Fragile finding — even minor unmeasured confounding could explain it away</p>
<p>- \\(\\Gamma \\approx 2\\): Moderately robust</p>
<p>- \\(\\Gamma > 3\\): Quite robust — would require a very strong unobserved confounder</p>
<p>For reference, the smoking-lung cancer association has \\(\\Gamma \\approx 6\\), reflecting extreme robustness.</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-sensitivity-gamma"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>Sensitivity analysis is like stress-testing a bridge. We do not know the exact loads it will face, but we can ask: "How much weight can this bridge bear before it collapses?" Similarly, we do not know if there is an unobserved confounder, but we can ask: "How strong would a confounder need to be to nullify our finding?"</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch18-viz-sensitivity-gamma',
                    title: 'Sensitivity Plot: p-value and CI as Gamma Varies',
                    description: 'Shows how the worst-case p-value and confidence interval change as the sensitivity parameter Gamma increases from 1.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var baseEffect = 0.5;
                        var baseSE = 0.12;

                        var sliderEffect = VizEngine.createSlider(controls, 'Point Estimate: ', 0.1, 1.5, baseEffect, 0.05, function(v) {
                            baseEffect = v; draw();
                        });
                        var sliderSE2 = VizEngine.createSlider(controls, 'SE: ', 0.05, 0.3, baseSE, 0.01, function(v) {
                            baseSE = v; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            // Split into two panels: left = p-value, right = CI
                            var panelW = (W - 100) / 2;
                            var leftL = 70, leftR = leftL + panelW;
                            var rightL = leftR + 60, rightR = rightL + panelW;
                            var topP = 50, botP = 360;
                            var plotH = botP - topP;

                            // Gamma range
                            var gammaMin = 1, gammaMax = 4;
                            function gamToX(g, panLeft, pw) { return panLeft + (g - gammaMin) / (gammaMax - gammaMin) * pw; }

                            // Model: worst-case p-value increases with Gamma
                            // z(Gamma) = (effect - bias(Gamma)) / SE, where bias(Gamma) ~ log(Gamma)*k
                            function worstZ(gamma) {
                                var bias = Math.log(gamma) * 0.8;
                                return (baseEffect - bias) / baseSE;
                            }
                            function pValue(z) {
                                return 1 - VizEngine.normalCDF(z);
                            }
                            function worstP(gamma) {
                                return pValue(worstZ(gamma));
                            }

                            // Find sensitivity value (Gamma where p=0.05)
                            var senGamma = null;
                            for (var g = 1.0; g <= gammaMax; g += 0.01) {
                                if (worstP(g) >= 0.05) {
                                    senGamma = g;
                                    break;
                                }
                            }

                            // === Left panel: p-value vs Gamma ===
                            // Y axis: p from 0 to 0.5
                            var pMin = 0, pMax = 0.5;
                            function pToY(p) { return botP - (p - pMin) / (pMax - pMin) * plotH; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var pv = 0.05; pv <= 0.5; pv += 0.05) {
                                var gy = pToY(pv);
                                ctx.beginPath(); ctx.moveTo(leftL, gy); ctx.lineTo(leftR, gy); ctx.stroke();
                            }

                            // p-value curve
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var steps = 150;
                            for (var i = 0; i <= steps; i++) {
                                var g = gammaMin + (gammaMax - gammaMin) * i / steps;
                                var px = gamToX(g, leftL, panelW);
                                var py = pToY(Math.min(worstP(g), pMax));
                                py = Math.max(topP, Math.min(botP, py));
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // alpha = 0.05 line
                            var alphaY = pToY(0.05);
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(leftL, alphaY); ctx.lineTo(leftR, alphaY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.red; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('alpha=0.05', leftR - 55, alphaY - 8);

                            // Mark sensitivity value
                            if (senGamma && senGamma <= gammaMax) {
                                var sx = gamToX(senGamma, leftL, panelW);
                                ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath(); ctx.moveTo(sx, topP); ctx.lineTo(sx, botP); ctx.stroke();
                                ctx.setLineDash([]);
                                ctx.fillStyle = viz.colors.green; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('~Gamma=' + senGamma.toFixed(2), sx, topP + 12);
                            }

                            // Left panel axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(leftL, topP); ctx.lineTo(leftL, botP); ctx.lineTo(leftR, botP); ctx.stroke();

                            // X labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var g = 1; g <= 4; g += 0.5) {
                                ctx.fillText(g.toFixed(1), gamToX(g, leftL, panelW), botP + 5);
                            }
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Gamma', (leftL + leftR) / 2, botP + 22);

                            // Y labels
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.font = '11px -apple-system,sans-serif';
                            for (var pv = 0; pv <= 0.5; pv += 0.1) {
                                ctx.fillText(pv.toFixed(1), leftL - 6, pToY(pv));
                            }
                            ctx.save(); ctx.translate(14, (topP + botP) / 2);
                            ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Worst-case p-value', 0, 0); ctx.restore();

                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('p-value vs Gamma', (leftL + leftR) / 2, 25);

                            // === Right panel: CI bounds vs Gamma ===
                            var ciMin = -0.4, ciMax = 1.0;
                            function ciToY(v) { return botP - (v - ciMin) / (ciMax - ciMin) * plotH; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var v = -0.3; v <= 0.9; v += 0.1) {
                                var gy = ciToY(v);
                                if (gy > topP && gy < botP) {
                                    ctx.beginPath(); ctx.moveTo(rightL, gy); ctx.lineTo(rightR, gy); ctx.stroke();
                                }
                            }

                            // CI bounds
                            function ciLower(gamma) {
                                var bias = Math.log(gamma) * 0.8;
                                return baseEffect - bias - 1.96 * baseSE;
                            }
                            function ciUpper(gamma) {
                                return baseEffect + 1.96 * baseSE;
                            }

                            // Shade CI
                            ctx.fillStyle = viz.colors.purple + '22';
                            ctx.beginPath();
                            for (var i = 0; i <= steps; i++) {
                                var g = gammaMin + (gammaMax - gammaMin) * i / steps;
                                var px = gamToX(g, rightL, panelW);
                                var py = ciToY(Math.min(ciUpper(g), ciMax));
                                py = Math.max(topP, Math.min(botP, py));
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            for (var i = steps; i >= 0; i--) {
                                var g = gammaMin + (gammaMax - gammaMin) * i / steps;
                                var px = gamToX(g, rightL, panelW);
                                var py = ciToY(Math.max(ciLower(g), ciMin));
                                py = Math.max(topP, Math.min(botP, py));
                                ctx.lineTo(px, py);
                            }
                            ctx.closePath(); ctx.fill();

                            // Lower bound curve
                            ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i <= steps; i++) {
                                var g = gammaMin + (gammaMax - gammaMin) * i / steps;
                                var px = gamToX(g, rightL, panelW);
                                var py = ciToY(Math.max(ciLower(g), ciMin));
                                py = Math.max(topP, Math.min(botP, py));
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Upper bound curve
                            ctx.beginPath();
                            for (var i = 0; i <= steps; i++) {
                                var g = gammaMin + (gammaMax - gammaMin) * i / steps;
                                var px = gamToX(g, rightL, panelW);
                                var py = ciToY(Math.min(ciUpper(g), ciMax));
                                py = Math.max(topP, Math.min(botP, py));
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Zero line
                            var zY = ciToY(0);
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(rightL, zY); ctx.lineTo(rightR, zY); ctx.stroke();
                            ctx.setLineDash([]);

                            // Right panel axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(rightL, topP); ctx.lineTo(rightL, botP); ctx.lineTo(rightR, botP); ctx.stroke();

                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var g = 1; g <= 4; g += 0.5) {
                                ctx.fillText(g.toFixed(1), gamToX(g, rightL, panelW), botP + 5);
                            }
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Gamma', (rightL + rightR) / 2, botP + 22);

                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.font = '11px -apple-system,sans-serif';
                            for (var v = -0.3; v <= 0.9; v += 0.2) {
                                var ly = ciToY(v);
                                if (ly > topP + 5 && ly < botP - 5) {
                                    ctx.fillText(v.toFixed(1), rightL - 6, ly);
                                }
                            }
                            ctx.save(); ctx.translate(rightL - 45, (topP + botP) / 2);
                            ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Effect Estimate', 0, 0); ctx.restore();

                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('CI Bounds vs Gamma', (rightL + rightR) / 2, 25);

                            // Summary
                            ctx.fillStyle = viz.colors.text; ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            if (senGamma && senGamma <= gammaMax) {
                                ctx.fillText('Finding becomes insignificant at Gamma = ' + senGamma.toFixed(2), W / 2, botP + 45);
                            } else if (senGamma === null) {
                                ctx.fillText('Finding is robust across all shown Gamma values', W / 2, botP + 45);
                            } else {
                                ctx.fillText('Finding is fragile (already insignificant near Gamma=1)', W / 2, botP + 45);
                            }
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch18-ex09',
                    type: 'mc',
                    question: 'In Rosenbaum\'s sensitivity analysis, Gamma = 1 corresponds to:',
                    options: [
                        'Maximum hidden bias',
                        'No hidden bias (treatment assignment depends only on observed covariates)',
                        'The treatment has no effect',
                        'Perfect randomization'
                    ],
                    answer: 1,
                    explanation: 'When Gamma = 1, the odds ratio of treatment assignment between matched units is bounded by 1/1 to 1, meaning treatment assignment depends only on observed covariates. There is no hidden bias from unobserved confounders.'
                },
                {
                    id: 'ch18-ex10',
                    type: 'mc',
                    question: 'Which statement about the Cornfield condition is correct?',
                    options: [
                        'An unobserved confounder must be weaker than the observed association to explain it away',
                        'An unobserved confounder must have a risk ratio with the outcome exceeding the observed risk ratio to fully explain the association',
                        'The Cornfield condition applies only to randomized experiments',
                        'The Cornfield condition requires knowledge of the confounder\'s prevalence'
                    ],
                    answer: 1,
                    explanation: 'The Cornfield condition (1959) states that to explain away an observed RR_obs, a confounder must have RR_UD > RR_obs. This sets a lower bound on how strong confounding must be.'
                },
                {
                    id: 'ch18-ex11',
                    type: 'mc',
                    question: 'A study finds a treatment effect with sensitivity value Gamma-tilde = 1.1. How should we interpret this?',
                    options: [
                        'The finding is extremely robust to hidden bias',
                        'The finding is fragile: even minor unobserved confounding (10% increase in treatment odds) could explain it away',
                        'The finding is moderately robust',
                        'We need more information to interpret this value'
                    ],
                    answer: 1,
                    explanation: 'Gamma-tilde = 1.1 means that an unobserved confounder that changes the odds of treatment by just 10% between matched pairs would be enough to make the finding statistically insignificant. This is a fragile result.'
                },
                {
                    id: 'ch18-ex12',
                    type: 'numeric',
                    question: 'If Gamma = 3, what is the maximum ratio of treatment odds between two matched individuals? (Enter as a number)',
                    answer: 3,
                    tolerance: 0.01,
                    explanation: 'By definition, Gamma bounds the ratio of treatment odds: 1/Gamma <= odds_i/odds_j <= Gamma. So when Gamma = 3, one individual can be up to 3 times as likely to receive treatment as their matched partner.'
                }
            ]
        },

        // ===== Section 4: Rosenbaum Bounds =====
        {
            id: 'ch18-sec04',
            title: 'Rosenbaum Bounds',
            content: `<h2>4 Rosenbaum Bounds 罗森鲍姆界</h2>
<p>Rosenbaum bounds provide a systematic way to assess the sensitivity of matched-pair causal inference to hidden bias. We derive worst-case bounds on the test statistic and treatment effect under increasing levels of unobserved confounding.</p>

<div class="env-block definition">
<div class="env-title">Definition 18.7 (Matched Pair Sensitivity)</div>
<div class="env-body"><p>Consider \\(N\\) matched pairs. In pair \\(s\\), let \\(d_s = Y_{s,\\text{treated}} - Y_{s,\\text{control}}\\) be the within-pair difference. Under no hidden bias (\\(\\Gamma = 1\\)), treatment assignment within each pair is equally likely, like a fair coin flip.</p>
<p>Under hidden bias of magnitude \\(\\Gamma\\), the probability that unit \\(i\\) in pair \\(s\\) receives treatment satisfies:</p>
\\[\\frac{1}{1 + \\Gamma} \\le \\pi_{si} \\le \\frac{\\Gamma}{1 + \\Gamma}\\]</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 18.4 (Sensitivity of Wilcoxon Signed-Rank Test)</div>
<div class="env-body"><p>For the Wilcoxon signed-rank statistic \\(T^+ = \\sum_{s: d_s > 0} \\text{rank}(|d_s|)\\), under hidden bias \\(\\Gamma\\):</p>
<p><strong>Upper bound:</strong> The worst-case distribution assigns probability \\(\\Gamma/(1+\\Gamma)\\) to positive pairs with large \\(|d_s|\\).</p>
<p><strong>Lower bound:</strong> The worst-case distribution assigns probability \\(1/(1+\\Gamma)\\) to positive pairs with large \\(|d_s|\\).</p>
<p>The resulting p-value bounds \\([p^{-}(\\Gamma), p^{+}(\\Gamma)]\\) bracket the true p-value under any hidden bias of magnitude \\(\\le \\Gamma\\).</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 18.8 (Amplification — Rosenbaum & Silber 2009)</div>
<div class="env-body"><p><strong>Amplification</strong> helps interpret \\(\\Gamma\\) by decomposing it into two interpretable components. An unobserved confounder \\(U\\) produces bias of magnitude \\(\\Gamma\\) if:</p>
\\[\\Gamma = \\frac{\\Delta \\cdot \\Lambda + 1}{\\Delta + \\Lambda}\\]
<p>where:</p>
<p>- \\(\\Delta\\) is the odds ratio relating \\(U\\) to treatment assignment (how much \\(U\\) predicts treatment)</p>
<p>- \\(\\Lambda\\) is the odds ratio relating \\(U\\) to the outcome (how much \\(U\\) predicts outcome)</p>
<p>This decomposition shows that a large \\(\\Gamma\\) requires the confounder to simultaneously predict <strong>both</strong> treatment and outcome strongly. If a confounder only predicts one, its bias is limited.</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: Amplification Curves</div>
<div class="env-body"><p>For a given \\(\\Gamma\\), we can plot the set of \\((\\Delta, \\Lambda)\\) combinations that produce that level of bias. This shows that:</p>
<p>- If \\(\\Delta = 1\\) (confounder does not predict treatment), then \\(\\Gamma = 1\\) regardless of \\(\\Lambda\\)</p>
<p>- If \\(\\Lambda = 1\\) (confounder does not predict outcome), then \\(\\Gamma = 1\\) regardless of \\(\\Delta\\)</p>
<p>- A large \\(\\Gamma\\) requires both \\(\\Delta\\) and \\(\\Lambda\\) to be substantial</p>
<p>This is reassuring: a confounder must be doubly strong to invalidate a finding with a large sensitivity value.</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-rosenbaum-bounds"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>Think of Rosenbaum bounds as asking: "What if the coin we flip for treatment assignment within each matched pair is loaded?" \\(\\Gamma\\) controls how loaded the coin is. At \\(\\Gamma = 1\\) it is fair. As \\(\\Gamma\\) grows, we allow increasingly unfair coins. The sensitivity analysis asks how unfair the coin needs to be before our conclusion is overturned.</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch18-viz-rosenbaum-bounds',
                    title: 'Rosenbaum Bounds on Treatment Effect',
                    description: 'Shows how the bounded treatment effect estimate and its confidence interval widen as Gamma increases, with amplification curve.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var pointEst = 0.6;
                        var nPairs = 50;

                        var sliderEst = VizEngine.createSlider(controls, 'Point Estimate: ', 0.1, 1.5, pointEst, 0.05, function(v) {
                            pointEst = v; draw();
                        });
                        var sliderN = VizEngine.createSlider(controls, 'N pairs: ', 10, 200, nPairs, 10, function(v) {
                            nPairs = v; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            // Left panel: Effect bounds vs Gamma
                            var leftL = 70, leftR = 340;
                            var topP = 50, botP = 360;
                            var panelW = leftR - leftL;
                            var plotH = botP - topP;

                            var gammaMin = 1, gammaMax = 4;
                            var se = pointEst * 0.3 / Math.sqrt(nPairs / 50);
                            function gamToX(g) { return leftL + (g - gammaMin) / (gammaMax - gammaMin) * panelW; }

                            // Bounds model
                            function upperBound(gamma) { return pointEst + Math.log(gamma) * 0.3 + 1.96 * se; }
                            function lowerBound(gamma) { return pointEst - Math.log(gamma) * 0.5 - 1.96 * se; }
                            function pointUpper(gamma) { return pointEst + Math.log(gamma) * 0.15; }
                            function pointLower(gamma) { return pointEst - Math.log(gamma) * 0.35; }

                            var effMin = -0.6, effMax = 1.5;
                            function effToY(v) { return botP - (v - effMin) / (effMax - effMin) * plotH; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var v = -0.4; v <= 1.4; v += 0.2) {
                                var gy = effToY(v);
                                if (gy > topP && gy < botP) {
                                    ctx.beginPath(); ctx.moveTo(leftL, gy); ctx.lineTo(leftR, gy); ctx.stroke();
                                }
                            }

                            // CI band (outer)
                            var steps = 100;
                            ctx.fillStyle = viz.colors.blue + '15';
                            ctx.beginPath();
                            for (var i = 0; i <= steps; i++) {
                                var g = gammaMin + (gammaMax - gammaMin) * i / steps;
                                var px = gamToX(g);
                                var py = effToY(Math.min(upperBound(g), effMax));
                                py = Math.max(topP, Math.min(botP, py));
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            for (var i = steps; i >= 0; i--) {
                                var g = gammaMin + (gammaMax - gammaMin) * i / steps;
                                var px = gamToX(g);
                                var py = effToY(Math.max(lowerBound(g), effMin));
                                py = Math.max(topP, Math.min(botP, py));
                                ctx.lineTo(px, py);
                            }
                            ctx.closePath(); ctx.fill();

                            // Point estimate band (inner)
                            ctx.fillStyle = viz.colors.blue + '33';
                            ctx.beginPath();
                            for (var i = 0; i <= steps; i++) {
                                var g = gammaMin + (gammaMax - gammaMin) * i / steps;
                                var px = gamToX(g);
                                var py = effToY(Math.min(pointUpper(g), effMax));
                                py = Math.max(topP, Math.min(botP, py));
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            for (var i = steps; i >= 0; i--) {
                                var g = gammaMin + (gammaMax - gammaMin) * i / steps;
                                var px = gamToX(g);
                                var py = effToY(Math.max(pointLower(g), effMin));
                                py = Math.max(topP, Math.min(botP, py));
                                ctx.lineTo(px, py);
                            }
                            ctx.closePath(); ctx.fill();

                            // Upper and lower bound curves
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i <= steps; i++) {
                                var g = gammaMin + (gammaMax - gammaMin) * i / steps;
                                var px = gamToX(g);
                                var py = effToY(Math.max(pointLower(g), effMin));
                                py = Math.max(topP, Math.min(botP, py));
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            ctx.beginPath();
                            for (var i = 0; i <= steps; i++) {
                                var g = gammaMin + (gammaMax - gammaMin) * i / steps;
                                var px = gamToX(g);
                                var py = effToY(Math.min(pointUpper(g), effMax));
                                py = Math.max(topP, Math.min(botP, py));
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Zero line
                            var zeroY = effToY(0);
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(leftL, zeroY); ctx.lineTo(leftR, zeroY); ctx.stroke();
                            ctx.setLineDash([]);

                            // Find where lower bound crosses zero
                            var crossG = null;
                            for (var g = 1.0; g <= gammaMax; g += 0.01) {
                                if (lowerBound(g) <= 0) { crossG = g; break; }
                            }
                            if (crossG && crossG <= gammaMax) {
                                var cx = gamToX(crossG);
                                ctx.fillStyle = viz.colors.red; ctx.beginPath();
                                ctx.arc(cx, zeroY, 5, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.red; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Gamma=' + crossG.toFixed(2), cx, zeroY - 12);
                            }

                            // Left panel axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(leftL, topP); ctx.lineTo(leftL, botP); ctx.lineTo(leftR, botP); ctx.stroke();

                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var g = 1; g <= 4; g += 0.5) {
                                ctx.fillText(g.toFixed(1), gamToX(g), botP + 5);
                            }
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Gamma', (leftL + leftR) / 2, botP + 22);

                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.font = '11px -apple-system,sans-serif';
                            for (var v = -0.4; v <= 1.4; v += 0.2) {
                                var ly = effToY(v);
                                if (ly > topP + 5 && ly < botP - 5) {
                                    ctx.fillText(v.toFixed(1), leftL - 6, ly);
                                }
                            }
                            ctx.save(); ctx.translate(14, (topP + botP) / 2);
                            ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Effect Bound', 0, 0); ctx.restore();

                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Rosenbaum Bounds', (leftL + leftR) / 2, 25);

                            // === Right panel: Amplification curve ===
                            var rightL2 = 400, rightR2 = 670;
                            var pw2 = rightR2 - rightL2;

                            // For Gamma = crossG or sensitivity value, plot Delta vs Lambda
                            var targetGamma = crossG || 2.0;

                            var dMin = 1, dMax = 8;
                            var lMin = 1, lMax = 8;
                            function dToX(d) { return rightL2 + (d - dMin) / (dMax - dMin) * pw2; }
                            function lToY(l) { return botP - (l - lMin) / (lMax - lMin) * plotH; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var d = 2; d <= 8; d += 1) {
                                var gx = dToX(d);
                                ctx.beginPath(); ctx.moveTo(gx, topP); ctx.lineTo(gx, botP); ctx.stroke();
                            }
                            for (var l = 2; l <= 8; l += 1) {
                                var gy = lToY(l);
                                ctx.beginPath(); ctx.moveTo(rightL2, gy); ctx.lineTo(rightR2, gy); ctx.stroke();
                            }

                            // Amplification curve: Gamma = (Delta*Lambda + 1) / (Delta + Lambda)
                            // Solve for Lambda: Lambda = (Gamma * Delta - 1) / (Delta - Gamma)
                            // Valid when Delta > Gamma
                            function lambdaForGamma(g, delta) {
                                if (delta <= g) return Infinity;
                                return (g * delta - 1) / (delta - g);
                            }

                            // Draw amplification curve for targetGamma
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= 200; i++) {
                                var d = targetGamma + 0.01 + (dMax - targetGamma - 0.01) * i / 200;
                                var l = lambdaForGamma(targetGamma, d);
                                if (l < lMin || l > lMax || !isFinite(l)) { started = false; continue; }
                                var px = dToX(d);
                                var py = lToY(l);
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Also draw for Gamma = 1.5 and Gamma = 3 as reference
                            var refGammas = [1.5, 2.0, 3.0];
                            var refColors = [viz.colors.teal, viz.colors.green, viz.colors.purple];
                            for (var ri = 0; ri < refGammas.length; ri++) {
                                var rg = refGammas[ri];
                                if (Math.abs(rg - targetGamma) < 0.05) continue;
                                ctx.strokeStyle = refColors[ri] + '88'; ctx.lineWidth = 1.5;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath(); started = false;
                                for (var i = 0; i <= 200; i++) {
                                    var d = rg + 0.01 + (dMax - rg - 0.01) * i / 200;
                                    if (d > dMax) break;
                                    var l = lambdaForGamma(rg, d);
                                    if (l < lMin || l > lMax || !isFinite(l)) { started = false; continue; }
                                    var px = dToX(d);
                                    var py = lToY(l);
                                    if (!started) { ctx.moveTo(px, py); started = true; }
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Right panel axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(rightL2, topP); ctx.lineTo(rightL2, botP); ctx.lineTo(rightR2, botP); ctx.stroke();

                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var d = 1; d <= 8; d += 1) {
                                ctx.fillText(d, dToX(d), botP + 5);
                            }
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Delta (U -> Treatment)', (rightL2 + rightR2) / 2, botP + 22);

                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.font = '11px -apple-system,sans-serif';
                            for (var l = 1; l <= 8; l += 1) {
                                ctx.fillText(l, rightL2 - 6, lToY(l));
                            }
                            ctx.save(); ctx.translate(rightL2 - 42, (topP + botP) / 2);
                            ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Lambda (U -> Outcome)', 0, 0); ctx.restore();

                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Amplification Curve', (rightL2 + rightR2) / 2, 25);

                            // Legend for amplification
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.orange;
                            ctx.textAlign = 'left';
                            ctx.fillText('Gamma=' + targetGamma.toFixed(2) + ' (sensitivity)', rightL2 + 10, topP + 15);
                            var ly = 30;
                            for (var ri = 0; ri < refGammas.length; ri++) {
                                if (Math.abs(refGammas[ri] - targetGamma) < 0.05) continue;
                                ctx.fillStyle = refColors[ri] + '88';
                                ctx.fillText('Gamma=' + refGammas[ri].toFixed(1), rightL2 + 10, topP + 15 + ly);
                                ly += 15;
                            }

                            // Bottom summary
                            ctx.fillStyle = viz.colors.text; ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            if (crossG) {
                                ctx.fillText('CI includes 0 at Gamma = ' + crossG.toFixed(2) + '  |  N = ' + nPairs + ' pairs', W / 2, botP + 50);
                            } else {
                                ctx.fillText('Effect robust across all shown Gamma values  |  N = ' + nPairs + ' pairs', W / 2, botP + 50);
                            }
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch18-ex13',
                    type: 'mc',
                    question: 'In Rosenbaum\'s matched pair framework under hidden bias Gamma, what is the maximum probability that any unit receives treatment?',
                    options: [
                        '1/2',
                        'Gamma / (1 + Gamma)',
                        '1 / (1 + Gamma)',
                        'Gamma'
                    ],
                    answer: 1,
                    explanation: 'Under hidden bias of magnitude Gamma, the treatment probability for any unit is bounded between 1/(1+Gamma) and Gamma/(1+Gamma). The maximum is Gamma/(1+Gamma).'
                },
                {
                    id: 'ch18-ex14',
                    type: 'mc',
                    question: 'The amplification formula Gamma = (Delta * Lambda + 1) / (Delta + Lambda) implies that:',
                    options: [
                        'A confounder only needs to predict either treatment or outcome strongly',
                        'A confounder must simultaneously predict both treatment and outcome strongly to produce large Gamma',
                        'Gamma increases linearly with both Delta and Lambda',
                        'Larger samples always reduce Gamma'
                    ],
                    answer: 1,
                    explanation: 'The amplification formula shows that if either Delta=1 or Lambda=1, then Gamma=1 (no bias). Large Gamma requires both Delta and Lambda to be substantial. A confounder that only predicts treatment OR outcome cannot create large bias.'
                },
                {
                    id: 'ch18-ex15',
                    type: 'numeric',
                    question: 'Using the amplification formula, if Delta=3 (confounder triples treatment odds) and Lambda=3 (confounder triples outcome odds), what is Gamma? Round to two decimal places.',
                    answer: 1.67,
                    tolerance: 0.02,
                    explanation: 'Gamma = (Delta * Lambda + 1) / (Delta + Lambda) = (3*3 + 1) / (3 + 3) = 10/6 = 1.67. Note that even with both odds ratios at 3, the resulting Gamma is only 1.67.'
                }
            ]
        },

        // ===== Section 5: E-values & Modern Sensitivity Tools =====
        {
            id: 'ch18-sec05',
            title: 'E-values & Modern Sensitivity Tools',
            content: `<h2>5 E-values & Modern Sensitivity Tools E值与现代敏感性工具</h2>
<p>Recent developments have produced powerful, easy-to-use sensitivity measures that complement the Rosenbaum framework. The <strong>E-value</strong> and the <strong>omitted variable bias (OVB) framework</strong> provide intuitive summaries of robustness.</p>

<div class="env-block definition">
<div class="env-title">Definition 18.9 (E-value — VanderWeele & Ding 2017)</div>
<div class="env-body"><p>The <strong>E-value</strong> is the minimum strength of association, on the risk ratio scale, that an unmeasured confounder would need to have with <strong>both</strong> the treatment and the outcome to fully explain away the observed treatment-outcome association, conditional on measured covariates.</p>
<p>For an observed risk ratio \\(\\text{RR}_{obs}\\):</p>
\\[E\\text{-value} = \\text{RR}_{obs} + \\sqrt{\\text{RR}_{obs} \\cdot (\\text{RR}_{obs} - 1)}\\]
<p>For the confidence interval limit \\(\\text{RR}_{CI}\\) (the bound closer to 1):</p>
\\[E\\text{-value}_{CI} = \\text{RR}_{CI} + \\sqrt{\\text{RR}_{CI} \\cdot (\\text{RR}_{CI} - 1)}\\]</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 18.5 (E-value Bound)</div>
<div class="env-body"><p>An unmeasured confounder \\(U\\) can only explain away the observed \\(\\text{RR}_{obs}\\) if both:</p>
\\[\\text{RR}_{UX} \\ge E\\text{-value} \\quad \\text{and} \\quad \\text{RR}_{UY} \\ge E\\text{-value}\\]
<p>where \\(\\text{RR}_{UX}\\) is the association between \\(U\\) and treatment, and \\(\\text{RR}_{UY}\\) is the association between \\(U\\) and outcome. If either is below the E-value, the confounder cannot fully explain the association.</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: Interpreting E-values</div>
<div class="env-body"><p>An E-value of 3.5 means: "A confounder would need to be associated with both treatment and outcome by a risk ratio of at least 3.5 to explain away the observed effect." We can then ask: "Is such a strong confounder plausible?" and compare with known confounders in the field.</p>
<p>Advantages of the E-value:</p>
<p>- Requires only the observed effect estimate and CI, not full modeling</p>
<p>- Works for various effect measures (RR, OR, HR, difference in means)</p>
<p>- Provides a single interpretable number</p>
<p>- Can be reported alongside any observational study</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 18.10 (Omitted Variable Bias — Cinelli & Hazlett 2020)</div>
<div class="env-body"><p>The <strong>OVB framework</strong> parameterizes sensitivity using partial \\(R^2\\) values. For a linear regression of \\(Y\\) on \\(X\\) with covariates \\(W\\), an omitted variable \\(U\\) creates bias:</p>
\\[\\text{Bias} = \\frac{\\text{(partial } R^2_{U \\sim X|W}) \\cdot (\\text{partial } R^2_{U \\sim Y|X,W})}{1 - R^2_{U \\sim X|W}} \\cdot \\hat{\\sigma}^2\\]
<p>The key sensitivity parameters are:</p>
<p>- \\(R^2_{Y \\sim U | X, W}\\): How much of the residual outcome variance does \\(U\\) explain?</p>
<p>- \\(R^2_{X \\sim U | W}\\): How much of the residual treatment variance does \\(U\\) explain?</p>
<p>The <strong>robustness value (RV)</strong> is the minimum value of \\(\\sqrt{R^2_{Y \\sim U | X, W} \\cdot R^2_{X \\sim U | W}}\\) needed to reduce the estimate to zero.</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: Benchmarking Against Observed Covariates</div>
<div class="env-body"><p>A powerful feature of the Cinelli-Hazlett framework is <strong>benchmarking</strong>: we can compare the required confounder strength to the explanatory power of observed covariates. For example:</p>
<p>"An unobserved confounder would need to explain 3 times more outcome variance and 2 times more treatment variance than the strongest observed covariate to nullify our estimate."</p>
<p>This makes the sensitivity analysis concrete and domain-specific.</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-evalue-contour"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>The E-value asks: "How much would reality have to differ from our model for our finding to be wrong?" It provides a single number that summarizes robustness. The OVB framework goes further by calibrating against observed covariates — not just "how strong must the confounder be?" but "how strong relative to confounders we already account for?"</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch18-viz-evalue-contour',
                    title: 'E-value Contour Plot',
                    description: 'Interactive contour plot showing the combinations of confounder-treatment and confounder-outcome associations that could explain away the observed effect.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var observedRR = 2.5;

                        var sliderRR = VizEngine.createSlider(controls, 'Observed RR: ', 1.1, 6.0, observedRR, 0.1, function(v) {
                            observedRR = v; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            // E-value computation
                            var eVal = observedRR + Math.sqrt(observedRR * (observedRR - 1));

                            // Plot region
                            var leftM = 80, rightM = 500;
                            var topM = 50, botM = 380;
                            var plotW = rightM - leftM;
                            var plotH = botM - topM;

                            // Axes: RR_UX from 1 to eVal+2, RR_UY from 1 to eVal+2
                            var rrMin = 1, rrMax = Math.max(eVal + 1.5, 5);
                            function rrToX(r) { return leftM + (r - rrMin) / (rrMax - rrMin) * plotW; }
                            function rrToY(r) { return botM - (r - rrMin) / (rrMax - rrMin) * plotH; }

                            // Contour: combinations of RR_UX and RR_UY that explain away RR_obs
                            // Bias factor: B(RR_UX, RR_UY) = (RR_UX * RR_UY) / (RR_UX + RR_UY - 1)
                            // Effect explained when B >= RR_obs
                            function biasFactor(rrux, rruy) {
                                return (rrux * rruy) / (rrux + rruy - 1);
                            }

                            // Draw filled contours
                            var resolution = 3;
                            for (var px = leftM; px < rightM; px += resolution) {
                                for (var py = topM; py < botM; py += resolution) {
                                    var rrux = rrMin + (px - leftM) / plotW * (rrMax - rrMin);
                                    var rruy = rrMin + (botM - py) / plotH * (rrMax - rrMin);
                                    var bf = biasFactor(rrux, rruy);
                                    var ratio = bf / observedRR;
                                    if (ratio >= 1.0) {
                                        ctx.fillStyle = viz.colors.red + '55';
                                    } else if (ratio >= 0.75) {
                                        ctx.fillStyle = viz.colors.orange + '44';
                                    } else if (ratio >= 0.5) {
                                        ctx.fillStyle = viz.colors.yellow + '33';
                                    } else if (ratio >= 0.25) {
                                        ctx.fillStyle = viz.colors.green + '22';
                                    } else {
                                        ctx.fillStyle = viz.colors.blue + '11';
                                    }
                                    ctx.fillRect(px, py, resolution, resolution);
                                }
                            }

                            // Draw contour lines
                            var contourLevels = [0.25, 0.5, 0.75, 1.0];
                            var contourColors = [viz.colors.blue + '66', viz.colors.green + '88', viz.colors.orange + 'aa', viz.colors.red];
                            for (var ci = 0; ci < contourLevels.length; ci++) {
                                var targetB = contourLevels[ci] * observedRR;
                                ctx.strokeStyle = contourColors[ci]; ctx.lineWidth = ci === 3 ? 2.5 : 1.5;
                                ctx.beginPath();
                                var started = false;
                                // For each RR_UX, solve for RR_UY: B = RR_UX * RR_UY / (RR_UX + RR_UY - 1) = targetB
                                // => RR_UY * (RR_UX - targetB) = targetB * (RR_UX - 1)
                                // => RR_UY = targetB * (RR_UX - 1) / (RR_UX - targetB)
                                for (var i = 0; i <= 300; i++) {
                                    var rrux = rrMin + (rrMax - rrMin) * i / 300;
                                    if (rrux <= targetB) { started = false; continue; }
                                    var rruy = targetB * (rrux - 1) / (rrux - targetB);
                                    if (rruy < rrMin || rruy > rrMax || !isFinite(rruy)) { started = false; continue; }
                                    var cpx = rrToX(rrux);
                                    var cpy = rrToY(rruy);
                                    if (!started) { ctx.moveTo(cpx, cpy); started = true; }
                                    else ctx.lineTo(cpx, cpy);
                                }
                                ctx.stroke();
                            }

                            // Mark E-value point
                            var evX = rrToX(eVal);
                            var evY = rrToY(eVal);
                            if (evX >= leftM && evX <= rightM && evY >= topM && evY <= botM) {
                                ctx.fillStyle = viz.colors.white;
                                ctx.beginPath(); ctx.arc(evX, evY, 7, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(evX, evY, 7, 0, Math.PI * 2); ctx.stroke();

                                // Dashed lines to axes
                                ctx.strokeStyle = viz.colors.white + '66'; ctx.lineWidth = 1;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath(); ctx.moveTo(evX, evY); ctx.lineTo(evX, botM); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(evX, evY); ctx.lineTo(leftM, evY); ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(leftM, topM); ctx.lineTo(leftM, botM); ctx.lineTo(rightM, botM); ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var step = rrMax > 6 ? 2 : 1;
                            for (var r = 1; r <= rrMax; r += step) {
                                ctx.fillText(r.toFixed(0), rrToX(r), botM + 5);
                            }
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('RR(U,X) - Confounder-Treatment Association', (leftM + rightM) / 2, botM + 22);

                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.font = '11px -apple-system,sans-serif';
                            for (var r = 1; r <= rrMax; r += step) {
                                var ly = rrToY(r);
                                if (ly > topM + 5 && ly < botM - 5) ctx.fillText(r.toFixed(0), leftM - 6, ly);
                            }
                            ctx.save(); ctx.translate(18, (topM + botM) / 2);
                            ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center';
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('RR(U,Y) - Confounder-Outcome Association', 0, 0); ctx.restore();

                            // Title
                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('E-value Contour Plot', W / 2, 20);

                            // Info panel (right side)
                            var infoX = 520, infoY = 70;
                            ctx.fillStyle = viz.colors.bg + 'cc';
                            ctx.fillRect(infoX - 5, infoY - 5, 175, 160);

                            ctx.fillStyle = viz.colors.white; ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Summary', infoX, infoY);

                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Observed RR: ' + observedRR.toFixed(1), infoX, infoY + 25);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('E-value: ' + eVal.toFixed(2), infoX, infoY + 48);

                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('A confounder needs', infoX, infoY + 75);
                            ctx.fillText('RR(U,X) >= ' + eVal.toFixed(1) + ' AND', infoX, infoY + 92);
                            ctx.fillText('RR(U,Y) >= ' + eVal.toFixed(1), infoX, infoY + 109);
                            ctx.fillText('to explain away the', infoX, infoY + 126);
                            ctx.fillText('observed association.', infoX, infoY + 143);

                            // Legend
                            var legY = 270;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            var legLabels = ['<25% explained', '25-50%', '50-75%', '75-100%', '>= 100% (explained away)'];
                            var legColors = [viz.colors.blue + '22', viz.colors.green + '44', viz.colors.yellow + '66', viz.colors.orange + '88', viz.colors.red + 'aa'];
                            for (var li = 0; li < legLabels.length; li++) {
                                ctx.fillStyle = legColors[li];
                                ctx.fillRect(infoX, legY + li * 18, 12, 12);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(legLabels[li], infoX + 18, legY + li * 18 + 10);
                            }
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch18-ex16',
                    type: 'numeric',
                    question: 'Compute the E-value for an observed risk ratio of 3.0. Use the formula E = RR + sqrt(RR * (RR-1)). Round to two decimal places.',
                    answer: 5.45,
                    tolerance: 0.05,
                    explanation: 'E-value = 3.0 + sqrt(3.0 * 2.0) = 3.0 + sqrt(6.0) = 3.0 + 2.449 = 5.45. A confounder would need RR >= 5.45 with both treatment and outcome.'
                },
                {
                    id: 'ch18-ex17',
                    type: 'mc',
                    question: 'What is the E-value for a null result (RR = 1.0)?',
                    options: [
                        '0',
                        '1',
                        '2',
                        'Undefined'
                    ],
                    answer: 1,
                    explanation: 'When RR = 1.0, E-value = 1.0 + sqrt(1.0 * 0) = 1.0 + 0 = 1.0. There is nothing to explain away, so even the weakest confounder (RR=1) suffices.'
                },
                {
                    id: 'ch18-ex18',
                    type: 'mc',
                    question: 'In the Cinelli-Hazlett OVB framework, what does the robustness value (RV) represent?',
                    options: [
                        'The p-value threshold for significance',
                        'The minimum partial R-squared product needed for a confounder to reduce the estimate to zero',
                        'The sample size needed for adequate power',
                        'The maximum allowable Type I error rate'
                    ],
                    answer: 1,
                    explanation: 'The robustness value (RV) is the minimum sqrt(R2_{Y~U|X,W} * R2_{X~U|W}) that a confounder needs to achieve to fully explain away the estimated effect. Higher RV means greater robustness.'
                },
                {
                    id: 'ch18-ex19',
                    type: 'mc',
                    question: 'What is a key advantage of the Cinelli-Hazlett framework over the basic E-value?',
                    options: [
                        'It requires fewer assumptions',
                        'It provides benchmarking against observed covariates for interpretability',
                        'It works for binary outcomes',
                        'It does not require regression'
                    ],
                    answer: 1,
                    explanation: 'The Cinelli-Hazlett framework allows benchmarking: comparing the required confounder strength to the explanatory power of observed covariates. This makes interpretations concrete, e.g., "the confounder would need to be 3x stronger than education to nullify our finding."'
                }
            ]
        }
    ]
});
