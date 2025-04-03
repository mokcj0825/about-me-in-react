import React, { useState, useEffect } from 'react';

interface BlessingPreviewForm {
  id: string;
  name: string;
  path: string;
  description: string;
  rarity: number;
  category: 'offense' | 'defense' | 'hinder' | 'boost' | 'recovery';
}

const INITIAL_FORM_STATE: BlessingPreviewForm = {
  id: '',
  name: '',
  path: '',
  description: '',
  rarity: 1,
  category: 'offense'
};

const CATEGORY_OPTIONS = ['offense', 'defense', 'hinder', 'boost', 'recovery'] as const;
const RARITY_OPTIONS = [1, 2, 3] as const;
const PATH_OPTIONS = [
  'preservation',
  'remembrance',
  'nihility',
  'abundance',
  'theHunt',
  'destruction',
  'elation',
  'propagation',
  'erudition'
] as const;

export const EditorTheater: React.FC = () => {
  const [formData, setFormData] = useState<BlessingPreviewForm>(INITIAL_FORM_STATE);
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [isIdManuallyEdited, setIsIdManuallyEdited] = useState(false);

  // Function to convert name to snake_case id
  const generateIdFromName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .trim()
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/-/g, '_') // Replace hyphens with underscores
      .replace(/_+/g, '_'); // Replace multiple underscores with single underscore
  };

  // Auto-generate ID when name changes
  useEffect(() => {
    if (!isIdManuallyEdited && formData.name) {
      setFormData(prev => ({
        ...prev,
        id: generateIdFromName(formData.name)
      }));
    }
  }, [formData.name, isIdManuallyEdited]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'id') {
      setIsIdManuallyEdited(true);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rarity' ? Number(value) : value
    }));
  };

  const handleNameBlur = () => {
    if (!isIdManuallyEdited && formData.name) {
      setFormData(prev => ({
        ...prev,
        id: generateIdFromName(formData.name)
      }));
    }
  };

  const generateJson = () => {
    const output = JSON.stringify(formData, null, 2);
    setJsonOutput(output);
    
    // Copy to clipboard
    navigator.clipboard.writeText(output).catch(console.error);
  };

  const isFormValid = () => {
    return (
      formData.id.trim() !== '' &&
      formData.name.trim() !== '' &&
      formData.path.trim() !== '' &&
      formData.description.trim() !== ''
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Blessing Preview Editor</h1>
      
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleNameBlur}
              style={{ width: '100%', padding: '0.5rem' }}
              placeholder="e.g., Wreath of Interlaced Pipes"
            />
          </label>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            ID: {!isIdManuallyEdited && <span style={{ fontSize: '0.8em', color: '#666' }}>(auto-generated)</span>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.5rem' }}
                placeholder="e.g., wreath_of_interlaced_pipes"
              />
              <button
                onClick={() => {
                  const filename = `${formData.id}.json`;
                  navigator.clipboard.writeText(filename)
                    .then(() => {
                      // Show temporary success message
                      const button = document.getElementById('copyFilenameBtn');
                      if (button) {
                        const originalText = button.textContent;
                        button.textContent = '✓';
                        button.style.backgroundColor = '#4CAF50';
                        button.style.color = 'white';
                        setTimeout(() => {
                          button.textContent = originalText;
                          button.style.backgroundColor = '#f0f0f0';
                          button.style.color = 'inherit';
                        }, 1000);
                      }
                    })
                    .catch(console.error);
                }}
                id="copyFilenameBtn"
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  minWidth: '100px'
                }}
                title="Copy as filename"
              >
                Copy filename
              </button>
              {isIdManuallyEdited && (
                <button
                  onClick={() => {
                    setIsIdManuallyEdited(false);
                    setFormData(prev => ({
                      ...prev,
                      id: generateIdFromName(prev.name)
                    }));
                  }}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  title="Reset to auto-generated ID"
                >
                  ↺
                </button>
              )}
            </div>
          </label>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Path:
            <select
              name="path"
              value={formData.path}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="">Select a path...</option>
              {PATH_OPTIONS.map(path => (
                <option key={path} value={path}>
                  {path.charAt(0).toUpperCase() + path.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem', minHeight: '100px' }}
              placeholder="Enter blessing description..."
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ flex: 1 }}>
            Rarity:
            <select
              name="rarity"
              value={formData.rarity}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              {RARITY_OPTIONS.map(rarity => (
                <option key={rarity} value={rarity}>
                  {rarity}
                </option>
              ))}
            </select>
          </label>

          <label style={{ flex: 1 }}>
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              {CATEGORY_OPTIONS.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <button
        onClick={generateJson}
        disabled={!isFormValid()}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: isFormValid() ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isFormValid() ? 'pointer' : 'not-allowed'
        }}
      >
        Generate JSON
      </button>

      {jsonOutput && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Generated JSON:</h2>
          <pre style={{
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {jsonOutput}
          </pre>
          <p style={{ color: '#4CAF50' }}>✓ JSON copied to clipboard!</p>
        </div>
      )}
    </div>
  );
};

export default EditorTheater;
