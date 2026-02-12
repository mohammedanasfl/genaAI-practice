const Suggestions = ({ questions, onQuestionClick }) => {
    if (!questions || questions.length === 0) return null;

    return (
        <div className="suggestions">
            <h3>SUGGESTED QUESTIONS</h3>
            <div className="question-buttons">
                {questions.map((question, idx) => (
                    <button
                        key={idx}
                        className="question-btn"
                        onClick={() => onQuestionClick(question)}
                    >
                        {question}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Suggestions;
