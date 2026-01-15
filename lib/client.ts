import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  type NormalizedCacheObject,
} from "@apollo/client"

const createClient = () =>
  new ApolloClient({
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.ERXES_API_URL,
      credentials: "include",
      headers: {
        // "Access-Control-Allow-Origin": process.env.ERXES_URL || "",
        "erxes-app-token": process.env.ERXES_APP_TOKEN || "",
      },
      fetchOptions: {
        cache: "no-store",
      },
    }),
  })

export const getClient = (): ApolloClient<NormalizedCacheObject> =>
  createClient()
