export default function PageShell({ title, description }) {
  return (
    <main style={{ padding: '48px 24px', maxWidth: 960, margin: '0 auto' }}>
      <section style={{ border: '1px solid #e5e7eb', borderRadius: 16, padding: 32, background: '#fff' }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.1 }}>{title}</h1>
        <p style={{ marginTop: 16, marginBottom: 0, fontSize: 18, color: '#4b5563' }}>{description}</p>
      </section>
    </main>
  );
}