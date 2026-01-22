"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { CPDetail, MenuItem } from "../../types/cms"
import { useQuery, useMutation } from "@apollo/client"
import { GET_CMS_MENU_LIST } from "../../graphql/queries"
import authMutations from "../../graphql/auth/mutations"
import Image from "next/image"
import { getFileUrl, templateUrl } from "@/lib/utils"
import { Menu, User, LogOut, X, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/lib/AuthContext"
import { useEffect, useState } from "react"

export default function Header({ cpDetail }: { cpDetail: CPDetail }) {
  const params = useParams<{ id: string }>()
  const { user } = useAuthContext()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [logoutMutation] = useMutation(authMutations.logout, {
    onCompleted: () => {
      sessionStorage.clear()
      window.location.href = templateUrl("/auth/login")
    }
  })

  const { data } = useQuery(GET_CMS_MENU_LIST, {
    variables: {
       clientPortalId: cpDetail?._id || params.id || process.env.ERXES_CP_ID,
      kind: "main",
    },
  })

  const menus = data?.cmsMenuList || []

  const organizeMenus = (menus: MenuItem[]) => {
    const menuMap: Record<string, MenuItem & { children: MenuItem[] }> = {}
    menus.forEach((menu: any) => {
      menuMap[menu._id] = { ...menu, children: [] }
    })
    const nestedMenus: (MenuItem & { children: MenuItem[] })[] = []
    menus.forEach((menu: any) => {
      if (menu.parentId && menuMap[menu.parentId]) {
        menuMap[menu.parentId].children.push(menuMap[menu._id])
      } else if (!menu.parentId) {
        nestedMenus.push(menuMap[menu._id])
      }
    })
    return nestedMenus
  }

  const nestedMenus = organizeMenus(menus)

  return (
    <header className={`fixed top-4 left-4 right-4 z-[100] transition-all duration-300 rounded-2xl bg-[#6B21A8]/90 backdrop-blur-md text-white shadow-lg ${
      isScrolled ? 'py-2 mt-2' : 'py-4 mt-0'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO & BRAND */}
        <Link href={templateUrl("/")} className="flex items-center gap-3 group">
          <div className="bg-white p-1.5 rounded-xl shadow-inner">
            {cpDetail.logo ? (
              <Image src={getFileUrl(cpDetail.logo)} alt="Logo" width={32} height={32} />
            ) : (
              <div className="w-8 h-8 bg-[#6B21A8] rounded-lg flex items-center justify-center font-bold italic">N</div>
            )}
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase">NEW</span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center gap-1">
          {nestedMenus.map((menu) => (
            <div 
              key={menu._id} 
              className="relative"
              onMouseEnter={() => setActiveMenu(menu._id!)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href={templateUrl(menu.url || "")}
                className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all hover:bg-white/10 ${
                  activeMenu === menu._id ? 'bg-white/20' : ''
                }`}
              >
                {menu.label}
              </Link>

              {/* DROPDOWN */}
              {menu.children.length > 0 && activeMenu === menu._id && (
                <div className="absolute top-full left-0 pt-2 w-64 animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-[#4C1D95] rounded-2xl p-3 shadow-2xl border border-white/10">
                    {menu.children.map((child) => (
                      <Link
                        key={child._id}
                        href={templateUrl(child.url || "")}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#6B21A8] transition-colors group"
                      >
                        <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs font-bold uppercase">{child.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Search size={20} className="text-white/80" />
          </button>
          
          {user ? (
            <Link href={templateUrl("/profile")}>
              <button className="bg-white text-[#6B21A8] px-5 py-2 rounded-xl text-sm font-black uppercase flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-md">
                <User size={16} /> {user.firstName || "Profile"}
              </button>
            </Link>
          ) : (
            <Link href={templateUrl("/auth/login")}>
              <button className="bg-white text-[#6B21A8] px-6 py-2 rounded-xl text-sm font-black uppercase flex items-center gap-2 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all italic">
                <User size={16} /> Нэвтрэх
              </button>
            </Link>
          )}

          <button 
            className="lg:hidden p-2 bg-white/10 rounded-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#6B21A8] rounded-2xl p-4 border border-white/10 shadow-2xl lg:hidden flex flex-col gap-2 mx-4">
          {nestedMenus.map((menu) => (
            <div key={menu._id} className="flex flex-col gap-1">
              <Link 
                href={templateUrl(menu.url || "")}
                className="p-4 bg-white/10 rounded-xl font-bold uppercase text-center hover:bg-white/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {menu.label}
              </Link>
              {menu.children.map((child) => (
                <Link
                  key={child._id}
                  href={templateUrl(child.url || "")}
                  className="p-3 pl-8 text-sm font-bold opacity-80 border-l-2 border-yellow-400 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  )
}