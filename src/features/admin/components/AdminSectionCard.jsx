export default function AdminSectionCard({ title, description, children, className = '' }) {
  return (
    <section className={`card-surface rounded-3xl p-5 sm:p-6 ${className}`.trim()}>
      <div className="max-w-2xl">
        <h2 className="text-xl font-extrabold tracking-tight text-ink-900">{title}</h2>
        {description ? <p className="mt-2 text-sm text-ink-600">{description}</p> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
