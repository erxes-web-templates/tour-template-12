"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useMutation } from "@apollo/client"
import { mutations } from "../../../graphql/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import { useToast } from "../../../hooks/use-toast"
import { templateUrl } from "../../../lib/utils"
import { UserPlus, Sparkles, ArrowLeft, User, Mail, Phone, Lock, AtSign } from "lucide-react"

const resolveClientPortalId = (
  paramsValue?: string | string[],
  searchValue?: string | null
) => {
  if (searchValue) return searchValue
  if (Array.isArray(paramsValue)) return paramsValue[0] ?? ""
  return paramsValue ?? ""
}

export default function RegisterPage() {
  const router = useRouter()
  const params = useParams<{ id?: string }>()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const clientPortalId =
    resolveClientPortalId(params?.id, searchParams?.get("clientPortalId")) ||
    process.env.ERXES_CP_ID ||
    ""

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  })

  const [registerMutation, { loading }] = useMutation(mutations.createUser, {
    onError(error) {
      toast({
        title: "Бүртгэл амжилтгүй",
        description: error.message,
        variant: "destructive",
      })
    },
    onCompleted() {
      toast({
        title: "Амжилттай бүртгэгдлээ",
        description: "Та одоо нэвтрэх хэсгээр нэвтэрнэ үү.",
      })
      router.push(templateUrl("/auth/login"))
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!clientPortalId) {
      toast({
        title: "Тохиргооны алдаа",
        description: "Client portal ID олдсонгүй.",
        variant: "destructive",
      })
      return
    }

    await registerMutation({
      variables: {
        clientPortalId,
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email,
        phone: formState.phone,
        username: formState.username,
        password: formState.password,
      },
    })
  }

  const handleChange = (field: keyof typeof formState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#fafafa] px-6 py-20 selection:bg-[#692d91]/10'>
      <div className="absolute top-0 left-0 w-full h-1 bg-[#692d91]/10" />
      
      <Card className='w-full max-w-2xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[40px] overflow-hidden bg-white'>
        <CardHeader className='space-y-4 text-center pt-12 pb-8'>
          <div className="mx-auto w-16 h-16 bg-[#692d91] rounded-2xl flex items-center justify-center text-white -rotate-3 shadow-xl shadow-purple-100 mb-2">
            <UserPlus size={28} />
          </div>
          <div className="space-y-1">
            <CardTitle className='text-3xl font-black italic tracking-tighter uppercase text-slate-900'>
              Шинэ <span className="text-[#692d91]">бүртгэл</span>
            </CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Аяллын ертөнцөд нэгдэхэд ердөө нэг алхам үлдлээ
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 md:px-12">
          <form className='grid gap-6 md:grid-cols-2' onSubmit={handleSubmit}>
            
            {/* Last Name */}
            <div className='space-y-2 group'>
              <Label htmlFor='lastName' className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Овог</Label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#692d91] transition-colors" size={16} />
                <Input
                  id='lastName'
                  value={formState.lastName}
                  onChange={handleChange("lastName")}
                  placeholder="Овог"
                  className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#692d91]/10 font-bold transition-all"
                  required
                />
              </div>
            </div>

            {/* First Name */}
            <div className='space-y-2 group'>
              <Label htmlFor='firstName' className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Нэр</Label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#692d91] transition-colors" size={16} />
                <Input
                  id='firstName'
                  value={formState.firstName}
                  onChange={handleChange("firstName")}
                  placeholder="Нэр"
                  className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#692d91]/10 font-bold transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className='space-y-2 group'>
              <Label htmlFor='email' className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Цахим шуудан</Label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#692d91] transition-colors" size={16} />
                <Input
                  id='email'
                  type='email'
                  autoComplete='email'
                  value={formState.email}
                  onChange={handleChange("email")}
                  placeholder="you@example.com"
                  className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#692d91]/10 font-bold transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className='space-y-2 group'>
              <Label htmlFor='phone' className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Утасны дугаар</Label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#692d91] transition-colors" size={16} />
                <Input
                  id='phone'
                  type='tel'
                  value={formState.phone}
                  onChange={handleChange("phone")}
                  placeholder="9911****"
                  className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#692d91]/10 font-bold transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div className='space-y-2 group'>
              <Label htmlFor='username' className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Хэрэглэгчийн нэр</Label>
              <div className="relative">
                <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#692d91] transition-colors" size={16} />
                <Input
                  id='username'
                  value={formState.username}
                  onChange={handleChange("username")}
                  placeholder="username"
                  className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#692d91]/10 font-bold transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className='space-y-2 group'>
              <Label htmlFor='password' className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Нууц үг</Label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#692d91] transition-colors" size={16} />
                <Input
                  id='password'
                  type='password'
                  autoComplete='new-password'
                  value={formState.password}
                  onChange={handleChange("password")}
                  placeholder="••••••••"
                  minLength={8}
                  className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#692d91]/10 font-bold transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className='md:col-span-2 pt-4'>
              <Button
                type='submit'
                className='w-full h-14 bg-[#692d91] hover:bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-purple-100 active:scale-[0.98] group flex items-center justify-center gap-2'
                disabled={loading}
              >
                {loading ? "Бүртгэж байна..." : "Бүртгэл үүсгэх"}
                {!loading && <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4 pb-12 pt-8 text-center'>
          <div className="h-[1px] w-20 bg-slate-100 mx-auto" />
          <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
            Аль хэдийн бүртгэлтэй юу? 
            <Link
              href={templateUrl("/auth/login")}
              className='ml-2 text-[#692d91] hover:underline flex inline-items items-center gap-1 justify-center transition-all'
            >
              <ArrowLeft size={12} /> Нэвтрэх
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Background Decor */}
      <div className="fixed -bottom-20 -right-20 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="fixed -top-20 -left-20 w-96 h-96 bg-slate-100 rounded-full blur-3xl opacity-50 -z-10" />
    </div>
  )
}