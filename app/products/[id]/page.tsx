"use client";

import Link from "next/link";
import { useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useProductAverageReviewQuery,
  useProductDetailQuery,
  useProductSimilaritiesQuery,
} from "../../../graphql/products";
import { useCart } from "../../../lib/CartContext";

const formatCurrency = (value?: number | null) => {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return `₮${Math.round(value).toLocaleString()}`;
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleDateString();
};

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{value || "—"}</p>
    </CardContent>
  </Card>
);

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : undefined;
  console.log(productId, "piiii");
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useProductDetailQuery({
    variables: { _id: productId ?? "" },
    fetchPolicy: "cache-and-network",
    skip: !productId,
  });

  const { data: similarityData, loading: similarityLoading } =
    useProductSimilaritiesQuery({
      variables: { id: productId ?? "" },
      fetchPolicy: "cache-first",
      skip: !productId,
    });

  const { data: reviewData, loading: reviewLoading } =
    useProductAverageReviewQuery({
      variables: { productId: productId ?? "" },
      fetchPolicy: "cache-first",
      skip: !productId,
    });

  const product = productData?.posProductDetail ?? null;
  const gallery = useMemo(() => {
    if (!product) {
      return [] as string[];
    }
    const images = [
      product.attachment?.url,
      ...(product.attachmentMore?.map((file) => file?.url) ?? []),
    ];
    return images.filter((url): url is string => Boolean(url));
  }, [product]);

  const similarProducts = useMemo(() => {
    const items =
      similarityData?.posProductSimilarities?.products?.filter(
        (entry) => entry._id !== product?._id
      ) ?? [];
    return items;
  }, [similarityData, product?._id]);

  const reviewSummary = reviewData?.productreview;
  const averageRating =
    reviewSummary?.average && reviewSummary.average > 0
      ? reviewSummary.average.toFixed(1)
      : null;
  const reviewsCount = reviewSummary?.length ?? 0;
  const inStock = (product?.remainder ?? 0) > 0;
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(() => {
    if (!product?._id) {
      return;
    }

    const unitPrice =
      typeof product.unitPrice === "number" &&
      Number.isFinite(product.unitPrice)
        ? product.unitPrice
        : 0;

    addToCart(
      {
        id: product._id,
        name: product.name ?? "Untitled product",
        unitPrice,
        description: product.description ?? "",
        imageUrl: product.attachment?.url ?? null,
        categoryName: product.category?.name ?? null,
      },
      1
    );
  }, [addToCart, product]);

  const isLoading = productLoading || similarityLoading || reviewLoading;
  const hasError = Boolean(productError);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Button variant="ghost" asChild className="mb-6 w-fit">
        <Link href="/products" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </Button>

      {!productId && (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Invalid product identifier.
          </CardContent>
        </Card>
      )}

      {productId && (
        <>
          {hasError && (
            <Card className="mb-6 border-destructive/40 bg-destructive/10">
              <CardContent className="p-6 text-sm text-destructive">
                Unable to load this product right now. Please try again later.
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
              <div className="h-[420px] animate-pulse rounded-2xl border border-border bg-muted/40" />
              <div className="space-y-4">
                <div className="h-10 w-2/3 animate-pulse rounded bg-muted/40" />
                <div className="h-6 w-1/3 animate-pulse rounded bg-muted/40" />
                <div className="h-32 animate-pulse rounded bg-muted/40" />
              </div>
            </div>
          )}

          {!isLoading && !product && !hasError && (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Product not found.
              </CardContent>
            </Card>
          )}

          {product && !isLoading && (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
                  {gallery.length > 0 ? (
                    <img
                      src={gallery[0]}
                      alt={product.name ?? "Product image"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                      Image coming soon
                    </div>
                  )}
                </div>

                {gallery.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {gallery.slice(1, 5).map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                      >
                        <img
                          src={image}
                          alt={`${product.name ?? "Product"} thumbnail ${
                            index + 1
                          }`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  {product.category?.name && (
                    <Badge variant="secondary" className="w-fit">
                      {product.category.name}
                    </Badge>
                  )}
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    {product.name ?? "Untitled product"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {product.code && <span>Code: {product.code}</span>}
                    {product.type && <span>Type: {product.type}</span>}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <p className="text-3xl font-bold text-foreground md:text-4xl">
                    {formatCurrency(product.unitPrice)}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>{averageRating ?? "Not rated"}</span>
                    {reviewsCount > 0 && <span>({reviewsCount} reviews)</span>}
                  </div>
                  <Badge variant={inStock ? "default" : "secondary"}>
                    {inStock ? "In stock" : "Out of stock"}
                  </Badge>
                </div>

                {product.description && (
                  <Card>
                    <CardContent className="prose max-w-none p-6 text-sm leading-6 text-muted-foreground">
                      {product.description}
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <SummaryItem
                    label="Created"
                    value={formatDate(product.createdAt)}
                  />
                  <SummaryItem
                    label="Inventory"
                    value={
                      product.remainder != null
                        ? `${product.remainder} available`
                        : "—"
                    }
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="flex-1"
                    disabled={!inStock || !product?._id}
                    onClick={handleAddToCart}
                  >
                    Add to cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    asChild
                  >
                    <Link href="/products">Continue shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {product && similarProducts.length > 0 && (
            <section className="mt-16 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">
                  You might also like
                </h2>
                <Button variant="ghost" asChild>
                  <Link href="/products">View all</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {similarProducts.slice(0, 4).map((item) => (
                  <Card
                    key={item._id}
                    className="group overflow-hidden border border-border transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {item.attachment?.url ? (
                        <img
                          src={item.attachment.url}
                          alt={item.name ?? "Similar product"}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          Image coming soon
                        </div>
                      )}
                    </div>
                    <CardContent className="space-y-3 p-4">
                      <div className="space-y-1">
                        <p className="line-clamp-2 text-sm font-medium text-foreground">
                          {item.name ?? "Untitled product"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(
                            typeof item.unitPrice === "number"
                              ? item.unitPrice
                              : null
                          )}
                        </p>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Link href={`/products/${item._id}`}>View</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
