window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch00',
    number: 0,
    title: 'The Causal Question',
    subtitle: 'Correlation, Causation, and the Fundamental Problem 因果问题',
    sections: [
        // ===== Section 1: Correlation vs Causation =====
        {
            id: 'ch00-sec01',
            title: 'Correlation vs Causation',
            content: `
                <h2>Correlation vs Causation 相关与因果</h2>

                <div class="env-block intuition">
                    <div class="env-title">Intuition</div>
                    <div class="env-body">
                        <p>Perhaps the most important lesson in all of statistics is that <strong>correlation does not imply causation</strong> (相关不意味着因果). When we observe that two variables move together, it is tempting to conclude that one causes the other. But observed associations can arise from many sources: direct causation, reverse causation, or the presence of a lurking <strong>confounding variable</strong> (混杂变量) that drives both.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 0.1 (Ice Cream and Drowning)</div>
                    <div class="env-body">
                        <p>Data show a strong positive correlation between ice cream sales and drowning deaths. Does eating ice cream cause drowning? Of course not. The confounding variable is <strong>temperature</strong> (气温): hot weather increases both ice cream consumption and swimming activity, which in turn increases drowning risk.</p>
                        <p>Schematically: Temperature \\(\\to\\) Ice Cream Sales, and Temperature \\(\\to\\) Swimming \\(\\to\\) Drowning. The association between ice cream and drowning is entirely <strong>spurious</strong> (虚假的).</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 0.2 (Smoking and Lung Cancer)</div>
                    <div class="env-body">
                        <p>In contrast, the correlation between smoking and lung cancer <em>is</em> causal. Decades of evidence from randomized animal experiments, dose-response relationships, biological mechanisms, and quasi-experimental studies in humans established that smoking directly causes lung cancer. R.A. Fisher famously argued that the association might be confounded by a genetic factor, but this hypothesis was ultimately refuted.</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 0.3 (Observational vs Interventional Distributions)</div>
                    <div class="env-body">
                        <p>Let \\(X\\) denote a treatment and \\(Y\\) an outcome. We distinguish two fundamentally different probability distributions:</p>
                        <ul>
                            <li><strong>Observational distribution</strong> (观测分布): \\(P(Y \\mid X = x)\\) — the distribution of \\(Y\\) among units that <em>happen to have</em> \\(X = x\\).</li>
                            <li><strong>Interventional distribution</strong> (干预分布): \\(P(Y \\mid \\text{do}(X = x))\\) — the distribution of \\(Y\\) if we <em>intervene</em> to set \\(X = x\\) for everyone, using Pearl's \\(\\text{do}\\)-operator.</li>
                        </ul>
                        <p>The central insight of causal inference is:</p>
                        \\[P(Y \\mid X = x) \\neq P(Y \\mid \\text{do}(X = x)) \\quad \\text{in general.}\\]
                        <p>Only when there is no confounding do the two coincide.</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark</div>
                    <div class="env-body">
                        <p>The notation \\(\\text{do}(X = x)\\) was introduced by Judea Pearl to formalize the concept of an <strong>intervention</strong> (干预). Conditioning on \\(X = x\\) in observational data selects units with that value; intervening on \\(X = x\\) physically sets the value, breaking all incoming causal arrows to \\(X\\). This distinction is the backbone of the structural causal model (SCM) framework we will develop in Chapter 2.</p>
                    </div>
                </div>

                <p>The visualization below demonstrates a <strong>spurious correlation</strong> (虚假相关). A hidden confounder \\(Z\\) (temperature) drives both \\(X\\) (ice cream sales) and \\(Y\\) (drowning incidents). Toggle the confounder to see how the apparent relationship between \\(X\\) and \\(Y\\) changes when we account for \\(Z\\).</p>

                <div class="viz-placeholder" data-viz="spurious-correlation-viz"></div>
            `,
            visualizations: [
                {
                    id: 'spurious-correlation-viz',
                    title: 'Spurious Correlation with Confounding Variable',
                    description: 'Scatter plot showing how a confounder creates a misleading association between X and Y',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 420,
                            scale: 35,
                            originX: 80,
                            originY: 370
                        });

                        var showConfounder = false;
                        var n = 120;
                        var data = [];

                        function generateData() {
                            data = [];
                            for (var i = 0; i < n; i++) {
                                var z = VizEngine.randomNormal(0, 1);
                                var x = 0.8 * z + VizEngine.randomNormal(0, 0.4);
                                var y = 0.7 * z + VizEngine.randomNormal(0, 0.4);
                                data.push({x: x, y: y, z: z});
                            }
                        }
                        generateData();

                        VizEngine.createButton(controls, 'Toggle Confounder Coloring', function() {
                            showConfounder = !showConfounder;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Regenerate Data', function() {
                            generateData();
                            draw();
                        });

                        function draw() {
                            viz.clear();

                            var ctx = viz.ctx;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(80, 370);
                            ctx.lineTo(540, 370);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(80, 370);
                            ctx.lineTo(80, 20);
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var tick = -2; tick <= 4; tick++) {
                                var sx = 80 + (tick + 2) * 35;
                                ctx.fillText(tick.toString(), sx, 375);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(sx, 370);
                                ctx.lineTo(sx, 20);
                                ctx.stroke();
                            }
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var tick2 = -2; tick2 <= 4; tick2++) {
                                var sy = 370 - (tick2 + 2) * 35;
                                ctx.fillText(tick2.toString(), 72, sy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(80, sy);
                                ctx.lineTo(540, sy);
                                ctx.stroke();
                            }

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('X (Ice Cream Sales)', 310, 395);
                            ctx.save();
                            ctx.translate(15, 195);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('Y (Drowning Incidents)', 0, 0);
                            ctx.restore();

                            for (var i = 0; i < data.length; i++) {
                                var d = data[i];
                                var px = 80 + (d.x + 2) * 35;
                                var py = 370 - (d.y + 2) * 35;

                                if (px < 80 || px > 540 || py < 20 || py > 370) continue;

                                var color;
                                if (showConfounder) {
                                    var zNorm = (d.z + 2.5) / 5;
                                    zNorm = Math.max(0, Math.min(1, zNorm));
                                    if (zNorm < 0.33) {
                                        color = viz.colors.blue;
                                    } else if (zNorm < 0.66) {
                                        color = viz.colors.teal;
                                    } else {
                                        color = viz.colors.red;
                                    }
                                } else {
                                    color = viz.colors.orange;
                                }

                                ctx.fillStyle = color + '99';
                                ctx.beginPath();
                                ctx.arc(px, py, 4, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
                            for (var j = 0; j < data.length; j++) {
                                sumX += data[j].x;
                                sumY += data[j].y;
                                sumXY += data[j].x * data[j].y;
                                sumX2 += data[j].x * data[j].x;
                                sumY2 += data[j].y * data[j].y;
                            }
                            var meanX = sumX / n;
                            var meanY = sumY / n;
                            var cov = sumXY / n - meanX * meanY;
                            var sdX = Math.sqrt(sumX2 / n - meanX * meanX);
                            var sdY = Math.sqrt(sumY2 / n - meanY * meanY);
                            var r = cov / (sdX * sdY);
                            var slope = cov / (sdX * sdX);
                            var intercept = meanY - slope * meanX;

                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            var lx1 = -2, lx2 = 4;
                            var ly1 = slope * lx1 + intercept;
                            var ly2 = slope * lx2 + intercept;
                            ctx.moveTo(80 + (lx1 + 2) * 35, 370 - (ly1 + 2) * 35);
                            ctx.lineTo(80 + (lx2 + 2) * 35, 370 - (ly2 + 2) * 35);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            ctx.fillText('r = ' + r.toFixed(3), 90, 30);

                            if (showConfounder) {
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText('Z low (cold)', 90, 50);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText('Z medium', 90, 65);
                                ctx.fillStyle = viz.colors.red;
                                ctx.fillText('Z high (hot)', 90, 80);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('Color = confounder Z (temperature)', 90, 100);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A study finds that countries with higher chocolate consumption have more Nobel Prize winners per capita. Give two possible confounding variables that could explain this association without any causal link between chocolate and Nobel Prizes.',
                    hint: 'Think about what economic and social factors might drive both chocolate consumption and scientific achievement.',
                    solution: 'Possible confounders include: (1) GDP per capita / national wealth: richer countries can afford more chocolate and also invest more in education and research. (2) Quality of universities / research funding: countries with strong academic institutions produce more Nobel laureates and also tend to be developed nations with high chocolate consumption. The correlation is spurious, driven by these underlying socioeconomic factors.'
                },
                {
                    question: 'Explain the difference between \\(P(Y \\mid X = 1)\\) and \\(P(Y \\mid \\text{do}(X = 1))\\). Under what condition are these two quantities equal?',
                    hint: 'Think about what "conditioning" does versus what "intervening" does in a causal graph.',
                    solution: 'P(Y | X = 1) is the conditional probability of Y given that we observe X = 1 in the population. It reflects a mix of the causal effect of X on Y and any confounding. P(Y | do(X = 1)) is the probability of Y if we intervene to set X = 1 for everyone, breaking all incoming causal arrows to X. The two are equal when there is no confounding, i.e., when X is independent of all other causes of Y conditional on the observed variables (ignorability), or equivalently when there is no backdoor path from X to Y in the causal DAG.'
                },
                {
                    question: 'For the ice cream and drowning example, draw a simple causal diagram with three nodes: Temperature (Z), Ice Cream Sales (X), and Drowning (Y). What is the structure of this graph? Why does conditioning on Z remove the spurious association?',
                    hint: 'This is a classic fork (common cause) structure. Think about d-separation.',
                    solution: 'The causal graph is a fork: Z -> X and Z -> Y, with no direct edge from X to Y. Temperature (Z) is a common cause of both X and Y. The path X <- Z -> Y is a backdoor path that creates a spurious (non-causal) association between X and Y. Conditioning on Z (stratifying by temperature) blocks this backdoor path, and the conditional association P(Y | X, Z) reveals no remaining association between X and Y, confirming that the marginal correlation was entirely confounded.'
                },
                {
                    question: 'A hospital finds that patients who receive a new drug have higher mortality than those who do not. A naive analyst concludes the drug is harmful. Suggest a confounding variable and explain how it could reverse the conclusion.',
                    hint: 'Think about why certain patients might be more likely to receive the drug.',
                    solution: 'A key confounder is disease severity. Sicker patients (higher severity) are more likely to be prescribed the new drug and also more likely to die regardless of treatment. If we stratify by severity: among mildly ill patients, the drug might reduce mortality; among severely ill patients, the drug might also reduce mortality. But because the drug is disproportionately given to severe cases, the overall (marginal) mortality is higher among drug recipients. This is an instance of Simpson\'s Paradox, which we explore in the next section. The drug may in fact be beneficial once we control for confounding by severity.'
                }
            ]
        },

        // ===== Section 2: Simpson's Paradox =====
        {
            id: 'ch00-sec02',
            title: "Simpson's Paradox",
            content: `
                <h2>Simpson's Paradox 辛普森悖论</h2>

                <div class="env-block intuition">
                    <div class="env-title">Intuition</div>
                    <div class="env-body">
                        <p><strong>Simpson's Paradox</strong> (辛普森悖论) is a dramatic illustration of how confounding can mislead. It occurs when a trend that appears in several subgroups <em>reverses</em> when the subgroups are combined. The "paradox" is resolved by understanding that the aggregated data confounds the treatment effect with a confounding variable that affects both treatment assignment and outcome.</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 0.4 (Simpson's Paradox, Formal Statement)</div>
                    <div class="env-body">
                        <p>Let \\(X \\in \\{0,1\\}\\) be a binary treatment, \\(Y\\) an outcome, and \\(Z\\) a categorical confounder. <strong>Simpson's Paradox</strong> occurs when:</p>
                        \\[P(Y = 1 \\mid X = 1, Z = z) < P(Y = 1 \\mid X = 0, Z = z) \\quad \\text{for all } z,\\]
                        <p>yet the marginal association reverses:</p>
                        \\[P(Y = 1 \\mid X = 1) > P(Y = 1 \\mid X = 0).\\]
                        <p>That is, the treatment appears harmful overall, but is beneficial within every subgroup defined by \\(Z\\).</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 0.5 (UC Berkeley Admissions, 1973)</div>
                    <div class="env-body">
                        <p>UC Berkeley's graduate admissions data showed that overall, 44% of male applicants were admitted vs. 35% of female applicants, suggesting gender bias. However, when broken down by <strong>department</strong>, women had equal or higher admission rates in most departments. The paradox arose because women disproportionately applied to more competitive departments with lower admission rates, while men applied to less competitive departments with higher admission rates.</p>
                        <p>Let \\(X\\) = gender (1 = female), \\(Y\\) = admission (1 = admitted), \\(Z\\) = department. Within most departments: \\(P(Y=1 \\mid X=1, Z=z) \\geq P(Y=1 \\mid X=0, Z=z)\\). But marginally: \\(P(Y=1 \\mid X=1) < P(Y=1 \\mid X=0)\\).</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 0.6 (Kidney Stone Treatment)</div>
                    <div class="env-body">
                        <p>A classic medical example: Treatment A (open surgery) has a higher overall success rate than Treatment B (percutaneous nephrolithotomy). But when stratified by stone size:</p>
                        <ul>
                            <li><strong>Small stones</strong>: Treatment A: 93% success, Treatment B: 87% success</li>
                            <li><strong>Large stones</strong>: Treatment A: 73% success, Treatment B: 69% success</li>
                        </ul>
                        <p>Treatment A is better in both subgroups. Yet overall, Treatment B has a higher success rate because it is more often assigned to the easier cases (small stones), inflating its aggregate performance.</p>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 0.7 (Resolution of Simpson's Paradox)</div>
                    <div class="env-body">
                        <p>Simpson's Paradox is not a logical contradiction but a consequence of confounding. The correct causal conclusion depends on the causal structure:</p>
                        <ul>
                            <li>If \\(Z\\) is a <strong>confounder</strong> (common cause of \\(X\\) and \\(Y\\)), then the <strong>stratified</strong> (conditional) analysis gives the correct causal effect.</li>
                            <li>If \\(Z\\) is a <strong>mediator</strong> (lies on the causal path from \\(X\\) to \\(Y\\)), then the <strong>marginal</strong> analysis may be more appropriate for the total effect.</li>
                        </ul>
                        <p>The resolution requires knowledge of the causal graph, not just the statistical data.</p>
                    </div>
                </div>

                <p>The interactive visualization below lets you explore Simpson's Paradox. Adjust the subgroup sizes and success rates to see how the marginal and conditional associations can point in opposite directions.</p>

                <div class="viz-placeholder" data-viz="simpsons-paradox-viz"></div>
            `,
            visualizations: [
                {
                    id: 'simpsons-paradox-viz',
                    title: "Interactive Simpson's Paradox",
                    description: 'Adjust subgroup proportions to see how marginal and conditional associations reverse',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 440,
                            scale: 1,
                            originX: 0,
                            originY: 0
                        });

                        var pZtreat = 0.7;
                        var successT_Z1 = 0.93;
                        var successC_Z1 = 0.87;
                        var successT_Z0 = 0.73;
                        var successC_Z0 = 0.69;

                        var nTreat = 350;
                        var nControl = 350;

                        VizEngine.createSlider(controls, 'P(Large Stone | Treatment)', 0.05, 0.95, pZtreat, 0.05, function(v) {
                            pZtreat = v; draw();
                        });
                        VizEngine.createSlider(controls, 'Success(T, Small)', 0.5, 1.0, successT_Z1, 0.01, function(v) {
                            successT_Z1 = v; draw();
                        });
                        VizEngine.createSlider(controls, 'Success(C, Small)', 0.5, 1.0, successC_Z1, 0.01, function(v) {
                            successC_Z1 = v; draw();
                        });
                        VizEngine.createSlider(controls, 'Success(T, Large)', 0.3, 1.0, successT_Z0, 0.01, function(v) {
                            successT_Z0 = v; draw();
                        });
                        VizEngine.createSlider(controls, 'Success(C, Large)', 0.3, 1.0, successC_Z0, 0.01, function(v) {
                            successC_Z0 = v; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width;
                            var H = viz.height;

                            var pZcontrol = 1 - pZtreat;

                            var nT_large = Math.round(nTreat * pZtreat);
                            var nT_small = nTreat - nT_large;
                            var nC_large = Math.round(nControl * pZcontrol);
                            var nC_small = nControl - nC_large;

                            var succT_large = Math.round(nT_large * successT_Z0);
                            var succT_small = Math.round(nT_small * successT_Z1);
                            var succC_large = Math.round(nC_large * successC_Z0);
                            var succC_small = Math.round(nC_small * successC_Z1);

                            var overallT = (succT_large + succT_small) / nTreat;
                            var overallC = (succC_large + succC_small) / nControl;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 15px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText("Simpson's Paradox: Kidney Stone Treatment", W / 2, 10);

                            var barW = 50;
                            var barMaxH = 150;
                            var groupY = 60;

                            function drawBarGroup(label, x, y, rateT, rateC) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(label, x + barW + 10, y);

                                var barBase = y + 20 + barMaxH;

                                ctx.fillStyle = viz.colors.blue + '88';
                                var hT = rateT * barMaxH;
                                ctx.fillRect(x, barBase - hT, barW, hT);
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(x, barBase - hT, barW, hT);

                                ctx.fillStyle = viz.colors.orange + '88';
                                var hC = rateC * barMaxH;
                                ctx.fillRect(x + barW + 20, barBase - hC, barW, hC);
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(x + barW + 20, barBase - hC, barW, hC);

                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText((rateT * 100).toFixed(0) + '%', x + barW / 2, barBase - hT - 3);

                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillText((rateC * 100).toFixed(0) + '%', x + barW + 20 + barW / 2, barBase - hC - 3);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textBaseline = 'top';
                                ctx.fillText('Treat A', x + barW / 2, barBase + 4);
                                ctx.fillText('Treat B', x + barW + 20 + barW / 2, barBase + 4);

                                var winner = rateT > rateC ? 'A wins' : (rateT < rateC ? 'B wins' : 'Tie');
                                var winColor = rateT > rateC ? viz.colors.blue : (rateT < rateC ? viz.colors.orange : viz.colors.text);
                                ctx.fillStyle = winColor;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.fillText(winner, x + barW + 10, barBase + 20);
                            }

                            drawBarGroup('Small Stones', 30, groupY, successT_Z1, successC_Z1);
                            drawBarGroup('Large Stones', 210, groupY, successT_Z0, successC_Z0);
                            drawBarGroup('Overall (Marginal)', 390, groupY, overallT, overallC);

                            var infoY = groupY + 20 + barMaxH + 45;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';

                            ctx.fillText('Treatment A (open surgery) assigned more to large stones (hard cases)', 30, infoY);
                            ctx.fillText('Treatment B assigned more to small stones (easy cases)', 30, infoY + 18);

                            var isParadox = (successT_Z1 > successC_Z1 && successT_Z0 > successC_Z0 && overallT < overallC) ||
                                            (successT_Z1 < successC_Z1 && successT_Z0 < successC_Z0 && overallT > overallC);

                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            if (isParadox) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.fillText("Simpson's Paradox is active! Marginal and conditional conclusions differ.", 30, infoY + 45);
                            } else {
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('No paradox with current settings. Try adjusting the sliders.', 30, infoY + 45);
                            }

                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(30, infoY + 70, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Treatment A', 48, infoY + 71);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(140, infoY + 70, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Treatment B', 158, infoY + 71);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "In the Berkeley admissions example, overall admission rates were 44% for men and 35% for women. But within most departments, women's admission rates were equal or higher. Explain precisely how this reversal occurs using the concept of confounding.",
                    hint: 'Think about the relationship between gender, department choice, and admission rate.',
                    solution: "The confounding variable is department choice. Women disproportionately applied to departments with low overall admission rates (e.g., English, which admits ~25%), while men disproportionately applied to departments with high admission rates (e.g., Engineering, which admits ~60%). Even though women had equal or higher admission rates within each department, the marginal admission rate for women was lower because they were concentrated in harder-to-enter departments. Formally, gender (X) affects department choice (Z), and Z affects admission (Y), creating a backdoor path X -> Z -> Y. The overall rate P(Y=1|X) is a weighted average of P(Y=1|X,Z=z) with weights P(Z=z|X), and since these weights differ between men and women, the weighted averages can reverse the within-stratum ordering."
                },
                {
                    question: "Construct a simple numerical example of Simpson's Paradox using a 2x2x2 table. That is, create data with treatment X in {0,1}, outcome Y in {0,1}, and confounder Z in {0,1} such that the treatment appears beneficial in each stratum of Z but harmful overall.",
                    hint: 'Make the confounder heavily skew who gets treated, with the confounder also strongly affecting the outcome.',
                    solution: "Example: Z=0 (mild): Treated: 8/10 success, Control: 7/10 success. So P(Y=1|X=1,Z=0) = 0.80 > P(Y=1|X=0,Z=0) = 0.70. Z=1 (severe): Treated: 3/10 success, Control: 2/10 success. So P(Y=1|X=1,Z=1) = 0.30 > P(Y=1|X=0,Z=1) = 0.20. Now suppose severe patients are much more likely to be treated. Aggregate: if 90% of treated are from Z=1 and 90% of controls are from Z=0, then Overall treated: (8 + 27)/100 = 0.35. Overall control: (63 + 2)/100 = 0.65. Overall treated success rate (35%) < control (65%), reversing the within-stratum conclusion. The key is the severe imbalance in Z between treated and control groups."
                },
                {
                    question: "Why does knowing the causal structure (DAG) matter for resolving Simpson's Paradox? Give an example where conditioning on Z would be incorrect.",
                    hint: 'Consider the case where Z is a mediator rather than a confounder.',
                    solution: "If Z is a mediator (on the causal path X -> Z -> Y rather than a common cause), then conditioning on Z would block part of the causal effect of X on Y and give a biased estimate of the total effect. Example: Suppose a job training program (X) increases skills (Z), which increases earnings (Y). If we condition on skills, we block the causal pathway X -> Z -> Y and may conclude the program has no direct effect, missing the indirect effect through skills. The marginal (unconditional) analysis correctly captures the total effect. Simpson's Paradox tells us that whether to aggregate or stratify is not a statistical question but a causal one: it depends on whether Z is a confounder, mediator, or collider in the causal DAG."
                },
                {
                    question: "In the kidney stone example, the overall success rates are: Treatment A: 78%, Treatment B: 83%. Within small stones: A is 93% vs B is 87%. Within large stones: A is 73% vs B is 69%. Which treatment would you recommend and why?",
                    hint: 'Think about which comparison reflects the causal effect: marginal or conditional.',
                    solution: "Treatment A should be recommended. Stone size is a confounder: it affects both treatment assignment (surgeons assign the more invasive Treatment A to larger/harder stones) and outcome (larger stones have lower success rates regardless of treatment). Within each stratum of stone size, Treatment A outperforms Treatment B: 93% vs 87% for small stones, 73% vs 69% for large stones. The overall rates are misleading because Treatment A is disproportionately assigned to the harder cases. The stratified analysis, which controls for the confounder, reveals the true causal effect. The causal effect of Treatment A is positive in both subgroups, so A is the better treatment."
                }
            ]
        },

        // ===== Section 3: Counterfactual Thinking =====
        {
            id: 'ch00-sec03',
            title: 'Counterfactual Thinking',
            content: `
                <h2>Counterfactual Thinking 反事实思维</h2>

                <div class="env-block intuition">
                    <div class="env-title">Intuition</div>
                    <div class="env-body">
                        <p><strong>Counterfactual reasoning</strong> (反事实推理) is the foundation of how humans think about causation in everyday life. "If I had not taken the aspirin, would my headache have persisted?" "If the government had not implemented the policy, what would unemployment have been?" These "what if" questions define causal effects by comparing what <em>actually happened</em> with what <em>would have happened</em> under an alternative scenario.</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 0.8 (Potential Outcomes)</div>
                    <div class="env-body">
                        <p>For a binary treatment \\(X \\in \\{0,1\\}\\), each unit \\(i\\) has two <strong>potential outcomes</strong> (潜在结果):</p>
                        <ul>
                            <li>\\(Y_i(1)\\): the outcome unit \\(i\\) would experience <em>if treated</em> (\\(X_i = 1\\))</li>
                            <li>\\(Y_i(0)\\): the outcome unit \\(i\\) would experience <em>if not treated</em> (\\(X_i = 0\\))</li>
                        </ul>
                        <p>Both potential outcomes are assumed to exist for every unit, regardless of which treatment the unit actually receives. This notation is due to Neyman (1923) and Rubin (1974).</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 0.9 (Individual Causal Effect)</div>
                    <div class="env-body">
                        <p>The <strong>individual causal effect</strong> (个体因果效应) of treatment on unit \\(i\\) is:</p>
                        \\[\\tau_i = Y_i(1) - Y_i(0).\\]
                        <p>This is the difference between what would happen to unit \\(i\\) under treatment versus control.</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 0.10 (Average Treatment Effect)</div>
                    <div class="env-body">
                        <p>The <strong>Average Treatment Effect</strong> (平均处理效应, ATE) is the population average of individual causal effects:</p>
                        \\[\\text{ATE} = E[Y(1) - Y(0)] = E[Y(1)] - E[Y(0)].\\]
                        <p>Related quantities include:</p>
                        <ul>
                            <li><strong>ATT</strong> (Average Treatment Effect on the Treated, 处理组平均处理效应): \\(E[Y(1) - Y(0) \\mid X = 1]\\)</li>
                            <li><strong>ATC</strong> (Average Treatment Effect on the Controls): \\(E[Y(1) - Y(0) \\mid X = 0]\\)</li>
                        </ul>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 0.11 (The Fundamental Problem)</div>
                    <div class="env-body">
                        <p>For each unit \\(i\\), we observe only <strong>one</strong> of the two potential outcomes:</p>
                        \\[Y_i^{\\text{obs}} = X_i \\cdot Y_i(1) + (1 - X_i) \\cdot Y_i(0).\\]
                        <p>The other potential outcome is <strong>counterfactual</strong> (反事实的) and fundamentally unobservable. We can never simultaneously observe both \\(Y_i(1)\\) and \\(Y_i(0)\\) for the same unit at the same time. This is the <strong>Fundamental Problem of Causal Inference</strong> (因果推断的根本问题), as named by Holland (1986).</p>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark</div>
                    <div class="env-body">
                        <p>The potential outcomes framework transforms the causal inference problem into a <strong>missing data problem</strong> (缺失数据问题). For each unit, exactly one potential outcome is observed and the other is missing. The challenge of causal inference is to fill in these missing values, or more precisely, to estimate population-level summaries (like the ATE) despite the missingness.</p>
                    </div>
                </div>

                <p>The visualization below shows the potential outcomes table. Each row is a unit. We observe \\(Y(1)\\) for treated units and \\(Y(0)\\) for control units. The "?" marks indicate the missing counterfactual outcomes that we can never observe.</p>

                <div class="viz-placeholder" data-viz="potential-outcomes-table-viz"></div>
            `,
            visualizations: [
                {
                    id: 'potential-outcomes-table-viz',
                    title: 'Potential Outcomes Table with Missing Data',
                    description: 'Interactive table showing observed and counterfactual outcomes for each unit',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 440,
                            scale: 1,
                            originX: 0,
                            originY: 0
                        });

                        var nUnits = 10;
                        var units = [];
                        var showTruth = false;

                        function generateUnits() {
                            units = [];
                            for (var i = 0; i < nUnits; i++) {
                                var y0 = Math.round(50 + VizEngine.randomNormal(0, 15));
                                var tau = Math.round(VizEngine.randomNormal(8, 5));
                                var y1 = y0 + tau;
                                var treated = Math.random() < 0.5 ? 1 : 0;
                                units.push({
                                    id: i + 1,
                                    y0: y0,
                                    y1: y1,
                                    tau: tau,
                                    treated: treated,
                                    yObs: treated ? y1 : y0
                                });
                            }
                        }
                        generateUnits();

                        VizEngine.createButton(controls, 'Reveal True Counterfactuals', function() {
                            showTruth = !showTruth;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Regenerate Units', function() {
                            showTruth = false;
                            generateUnits();
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width;

                            var colX = [30, 90, 160, 250, 340, 440];
                            var headers = ['Unit', 'X_i', 'Y_i(0)', 'Y_i(1)', 'Y_obs', 'tau_i'];
                            var rowH = 32;
                            var startY = 40;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Potential Outcomes Table (Rubin Causal Model)', W / 2, 8);

                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(10, startY - 5, W - 20, rowH);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textBaseline = 'middle';
                            for (var h = 0; h < headers.length; h++) {
                                ctx.fillText(headers[h], colX[h] + 30, startY + rowH / 2 - 3);
                            }

                            for (var i = 0; i < units.length; i++) {
                                var u = units[i];
                                var y = startY + rowH * (i + 1);

                                ctx.fillStyle = i % 2 === 0 ? '#0f0f28' : '#12123000';
                                ctx.fillRect(10, y - 2, W - 20, rowH);

                                ctx.font = '12px -apple-system,monospace';
                                ctx.textBaseline = 'middle';
                                var cy = y + rowH / 2 - 2;

                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(u.id.toString(), colX[0] + 30, cy);

                                ctx.fillStyle = u.treated ? viz.colors.blue : viz.colors.orange;
                                ctx.fillText(u.treated.toString(), colX[1] + 30, cy);

                                if (u.treated === 0) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 12px -apple-system,monospace';
                                    ctx.fillText(u.y0.toString(), colX[2] + 30, cy);
                                } else {
                                    if (showTruth) {
                                        ctx.fillStyle = viz.colors.purple;
                                        ctx.font = '12px -apple-system,monospace';
                                        ctx.fillText(u.y0.toString(), colX[2] + 30, cy);
                                    } else {
                                        ctx.fillStyle = viz.colors.red;
                                        ctx.font = 'bold 14px -apple-system,sans-serif';
                                        ctx.fillText('?', colX[2] + 30, cy);
                                    }
                                }

                                ctx.font = '12px -apple-system,monospace';
                                if (u.treated === 1) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 12px -apple-system,monospace';
                                    ctx.fillText(u.y1.toString(), colX[3] + 30, cy);
                                } else {
                                    if (showTruth) {
                                        ctx.fillStyle = viz.colors.purple;
                                        ctx.font = '12px -apple-system,monospace';
                                        ctx.fillText(u.y1.toString(), colX[3] + 30, cy);
                                    } else {
                                        ctx.fillStyle = viz.colors.red;
                                        ctx.font = 'bold 14px -apple-system,sans-serif';
                                        ctx.fillText('?', colX[3] + 30, cy);
                                    }
                                }

                                ctx.font = '12px -apple-system,monospace';
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText(u.yObs.toString(), colX[4] + 30, cy);

                                if (showTruth) {
                                    ctx.fillStyle = u.tau > 0 ? viz.colors.green : (u.tau < 0 ? viz.colors.red : viz.colors.text);
                                    ctx.fillText((u.tau > 0 ? '+' : '') + u.tau.toString(), colX[5] + 30, cy);
                                } else {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.fillText('?', colX[5] + 30, cy);
                                }
                            }

                            var bottomY = startY + rowH * (nUnits + 1) + 15;

                            if (showTruth) {
                                var sumTau = 0;
                                for (var k = 0; k < units.length; k++) sumTau += units[k].tau;
                                var truATE = sumTau / nUnits;

                                ctx.fillStyle = viz.colors.purple;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('True ATE = ' + truATE.toFixed(1) + '  (revealed counterfactuals in purple)', 20, bottomY);
                            }

                            var nT = 0, sumT = 0, nC = 0, sumC = 0;
                            for (var m = 0; m < units.length; m++) {
                                if (units[m].treated) { nT++; sumT += units[m].yObs; }
                                else { nC++; sumC += units[m].yObs; }
                            }
                            var naiveATE = nT > 0 && nC > 0 ? (sumT / nT - sumC / nC) : 0;

                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Naive estimate (difference in means): ' + naiveATE.toFixed(1), 20, bottomY + 20);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Green = observed, ? = counterfactual (missing), Purple = revealed truth', 20, bottomY + 42);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Suppose unit \\(i\\) receives treatment (\\(X_i = 1\\)) and we observe \\(Y_i = 7\\). Can we determine the individual causal effect \\(\\tau_i = Y_i(1) - Y_i(0)\\)? Why or why not?',
                    hint: 'Think about which potential outcome is observed and which is missing.',
                    solution: 'No, we cannot determine the individual causal effect. We observe Y_i(1) = 7 (since unit i was treated), but Y_i(0) is the counterfactual outcome that would have occurred without treatment, which is fundamentally unobservable. Without knowing Y_i(0), we cannot compute tau_i = Y_i(1) - Y_i(0) = 7 - Y_i(0). This is exactly the Fundamental Problem of Causal Inference: for any single unit, we can never observe both potential outcomes simultaneously.'
                },
                {
                    question: 'The ATE is defined as \\(E[Y(1) - Y(0)]\\). A naive estimator is the difference in observed group means: \\(\\bar{Y}_{\\text{treated}} - \\bar{Y}_{\\text{control}}\\). Under what conditions does the naive estimator equal the ATE? When can it be biased?',
                    hint: 'Think about selection bias: are the treated and control groups comparable?',
                    solution: 'The naive estimator equals the ATE when treatment assignment is independent of potential outcomes: (Y(0), Y(1)) independent of X. This holds in randomized experiments. In observational studies, the naive estimator can be biased due to selection bias: if treated units have systematically different potential outcomes than control units (e.g., healthier patients choose treatment), then the difference in means confounds the causal effect with baseline differences. Formally, the naive estimate equals ATE + selection bias, where selection bias = E[Y(0)|X=1] - E[Y(0)|X=0], the difference in baseline outcomes between the groups.'
                },
                {
                    question: 'Explain the distinction between ATE, ATT, and ATC. Give a practical scenario where ATT is more policy-relevant than ATE.',
                    hint: 'Think about a program with voluntary participation where we want to evaluate impact on participants.',
                    solution: 'ATE = E[Y(1) - Y(0)] is the average effect over the entire population. ATT = E[Y(1) - Y(0) | X = 1] is the average effect among those who actually received treatment. ATC = E[Y(1) - Y(0) | X = 0] is the average effect among those who did not receive treatment. Practical example: Consider a job training program with voluntary enrollment. The ATT is more policy-relevant because it answers: "How much did the program benefit those who chose to participate?" If the government wants to evaluate whether the program was worthwhile for its actual participants (to decide whether to continue funding), the ATT is the relevant quantity. The ATE would answer a different question about what would happen if the entire population were forced to participate, which may not be realistic.'
                }
            ]
        },

        // ===== Section 4: The Fundamental Problem of Causal Inference =====
        {
            id: 'ch00-sec04',
            title: 'The Fundamental Problem of Causal Inference',
            content: `
                <h2>The Fundamental Problem of Causal Inference 因果推断的根本问题</h2>

                <div class="env-block intuition">
                    <div class="env-title">Intuition</div>
                    <div class="env-body">
                        <p>Holland (1986) crystallized the challenge: since we can never observe both \\(Y_i(1)\\) and \\(Y_i(0)\\) for the same unit, causal inference is fundamentally impossible without <strong>assumptions</strong>. The entire field of causal inference can be understood as the study of which assumptions are needed, when they are plausible, and how to leverage them to estimate causal effects from incomplete data.</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 0.12 (SUTVA: Stable Unit Treatment Value Assumption)</div>
                    <div class="env-body">
                        <p>The <strong>Stable Unit Treatment Value Assumption</strong> (稳定单元处理值假设, SUTVA) consists of two components:</p>
                        <ol>
                            <li><strong>No interference</strong> (无干扰): Unit \\(i\\)'s potential outcomes depend only on its own treatment, not on the treatments of other units:
                            \\[Y_i(X_1, X_2, \\ldots, X_n) = Y_i(X_i).\\]</li>
                            <li><strong>No hidden variations of treatment</strong> (无隐藏处理变异): There is only one version of each treatment level. If \\(X_i = 1\\), the treatment received is the same regardless of how \\(X_i\\) came to equal 1.</li>
                        </ol>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark</div>
                    <div class="env-body">
                        <p>SUTVA is often violated in practice. <strong>Interference</strong> (干扰效应) occurs in vaccination programs (my vaccination protects you via herd immunity), social networks (my behavior affects my friends), and markets (one firm's strategy affects competitors). <strong>Treatment variation</strong> (处理变异) occurs when "the same treatment" is administered differently (different surgeons, different drug manufacturers). Violations of SUTVA require more complex frameworks, such as the study of interference and spillover effects.</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 0.13 (Assignment Mechanism)</div>
                    <div class="env-body">
                        <p>The <strong>assignment mechanism</strong> (分配机制) is the probabilistic rule that determines which units receive treatment. Formally, it is the conditional distribution:</p>
                        \\[P(X_1, \\ldots, X_n \\mid Y_1(0), Y_1(1), \\ldots, Y_n(0), Y_n(1), W)\\]
                        <p>where \\(W\\) denotes observed covariates. The assignment mechanism is the key to understanding when causal effects are identifiable:</p>
                        <ul>
                            <li><strong>Randomized experiment</strong>: \\(X \\perp\\!\\!\\!\\perp (Y(0), Y(1))\\) by design.</li>
                            <li><strong>Observational study with unconfoundedness</strong>: \\(X \\perp\\!\\!\\!\\perp (Y(0), Y(1)) \\mid W\\) (conditional on covariates).</li>
                            <li><strong>Confounded observational study</strong>: The assignment depends on potential outcomes even after conditioning on \\(W\\).</li>
                        </ul>
                    </div>
                </div>

                <div class="env-block theorem">
                    <div class="env-title">Theorem 0.14 (Identification under Unconfoundedness)</div>
                    <div class="env-body">
                        <p>If the assignment mechanism satisfies <strong>unconfoundedness</strong> (无混杂性) — also called ignorability or conditional independence assumption (CIA):</p>
                        \\[(Y(0), Y(1)) \\perp\\!\\!\\!\\perp X \\mid W,\\]
                        <p>and <strong>overlap</strong> (重叠性) — also called positivity:</p>
                        \\[0 < P(X = 1 \\mid W = w) < 1 \\quad \\text{for all } w,\\]
                        <p>then the ATE is identified:</p>
                        \\[\\text{ATE} = E_W[E[Y \\mid X = 1, W] - E[Y \\mid X = 0, W]].\\]
                    </div>
                </div>

                <div class="env-block proof">
                    <div class="env-title">Proof (sketch)</div>
                    <div class="env-body">
                        <p>Under unconfoundedness, \\(E[Y(1) \\mid W] = E[Y(1) \\mid X = 1, W] = E[Y \\mid X = 1, W]\\), where the first equality uses \\(Y(1) \\perp\\!\\!\\!\\perp X \\mid W\\) and the second uses the consistency assumption \\(Y = Y(X)\\). Similarly for \\(Y(0)\\). Overlap ensures the conditional expectations are well-defined. The result follows by iterated expectations.</p>
                        <div class="qed">∎</div>
                    </div>
                </div>

                <p>The visualization below illustrates the "missing data" view of causal inference. Each unit has two potential outcomes but we only observe one. The pattern of missingness is determined by the assignment mechanism.</p>

                <div class="viz-placeholder" data-viz="missing-data-framework-viz"></div>
            `,
            visualizations: [
                {
                    id: 'missing-data-framework-viz',
                    title: 'Missing Data Framework for Causal Inference',
                    description: 'Visualizing the fundamental problem as a missing data problem with different assignment mechanisms',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 440,
                            scale: 1,
                            originX: 0,
                            originY: 0
                        });

                        var mode = 'random';
                        var nUnits = 20;
                        var units = [];

                        function generateUnits() {
                            units = [];
                            for (var i = 0; i < nUnits; i++) {
                                var baseline = 40 + Math.round(VizEngine.randomNormal(0, 12));
                                var effect = Math.round(VizEngine.randomNormal(10, 4));
                                units.push({
                                    y0: baseline,
                                    y1: baseline + effect,
                                    treated: 0
                                });
                            }
                            assignTreatment();
                        }

                        function assignTreatment() {
                            if (mode === 'random') {
                                for (var i = 0; i < nUnits; i++) {
                                    units[i].treated = Math.random() < 0.5 ? 1 : 0;
                                }
                            } else if (mode === 'confounded') {
                                for (var j = 0; j < nUnits; j++) {
                                    var prob = 1 / (1 + Math.exp(-(units[j].y0 - 40) / 8));
                                    units[j].treated = Math.random() < prob ? 1 : 0;
                                }
                            } else if (mode === 'deterministic') {
                                var sorted = units.map(function(u, idx) { return {idx: idx, y0: u.y0}; });
                                sorted.sort(function(a, b) { return b.y0 - a.y0; });
                                for (var k = 0; k < nUnits; k++) {
                                    units[sorted[k].idx].treated = k < nUnits / 2 ? 1 : 0;
                                }
                            }
                        }

                        generateUnits();

                        VizEngine.createButton(controls, 'Random Assignment', function() {
                            mode = 'random'; assignTreatment(); draw();
                        });
                        VizEngine.createButton(controls, 'Confounded Assignment', function() {
                            mode = 'confounded'; assignTreatment(); draw();
                        });
                        VizEngine.createButton(controls, 'Deterministic (top half)', function() {
                            mode = 'deterministic'; assignTreatment(); draw();
                        });
                        VizEngine.createButton(controls, 'Regenerate', function() {
                            generateUnits(); draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Missing Data Framework: ' + mode.charAt(0).toUpperCase() + mode.slice(1) + ' Assignment', W / 2, 8);

                            var leftX = 40;
                            var rightX = 310;
                            var dotR = 8;
                            var yStart = 50;
                            var ySpacing = 19;

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Y(0)', leftX + 50, yStart - 15);
                            ctx.fillText('Y(1)', leftX + 130, yStart - 15);
                            ctx.fillText('Observed Y', rightX + 80, yStart - 15);

                            var trueSumTau = 0;
                            var sumYT = 0, nT = 0, sumYC = 0, nC = 0;

                            for (var i = 0; i < nUnits; i++) {
                                var u = units[i];
                                var yPos = yStart + i * ySpacing;
                                trueSumTau += (u.y1 - u.y0);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,monospace';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText((i + 1).toString(), leftX - 5, yPos);

                                if (u.treated === 0) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.beginPath();
                                    ctx.arc(leftX + 50, yPos, dotR, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '8px -apple-system,monospace';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(u.y0.toString(), leftX + 50, yPos + 1);

                                    ctx.fillStyle = viz.colors.red + '44';
                                    ctx.beginPath();
                                    ctx.arc(leftX + 130, yPos, dotR, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = 'bold 10px -apple-system,sans-serif';
                                    ctx.fillText('?', leftX + 130, yPos + 1);

                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.beginPath();
                                    ctx.arc(rightX + 80, yPos, dotR, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '8px -apple-system,monospace';
                                    ctx.fillText(u.y0.toString(), rightX + 80, yPos + 1);

                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('ctrl', rightX + 95, yPos + 1);

                                    sumYC += u.y0; nC++;
                                } else {
                                    ctx.fillStyle = viz.colors.red + '44';
                                    ctx.beginPath();
                                    ctx.arc(leftX + 50, yPos, dotR, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = 'bold 10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('?', leftX + 50, yPos + 1);

                                    ctx.fillStyle = viz.colors.green;
                                    ctx.beginPath();
                                    ctx.arc(leftX + 130, yPos, dotR, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '8px -apple-system,monospace';
                                    ctx.fillText(u.y1.toString(), leftX + 130, yPos + 1);

                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.beginPath();
                                    ctx.arc(rightX + 80, yPos, dotR, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '8px -apple-system,monospace';
                                    ctx.fillText(u.y1.toString(), rightX + 80, yPos + 1);

                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('treat', rightX + 95, yPos + 1);

                                    sumYT += u.y1; nT++;
                                }
                            }

                            var statsY = yStart + nUnits * ySpacing + 15;
                            var trueATE = trueSumTau / nUnits;
                            var naiveEst = (nT > 0 && nC > 0) ? (sumYT / nT - sumYC / nC) : 0;
                            var bias = naiveEst - trueATE;

                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = viz.colors.purple;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.fillText('True ATE: ' + trueATE.toFixed(1), 30, statsY);

                            ctx.fillStyle = viz.colors.yellow;
                            ctx.fillText('Naive estimate: ' + naiveEst.toFixed(1), 220, statsY);

                            ctx.fillStyle = Math.abs(bias) < 3 ? viz.colors.green : viz.colors.red;
                            ctx.fillText('Bias: ' + (bias > 0 ? '+' : '') + bias.toFixed(1), 420, statsY);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            if (mode === 'random') {
                                ctx.fillText('Random assignment: X independent of (Y(0),Y(1)). Naive estimator is unbiased.', 30, statsY + 22);
                            } else if (mode === 'confounded') {
                                ctx.fillText('Confounded: units with higher Y(0) more likely treated. Naive estimator is biased.', 30, statsY + 22);
                            } else {
                                ctx.fillText('Deterministic: top half by Y(0) assigned treatment. Strong upward bias.', 30, statsY + 22);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'State the two components of SUTVA. Give one real-world example where each component is violated.',
                    hint: 'Think about vaccination (interference) and different drug formulations (treatment variation).',
                    solution: 'SUTVA has two components: (1) No interference: Unit i\'s outcome depends only on its own treatment, not on others\' treatments. Violation example: In a vaccination study, whether person i gets vaccinated affects person j\'s probability of infection through herd immunity. Person j\'s outcome Y_j depends on both X_j and X_i, violating Y_j(X_1,...,X_n) = Y_j(X_j). (2) No hidden treatment variation: There is only one version of each treatment level. Violation example: In a study of "surgery" vs "medication," different surgeons have vastly different skill levels, so "surgery" is not a single well-defined treatment. Patient i receiving surgery from an expert surgeon has a different Y_i(1) than if they received surgery from a novice.'
                },
                {
                    question: 'Why is the overlap (positivity) assumption \\(0 < P(X = 1 \\mid W = w) < 1\\) necessary for identification? What happens if it fails for some value of \\(w\\)?',
                    hint: 'Think about what happens if, for some covariate value, all units are treated (or all are untreated).',
                    solution: 'The overlap assumption ensures that for every covariate stratum w, there are both treated and untreated units. This is necessary because the identification formula requires estimating E[Y|X=1,W=w] and E[Y|X=0,W=w] for all values of w. If P(X=1|W=w) = 1 for some w, then there are no control units with W=w, so E[Y|X=0,W=w] is undefined and cannot be estimated from data. Similarly if P(X=1|W=w) = 0. Without overlap, we cannot compare treated and untreated units within that stratum, making the causal effect unidentifiable for those units. In practice, near-violations (propensity scores very close to 0 or 1) lead to extreme weights and high variance in estimators.'
                },
                {
                    question: 'Explain the difference between a randomized experiment and an observational study with unconfoundedness. Why is randomization considered the "gold standard"?',
                    hint: 'Think about whether unconfoundedness is guaranteed by design or assumed.',
                    solution: 'In a randomized experiment, the researcher controls the assignment mechanism: X is assigned randomly (e.g., coin flip), guaranteeing that X is independent of (Y(0), Y(1)) and all covariates W. Unconfoundedness holds by design, not assumption. In an observational study with unconfoundedness, the assumption (Y(0),Y(1)) independent of X | W is imposed but cannot be verified from data. It requires believing that all confounders are observed and included in W; any unmeasured confounder violates the assumption and introduces bias. Randomization is the gold standard because: (1) it guarantees unconfoundedness without requiring knowledge of all confounders; (2) it balances both observed and unobserved covariates in expectation; (3) the validity of the resulting estimates does not depend on correct model specification.'
                },
                {
                    question: 'Holland (1986) famously wrote "No causation without manipulation." What does this mean? What are the limitations of this perspective?',
                    hint: 'Think about treatments that cannot be manipulated, like race or gender.',
                    solution: 'Holland\'s dictum means that for a causal effect to be well-defined, we must be able to conceptualize an intervention that changes the treatment. If we cannot at least hypothetically manipulate X, then the potential outcomes Y(0) and Y(1) are not well-defined, and the causal question is ill-posed. Limitations: This perspective, closely associated with the Rubin Causal Model, has difficulty with immutable attributes like race, gender, or genetic characteristics. It is hard to define "what would happen if person i were a different race" because race is intertwined with identity and life experience. Critics argue this restriction is too narrow and that causal questions about immutable attributes are meaningful. The structural causal model (Pearl) framework is more flexible in this regard, defining causal effects through interventions on a causal graph, which can accommodate a broader set of causal questions. Nonetheless, Holland\'s point remains important: clearer causal questions typically involve treatments that can at least in principle be manipulated.'
                }
            ]
        },

        // ===== Section 5: Overview of Causal Inference Methods =====
        {
            id: 'ch00-sec05',
            title: 'Overview of Causal Inference Methods',
            content: `
                <h2>Overview of Causal Inference Methods 因果推断方法概览</h2>

                <div class="env-block intuition">
                    <div class="env-title">Intuition</div>
                    <div class="env-body">
                        <p>The rest of this course develops a toolkit of methods for estimating causal effects under various assumptions. The choice of method depends critically on the <strong>data-generating process</strong> and the <strong>sources of variation</strong> in treatment. No single method dominates; each exploits a different type of identifying variation. Understanding when each method is appropriate is as important as understanding how each method works.</p>
                    </div>
                </div>

                <div class="env-block definition">
                    <div class="env-title">Definition 0.15 (Taxonomy of Causal Inference Methods)</div>
                    <div class="env-body">
                        <p>Causal inference methods can be broadly classified by their source of identifying variation:</p>
                        <ol>
                            <li><strong>Experimental methods</strong> (实验方法): The researcher controls treatment assignment.
                                <ul>
                                    <li><strong>Randomized Controlled Trials (RCT)</strong> (随机对照试验): Random assignment ensures unconfoundedness. The gold standard. (Chapters 5-7)</li>
                                </ul>
                            </li>
                            <li><strong>Selection-on-observables methods</strong> (基于可观测变量的选择方法): Assume all confounders are observed.
                                <ul>
                                    <li><strong>Matching</strong> (匹配): Pair treated and control units with similar covariates. (Chapter 8-9)</li>
                                    <li><strong>Propensity Score Methods</strong> (倾向得分方法): Model the probability of treatment to adjust for confounding. (Chapter 9)</li>
                                    <li><strong>Doubly Robust Estimation</strong> (双重稳健估计): Combines outcome modeling and propensity score weighting. (Chapter 10)</li>
                                </ul>
                            </li>
                            <li><strong>Instrumental Variables methods</strong> (工具变量方法): Exploit an exogenous source of variation in treatment.
                                <ul>
                                    <li><strong>IV / 2SLS</strong> (工具变量 / 两阶段最小二乘): Use an instrument correlated with treatment but not directly with the outcome. (Chapters 11-12)</li>
                                </ul>
                            </li>
                            <li><strong>Discontinuity-based methods</strong> (断点方法): Exploit sharp changes in treatment probability.
                                <ul>
                                    <li><strong>Regression Discontinuity Design (RDD)</strong> (回归断点设计): Treatment determined by a threshold on a running variable. (Chapter 13)</li>
                                </ul>
                            </li>
                            <li><strong>Panel data / time-series methods</strong> (面板数据方法): Use longitudinal data to control for unobserved confounding.
                                <ul>
                                    <li><strong>Fixed Effects</strong> (固定效应): Remove time-invariant unobserved heterogeneity. (Chapter 14)</li>
                                    <li><strong>Difference-in-Differences (DiD)</strong> (双重差分): Compare changes over time between treated and control groups. (Chapters 15-16)</li>
                                    <li><strong>Synthetic Control</strong> (合成控制): Construct a weighted combination of control units to approximate the counterfactual. (Chapter 17)</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark (Choosing the Right Method)</div>
                    <div class="env-body">
                        <p>The choice of method should be driven by the <strong>institutional context</strong> (制度背景) and <strong>data structure</strong>, not by convenience. Key questions:</p>
                        <ul>
                            <li>Is treatment randomly assigned? \\(\\to\\) RCT analysis</li>
                            <li>Can we credibly argue all confounders are observed? \\(\\to\\) Matching / propensity scores</li>
                            <li>Is there a natural experiment with an excluded instrument? \\(\\to\\) IV</li>
                            <li>Is treatment determined by a cutoff? \\(\\to\\) RDD</li>
                            <li>Do we have panel data with a staggered policy change? \\(\\to\\) DiD or synthetic control</li>
                        </ul>
                    </div>
                </div>

                <div class="env-block remark">
                    <div class="env-title">Remark (Two Frameworks)</div>
                    <div class="env-body">
                        <p>Throughout this course, we will move between two complementary frameworks for causal reasoning:</p>
                        <ul>
                            <li>The <strong>Potential Outcomes Framework</strong> (潜在结果框架, Neyman-Rubin): Defines causal effects as comparisons of potential outcomes. Closely tied to experimental design and statistical estimation. (Chapter 1)</li>
                            <li>The <strong>Structural Causal Model (SCM) / DAG Framework</strong> (结构因果模型 / 有向无环图框架, Pearl): Defines causal effects through interventions on a graphical model. Provides tools for determining when causal effects are identifiable from observational data. (Chapters 2-4)</li>
                        </ul>
                        <p>These frameworks are largely compatible and offer different but complementary perspectives. Mastering both gives the deepest understanding of causal inference.</p>
                    </div>
                </div>

                <div class="env-block example">
                    <div class="env-title">Example 0.16 (Method Selection in Practice)</div>
                    <div class="env-body">
                        <p>Consider the question: "Does a minimum wage increase reduce employment?"</p>
                        <ul>
                            <li><strong>RCT</strong>: Not feasible (cannot randomly assign minimum wages to states).</li>
                            <li><strong>DiD</strong>: Card and Krueger (1994) compared employment in NJ (minimum wage increase) vs PA (no change) before and after the policy change. This is the classic application.</li>
                            <li><strong>Synthetic Control</strong>: Dube and Zipperer (2015) constructed synthetic controls for states that raised the minimum wage.</li>
                            <li><strong>RDD</strong>: Could be used if the policy applies based on firm size thresholds.</li>
                        </ul>
                        <p>Each method exploits different variation and requires different assumptions. The credibility of the causal conclusion depends on the plausibility of those assumptions.</p>
                    </div>
                </div>

                <p>This chapter has introduced the fundamental questions and concepts of causal inference. In the next chapter, we will formally develop the <strong>Potential Outcomes Framework</strong>, the mathematical foundation for defining and estimating causal effects.</p>
            `,
            visualizations: [],
            exercises: [
                {
                    question: 'For each of the following research questions, suggest the most appropriate causal inference method and briefly justify your choice: (a) Does a scholarship program increase college graduation rates, where scholarships are awarded based on GPA above 3.5? (b) Does air pollution increase hospital admissions, using wind direction as a source of variation? (c) Does a new teaching method improve test scores, where the method is randomly assigned to classrooms?',
                    hint: 'Think about the source of variation in treatment for each scenario.',
                    solution: '(a) Regression Discontinuity Design (RDD): Scholarships are assigned based on a cutoff (GPA = 3.5), creating a sharp discontinuity. Students just above and just below the cutoff are nearly identical, so comparing their outcomes identifies the causal effect. (b) Instrumental Variables (IV): Wind direction is plausibly exogenous (random, determined by weather) and affects pollution levels (relevance) but does not directly affect hospital admissions except through pollution (exclusion restriction). Wind direction serves as an instrument for pollution. (c) Randomized Controlled Trial (RCT) analysis: Since the teaching method is randomly assigned, simple comparison of means (or regression adjusting for baseline covariates to improve precision) identifies the causal effect without additional assumptions.'
                },
                {
                    question: 'What is the key assumption of each of the following methods? (a) Matching/propensity scores, (b) Instrumental variables, (c) Difference-in-differences.',
                    hint: 'Each method has a core identifying assumption that, if violated, invalidates the causal conclusion.',
                    solution: '(a) Matching/propensity scores: Conditional Independence Assumption (CIA) / Unconfoundedness: (Y(0), Y(1)) independent of X given observed covariates W. All confounders must be observed and included. (b) Instrumental variables: Exclusion restriction: the instrument Z affects the outcome Y only through the treatment X, not directly. Also requires relevance (Z affects X) and instrument independence (Z independent of unmeasured confounders). (c) Difference-in-differences: Parallel trends assumption: in the absence of treatment, the treated and control groups would have followed the same trend over time. That is, E[Y(0)_t - Y(0)_{t-1} | Treated] = E[Y(0)_t - Y(0)_{t-1} | Control]. This is untestable for the post-treatment period but can be assessed using pre-treatment data.'
                },
                {
                    question: 'Compare the Potential Outcomes Framework (Rubin) and the Structural Causal Model framework (Pearl). What is one advantage of each?',
                    hint: 'Think about what each framework makes easy to express and analyze.',
                    solution: 'Potential Outcomes Framework (Rubin): Advantage: It provides a clean, precise mathematical notation for defining causal effects (ATE, ATT) and directly connects to statistical estimation and experimental design. The framework makes explicit what is observed vs missing and naturally leads to estimators. It is particularly well-suited for analyzing randomized experiments and formulating the selection bias problem. Structural Causal Model Framework (Pearl): Advantage: It provides graphical tools (DAGs) for reasoning about confounding, mediation, and identification in complex causal structures. The do-calculus and d-separation criteria give systematic, algorithmic methods for determining whether a causal effect is identifiable from observational data given a proposed causal graph. It handles complex multi-variable causal structures more naturally than the potential outcomes framework. The two frameworks are largely compatible: DAGs help determine identification, and potential outcomes provide the estimation framework once identification is established.'
                }
            ]
        }
    ]
});
