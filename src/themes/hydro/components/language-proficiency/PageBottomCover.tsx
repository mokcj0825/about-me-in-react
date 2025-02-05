import React from "react";

const bottomCoverStyles = {
  container: {
    width: '100%',
    height: '100%',
  },
  wrapper: {
    background: (darkMode: boolean) => darkMode ? '#3a3a3a' : '#e8e8e8',
    color: (darkMode: boolean) => darkMode ? "#fff" : "#000",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box" as const,
    border: "1px solid #ccc",
    justifyContent: "center",
    borderRadius: "8px",
    position: 'relative' as const,
  },
  title: {
    textAlign: 'center' as const,
    zIndex: 10,
  },
  decorativeBox: {
    position: 'absolute' as const,
    width: '50%',
    height: '30%',
    boxSizing: 'border-box' as const,
    zIndex: 11,
    background: 'green',
  },
  innerBox: {
    position: 'absolute' as const,
    width: 'calc(50% - 10px)',
    height: 'calc(30% - 10px)',
    boxSizing: 'border-box' as const,
    zIndex: 12,
  }
};

interface PageBottomCoverProps {
  children: React.ReactNode;
  darkMode: boolean;
}

const PageBottomCover = React.forwardRef<HTMLDivElement, PageBottomCoverProps>(
  ({ children, darkMode }, ref) => {
    const backgroundColor = darkMode ? '#3a3a3a' : '#e8e8e8';

    return (
      <div ref={ref} data-density="hard" style={bottomCoverStyles.container}>
        <div style={{
          ...bottomCoverStyles.wrapper,
          background: bottomCoverStyles.wrapper.background(darkMode),
          color: bottomCoverStyles.wrapper.color(darkMode),
        }}>
          <h2 style={bottomCoverStyles.title}>{children}</h2>

          {/* Top right decorative elements */}
          <div style={{
            ...bottomCoverStyles.decorativeBox,
            top: '15px',
            right: '15px',
          }} />
          <div style={{
            ...bottomCoverStyles.innerBox,
            top: '25px',
            right: '25px',
            background: backgroundColor,
          }} />

          {/* Bottom left decorative elements */}
          <div style={{
            ...bottomCoverStyles.decorativeBox,
            bottom: '15px',
            left: '25px',
          }} />
          <div style={{
            ...bottomCoverStyles.innerBox,
            bottom: '25px',
            left: '35px',
            background: backgroundColor,
          }} />
        </div>
      </div>
    );
  }
);

export default PageBottomCover;