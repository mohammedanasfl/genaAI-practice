import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Chip,
    Card,
    CardContent,
    Badge,
} from '@mui/material';
import { Send, Description, Lightbulb } from '@mui/icons-material';

const DocumentPanel = ({ document, onQuery }) => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        setMessages([]);
    }, [document?.hash]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim() || !document) return;

        const userQuestion = question;
        setQuestion('');
        setLoading(true);

        setMessages((prev) => [...prev, { type: 'user', text: userQuestion }]);

        try {
            const result = await onQuery(userQuestion);

            setMessages((prev) => [
                ...prev,
                {
                    type: 'ai',
                    text: result.answer,
                    followUps: result.follow_up_questions || [],
                    confidence: result.confidence || 0,
                },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    type: 'error',
                    text: 'Failed to get answer: ' + error.message,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionClick = (q) => {
        setQuestion(q);
    };

    if (!document) {
        return (
            <Box
                sx={{
                    flex: 1,
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    Select a document to get started
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flex: 1,
                height: '100vh',
                backgroundColor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Scrollable Workspace */}
            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 3,
                }}
            >
                {/* 1. Summary Card */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Description sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Document Summary
                            </Typography>
                        </Box>
                        {document.summary ? (
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                {document.summary}
                            </Typography>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No summary available
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                {/* 2. Insights Section */}
                {document.insights && document.insights.length > 0 && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Lightbulb sx={{ color: 'primary.main', fontSize: 20 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Key Insights
                                </Typography>
                            </Box>
                            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                                {document.insights.map((insight, i) => (
                                    <Typography
                                        key={i}
                                        component="li"
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1, lineHeight: 1.6 }}
                                    >
                                        {insight}
                                    </Typography>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Suggested Questions (before chat starts) */}
                {document.suggested_questions && document.suggested_questions.length > 0 && messages.length === 0 && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                Suggested Questions
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {document.suggested_questions.map((q, i) => (
                                    <Chip
                                        key={i}
                                        label={q}
                                        onClick={() => handleQuestionClick(q)}
                                        variant="outlined"
                                        sx={{
                                            justifyContent: 'flex-start',
                                            height: 'auto',
                                            py: 1,
                                            px: 2,
                                            borderColor: 'rgba(14, 165, 233, 0.3)',
                                            color: 'text.primary',
                                            '& .MuiChip-label': {
                                                whiteSpace: 'normal',
                                                textAlign: 'left',
                                            },
                                            '&:hover': {
                                                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                                                borderColor: 'primary.main',
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* 3. Chat Block */}
                {messages.length > 0 && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                Conversation
                            </Typography>
                            {messages.map((msg, index) => (
                                <Box key={index} sx={{ mb: 2.5 }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            backgroundColor:
                                                msg.type === 'user'
                                                    ? 'rgba(14, 165, 233, 0.15)'
                                                    : msg.type === 'error'
                                                        ? 'rgba(239, 68, 68, 0.15)'
                                                        : '#242424',
                                            border: '1px solid',
                                            borderColor:
                                                msg.type === 'user'
                                                    ? 'rgba(14, 165, 233, 0.3)'
                                                    : 'rgba(255, 255, 255, 0.05)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: msg.type === 'user' ? 'primary.main' : 'text.secondary',
                                                }}
                                            >
                                                {msg.type === 'user' ? 'YOU' : 'AI'}
                                            </Typography>
                                            {msg.confidence && (
                                                <Badge
                                                    badgeContent={`${msg.confidence}%`}
                                                    color="primary"
                                                    sx={{
                                                        '& .MuiBadge-badge': {
                                                            position: 'static',
                                                            transform: 'none',
                                                            fontSize: '0.7rem',
                                                            px: 1,
                                                        },
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                                            {msg.text}
                                        </Typography>
                                    </Paper>

                                    {/* Follow-up questions */}
                                    {msg.followUps && msg.followUps.length > 0 && (
                                        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {msg.followUps.map((q, i) => (
                                                <Chip
                                                    key={i}
                                                    label={q}
                                                    size="small"
                                                    onClick={() => handleQuestionClick(q)}
                                                    variant="outlined"
                                                    sx={{
                                                        borderColor: 'primary.main',
                                                        color: 'primary.main',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(14, 165, 233, 0.1)',
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            ))}
                            <div ref={chatEndRef} />
                        </CardContent>
                    </Card>
                )}
            </Box>

            {/* 4. Fixed Input at Bottom */}
            <Box
                sx={{
                    p: 3,
                    pt: 2,
                    backgroundColor: '#0a0a0a',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}
            >
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1.5 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Ask a question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                        size="medium"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !question.trim()}
                        endIcon={<Send />}
                        sx={{ px: 3, minWidth: 100 }}
                    >
                        {loading ? 'Asking...' : 'Ask'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default DocumentPanel;
