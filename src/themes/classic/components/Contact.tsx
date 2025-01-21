import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
}

interface ContactProps {
  contactInfo: ContactInfo;
}

const Contact: React.FC<ContactProps> = ({ contactInfo }) => {
  return (
    <section className="contact">
      <h2>Contact</h2>
      <div className="social-links">
        <a href={`mailto:${contactInfo.email}`} className="social-link">
          <FaEnvelope /> {contactInfo.email}
        </a>
        <a 
          href={contactInfo.linkedin} 
          className="social-link"
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaLinkedin /> LinkedIn Profile
        </a>
        <a 
          href={contactInfo.github} 
          className="social-link"
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaGithub /> GitHub Profile
        </a>
      </div>
    </section>
  );
};

export default Contact; 