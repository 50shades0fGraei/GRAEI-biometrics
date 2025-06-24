const { analyzeMistakes, analyzeTyping } = require('../api/mistakeIdentifier');
function trackUserState(text, errors, timestamps, movements, face_data) {
    const mistakes = analyzeMistakes(text, errors);
    const typing = analyzeTyping(timestamps);
    return {
        moral_tension: mistakes.error_rate > 0.2 ? 'high' : 'low',
        emotional_drift: typing.pause_frequency > 5 ? 'unstable' : 'stable',
        frustration_level: face_data?.expressions?.angry > 0.5 ? 'high' : 'low'
    };
}
module.exports = { trackUserState };
