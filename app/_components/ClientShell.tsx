"use client"

import Script from "next/script"
import { ApolloWrapper } from "../../lib/apollo-wrapper"
import { AuthProvider } from "../../lib/AuthContext"
import { Toaster } from "../../components/ui/toaster"
import Header from "./Header"
import Footer from "./Footer"
import { getEnv } from "@/lib/utils"
import type { CPDetail } from "../../types/cms"

type ClientShellProps = {
  children: React.ReactNode
  cpDetail?: (CPDetail & { messengerBrandCode?: string }) | null
}

export default function ClientShell({ children, cpDetail }: ClientShellProps) {
  const env = getEnv()

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || env.NEXT_PUBLIC_API_URL || ""
  const baseUrl = apiUrl ? new URL(apiUrl).origin.replace(".api.", ".app.") : ""

  return (
    <ApolloWrapper>
      <AuthProvider>
        {cpDetail?.messengerBrandCode && baseUrl && (
          <Script
            id='erxes'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{
              __html: `
                window.erxesSettings = {
                  messenger: {
                    brand_id: "${cpDetail.messengerBrandCode}",
                  },
                };
                
                (() => {
                  const script = document.createElement('script');
                  script.src = "${baseUrl}/widgets/build/messengerWidget.bundle.js";
                  script.async = true;

                  const entry = document.getElementsByTagName('script')[0];
                  entry.parentNode.insertBefore(script, entry);
                })();
              `,
            }}
          />
        )}
        <div>
          <Header cpDetail={cpDetail as CPDetail} />
          <main>{children}</main>
          <Footer cpDetail={cpDetail as CPDetail} />
        </div>
        <Toaster />
      </AuthProvider>
    </ApolloWrapper>
  )
}
