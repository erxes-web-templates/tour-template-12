"use client";

import Link from "next/link";
import { useMemo, useCallback, useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery } from "@apollo/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useProductAverageReviewQuery,
  useProductDetailQuery,
  useProductSimilaritiesQuery,
} from "../../../graphql/products";
import { useCart } from "../../../lib/CartContext";
import authQueries from "@/app/dashboard/templates/ecommerce-boilerplate/graphql/auth/queries";
import productMutations from "@/app/dashboard/templates/ecommerce-boilerplate/graphql/products/mutations";
import { getFileUrl, templateUrl } from "../../../../../../../lib/utils";

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

const LAST_VIEWED_STORAGE_KEY = "wb:lastViewedProducts";
const MAX_LOCAL_LAST_VIEWED = 20;
type ButtonState = "idle" | "adding" | "added";

export default function ProductDetailPage() {
  const params = useParams<{ id?: string }>();
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId") ?? params.id;
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

  const product = productData?.poscProductDetail ?? null;
  const gallery = useMemo(() => {
    if (!product) {
      return [] as string[];
    }
    const images = [
      product.attachment?.url,
      ...(product.attachmentMore?.map((file) => file?.url || "") ?? []),
    ];
    return images
      .filter((url): url is string => Boolean(url))
      .map((url) => {
        try {
          return url;
        } catch (error) {
          return url;
        }
      });
  }, [product]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (gallery.length > 0) {
      setSelectedImage((current) => current ?? gallery[0]);
    } else {
      setSelectedImage(null);
    }
  }, [gallery]);

  const similarProducts = useMemo(() => {
    const items =
      similarityData?.poscProductSimilarities?.products?.filter(
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
  const { data: userData } = useQuery(authQueries.currentUser);
  const customerId = userData?.clientPortalCurrentUser?.erxesCustomerId ?? null;
  const [addToLastView] = useMutation(productMutations.addToLastView);
  const customFields = ((product as any)?.customFieldsData ?? {}) as Record<
    string,
    unknown
  >;
  const colorOptions = Array.isArray(customFields.colors)
    ? (customFields.colors as string[])
    : [];
  const [activeColor, setActiveColor] = useState<string | null>(
    colorOptions[0] ?? null
  );

  useEffect(() => {
    setActiveColor(colorOptions[0] ?? null);
  }, [colorOptions]);

  const derivedFeatures =
    Array.isArray(customFields.features) && customFields.features.length > 0
      ? (customFields.features as string[])
      : typeof product?.description === "string"
      ? product.description
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .slice(0, 6)
      : [];

  const detailSections = [
    {
      title: "Care",
      content: typeof customFields.care === "string" ? customFields.care : null,
    },
    {
      title: "Shipping",
      content:
        typeof customFields.shipping === "string"
          ? customFields.shipping
          : null,
    },
    {
      title: "Returns",
      content:
        typeof customFields.returns === "string" ? customFields.returns : null,
    },
  ].filter((section) => section.content);

  const getLocalLastViewed = useCallback((): string[] => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const raw = window.localStorage.getItem(LAST_VIEWED_STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0
        );
      }
    } catch (error) {
      console.warn("Failed to read last viewed products from storage", error);
    }
    return [];
  }, []);

  const saveLocalLastViewed = useCallback((items: string[]) => {
    if (typeof window === "undefined") {
      return;
    }
    if (!items.length) {
      window.localStorage.removeItem(LAST_VIEWED_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(LAST_VIEWED_STORAGE_KEY, JSON.stringify(items));
  }, []);

  const rememberLocally = useCallback(
    (productId: string) => {
      if (!productId) {
        return;
      }
      const current = getLocalLastViewed().filter((id) => id !== productId);
      current.push(productId);
      const trimmed = current.slice(-MAX_LOCAL_LAST_VIEWED);
      saveLocalLastViewed(trimmed);
    },
    [getLocalLastViewed, saveLocalLastViewed]
  );

  const flushLocalLastViewed = useCallback(
    async (customer: string) => {
      if (!customer) {
        return;
      }
      const pending = getLocalLastViewed();
      if (pending.length === 0) {
        return;
      }
      const results = await Promise.allSettled(
        pending.map((id) =>
          addToLastView({
            variables: {
              productId: id,
              customerId: customer,
            },
          })
        )
      );

      const hasFailure = results.some((result) => result.status === "rejected");
      if (!hasFailure) {
        saveLocalLastViewed([]);
      }
    },
    [addToLastView, getLocalLastViewed, saveLocalLastViewed]
  );

  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const addTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addTimerRef.current) {
        clearTimeout(addTimerRef.current);
      }
    };
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!product?._id || buttonState === "adding") {
      return;
    }

    const unitPrice =
      typeof product.unitPrice === "number" &&
      Number.isFinite(product.unitPrice)
        ? product.unitPrice
        : 0;

    setButtonState("adding");

    try {
      await Promise.all([
        Promise.resolve(
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
          )
        ),
        new Promise((resolve) => setTimeout(resolve, 400)),
      ]);

      setButtonState("added");
      if (addTimerRef.current) {
        clearTimeout(addTimerRef.current);
      }
      addTimerRef.current = setTimeout(() => {
        setButtonState("idle");
        addTimerRef.current = null;
      }, 1200);
    } catch (error) {
      console.error("Failed to add item to cart", error);
      setButtonState("idle");
    }
  }, [addToCart, buttonState, product]);

  useEffect(() => {
    if (!product?._id) {
      return;
    }

    if (customerId) {
      const run = async () => {
        try {
          await flushLocalLastViewed(customerId);
          await addToLastView({
            variables: {
              productId: product._id,
              customerId,
            },
          });
        } catch (error) {
          console.warn("Failed to update last viewed products", error);
        }
      };
      run();
      return;
    }

    rememberLocally(product._id);
  }, [
    product?._id,
    customerId,
    flushLocalLastViewed,
    addToLastView,
    rememberLocally,
  ]);

  const isLoading = productLoading || similarityLoading || reviewLoading;
  const hasError = Boolean(productError);

  return (
    <div className="mx-auto container px-4 py-10">
      <Button variant="ghost" asChild className="mb-6 w-fit">
        <Link
          href={templateUrl("/products")}
          className="flex items-center gap-2"
        >
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
            <div className="grid gap-10 lg:grid-cols-[minmax(0,520px)_1fr]">
              <div className="h-[520px] animate-pulse rounded-3xl border border-border bg-muted/40" />
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

          {product && (
            <div className="grid gap-12 lg:grid-cols-5">
              <div className="space-y-4 lg:col-span-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-muted shadow-sm lg:max-h-[800px] w-full mx-auto flex justify-center items-center">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.name ?? "Product image"}
                      className="h-full w-auto object-cover lg:max-h-[800px]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                      Image coming soon
                    </div>
                  )}
                </div>

                {gallery.length > 1 && (
                  <div className="grid grid-cols-6 gap-3">
                    {gallery.map((image, index) => (
                      <button
                        type="button"
                        key={`${image}-${index}`}
                        onClick={() => setSelectedImage(image)}
                        className={`relative aspect-square overflow-hidden rounded-xl border transition-all ${
                          selectedImage === image
                            ? "border-primary shadow-lg"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name ?? "Product"} thumbnail ${
                            index + 1
                          }`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="product-detail space-y-6">
                  {product.description && (
                    <Card>
                      <CardContent className="prose max-w-none p-6 text-sm leading-6 text-muted-foreground">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: product.description,
                          }}
                        />
                      </CardContent>
                    </Card>
                  )}
                  {gallery.length > 1 && (
                    <div className="gap-3">
                      {gallery.map((image, index) => (
                        <button
                          type="button"
                          key={`${image}-${index}`}
                          onClick={() => setSelectedImage(image)}
                          className={`relative aspect-square overflow-hidden rounded-xl transition-all`}
                        >
                          <img
                            src={image}
                            alt={`${product.name ?? "Product"} thumbnail ${
                              index + 1
                            }`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6 lg:col-span-2">
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
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <p className="text-3xl font-bold text-foreground md:text-4xl">
                    {formatCurrency(product.unitPrice)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${
                            averageRating &&
                            index < Math.round(Number(averageRating))
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-foreground">
                      {averageRating ?? "Not rated"}
                    </span>
                    {reviewsCount > 0 && <span>({reviewsCount} reviews)</span>}
                  </div>
                  <Badge variant={inStock ? "default" : "secondary"}>
                    {inStock ? "In stock" : "Out of stock"}
                  </Badge>
                </div>

                {colorOptions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Color</p>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          aria-label={`Select ${color}`}
                          onClick={() => setActiveColor(color)}
                          className={`h-9 w-9 rounded-full border-2 transition-all ${
                            activeColor === color
                              ? "scale-110 border-primary ring-2 ring-primary/30"
                              : "border-border"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="flex-1"
                    disabled={!product?._id || buttonState === "adding"}
                    onClick={handleAddToCart}
                  >
                    {buttonState === "adding"
                      ? "Adding..."
                      : buttonState === "added"
                      ? "Added to cart"
                      : "Add to cart"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    asChild
                  >
                    <Link href={templateUrl("/products")}>
                      Continue shopping
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-none rounded-full p-0 sm:w-14"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                {derivedFeatures.length > 0 && (
                  <div className="space-y-3 rounded-2xl border border-border bg-card/60 p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                      Features
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {derivedFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                          <span
                            dangerouslySetInnerHTML={{ __html: feature }}
                          ></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailSections.length > 0 && (
                  <Accordion
                    type="single"
                    collapsible
                    className="rounded-2xl border border-border bg-card/60 p-2"
                  >
                    {detailSections.map((section, index) => (
                      <AccordionItem
                        key={section.title}
                        value={`detail-${index}`}
                        className="border-b border-border last:border-b-0"
                      >
                        <AccordionTrigger className="text-base font-semibold">
                          {section.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {section.content as string}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
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
                  <Link href={templateUrl("/products")}>View all</Link>
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
                        <Link href={templateUrl(`/products/${item._id}`)}>
                          View
                        </Link>
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
