"use client"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/context/i18n-context"

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-red-600 dark:bg-red-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt={`${t("app_name")} Logo`}
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="font-bold text-xl">{t("app_name")}</span>
            </div>
            <p className="text-sm mb-4">{t("shop_info")}</p>
            <div className="flex items-center space-x-4">
              <Link href="#" className="hover:text-gray-200">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-gray-200">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t("accounts")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/account/profile" className="hover:underline">
                  {t("profile")}
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:underline">
                  {t("my_account")}
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:underline">
                  {t("help_support")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t("quick_links")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/featured" className="hover:underline">
                  {t("featured_products")}
                </Link>
              </li>
              <li>
                <Link href="/latest" className="hover:underline">
                  {t("latest_products")}
                </Link>
              </li>
              <li>
                <Link href="/bestsellers" className="hover:underline">
                  {t("best_selling")}
                </Link>
              </li>
              <li>
                <Link href="/popular" className="hover:underline">
                  {t("popular_products")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t("other")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:underline">
                  {t("about_company")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  {t("contact_us")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  {t("terms_conditions")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  {t("privacy_policy")}
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:underline">
                  {t("return_policy")}
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:underline">
                  {t("shipping_policy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-red-500 dark:border-red-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">{t("copyright")}</p>
            <div className="flex items-center space-x-2">
              <Image src="/placeholder.svg?height=30&width=40" alt="Payment Method" width={40} height={30} />
              <Image src="/placeholder.svg?height=30&width=40" alt="Payment Method" width={40} height={30} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-700 dark:bg-red-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              <span>{t("need_help")} 01234 567 678</span>
            </div>

            <div className="flex items-center">
              <span className="mr-2">{t("subscribe_to_newsletter")}</span>
              <div className="flex">
                <Input
                  type="email"
                  placeholder={t("your_email")}
                  className="w-full rounded-l-md rounded-r-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 bg-red-800 dark:bg-red-900 text-white placeholder:text-red-300"
                />
                <Button className="rounded-l-none bg-red-900 hover:bg-red-950 dark:bg-red-950 dark:hover:bg-red-900 h-9">
                  {t("subscribe")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
