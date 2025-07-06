"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  Phone,
  Menu,
  LogOut,
  Settings,
  Package,
  Users,
  BarChart2,
  Layers,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useWishlist } from "@/context/wishlist-context"
import { useTranslation } from "@/context/i18n-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { categories } from "@/lib/data"

export default function Header() {
  const router = useRouter()
  const { cart } = useCart()
  const { wishlist } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const isAdmin = user?.role === "admin"

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      {/* Top bar */}
      <div className="bg-gray-100 dark:bg-gray-800 py-1 px-4 text-xs flex justify-between items-center">
        <div className="flex items-center">
          <Phone className="h-3 w-3 mr-1" />
          <span>01234 567 678</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                {t("welcome_back")}, {user?.firstName}
              </span>
              {isAdmin && (
                <Link href="/admin" className="text-red-600 dark:text-red-400 font-medium hover:underline">
                  {t("admin_panel")}
                </Link>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                {t("login")}
              </Link>
              <Link href="/register" className="hover:underline">
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main header */}
      <div className="bg-red-600 dark:bg-red-800 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <div className="py-4">
                  <div className="flex items-center mb-6">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt={`${t("app_name")} Logo`}
                      width={40}
                      height={40}
                      className="mr-2"
                    />
                    <span className="font-bold text-xl">{t("app_name")}</span>
                  </div>

                  <nav className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">{t("main_menu")}</h3>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/" className="block py-2 hover:text-red-600 dark:hover:text-red-400">
                            {t("home")}
                          </Link>
                        </li>
                        <li>
                          <Link href="/about" className="block py-2 hover:text-red-600 dark:hover:text-red-400">
                            {t("about")}
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact" className="block py-2 hover:text-red-600 dark:hover:text-red-400">
                            {t("contact")}
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {isAdmin && (
                      <div>
                        <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">{t("admin_menu")}</h3>
                        <ul className="space-y-2">
                          <li>
                            <Link href="/admin" className="block py-2 hover:text-red-600 dark:hover:text-red-400">
                              {t("dashboard")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/products"
                              className="block py-2 hover:text-red-600 dark:hover:text-red-400"
                            >
                              {t("products_management")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/orders"
                              className="block py-2 hover:text-red-600 dark:hover:text-red-400"
                            >
                              {t("orders_management")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/customers"
                              className="block py-2 hover:text-red-600 dark:hover:text-red-400"
                            >
                              {t("customers_management")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/inventory"
                              className="block py-2 hover:text-red-600 dark:hover:text-red-400"
                            >
                              {t("inventory_management")}
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-2">{t("categories")}</h3>
                      <ul className="space-y-2">
                        {categories.map((category) => (
                          <li key={category.slug}>
                            <Link
                              href={`/categories/${category.slug}`}
                              className="block py-2 hover:text-red-600 dark:hover:text-red-400"
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{t("my_account")}</h3>
                      <ul className="space-y-2">
                        {isAuthenticated ? (
                          <>
                            <li>
                              <Link href="/account" className="block py-2 hover:text-red-600 dark:hover:text-red-400">
                                {t("my_account")}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/account/orders"
                                className="block py-2 hover:text-red-600 dark:hover:text-red-400"
                              >
                                {t("my_orders")}
                              </Link>
                            </li>
                            <li>
                              <Link href="/wishlist" className="block py-2 hover:text-red-600 dark:hover:text-red-400">
                                {t("my_wishlist")}
                              </Link>
                            </li>
                            <li>
                              <button
                                onClick={handleLogout}
                                className="block py-2 hover:text-red-600 dark:hover:text-red-400 w-full text-left"
                              >
                                {t("logout")}
                              </button>
                            </li>
                          </>
                        ) : (
                          <>
                            <li>
                              <Link href="/login" className="block py-2 hover:text-red-600 dark:hover:text-red-400">
                                {t("login")}
                              </Link>
                            </li>
                            <li>
                              <Link href="/register" className="block py-2 hover:text-red-600 dark:hover:text-red-400">
                                {t("register")}
                              </Link>
                            </li>
                          </>
                        )}
                        <li>
                          <Link href="/cart" className="block py-2 hover:text-red-600 dark:hover:text-red-400">
                            {t("cart")}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt={`${t("app_name")} Logo`}
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="font-bold text-xl hidden sm:inline">{t("app_name")}</span>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-1 flex-1 max-w-xl mx-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={t("search_placeholder")}
                className="w-full rounded-l-md rounded-r-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select className="h-full rounded-none border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-0">
                  <option>{t("all_categories")}</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              type="submit"
              className="rounded-l-none bg-red-700 hover:bg-red-800 dark:bg-red-900 dark:hover:bg-red-950 h-10"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/account">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t("my_account")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">
                        <Package className="mr-2 h-4 w-4" />
                        <span>{t("my_orders")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>{t("wishlist")}</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>{t("admin_area")}</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <BarChart2 className="mr-2 h-4 w-4" />
                            <span>{t("dashboard")}</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/products">
                            <Layers className="mr-2 h-4 w-4" />
                            <span>{t("products")}</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/orders">
                            <Package className="mr-2 h-4 w-4" />
                            <span>{t("orders")}</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/customers">
                            <Users className="mr-2 h-4 w-4" />
                            <span>{t("customers")}</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/inventory">
                            <Package className="mr-2 h-4 w-4" />
                            <span>{t("inventory")}</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>{t("settings")}</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden md:flex items-center">
                <User className="h-5 w-5" />
              </Link>
            )}
            <Link href="/wishlist" className="hidden md:block relative">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-700 dark:bg-red-900">
                  {wishlist.length}
                </Badge>
              )}
            </Link>
            <Link href="/cart" className="flex items-center">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-700 dark:bg-red-900">
                    {cart.length}
                  </Badge>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-red-500 dark:border-red-700 bg-red-600 dark:bg-red-800 hidden md:block">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <div className="relative group">
                <button className="flex items-center space-x-1 bg-red-700 dark:bg-red-900 text-white px-4 py-3 font-medium">
                  <span>{t("select_category")}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full w-48 bg-white dark:bg-gray-800 shadow-lg z-10 hidden group-hover:block">
                  <div className="py-2 text-sm text-gray-700 dark:text-gray-300">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center ml-4 space-x-6">
                <Link href="/" className="text-white py-3 hover:text-gray-200">
                  {t("home").toUpperCase()}
                </Link>
                <Link href="/categories/home-furniture/sofas" className="text-white py-3 hover:text-gray-200">
                  {t("sofas").toUpperCase()}
                </Link>
                <Link href="/products" className="text-white py-3 hover:text-gray-200">
                  {t("all_products").toUpperCase()}
                </Link>
                <Link href="/about" className="text-white py-3 hover:text-gray-200">
                  {t("about").toUpperCase()}
                </Link>
                <Link href="/track-order" className="text-white py-3 hover:text-gray-200">
                  {t("track_order").toUpperCase()}
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="text-white py-3 hover:text-gray-200 font-medium">
                    {t("admin_panel").toUpperCase()}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden p-2 bg-red-700 dark:bg-red-900">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder={t("search_placeholder")}
              className="w-full rounded-l-md rounded-r-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 bg-white dark:bg-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              className="rounded-l-none bg-red-800 hover:bg-red-900 dark:bg-red-950 dark:hover:bg-red-900 h-9"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  )
}
