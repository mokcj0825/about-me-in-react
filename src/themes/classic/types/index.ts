export interface Project {
    title: string;
    description: string;
    technologies: string[];
    githubLink?: string;
    liveLink?: string;
    image?: string;
  }
  
  export interface Skill {
    name: string;
    level: number;
    color?: string;
  }
  
  export interface Language {
    name: string;
    level: string;
    proficiency: number;
    nativeName?: string;
  }