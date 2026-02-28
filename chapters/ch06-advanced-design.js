// === Chapter 6: Advanced Experimental Design ===
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch06',
    number: 6,
    title: 'Advanced Experimental Design',
    subtitle: 'Beyond Simple Randomization',
    sections: [
        // ============================================================
        // Section 1: Factorial Designs
        // ============================================================
        {
            id: 'factorial-designs',
            title: 'Factorial Designs',
            content: `
<h2>Factorial Designs</h2>

<h3>Why Factorial?</h3>
<p>In a simple RCT we randomize one treatment factor at a time. But many scientific questions involve
<strong>multiple factors</strong>. A <em>factorial design</em> studies all combinations simultaneously,
yielding more information per experimental unit.</p>

<p>A <strong>\\(2^k\\) factorial design</strong> has \\(k\\) factors, each at two levels (e.g., high/low, present/absent).
The full design has \\(2^k\\) treatment cells. For \\(k = 2\\), we have four cells:</p>

\\[
\\begin{array}{c|cc}
 & B = 0 & B = 1 \\\\
\\hline
A = 0 & (0,0) & (0,1) \\\\
A = 1 & (1,0) & (1,1)
\\end{array}
\\]

<h3>Main Effects</h3>
<p>The <strong>main effect</strong> of factor \\(A\\) is the average difference in outcomes when \\(A\\) changes from 0 to 1,
averaged over all levels of \\(B\\):</p>

\\[
\\text{ME}_A = \\frac{1}{2}\\bigl[\\bar{Y}(1,0) - \\bar{Y}(0,0)\\bigr] + \\frac{1}{2}\\bigl[\\bar{Y}(1,1) - \\bar{Y}(0,1)\\bigr]
\\]

<p>Similarly for factor \\(B\\):</p>

\\[
\\text{ME}_B = \\frac{1}{2}\\bigl[\\bar{Y}(0,1) - \\bar{Y}(0,0)\\bigr] + \\frac{1}{2}\\bigl[\\bar{Y}(1,1) - \\bar{Y}(1,0)\\bigr]
\\]

<h3>Interaction Effects</h3>
<p>The <strong>interaction</strong> \\(A \\times B\\) measures whether the effect of \\(A\\) depends on the level of \\(B\\):</p>

\\[
\\text{Int}_{AB} = \\bigl[\\bar{Y}(1,1) - \\bar{Y}(0,1)\\bigr] - \\bigl[\\bar{Y}(1,0) - \\bar{Y}(0,0)\\bigr]
\\]

<p>When the interaction is zero, the factors operate <em>additively</em>; otherwise, the combined effect differs
from the sum of individual effects.</p>

<h3>Efficiency Gains</h3>
<p>A key advantage: with \\(N\\) total units in a \\(2^2\\) design, each main effect estimate uses <strong>all \\(N\\) observations</strong>
(half as "treatment," half as "control" for that factor). Compare this to running two separate experiments
of size \\(N/2\\) each. The factorial design is <strong>twice as efficient</strong> for estimating main effects.</p>

<p>More generally, in a \\(2^k\\) factorial, each main effect uses all \\(N\\) observations, whereas running
\\(k\\) separate experiments would give each estimate only \\(N/k\\) observations.</p>

<h3>The Linear Model for \\(2^2\\) Factorials</h3>
<p>The outcome model is:</p>

\\[
Y_i = \\mu + \\alpha A_i + \\beta B_i + \\gamma A_i B_i + \\varepsilon_i
\\]

<p>where \\(\\alpha\\) captures the main effect of \\(A\\), \\(\\beta\\) captures the main effect of \\(B\\),
and \\(\\gamma\\) captures the interaction. Under randomization, OLS consistently estimates all parameters.</p>

<div class="concept-highlight">
<strong>Key Insight:</strong> Factorial designs let you study multiple factors simultaneously without
sacrificing statistical power for any single factor. They are not just efficient — they are the
<em>only</em> way to detect interactions between factors.
</div>
`,
            visualizations: [
                {
                    id: 'viz-factorial-2x2',
                    title: '2x2 Factorial Design with Interaction Effects',
                    description: 'Adjust the cell means to see how main effects and interaction change. When the lines are parallel, there is no interaction.',
                    setup: function(container) {
                        const viz = new VizEngine(container, {
                            width: 560, height: 420,
                            originX: 100, originY: 350, scale: 120
                        });

                        const controls = document.createElement('div');
                        controls.className = 'viz-controls';
                        container.appendChild(controls);

                        let y00 = 2.0, y10 = 3.0, y01 = 2.5, y11 = 4.5;

                        const sY00 = VizEngine.createSlider(controls, 'Y(0,0)', 0, 5, y00, 0.1, v => { y00 = v; draw(); });
                        const sY10 = VizEngine.createSlider(controls, 'Y(1,0)', 0, 5, y10, 0.1, v => { y10 = v; draw(); });
                        const sY01 = VizEngine.createSlider(controls, 'Y(0,1)', 0, 5, y01, 0.1, v => { y01 = v; draw(); });
                        const sY11 = VizEngine.createSlider(controls, 'Y(1,1)', 0, 5, y11, 0.1, v => { y11 = v; draw(); });

                        function draw() {
                            viz.clear();

                            const ctx = viz.ctx;

                            // Draw axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            // X axis
                            ctx.beginPath();
                            ctx.moveTo(80, 350);
                            ctx.lineTo(480, 350);
                            ctx.stroke();
                            // Y axis
                            ctx.beginPath();
                            ctx.moveTo(100, 350);
                            ctx.lineTo(100, 40);
                            ctx.stroke();

                            // Y-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (let y = 0; y <= 5; y++) {
                                const sy = 350 - y * 60;
                                ctx.fillText(y.toString(), 90, sy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(100, sy);
                                ctx.lineTo(480, sy);
                                ctx.stroke();
                            }

                            // X-axis labels
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('A = 0', 200, 358);
                            ctx.fillText('A = 1', 400, 358);

                            // Map y to screen
                            const toSY = (val) => 350 - val * 60;

                            // Line for B=0
                            const sx0 = 200, sx1 = 400;
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            ctx.moveTo(sx0, toSY(y00));
                            ctx.lineTo(sx1, toSY(y10));
                            ctx.stroke();

                            // Line for B=1
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            ctx.moveTo(sx0, toSY(y01));
                            ctx.lineTo(sx1, toSY(y11));
                            ctx.stroke();

                            // Points
                            const drawPt = (sx, sy, color, label) => {
                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.arc(sx, sy, 6, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(label, sx + 10, sy - 4);
                            };

                            drawPt(sx0, toSY(y00), viz.colors.blue, 'Y(0,0)=' + y00.toFixed(1));
                            drawPt(sx1, toSY(y10), viz.colors.blue, 'Y(1,0)=' + y10.toFixed(1));
                            drawPt(sx0, toSY(y01), viz.colors.orange, 'Y(0,1)=' + y01.toFixed(1));
                            drawPt(sx1, toSY(y11), viz.colors.orange, 'Y(1,1)=' + y11.toFixed(1));

                            // Legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(120, 20, 14, 14);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('B = 0', 140, 27);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(210, 20, 14, 14);
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('B = 1', 230, 27);

                            // Compute effects
                            const meA = 0.5 * (y10 - y00) + 0.5 * (y11 - y01);
                            const meB = 0.5 * (y01 - y00) + 0.5 * (y11 - y10);
                            const interaction = (y11 - y01) - (y10 - y00);

                            // Display effects
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Main Effect A: ' + meA.toFixed(2), 320, 55);
                            ctx.fillText('Main Effect B: ' + meB.toFixed(2), 320, 75);

                            const intColor = Math.abs(interaction) < 0.05 ? viz.colors.green : viz.colors.red;
                            ctx.fillStyle = intColor;
                            ctx.fillText('Interaction: ' + interaction.toFixed(2), 320, 95);

                            if (Math.abs(interaction) < 0.05) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('(lines parallel = no interaction)', 320, 115);
                            } else {
                                ctx.fillStyle = viz.colors.red;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('(lines not parallel = interaction present)', 320, 115);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    id: 'ex-factorial-1',
                    type: 'multiple-choice',
                    question: 'In a 2^2 factorial design with N total units, how many observations contribute to estimating the main effect of factor A?',
                    options: ['N/4', 'N/2', 'N', '2N'],
                    correctIndex: 2,
                    explanation: 'All N observations contribute to estimating each main effect in a factorial design. Half serve as "treatment" (A=1) and half as "control" (A=0), but all are used. This is a key efficiency advantage over one-factor-at-a-time designs.'
                },
                {
                    id: 'ex-factorial-2',
                    type: 'multiple-choice',
                    question: 'If the cell means are Y(0,0)=3, Y(1,0)=5, Y(0,1)=4, Y(1,1)=8, what is the interaction effect?',
                    options: ['0', '1', '2', '3'],
                    correctIndex: 2,
                    explanation: 'Interaction = [Y(1,1) - Y(0,1)] - [Y(1,0) - Y(0,0)] = [8 - 4] - [5 - 3] = 4 - 2 = 2. The effect of A is 2 units larger when B=1 than when B=0.'
                },
                {
                    id: 'ex-factorial-3',
                    type: 'multiple-choice',
                    question: 'In a 2^3 factorial design, how many treatment cells are there?',
                    options: ['3', '6', '8', '16'],
                    correctIndex: 2,
                    explanation: '2^3 = 8 treatment cells. Each of the 3 factors has 2 levels, giving 2 x 2 x 2 = 8 unique combinations.'
                },
                {
                    id: 'ex-factorial-4',
                    type: 'short-answer',
                    question: 'In a 2^2 factorial with cell means Y(0,0)=10, Y(1,0)=14, Y(0,1)=12, Y(1,1)=16, compute the main effect of factor A. (Enter a number.)',
                    answer: '4',
                    explanation: 'ME_A = 0.5 * [Y(1,0) - Y(0,0)] + 0.5 * [Y(1,1) - Y(0,1)] = 0.5 * (14-10) + 0.5 * (16-12) = 0.5 * 4 + 0.5 * 4 = 4.'
                }
            ]
        },

        // ============================================================
        // Section 2: Crossover & Within-Subject Designs
        // ============================================================
        {
            id: 'crossover-designs',
            title: 'Crossover & Within-Subject Designs',
            content: `
<h2>Crossover & Within-Subject Designs</h2>

<h3>Motivation</h3>
<p>In a <strong>between-subjects</strong> design, each unit receives only one treatment. But individual-level
variation often dominates treatment effects, reducing power. A <strong>within-subject</strong> (or <strong>crossover</strong>)
design lets each unit receive <em>multiple treatments</em> in sequence, so each subject serves as their own control.</p>

<h3>The 2x2 Crossover Design (AB/BA)</h3>
<p>The simplest crossover design has two treatments (\\(A\\) and \\(B\\)) and two periods:</p>

\\[
\\begin{array}{c|cc}
 & \\text{Period 1} & \\text{Period 2} \\\\
\\hline
\\text{Sequence 1} & A & B \\\\
\\text{Sequence 2} & B & A
\\end{array}
\\]

<p>Subjects are randomized to one of the two sequences. The treatment effect for subject \\(i\\) in
sequence 1 is estimated from \\(Y_{i,1} - Y_{i,2}\\) (adjusting for period effects).</p>

<h3>The Model</h3>
<p>For a 2x2 crossover, the outcome for subject \\(i\\) in period \\(j\\) is:</p>

\\[
Y_{ij} = \\mu + \\pi_j + \\tau_{d(i,j)} + \\lambda_{d(i,j-1)} + s_i + \\varepsilon_{ij}
\\]

<p>where \\(\\pi_j\\) = period effect, \\(\\tau_d\\) = treatment effect, \\(\\lambda\\) = carryover effect,
\\(s_i\\) = subject random effect, and \\(\\varepsilon_{ij}\\) = residual error.</p>

<h3>Washout Periods</h3>
<p>A <strong>washout period</strong> is a treatment-free interval between periods, designed to eliminate
<strong>carryover effects</strong> (\\(\\lambda\\)). If the pharmacological half-life of a drug is \\(t_{1/2}\\),
the washout should typically be \\(\\geq 5 t_{1/2}\\) to ensure the drug is essentially eliminated.</p>

<h3>Carryover Effects</h3>
<p>When carryover is present and unequal (\\(\\lambda_A \\neq \\lambda_B\\)), the crossover design is
<strong>biased</strong>. The standard test for equal carryover compares the <em>sum</em>
\\(Y_{i,1} + Y_{i,2}\\) across sequences. If significant, one should:</p>
<ul>
<li>Use only Period 1 data (losing the within-subject comparison)</li>
<li>Redesign with longer washout</li>
<li>Use higher-order crossover designs (e.g., Balaam's design)</li>
</ul>

<h3>Latin Square Designs</h3>
<p>When there are \\(t\\) treatments, a <strong>Latin square</strong> assigns treatments so that each treatment
appears exactly once in each row (period) and each column (subject group). For \\(t = 3\\):</p>

\\[
\\begin{array}{c|ccc}
 & \\text{Col 1} & \\text{Col 2} & \\text{Col 3} \\\\
\\hline
\\text{Period 1} & A & B & C \\\\
\\text{Period 2} & B & C & A \\\\
\\text{Period 3} & C & A & B
\\end{array}
\\]

<p>This controls for both period and subject-group effects simultaneously.</p>

<h3>Variance Reduction</h3>
<p>The within-subject variance is typically much smaller than between-subject variance.
If \\(\\rho\\) is the intraclass correlation, the crossover design reduces the variance of the
treatment effect estimator by a factor of approximately \\(2(1 - \\rho)\\) compared to a parallel design.</p>

<div class="concept-highlight">
<strong>Key Insight:</strong> Crossover designs gain enormous power by eliminating between-subject
variability, but they require the treatment effect to be <em>reversible</em> and carryover to be
negligible. They are ideal for stable, chronic conditions (e.g., hypertension) and problematic
for conditions that change (e.g., acute illness).
</div>
`,
            visualizations: [
                {
                    id: 'viz-crossover-timeline',
                    title: 'Crossover Design Timeline',
                    description: 'Visualize a 2x2 crossover trial. Toggle carryover effects on/off to see how they bias the treatment estimate.',
                    setup: function(container) {
                        const viz = new VizEngine(container, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        const controls = document.createElement('div');
                        controls.className = 'viz-controls';
                        container.appendChild(controls);

                        let carryover = false;
                        let washout = true;

                        VizEngine.createButton(controls, 'Toggle Carryover', () => {
                            carryover = !carryover;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Toggle Washout', () => {
                            washout = !washout;
                            draw();
                        });

                        function draw() {
                            const ctx = viz.ctx;
                            viz.clear();

                            const W = viz.width, H = viz.height;

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('2x2 Crossover Design (AB/BA)', W / 2, 10);

                            // Timeline parameters
                            const leftX = 80, rightX = W - 30;
                            const p1Start = leftX;
                            const washoutStart = leftX + (rightX - leftX) * 0.33;
                            const p2Start = leftX + (rightX - leftX) * (washout ? 0.55 : 0.5);
                            const p2End = rightX;

                            const seq1Y = 120, seq2Y = 260;
                            const boxH = 50;

                            // Labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Sequence 1:', leftX - 10, seq1Y + boxH / 2);
                            ctx.fillText('Sequence 2:', leftX - 10, seq2Y + boxH / 2);

                            // Period labels
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Period 1', (p1Start + washoutStart) / 2, seq1Y - 25);
                            if (washout) {
                                ctx.fillText('Washout', (washoutStart + p2Start) / 2, seq1Y - 25);
                            }
                            ctx.fillText('Period 2', (p2Start + p2End) / 2, seq1Y - 25);

                            // Draw treatment blocks
                            const drawBlock = (x, y, w, h, color, label) => {
                                ctx.fillStyle = color + '44';
                                ctx.fillRect(x, y, w, h);
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(x, y, w, h);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(label, x + w / 2, y + h / 2);
                            };

                            const p1W = washoutStart - p1Start - 5;
                            const p2W = p2End - p2Start - 5;

                            // Sequence 1: A then B
                            drawBlock(p1Start, seq1Y, p1W, boxH, viz.colors.blue, 'Treatment A');
                            drawBlock(p2Start, seq1Y, p2W, boxH, viz.colors.orange, 'Treatment B');

                            // Sequence 2: B then A
                            drawBlock(p1Start, seq2Y, p1W, boxH, viz.colors.orange, 'Treatment B');
                            drawBlock(p2Start, seq2Y, p2W, boxH, viz.colors.blue, 'Treatment A');

                            // Washout
                            if (washout) {
                                const washW = p2Start - washoutStart;
                                ctx.fillStyle = viz.colors.grid;
                                ctx.fillRect(washoutStart, seq1Y, washW, boxH);
                                ctx.fillRect(washoutStart, seq2Y, washW, boxH);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('wash', washoutStart + washW / 2, seq1Y + boxH / 2);
                                ctx.fillText('wash', washoutStart + washW / 2, seq2Y + boxH / 2);
                            }

                            // Carryover arrows
                            if (carryover) {
                                ctx.strokeStyle = viz.colors.red;
                                ctx.lineWidth = 2;
                                ctx.setLineDash([4, 3]);
                                // Seq 1: A carries into period 2
                                const arrowFromX = washout ? washoutStart : washoutStart + 10;
                                ctx.beginPath();
                                ctx.moveTo(arrowFromX, seq1Y + boxH + 5);
                                ctx.quadraticCurveTo((arrowFromX + p2Start) / 2, seq1Y + boxH + 35, p2Start + 15, seq1Y + boxH + 5);
                                ctx.stroke();
                                // Seq 2: B carries into period 2
                                ctx.beginPath();
                                ctx.moveTo(arrowFromX, seq2Y + boxH + 5);
                                ctx.quadraticCurveTo((arrowFromX + p2Start) / 2, seq2Y + boxH + 35, p2Start + 15, seq2Y + boxH + 5);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                ctx.fillStyle = viz.colors.red;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('carryover from A', (arrowFromX + p2Start) / 2, seq1Y + boxH + 40);
                                ctx.fillText('carryover from B', (arrowFromX + p2Start) / 2, seq2Y + boxH + 40);
                            }

                            // Time arrow
                            ctx.strokeStyle = viz.colors.text;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(leftX, H - 30);
                            ctx.lineTo(rightX, H - 30);
                            ctx.stroke();
                            // Arrowhead
                            ctx.beginPath();
                            ctx.moveTo(rightX, H - 30);
                            ctx.lineTo(rightX - 8, H - 34);
                            ctx.lineTo(rightX - 8, H - 26);
                            ctx.closePath();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fill();
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Time', W / 2, H - 12);

                            // Status
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Carryover: ' + (carryover ? 'ON' : 'OFF'), 10, H - 65);
                            ctx.fillText('Washout: ' + (washout ? 'ON' : 'OFF'), 10, H - 48);

                            if (carryover && !washout) {
                                ctx.fillStyle = viz.colors.red;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.fillText('Warning: Carryover without washout biases Period 2!', 170, H - 56);
                            } else if (carryover && washout) {
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('Washout mitigates carryover (if long enough)', 170, H - 56);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    id: 'ex-crossover-1',
                    type: 'multiple-choice',
                    question: 'What is the primary advantage of a crossover design over a parallel-group design?',
                    options: [
                        'It requires fewer treatment groups',
                        'Each subject serves as their own control, eliminating between-subject variability',
                        'It is immune to carryover effects',
                        'It does not require randomization'
                    ],
                    correctIndex: 1,
                    explanation: 'The key advantage of a crossover design is that each subject receives both treatments, so between-subject variability cancels out when computing within-subject treatment differences. This can dramatically increase statistical power.'
                },
                {
                    id: 'ex-crossover-2',
                    type: 'multiple-choice',
                    question: 'In a 2x2 crossover trial, unequal carryover effects lead to:',
                    options: [
                        'Increased precision of the treatment estimate',
                        'Bias in the treatment effect estimate',
                        'Larger sample size requirements only',
                        'No effect on the treatment estimate'
                    ],
                    correctIndex: 1,
                    explanation: 'When carryover effects are unequal across treatments, the Period 2 outcomes are contaminated differently in the two sequences, leading to bias in the crossover treatment estimate. This is the major threat to validity in crossover designs.'
                },
                {
                    id: 'ex-crossover-3',
                    type: 'multiple-choice',
                    question: 'A Latin square design with t treatments ensures that:',
                    options: [
                        'Each treatment appears exactly once in each period and each subject group',
                        'All subjects receive all treatments twice',
                        'There are no period effects',
                        'Carryover effects are automatically zero'
                    ],
                    correctIndex: 0,
                    explanation: 'A Latin square arranges t treatments, t periods, and t groups so that each treatment appears exactly once in each row (period) and each column (group). This allows estimation of treatment effects while controlling for both period and group effects.'
                }
            ]
        },

        // ============================================================
        // Section 3: Adaptive & Sequential Experiments
        // ============================================================
        {
            id: 'adaptive-sequential',
            title: 'Adaptive & Sequential Experiments',
            content: `
<h2>Adaptive & Sequential Experiments</h2>

<h3>The Problem with Fixed Designs</h3>
<p>Classical RCTs fix the sample size, allocation ratio, and decision rules before the trial begins.
But this can be wasteful: if one treatment is clearly superior early on, why continue assigning
subjects to the inferior arm?</p>

<h3>Multi-Armed Bandits</h3>
<p>The <strong>multi-armed bandit</strong> problem balances <em>exploration</em> (learning which arm is best)
and <em>exploitation</em> (assigning subjects to the arm believed to be best). With \\(K\\) arms,
at each round \\(t\\) we choose an arm \\(A_t \\in \\{1, \\ldots, K\\}\\) and observe reward \\(R_t\\).</p>

<p>The goal is to minimize <strong>cumulative regret</strong>:</p>

\\[
\\text{Regret}(T) = T \\mu^* - \\sum_{t=1}^T \\mu_{A_t}
\\]

<p>where \\(\\mu^* = \\max_k \\mu_k\\) is the best arm's mean reward. Good algorithms achieve regret
\\(O(\\sqrt{KT \\log T})\\).</p>

<h3>Thompson Sampling</h3>
<p><strong>Thompson sampling</strong> is a Bayesian approach. For Bernoulli rewards:</p>
<ol>
<li>Maintain a Beta posterior for each arm: \\(\\theta_k \\sim \\text{Beta}(\\alpha_k, \\beta_k)\\)</li>
<li>At each round, draw \\(\\tilde{\\theta}_k \\sim \\text{Beta}(\\alpha_k, \\beta_k)\\) for each arm</li>
<li>Play the arm with the highest draw: \\(A_t = \\arg\\max_k \\tilde{\\theta}_k\\)</li>
<li>Update: if reward = 1, increment \\(\\alpha_{A_t}\\); if reward = 0, increment \\(\\beta_{A_t}\\)</li>
</ol>

<p>Thompson sampling naturally balances exploration and exploitation: uncertain arms get explored
(their posterior is wide), while arms with high estimated reward get exploited.</p>

<h3>Group Sequential Designs</h3>
<p>In a <strong>group sequential design</strong>, interim analyses are planned at \\(K\\) equally-spaced
"looks" at the accumulating data. At each look, we can:</p>
<ul>
<li><strong>Stop for efficacy</strong> (reject \\(H_0\\))</li>
<li><strong>Stop for futility</strong> (accept \\(H_0\\))</li>
<li><strong>Continue</strong> enrolling</li>
</ul>

<p>The key challenge is <strong>multiplicity</strong>: looking at the data multiple times inflates
the Type I error rate if we use the usual \\(\\alpha = 0.05\\) threshold at each look.</p>

<h3>Alpha Spending Functions</h3>
<p>An <strong>alpha spending function</strong> \\(\\alpha^*(t)\\) allocates the overall significance level
across interim looks. The incremental alpha spent at look \\(k\\) is
\\(\\Delta \\alpha_k = \\alpha^*(t_k) - \\alpha^*(t_{k-1})\\).</p>

<p>Two popular choices:</p>

<p><strong>O'Brien-Fleming:</strong></p>
\\[
\\alpha^*_{\\text{OBF}}(t) = 2 - 2\\Phi\\Bigl(\\frac{z_{\\alpha/2}}{\\sqrt{t}}\\Bigr)
\\]
<p>Very conservative early (requires huge effects to stop), spends most alpha at the final analysis.
The final critical value is close to the fixed-sample value.</p>

<p><strong>Pocock:</strong></p>
\\[
\\alpha^*_{\\text{Pocock}}(t) = \\alpha \\ln\\bigl(1 + (e - 1)t\\bigr)
\\]
<p>Spends alpha more uniformly across looks, making early stopping easier but requiring a higher
threshold at the final analysis.</p>

<h3>Information Fraction</h3>
<p>The <strong>information fraction</strong> at look \\(k\\) is \\(t_k = n_k / N\\), the proportion of total
planned sample size enrolled. Alpha spending functions are defined as functions of \\(t \\in [0, 1]\\).</p>

<div class="concept-highlight">
<strong>Key Insight:</strong> Adaptive designs trade off <em>statistical efficiency</em> for <em>ethical
and practical benefits</em>: fewer subjects on inferior treatments, earlier conclusions, and potentially
smaller total sample sizes. The price is greater design complexity and the need for careful
pre-specification to maintain Type I error control.
</div>
`,
            visualizations: [
                {
                    id: 'viz-bandit-simulation',
                    title: 'Multi-Armed Bandit: Thompson Sampling',
                    description: 'Watch Thompson sampling learn which arm is best. The true probabilities are hidden but can be revealed. Click "Run" to simulate rounds.',
                    setup: function(container) {
                        const viz = new VizEngine(container, {
                            width: 560, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        const controls = document.createElement('div');
                        controls.className = 'viz-controls';
                        container.appendChild(controls);

                        const K = 4;
                        const trueProbs = [0.3, 0.5, 0.7, 0.45];
                        const armColors = [viz.colors.blue, viz.colors.orange, viz.colors.green, viz.colors.purple];
                        let alphas = new Array(K).fill(1);
                        let betas = new Array(K).fill(1);
                        let pulls = new Array(K).fill(0);
                        let rewards = new Array(K).fill(0);
                        let history = [];
                        let totalRounds = 0;
                        let showTrue = false;
                        let running = false;

                        VizEngine.createButton(controls, 'Run 50 Rounds', () => {
                            if (running) return;
                            running = true;
                            runRounds(50);
                        });
                        VizEngine.createButton(controls, 'Reset', () => {
                            alphas = new Array(K).fill(1);
                            betas = new Array(K).fill(1);
                            pulls = new Array(K).fill(0);
                            rewards = new Array(K).fill(0);
                            history = [];
                            totalRounds = 0;
                            running = false;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Show/Hide True Probs', () => {
                            showTrue = !showTrue;
                            draw();
                        });

                        function sampleBeta(a, b) {
                            // Simple beta sampling via gamma
                            const ga = gammaRV(a);
                            const gb = gammaRV(b);
                            return ga / (ga + gb);
                        }

                        function gammaRV(shape) {
                            // Marsaglia and Tsang method for shape >= 1
                            if (shape < 1) return gammaRV(shape + 1) * Math.pow(Math.random(), 1 / shape);
                            const d = shape - 1 / 3;
                            const c = 1 / Math.sqrt(9 * d);
                            while (true) {
                                let x, v;
                                do {
                                    x = VizEngine.randomNormal();
                                    v = 1 + c * x;
                                } while (v <= 0);
                                v = v * v * v;
                                const u = Math.random();
                                if (u < 1 - 0.0331 * (x * x) * (x * x)) return d * v;
                                if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
                            }
                        }

                        function runRounds(n) {
                            let count = 0;
                            const interval = setInterval(() => {
                                // Thompson sample
                                let samples = [];
                                for (let k = 0; k < K; k++) {
                                    samples.push(sampleBeta(alphas[k], betas[k]));
                                }
                                const chosen = samples.indexOf(Math.max(...samples));
                                const reward = Math.random() < trueProbs[chosen] ? 1 : 0;

                                pulls[chosen]++;
                                rewards[chosen] += reward;
                                if (reward === 1) alphas[chosen]++;
                                else betas[chosen]++;

                                totalRounds++;
                                history.push(chosen);

                                draw();
                                count++;
                                if (count >= n) {
                                    clearInterval(interval);
                                    running = false;
                                }
                            }, 60);
                        }

                        function draw() {
                            const ctx = viz.ctx;
                            viz.clear();

                            const W = viz.width, H = viz.height;

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Thompson Sampling  |  Round: ' + totalRounds, W / 2, 18);

                            // Bar chart: pulls per arm
                            const barAreaTop = 40, barAreaBottom = 200;
                            const barAreaLeft = 40, barAreaRight = W - 20;
                            const barW = (barAreaRight - barAreaLeft) / K - 20;
                            const maxPulls = Math.max(1, ...pulls);

                            for (let k = 0; k < K; k++) {
                                const x = barAreaLeft + k * (barW + 20) + 10;
                                const barH = (pulls[k] / maxPulls) * (barAreaBottom - barAreaTop - 20);

                                ctx.fillStyle = armColors[k] + '66';
                                ctx.fillRect(x, barAreaBottom - barH, barW, barH);
                                ctx.strokeStyle = armColors[k];
                                ctx.lineWidth = 2;
                                ctx.strokeRect(x, barAreaBottom - barH, barW, barH);

                                // Arm label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Arm ' + (k + 1), x + barW / 2, barAreaBottom + 14);
                                ctx.fillText(pulls[k] + ' pulls', x + barW / 2, barAreaBottom + 28);

                                const estProb = pulls[k] > 0 ? (rewards[k] / pulls[k]).toFixed(2) : '?';
                                ctx.fillStyle = armColors[k];
                                ctx.fillText('est: ' + estProb, x + barW / 2, barAreaBottom - barH - 8);

                                if (showTrue) {
                                    ctx.fillStyle = viz.colors.yellow;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.fillText('true: ' + trueProbs[k].toFixed(2), x + barW / 2, barAreaBottom - barH - 22);
                                }
                            }

                            // History: arm selection over time
                            const histTop = 270, histBottom = H - 30;
                            const histLeft = 40, histRight = W - 20;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Arm Selection Over Time', histLeft, histTop - 12);

                            // Y axis labels for arms
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            const armSpacing = (histBottom - histTop) / (K + 1);
                            for (let k = 0; k < K; k++) {
                                const y = histTop + (k + 1) * armSpacing;
                                ctx.fillStyle = armColors[k];
                                ctx.fillText('Arm ' + (k + 1), histLeft - 5, y + 3);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(histLeft, y);
                                ctx.lineTo(histRight, y);
                                ctx.stroke();
                            }

                            // Plot history dots
                            const maxShow = 200;
                            const showHistory = history.slice(-maxShow);
                            const dotSpacing = Math.min(3, (histRight - histLeft) / Math.max(1, showHistory.length));
                            for (let i = 0; i < showHistory.length; i++) {
                                const arm = showHistory[i];
                                const x = histLeft + i * dotSpacing;
                                const y = histTop + (arm + 1) * armSpacing;
                                ctx.fillStyle = armColors[arm];
                                ctx.beginPath();
                                ctx.arc(x, y, 2, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Regret
                            const bestProb = Math.max(...trueProbs);
                            let regret = 0;
                            for (let k = 0; k < K; k++) {
                                regret += pulls[k] * (bestProb - trueProbs[k]);
                            }
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('Cumulative Regret: ' + regret.toFixed(1), W - 20, histTop - 12);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    id: 'ex-adaptive-1',
                    type: 'multiple-choice',
                    question: 'In Thompson sampling with Bernoulli arms, the posterior for each arm is:',
                    options: [
                        'Normal distribution',
                        'Beta distribution',
                        'Gamma distribution',
                        'Uniform distribution'
                    ],
                    correctIndex: 1,
                    explanation: 'Thompson sampling uses a Beta(alpha, beta) posterior for each Bernoulli arm. The Beta distribution is the conjugate prior for the Bernoulli likelihood. After observing s successes and f failures, the posterior is Beta(1+s, 1+f).'
                },
                {
                    id: 'ex-adaptive-2',
                    type: 'multiple-choice',
                    question: 'Compared to O\'Brien-Fleming, the Pocock alpha spending function:',
                    options: [
                        'Spends more alpha early, making early stopping easier',
                        'Spends less alpha early, making early stopping harder',
                        'Spends all alpha at the final analysis',
                        'Does not control the Type I error rate'
                    ],
                    correctIndex: 0,
                    explanation: 'The Pocock spending function distributes alpha more uniformly across interim looks, spending more alpha early. This makes it easier to stop at early looks but requires a higher critical value at the final analysis. O\'Brien-Fleming is very conservative early and spends most alpha at the end.'
                },
                {
                    id: 'ex-adaptive-3',
                    type: 'multiple-choice',
                    question: 'Why does performing multiple interim analyses inflate the Type I error rate if no adjustment is made?',
                    options: [
                        'Because the sample size increases',
                        'Because each look is an opportunity to falsely reject H0, and these opportunities accumulate',
                        'Because the effect size changes over time',
                        'Because Bayesian methods are used'
                    ],
                    correctIndex: 1,
                    explanation: 'Under H0, at each look there is a chance of crossing the rejection boundary. With K looks at alpha = 0.05 each, the overall probability of falsely rejecting at some point exceeds 0.05. The alpha spending approach divides the overall alpha budget across looks to control the overall Type I error.'
                },
                {
                    id: 'ex-adaptive-4',
                    type: 'short-answer',
                    question: 'If a multi-armed bandit has 3 arms with true means 0.2, 0.5, and 0.8, and arm 1 is pulled 100 times, what is the regret contribution from arm 1? (Enter a number.)',
                    answer: '60',
                    explanation: 'Regret from arm 1 = pulls * (best_mean - arm_mean) = 100 * (0.8 - 0.2) = 100 * 0.6 = 60.'
                }
            ]
        },

        // ============================================================
        // Section 4: Encouragement Designs
        // ============================================================
        {
            id: 'encouragement-designs',
            title: 'Encouragement Designs',
            content: `
<h2>Encouragement Designs</h2>

<h3>When Forced Treatment is Unethical</h3>
<p>Sometimes we cannot ethically or practically <em>force</em> subjects to take a treatment.
For example, we cannot force people to exercise, attend job training, or take a medication
they refuse. In such settings, we can <strong>encourage</strong> treatment uptake.</p>

<h3>The Setup</h3>
<p>In an encouragement design:</p>
<ul>
<li>\\(Z_i \\in \\{0, 1\\}\\) = randomly assigned encouragement</li>
<li>\\(D_i \\in \\{0, 1\\}\\) = actual treatment received (endogenous)</li>
<li>\\(Y_i\\) = outcome</li>
</ul>

<p>Randomization determines \\(Z\\), but subjects choose \\(D\\). The encouragement \\(Z\\)
serves as an <strong>instrumental variable</strong> for \\(D\\).</p>

<h3>Compliance Strata</h3>
<p>Following the potential outcomes framework with \\(D_i(z)\\) denoting the treatment subject \\(i\\)
would take under assignment \\(z\\), we define four compliance types:</p>

\\[
\\begin{array}{lcc}
\\text{Type} & D(0) & D(1) \\\\
\\hline
\\text{Complier} & 0 & 1 \\\\
\\text{Always-taker} & 1 & 1 \\\\
\\text{Never-taker} & 0 & 0 \\\\
\\text{Defier} & 1 & 0
\\end{array}
\\]

<h3>Intent-to-Treat (ITT)</h3>
<p>The <strong>ITT effect</strong> compares outcomes by assignment regardless of compliance:</p>

\\[
\\text{ITT} = E[Y_i | Z_i = 1] - E[Y_i | Z_i = 0]
\\]

<p>The ITT is always identified by randomization and is a valid causal effect of <em>assignment</em>
(not treatment). It is often a <strong>diluted</strong> version of the treatment effect because not
everyone complies.</p>

<h3>Local Average Treatment Effect (LATE)</h3>
<p>Under the <strong>monotonicity</strong> assumption (no defiers), the LATE — also called the
<strong>Complier Average Causal Effect (CACE)</strong> — is:</p>

\\[
\\text{LATE} = \\frac{\\text{ITT}}{\\text{ITT}_D} = \\frac{E[Y|Z=1] - E[Y|Z=0]}{E[D|Z=1] - E[D|Z=0]}
\\]

<p>where \\(\\text{ITT}_D = E[D|Z=1] - E[D|Z=0]\\) is the first-stage effect of encouragement
on treatment take-up. The LATE identifies the average treatment effect <strong>for compliers only</strong>.</p>

<h3>Assumptions</h3>
<p>LATE identification requires:</p>
<ol>
<li><strong>Relevance:</strong> \\(\\text{ITT}_D \\neq 0\\) (encouragement affects take-up)</li>
<li><strong>Independence:</strong> \\(Z \\perp\\!\\!\\perp (Y(d,z), D(z))\\) (randomization)</li>
<li><strong>Exclusion restriction:</strong> \\(Y_i(d, 0) = Y_i(d, 1)\\) for all \\(d\\) (encouragement affects
outcome only through treatment)</li>
<li><strong>Monotonicity:</strong> \\(D_i(1) \\geq D_i(0)\\) for all \\(i\\) (no defiers)</li>
</ol>

<h3>Example: The JOBS II Study</h3>
<p>The JOBS II study (Vinokur et al., 1995) evaluated a job-training program for unemployed workers:</p>
<ul>
<li><strong>\\(Z\\)</strong> = randomly invited to attend training sessions</li>
<li><strong>\\(D\\)</strong> = actually attended training</li>
<li><strong>\\(Y\\)</strong> = employment and mental health outcomes</li>
</ul>
<p>About 60% of those invited actually attended (compliers). The ITT showed a modest positive effect;
the LATE (for compliers) was roughly \\(60\\%\\) larger, since it removes the dilution from non-compliers.</p>

<div class="concept-highlight">
<strong>Key Insight:</strong> The encouragement design is a workhorse for ethical experimentation
when compliance cannot be enforced. The ITT tells us the "policy effect" (what happens if we
encourage everyone), while the LATE tells us the "treatment effect for those who respond to
encouragement." These are different quantities answering different questions.
</div>
`,
            visualizations: [
                {
                    id: 'viz-encouragement-dag',
                    title: 'Encouragement Design: DAG & Compliance Strata',
                    description: 'Visualize the causal structure and compliance strata in an encouragement design. Adjust the compliance rate to see how ITT and LATE relate.',
                    setup: function(container) {
                        const viz = new VizEngine(container, {
                            width: 560, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        const controls = document.createElement('div');
                        controls.className = 'viz-controls';
                        container.appendChild(controls);

                        let complianceRate = 0.6;
                        let trueEffect = 2.0;

                        VizEngine.createSlider(controls, 'Compliance Rate', 0.1, 1.0, complianceRate, 0.05, v => {
                            complianceRate = v;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'True LATE', 0.0, 5.0, trueEffect, 0.1, v => {
                            trueEffect = v;
                            draw();
                        });

                        function draw() {
                            const ctx = viz.ctx;
                            viz.clear();

                            const W = viz.width, H = viz.height;

                            // === DAG Section (top half) ===
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Encouragement Design DAG', W / 2, 18);

                            // DAG nodes
                            const nodeR = 28;
                            const dagY = 90;
                            const zX = 110, dX = 280, yX = 450;
                            const uX = 365, uY = dagY - 55;

                            // Draw nodes
                            const drawNode = (x, y, label, color) => {
                                ctx.beginPath();
                                ctx.arc(x, y, nodeR, 0, Math.PI * 2);
                                ctx.fillStyle = color + '33';
                                ctx.fill();
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 2;
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(label, x, y);
                            };

                            drawNode(zX, dagY, 'Z', viz.colors.blue);
                            drawNode(dX, dagY, 'D', viz.colors.orange);
                            drawNode(yX, dagY, 'Y', viz.colors.green);
                            drawNode(uX, uY, 'U', viz.colors.red);

                            // Arrows
                            const drawArrow = (x1, y1, x2, y2, color, dashed) => {
                                const dx = x2 - x1, dy = y2 - y1;
                                const len = Math.sqrt(dx * dx + dy * dy);
                                const ux = dx / len, uy = dy / len;
                                const sx = x1 + ux * nodeR, sy = y1 + uy * nodeR;
                                const ex = x2 - ux * (nodeR + 8), ey = y2 - uy * (nodeR + 8);

                                ctx.strokeStyle = color;
                                ctx.lineWidth = 2;
                                if (dashed) ctx.setLineDash([5, 4]);
                                ctx.beginPath();
                                ctx.moveTo(sx, sy);
                                ctx.lineTo(ex, ey);
                                ctx.stroke();
                                if (dashed) ctx.setLineDash([]);

                                // Arrowhead
                                const angle = Math.atan2(ey - sy, ex - sx);
                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.moveTo(x2 - ux * nodeR, y2 - uy * nodeR);
                                ctx.lineTo(x2 - ux * nodeR - 10 * Math.cos(angle - 0.4), y2 - uy * nodeR - 10 * Math.sin(angle - 0.4));
                                ctx.lineTo(x2 - ux * nodeR - 10 * Math.cos(angle + 0.4), y2 - uy * nodeR - 10 * Math.sin(angle + 0.4));
                                ctx.closePath();
                                ctx.fill();
                            };

                            drawArrow(zX, dagY, dX, dagY, viz.colors.blue, false);
                            drawArrow(dX, dagY, yX, dagY, viz.colors.orange, false);
                            drawArrow(uX, uY, dX, dagY, viz.colors.red, true);
                            drawArrow(uX, uY, yX, dagY, viz.colors.red, true);

                            // Edge labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('encourages', (zX + dX) / 2, dagY - 8);
                            ctx.fillText('causes', (dX + yX) / 2, dagY - 8);
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillText('confounds', uX - 45, uY + 5);

                            // Node descriptions
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('(randomized)', zX, dagY + nodeR + 5);
                            ctx.fillText('(endogenous)', dX, dagY + nodeR + 5);
                            ctx.fillText('(outcome)', yX, dagY + nodeR + 5);

                            // === Compliance Strata (middle) ===
                            const strataY = 180;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Compliance Strata (assuming no defiers)', 20, strataY);

                            const barTop = strataY + 20;
                            const barHeight = 30;
                            const barLeft = 20, barRight = W - 20;
                            const totalW = barRight - barLeft;

                            // Complier bar
                            const compW = totalW * complianceRate;
                            ctx.fillStyle = viz.colors.green + '66';
                            ctx.fillRect(barLeft, barTop, compW, barHeight);
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 1.5;
                            ctx.strokeRect(barLeft, barTop, compW, barHeight);

                            // Never-taker bar (assume rest are never-takers for simplicity)
                            const ntW = totalW * (1 - complianceRate);
                            ctx.fillStyle = viz.colors.text + '33';
                            ctx.fillRect(barLeft + compW, barTop, ntW, barHeight);
                            ctx.strokeStyle = viz.colors.text;
                            ctx.strokeRect(barLeft + compW, barTop, ntW, barHeight);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            if (compW > 80) ctx.fillText('Compliers (' + (complianceRate * 100).toFixed(0) + '%)', barLeft + compW / 2, barTop + barHeight / 2);
                            if (ntW > 80) ctx.fillText('Never-takers (' + ((1 - complianceRate) * 100).toFixed(0) + '%)', barLeft + compW + ntW / 2, barTop + barHeight / 2);

                            // === ITT vs LATE comparison (bottom) ===
                            const compY = barTop + barHeight + 40;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('ITT vs LATE', 20, compY);

                            const itt = trueEffect * complianceRate;
                            const late = trueEffect;

                            // Bar chart
                            const effBarLeft = 100, effBarTop = compY + 25;
                            const maxEff = 5.5;
                            const effScale = (W - effBarLeft - 40) / maxEff;

                            // ITT bar
                            ctx.fillStyle = viz.colors.teal + '66';
                            ctx.fillRect(effBarLeft, effBarTop, Math.max(0, itt * effScale), 28);
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1.5;
                            ctx.strokeRect(effBarLeft, effBarTop, Math.max(0, itt * effScale), 28);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('ITT', effBarLeft - 10, effBarTop + 14);
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText(itt.toFixed(2), effBarLeft + Math.max(0, itt * effScale) + 6, effBarTop + 14);

                            // LATE bar
                            const lateBarTop = effBarTop + 38;
                            ctx.fillStyle = viz.colors.orange + '66';
                            ctx.fillRect(effBarLeft, lateBarTop, Math.max(0, late * effScale), 28);
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.strokeRect(effBarLeft, lateBarTop, Math.max(0, late * effScale), 28);
                            ctx.fillStyle = viz.colors.white;
                            ctx.textAlign = 'right';
                            ctx.fillText('LATE', effBarLeft - 10, lateBarTop + 14);
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText(late.toFixed(2), effBarLeft + Math.max(0, late * effScale) + 6, lateBarTop + 14);

                            // Formula
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('LATE = ITT / compliance rate = ' + itt.toFixed(2) + ' / ' + complianceRate.toFixed(2) + ' = ' + late.toFixed(2), W / 2, lateBarTop + 50);

                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Lower compliance = more diluted ITT = larger LATE/ITT gap', W / 2, lateBarTop + 68);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    id: 'ex-encourage-1',
                    type: 'multiple-choice',
                    question: 'In an encouragement design, the "exclusion restriction" means:',
                    options: [
                        'The encouragement must be randomly assigned',
                        'The encouragement affects the outcome only through its effect on treatment take-up',
                        'There are no always-takers in the population',
                        'The treatment effect is constant across all subjects'
                    ],
                    correctIndex: 1,
                    explanation: 'The exclusion restriction states that encouragement Z affects Y only through D. That is, Y(d,0) = Y(d,1) for all d. If encouragement directly affects outcomes (e.g., the invitation letter itself motivates people), this assumption is violated.'
                },
                {
                    id: 'ex-encourage-2',
                    type: 'multiple-choice',
                    question: 'If the ITT effect is 1.5 and the first-stage effect (compliance rate) is 0.5, the LATE is:',
                    options: ['0.75', '1.5', '2.0', '3.0'],
                    correctIndex: 3,
                    explanation: 'LATE = ITT / ITT_D = 1.5 / 0.5 = 3.0. The LATE "rescales" the diluted ITT by dividing by the fraction of compliers, recovering the treatment effect for those who actually comply.'
                },
                {
                    id: 'ex-encourage-3',
                    type: 'multiple-choice',
                    question: 'Which compliance type is ruled out by the monotonicity assumption?',
                    options: ['Compliers', 'Always-takers', 'Never-takers', 'Defiers'],
                    correctIndex: 3,
                    explanation: 'Monotonicity requires D(1) >= D(0) for all subjects, meaning no one does the opposite of their assignment. Defiers (who take treatment when not encouraged but refuse when encouraged) are ruled out. Without monotonicity, the LATE is not point-identified.'
                }
            ]
        },

        // ============================================================
        // Section 5: Regression Adjustment in Experiments
        // ============================================================
        {
            id: 'regression-adjustment',
            title: 'Regression Adjustment in Experiments',
            content: `
<h2>Regression Adjustment in Experiments</h2>

<h3>The Promise of Covariate Adjustment</h3>
<p>Even in a perfectly randomized experiment, baseline covariates \\(X_i\\) can explain variation
in outcomes. Using them in the analysis can <strong>reduce variance</strong> and tighten confidence
intervals, without introducing bias (if done correctly).</p>

<h3>Simple Difference in Means</h3>
<p>The classic estimator is the <strong>difference in means</strong>:</p>

\\[
\\hat{\\tau}_{\\text{DM}} = \\bar{Y}_1 - \\bar{Y}_0
\\]

<p>This is unbiased for the ATE under randomization, with variance:</p>

\\[
\\text{Var}(\\hat{\\tau}_{\\text{DM}}) = \\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_0^2}{n_0}
\\]

<h3>ANCOVA: Analysis of Covariance</h3>
<p>ANCOVA adds baseline covariates to the regression:</p>

\\[
Y_i = \\alpha + \\tau W_i + X_i'\\beta + \\varepsilon_i
\\]

<p>where \\(W_i\\) is the treatment indicator. If \\(X_i\\) predicts \\(Y_i\\), this reduces
residual variance and hence the variance of \\(\\hat{\\tau}\\). The reduction is approximately:</p>

\\[
\\text{Var}(\\hat{\\tau}_{\\text{ANCOVA}}) \\approx (1 - R^2_{Y \\sim X}) \\cdot \\text{Var}(\\hat{\\tau}_{\\text{DM}})
\\]

<p>where \\(R^2_{Y \\sim X}\\) is the R-squared from regressing \\(Y\\) on \\(X\\) alone.</p>

<h3>Freedman's (2008) Critique</h3>
<p>David Freedman showed that standard ANCOVA with OLS can be <strong>asymptotically biased</strong>
for the ATE in finite-population settings when treatment effects are heterogeneous. The bias
arises because the restricted model assumes the same \\(\\beta\\) coefficients in both treatment
and control groups.</p>

<h3>Lin's (2013) Resolution</h3>
<p>Winston Lin proposed a simple fix: use the <strong>fully interacted specification</strong>:</p>

\\[
Y_i = \\alpha + \\tau W_i + \\tilde{X}_i'\\beta + W_i \\cdot \\tilde{X}_i'\\gamma + \\varepsilon_i
\\]

<p>where \\(\\tilde{X}_i = X_i - \\bar{X}\\) is the demeaned covariate. Key properties:</p>
<ul>
<li>Consistent for the ATE even with heterogeneous treatment effects</li>
<li>At least as efficient as the unadjusted estimator (asymptotically)</li>
<li>Equivalent to running separate regressions in treatment and control groups</li>
<li>The coefficient \\(\\hat{\\tau}\\) has the same probability limit as the simple difference
in means, but with (weakly) smaller asymptotic variance</li>
</ul>

<h3>Why Demean?</h3>
<p>Demeaning \\(X_i\\) ensures that the treatment coefficient \\(\\hat{\\tau}\\) estimates the ATE
at the sample mean of covariates. Without demeaning, \\(\\hat{\\tau}\\) estimates the effect at
\\(X = 0\\), which may be outside the support of the data.</p>

<h3>Practical Guidance</h3>
<p>Modern best practice for randomized experiments recommends:</p>
<ol>
<li><strong>Pre-specify</strong> the set of covariates for adjustment (to avoid p-hacking)</li>
<li>Use <strong>Lin's fully interacted estimator</strong> for point estimates</li>
<li>Use <strong>HC2 or HC3 robust standard errors</strong> (not classical OLS SEs)</li>
<li>Report both adjusted and unadjusted estimates as a robustness check</li>
</ol>

<div class="concept-highlight">
<strong>Key Insight:</strong> Regression adjustment in experiments is "free lunch" in terms of
precision: you can only gain (not lose) efficiency asymptotically by adjusting for pre-treatment
covariates. Lin's fully interacted estimator resolves Freedman's concerns while preserving the
variance reduction benefits of ANCOVA. The key is to use robust standard errors and pre-specify
covariates.
</div>
`,
            visualizations: [
                {
                    id: 'viz-regression-adjustment',
                    title: 'CI Width: With vs Without Regression Adjustment',
                    description: 'Compare confidence interval width for the ATE with and without covariate adjustment. Adjust R-squared to see how predictive covariates reduce uncertainty.',
                    setup: function(container) {
                        const viz = new VizEngine(container, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        const controls = document.createElement('div');
                        controls.className = 'viz-controls';
                        container.appendChild(controls);

                        let rSquared = 0.4;
                        let sampleSize = 200;
                        let sigma = 2.0;
                        const trueATE = 1.0;

                        VizEngine.createSlider(controls, 'R-squared (Y~X)', 0, 0.95, rSquared, 0.05, v => {
                            rSquared = v;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Sample Size (N)', 50, 1000, sampleSize, 10, v => {
                            sampleSize = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Outcome SD', 0.5, 5.0, sigma, 0.1, v => {
                            sigma = v;
                            draw();
                        });

                        function draw() {
                            const ctx = viz.ctx;
                            viz.clear();

                            const W = viz.width, H = viz.height;

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Confidence Interval Width: Unadjusted vs Adjusted', W / 2, 18);

                            // Compute SEs
                            const n1 = Math.floor(sampleSize / 2);
                            const n0 = sampleSize - n1;
                            const seUnadj = sigma * Math.sqrt(1 / n1 + 1 / n0);
                            const seAdj = sigma * Math.sqrt((1 - rSquared) * (1 / n1 + 1 / n0));
                            const ciUnadj = 1.96 * seUnadj;
                            const ciAdj = 1.96 * seAdj;

                            // Plotting area
                            const plotLeft = 60, plotRight = W - 40;
                            const plotMid = (plotLeft + plotRight) / 2;
                            const plotW = plotRight - plotLeft;
                            const maxCI = sigma * Math.sqrt(1 / 25 + 1 / 25) * 1.96 * 1.1;
                            const effScale = plotW / 2 / maxCI;

                            // Unadjusted CI
                            const unadjY = 120;
                            const adjY = 220;

                            // Helper to draw CI
                            const drawCI = (y, ci, color, label) => {
                                const left = plotMid - ci * effScale;
                                const right = plotMid + ci * effScale;

                                // CI band
                                ctx.fillStyle = color + '33';
                                ctx.fillRect(left, y - 15, right - left, 30);
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(left, y - 15, right - left, 30);

                                // Center line (point estimate)
                                ctx.strokeStyle = viz.colors.white;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(plotMid, y - 15);
                                ctx.lineTo(plotMid, y + 15);
                                ctx.stroke();

                                // Center dot
                                ctx.fillStyle = viz.colors.white;
                                ctx.beginPath();
                                ctx.arc(plotMid, y, 4, 0, Math.PI * 2);
                                ctx.fill();

                                // Label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(label, plotLeft - 10, y);

                                // Width annotation
                                ctx.fillStyle = color;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('width = ' + (2 * ci).toFixed(3), plotMid, y + 20);
                            };

                            drawCI(unadjY, ciUnadj, viz.colors.blue, 'Unadjusted');
                            drawCI(adjY, ciAdj, viz.colors.green, 'Adjusted');

                            // Reference line at true ATE
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(plotMid, 70);
                            ctx.lineTo(plotMid, 260);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('ATE = ' + trueATE.toFixed(1), plotMid, 70);

                            // Summary statistics
                            const summY = 300;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Summary', 40, summY);

                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('SE (unadjusted): ' + seUnadj.toFixed(4), 40, summY + 22);
                            ctx.fillText('SE (adjusted):     ' + seAdj.toFixed(4), 40, summY + 42);

                            const reduction = ((1 - seAdj / seUnadj) * 100).toFixed(1);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('SE reduction: ' + reduction + '%', 40, summY + 62);

                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Effective sample size multiplier: ' + (1 / (1 - rSquared)).toFixed(2) + 'x', 40, summY + 82);

                            // Right side: variance decomposition pie
                            const pieX = W - 120, pieY = summY + 40, pieR = 45;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Variance Decomposition', pieX, summY);

                            // Explained portion
                            const explAngle = rSquared * 2 * Math.PI;
                            ctx.fillStyle = viz.colors.green + '88';
                            ctx.beginPath();
                            ctx.moveTo(pieX, pieY);
                            ctx.arc(pieX, pieY, pieR, -Math.PI / 2, -Math.PI / 2 + explAngle);
                            ctx.closePath();
                            ctx.fill();

                            // Unexplained portion
                            ctx.fillStyle = viz.colors.blue + '44';
                            ctx.beginPath();
                            ctx.moveTo(pieX, pieY);
                            ctx.arc(pieX, pieY, pieR, -Math.PI / 2 + explAngle, -Math.PI / 2 + 2 * Math.PI);
                            ctx.closePath();
                            ctx.fill();

                            ctx.strokeStyle = viz.colors.text;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(pieX, pieY, pieR, 0, Math.PI * 2);
                            ctx.stroke();

                            // Legend
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Explained by X (' + (rSquared * 100).toFixed(0) + '%)', pieX - pieR, pieY + pieR + 15);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('Residual (' + ((1 - rSquared) * 100).toFixed(0) + '%)', pieX - pieR, pieY + pieR + 30);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    id: 'ex-regadj-1',
                    type: 'multiple-choice',
                    question: 'If the R-squared of Y on X is 0.64, the variance of the adjusted estimator is approximately what fraction of the unadjusted variance?',
                    options: ['0.36', '0.64', '0.80', '1.28'],
                    correctIndex: 0,
                    explanation: 'Var(adjusted) is approximately (1 - R^2) * Var(unadjusted) = (1 - 0.64) * Var(unadjusted) = 0.36 * Var(unadjusted). The adjusted estimator has only 36% of the original variance.'
                },
                {
                    id: 'ex-regadj-2',
                    type: 'multiple-choice',
                    question: 'Freedman (2008) showed that standard ANCOVA can be biased when:',
                    options: [
                        'The sample size is too large',
                        'Treatment effects are heterogeneous and the model restricts coefficients to be equal across groups',
                        'Covariates are randomized',
                        'The outcome is binary'
                    ],
                    correctIndex: 1,
                    explanation: 'Freedman showed that when treatment effects are heterogeneous, the restricted ANCOVA model (same slope in both groups) can produce asymptotically biased estimates of the ATE. The bias comes from misspecification of the covariate relationship across treatment groups.'
                },
                {
                    id: 'ex-regadj-3',
                    type: 'multiple-choice',
                    question: 'In Lin\'s fully interacted estimator, covariates are demeaned because:',
                    options: [
                        'It makes the computation faster',
                        'It ensures the treatment coefficient estimates the ATE at the sample mean of X',
                        'It removes all confounding',
                        'It makes the residuals normally distributed'
                    ],
                    correctIndex: 1,
                    explanation: 'Demeaning X ensures that the coefficient on W (treatment) in the interacted model estimates the ATE evaluated at the sample mean of X. Without demeaning, the coefficient estimates the effect at X=0, which may not be meaningful or even in the data support.'
                },
                {
                    id: 'ex-regadj-4',
                    type: 'short-answer',
                    question: 'If the unadjusted SE of the ATE is 0.50 and R-squared of Y on X is 0.75, what is the approximate adjusted SE? (Enter a number with 2 decimal places.)',
                    answer: '0.25',
                    explanation: 'SE(adjusted) = SE(unadjusted) * sqrt(1 - R^2) = 0.50 * sqrt(1 - 0.75) = 0.50 * sqrt(0.25) = 0.50 * 0.50 = 0.25.'
                }
            ]
        }
    ]
});
