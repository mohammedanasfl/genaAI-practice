import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Description, Lightbulb } from '@mui/icons-material';

const SummaryPanel = ({ summary, insights }) => {
    if (!summary) return null;

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Description sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                        Document Summary
                    </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                    {summary}
                </Typography>

                {insights && insights.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Lightbulb sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6">
                                Key Insights
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {insights.map((insight, index) => (
                                <Chip
                                    key={index}
                                    label={insight}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default SummaryPanel;
