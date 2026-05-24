const layouts = {
  "food-left-text": function (w, h) {
    const variation = window.currentVariation || 1;

    return {
      backgroundOverlay: "rgba(0,0,0,0.48)",

      glow: {
        type: "circle",
        left: variation === 2 ? w * 0.55 : w * 0.72,
        top: variation === 3 ? h * 0.55 : -h * 0.12,
        radius: w * 0.22
      },

      business: {
        left: w * 0.07,
        top: variation === 2 ? h * 0.06 : h * 0.07,
        width: w * 0.6,
        fontSize: w * 0.038,
        align: "left"
      },

      headline: {
        left: w * 0.07,
        top: variation === 2 ? h * 0.16 : h * 0.2,
        width: w * 0.58,
        fontSize: variation === 3 ? w * 0.055 : w * 0.062,
        align: "left"
      },

      subHeading: {
        left: w * 0.07,
        top: variation === 2 ? h * 0.35 : h * 0.4,
        width: w * 0.56,
        fontSize: w * 0.03,
        align: "left"
      },

      offer: {
        left: w * 0.07,
        top: variation === 2 ? h * 0.47 : h * 0.52,
        width: w * 0.48,
        fontSize: w * 0.048,
        align: "left"
      },

      ctaBadge: {
        left: w * 0.07,
        top: variation === 2 ? h * 0.67 : h * 0.72,
        width: w * 0.3,
        height: h * 0.085
      },

      cta: {
        left: w * 0.09,
        top: variation === 2 ? h * 0.687 : h * 0.737,
        width: w * 0.26,
        fontSize: w * 0.03
      },

      contact: {
        left: w * 0.07,
        top: h * 0.89,
        width: w * 0.78,
        fontSize: w * 0.024,
        align: "left"
      },

      product: {
        left: variation === 3 ? w * 0.52 : w * 0.58,
        top: variation === 2 ? h * 0.36 : h * 0.4,
        width: variation === 3 ? w * 0.42 : w * 0.36
      },

      logo: {
        left: w * 0.82,
        top: h * 0.055,
        width: w * 0.13
      }
    };
  },

  "food-center-offer": function (w, h) {
    const variation = window.currentVariation || 1;

    return {
      backgroundOverlay: "rgba(0,0,0,0.48)",

      glow: {
        type: "circle",
        left: variation === 2 ? w * 0.55 : w * 0.34,
        top: variation === 3 ? h * 0.2 : h * 0.58,
        radius: w * 0.24
      },

      business: {
        left: w * 0.18,
        top: h * 0.07,
        width: w * 0.64,
        fontSize: w * 0.036,
        align: "center"
      },

      headline: {
        left: variation === 3 ? w * 0.08 : w * 0.12,
        top: variation === 2 ? h * 0.17 : h * 0.2,
        width: variation === 3 ? w * 0.84 : w * 0.76,
        fontSize: variation === 3 ? w * 0.055 : w * 0.06,
        align: "center"
      },

      subHeading: {
        left: w * 0.2,
        top: variation === 2 ? h * 0.35 : h * 0.39,
        width: w * 0.6,
        fontSize: w * 0.03,
        align: "center"
      },

      offer: {
        left: w * 0.24,
        top: variation === 2 ? h * 0.48 : h * 0.52,
        width: w * 0.52,
        fontSize: w * 0.052,
        align: "center"
      },

      ctaBadge: {
        left: w * 0.35,
        top: variation === 2 ? h * 0.68 : h * 0.73,
        width: w * 0.3,
        height: h * 0.085
      },

      cta: {
        left: w * 0.37,
        top: variation === 2 ? h * 0.697 : h * 0.747,
        width: w * 0.26,
        fontSize: w * 0.03
      },

      contact: {
        left: w * 0.12,
        top: h * 0.9,
        width: w * 0.76,
        fontSize: w * 0.024,
        align: "center"
      },

      product: {
        left: variation === 3 ? w * 0.23 : w * 0.31,
        top: variation === 2 ? h * 0.54 : h * 0.58,
        width: variation === 3 ? w * 0.5 : w * 0.38
      },

      logo: {
        left: w * 0.82,
        top: h * 0.055,
        width: w * 0.13
      }
    };
  },

  "product-right": function (w, h) {
    const variation = window.currentVariation || 1;

    return {
      backgroundOverlay: "rgba(0,0,0,0.48)",

      glow: {
        type: "rect",
        left: variation === 2 ? w * 0.5 : w * 0.57,
        top: 0,
        width: variation === 2 ? w * 0.5 : w * 0.43,
        height: h
      },

      business: {
        left: w * 0.07,
        top: h * 0.07,
        width: w * 0.56,
        fontSize: w * 0.036,
        align: "left"
      },

      headline: {
        left: w * 0.07,
        top: variation === 3 ? h * 0.16 : h * 0.2,
        width: variation === 3 ? w * 0.62 : w * 0.52,
        fontSize: variation === 3 ? w * 0.052 : w * 0.058,
        align: "left"
      },

      subHeading: {
        left: w * 0.07,
        top: variation === 3 ? h * 0.36 : h * 0.42,
        width: w * 0.5,
        fontSize: w * 0.03,
        align: "left"
      },

      offer: {
        left: w * 0.07,
        top: variation === 3 ? h * 0.49 : h * 0.54,
        width: w * 0.45,
        fontSize: w * 0.048,
        align: "left"
      },

      ctaBadge: {
        left: w * 0.07,
        top: variation === 3 ? h * 0.68 : h * 0.74,
        width: w * 0.3,
        height: h * 0.085
      },

      cta: {
        left: w * 0.09,
        top: variation === 3 ? h * 0.697 : h * 0.757,
        width: w * 0.26,
        fontSize: w * 0.03
      },

      contact: {
        left: w * 0.07,
        top: h * 0.9,
        width: w * 0.75,
        fontSize: w * 0.024,
        align: "left"
      },

      product: {
        left: variation === 2 ? w * 0.52 : w * 0.6,
        top: variation === 3 ? h * 0.32 : h * 0.38,
        width: variation === 2 ? w * 0.42 : w * 0.34
      },

      logo: {
        left: w * 0.82,
        top: h * 0.055,
        width: w * 0.13
      }
    };
  },

  "luxury-center": function (w, h) {
    const variation = window.currentVariation || 1;

    return {
      backgroundOverlay: "rgba(0,0,0,0.48)",

      glow: {
        type: "circle",
        left: variation === 2 ? w * 0.18 : w * 0.34,
        top: variation === 3 ? h * 0.18 : h * 0.55,
        radius: w * 0.24
      },

      business: {
        left: w * 0.2,
        top: h * 0.08,
        width: w * 0.6,
        fontSize: w * 0.034,
        align: "center"
      },

      headline: {
        left: variation === 3 ? w * 0.1 : w * 0.13,
        top: variation === 2 ? h * 0.18 : h * 0.23,
        width: variation === 3 ? w * 0.8 : w * 0.74,
        fontSize: variation === 3 ? w * 0.05 : w * 0.055,
        align: "center"
      },

      subHeading: {
        left: w * 0.2,
        top: variation === 2 ? h * 0.38 : h * 0.44,
        width: w * 0.6,
        fontSize: w * 0.028,
        align: "center"
      },

      offer: {
        left: w * 0.28,
        top: variation === 2 ? h * 0.5 : h * 0.56,
        width: w * 0.44,
        fontSize: w * 0.046,
        align: "center"
      },

      ctaBadge: {
        left: w * 0.35,
        top: variation === 2 ? h * 0.7 : h * 0.76,
        width: w * 0.3,
        height: h * 0.085
      },

      cta: {
        left: w * 0.37,
        top: variation === 2 ? h * 0.717 : h * 0.777,
        width: w * 0.26,
        fontSize: w * 0.03
      },

      contact: {
        left: w * 0.12,
        top: h * 0.9,
        width: w * 0.76,
        fontSize: w * 0.023,
        align: "center"
      },

      product: {
        left: variation === 3 ? w * 0.25 : w * 0.34,
        top: variation === 2 ? h * 0.52 : h * 0.58,
        width: variation === 3 ? w * 0.5 : w * 0.32
      },

      logo: {
        left: w * 0.82,
        top: h * 0.055,
        width: w * 0.13
      }
    };
  },

  "brand-hero-premium": function (w, h) {
  return {
    backgroundOverlay: "rgba(0,0,0,0.62)",

    glow: {
      type: "circle",
      left: w * 0.72,
      top: h * 0.1,
      radius: w * 0.22
    },

    business: {
      left: w * 0.07,
      top: h * 0.07,
      width: w * 0.55,
      fontSize: w * 0.035,
      align: "left"
    },

    headline: {
      left: w * 0.07,
      top: h * 0.26,
      width: w * 0.55,
      fontSize: w * 0.075,
      align: "left"
    },

    subHeading: {
      left: w * 0.07,
      top: h * 0.57,
      width: w * 0.52,
      fontSize: w * 0.03,
      align: "left"
    },

    offer: {
      left: w * 0.07,
      top: h * 0.68,
      width: w * 0.42,
      fontSize: w * 0.045,
      align: "left"
    },

    ctaBadge: {
      left: w * 0.68,
      top: h * 0.68,
      width: w * 0.22,
      height: h * 0.15
    },

    cta: {
      left: w * 0.695,
      top: h * 0.71,
      width: w * 0.19,
      fontSize: w * 0.03
    },

    contact: {
      left: w * 0.07,
      top: h * 0.9,
      width: w * 0.82,
      fontSize: w * 0.022,
      align: "left"
    },

    product: {
      left: w * 0.56,
      top: h * 0.16,
      width: w * 0.38
    },

    logo: {
      left: w * 0.05,
      top: h * 0.05,
      width: w * 0.1
    }
  };
}
};