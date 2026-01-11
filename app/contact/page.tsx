import pageData from "@templates/template-boilerplate/data/pages/contact.json";
import { renderSections } from "@templates/template-boilerplate/lib/renderSections";
import { Section } from "@templates/template-boilerplate/types/sections";
import { isBuildMode } from "@templates/template-boilerplate/lib/buildMode";
import ContactPageClient from "../_client/ContactPage";
import HeroSection from "../_components/sections/HeroSection";
import AboutSection from "../_components/sections/AboutSection";
import FormSection from "../_components/sections/FormSection";
import YoutubeSection from "../_components/sections/YoutubeSection";
import CmsPostsSection from "../_components/sections/CmsPostsSection";
import GallerySection from "../_components/sections/GallerySection";
import ContactSection from "../_components/sections/ContactSection";
import TextSection from "../_components/sections/TextSection";
import ProductsSection from "../_components/sections/ProductsSection";
import ProductCategoriesSection from "../_components/sections/ProductCategoriesSection";
import CarouselSection from "../_components/sections/CarouselSection";
import LastViewedProductsSection from "../_components/sections/LastViewedProductsSection";
import BannerSection from "../_components/sections/BannerSection";
import ToursSection from "../_components/sections/ToursSection";

export const metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function ContactPage() {
  if (isBuildMode()) {
    return <ContactPageClient />;
  }

  const sectionComponents = {
    hero: HeroSection,
    imageText: AboutSection,
    form: FormSection,
    tours: ToursSection,
    youtube: YoutubeSection,
    cmsPosts: CmsPostsSection,
    gallery: GallerySection,
    contact: ContactSection,
    text: TextSection,
    products: ProductsSection,
    productCategories: ProductCategoriesSection,
    carousel: CarouselSection,
    lastViewedProducts: LastViewedProductsSection,
    banner: BannerSection,
    content: TextSection,
  };

  const renderedSections = renderSections({
    sections: pageData.pageItems as unknown as Section[],
    components: sectionComponents,
  });

  return <div className="home">{renderedSections}</div>;
}
