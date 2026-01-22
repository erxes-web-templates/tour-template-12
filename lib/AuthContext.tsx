"use client"

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react"
import { gql, useQuery } from "@apollo/client"
import { useRouter } from "next/navigation"
import PageLoader from "../components/common/PageLoader"

interface User {
  avatar: string
  _id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  erxesCustomerId?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  refetch: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const ME_QUERY = gql`
    query clientPortalCurrentUser {
      clientPortalCurrentUser {
        _id
        firstName
        lastName
        email
        phone
        erxesCustomerId
      }
    }
  `

  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        authorization: sessionStorage.getItem("token")
          ? `Bearer ${sessionStorage.getItem("token")}`
          : "",
      },
    },
  })

  useEffect(() => {
    if (!loading && data?.clientPortalCurrentUser) {
      setUser(data.clientPortalCurrentUser)
    } else if (!loading && !data?.clientPortalCurrentUser) {
      setUser(null)
    }
  }, [data, loading])

  if (loading) {
    return <PageLoader />
  }

  return (
    <AuthContext.Provider value={{ user, loading, refetch }}>
      {children}
    </AuthContext.Provider>
  )
}

// Export the context for use in other files
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
