import { useState } from 'react';
import UploadBox from './components/UploadBox';
import SummaryPanel from './components/SummaryPanel';
import Suggestions from './components/Suggestions';
import ChatBox from './components/ChatBox';
import './styles.css';

function App() {
    const [summary, setSummary] = useState('');
    const [insights, setInsights] = useState([]);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [followUpQuestions, setFollowUpQuestions] = useState([]);

    const handleUploadSuccess = (result) => {
        setSummary(result.summary);
        setInsights(result.insights || []);
        setSuggestedQuestions(result.suggested_questions || []);
    };

    const handleQuestionClick = (question) => {
        const input = document.querySelector('.chat-input');
        if (input) {
            input.value = question;
            input.focus();
        }
    };

    const handleQuestionSubmit = (followUps) => {
        setFollowUpQuestions(followUps || []);
    };

    return (
        <div className="app">
            <header className="header">
                <h1>RAG DOCUMENT ASSISTANT</h1>
                <div className="header-line"></div>
            </header>

            <div className="container">
                <UploadBox onUploadSuccess={handleUploadSuccess} />

                <SummaryPanel summary={summary} insights={insights} />

                <Suggestions
                    questions={suggestedQuestions}
                    onQuestionClick={handleQuestionClick}
                />

                <ChatBox onQuestionSubmit={handleQuestionSubmit} />
            </div>
        </div>
    );
}

export default App;
