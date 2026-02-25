import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import ThemeToggle from '../components/ThemeToggle';

const ChatContainer = dynamic(() => import('../components/ChatContainer'), { ssr: false });

export default function Index() {
     const r = useRouter();
     const preview = process.env.NEXT_PUBLIC_CHAT_PREVIEW === '1';

     useEffect(() => {
          if (!preview) {
               r.replace('/customer');
          }
     }, [preview, r]);

     if (!preview) return null;

     return (
          <main className="h-screen flex flex-col">
               <div className="absolute top-2 right-2 z-50">
                    <ThemeToggle />
               </div>
               <div className="flex-1">
                    <ChatContainer />
               </div>
          </main>
     );
}