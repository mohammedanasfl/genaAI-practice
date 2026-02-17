import { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const UploadBox = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = async (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            await handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        setUploading(true);
        try {
            const { uploadDocument } = await import('../services/api');
            const result = await uploadDocument(file);

            // Show alert if document already exists
            if (result.message && result.message.includes('already exists')) {
                alert(result.message);
            }

            onUploadSuccess(result);
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Upload Document
                </Typography>
                <Box
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    sx={{
                        border: dragActive ? '2px dashed #2196f3' : '2px dashed #666',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: dragActive ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                    }}
                >
                    <input
                        type="file"
                        id="file-input"
                        accept=".pdf"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="file-input" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="body1">
                            {uploading ? 'Uploading...' : 'Drop PDF here or click to browse'}
                        </Typography>
                    </label>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UploadBox;
