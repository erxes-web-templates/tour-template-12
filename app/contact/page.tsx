import pageData from "../../data/pages/contact.json"
import { renderSections } from "../../lib/renderSections"
import { Section } from "../../types/sections"
import { isBuildMode } from "../../lib/buildMode"
import ContactPageClient from "../_client/ContactPage"
import HeroSection from "../_components/sections/HeroSection"
import AboutSection from "../_components/sections/AboutSection"
import FormSection from "../_components/sections/FormSection"
import YoutubeSection from "../_components/sections/YoutubeSection"
import CmsPostsSection from "../_components/sections/CmsPostsSection"
import GallerySection from "../_components/sections/GallerySection"
import ContactSection from "../_components/sections/ContactSection"
import TextSection from "../_components/sections/TextSection"
import CarouselSection from "../_components/sections/CarouselSection"
import BannerSection from "../_components/sections/BannerSection"
import ToursSection from "../_components/sections/ToursSection"
import BookingFormSection from "../_components/sections/BookingFormSection"

export const metadata = {
  title: pageData.title,
  description: pageData.description,
}

export default function ContactPage() {
  if (isBuildMode()) {
    return <ContactPageClient />
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
    carousel: CarouselSection,
    banner: BannerSection,
    bookingForm: BookingFormSection,
    content: TextSection,
  }

  const renderedSections = renderSections({
    sections: pageData.pageItems as unknown as Section[],
    components: sectionComponents,
  })

  return (
    /* mt-32: Navbar-аас доош цэвэрхэн зай авна.
      bg-[#fafafa]: Дэлгэцийн арын өнгийг зөөлөн цагаан болгож, текстийг тодруулна.
    */
    <div className='contact-page-wrapper mt-32 pb-24 min-h-screen bg-[#fafafa]'>
      
      {/* Хэрэв JSON-оос HeroSection ирж байгаа бол renderedSections дотор орно. 
         Хэрэв байхгүй бол доорх Header хэсэг харагдана.
      */}
      <div className="container mx-auto px-6 mb-16 text-center">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-[#692d91] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Contact Us
         </div>
         <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
            Бидэнтэй холбогдох
         </h1>
         <p className="mt-6 text-slate-500 font-medium italic max-w-2xl mx-auto">
            Та аялалтай холбоотой асуулт, захиалга болон хамтран ажиллах хүсэлтээ доорх сувгуудаар илгээгээрэй.
         </p>
      </div>

      <div className='max-w-[1920px] mx-auto'>
        {/* Энд ContactSection, FormSection зэрэг JSON-д заагдсан бүх хэсгүүд ачаалагдана */}
        {renderedSections}
      </div>

      {/* Нэмэлт: Хэрэв таны JSON-д Map (газрын зураг) байхгүй бол 
         энд Google Maps-ийн iframe-ийг стильтэйгээр нэмж өгч болно.
      */}
      <div className="container mx-auto px-6 mt-20">
         <div className="w-full h-[450px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
            <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d171226.43160875322!2d106.7518602!3d47.89165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3d0186358c558cf7%3A0x6a0578667b935570!2sUlaanbaatar!5e0!3m2!1sen!2smn!4v1700000000000" 
               className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
               allowFullScreen 
               loading="lazy" 
            />
         </div>
      </div>
    </div>
  )
}