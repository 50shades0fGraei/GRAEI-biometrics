const tf = require('@tensorflow/tfjs');

async function trainMistakeModel(profiles) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, inputShape: [3], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' });

    const xs = tf.tensor2d(profiles.map(p => [p.error_rate, p.typos.length, p.common_mistakes.backspace || 0]));
    const ys = tf.tensor2d(profiles.map(p => [p.is_authentic ? 1 : 0]));
    await model.fit(xs, ys, { epochs: 10 });
    model.save('file://./mistake_model');
}

async function predictUser(text, errors) {
    const model = await tf.loadLayersModel('file://./mistake_model');
    const mistakes = analyzeMistakes(text, errors);
    const input = tf.tensor2d([[mistakes.error_rate, mistakes.typos.length, mistakes.common_mistakes.backspace || 0]]);
    const prediction = model.predict(input);
    return prediction.dataSync()[0] > 0.5 ? 'Authentic' : 'Imposter';
}

module.exports = { analyzeMistakes, analyzeTyping, trainMistakeModel, predictUser };
