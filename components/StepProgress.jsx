import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const steps = [
  { key: 'customer', label: 'Customer', href: '/customer' },
  { key: 'selection', label: 'Selection', href: '/selection' },
  { key: 'addons', label: 'Add-ons', href: '/addons' },
  { key: 'summary', label: 'Summary', href: '/summary' },
];

export default function StepProgress() {
  const router = useRouter();
  const path = router.pathname.replace('/', '') || 'customer';
  const currentIndex = steps.findIndex(s => s.key === path);

  return (
    <div className="w-full mb-4">
      <div className="flex items-center gap-3">
        {steps.map((s, idx) => {
          const done = idx < currentIndex;
          const active = idx === currentIndex;
          return (
            <React.Fragment key={s.key}>
              <Link href={s.href} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                active
                  ? 'bg-brand-600 text-white'
                  : done
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
              }`}>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20">{idx+1}</span>
                <span>{s.label}</span>
              </Link>
              {idx < steps.length - 1 && (
                <div className={`h-1 flex-1 rounded-full ${idx < currentIndex ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
