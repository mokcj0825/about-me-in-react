import React, { useState, useCallback } from 'react';
import './StringTest.css';

const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];
const MAX_FRET = 19;

// Key signatures from all flats to all sharps
const KEY_SIGNATURES = [
  { key: 'Cb', signature: 'C♭', flats: 7, sharps: 0, display: 'C♭ (7 flats)' },
  { key: 'Gb', signature: 'G♭', flats: 6, sharps: 0, display: 'G♭ (6 flats)' },
  { key: 'Db', signature: 'D♭', flats: 5, sharps: 0, display: 'D♭ (5 flats)' },
  { key: 'Ab', signature: 'A♭', flats: 4, sharps: 0, display: 'A♭ (4 flats)' },
  { key: 'Eb', signature: 'E♭', flats: 3, sharps: 0, display: 'E♭ (3 flats)' },
  { key: 'Bb', signature: 'B♭', flats: 2, sharps: 0, display: 'B♭ (2 flats)' },
  { key: 'F', signature: 'F', flats: 1, sharps: 0, display: 'F (1 flat)' },
  { key: 'C', signature: 'C', flats: 0, sharps: 0, display: 'C (no sharps/flats)' },
  { key: 'G', signature: 'G', flats: 0, sharps: 1, display: 'G (1 sharp)' },
  { key: 'D', signature: 'D', flats: 0, sharps: 2, display: 'D (2 sharps)' },
  { key: 'A', signature: 'A', flats: 0, sharps: 3, display: 'A (3 sharps)' },
  { key: 'E', signature: 'E', flats: 0, sharps: 4, display: 'E (4 sharps)' },
  { key: 'B', signature: 'B', flats: 0, sharps: 5, display: 'B (5 sharps)' },
  { key: 'F#', signature: 'F♯', flats: 0, sharps: 6, display: 'F♯ (6 sharps)' },
  { key: 'C#', signature: 'C♯', flats: 0, sharps: 7, display: 'C♯ (7 sharps)' }
];

// Type for key signature accidentals
type Accidental = {
  note: string;
  type: 'flat' | 'sharp';
  position: number;
};

