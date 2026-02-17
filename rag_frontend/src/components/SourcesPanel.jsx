import { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Button,
    Divider,
} from '@mui/material';
import { PictureAsPdf, CloudUpload } from '@mui/icons-material';

const SourcesPanel = ({ documents, selectedDoc, onSelectDoc, onUpload }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await onUpload(file);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <Box
            sx={{
                width: { xs: '100%', md: 320 },
                height: { xs: 'auto', md: '100vh' },
                backgroundColor: '#000000',
                borderRight: { md: '1px solid rgba(255, 255, 255, 0.05)' },
                borderBottom: { xs: '1px solid rgba(255, 255, 255, 0.05)', md: 'none' },
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
            }}
        >
            {/* Header */}
            <Box sx={{ p: 3, pb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Sources
                </Typography>

                {/* Upload Button */}
                <input
                    type="file"
                    id="file-upload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <label htmlFor="file-upload">
                    <Button
                        component="span"
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<CloudUpload />}
                        disabled={uploading}
                        sx={{
                            py: 1.5,
                            fontSize: '0.95rem',
                            fontWeight: 600,
                        }}
                    >
                        {uploading ? 'Uploading...' : 'Upload PDF'}
                    </Button>
                </label>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

            {/* Document List */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {documents.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4, px: 2 }}>
                        No documents uploaded
                    </Typography>
                ) : (
                    <List sx={{ p: 0 }}>
                        {documents.map((doc) => (
                            <ListItemButton
                                key={doc.hash}
                                selected={selectedDoc?.hash === doc.hash}
                                onClick={() => onSelectDoc(doc)}
                                sx={{
                                    mb: 1,
                                    borderRadius: 2,
                                    border: selectedDoc?.hash === doc.hash
                                        ? '2px solid'
                                        : '1px solid rgba(255, 255, 255, 0.05)',
                                    borderColor: selectedDoc?.hash === doc.hash ? 'primary.main' : 'rgba(255, 255, 255, 0.05)',
                                    backgroundColor: selectedDoc?.hash === doc.hash
                                        ? 'rgba(14, 165, 233, 0.1)'
                                        : 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'rgba(14, 165, 233, 0.05)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedDoc?.hash === doc.hash}
                                        tabIndex={-1}
                                        disableRipple
                                        size="small"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.3)',
                                            '&.Mui-checked': {
                                                color: 'primary.main',
                                            },
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <PictureAsPdf sx={{ color: 'primary.main', fontSize: 20 }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={doc.filename}
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        sx: {
                                            fontWeight: selectedDoc?.hash === doc.hash ? 600 : 400,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        },
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default SourcesPanel;
