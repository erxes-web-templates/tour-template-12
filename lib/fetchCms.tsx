import {
  GET_CMS_MENU_LIST,
  GET_CMS_POST,
  GET_CMS_POSTS,
} from "../graphql/queries";
import { getClient } from "./client";
import type { CmsMenuList, CmsMenuListVariables } from "@/types/cms";

export async function fetchMenuList(cpId: string, kind: string) {
  const client = getClient();

  try {
    const { data } = await client.query<
      { cmsMenuList: CmsMenuList },
      CmsMenuListVariables
    >({
      query: GET_CMS_MENU_LIST,
      variables: { clientPortalId: cpId, kind },
    });

    return data.cmsMenuList;
  } catch (error) {
    console.error("Error fetching Menu List:", error);
    return [];
  }
}

export async function fetchCmsPosts(variables: any) {
  const client = getClient();
  try {
    const { data } = await client.query({
      query: GET_CMS_POSTS,
      variables,
    });

    return data.cmsPosts ?? [];
  } catch (error) {
    console.error("Error fetching CMS Posts:", error);
    return [];
  }
}

export async function fetchCmsPost(variables: any) {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GET_CMS_POST,
      variables,
    });

    return data.cmsPost ?? null;
  } catch (error) {
    console.error("Error fetching CMS Post:", error);
    return null;
  }
}
