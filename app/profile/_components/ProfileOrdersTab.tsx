"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { TOUR_DETAIL_QUERY } from "@/graphql/queries";
import { useRouter } from "next/navigation";

type Order = {
  _id: string;
  branchId?: string | null;
  customerId?: string | null;
  tourId?: string | null;
  amount?: number | null;
  status?: string | null;
  note?: string | null;
  numberOfPeople?: number | null;
  type?: string | null;
  additionalCustomers?: any;
  isChild?: boolean | null;
  parent?: string | null;
};

type ProfileOrdersTabProps = {
  orders: Order[];
  loading?: boolean;
};

const TourInfo = ({ tourId }: { tourId: string }) => {
  const { data, loading } = useQuery(TOUR_DETAIL_QUERY, {
    variables: { id: tourId },
    skip: !tourId,
  });

  const tour = data?.bmTourDetail;

  if (loading) {
    return <span className="font-medium">Ачааллаж байна...</span>;
  }

  if (!tour) {
    return <span className="font-medium">{tourId}</span>;
  }

  return (
    <span className="font-medium">
      {tour.name} (ID: {tour._id})
    </span>
  );
};

const ProfileOrdersTab = ({ orders, loading }: ProfileOrdersTabProps) => {
  const router = useRouter();

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Захиалгуудыг ачааллаж байна…
      </p>
    );
  }

  if (!orders?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Таны захиалгын түүх хоосон байна.
      </p>
    );
  }

  const handlePayNow = (order: Order) => {
    if (order.tourId) {
      router.push(`/booking?tourId=${order.tourId}&orderId=${order._id}`);
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order._id} className="border border-muted">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">
                Захиалга #{order._id.slice(-6)}
              </CardTitle>
              <CardDescription>
                Нийт:{" "}
                <span className="font-medium text-foreground">
                  ₮{Number(order.amount || 0).toLocaleString()}
                </span>
                {order.numberOfPeople && (
                  <span className="ml-2">
                    · {order.numberOfPeople} хүн
                  </span>
                )}
              </CardDescription>
            </div>
            <Badge variant="outline">
              {order.status ?? "Төлөв тодорхойгүй"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2 text-sm">
              {order.tourId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Аялал:</span>
                  <TourInfo tourId={order.tourId} />
                </div>
              )}
              {order.type && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Төрөл:</span>
                  <span className="font-medium">{order.type}</span>
                </div>
              )}
              {order.note && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Тэмдэглэл:</span>
                  <span className="text-sm">{order.note}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {order.tourId && (
              <Link href={`/tours/${order.tourId}`}>
                <Button variant="outline" size="sm">
                  Дэлгэрэнгүй харах
                </Button>
              </Link>
            )}
            {order.status?.toLowerCase() === "pending" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handlePayNow(order)}
              >
                Төлөх
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProfileOrdersTab;
