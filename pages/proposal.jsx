import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaFilePdf, FaGlobe, FaYoutube, FaBookOpen, FaChevronRight, FaStar } from 'react-icons/fa';

const AdroitProposalLanding = () => {
  const router = useRouter();
  const { pdf, name } = router.query;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  const customerName = (name || 'Valued Customer').toUpperCase();

  const buttons = [
    {
      id: 'budgetary-offer',
      title: 'Budgetary Offer',
      subtitle: 'View your customized machine proposal',
      icon: <FaFilePdf />,
      color: 'bg-red-600',
      action: () => window.open(pdf, '_blank'),
      featured: true
    },
    {
      id: 'product-catalogue',
      title: 'Full Product Catalogue',
      subtitle: 'Technical specifications & machine range',
      icon: <FaBookOpen />,
      color: 'bg-slate-900',
      action: () => window.open('/catalogue/AE New Catalogue.pdf', '_blank'),
    },
    {
      id: 'official-website',
      title: 'Official Website',
      subtitle: 'Explore adroitextrusion.com',
      icon: <FaGlobe />,
      color: 'bg-slate-900',
      action: () => window.open('https://adroitextrusion.com', '_blank'),
    },
    {
      id: 'youtube-channel',
      title: 'Watch Machinery in Action',
      subtitle: 'Our official YouTube demonstrations',
      icon: <FaYoutube />,
      color: 'bg-slate-900',
      action: () => window.open('https://www.youtube.com/@adroitextrusion8326', '_blank'),
    }
  ];

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-red-500/30 overflow-x-hidden relative font-sans">
      <Head>
        <title>Adroit Extrusion | Proposal Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-red-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 py-10 flex flex-col min-h-screen">

        {/* Logo Section */}
        <div className="flex justify-center mb-12 animate-fade-in">
          <img
            src="/images/logo.jpg"
            alt="Adroit Extrusion"
            className="h-12 w-auto object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Hero Text */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold tracking-widest uppercase mb-6 shadow-sm">
            <FaStar className="animate-pulse" /> Digital Proposal Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            WELCOME,<br />
            <span className="text-red-600">
              {customerName}
            </span>
          </h1>
          <p className="text-slate-500 text-[13px] font-medium px-4 leading-relaxed max-w-[320px] mx-auto">
            Access your personalized machine proposal and official Adroit Extrusion resources.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex-1 space-y-4">
          {buttons.map((btn, index) => (
            <button
              key={btn.id}
              onClick={btn.action}
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
              className={`w-full group relative overflow-hidden rounded-2xl flex items-center p-5 gap-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-slide-up border shadow-sm hover:shadow-md ${btn.featured
                ? 'bg-red-600 border-red-700 text-white hover:bg-red-700'
                : 'bg-white border-slate-200 text-slate-900 hover:border-red-200 hover:bg-red-50/30'
                }`}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors duration-300 ${btn.featured ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-red-100 group-hover:text-red-600'
                }`}>
                {btn.icon}
              </div>

              <div className="text-left flex-1 min-w-0">
                <h3 className={`font-bold tracking-tight truncate ${btn.featured ? 'text-lg' : 'text-base'}`}>
                  {btn.title}
                </h3>
                <p className={`text-[11px] font-medium leading-tight mt-0.5 ${btn.featured ? 'text-white/70' : 'text-slate-400'}`}>
                  {btn.subtitle}
                </p>
              </div>

              <div className={`transition-transform duration-300 transform group-hover:translate-x-1 ${btn.featured ? 'text-white/50' : 'text-slate-300 group-hover:text-red-400'}`}>
                <FaChevronRight />
              </div>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
          <div className="h-px w-16 bg-slate-200 mx-auto mb-6" />
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-2">
            Adroit Extrusion
          </p>
          <p className="text-slate-400 text-[9px] font-medium">
            © {new Date().getFullYear()} ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }
        body {
          background-color: #f8fafc;
          margin: 0;
          -webkit-tap-highlight-color: transparent;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default AdroitProposalLanding;
