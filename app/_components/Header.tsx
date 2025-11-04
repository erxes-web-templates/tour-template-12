import Link from "next/link";
import { CPDetail, MenuItem } from "../../types/cms";
import { useQuery } from "@apollo/client";
import { GET_MENUS } from "../../../../../dashboard/projects/_graphql/queries";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getFileUrl, templateUrl } from "../../../../../../lib/utils";
import {
  ShoppingCart,
  Search,
  Menu,
  User,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../../lib/CartContext";

const formatCurrency = (value: number) => {
  if (!Number.isFinite(value)) {
    return "₮0";
  }
  return `₮${Math.round(value).toLocaleString()}`;
};

export default function Header({ cpDetail }: { cpDetail: CPDetail }) {
  const params = useParams<{ id: string }>();

  const { data } = useQuery(GET_MENUS, {
    variables: {
      clientPortalId: params.id,
      kind: "main",
    },
  });

  const menus = data?.cmsMenuList || [];

  const organizeMenus = (menus: MenuItem[]) => {
    const menuMap: Record<string, MenuItem & { children: MenuItem[] }> = {};

    menus.forEach((menu: any) => {
      menuMap[menu._id] = { ...menu, children: [] };
    });

    const nestedMenus: (MenuItem & { children: MenuItem[] })[] = [];

    menus.forEach((menu: any) => {
      if (menu.parentId) {
        menuMap[menu.parentId]?.children.push(menuMap[menu._id]);
      } else {
        nestedMenus.push(menuMap[menu._id]);
      }
    });

    return nestedMenus;
  };
  const nestedMenus = organizeMenus(menus);

  const renderMenu = (menu: MenuItem & { children: MenuItem[] }) => (
    <div key={menu._id} className="relative group z-10">
      <Link
        href={templateUrl(menu.url || "")}
        className="hover:underline text-primary text-sm font-medium transition-colors hover:text-primary "
      >
        {menu.label}
      </Link>
      {menu.children.length > 0 && (
        <div className="absolute hidden group-hover:block bg-white shadow-md ">
          <div className="space-y-2 p-2">
            {menu.children.map((child: any) => renderMenu(child))}
          </div>
        </div>
      )}
    </div>
  );

  const {
    items,
    totalItems,
    totalPrice,
    clearCart,
    updateQuantity,
    removeFromCart,
    isSyncing,
  } = useCart();
  const hasItems = totalItems > 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={templateUrl("/")} className="text-xl font-bold">
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
          <nav className="hidden items-center gap-6 md:flex">
            {nestedMenus.map(renderMenu)}
          </nav>
        </div>

        <div className="hidden flex-1 items-center justify-center px-8 md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {hasItems && (
                  <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-full max-w-sm flex-col gap-4 p-6 sm:max-w-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Your cart</h2>
                  <p className="text-sm text-muted-foreground">
                    {hasItems
                      ? `${totalItems} item${
                          totalItems === 1 ? "" : "s"
                        } ready to checkout.`
                      : "You have no items in your cart yet."}
                  </p>
                </div>
                {hasItems && (
                  <Badge variant="outline">{totalItems} items</Badge>
                )}
              </div>
              {hasItems ? (
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-3">
                    {items.map((item) => {
                      const lineTotal = item.unitPrice * item.quantity;
                      return (
                        <div
                          key={item.id}
                          className="flex gap-3 rounded-md border border-border bg-card/50 p-3"
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-medium leading-tight">
                                {item.name}
                              </p>
                              <span className="text-sm font-semibold">
                                {formatCurrency(lineTotal)}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Qty: {item.quantity} ·{" "}
                              {formatCurrency(item.unitPrice)} each
                            </p>
                            {item.categoryName && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                Category: {item.categoryName}
                              </p>
                            )}
                            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    void updateQuantity(
                                      item.id,
                                      item.quantity - 1
                                    );
                                  }}
                                  disabled={item.quantity <= 1 || isSyncing}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    void updateQuantity(
                                      item.id,
                                      item.quantity + 1
                                    );
                                  }}
                                  disabled={isSyncing}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  disabled={isSyncing}
                                >
                                  <Link
                                    href={templateUrl(`/products/${item.id}`)}
                                  >
                                    View
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => {
                                    void removeFromCart(item.id);
                                  }}
                                  disabled={isSyncing}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Add products to your cart to see them here.
                </div>
              )}
              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-base font-semibold">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    disabled={!hasItems || isSyncing}
                    asChild
                  >
                    <Link href={templateUrl("/checkout")}>Checkout</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="lg"
                    disabled={!hasItems || isSyncing}
                    onClick={() => {
                      void clearCart();
                    }}
                  >
                    Clear cart
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {nestedMenus.map((menu) => (
                  <div key={menu._id} className="flex flex-col">
                    <Link
                      href={templateUrl(menu.url || "")}
                      className="hover:underline text-primary text-sm font-medium transition-colors hover:text-primary "
                    >
                      {menu.label}
                    </Link>
                    {menu.children.length > 0 && (
                      <div className="mt-2 ml-4 flex flex-col gap-2">
                        {menu.children.map((child) => (
                          <Link
                            key={child._id}
                            href={templateUrl(child.url || "")}
                            className="hover:underline text-primary text-sm font-medium transition-colors hover:text-primary "
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
  );
}
