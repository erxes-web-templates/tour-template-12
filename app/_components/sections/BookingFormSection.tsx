"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "../../../types/sections";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn, templateUrl } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Users, BedDouble, ChevronRight } from "lucide-react";
import { format } from "date-fns";

const BookingFormSection = ({ section }: { section: Section }) => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const today = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);

  const title = section.config?.title ?? section.content ?? "Book your stay";
  const description = section.config?.description ?? "Choose your dates to check availability.";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!startDate || !endDate) return;

    const base = templateUrl("/booking");
    const url = new URL(base, window.location.origin);
    url.searchParams.set("startDate", format(startDate, "yyyy-MM-dd"));
    url.searchParams.set("endDate", format(endDate, "yyyy-MM-dd"));
    url.searchParams.set("adults", String(adults));
    url.searchParams.set("children", String(children));
    url.searchParams.set("rooms", String(rooms));
    router.push(url.toString().replace(window.location.origin, ""));
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-100 text-[#692d91] rounded-full text-xs font-black uppercase tracking-widest">
            <CalendarIcon size={14} /> Захиалга өгөх
          </div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-tight">
            {title}
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <Card className="max-w-5xl mx-auto border-none shadow-[0_32px_64px_-15px_rgba(105,45,145,0.15)] rounded-[40px] overflow-hidden bg-white/80 backdrop-blur-md border border-purple-50">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-12 items-end">
              
              {/* Check-in Date */}
              <div className="md:col-span-3 space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Check-in</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-16 justify-start text-left font-bold rounded-2xl border-slate-100 hover:border-[#692d91] transition-all px-6",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-[#692d91]" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : <span>Эхлэх өдөр</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        if (endDate && date && endDate < date) setEndDate(undefined);
                      }}
                      disabled={(date) => date < today}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out Date */}
              <div className="md:col-span-3 space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Check-out</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-16 justify-start text-left font-bold rounded-2xl border-slate-100 hover:border-[#692d91] transition-all px-6",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-[#692d91]" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : <span>Дуусах өдөр</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < today || (startDate ? date < startDate : false)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests/Adults */}
              <div className="md:col-span-2 space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Adults</Label>
                <div className="relative">
                  <Users className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#692d91]" />
                  <Input
                    type="number"
                    min={1}
                    value={adults}
                    onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                    className="h-16 pl-14 font-bold rounded-2xl border-slate-100 focus:ring-[#692d91]"
                  />
                </div>
              </div>

              {/* Children */}
              <div className="md:col-span-2 space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Children</Label>
                <Input
                  type="number"
                  min={0}
                  value={children}
                  onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                  className="h-16 font-bold rounded-2xl border-slate-100"
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <Button 
                  type="submit" 
                  className="w-full h-16 bg-[#692d91] hover:bg-yellow-400 text-white hover:text-black rounded-2xl font-black uppercase italic tracking-tighter transition-all group shadow-lg hover:shadow-yellow-200"
                >
                  Шалгах
                  <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BookingFormSection;