// Key signature accidentals and their positions
const KEY_SIGNATURE_ACCIDENTALS: Record<string, Accidental[]> = {
  // Flat keys (order: B♭, E♭, A♭, D♭, G♭, C♭, F♭)
  'F': [{ note: 'B', type: 'flat', position: 3 }], // B♭ on B4 line
  'Bb': [
    { note: 'B', type: 'flat', position: 3 }, // B♭ on B4 line
    { note: 'E', type: 'flat', position: 4 }  // E♭ on E4 line
  ],
  'Eb': [
    { note: 'B', type: 'flat', position: 3 }, // B♭ on B4 line
    { note: 'E', type: 'flat', position: 4 }, // E♭ on E4 line
    { note: 'A', type: 'flat', position: 2.5 } // A♭ on A4 space
  ],
  'Ab': [
    { note: 'B', type: 'flat', position: 3 }, // B♭ on B4 line
    { note: 'E', type: 'flat', position: 4 }, // E♭ on E4 line
    { note: 'A', type: 'flat', position: 2.5 }, // A♭ on A4 space
    { note: 'D', type: 'flat', position: 1 } // D♭ on D5 line
  ],
  'Db': [
    { note: 'B', type: 'flat', position: 3 }, // B♭ on B4 line
    { note: 'E', type: 'flat', position: 4 }, // E♭ on E4 line
    { note: 'A', type: 'flat', position: 2.5 }, // A♭ on A4 space
    { note: 'D', type: 'flat', position: 1 }, // D♭ on D5 line
    { note: 'G', type: 'flat', position: 3.5 } // G♭ on G4 space
  ],
  'Gb': [
    { note: 'B', type: 'flat', position: 3 }, // B♭ on B4 line
    { note: 'E', type: 'flat', position: 4 }, // E♭ on E4 line
    { note: 'A', type: 'flat', position: 2.5 }, // A♭ on A4 space
    { note: 'D', type: 'flat', position: 1 }, // D♭ on D5 line
    { note: 'G', type: 'flat', position: 3.5 }, // G♭ on G4 space
    { note: 'C', type: 'flat', position: 1.5 } // C♭ on C5 space
  ],
  'Cb': [
    { note: 'B', type: 'flat', position: 3 }, // B♭ on B4 line
    { note: 'E', type: 'flat', position: 4 }, // E♭ on E4 line
    { note: 'A', type: 'flat', position: 2.5 }, // A♭ on A4 space
    { note: 'D', type: 'flat', position: 1 }, // D♭ on D5 line
    { note: 'G', type: 'flat', position: 3.5 }, // G♭ on G4 space
    { note: 'C', type: 'flat', position: 1.5 }, // C♭ on C5 space
    { note: 'F', type: 'flat', position: 0 } // F♭ on F5 line
  ],
  
  // Sharp keys (order: F♯, C♯, G♯, D♯, A♯, E♯, B♯)
  'G': [{ note: 'F', type: 'sharp', position: 0 }], // F♯ on F5 line
  'D': [
    { note: 'F', type: 'sharp', position: 0 }, // F♯ on F5 line
    { note: 'C', type: 'sharp', position: 1.5 } // C♯ on C5 space
  ],
  'A': [
    { note: 'F', type: 'sharp', position: 0 }, // F♯ on F5 line
    { note: 'C', type: 'sharp', position: 1.5 }, // C♯ on C5 space
    { note: 'G', type: 'sharp', position: -0.5 } // G♯ on G4 line (58px)
  ],
  'E': [
    { note: 'F', type: 'sharp', position: 0 }, // F♯ on F5 line
    { note: 'C', type: 'sharp', position: 1.5 }, // C♯ on C5 space
    { note: 'G', type: 'sharp', position: -0.5 }, // G♯ on G4 line (58px)
    { note: 'D', type: 'sharp', position: 1 } // D♯ on D5 line
  ],
  'B': [
    { note: 'F', type: 'sharp', position: 0 }, // F♯ on F5 line
    { note: 'C', type: 'sharp', position: 1.5 }, // C♯ on C5 space
    { note: 'G', type: 'sharp', position: -0.5 }, // G♯ on G4 line (58px)
    { note: 'D', type: 'sharp', position: 1 }, // D♯ on D5 line
    { note: 'A', type: 'sharp', position: 2.5 } // A♯ on A4 space
  ],
  'F#': [
    { note: 'F', type: 'sharp', position: 0 }, // F♯ on F5 line
    { note: 'C', type: 'sharp', position: 1.5 }, // C♯ on C5 space
    { note: 'G', type: 'sharp', position: -0.5 }, // G♯ on G4 line (58px)
    { note: 'D', type: 'sharp', position: 1 }, // D♯ on D5 line
    { note: 'A', type: 'sharp', position: 2.5 }, // A♯ on A4 space
    { note: 'E', type: 'sharp', position: 0.4 } // E♯ on E4 line (76px) - one octave higher
  ],
  'C#': [
    { note: 'F', type: 'sharp', position: 0 }, // F♯ on F5 line
    { note: 'C', type: 'sharp', position: 1.5 }, // C♯ on C5 space
    { note: 'G', type: 'sharp', position: -0.5 }, // G♯ on G4 line (58px)
    { note: 'D', type: 'sharp', position: 1 }, // D♯ on D5 line
    { note: 'A', type: 'sharp', position: 2.5 }, // A♯ on A4 space
    { note: 'E', type: 'sharp', position: 0.4 }, // E♯ on E4 line (76px) - one octave higher
    { note: 'B', type: 'sharp', position: 1.9 } // B♯ on B4 line (106px) - middle line
  ]
};

// Staff line positions and their corresponding notes (from top to bottom)
const STAFF_POSITIONS = [
  { position: 0, note: 'F5' },   // Top line
  { position: 0.5, note: 'E5' }, // First space
  { position: 1, note: 'D5' },   // Second line
  { position: 1.5, note: 'C5' }, // Second space
  { position: 2, note: 'B4' },   // Middle line
  { position: 2.5, note: 'A4' }, // Third space
  { position: 3, note: 'G4' },   // Fourth line
  { position: 3.5, note: 'F4' }, // Fourth space
  { position: 4, note: 'E4' }    // Bottom line
];

// Extended staff positions for ledger lines (below and above the staff)
const LEDGER_POSITIONS = [
  // Below the staff (lower than E4)
  { position: 4.5, note: 'D4' },
  { position: 5, note: 'C4' },
  { position: 5.5, note: 'B3' },
  { position: 6, note: 'A3' },
  { position: 6.5, note: 'G3' },
  { position: 7, note: 'F3' },
  { position: 7.5, note: 'E3' },
  { position: 8, note: 'D3' },
  { position: 8.5, note: 'C3' },
  { position: 9, note: 'B2' },
  { position: 9.5, note: 'A2' },
  { position: 10, note: 'G2' },
  { position: 10.5, note: 'F2' },
  { position: 11, note: 'E2' },
  { position: 11.5, note: 'D2' },
  { position: 12, note: 'C2' },
  // Above the staff (higher than F5)
  { position: -0.5, note: 'G5' },
  { position: -1, note: 'A5' },
  { position: -1.5, note: 'B5' },
  { position: -2, note: 'C6' },
  { position: -2.5, note: 'D6' },
  { position: -3, note: 'E6' },
  { position: -3.5, note: 'F6' },
  { position: -4, note: 'G6' }
];

