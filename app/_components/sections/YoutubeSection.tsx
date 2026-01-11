import { Section } from "@/types/sections";
import React from "react";

const YoutubeSection = ({ section }: { section: Section }) => {
  const embedUrl = section.config.videoUrl.replace("watch?v=", "embed/");
  return (
    <section className="relative h-[600px]">
      <iframe
        className="w-full h-full"
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </section>
  );
};

export default YoutubeSection;
