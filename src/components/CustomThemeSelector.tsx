import React, { useState, useRef, useEffect } from 'react';
import { ThemeName } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import './CustomThemeSelector.css';

interface ThemeOption {
  value: ThemeName;
  label: string;
  icon: string;
  previewBg: string;
  previewAccent: string;
}

const ThemePreview: React.FC<{ 
  option: ThemeOption;
  position: { x: number; y: number } | null;
}> = ({ option, position }) => {
  if (!position) return null;

  return (
    <div 
      className="theme-preview-floating"
      style={{ 
        '--preview-bg': option.previewBg,
        '--preview-accent': option.previewAccent,
        left: `${position.x}px`,
        top: `${position.y}px`
      } as React.CSSProperties}
    >
      <div className="preview-header"></div>
      <div className="preview-content">
        <div className="preview-bar"></div>
        <div className="preview-bar"></div>
        <div className="preview-box"></div>
      </div>
    </div>
  );
};

const CustomThemeSelector: React.FC = () => {
  const { currentTheme, setCurrentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredOption, setHoveredOption] = useState<ThemeOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const isDarkMode = document.documentElement.classList.contains('dark');

  const themeOptions: ThemeOption[] = [
    { 
      value: 'classic', 
      label: 'Classic Theme',
      icon: '🎨',
      previewBg: isDarkMode ? '#1a1a1a' : '#ffffff',        // Darker background
      previewAccent: isDarkMode ? '#60a5fa' : '#007bff'     // Brighter accent in dark mode
    },
    { 
      value: 'hydro', 
      label: 'Hydro Theme',
      icon: '💧',
      previewBg: isDarkMode 
        ? 'var(--hydro-secondary)' 
        : 'var(--hydro-light)',
      previewAccent: isDarkMode 
        ? 'var(--hydro-accent)' 
        : 'var(--hydro-primary)'
    }
  ];

  useEffect(() => {
    // Smooth transition for theme changes
    const selector = dropdownRef.current;
    if (selector) {
      selector.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
    }
  }, [isDarkMode]);

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    option: ThemeOption
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPreviewPosition({
      x: rect.right + 10, // 10px offset from the dropdown
      y: rect.top
    });
    setHoveredOption(option);
  };

  const handleMouseLeave = () => {
    setPreviewPosition(null);
    setHoveredOption(null);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isOpen && event.key === 'Enter') {
      setIsOpen(true);
      setFocusedIndex(0);
      return;
    }

    if (isOpen) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev < themeOptions.length - 1 ? prev + 1 : prev
          );
          break;

        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;

        case 'Enter':
          if (focusedIndex >= 0) {
            setCurrentTheme(themeOptions[focusedIndex].value);
            setIsOpen(false);
            setFocusedIndex(-1);
          }
          break;

        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;

        case 'Tab':
          event.preventDefault(); // Prevent losing focus
          break;
      }
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      optionsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  // Click outside handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getCurrentThemeLabel = () => {
    return themeOptions.find(option => option.value === currentTheme)?.label || '';
  };

  const getCurrentThemeIcon = () => {
    return themeOptions.find(option => option.value === currentTheme)?.icon || '';
  };

  return (
    <>
      <div 
        className={`custom-theme-selector ${currentTheme}-theme ${isDarkMode ? 'dark' : 'light'}`} 
        ref={dropdownRef}
        style={{
          backgroundColor: isDarkMode 
            ? 'rgba(26, 26, 26, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          color: isDarkMode 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(0, 0, 0, 0.8)',
          borderColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          boxShadow: isDarkMode
            ? '0 4px 6px rgba(0, 0, 0, 0.3)'
            : '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        <div 
          className={`selected-theme ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Select theme"
          style={{
            backgroundColor: isDarkMode 
              ? 'rgba(40, 40, 40, 0.95)' 
              : 'rgba(250, 250, 250, 0.95)',
            transition: 'all 0.3s ease'
          }}
        >
          <span className="theme-icon">{getCurrentThemeIcon()}</span>
          <span className="theme-label">{getCurrentThemeLabel()}</span>
          <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▼</span>
        </div>

        <div 
          className={`theme-options ${isOpen ? 'show' : ''}`}
          role="listbox"
          style={{
            backgroundColor: isDarkMode 
              ? 'rgba(30, 30, 30, 0.98)' 
              : 'rgba(255, 255, 255, 0.98)',
            transition: 'all 0.3s ease'
          }}
        >
          {themeOptions.map((option, index) => (
            <div
              key={option.value}
              ref={el => optionsRef.current[index] = el}
              className={`theme-option ${currentTheme === option.value ? 'active' : ''} ${focusedIndex === index ? 'focused' : ''}`}
              onClick={() => {
                setCurrentTheme(option.value);
                setIsOpen(false);
                setFocusedIndex(-1);
              }}
              onMouseEnter={(e) => handleMouseEnter(e, option)}
              onMouseLeave={handleMouseLeave}
              role="option"
              aria-selected={currentTheme === option.value}
              tabIndex={isOpen ? 0 : -1}
              style={{
                transition: 'all 0.2s ease',
                backgroundColor: isDarkMode && currentTheme === option.value
                  ? 'rgba(60, 60, 60, 0.95)'
                  : undefined
              }}
            >
              <span className="theme-icon">{option.icon}</span>
              <span className="theme-label">{option.label}</span>
            </div>
          ))}
        </div>
      </div>
      {hoveredOption && (
        <ThemePreview 
          option={hoveredOption} 
          position={previewPosition} 
        />
      )}
    </>
  );
};

export default CustomThemeSelector; 