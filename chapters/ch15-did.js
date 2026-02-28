window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch15',
    number: 15,
    title: 'Difference-in-Differences',
    subtitle: 'The Workhorse of Policy Evaluation 双重差分',
    sections: [
        // ================================================================
        // SECTION 1: The DiD Idea & 2x2 Design
        // ================================================================
        {
            id: 'ch15-sec01',
            title: 'The DiD Idea & 2\u00D72 Design',
            content: `
                <h2>The DiD Idea & 2\u00D72 Design</h2>

                <p>Difference-in-Differences (DiD) is one of the most widely used quasi-experimental designs in economics, political science, and public health. The idea is beautifully simple: when we cannot randomly assign treatment, we can still identify causal effects by comparing <em>changes over time</em> across treated and untreated groups, rather than comparing levels at a single point in time.</p>

                <h3>The Setup</h3>

                <p>Consider two groups observed at two time periods:</p>
                <ul>
                    <li><strong>Treatment group</strong>: units that receive the intervention between pre and post periods</li>
                    <li><strong>Control group</strong>: units that do not receive the intervention</li>
                    <li><strong>Pre-period</strong>: before the intervention is implemented</li>
                    <li><strong>Post-period</strong>: after the intervention is implemented</li>
                </ul>

                <p>This creates a 2\u00D72 table of group means:</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 15.1 (2\u00D72 DiD Table)</div>
                    <div class="env-body">
                        <table style="width:100%; border-collapse:collapse; color:#f0f6fc; margin:10px 0;">
                            <tr style="border-bottom:2px solid #4a4a7a;">
                                <th style="padding:8px; text-align:left;"></th>
                                <th style="padding:8px; text-align:center;">Pre-period</th>
                                <th style="padding:8px; text-align:center;">Post-period</th>
                                <th style="padding:8px; text-align:center;">Difference</th>
                            </tr>
                            <tr style="border-bottom:1px solid #1a1a40;">
                                <td style="padding:8px;"><strong>Treatment</strong></td>
                                <td style="padding:8px; text-align:center;">\\(\\bar{Y}_{T,\\text{pre}}\\)</td>
                                <td style="padding:8px; text-align:center;">\\(\\bar{Y}_{T,\\text{post}}\\)</td>
                                <td style="padding:8px; text-align:center;">\\(\\bar{Y}_{T,\\text{post}} - \\bar{Y}_{T,\\text{pre}}\\)</td>
                            </tr>
                            <tr style="border-bottom:1px solid #1a1a40;">
                                <td style="padding:8px;"><strong>Control</strong></td>
                                <td style="padding:8px; text-align:center;">\\(\\bar{Y}_{C,\\text{pre}}\\)</td>
                                <td style="padding:8px; text-align:center;">\\(\\bar{Y}_{C,\\text{post}}\\)</td>
                                <td style="padding:8px; text-align:center;">\\(\\bar{Y}_{C,\\text{post}} - \\bar{Y}_{C,\\text{pre}}\\)</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 15.2 (DiD Estimator)</div>
                    <div class="env-body">
                        <p>The <strong>Difference-in-Differences estimator</strong> is the difference of the two within-group differences:</p>
                        \\[\\hat{\\tau}_{\\text{DiD}} = \\bigl(\\bar{Y}_{T,\\text{post}} - \\bar{Y}_{T,\\text{pre}}\\bigr) - \\bigl(\\bar{Y}_{C,\\text{post}} - \\bar{Y}_{C,\\text{pre}}\\bigr).\\]
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition: Two Differences</div>
                    <div class="env-body">
                        <p>The first difference (within the treatment group) captures both the causal effect <em>and</em> any time trend. The second difference (within the control group) captures <em>only</em> the time trend. By subtracting, we remove the common time trend and isolate the causal effect. This is why we need two differences.</p>
                    </div>
                </div>

                <h3>The Card & Krueger (1994) Example</h3>

                <div class="env-block example">
                    <div class="env-title">Example 15.3 (Minimum Wage and Employment)</div>
                    <div class="env-body">
                        <p>Card and Krueger (1994) studied whether raising the minimum wage reduces employment, exploiting New Jersey's 1992 minimum wage increase from $4.25 to $5.05 per hour:</p>
                        <ul>
                            <li><strong>Treatment group</strong>: Fast-food restaurants in New Jersey (where the wage rose)</li>
                            <li><strong>Control group</strong>: Fast-food restaurants in eastern Pennsylvania (where wages stayed the same)</li>
                            <li><strong>Outcome</strong>: Full-time equivalent (FTE) employment per restaurant</li>
                        </ul>
                        <p>The DiD estimate showed no significant decrease in employment, challenging the standard competitive labor market prediction.</p>
                    </div>
                </div>

                <h3>Potential Outcomes Framework for DiD</h3>

                <p>Using the potential outcomes notation, let \\(Y_{it}(0)\\) and \\(Y_{it}(1)\\) denote the potential outcomes for unit \\(i\\) at time \\(t\\) without and with treatment. The treatment effect on the treated (ATT) is:</p>
                \\[\\tau_{\\text{ATT}} = \\mathbb{E}[Y_{i,\\text{post}}(1) - Y_{i,\\text{post}}(0) \\mid D_i = 1]\\]
                <p>where \\(D_i = 1\\) indicates treatment group membership. We observe \\(Y_{i,\\text{post}}(1)\\) for the treated, but the counterfactual \\(Y_{i,\\text{post}}(0)\\) is missing. DiD constructs the counterfactual using the control group's change:</p>
                \\[\\hat{Y}_{i,\\text{post}}^{\\text{cf}}(0) = Y_{i,\\text{pre}} + \\bigl(\\bar{Y}_{C,\\text{post}} - \\bar{Y}_{C,\\text{pre}}\\bigr).\\]

                <div class="viz-placeholder" data-viz="viz-classic-did"></div>
            `,
            visualizations: [
                {
                    id: 'viz-classic-did',
                    title: 'Classic 2\u00D72 DiD Design',
                    description: 'Visualize the DiD logic: treatment and control group trajectories, the counterfactual, and the causal effect. Adjust the treatment effect to see how DiD identifies it.',
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

                        var treatEffect = 3.0;
                        var slider = document.createElement('input');
                        slider.type = 'range'; slider.min = '-2'; slider.max = '8'; slider.step = '0.5';
                        slider.value = String(treatEffect);
                        slider.style.width = '200px';
                        var label = document.createElement('span');
                        label.style.color = '#f0f6fc';
                        label.style.marginLeft = '10px';
                        label.style.fontFamily = '-apple-system,sans-serif';
                        label.style.fontSize = '13px';
                        var row = document.createElement('div');
                        row.style.marginTop = '8px';
                        row.style.display = 'flex';
                        row.style.alignItems = 'center';
                        row.style.gap = '8px';
                        var sliderLabel = document.createElement('span');
                        sliderLabel.textContent = 'Treatment Effect:';
                        sliderLabel.style.color = '#8b949e';
                        sliderLabel.style.fontFamily = '-apple-system,sans-serif';
                        sliderLabel.style.fontSize = '13px';
                        row.appendChild(sliderLabel);
                        row.appendChild(slider);
                        row.appendChild(label);
                        controls.appendChild(row);

                        // Data: control baseline=5, control trend=+2, treatment baseline=8
                        var cPre = 5, cPost = 7;  // control: +2 trend
                        var tPre = 8;              // treatment baseline

                        function draw() {
                            treatEffect = parseFloat(slider.value);
                            var tPostActual = tPre + (cPost - cPre) + treatEffect; // trend + effect
                            var tPostCF = tPre + (cPost - cPre);  // counterfactual

                            label.textContent = treatEffect.toFixed(1);

                            var padL = 70, padR = 70, padT = 35, padB = 55;
                            var plotW = width - padL - padR;
                            var plotH = height - padT - padB;

                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, width, height);

                            // Grid
                            ctx.strokeStyle = '#1a1a4066';
                            ctx.lineWidth = 0.5;
                            for (var i = 0; i <= 8; i++) {
                                var gy = padT + plotH * i / 8;
                                ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(padL + plotW, gy); ctx.stroke();
                            }

                            // Axes
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke();

                            // Y range
                            var yMin = 0;
                            var yMax = Math.max(16, tPostActual + 2);
                            function toX(t) { return padL + plotW * t; } // t in [0,1]
                            function toY(v) { return padT + plotH * (1 - (v - yMin) / (yMax - yMin)); }

                            // Y-axis labels
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yl = 0; yl <= yMax; yl += 2) {
                                ctx.fillText(yl.toFixed(0), padL - 8, toY(yl));
                            }
                            ctx.save();
                            ctx.translate(15, padT + plotH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.fillText('Outcome Y', 0, 0);
                            ctx.restore();

                            // X-axis labels
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Pre-period', toX(0.25), padT + plotH + 10);
                            ctx.fillText('Post-period', toX(0.75), padT + plotH + 10);

                            // Vertical line at intervention
                            ctx.strokeStyle = '#4a4a7a88';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([5, 5]);
                            ctx.beginPath(); ctx.moveTo(toX(0.5), padT); ctx.lineTo(toX(0.5), padT + plotH); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Intervention', toX(0.5), padT + plotH + 25);

                            // Control line (teal)
                            ctx.strokeStyle = '#3fb9a0';
                            ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(toX(0.25), toY(cPre)); ctx.lineTo(toX(0.75), toY(cPost)); ctx.stroke();
                            // Control dots
                            ctx.fillStyle = '#3fb9a0';
                            ctx.beginPath(); ctx.arc(toX(0.25), toY(cPre), 5, 0, Math.PI * 2); ctx.fill();
                            ctx.beginPath(); ctx.arc(toX(0.75), toY(cPost), 5, 0, Math.PI * 2); ctx.fill();

                            // Treatment actual line (blue)
                            ctx.strokeStyle = '#58a6ff';
                            ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(toX(0.25), toY(tPre)); ctx.lineTo(toX(0.75), toY(tPostActual)); ctx.stroke();
                            ctx.fillStyle = '#58a6ff';
                            ctx.beginPath(); ctx.arc(toX(0.25), toY(tPre), 5, 0, Math.PI * 2); ctx.fill();
                            ctx.beginPath(); ctx.arc(toX(0.75), toY(tPostActual), 5, 0, Math.PI * 2); ctx.fill();

                            // Counterfactual (dashed orange)
                            ctx.strokeStyle = '#f0883e';
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(toX(0.25), toY(tPre)); ctx.lineTo(toX(0.75), toY(tPostCF)); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = '#f0883e';
                            ctx.beginPath(); ctx.arc(toX(0.75), toY(tPostCF), 4, 0, Math.PI * 2); ctx.fill();

                            // Treatment effect brace
                            if (Math.abs(treatEffect) > 0.1) {
                                var xBrace = toX(0.82);
                                ctx.strokeStyle = '#f85149';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(xBrace, toY(tPostCF));
                                ctx.lineTo(xBrace, toY(tPostActual));
                                ctx.stroke();
                                // Arrow heads
                                ctx.beginPath();
                                ctx.moveTo(xBrace - 4, toY(tPostCF)); ctx.lineTo(xBrace + 4, toY(tPostCF)); ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(xBrace - 4, toY(tPostActual)); ctx.lineTo(xBrace + 4, toY(tPostActual)); ctx.stroke();
                                ctx.fillStyle = '#f85149';
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('DiD = ' + treatEffect.toFixed(1), xBrace + 8, (toY(tPostCF) + toY(tPostActual)) / 2);
                            }

                            // Legend
                            var legX = padL + 10, legY = padT + 10;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';

                            ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2.5; ctx.setLineDash([]);
                            ctx.beginPath(); ctx.moveTo(legX, legY); ctx.lineTo(legX + 20, legY); ctx.stroke();
                            ctx.fillStyle = '#58a6ff'; ctx.fillText('Treatment (observed)', legX + 26, legY);

                            ctx.strokeStyle = '#3fb9a0';
                            ctx.beginPath(); ctx.moveTo(legX, legY + 18); ctx.lineTo(legX + 20, legY + 18); ctx.stroke();
                            ctx.fillStyle = '#3fb9a0'; ctx.fillText('Control', legX + 26, legY + 18);

                            ctx.strokeStyle = '#f0883e'; ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(legX, legY + 36); ctx.lineTo(legX + 20, legY + 36); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = '#f0883e'; ctx.fillText('Counterfactual (no treatment)', legX + 26, legY + 36);

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Classic 2x2 Difference-in-Differences', width / 2, padT - 18);
                        }

                        draw();
                        slider.addEventListener('input', draw);
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: '<strong>Exercise 15.1.</strong> In a 2\u00D72 DiD design, the treatment group has pre-period mean \\(\\bar{Y}_{T,\\text{pre}} = 20\\) and post-period mean \\(\\bar{Y}_{T,\\text{post}} = 28\\). The control group has \\(\\bar{Y}_{C,\\text{pre}} = 15\\) and \\(\\bar{Y}_{C,\\text{post}} = 19\\). Compute the DiD estimate. Interpret it.',
                    hint: 'Apply the formula: \\(\\hat{\\tau}_{\\text{DiD}} = (\\bar{Y}_{T,\\text{post}} - \\bar{Y}_{T,\\text{pre}}) - (\\bar{Y}_{C,\\text{post}} - \\bar{Y}_{C,\\text{pre}})\\).',
                    solution: '<p>\\(\\hat{\\tau}_{\\text{DiD}} = (28 - 20) - (19 - 15) = 8 - 4 = 4\\).</p><p>The treatment group increased by 8 units and the control group increased by 4 units. The common trend (4 units) is subtracted, yielding an estimated treatment effect of 4 units. This is the causal effect of the intervention on the treated group, under the parallel trends assumption.</p>'
                },
                {
                    question: '<strong>Exercise 15.2.</strong> Explain why simply comparing post-period means \\(\\bar{Y}_{T,\\text{post}} - \\bar{Y}_{C,\\text{post}}\\) does not identify the causal effect, even if we have a valid control group. What does DiD add?',
                    hint: 'Think about what baseline differences between the groups can do to a simple post-period comparison.',
                    solution: '<p>A simple post-period comparison confounds the treatment effect with pre-existing differences between groups. If the treatment group already had a higher baseline, we cannot tell whether post-period differences reflect the treatment or the pre-existing gap. DiD removes the time-invariant group difference by subtracting each group\'s own pre-period mean, isolating the differential change attributable to the treatment.</p>'
                },
                {
                    question: '<strong>Exercise 15.3.</strong> In the Card & Krueger study, why was eastern Pennsylvania used as the control group rather than a random sample of US restaurants? What assumption does this choice aim to satisfy?',
                    hint: 'Think about the geographic, economic, and labor market similarity between New Jersey and eastern Pennsylvania.',
                    solution: '<p>Eastern Pennsylvania was chosen because it is geographically adjacent and shares similar economic conditions, labor markets, and consumer demographics with New Jersey. This makes the parallel trends assumption more plausible: absent the minimum wage increase, employment trends in New Jersey fast-food restaurants would have evolved similarly to those in eastern Pennsylvania. Using a geographically distant or economically dissimilar control group would make this assumption much less credible.</p>'
                },
                {
                    question: '<strong>Exercise 15.4.</strong> Show that the DiD estimator can be written as \\(\\hat{\\tau}_{\\text{DiD}} = (\\bar{Y}_{T,\\text{post}} - \\bar{Y}_{C,\\text{post}}) - (\\bar{Y}_{T,\\text{pre}} - \\bar{Y}_{C,\\text{pre}})\\). Why is this called "difference in differences"?',
                    hint: 'Rearrange the terms in the original formula.',
                    solution: '<p>Expanding the original formula: \\(\\hat{\\tau}_{\\text{DiD}} = \\bar{Y}_{T,\\text{post}} - \\bar{Y}_{T,\\text{pre}} - \\bar{Y}_{C,\\text{post}} + \\bar{Y}_{C,\\text{pre}} = (\\bar{Y}_{T,\\text{post}} - \\bar{Y}_{C,\\text{post}}) - (\\bar{Y}_{T,\\text{pre}} - \\bar{Y}_{C,\\text{pre}})\\). The first term is the between-group difference in the post-period, and the second is the between-group difference in the pre-period. We take the difference of these two differences, hence "difference-in-differences."</p>'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Parallel Trends Assumption
        // ================================================================
        {
            id: 'ch15-sec02',
            title: 'Parallel Trends Assumption',
            content: `
                <h2>Parallel Trends Assumption</h2>

                <p>The DiD estimator identifies the ATT only under a critical identifying assumption: the <strong>parallel trends assumption</strong>. Without it, DiD is just a descriptive statistic with no causal interpretation.</p>

                <div class="env-block definition">
                    <div class="env-title">Assumption 15.4 (Parallel Trends)</div>
                    <div class="env-body">
                        <p>In the absence of treatment, the average outcome for the treated group would have followed the same trend as the control group:</p>
                        \\[\\mathbb{E}[Y_{\\text{post}}(0) - Y_{\\text{pre}}(0) \\mid D = 1] = \\mathbb{E}[Y_{\\text{post}}(0) - Y_{\\text{pre}}(0) \\mid D = 0].\\]
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition</div>
                    <div class="env-body">
                        <p>Parallel trends says: had the treated group not been treated, its outcome would have changed by the same amount as the control group's outcome. The groups can have different <em>levels</em> (baseline differences are allowed), but they must have the same <em>trends</em> in the absence of treatment.</p>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 15.5 (DiD Identifies ATT under Parallel Trends)</div>
                    <div class="env-body">
                        <p>Under the parallel trends assumption,</p>
                        \\[\\hat{\\tau}_{\\text{DiD}} \\xrightarrow{p} \\tau_{\\text{ATT}} = \\mathbb{E}[Y_{\\text{post}}(1) - Y_{\\text{post}}(0) \\mid D = 1].\\]
                    </div>
                </div>

                <div class="env-block proof">
                    <div class="env-title">Proof</div>
                    <div class="env-body">
                        <p>The population DiD parameter is:</p>
                        \\[\\tau_{\\text{DiD}} = \\bigl(\\mathbb{E}[Y_{\\text{post}} \\mid D=1] - \\mathbb{E}[Y_{\\text{pre}} \\mid D=1]\\bigr) - \\bigl(\\mathbb{E}[Y_{\\text{post}} \\mid D=0] - \\mathbb{E}[Y_{\\text{pre}} \\mid D=0]\\bigr).\\]
                        <p>For the treated group in the post-period, \\(Y_{\\text{post}} = Y_{\\text{post}}(1)\\). In the pre-period, \\(Y_{\\text{pre}} = Y_{\\text{pre}}(0)\\) (no treatment yet). For the control group, \\(Y_t = Y_t(0)\\) in both periods. So:</p>
                        \\[\\tau_{\\text{DiD}} = \\bigl(\\mathbb{E}[Y_{\\text{post}}(1) \\mid D=1] - \\mathbb{E}[Y_{\\text{pre}}(0) \\mid D=1]\\bigr) - \\bigl(\\mathbb{E}[Y_{\\text{post}}(0) \\mid D=0] - \\mathbb{E}[Y_{\\text{pre}}(0) \\mid D=0]\\bigr).\\]
                        <p>Adding and subtracting \\(\\mathbb{E}[Y_{\\text{post}}(0) \\mid D=1]\\):</p>
                        \\[\\tau_{\\text{DiD}} = \\underbrace{\\mathbb{E}[Y_{\\text{post}}(1) - Y_{\\text{post}}(0) \\mid D=1]}_{\\tau_{\\text{ATT}}} + \\underbrace{\\mathbb{E}[Y_{\\text{post}}(0) - Y_{\\text{pre}}(0) \\mid D=1] - \\mathbb{E}[Y_{\\text{post}}(0) - Y_{\\text{pre}}(0) \\mid D=0]}_{= 0 \\text{ under parallel trends}}.\\]
                        <div class="qed">∎</div>
                    </div>
                </div>

                <h3>Why Parallel Trends Cannot Be Tested Directly</h3>

                <div class="env-block remark">
                    <div class="env-title">Remark 15.6</div>
                    <div class="env-body">
                        <p>The parallel trends assumption involves the counterfactual \\(Y_{\\text{post}}(0)\\) for the treated group, which is fundamentally unobservable. No amount of data can verify what <em>would have happened</em> to the treated group absent treatment. This is the same identification challenge that permeates all causal inference: the fundamental problem of missing counterfactuals.</p>
                    </div>
                </div>

                <h3>Pre-Trend Testing</h3>

                <p>While we cannot test parallel trends directly, we can examine whether trends were parallel in the <strong>pre-treatment periods</strong>. If we observe multiple pre-treatment periods, we can check:</p>
                \\[\\mathbb{E}[Y_t(0) - Y_{t-1}(0) \\mid D=1] \\approx \\mathbb{E}[Y_t(0) - Y_{t-1}(0) \\mid D=0], \\quad \\text{for } t \\leq t_0.\\]

                <div class="env-block remark">
                    <div class="env-title">Remark 15.7 (Limitations of Pre-Trend Tests)</div>
                    <div class="env-body">
                        <p>Parallel pre-trends are <strong>necessary but not sufficient</strong> for the parallel trends assumption. Pre-trends could diverge exactly at the intervention time due to anticipation effects, differential shocks, or nonlinear dynamics. Conversely, non-parallel pre-trends might reflect a pattern that could be modeled, allowing for a conditional parallel trends assumption.</p>
                    </div>
                </div>

                <h3>Violations and Their Consequences</h3>

                <p>When parallel trends is violated, the DiD estimator is biased. The bias equals the differential trend:</p>
                \\[\\text{Bias} = \\mathbb{E}[Y_{\\text{post}}(0) - Y_{\\text{pre}}(0) \\mid D=1] - \\mathbb{E}[Y_{\\text{post}}(0) - Y_{\\text{pre}}(0) \\mid D=0].\\]
                <p>If the treated group would have trended upward faster (even without treatment), DiD overestimates the treatment effect. If it would have trended slower, DiD underestimates it.</p>

                <div class="viz-placeholder" data-viz="viz-parallel-trends"></div>
            `,
            visualizations: [
                {
                    id: 'viz-parallel-trends',
                    title: 'Parallel Trends: Violation and Bias',
                    description: 'Adjust the degree of parallel trends violation and see how it biases the DiD estimate. When trends are truly parallel, DiD correctly identifies the treatment effect.',
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

                        var violation = 0;
                        var trueEffect = 3.0;

                        var sliderDiv = document.createElement('div');
                        sliderDiv.style.marginTop = '8px';
                        sliderDiv.style.display = 'flex';
                        sliderDiv.style.flexDirection = 'column';
                        sliderDiv.style.gap = '6px';

                        // Violation slider
                        var row1 = document.createElement('div');
                        row1.style.display = 'flex'; row1.style.alignItems = 'center'; row1.style.gap = '8px';
                        var lab1 = document.createElement('span');
                        lab1.textContent = 'Trend Violation:';
                        lab1.style.color = '#8b949e'; lab1.style.fontFamily = '-apple-system,sans-serif'; lab1.style.fontSize = '13px'; lab1.style.minWidth = '120px';
                        var sl1 = document.createElement('input');
                        sl1.type = 'range'; sl1.min = '-4'; sl1.max = '4'; sl1.step = '0.5'; sl1.value = '0';
                        sl1.style.width = '180px';
                        var val1 = document.createElement('span');
                        val1.style.color = '#f0f6fc'; val1.style.fontFamily = '-apple-system,sans-serif'; val1.style.fontSize = '13px';
                        row1.appendChild(lab1); row1.appendChild(sl1); row1.appendChild(val1);

                        // True effect slider
                        var row2 = document.createElement('div');
                        row2.style.display = 'flex'; row2.style.alignItems = 'center'; row2.style.gap = '8px';
                        var lab2 = document.createElement('span');
                        lab2.textContent = 'True Effect:';
                        lab2.style.color = '#8b949e'; lab2.style.fontFamily = '-apple-system,sans-serif'; lab2.style.fontSize = '13px'; lab2.style.minWidth = '120px';
                        var sl2 = document.createElement('input');
                        sl2.type = 'range'; sl2.min = '0'; sl2.max = '6'; sl2.step = '0.5'; sl2.value = '3';
                        sl2.style.width = '180px';
                        var val2 = document.createElement('span');
                        val2.style.color = '#f0f6fc'; val2.style.fontFamily = '-apple-system,sans-serif'; val2.style.fontSize = '13px';
                        row2.appendChild(lab2); row2.appendChild(sl2); row2.appendChild(val2);

                        sliderDiv.appendChild(row1);
                        sliderDiv.appendChild(row2);
                        controls.appendChild(sliderDiv);

                        // Data across 5 time points, treatment at t=3
                        var cBase = 5;
                        var cTrend = 1.5;
                        var tBase = 8;

                        function draw() {
                            violation = parseFloat(sl1.value);
                            trueEffect = parseFloat(sl2.value);
                            val1.textContent = violation.toFixed(1);
                            val2.textContent = trueEffect.toFixed(1);

                            var padL = 70, padR = 100, padT = 35, padB = 55;
                            var plotW = width - padL - padR;
                            var plotH = height - padT - padB;

                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, width, height);

                            // Grid
                            ctx.strokeStyle = '#1a1a4066';
                            ctx.lineWidth = 0.5;
                            for (var i = 0; i <= 8; i++) {
                                var gy = padT + plotH * i / 8;
                                ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(padL + plotW, gy); ctx.stroke();
                            }

                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke();

                            var times = [0, 1, 2, 3, 4];
                            var tIntervene = 2; // between t=2 and t=3
                            var yMin = 0;
                            var yMax = 22;

                            function toX(t) { return padL + plotW * t / 4; }
                            function toY(v) { return padT + plotH * (1 - (v - yMin) / (yMax - yMin)); }

                            // Control: linear trend
                            var cVals = times.map(function(t) { return cBase + cTrend * t; });
                            // Treatment CF (without treatment): cTrend + violation
                            var tTrend = cTrend + violation;
                            var tCFvals = times.map(function(t) { return tBase + tTrend * t; });
                            // Treatment actual: same as CF pre-treatment, add trueEffect post-treatment
                            var tActual = times.map(function(t) {
                                if (t <= tIntervene) return tBase + tTrend * t;
                                return tBase + tTrend * t + trueEffect;
                            });

                            // Intervention line
                            var xInt = (toX(2) + toX(3)) / 2;
                            ctx.strokeStyle = '#4a4a7a88';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([5, 5]);
                            ctx.beginPath(); ctx.moveTo(xInt, padT); ctx.lineTo(xInt, padT + plotH); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Intervention', xInt, padT + plotH + 25);

                            // X-axis labels
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '11px -apple-system,sans-serif';
                            times.forEach(function(t) { ctx.fillText('t=' + t, toX(t), padT + plotH + 8); });

                            // Y-axis labels
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yl = 0; yl <= yMax; yl += 4) {
                                ctx.fillText(yl.toFixed(0), padL - 8, toY(yl));
                            }

                            // Draw control line (teal)
                            ctx.strokeStyle = '#3fb9a0'; ctx.lineWidth = 2.5; ctx.setLineDash([]);
                            ctx.beginPath();
                            times.forEach(function(t, i) {
                                if (i === 0) ctx.moveTo(toX(t), toY(cVals[i]));
                                else ctx.lineTo(toX(t), toY(cVals[i]));
                            });
                            ctx.stroke();
                            ctx.fillStyle = '#3fb9a0';
                            times.forEach(function(t, i) {
                                ctx.beginPath(); ctx.arc(toX(t), toY(cVals[i]), 4, 0, Math.PI * 2); ctx.fill();
                            });

                            // Draw treatment actual (blue)
                            ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            times.forEach(function(t, i) {
                                if (i === 0) ctx.moveTo(toX(t), toY(tActual[i]));
                                else ctx.lineTo(toX(t), toY(tActual[i]));
                            });
                            ctx.stroke();
                            ctx.fillStyle = '#58a6ff';
                            times.forEach(function(t, i) {
                                ctx.beginPath(); ctx.arc(toX(t), toY(tActual[i]), 4, 0, Math.PI * 2); ctx.fill();
                            });

                            // Draw counterfactual (dashed orange) - what DiD assumes
                            var didCFvals = times.map(function(t) { return tBase + cTrend * t; });
                            ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            for (var j = tIntervene; j < times.length; j++) {
                                if (j === tIntervene) ctx.moveTo(toX(times[j]), toY(didCFvals[j]));
                                else ctx.lineTo(toX(times[j]), toY(didCFvals[j]));
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // True counterfactual (dotted purple) if violation != 0
                            if (Math.abs(violation) > 0.01) {
                                ctx.strokeStyle = '#bc8cff'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
                                ctx.beginPath();
                                for (var k = tIntervene; k < times.length; k++) {
                                    if (k === tIntervene) ctx.moveTo(toX(times[k]), toY(tCFvals[k]));
                                    else ctx.lineTo(toX(times[k]), toY(tCFvals[k]));
                                }
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // DiD estimate and bias info
                            var lastT = times.length - 1;
                            var didEstimate = tActual[lastT] - didCFvals[lastT];
                            var bias = didEstimate - trueEffect;

                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            var infoX = padL + plotW + 10;
                            ctx.fillText('DiD est: ' + didEstimate.toFixed(1), infoX, padT + 20);
                            ctx.fillText('True: ' + trueEffect.toFixed(1), infoX, padT + 38);
                            ctx.fillStyle = Math.abs(bias) < 0.01 ? '#3fb950' : '#f85149';
                            ctx.fillText('Bias: ' + bias.toFixed(1), infoX, padT + 56);

                            // Legend
                            var legY = padT + plotH - 70;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2; ctx.setLineDash([]);
                            ctx.beginPath(); ctx.moveTo(infoX, legY); ctx.lineTo(infoX + 16, legY); ctx.stroke();
                            ctx.fillStyle = '#58a6ff'; ctx.fillText('Treated', infoX + 20, legY);

                            ctx.strokeStyle = '#3fb9a0';
                            ctx.beginPath(); ctx.moveTo(infoX, legY + 16); ctx.lineTo(infoX + 16, legY + 16); ctx.stroke();
                            ctx.fillStyle = '#3fb9a0'; ctx.fillText('Control', infoX + 20, legY + 16);

                            ctx.strokeStyle = '#f0883e'; ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(infoX, legY + 32); ctx.lineTo(infoX + 16, legY + 32); ctx.stroke();
                            ctx.fillStyle = '#f0883e'; ctx.fillText('DiD CF', infoX + 20, legY + 32);
                            ctx.setLineDash([]);

                            if (Math.abs(violation) > 0.01) {
                                ctx.strokeStyle = '#bc8cff'; ctx.setLineDash([3, 3]);
                                ctx.beginPath(); ctx.moveTo(infoX, legY + 48); ctx.lineTo(infoX + 16, legY + 48); ctx.stroke();
                                ctx.fillStyle = '#bc8cff'; ctx.fillText('True CF', infoX + 20, legY + 48);
                                ctx.setLineDash([]);
                            }

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Parallel Trends Violation & DiD Bias', width / 2, padT - 18);
                        }

                        draw();
                        sl1.addEventListener('input', draw);
                        sl2.addEventListener('input', draw);
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: '<strong>Exercise 15.5.</strong> State the parallel trends assumption formally using potential outcomes. Why can\'t we test this assumption directly?',
                    hint: 'What is the counterfactual quantity that appears in the assumption, and why is it unobservable?',
                    solution: '<p>The parallel trends assumption states: \\(\\mathbb{E}[Y_{\\text{post}}(0) - Y_{\\text{pre}}(0) \\mid D = 1] = \\mathbb{E}[Y_{\\text{post}}(0) - Y_{\\text{pre}}(0) \\mid D = 0]\\). We cannot test this directly because the left-hand side involves \\(Y_{\\text{post}}(0)\\) for the treated group -- the outcome the treated units would have experienced without treatment in the post-period. Since these units were actually treated, this potential outcome is never observed. Any test using observed data can only assess pre-treatment trends, which is suggestive but not definitive.</p>'
                },
                {
                    question: '<strong>Exercise 15.6.</strong> Suppose treated firms were growing faster than control firms even before the policy intervention. How does this violate parallel trends, and in which direction would DiD be biased?',
                    hint: 'If the treatment group\'s counterfactual trend exceeds the control\'s trend, what happens to the DiD estimate?',
                    solution: '<p>If treated firms were already growing faster, then \\(\\mathbb{E}[Y_{\\text{post}}(0) - Y_{\\text{pre}}(0) \\mid D=1] > \\mathbb{E}[Y_{\\text{post}}(0) - Y_{\\text{pre}}(0) \\mid D=0]\\). The DiD estimator attributes the faster trend to the treatment effect, so DiD overestimates the causal effect. The bias equals the differential trend: \\(\\text{Bias} = \\mathbb{E}[\\Delta Y(0) \\mid D=1] - \\mathbb{E}[\\Delta Y(0) \\mid D=0] > 0\\).</p>'
                },
                {
                    question: '<strong>Exercise 15.7.</strong> You observe 5 pre-treatment periods and find that treatment and control groups follow nearly identical trends. Does this prove the parallel trends assumption holds? Give a specific scenario where pre-trends are parallel but the assumption fails.',
                    hint: 'Think about anticipation effects or compositional changes that coincide with treatment timing.',
                    solution: '<p>No, parallel pre-trends do not prove the assumption holds in the post-period. Example: a job training program is announced 6 months before enrollment. Motivated workers (who select into the program) start studying on their own in anticipation, while their productivity evolves identically to the control group during the 5 pre-announcement periods. After announcement but before formal enrollment, treated workers\' counterfactual outcomes begin diverging upward. The pre-trends are parallel, but the post-treatment counterfactual trend differs. Another example: a local economic shock affects the treatment region simultaneously with the policy change.</p>'
                },
                {
                    question: '<strong>Exercise 15.8.</strong> Suppose the bias from a parallel trends violation is \\(\\delta\\). Express the DiD estimate as a function of the true ATT and \\(\\delta\\). Under what sign of \\(\\delta\\) does DiD yield a lower bound on the true effect?',
                    hint: 'Write \\(\\hat{\\tau}_{\\text{DiD}} = \\tau_{\\text{ATT}} + \\delta\\) and consider the sign of \\(\\delta\\).',
                    solution: '<p>\\(\\hat{\\tau}_{\\text{DiD}} = \\tau_{\\text{ATT}} + \\delta\\), where \\(\\delta = \\mathbb{E}[\\Delta Y(0) \\mid D=1] - \\mathbb{E}[\\Delta Y(0) \\mid D=0]\\). When \\(\\delta < 0\\) (the treated group would have trended downward relative to the control), \\(\\hat{\\tau}_{\\text{DiD}} < \\tau_{\\text{ATT}}\\), so DiD underestimates and provides a lower bound. When \\(\\delta > 0\\), DiD overestimates. Knowing the likely sign of \\(\\delta\\) from context lets you bound the true effect.</p>'
                }
            ]
        },

        // ================================================================
        // SECTION 3: DiD with Regression
        // ================================================================
        {
            id: 'ch15-sec03',
            title: 'DiD with Regression',
            content: `
                <h2>DiD with Regression</h2>

                <p>The 2\u00D72 DiD estimator has a natural regression implementation that makes it easy to incorporate covariates, compute standard errors, and extend to multiple periods or groups.</p>

                <h3>The Basic DiD Regression</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 15.8 (DiD Regression Model)</div>
                    <div class="env-body">
                        <p>The standard DiD regression specification is:</p>
                        \\[Y_{it} = \\alpha + \\beta \\cdot \\text{Treat}_i + \\gamma \\cdot \\text{Post}_t + \\delta \\cdot (\\text{Treat}_i \\times \\text{Post}_t) + \\varepsilon_{it}\\]
                        <p>where:</p>
                        <ul>
                            <li>\\(\\text{Treat}_i = 1\\) if unit \\(i\\) is in the treatment group</li>
                            <li>\\(\\text{Post}_t = 1\\) if time \\(t\\) is in the post-treatment period</li>
                            <li>\\(\\alpha\\) = baseline mean for control in the pre-period</li>
                            <li>\\(\\beta\\) = pre-treatment difference between groups</li>
                            <li>\\(\\gamma\\) = time trend common to both groups</li>
                            <li>\\(\\delta\\) = <strong>the DiD estimate</strong> (the causal effect of interest)</li>
                        </ul>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Proposition 15.9 (Regression Recovers the DiD Estimator)</div>
                    <div class="env-body">
                        <p>The OLS estimate \\(\\hat{\\delta}\\) from the regression above is numerically identical to the 2\u00D72 DiD estimator:</p>
                        \\[\\hat{\\delta} = (\\bar{Y}_{T,\\text{post}} - \\bar{Y}_{T,\\text{pre}}) - (\\bar{Y}_{C,\\text{post}} - \\bar{Y}_{C,\\text{pre}}).\\]
                    </div>
                </div>

                <div class="env-block proof">
                    <div class="env-title">Proof</div>
                    <div class="env-body">
                        <p>The four cell means satisfy:</p>
                        \\[\\bar{Y}_{C,\\text{pre}} = \\hat{\\alpha}, \\quad \\bar{Y}_{T,\\text{pre}} = \\hat{\\alpha} + \\hat{\\beta}, \\quad \\bar{Y}_{C,\\text{post}} = \\hat{\\alpha} + \\hat{\\gamma}, \\quad \\bar{Y}_{T,\\text{post}} = \\hat{\\alpha} + \\hat{\\beta} + \\hat{\\gamma} + \\hat{\\delta}.\\]
                        <p>Computing the DiD from these means:</p>
                        \\[(\\hat{\\alpha} + \\hat{\\beta} + \\hat{\\gamma} + \\hat{\\delta} - \\hat{\\alpha} - \\hat{\\beta}) - (\\hat{\\alpha} + \\hat{\\gamma} - \\hat{\\alpha}) = \\hat{\\delta}.\\]
                        <div class="qed">∎</div>
                    </div>
                </div>

                <h3>Adding Covariates</h3>

                <p>The regression framework allows adding covariates to improve precision and allow for conditional parallel trends:</p>
                \\[Y_{it} = \\alpha + \\beta \\cdot \\text{Treat}_i + \\gamma \\cdot \\text{Post}_t + \\delta \\cdot (\\text{Treat}_i \\times \\text{Post}_t) + X_{it}'\\theta + \\varepsilon_{it}.\\]

                <div class="env-block remark">
                    <div class="env-title">Remark 15.10 (Conditional Parallel Trends)</div>
                    <div class="env-body">
                        <p>Adding covariates relaxes the parallel trends assumption from unconditional to <strong>conditional</strong>: the trends need only be parallel after conditioning on \\(X\\). This is useful when treatment and control groups differ in characteristics that predict outcome trends (e.g., age, region, industry). Including such covariates can make parallel trends more plausible.</p>
                    </div>
                </div>

                <h3>Clustering Standard Errors</h3>

                <div class="env-block remark">
                    <div class="env-title">Remark 15.11 (Why Cluster?)</div>
                    <div class="env-body">
                        <p>In DiD settings, outcomes within the same unit are typically correlated over time, and outcomes within the same group may be correlated across units. Conventional OLS standard errors ignore this serial and cross-sectional correlation, leading to dramatically over-rejected null hypotheses. Bertrand, Duflo, and Mullainathan (2004) showed that clustering standard errors at the treatment-group level is essential for valid inference.</p>
                        <p>The general rule: <strong>cluster at the level of treatment assignment</strong>. If treatment is assigned at the state level, cluster at the state level. If at the firm level, cluster at the firm level.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 15.12 (DiD Regression for Card & Krueger)</div>
                    <div class="env-body">
                        <p>For the minimum wage study, the regression would be:</p>
                        \\[\\text{FTE}_{it} = \\alpha + \\beta \\cdot \\text{NJ}_i + \\gamma \\cdot \\text{After}_t + \\delta \\cdot (\\text{NJ}_i \\times \\text{After}_t) + \\varepsilon_{it}\\]
                        <p>where \\(\\text{NJ}_i = 1\\) for New Jersey restaurants and \\(\\text{After}_t = 1\\) for the post-increase survey. The coefficient \\(\\delta\\) estimates the effect of the minimum wage increase on FTE employment. Standard errors should be clustered at the state level (though with only 2 states, this is challenging -- see wild bootstrap methods).</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-did-regression"></div>
            `,
            visualizations: [
                {
                    id: 'viz-did-regression',
                    title: 'DiD Regression Surfaces',
                    description: 'See how the four regression coefficients map to the 2\u00D72 cell means. Adjust parameters to see the regression surface change.',
                    setup: function(container, controls) {
                        var width = Math.min(container.clientWidth - 32, 700);
                        var height = Math.round(width * 0.65);
                        var canvas = document.createElement('canvas');
                        var dpr = window.devicePixelRatio || 1;
                        canvas.width = width * dpr;
                        canvas.height = height * dpr;
                        canvas.style.width = width + 'px';
                        canvas.style.height = height + 'px';
                        var ctx = canvas.getContext('2d');
                        ctx.scale(dpr, dpr);
                        container.appendChild(canvas);

                        var alpha = 5, beta = 3, gamma = 2, delta = 3;

                        function makeSlider(labelText, min, max, step, initial, parent) {
                            var row = document.createElement('div');
                            row.style.display = 'flex'; row.style.alignItems = 'center'; row.style.gap = '8px';
                            var lab = document.createElement('span');
                            lab.style.color = '#8b949e'; lab.style.fontFamily = '-apple-system,sans-serif'; lab.style.fontSize = '13px'; lab.style.minWidth = '30px';
                            lab.textContent = labelText;
                            var sl = document.createElement('input');
                            sl.type = 'range'; sl.min = String(min); sl.max = String(max); sl.step = String(step); sl.value = String(initial);
                            sl.style.width = '140px';
                            var val = document.createElement('span');
                            val.style.color = '#f0f6fc'; val.style.fontFamily = '-apple-system,sans-serif'; val.style.fontSize = '13px'; val.style.minWidth = '30px';
                            row.appendChild(lab); row.appendChild(sl); row.appendChild(val);
                            parent.appendChild(row);
                            return { slider: sl, valueLabel: val };
                        }

                        var sliderDiv = document.createElement('div');
                        sliderDiv.style.marginTop = '8px';
                        sliderDiv.style.display = 'grid';
                        sliderDiv.style.gridTemplateColumns = '1fr 1fr';
                        sliderDiv.style.gap = '4px 16px';
                        controls.appendChild(sliderDiv);

                        var sAlpha = makeSlider('\u03B1:', 0, 10, 0.5, alpha, sliderDiv);
                        var sBeta = makeSlider('\u03B2:', -5, 8, 0.5, beta, sliderDiv);
                        var sGamma = makeSlider('\u03B3:', -3, 6, 0.5, gamma, sliderDiv);
                        var sDelta = makeSlider('\u03B4:', -4, 8, 0.5, delta, sliderDiv);

                        function draw() {
                            alpha = parseFloat(sAlpha.slider.value);
                            beta = parseFloat(sBeta.slider.value);
                            gamma = parseFloat(sGamma.slider.value);
                            delta = parseFloat(sDelta.slider.value);
                            sAlpha.valueLabel.textContent = alpha.toFixed(1);
                            sBeta.valueLabel.textContent = beta.toFixed(1);
                            sGamma.valueLabel.textContent = gamma.toFixed(1);
                            sDelta.valueLabel.textContent = delta.toFixed(1);

                            var cPre = alpha;
                            var cPost = alpha + gamma;
                            var tPre = alpha + beta;
                            var tPost = alpha + beta + gamma + delta;

                            var padL = 80, padR = 30, padT = 35, padB = 55;
                            var plotW = width - padL - padR;
                            var plotH = height - padT - padB;

                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, width, height);

                            // Grid
                            ctx.strokeStyle = '#1a1a4066';
                            ctx.lineWidth = 0.5;
                            for (var i = 0; i <= 10; i++) {
                                var gy = padT + plotH * i / 10;
                                ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(padL + plotW, gy); ctx.stroke();
                            }

                            // Axes
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke();

                            var yMin = Math.min(cPre, cPost, tPre, tPost, 0) - 1;
                            var yMax = Math.max(cPre, cPost, tPre, tPost) + 2;

                            function toX(t) { return padL + plotW * (t === 0 ? 0.25 : 0.75); }
                            function toY(v) { return padT + plotH * (1 - (v - yMin) / (yMax - yMin)); }

                            // X labels
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Pre (Post=0)', toX(0), padT + plotH + 8);
                            ctx.fillText('Post (Post=1)', toX(1), padT + plotH + 8);

                            // Y labels
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            var yStep = Math.max(1, Math.round((yMax - yMin) / 8));
                            for (var yl = Math.ceil(yMin); yl <= yMax; yl += yStep) {
                                ctx.fillText(yl.toFixed(0), padL - 8, toY(yl));
                            }

                            // Control line (teal)
                            ctx.strokeStyle = '#3fb9a0'; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(toX(0), toY(cPre)); ctx.lineTo(toX(1), toY(cPost)); ctx.stroke();
                            ctx.fillStyle = '#3fb9a0';
                            ctx.beginPath(); ctx.arc(toX(0), toY(cPre), 6, 0, Math.PI * 2); ctx.fill();
                            ctx.beginPath(); ctx.arc(toX(1), toY(cPost), 6, 0, Math.PI * 2); ctx.fill();

                            // Treatment line (blue)
                            ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(toX(0), toY(tPre)); ctx.lineTo(toX(1), toY(tPost)); ctx.stroke();
                            ctx.fillStyle = '#58a6ff';
                            ctx.beginPath(); ctx.arc(toX(0), toY(tPre), 6, 0, Math.PI * 2); ctx.fill();
                            ctx.beginPath(); ctx.arc(toX(1), toY(tPost), 6, 0, Math.PI * 2); ctx.fill();

                            // Counterfactual (dashed orange)
                            var tPostCF = alpha + beta + gamma;
                            ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(toX(0), toY(tPre)); ctx.lineTo(toX(1), toY(tPostCF)); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = '#f0883e';
                            ctx.beginPath(); ctx.arc(toX(1), toY(tPostCF), 4, 0, Math.PI * 2); ctx.fill();

                            // Annotations
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            // Alpha annotation
                            ctx.fillStyle = '#f0f6fc';
                            ctx.fillText('\u03B1 = ' + alpha.toFixed(1), toX(0) + 10, toY(cPre) + 4);

                            // Beta annotation
                            if (Math.abs(beta) > 0.1) {
                                ctx.strokeStyle = '#bc8cff'; ctx.lineWidth = 1.5;
                                var bx = toX(0) - 15;
                                ctx.beginPath(); ctx.moveTo(bx, toY(cPre)); ctx.lineTo(bx, toY(tPre)); ctx.stroke();
                                ctx.fillStyle = '#bc8cff';
                                ctx.textAlign = 'right';
                                ctx.fillText('\u03B2=' + beta.toFixed(1), bx - 4, (toY(cPre) + toY(tPre)) / 2);
                            }

                            // Gamma annotation
                            if (Math.abs(gamma) > 0.1) {
                                ctx.strokeStyle = '#d29922'; ctx.lineWidth = 1.5;
                                var gx = toX(1) + 10;
                                ctx.beginPath(); ctx.moveTo(gx, toY(cPre)); ctx.lineTo(gx, toY(cPost)); ctx.stroke();
                                ctx.fillStyle = '#d29922';
                                ctx.textAlign = 'left';
                                ctx.fillText('\u03B3=' + gamma.toFixed(1), gx + 4, (toY(cPre) + toY(cPost)) / 2);
                            }

                            // Delta annotation
                            if (Math.abs(delta) > 0.1) {
                                ctx.strokeStyle = '#f85149'; ctx.lineWidth = 2;
                                var dx = toX(1) + 30;
                                ctx.beginPath(); ctx.moveTo(dx, toY(tPostCF)); ctx.lineTo(dx, toY(tPost)); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(dx - 4, toY(tPostCF)); ctx.lineTo(dx + 4, toY(tPostCF)); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(dx - 4, toY(tPost)); ctx.lineTo(dx + 4, toY(tPost)); ctx.stroke();
                                ctx.fillStyle = '#f85149';
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('\u03B4=' + delta.toFixed(1), dx + 6, (toY(tPostCF) + toY(tPost)) / 2);
                            }

                            // Labels for lines
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = '#3fb9a0';
                            ctx.fillText('Control: ' + cPre.toFixed(1) + ' \u2192 ' + cPost.toFixed(1), toX(1) + 10, toY(cPost) + 4);
                            ctx.fillStyle = '#58a6ff';
                            ctx.fillText('Treated: ' + tPre.toFixed(1) + ' \u2192 ' + tPost.toFixed(1), toX(1) + 10, toY(tPost) + 4);

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('DiD Regression: Y = \u03B1 + \u03B2\u00B7Treat + \u03B3\u00B7Post + \u03B4\u00B7(Treat\u00D7Post)', width / 2, padT - 18);
                        }

                        draw();
                        sAlpha.slider.addEventListener('input', draw);
                        sBeta.slider.addEventListener('input', draw);
                        sGamma.slider.addEventListener('input', draw);
                        sDelta.slider.addEventListener('input', draw);
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: '<strong>Exercise 15.9.</strong> Consider the regression \\(Y_{it} = \\alpha + \\beta \\cdot \\text{Treat}_i + \\gamma \\cdot \\text{Post}_t + \\delta \\cdot (\\text{Treat}_i \\times \\text{Post}_t) + \\varepsilon_{it}\\). Express the four cell means \\(\\bar{Y}_{C,\\text{pre}}, \\bar{Y}_{T,\\text{pre}}, \\bar{Y}_{C,\\text{post}}, \\bar{Y}_{T,\\text{post}}\\) in terms of \\(\\alpha, \\beta, \\gamma, \\delta\\).',
                    hint: 'Substitute the appropriate values of Treat and Post (0 or 1) to get each cell mean.',
                    solution: '<p>Setting the indicator values:</p><ul><li>Control, Pre (Treat=0, Post=0): \\(\\bar{Y}_{C,\\text{pre}} = \\alpha\\)</li><li>Treatment, Pre (Treat=1, Post=0): \\(\\bar{Y}_{T,\\text{pre}} = \\alpha + \\beta\\)</li><li>Control, Post (Treat=0, Post=1): \\(\\bar{Y}_{C,\\text{post}} = \\alpha + \\gamma\\)</li><li>Treatment, Post (Treat=1, Post=1): \\(\\bar{Y}_{T,\\text{post}} = \\alpha + \\beta + \\gamma + \\delta\\)</li></ul><p>The DiD estimate is \\(\\delta = (\\alpha + \\beta + \\gamma + \\delta - \\alpha - \\beta) - (\\alpha + \\gamma - \\alpha) = \\delta\\), confirming the regression coefficient equals the DiD estimator.</p>'
                },
                {
                    question: '<strong>Exercise 15.10.</strong> Why should standard errors in DiD regressions be clustered? What happens to inference if you use conventional (homoskedastic) standard errors? At what level should you cluster?',
                    hint: 'Think about serial correlation within units and what Bertrand, Duflo, and Mullainathan (2004) found.',
                    solution: '<p>DiD data has panel structure: the same units are observed at multiple times. This creates serial correlation within units that conventional standard errors ignore. Bertrand et al. (2004) showed that ignoring serial correlation leads to standard errors that are far too small, causing rejection rates of 30-45% for a 5% nominal test. Standard errors should be clustered at the level of treatment assignment (e.g., state, firm) to account for within-cluster correlation. This produces valid confidence intervals and hypothesis tests.</p>'
                },
                {
                    question: '<strong>Exercise 15.11.</strong> Suppose you add a covariate \\(X_{it}\\) to the DiD regression. Under what conditions does this change the estimate \\(\\hat{\\delta}\\) compared to the basic model? When does it only improve precision?',
                    hint: 'Think about the Frisch-Waugh-Lovell theorem and when the covariate is correlated with the interaction term.',
                    solution: '<p>By the Frisch-Waugh-Lovell theorem, adding \\(X_{it}\\) changes \\(\\hat{\\delta}\\) if and only if \\(X_{it}\\) is correlated with \\(\\text{Treat}_i \\times \\text{Post}_t\\) after partialing out the other regressors. If \\(X_{it}\\) is a time-invariant characteristic or a common time effect, it is absorbed by \\(\\text{Treat}_i\\) and \\(\\text{Post}_t\\), so \\(\\hat{\\delta}\\) is unchanged. If \\(X_{it}\\) varies differentially across groups and time, it can change \\(\\hat{\\delta}\\), which corresponds to conditional parallel trends. When \\(X_{it}\\) is independent of the interaction term, it only reduces residual variance and improves precision (smaller standard errors).</p>'
                },
                {
                    question: '<strong>Exercise 15.12.</strong> With only 2 clusters (e.g., 2 states), cluster-robust standard errors perform poorly. What alternative inference methods can you use? Name at least two.',
                    hint: 'Think about permutation-based or bootstrap-based approaches.',
                    solution: '<p>With very few clusters, cluster-robust standard errors are unreliable because they rely on asymptotic theory that requires many clusters. Alternatives include: (1) <strong>Wild cluster bootstrap</strong> (Cameron, Gelbach, and Miller, 2008): resamples cluster-level residuals with random sign changes, providing valid p-values with few clusters. (2) <strong>Permutation inference</strong>: randomly reassign treatment status across clusters and compute the distribution of the test statistic under the null. (3) <strong>Randomization inference</strong> (Fisher exact test): similar to permutation, based on the randomization distribution. (4) <strong>Aggregation</strong>: collapse data to cluster-period level and run the regression on the collapsed data with conventional standard errors (feasible with 2 groups and 2 periods).</p>'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Triple Differences (DDD)
        // ================================================================
        {
            id: 'ch15-sec04',
            title: 'Triple Differences (DDD)',
            content: `
                <h2>Triple Differences (DDD)</h2>

                <p>Sometimes the parallel trends assumption for standard DiD is difficult to defend. <strong>Triple Differences (DDD)</strong> adds a third dimension of variation to relax this assumption, providing a more robust estimator when a suitable within-group comparison is available.</p>

                <h3>The DDD Idea</h3>

                <p>DDD adds a <strong>within-group</strong> comparison dimension. For example, in studying the effect of a health insurance mandate on hospital spending:</p>
                <ul>
                    <li><strong>Treatment group</strong>: people in states that adopted the mandate</li>
                    <li><strong>Control group</strong>: people in states that did not</li>
                    <li><strong>Affected subgroup</strong>: people of eligible age (e.g., under 26)</li>
                    <li><strong>Unaffected subgroup</strong>: people above the age cutoff</li>
                </ul>

                <div class="env-block definition">
                    <div class="env-title">Definition 15.13 (DDD Estimator)</div>
                    <div class="env-body">
                        <p>The DDD estimator uses three levels of differencing:</p>
                        \\[\\hat{\\tau}_{\\text{DDD}} = \\bigl[\\text{DiD}_{\\text{affected}}\\bigr] - \\bigl[\\text{DiD}_{\\text{unaffected}}\\bigr]\\]
                        <p>where each DiD is the standard treatment-minus-control pre-post comparison within the respective subgroup.</p>
                    </div>
                </div>

                <h3>DDD Regression</h3>

                <div class="env-block definition">
                    <div class="env-title">Definition 15.14 (DDD Regression Model)</div>
                    <div class="env-body">
                        <p>The full DDD regression includes all main effects, two-way interactions, and the triple interaction:</p>
                        \\[Y_{itg} = \\alpha + \\beta_1 \\text{Treat}_i + \\beta_2 \\text{Post}_t + \\beta_3 \\text{Group}_g + \\beta_4 (\\text{Treat}_i \\times \\text{Post}_t) + \\beta_5 (\\text{Treat}_i \\times \\text{Group}_g) + \\beta_6 (\\text{Post}_t \\times \\text{Group}_g) + \\delta (\\text{Treat}_i \\times \\text{Post}_t \\times \\text{Group}_g) + \\varepsilon_{itg}\\]
                        <p>where \\(\\text{Group}_g = 1\\) for the affected subgroup. The coefficient \\(\\delta\\) on the triple interaction is the DDD estimate.</p>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition: Why DDD Helps</div>
                    <div class="env-body">
                        <p>Standard DiD assumes that the treatment and control groups would have trended identically. DDD relaxes this: it allows for differential trends between treatment and control <em>as long as those trends affect the two subgroups equally</em>. The unaffected subgroup serves as a within-group control that absorbs any differential trends that are not specific to the affected subgroup.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 15.15 (ACA Dependent Coverage Mandate)</div>
                    <div class="env-body">
                        <p>The Affordable Care Act allowed young adults (under 26) to stay on their parents' health insurance. A DDD design might use:</p>
                        <ul>
                            <li><strong>Treated states</strong>: states without prior mandates (newly affected by ACA)</li>
                            <li><strong>Control states</strong>: states that already had similar mandates</li>
                            <li><strong>Affected group</strong>: 23-25 year olds</li>
                            <li><strong>Unaffected group</strong>: 27-29 year olds</li>
                        </ul>
                        <p>The DDD removes any state-level trend differences that affect both age groups equally, isolating the effect on the targeted age group.</p>
                    </div>
                </div>

                <h3>Assumptions for DDD</h3>

                <div class="env-block remark">
                    <div class="env-title">Remark 15.16 (DDD Identifying Assumption)</div>
                    <div class="env-body">
                        <p>DDD requires a weaker assumption than DiD: the <em>difference in trends</em> between affected and unaffected subgroups must be the same across treatment and control groups. Formally:</p>
                        \\[\\bigl(\\text{Trend}_{T,\\text{affected}} - \\text{Trend}_{T,\\text{unaffected}}\\bigr) = \\bigl(\\text{Trend}_{C,\\text{affected}} - \\text{Trend}_{C,\\text{unaffected}}\\bigr).\\]
                        <p>This is often more plausible than the simple parallel trends assumption because it allows for level and trend differences across states, as long as the age-gap in trends is stable.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-triple-diff"></div>
            `,
            visualizations: [
                {
                    id: 'viz-triple-diff',
                    title: '3D Triple Differences',
                    description: 'Visualize the DDD design with three dimensions: treatment status, time, and subgroup. See how the triple difference removes biases that standard DiD cannot.',
                    setup: function(container, controls) {
                        var width = Math.min(container.clientWidth - 32, 700);
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

                        var trueEffect = 4;
                        var trendViolation = 2; // differential trend between treat/control

                        var sliderDiv = document.createElement('div');
                        sliderDiv.style.marginTop = '8px';
                        sliderDiv.style.display = 'flex';
                        sliderDiv.style.flexDirection = 'column';
                        sliderDiv.style.gap = '6px';

                        function makeRow(labelText, min, max, step, initial) {
                            var row = document.createElement('div');
                            row.style.display = 'flex'; row.style.alignItems = 'center'; row.style.gap = '8px';
                            var lab = document.createElement('span');
                            lab.textContent = labelText;
                            lab.style.color = '#8b949e'; lab.style.fontFamily = '-apple-system,sans-serif'; lab.style.fontSize = '13px'; lab.style.minWidth = '140px';
                            var sl = document.createElement('input');
                            sl.type = 'range'; sl.min = String(min); sl.max = String(max); sl.step = String(step); sl.value = String(initial);
                            sl.style.width = '160px';
                            var val = document.createElement('span');
                            val.style.color = '#f0f6fc'; val.style.fontFamily = '-apple-system,sans-serif'; val.style.fontSize = '13px';
                            row.appendChild(lab); row.appendChild(sl); row.appendChild(val);
                            sliderDiv.appendChild(row);
                            return { slider: sl, valueLabel: val };
                        }

                        var sEffect = makeRow('Treatment Effect:', 0, 8, 0.5, trueEffect);
                        var sViolation = makeRow('DiD Trend Violation:', -4, 4, 0.5, trendViolation);
                        controls.appendChild(sliderDiv);

                        // Base values
                        var baseTrend = 2; // common time trend

                        function draw() {
                            trueEffect = parseFloat(sEffect.slider.value);
                            trendViolation = parseFloat(sViolation.slider.value);
                            sEffect.valueLabel.textContent = trueEffect.toFixed(1);
                            sViolation.valueLabel.textContent = trendViolation.toFixed(1);

                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, width, height);

                            var padL = 50, padR = 20, padT = 40, padB = 30;
                            var plotW = width - padL - padR;
                            var plotH = height - padT - padB;

                            // Two side-by-side panels
                            var panelW = (plotW - 40) / 2;
                            var panelH = plotH - 50;

                            // Cell values
                            // Control group: affected pre=6, unaffected pre=4
                            // Treatment group: affected pre=8, unaffected pre=6
                            var cAffPre = 6, cUnPre = 4;
                            var tAffPre = 8, tUnPre = 6;
                            var cAffPost = cAffPre + baseTrend;
                            var cUnPost = cUnPre + baseTrend;
                            var tAffPost = tAffPre + baseTrend + trendViolation + trueEffect;
                            var tUnPost = tUnPre + baseTrend + trendViolation;

                            var yMin = 0;
                            var yMax = Math.max(cAffPost, cUnPost, tAffPost, tUnPost) + 2;

                            function drawPanel(px, py, title, affPre, affPost, unPre, unPost, color) {
                                // Panel border
                                ctx.strokeStyle = '#4a4a7a44';
                                ctx.lineWidth = 1;
                                ctx.strokeRect(px, py, panelW, panelH);

                                // Title
                                ctx.fillStyle = '#f0f6fc';
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(title, px + panelW / 2, py - 8);

                                var innerPad = 30;
                                var iW = panelW - 2 * innerPad;
                                var iH = panelH - 40;

                                function toX(t) { return px + innerPad + iW * (t === 0 ? 0.2 : 0.8); }
                                function toY(v) { return py + 20 + iH * (1 - (v - yMin) / (yMax - yMin)); }

                                // Axes
                                ctx.strokeStyle = '#4a4a7a';
                                ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(px + innerPad, py + 20 + iH); ctx.lineTo(px + innerPad + iW, py + 20 + iH); ctx.stroke();

                                // Labels
                                ctx.fillStyle = '#8b949e';
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('Pre', toX(0), py + 22 + iH);
                                ctx.fillText('Post', toX(1), py + 22 + iH);

                                // Affected subgroup (solid)
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath(); ctx.moveTo(toX(0), toY(affPre)); ctx.lineTo(toX(1), toY(affPost)); ctx.stroke();
                                ctx.fillStyle = color;
                                ctx.beginPath(); ctx.arc(toX(0), toY(affPre), 4, 0, Math.PI * 2); ctx.fill();
                                ctx.beginPath(); ctx.arc(toX(1), toY(affPost), 4, 0, Math.PI * 2); ctx.fill();

                                // Unaffected subgroup (dashed, lighter)
                                ctx.strokeStyle = color + '88';
                                ctx.lineWidth = 2;
                                ctx.setLineDash([5, 3]);
                                ctx.beginPath(); ctx.moveTo(toX(0), toY(unPre)); ctx.lineTo(toX(1), toY(unPost)); ctx.stroke();
                                ctx.setLineDash([]);
                                ctx.fillStyle = color + '88';
                                ctx.beginPath(); ctx.arc(toX(0), toY(unPre), 4, 0, Math.PI * 2); ctx.fill();
                                ctx.beginPath(); ctx.arc(toX(1), toY(unPost), 4, 0, Math.PI * 2); ctx.fill();

                                // DiD for affected
                                var didAff = (affPost - affPre) - (cAffPost - cAffPre);
                                // DiD for unaffected
                                var didUn = (unPost - unPre) - (cUnPost - cUnPre);

                                return { didAff: affPost - affPre, didUn: unPost - unPre };
                            }

                            // Panel 1: Control
                            var resC = drawPanel(padL, padT + 30, 'Control Group', cAffPre, cAffPost, cUnPre, cUnPost, '#3fb9a0');
                            // Panel 2: Treatment
                            var resT = drawPanel(padL + panelW + 40, padT + 30, 'Treatment Group', tAffPre, tAffPost, tUnPre, tUnPost, '#58a6ff');

                            // Summary below
                            var sumY = padT + 30 + panelH + 15;
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            var didAff = (tAffPost - tAffPre) - (cAffPost - cAffPre);
                            var didUn = (tUnPost - tUnPre) - (cUnPost - cUnPre);
                            var ddd = didAff - didUn;

                            ctx.fillText('DiD (affected): ' + didAff.toFixed(1), padL, sumY);
                            ctx.fillText('DiD (unaffected): ' + didUn.toFixed(1), padL + panelW + 40, sumY);

                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.fillStyle = '#f0883e';
                            ctx.textAlign = 'center';
                            ctx.fillText('DDD = ' + didAff.toFixed(1) + ' - ' + didUn.toFixed(1) + ' = ' + ddd.toFixed(1) + '  (True effect: ' + trueEffect.toFixed(1) + ')', width / 2, sumY + 22);

                            // Legend
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            var legX = padL, legY2 = padT + 8;
                            ctx.strokeStyle = '#8b949e'; ctx.lineWidth = 2; ctx.setLineDash([]);
                            ctx.beginPath(); ctx.moveTo(legX, legY2); ctx.lineTo(legX + 16, legY2); ctx.stroke();
                            ctx.fillStyle = '#8b949e'; ctx.fillText('Solid = Affected subgroup', legX + 20, legY2);

                            ctx.setLineDash([5, 3]);
                            ctx.beginPath(); ctx.moveTo(legX + 200, legY2); ctx.lineTo(legX + 216, legY2); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = '#8b949e'; ctx.fillText('Dashed = Unaffected subgroup', legX + 220, legY2);

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Triple Differences (DDD)', width / 2, padT - 22);
                        }

                        draw();
                        sEffect.slider.addEventListener('input', draw);
                        sViolation.slider.addEventListener('input', draw);
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: '<strong>Exercise 15.13.</strong> Write out the full DDD estimator in terms of eight cell means: \\(\\bar{Y}_{g,d,t}\\) for \\(g \\in \\{\\text{affected, unaffected}\\}\\), \\(d \\in \\{\\text{treat, control}\\}\\), \\(t \\in \\{\\text{pre, post}\\}\\). Verify that it equals the triple interaction coefficient.',
                    hint: 'Compute DiD separately for each subgroup and take their difference.',
                    solution: '<p>\\(\\hat{\\tau}_{\\text{DDD}} = \\bigl[(\\bar{Y}_{A,T,\\text{post}} - \\bar{Y}_{A,T,\\text{pre}}) - (\\bar{Y}_{A,C,\\text{post}} - \\bar{Y}_{A,C,\\text{pre}})\\bigr] - \\bigl[(\\bar{Y}_{U,T,\\text{post}} - \\bar{Y}_{U,T,\\text{pre}}) - (\\bar{Y}_{U,C,\\text{post}} - \\bar{Y}_{U,C,\\text{pre}})\\bigr]\\), where \\(A\\) = affected, \\(U\\) = unaffected, \\(T\\) = treatment, \\(C\\) = control. Substituting the regression model into each of the eight cell means and simplifying yields exactly \\(\\delta\\), the coefficient on \\(\\text{Treat} \\times \\text{Post} \\times \\text{Group}\\).</p>'
                },
                {
                    question: '<strong>Exercise 15.14.</strong> Explain the identifying assumption for DDD. How does it differ from the parallel trends assumption for standard DiD? Give a scenario where DiD fails but DDD succeeds.',
                    hint: 'DDD allows differential trends between treatment and control, as long as these differential trends are the same for both subgroups.',
                    solution: '<p>DDD requires: the <em>difference in trends</em> between affected and unaffected subgroups is the same in treatment and control groups. Unlike standard DiD (which requires parallel trends between treatment and control), DDD allows treatment and control groups to have different trends, as long as the within-group gap is stable.</p><p>Example where DiD fails but DDD succeeds: studying a state-level health policy using states with vs. without the policy. If treatment states are growing economically faster (violating parallel trends), DiD is biased. But if we compare young adults (targeted) vs. older adults (not targeted) within each state, the faster growth affects both age groups equally. DDD subtracts out the state-level differential growth because it affects both subgroups.</p>'
                },
                {
                    question: '<strong>Exercise 15.15.</strong> What is the cost of using DDD instead of DiD? Under what circumstances is standard DiD preferred?',
                    hint: 'Think about statistical power and the assumptions required for each estimator.',
                    solution: '<p>DDD has several costs: (1) <strong>Precision</strong>: DDD involves more differencing, which increases variance and reduces statistical power. Each level of differencing amplifies noise. (2) <strong>Additional assumption</strong>: DDD requires that there is no treatment effect on the "unaffected" subgroup. If the policy spills over to the unaffected subgroup, DDD is biased. (3) <strong>Complexity</strong>: More parameters to estimate and interpret. Standard DiD is preferred when: (a) parallel trends is plausible and well-supported by pre-trends; (b) there is no natural within-group comparison; (c) the sample is small and power is a concern.</p>'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Testing & Placebo Checks
        // ================================================================
        {
            id: 'ch15-sec05',
            title: 'Testing & Placebo Checks',
            content: `
                <h2>Testing & Placebo Checks</h2>

                <p>Since the parallel trends assumption is untestable, the credibility of a DiD design rests on indirect evidence. Researchers use a battery of diagnostic tests and placebo checks to assess the plausibility of the identifying assumption.</p>

                <h3>Pre-Treatment Placebo Tests</h3>

                <p>The most common diagnostic is a <strong>placebo test</strong> using pre-treatment periods. If we observe multiple pre-treatment periods \\(t_1, \\ldots, t_{k}, t_{k+1}\\), we can compute a "fake" DiD using \\(t_k\\) as a placebo treatment date:</p>
                \\[\\hat{\\tau}_{\\text{placebo}} = (\\bar{Y}_{T,t_k} - \\bar{Y}_{T,t_1}) - (\\bar{Y}_{C,t_k} - \\bar{Y}_{C,t_1}).\\]
                <p>Under parallel trends, \\(\\hat{\\tau}_{\\text{placebo}}\\) should be approximately zero.</p>

                <div class="env-block remark">
                    <div class="env-title">Remark 15.17 (Interpreting Placebo Tests)</div>
                    <div class="env-body">
                        <p>A non-zero placebo estimate is a red flag: it suggests differential trends in the pre-period, casting doubt on the parallel trends assumption. However, a zero placebo estimate is not proof of parallel trends post-treatment. It is necessary but not sufficient evidence.</p>
                    </div>
                </div>

                <h3>Falsification Tests with Alternative Groups</h3>

                <p>Another approach is to run the DiD analysis using <strong>alternative control or treatment groups</strong> where you expect no effect. For instance, if a policy targets low-income workers, you could run DiD using high-income workers as both "treatment" and "control." A significant effect would suggest the research design is picking up confounding factors rather than the causal effect.</p>

                <h3>Event Study Design</h3>

                <p>The <strong>event study</strong> is the most informative diagnostic. Instead of a single pre/post comparison, it estimates separate effects for each time period relative to the treatment date:</p>
                \\[Y_{it} = \\alpha_i + \\lambda_t + \\sum_{k \\neq -1} \\mu_k \\cdot (\\text{Treat}_i \\times \\mathbf{1}\\{t - t_0 = k\\}) + \\varepsilon_{it}\\]
                <p>where \\(\\alpha_i\\) are unit fixed effects, \\(\\lambda_t\\) are time fixed effects, and \\(k\\) indexes periods relative to treatment (with \\(k = -1\\) as the reference period).</p>

                <div class="env-block definition">
                    <div class="env-title">Definition 15.18 (Event Study Coefficients)</div>
                    <div class="env-body">
                        <p>The event study coefficients \\(\\{\\mu_k\\}\\) measure the treatment-control gap at each period \\(k\\) relative to the baseline period \\(k = -1\\):</p>
                        <ul>
                            <li><strong>Pre-treatment coefficients</strong> \\(\\mu_k\\) for \\(k < -1\\): should be close to zero under parallel trends</li>
                            <li><strong>Post-treatment coefficients</strong> \\(\\mu_k\\) for \\(k \\geq 0\\): trace out the dynamic treatment effect</li>
                        </ul>
                    </div>
                </div>

                <div class="env-block intuition">
                    <div class="env-title">Intuition: Reading an Event Study Plot</div>
                    <div class="env-body">
                        <p>A well-designed event study plot shows:</p>
                        <ul>
                            <li>Pre-treatment coefficients hovering around zero, providing visual evidence for parallel trends</li>
                            <li>A jump at the intervention date, measuring the immediate treatment effect</li>
                            <li>Post-treatment coefficients showing whether the effect persists, grows, or fades</li>
                        </ul>
                        <p>If pre-treatment coefficients are trending away from zero, this is strong evidence against parallel trends.</p>
                    </div>
                </div>

                <h3>Sensitivity to Functional Form</h3>

                <div class="env-block remark">
                    <div class="env-title">Remark 15.19 (Functional Form Sensitivity)</div>
                    <div class="env-body">
                        <p>DiD results can be sensitive to the choice of functional form for the outcome. If \\(Y\\) is nonneg (e.g., employment counts), researchers often estimate DiD in levels and in logs. If the results change qualitatively, this raises concerns about whether parallel trends holds on the chosen scale. A robust finding should be relatively insensitive to reasonable transformations of the dependent variable.</p>
                    </div>
                </div>

                <div class="viz-placeholder" data-viz="viz-event-study"></div>
            `,
            visualizations: [
                {
                    id: 'viz-event-study',
                    title: 'Event Study Plot',
                    description: 'Interactive event study with pre and post-treatment coefficients and 95% confidence intervals. Adjust the treatment effect and pre-trend violation to see how the plot responds.',
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

                        var effect = 4.0;
                        var preViolation = 0;
                        var noise = 0.8;

                        var sliderDiv = document.createElement('div');
                        sliderDiv.style.marginTop = '8px';
                        sliderDiv.style.display = 'flex';
                        sliderDiv.style.flexDirection = 'column';
                        sliderDiv.style.gap = '6px';

                        function makeRow(labelText, min, max, step, initial) {
                            var row = document.createElement('div');
                            row.style.display = 'flex'; row.style.alignItems = 'center'; row.style.gap = '8px';
                            var lab = document.createElement('span');
                            lab.textContent = labelText;
                            lab.style.color = '#8b949e'; lab.style.fontFamily = '-apple-system,sans-serif'; lab.style.fontSize = '13px'; lab.style.minWidth = '120px';
                            var sl = document.createElement('input');
                            sl.type = 'range'; sl.min = String(min); sl.max = String(max); sl.step = String(step); sl.value = String(initial);
                            sl.style.width = '160px';
                            var val = document.createElement('span');
                            val.style.color = '#f0f6fc'; val.style.fontFamily = '-apple-system,sans-serif'; val.style.fontSize = '13px';
                            row.appendChild(lab); row.appendChild(sl); row.appendChild(val);
                            sliderDiv.appendChild(row);
                            return { slider: sl, valueLabel: val };
                        }

                        var sEffect = makeRow('Treatment Effect:', 0, 8, 0.5, effect);
                        var sViolation = makeRow('Pre-trend Slope:', -2, 2, 0.25, preViolation);
                        var sNoise = makeRow('SE Size:', 0.2, 2, 0.1, noise);
                        controls.appendChild(sliderDiv);

                        // Periods: -5, -4, -3, -2, -1 (ref), 0, 1, 2, 3, 4
                        var periods = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4];
                        var refPeriod = -1;

                        // Seeded pseudo-random for reproducibility
                        function seededRandom(seed) {
                            var x = Math.sin(seed) * 10000;
                            return x - Math.floor(x);
                        }

                        function draw() {
                            effect = parseFloat(sEffect.slider.value);
                            preViolation = parseFloat(sViolation.slider.value);
                            noise = parseFloat(sNoise.slider.value);
                            sEffect.valueLabel.textContent = effect.toFixed(1);
                            sViolation.valueLabel.textContent = preViolation.toFixed(2);
                            sNoise.valueLabel.textContent = noise.toFixed(1);

                            // Generate coefficients
                            var coefs = [];
                            var ses = [];
                            for (var i = 0; i < periods.length; i++) {
                                var k = periods[i];
                                var se = noise * (0.8 + 0.4 * seededRandom(i * 7 + 3));
                                ses.push(se);
                                if (k === refPeriod) {
                                    coefs.push(0);
                                } else if (k < refPeriod) {
                                    // Pre-treatment: should be ~0 under parallel trends
                                    var preCoef = preViolation * (k - refPeriod) + (seededRandom(i * 13 + 7) - 0.5) * noise * 0.5;
                                    coefs.push(preCoef);
                                } else {
                                    // Post-treatment: treatment effect + slight dynamics
                                    var postCoef = effect * (1 + 0.1 * (k - 0)) + (seededRandom(i * 17 + 11) - 0.5) * noise * 0.5;
                                    coefs.push(postCoef);
                                }
                            }

                            var padL = 65, padR = 25, padT = 35, padB = 55;
                            var plotW = width - padL - padR;
                            var plotH = height - padT - padB;

                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, width, height);

                            // Y range
                            var allVals = [];
                            for (var j = 0; j < coefs.length; j++) {
                                allVals.push(coefs[j] + 1.96 * ses[j]);
                                allVals.push(coefs[j] - 1.96 * ses[j]);
                            }
                            var yMin2 = Math.min.apply(null, allVals) - 1;
                            var yMax2 = Math.max.apply(null, allVals) + 1;

                            function toX2(k) { return padL + plotW * (k - periods[0]) / (periods[periods.length - 1] - periods[0]); }
                            function toY2(v) { return padT + plotH * (1 - (v - yMin2) / (yMax2 - yMin2)); }

                            // Grid
                            ctx.strokeStyle = '#1a1a4066';
                            ctx.lineWidth = 0.5;
                            var yStepES = Math.max(1, Math.round((yMax2 - yMin2) / 8));
                            for (var yl2 = Math.ceil(yMin2); yl2 <= yMax2; yl2 += yStepES) {
                                var gys = toY2(yl2);
                                ctx.beginPath(); ctx.moveTo(padL, gys); ctx.lineTo(padL + plotW, gys); ctx.stroke();
                            }

                            // Axes
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke();

                            // Zero line
                            ctx.strokeStyle = '#f0f6fc44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(padL, toY2(0)); ctx.lineTo(padL + plotW, toY2(0)); ctx.stroke();
                            ctx.setLineDash([]);

                            // Intervention line
                            var xInterv = (toX2(-1) + toX2(0)) / 2;
                            ctx.strokeStyle = '#f8514966';
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(xInterv, padT); ctx.lineTo(xInterv, padT + plotH); ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = '#f85149';
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Treatment', xInterv, padT + plotH + 28);

                            // X-axis labels
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '11px -apple-system,sans-serif';
                            periods.forEach(function(k) {
                                ctx.fillText('k=' + k, toX2(k), padT + plotH + 8);
                            });
                            ctx.fillText('Periods relative to treatment', padL + plotW / 2, padT + plotH + 40);

                            // Y-axis labels
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yl3 = Math.ceil(yMin2); yl3 <= yMax2; yl3 += yStepES) {
                                ctx.fillText(yl3.toFixed(0), padL - 8, toY2(yl3));
                            }

                            // Draw confidence intervals and points
                            for (var m = 0; m < periods.length; m++) {
                                var k2 = periods[m];
                                var xp = toX2(k2);
                                var yp = toY2(coefs[m]);
                                var yHi = toY2(coefs[m] + 1.96 * ses[m]);
                                var yLo = toY2(coefs[m] - 1.96 * ses[m]);
                                var color = k2 < 0 ? '#3fb9a0' : (k2 === refPeriod ? '#8b949e' : '#58a6ff');
                                if (k2 === refPeriod) color = '#8b949e';

                                // CI whisker
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.moveTo(xp, yHi); ctx.lineTo(xp, yLo); ctx.stroke();
                                // Caps
                                ctx.beginPath(); ctx.moveTo(xp - 4, yHi); ctx.lineTo(xp + 4, yHi); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(xp - 4, yLo); ctx.lineTo(xp + 4, yLo); ctx.stroke();

                                // Point
                                ctx.fillStyle = color;
                                ctx.beginPath(); ctx.arc(xp, yp, 4, 0, Math.PI * 2); ctx.fill();
                            }

                            // Connect points with line
                            ctx.strokeStyle = '#58a6ff66';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            for (var n = 0; n < periods.length; n++) {
                                if (periods[n] === refPeriod) continue;
                                var xn = toX2(periods[n]);
                                var yn = toY2(coefs[n]);
                                if (n === 0) ctx.moveTo(xn, yn);
                                else ctx.lineTo(xn, yn);
                            }
                            ctx.stroke();

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            var legX2 = padL + 10, legY3 = padT + 10;
                            ctx.fillStyle = '#3fb9a0';
                            ctx.beginPath(); ctx.arc(legX2 + 4, legY3, 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillText('Pre-treatment', legX2 + 14, legY3);
                            ctx.fillStyle = '#58a6ff';
                            ctx.beginPath(); ctx.arc(legX2 + 4, legY3 + 16, 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillText('Post-treatment', legX2 + 14, legY3 + 16);
                            ctx.fillStyle = '#8b949e';
                            ctx.beginPath(); ctx.arc(legX2 + 4, legY3 + 32, 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillText('Reference (k=-1)', legX2 + 14, legY3 + 32);

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Event Study Plot with 95% Confidence Intervals', width / 2, padT - 18);
                        }

                        draw();
                        sEffect.slider.addEventListener('input', draw);
                        sViolation.slider.addEventListener('input', draw);
                        sNoise.slider.addEventListener('input', draw);
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: '<strong>Exercise 15.16.</strong> In an event study plot, you observe that the pre-treatment coefficients \\(\\mu_{-5}, \\mu_{-4}, \\mu_{-3}, \\mu_{-2}\\) are \\(-0.1, 0.2, -0.3, 0.1\\) respectively, all statistically insignificant. The post-treatment coefficients \\(\\mu_0, \\mu_1, \\mu_2\\) are \\(3.2, 3.5, 3.8\\), all significant. Interpret these results.',
                    hint: 'What do the pre-treatment coefficients tell you about parallel trends? What do the post-treatment coefficients tell you about the treatment effect dynamics?',
                    solution: '<p>The pre-treatment coefficients are small, fluctuate around zero, and are statistically insignificant. This is consistent with the parallel trends assumption: before treatment, the treatment and control groups followed similar trajectories. The post-treatment coefficients show a clear jump of about 3.2 units at the intervention and a slight upward trend (3.2 to 3.8), suggesting a persistent and mildly growing treatment effect. The event study provides strong support for the DiD design: parallel pre-trends and a sharp treatment effect onset.</p>'
                },
                {
                    question: '<strong>Exercise 15.17.</strong> Describe how to construct a placebo test using an alternative treatment group. Give a specific example in the context of a minimum wage study.',
                    hint: 'Think about a group that should not be affected by the minimum wage increase.',
                    solution: '<p>A placebo treatment group is a group that should be unaffected by the policy. In a minimum wage study, you could use high-wage restaurants (e.g., fine dining) or high-skilled workers as a placebo treatment group. Run the same DiD regression using this group instead of the true treatment group. If the placebo DiD estimate is significantly different from zero, it suggests that confounding factors (not the minimum wage) are driving the result, undermining the causal interpretation. A null placebo result increases confidence in the original design.</p>'
                },
                {
                    question: '<strong>Exercise 15.18.</strong> Why is the period \\(k = -1\\) chosen as the reference (omitted) period in event studies? Would it matter if you chose \\(k = -3\\) instead?',
                    hint: 'Think about what the coefficients represent relative to the reference period and which period is closest to the treatment.',
                    solution: '<p>The period \\(k = -1\\) is chosen because it is the last pre-treatment period, making it the natural "baseline" immediately before treatment. All coefficients are then interpreted relative to this moment. If you chose \\(k = -3\\) instead, the coefficients would measure gaps relative to 3 periods before treatment. The pre-treatment coefficients \\(\\mu_{-2}\\) and \\(\\mu_{-1}\\) would then need to be near-zero for parallel trends, and \\(\\mu_{-4}, \\mu_{-5}\\) would measure pre-pre trends. The choice of reference period does not change the statistical significance of individual coefficients or the joint test of pre-trends, but \\(k = -1\\) provides the most intuitive normalization and the clearest visual for assessing parallel trends.</p>'
                },
                {
                    question: '<strong>Exercise 15.19.</strong> A researcher runs DiD with the outcome in levels and finds a significant positive effect. When they use log(outcome), the effect becomes insignificant. What might explain this, and what should the researcher conclude?',
                    hint: 'Think about how parallel trends on a multiplicative vs. additive scale differ, and what happens when the treatment group has a higher baseline.',
                    solution: '<p>This suggests that parallel trends may hold on one scale but not the other. If the treatment group has a higher baseline level, equal percentage growth (parallel trends in logs) translates into a larger absolute increase for the treatment group. DiD in levels then picks up this larger absolute change as a "treatment effect," even though both groups grew at the same rate proportionally. The insignificance in logs means the treatment did not change the growth rate. The researcher should: (1) report both specifications for transparency; (2) argue which scale is economically appropriate (additive or multiplicative); (3) consider whether theory predicts effects in levels or percentages; (4) examine pre-trends on both scales to determine which satisfies parallel trends better.</p>'
                }
            ]
        }
    ]
});
