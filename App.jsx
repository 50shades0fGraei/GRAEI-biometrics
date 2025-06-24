import React, { useState, useEffect } from 'react';
const socket = new WebSocket('ws://localhost:8000/biometric');

function App() {
    const [text, setText] = useState('');
    const handleKeyDown = (e) => {
        const data = { char: e.key, time: Date.now() };
        if (e.key === 'Backspace') data.error = 'backspace';
        socket.send(JSON.stringify(data));
        setText(e.target.value);
    };
    return <textarea onKeyDown={handleKeyDown} value={text} onChange={(e) => setText(e.target.value)} />;
}
export default App;