const StringTest: React.FC = () => {
  // State for guitar tuning
  const [guitarTuning, setGuitarTuning] = useState<string[]>(STANDARD_TUNING);
  
  // State for highlighted note
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null);
  
  // State for selected key signature
  const [selectedKeySignature, setSelectedKeySignature] = useState<string>('C');

  // Convert note to fret positions
  const getFretPositions = useCallback((note: string): { string: number; fret: number }[] => {
    const positions: { string: number; fret: number }[] = [];
    
    // Extract base note and octave
    const baseNote = note.replace(/\d/g, '');
    const targetOctave = parseInt(note.replace(/\D/g, ''));
    
    // Define string tunings with their octaves (from top to bottom)
    const stringTunings = [
      { string: 1, note: 'E', octave: 3 }, // E2 (top string)
      { string: 2, note: 'A', octave: 3 }, // A2
      { string: 3, note: 'D', octave: 4 }, // D4 (not D3)
      { string: 4, note: 'G', octave: 4 }, // G4
      { string: 5, note: 'B', octave: 4 }, // B4
      { string: 6, note: 'E', octave: 5 }  // E5 (bottom string)
    ];
    
    // Convert notes to step values (counting each note as a step)
    const noteToSteps = (note: string, octave: number): number => {
      const noteValues: { [key: string]: number } = {
        'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
      };
      // Use standard octave system where C4 is middle C
      return noteValues[note] + (octave * 12);
    };
    
    const targetSteps = noteToSteps(baseNote, targetOctave);
    
    // LINE BY LINE CHECKING FOR B4 CASE:
    // LINE E5 IS HIGHER THAN B4, RETURN NOT AVAILABLE
    // LINE B4 IS EQUAL TO B4, RETURN 0
    // LINE G3 HAVE 4 SEMITONE TO B4, RETURN 4
    // LINE D3 HAVE 9 SEMITONE TO B4, RETURN 9
    // LINE A2 HAVE 14 SEMITONE TO B4, RETURN 14
    // LINE E2 HAVE 19 SEMITONE TO B4, RETURN 19
    stringTunings.forEach(stringTuning => {
      const stringSteps = noteToSteps(stringTuning.note, stringTuning.octave);
      
      // LINE BY LINE CHECKING:
      if (stringSteps > targetSteps) {
        // String tuning is higher than target note - NOT AVAILABLE
        // Do nothing (don't add to positions)
      } else if (stringSteps === targetSteps) {
        // String tuning equals target note - RETURN 0
        positions.push({ string: stringTuning.string, fret: 0 });
      } else {
        // String tuning is lower than target note - calculate fret difference
        const fretDifference = targetSteps - stringSteps;
        positions.push({ string: stringTuning.string, fret: fretDifference });
      }
    });
    
    return positions;
  }, [guitarTuning]);

  // Handle guitar tuning change
  const handleTuningChange = (stringIndex: number, tuning: string) => {
    const newTuning = [...guitarTuning];
    newTuning[stringIndex] = tuning;
    setGuitarTuning(newTuning);
  };

  // Generate tablature line for a string
  const generateTabLine = (stringIndex: number, tuning: string) => {
    const highlightedFrets = highlightedNote ? 
      getFretPositions(highlightedNote)
        .filter(pos => pos.string === stringIndex + 1)
        .map(pos => pos.fret) : [];
    
    let tabLine = tuning;
    
    // Find the lowest fret position for this string (most practical)
    const lowestFret = highlightedFrets.length > 0 ? Math.min(...highlightedFrets) : null;
    
    for (let fret = 0; fret <= MAX_FRET; fret++) {
      if (fret === lowestFret) {
        tabLine += fret.toString();
      } else {
        tabLine += '-';
      }
    }
    
    return tabLine;
  };

  return (
    <div className="string-test-container">
      <h2>Guitar Tab Converter</h2>
      
      {/* Key Signature Selection */}
      <div className="key-signature-section">
        <h3>Key Signature</h3>
        <select 
          value={selectedKeySignature}
          onChange={(e) => setSelectedKeySignature(e.target.value)}
          className="key-signature-dropdown"
        >
          {KEY_SIGNATURES.map((keySig) => (
            <option key={keySig.key} value={keySig.key}>
              {keySig.display}
            </option>
          ))}
        </select>
        <div className="key-signature-info">
          Selected: {KEY_SIGNATURES.find(k => k.key === selectedKeySignature)?.display}
        </div>
      </div>
      
      <div className="main-layout">
        {/* Left Side: Musical Staff Notation */}
        <div className="notation-section">
          <h3>Musical Staff</h3>
          <div className="staff-container">
            <div className="staff">
              {/* Key Signature Accidentals */}
              {KEY_SIGNATURE_ACCIDENTALS[selectedKeySignature]?.map((accidental, index) => {
                // Calculate the correct top position based on the accidental's position
                const topPosition = accidental.position * 20 + 68;
                
                return (
                  <div
                    key={`key-sig-${index}`}
                    className={`key-signature-accidental ${accidental.type}`}
                    style={{
                      position: 'absolute',
                      left: `${20 + (index * 15)}px`,
                      top: `${topPosition}px`,
                      fontSize: '25px',
                      fontWeight: 'bold',
                      color: accidental.type === 'flat' ? '#007bff' : '#dc3545',
                      zIndex: 3
                    }}
                    title={`${accidental.note}${accidental.type === 'flat' ? '♭' : '♯'}`}
                  >
                    {accidental.type === 'flat' ? '♭' : '♯'}
                  </div>
                );
              })}
              
              {/* Main staff lines and spaces - hoverable */}
              {STAFF_POSITIONS.map((pos, index) => {
                const isLine = Number.isInteger(pos.position);
                
                if (isLine) {
                  return (
                    <div 
                      key={`staff-${index}`} 
                      className="staff-line"
                      style={{ top: `${pos.position * 20 + 80}px` }}
                      onMouseEnter={() => setHighlightedNote(pos.note)}
                      onMouseLeave={() => setHighlightedNote(null)}
                      title={`Line: ${pos.note}`}
                    />
                  );
                } else {
                  return (
                    <div 
                      key={`space-${index}`} 
                      className="staff-space"
                      style={{ top: `${pos.position * 20 + 70}px` }}
                      onMouseEnter={() => setHighlightedNote(pos.note)}
                      onMouseLeave={() => setHighlightedNote(null)}
                      title={`Space: ${pos.note}`}
                    />
                  );
                }
              })}
              
              {/* Ledger lines - appear when hovering over notes that need them */}
              {highlightedNote && LEDGER_POSITIONS.map((pos, index) => {
                // Show ledger lines for notes that are NOT on the main staff
                const isOnMainStaff = STAFF_POSITIONS.some(staffPos => staffPos.note === pos.note);
                
                if (pos.note === highlightedNote && !isOnMainStaff) {
                  // Calculate how many ledger lines we need
                  const staffBottom = 4; // E4 (bottom line)
                  const staffTop = 0;    // F5 (top line)
                  const notePosition = pos.position;
                  
                  let ledgerLines = [];
                  
                  if (notePosition > staffBottom) {
                    // Note is below staff - show ledger lines from staff bottom down to note
                    for (let i = staffBottom + 1; i <= Math.ceil(notePosition); i++) {
                      ledgerLines.push(i);
                    }
                  } else if (notePosition < staffTop) {
                    // Note is above staff - show ledger lines from note position up to staff
                    for (let i = Math.floor(notePosition); i < staffTop; i++) {
                      ledgerLines.push(i);
                    }
                  }
                  
                  return ledgerLines.map((linePos, lineIndex) => (
                    <div
                      key={`ledger-${index}-${lineIndex}`}
                      className="ledger-line"
                      style={{ top: `${linePos * 20 + 80}px` }}
                    />
                  ));
                }
                return null;
              })}
              
              {/* Hover areas for ledger line notes */}
              {LEDGER_POSITIONS.map((pos, index) => {
                const isOnMainStaff = STAFF_POSITIONS.some(staffPos => staffPos.note === pos.note);
                
                if (!isOnMainStaff) {
                  return (
                    <div
                      key={`ledger-hover-${index}`}
                      className="ledger-hover-area"
                      style={{ 
                        position: 'absolute',
                        left: '10px',
                        right: '10px',
                        top: `${pos.position * 20 + 70}px`,
                        height: '20px',
                        cursor: 'pointer',
                        zIndex: 1
                      }}
                      onMouseEnter={() => setHighlightedNote(pos.note)}
                      onMouseLeave={() => setHighlightedNote(null)}
                      title={`Ledger: ${pos.note}`}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Tablature Notation */}
        <div className="tablature-section">
          <h3>Tablature</h3>
          <div className="tab-display">
            <div className="tuning-controls">
              {guitarTuning.map((tuning, index) => (
                <div key={index} className="tuning-input">
                  <label>String {index + 1}:</label>
                  <input
                    type="text"
                    value={tuning}
                    onChange={(e) => handleTuningChange(index, e.target.value)}
                    placeholder="Tuning"
                    maxLength={2}
                  />
                </div>
              ))}
            </div>
            <div className="tab-lines">
              {guitarTuning.map((tuning, stringIndex) => {
                // Reverse the display order: E2 (top) to E5 (bottom)
                const displayIndex = guitarTuning.length - 1 - stringIndex;
                const displayTuning = guitarTuning[displayIndex];
                
                return (
                  <div key={stringIndex} className="tab-line">
                    <span className="tab-string-label">{displayTuning}</span>
                    <span className="tab-content">{generateTabLine(displayIndex, displayTuning)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StringTest;