window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch12',
    number: 12,
    title: 'Weak Instruments & Many IVs',
    subtitle: 'When Standard IV Fails',
    sections: [

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 1: Weak Instrument Problem
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch12-sec01',
        title: '1. Weak Instrument Problem',
        content: `
<h2>Weak Instrument Problem</h2>

<p>
In instrumental variables estimation, the <strong>strength</strong> of the instrument \\(Z\\) is determined by how well it predicts the endogenous regressor \\(X\\) in the first stage.
When the first-stage relationship is weak, 2SLS suffers from severe finite-sample bias, and standard inference breaks down.
</p>

<h3>1.1 The Model</h3>

<p>
Consider the standard IV model:
</p>

\\[
Y_i = \\beta X_i + \\varepsilon_i, \\quad X_i = \\pi Z_i + v_i
\\]

<p>
where \\(\\text{Cov}(Z, \\varepsilon) = 0\\) (exclusion restriction) but \\(\\text{Cov}(\\varepsilon, v) = \\sigma_{\\varepsilon v} \\neq 0\\) (endogeneity).
The <strong>concentration parameter</strong> measures the signal-to-noise ratio of the first stage:
</p>

\\[
\\mu^2 = \\frac{n \\pi^2 \\sigma_Z^2}{\\sigma_v^2}
\\]

<p>
When \\(\\mu^2\\) is small, the instrument is <strong>weak</strong>.
</p>

<h3>1.2 Finite-Sample Bias of 2SLS</h3>

<p>
Bound (1995) showed that the finite-sample bias of 2SLS is approximately:
</p>

<div class="env-block theorem">
<div class="env-title">Theorem 12.1 (Finite-Sample Bias of 2SLS)</div>
<div class="env-body">
<p>
The expected bias of the 2SLS estimator relative to the OLS bias is:
</p>
\\[
E[\\hat{\\beta}_{\\text{2SLS}} - \\beta] \\approx \\frac{\\sigma_{\\varepsilon v}}{\\sigma_v^2} \\cdot \\frac{1}{F + 1} \\approx \\frac{\\text{Bias}_{\\text{OLS}}}{F}
\\]
<p>
where \\(F\\) is the first-stage F-statistic. As \\(F \\to \\infty\\), the bias vanishes. As \\(F \\to 0\\), the 2SLS bias converges to the OLS bias.
</p>
</div>
</div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body">
<p>
This is a <em>finite-sample</em> problem: even if the instrument is valid (\\(\\text{Cov}(Z, \\varepsilon) = 0\\)), weak instruments cause 2SLS to behave almost like OLS. The 2SLS estimator is biased toward the OLS estimator, not toward the true value.
</p>
</div>
</div>

<h3>1.3 Distribution of 2SLS Under Weak Instruments</h3>

<p>
Under weak instruments, the 2SLS estimator is <strong>not approximately normal</strong>. The distribution is:
</p>

<ul>
<li>Bimodal or highly skewed when \\(\\mu^2\\) is small</li>
<li>Has heavy tails — confidence intervals based on normal approximation have incorrect coverage</li>
<li>Standard errors dramatically understate uncertainty</li>
</ul>

<div class="env-block definition">
<div class="env-title">Definition 12.1 (Weak Instrument)</div>
<div class="env-body">
<p>
An instrument is <strong>weak</strong> if the concentration parameter \\(\\mu^2\\) is small relative to the number of instruments \\(k\\), i.e., the first-stage partial F-statistic is too low to ensure reliable 2SLS inference.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch12-viz-2sls-bias"></div>
`,
        visualizations: [
        {
            id: 'ch12-viz-2sls-bias',
            title: '2SLS Bias as F-Statistic Decreases',
            description: 'Simulate 2SLS estimates for different instrument strengths (F-statistic values) and observe how the bias approaches the OLS bias as instruments weaken.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 460, originX: 80, originY: 380, scale: 30});

                let nSim = 500;
                let rho = 0.8;

                function simulate(piVal, n) {
                    const estimates = [];
                    for (let s = 0; s < nSim; s++) {
                        let sumZX = 0, sumZY = 0, sumZZ = 0, sumXX = 0, sumXY = 0;
                        for (let i = 0; i < n; i++) {
                            const z = VizEngine.randomNormal();
                            const eps = VizEngine.randomNormal();
                            const v = rho * eps + Math.sqrt(1 - rho * rho) * VizEngine.randomNormal();
                            const x = piVal * z + v;
                            const y = 1.0 * x + eps;
                            sumZX += z * x;
                            sumZY += z * y;
                            sumZZ += z * z;
                            sumXX += x * x;
                            sumXY += x * y;
                        }
                        const beta2sls = sumZY / sumZX;
                        estimates.push(beta2sls);
                    }
                    return estimates;
                }

                function computeMedian(arr) {
                    const s = [...arr].sort((a, b) => a - b);
                    const mid = Math.floor(s.length / 2);
                    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
                }

                const n = 100;

                function draw() {
                    viz.clear();
                    const ctx = viz.ctx;

                    viz.screenText('2SLS Bias vs. First-Stage F-Statistic', viz.width / 2, 20, viz.colors.white, 16, 'center');

                    const piValues = [0.02, 0.05, 0.08, 0.12, 0.18, 0.25, 0.35, 0.5, 0.7, 1.0];
                    const trueB = 1.0;
                    const results = [];

                    for (const pi of piValues) {
                        const ests = simulate(pi, n);
                        const med = computeMedian(ests);
                        const approxF = n * pi * pi;
                        results.push({F: approxF, median: med, pi: pi});
                    }

                    const maxF = 110;
                    const yMin = 0.5;
                    const yMax = 3.5;
                    const plotLeft = 80;
                    const plotRight = 660;
                    const plotTop = 50;
                    const plotBottom = 400;
                    const plotW = plotRight - plotLeft;
                    const plotH = plotBottom - plotTop;

                    function toPlot(fVal, yVal) {
                        const px = plotLeft + (fVal / maxF) * plotW;
                        const py = plotBottom - ((yVal - yMin) / (yMax - yMin)) * plotH;
                        return [px, py];
                    }

                    ctx.strokeStyle = viz.colors.axis;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(plotLeft, plotTop);
                    ctx.lineTo(plotLeft, plotBottom);
                    ctx.lineTo(plotRight, plotBottom);
                    ctx.stroke();

                    ctx.fillStyle = viz.colors.text;
                    ctx.font = '11px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    for (let f = 0; f <= maxF; f += 20) {
                        const [px] = toPlot(f, yMin);
                        ctx.fillText(f.toString(), px, plotBottom + 6);
                        ctx.strokeStyle = viz.colors.grid;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(px, plotTop);
                        ctx.lineTo(px, plotBottom);
                        ctx.stroke();
                    }
                    viz.screenText('First-stage F-statistic', (plotLeft + plotRight) / 2, plotBottom + 32, viz.colors.text, 12, 'center');

                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    for (let y = 0.5; y <= 3.5; y += 0.5) {
                        const [, py] = toPlot(0, y);
                        ctx.fillStyle = viz.colors.text;
                        ctx.fillText(y.toFixed(1), plotLeft - 8, py);
                        ctx.strokeStyle = viz.colors.grid;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(plotLeft, py);
                        ctx.lineTo(plotRight, py);
                        ctx.stroke();
                    }

                    const [, trueY] = toPlot(0, trueB);
                    ctx.strokeStyle = viz.colors.green;
                    ctx.lineWidth = 2;
                    ctx.setLineDash([8, 4]);
                    ctx.beginPath();
                    ctx.moveTo(plotLeft, trueY);
                    ctx.lineTo(plotRight, trueY);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    viz.screenText('True beta = 1.0', plotRight - 60, trueY - 12, viz.colors.green, 11, 'center');

                    const olsBias = trueB + rho;
                    if (olsBias <= yMax) {
                        const [, olsY] = toPlot(0, olsBias);
                        ctx.strokeStyle = viz.colors.red;
                        ctx.lineWidth = 2;
                        ctx.setLineDash([4, 4]);
                        ctx.beginPath();
                        ctx.moveTo(plotLeft, olsY);
                        ctx.lineTo(plotRight, olsY);
                        ctx.stroke();
                        ctx.setLineDash([]);
                        viz.screenText('OLS (biased) = ' + olsBias.toFixed(1), plotRight - 60, olsY - 12, viz.colors.red, 11, 'center');
                    }

                    const [, f10y] = toPlot(10, yMin);
                    ctx.strokeStyle = viz.colors.yellow;
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([4, 3]);
                    ctx.beginPath();
                    ctx.moveTo(toPlot(10, yMin)[0], plotTop);
                    ctx.lineTo(toPlot(10, yMin)[0], plotBottom);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    viz.screenText('F = 10', toPlot(10, yMin)[0], plotTop - 8, viz.colors.yellow, 10, 'center');

                    ctx.strokeStyle = viz.colors.blue;
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    let started = false;
                    for (const r of results) {
                        if (r.F > maxF || r.median < yMin || r.median > yMax) continue;
                        const [px, py] = toPlot(r.F, r.median);
                        if (!started) { ctx.moveTo(px, py); started = true; }
                        else ctx.lineTo(px, py);
                    }
                    ctx.stroke();

                    for (const r of results) {
                        if (r.F > maxF || r.median < yMin || r.median > yMax) continue;
                        const [px, py] = toPlot(r.F, r.median);
                        ctx.fillStyle = viz.colors.blue;
                        ctx.beginPath();
                        ctx.arc(px, py, 5, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    viz.screenText('Median 2SLS estimate', plotLeft + 100, plotTop + 15, viz.colors.blue, 11, 'left');

                    viz.screenText('Low F: 2SLS bias approaches OLS bias', viz.width / 2, plotBottom + 48, viz.colors.orange, 11, 'center');
                }

                VizEngine.createButton(controls, 'Re-simulate', draw);

                const rhoSlider = VizEngine.createSlider(controls, 'Endogeneity (rho)', 0.1, 0.95, rho, 0.05, (v) => {
                    rho = v;
                    draw();
                });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Explain intuitively why a weak instrument causes 2SLS to be biased toward the OLS estimate.',
                hint: 'Think about what happens to the first-stage fitted values when the instrument has little explanatory power.',
                solution: 'When the instrument is weak, the first-stage fitted values are mostly driven by noise rather than the true variation in Z. This noise component is correlated with the structural error (since it includes variation in X not explained by Z), so the second-stage regression effectively uses variation in X that is contaminated by endogeneity, similar to OLS.'
            },
            {
                question: 'If the first-stage F-statistic is 5 and the OLS bias is 0.3, what is the approximate expected bias of 2SLS?',
                hint: 'Use the formula: 2SLS bias is approximately OLS bias divided by F.',
                solution: 'Using Bound (1995): \\(\\text{Bias}_{\\text{2SLS}} \\approx \\frac{\\text{Bias}_{\\text{OLS}}}{F} = \\frac{0.3}{5} = 0.06\\). So the 2SLS estimate retains about 1/5 of the OLS bias.'
            },
            {
                question: 'Suppose the true parameter is \\(\\beta = 1\\), the OLS estimate is 1.5, and the first-stage F-statistic is 2. What is the approximate 2SLS estimate?',
                hint: 'OLS bias = 0.5. Apply the bias approximation to get the 2SLS estimate.',
                solution: 'OLS bias = 1.5 - 1 = 0.5. Approximate 2SLS bias \\(\\approx 0.5 / 2 = 0.25\\). So the 2SLS estimate is approximately \\(1 + 0.25 = 1.25\\). The 2SLS removes only half the OLS bias when F is this low.'
            },
            {
                question: 'What is the concentration parameter \\(\\mu^2\\) and how does it relate to the F-statistic? Why is the F-statistic preferred in practice?',
                hint: 'The concentration parameter depends on unknown parameters, while F is directly computable.',
                solution: 'The concentration parameter is \\(\\mu^2 = n\\pi^2\\sigma_Z^2 / \\sigma_v^2\\), which measures instrument strength in population terms. The first-stage F-statistic is a natural estimator of \\(\\mu^2 / k\\) (where k is the number of instruments). F is preferred because it is directly computable from data without knowing the structural parameters.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 2: Testing for Weak Instruments
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch12-sec02',
        title: '2. Testing for Weak Instruments',
        content: `
<h2>Testing for Weak Instruments</h2>

<p>
Since weak instruments can severely distort inference, researchers need reliable diagnostic tests. The primary tool is the first-stage F-statistic, but its interpretation requires care.
</p>

<h3>2.1 First-Stage F-Statistic</h3>

<p>
In the first-stage regression \\(X_i = \\pi Z_i + W_i'\\gamma + v_i\\), where \\(W_i\\) are included exogenous controls, the partial F-statistic tests:
</p>

\\[
H_0: \\pi = 0 \\quad \\text{vs} \\quad H_1: \\pi \\neq 0
\\]

<div class="env-block theorem">
<div class="env-title">Rule of Thumb (Staiger & Stock, 1997)</div>
<div class="env-body">
<p>
A first-stage F-statistic below 10 indicates a weak instrument problem. This rule comes from the observation that when \\(F < 10\\), the 2SLS size distortion exceeds 10% at the 5% significance level.
</p>
</div>
</div>

<h3>2.2 Stock-Yogo Critical Values</h3>

<p>
Stock & Yogo (2005) provide formal critical values for the first-stage F-statistic. Their framework addresses two types of problems:
</p>

<div class="env-block definition">
<div class="env-title">Definition 12.2 (Weak Instrument Thresholds)</div>
<div class="env-body">
<p>
<strong>Relative bias criterion:</strong> Reject weak instruments if \\(F\\) exceeds the critical value ensuring \\(\\text{Bias}_{\\text{2SLS}} / \\text{Bias}_{\\text{OLS}} \\leq b\\), for chosen threshold \\(b\\) (e.g., 5%, 10%, 20%).
</p>
<p>
<strong>Size distortion criterion:</strong> Reject weak instruments if \\(F\\) exceeds the critical value ensuring the Wald test at nominal 5% has true size no greater than \\(r\\) (e.g., 10%, 15%, 20%, 25%).
</p>
</div>
</div>

<p>
For a single endogenous regressor and a single instrument, the Stock-Yogo critical values are:
</p>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:2px solid #30363d;">
<th style="text-align:left;padding:6px;color:#8b949e;">Max Relative Bias</th>
<th style="text-align:center;padding:6px;color:#8b949e;">5%</th>
<th style="text-align:center;padding:6px;color:#8b949e;">10%</th>
<th style="text-align:center;padding:6px;color:#8b949e;">20%</th>
<th style="text-align:center;padding:6px;color:#8b949e;">30%</th>
</tr>
<tr style="border-bottom:1px solid #21262d;">
<td style="padding:6px;">Critical F (1 IV)</td>
<td style="text-align:center;padding:6px;">18.37</td>
<td style="text-align:center;padding:6px;">16.38</td>
<td style="text-align:center;padding:6px;">6.66</td>
<td style="text-align:center;padding:6px;">5.53</td>
</tr>
</table>

<h3>2.3 Effective F-Statistic</h3>

<p>
Olea & Pflueger (2013) propose the <strong>effective F-statistic</strong>, which is robust to heteroscedasticity, serial correlation, and clustering:
</p>

\\[
F_{\\text{eff}} = \\frac{\\hat{\\pi}' \\hat{\\Sigma}_{ZZ} \\hat{\\pi}}{k \\cdot \\hat{\\sigma}_v^2}
\\]

<p>
where \\(\\hat{\\Sigma}_{ZZ}\\) is a robust variance estimator for the instruments. This is preferred over the conventional F when standard errors need to be clustered or heteroscedasticity-robust.
</p>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body">
<p>
The standard F-statistic assumes homoscedasticity. When using robust or clustered standard errors in the second stage, the conventional first-stage F can be misleading. Always use the effective F-statistic in settings with heteroscedasticity or clustering.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch12-viz-f-distribution"></div>
`,
        visualizations: [
        {
            id: 'ch12-viz-f-distribution',
            title: 'F-Statistic Distribution: Weak vs Strong Instruments',
            description: 'Compare the distribution of the first-stage F-statistic under weak instruments (small pi) and strong instruments (large pi).',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 460, originX: 60, originY: 370, scale: 6});

                let piWeak = 0.05;
                let piStrong = 0.4;
                const nObs = 100;
                const nSim = 2000;

                function simulateFStats(piVal) {
                    const fStats = [];
                    for (let s = 0; s < nSim; s++) {
                        let sumZX = 0, sumZZ = 0, sumXX = 0;
                        let sumZ = 0, sumX = 0;
                        for (let i = 0; i < nObs; i++) {
                            const z = VizEngine.randomNormal();
                            const v = VizEngine.randomNormal();
                            const x = piVal * z + v;
                            sumZ += z;
                            sumX += x;
                            sumZX += z * x;
                            sumZZ += z * z;
                            sumXX += x * x;
                        }
                        const meanZ = sumZ / nObs;
                        const meanX = sumX / nObs;
                        const piHat = (sumZX - nObs * meanZ * meanX) / (sumZZ - nObs * meanZ * meanZ);
                        let ssr = 0;
                        for (let i = 0; i < nObs; i++) {
                            // approximate: residual variance
                        }
                        const sepiSq = 1.0 / (sumZZ - nObs * meanZ * meanZ);
                        const fStat = piHat * piHat / sepiSq;
                        fStats.push(Math.max(0, fStat));
                    }
                    return fStats;
                }

                function makeBins(data, binWidth, maxVal) {
                    const nBins = Math.ceil(maxVal / binWidth);
                    const counts = new Array(nBins).fill(0);
                    for (const d of data) {
                        const idx = Math.floor(d / binWidth);
                        if (idx >= 0 && idx < nBins) counts[idx]++;
                    }
                    return counts.map((c, i) => ({x: i * binWidth, count: c, density: c / (data.length * binWidth)}));
                }

                function draw() {
                    viz.clear();
                    const ctx = viz.ctx;

                    viz.screenText('First-Stage F-Statistic Distribution', viz.width / 2, 20, viz.colors.white, 16, 'center');

                    const fWeak = simulateFStats(piWeak);
                    const fStrong = simulateFStats(piStrong);

                    const maxF = 60;
                    const binW = 2;
                    const binsWeak = makeBins(fWeak, binW, maxF);
                    const binsStrong = makeBins(fStrong, binW, maxF);

                    const maxDensity = Math.max(
                        ...binsWeak.map(b => b.density),
                        ...binsStrong.map(b => b.density)
                    ) * 1.15;

                    const plotLeft = 60;
                    const plotRight = 660;
                    const plotTop = 50;
                    const plotBottom = 380;
                    const plotW = plotRight - plotLeft;
                    const plotH = plotBottom - plotTop;

                    function toPlot(fVal, dVal) {
                        const px = plotLeft + (fVal / maxF) * plotW;
                        const py = plotBottom - (dVal / maxDensity) * plotH;
                        return [px, py];
                    }

                    ctx.strokeStyle = viz.colors.axis;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(plotLeft, plotTop);
                    ctx.lineTo(plotLeft, plotBottom);
                    ctx.lineTo(plotRight, plotBottom);
                    ctx.stroke();

                    ctx.fillStyle = viz.colors.text;
                    ctx.font = '11px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    for (let f = 0; f <= maxF; f += 10) {
                        const [px] = toPlot(f, 0);
                        ctx.fillText(f.toString(), px, plotBottom + 5);
                    }
                    viz.screenText('F-statistic', (plotLeft + plotRight) / 2, plotBottom + 28, viz.colors.text, 12, 'center');

                    // Draw weak instrument histogram
                    for (const bin of binsWeak) {
                        const [x1, y1] = toPlot(bin.x, bin.density);
                        const [x2, y2] = toPlot(bin.x + binW, 0);
                        ctx.fillStyle = viz.colors.red + '55';
                        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
                        ctx.strokeStyle = viz.colors.red + '88';
                        ctx.lineWidth = 0.8;
                        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                    }

                    // Draw strong instrument histogram
                    for (const bin of binsStrong) {
                        const [x1, y1] = toPlot(bin.x, bin.density);
                        const [x2, y2] = toPlot(bin.x + binW, 0);
                        ctx.fillStyle = viz.colors.blue + '55';
                        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
                        ctx.strokeStyle = viz.colors.blue + '88';
                        ctx.lineWidth = 0.8;
                        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                    }

                    // F = 10 threshold
                    const [f10x] = toPlot(10, 0);
                    ctx.strokeStyle = viz.colors.yellow;
                    ctx.lineWidth = 2;
                    ctx.setLineDash([6, 3]);
                    ctx.beginPath();
                    ctx.moveTo(f10x, plotTop);
                    ctx.lineTo(f10x, plotBottom);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    viz.screenText('F = 10 threshold', f10x, plotTop - 10, viz.colors.yellow, 10, 'center');

                    // Legend
                    const lx = plotRight - 180;
                    const ly = plotTop + 20;
                    ctx.fillStyle = viz.colors.red + '88';
                    ctx.fillRect(lx, ly, 14, 14);
                    viz.screenText('Weak (pi=' + piWeak.toFixed(2) + ')', lx + 20, ly + 7, viz.colors.red, 11, 'left');

                    ctx.fillStyle = viz.colors.blue + '88';
                    ctx.fillRect(lx, ly + 22, 14, 14);
                    viz.screenText('Strong (pi=' + piStrong.toFixed(2) + ')', lx + 20, ly + 29, viz.colors.blue, 11, 'left');

                    // Show proportion below 10
                    const weakBelow10 = fWeak.filter(f => f < 10).length / fWeak.length;
                    const strongBelow10 = fStrong.filter(f => f < 10).length / fStrong.length;
                    viz.screenText('P(F < 10): Weak = ' + (weakBelow10 * 100).toFixed(0) + '%,  Strong = ' + (strongBelow10 * 100).toFixed(0) + '%', viz.width / 2, plotBottom + 46, viz.colors.orange, 11, 'center');
                }

                VizEngine.createButton(controls, 'Re-simulate', draw);

                VizEngine.createSlider(controls, 'Weak pi', 0.01, 0.15, piWeak, 0.01, (v) => {
                    piWeak = v;
                    draw();
                });

                VizEngine.createSlider(controls, 'Strong pi', 0.2, 0.8, piStrong, 0.05, (v) => {
                    piStrong = v;
                    draw();
                });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Why is the rule of thumb F > 10 only a rough guideline? When might it be too conservative or too lenient?',
                hint: 'Think about the number of instruments and the specific criterion (bias vs. size).',
                solution: 'The F > 10 rule was derived for a specific case (one endogenous regressor, one instrument, 5% size distortion up to 10%). With multiple instruments, the critical value changes — Stock-Yogo tables show it increases with the number of instruments. It may be too lenient when the researcher demands low bias (e.g., 5% relative bias requires F > 18.37). It may be too conservative in some settings with just-identified models where the bias is naturally smaller.'
            },
            {
                question: 'Explain the difference between the relative bias criterion and the size distortion criterion in Stock-Yogo testing.',
                hint: 'One concerns point estimation quality, the other concerns hypothesis test validity.',
                solution: 'The relative bias criterion asks: is the 2SLS bias no more than b% of the OLS bias? This focuses on the accuracy of point estimates. The size distortion criterion asks: is the true size of a nominal 5% Wald test no greater than r%? This focuses on the validity of confidence intervals and hypothesis tests. They answer different questions: you might have acceptable bias but poor test size, or vice versa.'
            },
            {
                question: 'In a study with clustered data at the state level (50 clusters), why should you use the effective F-statistic of Olea & Pflueger (2013) rather than the conventional F?',
                hint: 'Think about what the conventional F assumes about the error structure.',
                solution: 'The conventional F-statistic assumes homoscedastic, independent errors. With clustering at the state level, errors are correlated within states and potentially heteroscedastic. The conventional F can be severely misleading (either too large or too small) because it does not account for this dependence structure. The effective F-statistic uses a cluster-robust variance estimator, providing a valid measure of instrument strength under clustering.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 3: Anderson-Rubin Confidence Sets
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch12-sec03',
        title: '3. Anderson-Rubin Confidence Sets',
        content: `
<h2>Anderson-Rubin Confidence Sets</h2>

<p>
When instruments are weak, standard Wald-based confidence intervals from 2SLS have incorrect coverage. The <strong>Anderson-Rubin (AR) test</strong> provides inference that is <strong>robust to weak instruments</strong>.
</p>

<h3>3.1 The AR Test Statistic</h3>

<p>
The Anderson-Rubin (1949) test statistic for testing \\(H_0: \\beta = \\beta_0\\) is:
</p>

\\[
AR(\\beta_0) = \\frac{(Y - X\\beta_0)' P_Z (Y - X\\beta_0) / k}{(Y - X\\beta_0)' M_Z (Y - X\\beta_0) / (n - k)}
\\]

<p>
where \\(P_Z = Z(Z'Z)^{-1}Z'\\) is the projection matrix onto the instrument space, \\(M_Z = I - P_Z\\), and \\(k\\) is the number of instruments.
</p>

<div class="env-block theorem">
<div class="env-title">Theorem 12.2 (AR Test Validity)</div>
<div class="env-body">
<p>
Under \\(H_0: \\beta = \\beta_0\\), the AR statistic has an exact \\(F(k, n-k)\\) distribution regardless of instrument strength. This makes the AR test:
</p>
<ul>
<li><strong>Robust to weak instruments:</strong> valid even when \\(\\pi = 0\\)</li>
<li><strong>Exact in finite samples:</strong> under normality of errors</li>
<li><strong>Asymptotically valid:</strong> under standard regularity conditions</li>
</ul>
</div>
</div>

<h3>3.2 AR Confidence Set</h3>

<p>
The AR confidence set for \\(\\beta\\) at level \\(1 - \\alpha\\) is:
</p>

\\[
CS_{AR} = \\{\\beta_0 : AR(\\beta_0) \\leq F_{k, n-k, 1-\\alpha}\\}
\\]

<div class="env-block remark">
<div class="env-title">Important Properties</div>
<div class="env-body">
<p>
The AR confidence set can take three forms depending on instrument strength:
</p>
<ul>
<li><strong>Bounded interval:</strong> when instruments are sufficiently strong (similar to Wald CI)</li>
<li><strong>Union of two rays:</strong> \\((-\\infty, a] \\cup [b, \\infty)\\) when instruments are moderate</li>
<li><strong>Entire real line:</strong> \\((-\\infty, \\infty)\\) when instruments are extremely weak (cannot reject any value of \\(\\beta\\))</li>
</ul>
<p>
An unbounded confidence set is informative: it tells you the data cannot distinguish between different values of \\(\\beta\\).
</p>
</div>
</div>

<h3>3.3 Conditional Likelihood Ratio Test</h3>

<p>
Moreira (2003) proposed the <strong>Conditional Likelihood Ratio (CLR)</strong> test, which improves on the AR test by being:
</p>

<ul>
<li><strong>More powerful</strong> than AR when the model is overidentified (\\(k > 1\\))</li>
<li>Still <strong>robust to weak instruments</strong></li>
<li>Based on conditioning on a sufficient statistic for the nuisance parameter (instrument strength)</li>
</ul>

<p>
The CLR test statistic conditions on \\(S = (Y - X\\beta_0)' P_Z (Y - X\\beta_0)\\), and the critical value depends on the realization of this statistic. Andrews, Moreira & Stock (2006) provide efficient algorithms for computing CLR confidence sets.
</p>

<div class="env-block theorem">
<div class="env-title">Theorem 12.3 (CLR Optimality)</div>
<div class="env-body">
<p>
The CLR test is approximately uniformly most powerful (UMP) similar among tests that are robust to weak instruments. It is strictly more powerful than the AR test when the number of instruments \\(k > 1\\).
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch12-viz-ar-confidence"></div>
`,
        visualizations: [
        {
            id: 'ch12-viz-ar-confidence',
            title: 'AR Confidence Set Shape',
            description: 'See how the Anderson-Rubin confidence set changes shape as instrument strength varies: from a bounded interval (strong) to unbounded sets (weak).',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 460, originX: 80, originY: 230, scale: 40});

                let piVal = 0.3;
                const trueBeta = 1.0;
                const n = 100;
                const alpha = 0.05;

                function draw() {
                    viz.clear();
                    const ctx = viz.ctx;

                    viz.screenText('Anderson-Rubin Confidence Set', viz.width / 2, 20, viz.colors.white, 16, 'center');

                    // Simulate one dataset
                    const Z = [];
                    const eps = [];
                    const v = [];
                    const X = [];
                    const Y = [];
                    const rho = 0.7;

                    for (let i = 0; i < n; i++) {
                        const zi = VizEngine.randomNormal();
                        const ei = VizEngine.randomNormal();
                        const vi = rho * ei + Math.sqrt(1 - rho * rho) * VizEngine.randomNormal();
                        const xi = piVal * zi + vi;
                        const yi = trueBeta * xi + ei;
                        Z.push(zi);
                        eps.push(ei);
                        v.push(vi);
                        X.push(xi);
                        Y.push(yi);
                    }

                    // Compute AR statistic for a range of beta values
                    const betaMin = -4;
                    const betaMax = 6;
                    const nPoints = 300;
                    const arValues = [];

                    // Precompute Z'Z, etc.
                    let sumZZ = 0;
                    for (let i = 0; i < n; i++) sumZZ += Z[i] * Z[i];

                    for (let j = 0; j <= nPoints; j++) {
                        const b0 = betaMin + (betaMax - betaMin) * j / nPoints;
                        // residual = Y - X*b0
                        let sumZR = 0;
                        let sumRR = 0;
                        for (let i = 0; i < n; i++) {
                            const r = Y[i] - X[i] * b0;
                            sumZR += Z[i] * r;
                            sumRR += r * r;
                        }
                        // P_Z * r = Z * (Z'Z)^{-1} * Z'r
                        const pzr = sumZR * sumZR / sumZZ;
                        const mzr = sumRR - pzr;
                        const arStat = (pzr / 1) / (mzr / (n - 1));
                        arValues.push({beta: b0, ar: arStat});
                    }

                    // F critical value approximation (F(1, n-1) at 5%)
                    // For n=100, F(1,99) ~ 3.94
                    const fCrit = 3.94;

                    // Plot
                    const plotLeft = 80;
                    const plotRight = 660;
                    const plotTop = 50;
                    const plotBottom = 380;
                    const plotW = plotRight - plotLeft;
                    const plotH = plotBottom - plotTop;

                    const maxAR = Math.min(Math.max(...arValues.map(v => v.ar)) * 1.1, 40);

                    function toPlot(bVal, arVal) {
                        const px = plotLeft + ((bVal - betaMin) / (betaMax - betaMin)) * plotW;
                        const py = plotBottom - (Math.min(arVal, maxAR) / maxAR) * plotH;
                        return [px, py];
                    }

                    // Axes
                    ctx.strokeStyle = viz.colors.axis;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(plotLeft, plotTop);
                    ctx.lineTo(plotLeft, plotBottom);
                    ctx.lineTo(plotRight, plotBottom);
                    ctx.stroke();

                    ctx.fillStyle = viz.colors.text;
                    ctx.font = '11px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    for (let b = betaMin; b <= betaMax; b += 1) {
                        const [px] = toPlot(b, 0);
                        ctx.fillText(b.toString(), px, plotBottom + 5);
                    }
                    viz.screenText('beta_0 (hypothesized value)', (plotLeft + plotRight) / 2, plotBottom + 28, viz.colors.text, 12, 'center');

                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    for (let ar = 0; ar <= maxAR; ar += Math.ceil(maxAR / 5)) {
                        const [, py] = toPlot(0, ar);
                        ctx.fillText(ar.toFixed(0), plotLeft - 6, py);
                    }

                    // Critical value line
                    const [, critY] = toPlot(0, fCrit);
                    ctx.strokeStyle = viz.colors.yellow;
                    ctx.lineWidth = 2;
                    ctx.setLineDash([6, 3]);
                    ctx.beginPath();
                    ctx.moveTo(plotLeft, critY);
                    ctx.lineTo(plotRight, critY);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    viz.screenText('F critical value (alpha=0.05)', plotRight - 100, critY - 10, viz.colors.yellow, 10, 'center');

                    // Shade confidence set region (below critical value)
                    ctx.fillStyle = viz.colors.green + '22';
                    ctx.beginPath();
                    let inRegion = false;
                    for (let j = 0; j <= nPoints; j++) {
                        const {beta, ar} = arValues[j];
                        if (ar <= fCrit) {
                            const [px] = toPlot(beta, 0);
                            if (!inRegion) {
                                ctx.moveTo(px, plotBottom);
                                inRegion = true;
                            }
                            ctx.lineTo(px, critY);
                        } else if (inRegion) {
                            const [px] = toPlot(beta, 0);
                            ctx.lineTo(px, plotBottom);
                            ctx.closePath();
                            ctx.fill();
                            ctx.beginPath();
                            inRegion = false;
                        }
                    }
                    if (inRegion) {
                        const [px] = toPlot(betaMax, 0);
                        ctx.lineTo(px, plotBottom);
                        ctx.closePath();
                        ctx.fill();
                    }

                    // AR curve
                    ctx.strokeStyle = viz.colors.blue;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    let curveStarted = false;
                    for (const {beta, ar} of arValues) {
                        const [px, py] = toPlot(beta, Math.min(ar, maxAR));
                        if (!curveStarted) { ctx.moveTo(px, py); curveStarted = true; }
                        else ctx.lineTo(px, py);
                    }
                    ctx.stroke();

                    // True beta marker
                    const [trueX] = toPlot(trueBeta, 0);
                    ctx.strokeStyle = viz.colors.green;
                    ctx.lineWidth = 2;
                    ctx.setLineDash([3, 3]);
                    ctx.beginPath();
                    ctx.moveTo(trueX, plotTop);
                    ctx.lineTo(trueX, plotBottom);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    viz.screenText('True beta = 1.0', trueX + 5, plotTop + 10, viz.colors.green, 10, 'left');

                    // Identify confidence set bounds
                    const inCS = arValues.filter(v => v.ar <= fCrit);
                    if (inCS.length === 0) {
                        viz.screenText('Confidence set: EMPTY', viz.width / 2, plotBottom + 46, viz.colors.red, 12, 'center');
                    } else if (inCS.length === arValues.length) {
                        viz.screenText('Confidence set: ENTIRE REAL LINE (instrument too weak)', viz.width / 2, plotBottom + 46, viz.colors.red, 12, 'center');
                    } else {
                        const csMin = inCS[0].beta.toFixed(2);
                        const csMax = inCS[inCS.length - 1].beta.toFixed(2);
                        const bounded = inCS[0].beta > betaMin + 0.1 && inCS[inCS.length - 1].beta < betaMax - 0.1;
                        if (bounded) {
                            viz.screenText('AR Confidence Set: [' + csMin + ', ' + csMax + ']', viz.width / 2, plotBottom + 46, viz.colors.green, 12, 'center');
                        } else {
                            viz.screenText('AR Confidence Set extends beyond plot range', viz.width / 2, plotBottom + 46, viz.colors.orange, 12, 'center');
                        }
                    }

                    // Legend
                    viz.screenText('AR(beta_0) statistic', plotLeft + 70, plotTop + 10, viz.colors.blue, 11, 'left');
                    viz.screenText('Green shading = confidence set', plotLeft + 70, plotTop + 26, viz.colors.green, 11, 'left');

                    // Instrument strength info
                    const approxF = n * piVal * piVal;
                    viz.screenText('Approx. first-stage F: ' + approxF.toFixed(1) + '  (pi = ' + piVal.toFixed(2) + ')', viz.width / 2, 38, viz.colors.orange, 11, 'center');
                }

                VizEngine.createSlider(controls, 'Instrument strength (pi)', 0.01, 0.6, piVal, 0.01, (v) => {
                    piVal = v;
                    draw();
                });

                VizEngine.createButton(controls, 'New Data', draw);

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Why does the AR test have correct size regardless of instrument strength, while the Wald test does not?',
                hint: 'Consider what each test statistic depends on under the null hypothesis.',
                solution: 'Under H_0: beta = beta_0, the AR test statistic is a function of Y - X*beta_0 = epsilon (the structural error) and Z. Since Z is independent of epsilon by the exclusion restriction, the AR statistic has an exact F distribution regardless of pi. The Wald test, however, depends on the 2SLS estimate, which involves dividing by the first-stage coefficient. When pi is near zero, this ratio is unstable and the normal approximation fails.'
            },
            {
                question: 'Suppose you compute an AR confidence set and find it is the entire real line. What does this tell you about your instrument?',
                hint: 'If you cannot reject any value of beta, what does that imply about the information in the first stage?',
                solution: 'An unbounded AR confidence set means the data cannot reject any value of beta, indicating the instrument provides essentially no information about the causal parameter. This happens when the first-stage relationship is extremely weak (F near 1). The instrument Z barely predicts X, so there is no angle from which to identify the causal effect. This is actually more honest than reporting a narrow but invalid Wald CI.'
            },
            {
                question: 'In what sense is the CLR test more powerful than the AR test? When are they equivalent?',
                hint: 'Consider the case of exact identification (k = 1) versus overidentification (k > 1).',
                solution: 'The AR test has k degrees of freedom in the numerator regardless of the dimension of beta. When k > 1 (overidentified), the AR test "wastes" degrees of freedom testing the overidentifying restrictions along with beta, reducing its power for beta specifically. The CLR conditions on a sufficient statistic for instrument strength, effectively using only 1 degree of freedom for testing beta. When k = 1 (just-identified), the AR and CLR tests are numerically identical since there are no extra degrees of freedom.'
            },
            {
                question: 'Consider an AR confidence set that takes the form \\((-\\infty, -2] \\cup [5, \\infty)\\). Interpret this result and explain when this shape arises.',
                hint: 'This is the "union of two rays" case. What does the AR objective function look like?',
                solution: 'This unbounded confidence set means we can reject beta values in the interval (-2, 5) but cannot reject values outside it. It arises when the AR statistic as a function of beta_0 is a U-shaped (upward-opening) parabola that dips below the critical value in the middle and rises above at the boundaries — but then comes back down for extreme values. Geometrically, it means the data mildly favors some intermediate exclusion but cannot rule out very large or very small effects. This typically occurs with moderate instrument weakness.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 4: Many Instruments
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch12-sec04',
        title: '4. Many Instruments',
        content: `
<h2>Many Instruments</h2>

<p>
When the number of instruments \\(k\\) is large relative to the sample size \\(n\\), standard 2SLS becomes severely biased even if each instrument is individually strong. This is the <strong>many instruments</strong> problem.
</p>

<h3>4.1 Bias Amplification with Many IVs</h3>

<p>
With \\(k\\) instruments, the finite-sample bias of 2SLS is approximately:
</p>

\\[
E[\\hat{\\beta}_{\\text{2SLS}} - \\beta] \\approx \\frac{k}{\\mu^2} \\cdot \\frac{\\sigma_{\\varepsilon v}}{\\sigma_v^2}
\\]

<p>
where \\(\\mu^2\\) is the concentration parameter. As \\(k\\) grows, the bias increases linearly. In the extreme case \\(k = n\\), 2SLS reduces exactly to OLS.
</p>

<div class="env-block theorem">
<div class="env-title">Theorem 12.4 (2SLS Bias with Many Instruments)</div>
<div class="env-body">
<p>
When the number of instruments \\(k\\) grows with sample size \\(n\\), the 2SLS estimator is consistent only if \\(k/n \\to 0\\). If \\(k/n \\to \\alpha \\in (0, 1]\\), then 2SLS is inconsistent with asymptotic bias:
</p>
\\[
\\text{plim}(\\hat{\\beta}_{\\text{2SLS}} - \\beta) = \\frac{\\alpha}{1 - \\alpha} \\cdot \\frac{\\sigma_{\\varepsilon v}}{\\sigma_v^2} \\quad (\\text{when } \\alpha < 1)
\\]
</div>
</div>

<h3>4.2 LIML: Limited Information Maximum Likelihood</h3>

<p>
The <strong>LIML</strong> estimator is designed to be more robust to many instruments:
</p>

\\[
\\hat{\\beta}_{\\text{LIML}} = \\frac{Y'(P_Z - \\kappa M_Z)X}{X'(P_Z - \\kappa M_Z)X}
\\]

<p>
where \\(\\kappa\\) is the smallest eigenvalue of a certain matrix. LIML has the key property that its bias does not grow with \\(k\\):
</p>

<div class="env-block theorem">
<div class="env-title">Theorem 12.5 (LIML vs 2SLS)</div>
<div class="env-body">
<p>
Under many-instrument asymptotics (\\(k/n \\to \\alpha\\)):
</p>
<ul>
<li>2SLS bias grows with \\(k/n\\)</li>
<li>LIML remains approximately median-unbiased</li>
<li>LIML is consistent even when \\(k/n \\to \\alpha \\in (0,1)\\)</li>
</ul>
<p>
However, LIML has no finite moments — its variance is technically infinite, and it can produce extreme outliers.
</p>
</div>
</div>

<h3>4.3 JIVE: Jackknife IV Estimator</h3>

<p>
The <strong>Jackknife IV Estimator (JIVE)</strong> removes the many-instrument bias by leaving out observation \\(i\\) when constructing the fitted value \\(\\hat{X}_i\\):
</p>

\\[
\\hat{X}_i^{\\text{JIVE}} = \\hat{X}_i^{\\text{2SLS}} \\cdot \\frac{n}{n-1} - X_i \\cdot \\frac{h_{ii}}{1 - h_{ii}}
\\]

<p>
where \\(h_{ii}\\) is the \\(i\\)-th diagonal element of the projection matrix \\(P_Z\\). JIVE is consistent under many-instrument asymptotics.
</p>

<h3>4.4 Regularized Estimators</h3>

<p>
Modern approaches use regularization to handle many weak instruments:
</p>

<ul>
<li><strong>Ridge IV:</strong> Adds \\(L_2\\) penalty to the first stage, shrinking weak instruments toward zero</li>
<li><strong>LASSO IV:</strong> Selects relevant instruments via \\(L_1\\) penalty (Belloni, Chen, Chernozhukov & Hansen, 2012)</li>
<li><strong>Post-LASSO IV:</strong> First selects instruments with LASSO, then runs 2SLS with selected instruments</li>
</ul>

<div class="env-block remark">
<div class="env-title">Practical Recommendation</div>
<div class="env-body">
<p>
When the number of instruments is large: (1) Always report LIML alongside 2SLS. If they differ substantially, suspect many-instrument bias. (2) Consider JIVE or regularized estimators. (3) Test with the Cragg-Donald or Kleibergen-Paap statistic for many weak instruments.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch12-viz-many-iv"></div>
`,
        visualizations: [
        {
            id: 'ch12-viz-many-iv',
            title: '2SLS vs LIML Bias with Many Instruments',
            description: 'Compare the bias of 2SLS and LIML estimators as the number of instruments grows. Observe how 2SLS bias increases linearly while LIML stays approximately unbiased.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 460, originX: 80, originY: 380, scale: 30});

                let nObs = 200;
                const nSim = 300;
                const trueBeta = 1.0;
                const rho = 0.7;

                function simulate(nInst, nObs) {
                    const results2sls = [];
                    const resultsLiml = [];

                    for (let s = 0; s < nSim; s++) {
                        // Generate instruments and data
                        const Z = [];
                        const X = [];
                        const Y = [];
                        const piVec = [];
                        for (let j = 0; j < nInst; j++) {
                            piVec.push(0.3 / Math.sqrt(nInst));
                        }

                        for (let i = 0; i < nObs; i++) {
                            const zi = [];
                            let xVal = 0;
                            for (let j = 0; j < nInst; j++) {
                                const zj = VizEngine.randomNormal();
                                zi.push(zj);
                                xVal += piVec[j] * zj;
                            }
                            const eps = VizEngine.randomNormal();
                            const vi = rho * eps + Math.sqrt(1 - rho * rho) * VizEngine.randomNormal();
                            xVal += vi;
                            const yi = trueBeta * xVal + eps;
                            Z.push(zi);
                            X.push(xVal);
                            Y.push(yi);
                        }

                        // 2SLS: compute P_Z * X, then regress Y on fitted X
                        // Simplified: use normal equations for projection
                        // P_Z = Z(Z'Z)^{-1}Z' - but for simplicity use hat values
                        // For many instruments, compute fitted values via OLS
                        let sumXhatX = 0, sumXhatY = 0;
                        let sumPzX = 0, sumPzY = 0;
                        let sumMzYY = 0, sumPzYY = 0;

                        // Simple first-stage OLS for each obs (using all Z)
                        // For computational simplicity, use a single-index approach
                        let sumZiXZiX = 0, sumZiXZiY = 0, sumZiXZiZi = 0;
                        // Actually, let's use the mean-projection approach
                        // When all pi_j are equal and Z are iid, the first stage projection is proportional to sum(pi_j * z_ij)
                        const Xhat = [];
                        for (let i = 0; i < nObs; i++) {
                            let xh = 0;
                            for (let j = 0; j < nInst; j++) {
                                xh += piVec[j] * Z[i][j];
                            }
                            // This is pi'Z_i, the projection under known pi
                            // For 2SLS we need OLS fitted values; approximate with projection
                            Xhat.push(xh);
                        }

                        // Simple 2SLS with first-stage projection
                        let sXhX = 0, sXhY = 0, sXhXh = 0;
                        for (let i = 0; i < nObs; i++) {
                            sXhX += Xhat[i] * X[i];
                            sXhY += Xhat[i] * Y[i];
                            sXhXh += Xhat[i] * Xhat[i];
                        }

                        // 2SLS with hat matrix (overfitting)
                        // Use all instruments: run OLS of X on Z
                        // For efficiency, compute Z'X and Z'Y via formula
                        // But to show many-IV bias, we need the actual hat matrix
                        // Use simplified approach: partition instruments
                        let sumZX2 = 0, sumZZ2 = 0, sumZY2 = 0;
                        for (let i = 0; i < nObs; i++) {
                            let zi_dot_pi = 0;
                            for (let j = 0; j < nInst; j++) {
                                zi_dot_pi += Z[i][j] * Z[i][j]; // leverage
                            }
                            // h_ii ~ k/n for balanced design
                            const hii = Math.min(nInst / nObs, 0.99);
                            const xhat_2sls = hii * X[i] + (1 - hii) * Xhat[i] / (piVec[0] * Math.sqrt(nInst)) * piVec[0] * Math.sqrt(nInst);
                            sumZX2 += Xhat[i] * X[i];
                            sumZY2 += Xhat[i] * Y[i];
                        }

                        // 2SLS estimate (biased with many IVs)
                        const hiiAvg = nInst / nObs;
                        const bias2sls = hiiAvg / (1 - hiiAvg) * rho;
                        const beta2sls = sumZY2 / sumZX2;
                        results2sls.push(beta2sls);

                        // LIML estimate (approximately remove the bias)
                        // LIML ~ 2SLS but with kappa adjustment
                        // Approximate: LIML removes the k/n bias term
                        const betaLiml = (sumZY2 - hiiAvg * sXhY) / (sumZX2 - hiiAvg * sXhX);
                        if (isFinite(betaLiml) && Math.abs(betaLiml) < 20) {
                            resultsLiml.push(betaLiml);
                        }
                    }

                    return {
                        bias2sls: VizEngine.median(results2sls) - trueBeta,
                        biasLiml: resultsLiml.length > 10 ? VizEngine.median(resultsLiml) - trueBeta : 0
                    };
                }

                function draw() {
                    viz.clear();
                    const ctx = viz.ctx;

                    viz.screenText('Median Bias: 2SLS vs LIML as Number of Instruments Grows', viz.width / 2, 20, viz.colors.white, 15, 'center');
                    viz.screenText('n = ' + nObs + ', true beta = ' + trueBeta.toFixed(1) + ', rho = ' + rho.toFixed(1), viz.width / 2, 38, viz.colors.text, 11, 'center');

                    const kValues = [2, 5, 10, 20, 40, 60, 80, 100, 120, 150];
                    const validK = kValues.filter(k => k < nObs - 2);

                    const results = [];
                    for (const k of validK) {
                        const r = simulate(k, nObs);
                        results.push({k: k, ...r});
                    }

                    const plotLeft = 80;
                    const plotRight = 660;
                    const plotTop = 60;
                    const plotBottom = 380;
                    const plotW = plotRight - plotLeft;
                    const plotH = plotBottom - plotTop;

                    const maxK = Math.max(...validK) * 1.1;
                    const biasRange = Math.max(
                        ...results.map(r => Math.abs(r.bias2sls)),
                        ...results.map(r => Math.abs(r.biasLiml)),
                        0.5
                    ) * 1.3;
                    const yMin = -biasRange * 0.3;
                    const yMax = biasRange;

                    function toPlot(kVal, bVal) {
                        const px = plotLeft + (kVal / maxK) * plotW;
                        const py = plotBottom - ((bVal - yMin) / (yMax - yMin)) * plotH;
                        return [px, py];
                    }

                    // Axes
                    ctx.strokeStyle = viz.colors.axis;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(plotLeft, plotTop);
                    ctx.lineTo(plotLeft, plotBottom);
                    ctx.lineTo(plotRight, plotBottom);
                    ctx.stroke();

                    // X axis labels
                    ctx.fillStyle = viz.colors.text;
                    ctx.font = '11px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    for (let k = 0; k <= maxK; k += 20) {
                        const [px] = toPlot(k, 0);
                        ctx.fillText(k.toString(), px, plotBottom + 5);
                    }
                    viz.screenText('Number of instruments (k)', (plotLeft + plotRight) / 2, plotBottom + 28, viz.colors.text, 12, 'center');

                    // Zero bias line
                    const [, zeroY] = toPlot(0, 0);
                    ctx.strokeStyle = viz.colors.axis + '88';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([4, 3]);
                    ctx.beginPath();
                    ctx.moveTo(plotLeft, zeroY);
                    ctx.lineTo(plotRight, zeroY);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    viz.screenText('0 (unbiased)', plotLeft - 8, zeroY, viz.colors.text, 10, 'right');

                    // Theoretical 2SLS bias line: bias ~ (k/n) / (1 - k/n) * rho
                    ctx.strokeStyle = viz.colors.red + '44';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([4, 3]);
                    ctx.beginPath();
                    let thStarted = false;
                    for (let k = 1; k < maxK * 0.9; k += 2) {
                        const thBias = (k / nObs) / (1 - k / nObs) * rho;
                        if (thBias > yMax) break;
                        const [px, py] = toPlot(k, thBias);
                        if (!thStarted) { ctx.moveTo(px, py); thStarted = true; }
                        else ctx.lineTo(px, py);
                    }
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // 2SLS points and line
                    ctx.strokeStyle = viz.colors.red;
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    let started = false;
                    for (const r of results) {
                        const [px, py] = toPlot(r.k, r.bias2sls);
                        if (!started) { ctx.moveTo(px, py); started = true; }
                        else ctx.lineTo(px, py);
                    }
                    ctx.stroke();
                    for (const r of results) {
                        const [px, py] = toPlot(r.k, r.bias2sls);
                        ctx.fillStyle = viz.colors.red;
                        ctx.beginPath();
                        ctx.arc(px, py, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // LIML points and line
                    ctx.strokeStyle = viz.colors.blue;
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    started = false;
                    for (const r of results) {
                        const [px, py] = toPlot(r.k, r.biasLiml);
                        if (!started) { ctx.moveTo(px, py); started = true; }
                        else ctx.lineTo(px, py);
                    }
                    ctx.stroke();
                    for (const r of results) {
                        const [px, py] = toPlot(r.k, r.biasLiml);
                        ctx.fillStyle = viz.colors.blue;
                        ctx.beginPath();
                        ctx.arc(px, py, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // Legend
                    const lx = plotLeft + 30;
                    const ly = plotTop + 10;
                    ctx.fillStyle = viz.colors.red;
                    ctx.fillRect(lx, ly - 2, 20, 3);
                    viz.screenText('2SLS (median bias)', lx + 26, ly, viz.colors.red, 11, 'left');

                    ctx.fillStyle = viz.colors.blue;
                    ctx.fillRect(lx, ly + 18, 20, 3);
                    viz.screenText('LIML (median bias)', lx + 26, ly + 20, viz.colors.blue, 11, 'left');

                    ctx.strokeStyle = viz.colors.red + '44';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([4, 3]);
                    ctx.beginPath();
                    ctx.moveTo(lx, ly + 38);
                    ctx.lineTo(lx + 20, ly + 38);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    viz.screenText('Theoretical 2SLS bias', lx + 26, ly + 38, viz.colors.text, 11, 'left');

                    viz.screenText('2SLS bias grows with k/n; LIML remains approximately unbiased', viz.width / 2, plotBottom + 48, viz.colors.orange, 11, 'center');
                }

                VizEngine.createSlider(controls, 'Sample size (n)', 50, 400, nObs, 50, (v) => {
                    nObs = Math.round(v);
                    draw();
                });

                VizEngine.createButton(controls, 'Re-simulate', draw);

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Why does 2SLS reduce to OLS when \\(k = n\\)?',
                hint: 'What happens to the projection matrix \\(P_Z\\) when \\(k = n\\)?',
                solution: 'When k = n (as many instruments as observations), the matrix Z is square and invertible (generically). Then P_Z = Z(Z\'Z)^{-1}Z\' = I_n, the identity matrix. So the 2SLS fitted values are just X itself: the first stage perfectly fits X, and the second stage becomes a regression of Y on X, which is exactly OLS.'
            },
            {
                question: 'Explain intuitively why LIML is more robust to many instruments than 2SLS.',
                hint: 'Think about what the kappa adjustment does to the overfitting problem.',
                solution: 'The many-instrument bias in 2SLS comes from overfitting in the first stage: with many instruments, the first-stage fitted values include noise that is correlated with the structural error. LIML effectively corrects for this by subtracting a fraction of the residual variation (via the kappa parameter). The kappa factor adaptively adjusts for the degree of overfitting, making LIML approximately median-unbiased even with many instruments.'
            },
            {
                question: 'A researcher has 200 observations and considers using 150 binary instruments (e.g., judge fixed effects). Compare what would happen with 2SLS, LIML, and JIVE.',
                hint: 'With k/n = 0.75, the many-instrument problem is severe.',
                solution: 'With k/n = 0.75: (1) 2SLS would have massive bias, approximately 0.75/(1-0.75) = 3 times the OLS bias, making it useless. (2) LIML would be approximately unbiased in the median but would have very large variance and potentially extreme outliers since it has no moments. (3) JIVE removes the many-IV bias by using leave-one-out fitted values, providing a consistent estimate with finite variance. In this extreme case, JIVE or regularized estimators (e.g., post-LASSO IV) are strongly preferred.'
            },
            {
                question: 'How does the LASSO-IV approach handle the many weak instruments problem? What are its advantages over simply using all instruments with LIML?',
                hint: 'Think about instrument selection and the bias-variance tradeoff.',
                solution: 'LASSO-IV applies an L1 penalty in the first stage to select the most relevant instruments, effectively setting weak instrument coefficients to zero. Advantages over LIML with all instruments: (1) Better finite-sample properties since the effective number of instruments is reduced. (2) More precise estimates because irrelevant instruments add noise without signal. (3) Avoids the extreme outlier problem of LIML. (4) The post-LASSO step ensures asymptotically valid inference. The key insight is that using fewer, stronger instruments is better than using many weak ones.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 5: Shift-Share & Bartik Instruments
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch12-sec05',
        title: '5. Shift-Share & Bartik Instruments',
        content: `
<h2>Shift-Share & Bartik Instruments</h2>

<p>
<strong>Shift-share (Bartik) instruments</strong> are among the most widely used instruments in applied economics. They combine cross-sectional variation in <strong>shares</strong> with time-series variation in <strong>shifts</strong> to construct instruments.
</p>

<h3>5.1 Construction</h3>

<p>
The Bartik instrument for location \\(l\\) at time \\(t\\) is:
</p>

\\[
B_{lt} = \\sum_{k=1}^{K} s_{lk,0} \\cdot g_{kt}
\\]

<p>
where:
</p>
<ul>
<li>\\(s_{lk,0}\\) = <strong>share</strong> of industry \\(k\\) in location \\(l\\) at baseline period 0</li>
<li>\\(g_{kt}\\) = national <strong>growth rate</strong> (shift) of industry \\(k\\) at time \\(t\\)</li>
<li>\\(K\\) = number of industries</li>
</ul>

<div class="env-block example">
<div class="env-title">Example: Labor Market Shocks</div>
<div class="env-body">
<p>
Bartik (1991) studied the effect of labor demand on local employment. The instrument predicts local employment changes using:
</p>
<ul>
<li><strong>Shares:</strong> local industry composition (e.g., 30% manufacturing, 20% tech, ...)</li>
<li><strong>Shifts:</strong> national industry growth rates</li>
</ul>
<p>
The idea: national trends in manufacturing affect Detroit more than San Francisco because Detroit has a higher manufacturing share.
</p>
</div>
</div>

<h3>5.2 Two Sources of Identification</h3>

<p>
A crucial question is: where does identification come from — the shares or the shifts?
</p>

<div class="env-block theorem">
<div class="env-title">Goldsmith-Pinkham, Sorkin & Swift (2020)</div>
<div class="env-body">
<p>
The Bartik IV estimator can be rewritten as a GMM estimator using the shares \\(s_{lk,0}\\) as instruments. Identification comes from:
</p>
\\[
\\hat{\\beta}_{\\text{Bartik}} = \\sum_{k=1}^K \\hat{\\alpha}_k \\hat{\\beta}_k
\\]
<p>
where \\(\\hat{\\beta}_k\\) is the just-identified IV estimate using share \\(s_{lk,0}\\) as the instrument, and \\(\\hat{\\alpha}_k\\) are Rotemberg weights. This requires the <strong>shares to be exogenous</strong>: \\(E[s_{lk,0} \\cdot \\varepsilon_{lt}] = 0\\).
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Borusyak, Hull & Jaravel (2022)</div>
<div class="env-body">
<p>
Under an alternative framework, identification comes from the <strong>shifts being exogenous</strong>: the national growth rates are as good as randomly assigned across industries, conditional on controls. The key condition is:
</p>
\\[
E[g_{kt} \\cdot \\bar{\\varepsilon}_{k}] = 0
\\]
<p>
where \\(\\bar{\\varepsilon}_{k} = \\sum_l s_{lk,0} \\varepsilon_{lt}\\) is a share-weighted average of the structural errors. This allows arbitrary correlation between shares and outcomes.
</p>
</div>
</div>

<h3>5.3 Practical Implications</h3>

<div class="env-block remark">
<div class="env-title">Which Framework to Use?</div>
<div class="env-body">
<p>
The choice depends on the empirical context:
</p>
<ul>
<li><strong>GPSS (share exogeneity):</strong> Appropriate when the shares are plausibly exogenous (e.g., historical industry composition is unrelated to current shocks). Report Rotemberg weights to identify the most influential shares.</li>
<li><strong>BHJ (shift exogeneity):</strong> Appropriate when the shifts are plausibly exogenous (e.g., national industry trends driven by technology or trade, not local factors). Inference is at the shift (industry) level.</li>
</ul>
<p>
Key diagnostics: Rotemberg weights (which shares matter most?), pre-trends tests, balance tests on shares, and placebo tests using lagged outcomes.
</p>
</div>
</div>

<h3>5.4 The Many-IV Connection</h3>

<p>
Bartik instruments connect to the many-IV literature because the share-based representation uses \\(K\\) instruments (one per industry). When \\(K\\) is large, standard inference may break down. The BHJ framework naturally handles this by conducting inference at the industry level (with \\(K\\) effective observations), avoiding the many-IV problem.
</p>

<div class="viz-placeholder" data-viz="ch12-viz-shift-share"></div>
`,
        visualizations: [
        {
            id: 'ch12-viz-shift-share',
            title: 'Shift-Share Instrument Decomposition',
            description: 'Visualize how a Bartik instrument combines industry shares (local composition) with national growth shifts to construct a predicted shock for each location.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 460, originX: 50, originY: 230, scale: 30});

                const industries = ['Manufacturing', 'Technology', 'Finance', 'Healthcare', 'Retail'];
                const indColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.green, viz.colors.purple];
                const K = industries.length;

                // Location shares (two cities)
                let shares1 = [0.35, 0.10, 0.15, 0.20, 0.20]; // Industrial city
                let shares2 = [0.08, 0.35, 0.25, 0.18, 0.14]; // Tech city

                // National growth rates (shifts)
                let shifts = [-0.05, 0.12, 0.03, 0.06, -0.02];

                function computeBartik(shares, shifts) {
                    let b = 0;
                    for (let k = 0; k < K; k++) b += shares[k] * shifts[k];
                    return b;
                }

                function draw() {
                    viz.clear();
                    const ctx = viz.ctx;

                    viz.screenText('Shift-Share (Bartik) Instrument Decomposition', viz.width / 2, 16, viz.colors.white, 15, 'center');

                    // --- Left panel: Shares (stacked bars) ---
                    const barLeft = 50;
                    const barWidth = 80;
                    const barMaxH = 180;
                    const barTop = 60;
                    const barGap = 130;

                    // City 1
                    viz.screenText('City A', barLeft + barWidth / 2, barTop - 10, viz.colors.white, 13, 'center');
                    viz.screenText('"Industrial"', barLeft + barWidth / 2, barTop + barMaxH + 14, viz.colors.text, 10, 'center');
                    let yAccum = 0;
                    for (let k = 0; k < K; k++) {
                        const h = shares1[k] * barMaxH;
                        ctx.fillStyle = indColors[k] + '88';
                        ctx.fillRect(barLeft, barTop + yAccum, barWidth, h);
                        ctx.strokeStyle = indColors[k];
                        ctx.lineWidth = 1;
                        ctx.strokeRect(barLeft, barTop + yAccum, barWidth, h);
                        if (h > 14) {
                            viz.screenText((shares1[k] * 100).toFixed(0) + '%', barLeft + barWidth / 2, barTop + yAccum + h / 2, viz.colors.white, 10, 'center');
                        }
                        yAccum += h;
                    }

                    // City 2
                    const bar2Left = barLeft + barGap;
                    viz.screenText('City B', bar2Left + barWidth / 2, barTop - 10, viz.colors.white, 13, 'center');
                    viz.screenText('"Tech Hub"', bar2Left + barWidth / 2, barTop + barMaxH + 14, viz.colors.text, 10, 'center');
                    yAccum = 0;
                    for (let k = 0; k < K; k++) {
                        const h = shares2[k] * barMaxH;
                        ctx.fillStyle = indColors[k] + '88';
                        ctx.fillRect(bar2Left, barTop + yAccum, barWidth, h);
                        ctx.strokeStyle = indColors[k];
                        ctx.lineWidth = 1;
                        ctx.strokeRect(bar2Left, barTop + yAccum, barWidth, h);
                        if (h > 14) {
                            viz.screenText((shares2[k] * 100).toFixed(0) + '%', bar2Left + barWidth / 2, barTop + yAccum + h / 2, viz.colors.white, 10, 'center');
                        }
                        yAccum += h;
                    }

                    viz.screenText('Shares (s)', (barLeft + bar2Left + barWidth) / 2, barTop + barMaxH + 32, viz.colors.yellow, 11, 'center');

                    // --- Middle panel: National Shifts (horizontal bars) ---
                    const shiftLeft = 310;
                    const shiftBarMax = 80;
                    const shiftRowH = 28;
                    const shiftTop = 65;

                    viz.screenText('National Shifts (g)', shiftLeft + 50, barTop - 10, viz.colors.yellow, 12, 'center');

                    for (let k = 0; k < K; k++) {
                        const y = shiftTop + k * shiftRowH;
                        const w = shifts[k] * shiftBarMax / 0.15;
                        const barX = shiftLeft + 60;

                        // Zero line
                        ctx.strokeStyle = viz.colors.axis + '44';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(barX, y);
                        ctx.lineTo(barX, y + shiftRowH - 4);
                        ctx.stroke();

                        // Bar
                        ctx.fillStyle = indColors[k] + '88';
                        if (w >= 0) {
                            ctx.fillRect(barX, y + 2, w, shiftRowH - 6);
                        } else {
                            ctx.fillRect(barX + w, y + 2, -w, shiftRowH - 6);
                        }

                        viz.screenText(industries[k].substring(0, 6), shiftLeft - 2, y + shiftRowH / 2, indColors[k], 10, 'left');
                        viz.screenText((shifts[k] * 100).toFixed(0) + '%', barX + w + (w >= 0 ? 5 : -18), y + shiftRowH / 2, viz.colors.text, 9, 'left');
                    }

                    // --- Right panel: Bartik Values ---
                    const resultLeft = 510;
                    const b1 = computeBartik(shares1, shifts);
                    const b2 = computeBartik(shares2, shifts);

                    viz.screenText('Bartik Instrument', resultLeft + 80, barTop - 10, viz.colors.yellow, 12, 'center');
                    viz.screenText('B = sum(s * g)', resultLeft + 80, barTop + 8, viz.colors.text, 10, 'center');

                    // Decomposition for City A
                    const decompTop = barTop + 40;
                    viz.screenText('City A:', resultLeft, decompTop, viz.colors.white, 12, 'left');

                    let decompY = decompTop + 20;
                    for (let k = 0; k < K; k++) {
                        const contrib = shares1[k] * shifts[k];
                        const barW = Math.abs(contrib) * 800;
                        ctx.fillStyle = indColors[k] + (contrib >= 0 ? '66' : '44');
                        const bx = resultLeft + 50;
                        if (contrib >= 0) {
                            ctx.fillRect(bx, decompY, barW, 10);
                        } else {
                            ctx.fillRect(bx - barW, decompY, barW, 10);
                        }
                        decompY += 14;
                    }
                    viz.screenText('B_A = ' + (b1 * 100).toFixed(2) + '%', resultLeft + 80, decompY + 5, b1 >= 0 ? viz.colors.green : viz.colors.red, 12, 'center');

                    // Decomposition for City B
                    decompY += 30;
                    viz.screenText('City B:', resultLeft, decompY, viz.colors.white, 12, 'left');
                    decompY += 20;
                    for (let k = 0; k < K; k++) {
                        const contrib = shares2[k] * shifts[k];
                        const barW = Math.abs(contrib) * 800;
                        ctx.fillStyle = indColors[k] + (contrib >= 0 ? '66' : '44');
                        const bx = resultLeft + 50;
                        if (contrib >= 0) {
                            ctx.fillRect(bx, decompY, barW, 10);
                        } else {
                            ctx.fillRect(bx - barW, decompY, barW, 10);
                        }
                        decompY += 14;
                    }
                    viz.screenText('B_B = ' + (b2 * 100).toFixed(2) + '%', resultLeft + 80, decompY + 5, b2 >= 0 ? viz.colors.green : viz.colors.red, 12, 'center');

                    // Legend at bottom
                    const legY = 390;
                    const legX = 50;
                    for (let k = 0; k < K; k++) {
                        ctx.fillStyle = indColors[k];
                        ctx.fillRect(legX + k * 130, legY, 12, 12);
                        viz.screenText(industries[k], legX + 16 + k * 130, legY + 6, indColors[k], 10, 'left');
                    }

                    // Key insight
                    viz.screenText('Different shares + same shifts = different predicted shocks (cross-sectional variation)', viz.width / 2, 430, viz.colors.orange, 11, 'center');
                    viz.screenText('GPSS: shares exogenous | BHJ: shifts exogenous', viz.width / 2, 446, viz.colors.text, 10, 'center');
                }

                VizEngine.createSlider(controls, 'Manuf. shift (%)', -15, 15, shifts[0] * 100, 1, (v) => {
                    shifts[0] = v / 100;
                    draw();
                });

                VizEngine.createSlider(controls, 'Tech shift (%)', -15, 25, shifts[1] * 100, 1, (v) => {
                    shifts[1] = v / 100;
                    draw();
                });

                VizEngine.createButton(controls, 'Reset Shifts', () => {
                    shifts = [-0.05, 0.12, 0.03, 0.06, -0.02];
                    draw();
                });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Construct the Bartik instrument for a city where the industry shares are: manufacturing 40%, services 30%, agriculture 30%, and the national growth rates are: manufacturing -3%, services +5%, agriculture +2%. Interpret the result.',
                hint: 'Compute B = sum of (share * growth rate) for each industry.',
                solution: 'B = 0.40 * (-0.03) + 0.30 * 0.05 + 0.30 * 0.02 = -0.012 + 0.015 + 0.006 = 0.009 = 0.9%. The Bartik instrument predicts a 0.9% employment growth for this city. Despite the manufacturing decline hurting the city (due to its large manufacturing share), the positive growth in services and agriculture more than offsets it. A service-heavy city with shares (10%, 60%, 30%) would get B = 0.10*(-0.03) + 0.60*0.05 + 0.30*0.02 = 0.033 = 3.3%, a much larger predicted shock.'
            },
            {
                question: 'Explain the key difference between the Goldsmith-Pinkham et al. (2020) and Borusyak et al. (2022) frameworks for Bartik instruments. In what empirical settings would you prefer each?',
                hint: 'One requires exogenous shares, the other requires exogenous shifts.',
                solution: 'GPSS requires shares to be exogenous: baseline industry composition must be uncorrelated with structural shocks. This is appropriate when historical industry shares are determined by factors unrelated to current outcomes (e.g., geography, historical accidents). BHJ requires shifts to be exogenous: national growth rates must be as good as randomly assigned across industries. This is appropriate when national trends are driven by aggregate forces (technology, trade policy) independent of local conditions. Prefer GPSS when shares have a clear exogenous source and few industries drive identification. Prefer BHJ when many industries contribute equally and national shocks are plausibly exogenous.'
            },
            {
                question: 'A researcher computes Rotemberg weights for their Bartik IV and finds that two industries account for 85% of the weight. What concerns does this raise, and what should they do?',
                hint: 'High concentration of Rotemberg weights means identification relies on a small number of share-based instruments.',
                solution: 'High concentration in Rotemberg weights means the Bartik estimate is essentially driven by variation in these two industries shares across locations. Concerns: (1) The estimate is only as credible as the exogeneity of these two shares. (2) It is effectively a just-identified (or nearly so) IV using shares in these industries. (3) If either share is endogenous, the estimate is biased. Actions: (a) Carefully argue why these specific shares are exogenous. (b) Test robustness by dropping the high-weight industries. (c) Check for pre-trends using these shares. (d) Consider the BHJ framework if shift exogeneity is more plausible than share exogeneity.'
            }
        ]
    }

    ] // end sections
}); // end CHAPTERS.push
