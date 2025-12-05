// import { GET_CMS_MENU_LIST } from "@templates/ecommerce-boilerplate/graphql/queries";
// import { getClient } from "./client";
// import { CmsMenuList, CmsMenuListVariables } from "@templates/ecommerce-boilerplate/types/cms";

// export async function fetchMenuList(cpId: string, kind: string) {
//   const client = getClient();

//   try {
//     const { data } = await client.query<{ cmsMenuList: CmsMenuList }, CmsMenuListVariables>({
//       query: GET_CMS_MENU_LIST,
//       variables: { clientPortalId: cpId, kind },
//     });

//     return data.cmsMenuList;
//   } catch (error) {
//     console.error("Error fetching Menu List:", error);
//     return [];
//   }
// }
