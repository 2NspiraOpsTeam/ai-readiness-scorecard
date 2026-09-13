import './globals.css';

export const metadata = {
  title: 'AI Readiness Scorecard',
  description:
    'Executive-facing assessment tool for evaluating organizational readiness for responsible, strategic AI adoption.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a className="site-logo-link" href="https://2nspira.com/" aria-label="Return to the 2Nspira home page">
            <img
              className="site-logo"
              src="/2nspira-logo-with-tagline.png"
              alt="2Nspira — Inspiration. Innovation. Impact."
              width="320"
              height="132"
            />
          </a>
        </header>
        {children}
      </body>
    </html>
  );
}
