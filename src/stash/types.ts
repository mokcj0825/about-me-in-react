export interface ChangelogEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'feature' | 'bugfix' | 'improvement' | 'refactor';
  tags?: string[];
  details?: string[];
}

export interface ChangelogSection {
  version: string;
  date: string;
  entries: ChangelogEntry[];
}

export interface Changelog {
  title: string;
  sections: ChangelogSection[];
}