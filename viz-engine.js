// === VizEngine: Visualization toolkit for mathematical statistics ===
class VizEngine {
    constructor(container, opts = {}) {
        const containerWidth = container.clientWidth ? container.clientWidth - 32 : 0;
        const defaultWidth = containerWidth > 560 ? Math.min(containerWidth, 900) : 560;
        this.width = opts.width || defaultWidth;
        this.height = opts.height || Math.round(this.width * 0.65);
        this.scale = opts.scale || 40;
        this.originX = opts.originX ?? this.width / 2;
        this.originY = opts.originY ?? this.height / 2;

        const dpr = window.devicePixelRatio || 1;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(dpr, dpr);
        container.appendChild(this.canvas);

        this.colors = {
            bg:'#0c0c20', grid:'#1a1a40', axis:'#4a4a7a', text:'#8b949e',
            white:'#f0f6fc', blue:'#58a6ff', teal:'#3fb9a0', orange:'#f0883e',
            green:'#3fb950', purple:'#bc8cff', red:'#f85149', yellow:'#d29922', pink:'#f778ba'
        };
        this.draggables = [];
        this.animationId = null;
        this._dragBound = false;
        this.dragState = null;
    }

    toScreen(x, y) { return [this.originX + x * this.scale, this.originY - y * this.scale]; }
    toMath(sx, sy) { return [(sx - this.originX) / this.scale, (this.originY - sy) / this.scale]; }

    clear() {
        this.ctx.fillStyle = this.colors.bg;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawGrid(spacing = 1) {
        const ctx = this.ctx;
        const minX = Math.floor(-this.originX / this.scale / spacing) * spacing;
        const maxX = Math.ceil((this.width - this.originX) / this.scale / spacing) * spacing;
        const minY = Math.floor(-(this.height - this.originY) / this.scale / spacing) * spacing;
        const maxY = Math.ceil(this.originY / this.scale / spacing) * spacing;
        ctx.strokeStyle = this.colors.grid; ctx.lineWidth = 0.5;
        for (let x = minX; x <= maxX; x += spacing) {
            const [sx] = this.toScreen(x, 0);
            ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, this.height); ctx.stroke();
        }
        for (let y = minY; y <= maxY; y += spacing) {
            const [, sy] = this.toScreen(0, y);
            ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(this.width, sy); ctx.stroke();
        }
    }

    drawAxes() {
        const ctx = this.ctx;
        ctx.strokeStyle = this.colors.axis; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, this.originY); ctx.lineTo(this.width, this.originY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(this.originX, 0); ctx.lineTo(this.originX, this.height); ctx.stroke();
        ctx.fillStyle = this.colors.text; ctx.font = '11px -apple-system,sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        const minX = Math.ceil(-this.originX / this.scale), maxX = Math.floor((this.width - this.originX) / this.scale);
        for (let x = minX; x <= maxX; x++) { if (x === 0) continue; const [sx] = this.toScreen(x, 0); ctx.fillText(x, sx, this.originY + 4); }
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        const minY = Math.ceil(-(this.height - this.originY) / this.scale), maxY = Math.floor(this.originY / this.scale);
        for (let y = minY; y <= maxY; y++) { if (y === 0) continue; const [, sy] = this.toScreen(0, y); ctx.fillText(y, this.originX - 6, sy); }
    }

    drawVector(x1, y1, x2, y2, color, label, lw = 2) {
        const ctx = this.ctx;
        const [sx1, sy1] = this.toScreen(x1, y1);
        const [sx2, sy2] = this.toScreen(x2, y2);
        const dx = sx2 - sx1, dy = sy2 - sy1, len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return;
        const angle = Math.atan2(dy, dx);
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2 - Math.cos(angle) * 10, sy2 - Math.sin(angle) * 10); ctx.stroke();
        ctx.fillStyle = color; ctx.beginPath();
        ctx.moveTo(sx2, sy2);
        ctx.lineTo(sx2 - 12 * Math.cos(angle - Math.PI / 6), sy2 - 12 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(sx2 - 12 * Math.cos(angle + Math.PI / 6), sy2 - 12 * Math.sin(angle + Math.PI / 6));
        ctx.closePath(); ctx.fill();
        if (label) {
            const ux = -dy / len, uy = dx / len;
            ctx.fillStyle = color; ctx.font = 'bold 14px -apple-system,sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(label, (sx1 + sx2) / 2 + ux * 16, (sy1 + sy2) / 2 + uy * 16);
        }
    }

