import React from 'react';

interface AboutProps {
  description: string;
}

const About: React.FC<AboutProps> = ({ description }) => {
  return (
    <section className="about">
      <h2>About Me</h2>
      <p>{description}</p>
    </section>
  );
};

export default About; 