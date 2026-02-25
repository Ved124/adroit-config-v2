import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts - Inter for clean typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* SEO Meta Tags */}
        <meta name="description" content="Configure high-performance 3-layer and ABA blown film plants from India's leading manufacturer." />
        <meta name="keywords" content="blown film plants, extrusion machinery, film manufacturing, India manufacturer, ABA film, 3-layer film" />
        <meta name="author" content="Adroit Extrusion Tech Pvt. Ltd." />

        {/* Structured Data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Manufacturer",
            "name": "Adroit Extrusion Tech Pvt. Ltd.",
            "url": "https://adroitextrusion.com",
            "logo": "https://adroitextrusion.com/images/logo.jpg",
            "description": "Manufacturer of Innovative Blown Film Plants - Quality. Precision. Performance.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Ahmedabad",
              "addressRegion": "Gujarat",
              "addressCountry": "India"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-8758665507",
              "contactType": "sales",
              "email": "info@adroiteextrusion.com"
            }
          })
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
