import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaMoon, FaSun } from 'react-icons/fa';
import { Project, Skill, Language } from './types';
import './styles/classic.css';
import ThemeToggle from './components/ThemeToggle';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Languages from './components/Languages';
import Contact from './components/Contact';

const ClassicTheme: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const aboutDescription = 
    "A passionate software developer with experience in web development, " +
    "focusing on creating efficient and user-friendly applications.";

  const skills: Skill[] = [
    { name: "React", level: 90, color: "#61DAFB" },
    { name: "TypeScript", level: 85, color: "#3178C6" },
    { name: "Node.js", level: 80, color: "#339933" },
    { name: "Python", level: 75, color: "#3776AB" },
    { name: "SQL", level: 70, color: "#4479A1" },
    { name: "AWS", level: 65, color: "#FF9900" },
  ];

  const projects: Project[] = [
    {
      title: "Project 1",
      description: "A brief description of your project. What problems did it solve? What technologies did you use?",
      technologies: ["React", "TypeScript", "Node.js"],
      githubLink: "https://github.com/yourusername/project1",
      liveLink: "https://project1.com",
      image: "https://via.placeholder.com/300x200"
    },
    {
      title: "Project 2",
      description: "Another awesome project description. Highlight your role and the impact.",
      technologies: ["Python", "Django", "PostgreSQL"],
      githubLink: "https://github.com/yourusername/project2",
      image: "https://via.placeholder.com/300x200"
    },
  ];

  const languages: Language[] = [
    { 
      name: "English", 
      level: "Professional",
      proficiency: 90,
      nativeName: "English"
    },
    { 
      name: "Japanese", 
      level: "Business",
      proficiency: 75,
      nativeName: "日本語"
    },
    { 
      name: "Korean", 
      level: "Conversational",
      proficiency: 60,
      nativeName: "한국어"
    },
  ];

  const contactInfo = {
    email: "mokcjmok@gmail.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com/mokcj0825"
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="container">
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <Header name="Cj Mok" title="Software Developer" />
      <About description={aboutDescription} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Languages languages={languages} />
      <Contact contactInfo={contactInfo} />
    </div>
  );
};

export default ClassicTheme;
