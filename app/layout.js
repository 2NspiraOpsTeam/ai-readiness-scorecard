import './globals.css';

export const metadata = {
  title: 'AI Readiness Scorecard',
  description:
    'Executive-facing assessment tool for evaluating organizational readiness for responsible, strategic AI adoption.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
