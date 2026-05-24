function isBengali(text) {
  return /[\u0980-\u09FF]/.test(text);
}

function getFont(text, fallback) {
  return isBengali(text) ? "Noto Sans Bengali" : fallback;
}

function coverImage(img, boxWidth, boxHeight) {
  const scale = Math.max(boxWidth / img.width, boxHeight / img.height);

  img.set({
    originX: "center",
    originY: "center",
    left: boxWidth / 2,
    top: boxHeight / 2,
    scaleX: scale,
    scaleY: scale,
    selectable: false,
    evented: false
  });
}

function createFabricText(text, options) {
  return new fabric.Textbox(text, {
    left: options.left,
    top: options.top,
    width: options.width,
    fontSize: options.fontSize,
    fill: options.fill || "#ffffff",
    fontFamily: options.fontFamily || "Montserrat",
    fontWeight: options.fontWeight || "700",
    textAlign: options.textAlign || "left",
    charSpacing: options.charSpacing || 0,
    lineHeight: options.lineHeight || 1.05,
    originY: "top",
    editable: true,
    opacity: options.opacity || 1,
    shadow: options.shadow === false ? null : new fabric.Shadow({
      color: "rgba(0,0,0,0.75)",
      blur: 18,
      offsetX: 0,
      offsetY: 7
    })
  });
}

function getThemeColors(category) {
  const themes = {
    school: {
      title: "#ffffff",
      sub: "#e8e8e8",
      accent: "#d4af37",
      buttonText: "#111111"
    },
    professional: {
      title: "#ffffff",
      sub: "#d6d6d6",
      accent: "#d4af37",
      buttonText: "#111111"
    },
    advocate: {
      title: "#ffffff",
      sub: "#d6d6d6",
      accent: "#d4af37",
      buttonText: "#111111"
    },
    food: {
      title: "#ffffff",
      sub: "#fff3d6",
      accent: "#ff7a00",
      buttonText: "#111111"
    },
    gym: {
      title: "#ffffff",
      sub: "#dddddd",
      accent: "#ff2d2d",
      buttonText: "#ffffff"
    },
    product: {
      title: "#ffffff",
      sub: "#eeeeee",
      accent: "#00e5ff",
      buttonText: "#111111"
    },
    business: {
      title: "#ffffff",
      sub: "#dddddd",
      accent: "#00e5ff",
      buttonText: "#111111"
    },
    retail: {
      title: "#ffffff",
      sub: "#eeeeee",
      accent: "#ffcc00",
      buttonText: "#111111"
    },
    festival: {
      title: "#ffffff",
      sub: "#fff3d6",
      accent: "#ffcc00",
      buttonText: "#111111"
    }
  };

  return themes[category] || themes.professional;
}

function addDecoration(canvas, w, h, accent) {
  canvas.add(new fabric.Circle({
    left: w * 0.72,
    top: -h * 0.15,
    radius: w * 0.22,
    fill: accent,
    opacity: 0.13,
    selectable: false,
    evented: false
  }));

  canvas.add(new fabric.Polygon(
    [
      { x: w * 0.74, y: 0 },
      { x: w, y: 0 },
      { x: w, y: h },
      { x: w * 0.88, y: h }
    ],
    {
      fill: "rgba(255,255,255,0.035)",
      selectable: false,
      evented: false
    }
  ));

  canvas.add(new fabric.Rect({
    left: w * 0.04,
    top: h * 0.04,
    width: w * 0.92,
    height: h * 0.92,
    fill: "transparent",
    stroke: "rgba(255,255,255,0.16)",
    strokeWidth: 3,
    selectable: false,
    evented: false
  }));

  canvas.add(new fabric.Rect({
    left: w * 0.07,
    top: h * 0.18,
    width: w * 0.18,
    height: 5,
    fill: accent,
    rx: 4,
    ry: 4,
    selectable: false,
    evented: false
  }));
}

