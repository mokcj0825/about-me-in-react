import React from "react";
import HTMLFlipBook from "react-pageflip";
import languageProficiency from "../../../../data/language-proficiency.json";
import PageCover from "./PageCover";
import PageBottomCover from "./PageBottomCover";
import EmptyPage from "./EmptyPage";
import Page from "./Page";

interface BookProps {
  darkMode: boolean;
}

const Book: React.FC<BookProps> = ({ darkMode }) => {
  // @ts-ignore
  return (<HTMLFlipBook
      width={400}
      height={550}
      minWidth={200}
      maxWidth={500}
      minHeight={150}
      maxHeight={550}
      showCover={true}
      flippingTime={600}
      style={{}}
      maxShadowOpacity={darkMode ? 0.5 : 0.3}
      size="stretch"
      className="page-flipbook"
      disableFlipByClick={true}
    >
      <PageCover darkMode={darkMode} />
      <EmptyPage darkMode={darkMode} />
      {languageProficiency.map((lang, index) => (
        <Page key={index} darkMode={darkMode}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: "2rem"
          }}>
            <h3 style={{
              textAlign: "center",
              background: darkMode ? "#2a2a2a" : "#ffffff",
              marginBottom: "1.5rem"
            }}>{lang.language}</h3>

            <p style={{
              textAlign: "center",
              height: 'auto',
              maxWidth: "80%"
            }}>{lang.description}</p>
          </div>
        </Page>
      ))}
      <PageBottomCover darkMode={darkMode}>Fin.</PageBottomCover>
    </HTMLFlipBook>
  );
};

export default Book;
