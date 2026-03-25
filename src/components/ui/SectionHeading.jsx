export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl';

  return (
    <div className={alignment}>
      {eyebrow ? <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600 sm:text-xs">{eyebrow}</p> : null}
      <h2 className="text-[1.65rem] font-extrabold tracking-[-0.03em] text-ink-900 sm:text-[1.95rem]">{title}</h2>
      {description ? <p className="mt-3 max-w-xl text-sm leading-6 text-ink-600 sm:text-[15px]">{description}</p> : null}
    </div>
  );
}
