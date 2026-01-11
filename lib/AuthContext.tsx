"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import PageLoader from "../components/common/PageLoader";

interface User {
  _id: string;
  details: {
    avatar: string;
    firstName: string;
    fullName: string;
    lastName: string;
    shortName: string;
  };
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const ME_QUERY = gql`
    query me {
      currentUser {
        _id
        details {
          avatar
          firstName
          fullName
          lastName
          shortName
        }
        username
        email
      }
    }
  `;

  const { data, loading, error } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
  });

  // useEffect(() => {
  //   if (error) {
  //     router.push("/auth/login");
  //   }

  //   if (!loading && !data?.currentUser) {
  //     router.push("/auth/login");
  //   } else if (data?.currentUser) {
  //     setUser(data.currentUser);
  //   }
  // }, [data, error, loading, router]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

// Export the context for use in other files
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
