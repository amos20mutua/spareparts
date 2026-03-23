import SectionHeading from '@/components/ui/SectionHeading';

export default function AboutPage() {
  return (
    <div className="container-shell py-12 sm:py-16">
      <SectionHeading
        eyebrow="About Simon"
        title="Built around practical service, honest sourcing, and repeat trust"
        description="Simon Spare Parts is designed for customers who want clear answers, dependable parts, and support that feels straightforward from the first message."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="card-surface rounded-[2rem] p-6 sm:p-8">
          <p className="text-base leading-8 text-ink-700">
            Simon started the business by helping drivers and local mechanics source parts that were hard to confirm or compare. Over time, that practical approach turned into a trusted shop focused on commonly needed service items, repair parts, and vehicle components for popular makes on Kenyan roads.
          </p>
          <p className="mt-5 text-base leading-8 text-ink-700">
            The goal is simple: make it easier for customers to ask, confirm fitment, and move forward with confidence. Whether the need is urgent brake work, a service item, or a body replacement part, the team keeps the process direct and useful.
          </p>
        </div>
        <div className="grid gap-6">
          <div className="card-surface rounded-3xl p-6">
            <h3 className="text-lg font-bold text-ink-900">What Simon specializes in</h3>
            <p className="mt-3 text-sm leading-7 text-ink-600">
              Fast-moving spare parts for common Japanese models, sourcing support for harder-to-find items, and communication that helps customers decide quickly.
            </p>
          </div>
          <div className="card-surface rounded-3xl p-6">
            <h3 className="text-lg font-bold text-ink-900">Why customers keep coming back</h3>
            <p className="mt-3 text-sm leading-7 text-ink-600">
              They get a responsive contact point, realistic guidance on stock and pricing, and help matching the right part to the vehicle before committing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
