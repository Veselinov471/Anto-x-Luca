import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { ProductCollection } from "@/components/ProductCollection";
import { WhyItaly } from "@/components/WhyItaly";
import { ProductDetails } from "@/components/ProductDetails";
import { Lifestyle } from "@/components/Lifestyle";
import { Trust } from "@/components/Trust";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { products } from "@/data/products";
import { dualPrice } from "@/lib/pricing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tp = await getTranslations("products");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Anto x Luca",
    url: siteUrl,
    description:
      locale === "bg"
        ? "Дамски чанти, изработени в Италия. За България."
        : "Women’s handbags made in Italy. For Bulgaria.",
  };

  const productList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => {
      const { eur } = dualPrice(p.priceEur);
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: tp(`${p.id}.name`),
          description: tp(`${p.id}.shortDescription`),
          brand: { "@type": "Brand", name: "Anto x Luca" },
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: eur.toFixed(2),
            availability: "https://schema.org/PreOrder",
          },
        },
      };
    }),
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={productList} />
      <ScrollDepthTracker />
      <main>
        <Hero />
        <ProductCollection />
        <WhyItaly />
        <ProductDetails />
        <Lifestyle />
        <Trust />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
