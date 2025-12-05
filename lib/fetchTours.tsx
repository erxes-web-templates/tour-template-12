// import { TOUR_DETAIL_QUERY, TOURS_QUERY } from "@templates/ecommerce-boilerplate/graphql/queries";
// import { getClient } from "./client";
// import { BmTourDetail, BmTourDetailVariables, BmToursData } from "@templates/ecommerce-boilerplate/types/tours";

// export async function fetchBmTours() {
//   const client = getClient();

//   try {
//     const { data } = await client.query<BmToursData>({
//       query: TOURS_QUERY,
//     });

//     return data.bmTours;
//   } catch (error) {
//     console.error("Error fetching BM Tours:", error);
//     return { total: 0, list: [] };
//   }
// }

// export async function fetchBmTourDetail(id: string, branchId?: string) {
//   const client = getClient();

//   try {
//     const { data } = await client.query<{ bmTourDetail: BmTourDetail }, BmTourDetailVariables>({
//       query: TOUR_DETAIL_QUERY,
//       variables: { id, branchId },
//     });

//     return data.bmTourDetail;
//   } catch (error) {
//     console.error("Error fetching BM Tour Detail:", error);
//     return null;
//   }
// }
