import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { CPDetail, MenuItem } from "../../types/cms"
import { useQuery, useMutation } from "@apollo/client"
import { GET_CMS_MENU_LIST } from "../../graphql/queries"
import authMutations from "../../graphql/auth/mutations"
import Image from "next/image"
import { getFileUrl, templateUrl } from "@/lib/utils"
import { Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuthContext } from "@/lib/AuthContext"

export default function Header({ cpDetail }: { cpDetail: CPDetail }) {
  const params = useParams<{ id: string }>()
  const { user } = useAuthContext()

  const [logoutMutation] = useMutation(authMutations.logout, {
    onCompleted: () => {
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("refreshToken")
      window.location.href = templateUrl("/auth/login")
    },
    onError: () => {
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("refreshToken")
      window.location.href = templateUrl("/auth/login")
    },
  })

  const { data } = useQuery(GET_CMS_MENU_LIST, {
    variables: {
      clientPortalId: params.id || process.env.ERXES_CP_ID,
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
      if (menu.parentId) {
        menuMap[menu.parentId]?.children.push(menuMap[menu._id])
      } else {
        nestedMenus.push(menuMap[menu._id])
      }
    })

    return nestedMenus
  }
  const nestedMenus = organizeMenus(menus)

  const renderMenu = (menu: MenuItem & { children: MenuItem[] }) => (
    <div key={menu._id} className='relative group z-10'>
      <Link
        href={templateUrl(menu.url || "")}
        className='hover:underline text-primary text-sm font-medium transition-colors hover:text-primary '
      >
        {menu.label}
      </Link>
      {menu.children.length > 0 && (
        <div className='absolute hidden group-hover:block bg-white shadow-md '>
          <div className='space-y-2 p-2'>
            {menu.children.map((child: any) => renderMenu(child))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-6'>
          <Link href={templateUrl("/")} className='text-xl font-bold'>
            {cpDetail.logo ? (
              <Image
                src={getFileUrl(cpDetail.logo)}
                alt={cpDetail.name}
                width={50}
                height={50}
              />
            ) : (
              cpDetail.name
            )}
          </Link>
          <nav className='hidden items-center gap-6 md:flex'>
            {nestedMenus.map(renderMenu)}
          </nav>
        </div>

        <div className='flex items-center gap-4'>
          {user ? (
            <div className='hidden md:flex items-center gap-2 relative'>
              <Link href={templateUrl("/profile")}>
                <Button variant='ghost' size='sm' className='gap-2'>
                  <User className='h-4 w-4' />
                  <span className='text-sm'>
                    {user.firstName || user.email}
                  </span>
                </Button>
              </Link>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => logoutMutation()}
                title='Logout'
              >
                <LogOut className='h-4 w-4' />
              </Button>
            </div>
          ) : (
            <Link href={templateUrl("/auth/login")}>
              <Button
                variant='ghost'
                size='sm'
                className='hidden md:flex gap-2'
              >
                <User className='h-5 w-5' />
                <span>Login</span>
              </Button>
            </Link>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right'>
              <nav className='flex flex-col gap-4 mt-8'>
                {nestedMenus.map((menu) => (
                  <div key={menu._id} className='flex flex-col'>
                    <Link
                      href={templateUrl(menu.url || "")}
                      className='hover:underline text-primary text-sm font-medium transition-colors hover:text-primary '
                    >
                      {menu.label}
                    </Link>
                    {menu.children.length > 0 && (
                      <div className='mt-2 ml-4 flex flex-col gap-2'>
                        {menu.children.map((child) => (
                          <Link
                            key={child._id}
                            href={templateUrl(child.url || "")}
                            className='hover:underline text-primary text-sm font-medium transition-colors hover:text-primary '
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
