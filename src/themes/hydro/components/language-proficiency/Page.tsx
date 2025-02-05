import React from "react";

const pageStyles = {
  wrapper: {
    background: (darkMode: boolean) => darkMode ? "#2a2a2a" : "#ffffff",
    color: (darkMode: boolean) => darkMode ? "#fff" : "#000",
    width: "100%",
    height: "100%",
    padding: "20px",
    boxSizing: "border-box" as const,
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    willChange: "transform",
  },
  content: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
};

interface PageProps {
  children: React.ReactNode;
  darkMode: boolean;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(({ children, darkMode }, ref) => (
  <div ref={ref}>
    <div
      className="page"
      style={{
        ...pageStyles.wrapper,
        background: pageStyles.wrapper.background(darkMode),
        color: pageStyles.wrapper.color(darkMode),
      }}
    >
      <div style={pageStyles.content}>
        {children}
      </div>
    </div>
  </div>
));

export default Page;