function calculateScore(formData) {
    const q1 = parseInt(formData["question_1"]) || 0;
    const q2 = parseInt(formData["question_2"]) || 0;

    return q1 + q2;
}

module.exports = { calculateScore };
