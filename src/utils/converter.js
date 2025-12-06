import mermaid from 'mermaid';
import rough from 'roughjs';

// Initialize mermaid
mermaid.initialize({ startOnLoad: false, theme: 'default' });

export const processMermaidToRough = async (mermaidCode, container) => {
    try {
        container.innerHTML = ''; // Clear previous
        const id = 'mermaid-' + Date.now();

        // Generate SVG
        // render returns object with svg string
        const { svg } = await mermaid.render(id, mermaidCode);

        // Parse SVG string to DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, "image/svg+xml");
        const svgEl = doc.querySelector('svg');

        if (!svgEl) return;

        // Append to container to ensure computed styles are accessible
        container.appendChild(svgEl);

        // Initialize RoughJS for this SVG
        const rc = rough.svg(svgEl);

        // 1. Update Text Fonts
        const texts = svgEl.querySelectorAll('text');
        texts.forEach(t => {
            t.style.fontFamily = '"Indie Flower", cursive';
            t.style.fontWeight = 'bold';
            t.style.fontSize = '16px'; // Enforce a size
        });

        // 2. Process Rectangles (Activations, Notes, Actors)
        const rects = Array.from(svgEl.querySelectorAll('rect'));
        rects.forEach(rect => {
            const width = parseFloat(rect.getAttribute('width'));
            const height = parseFloat(rect.getAttribute('height'));

            // Ignore tiny rects or invisible ones
            if (!width || !height || width <= 0 || height <= 0) return;

            const x = parseFloat(rect.getAttribute('x') || 0);
            const y = parseFloat(rect.getAttribute('y') || 0);

            const computed = window.getComputedStyle(rect);
            const stroke = rect.getAttribute('stroke') || computed.stroke;
            const fill = rect.getAttribute('fill') || computed.fill;
            const strokeWidth = parseFloat(rect.getAttribute('stroke-width') || computed.strokeWidth || 1.5);

            if (fill === 'none' && stroke === 'none') return;

            const options = {
                roughness: 2.5,
                bowing: 1,
                stroke: stroke !== 'none' ? stroke : 'currentColor',
                strokeWidth: strokeWidth,
                fill: fill !== 'none' && fill !== 'transparent' ? fill : undefined,
                fillStyle: 'hachure',
                fillWeight: 1 // Thinner fill lines
            };

            const node = rc.rectangle(x, y, width, height, options);
            rect.replaceWith(node);
        });

        // 3. Process Lines
        const lines = Array.from(svgEl.querySelectorAll('line'));
        lines.forEach(line => {
            const x1 = parseFloat(line.getAttribute('x1'));
            const y1 = parseFloat(line.getAttribute('y1'));
            const x2 = parseFloat(line.getAttribute('x2'));
            const y2 = parseFloat(line.getAttribute('y2'));

            const computed = window.getComputedStyle(line);
            const stroke = line.getAttribute('stroke') || computed.stroke;
            const strokeWidth = parseFloat(line.getAttribute('stroke-width') || computed.strokeWidth || 1.5);

            const node = rc.line(x1, y1, x2, y2, {
                roughness: 2,
                bowing: 2,
                stroke: stroke !== 'none' ? stroke : 'currentColor',
                strokeWidth
            });

            // Preserve markers
            const markerEnd = line.getAttribute('marker-end');
            if (markerEnd) node.setAttribute('marker-end', markerEnd);
            const markerStart = line.getAttribute('marker-start');
            if (markerStart) node.setAttribute('marker-start', markerStart);

            line.replaceWith(node);
        });

        // 4. Process Paths
        const paths = Array.from(svgEl.querySelectorAll('path'));
        paths.forEach(path => {
            const d = path.getAttribute('d');
            if (!d) return;

            const computed = window.getComputedStyle(path);
            const stroke = path.getAttribute('stroke') || computed.stroke;
            const fill = path.getAttribute('fill') || computed.fill;
            const strokeWidth = parseFloat(path.getAttribute('stroke-width') || computed.strokeWidth || 1.5);

            const options = {
                roughness: 1.5,
                stroke: stroke !== 'none' ? stroke : 'currentColor',
                strokeWidth,
                fill: fill !== 'none' && fill !== 'transparent' ? fill : undefined,
                fillStyle: 'zigzag' // Different style for paths
            };

            const node = rc.path(d, options);

            // Preserve markers
            const markerEnd = path.getAttribute('marker-end');
            if (markerEnd) node.setAttribute('marker-end', markerEnd);
            const markerStart = path.getAttribute('marker-start');
            if (markerStart) node.setAttribute('marker-start', markerStart);

            path.replaceWith(node);
        });

        // 5. Process Polygons (Diamonds)
        const polygons = Array.from(svgEl.querySelectorAll('polygon'));
        polygons.forEach(poly => {
            const pointsStr = poly.getAttribute('points');
            if (!pointsStr) return;

            const pts = pointsStr.trim().split(/\s+/).map(p => {
                const [x, y] = p.split(',').map(parseFloat);
                return [x, y];
            }).filter(p => !isNaN(p[0]) && !isNaN(p[1]));

            if (pts.length < 3) return;

            const computed = window.getComputedStyle(poly);
            const stroke = poly.getAttribute('stroke') || computed.stroke;
            const fill = poly.getAttribute('fill') || computed.fill;
            const strokeWidth = parseFloat(poly.getAttribute('stroke-width') || computed.strokeWidth || 1.5);

            const node = rc.polygon(pts, {
                roughness: 2,
                stroke: stroke !== 'none' ? stroke : 'currentColor',
                strokeWidth,
                fill: fill !== 'none' && fill !== 'transparent' ? fill : undefined
            });
            poly.replaceWith(node);
        });

    } catch (error) {
        console.error("Conversion Error:", error);
        container.innerHTML = `<div style="color:red; padding:1rem;">Error rendering diagram: ${error.message}</div>`;
    }
};
