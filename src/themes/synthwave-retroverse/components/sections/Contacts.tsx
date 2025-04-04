import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { SYNTHWAVE_RETROVERSE_FONTS } from '../../fonts';
import { SectionProps, StyledSectionProps, getSectionColors } from './SectionProps';

const scanline = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

const glitch = keyframes`
  0% {
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
    transform: translate(0);
  }
  20% {
    clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
    transform: translate(-5px);
  }
  30% {
    clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
    transform: translate(5px);
  }
  40% {
    clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
    transform: translate(-5px);
  }
  50% {
    clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
    transform: translate(0);
  }
  55% {
    clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
    transform: translate(5px);
  }
  60% {
    clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
    transform: translate(-5px);
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transform: translate(0);
  }
`;

const Container = styled.div<StyledSectionProps>`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
  color: ${({ darkMode }) => getSectionColors(darkMode).text};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      transparent 50%,
      rgba(0, 0, 0, 0.1) 51%,
      transparent 52%
    );
    background-size: 100% 4px;
    animation: ${scanline} 4s linear infinite;
    pointer-events: none;
    opacity: 0.1;
  }
`;

const Title = styled.h2<StyledSectionProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.header.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.xlarge};
  color: ${({ darkMode }) => getSectionColors(darkMode).accent};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: ${({ darkMode }) => `0 0 10px ${getSectionColors(darkMode).accent}`};
  position: relative;

  &::before {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    animation: ${glitch} 3s infinite;
    color: #2979ff;
    opacity: 0.8;
  }
`;

const Description = styled.div<StyledSectionProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.body.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.large};
  color: ${({ darkMode }) => getSectionColors(darkMode).text};
  text-align: center;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactCard = styled.a<StyledSectionProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: ${({ darkMode }) => 
    darkMode ? 'rgba(41, 121, 255, 0.1)' : 'rgba(41, 121, 255, 0.05)'
  };
  border: 1px solid ${({ darkMode }) => getSectionColors(darkMode).secondary};
  border-radius: 8px;
  text-decoration: none;
  color: ${({ darkMode }) => getSectionColors(darkMode).text};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(41, 121, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: #2979ff;
    box-shadow: 0 0 30px rgba(41, 121, 255, 0.4);

    &:before {
      left: 100%;
    }
  }
`;

const ContactIcon = styled.div<StyledSectionProps>`
  font-size: 3rem;
  color: ${({ darkMode }) => getSectionColors(darkMode).accent};
  margin-bottom: 1rem;
  text-shadow: 0 0 10px ${({ darkMode }) => getSectionColors(darkMode).accent};
`;

const ContactTitle = styled.h3<StyledSectionProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.header.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.large};
  color: ${({ darkMode }) => getSectionColors(darkMode).accent};
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ContactDescription = styled.p<StyledSectionProps>`
  font-family: ${SYNTHWAVE_RETROVERSE_FONTS.body.family};
  font-size: ${SYNTHWAVE_RETROVERSE_FONTS.size.normal};
  color: ${({ darkMode }) => getSectionColors(darkMode).text};
  margin: 0;
  text-align: center;
  opacity: 0.8;
`;

const contacts = [
  {
    icon: '📧',
    title: 'Email',
    description: 'Send me an email',
    url: 'mailto:mokcjmok@gmail.com'
  },
  {
    icon: '🌟',
    title: 'GitHub',
    description: 'Check out my GitHub',
    url: 'https://github.com/mokcj0825'
  },
  {
    icon: '💼',
    title: 'LinkedIn',
    description: 'Connect on LinkedIn',
    url: 'https://linkedin.com/in/cj-mok-52907642'
  }
];

const Contacts: React.FC<SectionProps> = ({ darkMode }) => {
  const [displayText, setDisplayText] = useState('Get in touch');

  return (
    <Container darkMode={darkMode}>
      <Title darkMode={darkMode} data-text="Contacts">Contacts</Title>
      <Description darkMode={darkMode}>{displayText}</Description>
      <ContactGrid>
        {contacts.map((contact) => (
          <ContactCard
            key={contact.title}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            darkMode={darkMode}
            onMouseEnter={() => setDisplayText(contact.description)}
            onMouseLeave={() => setDisplayText('Get in touch')}
          >
            <ContactIcon darkMode={darkMode}>{contact.icon}</ContactIcon>
            <ContactTitle darkMode={darkMode}>{contact.title}</ContactTitle>
            <ContactDescription darkMode={darkMode}>{contact.description}</ContactDescription>
          </ContactCard>
        ))}
      </ContactGrid>
    </Container>
  );
};

export default Contacts; 