"use client"

import React, { useState } from "react"
import { Section } from "../../../types/sections"
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle,
  MessageSquare,
  Share2,
} from "lucide-react"
import DynamicForm from "../../../components/common/DynamicForm"
import { useMutation, useQuery } from "@apollo/client"
import { GET_FORM_DETAIL } from "../../../graphql/queries"
import { FORM_SUBMISSION } from "../../../graphql/mutations"
import useClientPortal from "@/hooks/useClientPortal"
import { useParams } from "next/navigation"

const ContactSection = ({ section }: { section: Section }) => {
  const params = useParams<{ id: string }>()
  const [formSubmitted, setFormSubmitted] = useState(false)

  const { data } = useQuery(GET_FORM_DETAIL, {
    variables: {
      id: section.config.formId,
    },
  })

  const formData = data?.formDetail || {}
  const [submitForm] = useMutation(FORM_SUBMISSION, {
    onCompleted: (data) => {
      setFormSubmitted(true)
      console.log(data)
    },
  })
  
  const { cpDetail } = useClientPortal({
    id: params.id,
  })

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header - Minimalist Style */}
        <div className="text-center mb-20 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-[1px] w-8 bg-[#692d91]"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#692d91]">Холбоо барих</span>
            <span className="h-[1px] w-8 bg-[#692d91]"></span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900">
            Бидэнтэй <span className="text-[#692d91]">холбогдоорой</span>
          </h1>
          {section.config.description && (
            <p className="text-sm font-medium text-slate-400 max-w-xl mx-auto leading-relaxed">
              {section.config.description}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Contact Info - Clean Cards */}
          <div className="lg:col-span-5 space-y-10">
            
            <div className="space-y-8">
              {/* Location */}
              <div className="group flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#692d91] group-hover:bg-[#692d91] group-hover:text-white transition-all duration-500 shadow-sm">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Байршил</h3>
                  <p className="text-sm font-bold text-slate-900 leading-relaxed">
                    {cpDetail?.externalLinks?.address || "Улаанбаатар хот, Монгол улс"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="group flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#692d91] group-hover:bg-[#692d91] group-hover:text-white transition-all duration-500 shadow-sm">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Утас</h3>
                  <div className="space-y-1">
                    {cpDetail?.externalLinks?.phones?.map((phone: string) => (
                      <a href={`tel:${phone}`} key={phone} className="block text-sm font-bold text-slate-900 hover:text-[#692d91] transition-colors">
                        {phone}
                      </a>
                    )) || <p className="text-sm font-bold text-slate-900">Холбоо барих дугааргүй</p>}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="group flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#692d91] group-hover:bg-[#692d91] group-hover:text-white transition-all duration-500 shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">И-мэйл хаяг</h3>
                  <div className="space-y-1">
                    {cpDetail?.externalLinks?.emails?.map((email: string) => (
                      <a href={`mailto:${email}`} key={email} className="block text-sm font-bold text-slate-900 hover:text-[#692d91] transition-colors">
                        {email}
                      </a>
                    )) || <p className="text-sm font-bold text-slate-900">И-мэйл хаяггүй</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                 <Share2 size={14} className="text-[#692d91]" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Сошиал сувгууд</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: <Facebook size={18} />, link: cpDetail?.externalLinks?.facebook },
                  { icon: <Instagram size={18} />, link: cpDetail?.externalLinks?.instagram },
                  { icon: <Twitter size={18} />, link: cpDetail?.externalLinks?.twitter },
                  { icon: <Linkedin size={18} />, link: cpDetail?.externalLinks?.linkedin },
                ].filter(social => social.link).map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#692d91]/5 hover:text-[#692d91] transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Side - Glass Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.03)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[#692d91]">
                <MessageSquare size={120} />
              </div>

              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 mb-2">
                    Амжилттай илгээгдлээ
                  </h3>
                  <p className="text-sm font-medium text-slate-400">
                    Бид таны хүсэлтийг хүлээн авлаа. Тантай тун удахгүй холбогдох болно.
                  </p>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="mt-8 text-[10px] font-black uppercase tracking-widest text-[#692d91] hover:underline"
                  >
                    Дахин илгээх
                  </button>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="mb-10">
                    <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-900">Мессеж илгээх</h2>
                    <p className="text-[11px] font-medium text-slate-400 mt-1">Танд асуух зүйл байвал бидэнд бичээрэй.</p>
                  </div>
                  <DynamicForm formData={formData} submitForm={submitForm} />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ContactSection