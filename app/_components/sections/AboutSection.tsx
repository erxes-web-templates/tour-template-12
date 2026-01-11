import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { Section } from "../../../types/sections";
import { getFileUrl, templateUrl } from "@/lib/utils";
import { toHtml } from "../../../lib/html";
import { isBuildMode } from "../../../lib/buildMode";
import Link from "next/link";

const AboutSection = ({ section }: { section: Section }) => {
  const isImageLeft = section.config.imagePosition === "left";
  const isBuilder = isBuildMode();
  const ctaHref = section.config.primaryCtaUrl
    ? isBuilder
      ? templateUrl(section.config.primaryCtaUrl)
      : section.config.primaryCtaUrl
    : "#";

  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {section.config.title}
        </h2>
        <div className="flex flex-wrap items-center">
          {isImageLeft && (
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              {section.config.image && (
                <Image
                  src={
                    getFileUrl(section.config.image.url) ||
                    section.config.image.initUrl
                  }
                  alt="Beautiful landscape"
                  width={600}
                  height={600}
                />
              )}
            </div>
          )}
          <div
            className={`w-full md:w-1/2 ${isImageLeft ? "md:pl-8" : "md:pr-8"}`}
          >
            <p
              className="text-lg mb-4"
              dangerouslySetInnerHTML={toHtml(section.config.description)}
            ></p>
            {section.config.primaryCtaUrl && (
              <Link href={ctaHref}>
                <Button>{section.config.primaryCta}</Button>
              </Link>
            )}
          </div>
          {!isImageLeft && (
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              {section.config.image && (
                <Image
                  src={
                    getFileUrl(section.config.image.url) ||
                    section.config.image.initUrl
                  }
                  alt="Beautiful landscape"
                  width={600}
                  height={600}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
