import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './App.css'; // You'll need to create this file for styling

const App: React.FC = () => {
  return (
    <div className="container">
      <header>
        <h1>CJ Mok</h1>
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
        <ul>
          <li>React / TypeScript</li>
          <li>JavaScript / HTML / CSS</li>
          <li>Node.js</li>
          <li>Git</li>
        </ul>
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