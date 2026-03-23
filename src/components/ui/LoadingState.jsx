export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="card-surface flex min-h-48 items-center justify-center p-8 text-sm font-medium text-ink-500">
      {label}
    </div>
  );
}
