import React, { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const socket = new WebSocket('ws://localhost:8000/biometric');

function App() {
    const [text, setText] = useState('');
    const [notification, setNotification] = useState({ passing_rate: 0, auth_status: 'Pending', auth_reason: '' });
    let lastKeyTime = Date.now();

    useEffect(() => {
        // Load face-api models
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(() => {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    const video = document.createElement('video');
                    video.srcObject = stream;
                    video.play();
                    setInterval(async () => {
                        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                            .withFaceExpressions();
                        socket.send(JSON.stringify({ face_data: detections }));
                    }, 1000);
                });
        });

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.challenge === 'glitch') {
                setText(data.text);
            } else if (data.challenge === 'delay') {
                setTimeout(() => setText(text), data.wait * 1000);
            } else if (data.status === 'received') {
                setNotification({
                    passing_rate: data.data.passing_rate.toFixed(2),
                    auth_status: data.data.auth_status,
                    auth_reason: data.data.auth_reason
                });
            }
        };
    }, [text]);

    const handleKeyDown = (e) => {
        const now = Date.now();
        const time_diff = now - lastKeyTime;
        let movement = 'normal';
        if (time_diff > 500) movement = 'hesitation';
        if (time_diff < 50 && e.key !== 'Backspace') movement = 'erratic';
        lastKeyTime = now;
        const data = { char: e.key, time: now, movement, text: e.target.value };
        if (e.key === 'Backspace') data.error = 'backspace';
        socket.send(JSON.stringify(data));
        setText(e.target.value);
    };

    return (
        <div>
            <textarea onKeyDown={handleKeyDown} value={text} onChange={(e) => setText(e.target.value)} />
            <div style={{ position: 'fixed', top: '10px', right: '10px', padding: '10px', background: '#333', color: '#fff', borderRadius: '5px' }}>
                <h3>Biometric Status</h3>
                <p>Passing Rate: {notification.passing_rate}%</p>
                <p>Status: {notification.auth_status}</p>
                <p>Details: {notification.auth_reason}</p>
            </div>
        </div>
    );
}

export default App;import React, { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const socket = new WebSocket('ws://localhost:8000/biometric');

function App() {
    const [text, setText] = useState('');
    const [notification, setNotification] = useState({ passing_rate: 0, auth_status: 'Pending', auth_reason: '' });
    let lastKeyTime = Date.now();

    useEffect(() => {
        // Load face-api models
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(() => {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    const video = document.createElement('video');
                    video.srcObject = stream;
                    video.play();
                    setInterval(async () => {
                        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                            .withFaceExpressions();
                        socket.send(JSON.stringify({ face_data: detections }));
                    }, 1000);
                });
        });

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.challenge === 'glitch') {
                setText(data.text);
            } else if (data.challenge === 'delay') {
                setTimeout(() => setText(text), data.wait * 1000);
            } else if (data.status === 'received') {
                setNotification({
                    passing_rate: data.data.passing_rate.toFixed(2),
                    auth_status: data.data.auth_status,
                    auth_reason: data.data.auth_reason
                });
            }
        };
    }, [text]);

    const handleKeyDown = (e) => {
        const now = Date.now();
        const time_diff = now - lastKeyTime;
        let movement = 'normal';
        if (time_diff > 500) movement = 'hesitation';
        if (time_diff < 50 && e.key !== 'Backspace') movement = 'erratic';
        lastKeyTime = now;
        const data = { char: e.key, time: now, movement, text: e.target.value };
        if (e.key === 'Backspace') data.error = 'backspace';
        socket.send(JSON.stringify(data));
        setText(e.target.value);
    };

    return (
        <div>
            <textarea onKeyDown={handleKeyDown} value={text} onChange={(e) => setText(e.target.value)} />
            <div style={{ position: 'fixed', top: '10px', right: '10px', padding: '10px', background: '#333', color: '#fff', borderRadius: '5px' }}>
                <h3>Biometric Status</h3>
                <p>Passing Rate: {notification.passing_rate}%</p>
                <p>Status: {notification.auth_status}</p>
                <p>Details: {notification.auth_reason}</p>
            </div>
        </div>
    );
}

export default App;
