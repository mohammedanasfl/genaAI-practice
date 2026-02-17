import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Paper, Chip } from '@mui/material';
import { Send, QuestionAnswer } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
const ChatBox = ({ onQuestionSubmit, followUpQuestions }) => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleFillQuestion = (e) => {
            setQuestion(e.detail);
        };
        window.addEventListener('fillQuestion', handleFillQuestion);
        return () => window.removeEventListener('fillQuestion', handleFillQuestion);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        const userQuestion = question;
        setQuestion('');
        setLoading(true);

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: userQuestion }]);

        try {
            const { queryDocument } = await import('../services/api');
            const result = await queryDocument(userQuestion);

            console.log('Answer:', result.answer);

            // Add AI response
            setMessages(prev => [...prev, {
                type: 'ai',
                text: result.answer,
                followUps: result.follow_up_questions || []
            }]);

            onQuestionSubmit(result.follow_up_questions);
        } catch (error) {
            setMessages(prev => [...prev, {
                type: 'error',
                text: 'Failed to get answer: ' + error.message
            }]);
        } finally {
            setLoading(false);
        }
    };
    const handleFollowUpClick = (q) => {
        setQuestion(q);
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <QuestionAnswer sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                        Ask Questions
                    </Typography>
                </Box>

                {/* Messages */}
                <Box sx={{ mb: 3, maxHeight: 400, overflowY: 'auto' }}>
                    {messages.map((msg, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 2,
                                    backgroundColor: msg.type === 'user'
                                        ? 'primary.dark'
                                        : msg.type === 'error'
                                            ? 'error.dark'
                                            : 'background.paper',
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                                    {msg.type === 'user' ? 'YOU:' : 'AI:'}
                                </Typography>
                                <Box
                                    sx={{
                                        '& p': { margin: '0.5em 0' },
                                        '& ul, & ol': { paddingLeft: '1.5em', margin: '0.5em 0' },
                                        '& li': { margin: '0.25em 0' },
                                        '& strong': { fontWeight: 700, color: 'inherit' },
                                        '& em': { fontStyle: 'italic' },
                                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                                            fontWeight: 600,
                                            margin: '0.75em 0 0.5em 0',
                                            color: 'inherit'
                                        },
                                        '& code': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            padding: '0.2em 0.4em',
                                            borderRadius: '3px',
                                            fontFamily: 'monospace'
                                        },
                                        color: 'inherit'
                                    }}
                                >
                                    <ReactMarkdown>
                                        {msg.text}
                                    </ReactMarkdown>
                                </Box>
                            </Paper>

                            {/* Follow-up questions */}
                            {msg.followUps && msg.followUps.length > 0 && (
                                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {msg.followUps.map((q, i) => (
                                        <Chip
                                            key={i}
                                            label={q}
                                            size="small"
                                            onClick={() => handleFollowUpClick(q)}
                                            color="primary"
                                            variant="outlined"
                                            sx={{
                                                height: 'auto',
                                                py: 0.5,
                                                '& .MuiChip-label': {
                                                    whiteSpace: 'normal',
                                                },
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>

                {/* Input */}
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your question here..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !question.trim()}
                        endIcon={<Send />}
                    >
                        Ask
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ChatBox;
