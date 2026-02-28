// Chapter 4: do-Calculus & Identification — From Graphs to Causal Effects
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch04',
    number: 4,
    title: 'do-Calculus & Identification',
    subtitle: 'From Graphs to Causal Effects',
    sections: [
        // ── Section 1: The Three Rules of do-Calculus ──
        {
            id: 'ch04-sec01',
            title: 'The Three Rules of do-Calculus',
            content: `<h2>The Three Rules of do-Calculus</h2>

<p>Pearl's do-calculus provides three inference rules that allow us to manipulate expressions involving the \\(do(\\cdot)\\) operator. Together they form a <em>complete</em> system for identifying causal effects from observational data, given a causal DAG.</p>

<div class="env-block definition"><div class="env-title">Setup</div><div class="env-body">
<p>Let \\(G\\) be a causal DAG over variables \\(V\\). For disjoint subsets \\(X, Y, Z, W \\subseteq V\\), let:</p>
<ul>
<li>\\(G_{\\overline{X}}\\) denote the graph with all incoming edges to \\(X\\) removed (mutilated graph / graph surgery on \\(X\\)).</li>
<li>\\(G_{\\underline{X}}\\) denote the graph with all outgoing edges from \\(X\\) removed.</li>
<li>\\(G_{\\overline{X}\\underline{Z}}\\) denote both operations applied simultaneously.</li>
</ul>
</div></div>

<div class="env-block theorem"><div class="env-title">Rule 1 — Insertion/Deletion of Observations</div><div class="env-body">
<p>If \\((Y \\perp\\!\\!\\!\\perp Z \\mid X, W)_{G_{\\overline{X}}}\\), then:</p>
\\[P(y \\mid do(x), z, w) = P(y \\mid do(x), w)\\]
<p><strong>Intuition:</strong> If \\(Z\\) is d-separated from \\(Y\\) by \\(X \\cup W\\) in the manipulated graph \\(G_{\\overline{X}}\\), then observing \\(Z\\) adds no information about \\(Y\\) beyond what \\(do(x)\\) and \\(W\\) already provide.</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Rule 2 — Action/Observation Exchange</div><div class="env-body">
<p>If \\((Y \\perp\\!\\!\\!\\perp Z \\mid X, W)_{G_{\\overline{X}\\underline{Z}}}\\), then:</p>
\\[P(y \\mid do(x), do(z), w) = P(y \\mid do(x), z, w)\\]
<p><strong>Intuition:</strong> If \\(Z\\) satisfies this d-separation condition, then intervening on \\(Z\\) has the same effect as merely observing \\(Z\\). In other words, the causal effect of \\(Z\\) on \\(Y\\) is blocked by \\(X \\cup W\\) in the modified graph, so we can replace \\(do(z)\\) with observation.</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Rule 3 — Insertion/Deletion of Actions</div><div class="env-body">
<p>If \\((Y \\perp\\!\\!\\!\\perp Z \\mid X, W)_{G_{\\overline{X}\\overline{Z(S)}}}\\), where \\(Z(S)\\) denotes the set of \\(Z\\)-nodes that are not ancestors of any \\(W\\)-node in \\(G_{\\overline{X}}\\), then:</p>
\\[P(y \\mid do(x), do(z), w) = P(y \\mid do(x), w)\\]
<p><strong>Intuition:</strong> If \\(Z\\) has no causal path to \\(Y\\) that is not blocked, then the intervention \\(do(z)\\) has no effect on \\(Y\\), and can be removed entirely.</p>
</div></div>

<div class="env-block example"><div class="env-title">Example: Front-Door Criterion via do-Calculus</div><div class="env-body">
<p>Consider the classic front-door DAG: \\(X \\to M \\to Y\\) with an unobserved confounder \\(U\\) such that \\(U \\to X\\) and \\(U \\to Y\\). We want \\(P(y \\mid do(x))\\).</p>
<p>Step 1 (Rule 2): Since \\((M \\perp\\!\\!\\!\\perp X)_{G_{\\underline{X}}}\\), we have \\(P(m \\mid do(x)) = P(m \\mid x)\\).</p>
<p>Step 2 (Rule 2 + Rule 3): We derive \\(P(y \\mid do(m)) = \\sum_x P(y \\mid m, x) P(x)\\).</p>
<p>Step 3 (Combine):</p>
\\[P(y \\mid do(x)) = \\sum_m P(m \\mid x) \\sum_{x'} P(y \\mid m, x') P(x')\\]
<p>This is the front-door formula, derived purely from do-calculus rules!</p>
</div></div>

<div class="viz-placeholder" data-viz="ch04-viz-do-rules"></div>

<div class="env-block remark"><div class="env-title">Remark</div><div class="env-body">
<p>The three rules are syntactic transformations. Their power lies in the fact that, given any causal DAG, repeated application can reduce any identifiable interventional distribution to an expression involving only observational quantities.</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch04-viz-do-rules',
                    title: 'Animated Rule Application on Example DAGs',
                    description: 'Visualize the three rules of do-calculus applied to example DAGs with graph surgery',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        var currentRule = 1;
                        var animT = 0;
                        var showSurgery = false;

                        // DAG nodes for each rule example
                        var dags = {
                            1: {
                                label: 'Rule 1: Insertion/Deletion of Observations',
                                nodes: {X:{x:100,y:100,name:'X'},Z:{x:350,y:100,name:'Z'},Y:{x:350,y:300,name:'Y'},W:{x:100,y:300,name:'W'}},
                                edges: [['X','W'],['W','Y'],['X','Z'],['Z','Y']],
                                surgery: 'X',
                                dsep: 'Y \\u22A5\\u22A5 Z | X, W  in G_X\\u0305',
                                result: 'P(y|do(x),z,w) = P(y|do(x),w)'
                            },
                            2: {
                                label: 'Rule 2: Action/Observation Exchange',
                                nodes: {X:{x:100,y:200,name:'X'},Z:{x:350,y:100,name:'Z'},Y:{x:350,y:300,name:'Y'},M:{x:225,y:200,name:'M'}},
                                edges: [['X','M'],['M','Y'],['Z','M'],['Z','Y']],
                                surgery: 'X,Z',
                                dsep: 'Y \\u22A5\\u22A5 Z | X, M  in G_X\\u0305_Z',
                                result: 'P(y|do(x),do(z),w) = P(y|do(x),z,w)'
                            },
                            3: {
                                label: 'Rule 3: Insertion/Deletion of Actions',
                                nodes: {X:{x:100,y:100,name:'X'},Z:{x:350,y:100,name:'Z'},Y:{x:225,y:300,name:'Y'}},
                                edges: [['X','Y'],['Z','X']],
                                surgery: 'X,Z',
                                dsep: 'Y \\u22A5\\u22A5 Z | X  in G_X\\u0305 Z\\u0305',
                                result: 'P(y|do(x),do(z)) = P(y|do(x))'
                            }
                        };

                        // Front-door DAG for combined example
                        var frontDoor = {
                            label: 'Front-Door Example',
                            nodes: {X:{x:100,y:200,name:'X'},M:{x:300,y:200,name:'M'},Y:{x:500,y:200,name:'Y'},U:{x:300,y:60,name:'U'}},
                            edges: [['X','M'],['M','Y'],['U','X'],['U','Y']],
                            uEdges: [['U','X'],['U','Y']],
                            result: 'P(y|do(x)) = \\u03A3_m P(m|x) \\u03A3_{x\'} P(y|m,x\')P(x\')'
                        };

                        function drawArrow(fromX, fromY, toX, toY, color, dashed, lw) {
                            var dx = toX - fromX, dy = toY - fromY;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            var headLen = 12;
                            var endX = toX - ux * 22, endY = toY - uy * 22;
                            var startX = fromX + ux * 22, startY = fromY + uy * 22;

                            ctx.strokeStyle = color;
                            ctx.lineWidth = lw || 2;
                            if (dashed) ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                            ctx.stroke();
                            if (dashed) ctx.setLineDash([]);

                            var angle = Math.atan2(endY - startY, endX - startX);
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.moveTo(endX + ux * 4, endY + uy * 4);
                            ctx.lineTo(endX - headLen * Math.cos(angle - 0.35), endY - headLen * Math.sin(angle - 0.35));
                            ctx.lineTo(endX - headLen * Math.cos(angle + 0.35), endY - headLen * Math.sin(angle + 0.35));
                            ctx.closePath();
                            ctx.fill();
                        }

                        function drawNode(x, y, name, color, highlight) {
                            ctx.beginPath();
                            ctx.arc(x, y, 20, 0, Math.PI * 2);
                            ctx.fillStyle = highlight ? color : '#1a1a40';
                            ctx.fill();
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 2.5;
                            ctx.stroke();
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(name, x, y);
                        }

                        function drawDAG(dag, ox, oy, showCut) {
                            var nodes = dag.nodes;
                            var edges = dag.edges;
                            for (var i = 0; i < edges.length; i++) {
                                var from = nodes[edges[i][0]];
                                var to = nodes[edges[i][1]];
                                var isCut = false;
                                if (showCut && dag.surgery) {
                                    var surgeryNodes = dag.surgery.split(',');
                                    if (surgeryNodes.indexOf(edges[i][1]) >= 0) {
                                        isCut = true;
                                    }
                                }
                                var isU = dag.uEdges && dag.uEdges.some(function(e) {
                                    return e[0] === edges[i][0] && e[1] === edges[i][1];
                                });
                                var edgeColor = isCut ? '#f8514966' : (isU ? '#d29922' : '#58a6ff');
                                drawArrow(from.x + ox, from.y + oy, to.x + ox, to.y + oy, edgeColor, isCut || isU, isCut ? 1.5 : 2);
                                if (isCut) {
                                    var mx = (from.x + ox + to.x + ox) / 2;
                                    var my = (from.y + oy + to.y + oy) / 2;
                                    ctx.strokeStyle = '#f85149';
                                    ctx.lineWidth = 3;
                                    ctx.beginPath();
                                    ctx.moveTo(mx - 8, my - 8);
                                    ctx.lineTo(mx + 8, my + 8);
                                    ctx.stroke();
                                    ctx.beginPath();
                                    ctx.moveTo(mx + 8, my - 8);
                                    ctx.lineTo(mx - 8, my + 8);
                                    ctx.stroke();
                                }
                            }
                            var nodeKeys = Object.keys(nodes);
                            for (var j = 0; j < nodeKeys.length; j++) {
                                var n = nodes[nodeKeys[j]];
                                var isIntervened = dag.surgery && dag.surgery.split(',').indexOf(nodeKeys[j]) >= 0;
                                drawNode(n.x + ox, n.y + oy, n.name, isIntervened && showCut ? '#f0883e' : (nodeKeys[j] === 'U' ? '#d29922' : '#58a6ff'), false);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var dag;
                            var ox = 80, oy = 40;

                            if (currentRule <= 3) {
                                dag = dags[currentRule];
                                // Title
                                ctx.fillStyle = '#f0f6fc';
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(dag.label, W / 2, 25);

                                // Draw original DAG on left
                                ctx.fillStyle = '#8b949e';
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.fillText('Original DAG G', 190, oy + 10);
                                drawDAG(dag, ox, oy + 20, false);

                                // Draw mutilated DAG on right
                                ctx.fillStyle = '#8b949e';
                                ctx.fillText('Mutilated Graph', 510, oy + 10);
                                drawDAG(dag, ox + 310, oy + 20, true);

                                // d-separation condition
                                ctx.fillStyle = '#3fb9a0';
                                ctx.font = '14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('d-separation: ' + dag.dsep, W / 2, H - 60);

                                // Result
                                ctx.fillStyle = '#bc8cff';
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.fillText(dag.result, W / 2, H - 30);
                            } else {
                                // Front-door example
                                ctx.fillStyle = '#f0f6fc';
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Front-Door Criterion: Combining All Three Rules', W / 2, 25);

                                drawDAG(frontDoor, ox, oy + 30, false);

                                ctx.fillStyle = '#d29922';
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('U is unobserved (dashed edges)', W / 2, oy + 50);

                                // Steps
                                var steps = [
                                    'Step 1 (Rule 2): P(m|do(x)) = P(m|x)',
                                    'Step 2 (Rule 2+3): P(y|do(m)) = \\u03A3_x P(y|m,x)P(x)',
                                    'Step 3 (Combine): P(y|do(x)) = \\u03A3_m P(m|x) \\u03A3_{x\'} P(y|m,x\')P(x\')'
                                ];
                                ctx.textAlign = 'left';
                                for (var s = 0; s < steps.length; s++) {
                                    ctx.fillStyle = s === 2 ? '#bc8cff' : '#8b949e';
                                    ctx.font = (s === 2 ? 'bold ' : '') + '13px -apple-system,sans-serif';
                                    ctx.fillText(steps[s], 60, H - 120 + s * 30);
                                }
                            }
                        }

                        var ruleNames = ['Rule 1', 'Rule 2', 'Rule 3', 'Front-Door'];
                        for (var r = 0; r < ruleNames.length; r++) {
                            (function(idx) {
                                VizEngine.createButton(controls, ruleNames[idx], function() {
                                    currentRule = idx + 1;
                                    draw();
                                });
                            })(r);
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch04-ex01',
                    type: 'concept',
                    difficulty: 2,
                    question: 'In Rule 1 of do-calculus, what graphical condition must hold for us to add or remove an observation Z from P(y|do(x),z,w)?',
                    hint: 'Think about d-separation in the mutilated graph.',
                    answer: 'We need (Y \\u22A5\\u22A5 Z | X, W) in G_{\\u0305X}, the graph obtained by removing all incoming edges to X. If this d-separation holds, then Z is informationally redundant given do(x) and w.'
                },
                {
                    id: 'ch04-ex02',
                    type: 'concept',
                    difficulty: 2,
                    question: 'Explain intuitively why Rule 2 allows us to replace do(z) with observation z. Under what condition does intervening on Z have the same effect as merely observing Z?',
                    hint: 'Consider what happens when all causal paths from Z to Y are blocked.',
                    answer: 'Rule 2 states that if (Y \\u22A5\\u22A5 Z | X, W) in G_{\\u0305X, _Z} (incoming edges to X removed and outgoing edges from Z removed), then do(z) can be replaced by observation z. Intuitively, this holds when there is no unblocked causal path from Z to Y that goes through Z\'s children. After removing Z\'s outgoing edges the only remaining association is through non-causal (backdoor) paths, which if blocked by X and W, means intervening and observing are equivalent.'
                },
                {
                    id: 'ch04-ex03',
                    type: 'worked',
                    difficulty: 3,
                    question: 'Consider a DAG: Z -> X -> Y with confounder U -> Z and U -> Y. Use the three rules of do-calculus to derive P(y|do(x)) in terms of observational quantities.',
                    hint: 'Start by writing P(y|do(x)) and try conditioning on Z. Apply Rule 2 to check if do(x) can become observation.',
                    answer: 'In this DAG, Z satisfies the backdoor criterion: Z blocks all backdoor paths from X to Y (through U). Apply Rule 2: since (Y \\u22A5\\u22A5 X | Z) in G_{_X} (removing outgoing edges of X, the path X->Y is cut, and Z blocks U->Z...U->Y), we can write P(y|do(x)) = \\u03A3_z P(y|x,z)P(z|do(x)). Then by Rule 3: since (Z \\u22A5\\u22A5 X) in G_{\\u0305X} (removing incoming edges to X cuts Z->X), P(z|do(x)) = P(z). Therefore P(y|do(x)) = \\u03A3_z P(y|x,z)P(z), the backdoor adjustment formula.'
                },
                {
                    id: 'ch04-ex04',
                    type: 'concept',
                    difficulty: 2,
                    question: 'What does "graph surgery" (also called "mutilation") mean in the context of do-calculus? How does G_{\\u0305X} differ from the original graph G?',
                    hint: 'Think about what do(x) means structurally.',
                    answer: 'Graph surgery for G_{\\u0305X} means removing all incoming edges to node(s) X from the original DAG G. This corresponds to the intervention do(X=x): when we set X to a specific value, X is no longer influenced by its parents. The mutilated graph represents the post-intervention data-generating process. Similarly, G_{_X} removes outgoing edges from X, representing a world where X\'s direct effects on its children are severed.'
                }
            ]
        },

        // ── Section 2: Identification Strategies ──
        {
            id: 'ch04-sec02',
            title: 'Identification Strategies',
            content: `<h2>Identification Strategies</h2>

<p>A causal effect \\(P(y \\mid do(x))\\) is <strong>identifiable</strong> if it can be uniquely computed from the observational distribution \\(P(v)\\) and the causal DAG structure (without knowing the functional forms or distributions of unobserved variables).</p>

<div class="env-block definition"><div class="env-title">Definition (Identifiability)</div><div class="env-body">
<p>A causal quantity \\(Q\\) is identifiable in a causal model \\(\\mathcal{M}\\) compatible with DAG \\(G\\) if for any two models \\(\\mathcal{M}_1, \\mathcal{M}_2\\) that agree on \\(P(v)\\) (the observed distribution), we have \\(Q(\\mathcal{M}_1) = Q(\\mathcal{M}_2)\\).</p>
</div></div>

<p>The fundamental question is: when can we reduce \\(P(y \\mid do(x))\\) to an expression involving only observational probabilities?</p>

<div class="env-block theorem"><div class="env-title">Theorem (Backdoor Criterion — Pearl, 1993)</div><div class="env-body">
<p>A set of variables \\(Z\\) satisfies the <strong>backdoor criterion</strong> relative to \\((X, Y)\\) if:</p>
<ol>
<li>No node in \\(Z\\) is a descendant of \\(X\\).</li>
<li>\\(Z\\) blocks every path between \\(X\\) and \\(Y\\) that contains an arrow into \\(X\\) (backdoor path).</li>
</ol>
<p>If \\(Z\\) satisfies the backdoor criterion, then:</p>
\\[P(y \\mid do(x)) = \\sum_z P(y \\mid x, z) P(z)\\]
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Front-Door Criterion — Pearl, 1995)</div><div class="env-body">
<p>A set of variables \\(M\\) satisfies the <strong>front-door criterion</strong> relative to \\((X, Y)\\) if:</p>
<ol>
<li>\\(M\\) intercepts all directed paths from \\(X\\) to \\(Y\\).</li>
<li>There is no unblocked backdoor path from \\(X\\) to \\(M\\).</li>
<li>All backdoor paths from \\(M\\) to \\(Y\\) are blocked by \\(X\\).</li>
</ol>
<p>If \\(M\\) satisfies the front-door criterion, then:</p>
\\[P(y \\mid do(x)) = \\sum_m P(m \\mid x) \\sum_{x'} P(y \\mid m, x') P(x')\\]
</div></div>

<div class="env-block definition"><div class="env-title">The ID Algorithm (Tian & Pearl, 2002)</div><div class="env-body">
<p>The <strong>ID algorithm</strong> is a general procedure that takes as input:</p>
<ul>
<li>A causal DAG \\(G\\) (possibly with hidden variables represented by bidirected edges)</li>
<li>A target interventional distribution \\(P(y \\mid do(x))\\)</li>
</ul>
<p>And either returns an expression for \\(P(y \\mid do(x))\\) in terms of \\(P(v)\\), or declares the effect <strong>non-identifiable</strong>. Key steps include:</p>
<ol>
<li>Check if \\(X\\) has no effect on \\(Y\\): if \\(Y \\cap An(Y)_{G_{\\overline{X}}} = \\emptyset\\), return \\(\\sum_{v \\setminus y} P(v)\\).</li>
<li>Decompose into c-components (maximal sets connected by bidirected edges).</li>
<li>Apply do-calculus rules recursively on each c-component.</li>
<li>If a "hedge" (a pair of c-forests forming a thicket) is found, the effect is non-identifiable.</li>
</ol>
</div></div>

<div class="env-block example"><div class="env-title">Example: Non-Identifiable Effect</div><div class="env-body">
<p>Consider variables \\(X, Y\\) with a bidirected edge \\(X \\leftrightarrow Y\\) (indicating a latent common cause) and no other variables. Then \\(P(y \\mid do(x))\\) is non-identifiable: we cannot determine the causal effect from \\(P(x, y)\\) alone because there is no adjustment set, no front-door path, and no other variable to mediate.</p>
</div></div>

<div class="viz-placeholder" data-viz="ch04-viz-id-algorithm"></div>`,
            visualizations: [
                {
                    id: 'ch04-viz-id-algorithm',
                    title: 'Step-by-Step Identification on a Complex DAG',
                    description: 'Walk through the identification process step by step on an example DAG',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;
                        var stepIdx = 0;

                        // Complex DAG: X -> M -> Y, with U1 -> X, U1 -> M (bidirected), U2 -> M, U2 -> Y (bidirected)
                        // We want P(y|do(x))
                        var nodes = {
                            X: {x: 100, y: 200, name: 'X'},
                            M: {x: 300, y: 200, name: 'M'},
                            Y: {x: 500, y: 200, name: 'Y'},
                            Z: {x: 300, y: 80, name: 'Z'}
                        };

                        var directedEdges = [['X','M'],['M','Y'],['Z','X'],['Z','Y']];
                        var bidirectedPairs = [];

                        var steps = [
                            {title: 'Step 1: Identify the target', desc: 'Target: P(y|do(x)). DAG has Z->X, X->M, M->Y, Z->Y.', highlight: ['X','Y'], highlightEdges: []},
                            {title: 'Step 2: Find backdoor paths', desc: 'Backdoor path from X to Y: X <- Z -> Y. Need to block this path.', highlight: ['Z'], highlightEdges: [['Z','X'],['Z','Y']]},
                            {title: 'Step 3: Check backdoor criterion', desc: 'Z is not a descendant of X and blocks all backdoor paths. Z satisfies the backdoor criterion!', highlight: ['Z'], highlightEdges: [['Z','X'],['Z','Y']]},
                            {title: 'Step 4: Apply adjustment formula', desc: 'P(y|do(x)) = \\u03A3_z P(y|x,z) P(z). The causal effect is identified!', highlight: ['X','Y','Z'], highlightEdges: []}
                        ];

                        function drawArrow(fromX, fromY, toX, toY, color, lw) {
                            var dx = toX - fromX, dy = toY - fromY;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            var startX = fromX + ux * 22, startY = fromY + uy * 22;
                            var endX = toX - ux * 22, endY = toY - uy * 22;

                            ctx.strokeStyle = color;
                            ctx.lineWidth = lw || 2;
                            ctx.beginPath();
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                            ctx.stroke();

                            var angle = Math.atan2(endY - startY, endX - startX);
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.moveTo(endX + ux * 4, endY + uy * 4);
                            ctx.lineTo(endX - 12 * Math.cos(angle - 0.35), endY - 12 * Math.sin(angle - 0.35));
                            ctx.lineTo(endX - 12 * Math.cos(angle + 0.35), endY - 12 * Math.sin(angle + 0.35));
                            ctx.closePath();
                            ctx.fill();
                        }

                        function drawNode(x, y, name, color, highlighted) {
                            ctx.beginPath();
                            ctx.arc(x, y, 22, 0, Math.PI * 2);
                            ctx.fillStyle = highlighted ? color + '44' : '#1a1a40';
                            ctx.fill();
                            ctx.strokeStyle = color;
                            ctx.lineWidth = highlighted ? 3 : 2;
                            ctx.stroke();
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(name, x, y);
                        }

                        function draw() {
                            viz.clear();
                            var step = steps[stepIdx];
                            var ox = 50, oy = 60;

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 15px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(step.title, W / 2, 25);

                            // Draw edges
                            for (var i = 0; i < directedEdges.length; i++) {
                                var from = nodes[directedEdges[i][0]];
                                var to = nodes[directedEdges[i][1]];
                                var isHighlighted = step.highlightEdges.some(function(e) {
                                    return e[0] === directedEdges[i][0] && e[1] === directedEdges[i][1];
                                });
                                drawArrow(from.x + ox, from.y + oy, to.x + ox, to.y + oy, isHighlighted ? '#f0883e' : '#58a6ff', isHighlighted ? 3 : 2);
                            }

                            // Draw nodes
                            var nodeKeys = Object.keys(nodes);
                            for (var j = 0; j < nodeKeys.length; j++) {
                                var n = nodes[nodeKeys[j]];
                                var isHL = step.highlight.indexOf(nodeKeys[j]) >= 0;
                                drawNode(n.x + ox, n.y + oy, n.name, isHL ? '#3fb950' : '#58a6ff', isHL);
                            }

                            // Description
                            ctx.fillStyle = '#c9d1d9';
                            ctx.font = '14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            var lines = step.desc.split('. ');
                            for (var l = 0; l < lines.length; l++) {
                                ctx.fillText(lines[l] + (l < lines.length - 1 ? '.' : ''), W / 2, H - 80 + l * 22);
                            }

                            // Step indicator
                            ctx.fillStyle = '#4a4a7a';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('Step ' + (stepIdx + 1) + ' / ' + steps.length, W / 2, H - 15);
                        }

                        VizEngine.createButton(controls, 'Previous Step', function() {
                            if (stepIdx > 0) stepIdx--;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next Step', function() {
                            if (stepIdx < steps.length - 1) stepIdx++;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            stepIdx = 0;
                            draw();
                        });

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch04-ex05',
                    type: 'concept',
                    difficulty: 2,
                    question: 'State the two conditions of the backdoor criterion. Why is it important that no variable in the adjustment set Z is a descendant of X?',
                    hint: 'Think about what happens if Z is a collider descendant on a path from X to Y.',
                    answer: 'The backdoor criterion requires: (1) no node in Z is a descendant of X, and (2) Z blocks every backdoor path from X to Y. Condition (1) is crucial because conditioning on a descendant of X can open up spurious paths (e.g., if Z is a descendant of a collider on a path from X to Y, conditioning on Z opens the collider path and introduces bias).'
                },
                {
                    id: 'ch04-ex06',
                    type: 'worked',
                    difficulty: 3,
                    question: 'In a DAG with X -> M -> Y and latent U with U -> X and U -> Y, show that the front-door criterion applies using M as the mediator set.',
                    hint: 'Verify the three conditions of the front-door criterion.',
                    answer: 'Check the three conditions: (1) M intercepts all directed paths from X to Y: the only directed path is X->M->Y, and M is on it. (2) No unblocked backdoor path from X to M: the only backdoor path would be X<-U->Y<-M (backward), but this requires going against the arrow M->Y, which is not a valid path. (3) All backdoor paths from M to Y are blocked by X: the backdoor path M<-X<-U->Y is blocked by conditioning on X. All three conditions hold, so the front-door formula applies: P(y|do(x)) = sum_m P(m|x) sum_{x\'} P(y|m,x\')P(x\').'
                },
                {
                    id: 'ch04-ex07',
                    type: 'concept',
                    difficulty: 3,
                    question: 'What is a "hedge" in the context of the ID algorithm? Why does finding a hedge imply non-identifiability?',
                    hint: 'A hedge involves two c-forests that form a problematic structure.',
                    answer: 'A hedge for P(y|do(x)) in a DAG G is a pair of R-rooted c-forests (F, F\') where F\' is a subset of F, F contains X and Y, and F\' contains Y but not all of X. A hedge means there exist two causal models that agree on P(v) but disagree on P(y|do(x)), proving non-identifiability. The hedge structure creates enough latent confounding that observational data cannot pin down the causal effect.'
                }
            ]
        },

        // ── Section 3: Adjustment Formula & Truncated Factorization ──
        {
            id: 'ch04-sec03',
            title: 'Adjustment Formula & Truncated Factorization',
            content: `<h2>Adjustment Formula & Truncated Factorization</h2>

<p>Two fundamental tools for computing interventional distributions are the <strong>adjustment formula</strong> (also called the backdoor adjustment) and the <strong>truncated factorization</strong>. They provide complementary perspectives on how intervention changes the joint distribution.</p>

<div class="env-block theorem"><div class="env-title">Theorem (Backdoor Adjustment Formula)</div><div class="env-body">
<p>If a set \\(Z\\) satisfies the backdoor criterion relative to \\((X, Y)\\) in DAG \\(G\\), then:</p>
\\[P(y \\mid do(x)) = \\sum_z P(y \\mid x, z) \\, P(z)\\]
<p>For continuous variables, the sum becomes an integral:</p>
\\[P(y \\mid do(x)) = \\int P(y \\mid x, z) \\, p(z) \\, dz\\]
</div></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>The adjustment formula has a natural interpretation: to find the causal effect of \\(X\\) on \\(Y\\), we stratify by the confounders \\(Z\\), compute the association within each stratum, and then average over the distribution of \\(Z\\). This "standardization" removes confounding bias because within each stratum of \\(Z\\), the association between \\(X\\) and \\(Y\\) is causal.</p>
</div></div>

<div class="env-block definition"><div class="env-title">Definition (Truncated Factorization / Manipulated Distribution)</div><div class="env-body">
<p>In a causal Bayesian network with variables \\(V = \\{V_1, \\ldots, V_n\\}\\), the observational distribution factors as:</p>
\\[P(v_1, \\ldots, v_n) = \\prod_{i=1}^{n} P(v_i \\mid pa_i)\\]
<p>Under the intervention \\(do(X = x)\\), the post-intervention distribution of all other variables \\(V \\setminus X\\) is given by the <strong>truncated factorization</strong>:</p>
\\[P(v_1, \\ldots, v_n \\mid do(x)) = \\begin{cases} \\displaystyle\\prod_{i: V_i \\notin X} P(v_i \\mid pa_i) & \\text{if } v_X = x \\\\ 0 & \\text{otherwise} \\end{cases}\\]
<p>We simply delete the factors \\(P(x \\mid pa_X)\\) for the intervened variables and fix \\(X = x\\).</p>
</div></div>

<div class="env-block example"><div class="env-title">Example: Three-Variable Chain</div><div class="env-body">
<p>Consider \\(Z \\to X \\to Y\\) with \\(P(z, x, y) = P(z) P(x \\mid z) P(y \\mid x)\\).</p>
<p><strong>Truncated factorization:</strong> Under \\(do(X = x)\\),</p>
\\[P(z, y \\mid do(x)) = P(z) \\cdot P(y \\mid x)\\]
<p>We dropped \\(P(x \\mid z)\\) because \\(X\\) is the intervened variable. This gives us:</p>
\\[P(y \\mid do(x)) = \\sum_z P(z) P(y \\mid x) = P(y \\mid x)\\]
<p>which makes sense because there is no confounding in this chain (\\(Z\\) is not a confounder).</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Connection Between Adjustment and Truncated Factorization</div><div class="env-body">
<p>The backdoor adjustment formula can be <em>derived</em> from the truncated factorization. Starting with:</p>
\\[P(y \\mid do(x)) = \\sum_{v \\setminus \\{x,y\\}} \\prod_{i: V_i \\neq X} P(v_i \\mid pa_i)\\]
<p>If we identify a valid adjustment set \\(Z\\), we can simplify the summation. The truncated factorization provides the foundational rule; specific identification formulas (backdoor, front-door, etc.) are special cases obtained by marginalizing appropriately.</p>
</div></div>

<div class="viz-placeholder" data-viz="ch04-viz-adjustment"></div>

<div class="env-block remark"><div class="env-title">Practical Considerations</div><div class="env-body">
<p>In practice, the choice of adjustment set matters for efficiency:</p>
<ul>
<li>Smaller adjustment sets lead to lower-variance estimates.</li>
<li>Not all valid adjustment sets are equally efficient; Pearl and others have studied <em>optimal</em> adjustment sets.</li>
<li>The truncated factorization is more general but harder to compute directly for large models.</li>
</ul>
</div></div>`,
            visualizations: [
                {
                    id: 'ch04-viz-adjustment',
                    title: 'Computing the Adjustment Formula Step by Step',
                    description: 'Interactive demonstration of backdoor adjustment with numerical computation',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 460, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        // Simple example: Z -> X -> Y, Z -> Y
                        // Z in {0,1}, X in {0,1}, Y in {0,1}
                        // P(Z=1) = pZ
                        // P(X=1|Z) = logistic function
                        // P(Y=1|X,Z) = logistic function
                        var pZ = 0.4;

                        function pXgivenZ(x, z) {
                            var p = z === 1 ? 0.8 : 0.3;
                            return x === 1 ? p : 1 - p;
                        }

                        function pYgivenXZ(y, x, z) {
                            var p = 0.1 + 0.4 * x + 0.3 * z;
                            return y === 1 ? p : 1 - p;
                        }

                        function computeAdjustment(x) {
                            // P(Y=1|do(X=x)) = sum_z P(Y=1|X=x,Z=z) P(Z=z)
                            var result = 0;
                            var terms = [];
                            for (var z = 0; z <= 1; z++) {
                                var pz = z === 1 ? pZ : 1 - pZ;
                                var pyxz = pYgivenXZ(1, x, z);
                                terms.push({z: z, pz: pz, pyxz: pyxz, contrib: pyxz * pz});
                                result += pyxz * pz;
                            }
                            return {total: result, terms: terms};
                        }

                        function draw() {
                            viz.clear();

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 15px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Backdoor Adjustment: P(Y=1|do(X=x)) = \\u03A3_z P(Y=1|X=x,Z=z)P(Z=z)', W / 2, 25);

                            // DAG
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('DAG: Z -> X -> Y, Z -> Y', 120, 55);

                            // Draw mini DAG
                            var dagOx = 30, dagOy = 65;
                            function miniNode(x, y, label) {
                                ctx.beginPath();
                                ctx.arc(x, y, 16, 0, Math.PI * 2);
                                ctx.fillStyle = '#1a1a40';
                                ctx.fill();
                                ctx.strokeStyle = '#58a6ff';
                                ctx.lineWidth = 2;
                                ctx.stroke();
                                ctx.fillStyle = '#f0f6fc';
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(label, x, y);
                            }
                            function miniArrow(x1, y1, x2, y2) {
                                var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx*dx+dy*dy);
                                var ux = dx/len, uy = dy/len;
                                ctx.strokeStyle = '#58a6ff';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(x1+ux*18, y1+uy*18);
                                ctx.lineTo(x2-ux*18, y2-uy*18);
                                ctx.stroke();
                                var angle = Math.atan2(dy, dx);
                                ctx.fillStyle = '#58a6ff';
                                ctx.beginPath();
                                ctx.moveTo(x2-ux*16, y2-uy*16);
                                ctx.lineTo(x2-ux*16-8*Math.cos(angle-0.4), y2-uy*16-8*Math.sin(angle-0.4));
                                ctx.lineTo(x2-ux*16-8*Math.cos(angle+0.4), y2-uy*16-8*Math.sin(angle+0.4));
                                ctx.closePath();
                                ctx.fill();
                            }
                            miniNode(dagOx + 40, dagOy + 10, 'Z');
                            miniNode(dagOx + 120, dagOy + 10, 'X');
                            miniNode(dagOx + 200, dagOy + 10, 'Y');
                            miniArrow(dagOx + 40, dagOy + 10, dagOx + 120, dagOy + 10);
                            miniArrow(dagOx + 120, dagOy + 10, dagOx + 200, dagOy + 10);
                            miniArrow(dagOx + 40, dagOy + 10, dagOx + 200, dagOy + 10);

                            // Parameter display
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('P(Z=1) = ' + pZ.toFixed(2), 340, 70);
                            ctx.fillText('P(X=1|Z=0) = 0.30, P(X=1|Z=1) = 0.80', 340, 90);
                            ctx.fillText('P(Y=1|X,Z) = 0.1 + 0.4X + 0.3Z', 340, 110);

                            // Compute for do(X=0) and do(X=1)
                            var res0 = computeAdjustment(0);
                            var res1 = computeAdjustment(1);

                            // Table header
                            var tableY = 145;
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Adjustment Calculation', W / 2, tableY);

                            // do(X=0) computation
                            var y0 = tableY + 30;
                            ctx.fillStyle = '#3fb9a0';
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('P(Y=1|do(X=0)):', 40, y0);

                            ctx.fillStyle = '#c9d1d9';
                            ctx.font = '12px -apple-system,sans-serif';
                            for (var i = 0; i < res0.terms.length; i++) {
                                var t = res0.terms[i];
                                var line = '  Z=' + t.z + ': P(Y=1|X=0,Z=' + t.z + ') x P(Z=' + t.z + ') = ' + t.pyxz.toFixed(2) + ' x ' + t.pz.toFixed(2) + ' = ' + t.contrib.toFixed(3);
                                ctx.fillText(line, 60, y0 + 22 + i * 20);
                            }
                            ctx.fillStyle = '#3fb9a0';
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.fillText('  Total = ' + res0.total.toFixed(3), 60, y0 + 22 + 2 * 20);

                            // do(X=1) computation
                            var y1 = y0 + 90;
                            ctx.fillStyle = '#f0883e';
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('P(Y=1|do(X=1)):', 40, y1);

                            ctx.fillStyle = '#c9d1d9';
                            ctx.font = '12px -apple-system,sans-serif';
                            for (var k = 0; k < res1.terms.length; k++) {
                                var t2 = res1.terms[k];
                                var line2 = '  Z=' + t2.z + ': P(Y=1|X=1,Z=' + t2.z + ') x P(Z=' + t2.z + ') = ' + t2.pyxz.toFixed(2) + ' x ' + t2.pz.toFixed(2) + ' = ' + t2.contrib.toFixed(3);
                                ctx.fillText(line2, 60, y1 + 22 + k * 20);
                            }
                            ctx.fillStyle = '#f0883e';
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.fillText('  Total = ' + res1.total.toFixed(3), 60, y1 + 22 + 2 * 20);

                            // ATE
                            var ate = res1.total - res0.total;
                            var ateY = y1 + 105;
                            ctx.fillStyle = '#bc8cff';
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Average Treatment Effect (ATE) = P(Y=1|do(1)) - P(Y=1|do(0)) = ' + ate.toFixed(3), W / 2, ateY);

                            // Bar chart comparison
                            var barY = ateY + 25;
                            var barH = 50;
                            var barW = 120;

                            // do(X=0) bar
                            ctx.fillStyle = '#3fb9a044';
                            ctx.fillRect(W / 2 - 150, barY, barW * res0.total, barH);
                            ctx.strokeStyle = '#3fb9a0';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(W / 2 - 150, barY, barW * res0.total, barH);
                            ctx.fillStyle = '#3fb9a0';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('do(X=0): ' + res0.total.toFixed(3), W / 2 - 150 + barW * res0.total / 2, barY + barH / 2 + 4);

                            // do(X=1) bar
                            ctx.fillStyle = '#f0883e44';
                            ctx.fillRect(W / 2 + 30, barY, barW * res1.total, barH);
                            ctx.strokeStyle = '#f0883e';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(W / 2 + 30, barY, barW * res1.total, barH);
                            ctx.fillStyle = '#f0883e';
                            ctx.fillText('do(X=1): ' + res1.total.toFixed(3), W / 2 + 30 + barW * res1.total / 2, barY + barH / 2 + 4);
                        }

                        VizEngine.createSlider(controls, 'P(Z=1)', 0.1, 0.9, pZ, 0.05, function(v) {
                            pZ = v;
                            draw();
                        });

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch04-ex08',
                    type: 'worked',
                    difficulty: 2,
                    question: 'In the DAG Z -> X -> Y with Z -> Y, compute P(y|do(x)) using the truncated factorization. Verify it matches the backdoor adjustment with Z as the adjustment set.',
                    hint: 'Write out the full joint, delete the factor for X, then marginalize.',
                    answer: 'The observational joint is P(z,x,y) = P(z)P(x|z)P(y|x,z). Under do(X=x), the truncated factorization deletes P(x|z): P(z,y|do(x)) = P(z)P(y|x,z). Marginalizing over Z: P(y|do(x)) = sum_z P(y|x,z)P(z). This is exactly the backdoor adjustment formula with Z as the adjustment set, confirming the two approaches give identical results.'
                },
                {
                    id: 'ch04-ex09',
                    type: 'concept',
                    difficulty: 2,
                    question: 'Why does the truncated factorization delete the factor P(x|pa_X) but keep all other factors unchanged?',
                    hint: 'Think about what an intervention does to the structural equation for X.',
                    answer: 'An intervention do(X=x) replaces the structural equation for X with a constant assignment X := x. This means X no longer depends on its parents. In the Bayesian network factorization, the factor P(x|pa_X) encodes X\'s dependence on its parents. Deleting this factor and fixing X=x captures exactly the operation of intervention: X is forced to the value x regardless of its parents, but all other causal mechanisms (factors) remain intact.'
                },
                {
                    id: 'ch04-ex10',
                    type: 'concept',
                    difficulty: 3,
                    question: 'Consider a DAG with four variables: Z1 -> X, Z2 -> X, Z1 -> Y, X -> Y. Both {Z1} and {Z1, Z2} are valid adjustment sets. Which would you prefer in practice and why?',
                    hint: 'Think about variance of the estimator.',
                    answer: 'Both {Z1} and {Z1, Z2} satisfy the backdoor criterion. In practice, we generally prefer {Z1} (the smaller set) because: (1) Adjusting for fewer variables reduces the curse of dimensionality in nonparametric estimation. (2) Adding Z2 does not reduce confounding bias (it is already zero with Z1). (3) However, if Z2 is strongly predictive of Y (a precision variable), including it can reduce variance. The optimal choice depends on the specific data context, but as a default, smaller valid adjustment sets are preferred.'
                },
                {
                    id: 'ch04-ex11',
                    type: 'worked',
                    difficulty: 3,
                    question: 'Derive the front-door formula using the truncated factorization approach. Consider the DAG: U -> X, U -> Y, X -> M -> Y where U is unobserved.',
                    hint: 'Apply the truncated factorization for do(x), then use the law of total probability to eliminate U.',
                    answer: 'The full joint (including U) is P(u,x,m,y) = P(u)P(x|u)P(m|x)P(y|m,u). Under do(X=x): P(u,m,y|do(x)) = P(u)P(m|x)P(y|m,u). Marginalizing over U: P(m,y|do(x)) = P(m|x) sum_u P(y|m,u)P(u). Now sum_u P(y|m,u)P(u) = sum_u P(y|m,u) sum_{x\'} P(u|x\')P(x\') (by Bayes). Since P(u|x\') = P(x\'|u)P(u)/P(x\'), this simplifies to sum_{x\'} P(y|m,x\')P(x\') using the law of total probability (because X d-separates M from U given the structure). Therefore P(y|do(x)) = sum_m P(m|x) sum_{x\'} P(y|m,x\')P(x\'), the front-door formula.'
                }
            ]
        },

        // ── Section 4: Instrumental Inequalities ──
        {
            id: 'ch04-sec04',
            title: 'Instrumental Inequalities',
            content: `<h2>Instrumental Inequalities</h2>

<p>When a causal effect \\(P(y \\mid do(x))\\) is not point-identifiable, we may still be able to derive <strong>bounds</strong> on the effect. Instrumental inequalities provide constraints that the observational distribution must satisfy if a proposed causal model is correct.</p>

<div class="env-block definition"><div class="env-title">Definition (Natural Bounds)</div><div class="env-body">
<p>For any causal effect, the probabilities are naturally bounded:</p>
\\[0 \\leq P(y \\mid do(x)) \\leq 1\\]
<p>These are trivial but serve as the starting point for tighter bounds.</p>
</div></div>

<div class="env-block definition"><div class="env-title">Setup: Instrumental Variable Model</div><div class="env-body">
<p>Consider the classic IV setup with:</p>
<ul>
<li>Instrument \\(Z\\) (takes values in \\(\\{z_1, \\ldots, z_K\\}\\))</li>
<li>Treatment \\(X\\) (binary: 0, 1)</li>
<li>Outcome \\(Y\\) (binary: 0, 1)</li>
<li>Unobserved confounder \\(U\\) between \\(X\\) and \\(Y\\)</li>
</ul>
<p>We observe \\(P(x, y \\mid z)\\) but want \\(P(y \\mid do(x))\\).</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Instrumental Inequality — Pearl, 1995)</div><div class="env-body">
<p>In the binary IV model \\(Z \\to X \\to Y\\) with \\(U \\to X, U \\to Y\\), the following inequality must hold for a valid instrument:</p>
\\[\\max_x \\sum_z \\max_y P(x, y \\mid z) \\leq 1\\]
<p>This is a testable constraint: if violated by the data, the proposed instrumental variable model is incorrect.</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Balke-Pearl Bounds, 1997)</div><div class="env-body">
<p>For the binary IV model, the average causal effect \\(ACE = P(Y=1 \\mid do(X=1)) - P(Y=1 \\mid do(X=0))\\) is bounded:</p>
\\[\\max\\{L_1, L_2, L_3\\} \\leq ACE \\leq \\min\\{U_1, U_2, U_3\\}\\]
<p>where the bounds \\(L_i, U_i\\) are linear functions of the observed probabilities \\(P(x, y \\mid z)\\). These bounds are <strong>sharp</strong>: they cannot be tightened without additional assumptions.</p>
</div></div>

<div class="env-block example"><div class="env-title">Example: Bounds on the ACE</div><div class="env-body">
<p>For a binary instrument \\(Z \\in \\{0, 1\\}\\), let \\(p_{xy|z} = P(X=x, Y=y \\mid Z=z)\\). The Balke-Pearl lower bound includes:</p>
\\[ACE \\geq p_{11|1} + p_{00|1} - p_{11|0} - p_{00|0} - 1\\]
\\[ACE \\geq p_{11|0} + p_{00|0} - p_{11|1} - p_{00|1} - 1\\]
<p>And the upper bound includes:</p>
\\[ACE \\leq 1 - p_{10|0} - p_{01|0} - p_{10|1} - p_{01|1}\\]
<p>The width of the bounds depends on the strength of the instrument. A stronger instrument (one that shifts \\(X\\) more) yields tighter bounds.</p>
</div></div>

<div class="env-block remark"><div class="env-title">Partial Identification</div><div class="env-body">
<p>Partial identification sits between two extremes:</p>
<ul>
<li><strong>Point identification:</strong> \\(P(y \\mid do(x))\\) is uniquely determined (e.g., when backdoor criterion holds).</li>
<li><strong>No identification:</strong> \\(P(y \\mid do(x))\\) can be anything in \\([0,1]\\) (trivial bounds).</li>
</ul>
<p>Instrumental inequalities give us an intermediate position: we cannot pinpoint the effect, but we can narrow the range of possible values. Additional assumptions (monotonicity, no defiers, etc.) can further tighten these bounds.</p>
</div></div>

<div class="viz-placeholder" data-viz="ch04-viz-bounds"></div>`,
            visualizations: [
                {
                    id: 'ch04-viz-bounds',
                    title: 'Bounds Narrowing with Additional Assumptions',
                    description: 'Visualize how instrumental variable bounds narrow as we add assumptions',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        // Scenario: Binary Z, X, Y
                        // Observed: P(X,Y|Z)
                        var p11_z0 = 0.15, p10_z0 = 0.25, p01_z0 = 0.35, p00_z0 = 0.25;
                        var p11_z1 = 0.35, p10_z1 = 0.15, p01_z1 = 0.20, p00_z1 = 0.30;

                        var showMonotonicity = false;

                        function computeBounds() {
                            // Natural bounds
                            var natL = -1, natU = 1;

                            // Balke-Pearl bounds (simplified for binary Z)
                            var L1 = -1 + p11_z0 + p00_z0;
                            var L2 = -1 + p11_z1 + p00_z1;
                            var L3 = p11_z1 - p11_z0 + p00_z1 - p00_z0 - 1;
                            var L4 = p11_z0 - p11_z1 + p00_z0 - p00_z1 - 1;

                            var U1 = 1 - p10_z0 - p01_z0;
                            var U2 = 1 - p10_z1 - p01_z1;
                            var U3 = 1 - (p10_z0 + p01_z0 + p10_z1 + p01_z1) / 2;

                            var ivL = Math.max(L1, L2, L3, L4, -1);
                            var ivU = Math.min(U1, U2, U3, 1);

                            // With monotonicity: LATE = (E[Y|Z=1] - E[Y|Z=0]) / (E[X|Z=1] - E[X|Z=0])
                            var ey1 = p11_z1 + p01_z1;
                            var ey0 = p11_z0 + p01_z0;
                            var ex1 = p11_z1 + p10_z1;
                            var ex0 = p11_z0 + p10_z0;
                            var late = (ex1 - ex0) !== 0 ? (ey1 - ey0) / (ex1 - ex0) : 0;
                            var monoL = Math.max(ivL, late - 0.05);
                            var monoU = Math.min(ivU, late + 0.05);

                            return {natL: natL, natU: natU, ivL: ivL, ivU: ivU, late: late, monoL: monoL, monoU: monoU};
                        }

                        function draw() {
                            viz.clear();
                            var bounds = computeBounds();

                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 15px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Bounds on ACE = P(Y=1|do(X=1)) - P(Y=1|do(X=0))', W / 2, 25);

                            // Number line from -1 to 1
                            var lineY = 120;
                            var lineLeft = 80, lineRight = W - 80;
                            var lineW = lineRight - lineLeft;

                            function aceToX(ace) {
                                return lineLeft + (ace + 1) / 2 * lineW;
                            }

                            // Axis
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(lineLeft, lineY);
                            ctx.lineTo(lineRight, lineY);
                            ctx.stroke();

                            // Tick marks
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var tick = -1; tick <= 1; tick += 0.25) {
                                var tx = aceToX(tick);
                                ctx.beginPath();
                                ctx.moveTo(tx, lineY - 5);
                                ctx.lineTo(tx, lineY + 5);
                                ctx.stroke();
                                ctx.fillText(tick.toFixed(2), tx, lineY + 18);
                            }

                            // Draw bounds as colored bands
                            var bandH = 28;

                            // Natural bounds [-1, 1]
                            var natY = lineY + 35;
                            ctx.fillStyle = '#f8514933';
                            ctx.fillRect(aceToX(bounds.natL), natY, aceToX(bounds.natU) - aceToX(bounds.natL), bandH);
                            ctx.strokeStyle = '#f85149';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(aceToX(bounds.natL), natY, aceToX(bounds.natU) - aceToX(bounds.natL), bandH);
                            ctx.fillStyle = '#f85149';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Natural bounds [-1, 1]', lineRight + 10, natY + 18);

                            // IV bounds
                            var ivY = natY + 40;
                            var ivLx = aceToX(Math.max(bounds.ivL, -1));
                            var ivRx = aceToX(Math.min(bounds.ivU, 1));
                            ctx.fillStyle = '#f0883e33';
                            ctx.fillRect(ivLx, ivY, ivRx - ivLx, bandH);
                            ctx.strokeStyle = '#f0883e';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(ivLx, ivY, ivRx - ivLx, bandH);
                            ctx.fillStyle = '#f0883e';
                            ctx.textAlign = 'left';
                            ctx.fillText('IV bounds [' + bounds.ivL.toFixed(2) + ', ' + bounds.ivU.toFixed(2) + ']', lineRight + 10, ivY + 18);

                            // Monotonicity bounds (if enabled)
                            if (showMonotonicity) {
                                var monoY = ivY + 40;
                                var monoLx = aceToX(Math.max(bounds.monoL, -1));
                                var monoRx = aceToX(Math.min(bounds.monoU, 1));
                                ctx.fillStyle = '#3fb95033';
                                ctx.fillRect(monoLx, monoY, monoRx - monoLx, bandH);
                                ctx.strokeStyle = '#3fb950';
                                ctx.lineWidth = 2;
                                ctx.strokeRect(monoLx, monoY, monoRx - monoLx, bandH);
                                ctx.fillStyle = '#3fb950';
                                ctx.textAlign = 'left';
                                ctx.fillText('+ Monotonicity', lineRight + 10, monoY + 10);
                                ctx.fillText('[' + bounds.monoL.toFixed(2) + ', ' + bounds.monoU.toFixed(2) + ']', lineRight + 10, monoY + 24);

                                // LATE point estimate
                                var lateX = aceToX(bounds.late);
                                ctx.fillStyle = '#bc8cff';
                                ctx.beginPath();
                                ctx.arc(lateX, monoY + bandH + 20, 6, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = '#bc8cff';
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('LATE = ' + bounds.late.toFixed(3), lateX, monoY + bandH + 40);
                            }

                            // Observed data display
                            var dataY = showMonotonicity ? 340 : 300;
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Observed data: P(X,Y|Z=0): P(1,1)=' + p11_z0.toFixed(2) + ', P(1,0)=' + p10_z0.toFixed(2) + ', P(0,1)=' + p01_z0.toFixed(2) + ', P(0,0)=' + p00_z0.toFixed(2), 40, dataY);
                            ctx.fillText('              P(X,Y|Z=1): P(1,1)=' + p11_z1.toFixed(2) + ', P(1,0)=' + p10_z1.toFixed(2) + ', P(0,1)=' + p01_z1.toFixed(2) + ', P(0,0)=' + p00_z1.toFixed(2), 40, dataY + 18);
                        }

                        VizEngine.createButton(controls, 'Toggle Monotonicity', function() {
                            showMonotonicity = !showMonotonicity;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'P(1,1|Z=1)', 0.05, 0.60, p11_z1, 0.05, function(v) {
                            p11_z1 = v;
                            p00_z1 = Math.max(0.05, 1 - p11_z1 - p10_z1 - p01_z1);
                            draw();
                        });

                        VizEngine.createSlider(controls, 'P(1,0|Z=1)', 0.05, 0.40, p10_z1, 0.05, function(v) {
                            p10_z1 = v;
                            p00_z1 = Math.max(0.05, 1 - p11_z1 - p10_z1 - p01_z1);
                            draw();
                        });

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch04-ex12',
                    type: 'concept',
                    difficulty: 2,
                    question: 'What is the instrumental inequality, and what does its violation tell us about a proposed causal model?',
                    hint: 'Think of it as a testable implication.',
                    answer: 'The instrumental inequality states that max_x sum_z max_y P(x,y|z) <= 1 for a valid instrumental variable model. If this inequality is violated by the observed data, it means the proposed IV model is incorrect: at least one of the IV assumptions (exclusion restriction, independence, or relevance) is violated. It serves as a falsification test for the causal model, not as an identification tool.'
                },
                {
                    id: 'ch04-ex13',
                    type: 'worked',
                    difficulty: 3,
                    question: 'In a binary IV model with P(X=1,Y=1|Z=0) = 0.20, P(X=1,Y=0|Z=0) = 0.30, P(X=0,Y=1|Z=0) = 0.25, P(X=0,Y=0|Z=0) = 0.25, and P(X=1,Y=1|Z=1) = 0.40, P(X=1,Y=0|Z=1) = 0.10, P(X=0,Y=1|Z=1) = 0.20, P(X=0,Y=0|Z=1) = 0.30, verify the instrumental inequality holds.',
                    hint: 'Compute max_x sum_z max_y P(x,y|z) for x=0 and x=1.',
                    answer: 'For x=1: sum_z max_y P(1,y|z) = max(0.20, 0.30) + max(0.40, 0.10) = 0.30 + 0.40 = 0.70. For x=0: sum_z max_y P(0,y|z) = max(0.25, 0.25) + max(0.20, 0.30) = 0.25 + 0.30 = 0.55. max_x {0.70, 0.55} = 0.70 <= 1. The instrumental inequality holds, so the data is consistent with the IV model.'
                },
                {
                    id: 'ch04-ex14',
                    type: 'concept',
                    difficulty: 3,
                    question: 'Why do the Balke-Pearl bounds get tighter when the instrument Z is "stronger" (i.e., Z has a larger effect on X)? Explain intuitively.',
                    hint: 'Think about what a strong instrument tells us about the relationship between Z and X.',
                    answer: 'A stronger instrument means P(X|Z=1) and P(X|Z=0) differ more, which means Z creates more variation in X. The bounds are computed from the observed P(X,Y|Z), and when Z strongly shifts X, the observational data provides more information about what happens when X changes. In the extreme, if Z perfectly determines X (full compliance), the IV bounds collapse to a point estimate because we effectively have a randomized experiment. Conversely, a weak instrument (Z barely changes X) leaves wide bounds because we have little information about the causal effect of X on Y.'
                }
            ]
        },

        // ── Section 5: Completeness of do-Calculus ──
        {
            id: 'ch04-sec05',
            title: 'Completeness of do-Calculus',
            content: `<h2>Completeness of do-Calculus</h2>

<p>A fundamental question in causal inference is: are the three rules of do-calculus <em>sufficient</em> to identify every identifiable causal effect? The answer, proven independently by Huang & Valtorta (2006) and Shpitser & Pearl (2006), is <strong>yes</strong>.</p>

<div class="env-block theorem"><div class="env-title">Theorem (Completeness of do-Calculus)</div><div class="env-body">
<p><strong>Huang & Valtorta (2006); Shpitser & Pearl (2006):</strong></p>
<p>The three rules of do-calculus, together with standard probability axioms, are <strong>complete</strong> for identifying causal effects. Specifically:</p>
<p>For any causal DAG \\(G\\) (possibly with latent variables) and any interventional distribution \\(P(y \\mid do(x))\\):</p>
<ul>
<li>If \\(P(y \\mid do(x))\\) is identifiable from \\(P(v)\\), then do-calculus can derive an expression for it.</li>
<li>If do-calculus cannot derive such an expression, then \\(P(y \\mid do(x))\\) is genuinely non-identifiable.</li>
</ul>
</div></div>

<div class="env-block remark"><div class="env-title">What Completeness Means</div><div class="env-body">
<p>Completeness has profound implications:</p>
<ol>
<li><strong>No missing rules:</strong> We do not need a "Rule 4" or any additional inference principles. The three rules exhaust all possible manipulations.</li>
<li><strong>Algorithmic decidability:</strong> Whether a causal effect is identifiable can be decided by an algorithm (the ID algorithm) in polynomial time.</li>
<li><strong>Clear boundary:</strong> Completeness draws a sharp line between what can and cannot be learned from observational data given a causal graph.</li>
</ol>
</div></div>

<div class="env-block definition"><div class="env-title">The ID Algorithm as a Constructive Proof</div><div class="env-body">
<p>The completeness proof is constructive: the ID algorithm of Tian & Pearl (2002), extended by Shpitser & Pearl (2006), provides an explicit procedure:</p>
<ul>
<li><strong>Input:</strong> A causal DAG \\(G\\), sets \\(X\\) (treatment) and \\(Y\\) (outcome).</li>
<li><strong>Output:</strong> Either an expression for \\(P(y \\mid do(x))\\) in terms of \\(P(v)\\), or a proof of non-identifiability (a hedge).</li>
</ul>
<p>The algorithm recursively decomposes the problem using c-components and applies do-calculus rules. If it encounters a hedge structure (a particular pattern of bidirected edges), it halts and declares non-identifiability.</p>
</div></div>

<div class="env-block example"><div class="env-title">Example: Completeness in Action</div><div class="env-body">
<p><strong>Identifiable case:</strong> In the front-door model (\\(X \\to M \\to Y\\) with \\(U \\to X, U \\to Y\\)), do-calculus successfully derives:</p>
\\[P(y \\mid do(x)) = \\sum_m P(m \\mid x) \\sum_{x'} P(y \\mid m, x') P(x')\\]

<p><strong>Non-identifiable case:</strong> In the "bow-arc" model (\\(X \\to Y\\) with \\(X \\leftrightarrow Y\\) and no other variables), do-calculus cannot reduce \\(P(y \\mid do(x))\\). By completeness, this means \\(P(y \\mid do(x))\\) is genuinely non-identifiable: there exist two SCMs that agree on \\(P(x, y)\\) but disagree on \\(P(y \\mid do(x))\\).</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Characterization of Non-Identifiability)</div><div class="env-body">
<p>A causal effect \\(P(y \\mid do(x))\\) is non-identifiable in a DAG \\(G\\) if and only if there exists a <strong>hedge</strong> for \\(P(y \\mid do(x))\\) in \\(G\\). A hedge is a pair of c-forest components \\((F, F')\\) where:</p>
<ul>
<li>\\(F'\\) is a sub-c-forest of \\(F\\)</li>
<li>\\(F\\) contains all of \\(X\\) and \\(Y\\)</li>
<li>\\(F'\\) does not contain all of \\(X\\)</li>
</ul>
<p>The hedge structure represents an irreducible pattern of confounding that cannot be eliminated.</p>
</div></div>

<div class="env-block remark"><div class="env-title">Practical Implications</div><div class="env-body">
<p>For practitioners, the completeness theorem means:</p>
<ul>
<li><strong>Trust the algorithm:</strong> If the ID algorithm says an effect is non-identifiable, no clever statistical technique can change this (without additional assumptions beyond the DAG).</li>
<li><strong>Focus on assumptions:</strong> When an effect is non-identifiable, the path forward is to strengthen assumptions (add variables, assume monotonicity, impose parametric restrictions) rather than to search for more sophisticated estimators.</li>
<li><strong>Sensitivity analysis:</strong> For non-identifiable effects, partial identification (bounds) combined with sensitivity analysis provides the most honest approach.</li>
</ul>
</div></div>

<div class="env-block remark"><div class="env-title">Historical Note</div><div class="env-body">
<p>The completeness of do-calculus was conjectured by Pearl in 1995 when he introduced the three rules. It took over a decade for the conjecture to be proven. The proof required developing the theory of c-components and hedges, connecting graph-theoretic structures to algebraic constraints on interventional distributions.</p>
</div></div>

<div class="env-block remark"><div class="env-title">Beyond Single Interventions</div><div class="env-body">
<p>The completeness result extends beyond simple \\(P(y \\mid do(x))\\) queries:</p>
<ul>
<li>Joint interventional distributions \\(P(y_1, y_2 \\mid do(x_1), do(x_2))\\) are also covered.</li>
<li>Conditional interventional distributions \\(P(y \\mid do(x), z)\\) can be handled.</li>
<li>The IDC algorithm (Shpitser & Pearl, 2006) handles conditional interventional distributions.</li>
<li>Extensions to transportability and selection bias have been developed using similar completeness frameworks.</li>
</ul>
</div></div>`,
            exercises: [
                {
                    id: 'ch04-ex15',
                    type: 'concept',
                    difficulty: 2,
                    question: 'State the completeness theorem of do-calculus in your own words. What are its two key implications?',
                    hint: 'Think about what "complete" means in logic: every true statement can be derived.',
                    answer: 'The completeness theorem states that do-calculus (three rules plus probability axioms) can derive an expression for any identifiable causal effect, and conversely, if do-calculus fails to derive an expression, the effect is genuinely non-identifiable. Key implications: (1) No additional rules are needed; the three rules are sufficient for all possible causal identification problems. (2) Identifiability is algorithmically decidable: the ID algorithm either returns a formula or proves non-identifiability, with no ambiguous cases.'
                },
                {
                    id: 'ch04-ex16',
                    type: 'concept',
                    difficulty: 3,
                    question: 'A colleague claims they found a new causal identification strategy that does not use any of the three do-calculus rules. Is this possible? Explain using the completeness theorem.',
                    hint: 'The completeness theorem also relies on probability axioms.',
                    answer: 'Yes, it is still possible! The completeness theorem states that do-calculus (combined with probability axioms) is sufficient to derive any identifiable effect. It does NOT say that do-calculus is the only way. Alternative strategies like backdoor adjustment, front-door adjustment, or the g-formula can be derived from do-calculus, but they can also be justified independently (e.g., via counterfactual arguments or structural equation manipulation). However, if a proposed strategy claims to identify an effect that do-calculus cannot, the completeness theorem guarantees it must be wrong: either the effect is truly identifiable (and do-calculus can also identify it) or it is not (and the new strategy must rely on additional assumptions).'
                },
                {
                    id: 'ch04-ex17',
                    type: 'concept',
                    difficulty: 3,
                    question: 'When the ID algorithm declares a causal effect non-identifiable, what options does a researcher have? List at least three approaches.',
                    hint: 'Think about additional assumptions, different data sources, and partial results.',
                    answer: 'When an effect is non-identifiable, researchers can: (1) Add assumptions: impose parametric restrictions, monotonicity, or structural zeros that may restore identifiability. (2) Collect more variables: measuring previously unobserved confounders or mediators may change the DAG structure and make the effect identifiable. (3) Partial identification: compute bounds on the causal effect using instrumental inequalities or other constraints. (4) Sensitivity analysis: quantify how sensitive the conclusions are to the strength of unobserved confounding. (5) Experimental or quasi-experimental design: if possible, run an RCT or exploit a natural experiment. (6) Transportability: use data from a different population where the effect is identifiable and transport it to the target population under appropriate assumptions.'
                },
                {
                    id: 'ch04-ex18',
                    type: 'worked',
                    difficulty: 4,
                    question: 'Consider a DAG with X -> Y and X <-> Y (bidirected edge representing a latent common cause). Show that P(y|do(x)) is non-identifiable by constructing two SCMs that agree on P(x,y) but disagree on P(y|do(x)).',
                    hint: 'Let U be the unobserved confounder. Construct two models with different structural equations for Y.',
                    answer: 'Model 1: U ~ Bernoulli(0.5), X = U (deterministic), Y = X XOR U = 0 always. So P(X=1,Y=0) = 0.5, P(X=0,Y=0) = 0.5. P(Y=0|do(X=1)) = P(1 XOR U = 0) = P(U=1) = 0.5 (so P(Y=0|do(X=1)) = 0.5). Model 2: U ~ Bernoulli(0.5), X = U, Y = X (ignoring U). P(X=1,Y=1) = 0.5, P(X=0,Y=0) = 0.5. Wait, these give different P(x,y). Let me fix: Model 1: U ~ Uniform{0,1}, X := U, Y := U. Then P(X=0,Y=0)=P(X=1,Y=1)=0.5. P(Y=1|do(X=1)) = P(U=1) = 0.5. Model 2: U ~ Uniform{0,1}, X := U, Y := 1. Then P(X=0,Y=1) = P(X=1,Y=1) = 0.5, which gives different P(x,y). Correct construction: Model A: U ~ Bern(0.5), X = U, Y = X. P(0,0)=P(1,1)=0.5. P(Y=1|do(X=1)) = 1. Model B: U ~ Bern(0.5), X = U, Y = U. Same P(x,y)! But P(Y=1|do(X=1)) = P(U=1) = 0.5. Both models give identical P(x,y) but different P(y|do(x)), proving non-identifiability.'
                }
            ]
        }
    ]
});
