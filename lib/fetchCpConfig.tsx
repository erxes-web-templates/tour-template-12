import { CP_GET_CONFIG } from "@templates/template-boilerplate/graphql/queries";
import { getClient } from "./client";

export async function fetchCpConfig(cpId: string) {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: CP_GET_CONFIG,
      variables: { _id: cpId },
    });

    return data.clientPortalGetConfig;
  } catch (error) {
    console.error("Error fetching CP Config:", error);
    return null;
  }
}
