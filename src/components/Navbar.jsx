import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useContext, useState, useEffect } from 'react';
import { ConfigContext } from '../ConfigContext';
import { useRouter } from 'next/router';

export default function Navbar({ currentStep }) {
    const { customer, machineType, selected, selectedAddons } = useContext(ConfigContext);
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

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

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [router.pathname]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const stepIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <>
            <header className="fixed top-4 left-0 right-0 z-50 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 shadow-soft rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">

                        {/* Logo Section */}
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                                <div className="relative overflow-hidden rounded-lg">
                                    <img
                                        src="/images/logo.jpg"
                                        className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                        alt="Adroit Extrusion"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm sm:text-lg font-bold text-brand-blue leading-tight tracking-tight">
                                        Machine Configurator
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Adroit Extrusion
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation Pills */}
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

                        {/* Mobile: Step indicator + Hamburger */}
                        <div className="flex md:hidden items-center gap-2">
                            {/* Current step pill */}
                            <span className="text-xs font-semibold text-brand-blue bg-blue-50 border border-brand-blue/20 px-2.5 py-1 rounded-full">
                                {stepIndex + 1}/{steps.length} {visibleSteps.find(s => s.id === currentStep)?.label || ''}
                            </span>
                            {/* Hamburger */}
                            <button
                                onClick={() => setMenuOpen(prev => !prev)}
                                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {menuOpen
                                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    }
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMenuOpen(false)}
                        />

                        {/* Drawer panel */}
                        <motion.div
                            key="drawer"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: 'spring', bounce: 0.1, duration: 0.35 }}
                            className="fixed top-[80px] left-4 right-4 z-50 md:hidden bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                        >
                            {/* Progress bar */}
                            <div className="h-1 bg-slate-100">
                                <div
                                    className="h-full bg-brand-blue transition-all duration-500"
                                    style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                                />
                            </div>

                            <div className="p-3 space-y-1">
                                {visibleSteps.map((step, i) => {
                                    const isActive = currentStep === step.id;
                                    const isDone = steps.findIndex(s => s.id === step.id) < stepIndex;
                                    return (
                                        <Link
                                            key={step.id}
                                            href={step.href}
                                            onClick={() => setMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-brand-blue text-white shadow-sm'
                                                    : isDone
                                                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {/* Step number badge */}
                                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                                                isActive
                                                    ? 'bg-white/20 text-white'
                                                    : isDone
                                                        ? 'bg-emerald-200 text-emerald-700'
                                                        : 'bg-slate-200 text-slate-500'
                                            }`}>
                                                {isDone ? '✓' : steps.findIndex(s => s.id === step.id) + 1}
                                            </span>
                                            {step.label}
                                            {isActive && (
                                                <span className="ml-auto text-xs opacity-70">Current</span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Customer info strip */}
                            {customer?.name && (
                                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                    <span className="text-xs text-slate-500 truncate">
                                        {customer.company || customer.name}
                                        {customer.machineModel ? ` · ${customer.machineModel}` : ''}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