function renderPoster(canvas, designData) {
  canvas.clear();

  const w = designData.width || 1080;
  const h = designData.height || 1080;

  const layoutName = designData.layout || "food-left-text";
  const layoutFunction = layouts[layoutName] || layouts["food-left-text"];

  window.currentVariation = designData.variation || 1;

  const layout = layoutFunction(w, h);

  const category = designData.category || "professional";
  const colors = getThemeColors(category);

 const accent =
  designData.dynamicStyle?.accent
  || designData.accent
  || colors.accent;

  const bg = new fabric.Rect({
    left: 0,
    top: 0,
    width: w,
    height: h,
    fill: designData.background || "#05070d",
    selectable: false,
    evented: false
  });

  canvas.add(bg);

  if (designData.apiImage) {
    fabric.Image.fromURL(
      designData.apiImage,
      function (img) {
        coverImage(img, w, h);

        canvas.add(img);
        img.sendToBack();
        bg.sendToBack();

        const overlay = new fabric.Rect({
          left: 0,
          top: 0,
          width: w,
          height: h,
          fill: new fabric.Gradient({
            type: "linear",
            coords: { x1: 0, y1: 0, x2: w, y2: h },
            colorStops: [
              { offset: 0, color: "rgba(0,0,0,0.72)" },
              { offset: 0.5, color: "rgba(0,0,0,0.52)" },
              { offset: 1, color: "rgba(0,0,0,0.74)" }
            ]
          }),
          selectable: false,
          evented: false
        });

        canvas.add(overlay);

        canvas.getObjects().forEach(function (obj) {
          if (obj.type === "textbox" || obj.type === "text") {
            canvas.bringToFront(obj);
          }
        });

        canvas.renderAll();
      },
      { crossOrigin: "anonymous" }
    );
  }

  addDecoration(canvas, w, h, accent);

  const business = designData.businessName?.text || "";
  const headline = designData.headline?.text || "";
  const sub = designData.subHeading?.text || "";
  const offer = designData.offer?.text || "";
  const cta = designData.cta?.text || "";

  const phone = designData.phone?.text || "";
  const website = designData.website?.text || "";
  const address = designData.address?.text || "";

  const contact = [phone, website, address]
    .filter(Boolean)
    .join("  •  ");

  if (business.trim()) {
    canvas.add(createFabricText(business.toUpperCase(), {
      ...layout.business,
      fill: accent,
      fontSize: Math.min(layout.business.fontSize, w * 0.035),
     fontFamily: getFont(business, designData.font || "Montserrat"),
      fontWeight: "900",
      textAlign: layout.business.align,
      charSpacing: 140,
      lineHeight: 1,
      opacity: 0.98
    }));
  }

  if (headline.trim()) {
    canvas.add(createFabricText(designData.dynamicStyle?.fonts?.transform === "uppercase"
  ? headline.toUpperCase()
  : headline, {
      ...layout.headline,
      fill: colors.title,
      fontSize: Math.min(layout.headline.fontSize, w * 0.062),
    fontFamily:
getFont(
headline,

designData
.dynamicStyle
?.fonts
?.title

|| "Anton"
),
      fontWeight:
designData.dynamicStyle
?.fonts
?.titleWeight
|| "900",
      textAlign: layout.headline.align,
 charSpacing:
designData.dynamicStyle
?.spacing
?.title
|| 80,
      lineHeight: 1
    }));
  }

  if (sub.trim()) {
    canvas.add(createFabricText(sub, {
      ...layout.subHeading,
      fill: colors.sub,
      fontSize: Math.min(layout.subHeading.fontSize, w * 0.03),
      fontFamily:
getFont(
sub,

designData
.dynamicStyle
?.fonts
?.body

|| "Poppins"
),
      fontWeight:
designData.dynamicStyle
?.fonts
?.bodyWeight
|| "700",
      textAlign: layout.subHeading.align,
      charSpacing:
designData
.dynamicStyle
?.spacing
?.sub
|| 8,
      lineHeight: 1.5
    }));
  }

  if (offer.trim()) {
    canvas.add(createFabricText(offer.toUpperCase(), {
      ...layout.offer,
      fill: accent,
      fontSize: Math.min(layout.offer.fontSize, w * 0.048),
      fontFamily: getFont(offer, designData.font || "Bebas Neue"),
      fontWeight: "900",
      textAlign: layout.offer.align,
     charSpacing: 90,
      lineHeight: 1
    }));
  }

  if (cta.trim()) {
    const badge = new fabric.Rect({
      left: layout.ctaBadge.left,
      top: layout.ctaBadge.top,
      width: layout.ctaBadge.width,
      height: layout.ctaBadge.height,
      fill: new fabric.Gradient({
        type: "linear",
        coords: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: layout.ctaBadge.height
        },
        colorStops: [
          { offset: 0, color: "#ffdd55" },
          { offset: 1, color: accent }
        ]
      }),
      rx: 28,
      ry: 28,
      selectable: false,
      evented: false,
      shadow: new fabric.Shadow({
        color: "rgba(0,0,0,0.45)",
        blur: 16,
        offsetX: 0,
        offsetY: 8
      })
    });

    const ctaText = createFabricText(cta.toUpperCase(), {
      ...layout.cta,
      fill: colors.buttonText,
      fontFamily: getFont(cta, "Montserrat"),
      fontWeight: "900",
      textAlign: "center",
 charSpacing:
designData.dynamicStyle
?.spacing
?.cta
|| 40,
      lineHeight: 1,
      shadow: false
    });

    canvas.add(badge, ctaText);
  }

  if (contact.trim() && layout.contact) {
    canvas.add(createFabricText(contact, {
      ...layout.contact,
      fill: "#ffffff",
      fontSize: Math.min(layout.contact.fontSize, w * 0.024),
      fontFamily: getFont(contact, "Poppins"),
      fontWeight: "700",
      textAlign: layout.contact.align,
      charSpacing: 10,
      lineHeight: 1.2
    }));
  }

  canvas.getObjects().forEach(function (obj) {
    if (obj.type === "textbox" || obj.type === "text") {
      canvas.bringToFront(obj);
    }
  });

  canvas.renderAll();
}