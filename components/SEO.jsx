import Head from 'next/head';

export default function SEO({ title, companyName = "Adroit Extrusion Tech" }) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ManufacturingBusiness",
        "name": companyName,
        "image": "https://adroiteextrusion.com/images/logo.jpg",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Ahmedabad",
            "addressRegion": "Gujarat",
            "addressCountry": "India"
        }
    };

    return (
        <Head>
            <title>{title} | {companyName}</title>
            <meta name="description" content="Innovative Blown Film Plants and High-Performance Extrusion Systems." />
            <link rel="icon" href="/favicon.png?v=2" />
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Head>
    );
}
