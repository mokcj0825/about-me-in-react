import React from 'react';

interface HeaderProps {
  name: string;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ name, title }) => {
  return (
    <header>
      <h1>{name}</h1>
      <p className="title">{title}</p>
    </header>
  );
};

export default Header; 