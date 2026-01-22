import { GET_FORM_DETAIL } from "../../../graphql/queries"
import { Section } from "../../../types/sections"
import React from "react"
import { useMutation, useQuery } from "@apollo/client"
import DynamicForm from "../../../components/common/DynamicForm"
import { FORM_SUBMISSION } from "../../../graphql/mutations"
import { Card, CardContent } from "@/components/ui/card"

const FormSection = ({ section }: { section: Section }) => {
  const { data, loading } = useQuery(GET_FORM_DETAIL, {
    variables: {
      id: section.contentTypeId,
    },
    skip: !section.contentTypeId,
  })

  const formData = data?.formDetail || {}
  
  const [submitForm] = useMutation(FORM_SUBMISSION, {
    onCompleted: (data) => {
      // Илгээж дууссаны дараа хийх үйлдэл (жишээ нь: Notification харуулах)
      console.log("Success:", data)
    },
  })

  return (
    <section id='contact' className='py-24 bg-[#f8fafc]'>
      <div className='container mx-auto px-4'>
        <div className='max-w-2xl mx-auto space-y-8'>
          
          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className='text-4xl font-black italic uppercase tracking-tighter text-slate-900'>
              {section.content || "Get In Touch"}
            </h2>
            <div className="w-20 h-1.5 bg-[#692d91] mx-auto rounded-full" />
            <p className="text-slate-500 font-medium">
              Have questions? Fill out the form below and our team will get back to you shortly.
            </p>
          </div>

          {/* Form Card */}
          <Card className="border-none shadow-2xl shadow-[#692d91]/5 rounded-[40px] overflow-hidden bg-white">
            <CardContent className='p-8 md:p-12'>
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#692d91]" />
                </div>
              ) : (
                <div className='dynamic-form-wrapper'>
                  <DynamicForm formData={formData} submitForm={submitForm} />
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}

export default FormSection