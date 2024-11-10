import path from 'path';
import fs from 'fs';

export const downloadNotice = (req, res) => {
  const { filename } = req.params;  
  
  const filePath = path.join(__dirname, '..', 'uploads', filename); 

  
  fs.exists(filePath, (exists) => {
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      res.status(500).json({ error: 'Error downloading the file' });
    });
  });
};
