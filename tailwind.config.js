/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				brand: {
					light: '#F8FAFC', // Professional white-blue background
					blue: '#1E40AF',  // Corporate Blue
					dark: '#1E3A8A',  // Deep Blue accents
					emerald: '#10B981', // Success/Price color
					// Additional shades for flexibility
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e3a8a',
					900: '#1e3a8a'
				},
				accent: {
					500: '#6366f1',
					600: '#4f46e5'
				},
				grayn: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a'
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'], // Modern clean typography
			},
		},
	},
	plugins: [],
};