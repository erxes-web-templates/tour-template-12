import { clsx, type ClassValue } from "clsx"
// import { useParams } from "next/navigation";
import { twMerge } from "tailwind-merge"
import { isBuildMode } from "./buildMode"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const uncapitalize = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export const getEnv = (): any => {
  const envs: any = {}

  if (typeof window !== "undefined") {
    const appVersion =
      localStorage.getItem(`builder_env_NEXT_PUBLIC_APP_VERSION`) || "SAAS"

    const envMaps = (window as any).envMaps || []

    if (appVersion === "SAAS") {
      const subdomain = window.location.hostname
        .replace(/(^\w+:|^)\/\//, "")
        .split(".")[0]

      for (const envMap of envMaps) {
        const value = localStorage.getItem(`builder_env_${envMap.name}`) ?? ""
        envs[envMap.name] = value.replace("<subdomain>", subdomain)
      }

      return envs
    }

    for (const envMap of envMaps) {
      envs[envMap.name] = localStorage.getItem(`builder_env_${envMap.name}`)
    }
  }

  return envs
}

export const getFileUrl = (url: string) => {
  if (!url) return ""
  if (!isBuildMode()) {
    return `${process.env.ERXES_FILE_URL}${url}`
  }
  if (typeof window === "undefined") {
    return `${process.env.NEXT_PUBLIC_API_DOMAIN}/read-file?key=${url}`
  }
  const env = getEnv()
  return `${env.NEXT_PUBLIC_API_DOMAIN}/read-file?key=${url}`
}

export const templateUrl = (slug: string) => {
  if (!isBuildMode()) {
    if (slug === "#") {
      return "#"
    }

    const normalized = slug.startsWith("/") ? slug : `/${slug}`
    return normalized === "/home" ? "/" : normalized
  }

  if (typeof window !== "undefined") {
    if (slug === "#") {
      return "#"
    } else {
      const url = new URL(window.location.href)
      const id = url.pathname.split("/").pop()

      const currentParams = new URLSearchParams(url.search)
      const templateId = currentParams.get("template")

      const newUrl = new URL(
        `/dashboard/projects/${id}`,
        window.location.origin
      )

      newUrl.searchParams.append("template", templateId || "")

      const sanitizedSlug = slug.replace(/^\//, "")

      if (sanitizedSlug === "") {
        newUrl.searchParams.append("pageName", "home")
      } else if (sanitizedSlug.includes("tours/")) {
        const tourId = sanitizedSlug.split("tours/")[1]
        newUrl.searchParams.append("pageName", "tour")
        newUrl.searchParams.append("tourId", tourId)
      } else {
        newUrl.searchParams.append("pageName", sanitizedSlug)
      }

      currentParams.forEach((value, key) => {
        if (key !== "template" && key !== "pageName" && key !== "tourId") {
          newUrl.searchParams.append(key, value)
        }
      })

      return decodeURIComponent(
        newUrl.toString().replace(window.location.origin, "")
      )
    }
  }
  throw new Error("window is undefined")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapSocialLinks(externalLinks: any) {
  const socials = {
    twitter: externalLinks.twitter,
    linkedin: externalLinks.linkedin,
    youtube: externalLinks.youtube,
    instagram: externalLinks.instagram,
    facebook: externalLinks.facebook,
    whatsapp: externalLinks.whatsapp,
  }

  // Filter out null values if desired
  const filteredSocials = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(socials).filter(([_, value]) => value !== null)
  )

  return filteredSocials
}

// export const templateUrl = (projectId: string, slug: string) => {
//   return `/dashboard/projects/${projectId}?template=tour-boilerplate&pageName=${slug}`;
// };

export const nationalities = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Andorran",
  "Angolan",
  "Antiguan",
  "Argentine",
  "Armenian",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bahamian",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Belarusian",
  "Belgian",
  "Belizean",
  "Beninese",
  "Bhutanese",
  "Bolivian",
  "Bosnian",
  "Botswanan",
  "Brazilian",
  "British",
  "Bruneian",
  "Bulgarian",
  "Burkinabe",
  "Burmese",
  "Burundian",
  "Cambodian",
  "Cameroonian",
  "Canadian",
  "Cape Verdean",
  "Central African",
  "Chadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Comoran",
  "Congolese",
  "Costa Rican",
  "Croatian",
  "Cuban",
  "Cypriot",
  "Czech",
  "Danish",
  "Djiboutian",
  "Dominican",
  "Dutch",
  "East Timorese",
  "Ecuadorean",
  "Egyptian",
  "Emirian",
  "Equatorial Guinean",
  "Eritrean",
  "Estonian",
  "Ethiopian",
  "Fijian",
  "Filipino",
  "Finnish",
  "French",
  "Gabonese",
  "Gambian",
  "Georgian",
  "German",
  "Ghanaian",
  "Greek",
  "Grenadian",
  "Guatemalan",
  "Guinean",
  "Guyanese",
  "Haitian",
  "Honduran",
  "Hungarian",
  "Icelandic",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kazakhstani",
  "Kenyan",
  "Kiribati",
  "North Korean",
  "South Korean",
  "Kuwaiti",
  "Kyrgyz",
  "Laotian",
  "Latvian",
  "Lebanese",
  "Liberian",
  "Libyan",
  "Liechtensteiner",
  "Lithuanian",
  "Luxembourgish",
  "Macedonian",
  "Malagasy",
  "Malawian",
  "Malaysian",
  "Maldivian",
  "Malian",
  "Maltese",
  "Marshallese",
  "Mauritanian",
  "Mauritian",
  "Mexican",
  "Micronesian",
  "Moldovan",
  "Monacan",
  "Mongolian",
  "Moroccan",
  "Mozambican",
  "Namibian",
  "Nauruan",
  "Nepalese",
  "New Zealand",
  "Nicaraguan",
  "Nigerian",
  "Nigerien",
  "Norwegian",
  "Omani",
  "Pakistani",
  "Palauan",
  "Panamanian",
  "Papua New Guinean",
  "Paraguayan",
  "Peruvian",
  "Polish",
  "Portuguese",
  "Qatari",
  "Romanian",
  "Russian",
  "Rwandan",
  "Saint Lucian",
  "Salvadoran",
  "Samoan",
  "San Marinese",
  "Sao Tomean",
  "Saudi",
  "Senegalese",
  "Serbian",
  "Seychellois",
  "Sierra Leonean",
  "Singaporean",
  "Slovakian",
  "Slovenian",
  "Solomon Islander",
  "Somali",
  "South African",
  "Spanish",
  "Sri Lankan",
  "Sudanese",
  "Surinamese",
  "Swazi",
  "Swedish",
  "Swiss",
  "Syrian",
  "Taiwanese",
  "Tajik",
  "Tanzanian",
  "Thai",
  "Togolese",
  "Tongan",
  "Trinidadian",
  "Tunisian",
  "Turkish",
  "Turkmen",
  "Tuvaluan",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Uzbekistani",
  "Vanuatuan",
  "Venezuelan",
  "Vietnamese",
  "Yemeni",
  "Zambian",
  "Zimbabwean",
]
