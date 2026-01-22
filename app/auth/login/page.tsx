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
import { Lock, Mail, Sparkles, ArrowRight } from "lucide-react"

type LoginResponse =
  | {
      token?: string | null
      refreshToken?: string | null
    }
  | string
  | null
  | undefined

const resolveClientPortalId = (
  paramsValue?: string | string[],
  searchValue?: string | null
) => {
  if (searchValue) return searchValue
  if (Array.isArray(paramsValue)) return paramsValue[0] ?? ""
  return paramsValue ?? ""
}

const storeTokens = (response: LoginResponse) => {
  if (!response) return
  if (typeof response === "string") {
    sessionStorage.setItem("token", response)
    return
  }
  if (response.token) sessionStorage.setItem("token", response.token)
  if (response.refreshToken) sessionStorage.setItem("refreshToken", response.refreshToken)
}

export default function LoginPage() {
  const router = useRouter()
  const params = useParams<{ id?: string }>()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const clientPortalId =
    resolveClientPortalId(params?.id, searchParams?.get("clientPortalId")) ||
    process.env.ERXES_CP_ID ||
    ""

  const [credentials, setCredentials] = useState({
    login: "",
    password: "",
  })

  const [loginMutation, { loading }] = useMutation(mutations.login, {
    onError(error) {
      toast({
        title: "Нэвтрэхэд алдаа гарлаа",
        description: error.message,
        variant: "destructive",
      })
    },
    onCompleted(data) {
      storeTokens(data?.clientPortalLogin)
      toast({
        title: "Амжилттай",
        description: "Та системд нэвтэрлээ.",
      })

      const redirectUrl = localStorage.getItem("redirectAfterLogin")
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin")
        window.location.href = redirectUrl
      } else {
        window.location.href = templateUrl("/")
      }
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

    await loginMutation({
      variables: {
        clientPortalId,
        login: credentials.login,
        password: credentials.password,
      },
    })
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#fafafa] px-6 py-20 selection:bg-[#692d91]/10'>
      <div className="absolute top-0 left-0 w-full h-1 bg-[#692d91]/10" />
      
      <Card className='w-full max-w-[440px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[40px] overflow-hidden bg-white'>
        <CardHeader className='space-y-4 text-center pt-12 pb-8'>
          <div className="mx-auto w-16 h-16 bg-[#692d91] rounded-2xl flex items-center justify-center text-white rotate-3 shadow-xl shadow-purple-100 mb-2">
            <Lock size={28} />
          </div>
          <div className="space-y-1">
            <CardTitle className='text-3xl font-black italic tracking-tighter uppercase text-slate-900'>
              Тавтай <span className="text-[#692d91]">морил</span>
            </CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Нэвтрэх мэдээллээ оруулна уу
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-10">
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-3 group'>
              <Label 
                htmlFor='login' 
                className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1"
              >
                Цахим хаяг эсвэл нэр
              </Label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#692d91] transition-colors" size={16} />
                <Input
                  id='login'
                  value={credentials.login}
                  onChange={(event) =>
                    setCredentials((prev) => ({
                      ...prev,
                      login: event.target.value,
                    }))
                  }
                  autoComplete='username'
                  placeholder='И-мэйл хаяг'
                  className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#692d91]/10 font-bold transition-all placeholder:font-normal placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className='space-y-3 group'>
              <div className="flex justify-between items-center px-1">
                <Label 
                  htmlFor='password' 
                  className="text-[9px] font-black uppercase tracking-widest text-slate-400"
                >
                  Нууц үг
                </Label>
                <Link href="#" className="text-[9px] font-black uppercase tracking-widest text-[#692d91] hover:underline">
                  Мартсан уу?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#692d91] transition-colors" size={16} />
                <Input
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  value={credentials.password}
                  onChange={(event) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#692d91]/10 font-bold transition-all"
                  required
                />
              </div>
            </div>

            <Button 
              type='submit' 
              className='w-full h-14 bg-[#692d91] hover:bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-purple-100 active:scale-[0.98] group' 
              disabled={loading}
            >
              <div className="flex items-center gap-2">
                {loading ? "Түр хүлээнэ үү…" : "Нэвтрэх"}
                {!loading && <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />}
              </div>
            </Button>
          </form>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4 pb-12 pt-8 text-center'>
          <div className="h-[1px] w-20 bg-slate-100 mx-auto" />
          <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
            Бүртгэл байхгүй юу? 
            <Link
              href={templateUrl("/auth/register")}
              className='ml-2 text-[#692d91] hover:underline flex inline-items items-center gap-1 justify-center'
            >
              Шинээр нээх <ArrowRight size={12} />
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Background Decorative Elements */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-slate-100 rounded-full blur-3xl opacity-50 -z-10" />
    </div>
  )
}