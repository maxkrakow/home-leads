import React from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';

const tiers = [
  {
    name: 'Basic',
    id: 'tier-basic',
    href: '#',
    priceMonthly: '$99',
    description: 'Perfect for service providers focusing on a single county with moderate new home sales.',
    features: [
      'Access to 1 county',
      '500-1000 new homeowners monthly',
      'Basic filtering options',
      'Email support',
      'Lead export functionality',
      'Single user account',
    ],
    mostPopular: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    href: '#',
    priceMonthly: '$249',
    description: 'Ideal for businesses serving multiple counties and needing more comprehensive data.',
    features: [
      'Access to 3 counties',
      '1500-3000 new homeowners monthly',
      'Advanced filtering options',
      'Email and phone support',
      'CRM integration',
      'Up to 5 user accounts',
      'Historical data access',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: '$499',
    description: 'For established businesses covering large regions with high-volume lead needs.',
    features: [
      'Access to 10+ counties',
      '5000+ new homeowners monthly',
      'Premium data enrichment',
      'Dedicated account manager',
      'Custom integrations',
      'Unlimited user accounts',
      'Advanced analytics and reporting',
      'API access',
    ],
    mostPopular: false,
  },
];

export default function PricingSection() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-brand-500">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            County-based subscription plans
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose the perfect plan to access new homeowner data in your target counties.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`
                flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10
                ${tier.mostPopular ? 'lg:z-10 lg:rounded-b-3xl lg:shadow-xl' : ''}
                ${tierIdx === 0 ? 'lg:rounded-r-none' : ''}
                ${tierIdx === tiers.length - 1 ? 'lg:rounded-l-none' : ''}
                ${tierIdx === 1 ? 'lg:rounded-t-3xl lg:-mt-4 lg:mb-0' : ''}
              `}
            >
              <div>
                {tier.mostPopular ? (
                  <div className="relative -mx-8 -mt-8 mb-8">
                    <div className="absolute inset-x-0 top-0 flex h-12 items-center justify-center bg-brand-500 rounded-t-3xl">
                      <span className="text-sm font-semibold text-white">Most popular</span>
                    </div>
                    <div className="pt-12"></div>
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-x-4">
                  <h3 id={tier.id} className="text-lg font-semibold leading-8 text-gray-900">
                    {tier.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.priceMonthly}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-brand-500" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={`
                  mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500
                  ${tier.mostPopular
                    ? 'bg-brand-500 text-white hover:bg-brand-400'
                    : 'text-brand-600 ring-1 ring-inset ring-brand-200 hover:ring-brand-300'
                  }
                `}
              >
                Get started
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 