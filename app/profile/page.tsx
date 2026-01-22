"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  useRouter,
  useParams,
  useSearchParams,
  redirect,
} from "next/navigation"
import { useMutation, useQuery } from "@apollo/client"
import { User as UserIcon, Mail, Phone, ShieldCheck, Settings, ArrowRight } from "lucide-react"
import authQueries from "../../graphql/auth/queries"
import authMutations from "../../graphql/auth/mutations"
import orderQueries from "../../graphql/order/queries"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { useToast } from "../../hooks/use-toast"
import ProfileSidebar from "./_components/ProfileSidebar"
import ProfileOrdersTab from "./_components/ProfileOrdersTab"
import ProfileSecurityTab from "./_components/ProfileSecurityTab"
import { templateUrl } from "../../lib/utils"

type User = {
  _id: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phone?: string | null
  erxesCustomerId?: string | null
}

const SIDEBAR_ITEMS = [
  { id: "profile", label: "Хувийн мэдээлэл" },
  { id: "orders", label: "Захиалгууд" },
  { id: "security", label: "Нууц үг" },
  { id: "logout", label: "Гарах" },
] as const

type SidebarKey = (typeof SIDEBAR_ITEMS)[number]["id"]

const resolveClientPortalId = (
  paramsValue?: string | string[],
  searchValue?: string | null
) => {
  if (searchValue) return searchValue
  if (Array.isArray(paramsValue)) return paramsValue[0] ?? ""
  return paramsValue ?? ""
}

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams<{ id?: string }>()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<SidebarKey>("profile")

  const { data, loading, error, refetch } = useQuery(authQueries.currentUser)
  const { data: userDetailData } = useQuery(authQueries.userDetail)
  const user: User | null = useMemo(() => data?.clientPortalCurrentUser ?? null, [data])

  const {
    data: ordersData,
    loading: ordersLoading,
    refetch: refetchOrders,
  } = useQuery(orderQueries.bmOrders, {
    variables: { customerId: user?.erxesCustomerId ?? undefined },
    skip: !user?.erxesCustomerId,
    fetchPolicy: "cache-and-network",
  })

  const [formState, setFormState] = useState({ firstName: "", lastName: "", email: "", phone: "" })

  useEffect(() => {
    if (user) {
      setFormState({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      })
    }
  }, [user])

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const orders = useMemo(() => ordersData?.bmOrders?.list ?? [], [ordersData])

  const [updateUser, { loading: updating }] = useMutation(authMutations.userEdit, {
    onError: (err) => toast({ title: "Алдаа", description: err.message, variant: "destructive" }),
    onCompleted: () => {
      toast({ title: "Амжилттай", description: "Мэдээлэл шинэчлэгдлээ." })
      refetch()
    },
  })

  const [logoutMutation] = useMutation(authMutations.logout, {
    onCompleted: () => {
      sessionStorage.clear()
      window.location.href = templateUrl("/auth/login")
    },
  })

  const [changePasswordMutation, { loading: changingPassword }] = useMutation(authMutations.userChangePassword, {
    onError: (err) => toast({ title: "Алдаа", description: err.message, variant: "destructive" }),
    onCompleted: () => {
      toast({ title: "Амжилттай", description: "Нууц үг шинэчлэгдлээ." })
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user?._id) return
    await updateUser({ variables: { _id: user._id, ...formState } })
  }

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Алдаа", description: "Нууц үг таарахгүй байна.", variant: "destructive" })
      return
    }
    await changePasswordMutation({ variables: { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword } })
  }

  const renderSummary = () => (
    <div className='grid gap-4 md:grid-cols-3 mb-12'>
      {[
        { label: "Хэрэглэгч", val: `${formState.lastName} ${formState.firstName}`, icon: <UserIcon size={14}/> },
        { label: "Холбоо барих", val: formState.phone || "—", icon: <Phone size={14}/> },
        { label: "И-мэйл", val: formState.email || "—", icon: <Mail size={14}/>, verified: userDetailData?.clientPortalCurrentUser?.isEmailVerified },
      ].map((item, i) => (
        <div key={i} className='p-6 rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:border-[#692d91]/20'>
          <div className="flex items-center gap-2 text-[#692d91] mb-3">
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60">{item.label}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className='text-sm font-bold tracking-tight text-slate-900'>{item.val}</p>
            {item.verified && <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />}
          </div>
        </div>
      ))}
    </div>
  )

  if (loading) return <div className='flex min-h-screen items-center justify-center bg-white'><div className='w-8 h-8 border-2 border-[#692d91] border-t-transparent rounded-full animate-spin' /></div>

  return (
    <div className='min-h-screen bg-[#fafafa] py-12 md:py-20'>
      <div className='max-w-6xl mx-auto px-6'>
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-black  tracking-tighter uppercase text-slate-900 mb-2">Хувийн <span className="text-[#692d91]">Орон зай</span></h1>
            <div className="flex items-center gap-3">
               <span className="h-[1px] w-8 bg-[#692d91]"></span>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cardTitleMap[activeTab]}</p>
            </div>
          </div>
          <button onClick={() => logoutMutation()} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-100 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
            <ArrowRight size={14} /> Системээс гарах
          </button>
        </div>

        <div className='grid gap-12 lg:grid-cols-[260px_1fr]'>
          
          {/* SIDE NAVIGATION */}
          <aside className="space-y-6">
            <div className="bg-white p-2 rounded-[32px] border border-slate-100 shadow-sm">
              <ProfileSidebar
                items={SIDEBAR_ITEMS}
                activeId={activeTab}
                onSelect={(id) => id === "logout" ? logoutMutation() : setActiveTab(id as SidebarKey)}
              />
            </div>
            <div className="p-8 rounded-[32px] bg-slate-900 text-white overflow-hidden relative group">
                <div className="relative z-10">
                  <p className="text-[9px] font-bold uppercase opacity-50 tracking-[0.2em] mb-1">Нийт захиалга</p>
                  <p className="text-4xl font-black">{orders.length}</p>
                </div>
                <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </aside>

          {/* MAIN PANEL */}
          <main className="animate-in fade-in slide-in-from-right-4 duration-700">
            {activeTab === "profile" && renderSummary()}

            <div className='bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)]'>
              <div className="mb-10 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black  uppercase tracking-tight text-slate-900">{cardTitleMap[activeTab]}</h2>
                  <p className="text-[11px] font-medium text-slate-400 mt-1">{cardDescriptionMap[activeTab]}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl text-[#692d91]">
                  <Settings size={20} className="animate-spin-slow" />
                </div>
              </div>

              {activeTab === "profile" && (
                <form className='grid gap-8 md:grid-cols-2' onSubmit={handleSubmit}>
                  {[
                    { id: "lastName", label: "Овог", val: formState.lastName },
                    { id: "firstName", label: "Нэр", val: formState.firstName },
                    { id: "email", label: "Цахим шуудан", val: formState.email, type: "email" },
                    { id: "phone", label: "Утасны дугаар", val: formState.phone, type: "tel" },
                  ].map((f) => (
                    <div key={f.id} className="space-y-2">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{f.label}</Label>
                      <Input
                        id={f.id}
                        type={f.type || "text"}
                        className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#692d91]/10 font-bold transition-all"
                        value={f.val}
                        onChange={(e) => setFormState(p => ({ ...p, [f.id]: e.target.value }))}
                        required
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2 pt-4">
                    <Button disabled={updating} className="h-14 px-10 rounded-2xl bg-[#692d91] hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                      {updating ? "Хадгалж байна..." : "Мэдээлэл шинэчлэх"}
                    </Button>
                  </div>
                </form>
              )}

              {activeTab === "orders" && <ProfileOrdersTab orders={orders} loading={ordersLoading} />}
              {activeTab === "security" && (
                <ProfileSecurityTab
                  form={passwordForm}
                  loading={changingPassword}
                  onChange={(f, v) => setPasswordForm(p => ({ ...p, [f]: v }))}
                  onSubmit={handlePasswordSubmit}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

const cardTitleMap: Record<SidebarKey, string> = {
  profile: "Хувийн мэдээлэл",
  orders: "Миний захиалгууд",
  security: "Аюулгүй байдал",
  logout: "Гарах",
}

const cardDescriptionMap: Record<SidebarKey, string> = {
  profile: "Та өөрийн бүртгэлтэй мэдээллийг эндээс засах боломжтой.",
  orders: "Таны хийсэн бүх аяллын захиалгын түүх.",
  security: "Дансны нууц үгээ тогтмол сольж аюулгүй байдлаа хангана уу.",
  logout: "",
}