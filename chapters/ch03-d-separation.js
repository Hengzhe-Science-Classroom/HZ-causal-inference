// ============================================================
// Chapter 3 · d-Separation & Conditional Independence
// Reading Independence from Graphs d-分离与条件独立
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch03',
    number: 3,
    title: 'd-Separation & Conditional Independence',
    subtitle: 'Reading Independence from Graphs d-分离与条件独立',
    sections: [
        // --------------------------------------------------------
        // Section 1: Paths in DAGs
        // --------------------------------------------------------
        {
            id: 'ch03-sec01',
            title: 'Paths in DAGs',
            content: `<h2>Paths in DAGs</h2>
<p>Understanding how information flows through a directed acyclic graph (DAG) is the key to reading off conditional independencies. There are exactly <strong>three fundamental structures</strong> that can appear along any path between two nodes.</p>

<div class="env-block definition">
<div class="env-title">Definition (Chain / Mediation)</div>
<div class="env-body">
<p>A <strong>chain</strong> (or causal chain) has the form \\(X \\to M \\to Y\\). The variable \\(M\\) mediates the effect of \\(X\\) on \\(Y\\). Information flows from \\(X\\) to \\(Y\\) through \\(M\\).</p>
<p><strong>Conditioning on \\(M\\)</strong> blocks this path: \\(X \\perp\\!\\!\\!\\perp Y \\mid M\\).</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Fork / Common Cause)</div>
<div class="env-body">
<p>A <strong>fork</strong> has the form \\(X \\leftarrow C \\to Y\\). The variable \\(C\\) is a common cause (confounder) of \\(X\\) and \\(Y\\). Information flows from \\(X\\) to \\(Y\\) via \\(C\\), creating a spurious association.</p>
<p><strong>Conditioning on \\(C\\)</strong> blocks this path: \\(X \\perp\\!\\!\\!\\perp Y \\mid C\\).</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Collider / Common Effect)</div>
<div class="env-body">
<p>A <strong>collider</strong> has the form \\(X \\to C \\leftarrow Y\\). The variable \\(C\\) is a common effect of \\(X\\) and \\(Y\\). Unlike chains and forks, information does <em>not</em> flow through a collider.</p>
<p><strong>Conditioning on \\(C\\)</strong> (or any descendant of \\(C\\)) <em>opens</em> this path, creating an association between \\(X\\) and \\(Y\\): \\(X \\not\\!\\perp\\!\\!\\!\\perp Y \\mid C\\).</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Key Intuition</div>
<div class="env-body">
<p>Chains and forks are <strong>open by default</strong> and blocked by conditioning. Colliders are <strong>blocked by default</strong> and opened by conditioning. This asymmetry is the heart of d-separation.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Explaining Away)</div>
<div class="env-body">
<p>Suppose both a burglar (\\(B\\)) and an earthquake (\\(E\\)) can trigger an alarm (\\(A\\)): \\(B \\to A \\leftarrow E\\). Unconditionally, knowing about a burglar tells us nothing about earthquakes. But if we <em>know the alarm went off</em> (condition on \\(A\\)), learning it was a burglar "explains away" the alarm and makes an earthquake less likely. This is called <strong>explaining away</strong> or <strong>Berkson's paradox</strong>.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch03-viz-three-structures"></div>`,
            visualizations: [
                {
                    id: 'ch03-viz-three-structures',
                    title: 'Three Fundamental Structures',
                    description: 'Interactive 3-node structures showing information flow with/without conditioning',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        var mode = 'chain'; // 'chain', 'fork', 'collider'
                        var conditioned = false;

                        var btnChain = VizEngine.createButton(controls, 'Chain X\u2192M\u2192Y', function() { mode = 'chain'; draw(); });
                        var btnFork = VizEngine.createButton(controls, 'Fork X\u2190C\u2192Y', function() { mode = 'fork'; draw(); });
                        var btnCollider = VizEngine.createButton(controls, 'Collider X\u2192C\u2190Y', function() { mode = 'collider'; draw(); });
                        var btnCond = VizEngine.createButton(controls, 'Toggle Conditioning', function() { conditioned = !conditioned; draw(); });

                        function drawNode(x, y, label, isConditioned) {
                            ctx.beginPath();
                            ctx.arc(x, y, 30, 0, Math.PI * 2);
                            if (isConditioned) {
                                ctx.fillStyle = '#f0883e44';
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 3;
                                ctx.stroke();
                                // Draw box around conditioned node
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(x - 38, y - 38, 76, 76);
                            } else {
                                ctx.fillStyle = '#58a6ff22';
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.stroke();
                            }
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 18px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(label, x, y);
                        }

                        function drawArrow(x1, y1, x2, y2, active) {
                            var dx = x2 - x1, dy = y2 - y1;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            var sx = x1 + ux * 34, sy = y1 + uy * 34;
                            var ex = x2 - ux * 34, ey = y2 - uy * 34;

                            ctx.beginPath();
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(ex, ey);
                            ctx.strokeStyle = active ? viz.colors.green : viz.colors.text;
                            ctx.lineWidth = active ? 3 : 2;
                            if (!active) ctx.setLineDash([6, 4]);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Arrowhead
                            var angle = Math.atan2(ey - sy, ex - sx);
                            ctx.beginPath();
                            ctx.moveTo(ex, ey);
                            ctx.lineTo(ex - 12 * Math.cos(angle - 0.4), ey - 12 * Math.sin(angle - 0.4));
                            ctx.lineTo(ex - 12 * Math.cos(angle + 0.4), ey - 12 * Math.sin(angle + 0.4));
                            ctx.closePath();
                            ctx.fillStyle = active ? viz.colors.green : viz.colors.text;
                            ctx.fill();
                        }

                        function drawFlowParticles(x1, y1, x2, y2, t) {
                            var dx = x2 - x1, dy = y2 - y1;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            for (var i = 0; i < 3; i++) {
                                var frac = ((t * 0.001 + i * 0.33) % 1);
                                var px = x1 + ux * 34 + (dx - ux * 68) * frac;
                                var py = y1 + uy * 34 + (dy - uy * 68) * frac;
                                ctx.beginPath();
                                ctx.arc(px, py, 4, 0, Math.PI * 2);
                                ctx.fillStyle = viz.colors.green;
                                ctx.fill();
                            }
                        }

                        var startTime = Date.now();

                        function draw() {
                            var t = Date.now() - startTime;
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            var cx = W / 2, cy = H / 2;
                            var spacing = 160;
                            var nodeX = cx - spacing, nodeM = cx, nodeY = cx + spacing;
                            var nodeTop = cy;

                            var labels, arrows, middleLabel;
                            var pathOpen;

                            if (mode === 'chain') {
                                labels = ['X', 'M', 'Y'];
                                middleLabel = 'M';
                                pathOpen = !conditioned;
                                drawArrow(nodeX, nodeTop, nodeM, nodeTop, pathOpen);
                                drawArrow(nodeM, nodeTop, nodeY, nodeTop, pathOpen);
                                if (pathOpen) {
                                    drawFlowParticles(nodeX, nodeTop, nodeM, nodeTop, t);
                                    drawFlowParticles(nodeM, nodeTop, nodeY, nodeTop, t);
                                }
                                drawNode(nodeX, nodeTop, 'X', false);
                                drawNode(nodeM, nodeTop, 'M', conditioned);
                                drawNode(nodeY, nodeTop, 'Y', false);
                            } else if (mode === 'fork') {
                                labels = ['X', 'C', 'Y'];
                                middleLabel = 'C';
                                pathOpen = !conditioned;
                                drawArrow(nodeM, nodeTop - 80, nodeX, nodeTop + 40, pathOpen);
                                drawArrow(nodeM, nodeTop - 80, nodeY, nodeTop + 40, pathOpen);
                                if (pathOpen) {
                                    drawFlowParticles(nodeM, nodeTop - 80, nodeX, nodeTop + 40, t);
                                    drawFlowParticles(nodeM, nodeTop - 80, nodeY, nodeTop + 40, t);
                                }
                                drawNode(nodeX, nodeTop + 40, 'X', false);
                                drawNode(nodeM, nodeTop - 80, 'C', conditioned);
                                drawNode(nodeY, nodeTop + 40, 'Y', false);
                            } else {
                                labels = ['X', 'C', 'Y'];
                                middleLabel = 'C';
                                pathOpen = conditioned;
                                drawArrow(nodeX, nodeTop - 80, nodeM, nodeTop + 40, pathOpen);
                                drawArrow(nodeY, nodeTop - 80, nodeM, nodeTop + 40, pathOpen);
                                if (pathOpen) {
                                    drawFlowParticles(nodeX, nodeTop - 80, nodeM, nodeTop + 40, t);
                                    drawFlowParticles(nodeY, nodeTop - 80, nodeM, nodeTop + 40, t);
                                }
                                drawNode(nodeX, nodeTop - 80, 'X', false);
                                drawNode(nodeM, nodeTop + 40, 'C', conditioned);
                                drawNode(nodeY, nodeTop - 80, 'Y', false);
                            }

                            // Status text
                            ctx.fillStyle = pathOpen ? viz.colors.green : viz.colors.red;
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            var statusText = pathOpen ? 'Path OPEN - Information flows' : 'Path BLOCKED - No information flow';
                            ctx.fillText(statusText, cx, H - 50);

                            // Structure name
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            var structName = mode === 'chain' ? 'Chain (Mediation): X \u2192 M \u2192 Y' :
                                           mode === 'fork' ? 'Fork (Common Cause): X \u2190 C \u2192 Y' :
                                           'Collider (Common Effect): X \u2192 C \u2190 Y';
                            ctx.fillText(structName, cx, 30);

                            var condText = conditioned ? 'Conditioned on ' + middleLabel + ' (boxed)' : 'Not conditioning on ' + middleLabel;
                            ctx.fillStyle = conditioned ? viz.colors.orange : viz.colors.text;
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.fillText(condText, cx, 55);
                        }

                        viz.animate(function() { draw(); });
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch03-ex01',
                    type: 'mc',
                    question: 'In the chain X \u2192 M \u2192 Y, what happens to the association between X and Y when we condition on M?',
                    options: [
                        'The association remains unchanged',
                        'The association is blocked (X \u22A5\u22A5 Y | M)',
                        'The association becomes stronger',
                        'A new spurious association is created'
                    ],
                    answer: 1,
                    explanation: 'In a chain, the middle node M mediates the information flow from X to Y. Conditioning on M blocks this path, rendering X and Y conditionally independent given M.'
                },
                {
                    id: 'ch03-ex02',
                    type: 'mc',
                    question: 'Which structure is BLOCKED by default (without conditioning)?',
                    options: [
                        'Chain (X \u2192 M \u2192 Y)',
                        'Fork (X \u2190 C \u2192 Y)',
                        'Collider (X \u2192 C \u2190 Y)',
                        'Both chain and fork'
                    ],
                    answer: 2,
                    explanation: 'A collider X \u2192 C \u2190 Y is the only structure that is blocked by default. Chains and forks allow information to flow without conditioning. Conditioning on the collider (or its descendants) opens the path.'
                },
                {
                    id: 'ch03-ex03',
                    type: 'mc',
                    question: 'In a fork X \u2190 C \u2192 Y, the variable C is called a:',
                    options: [
                        'Mediator',
                        'Collider',
                        'Confounder (common cause)',
                        'Instrument'
                    ],
                    answer: 2,
                    explanation: 'In a fork, C is a common cause of both X and Y. It creates a spurious (non-causal) association between X and Y. This is exactly what we call a confounder.'
                },
                {
                    id: 'ch03-ex04',
                    type: 'mc',
                    question: 'Berkson\'s paradox arises from conditioning on a:',
                    options: [
                        'Confounder',
                        'Mediator',
                        'Collider',
                        'Instrumental variable'
                    ],
                    answer: 2,
                    explanation: 'Berkson\'s paradox (explaining away) occurs when we condition on a collider. This opens a previously blocked path and creates a spurious association between the two causes.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 2: d-Separation Definition & Algorithm
        // --------------------------------------------------------
        {
            id: 'ch03-sec02',
            title: 'd-Separation Definition & Algorithm',
            content: `<h2>d-Separation Definition & Algorithm</h2>
<p>We now formalize the rules from Section 1 into a general criterion for reading conditional independencies from any DAG.</p>

<div class="env-block definition">
<div class="env-title">Definition (Blocked Path)</div>
<div class="env-body">
<p>A path \\(p\\) between nodes \\(X\\) and \\(Y\\) is <strong>blocked</strong> by a set \\(Z\\) if there exists a node \\(W\\) on \\(p\\) such that either:</p>
<ol>
<li>\\(W\\) is a <strong>non-collider</strong> on \\(p\\) (chain or fork) and \\(W \\in Z\\), or</li>
<li>\\(W\\) is a <strong>collider</strong> on \\(p\\) and neither \\(W\\) nor any descendant of \\(W\\) is in \\(Z\\).</li>
</ol>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (d-Separation)</div>
<div class="env-body">
<p>Two sets of nodes \\(X\\) and \\(Y\\) are <strong>d-separated</strong> by a set \\(Z\\) in a DAG \\(G\\), written \\(X \\perp_{G} Y \\mid Z\\), if and only if <em>every</em> path between any node in \\(X\\) and any node in \\(Y\\) is blocked by \\(Z\\).</p>
<p>If \\(X\\) and \\(Y\\) are not d-separated by \\(Z\\), they are <strong>d-connected</strong> given \\(Z\\).</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (Soundness of d-Separation)</div>
<div class="env-body">
<p>If \\(X\\) and \\(Y\\) are d-separated by \\(Z\\) in the DAG \\(G\\), then \\(X \\perp\\!\\!\\!\\perp Y \\mid Z\\) in every distribution that is Markov with respect to \\(G\\).</p>
</div>
</div>

<div class="env-block remark">
<div class="env-title">The Bayes Ball Algorithm</div>
<div class="env-body">
<p>The <strong>Bayes Ball algorithm</strong> (Shachter, 1998) provides an efficient way to determine d-separation. The idea: imagine a ball being sent along paths in the graph. The ball follows these rules:</p>
<ol>
<li><strong>At a non-collider not in \\(Z\\)</strong>: the ball passes through (path continues).</li>
<li><strong>At a non-collider in \\(Z\\)</strong>: the ball is blocked (path stops).</li>
<li><strong>At a collider not in \\(Z\\)</strong> (and no descendant in \\(Z\\)): the ball is blocked.</li>
<li><strong>At a collider in \\(Z\\)</strong> (or descendant in \\(Z\\)): the ball passes through.</li>
</ol>
<p>If no ball can reach from \\(X\\) to \\(Y\\), then \\(X\\) and \\(Y\\) are d-separated given \\(Z\\).</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example</div>
<div class="env-body">
<p>Consider the DAG: \\(A \\to B \\to C\\), \\(A \\to D \\leftarrow C\\). Is \\(A \\perp_{G} C \\mid B\\)?</p>
<p><strong>Path 1</strong>: \\(A \\to B \\to C\\). \\(B\\) is a non-collider and \\(B \\in \\{B\\}\\), so this path is <em>blocked</em>.</p>
<p><strong>Path 2</strong>: \\(A \\to D \\leftarrow C\\). \\(D\\) is a collider and \\(D \\notin \\{B\\}\\), so this path is <em>blocked</em>.</p>
<p>Both paths are blocked, so \\(A \\perp_{G} C \\mid B\\). \\(\\checkmark\\)</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch03-viz-d-separation"></div>`,
            visualizations: [
                {
                    id: 'ch03-viz-d-separation',
                    title: 'd-Separation Interactive Explorer',
                    description: 'Select nodes to condition on and see which paths are blocked',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 440, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        // DAG: A->B->C, A->D, C->D, B->E
                        var nodes = [
                            {id: 'A', x: 100, y: 80, label: 'A'},
                            {id: 'B', x: 250, y: 80, label: 'B'},
                            {id: 'C', x: 400, y: 80, label: 'C'},
                            {id: 'D', x: 250, y: 220, label: 'D'},
                            {id: 'E', x: 550, y: 160, label: 'E'}
                        ];
                        var edges = [
                            {from: 'A', to: 'B'},
                            {from: 'B', to: 'C'},
                            {from: 'A', to: 'D'},
                            {from: 'C', to: 'D'},
                            {from: 'B', to: 'E'}
                        ];

                        var condSet = {};
                        var sourceNode = 'A';
                        var targetNode = 'C';

                        // Build adjacency
                        function getChildren(nodeId) {
                            return edges.filter(function(e) { return e.from === nodeId; }).map(function(e) { return e.to; });
                        }
                        function getParents(nodeId) {
                            return edges.filter(function(e) { return e.to === nodeId; }).map(function(e) { return e.from; });
                        }

                        function getDescendants(nodeId) {
                            var visited = {};
                            var queue = [nodeId];
                            while (queue.length > 0) {
                                var curr = queue.shift();
                                if (visited[curr]) continue;
                                visited[curr] = true;
                                var ch = getChildren(curr);
                                for (var i = 0; i < ch.length; i++) queue.push(ch[i]);
                            }
                            delete visited[nodeId];
                            return visited;
                        }

                        function isCollider(path, idx) {
                            if (idx === 0 || idx === path.length - 1) return false;
                            var prev = path[idx - 1], curr = path[idx], next = path[idx + 1];
                            var inFromPrev = edges.some(function(e) { return e.from === prev && e.to === curr; });
                            var inFromNext = edges.some(function(e) { return e.from === next && e.to === curr; });
                            return inFromPrev && inFromNext;
                        }

                        // Find all undirected paths between source and target
                        function findAllPaths(src, tgt) {
                            var results = [];
                            var visited = {};

                            function getNeighbors(nodeId) {
                                var nbrs = [];
                                for (var i = 0; i < edges.length; i++) {
                                    if (edges[i].from === nodeId) nbrs.push(edges[i].to);
                                    if (edges[i].to === nodeId) nbrs.push(edges[i].from);
                                }
                                return nbrs;
                            }

                            function dfs(curr, path) {
                                if (curr === tgt) {
                                    results.push(path.slice());
                                    return;
                                }
                                var nbrs = getNeighbors(curr);
                                for (var i = 0; i < nbrs.length; i++) {
                                    if (!visited[nbrs[i]]) {
                                        visited[nbrs[i]] = true;
                                        path.push(nbrs[i]);
                                        dfs(nbrs[i], path);
                                        path.pop();
                                        visited[nbrs[i]] = false;
                                    }
                                }
                            }

                            visited[src] = true;
                            dfs(src, [src]);
                            return results;
                        }

                        function isPathBlocked(path, cond) {
                            for (var i = 1; i < path.length - 1; i++) {
                                var nodeId = path[i];
                                var collider = isCollider(path, i);
                                if (!collider) {
                                    if (cond[nodeId]) return true;
                                } else {
                                    var desc = getDescendants(nodeId);
                                    var opened = cond[nodeId];
                                    if (!opened) {
                                        var descKeys = Object.keys(desc);
                                        for (var j = 0; j < descKeys.length; j++) {
                                            if (cond[descKeys[j]]) { opened = true; break; }
                                        }
                                    }
                                    if (!opened) return true;
                                }
                            }
                            return false;
                        }

                        // Buttons to select source/target
                        var info = document.createElement('div');
                        info.style.cssText = 'color:#c9d1d9;font-size:0.8rem;margin-bottom:6px;';
                        info.textContent = 'Click nodes to toggle conditioning. Use buttons to set source/target.';
                        controls.appendChild(info);

                        var srcLabel = document.createElement('span');
                        srcLabel.style.cssText = 'color:#58a6ff;font-size:0.8rem;margin-right:8px;';
                        srcLabel.textContent = 'Source: A';
                        controls.appendChild(srcLabel);

                        var tgtLabel = document.createElement('span');
                        tgtLabel.style.cssText = 'color:#3fb950;font-size:0.8rem;margin-right:8px;';
                        tgtLabel.textContent = 'Target: C';
                        controls.appendChild(tgtLabel);

                        for (var ni = 0; ni < nodes.length; ni++) {
                            (function(n) {
                                VizEngine.createButton(controls, 'Src=' + n.label, function() { sourceNode = n.id; srcLabel.textContent = 'Source: ' + n.label; draw(); });
                                VizEngine.createButton(controls, 'Tgt=' + n.label, function() { targetNode = n.id; tgtLabel.textContent = 'Target: ' + n.label; draw(); });
                            })(nodes[ni]);
                        }

                        VizEngine.createButton(controls, 'Clear Conditioning', function() { condSet = {}; draw(); });

                        // Click to condition
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            for (var i = 0; i < nodes.length; i++) {
                                var dx = mx - nodes[i].x, dy = my - nodes[i].y;
                                if (dx * dx + dy * dy < 900) {
                                    if (condSet[nodes[i].id]) {
                                        delete condSet[nodes[i].id];
                                    } else {
                                        condSet[nodes[i].id] = true;
                                    }
                                    draw();
                                    return;
                                }
                            }
                        });

                        function getNodeById(id) {
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i].id === id) return nodes[i];
                            }
                            return null;
                        }

                        function drawArrow(n1, n2, color, lw) {
                            var dx = n2.x - n1.x, dy = n2.y - n1.y;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            var sx = n1.x + ux * 28, sy = n1.y + uy * 28;
                            var ex = n2.x - ux * 28, ey = n2.y - uy * 28;

                            ctx.beginPath();
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(ex, ey);
                            ctx.strokeStyle = color;
                            ctx.lineWidth = lw || 2;
                            ctx.stroke();

                            var angle = Math.atan2(ey - sy, ex - sx);
                            ctx.beginPath();
                            ctx.moveTo(ex, ey);
                            ctx.lineTo(ex - 10 * Math.cos(angle - 0.4), ey - 10 * Math.sin(angle - 0.4));
                            ctx.lineTo(ex - 10 * Math.cos(angle + 0.4), ey - 10 * Math.sin(angle + 0.4));
                            ctx.closePath();
                            ctx.fillStyle = color;
                            ctx.fill();
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('d-Separation Explorer: DAG with 5 nodes', W / 2, 20);

                            // Draw edges
                            for (var ei = 0; ei < edges.length; ei++) {
                                var fromN = getNodeById(edges[ei].from);
                                var toN = getNodeById(edges[ei].to);
                                drawArrow(fromN, toN, viz.colors.text, 1.5);
                            }

                            // Find paths and color them
                            var paths = findAllPaths(sourceNode, targetNode);
                            var allBlocked = true;

                            // Draw path analysis
                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            var yOff = 290;
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Paths from ' + sourceNode + ' to ' + targetNode + ':', 30, yOff);
                            yOff += 22;

                            for (var pi = 0; pi < paths.length; pi++) {
                                var blocked = isPathBlocked(paths[pi], condSet);
                                if (!blocked) allBlocked = false;
                                var pathStr = paths[pi].join(' \u2014 ');
                                ctx.fillStyle = blocked ? viz.colors.red : viz.colors.green;
                                ctx.fillText((blocked ? '\u2717 BLOCKED: ' : '\u2713 OPEN: ') + pathStr, 50, yOff);
                                yOff += 20;
                            }

                            if (paths.length === 0) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('No path exists.', 50, yOff);
                                yOff += 20;
                            }

                            // d-Separation verdict
                            yOff += 10;
                            var condNames = Object.keys(condSet);
                            var condStr = condNames.length > 0 ? '{' + condNames.join(', ') + '}' : '\u2205';
                            var dSep = paths.length === 0 || allBlocked;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = dSep ? viz.colors.green : viz.colors.red;
                            ctx.fillText(
                                sourceNode + (dSep ? ' \u22A5 ' : ' \u22A5\u0338 ') + targetNode + ' | ' + condStr +
                                (dSep ? '  (d-separated)' : '  (d-connected)'),
                                W / 2, yOff
                            );

                            // Draw nodes
                            for (var ni = 0; ni < nodes.length; ni++) {
                                var n = nodes[ni];
                                var isSrc = n.id === sourceNode;
                                var isTgt = n.id === targetNode;
                                var isCond = condSet[n.id];

                                ctx.beginPath();
                                ctx.arc(n.x, n.y, 25, 0, Math.PI * 2);
                                if (isCond) {
                                    ctx.fillStyle = '#f0883e33';
                                    ctx.fill();
                                    ctx.strokeStyle = viz.colors.orange;
                                    ctx.lineWidth = 3;
                                    ctx.stroke();
                                    ctx.strokeRect(n.x - 32, n.y - 32, 64, 64);
                                } else if (isSrc) {
                                    ctx.fillStyle = '#58a6ff33';
                                    ctx.fill();
                                    ctx.strokeStyle = viz.colors.blue;
                                    ctx.lineWidth = 3;
                                    ctx.stroke();
                                } else if (isTgt) {
                                    ctx.fillStyle = '#3fb95033';
                                    ctx.fill();
                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 3;
                                    ctx.stroke();
                                } else {
                                    ctx.fillStyle = '#1a1a40';
                                    ctx.fill();
                                    ctx.strokeStyle = viz.colors.text;
                                    ctx.lineWidth = 1.5;
                                    ctx.stroke();
                                }

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 16px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(n.label, n.x, n.y);
                            }

                            // Legend
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('\u25CF Source', W - 160, 50);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('\u25CF Target', W - 160, 68);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('\u25A0 Conditioned', W - 160, 86);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Click node to condition', W - 160, 104);
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch03-ex05',
                    type: 'mc',
                    question: 'In the DAG A \u2192 B \u2192 C, A \u2192 D \u2190 C, is A d-separated from C given {B}?',
                    options: [
                        'No, because the path A \u2192 D \u2190 C is open',
                        'Yes, because both paths are blocked',
                        'No, because conditioning on B opens a new path',
                        'It depends on the probability distribution'
                    ],
                    answer: 1,
                    explanation: 'Path A \u2192 B \u2192 C is blocked because B is a non-collider in the conditioning set. Path A \u2192 D \u2190 C is blocked because D is a collider and D is not in {B}. Both paths blocked means A \u22A5 C | {B}.'
                },
                {
                    id: 'ch03-ex06',
                    type: 'mc',
                    question: 'In the DAG A \u2192 B \u2192 C, A \u2192 D \u2190 C, is A d-separated from C given {B, D}?',
                    options: [
                        'Yes, both paths are blocked',
                        'No, because conditioning on D opens the collider path',
                        'Yes, because D is a descendant of A',
                        'No, because B is a mediator'
                    ],
                    answer: 1,
                    explanation: 'Path A \u2192 B \u2192 C is blocked (B is conditioned). But path A \u2192 D \u2190 C: D is a collider, and D is in the conditioning set, so this collider is OPENED. Since one path is open, A and C are d-connected given {B, D}.'
                },
                {
                    id: 'ch03-ex07',
                    type: 'mc',
                    question: 'The Bayes Ball algorithm says: at a collider NOT in the conditioning set Z, the ball is:',
                    options: [
                        'Passed through',
                        'Blocked',
                        'Reflected back to the sender',
                        'Split into two balls'
                    ],
                    answer: 1,
                    explanation: 'At a collider not in Z (and with no descendant in Z), the ball is blocked. The collider must be "activated" by conditioning on it (or a descendant) for the ball to pass through.'
                },
                {
                    id: 'ch03-ex08',
                    type: 'mc',
                    question: 'If X has no descendants, and C is a collider on the only path between X and Y, conditioning on a descendant of C will:',
                    options: [
                        'Block the path',
                        'Have no effect',
                        'Open the path (same as conditioning on C)',
                        'Only open the path if X is also conditioned on'
                    ],
                    answer: 2,
                    explanation: 'Conditioning on a descendant of a collider has the same effect as conditioning on the collider itself: it opens the path. This is a crucial detail in d-separation that is sometimes overlooked.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 3: Faithfulness & Markov Properties
        // --------------------------------------------------------
        {
            id: 'ch03-sec03',
            title: 'Faithfulness & Markov Properties',
            content: `<h2>Faithfulness & Markov Properties</h2>
<p>d-Separation gives us conditional independencies implied by the graph. But what is the precise relationship between a DAG and the probability distribution it represents?</p>

<div class="env-block definition">
<div class="env-title">Definition (Markov Property / Markov Compatibility)</div>
<div class="env-body">
<p>A distribution \\(P\\) is <strong>Markov</strong> with respect to a DAG \\(G\\) (or \\(P\\) satisfies the <strong>global Markov property</strong>) if for every disjoint triple \\((X, Y, Z)\\):</p>
\\[X \\perp_{G} Y \\mid Z \\implies X \\perp\\!\\!\\!\\perp_{P} Y \\mid Z\\]
<p>In words: every d-separation in the graph implies conditional independence in the distribution.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Local Markov Property)</div>
<div class="env-body">
<p>Each node is conditionally independent of its non-descendants given its parents:</p>
\\[X_i \\perp\\!\\!\\!\\perp \\text{NonDesc}(X_i) \\mid \\text{Pa}(X_i)\\]
<p>The global and local Markov properties are equivalent for DAGs.</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (Factorization / Markov Equivalence)</div>
<div class="env-body">
<p>The following are equivalent for a DAG \\(G\\) and distribution \\(P\\):</p>
<ol>
<li>\\(P\\) satisfies the global Markov property w.r.t. \\(G\\).</li>
<li>\\(P\\) satisfies the local Markov property w.r.t. \\(G\\).</li>
<li>\\(P\\) factorizes according to \\(G\\): \\(P(X_1, \\ldots, X_n) = \\prod_{i=1}^{n} P(X_i \\mid \\text{Pa}(X_i))\\).</li>
</ol>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Faithfulness)</div>
<div class="env-body">
<p>A distribution \\(P\\) is <strong>faithful</strong> to a DAG \\(G\\) if the converse also holds:</p>
\\[X \\perp\\!\\!\\!\\perp_{P} Y \\mid Z \\implies X \\perp_{G} Y \\mid Z\\]
<p>In words: <em>all</em> conditional independencies in \\(P\\) are captured by d-separation in \\(G\\). There are no "extra" independencies that arise from special parameter values.</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Faithfulness Can Fail</div>
<div class="env-body">
<p>Faithfulness is an assumption, not a guarantee. It can fail when:</p>
<ul>
<li><strong>Exact cancellation</strong>: In \\(X \\to Y \\leftarrow Z\\) with \\(X \\to Z\\), if the direct and indirect effects of \\(X\\) on \\(Y\\) perfectly cancel, we get \\(X \\perp\\!\\!\\!\\perp Y\\) even though they are d-connected.</li>
<li><strong>Deterministic relationships</strong>: If \\(Y = f(X)\\) exactly, additional independencies may arise.</li>
</ul>
<p>Faithfulness violations have <strong>Lebesgue measure zero</strong> in the parameter space, so they are "rare" in a measure-theoretic sense, but they can occur in practice.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Minimality)</div>
<div class="env-body">
<p>A DAG \\(G\\) is a <strong>minimal I-map</strong> for \\(P\\) if \\(P\\) is Markov with respect to \\(G\\), and removing any edge from \\(G\\) would violate the Markov property. Minimality is weaker than faithfulness.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch03-viz-faithfulness"></div>`,
            visualizations: [
                {
                    id: 'ch03-viz-faithfulness',
                    title: 'Faithful vs Unfaithful Distributions',
                    description: 'Example showing how parameter cancellation can violate faithfulness',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        var alpha = 0.5;  // X -> Y direct
                        var beta = 0.8;   // X -> Z
                        var gamma = 0.6;  // Z -> Y

                        VizEngine.createSlider(controls, 'Direct X\u2192Y (\u03B1)', -2, 2, alpha, 0.1, function(v) { alpha = v; draw(); });
                        VizEngine.createSlider(controls, 'X\u2192Z (\u03B2)', -2, 2, beta, 0.1, function(v) { beta = v; draw(); });
                        VizEngine.createSlider(controls, 'Z\u2192Y (\u03B3)', -2, 2, gamma, 0.1, function(v) { gamma = v; draw(); });
                        VizEngine.createButton(controls, 'Set Cancellation (\u03B1 = -\u03B2\u03B3)', function() {
                            alpha = -(beta * gamma);
                            alpha = Math.round(alpha * 10) / 10;
                            draw();
                        });

                        function drawNode(x, y, label) {
                            ctx.beginPath();
                            ctx.arc(x, y, 25, 0, Math.PI * 2);
                            ctx.fillStyle = '#58a6ff22';
                            ctx.fill();
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(label, x, y);
                        }

                        function drawEdge(x1, y1, x2, y2, label, val) {
                            var dx = x2 - x1, dy = y2 - y1;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            var sx = x1 + ux * 28, sy = y1 + uy * 28;
                            var ex = x2 - ux * 28, ey = y2 - uy * 28;

                            var col = val > 0 ? viz.colors.green : (val < 0 ? viz.colors.red : viz.colors.text);
                            var thick = Math.min(Math.abs(val) * 2 + 1, 5);

                            ctx.beginPath();
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(ex, ey);
                            ctx.strokeStyle = col;
                            ctx.lineWidth = thick;
                            ctx.stroke();

                            var angle = Math.atan2(ey - sy, ex - sx);
                            ctx.beginPath();
                            ctx.moveTo(ex, ey);
                            ctx.lineTo(ex - 10 * Math.cos(angle - 0.4), ey - 10 * Math.sin(angle - 0.4));
                            ctx.lineTo(ex - 10 * Math.cos(angle + 0.4), ey - 10 * Math.sin(angle + 0.4));
                            ctx.closePath();
                            ctx.fillStyle = col;
                            ctx.fill();

                            var mx = (sx + ex) / 2 - uy * 18;
                            var my = (sy + ey) / 2 + ux * 18;
                            ctx.fillStyle = col;
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(label + ' = ' + val.toFixed(1), mx, my);
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            // DAG: X -> Y, X -> Z -> Y
                            var xX = 120, yX = 100;
                            var xZ = 350, yZ = 100;
                            var xY = 350, yY = 260;

                            drawEdge(xX, yX, xY, yY, '\u03B1', alpha);
                            drawEdge(xX, yX, xZ, yZ, '\u03B2', beta);
                            drawEdge(xZ, yZ, xY, yY, '\u03B3', gamma);

                            drawNode(xX, yX, 'X');
                            drawNode(xZ, yZ, 'Z');
                            drawNode(xY, yY, 'Y');

                            // Total effect
                            var totalEffect = alpha + beta * gamma;
                            var isFaithful = Math.abs(totalEffect) > 0.05;

                            // Analysis panel
                            var px = 480, py = 60;
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(px, py, 200, 200);
                            ctx.strokeStyle = viz.colors.text;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(px, py, 200, 200);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Effect Analysis', px + 10, py + 22);

                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Direct: \u03B1 = ' + alpha.toFixed(2), px + 10, py + 50);
                            ctx.fillText('Indirect: \u03B2\u03B3 = ' + (beta * gamma).toFixed(2), px + 10, py + 72);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system, sans-serif';
                            ctx.fillText('Total: \u03B1 + \u03B2\u03B3 = ' + totalEffect.toFixed(2), px + 10, py + 100);

                            ctx.fillStyle = isFaithful ? viz.colors.green : viz.colors.red;
                            ctx.font = 'bold 13px -apple-system, sans-serif';
                            ctx.fillText(isFaithful ? 'FAITHFUL' : 'UNFAITHFUL', px + 10, py + 135);

                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            if (!isFaithful) {
                                ctx.fillText('Direct & indirect effects', px + 10, py + 158);
                                ctx.fillText('cancel! X\u22A5\u22A5Y despite', px + 10, py + 174);
                                ctx.fillText('d-connection in the graph.', px + 10, py + 190);
                            } else {
                                ctx.fillText('d-connected X\u2014Y matches', px + 10, py + 158);
                                ctx.fillText('statistical dependence.', px + 10, py + 174);
                            }

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Faithfulness: DAG X \u2192 Z \u2192 Y with X \u2192 Y', W / 2, 30);
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch03-ex09',
                    type: 'mc',
                    question: 'The global Markov property states that:',
                    options: [
                        'd-separation implies statistical independence',
                        'Statistical independence implies d-separation',
                        'd-connection implies statistical dependence',
                        'All of the above'
                    ],
                    answer: 0,
                    explanation: 'The global Markov property says: if X and Y are d-separated given Z in the DAG, then X \u22A5\u22A5 Y | Z in the distribution. This is a one-way implication. The converse (independence implies d-separation) is the faithfulness assumption.'
                },
                {
                    id: 'ch03-ex10',
                    type: 'mc',
                    question: 'Faithfulness can fail when:',
                    options: [
                        'The DAG has too many nodes',
                        'Direct and indirect effects exactly cancel',
                        'There are no colliders in the graph',
                        'The conditioning set is empty'
                    ],
                    answer: 1,
                    explanation: 'Faithfulness fails when a distribution has conditional independencies not implied by d-separation. The classic case is exact cancellation: if the direct effect X \u2192 Y and indirect effect X \u2192 Z \u2192 Y perfectly cancel, then X \u22A5\u22A5 Y even though they are d-connected.'
                },
                {
                    id: 'ch03-ex11',
                    type: 'mc',
                    question: 'The factorization P(X1,...,Xn) = \u220F P(Xi | Pa(Xi)) is equivalent to:',
                    options: [
                        'Only the global Markov property',
                        'Only the local Markov property',
                        'Both global and local Markov properties (all three are equivalent)',
                        'Faithfulness'
                    ],
                    answer: 2,
                    explanation: 'For DAGs, the global Markov property, local Markov property, and factorization according to the DAG are all equivalent characterizations of Markov compatibility. Faithfulness is a strictly stronger condition.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 4: Backdoor Criterion
        // --------------------------------------------------------
        {
            id: 'ch03-sec04',
            title: 'Backdoor Criterion',
            content: `<h2>Backdoor Criterion</h2>
<p>The <strong>backdoor criterion</strong> is the most widely used tool for identifying causal effects from observational data. It tells us which variables to adjust for in order to estimate the causal effect of \\(X\\) on \\(Y\\).</p>

<div class="env-block definition">
<div class="env-title">Definition (Backdoor Path)</div>
<div class="env-body">
<p>A <strong>backdoor path</strong> from \\(X\\) to \\(Y\\) is any path that starts with an arrow <em>into</em> \\(X\\) (i.e., \\(X \\leftarrow \\cdots\\)). These are non-causal paths that create confounding.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Backdoor Criterion)</div>
<div class="env-body">
<p>A set of variables \\(Z\\) satisfies the <strong>backdoor criterion</strong> relative to an ordered pair \\((X, Y)\\) in a DAG \\(G\\) if:</p>
<ol>
<li>No node in \\(Z\\) is a <strong>descendant</strong> of \\(X\\).</li>
<li>\\(Z\\) <strong>blocks every backdoor path</strong> from \\(X\\) to \\(Y\\).</li>
</ol>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (Backdoor Adjustment)</div>
<div class="env-body">
<p>If \\(Z\\) satisfies the backdoor criterion relative to \\((X, Y)\\), then the causal effect is identifiable and given by:</p>
\\[P(Y \\mid do(X = x)) = \\sum_{z} P(Y \\mid X = x, Z = z) \\, P(Z = z)\\]
<p>For continuous variables:</p>
\\[P(y \\mid do(x)) = \\int P(y \\mid x, z) \\, p(z) \\, dz\\]
<p>This is the <strong>adjustment formula</strong> (or backdoor adjustment).</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example</div>
<div class="env-body">
<p>Consider the DAG: \\(C \\to X \\to Y\\), \\(C \\to Y\\). The causal path is \\(X \\to Y\\). The backdoor path is \\(X \\leftarrow C \\to Y\\).</p>
<p>Does \\(Z = \\{C\\}\\) satisfy the backdoor criterion?</p>
<ol>
<li>\\(C\\) is not a descendant of \\(X\\). \\(\\checkmark\\)</li>
<li>\\(\\{C\\}\\) blocks the backdoor path \\(X \\leftarrow C \\to Y\\) (since \\(C\\) is a non-collider conditioned on). \\(\\checkmark\\)</li>
</ol>
<p>Yes! So \\(P(Y \\mid do(X)) = \\sum_c P(Y \\mid X, C = c) P(C = c)\\).</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Common Mistake</div>
<div class="env-body">
<p>Do not include descendants of \\(X\\) in the adjustment set! If \\(M\\) is a mediator (\\(X \\to M \\to Y\\)), adjusting for \\(M\\) blocks part of the causal effect you are trying to estimate. If \\(M\\) is a collider on a backdoor path, adjusting for it can <em>open</em> that path.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch03-viz-backdoor"></div>`,
            visualizations: [
                {
                    id: 'ch03-viz-backdoor',
                    title: 'Backdoor Criterion Explorer',
                    description: 'Interactive DAG with highlighted backdoor paths and valid adjustment sets',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 440, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        // DAG: C1->X, C1->Y, C2->X, C2->C1, X->M->Y, X->Y
                        var nodes = [
                            {id: 'C1', x: 200, y: 60, label: 'C\u2081'},
                            {id: 'C2', x: 80, y: 140, label: 'C\u2082'},
                            {id: 'X', x: 200, y: 200, label: 'X'},
                            {id: 'M', x: 370, y: 200, label: 'M'},
                            {id: 'Y', x: 500, y: 120, label: 'Y'}
                        ];
                        var edges = [
                            {from: 'C1', to: 'X'},
                            {from: 'C1', to: 'Y'},
                            {from: 'C2', to: 'X'},
                            {from: 'C2', to: 'C1'},
                            {from: 'X', to: 'M'},
                            {from: 'M', to: 'Y'},
                            {from: 'X', to: 'Y'}
                        ];

                        var treatment = 'X', outcome = 'Y';
                        var adjustSet = {};

                        function getChildren(nid) {
                            return edges.filter(function(e) { return e.from === nid; }).map(function(e) { return e.to; });
                        }
                        function getParents(nid) {
                            return edges.filter(function(e) { return e.to === nid; }).map(function(e) { return e.from; });
                        }
                        function getDescendants(nid) {
                            var visited = {};
                            var queue = [nid];
                            while (queue.length > 0) {
                                var curr = queue.shift();
                                if (visited[curr]) continue;
                                visited[curr] = true;
                                var ch = getChildren(curr);
                                for (var i = 0; i < ch.length; i++) queue.push(ch[i]);
                            }
                            delete visited[nid];
                            return visited;
                        }

                        function getNodeById(id) {
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i].id === id) return nodes[i];
                            }
                            return null;
                        }

                        // Find all paths (undirected) from src to tgt
                        function findAllPaths(src, tgt) {
                            var results = [];
                            var visited = {};
                            function getNeighbors(nid) {
                                var nbrs = [];
                                for (var i = 0; i < edges.length; i++) {
                                    if (edges[i].from === nid) nbrs.push(edges[i].to);
                                    if (edges[i].to === nid) nbrs.push(edges[i].from);
                                }
                                return nbrs;
                            }
                            function dfs(curr, path) {
                                if (curr === tgt) { results.push(path.slice()); return; }
                                var nbrs = getNeighbors(curr);
                                for (var i = 0; i < nbrs.length; i++) {
                                    if (!visited[nbrs[i]]) {
                                        visited[nbrs[i]] = true;
                                        path.push(nbrs[i]);
                                        dfs(nbrs[i], path);
                                        path.pop();
                                        visited[nbrs[i]] = false;
                                    }
                                }
                            }
                            visited[src] = true;
                            dfs(src, [src]);
                            return results;
                        }

                        // Check if path is a backdoor path (starts with arrow into X)
                        function isBackdoorPath(path) {
                            if (path.length < 2) return false;
                            if (path[0] !== treatment) return false;
                            // Backdoor: first edge points INTO treatment
                            return edges.some(function(e) { return e.from === path[1] && e.to === path[0]; });
                        }

                        function isCollider(path, idx) {
                            if (idx === 0 || idx === path.length - 1) return false;
                            var prev = path[idx - 1], curr = path[idx], next = path[idx + 1];
                            var inPrev = edges.some(function(e) { return e.from === prev && e.to === curr; });
                            var inNext = edges.some(function(e) { return e.from === next && e.to === curr; });
                            return inPrev && inNext;
                        }

                        function isPathBlocked(path, cond) {
                            for (var i = 1; i < path.length - 1; i++) {
                                var nid = path[i];
                                var coll = isCollider(path, i);
                                if (!coll) {
                                    if (cond[nid]) return true;
                                } else {
                                    var desc = getDescendants(nid);
                                    var opened = cond[nid];
                                    if (!opened) {
                                        var dk = Object.keys(desc);
                                        for (var j = 0; j < dk.length; j++) {
                                            if (cond[dk[j]]) { opened = true; break; }
                                        }
                                    }
                                    if (!opened) return true;
                                }
                            }
                            return false;
                        }

                        function checkBackdoor() {
                            var descX = getDescendants(treatment);
                            var adjKeys = Object.keys(adjustSet);
                            // Condition 1: no descendant of X in Z
                            for (var i = 0; i < adjKeys.length; i++) {
                                if (descX[adjKeys[i]]) return {valid: false, reason: adjKeys[i] + ' is a descendant of ' + treatment};
                            }
                            // Condition 2: blocks all backdoor paths
                            var allPaths = findAllPaths(treatment, outcome);
                            for (var p = 0; p < allPaths.length; p++) {
                                if (isBackdoorPath(allPaths[p])) {
                                    if (!isPathBlocked(allPaths[p], adjustSet)) {
                                        return {valid: false, reason: 'Backdoor path ' + allPaths[p].join('\u2014') + ' is open'};
                                    }
                                }
                            }
                            return {valid: true, reason: 'All backdoor paths blocked, no descendants of X in Z'};
                        }

                        var infoDiv = document.createElement('div');
                        infoDiv.style.cssText = 'color:#c9d1d9;font-size:0.8rem;margin-bottom:4px;';
                        infoDiv.textContent = 'Click nodes to add/remove from adjustment set Z. Treatment=X, Outcome=Y.';
                        controls.appendChild(infoDiv);
                        VizEngine.createButton(controls, 'Clear Z', function() { adjustSet = {}; draw(); });
                        VizEngine.createButton(controls, 'Set Z = {C\u2081}', function() { adjustSet = {C1: true}; draw(); });
                        VizEngine.createButton(controls, 'Set Z = {C\u2082}', function() { adjustSet = {C2: true}; draw(); });
                        VizEngine.createButton(controls, 'Set Z = {C\u2081, C\u2082}', function() { adjustSet = {C1: true, C2: true}; draw(); });

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            for (var i = 0; i < nodes.length; i++) {
                                var n = nodes[i];
                                if (n.id === treatment || n.id === outcome) continue;
                                var dx = mx - n.x, dy = my - n.y;
                                if (dx * dx + dy * dy < 900) {
                                    if (adjustSet[n.id]) delete adjustSet[n.id];
                                    else adjustSet[n.id] = true;
                                    draw();
                                    return;
                                }
                            }
                        });

                        function drawArrow(n1, n2, color, lw) {
                            var dx = n2.x - n1.x, dy = n2.y - n1.y;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            var sx = n1.x + ux * 28, sy = n1.y + uy * 28;
                            var ex = n2.x - ux * 28, ey = n2.y - uy * 28;

                            ctx.beginPath();
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(ex, ey);
                            ctx.strokeStyle = color;
                            ctx.lineWidth = lw || 2;
                            ctx.stroke();

                            var angle = Math.atan2(ey - sy, ex - sx);
                            ctx.beginPath();
                            ctx.moveTo(ex, ey);
                            ctx.lineTo(ex - 10 * Math.cos(angle - 0.4), ey - 10 * Math.sin(angle - 0.4));
                            ctx.lineTo(ex - 10 * Math.cos(angle + 0.4), ey - 10 * Math.sin(angle + 0.4));
                            ctx.closePath();
                            ctx.fillStyle = color;
                            ctx.fill();
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Backdoor Criterion: Treatment X, Outcome Y', W / 2, 25);

                            // Draw edges
                            for (var ei = 0; ei < edges.length; ei++) {
                                var fromN = getNodeById(edges[ei].from);
                                var toN = getNodeById(edges[ei].to);
                                // Color backdoor edges differently
                                var isBackdoorEdge = (edges[ei].to === treatment);
                                drawArrow(fromN, toN, isBackdoorEdge ? viz.colors.red + '88' : viz.colors.text, isBackdoorEdge ? 2.5 : 1.5);
                            }

                            // Draw nodes
                            for (var ni = 0; ni < nodes.length; ni++) {
                                var n = nodes[ni];
                                var isTreat = n.id === treatment;
                                var isOut = n.id === outcome;
                                var isAdj = adjustSet[n.id];

                                ctx.beginPath();
                                ctx.arc(n.x, n.y, 25, 0, Math.PI * 2);
                                if (isTreat) {
                                    ctx.fillStyle = '#f8514933';
                                    ctx.fill();
                                    ctx.strokeStyle = viz.colors.red;
                                    ctx.lineWidth = 3;
                                } else if (isOut) {
                                    ctx.fillStyle = '#3fb95033';
                                    ctx.fill();
                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 3;
                                } else if (isAdj) {
                                    ctx.fillStyle = '#f0883e44';
                                    ctx.fill();
                                    ctx.strokeStyle = viz.colors.orange;
                                    ctx.lineWidth = 3;
                                } else {
                                    ctx.fillStyle = '#1a1a40';
                                    ctx.fill();
                                    ctx.strokeStyle = viz.colors.text;
                                    ctx.lineWidth = 1.5;
                                }
                                ctx.stroke();
                                if (isAdj) {
                                    ctx.strokeRect(n.x - 32, n.y - 32, 64, 64);
                                }

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 16px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(n.label, n.x, n.y);
                            }

                            // Backdoor analysis
                            var result = checkBackdoor();
                            var adjKeys = Object.keys(adjustSet);
                            var adjStr = adjKeys.length > 0 ? '{' + adjKeys.map(function(k) { return getNodeById(k).label; }).join(', ') + '}' : '\u2205';

                            var py = 280;
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Adjustment set Z = ' + adjStr, 30, py);

                            py += 25;
                            ctx.fillStyle = result.valid ? viz.colors.green : viz.colors.red;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.fillText(result.valid ? '\u2713 Backdoor criterion SATISFIED' : '\u2717 Backdoor criterion NOT satisfied', 30, py);

                            py += 22;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.fillText(result.reason, 30, py);

                            if (result.valid) {
                                py += 25;
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = '13px -apple-system, sans-serif';
                                ctx.fillText('P(Y | do(X)) = \u03A3 P(Y | X, Z=z) P(Z=z)', 30, py);
                            }

                            // Legend
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillText('\u25CF Treatment (X)', W - 160, 55);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('\u25CF Outcome (Y)', W - 160, 73);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('\u25A0 In adjustment set', W - 160, 91);
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch03-ex12',
                    type: 'mc',
                    question: 'In the DAG C \u2192 X \u2192 Y, C \u2192 Y, which set satisfies the backdoor criterion for the effect of X on Y?',
                    options: [
                        'Z = \u2205 (empty set)',
                        'Z = {C}',
                        'Z = {Y}',
                        'Z = {X}'
                    ],
                    answer: 1,
                    explanation: 'The backdoor path is X \u2190 C \u2192 Y. We need to block it without including descendants of X. Z = {C} blocks the path and C is not a descendant of X. Z = \u2205 fails because the backdoor path is open.'
                },
                {
                    id: 'ch03-ex13',
                    type: 'mc',
                    question: 'Why must the backdoor criterion exclude descendants of the treatment X from Z?',
                    options: [
                        'Because descendants are always colliders',
                        'Because adjusting for a descendant of X can block the causal path or open non-causal paths',
                        'Because descendants are unobservable',
                        'Because descendants are always confounders'
                    ],
                    answer: 1,
                    explanation: 'Adjusting for a mediator M (where X \u2192 M \u2192 Y) blocks part of the causal effect. Adjusting for a descendant that is also a collider on a backdoor path can open that path. Both situations distort the causal estimate.'
                },
                {
                    id: 'ch03-ex14',
                    type: 'mc',
                    question: 'The backdoor adjustment formula P(Y | do(X=x)) = \u03A3_z P(Y|X=x, Z=z) P(Z=z) requires:',
                    options: [
                        'Randomization of X',
                        'That Z blocks all paths from X to Y',
                        'That Z satisfies the backdoor criterion relative to (X, Y)',
                        'That Z contains all parents of Y'
                    ],
                    answer: 2,
                    explanation: 'The backdoor adjustment formula is valid precisely when Z satisfies the backdoor criterion: (1) no descendant of X in Z, and (2) Z blocks every backdoor path from X to Y. This allows us to estimate the causal effect from observational data.'
                },
                {
                    id: 'ch03-ex15',
                    type: 'mc',
                    question: 'In the DAG X \u2192 M \u2192 Y with confounder C (C\u2192X, C\u2192Y), which is a valid backdoor adjustment set?',
                    options: [
                        '{M}',
                        '{C}',
                        '{M, C}',
                        '{M} or {C} are both valid'
                    ],
                    answer: 1,
                    explanation: 'The backdoor path is X \u2190 C \u2192 Y. Z = {C} blocks it and C is not a descendant of X. Z = {M} fails because M is a descendant of X (violates condition 1) and does not block the backdoor path X \u2190 C \u2192 Y.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 5: Frontdoor Criterion
        // --------------------------------------------------------
        {
            id: 'ch03-sec05',
            title: 'Frontdoor Criterion',
            content: `<h2>Frontdoor Criterion</h2>
<p>What if we cannot block all backdoor paths because the confounders are <strong>unobserved</strong>? The <strong>frontdoor criterion</strong> offers a remarkable alternative: we can sometimes identify the causal effect by going <em>through</em> a mediator.</p>

<div class="env-block example">
<div class="env-title">Motivating Example: Smoking \u2192 Tar \u2192 Cancer</div>
<div class="env-body">
<p>Consider the classic DAG:</p>
<ul>
<li>\\(U \\to \\text{Smoking}\\), \\(U \\to \\text{Cancer}\\) (\\(U\\) = unobserved genetic factor)</li>
<li>\\(\\text{Smoking} \\to \\text{Tar}\\)</li>
<li>\\(\\text{Tar} \\to \\text{Cancer}\\)</li>
</ul>
<p>We cannot use the backdoor criterion to estimate the effect of Smoking on Cancer because \\(U\\) is unobserved. But Tar is a mediator that satisfies the <strong>frontdoor criterion</strong>!</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Frontdoor Criterion)</div>
<div class="env-body">
<p>A set \\(M\\) satisfies the <strong>frontdoor criterion</strong> relative to \\((X, Y)\\) if:</p>
<ol>
<li>\\(X\\) <strong>intercepts all directed paths</strong> from \\(X\\) to \\(Y\\) through \\(M\\) (i.e., all causal paths go through \\(M\\)).</li>
<li>There is <strong>no unblocked backdoor path</strong> from \\(X\\) to \\(M\\).</li>
<li>All backdoor paths from \\(M\\) to \\(Y\\) are <strong>blocked by \\(X\\)</strong>.</li>
</ol>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (Frontdoor Adjustment)</div>
<div class="env-body">
<p>If \\(M\\) satisfies the frontdoor criterion relative to \\((X, Y)\\), then the causal effect is:</p>
\\[P(Y \\mid do(X = x)) = \\sum_{m} P(M = m \\mid X = x) \\sum_{x'} P(Y \\mid M = m, X = x') \\, P(X = x')\\]
</div>
</div>

<div class="env-block remark">
<div class="env-title">Intuition: Two-Step Backdoor</div>
<div class="env-body">
<p>The frontdoor formula works in two steps:</p>
<ol>
<li><strong>Effect of \\(X\\) on \\(M\\)</strong>: Since there is no backdoor path from \\(X\\) to \\(M\\), \\(P(M \\mid X)\\) is already causal: \\(P(M \\mid do(X)) = P(M \\mid X)\\).</li>
<li><strong>Effect of \\(M\\) on \\(Y\\)</strong>: The backdoor path \\(M \\leftarrow X \\leftarrow U \\to Y\\) is blocked by conditioning on \\(X\\). So \\(P(Y \\mid do(M)) = \\sum_{x'} P(Y \\mid M, X = x') P(X = x')\\).</li>
</ol>
<p>Chaining these gives us the total causal effect \\(X \\to M \\to Y\\).</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">When Does Frontdoor Apply?</div>
<div class="env-body">
<p>The frontdoor criterion is elegant but requires strong conditions: a <strong>fully mediating variable</strong> \\(M\\) such that all causal paths from \\(X\\) to \\(Y\\) pass through \\(M\\), with no direct edge \\(X \\to Y\\). It is less commonly applicable than the backdoor criterion, but invaluable when confounders are unobserved.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch03-viz-frontdoor"></div>`,
            visualizations: [
                {
                    id: 'ch03-viz-frontdoor',
                    title: 'Frontdoor Criterion: Smoking Example',
                    description: 'Interactive frontdoor example with mediation path',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420, scale: 1, originX: 0, originY: 0});
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        var step = 0; // 0: overview, 1: step1 X->M, 2: step2 M->Y, 3: combined

                        var btnOverview = VizEngine.createButton(controls, 'Overview', function() { step = 0; draw(); });
                        var btnStep1 = VizEngine.createButton(controls, 'Step 1: X\u2192M', function() { step = 1; draw(); });
                        var btnStep2 = VizEngine.createButton(controls, 'Step 2: M\u2192Y', function() { step = 2; draw(); });
                        var btnCombined = VizEngine.createButton(controls, 'Combined Formula', function() { step = 3; draw(); });

                        var nodePositions = {
                            U: {x: 250, y: 50, label: 'U (unobserved)'},
                            X: {x: 100, y: 180, label: 'Smoking'},
                            M: {x: 300, y: 180, label: 'Tar'},
                            Y: {x: 500, y: 180, label: 'Cancer'}
                        };

                        function drawNode(key, highlight, dim) {
                            var n = nodePositions[key];
                            var r = 28;
                            ctx.beginPath();
                            ctx.arc(n.x, n.y, r, 0, Math.PI * 2);

                            if (key === 'U') {
                                ctx.setLineDash([5, 3]);
                                ctx.fillStyle = dim ? '#1a1a4033' : '#bc8cff11';
                                ctx.fill();
                                ctx.strokeStyle = dim ? viz.colors.text + '44' : viz.colors.purple;
                                ctx.lineWidth = 2;
                                ctx.stroke();
                                ctx.setLineDash([]);
                            } else if (highlight === 'treatment') {
                                ctx.fillStyle = '#f8514944';
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.red;
                                ctx.lineWidth = 3;
                                ctx.stroke();
                            } else if (highlight === 'mediator') {
                                ctx.fillStyle = '#f0883e44';
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 3;
                                ctx.stroke();
                            } else if (highlight === 'outcome') {
                                ctx.fillStyle = '#3fb95044';
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 3;
                                ctx.stroke();
                            } else {
                                ctx.fillStyle = dim ? '#1a1a4033' : '#1a1a40';
                                ctx.fill();
                                ctx.strokeStyle = dim ? viz.colors.text + '44' : viz.colors.text;
                                ctx.lineWidth = 1.5;
                                ctx.stroke();
                            }

                            ctx.fillStyle = dim ? viz.colors.text + '44' : viz.colors.white;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(n.label, n.x, n.y);
                        }

                        function drawEdge(fromKey, toKey, color, dashed, dim) {
                            var n1 = nodePositions[fromKey], n2 = nodePositions[toKey];
                            var dx = n2.x - n1.x, dy = n2.y - n1.y;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            var sx = n1.x + ux * 30, sy = n1.y + uy * 30;
                            var ex = n2.x - ux * 30, ey = n2.y - uy * 30;

                            ctx.beginPath();
                            if (dashed) ctx.setLineDash([5, 3]);
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(ex, ey);
                            ctx.strokeStyle = dim ? (color + '33') : color;
                            ctx.lineWidth = dim ? 1 : 2.5;
                            ctx.stroke();
                            ctx.setLineDash([]);

                            var angle = Math.atan2(ey - sy, ex - sx);
                            ctx.beginPath();
                            ctx.moveTo(ex, ey);
                            ctx.lineTo(ex - 10 * Math.cos(angle - 0.4), ey - 10 * Math.sin(angle - 0.4));
                            ctx.lineTo(ex - 10 * Math.cos(angle + 0.4), ey - 10 * Math.sin(angle + 0.4));
                            ctx.closePath();
                            ctx.fillStyle = dim ? (color + '33') : color;
                            ctx.fill();
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Frontdoor Criterion: Smoking \u2192 Tar \u2192 Cancer', W / 2, 22);

                            if (step === 0) {
                                // All edges shown
                                drawEdge('U', 'X', viz.colors.purple, true, false);
                                drawEdge('U', 'Y', viz.colors.purple, true, false);
                                drawEdge('X', 'M', viz.colors.teal, false, false);
                                drawEdge('M', 'Y', viz.colors.teal, false, false);

                                drawNode('U', null, false);
                                drawNode('X', 'treatment', false);
                                drawNode('M', 'mediator', false);
                                drawNode('Y', 'outcome', false);

                                // Explanation
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '13px -apple-system, sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('U is unobserved \u2192 cannot use backdoor for X\u2192Y', 40, 260);
                                ctx.fillText('But Tar satisfies the frontdoor criterion!', 40, 282);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText('Causal path: Smoking \u2192 Tar \u2192 Cancer', 40, 310);
                                ctx.fillStyle = viz.colors.purple;
                                ctx.fillText('Confounding path: Smoking \u2190 U \u2192 Cancer (unblockable)', 40, 332);
                            } else if (step === 1) {
                                // Step 1: X -> M (no backdoor)
                                drawEdge('U', 'X', viz.colors.purple, true, true);
                                drawEdge('U', 'Y', viz.colors.purple, true, true);
                                drawEdge('X', 'M', viz.colors.green, false, false);
                                drawEdge('M', 'Y', viz.colors.teal, false, true);

                                drawNode('U', null, true);
                                drawNode('X', 'treatment', false);
                                drawNode('M', 'mediator', false);
                                drawNode('Y', null, true);

                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 14px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Step 1: Effect of X on M', W / 2, 250);
                                ctx.font = '13px -apple-system, sans-serif';
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('No backdoor path from Smoking to Tar', W / 2, 275);
                                ctx.fillText('(U\u2192Smoking\u2192Tar: U is not a common cause of Smoking and Tar)', W / 2, 295);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 13px -apple-system, sans-serif';
                                ctx.fillText('P(Tar | do(Smoking)) = P(Tar | Smoking)', W / 2, 325);
                            } else if (step === 2) {
                                // Step 2: M -> Y (backdoor blocked by X)
                                drawEdge('U', 'X', viz.colors.purple, true, false);
                                drawEdge('U', 'Y', viz.colors.purple, true, false);
                                drawEdge('X', 'M', viz.colors.teal, false, true);
                                drawEdge('M', 'Y', viz.colors.green, false, false);

                                drawNode('U', null, false);
                                drawNode('X', 'treatment', false);
                                drawNode('M', 'mediator', false);
                                drawNode('Y', 'outcome', false);

                                // Show X as conditioned (boxed)
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(nodePositions.X.x - 36, nodePositions.X.y - 36, 72, 72);

                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 14px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Step 2: Effect of M on Y', W / 2, 250);
                                ctx.font = '13px -apple-system, sans-serif';
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('Backdoor path: Tar \u2190 Smoking \u2190 U \u2192 Cancer', W / 2, 275);
                                ctx.fillText('Blocked by conditioning on Smoking (boxed)', W / 2, 295);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 13px -apple-system, sans-serif';
                                ctx.fillText('P(Y | do(Tar=m)) = \u03A3_x P(Y | Tar=m, Smoking=x) P(Smoking=x)', W / 2, 325);
                            } else {
                                // Combined
                                drawEdge('U', 'X', viz.colors.purple, true, false);
                                drawEdge('U', 'Y', viz.colors.purple, true, false);
                                drawEdge('X', 'M', viz.colors.green, false, false);
                                drawEdge('M', 'Y', viz.colors.green, false, false);

                                drawNode('U', null, false);
                                drawNode('X', 'treatment', false);
                                drawNode('M', 'mediator', false);
                                drawNode('Y', 'outcome', false);

                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 14px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Frontdoor Adjustment Formula', W / 2, 250);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 13px -apple-system, sans-serif';
                                ctx.fillText('P(Y | do(X=x)) = \u03A3_m P(M=m | X=x) \u03A3_x\' P(Y | M=m, X=x\') P(X=x\')', W / 2, 282);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '12px -apple-system, sans-serif';
                                ctx.fillText('= [Step 1: P(M|X)] \u00D7 [Step 2: P(Y|do(M))]', W / 2, 310);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('All quantities are estimable from observational data!', W / 2, 338);
                            }

                            // Legend
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillText('\u25CF Treatment', W - 140, 50);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('\u25CF Mediator', W - 140, 68);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('\u25CF Outcome', W - 140, 86);
                            ctx.fillStyle = viz.colors.purple;
                            ctx.fillText('--- Unobserved', W - 140, 104);
                        }

                        draw();
                    }
                }
            ],
            exercises: [
                {
                    id: 'ch03-ex16',
                    type: 'mc',
                    question: 'In the smoking example (U\u2192Smoking, U\u2192Cancer, Smoking\u2192Tar\u2192Cancer), why can\'t we use the backdoor criterion?',
                    options: [
                        'Because there is no confounder',
                        'Because the confounder U is unobserved and cannot be conditioned on',
                        'Because Tar is a collider',
                        'Because Cancer has no parents'
                    ],
                    answer: 1,
                    explanation: 'The backdoor path Smoking \u2190 U \u2192 Cancer cannot be blocked because U is unobserved. We cannot condition on something we cannot measure. This is precisely when the frontdoor criterion is useful.'
                },
                {
                    id: 'ch03-ex17',
                    type: 'mc',
                    question: 'The frontdoor criterion requires that the mediator M:',
                    options: [
                        'Be a confounder of X and Y',
                        'Intercept all directed paths from X to Y, with no unblocked backdoor from X to M',
                        'Be a descendant of Y',
                        'Be unobserved'
                    ],
                    answer: 1,
                    explanation: 'The frontdoor criterion has three conditions: (1) M intercepts all directed paths from X to Y, (2) no unblocked backdoor from X to M, and (3) all backdoors from M to Y are blocked by X.'
                },
                {
                    id: 'ch03-ex18',
                    type: 'mc',
                    question: 'In Step 2 of the frontdoor formula, the backdoor path from M to Y through U is blocked by conditioning on:',
                    options: [
                        'M itself',
                        'Y',
                        'X (the treatment)',
                        'U'
                    ],
                    answer: 2,
                    explanation: 'The backdoor path from Tar to Cancer is Tar \u2190 Smoking \u2190 U \u2192 Cancer. Conditioning on Smoking (which is X, the treatment) blocks this path at the non-collider node Smoking.'
                },
                {
                    id: 'ch03-ex19',
                    type: 'mc',
                    question: 'If there is a direct edge X \u2192 Y in addition to X \u2192 M \u2192 Y, does the frontdoor criterion still apply (with M as the frontdoor set)?',
                    options: [
                        'Yes, it always applies regardless',
                        'No, because M no longer intercepts ALL directed paths from X to Y',
                        'Yes, as long as U is unobserved',
                        'No, because X becomes a collider'
                    ],
                    answer: 1,
                    explanation: 'The frontdoor criterion requires that M intercepts ALL directed paths from X to Y. If there is a direct edge X \u2192 Y, then the path X \u2192 Y does not go through M, violating condition (1). The frontdoor criterion fails.'
                }
            ]
        }
    ]
});
