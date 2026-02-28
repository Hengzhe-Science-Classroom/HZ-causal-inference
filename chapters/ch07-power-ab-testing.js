// Chapter 7: Statistical Power & A/B Testing — 统计功效与A/B测试
window.CHAPTERS.push({
    id: 'ch07',
    number: 7,
    title: 'Statistical Power & A/B Testing',
    subtitle: 'Designing Experiments That Can Detect Effects 统计功效与A/B测试',
    sections: [
        // ── Section 1: Power Analysis Fundamentals ──
        {
            id: 'ch07-sec01',
            title: 'Power Analysis Fundamentals',
            content: `<h2>Power Analysis Fundamentals</h2>
<p>When we design an experiment, we must ask: if the treatment truly has an effect, how likely is our experiment to <strong>detect</strong> it? This question is answered by <strong>statistical power</strong>.</p>

<div class="env-block definition"><div class="env-title">Definition (Type I and Type II Errors)</div><div class="env-body">
<p>In hypothesis testing with null hypothesis \\(H_0\\) and alternative \\(H_1\\):</p>
<p><strong>Type I Error (\\(\\alpha\\)):</strong> Rejecting \\(H_0\\) when it is true (false positive).</p>
<p><strong>Type II Error (\\(\\beta\\)):</strong> Failing to reject \\(H_0\\) when \\(H_1\\) is true (false negative).</p>
<table style="margin:8px auto;border-collapse:collapse;text-align:center;">
<tr><th style="border:1px solid #555;padding:4px 10px;"></th><th style="border:1px solid #555;padding:4px 10px;">\\(H_0\\) true</th><th style="border:1px solid #555;padding:4px 10px;">\\(H_1\\) true</th></tr>
<tr><td style="border:1px solid #555;padding:4px 10px;">Reject \\(H_0\\)</td><td style="border:1px solid #555;padding:4px 10px;color:#f85149;">Type I (\\(\\alpha\\))</td><td style="border:1px solid #555;padding:4px 10px;color:#3fb950;">Correct (Power)</td></tr>
<tr><td style="border:1px solid #555;padding:4px 10px;">Fail to reject</td><td style="border:1px solid #555;padding:4px 10px;color:#3fb950;">Correct</td><td style="border:1px solid #555;padding:4px 10px;color:#f0883e;">Type II (\\(\\beta\\))</td></tr>
</table>
</div></div>

<div class="env-block definition"><div class="env-title">Definition (Statistical Power)</div><div class="env-body">
<p>The <strong>power</strong> of a test is the probability of correctly rejecting \\(H_0\\) when \\(H_1\\) is true:</p>
\\[\\text{Power} = 1 - \\beta = P(\\text{reject } H_0 \\mid H_1 \\text{ is true})\\]
<p>Conventional target: power \\(\\geq 0.80\\) (often 0.90 for well-funded studies).</p>
</div></div>

<p>Power depends on four quantities that form a tightly linked system:</p>
<ol>
<li><strong>Sample size \\(n\\)</strong>: More data means more power.</li>
<li><strong>Significance level \\(\\alpha\\)</strong>: A more lenient threshold (larger \\(\\alpha\\)) gives more power but more false positives.</li>
<li><strong>Effect size \\(\\delta\\)</strong>: Larger true effects are easier to detect.</li>
<li><strong>Variance \\(\\sigma^2\\)</strong>: Less noise means more power.</li>
</ol>

<div class="env-block theorem"><div class="env-title">Proposition (Power of a Two-Sample Z-Test)</div><div class="env-body">
<p>For testing \\(H_0: \\mu_T - \\mu_C = 0\\) vs \\(H_1: \\mu_T - \\mu_C = \\delta\\) with known variance \\(\\sigma^2\\) and equal group sizes \\(n\\):</p>
\\[\\text{Power} = \\Phi\\!\\left(\\frac{\\delta}{\\sigma\\sqrt{2/n}} - z_{\\alpha/2}\\right) + \\Phi\\!\\left(-\\frac{\\delta}{\\sigma\\sqrt{2/n}} - z_{\\alpha/2}\\right)\\]
<p>where \\(\\Phi\\) is the standard normal CDF and \\(z_{\\alpha/2}\\) is the upper \\(\\alpha/2\\) critical value. The second term is typically negligible for practical effect sizes.</p>
</div></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>Think of power as a tug-of-war between signal and noise. The <strong>signal</strong> is the effect size \\(\\delta\\). The <strong>noise</strong> is \\(\\sigma / \\sqrt{n}\\). Power increases when the signal-to-noise ratio \\(\\delta \\sqrt{n} / \\sigma\\) grows. You can boost power by increasing \\(n\\), finding a bigger effect, or reducing noise.</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-power-curve"></div>`,
            visualizations: [
                {
                    id: 'ch07-viz-power-curve',
                    title: 'Interactive Power Curve',
                    description: 'See how power changes with sample size, effect size, and significance level',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 70, originY: 370,
                            scale: 1
                        });

                        var effectSize = 0.5;
                        var alpha = 0.05;
                        var sigma = 1.0;

                        function zCrit(a) {
                            // Approximate inverse normal for upper a/2
                            var p = 1 - a / 2;
                            var t = Math.sqrt(-2 * Math.log(1 - p));
                            return t - (2.515517 + 0.802853 * t + 0.010328 * t * t) /
                                   (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t);
                        }

                        function powerFn(n, delta, sig, a) {
                            var se = sig * Math.sqrt(2 / n);
                            var z = delta / se - zCrit(a);
                            return VizEngine.normalCDF(z, 0, 1);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Axes
                            var maxN = 500;
                            var xScale = 600 / maxN;
                            var yScale = 320;

                            // Grid
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var g = 0; g <= 5; g++) {
                                var gy = 370 - g * 64;
                                ctx.beginPath(); ctx.moveTo(70, gy); ctx.lineTo(670, gy); ctx.stroke();
                            }
                            for (var gn = 0; gn <= 5; gn++) {
                                var gx = 70 + gn * 120;
                                ctx.beginPath(); ctx.moveTo(gx, 50); ctx.lineTo(gx, 370); ctx.stroke();
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(70, 370); ctx.lineTo(670, 370); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(70, 50); ctx.lineTo(70, 370); ctx.stroke();

                            // X labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var xl = 0; xl <= 500; xl += 100) {
                                ctx.fillText(xl, 70 + xl * xScale, 374);
                            }
                            ctx.fillText('Sample size per group (n)', 370, 395);

                            // Y labels
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yl = 0; yl <= 1.0; yl += 0.2) {
                                ctx.fillText(yl.toFixed(1), 65, 370 - yl * yScale);
                            }
                            ctx.save();
                            ctx.translate(15, 210);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.fillText('Power', 0, 0);
                            ctx.restore();

                            // Power = 0.8 reference line
                            var refY = 370 - 0.8 * yScale;
                            ctx.strokeStyle = viz.colors.yellow + '66';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(70, refY); ctx.lineTo(670, refY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.textAlign = 'left';
                            ctx.fillText('Power = 0.80', 675, refY);

                            // Draw power curves for multiple effect sizes
                            var deltas = [0.2, 0.5, 0.8];
                            var curveColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange];
                            var labels = ['Small (d=0.2)', 'Medium (d=0.5)', 'Large (d=0.8)'];

                            for (var ci = 0; ci < deltas.length; ci++) {
                                ctx.strokeStyle = curveColors[ci];
                                ctx.lineWidth = ci === Math.round((effectSize - 0.2) / 0.3) ? 3 : 1.5;
                                ctx.beginPath();
                                var started = false;
                                for (var ni = 5; ni <= maxN; ni += 2) {
                                    var pw = powerFn(ni, deltas[ci], sigma, alpha);
                                    var px = 70 + ni * xScale;
                                    var py = 370 - pw * yScale;
                                    if (!started) { ctx.moveTo(px, py); started = true; }
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // Label
                                ctx.fillStyle = curveColors[ci];
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                var labelN = maxN - 20;
                                var labelPw = powerFn(labelN, deltas[ci], sigma, alpha);
                                ctx.fillText(labels[ci], 70 + labelN * xScale + 5, 370 - labelPw * yScale);
                            }

                            // Highlight current setting
                            ctx.strokeStyle = viz.colors.pink;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            started = false;
                            for (var ni2 = 5; ni2 <= maxN; ni2 += 2) {
                                var pw2 = powerFn(ni2, effectSize, sigma, alpha);
                                var px2 = 70 + ni2 * xScale;
                                var py2 = 370 - pw2 * yScale;
                                if (!started) { ctx.moveTo(px2, py2); started = true; }
                                else ctx.lineTo(px2, py2);
                            }
                            ctx.stroke();

                            // Find n for power=0.8 with current settings
                            var nTarget = -1;
                            for (var nt = 5; nt <= 10000; nt++) {
                                if (powerFn(nt, effectSize, sigma, alpha) >= 0.8) {
                                    nTarget = nt;
                                    break;
                                }
                            }

                            // Title and info
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Power Curves by Effect Size', 370, 20);
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.pink;
                            var infoText = 'Current: d=' + effectSize.toFixed(2) +
                                           ', \u03B1=' + alpha.toFixed(2) +
                                           ', \u03C3=' + sigma.toFixed(1);
                            if (nTarget > 0 && nTarget <= maxN) {
                                infoText += ' \u2192 n=' + nTarget + ' for 80% power';
                            } else if (nTarget > maxN) {
                                infoText += ' \u2192 n=' + nTarget + ' needed (off chart)';
                            }
                            ctx.fillText(infoText, 370, 38);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'Effect size (d)', 0.05, 1.5, effectSize, 0.05, function(v) {
                            effectSize = v; draw();
                        });
                        VizEngine.createSlider(controls, 'Sigma (\u03C3)', 0.5, 3.0, sigma, 0.1, function(v) {
                            sigma = v; draw();
                        });
                        VizEngine.createSlider(controls, 'Alpha (\u03B1)', 0.01, 0.10, alpha, 0.01, function(v) {
                            alpha = v; draw();
                        });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch07-ex01',
                    type: 'multiple-choice',
                    question: 'If we increase the significance level from alpha = 0.01 to alpha = 0.05 while keeping everything else constant, what happens to power?',
                    options: [
                        'Power decreases',
                        'Power increases',
                        'Power stays the same',
                        'It depends on the effect size'
                    ],
                    correct: 1,
                    explanation: 'A larger alpha means a less stringent rejection threshold. The critical region expands, making it easier to reject H0. This increases power (probability of rejecting H0 when H1 is true) but also increases the Type I error rate.'
                },
                {
                    id: 'ch07-ex02',
                    type: 'numeric',
                    question: 'For a two-sample Z-test with sigma = 1, effect size delta = 0.5, alpha = 0.05, and desired power = 0.80, the approximate required sample size per group is n = (z_{0.025} + z_{0.20})^2 * 2 / delta^2. Using z_{0.025} = 1.96 and z_{0.20} = 0.84, compute n (round up).',
                    correct: 63,
                    tolerance: 2,
                    explanation: 'n = (1.96 + 0.84)^2 * 2 * 1^2 / 0.5^2 = (2.80)^2 * 2 / 0.25 = 7.84 * 8 = 62.72, rounding up to 63 per group.'
                },
                {
                    id: 'ch07-ex03',
                    type: 'multiple-choice',
                    question: 'Which combination maximizes statistical power?',
                    options: [
                        'Large n, small alpha, small effect size',
                        'Large n, large alpha, large effect size',
                        'Small n, large alpha, large effect size',
                        'Small n, small alpha, small effect size'
                    ],
                    correct: 1,
                    explanation: 'Power increases with larger sample size, larger significance level (less stringent threshold), and larger effect size. The combination of all three being favorable (large n, large alpha, large effect) maximizes power.'
                },
                {
                    id: 'ch07-ex04',
                    type: 'multiple-choice',
                    question: 'A researcher has power = 0.60. What does this mean in practical terms?',
                    options: [
                        'There is a 60% chance the null hypothesis is false',
                        'If the treatment truly works, there is a 60% chance the study will detect it',
                        'The probability of a Type I error is 0.60',
                        '60% of the effect size will be detected'
                    ],
                    correct: 1,
                    explanation: 'Power = 0.60 means that if the true effect exists (H1 is true), the study has a 60% probability of correctly rejecting the null hypothesis and detecting that effect. This also means a 40% chance of a Type II error (missing the effect).'
                }
            ]
        },

        // ── Section 2: Sample Size Determination ──
        {
            id: 'ch07-sec02',
            title: 'Sample Size Determination',
            content: `<h2>Sample Size Determination</h2>
<p>The most common use of power analysis is <strong>prospective sample size calculation</strong>: before running an experiment, how many subjects do we need?</p>

<div class="env-block theorem"><div class="env-title">Theorem (Sample Size Formula for Two-Sample Test)</div><div class="env-body">
<p>For a two-sided test of \\(H_0: \\mu_T = \\mu_C\\) with significance level \\(\\alpha\\), power \\(1 - \\beta\\), known common variance \\(\\sigma^2\\), and minimum detectable effect \\(\\delta\\), the required sample size <em>per group</em> is:</p>
\\[n = \\frac{(z_{\\alpha/2} + z_\\beta)^2 \\cdot 2\\sigma^2}{\\delta^2}\\]
<p>where \\(z_{\\alpha/2}\\) and \\(z_\\beta\\) are the standard normal quantiles.</p>
</div></div>

<div class="env-block definition"><div class="env-title">Definition (Minimum Detectable Effect)</div><div class="env-body">
<p>The <strong>minimum detectable effect (MDE)</strong> is the smallest treatment effect \\(\\delta\\) that the experiment is designed to detect with specified power. Given a fixed \\(n\\):</p>
\\[\\text{MDE} = (z_{\\alpha/2} + z_\\beta) \\cdot \\sigma \\sqrt{\\frac{2}{n}}\\]
<p>MDE is crucial for planning: if the MDE is larger than the expected effect, the experiment is underpowered.</p>
</div></div>

<div class="env-block remark"><div class="env-title">Remark (Adjustments for Clustering)</div><div class="env-body">
<p>When randomization is at the cluster level (e.g., classrooms, hospitals), the effective sample size shrinks. With \\(m\\) observations per cluster and intraclass correlation \\(\\rho\\):</p>
\\[n_{\\text{eff}} = \\frac{n}{1 + (m-1)\\rho} \\quad \\text{(Design Effect: } \\text{DEFF} = 1 + (m-1)\\rho\\text{)}\\]
<p>Even a small \\(\\rho = 0.05\\) with \\(m = 30\\) students per class gives DEFF \\(= 2.45\\), nearly halving the effective sample size.</p>
</div></div>

<div class="env-block remark"><div class="env-title">Remark (Unequal Allocation)</div><div class="env-body">
<p>If we allocate fraction \\(\\pi\\) to treatment and \\(1 - \\pi\\) to control, the variance of the difference is \\(\\sigma^2(1/\\pi + 1/(1-\\pi))/n\\). This is minimized at \\(\\pi = 0.5\\) (equal allocation). Unequal allocation increases required \\(n\\) by a factor of \\((1/\\pi + 1/(1-\\pi))/4\\).</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-sample-size-calc"></div>`,
            visualizations: [
                {
                    id: 'ch07-viz-sample-size-calc',
                    title: 'Sample Size Calculator',
                    description: 'Interactive calculator showing how parameters affect required sample size',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 80, originY: 380,
                            scale: 1
                        });

                        var delta = 0.5;
                        var sigma = 1.0;
                        var power = 0.80;
                        var alpha = 0.05;

                        function qnorm(p) {
                            // Rational approximation for inverse normal
                            if (p <= 0) return -Infinity;
                            if (p >= 1) return Infinity;
                            if (p < 0.5) return -qnorm(1 - p);
                            var t = Math.sqrt(-2 * Math.log(1 - p));
                            return t - (2.515517 + 0.802853 * t + 0.010328 * t * t) /
                                   (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t);
                        }

                        function calcN(d, s, pw, a) {
                            var za = qnorm(1 - a / 2);
                            var zb = qnorm(pw);
                            return Math.ceil((za + zb) * (za + zb) * 2 * s * s / (d * d));
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var nReq = calcN(delta, sigma, power, alpha);

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Sample Size Calculator', 350, 20);

                            // Display required n prominently
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = 'bold 28px -apple-system,sans-serif';
                            ctx.fillText('n = ' + nReq + ' per group', 350, 60);
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Total subjects: ' + (2 * nReq), 350, 82);

                            // Bar chart: show n for different effect sizes
                            var effectSizes = [0.1, 0.2, 0.3, 0.5, 0.8, 1.0];
                            var barW = 70;
                            var gap = 20;
                            var totalW = effectSizes.length * barW + (effectSizes.length - 1) * gap;
                            var startX = (700 - totalW) / 2;
                            var maxBar = 300;

                            // Compute all n values
                            var nVals = [];
                            var maxNVal = 0;
                            for (var i = 0; i < effectSizes.length; i++) {
                                var nv = calcN(effectSizes[i], sigma, power, alpha);
                                nVals.push(nv);
                                if (nv > maxNVal) maxNVal = nv;
                            }
                            // Cap display
                            if (maxNVal > 5000) maxNVal = 5000;

                            // Baseline
                            var baseY = 370;
                            var topY = 110;
                            var barScale = (baseY - topY) / maxNVal;

                            // Grid lines
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            var gridStep = maxNVal > 2000 ? 1000 : maxNVal > 500 ? 200 : maxNVal > 100 ? 50 : 10;
                            for (var gg = 0; gg <= maxNVal; gg += gridStep) {
                                var gy = baseY - gg * barScale;
                                ctx.beginPath(); ctx.moveTo(startX - 10, gy); ctx.lineTo(startX + totalW + 10, gy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(gg, startX - 15, gy);
                            }

                            // Bars
                            for (var bi = 0; bi < effectSizes.length; bi++) {
                                var bx = startX + bi * (barW + gap);
                                var dispN = Math.min(nVals[bi], maxNVal);
                                var bh = dispN * barScale;
                                var isActive = Math.abs(effectSizes[bi] - delta) < 0.01;

                                ctx.fillStyle = isActive ? viz.colors.teal : viz.colors.blue + '88';
                                ctx.fillRect(bx, baseY - bh, barW, bh);
                                ctx.strokeStyle = isActive ? viz.colors.teal : viz.colors.blue;
                                ctx.lineWidth = isActive ? 2 : 1;
                                ctx.strokeRect(bx, baseY - bh, barW, bh);

                                // n value on top of bar
                                ctx.fillStyle = isActive ? viz.colors.white : viz.colors.text;
                                ctx.font = (isActive ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                var dispLabel = nVals[bi] > maxNVal ? nVals[bi] + '+' : '' + nVals[bi];
                                ctx.fillText('n=' + dispLabel, bx + barW / 2, baseY - bh - 4);

                                // Effect size label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textBaseline = 'top';
                                ctx.fillText('d=' + effectSizes[bi].toFixed(1), bx + barW / 2, baseY + 4);
                            }

                            // Axis label
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Effect Size (Cohen\'s d)', 350, baseY + 22);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'Effect size (d)', 0.1, 1.5, delta, 0.05, function(v) {
                            delta = v; draw();
                        });
                        VizEngine.createSlider(controls, 'Sigma (\u03C3)', 0.5, 3.0, sigma, 0.1, function(v) {
                            sigma = v; draw();
                        });
                        VizEngine.createSlider(controls, 'Power (1-\u03B2)', 0.50, 0.99, power, 0.01, function(v) {
                            power = v; draw();
                        });
                        VizEngine.createSlider(controls, 'Alpha (\u03B1)', 0.01, 0.10, alpha, 0.01, function(v) {
                            alpha = v; draw();
                        });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch07-ex05',
                    type: 'numeric',
                    question: 'A researcher plans a two-sample test with sigma = 2, delta = 0.4, alpha = 0.05, and desired power = 0.80. Using z_{0.025} = 1.96, z_{0.20} = 0.84, compute the required n per group. Round up.',
                    correct: 392,
                    tolerance: 5,
                    explanation: 'n = (1.96 + 0.84)^2 * 2 * (2)^2 / (0.4)^2 = (2.80)^2 * 8 / 0.16 = 7.84 * 50 = 392.'
                },
                {
                    id: 'ch07-ex06',
                    type: 'multiple-choice',
                    question: 'A cluster-randomized trial has 20 students per cluster and an ICC of rho = 0.10. What is the design effect?',
                    options: [
                        '1.10',
                        '1.90',
                        '2.90',
                        '3.00'
                    ],
                    correct: 2,
                    explanation: 'Design effect = 1 + (m-1)*rho = 1 + 19 * 0.10 = 1 + 1.9 = 2.90. This means you need roughly 2.9 times the individually-randomized sample size.'
                },
                {
                    id: 'ch07-ex07',
                    type: 'multiple-choice',
                    question: 'If you halve the minimum detectable effect (from delta to delta/2), how does the required sample size change?',
                    options: [
                        'Doubles',
                        'Quadruples',
                        'Increases by 50%',
                        'Stays the same'
                    ],
                    correct: 1,
                    explanation: 'Since n is proportional to 1/delta^2, halving delta means n is multiplied by 1/(1/2)^2 = 4. Detecting smaller effects requires quadratically more data.'
                },
                {
                    id: 'ch07-ex08',
                    type: 'multiple-choice',
                    question: 'In an experiment with unequal allocation (2:1 treatment to control), how does the required total sample size compare to equal allocation?',
                    options: [
                        'It is smaller since the treatment group is larger',
                        'It is the same since total n is unchanged',
                        'It is larger by a factor of about 1.125',
                        'It is larger by a factor of 2'
                    ],
                    correct: 2,
                    explanation: 'With pi = 2/3 for treatment, the inflation factor is (1/pi + 1/(1-pi))/4 = (3/2 + 3)/4 = 4.5/4 = 1.125. Equal allocation (pi = 0.5) minimizes total sample size, so any departure increases it.'
                }
            ]
        },

        // ── Section 3: A/B Testing Framework ──
        {
            id: 'ch07-sec03',
            title: 'A/B Testing Framework',
            content: `<h2>A/B Testing Framework</h2>
<p>A/B testing is the technology industry's implementation of randomized controlled trials, applied to digital products at massive scale. While the statistical foundations are the same, the practice introduces unique challenges and considerations.</p>

<div class="env-block definition"><div class="env-title">Definition (A/B Test)</div><div class="env-body">
<p>An <strong>A/B test</strong> (online controlled experiment) randomly assigns users to one of two (or more) variants:</p>
<p>- <strong>Control (A)</strong>: The existing experience</p>
<p>- <strong>Treatment (B)</strong>: The new variant</p>
<p>A <strong>primary metric</strong> (e.g., conversion rate, revenue per user) is compared between groups to determine if the treatment has a statistically significant effect.</p>
</div></div>

<div class="env-block definition"><div class="env-title">Definition (Randomization Unit)</div><div class="env-body">
<p>The <strong>randomization unit</strong> is the entity randomly assigned to a variant. Common choices:</p>
<p>- <strong>User-level:</strong> Each user sees a consistent experience. Most common for product experiments.</p>
<p>- <strong>Session-level:</strong> Same user may see different variants across sessions. Increases sample size but adds noise.</p>
<p>- <strong>Page-level:</strong> Each page view is independently randomized. Maximum data but inconsistent user experience.</p>
<p>The analysis unit must match the randomization unit to maintain valid inference.</p>
</div></div>

<div class="env-block remark"><div class="env-title">Remark (Metric Taxonomy)</div><div class="env-body">
<p><strong>Primary metric:</strong> The key business metric the experiment aims to move (e.g., click-through rate).</p>
<p><strong>Secondary metrics:</strong> Additional metrics of interest that may help interpret results.</p>
<p><strong>Guardrail metrics:</strong> Metrics that should <em>not</em> degrade (e.g., page load time, crash rate, revenue). An experiment that improves the primary metric but degrades a guardrail may still be rejected.</p>
<p><strong>Overall Evaluation Criterion (OEC):</strong> A composite metric combining multiple objectives into a single score for decision-making.</p>
</div></div>

<div class="env-block remark"><div class="env-title">Remark (Duration Planning)</div><div class="env-body">
<p>Experiments should run for at least <strong>one full week</strong> to capture day-of-week effects. Other timing considerations:</p>
<p>- <strong>Ramp-up:</strong> Start with a small percentage (e.g., 1%) to catch severe bugs, then increase.</p>
<p>- <strong>Maturation:</strong> User behavior may take time to stabilize after exposure to a new feature.</p>
<p>- <strong>Seasonality:</strong> Holiday periods or special events can bias results.</p>
</div></div>

<div class="env-block remark"><div class="env-title">Remark (Network Effects / Interference)</div><div class="env-body">
<p>Standard A/B tests assume SUTVA (no interference between units). This breaks down in social and marketplace settings where one user's treatment affects another's outcome. Solutions include <strong>cluster randomization</strong> (randomize by geographic region, social cluster) and <strong>switchback experiments</strong> (alternate treatment across time periods).</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-ab-simulation"></div>`,
            visualizations: [
                {
                    id: 'ch07-viz-ab-simulation',
                    title: 'A/B Test Simulation',
                    description: 'Watch a simulated A/B test unfold with running estimates and confidence intervals',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 80, originY: 350,
                            scale: 1
                        });

                        var trueEffect = 0.3;
                        var sigma = 2.0;
                        var maxUsers = 500;
                        var speed = 5;
                        var currentN = 0;
                        var controlSum = 0;
                        var treatSum = 0;
                        var controlSS = 0;
                        var treatSS = 0;
                        var history = [];
                        var running = false;

                        function reset() {
                            currentN = 0;
                            controlSum = 0;
                            treatSum = 0;
                            controlSS = 0;
                            treatSS = 0;
                            history = [];
                        }

                        function addObservations(count) {
                            for (var i = 0; i < count && currentN < maxUsers; i++) {
                                currentN++;
                                var yc = VizEngine.randomNormal(0, sigma);
                                var yt = VizEngine.randomNormal(trueEffect, sigma);
                                controlSum += yc;
                                treatSum += yt;
                                controlSS += yc * yc;
                                treatSS += yt * yt;

                                if (currentN >= 5) {
                                    var meanC = controlSum / currentN;
                                    var meanT = treatSum / currentN;
                                    var diff = meanT - meanC;
                                    var varC = (controlSS - currentN * meanC * meanC) / (currentN - 1);
                                    var varT = (treatSS - currentN * meanT * meanT) / (currentN - 1);
                                    var se = Math.sqrt((varC + varT) / currentN);
                                    history.push({n: currentN, diff: diff, se: se});
                                }
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var plotLeft = 80;
                            var plotRight = 670;
                            var plotTop = 60;
                            var plotBottom = 350;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('A/B Test: Running Treatment Effect Estimate', 375, 20);
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('True effect = ' + trueEffect.toFixed(2) + ', n per group up to ' + maxUsers, 375, 38);

                            // Y axis: effect estimate
                            var yRange = Math.max(2, Math.abs(trueEffect) * 4);
                            var yMin = -yRange;
                            var yMax = yRange;
                            var yScale = plotH / (yMax - yMin);

                            // Grid
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var yg = Math.ceil(yMin); yg <= Math.floor(yMax); yg++) {
                                var yy = plotBottom - (yg - yMin) * yScale;
                                ctx.beginPath(); ctx.moveTo(plotLeft, yy); ctx.lineTo(plotRight, yy); ctx.stroke();
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotRight, plotBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotTop); ctx.lineTo(plotLeft, plotBottom); ctx.stroke();

                            // Zero line
                            var zeroY = plotBottom - (0 - yMin) * yScale;
                            ctx.strokeStyle = viz.colors.text + '88';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath(); ctx.moveTo(plotLeft, zeroY); ctx.lineTo(plotRight, zeroY); ctx.stroke();
                            ctx.setLineDash([]);

                            // True effect line
                            var trueY = plotBottom - (trueEffect - yMin) * yScale;
                            ctx.strokeStyle = viz.colors.green + '88';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 3]);
                            ctx.beginPath(); ctx.moveTo(plotLeft, trueY); ctx.lineTo(plotRight, trueY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('True effect = ' + trueEffect.toFixed(2), plotRight + 5, trueY);

                            // X labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var xl = 0; xl <= maxUsers; xl += 100) {
                                var xx = plotLeft + xl / maxUsers * plotW;
                                ctx.fillText(xl, xx, plotBottom + 4);
                            }
                            ctx.fillText('Users per group', (plotLeft + plotRight) / 2, plotBottom + 20);

                            // Y labels
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yl = Math.ceil(yMin); yl <= Math.floor(yMax); yl++) {
                                var yyl = plotBottom - (yl - yMin) * yScale;
                                ctx.fillText(yl.toFixed(0), plotLeft - 5, yyl);
                            }

                            // Draw CI band and estimate line
                            if (history.length > 1) {
                                // CI band
                                ctx.fillStyle = viz.colors.blue + '22';
                                ctx.beginPath();
                                for (var hi = 0; hi < history.length; hi++) {
                                    var hx = plotLeft + history[hi].n / maxUsers * plotW;
                                    var upper = history[hi].diff + 1.96 * history[hi].se;
                                    var hy = plotBottom - (Math.max(yMin, Math.min(yMax, upper)) - yMin) * yScale;
                                    if (hi === 0) ctx.moveTo(hx, hy);
                                    else ctx.lineTo(hx, hy);
                                }
                                for (var hi2 = history.length - 1; hi2 >= 0; hi2--) {
                                    var hx2 = plotLeft + history[hi2].n / maxUsers * plotW;
                                    var lower = history[hi2].diff - 1.96 * history[hi2].se;
                                    var hy2 = plotBottom - (Math.max(yMin, Math.min(yMax, lower)) - yMin) * yScale;
                                    ctx.lineTo(hx2, hy2);
                                }
                                ctx.closePath();
                                ctx.fill();

                                // Estimate line
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var hi3 = 0; hi3 < history.length; hi3++) {
                                    var hx3 = plotLeft + history[hi3].n / maxUsers * plotW;
                                    var hy3 = plotBottom - (Math.max(yMin, Math.min(yMax, history[hi3].diff)) - yMin) * yScale;
                                    if (hi3 === 0) ctx.moveTo(hx3, hy3);
                                    else ctx.lineTo(hx3, hy3);
                                }
                                ctx.stroke();

                                // Current value
                                var last = history[history.length - 1];
                                var ciLo = last.diff - 1.96 * last.se;
                                var ciHi = last.diff + 1.96 * last.se;
                                var sig = (ciLo > 0 || ciHi < 0);

                                ctx.fillStyle = sig ? viz.colors.green : viz.colors.orange;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(
                                    'n=' + currentN + ': \u0394=' + last.diff.toFixed(3) +
                                    ' [' + ciLo.toFixed(3) + ', ' + ciHi.toFixed(3) + '] ' +
                                    (sig ? 'SIGNIFICANT' : 'not significant'),
                                    375, plotBottom + 38
                                );
                            }

                            // Status
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('H0: \u0394 = 0', plotLeft, plotBottom - (0 - yMin) * yScale - 8);
                        }

                        draw();

                        var animId = null;
                        function step() {
                            if (currentN >= maxUsers) {
                                running = false;
                                return;
                            }
                            addObservations(speed);
                            draw();
                            if (running) animId = requestAnimationFrame(step);
                        }

                        VizEngine.createButton(controls, 'Run Experiment', function() {
                            if (running) return;
                            reset();
                            running = true;
                            step();
                        });
                        VizEngine.createButton(controls, 'Stop', function() {
                            running = false;
                            if (animId) cancelAnimationFrame(animId);
                        });
                        VizEngine.createSlider(controls, 'True effect (\u0394)', -1.0, 2.0, trueEffect, 0.1, function(v) {
                            trueEffect = v; reset(); draw();
                        });
                        VizEngine.createSlider(controls, 'Noise (\u03C3)', 0.5, 5.0, sigma, 0.1, function(v) {
                            sigma = v; reset(); draw();
                        });
                        VizEngine.createSlider(controls, 'Max n', 100, 2000, maxUsers, 100, function(v) {
                            maxUsers = Math.round(v); reset(); draw();
                        });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch07-ex09',
                    type: 'multiple-choice',
                    question: 'In an A/B test on a social media feed, randomization is at the user level but the primary metric is "likes per session." Which issue is most concerning?',
                    options: [
                        'The metric is too noisy',
                        'The analysis unit (session) differs from the randomization unit (user)',
                        'The metric is a ratio, which is always biased',
                        'Social media metrics cannot be A/B tested'
                    ],
                    correct: 1,
                    explanation: 'When the analysis unit differs from the randomization unit, standard errors are typically underestimated because within-user correlation is ignored. The correct approach is to aggregate to the user level (e.g., average likes per session per user) before comparing groups.'
                },
                {
                    id: 'ch07-ex10',
                    type: 'multiple-choice',
                    question: 'A guardrail metric is defined as one that:',
                    options: [
                        'Must improve for the experiment to be shipped',
                        'Must not degrade beyond a threshold, even if the primary metric improves',
                        'Is always a revenue metric',
                        'Is only measured after the experiment ends'
                    ],
                    correct: 1,
                    explanation: 'Guardrail metrics protect against unintended harm. For example, a feature might increase clicks but slow page load time unacceptably. Even if the primary metric (clicks) improves, the experiment may be rejected if the guardrail (latency) degrades.'
                },
                {
                    id: 'ch07-ex11',
                    type: 'multiple-choice',
                    question: 'Why should an A/B test run for at least one full week?',
                    options: [
                        'To accumulate enough data for significance',
                        'To capture day-of-week effects in user behavior',
                        'Because servers need time to log all events',
                        'To allow the engineering team to fix bugs'
                    ],
                    correct: 1,
                    explanation: 'User behavior often varies systematically by day of the week (e.g., weekend vs. weekday patterns). Running for at least one full cycle captures this variation and prevents biased estimates from sampling only certain days.'
                }
            ]
        },

        // ── Section 4: Multiple Testing & Sequential Analysis ──
        {
            id: 'ch07-sec04',
            title: 'Multiple Testing & Sequential Analysis',
            content: `<h2>Multiple Testing & Sequential Analysis</h2>
<p>Real A/B testing platforms run many tests simultaneously and often check results continuously. Both practices inflate false positive rates unless properly corrected.</p>

<div class="env-block definition"><div class="env-title">Definition (Family-Wise Error Rate)</div><div class="env-body">
<p>The <strong>family-wise error rate (FWER)</strong> is the probability of making at least one Type I error across a family of \\(m\\) hypothesis tests:</p>
\\[\\text{FWER} = P(\\text{at least one false rejection})\\]
<p>With \\(m\\) independent tests at level \\(\\alpha\\), the FWER is:</p>
\\[\\text{FWER} = 1 - (1 - \\alpha)^m\\]
<p>For \\(m = 20\\) tests at \\(\\alpha = 0.05\\): FWER \\(= 1 - 0.95^{20} \\approx 0.64\\). Nearly two-thirds of the time, at least one null is falsely rejected!</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Bonferroni Correction)</div><div class="env-body">
<p>To control FWER at level \\(\\alpha\\) across \\(m\\) tests, reject hypothesis \\(i\\) if \\(p_i \\leq \\alpha / m\\).</p>
<p><strong>Proof:</strong> By the union bound, \\(P(\\exists i : p_i \\leq \\alpha/m \\mid \\text{all } H_0 \\text{ true}) \\leq m \\cdot \\alpha/m = \\alpha\\). \\(\\square\\)</p>
<p>Bonferroni is simple but conservative, especially when tests are correlated.</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Holm's Step-Down Procedure)</div><div class="env-body">
<p>Order p-values: \\(p_{(1)} \\leq p_{(2)} \\leq \\cdots \\leq p_{(m)}\\). Starting from the smallest:</p>
<p>- If \\(p_{(k)} \\leq \\alpha / (m - k + 1)\\), reject \\(H_{(k)}\\) and continue.</p>
<p>- At the first \\(k\\) where \\(p_{(k)} > \\alpha / (m - k + 1)\\), stop and accept all remaining hypotheses.</p>
<p>Holm's procedure controls FWER at level \\(\\alpha\\) and is uniformly more powerful than Bonferroni.</p>
</div></div>

<div class="env-block definition"><div class="env-title">Definition (False Discovery Rate)</div><div class="env-body">
<p>The <strong>false discovery rate (FDR)</strong> is the expected proportion of false rejections among all rejections:</p>
\\[\\text{FDR} = E\\!\\left[\\frac{V}{R \\vee 1}\\right]\\]
<p>where \\(V\\) is the number of false rejections and \\(R\\) is the total number of rejections. FDR \\(\\leq\\) FWER, so controlling FDR is a less stringent (more powerful) criterion.</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Benjamini-Hochberg Procedure)</div><div class="env-body">
<p>To control FDR at level \\(q\\):</p>
<p>1. Order p-values: \\(p_{(1)} \\leq \\cdots \\leq p_{(m)}\\).</p>
<p>2. Find the largest \\(k\\) such that \\(p_{(k)} \\leq k \\cdot q / m\\).</p>
<p>3. Reject all \\(H_{(1)}, \\ldots, H_{(k)}\\).</p>
<p>Under independence (or positive dependence), this controls FDR at level \\(q\\).</p>
</div></div>

<div class="env-block remark"><div class="env-title">Remark (Sequential Testing)</div><div class="env-body">
<p>In continuous monitoring of A/B tests, checking results at every time point inflates the false positive rate (the <strong>peeking problem</strong>). Solutions include:</p>
<p>- <strong>Always-valid p-values</strong> (anytime p-values): Remain valid regardless of the stopping rule.</p>
<p>- <strong>Mixture Sequential Probability Ratio Test (mSPRT)</strong>: A likelihood ratio approach that places a mixing distribution over the effect size, providing type I error control at any stopping time.</p>
<p>- <strong>Group sequential methods</strong>: Pre-specify a small number of interim looks with adjusted boundaries (e.g., O'Brien-Fleming, Pocock).</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-fdr-control"></div>`,
            visualizations: [
                {
                    id: 'ch07-viz-fdr-control',
                    title: 'FDR Control Visualization',
                    description: 'Visualize how BH procedure controls false discovery rate across multiple hypotheses',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 70, originY: 380,
                            scale: 1
                        });

                        var m = 20;
                        var pi0 = 0.7;  // fraction of true nulls
                        var fdrLevel = 0.05;
                        var pvals = [];
                        var isNull = [];

                        function generatePvals() {
                            pvals = [];
                            isNull = [];
                            for (var i = 0; i < m; i++) {
                                var trulyNull = Math.random() < pi0;
                                isNull.push(trulyNull);
                                if (trulyNull) {
                                    pvals.push(Math.random()); // uniform under null
                                } else {
                                    // p-values from alternative: tend to be small
                                    pvals.push(Math.random() * Math.random() * Math.random());
                                }
                            }
                        }

                        generatePvals();

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var plotLeft = 70;
                            var plotRight = 670;
                            var plotTop = 55;
                            var plotBottom = 360;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Benjamini-Hochberg FDR Control', 375, 18);
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText(m + ' hypotheses, ' + Math.round((1 - pi0) * 100) + '% truly non-null, FDR level q = ' + fdrLevel.toFixed(2), 375, 36);

                            // Sort p-values with indices
                            var indexed = pvals.map(function(p, i) { return {p: p, i: i, isNull: isNull[i]}; });
                            indexed.sort(function(a, b) { return a.p - b.p; });

                            // BH: find largest k where p_(k) <= k*q/m
                            var bhK = 0;
                            for (var k = 0; k < indexed.length; k++) {
                                if (indexed[k].p <= (k + 1) * fdrLevel / m) {
                                    bhK = k + 1;
                                }
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotRight, plotBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotTop); ctx.lineTo(plotLeft, plotBottom); ctx.stroke();

                            // Y scale: p-values 0 to 1
                            var yScale = plotH;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yt = 0; yt <= 1; yt += 0.2) {
                                var yy = plotBottom - yt * yScale;
                                ctx.fillText(yt.toFixed(1), plotLeft - 5, yy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(plotLeft, yy); ctx.lineTo(plotRight, yy); ctx.stroke();
                            }
                            ctx.save();
                            ctx.translate(12, (plotTop + plotBottom) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('p-value (ordered)', 0, 0);
                            ctx.restore();

                            // X scale: rank 1..m
                            var barW = plotW / m * 0.7;
                            var barGap = plotW / m;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.font = '9px -apple-system,sans-serif';

                            // BH threshold line
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var li = 0; li < m; li++) {
                                var lx = plotLeft + (li + 0.5) * barGap;
                                var ly = plotBottom - ((li + 1) * fdrLevel / m) * yScale;
                                if (li === 0) ctx.moveTo(lx, ly);
                                else ctx.lineTo(lx, ly);
                            }
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            var lastThreshY = plotBottom - (m * fdrLevel / m) * yScale;
                            ctx.fillText('BH threshold: k\u00B7q/m', plotRight - 120, lastThreshY - 12);

                            // Bonferroni line
                            var bonfY = plotBottom - (fdrLevel / m) * yScale;
                            ctx.strokeStyle = viz.colors.red + '88';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath(); ctx.moveTo(plotLeft, bonfY); ctx.lineTo(plotRight, bonfY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.red;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('Bonferroni: \u03B1/m', plotRight, bonfY + 10);

                            // Draw bars for each sorted p-value
                            ctx.font = '9px -apple-system,sans-serif';
                            var falseDisc = 0;
                            var trueDisc = 0;
                            for (var bi = 0; bi < indexed.length; bi++) {
                                var bx = plotLeft + (bi + 0.5) * barGap - barW / 2;
                                var pv = indexed[bi].p;
                                var by = plotBottom - pv * yScale;
                                var bh = pv * yScale;
                                var rejected = bi < bhK;
                                var isNullH = indexed[bi].isNull;

                                if (rejected && isNullH) falseDisc++;
                                if (rejected && !isNullH) trueDisc++;

                                // Color: rejected + null = red, rejected + alt = green, not rejected = gray
                                if (rejected) {
                                    ctx.fillStyle = isNullH ? viz.colors.red + 'BB' : viz.colors.green + 'BB';
                                } else {
                                    ctx.fillStyle = isNullH ? viz.colors.text + '44' : viz.colors.blue + '44';
                                }
                                ctx.fillRect(bx, by, barW, bh);

                                // Border
                                ctx.strokeStyle = rejected ?
                                    (isNullH ? viz.colors.red : viz.colors.green) :
                                    viz.colors.text + '66';
                                ctx.lineWidth = rejected ? 1.5 : 0.5;
                                ctx.strokeRect(bx, by, barW, bh);

                                // Rank label
                                ctx.fillStyle = viz.colors.text;
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                if (m <= 30) {
                                    ctx.fillText(bi + 1, bx + barW / 2, plotBottom + 3);
                                }
                            }

                            // X axis label
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Rank (ordered p-values)', (plotLeft + plotRight) / 2, plotBottom + 18);

                            // Summary
                            var totalRej = bhK;
                            var fdp = totalRej > 0 ? (falseDisc / totalRej) : 0;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText(
                                'Rejected: ' + totalRej + '/' + m +
                                ' | True discoveries: ' + trueDisc +
                                ' | False discoveries: ' + falseDisc +
                                ' | FDP: ' + fdp.toFixed(2),
                                375, plotBottom + 40
                            );

                            // Legend
                            var legX = plotRight - 160;
                            var legY = plotTop + 5;
                            var legItems = [
                                {color: viz.colors.green, label: 'True positive (rejected, H1 true)'},
                                {color: viz.colors.red, label: 'False positive (rejected, H0 true)'},
                                {color: viz.colors.blue + '44', label: 'Missed (not rejected, H1 true)'},
                                {color: viz.colors.text + '44', label: 'True negative (not rejected, H0 true)'}
                            ];
                            for (var li2 = 0; li2 < legItems.length; li2++) {
                                ctx.fillStyle = legItems[li2].color;
                                ctx.fillRect(legX, legY + li2 * 16, 10, 10);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(legItems[li2].label, legX + 14, legY + li2 * 16 + 9);
                            }
                        }

                        draw();

                        VizEngine.createButton(controls, 'New Random P-values', function() {
                            generatePvals(); draw();
                        });
                        VizEngine.createSlider(controls, 'Number of tests (m)', 5, 50, m, 1, function(v) {
                            m = Math.round(v); generatePvals(); draw();
                        });
                        VizEngine.createSlider(controls, 'Fraction null (\u03C0\u2080)', 0.1, 0.95, pi0, 0.05, function(v) {
                            pi0 = v; generatePvals(); draw();
                        });
                        VizEngine.createSlider(controls, 'FDR level (q)', 0.01, 0.20, fdrLevel, 0.01, function(v) {
                            fdrLevel = v; draw();
                        });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch07-ex12',
                    type: 'numeric',
                    question: 'If you run m = 10 independent tests each at alpha = 0.05, what is the family-wise error rate? Give your answer as a proportion rounded to two decimal places.',
                    correct: 0.40,
                    tolerance: 0.02,
                    explanation: 'FWER = 1 - (1 - 0.05)^10 = 1 - 0.95^10 = 1 - 0.5987 = 0.4013, approximately 0.40.'
                },
                {
                    id: 'ch07-ex13',
                    type: 'numeric',
                    question: 'Using Bonferroni correction with m = 20 tests and desired FWER = 0.05, what is the adjusted significance level for each individual test?',
                    correct: 0.0025,
                    tolerance: 0.0001,
                    explanation: 'Bonferroni adjusts each test to alpha/m = 0.05/20 = 0.0025.'
                },
                {
                    id: 'ch07-ex14',
                    type: 'multiple-choice',
                    question: 'In the Benjamini-Hochberg procedure, the sorted p-values are p_(1) = 0.001, p_(2) = 0.015, p_(3) = 0.030, p_(4) = 0.200, p_(5) = 0.800, with q = 0.05. Which hypotheses are rejected?',
                    options: [
                        'Only H_(1)',
                        'H_(1) and H_(2)',
                        'H_(1), H_(2), and H_(3)',
                        'All five'
                    ],
                    correct: 2,
                    explanation: 'Compare p_(k) to k*q/m = k*0.05/5 = k*0.01. p_(1)=0.001 <= 0.01, p_(2)=0.015 <= 0.02, p_(3)=0.030 <= 0.03, p_(4)=0.200 > 0.04, p_(5)=0.800 > 0.05. The largest k with p_(k) <= k*0.01 is k=3. Reject H_(1), H_(2), H_(3).'
                },
                {
                    id: 'ch07-ex15',
                    type: 'multiple-choice',
                    question: 'Why is FDR control preferred over FWER control in large-scale testing (e.g., genomics, many A/B tests)?',
                    options: [
                        'FDR is always smaller than FWER',
                        'FDR control allows more discoveries while tolerating a controlled proportion of false positives',
                        'FDR does not require p-values',
                        'FDR guarantees no false positives'
                    ],
                    correct: 1,
                    explanation: 'FWER control (like Bonferroni) becomes extremely conservative as m grows, rejecting almost nothing. FDR control instead tolerates a specified fraction of false discoveries among rejections, maintaining good power for detecting true effects.'
                }
            ]
        },

        // ── Section 5: Practical A/B Testing Pitfalls ──
        {
            id: 'ch07-sec05',
            title: 'Practical A/B Testing Pitfalls',
            content: `<h2>Practical A/B Testing Pitfalls</h2>
<p>Even with solid statistical foundations, many A/B tests fail due to practical issues. Understanding these pitfalls is essential for trustworthy experimentation.</p>

<div class="env-block definition"><div class="env-title">Definition (Peeking Problem)</div><div class="env-body">
<p>The <strong>peeking problem</strong> occurs when experimenters continuously monitor results and stop the test as soon as significance is reached. Under continuous monitoring with fixed-sample tests:</p>
<p>- The true Type I error rate far exceeds the nominal \\(\\alpha\\)</p>
<p>- With enough peeking, a truly null effect will eventually appear significant</p>
<p>Under continuous monitoring at every observation, the effective false positive rate approaches 1 (certainty!) as \\(n \\to \\infty\\), even when the true effect is zero.</p>
</div></div>

<div class="env-block definition"><div class="env-title">Definition (Sample Ratio Mismatch)</div><div class="env-body">
<p>A <strong>sample ratio mismatch (SRM)</strong> occurs when the observed ratio of users in treatment vs. control differs significantly from the expected ratio. SRM is detected by a chi-squared test on the group counts.</p>
<p>Common causes: browser redirects, bot filtering applied differently, trigger conditions differing between variants, race conditions in assignment. SRM invalidates the experiment because it indicates non-random assignment.</p>
</div></div>

<div class="env-block remark"><div class="env-title">Remark (Novelty and Primacy Effects)</div><div class="env-body">
<p><strong>Novelty effect:</strong> Users interact more with a new feature simply because it is new. The initial lift fades over time. This is especially common for UI changes.</p>
<p><strong>Primacy effect:</strong> Users resist change and initially engage less with a new feature, but adapt over time. Common for navigation or workflow changes.</p>
<p>Both effects argue for running experiments longer and segmenting by user tenure (new vs. returning users).</p>
</div></div>

<div class="env-block remark"><div class="env-title">Remark (Interference Between Units)</div><div class="env-body">
<p>In marketplaces or social networks, treating one user can affect another's outcomes, violating SUTVA. Examples:</p>
<p>- A seller given a ranking boost takes clicks away from control sellers.</p>
<p>- A user shown viral content in treatment generates spillover engagement for their control-group friends.</p>
<p>This leads to biased effect estimates, typically <strong>underestimating</strong> the true total effect.</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (CUPED: Controlled-experiment Using Pre-Experiment Data)</div><div class="env-body">
<p>Variance reduction via pre-experiment covariates. Let \\(Y\\) be the outcome and \\(X\\) be a pre-experiment covariate (e.g., the same metric measured before the experiment). Define:</p>
\\[\\hat{Y}_{\\text{cv}} = Y - \\theta(X - \\bar{X})\\]
<p>where \\(\\theta = \\text{Cov}(Y, X) / \\text{Var}(X)\\). The variance of the adjusted estimator is:</p>
\\[\\text{Var}(\\hat{Y}_{\\text{cv}}) = \\text{Var}(Y)(1 - \\rho^2_{XY})\\]
<p>where \\(\\rho_{XY}\\) is the correlation between \\(X\\) and \\(Y\\). With \\(\\rho = 0.5\\), variance is reduced by 25%; with \\(\\rho = 0.8\\), by 64%. This is equivalent to increasing sample size by the same factor at zero marginal cost.</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-peeking"></div>`,
            visualizations: [
                {
                    id: 'ch07-viz-peeking',
                    title: 'Peeking Inflation Demo',
                    description: 'Demonstrates how continuous monitoring inflates false positive rates',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 80, originY: 360,
                            scale: 1
                        });

                        var nSims = 200;
                        var maxN = 300;
                        var alpha = 0.05;
                        var simResults = [];
                        var showPeek = true;

                        function runSimulations() {
                            simResults = [];
                            for (var s = 0; s < nSims; s++) {
                                // Simulate under the NULL (true effect = 0)
                                var controlSum = 0;
                                var treatSum = 0;
                                var controlSS = 0;
                                var treatSS = 0;
                                var path = [];
                                var peekSig = false;
                                var peekN = -1;
                                var finalSig = false;

                                for (var n = 1; n <= maxN; n++) {
                                    var yc = VizEngine.randomNormal(0, 1);
                                    var yt = VizEngine.randomNormal(0, 1);
                                    controlSum += yc;
                                    treatSum += yt;
                                    controlSS += yc * yc;
                                    treatSS += yt * yt;

                                    if (n >= 5) {
                                        var meanC = controlSum / n;
                                        var meanT = treatSum / n;
                                        var diff = meanT - meanC;
                                        var varC = Math.max(0.001, (controlSS - n * meanC * meanC) / (n - 1));
                                        var varT = Math.max(0.001, (treatSS - n * meanT * meanT) / (n - 1));
                                        var se = Math.sqrt((varC + varT) / n);
                                        var zStat = Math.abs(diff / se);
                                        var sig = zStat > 1.96;

                                        path.push({n: n, z: zStat, sig: sig});

                                        if (sig && !peekSig) {
                                            peekSig = true;
                                            peekN = n;
                                        }
                                    }
                                }

                                // Final test at maxN
                                if (path.length > 0) {
                                    finalSig = path[path.length - 1].sig;
                                }

                                simResults.push({
                                    path: path,
                                    peekSig: peekSig,
                                    peekN: peekN,
                                    finalSig: finalSig
                                });
                            }
                        }

                        runSimulations();

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var plotLeft = 80;
                            var plotRight = 670;
                            var plotTop = 70;
                            var plotBottom = 340;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('The Peeking Problem: ' + nSims + ' Simulated A/A Tests (True Effect = 0)', 375, 18);

                            // Count false positives
                            var peekFP = 0;
                            var finalFP = 0;
                            for (var s = 0; s < simResults.length; s++) {
                                if (simResults[s].peekSig) peekFP++;
                                if (simResults[s].finalSig) finalFP++;
                            }

                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillText(
                                'Peeking: ' + peekFP + '/' + nSims + ' false positives (' +
                                (100 * peekFP / nSims).toFixed(1) + '%)',
                                250, 42
                            );
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText(
                                'Fixed-sample: ' + finalFP + '/' + nSims + ' false positives (' +
                                (100 * finalFP / nSims).toFixed(1) + '%)',
                                520, 42
                            );

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotRight, plotBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotTop); ctx.lineTo(plotLeft, plotBottom); ctx.stroke();

                            // Y axis: |z-statistic|
                            var yMax = 5;
                            var yScale = plotH / yMax;

                            // Critical value line
                            var critY = plotBottom - 1.96 * yScale;
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 3]);
                            ctx.beginPath(); ctx.moveTo(plotLeft, critY); ctx.lineTo(plotRight, critY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('z = 1.96 (\u03B1 = 0.05)', plotRight + 3, critY);

                            // X labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var xl = 0; xl <= maxN; xl += 50) {
                                ctx.fillText(xl, plotLeft + xl / maxN * plotW, plotBottom + 4);
                            }
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Sample size per group', (plotLeft + plotRight) / 2, plotBottom + 18);

                            // Y labels
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yl = 0; yl <= yMax; yl++) {
                                var yy = plotBottom - yl * yScale;
                                ctx.fillText(yl, plotLeft - 5, yy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(plotLeft, yy); ctx.lineTo(plotRight, yy); ctx.stroke();
                            }
                            ctx.save();
                            ctx.translate(18, (plotTop + plotBottom) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('|z-statistic|', 0, 0);
                            ctx.restore();

                            // Draw simulation paths
                            var drawCount = Math.min(simResults.length, 100);
                            for (var si = 0; si < drawCount; si++) {
                                var sim = simResults[si];
                                var path = sim.path;
                                if (path.length < 2) continue;

                                var color = sim.peekSig ? viz.colors.red + '30' : viz.colors.blue + '15';
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 0.8;
                                ctx.beginPath();
                                for (var pi = 0; pi < path.length; pi += 3) {
                                    var px = plotLeft + path[pi].n / maxN * plotW;
                                    var py = plotBottom - Math.min(path[pi].z, yMax) * yScale;
                                    if (pi === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // Mark first crossing for peeking sims
                                if (sim.peekSig && showPeek) {
                                    var crossIdx = -1;
                                    for (var ci = 0; ci < path.length; ci++) {
                                        if (path[ci].sig) { crossIdx = ci; break; }
                                    }
                                    if (crossIdx >= 0) {
                                        var cx = plotLeft + path[crossIdx].n / maxN * plotW;
                                        var cy = plotBottom - Math.min(path[crossIdx].z, yMax) * yScale;
                                        ctx.fillStyle = viz.colors.red + '66';
                                        ctx.beginPath();
                                        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }
                            }

                            // Info text
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(
                                'Each line is one simulated A/A test. Red lines crossed the significance boundary at some point.',
                                375, plotBottom + 38
                            );
                        }

                        draw();

                        VizEngine.createButton(controls, 'Re-simulate', function() {
                            runSimulations(); draw();
                        });
                        VizEngine.createSlider(controls, 'Simulations', 50, 500, nSims, 50, function(v) {
                            nSims = Math.round(v); runSimulations(); draw();
                        });
                        VizEngine.createSlider(controls, 'Max sample size', 50, 1000, maxN, 50, function(v) {
                            maxN = Math.round(v); runSimulations(); draw();
                        });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch07-ex16',
                    type: 'multiple-choice',
                    question: 'An experimenter checks their A/B test every day and stops it as soon as p < 0.05. The true effect is zero. What happens to the false positive rate?',
                    options: [
                        'It stays at exactly 5%',
                        'It decreases because more data is accumulated',
                        'It increases well above 5%, potentially approaching 100% with enough checks',
                        'It depends on the sample size'
                    ],
                    correct: 2,
                    explanation: 'This is the peeking problem. Under continuous monitoring, random fluctuations will eventually produce a "significant" result even when the true effect is zero. The more often you peek, the higher the effective false positive rate. With unlimited peeking, it approaches 100%.'
                },
                {
                    id: 'ch07-ex17',
                    type: 'multiple-choice',
                    question: 'An A/B test shows a 50.2%/49.8% split instead of the expected 50/50. A chi-squared test gives p = 0.001. This is called:',
                    options: [
                        'A treatment effect',
                        'A sample ratio mismatch (SRM)',
                        'A multiple testing error',
                        'A novelty effect'
                    ],
                    correct: 1,
                    explanation: 'A statistically significant deviation from the expected assignment ratio is a Sample Ratio Mismatch (SRM). Even a tiny absolute difference can be significant with large sample sizes. SRM signals a problem with the randomization mechanism and invalidates the experiment.'
                },
                {
                    id: 'ch07-ex18',
                    type: 'multiple-choice',
                    question: 'CUPED reduces variance by using pre-experiment data. If the correlation between the pre-experiment covariate X and outcome Y is rho = 0.7, by what fraction is variance reduced?',
                    options: [
                        '30%',
                        '49%',
                        '51%',
                        '70%'
                    ],
                    correct: 1,
                    explanation: 'CUPED reduces variance by a factor of (1 - rho^2). With rho = 0.7: reduction = rho^2 = 0.49, so 49% of the variance is eliminated. The remaining variance is 51% of the original.'
                },
                {
                    id: 'ch07-ex19',
                    type: 'multiple-choice',
                    question: 'Which approach is the most appropriate solution to the peeking problem in an always-on experimentation platform?',
                    options: [
                        'Use a smaller alpha like 0.001',
                        'Only run experiments on weekdays',
                        'Use sequential testing methods with always-valid p-values',
                        'Increase the sample size to reduce noise'
                    ],
                    correct: 2,
                    explanation: 'Sequential testing methods (like mSPRT or alpha spending functions) provide valid inference at any stopping time. Simply using a smaller alpha delays the problem but does not eliminate it. Larger samples or restricted timing do not address the fundamental issue of multiple testing over time.'
                }
            ]
        }
    ]
});
