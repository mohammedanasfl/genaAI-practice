import { useState } from 'react';

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
            onUploadSuccess(result);
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-section">
            <h2>UPLOAD DOCUMENT</h2>
            <div
                className={`drop-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-input"
                    accept=".pdf"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
                <label htmlFor="file-input" className="upload-label">
                    {uploading ? 'UPLOADING...' : 'DROP PDF HERE OR CLICK TO BROWSE'}
                </label>
            </div>
        </div>
    );
};

export default UploadBox;
