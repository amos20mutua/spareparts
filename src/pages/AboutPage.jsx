import PageMeta from '@/components/ui/PageMeta';
import SectionHeading from '@/components/ui/SectionHeading';

const pillars = [
  {
    title: 'Practical sourcing',
    description: 'The focus stays on useful parts for common service work, repairs, and replacement jobs.',
  },
  {
    title: 'Clear communication',
    description: 'Customers get direct answers on fitment, pricing, and stock before making a decision.',
  },
  {
    title: 'Support that saves time',
    description: 'WhatsApp, phone, and request forms are built to move urgent jobs forward quickly.',
  },
];

export default function AboutPage() {
  return (
    <div className="container-shell py-12 sm:py-16">
      <PageMeta
        title="About Simon Spare Parts"
        description="Learn how Simon Spare Parts helps customers source vehicle parts with practical support and clear communication."
      />

      <SectionHeading
        eyebrow="About Simon"
        title="Built around practical service, honest sourcing, and repeat trust"
        description="Simon Spare Parts is set up for customers who want clear answers, dependable parts, and follow-up that feels useful from the first message."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="card-surface rounded-[2rem] p-6 sm:p-8">
          <p className="text-base leading-8 text-ink-700">
            Simon started the business by helping drivers and garages source parts that were hard to confirm or compare. Over time, that practical approach turned into a trusted shop for common service items, repair parts, and vehicle components for popular makes on Kenyan roads.
          </p>
          <p className="mt-5 text-base leading-8 text-ink-700">
            The goal is simple: make it easier for customers to ask, confirm fitment, and move forward with confidence. Whether the job is urgent brake work, a service item, or a body replacement part, the process stays direct and useful.
          </p>
        </div>
        <div className="grid gap-6">
          {pillars.map((item) => (
            <div key={item.title} className="card-surface rounded-3xl p-6">
              <h3 className="text-lg font-bold text-ink-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
