import "./globals.css";

export const metadata = {
  title: "Dots & Boxes - Modern Game",
  description:
    "A beautiful, modern implementation of the classic Dots & Boxes game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-white">
        <div className="stars-container">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
        </div>
        <header className="site-header">
          <div className="site-header__dots">
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
          </div>
          <h1 className="site-header__title">
            <span className="site-header__title-dots">·</span>
            Dots &amp; Boxes
            <span className="site-header__title-dots">·</span>
          </h1>
          <p className="site-header__subtitle">Connect the dots. Claim the boxes. Rule the grid.</p>
        </header>
        <main className="min-h-screen flex items-center justify-center py-10 px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
