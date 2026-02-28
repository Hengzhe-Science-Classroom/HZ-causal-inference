// ============================================================
// Chapter 2
// Structural Causal Models & DAGs
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch02',
    number: 2,
    title: 'Structural Causal Models & DAGs',
    subtitle: 'Pearl\'s Framework for Causal Reasoning',
    sections: [
        // --------------------------------------------------------
        // Section 1: Structural Equations & Functional Causal Model
        // --------------------------------------------------------
        {
            id: 'ch02-sec01',
            title: 'Structural Equations & Functional Causal Model',
            content: `<h2>Structural Equations & Functional Causal Model</h2>
<p>A <strong>Structural Causal Model (SCM)</strong> is a mathematical object that encodes the data-generating process of a system, specifying not just associations but the causal mechanisms that produce the observed variables.</p>

<div class="env-block definition">
<div class="env-title">Definition (Structural Causal Model)</div>
<div class="env-body">
<p>A structural causal model is a triple \\(\\mathcal{M} = (\\mathbf{U}, \\mathbf{V}, \\mathbf{F})\\) where:</p>
<ul>
<li>\\(\\mathbf{U}\\) is a set of <strong>exogenous (background) variables</strong> whose values are determined by factors outside the model.</li>
<li>\\(\\mathbf{V} = \\{V_1, V_2, \\ldots, V_n\\}\\) is a set of <strong>endogenous variables</strong> whose values are determined by variables within the model.</li>
<li>\\(\\mathbf{F} = \\{f_1, f_2, \\ldots, f_n\\}\\) is a set of <strong>structural equations</strong> (functions), one for each \\(V_i\\):
\\[V_i = f_i(\\text{pa}_i, U_i)\\]
where \\(\\text{pa}_i \\subseteq \\mathbf{V} \\setminus \\{V_i\\}\\) are the endogenous parents of \\(V_i\\) and \\(U_i \\subseteq \\mathbf{U}\\).</li>
</ul>
<p>A probability distribution \\(P(\\mathbf{U})\\) over the exogenous variables completes the specification, inducing a distribution over all endogenous variables.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Simple SCM)</div>
<div class="env-body">
<p>Consider a treatment-outcome model:</p>
\\[Z = U_Z\\]
\\[X = f_X(Z, U_X) = \\alpha Z + U_X\\]
\\[Y = f_Y(X, U_Y) = \\beta X + U_Y\\]
<p>Here \\(Z\\) is an instrument, \\(X\\) is treatment, \\(Y\\) is outcome. The exogenous variables \\(U_Z, U_X, U_Y\\) capture all external factors. The structural equations specify the causal mechanism by which each variable is produced.</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Structural vs. Regression Equations</div>
<div class="env-body">
<p>A structural equation \\(Y = \\beta X + U_Y\\) is <strong>not</strong> the same as a regression equation \\(Y = \\beta X + \\varepsilon\\):</p>
<ul>
<li><strong>Structural equation</strong>: the \\(=\\) sign represents a causal assignment. Changing the right-hand side changes \\(Y\\). The equation remains valid under interventions.</li>
<li><strong>Regression equation</strong>: the \\(=\\) sign represents a statistical fit. It describes an association that may not be causal and can break under interventions.</li>
</ul>
<p>The key difference: structural equations are <em>autonomous</em> &mdash; intervening on one equation does not change the others.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch02-viz-scm-interactive"></div>`,
            visualizations: [
                {
                    id: 'ch02-viz-scm-interactive',
                    title: 'Interactive Structural Causal Model',
                    description: 'Adjust structural equation coefficients and see how changing one mechanism affects all downstream variables',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 1, originX: 0, originY: 0});
                        var alpha = 0.8, beta = 0.6, gamma = 0.0;
                        var nSamples = 200;

                        var sAlpha = VizEngine.createSlider(controls, '\u03b1 (Z \u2192 X)', -2, 2, alpha, 0.1, function(v) { alpha = v; });
                        var sBeta = VizEngine.createSlider(controls, '\u03b2 (X \u2192 Y)', -2, 2, beta, 0.1, function(v) { beta = v; });
                        var sGamma = VizEngine.createSlider(controls, '\u03b3 (Z \u2192 Y direct)', -2, 2, gamma, 0.1, function(v) { gamma = v; });

                        function seededRandom(seed) {
                            var x = Math.sin(seed) * 10000;
                            return x - Math.floor(x);
                        }

                        function generateData() {
                            var data = [];
                            for (var i = 0; i < nSamples; i++) {
                                var uz = seededRandom(i * 3 + 1) * 2 - 1;
                                var ux = (seededRandom(i * 3 + 2) * 2 - 1) * 0.5;
                                var uy = (seededRandom(i * 3 + 3) * 2 - 1) * 0.5;
                                var z = uz;
                                var x = alpha * z + ux;
                                var y = beta * x + gamma * z + uy;
                                data.push({z: z, x: x, y: y});
                            }
                            return data;
                        }

                        function draw() {
                            var ctx = viz.ctx;
                            viz.clear();
                            var data = generateData();

                            // --- Left panel: DAG ---
                            var lx = 175, ly = 60;
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(10, 10, 330, 400);
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(10, 10, 330, 400);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('SCM Causal Graph', lx, 35);

                            // Node positions
                            var nodes = {Z: {x: lx, y: 100}, X: {x: lx - 80, y: 250}, Y: {x: lx + 80, y: 250}};

                            // Draw edges
                            function drawArrow(from, to, color, label, lw) {
                                var dx = to.x - from.x, dy = to.y - from.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var ux = dx / len, uy = dy / len;
                                var startX = from.x + ux * 28, startY = from.y + uy * 28;
                                var endX = to.x - ux * 28, endY = to.y - uy * 28;
                                ctx.strokeStyle = color;
                                ctx.lineWidth = lw || 2;
                                ctx.beginPath();
                                ctx.moveTo(startX, startY);
                                ctx.lineTo(endX, endY);
                                ctx.stroke();
                                // arrowhead
                                var angle = Math.atan2(endY - startY, endX - startX);
                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.moveTo(endX, endY);
                                ctx.lineTo(endX - 10 * Math.cos(angle - Math.PI / 6), endY - 10 * Math.sin(angle - Math.PI / 6));
                                ctx.lineTo(endX - 10 * Math.cos(angle + Math.PI / 6), endY - 10 * Math.sin(angle + Math.PI / 6));
                                ctx.closePath();
                                ctx.fill();
                                // label
                                if (label) {
                                    var mx = (startX + endX) / 2, my = (startY + endY) / 2;
                                    var nx = -uy, ny = ux;
                                    ctx.fillStyle = color;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(label, mx + nx * 16, my + ny * 16);
                                }
                            }

                            drawArrow(nodes.Z, nodes.X, viz.colors.blue, '\u03b1=' + alpha.toFixed(1), Math.abs(alpha) * 1.5 + 1);
                            drawArrow(nodes.X, nodes.Y, viz.colors.green, '\u03b2=' + beta.toFixed(1), Math.abs(beta) * 1.5 + 1);
                            if (Math.abs(gamma) > 0.01) {
                                drawArrow(nodes.Z, nodes.Y, viz.colors.orange, '\u03b3=' + gamma.toFixed(1), Math.abs(gamma) * 1.5 + 1);
                            }

                            // Draw nodes
                            var nodeNames = ['Z', 'X', 'Y'];
                            var nodeColors = [viz.colors.teal, viz.colors.blue, viz.colors.green];
                            var idx = 0;
                            for (var name in nodes) {
                                var n = nodes[name];
                                ctx.fillStyle = nodeColors[idx] + '33';
                                ctx.beginPath();
                                ctx.arc(n.x, n.y, 26, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = nodeColors[idx];
                                ctx.lineWidth = 2;
                                ctx.stroke();
                                ctx.fillStyle = nodeColors[idx];
                                ctx.font = 'bold 18px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(name, n.x, n.y);
                                idx++;
                            }

                            // Structural equations
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Z = U_Z', 50, 330);
                            ctx.fillText('X = ' + alpha.toFixed(1) + ' Z + U_X', 50, 355);
                            var yEq = 'Y = ' + beta.toFixed(1) + ' X';
                            if (Math.abs(gamma) > 0.01) yEq += ' + ' + gamma.toFixed(1) + ' Z';
                            yEq += ' + U_Y';
                            ctx.fillText(yEq, 50, 380);

                            // --- Right panel: Scatter plot X vs Y ---
                            var rx = 360, ry = 10, rw = 330, rh = 400;
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(rx, ry, rw, rh);
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(rx, ry, rw, rh);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Scatter: X vs Y', rx + rw / 2, ry + 25);

                            // Compute bounds
                            var margin = 40;
                            var pLeft = rx + margin, pRight = rx + rw - 20;
                            var pTop = ry + 45, pBottom = ry + rh - 30;
                            var pw = pRight - pLeft, ph = pBottom - pTop;

                            var xMin = -3, xMax = 3, yMin = -4, yMax = 4;

                            function toPlot(xv, yv) {
                                var px = pLeft + (xv - xMin) / (xMax - xMin) * pw;
                                var py = pBottom - (yv - yMin) / (yMax - yMin) * ph;
                                return [px, py];
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(pLeft, pBottom);
                            ctx.lineTo(pRight, pBottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(pLeft, pBottom);
                            ctx.lineTo(pLeft, pTop);
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('X', rx + rw / 2, pBottom + 18);
                            ctx.save();
                            ctx.translate(pLeft - 25, (pTop + pBottom) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('Y', 0, 0);
                            ctx.restore();

                            // Plot data points
                            for (var i = 0; i < data.length; i++) {
                                var pt = toPlot(data[i].x, data[i].y);
                                if (pt[0] < pLeft || pt[0] > pRight || pt[1] < pTop || pt[1] > pBottom) continue;
                                ctx.fillStyle = viz.colors.blue + '88';
                                ctx.beginPath();
                                ctx.arc(pt[0], pt[1], 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Regression line
                            var sumX = 0, sumY = 0, sumXX = 0, sumXY = 0, cnt = 0;
                            for (var i = 0; i < data.length; i++) {
                                sumX += data[i].x;
                                sumY += data[i].y;
                                sumXX += data[i].x * data[i].x;
                                sumXY += data[i].x * data[i].y;
                                cnt++;
                            }
                            var bHat = (cnt * sumXY - sumX * sumY) / (cnt * sumXX - sumX * sumX);
                            var aHat = (sumY - bHat * sumX) / cnt;

                            var p1 = toPlot(xMin, aHat + bHat * xMin);
                            var p2 = toPlot(xMax, aHat + bHat * xMax);
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(p1[0], p1[1]);
                            ctx.lineTo(p2[0], p2[1]);
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('slope = ' + bHat.toFixed(2) + ' (causal = ' + beta.toFixed(1) + ')', pLeft + 5, pTop + 15);
                        }

                        draw();
                        sAlpha.addEventListener('input', draw);
                        sBeta.addEventListener('input', draw);
                        sGamma.addEventListener('input', draw);
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch02-ex01',
                    type: 'multiple-choice',
                    question: 'In an SCM M = (U, V, F), which statement is TRUE about exogenous variables U?',
                    options: [
                        'Their values are determined by structural equations within the model',
                        'They are always observed in the data',
                        'Their values are determined by factors outside the model',
                        'They must be independent of all endogenous variables'
                    ],
                    answer: 2,
                    explanation: 'Exogenous variables U have their values determined by factors outside the model. They represent background conditions and unmodeled causes. They need not be observed and are not determined by the structural equations F.'
                },
                {
                    id: 'ch02-ex02',
                    type: 'multiple-choice',
                    question: 'What is the fundamental difference between a structural equation Y = bX + U and a regression equation Y = bX + e?',
                    options: [
                        'The structural equation has a smaller error term',
                        'The structural equation represents a causal assignment that remains valid under interventions',
                        'The regression equation is always biased',
                        'There is no fundamental difference; they are mathematically identical'
                    ],
                    answer: 1,
                    explanation: 'The structural equation represents a causal mechanism: it tells us how Y is generated from X and U. It remains valid even when we intervene on other variables. A regression equation merely describes a statistical association that may break under intervention.'
                },
                {
                    id: 'ch02-ex03',
                    type: 'multiple-choice',
                    question: 'Given the SCM: Z = U_Z, X = 0.5Z + U_X, Y = 2X + U_Y, with U_Z, U_X, U_Y mutually independent, what is the causal effect of a unit increase in X on Y?',
                    options: [
                        '0.5',
                        '1.0',
                        '2.0',
                        'It depends on the distribution of U_Y'
                    ],
                    answer: 2,
                    explanation: 'The structural equation Y = 2X + U_Y directly tells us the causal effect: a unit increase in X causes Y to increase by 2, regardless of how X was changed. This is the autonomy property of structural equations.'
                },
                {
                    id: 'ch02-ex04',
                    type: 'multiple-choice',
                    question: 'The "autonomy" property of structural equations means:',
                    options: [
                        'Each equation can be estimated independently',
                        'Intervening on one equation does not change the other equations',
                        'The equations are always linear',
                        'Exogenous variables are always Gaussian'
                    ],
                    answer: 1,
                    explanation: 'Autonomy means that each structural equation represents an independent mechanism. When we intervene on one variable (replacing its structural equation), all other structural equations remain unchanged. This is what distinguishes structural from regression equations.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 2: Directed Acyclic Graphs
        // --------------------------------------------------------
        {
            id: 'ch02-sec02',
            title: 'Directed Acyclic Graphs',
            content: `<h2>Directed Acyclic Graphs</h2>
<p>The graphical component of an SCM is a <strong>Directed Acyclic Graph (DAG)</strong> that encodes the qualitative causal structure &mdash; which variables directly cause which others.</p>

<div class="env-block definition">
<div class="env-title">Definition (DAG)</div>
<div class="env-body">
<p>A <strong>directed acyclic graph</strong> \\(G = (V, E)\\) consists of:</p>
<ul>
<li>A finite set of <strong>nodes</strong> (vertices) \\(V\\), representing variables.</li>
<li>A set of <strong>directed edges</strong> \\(E \\subseteq V \\times V\\), where \\((i, j) \\in E\\) means there is an arrow \\(i \\to j\\).</li>
<li>The graph contains <strong>no directed cycles</strong>: there is no sequence \\(V_1 \\to V_2 \\to \\cdots \\to V_k \\to V_1\\).</li>
</ul>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Graph Terminology)</div>
<div class="env-body">
<p>For a DAG \\(G\\):</p>
<ul>
<li><strong>Parents</strong> of \\(V_i\\): \\(\\text{pa}(V_i) = \\{V_j : V_j \\to V_i \\in E\\}\\) &mdash; nodes with a direct edge into \\(V_i\\).</li>
<li><strong>Children</strong> of \\(V_i\\): \\(\\text{ch}(V_i) = \\{V_j : V_i \\to V_j \\in E\\}\\) &mdash; nodes directly caused by \\(V_i\\).</li>
<li><strong>Ancestors</strong> of \\(V_i\\): \\(\\text{an}(V_i)\\) &mdash; all nodes from which there is a directed path to \\(V_i\\).</li>
<li><strong>Descendants</strong> of \\(V_i\\): \\(\\text{de}(V_i)\\) &mdash; all nodes reachable by a directed path from \\(V_i\\).</li>
</ul>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Paths)</div>
<div class="env-body">
<p>A <strong>directed path</strong> from \\(A\\) to \\(B\\) is a sequence \\(A \\to V_1 \\to \\cdots \\to B\\) following arrow directions.</p>
<p>A <strong>path</strong> (undirected) between \\(A\\) and \\(B\\) is any sequence of adjacent nodes, ignoring arrow directions.</p>
<p>A <strong>backdoor path</strong> from \\(X\\) to \\(Y\\) is a path that starts with an arrow <em>into</em> \\(X\\) (i.e., \\(X \\leftarrow \\cdots\\)).</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Topological Ordering)</div>
<div class="env-body">
<p>A <strong>topological ordering</strong> of a DAG is a linear ordering of its nodes such that for every directed edge \\(V_i \\to V_j\\), node \\(V_i\\) appears before \\(V_j\\). Every DAG has at least one topological ordering (and a graph has a topological ordering if and only if it is a DAG).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch02-viz-dag-builder"></div>`,
            visualizations: [
                {
                    id: 'ch02-viz-dag-builder',
                    title: 'Interactive DAG Builder',
                    description: 'Add nodes and edges to build a DAG. Click a node to see its parents, children, ancestors, and descendants.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;

                        var nodes = [
                            {id: 'X', x: 120, y: 120, color: '#58a6ff'},
                            {id: 'Z', x: 350, y: 80, color: '#3fb9a0'},
                            {id: 'Y', x: 580, y: 120, color: '#3fb950'},
                            {id: 'W', x: 250, y: 280, color: '#f0883e'},
                            {id: 'M', x: 450, y: 280, color: '#bc8cff'}
                        ];
                        var edges = [
                            {from: 'X', to: 'W'},
                            {from: 'Z', to: 'X'},
                            {from: 'Z', to: 'Y'},
                            {from: 'W', to: 'M'},
                            {from: 'M', to: 'Y'}
                        ];

                        var selectedNode = null;
                        var dragNode = null;
                        var edgeMode = false;
                        var edgeStart = null;

                        var btnAddNode = VizEngine.createButton(controls, 'Add Node', function() {
                            var id = String.fromCharCode(65 + nodes.length);
                            if (nodes.length >= 26) id = 'N' + nodes.length;
                            nodes.push({id: id, x: 100 + Math.random() * 500, y: 80 + Math.random() * 300, color: '#c9d1d9'});
                            draw();
                        });

                        var btnEdgeMode = VizEngine.createButton(controls, 'Add Edge (click 2 nodes)', function() {
                            edgeMode = !edgeMode;
                            edgeStart = null;
                            btnEdgeMode.textContent = edgeMode ? 'Cancel Edge Mode' : 'Add Edge (click 2 nodes)';
                            btnEdgeMode.style.background = edgeMode ? '#2a1a40' : '#1a1a40';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            nodes = [
                                {id: 'X', x: 120, y: 120, color: '#58a6ff'},
                                {id: 'Z', x: 350, y: 80, color: '#3fb9a0'},
                                {id: 'Y', x: 580, y: 120, color: '#3fb950'},
                                {id: 'W', x: 250, y: 280, color: '#f0883e'},
                                {id: 'M', x: 450, y: 280, color: '#bc8cff'}
                            ];
                            edges = [
                                {from: 'X', to: 'W'},
                                {from: 'Z', to: 'X'},
                                {from: 'Z', to: 'Y'},
                                {from: 'W', to: 'M'},
                                {from: 'M', to: 'Y'}
                            ];
                            selectedNode = null;
                            draw();
                        });

                        function getNode(id) {
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i].id === id) return nodes[i];
                            }
                            return null;
                        }

                        function findNodeAt(px, py) {
                            for (var i = nodes.length - 1; i >= 0; i--) {
                                var dx = px - nodes[i].x, dy = py - nodes[i].y;
                                if (dx * dx + dy * dy < 625) return nodes[i];
                            }
                            return null;
                        }

                        function hasCycle(testEdges) {
                            var adj = {};
                            for (var i = 0; i < nodes.length; i++) adj[nodes[i].id] = [];
                            for (var i = 0; i < testEdges.length; i++) {
                                adj[testEdges[i].from].push(testEdges[i].to);
                            }
                            var visited = {}, recStack = {};
                            function dfs(n) {
                                visited[n] = true;
                                recStack[n] = true;
                                var neighbors = adj[n] || [];
                                for (var i = 0; i < neighbors.length; i++) {
                                    if (!visited[neighbors[i]]) {
                                        if (dfs(neighbors[i])) return true;
                                    } else if (recStack[neighbors[i]]) {
                                        return true;
                                    }
                                }
                                recStack[n] = false;
                                return false;
                            }
                            for (var i = 0; i < nodes.length; i++) {
                                if (!visited[nodes[i].id]) {
                                    if (dfs(nodes[i].id)) return true;
                                }
                            }
                            return false;
                        }

                        function getParents(nodeId) {
                            var res = [];
                            for (var i = 0; i < edges.length; i++) {
                                if (edges[i].to === nodeId) res.push(edges[i].from);
                            }
                            return res;
                        }

                        function getChildren(nodeId) {
                            var res = [];
                            for (var i = 0; i < edges.length; i++) {
                                if (edges[i].from === nodeId) res.push(edges[i].to);
                            }
                            return res;
                        }

                        function getAncestors(nodeId) {
                            var res = {}, queue = getParents(nodeId);
                            while (queue.length > 0) {
                                var curr = queue.shift();
                                if (!res[curr]) {
                                    res[curr] = true;
                                    var pars = getParents(curr);
                                    for (var i = 0; i < pars.length; i++) queue.push(pars[i]);
                                }
                            }
                            return Object.keys(res);
                        }

                        function getDescendants(nodeId) {
                            var res = {}, queue = getChildren(nodeId);
                            while (queue.length > 0) {
                                var curr = queue.shift();
                                if (!res[curr]) {
                                    res[curr] = true;
                                    var ch = getChildren(curr);
                                    for (var i = 0; i < ch.length; i++) queue.push(ch[i]);
                                }
                            }
                            return Object.keys(res);
                        }

                        function topologicalSort() {
                            var inDeg = {};
                            for (var i = 0; i < nodes.length; i++) inDeg[nodes[i].id] = 0;
                            for (var i = 0; i < edges.length; i++) inDeg[edges[i].to]++;
                            var queue = [], order = [];
                            for (var id in inDeg) {
                                if (inDeg[id] === 0) queue.push(id);
                            }
                            while (queue.length > 0) {
                                var curr = queue.shift();
                                order.push(curr);
                                for (var i = 0; i < edges.length; i++) {
                                    if (edges[i].from === curr) {
                                        inDeg[edges[i].to]--;
                                        if (inDeg[edges[i].to] === 0) queue.push(edges[i].to);
                                    }
                                }
                            }
                            return order;
                        }

                        function draw() {
                            viz.clear();

                            // Draw edges
                            for (var i = 0; i < edges.length; i++) {
                                var fromN = getNode(edges[i].from), toN = getNode(edges[i].to);
                                if (!fromN || !toN) continue;
                                var dx = toN.x - fromN.x, dy = toN.y - fromN.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                if (len < 1) continue;
                                var ux = dx / len, uy = dy / len;
                                var sx = fromN.x + ux * 25, sy = fromN.y + uy * 25;
                                var ex = toN.x - ux * 25, ey = toN.y - uy * 25;

                                ctx.strokeStyle = '#4a4a7a';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(sx, sy);
                                ctx.lineTo(ex, ey);
                                ctx.stroke();

                                var angle = Math.atan2(ey - sy, ex - sx);
                                ctx.fillStyle = '#4a4a7a';
                                ctx.beginPath();
                                ctx.moveTo(ex, ey);
                                ctx.lineTo(ex - 10 * Math.cos(angle - Math.PI / 6), ey - 10 * Math.sin(angle - Math.PI / 6));
                                ctx.lineTo(ex - 10 * Math.cos(angle + Math.PI / 6), ey - 10 * Math.sin(angle + Math.PI / 6));
                                ctx.closePath();
                                ctx.fill();
                            }

                            // Highlight sets for selected node
                            var parentSet = {}, childSet = {}, ancestorSet = {}, descendantSet = {};
                            if (selectedNode) {
                                var pArr = getParents(selectedNode);
                                for (var i = 0; i < pArr.length; i++) parentSet[pArr[i]] = true;
                                var cArr = getChildren(selectedNode);
                                for (var i = 0; i < cArr.length; i++) childSet[cArr[i]] = true;
                                var anArr = getAncestors(selectedNode);
                                for (var i = 0; i < anArr.length; i++) ancestorSet[anArr[i]] = true;
                                var deArr = getDescendants(selectedNode);
                                for (var i = 0; i < deArr.length; i++) descendantSet[deArr[i]] = true;
                            }

                            // Draw nodes
                            for (var i = 0; i < nodes.length; i++) {
                                var n = nodes[i];
                                var col = n.color;
                                var ringColor = null;
                                if (selectedNode === n.id) {
                                    ringColor = '#f0f6fc';
                                } else if (parentSet[n.id]) {
                                    ringColor = '#58a6ff';
                                } else if (childSet[n.id]) {
                                    ringColor = '#3fb950';
                                } else if (ancestorSet[n.id]) {
                                    ringColor = '#58a6ff55';
                                } else if (descendantSet[n.id]) {
                                    ringColor = '#3fb95055';
                                }

                                ctx.fillStyle = col + '33';
                                ctx.beginPath();
                                ctx.arc(n.x, n.y, 24, 0, Math.PI * 2);
                                ctx.fill();

                                if (ringColor) {
                                    ctx.strokeStyle = ringColor;
                                    ctx.lineWidth = 3;
                                } else {
                                    ctx.strokeStyle = col;
                                    ctx.lineWidth = 2;
                                }
                                ctx.beginPath();
                                ctx.arc(n.x, n.y, 24, 0, Math.PI * 2);
                                ctx.stroke();

                                ctx.fillStyle = col;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(n.id, n.x, n.y);
                            }

                            // Info panel
                            if (selectedNode) {
                                var infoY = 380;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('Selected: ' + selectedNode +
                                    '  |  Parents: {' + getParents(selectedNode).join(',') +
                                    '}  |  Children: {' + getChildren(selectedNode).join(',') +
                                    '}  |  Ancestors: {' + getAncestors(selectedNode).join(',') +
                                    '}  |  Desc: {' + getDescendants(selectedNode).join(',') + '}', 15, infoY);
                            }

                            // Topological order
                            var topo = topologicalSort();
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Topological order: ' + topo.join(' \u2192 '), 15, 430);

                            if (edgeMode) {
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(edgeStart ? 'Click target node...' : 'Click source node...', 690, 20);
                            }
                        }

                        viz.canvas.addEventListener('mousedown', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var dpr = window.devicePixelRatio || 1;
                            var px = (e.clientX - rect.left);
                            var py = (e.clientY - rect.top);
                            var hit = findNodeAt(px, py);

                            if (edgeMode) {
                                if (hit) {
                                    if (!edgeStart) {
                                        edgeStart = hit.id;
                                    } else {
                                        if (edgeStart !== hit.id) {
                                            var testEdges = edges.concat([{from: edgeStart, to: hit.id}]);
                                            if (!hasCycle(testEdges)) {
                                                edges.push({from: edgeStart, to: hit.id});
                                            }
                                        }
                                        edgeStart = null;
                                        edgeMode = false;
                                        btnEdgeMode.textContent = 'Add Edge (click 2 nodes)';
                                        btnEdgeMode.style.background = '#1a1a40';
                                    }
                                }
                                draw();
                                return;
                            }

                            if (hit) {
                                selectedNode = hit.id;
                                dragNode = hit;
                            } else {
                                selectedNode = null;
                                dragNode = null;
                            }
                            draw();
                        });

                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (!dragNode) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            dragNode.x = e.clientX - rect.left;
                            dragNode.y = e.clientY - rect.top;
                            draw();
                        });

                        viz.canvas.addEventListener('mouseup', function() {
                            dragNode = null;
                        });

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch02-ex05',
                    type: 'multiple-choice',
                    question: 'In the DAG X -> Z -> Y, what is the set of parents of Z?',
                    options: [
                        '{X, Y}',
                        '{X}',
                        '{Y}',
                        '{}'
                    ],
                    answer: 1,
                    explanation: 'Parents of Z are all nodes with a direct arrow into Z. Since X -> Z, the parent set is {X}. Y is a child of Z, not a parent.'
                },
                {
                    id: 'ch02-ex06',
                    type: 'multiple-choice',
                    question: 'Which property characterizes a DAG compared to a general directed graph?',
                    options: [
                        'It has at most one edge between any pair of nodes',
                        'It contains no directed cycles',
                        'Every node has at most one parent',
                        'All paths have the same length'
                    ],
                    answer: 1,
                    explanation: 'The defining property of a DAG (Directed Acyclic Graph) is the absence of directed cycles. It may have multiple edges, multiple parents per node, and paths of varying lengths.'
                },
                {
                    id: 'ch02-ex07',
                    type: 'multiple-choice',
                    question: 'In the DAG A -> B -> C -> D, A -> C, which nodes are ancestors of D?',
                    options: [
                        '{C}',
                        '{B, C}',
                        '{A, B, C}',
                        '{A, B, C, D}'
                    ],
                    answer: 2,
                    explanation: 'Ancestors of D are all nodes from which there is a directed path to D. C -> D (direct parent), B -> C -> D, and A -> B -> C -> D (or A -> C -> D). So ancestors(D) = {A, B, C}. D itself is not its own ancestor.'
                },
                {
                    id: 'ch02-ex08',
                    type: 'multiple-choice',
                    question: 'A backdoor path from X to Y is a path that:',
                    options: [
                        'Goes directly from X to Y',
                        'Starts with an arrow into X (X <- ...)',
                        'Contains only directed edges from X to Y',
                        'Has no colliders'
                    ],
                    answer: 1,
                    explanation: 'A backdoor path from X to Y is any path between X and Y that starts with an arrow pointing into X (i.e., starts as X <- ...). These paths are important because they can create non-causal associations between X and Y.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 3: Causal vs Statistical DAGs
        // --------------------------------------------------------
        {
            id: 'ch02-sec03',
            title: 'Causal vs Statistical DAGs',
            content: `<h2>Causal Markov Condition & Factorization</h2>
<p>A DAG is more than a picture &mdash; it encodes a precise set of statistical independence assumptions through the <strong>Causal Markov Condition</strong>.</p>

<div class="env-block definition">
<div class="env-title">Definition (Causal Markov Condition)</div>
<div class="env-body">
<p>Given a DAG \\(G\\) and a joint distribution \\(P\\) compatible with \\(G\\), each variable \\(V_i\\) is <strong>conditionally independent of all its non-descendants</strong> given its parents:</p>
\\[V_i \\perp\\!\\!\\!\\perp \\text{nd}(V_i) \\mid \\text{pa}(V_i)\\]
<p>where \\(\\text{nd}(V_i) = V \\setminus (\\text{de}(V_i) \\cup \\{V_i\\})\\) is the set of non-descendants of \\(V_i\\).</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Theorem (Causal Factorization / Markov Factorization)</div>
<div class="env-body">
<p>If \\(P\\) satisfies the Causal Markov Condition relative to DAG \\(G\\), then the joint distribution factorizes as:</p>
\\[P(v_1, v_2, \\ldots, v_n) = \\prod_{i=1}^{n} P(v_i \\mid \\text{pa}(v_i))\\]
<p>This is the <strong>Markov factorization</strong>. Conversely, any distribution that factorizes this way satisfies the Causal Markov Condition.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Chain: X -> M -> Y)</div>
<div class="env-body">
<p>The chain \\(X \\to M \\to Y\\) implies:</p>
\\[P(X, M, Y) = P(X) \\cdot P(M \\mid X) \\cdot P(Y \\mid M)\\]
<p>The Markov condition gives \\(X \\perp\\!\\!\\!\\perp Y \\mid M\\) (X is independent of Y given the mediator M), but \\(X \\not\\perp\\!\\!\\!\\perp Y\\) marginally.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Fork: X <- Z -> Y)</div>
<div class="env-body">
<p>The fork \\(X \\leftarrow Z \\to Y\\) implies:</p>
\\[P(X, Z, Y) = P(Z) \\cdot P(X \\mid Z) \\cdot P(Y \\mid Z)\\]
<p>Here \\(X \\perp\\!\\!\\!\\perp Y \\mid Z\\) (confounding disappears when we condition on the common cause Z).</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Collider: X -> Z <- Y)</div>
<div class="env-body">
<p>The collider \\(X \\to Z \\leftarrow Y\\) implies:</p>
\\[P(X, Z, Y) = P(X) \\cdot P(Y) \\cdot P(Z \\mid X, Y)\\]
<p>Here \\(X \\perp\\!\\!\\!\\perp Y\\) marginally, but \\(X \\not\\perp\\!\\!\\!\\perp Y \\mid Z\\) &mdash; conditioning on a collider <em>opens</em> the path and creates an association!</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch02-viz-markov-factorization"></div>`,
            visualizations: [
                {
                    id: 'ch02-viz-markov-factorization',
                    title: 'DAG Structures & Implied Independences',
                    description: 'Explore Chain, Fork, and Collider structures. See the factorization and implied conditional independences for each.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var mode = 0; // 0=chain, 1=fork, 2=collider

                        var structures = [
                            {name: 'Chain: X \u2192 M \u2192 Y', nodes: [{id:'X',x:120,y:180},{id:'M',x:350,y:180},{id:'Y',x:580,y:180}], edges:[{f:0,t:1},{f:1,t:2}]},
                            {name: 'Fork: X \u2190 Z \u2192 Y', nodes: [{id:'X',x:120,y:280},{id:'Z',x:350,y:120},{id:'Y',x:580,y:280}], edges:[{f:1,t:0},{f:1,t:2}]},
                            {name: 'Collider: X \u2192 Z \u2190 Y', nodes: [{id:'X',x:120,y:120},{id:'Z',x:350,y:280},{id:'Y',x:580,y:120}], edges:[{f:0,t:1},{f:2,t:1}]}
                        ];

                        var conditioned = false;

                        VizEngine.createButton(controls, 'Chain', function() { mode = 0; conditioned = false; draw(); });
                        VizEngine.createButton(controls, 'Fork', function() { mode = 1; conditioned = false; draw(); });
                        VizEngine.createButton(controls, 'Collider', function() { mode = 2; conditioned = false; draw(); });
                        VizEngine.createButton(controls, 'Toggle Conditioning', function() { conditioned = !conditioned; draw(); });

                        // Simple probability tables for demonstration
                        var chainProbs = {
                            uncond: [[0.20,0.05],[0.10,0.15],[0.05,0.20],[0.10,0.15]],
                            labels: ['X=0,Y=0','X=0,Y=1','X=1,Y=0','X=1,Y=1']
                        };

                        function draw() {
                            viz.clear();
                            var s = structures[mode];

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(s.name, 350, 30);

                            // Draw edges
                            var nodeColors = [viz.colors.blue, viz.colors.teal, viz.colors.green];
                            for (var i = 0; i < s.edges.length; i++) {
                                var fromN = s.nodes[s.edges[i].f], toN = s.nodes[s.edges[i].t];
                                var dx = toN.x - fromN.x, dy = toN.y - fromN.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var ux = dx / len, uy = dy / len;
                                var sx = fromN.x + ux * 28, sy = fromN.y + uy * 28;
                                var ex = toN.x - ux * 28, ey = toN.y - uy * 28;

                                ctx.strokeStyle = '#6e7681';
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.moveTo(sx, sy);
                                ctx.lineTo(ex, ey);
                                ctx.stroke();

                                var angle = Math.atan2(ey - sy, ex - sx);
                                ctx.fillStyle = '#6e7681';
                                ctx.beginPath();
                                ctx.moveTo(ex, ey);
                                ctx.lineTo(ex - 12 * Math.cos(angle - Math.PI / 6), ey - 12 * Math.sin(angle - Math.PI / 6));
                                ctx.lineTo(ex - 12 * Math.cos(angle + Math.PI / 6), ey - 12 * Math.sin(angle + Math.PI / 6));
                                ctx.closePath();
                                ctx.fill();
                            }

                            // Draw nodes
                            for (var i = 0; i < s.nodes.length; i++) {
                                var n = s.nodes[i];
                                var col = nodeColors[i];
                                var isMiddle = (i === 1);
                                var isCondNode = conditioned && isMiddle;

                                ctx.fillStyle = col + '33';
                                ctx.beginPath();
                                ctx.arc(n.x, n.y, 26, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.strokeStyle = col;
                                ctx.lineWidth = isCondNode ? 4 : 2;
                                ctx.beginPath();
                                ctx.arc(n.x, n.y, 26, 0, Math.PI * 2);
                                ctx.stroke();

                                if (isCondNode) {
                                    // Double ring to indicate conditioning
                                    ctx.strokeStyle = viz.colors.yellow;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.arc(n.x, n.y, 30, 0, Math.PI * 2);
                                    ctx.stroke();
                                }

                                ctx.fillStyle = col;
                                ctx.font = 'bold 18px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(n.id, n.x, n.y);
                            }

                            // Info panel at bottom
                            var infoY = 340;
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(20, infoY - 10, 660, 110);
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(20, infoY - 10, 660, 110);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            var middleId = s.nodes[1].id;
                            var leftId = s.nodes[0].id;
                            var rightId = s.nodes[2].id;

                            if (mode === 0) {
                                // Chain
                                ctx.fillText('Factorization: P(X,M,Y) = P(X) \u00b7 P(M|X) \u00b7 P(Y|M)', 40, infoY + 10);
                                if (conditioned) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.fillText('Conditioning on M: X \u22a5 Y | M  (path blocked)', 40, infoY + 35);
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fillText('Information flow X \u2192 M \u2192 Y is blocked when M is observed.', 40, infoY + 60);
                                } else {
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.fillText('Marginal: X \u22a5\u0338 Y  (path open, association flows through M)', 40, infoY + 35);
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fillText('X and Y are marginally dependent because information flows through M.', 40, infoY + 60);
                                }
                            } else if (mode === 1) {
                                // Fork
                                ctx.fillText('Factorization: P(X,Z,Y) = P(Z) \u00b7 P(X|Z) \u00b7 P(Y|Z)', 40, infoY + 10);
                                if (conditioned) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.fillText('Conditioning on Z: X \u22a5 Y | Z  (confounding removed)', 40, infoY + 35);
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fillText('The common cause Z explains all the association between X and Y.', 40, infoY + 60);
                                } else {
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.fillText('Marginal: X \u22a5\u0338 Y  (spurious association via common cause Z)', 40, infoY + 35);
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fillText('X and Y appear associated because they share a common cause Z.', 40, infoY + 60);
                                }
                            } else {
                                // Collider
                                ctx.fillText('Factorization: P(X,Z,Y) = P(X) \u00b7 P(Y) \u00b7 P(Z|X,Y)', 40, infoY + 10);
                                if (conditioned) {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.fillText('Conditioning on Z: X \u22a5\u0338 Y | Z  (collider bias!)', 40, infoY + 35);
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fillText('Conditioning on a collider OPENS the path and creates a spurious association.', 40, infoY + 60);
                                } else {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.fillText('Marginal: X \u22a5 Y  (path blocked at collider)', 40, infoY + 35);
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fillText('X and Y are marginally independent because Z is a collider that blocks the path.', 40, infoY + 60);
                                }
                            }

                            // Status
                            ctx.fillStyle = conditioned ? viz.colors.yellow : viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText(conditioned ? 'Conditioned on middle node' : 'Unconditional', 670, infoY + 85);
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch02-ex09',
                    type: 'multiple-choice',
                    question: 'In the fork structure X <- Z -> Y, what happens when we condition on Z?',
                    options: [
                        'X and Y become more dependent',
                        'X and Y become conditionally independent',
                        'The causal effect of X on Y is identified',
                        'A new path between X and Y opens'
                    ],
                    answer: 1,
                    explanation: 'In a fork (common cause structure), X and Y are marginally dependent due to the common cause Z. Conditioning on Z blocks this path, making X and Y conditionally independent: X _||_ Y | Z.'
                },
                {
                    id: 'ch02-ex10',
                    type: 'multiple-choice',
                    question: 'In the collider structure X -> Z <- Y, conditioning on Z:',
                    options: [
                        'Blocks the path between X and Y',
                        'Has no effect on the relationship between X and Y',
                        'Opens the path and creates a spurious association between X and Y',
                        'Identifies the causal effect of X on Y'
                    ],
                    answer: 2,
                    explanation: 'Conditioning on a collider opens the path between X and Y, creating a spurious association (collider bias/selection bias). This is a fundamental result in causal inference: while chains and forks are blocked by conditioning, colliders are opened by conditioning.'
                },
                {
                    id: 'ch02-ex11',
                    type: 'multiple-choice',
                    question: 'For the DAG A -> B -> C, A -> C, the Markov factorization of P(A,B,C) is:',
                    options: [
                        'P(A) P(B) P(C)',
                        'P(A) P(B|A) P(C|A,B)',
                        'P(A) P(B|A) P(C|B)',
                        'P(C|A,B) P(B) P(A)'
                    ],
                    answer: 1,
                    explanation: 'The Markov factorization writes P(v) = prod P(v_i | pa(v_i)). Here pa(A) = {}, pa(B) = {A}, pa(C) = {A, B}. So P(A,B,C) = P(A) P(B|A) P(C|A,B).'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 4: Interventions & the do-operator
        // --------------------------------------------------------
        {
            id: 'ch02-sec04',
            title: 'Interventions & the do-operator',
            content: `<h2>Interventions & the do-operator</h2>
<p>The most powerful aspect of SCMs is their ability to model <strong>interventions</strong> &mdash; what happens when we actively <em>set</em> a variable to a value, rather than merely observing it.</p>

<div class="env-block definition">
<div class="env-title">Definition (Intervention / do-operator)</div>
<div class="env-body">
<p>An <strong>intervention</strong> \\(\\text{do}(X = x)\\) on variable \\(X\\) in an SCM \\(\\mathcal{M}\\) produces a modified model \\(\\mathcal{M}_x\\) obtained by:</p>
<ol>
<li><strong>Replacing</strong> the structural equation for \\(X\\) with the constant \\(X = x\\).</li>
<li><strong>Keeping</strong> all other structural equations unchanged.</li>
</ol>
<p>Graphically, this corresponds to <strong>graph surgery</strong>: remove all incoming edges to \\(X\\) in the DAG, while keeping all outgoing edges.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Interventional Distribution)</div>
<div class="env-body">
<p>The <strong>interventional distribution</strong> (post-intervention distribution) is:</p>
\\[P(y \\mid \\text{do}(X = x)) = P_{\\mathcal{M}_x}(y)\\]
<p>This is fundamentally different from the <strong>conditional distribution</strong> \\(P(y \\mid X = x)\\), which reflects passive observation rather than active manipulation.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Theorem (Truncated Factorization Formula)</div>
<div class="env-body">
<p>For a DAG with variables \\(V = \\{V_1, \\ldots, V_n\\}\\), the interventional distribution under \\(\\text{do}(X = x)\\) is given by:</p>
\\[P(v_1, \\ldots, v_n \\mid \\text{do}(X = x)) = \\begin{cases} \\displaystyle\\prod_{i: V_i \\neq X} P(v_i \\mid \\text{pa}(v_i)) & \\text{if } v_X = x \\\\[6pt] 0 & \\text{if } v_X \\neq x \\end{cases}\\]
<p>We simply <strong>delete</strong> the factor \\(P(X \\mid \\text{pa}(X))\\) from the Markov factorization and fix \\(X = x\\). This is called the <strong>truncated factorization</strong>.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (do(X=x) vs conditioning)</div>
<div class="env-body">
<p>Consider the fork \\(Z \\to X\\), \\(Z \\to Y\\):</p>
<ul>
<li><strong>Observational</strong>: \\(P(Y \\mid X = x) \\neq P(Y)\\) because \\(X\\) and \\(Y\\) are confounded by \\(Z\\).</li>
<li><strong>Interventional</strong>: \\(P(Y \\mid \\text{do}(X = x)) = P(Y)\\) because cutting \\(Z \\to X\\) removes the confounding. \\(X\\) has no causal effect on \\(Y\\) in this graph.</li>
</ul>
<p>This example highlights why \\(P(Y \\mid \\text{do}(X = x)) \\neq P(Y \\mid X = x)\\) in general.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch02-viz-do-operator"></div>`,
            visualizations: [
                {
                    id: 'ch02-viz-do-operator',
                    title: 'Graph Surgery & the do-operator',
                    description: 'See how do(X=x) performs graph surgery: incoming edges to X are removed, changing the distribution.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var doActive = false;
                        var doValue = 1.0;
                        var animT = 0;
                        var animating = false;

                        VizEngine.createButton(controls, 'Toggle do(X=x)', function() {
                            doActive = !doActive;
                            animT = 0;
                            animating = true;
                        });
                        VizEngine.createSlider(controls, 'do(X) value', -2, 2, doValue, 0.5, function(v) { doValue = v; });

                        // SCM: Z -> X -> Y, Z -> Y (confounding)
                        var nodePositions = {
                            pre: {Z: {x: 170, y: 100}, X: {x: 170, y: 280}, Y: {x: 170, y: 380}},
                            post: {Z: {x: 520, y: 100}, X: {x: 520, y: 280}, Y: {x: 520, y: 380}}
                        };

                        function seededRandom(seed) {
                            var x = Math.sin(seed) * 10000;
                            return x - Math.floor(x);
                        }

                        function drawArrowBetween(fx, fy, tx, ty, color, lw, dashed) {
                            var dx = tx - fx, dy = ty - fy;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            if (len < 1) return;
                            var ux = dx / len, uy = dy / len;
                            var sx = fx + ux * 26, sy = fy + uy * 26;
                            var ex = tx - ux * 26, ey = ty - uy * 26;

                            ctx.strokeStyle = color;
                            ctx.lineWidth = lw || 2;
                            if (dashed) ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(ex, ey);
                            ctx.stroke();
                            if (dashed) ctx.setLineDash([]);

                            var angle = Math.atan2(ey - sy, ex - sx);
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.moveTo(ex, ey);
                            ctx.lineTo(ex - 10 * Math.cos(angle - Math.PI / 6), ey - 10 * Math.sin(angle - Math.PI / 6));
                            ctx.lineTo(ex - 10 * Math.cos(angle + Math.PI / 6), ey - 10 * Math.sin(angle + Math.PI / 6));
                            ctx.closePath();
                            ctx.fill();
                        }

                        function drawNode(x, y, label, color, highlight) {
                            ctx.fillStyle = color + '33';
                            ctx.beginPath();
                            ctx.arc(x, y, 24, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.strokeStyle = highlight || color;
                            ctx.lineWidth = highlight ? 3 : 2;
                            ctx.beginPath();
                            ctx.arc(x, y, 24, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.fillStyle = color;
                            ctx.font = 'bold 18px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(label, x, y);
                        }

                        function drawDistributionBar(x, y, w, h, values, colors, label) {
                            var total = 0;
                            for (var i = 0; i < values.length; i++) total += values[i];
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(label, x + w / 2, y - 8);

                            var barH = h - 5;
                            for (var i = 0; i < values.length; i++) {
                                var frac = values[i] / total;
                                var bh = frac * barH;
                                ctx.fillStyle = colors[i];
                                ctx.fillRect(x + i * (w / values.length), y + h - bh, w / values.length - 2, bh);
                            }
                        }

                        function draw() {
                            viz.clear();

                            // Left panel: Pre-intervention (observational)
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(15, 15, 320, 420);
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(15, 15, 320, 420);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Observational: P(Y | X=x)', 175, 40);

                            // Pre-intervention DAG
                            var pn = nodePositions.pre;
                            drawArrowBetween(pn.Z.x, pn.Z.y, pn.X.x, pn.X.y, viz.colors.blue, 2);
                            drawArrowBetween(pn.X.x, pn.X.y, pn.Y.x, pn.Y.y, viz.colors.green, 2);
                            drawArrowBetween(pn.Z.x + 24, pn.Z.y + 10, pn.Y.x + 24, pn.Y.y - 10, viz.colors.orange, 2);

                            drawNode(pn.Z.x, pn.Z.y, 'Z', viz.colors.teal);
                            drawNode(pn.X.x, pn.X.y, 'X', viz.colors.blue);
                            drawNode(pn.Y.x, pn.Y.y, 'Y', viz.colors.green);

                            // Labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Z \u2192 X (confounding path)', 220, 185);
                            ctx.fillText('Z \u2192 Y (direct)', 220, 205);
                            ctx.fillText('X \u2192 Y (causal)', 220, 225);

                            // Factorization
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('P(Z) P(X|Z) P(Y|X,Z)', 175, 415);

                            // Right panel: Post-intervention
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(365, 15, 320, 420);
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(365, 15, 320, 420);

                            ctx.fillStyle = doActive ? viz.colors.yellow : viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Interventional: P(Y | do(X=' + doValue.toFixed(1) + '))', 525, 40);

                            var ppn = nodePositions.post;

                            // Post-intervention edges (Z -> X removed via surgery)
                            if (doActive) {
                                // Animate the cut
                                var cutAlpha = Math.max(0, 1 - animT * 3);
                                if (cutAlpha > 0) {
                                    ctx.globalAlpha = cutAlpha;
                                    drawArrowBetween(ppn.Z.x, ppn.Z.y, ppn.X.x, ppn.X.y, viz.colors.red, 2, true);
                                    ctx.globalAlpha = 1;
                                }

                                // Draw X mark on the cut edge
                                if (animT > 0.3) {
                                    var midx = (ppn.Z.x + ppn.X.x) / 2 - 15;
                                    var midy = (ppn.Z.y + ppn.X.y) / 2;
                                    ctx.strokeStyle = viz.colors.red;
                                    ctx.lineWidth = 3;
                                    ctx.beginPath();
                                    ctx.moveTo(midx - 8, midy - 8);
                                    ctx.lineTo(midx + 8, midy + 8);
                                    ctx.moveTo(midx + 8, midy - 8);
                                    ctx.lineTo(midx - 8, midy + 8);
                                    ctx.stroke();
                                }
                            } else {
                                drawArrowBetween(ppn.Z.x, ppn.Z.y, ppn.X.x, ppn.X.y, viz.colors.blue, 2);
                            }

                            drawArrowBetween(ppn.X.x, ppn.X.y, ppn.Y.x, ppn.Y.y, viz.colors.green, 2);
                            drawArrowBetween(ppn.Z.x + 24, ppn.Z.y + 10, ppn.Y.x + 24, ppn.Y.y - 10, viz.colors.orange, 2);

                            drawNode(ppn.Z.x, ppn.Z.y, 'Z', viz.colors.teal);
                            drawNode(ppn.X.x, ppn.X.y, 'X', viz.colors.blue, doActive ? viz.colors.yellow : null);
                            drawNode(ppn.Y.x, ppn.Y.y, 'Y', viz.colors.green);

                            if (doActive) {
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('X := ' + doValue.toFixed(1) + ' (forced)', 560, ppn.X.y);
                                ctx.fillText('Z \u2192 X edge REMOVED', 560, 185);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('P(Z) P(Y|X=' + doValue.toFixed(1) + ',Z)  [truncated]', 525, 415);
                            } else {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('No intervention yet', 560, 185);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('P(Z) P(X|Z) P(Y|X,Z)', 525, 415);
                            }

                            // Key insight box
                            ctx.fillStyle = '#0d1117';
                            ctx.fillRect(120, 60, 460, 28);
                            ctx.strokeStyle = doActive ? viz.colors.yellow : '#30363d';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(120, 60, 460, 28);

                            ctx.fillStyle = doActive ? viz.colors.yellow : viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            if (doActive) {
                                ctx.fillText('Graph surgery removes Z \u2192 X: P(Y|do(X=x)) uses truncated factorization', 350, 78);
                            } else {
                                ctx.fillText('P(Y|X=x) \u2260 P(Y|do(X=x)) when confounders exist', 350, 78);
                            }
                        }

                        viz.animate(function() {
                            if (animating) {
                                animT += 0.02;
                                if (animT >= 1) { animT = 1; animating = false; }
                            }
                            draw();
                        });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch02-ex12',
                    type: 'multiple-choice',
                    question: 'What does do(X=x) mean graphically in a DAG?',
                    options: [
                        'Remove all edges connected to X',
                        'Remove all outgoing edges from X',
                        'Remove all incoming edges to X and set X = x',
                        'Add new edges from X to all other variables'
                    ],
                    answer: 2,
                    explanation: 'The do-operator do(X=x) performs "graph surgery": it removes all incoming edges to X (severing X from its causes) and fixes X at value x. Outgoing edges from X are preserved, because X still acts as a cause for its children.'
                },
                {
                    id: 'ch02-ex13',
                    type: 'multiple-choice',
                    question: 'For the DAG Z -> X -> Y with Z -> Y, the truncated factorization P(y|do(X=x)) equals:',
                    options: [
                        'P(y|x)',
                        'sum_z P(y|x,z) P(z|x)',
                        'sum_z P(y|x,z) P(z)',
                        'P(y|x) P(x)'
                    ],
                    answer: 2,
                    explanation: 'Under do(X=x), we delete the factor P(X|Z) from the full factorization. P(y|do(x)) = sum_z P(y|x,z) P(z). Note we use P(z) not P(z|x), because the intervention severs the Z -> X link, so Z is no longer influenced by conditioning on X.'
                },
                {
                    id: 'ch02-ex14',
                    type: 'multiple-choice',
                    question: 'In which situation does P(Y|do(X=x)) = P(Y|X=x)?',
                    options: [
                        'Always, by definition',
                        'When X and Y have a common cause',
                        'When there are no backdoor paths from X to Y (no confounding)',
                        'Never; they are fundamentally different quantities'
                    ],
                    answer: 2,
                    explanation: 'P(Y|do(X=x)) = P(Y|X=x) when there are no backdoor paths from X to Y, i.e., when there is no confounding. In that case, removing incoming edges to X (graph surgery) does not change the relevant part of the distribution, so the interventional and conditional distributions coincide.'
                },
                {
                    id: 'ch02-ex15',
                    type: 'multiple-choice',
                    question: 'The "autonomy" of structural equations is crucial for the do-operator because:',
                    options: [
                        'It ensures all variables are independent',
                        'It allows us to replace one equation (the intervention) while keeping all others unchanged',
                        'It guarantees the model has a unique solution',
                        'It means we can estimate all parameters from observational data'
                    ],
                    answer: 1,
                    explanation: 'Autonomy means each structural equation represents an independent mechanism. This is what makes the do-operator well-defined: when we intervene on X (replacing its equation), all other equations remain valid. Without autonomy, changing one equation could invalidate others.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 5: Connecting SCM to Potential Outcomes
        // --------------------------------------------------------
        {
            id: 'ch02-sec05',
            title: 'Connecting SCM to Potential Outcomes',
            content: `<h2>Connecting SCM to Potential Outcomes</h2>
<p>The Structural Causal Model framework and the Potential Outcomes (Rubin Causal Model) framework are not rival approaches &mdash; they are deeply connected. The SCM provides a foundation that <em>generates</em> potential outcomes.</p>

<div class="env-block definition">
<div class="env-title">Theorem (SCM Generates Potential Outcomes)</div>
<div class="env-body">
<p>Given an SCM \\(\\mathcal{M} = (\\mathbf{U}, \\mathbf{V}, \\mathbf{F})\\), the potential outcome \\(Y_i(x)\\) for unit \\(i\\) is defined as:</p>
\\[Y_i(x) = Y_{\\mathcal{M}_x}(u_i)\\]
<p>where \\(\\mathcal{M}_x\\) is the modified SCM under \\(\\text{do}(X = x)\\) and \\(u_i\\) is the exogenous realization for unit \\(i\\).</p>
<p>That is: compute \\(Y\\) from the modified model with \\(X\\) forced to \\(x\\), using unit \\(i\\)'s background variables.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example</div>
<div class="env-body">
<p>SCM: \\(X = U_X\\), \\(Y = 2X + 3 + U_Y\\)</p>
<p>For unit \\(i\\) with \\(U_{X,i} = 0.5\\) and \\(U_{Y,i} = -1\\):</p>
<ul>
<li>Under \\(\\text{do}(X = 0)\\): \\(Y_i(0) = 2(0) + 3 + (-1) = 2\\)</li>
<li>Under \\(\\text{do}(X = 1)\\): \\(Y_i(1) = 2(1) + 3 + (-1) = 4\\)</li>
<li>Individual treatment effect: \\(Y_i(1) - Y_i(0) = 2\\)</li>
</ul>
<p>The SCM provides the mechanism to compute <em>both</em> potential outcomes for the same unit &mdash; resolving the "fundamental problem" at the model level.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Comparison of Frameworks</div>
<div class="env-body">
<table style="width:100%;border-collapse:collapse;">
<tr style="border-bottom:1px solid #30363d;">
<th style="text-align:left;padding:8px;">Aspect</th>
<th style="text-align:left;padding:8px;">Potential Outcomes (Rubin)</th>
<th style="text-align:left;padding:8px;">SCM (Pearl)</th>
</tr>
<tr style="border-bottom:1px solid #30363d;">
<td style="padding:8px;">Primitives</td>
<td style="padding:8px;">\\(Y(0), Y(1)\\) for each unit</td>
<td style="padding:8px;">\\((\\mathbf{U}, \\mathbf{V}, \\mathbf{F})\\)</td>
</tr>
<tr style="border-bottom:1px solid #30363d;">
<td style="padding:8px;">Causal effect</td>
<td style="padding:8px;">\\(Y(1) - Y(0)\\)</td>
<td style="padding:8px;">\\(P(Y \\mid \\text{do}(X=1)) - P(Y \\mid \\text{do}(X=0))\\)</td>
</tr>
<tr style="border-bottom:1px solid #30363d;">
<td style="padding:8px;">Strengths</td>
<td style="padding:8px;">Clear estimands, connects to experiments</td>
<td style="padding:8px;">Encodes mechanisms, supports do-calculus</td>
</tr>
<tr>
<td style="padding:8px;">Identification</td>
<td style="padding:8px;">Assumptions stated verbally (ignorability)</td>
<td style="padding:8px;">Assumptions encoded in DAG, testable implications</td>
</tr>
</table>
</div>
</div>

<div class="viz-placeholder" data-viz="ch02-viz-scm-po-bridge"></div>`,
            visualizations: [
                {
                    id: 'ch02-viz-scm-po-bridge',
                    title: 'SCM to Potential Outcomes Bridge',
                    description: 'Side-by-side comparison: SCM structural equations generate the potential outcomes table for each unit.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var betaVal = 2.0;
                        var interceptVal = 3.0;

                        var sBeta = VizEngine.createSlider(controls, '\u03b2 (causal effect)', 0, 5, betaVal, 0.5, function(v) { betaVal = v; draw(); });
                        var sIntercept = VizEngine.createSlider(controls, 'intercept', 0, 6, interceptVal, 0.5, function(v) { interceptVal = v; draw(); });

                        // Fixed units with U values
                        var units = [
                            {id: 1, ux: 1, uy: -1.0},
                            {id: 2, ux: 0, uy: 0.5},
                            {id: 3, ux: 1, uy: -0.5},
                            {id: 4, ux: 0, uy: 1.0},
                            {id: 5, ux: 1, uy: 0.0},
                            {id: 6, ux: 0, uy: -0.5}
                        ];

                        function draw() {
                            viz.clear();

                            // --- Left panel: SCM ---
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(15, 15, 310, 420);
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(15, 15, 310, 420);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('SCM Specification', 170, 40);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '14px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Structural Equations:', 35, 75);

                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = '15px -apple-system,sans-serif';
                            ctx.fillText('X = U_X  (binary: 0 or 1)', 45, 105);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('Y = ' + betaVal.toFixed(1) + ' X + ' + interceptVal.toFixed(1) + ' + U_Y', 45, 135);

                            // DAG mini
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.fillText('Causal DAG:', 35, 175);

                            // X node
                            ctx.fillStyle = viz.colors.blue + '33';
                            ctx.beginPath(); ctx.arc(100, 220, 20, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(100, 220, 20, 0, Math.PI * 2); ctx.stroke();
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('X', 100, 221);

                            // Y node
                            ctx.fillStyle = viz.colors.green + '33';
                            ctx.beginPath(); ctx.arc(230, 220, 20, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(230, 220, 20, 0, Math.PI * 2); ctx.stroke();
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('Y', 230, 221);

                            // Arrow X -> Y
                            ctx.strokeStyle = '#6e7681'; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(122, 220); ctx.lineTo(205, 220); ctx.stroke();
                            var angle = 0;
                            ctx.fillStyle = '#6e7681';
                            ctx.beginPath();
                            ctx.moveTo(208, 220);
                            ctx.lineTo(198, 214);
                            ctx.lineTo(198, 226);
                            ctx.closePath();
                            ctx.fill();

                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('\u03b2 = ' + betaVal.toFixed(1), 165, 208);

                            // do(X=0) and do(X=1) explanation
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('do(X=0): Y(0) = ' + interceptVal.toFixed(1) + ' + U_Y', 35, 275);
                            ctx.fillText('do(X=1): Y(1) = ' + betaVal.toFixed(1) + ' + ' + interceptVal.toFixed(1) + ' + U_Y', 35, 300);
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.fillText('ITE = Y(1) - Y(0) = ' + betaVal.toFixed(1), 35, 330);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('ATE = E[Y(1) - Y(0)] = ' + betaVal.toFixed(1), 35, 355);

                            ctx.fillStyle = viz.colors.purple;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Note: In this linear SCM, the ITE is', 35, 390);
                            ctx.fillText('constant = \u03b2 for all units.', 35, 407);

                            // --- Right panel: Potential Outcomes Table ---
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(345, 15, 340, 420);
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(345, 15, 340, 420);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Potential Outcomes Table', 515, 40);

                            // Table headers
                            var tableX = 365, tableY = 65;
                            var colW = [45, 45, 50, 55, 55, 55];
                            var headers = ['Unit', 'U_X', 'U_Y', 'Y(0)', 'Y(1)', 'ITE'];
                            var headerColors = [viz.colors.text, viz.colors.text, viz.colors.text, viz.colors.blue, viz.colors.green, viz.colors.yellow];

                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            var cx = tableX;
                            for (var h = 0; h < headers.length; h++) {
                                ctx.fillStyle = headerColors[h];
                                ctx.textAlign = 'center';
                                ctx.fillText(headers[h], cx + colW[h] / 2, tableY);
                                cx += colW[h];
                            }

                            // Separator
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(tableX, tableY + 8);
                            ctx.lineTo(tableX + 305, tableY + 8);
                            ctx.stroke();

                            // Table rows
                            ctx.font = '12px -apple-system,sans-serif';
                            for (var i = 0; i < units.length; i++) {
                                var u = units[i];
                                var y0 = interceptVal + u.uy;
                                var y1 = betaVal + interceptVal + u.uy;
                                var ite = y1 - y0;
                                var rowY = tableY + 28 + i * 32;
                                var observed = u.ux; // what X actually was

                                cx = tableX;
                                var rowData = [u.id, u.ux, u.uy.toFixed(1), y0.toFixed(1), y1.toFixed(1), ite.toFixed(1)];
                                var rowColors = [viz.colors.text, viz.colors.text, viz.colors.text, viz.colors.blue, viz.colors.green, viz.colors.yellow];

                                for (var c = 0; c < rowData.length; c++) {
                                    ctx.fillStyle = rowColors[c];
                                    // Highlight the observed outcome
                                    if (c === 3 && observed === 0) {
                                        ctx.font = 'bold 12px -apple-system,sans-serif';
                                    } else if (c === 4 && observed === 1) {
                                        ctx.font = 'bold 12px -apple-system,sans-serif';
                                    } else {
                                        ctx.font = '12px -apple-system,sans-serif';
                                    }
                                    // Dim the counterfactual
                                    if ((c === 3 && observed === 1) || (c === 4 && observed === 0)) {
                                        ctx.globalAlpha = 0.4;
                                    }
                                    ctx.textAlign = 'center';
                                    ctx.fillText(rowData[c], cx + colW[c] / 2, rowY);
                                    ctx.globalAlpha = 1;
                                    cx += colW[c];
                                }

                                // Row separator
                                ctx.strokeStyle = '#1a1a4080';
                                ctx.beginPath();
                                ctx.moveTo(tableX, rowY + 12);
                                ctx.lineTo(tableX + 305, rowY + 12);
                                ctx.stroke();
                            }

                            // ATE calculation
                            var ateY = tableY + 28 + units.length * 32 + 15;
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('ATE = E[Y(1) - Y(0)] = ' + betaVal.toFixed(1), tableX, ateY);

                            // Legend
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Bold = observed outcome', tableX, ateY + 25);
                            ctx.fillStyle = viz.colors.text;
                            ctx.globalAlpha = 0.4;
                            ctx.fillText('Dim = counterfactual (unobserved)', tableX, ateY + 42);
                            ctx.globalAlpha = 1;

                            ctx.fillStyle = viz.colors.purple;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('SCM lets us compute BOTH Y(0) and Y(1)', tableX, ateY + 65);
                            ctx.fillText('by running the model under each do(X=x).', tableX, ateY + 82);
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch02-ex16',
                    type: 'multiple-choice',
                    question: 'In the SCM framework, the potential outcome Y(x) for unit i is defined as:',
                    options: [
                        'The observed value of Y when X happens to equal x',
                        'The value of Y computed from the modified SCM M_x using unit i\'s exogenous variables',
                        'The expected value of Y over all possible units',
                        'The value of Y when we condition on X = x in the observational distribution'
                    ],
                    answer: 1,
                    explanation: 'Y_i(x) = Y_{M_x}(u_i): we take the modified SCM (with do(X=x) applied), plug in unit i\'s specific exogenous variables u_i, and compute the resulting Y. This is how the SCM generates potential outcomes.'
                },
                {
                    id: 'ch02-ex17',
                    type: 'multiple-choice',
                    question: 'Given SCM: X = U_X, Y = 3X + 1 + U_Y, with U_X in {0,1} and U_Y = 0.5 for a specific unit. What are Y(0) and Y(1)?',
                    options: [
                        'Y(0) = 0.5, Y(1) = 3.5',
                        'Y(0) = 1.5, Y(1) = 4.5',
                        'Y(0) = 1, Y(1) = 4',
                        'Y(0) = 1.5, Y(1) = 3.5'
                    ],
                    answer: 1,
                    explanation: 'Under do(X=0): Y(0) = 3(0) + 1 + 0.5 = 1.5. Under do(X=1): Y(1) = 3(1) + 1 + 0.5 = 4.5. The individual treatment effect is Y(1) - Y(0) = 3, which equals the coefficient beta.'
                },
                {
                    id: 'ch02-ex18',
                    type: 'multiple-choice',
                    question: 'What advantage does the SCM framework have over the potential outcomes framework?',
                    options: [
                        'SCMs can handle continuous treatments while PO cannot',
                        'SCMs encode causal mechanisms and support algorithmic identification via do-calculus',
                        'SCMs do not require any assumptions',
                        'SCMs can always identify causal effects while PO cannot'
                    ],
                    answer: 1,
                    explanation: 'The key advantage of SCMs is that they encode causal mechanisms explicitly through structural equations and DAGs. This allows for algorithmic identification of causal effects via do-calculus, and the graphical structure encodes testable implications. Both frameworks can handle continuous treatments and require assumptions.'
                }
            ]
        }
    ]
});
