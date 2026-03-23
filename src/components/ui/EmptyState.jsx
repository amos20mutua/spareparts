export default function EmptyState({ title, description, action }) {
  return (
    <div className="card-surface rounded-3xl border-dashed p-8 text-center">
      <h3 className="text-lg font-bold text-ink-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
