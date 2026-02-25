import '../styles/globals.css';
import { ConfigProvider } from '../src/ConfigContext';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastProvider } from '../components/ui/Toast';
import Navbar from '../src/components/Navbar';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
	const router = useRouter();

	// Determine current step for Navbar
	const path = router.pathname.replace('/', '');
	const showNavbar = ['customer', 'machinetype', 'selection', 'addons', 'summary'].includes(path);

	return (
		<ToastProvider>
			<ConfigProvider>
				{showNavbar && <Navbar currentStep={path} />}
				<Component {...pageProps} />
			</ConfigProvider>
		</ToastProvider>
	);
}