"use client";

import { useQuery } from "@apollo/client";
import { TOUR_DETAIL_QUERY } from "@/graphql/queries";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, MapPin, ChevronRight, Trash2, Clock, Users } from "lucide-react";

type Order = {
  _id: string;
  tourId?: string | null;
  amount?: number | null;
  status?: string | null;
  note?: string | null;
  numberOfPeople?: number | null;
  type?: string | null;
};

type ProfileOrdersTabProps = {
  orders: Order[];
  loading?: boolean;
};

// Аяллын нэрийг авах туслах компонент
const TourInfo = ({ tourId }: { tourId: string }) => {
  const { data, loading } = useQuery(TOUR_DETAIL_QUERY, {
    variables: { id: tourId },
    skip: !tourId,
  });

  const tour = data?.bmTourDetail;

  if (loading) return <span className="opacity-50">Ачааллаж байна...</span>;
  if (!tour) return <span>ID: {tourId.slice(-6)}</span>;

  return <span className="font-black  tracking-tight">{tour.name}</span>;
};

const ProfileOrdersTab = ({ orders, loading }: ProfileOrdersTabProps) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 animate-pulse">
          Захиалгуудыг ачааллаж байна...
        </p>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="py-20 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
        <Briefcase size={40} className="mx-auto mb-4 text-slate-200" />
        <p className="text-sm font-black  text-slate-400 uppercase tracking-tighter">
          Таны захиалгын түүх хоосон байна.
        </p>
        <Link href="/" className="inline-block mt-6 text-[10px] font-black uppercase tracking-widest text-[#692d91] border-b-2 border-purple-100 pb-1 hover:border-[#692d91] transition-all">
          Аялал харах
        </Link>
      </div>
    );
  }

  const handlePayNow = (order: Order) => {
    if (order.tourId) {
      router.push(`/booking?tourId=${order.tourId}&orderId=${order._id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black  tracking-tighter uppercase">
          Миний <span className="text-[#692d91]">Захиалгууд</span>
        </h3>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
          {orders.length} захиалга
        </span>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => {
          const isPending = order.status?.toLowerCase() === "pending";

          return (
            <div
              key={order._id}
              className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-[32px] border border-slate-100 bg-white hover:border-white hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-500"
            >
              {/* Status Badge */}
              <div className="absolute -top-3 left-8">
                <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm ${
                  isPending 
                    ? "bg-orange-50 text-orange-500 border border-orange-100" 
                    : "bg-green-50 text-green-600 border border-green-100"
                }`}>
                  {order.status ?? "Тодорхойгүй"}
                </span>
              </div>

              {/* Icon Section */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                isPending ? "bg-slate-50 text-slate-400" : "bg-purple-50 text-[#692d91]"
              }`}>
                <Briefcase size={24} />
              </div>

              {/* Main Info */}
              <div className="flex-grow space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  <span>ID: #{order._id.slice(-6)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {order.numberOfPeople || 1} хүн
                  </span>
                </div>
                
                <h4 className="text-xl font-black  tracking-tighter group-hover:text-[#692d91] transition-colors">
                  {order.tourId ? <TourInfo tourId={order.tourId} /> : "Тодорхойгүй аялал"}
                </h4>

                <div className="flex items-center gap-4 text-sm">
                  <span className="font-black text-lg tracking-tighter">
                    ₮{Number(order.amount || 0).toLocaleString()}
                  </span>
                  {order.type && (
                    <span className="text-[10px] font-black uppercase py-0.5 px-2 bg-slate-100 rounded text-slate-500">
                      {order.type}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0">
                {order.tourId && (
                  <Link href={`/tours/${order.tourId}`}>
                    <button className="px-5 py-2.5 rounded-xl border border-slate-100 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                      Дэлгэрэнгүй
                    </button>
                  </Link>
                )}
                
                {isPending && (
                  <button
                    onClick={() => handlePayNow(order)}
                    className="px-6 py-2.5 rounded-xl bg-[#692d91] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#522370] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-200"
                  >
                    Төлөх
                  </button>
                )}
                
                <div className="hidden md:block ml-2">
                  <ChevronRight size={20} className="text-slate-200 group-hover:text-[#692d91] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileOrdersTab;