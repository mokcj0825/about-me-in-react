import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaMoon, FaSun } from 'react-icons/fa';
import './App.css'; // You'll need to create this file for styling

interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
  image?: string;
}

interface Skill {
  name: string;
  level: number; // 0 to 100
  color?: string;
}

interface Language {
  name: string;
  level: string;
  proficiency: number; // 0 to 100
  nativeName?: string; // Optional native name of the language
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user previously selected dark mode
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

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
    // Add more projects as needed
  ];

  const skills: Skill[] = [
    { name: "React", level: 90, color: "#61DAFB" },
    { name: "TypeScript", level: 85, color: "#3178C6" },
    { name: "Node.js", level: 80, color: "#339933" },
    { name: "Python", level: 75, color: "#3776AB" },
    { name: "SQL", level: 70, color: "#4479A1" },
    { name: "AWS", level: 65, color: "#FF9900" },
    // Add more skills as needed
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
    // Add more languages as needed
  ];

  useEffect(() => {
    // Update body class and save preference
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="container">
      <button 
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle theme"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <header>
        <h1>Cj Mok</h1>
        <p className="title">Software Developer</p>
      </header>

      <section className="about">
        <h2>About Me</h2>
        <p>
          A passionate software developer with experience in web development,
          focusing on creating efficient(?) and user-friendly applications.
        </p>
      </section>

      <section className="skills">
        <h2>Skills</h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div className="skill-item" key={index}>
              <div className="skill-info">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percentage">{skill.level}%</span>
              </div>
              <div className="skill-bar-bg">
                <div 
                  className="skill-bar-fill"
                  style={{
                    '--fill-width': `${skill.level}%`,
                    backgroundColor: skill.color
                  } as React.CSSProperties}
                >
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="languages">
        <h2>Languages</h2>
        <div className="skills-grid">
          {languages.map((language, index) => (
            <div className="skill-item" key={index}>
              <div className="skill-info">
                <div className="language-name">
                  <span>{language.name}</span>
                  {language.nativeName && (
                    <span className="native-name">({language.nativeName})</span>
                  )}
                </div>
                <span className="skill-level">{language.level}</span>
              </div>
              <div className="skill-bar-bg">
                <div 
                  className="skill-bar-fill language-bar"
                  style={{
                    '--fill-width': `${language.proficiency}%`
                  } as React.CSSProperties}
                >
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="experience">
        <h2>Experience</h2>
        <div className="job">
          <h3>Software Developer - Company Name</h3>
          <p className="date">2020 - Present</p>
          <ul>
            <li>Developed and maintained web applications using React</li>
            <li>Collaborated with cross-functional teams to deliver projects</li>
            <li>Implemented responsive designs and improved user experience</li>
          </ul>
        </div>
      </section>

      <section className="projects">
        <h2>Projects</h2>
        <div className="project-grid">
          {projects.map((project, index) => (
            <div className="project-card" key={index}>
              {project.image && (
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
              )}
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <FaGithub /> Code
                    </a>
                  )}
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                      🔗 Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact">
        <h2>Contact</h2>
        <div className="social-links">
          <a href="mailto:mokcjmok@gmail.com" className="social-link">
            <FaEnvelope /> mokcjmok@gmail.com
          </a>
          <a href="https://linkedin.com/in/yourprofile" className="social-link">
            <FaLinkedin /> LinkedIn Profile
          </a>
          <a href="https://github.com/mokcj0825" className="social-link">
            <FaGithub /> GitHub Profile
          </a>
        </div>
      </section>
    </div>
  );
};

export default App;