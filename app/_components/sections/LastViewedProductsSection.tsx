"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { Section } from "../../../types/sections";
import authQueries from "../../../graphql/auth/queries";
import orderQueries from "../../../graphql/order/queries";
import { getFileUrl, templateUrl } from "../../../../../../../lib/utils";
import EmptyState from "../../../../../../../components/common/EmptyState";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ViewedProduct = {
  _id: string;
  updatedAt?: string | null;
  product?: {
    _id?: string | null;
    name?: string | null;
    description?: string | null;
    unitPrice?: number | null;
    attachment?: {
      url?: string | null;
    } | null;
    createdAt?: string | null;
  } | null;
};

const formatNumber = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "₮0";
  }
  return `₮${Math.round(value).toLocaleString()}`;
};

const LastViewedProductsSection = ({ section }: { section: Section }) => {
  const title = section.config?.title ?? "Recently viewed products";
  const description = section.config?.description ?? "";
  const limit = Math.max(1, Number(section.config?.limit ?? 6));
  const fallbackCustomerId: string | null = section.config?.customerId ?? null;

  const { data: userData } = useQuery(authQueries.currentUser);
  const resolvedCustomerId =
    userData?.clientPortalCurrentUser?.erxesCustomerId ?? fallbackCustomerId;

  const {
    data: viewedData,
    loading,
    error,
  } = useQuery(orderQueries.getLastProductView, {
    variables: {
      customerId: resolvedCustomerId ?? "",
      limit,
    },
    skip: !resolvedCustomerId,
    fetchPolicy: "cache-and-network",
  });

  const viewedItems: ViewedProduct[] = useMemo(
    () => viewedData?.lastViewedItems ?? [],
    [viewedData]
  );

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-3 text-base text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {!resolvedCustomerId ? (
          <EmptyState
            title="Sign in to see recently viewed products"
            description="Log in to keep track of the items you've explored."
          />
        ) : error ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            Unable to load recently viewed products right now. Please try again
            later.
          </div>
        ) : !loading && viewedItems.length === 0 ? (
          <EmptyState
            title="No viewed products yet"
            description="Start browsing products to see them appear here."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(loading
              ? Array.from({ length: Math.min(limit, 6) })
              : viewedItems
            ).map((entry: any, index) => {
              if (loading) {
                return (
                  <Card key={`placeholder-${index}`} className="animate-pulse">
                    <CardHeader className="h-40 bg-muted/60" />
                    <CardContent className="space-y-3">
                      <div className="h-4 w-3/4 rounded bg-muted/80" />
                      <div className="h-3 w-1/2 rounded bg-muted/60" />
                      <div className="h-3 w-1/3 rounded bg-muted/50" />
                    </CardContent>
                    <CardFooter className="h-10 bg-muted/40" />
                  </Card>
                );
              }

              const product = entry?.product;
              const imageKey = product?.attachment?.url;
              const imageUrl = imageKey ? getFileUrl(imageKey) : null;
              const viewedAt = entry?.updatedAt || product?.createdAt || null;

              return (
                <Card
                  key={entry?._id ?? `viewed-${index}`}
                  className="flex h-full flex-col overflow-hidden border border-muted/60"
                >
                  <div className="relative h-48 w-full bg-muted">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={product?.name ?? "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No image available
                      </div>
                    )}
                  </div>
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-base font-semibold">
                      {product?.name ?? "Untitled product"}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {product?.description ?? "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="font-medium text-foreground">
                      Price: {formatNumber(product?.unitPrice)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last viewed:{" "}
                      {viewedAt
                        ? new Date(viewedAt).toLocaleString()
                        : "Unknown"}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto justify-end gap-2 border-t bg-muted/40 p-4">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={templateUrl(
                          `/products${
                            product?._id ? `?highlight=${product._id}` : ""
                          }`
                        )}
                      >
                        View product
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default LastViewedProductsSection;
