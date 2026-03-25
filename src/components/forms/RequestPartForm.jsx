import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { getVehicleModels, getVehicleYears, vehicleMakes } from '@/data/vehicles';

const emptyValues = {
  full_name: '',
  phone: '',
  email: '',
  vehicle_make: '',
  vehicle_model: '',
  vehicle_year: '',
  part_needed: '',
  notes: '',
};

export default function RequestPartForm({ onSubmit, loading, initialValues = {} }) {
  const [values, setValues] = useState({
    ...emptyValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState({});
  const [manualVehicle, setManualVehicle] = useState(false);

  useEffect(() => {
    setValues((current) => ({
      ...current,
      ...initialValues,
    }));
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'vehicle_make') {
      setValues((current) => ({ ...current, vehicle_make: value, vehicle_model: '', vehicle_year: '' }));
      return;
    }

    if (name === 'vehicle_model') {
      setValues((current) => ({ ...current, vehicle_model: value, vehicle_year: '' }));
      return;
    }

    setValues((current) => ({ ...current, [name]: value }));
  };

  const models = getVehicleModels(values.vehicle_make);
  const years = getVehicleYears(values.vehicle_make, values.vehicle_model);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!values.full_name.trim()) nextErrors.full_name = 'Enter your full name.';
    if (!values.phone.trim()) nextErrors.phone = 'Enter a phone number so Simon can reply.';
    if (!values.vehicle_make.trim()) nextErrors.vehicle_make = 'Enter the vehicle make.';
    if (!values.vehicle_model.trim()) nextErrors.vehicle_model = 'Enter the vehicle model.';
    if (!values.part_needed.trim()) nextErrors.part_needed = 'Tell us which part you need.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    await onSubmit(values);
    setValues({ ...emptyValues });
    setErrors({});
  };

  return (
    <form onSubmit={submit} className="card-surface rounded-3xl p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-base" htmlFor="full_name">
            Full name
          </label>
          <input id="full_name" className="input-base" name="full_name" value={values.full_name} onChange={handleChange} aria-invalid={Boolean(errors.full_name)} />
          {errors.full_name ? <p className="mt-1 text-sm text-rose-600">{errors.full_name}</p> : null}
        </div>
        <div>
          <label className="label-base" htmlFor="phone">
            Phone number
          </label>
          <input id="phone" className="input-base" name="phone" value={values.phone} onChange={handleChange} aria-invalid={Boolean(errors.phone)} />
          {errors.phone ? <p className="mt-1 text-sm text-rose-600">{errors.phone}</p> : null}
        </div>
        <div>
          <label className="label-base" htmlFor="email">
            Email
          </label>
          <input id="email" className="input-base" type="email" name="email" value={values.email} onChange={handleChange} placeholder="Optional" />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="label-base mb-0" htmlFor="vehicle_make">
              Vehicle make
            </label>
            <button type="button" className="text-xs font-semibold text-brand-700 hover:text-brand-800" onClick={() => setManualVehicle((current) => !current)}>
              {manualVehicle ? 'Use dropdowns' : 'Enter manually'}
            </button>
          </div>
          {manualVehicle ? (
            <input id="vehicle_make" className="input-base" name="vehicle_make" value={values.vehicle_make} onChange={handleChange} placeholder="e.g. Peugeot" />
          ) : (
            <select id="vehicle_make" className="input-base" name="vehicle_make" value={values.vehicle_make} onChange={handleChange}>
              <option value="">Select make</option>
              {vehicleMakes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          )}
          {errors.vehicle_make ? <p className="mt-1 text-sm text-rose-600">{errors.vehicle_make}</p> : null}
        </div>
        <div>
          <label className="label-base" htmlFor="vehicle_model">
            Vehicle model
          </label>
          {manualVehicle ? (
            <input id="vehicle_model" className="input-base" name="vehicle_model" value={values.vehicle_model} onChange={handleChange} placeholder="e.g. 308" />
          ) : (
            <select
              id="vehicle_model"
              className="input-base"
              name="vehicle_model"
              value={values.vehicle_model}
              onChange={handleChange}
              disabled={!values.vehicle_make}
            >
              <option value="">Select model</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          )}
          {errors.vehicle_model ? <p className="mt-1 text-sm text-rose-600">{errors.vehicle_model}</p> : null}
        </div>
        <div>
          <label className="label-base" htmlFor="vehicle_year">
            Year
          </label>
          {manualVehicle ? (
            <input id="vehicle_year" className="input-base" name="vehicle_year" value={values.vehicle_year} onChange={handleChange} placeholder="e.g. 2010" />
          ) : (
            <select id="vehicle_year" className="input-base" name="vehicle_year" value={values.vehicle_year} onChange={handleChange} disabled={!values.vehicle_model}>
              <option value="">Select year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-500">Can&apos;t find the exact car? Switch to manual entry and type the make, model, and year directly.</p>
      <div className="mt-5">
        <label className="label-base" htmlFor="part_needed">
          Part needed
        </label>
        <input id="part_needed" className="input-base" name="part_needed" value={values.part_needed} onChange={handleChange} placeholder="Brake pads, projector lamp, ECU, oil filter..." />
        {errors.part_needed ? <p className="mt-1 text-sm text-rose-600">{errors.part_needed}</p> : null}
      </div>
      <div className="mt-5">
        <label className="label-base" htmlFor="notes">
          Description / notes
        </label>
        <textarea
          id="notes"
          className="input-base min-h-32"
          name="notes"
          value={values.notes}
          onChange={handleChange}
          placeholder="Share trim, side, engine size, or any detail that helps confirm the right part."
        />
      </div>
      <Button type="submit" className="mt-6" disabled={loading}>
        {loading ? 'Sending...' : 'Submit request'}
      </Button>
    </form>
  );
}
