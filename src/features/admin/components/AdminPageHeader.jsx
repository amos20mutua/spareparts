export default function AdminPageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">{title}</h1>
        {description ? <p className="mt-2 text-sm text-ink-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
