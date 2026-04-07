import Link from 'next/link';
import { useContext, useRef, useState } from 'react';
import { ConfigContext } from '../src/ConfigContext';
import StepProgress from '../components/StepProgress';
import { useRouter } from 'next/router';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';

export default function CustomerPage() {
  const { 
    customer, setCustomer, importJsonFile, resetAll,
    conversionRate, setConversionRate
  } = useContext(ConfigContext);
  const fileRef = useRef(null);
  const router = useRouter();
  const { push } = useToast();

  // Handle manual input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    // Map id to customer state keys
    const keyMap = {
      'cust-name': 'name',
      'cust-company': 'company',
      'cust-phone': 'phone',
      'cust-email': 'email',
      'cust-address': 'address',
      'cust-city': 'city',
      'cust-state': 'state',
      'cust-gst': 'gst'
    };
    const key = keyMap[id] || id;
    setCustomer((prev) => ({ ...prev, [key]: value }));
  };

  function handleReset() {
    resetAll(); // Context's resetAll already clears state and generates a NEW ref
  }

  function handleNext() {
    if (!customer.name || !customer.company || !customer.phone) {
      push({ title: 'Missing required fields', description: 'Name, Company, Phone are required', variant: 'error' });
      return;
    }
    setCustomer(prev => ({ ...prev, unlocked: true }));
    router.push('/machinetype');
  }

  return (
    <div className="min-h-screen bg-brand-light pt-24 sm:pt-28">
      {/* Navbar is global */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* <StepProgress /> */}

        <main className="mt-4 sm:mt-8 glass-card p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-5 text-brand-blue">Customer Details</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5" onSubmit={e => { e.preventDefault(); handleNext(); }}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Region <span className="text-red-600">*</span></label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="region"
                    value="DOM"
                    checked={customer.region === "DOM"}
                    onChange={(e) => setCustomer(prev => ({ ...prev, region: e.target.value }))}
                    className="w-4 h-4 text-brand-blue border-slate-300 focus:ring-brand-blue"
                  />
                  <span className="text-sm font-medium text-slate-700">Domestic (DOM)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="region"
                    value="EXP"
                    checked={customer.region === "EXP"}
                    onChange={(e) => setCustomer(prev => ({ ...prev, region: e.target.value }))}
                    className="w-4 h-4 text-brand-blue border-slate-300 focus:ring-brand-blue"
                  />
                  <span className="text-sm font-medium text-slate-700">Export (EXP)</span>
                </label>
              </div>
            </div>


            <div className="flex flex-col gap-1">
              <label htmlFor="cust-name" className="text-sm font-medium text-slate-700">Name <span className="text-red-600">*</span></label>
              <input id="cust-name" value={customer.name || ''} onChange={handleChange} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-900" placeholder="Enter client name" required />
            </div>
            {customer.isImported && (
              <div className="flex flex-col gap-1 mb-2 sm:mb-4">
                <label className="text-sm font-medium text-gray-500">Quotation Ref No. (Auto)</label>
                <input
                  type="text"
                  value={customer.quotationRef || customer.ref || ""}
                  readOnly // User cannot type here, it is automatic
                  className="w-full bg-gray-100 border border-gray-300 text-gray-700 rounded-xl px-3 py-2.5 text-sm font-mono font-bold tracking-wider cursor-not-allowed"
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label htmlFor="cust-company" className="text-sm font-medium text-slate-700">Company <span className="text-red-600">*</span></label>
              <input id="cust-company" value={customer.company || ''} onChange={handleChange} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-900" placeholder="Client company" required />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="cust-phone" className="text-sm font-medium text-slate-700">Phone <span className="text-red-600">*</span></label>
              <input id="cust-phone" value={customer.phone || ''} onChange={handleChange} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-900" placeholder="Contact number" required />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="cust-email" className="text-sm font-medium text-slate-700">Email</label>
              <input id="cust-email" type="email" value={customer.email || ''} onChange={handleChange} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-900" placeholder="name@example.com" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label htmlFor="cust-address" className="text-sm font-medium text-slate-700">Address</label>
              <textarea id="cust-address" value={customer.address || ''} onChange={handleChange} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-900 resize-none" placeholder="Full mailing address" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="cust-city" className="text-sm font-medium text-slate-700">City</label>
              <input id="cust-city" value={customer.city || ''} onChange={handleChange} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-900" placeholder="City" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="cust-state" className="text-sm font-medium text-slate-700">State / Country</label>
              <input id="cust-state" value={customer.state || ''} onChange={handleChange} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-900" placeholder="State / Country" />
            </div>
          </form>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <Button onClick={handleNext} variant="primary" size="md" className="w-full sm:w-auto justify-center">Choose Machine Type</Button>
            <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 text-slate-800 text-sm font-medium shadow-sm hover:bg-slate-300 transition w-full sm:w-auto">
              Import JSON
              <input ref={fileRef} type="file" accept="application/json" onChange={importJsonFile} className="hidden" />
            </label>
            <Button onClick={handleReset} variant="secondary" size="md" className="w-full sm:w-auto justify-center">Reset</Button>
          </div>
        </main>

        <footer className="mt-44 text-center text-xs text-slate-600 border-t border-slate-200"><br />
          <p className="mt-1"><Link href="https://adroitextrusion.com/" className="hover:text-brand-600">adroitextrusion.com</Link></p><br />
          <p>
            Unit 1: Survey 822, Village Bhumapura, Ahmedabad - Mahemdavad Road, Dist. Kheda, Gujarat - 387130, India<br />
            Unit 2: 75/A, Akshar Industrial Park, B/H. Amba Estate, Near Hathijan Circle, Vatva, GIDC. Phase - 4, Ahmedabad - 382445, India
          </p>
          <p className="mt-2">+91 8758665507 | +91 9925143048 | <a href="mailto:info@adroitextrusion.com" className="underline hover:text-brand-600">info@adroitextrusion.com</a></p>
        </footer>
      </div>
    </div>
  );
}
