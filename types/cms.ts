interface CmsMenuList {
  _id: string;
  url: string;
  parentId: string;
  icon: string;
  kind: string;
  label: string;
  contentType: string;
  contentTypeID: string;
  order: number;
}

interface CmsMenuListVariables {
  clientPortalId: string;
  kind: string;
}

type MenuItem = {
  _id?: string;
  label: string;
  url?: string;
  parentId?: string;
  icon?: string;
  kind: string;
  contentType?: string;
  contentTypeID?: string;
  order: number;
  clientPortalId: string;
};

type CPDetail = {
  _id: string;
  name: string;
  description: string;
  copyright: string;
  logo?: string;
  styles: {
    baseColor: string;
    backgroundColor: string;
    headingFont: string;
    baseFont: string;
  };
  externalLinks: {
    phones: string[];
    emails: string[];
    address: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
    instagram: string;
    youtube: string;
  };
};

type CmsPost = {
  createdAt: string | number | Date;
  _id: string;
  slug: string;
  title: string;
  content: string;
  expert: string
  thumbnail: {
    url: string;
    name: string;
  };
};

export type { CmsMenuList, CmsMenuListVariables, MenuItem, CPDetail, CmsPost };
