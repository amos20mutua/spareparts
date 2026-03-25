import { X } from 'lucide-react';
import VehicleSelector from './VehicleSelector';

export default function VehicleSelectorModal({ open, values, onChange, onClose, onSubmit }) {
  if (!open) return null;

  const stepLabel = !values.make ? 'Step 1: Select make' : !values.model ? 'Step 2: Select model' : 'Step 3: Select year';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-900/45 px-4">
      <div className="card-surface w-full max-w-xl rounded-[1.8rem] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">Select Your Vehicle</p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">{stepLabel}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-600">Choose your vehicle details to narrow down parts faster.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-700"
            aria-label="Close vehicle selector"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <VehicleSelector values={values} onChange={onChange} onSubmit={onSubmit} submitLabel="Show Parts" className="mt-5" compact />
      </div>
    </div>
  );
}
