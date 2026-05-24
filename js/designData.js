function createDesignData(template, briefData, apiImage) {
  const size = posterSizes[briefData.posterType] || posterSizes.instagram;

  return {
    posterType: briefData.posterType,
    niche: briefData.niche,

    width: size.width,
    height: size.height,

    background: template.background,
    accent: template.accent,
    text: template.text,
    layout: template.layout,

    apiImage: apiImage,

    variation: template.variation || 1,

    businessName: {
      text: briefData.businessName || ""
    },

    headline: {
      text: briefData.headline || ""
    },

    subHeading: {
      text: briefData.subHeading || ""
    },

    offer: {
      text: briefData.offer || ""
    },

    cta: {
      text: briefData.cta || ""
    },

    phone: {
      text: briefData.phone || ""
    },

    website: {
      text: briefData.website || ""
    },

    address: {
      text: briefData.address || ""
    },

    logo: briefData.logo || "",
    productImage: briefData.productImage || ""
  };
}