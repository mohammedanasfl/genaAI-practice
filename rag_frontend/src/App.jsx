import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import SourcesPanel from './components/SourcesPanel';
import DocumentPanel from './components/DocumentPanel';
import { uploadDocument, queryDocument } from './services/api';

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleUpload = async (file) => {
    try {
      const result = await uploadDocument(file);

      if (result.message && result.message.includes('already exists')) {
        alert(result.message);
      }

      const newDoc = {
        hash: result.hash,
        filename: result.filename,
        summary: result.summary,
        suggested_questions: result.suggested_questions || [],
        insights: result.insights || [],
      };

      setDocuments((prev) => {
        const existing = prev.find((d) => d.hash === result.hash);
        if (existing) {
          return prev.map((d) => (d.hash === result.hash ? newDoc : d));
        }
        return [...prev, newDoc];
      });

      setSelectedDoc(newDoc);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  };

  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc);
  };

  const handleQuery = async (question) => {
    if (!selectedDoc) {
      throw new Error('No document selected');
    }
    return await queryDocument(question);
  };

  const handleDelete = (doc) => {
    if (window.confirm(`Delete "${doc.filename}"?`)) {
      setDocuments((prev) => prev.filter((d) => d.hash !== doc.hash));
      if (selectedDoc?.hash === doc.hash) {
        setSelectedDoc(null);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100vh', overflow: 'hidden', backgroundColor: '#000000' }}>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <SourcesPanel
          documents={documents}
          selectedDoc={selectedDoc}
          onSelectDoc={handleSelectDoc}
          onUpload={handleUpload}
          onDelete={handleDelete}
        />
      </Box>

      {/* Mobile: Show sources panel at top */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, maxHeight: '40vh', overflow: 'auto' }}>
        <SourcesPanel
          documents={documents}
          selectedDoc={selectedDoc}
          onSelectDoc={handleSelectDoc}
          onUpload={handleUpload}
          onDelete={handleDelete}
        />
      </Box>

      <DocumentPanel document={selectedDoc} onQuery={handleQuery} />
    </Box>
  );
}

export default App;
