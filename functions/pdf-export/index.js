const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

app.post('/api/pdf/conversation', (req, res) => {
  try {
    const { title, messages } = req.body;
    
    // For demo purposes without a real Catalyst account to use SmartBrowz,
    // we return a simple base64 encoded text representation of the PDF content
    // In a real app, this would call zcatalyst-sdk-node smartBrowz methods
    
    let content = `KSP CRIME INTELLIGENCE PLATFORM\nREPORT: ${title || 'Conversation Export'}\nDATE: ${new Date().toLocaleString()}\n\n`;
    content += "--------------------------------------------------------\n\n";
    
    if (messages && Array.isArray(messages)) {
      messages.forEach(msg => {
        const sender = msg.role === 'user' ? 'INVESTIGATOR' : 'KSP-AI';
        content += `[${sender}]: ${msg.content}\n\n`;
      });
    }
    
    // Create a mock base64 data URI for a text file (acting as our mock PDF)
    const base64Content = Buffer.from(content).toString('base64');
    const dataUri = `data:text/plain;base64,${base64Content}`;
    
    res.status(200).json({ success: true, fileData: dataUri, format: 'text/plain' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate PDF' });
  }
});

app.post('/api/pdf/report', (req, res) => {
  try {
    const { title, data, report_type } = req.body;
    
    let content = `KSP CRIME INTELLIGENCE PLATFORM\nREPORT: ${title || 'Analytics Report'}\nTYPE: ${report_type}\nDATE: ${new Date().toLocaleString()}\n\n`;
    content += "--------------------------------------------------------\n\n";
    content += JSON.stringify(data, null, 2);
    
    const base64Content = Buffer.from(content).toString('base64');
    const dataUri = `data:text/plain;base64,${base64Content}`;
    
    res.status(200).json({ success: true, fileData: dataUri, format: 'text/plain' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate PDF' });
  }
});

app.get('/health', (req, res) => res.status(200).send('OK'));

module.exports = app;
