import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import './style.css';

function App() {
    const [code, setCode] = useState(`sequenceDiagram
    autonumber
    participant User as 🗣️ User
    participant Browser as 🌐 Browser (VAD/STT)
    participant App as 📱 React App
    participant Gemini as 🧠 Google Gemini

    Note over User, Browser: Phase 1: Input & Detection
    User->>Browser: Speaks continuously
    Browser->>Browser: Detects Speech (VAD)
    Browser-->>App: Stream Interim Results
    
    Note over User, Browser: Phase 2: Silence Trigger
    User->>Browser: Stops speaking
    Browser->>App: 1.5s Silence Detected
    App->>App: Finalize Transcript
    
    Note over App, Gemini: Phase 3: Translation
    App->>Gemini: POST /generateContent (Transcript + Target Lang)
    Gemini-->>App: Returns Translated Text
    
    Note over App, User: Phase 4: Display
    App->>User: Update UI with Caption`);

    // Debounce the preview update
    const [debouncedCode, setDebouncedCode] = useState(code);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCode(code);
        }, 800);
        return () => clearTimeout(timer);
    }, [code]);

    return (
        <div className="container">
            <header>
                <h1>Mermaid to Rough.js</h1>
            </header>
            <main className="main-content">
                <Editor value={code} onChange={setCode} />
                <Preview mermaidCode={debouncedCode} />
            </main>
        </div>
    );
}

export default App;
