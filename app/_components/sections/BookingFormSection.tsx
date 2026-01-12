"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "../../../types/sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { templateUrl } from "@/lib/utils";

const BookingFormSection = ({ section }: { section: Section }) => {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const title = section.config?.title ?? section.content ?? "Book your stay";
  const description =
    section.config?.description ?? "Choose your dates to check availability.";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!startDate || !endDate) {
      return;
    }

    const base = templateUrl("/booking");
    const url = new URL(base, window.location.origin);
    url.searchParams.set("startDate", startDate);
    url.searchParams.set("endDate", endDate);
    url.searchParams.set("adults", String(adults));
    url.searchParams.set("children", String(children));
    url.searchParams.set("rooms", String(rooms));
    router.push(url.toString().replace(window.location.origin, ""));
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Availability check</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 md:grid-cols-6"
            >
              <div className="space-y-2">
                <Label htmlFor="booking-start-date">Check-in</Label>
                <Input
                  id="booking-start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-end-date">Check-out</Label>
                <Input
                  id="booking-end-date"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-adults">Adults</Label>
                <Input
                  id="booking-adults"
                  type="number"
                  min={1}
                  value={adults}
                  onChange={(event) =>
                    setAdults(Math.max(1, Number(event.target.value)))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-children">Children</Label>
                <Input
                  id="booking-children"
                  type="number"
                  min={0}
                  value={children}
                  onChange={(event) =>
                    setChildren(Math.max(0, Number(event.target.value)))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-rooms">Rooms</Label>
                <Input
                  id="booking-rooms"
                  type="number"
                  min={1}
                  value={rooms}
                  onChange={(event) =>
                    setRooms(Math.max(1, Number(event.target.value)))
                  }
                  required
                />
              </div>
              <div className="flex items-end md:col-span-6">
                <Button type="submit" className="w-full">
                  Check rooms
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
