export function SectionHeader({ eyebrow, title, description, actions }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 18,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ maxWidth: 760 }}>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2 className="section-title" style={{ marginTop: 14, marginBottom: 10 }}>
          {title}
        </h2>
        {description ? (
          <p className="muted" style={{ fontSize: 16, lineHeight: 1.65, margin: 0 }}>
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}

export function StatCard({ label, value, helper }) {
  return (
    <div className="panel kpi-card">
      <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
        {label}
      </div>
      <div className="kpi-value">{value}</div>
      {helper ? (
        <div className="muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>
          {helper}
        </div>
      ) : null}
    </div>
  );
}

export function Pill({ children, tone = 'default' }) {
  const tones = {
    default: { background: 'rgba(15,23,42,0.06)', color: '#334155' },
    blue: { background: 'rgba(29,78,216,0.12)', color: '#1d4ed8' },
    green: { background: 'rgba(15,118,110,0.12)', color: '#0f766e' },
    red: { background: 'rgba(180,35,24,0.1)', color: '#b42318' },
  };

  return (
    <span className="badge" style={tones[tone] || tones.default}>
      {children}
    </span>
  );
}
