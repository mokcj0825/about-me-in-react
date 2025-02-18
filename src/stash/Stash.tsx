import React from "react";
import { Changelog, ChangelogEntry } from "./types";
import changelog from "./changelog.json";

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    margin: '0',
    padding: '2rem 4rem', // More horizontal padding for better readability
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#333',
    backgroundColor: '#fff',
    overflow: 'auto',
    boxSizing: 'border-box' as const,
  },
  header: {
    marginBottom: '3rem',
    borderBottom: '2px solid #eee',
    padding: '1rem 0',
  },
  headerTitle: {
    fontSize: '2.5rem',
    margin: '0',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: '0.5rem 0',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '1rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.5rem',
  },
  sectionTitle: {
    margin: '0',
    fontSize: '1.8rem',
    color: '#2c3e50',
  },
  sectionDate: {
    color: '#666',
    fontSize: '1rem',
  },
  entry: {
    margin: '2rem 0',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  entryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  entryTitle: {
    margin: '0',
    fontSize: '1.4rem',
    color: '#2c3e50',
  },
  metadata: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  date: {
    color: '#666',
    fontSize: '0.9rem',
  },
  category: {
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.8rem',
    fontWeight: 500,
    backgroundColor: '#e9ecef',
  },
  categoryFeature: {
    backgroundColor: '#dcedc8',
    color: '#33691e',
  },
  categoryBugfix: {
    backgroundColor: '#ffcdd2',
    color: '#b71c1c',
  },
  categoryImprovement: {
    backgroundColor: '#bbdefb',
    color: '#0d47a1',
  },
  categoryRefactor: {
    backgroundColor: '#d1c4e9',
    color: '#4527a0',
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
    margin: '1rem 0',
  },
  tag: {
    padding: '0.2rem 0.5rem',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    fontSize: '0.8rem',
    color: '#495057',
  },
  description: {
    margin: '1rem 0',
    lineHeight: '1.6',
    color: '#444',
  },
  details: {
    margin: '1rem 0',
  },
  detailSection: {
    margin: '1rem 0',
    color: '#2c3e50',
  },
  subDetail: {
    margin: '0.5rem 0 0.5rem 1rem',
    color: '#444',
    lineHeight: '1.5',
  },
};

const ChangelogEntryComponent: React.FC<{ entry: ChangelogEntry }> = ({ entry }) => (
  <div className="changelog-entry" style={styles.entry}>
    <div className="entry-header" style={styles.entryHeader}>
      <h3 style={styles.entryTitle}>{entry.title}</h3>
      <div className="metadata" style={styles.metadata}>
        <span style={styles.date}>{entry.date}</span>
        <span style={styles.category}>{entry.category}</span>
      </div>
    </div>
    
    {entry.tags && (
      <div className="tags" style={styles.tags}>
        {entry.tags.map(tag => (
          <span key={tag} style={styles.tag}>{tag}</span>
        ))}
      </div>
    )}
    
    <p style={styles.description}>{entry.description}</p>
    
    {entry.details && (
      <div className="details" style={styles.details}>
        {entry.details.map((detail, index) => (
          detail.startsWith('-') ? (
            <div key={index} style={styles.subDetail}>
              {detail}
            </div>
          ) : (
            <div key={index} style={styles.detailSection}>
              <strong>{detail}</strong>
            </div>
          )
        ))}
      </div>
    )}
  </div>
);

const Stash: React.FC = () => {
  const data = changelog as Changelog;

  return (
    <div className="changelog-container" style={styles.container}>
      <header className="changelog-header" style={styles.header}>
        <h1 style={styles.headerTitle}>{data.title}</h1>
        <p className="header-subtitle" style={styles.headerSubtitle}>Development History and Documentation</p>
      </header>
      
      <main className="changelog-content">
        {data.sections.map(section => (
          <section key={section.version} className="changelog-section" style={styles.section}>
            <div className="section-header" style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Version {section.version}</h2>
              <span style={styles.sectionDate}>{section.date}</span>
            </div>
            {section.entries.map(entry => (
              <ChangelogEntryComponent key={entry.id} entry={entry} />
            ))}
          </section>
        ))}
      </main>
    </div>
  );
};

export default Stash;