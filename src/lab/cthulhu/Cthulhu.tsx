import React, { useState, useEffect } from 'react';
import './Cthulhu.css';

interface ChapterList {
  id: string;
  title: string;
  file: string;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
}

const Cthulhu: React.FC = () => {
  const [chapterList, setChapterList] = useState<ChapterList[]>([]);
  const [chapters, setChapters] = useState<Record<string, Chapter>>({});
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Load chapter list
  useEffect(() => {
    const loadChapterList = async () => {
      try {
        const response = await fetch('/cthulhu/chapter-list.json');
        const data: ChapterList[] = await response.json();
        setChapterList(data);
        if (data.length > 0) {
          setSelectedChapter(data[0].id);
        }
      } catch (error) {
        console.error('Failed to load chapter list:', error);
      }
    };

    loadChapterList();
  }, []);

  // Load chapter content when list is loaded
  useEffect(() => {
    const loadChapters = async () => {
      if (chapterList.length === 0) return;

      try {
        const chapterPromises = chapterList.map(async (chapterInfo) => {
          const response = await fetch(`/cthulhu/${chapterInfo.file}`);
          const chapterData: Chapter = await response.json();
          return { id: chapterInfo.id, chapter: chapterData };
        });

        const loadedChapters = await Promise.all(chapterPromises);
        const chaptersMap: Record<string, Chapter> = {};
        loadedChapters.forEach(({ id, chapter }) => {
          chaptersMap[id] = chapter;
        });
        setChapters(chaptersMap);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load chapters:', error);
        setLoading(false);
      }
    };

    loadChapters();
  }, [chapterList]);

  const currentChapter = selectedChapter ? chapters[selectedChapter] : null;

  if (loading) {
    return (
      <div className="cthulhu-container">
        <div className="loading-message">加载中...</div>
      </div>
    );
  }

  return (
    <div className="cthulhu-container">
      <div className="cthulhu-layout">
        {/* Left sidebar - Chapter list */}
        <div className="cthulhu-sidebar">
          <div className="sidebar-header">
            <h3>章节列表</h3>
          </div>
          <div className="chapter-list">
            {chapterList.map(chapterInfo => (
              <div
                key={chapterInfo.id}
                className={`chapter-item ${selectedChapter === chapterInfo.id ? 'active' : ''}`}
                onClick={() => setSelectedChapter(chapterInfo.id)}
              >
                {chapterInfo.title}
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="cthulhu-content">
          <div className="content-header">
            <h2>{currentChapter?.title}</h2>
          </div>
          <div className="content-body">
            <div className="content-text">
              {currentChapter?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cthulhu;

