const API_BASE = 'http://localhost:8000';

export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    return response.json();
};

export const queryDocument = async (question) => {
    const response = await fetch(`${API_BASE}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
    });

    if (!response.ok) {
        throw new Error('Query failed');
    }

    return response.json();
};
