"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { mutations } from "../../../graphql/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { templateUrl } from "@/lib/utils";

type LoginResponse =
  | {
      token?: string | null;
      refreshToken?: string | null;
    }
  | string
  | null
  | undefined;

const resolveClientPortalId = (
  paramsValue?: string | string[],
  searchValue?: string | null
) => {
  if (searchValue) {
    return searchValue;
  }

  if (Array.isArray(paramsValue)) {
    return paramsValue[0] ?? "";
  }

  return paramsValue ?? "";
};

const storeTokens = (response: LoginResponse) => {
  if (!response) {
    return;
  }

  if (typeof response === "string") {
    sessionStorage.setItem("token", response);
    return;
  }

  if (response.token) {
    sessionStorage.setItem("token", response.token);
  }

  if (response.refreshToken) {
    sessionStorage.setItem("refreshToken", response.refreshToken);
  }
};

export default function LoginPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const clientPortalId = resolveClientPortalId(
    params?.id,
    searchParams?.get("clientPortalId")
  );

  const [credentials, setCredentials] = useState({
    login: "",
    password: "",
  });

  const [loginMutation, { loading }] = useMutation(mutations.login, {
    onError(error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onCompleted(data) {
      storeTokens(data?.clientPortalLogin);
      toast({
        title: "Signed in",
        description: "You are now logged in.",
      });
      router.push(templateUrl("/"));
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!clientPortalId) {
      toast({
        title: "Client portal not configured",
        description:
          "Missing client portal identifier. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    await loginMutation({
      variables: {
        clientPortalId,
        login: credentials.login,
        password: credentials.password,
      },
    });
  };

  return (
    <div className="flex my-[100px] items-center justify-center bg-muted/20 px-6 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="login">Email or username</Label>
              <Input
                id="login"
                value={credentials.login}
                onChange={(event) =>
                  setCredentials((prev) => ({
                    ...prev,
                    login: event.target.value,
                  }))
                }
                autoComplete="username"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          <span>Don&apos;t have an account?</span>
          <Link
            href={templateUrl("/register")}
            className="ml-1 font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
