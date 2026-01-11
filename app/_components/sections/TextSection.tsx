import { Button } from "@/components/ui/button";
import React from "react";
import { Section } from "../../../types/sections";
import { templateUrl } from "@/lib/utils";
import Link from "next/link";

const TextSection = ({ section }: { section: Section }) => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{section.config.title}</h2>
        <div className="flex flex-wrap items-center">
          <div className={`w-full md:max-w-6xl mx-auto `}>
            <p className="text-lg mb-4" dangerouslySetInnerHTML={{ __html: section.config.description }}></p>
            {section.config.primaryCtaUrl && (
              <Link href={templateUrl(section.config.primaryCtaUrl)}>
                <Button>{section.config.primaryCta}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextSection;
