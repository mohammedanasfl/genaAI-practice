import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

const Suggestions = ({ questions, onQuestionClick }) => {
    if (!questions || questions.length === 0) return null;

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HelpOutline sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                        Suggested Questions
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {questions.map((question, index) => (
                        <Chip
                            key={index}
                            label={question}
                            onClick={() => onQuestionClick(question)}
                            color="primary"
                            variant="outlined"
                            sx={{
                                justifyContent: 'flex-start',
                                height: 'auto',
                                py: 1,
                                '& .MuiChip-label': {
                                    whiteSpace: 'normal',
                                    textAlign: 'left',
                                },
                            }}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default Suggestions;
