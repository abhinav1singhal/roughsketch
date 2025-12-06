import React, { useEffect, useRef } from 'react';
import { processMermaidToRough } from '../utils/converter';

const Preview = ({ mermaidCode }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            processMermaidToRough(mermaidCode, containerRef.current);
        }
    }, [mermaidCode]);

    return (
        <div className="preview-pane">
            <h2>Sketch Preview</h2>
            <div ref={containerRef} className="canvas-container">
                {/* SVG will be appended here */}
            </div>
        </div>
    );
};

export default Preview;
