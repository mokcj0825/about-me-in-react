import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ThemeType } from '../../ThemeType';
import { SYNTHWAVE_RETROVERSE_THEMES } from '../colors';
import { SYNTHWAVE_RETROVERSE_FONTS, loadSynthwaveRetroverseFont } from '../fonts';
import SynthwaveRetroverseSelector from './SynthwaveRetroverseSelector';
import SynthwaveRetroverseDarkModeToggle from './SynthwaveRetroverseDarkModeToggle';
import Header from './Header';
import ContentHolders from './ContentHolders';

interface SynthwaveRetroverseContainerProps {
  darkMode: boolean;
  onDarkModeToggle: (isDark: boolean) => void;
  onThemeChange: (theme: ThemeType) => void;
}

interface StyledProps {
  darkMode: boolean;
}

const Container = styled.div<StyledProps>`
  min-height: 100vh;
  background: ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.background 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.background};
  color: ${({ darkMode }) => darkMode 
    ? SYNTHWAVE_RETROVERSE_THEMES.DARK.text 
    : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.text};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ darkMode }) => darkMode 
      ? SYNTHWAVE_RETROVERSE_THEMES.DARK.gradients.primary 
      : SYNTHWAVE_RETROVERSE_THEMES.LIGHT.gradients.primary};
    opacity: 0.5;
    z-index: 0;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.body.family};
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ControlsArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: absolute;
  top: 2rem;
  left: 2rem;
  right: 2rem;
  z-index: 3;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SynthwaveRetroverseContainer: React.FC<SynthwaveRetroverseContainerProps> = ({
  darkMode,
  onDarkModeToggle,
  onThemeChange
}) => {
  useEffect(() => {
    loadSynthwaveRetroverseFont();
  }, []);

  return (
    <Container darkMode={darkMode}>
      <Content>
        <ControlsArea>
          <SynthwaveRetroverseSelector
            currentTheme="synthwave-retroverse"
            onThemeChange={onThemeChange}
            darkMode={darkMode}
          />
          <SynthwaveRetroverseDarkModeToggle
            darkMode={darkMode}
            onDarkModeToggle={onDarkModeToggle}
          />
        </ControlsArea>
        <MainContent>
          <Header darkMode={darkMode} />
          <ContentHolders darkMode={darkMode} />
        </MainContent>
      </Content>
    </Container>
  );
};

export default SynthwaveRetroverseContainer; 