    drawPoint(x, y, color, label, r = 5) {
        const ctx = this.ctx; const [sx, sy] = this.toScreen(x, y);
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
        if (label) { ctx.fillStyle = color; ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.fillText(label, sx + r + 4, sy - r); }
    }

    drawLine(x1, y1, x2, y2, color, lw = 1, dashed = false) {
        const ctx = this.ctx;
        const [sx1, sy1] = this.toScreen(x1, y1), [sx2, sy2] = this.toScreen(x2, y2);
        const dx = sx2 - sx1, dy = sy2 - sy1, len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.1) return;
        const ux = dx / len, uy = dy / len, ext = Math.max(this.width, this.height) * 2;
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        if (dashed) ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(sx1 - ux * ext, sy1 - uy * ext); ctx.lineTo(sx2 + ux * ext, sy2 + uy * ext); ctx.stroke();
        if (dashed) ctx.setLineDash([]);
    }

    drawSegment(x1, y1, x2, y2, color, lw = 1, dashed = false) {
        const ctx = this.ctx;
        const [sx1, sy1] = this.toScreen(x1, y1), [sx2, sy2] = this.toScreen(x2, y2);
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        if (dashed) ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2); ctx.stroke();
        if (dashed) ctx.setLineDash([]);
    }

    drawPolygon(points, fill, stroke, lw = 1) {
        const ctx = this.ctx; ctx.beginPath();
        points.forEach(([x, y], i) => { const [sx, sy] = this.toScreen(x, y); i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); });
        ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
    }

    drawCircle(cx, cy, r, fill, stroke, lw = 1) {
        const ctx = this.ctx; const [sx, sy] = this.toScreen(cx, cy);
        ctx.beginPath(); ctx.arc(sx, sy, r * this.scale, 0, Math.PI * 2);
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
    }

    drawEllipse(cx, cy, rx, ry, angle, fill, stroke) {
        const ctx = this.ctx; const [sx, sy] = this.toScreen(cx, cy);
        ctx.save(); ctx.translate(sx, sy); ctx.rotate(-angle);
        ctx.beginPath(); ctx.ellipse(0, 0, rx * this.scale, ry * this.scale, 0, 0, Math.PI * 2);
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
        ctx.restore();
    }

    drawText(text, x, y, color, size = 14, align = 'center', baseline = 'middle') {
        const ctx = this.ctx; const [sx, sy] = this.toScreen(x, y);
        ctx.fillStyle = color || this.colors.white; ctx.font = size + 'px -apple-system,sans-serif';
        ctx.textAlign = align; ctx.textBaseline = baseline; ctx.fillText(text, sx, sy);
    }

    screenText(text, px, py, color, size = 14, align = 'center', baseline = 'middle') {
        const ctx = this.ctx;
        ctx.fillStyle = color || this.colors.white; ctx.font = size + 'px -apple-system,sans-serif';
        ctx.textAlign = align; ctx.textBaseline = baseline; ctx.fillText(text, px, py);
    }

    drawTransformedUnitSquare(M, fill, stroke, lw = 2) {
        const [[a, b], [c, d]] = M;
        this.drawPolygon([[0,0],[a,c],[a+b,c+d],[b,d]], fill, stroke, lw);
    }

    addDraggable(id, x, y, color, radius = 8, onDrag) {
        const d = { id, x, y, color, radius: radius || 8, onDrag };
        this.draggables.push(d);
        if (!this._dragBound) {
            this._dragBound = true;
            const getPos = (e) => {
                const r = this.canvas.getBoundingClientRect();
                const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
                const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
                return this.toMath(cx, cy);
            };
            const startDrag = (e) => {
                const [wx, wy] = getPos(e);
                for (const dr of this.draggables) {
                    if (Math.sqrt((wx - dr.x) ** 2 + (wy - dr.y) ** 2) < dr.radius / this.scale * 2.5) {
                        this.dragState = dr; e.preventDefault(); break;
                    }
                }
            };
            const moveDrag = (e) => {
                if (!this.dragState) return;
                e.preventDefault();
                const [wx, wy] = getPos(e);
                this.dragState.x = wx; this.dragState.y = wy;
                if (this.dragState.onDrag) this.dragState.onDrag(wx, wy);
            };
            const endDrag = () => { this.dragState = null; };
            this.canvas.addEventListener('mousedown', startDrag);
            this.canvas.addEventListener('mousemove', moveDrag);
            this.canvas.addEventListener('mouseup', endDrag);
            this.canvas.addEventListener('mouseleave', endDrag);
            this.canvas.addEventListener('touchstart', startDrag, { passive: false });
            this.canvas.addEventListener('touchmove', moveDrag, { passive: false });
            this.canvas.addEventListener('touchend', endDrag);
        }
        return d;
    }

    drawDraggables() {
        for (const d of this.draggables) {
            const [sx, sy] = this.toScreen(d.x, d.y);
            const ctx = this.ctx;
            ctx.fillStyle = d.color + '33'; ctx.beginPath(); ctx.arc(sx, sy, d.radius + 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = d.color; ctx.beginPath(); ctx.arc(sx, sy, d.radius, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffffff44'; ctx.beginPath(); ctx.arc(sx - 2, sy - 2, d.radius * 0.3, 0, Math.PI * 2); ctx.fill();
        }
    }

    animate(drawFrame) {
        const loop = (t) => { drawFrame(t); this.animationId = requestAnimationFrame(loop); };
        this.animationId = requestAnimationFrame(loop);
    }

    stopAnimation() { if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; } }

    // --- UI Controls ---
    static createSlider(container, label, min, max, val, step, onChange) {
        const g = document.createElement('div'); g.className = 'viz-slider-group';
        const l = document.createElement('span'); l.className = 'viz-slider-label'; l.textContent = label;
        const s = document.createElement('input'); s.type = 'range'; s.className = 'viz-slider';
        s.min = min; s.max = max; s.value = val; s.step = step || 0.1;
        const v = document.createElement('span'); v.className = 'viz-slider-value'; v.textContent = parseFloat(val).toFixed(1);
        s.addEventListener('input', () => { v.textContent = parseFloat(s.value).toFixed(1); onChange(parseFloat(s.value)); });
        g.appendChild(l); g.appendChild(s); g.appendChild(v); container.appendChild(g);
        return s;
    }

    static createButton(container, label, onClick) {
        const b = document.createElement('button');
        b.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
        b.textContent = label; b.addEventListener('click', onClick); container.appendChild(b); return b;
    }

    // --- Linear Algebra Utilities ---
    static matVec(M, v) { return [M[0][0]*v[0]+M[0][1]*v[1], M[1][0]*v[0]+M[1][1]*v[1]]; }
    static matMul(A, B) { return [[A[0][0]*B[0][0]+A[0][1]*B[1][0], A[0][0]*B[0][1]+A[0][1]*B[1][1]], [A[1][0]*B[0][0]+A[1][1]*B[1][0], A[1][0]*B[0][1]+A[1][1]*B[1][1]]]; }
    static det2(M) { return M[0][0]*M[1][1]-M[0][1]*M[1][0]; }
    static eigenvalues2(M) {
        const tr = M[0][0]+M[1][1], det = VizEngine.det2(M), disc = tr*tr-4*det;
        if (disc < 0) return null;
        const s = Math.sqrt(disc); return [(tr+s)/2, (tr-s)/2];
    }
    static eigenvector2(M, lam) {
        const a = M[0][0]-lam, b = M[0][1];
        if (Math.abs(b) > 1e-10) return VizEngine.normalize([1, -a/b]);
        if (Math.abs(a) > 1e-10) return [0, 1];
        const c = M[1][0], d = M[1][1]-lam;
        if (Math.abs(d) > 1e-10) return VizEngine.normalize([1, -c/d]);
        return [1, 0];
    }
    static normalize(v) { const l = Math.sqrt(v[0]*v[0]+v[1]*v[1]); return l < 1e-10 ? [0,0] : [v[0]/l, v[1]/l]; }
    static vecLen(v) { return Math.sqrt(v[0]*v[0]+v[1]*v[1]); }
    static dot(u, v) { return u[0]*v[0]+u[1]*v[1]; }
    static proj(u, v) { const d = VizEngine.dot(u,v)/VizEngine.dot(v,v); return [v[0]*d, v[1]*d]; }
    static lerp(a, b, t) { return a + (b - a) * t; }

    // === Statistics Extensions ===

    // Draw a function curve in math coordinates
    drawFunction(f, xMin, xMax, color, lw = 2, steps = 200) {
        const ctx = this.ctx;
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= steps; i++) {
            const x = xMin + (xMax - xMin) * i / steps;
            const y = f(x);
            if (!isFinite(y)) { started = false; continue; }
            const [sx, sy] = this.toScreen(x, y);
            if (!started) { ctx.moveTo(sx, sy); started = true; }
            else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
    }

    // Shade area under a function between xMin and xMax
    shadeUnder(f, xMin, xMax, color, steps = 200) {
        const ctx = this.ctx;
        ctx.fillStyle = color;
        ctx.beginPath();
        const [sx0, sy0] = this.toScreen(xMin, 0);
        ctx.moveTo(sx0, sy0);
        for (let i = 0; i <= steps; i++) {
            const x = xMin + (xMax - xMin) * i / steps;
            const y = f(x);
            const [sx, sy] = this.toScreen(x, isFinite(y) ? y : 0);
            ctx.lineTo(sx, sy);
        }
        const [sxEnd, syEnd] = this.toScreen(xMax, 0);
        ctx.lineTo(sxEnd, syEnd);
        ctx.closePath();
        ctx.fill();
    }

    // Shade area between two functions
    shadeBetween(f1, f2, xMin, xMax, color, steps = 200) {
        const ctx = this.ctx;
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const x = xMin + (xMax - xMin) * i / steps;
            const y = f1(x);
            const [sx, sy] = this.toScreen(x, isFinite(y) ? y : 0);
            i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
        }
        for (let i = steps; i >= 0; i--) {
            const x = xMin + (xMax - xMin) * i / steps;
            const y = f2(x);
            const [sx, sy] = this.toScreen(x, isFinite(y) ? y : 0);
            ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
    }

    // Draw histogram bars (bins = [{x, width, height}])
    drawHistogram(bins, color, strokeColor, lw = 1) {
        const ctx = this.ctx;
        for (const bin of bins) {
            const [sx1, sy1] = this.toScreen(bin.x, bin.height);
            const [sx2, sy2] = this.toScreen(bin.x + bin.width, 0);
            const w = sx2 - sx1, h = sy2 - sy1;
            if (color) { ctx.fillStyle = color; ctx.fillRect(sx1, sy1, w, h); }
            if (strokeColor) { ctx.strokeStyle = strokeColor; ctx.lineWidth = lw; ctx.strokeRect(sx1, sy1, w, h); }
        }
    }

    // Draw a sequence of points (for convergence demos)
    drawSequence(seq, nMax, color, r = 3) {
        for (let i = 0; i < Math.min(seq.length, nMax); i++) {
            this.drawPoint(i + 1, seq[i], color, null, r);
        }
    }

    // Draw horizontal band (for confidence intervals, epsilon bands)
    drawHorizontalBand(yCenter, halfWidth, color) {
        const ctx = this.ctx;
        const xMin = -this.originX / this.scale;
        const xMax = (this.width - this.originX) / this.scale;
        const [, sy1] = this.toScreen(0, yCenter + halfWidth);
        const [, sy2] = this.toScreen(0, yCenter - halfWidth);
        ctx.fillStyle = color;
        ctx.fillRect(0, sy1, this.width, sy2 - sy1);
    }

    // Draw vertical band (for rejection regions, delta bands)
    drawVerticalBand(xCenter, halfWidth, color) {
        const ctx = this.ctx;
        const [sx1] = this.toScreen(xCenter - halfWidth, 0);
        const [sx2] = this.toScreen(xCenter + halfWidth, 0);
        ctx.fillStyle = color;
        ctx.fillRect(sx1, 0, sx2 - sx1, this.height);
    }

    // Draw error bar at (x, y) with ±err
    drawErrorBar(x, y, err, color, lw = 1.5, capWidth = 0.15) {
        this.drawSegment(x, y - err, x, y + err, color, lw);
        this.drawSegment(x - capWidth, y - err, x + capWidth, y - err, color, lw);
        this.drawSegment(x - capWidth, y + err, x + capWidth, y + err, color, lw);
    }

    // Draw a filled bar (for bar charts)
    drawBar(x, width, height, color, strokeColor, lw = 1) {
        const ctx = this.ctx;
        const [sx1, sy1] = this.toScreen(x, Math.max(height, 0));
        const [sx2, sy2] = this.toScreen(x + width, Math.min(height, 0));
        const w = sx2 - sx1, h = sy2 - sy1;
        if (color) { ctx.fillStyle = color; ctx.fillRect(sx1, sy1, w, h); }
        if (strokeColor) { ctx.strokeStyle = strokeColor; ctx.lineWidth = lw; ctx.strokeRect(sx1, sy1, w, h); }
    }

    // === Statistical Distribution Functions ===

    // Standard normal PDF
    static normalPDF(x, mu = 0, sigma = 1) {
        const z = (x - mu) / sigma;
        return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
    }

    // Standard normal CDF (approximation via error function)
    static normalCDF(x, mu = 0, sigma = 1) {
        const z = (x - mu) / sigma;
        return 0.5 * (1 + VizEngine.erf(z / Math.SQRT2));
    }

    // Error function approximation (Abramowitz & Stegun)
    static erf(x) {
        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);
        const t = 1 / (1 + 0.3275911 * x);
        const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
        return sign * y;
    }

    // Gamma function (Lanczos approximation)
    static gamma(z) {
        if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * VizEngine.gamma(1 - z));
        z -= 1;
        const g = 7;
        const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
            771.32342877765313, -176.61502916214059, 12.507343278686905,
            -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
        let x = c[0];
        for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
        const t = z + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }

    // Log-gamma
    static lgamma(z) { return Math.log(VizEngine.gamma(z)); }

    // Beta function
    static beta(a, b) { return VizEngine.gamma(a) * VizEngine.gamma(b) / VizEngine.gamma(a + b); }

    // Exponential PDF
    static exponentialPDF(x, lambda = 1) {
        return x < 0 ? 0 : lambda * Math.exp(-lambda * x);
    }

    // Gamma PDF
    static gammaPDF(x, alpha, beta) {
        if (x <= 0) return 0;
        return Math.pow(beta, alpha) / VizEngine.gamma(alpha) * Math.pow(x, alpha - 1) * Math.exp(-beta * x);
    }

    // Beta PDF
    static betaPDF(x, a, b) {
        if (x <= 0 || x >= 1) return 0;
        return Math.pow(x, a - 1) * Math.pow(1 - x, b - 1) / VizEngine.beta(a, b);
    }

    // Chi-squared PDF
    static chiSquaredPDF(x, k) {
        if (x <= 0) return 0;
        const half_k = k / 2;
        return Math.pow(x, half_k - 1) * Math.exp(-x / 2) / (Math.pow(2, half_k) * VizEngine.gamma(half_k));
    }

    // Student's t PDF
    static tPDF(x, nu) {
        const c = VizEngine.gamma((nu + 1) / 2) / (Math.sqrt(nu * Math.PI) * VizEngine.gamma(nu / 2));
        return c * Math.pow(1 + x * x / nu, -(nu + 1) / 2);
    }

    // F-distribution PDF
    static fPDF(x, d1, d2) {
        if (x <= 0) return 0;
        const num = Math.pow(d1 * x, d1) * Math.pow(d2, d2);
        const den = Math.pow(d1 * x + d2, d1 + d2);
        return Math.sqrt(num / den) / (x * VizEngine.beta(d1 / 2, d2 / 2));
    }

    // Poisson PMF
    static poissonPMF(k, lambda) {
        if (k < 0 || k !== Math.floor(k)) return 0;
        let logP = -lambda + k * Math.log(lambda);
        for (let i = 2; i <= k; i++) logP -= Math.log(i);
        return Math.exp(logP);
    }

    // Binomial PMF
    static binomialPMF(k, n, p) {
        if (k < 0 || k > n || k !== Math.floor(k)) return 0;
        let logP = VizEngine.lgamma(n + 1) - VizEngine.lgamma(k + 1) - VizEngine.lgamma(n - k + 1);
        logP += k * Math.log(p) + (n - k) * Math.log(1 - p);
        return Math.exp(logP);
    }

    // Uniform PDF
    static uniformPDF(x, a = 0, b = 1) {
        return (x >= a && x <= b) ? 1 / (b - a) : 0;
    }

    // === Random Number Generators ===

    // Box-Muller for normal samples
    static randomNormal(mu = 0, sigma = 1) {
        let u1, u2;
        do { u1 = Math.random(); } while (u1 === 0);
        u2 = Math.random();
        return mu + sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    // Exponential sample
    static randomExponential(lambda = 1) {
        return -Math.log(1 - Math.random()) / lambda;
    }

    // Generate n samples from a distribution
    static sampleArray(generator, n) {
        const arr = [];
        for (let i = 0; i < n; i++) arr.push(generator());
        return arr;
    }

    // === Descriptive Statistics Utilities ===

    static mean(arr) { return arr.reduce((s, x) => s + x, 0) / arr.length; }
    static variance(arr) { const m = VizEngine.mean(arr); return arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length; }
    static sampleVariance(arr) { const m = VizEngine.mean(arr); return arr.reduce((s, x) => s + (x - m) ** 2, 0) / (arr.length - 1); }
    static std(arr) { return Math.sqrt(VizEngine.variance(arr)); }
    static median(arr) { const s = [...arr].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
    static quantile(arr, p) { const s = [...arr].sort((a, b) => a - b); const idx = p * (s.length - 1); const lo = Math.floor(idx); const hi = Math.ceil(idx); return s[lo] + (s[hi] - s[lo]) * (idx - lo); }
}

window.VizEngine = VizEngine;
