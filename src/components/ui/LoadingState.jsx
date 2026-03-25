export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="card-surface flex min-h-48 flex-col items-center justify-center gap-3 p-8 text-sm font-medium text-ink-500">
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-ink-200 border-t-brand-600" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
