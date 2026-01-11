"use client";

import { useSearchParams } from "next/navigation";

import usePage from "@templates/template-boilerplate/lib/usePage";

export default function TourBoilerPlateHome() {
  const searchParams = useSearchParams();

  const pageName = searchParams.get("pageName"); //pageName = about, tours, contact etc
  const PageContent = usePage(pageName);

  console.log("about", pageName);
  return (
    <div>
      <PageContent />
    </div>
  );
}
