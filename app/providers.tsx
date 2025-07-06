"use client"

import type React from "react"

import { ThemeProvider } from "@/context/theme-context"
import { I18nProvider } from "@/context/i18n-context"
import { AuthProvider } from "@/context/auth-context"
import { CartProvider } from "@/context/cart-context"
import { WishlistProvider } from "@/context/wishlist-context"
import { ComparisonProvider } from "@/context/comparison-context"
import { ChatProvider } from "@/context/chat-context"
import { InventoryProvider } from "@/context/inventory-context"
import { POSProvider } from "@/context/pos-context"
import { Toaster } from "@/components/ui/toaster"
import { ChatWidget } from "@/components/chat/chat-widget"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ms-furniture-theme">
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ComparisonProvider>
                <ChatProvider>
                  <InventoryProvider>
                    <POSProvider>
                      {children}
                      <Toaster />
                      <ChatWidget />
                    </POSProvider>
                  </InventoryProvider>
                </ChatProvider>
              </ComparisonProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
