import { useState } from 'react';

const ChatBox = ({ onQuestionSubmit }) => {
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        const currentQuestion = question;
        setQuestion('');
        setLoading(true);

        setChatHistory(prev => [...prev, { type: 'question', text: currentQuestion }]);

        try {
            const { queryDocument } = await import('../services/api');
            const result = await queryDocument(currentQuestion);

            setChatHistory(prev => [
                ...prev,
                {
                    type: 'answer',
                    text: result.answer,
                    followUps: result.follow_up_questions
                }
            ]);

            if (onQuestionSubmit) {
                onQuestionSubmit(result.follow_up_questions);
            }
        } catch (error) {
            setChatHistory(prev => [
                ...prev,
                { type: 'error', text: 'Error: ' + error.message }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionClick = (q) => {
        setQuestion(q);
    };

    return (
        <div className="chat-section">
            <h2>ASK QUESTIONS</h2>

            <div className="chat-history">
                {chatHistory.map((item, idx) => (
                    <div key={idx} className={`chat-item ${item.type}`}>
                        {item.type === 'question' && <div className="chat-label">YOU:</div>}
                        {item.type === 'answer' && <div className="chat-label">AI:</div>}
                        <div className="chat-text">{item.text}</div>
                        {item.followUps && item.followUps.length > 0 && (
                            <div className="follow-ups">
                                {item.followUps.map((q, i) => (
                                    <button
                                        key={i}
                                        className="question-btn small"
                                        onClick={() => handleQuestionClick(q)}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {loading && <div className="loading">PROCESSING...</div>}
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question..."
                    className="chat-input"
                    disabled={loading}
                />
                <button type="submit" className="ask-btn" disabled={loading || !question.trim()}>
                    ASK
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
