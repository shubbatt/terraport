import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from './Dashboard';
import { UploadCloud, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const UploadDocuments = () => {
  const [dragActive, setDragActive] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { token } = useAuth();

  const handleDrag = function(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setFileList(prev => [...prev, ...files]);
    }
  };

  const handleChange = function(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      setFileList(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setFileList(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (fileList.length === 0) return;
    
    setUploadStatus('uploading');
    setMessage('');
    
    // We will upload the files one by one for simplicity in this demo backend.
    try {
      for (const file of fileList) {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('serviceType', 'Customs Clearance');
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': "Bearer " + token
          },
          body: formData
        });

        if (!res.ok) {
          throw new Error('Failed to upload ' + file.name);
        }
      }

      setUploadStatus('success');
      setMessage('Documents uploaded securely to our jobs queue!');
      setFileList([]); // clear list on success
    } catch (err: any) {
      setUploadStatus('error');
      setMessage(err.message || 'An error occurred during upload.');
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div>
          <h1>Upload Clearance Documents</h1>
          <p>Submit bills of lading, commercial invoices, and licenses for customs clearance.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        <div>
          <div className="card" style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Select Files</h3>
            <div 
              className={dragActive ? "upload-zone drag-active" : "upload-zone"}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                multiple 
                className="file-input" 
                onChange={handleChange} 
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <UploadCloud size={48} className="upload-icon" />
              <div className="upload-text">Drag and drop documents here</div>
              <div className="upload-hint">or click to browse (.pdf, .jpg, .png max 10MB)</div>
            </div>
            
            {(fileList.length > 0 || uploadStatus !== 'idle') && (
              <div style={{ marginTop: '30px' }}>
                <h4 style={{ marginBottom: '15px' }}>Files queue ({fileList.length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {fileList.map((file, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FileText size={20} color="var(--secondary)" />
                        <div>
                          <p style={{ fontSize: '0.95rem', fontWeight: '500' }}>{file.name}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(i)} 
                        style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}
                        disabled={uploadStatus === 'uploading'}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {fileList.length > 0 && (
                  <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleUpload} className="btn btn-primary" disabled={uploadStatus === 'uploading'}>
                      {uploadStatus === 'uploading' ? 'Uploading securely...' : 'Upload All Documents'}
                    </button>
                  </div>
                )}
                
                {uploadStatus === 'success' && (
                  <div style={{ marginTop: '20px', padding: '16px', background: '#d4edda', color: '#155724', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={20} />
                    {message}
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div style={{ marginTop: '20px', padding: '16px', background: 'var(--danger)', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertCircle size={20} />
                    {message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Document Requirements</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ marginBottom: '4px' }}>Commercial Invoice</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Must clearly show item values and descriptions.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ marginBottom: '4px' }}>Bill of Lading / AWB</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Transport document provided by your carrier.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ marginBottom: '4px' }}>Packing List</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Details of packages, weights, and dimensions.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <AlertCircle size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ marginBottom: '4px' }}>Required Permits</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Submit any special licenses if applicable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadDocuments;
