import { isBuildMode } from "@templates/template-boilerplate/lib/buildMode";
import ProductsPageClient from "../_client/ProductsPage";
import {
  fetchProductCategories,
  fetchProducts,
} from "@templates/template-boilerplate/graphql/products/server";

export default async function ProductsPage() {
  if (isBuildMode()) {
    return <ProductsPageClient />;
  }

  const [categoriesResult, productsResult] = await Promise.all([
    fetchProductCategories({
      variables: { perPage: 100, excludeEmpty: false },
      fetchPolicy: "no-cache",
    }),
    fetchProducts({
      variables: { perPage: 100, page: 1 },
      fetchPolicy: "no-cache",
    }),
  ]);

  return (
    <ProductsPageClient
      initialCategories={categoriesResult.data?.poscProductCategories ?? []}
      initialProducts={productsResult.data?.poscProducts ?? []}
    />
  );
}
