import { getVehicleModels, getVehicleYears, vehicleMakes } from '@/data/vehicles';
import Button from '@/components/ui/Button';

export default function VehicleSelector({
  values,
  onChange,
  onSubmit,
  submitLabel = 'Search',
  className = '',
  compact = false,
}) {
  const models = getVehicleModels(values.make);
  const years = getVehicleYears(values.make, values.model);

  return (
    <div className={className}>
      <div className={`grid gap-3 ${compact ? 'md:grid-cols-[1fr,1fr,0.9fr,auto]' : 'lg:grid-cols-[1fr,1fr,0.9fr,auto]'}`}>
        <select className="input-base" value={values.make} onChange={(e) => onChange('make', e.target.value)}>
          <option value="">Make</option>
          {vehicleMakes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
        <select
          className="input-base"
          value={values.model}
          onChange={(e) => onChange('model', e.target.value)}
          disabled={!values.make}
        >
          <option value="">Model</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        <select
          className="input-base"
          value={values.year}
          onChange={(e) => onChange('year', e.target.value)}
          disabled={!values.model}
        >
          <option value="">Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <Button className="w-full md:w-auto" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
