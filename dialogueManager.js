const { parseEmotion } = require('../api/emotionEnsemble');
function modulateResponse(text, userProfile) {
    const style = parseEmotion(text, userProfile.face_data);
    return userProfile.auth_status === 'Imposter'
        ? `Access denied: ${userProfile.auth_reason}`
        : `Empathetic response for ${style.tone} tone, ${userProfile.passing_rate}% confidence`;
}
module.exports = { modulateResponse };
