import React from 'react';

const Editor = ({ value, onChange }) => {
    return (
        <div className="editor-pane">
            <h2>Mermaid Input</h2>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter Mermaid code here..."
                className="code-editor"
            />
        </div>
    );
};

export default Editor;
