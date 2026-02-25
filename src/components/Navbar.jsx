import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMemo, useContext } from 'react';
import { ConfigContext } from '../ConfigContext';

export default function Navbar({ currentStep }) {
    const { customer, machineType, selected, selectedAddons } = useContext(ConfigContext);

    const steps = useMemo(() => [
        { id: 'customer', label: 'Customer', href: '/customer' },
        { id: 'machinetype', label: 'Machine Type', href: '/machinetype' },
        { id: 'selection', label: 'Selection', href: '/selection' },
        { id: 'addons', label: 'Add-ons', href: '/addons' },
        { id: 'summary', label: 'Summary', href: '/summary' },
    ], []);

    const isDetailsComplete = customer?.name && customer?.company && customer?.phone;
    const hasProgressed = machineType || selected?.length > 0 || selectedAddons?.length > 0;
    const isUnlocked = customer?.unlocked || hasProgressed;

    const visibleSteps = useMemo(() => {
        if (currentStep !== 'customer') return steps;
        if (isDetailsComplete && isUnlocked) return steps;
        return steps.filter(s => s.id === 'customer');
    }, [steps, currentStep, isDetailsComplete, isUnlocked]);

    return (
        <header className="fixed top-4 left-0 right-0 z-50 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 shadow-soft rounded-2xl px-6 py-3 flex items-center justify-between">

                    {/* Logo Section */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative overflow-hidden rounded-lg">
                                <img
                                    src="/images/logo.jpg"
                                    className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    alt="Adroit Extrusion"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-brand-blue leading-tight tracking-tight">
                                    Machine Configurator
                                </span>
                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                    Adroit Extrusion
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Pills */}
                    <nav className="hidden md:flex items-center bg-slate-100/50 p-1.5 rounded-xl border border-slate-200/50">
                        {visibleSteps.map((step) => {
                            const isActive = currentStep === step.id;
                            return (
                                <Link
                                    key={step.id}
                                    href={step.href}
                                    className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-600 hover:text-brand-blue'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 bg-brand-blue rounded-lg shadow-sm"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{step.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile Menu Button (Placeholder for now) */}
                    <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                </div>
            </div>
        </header>
    );
}
