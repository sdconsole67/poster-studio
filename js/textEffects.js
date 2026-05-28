const premiumTextStyles = [
  { name: "Gold 3D", className: "style-gold", effect: "gold" },
  { name: "Glossy Gold", className: "style-glossy-gold", effect: "glossyGold" },
  { name: "Royal Gold", className: "style-royal-gold", effect: "royalGold" },
  { name: "Silver Shine", className: "style-silver", effect: "silver" },
  { name: "Chrome Silver", className: "style-chrome", effect: "chrome" },
  { name: "Diamond White", className: "style-diamond", effect: "diamond" },
  { name: "Neon Blue", className: "style-neon", effect: "neon" },
  { name: "Neon Pink", className: "style-pink", effect: "pink" },
  { name: "Fire Glow", className: "style-fire", effect: "fire" },
  { name: "Deep 3D", className: "style-3d", effect: "deep3d" },
  { name: "Black Stroke", className: "style-outline", effect: "outline" },
  { name: "Luxury Serif", className: "style-luxury", effect: "luxury" },
  { name: "Blue Tech", className: "style-tech", effect: "tech" },
  { name: "Red Power", className: "style-red", effect: "redPower" },
  { name: "Green Fresh", className: "style-green", effect: "greenFresh" },
  { name: "Purple Glow", className: "style-purple", effect: "purpleGlow" }
];

function renderTextStyleLibrary() {
  const grid = document.getElementById("textStyleGrid");
  if (!grid) return;

  grid.innerHTML = "";

  premiumTextStyles.forEach(function (style) {
    const card = document.createElement("div");
    card.className = `text-style-card ${style.className}`;

    card.innerHTML = `<span>${style.name}</span>`;

    card.onclick = function () {
      applyPremiumTextStyle(style.effect);
    };

    grid.appendChild(card);
  });
}

function applyPremiumTextStyle(effect) {
  const active = canvas.getActiveObject();

  if (!active || active.type !== "textbox") {
    alert("Please select a text first.");
    return;
  }

  const styles = {
    gold: {
      fill: "#ffd66b",
      stroke: "#5c3900",
      strokeWidth: 1.5,
      shadow: new fabric.Shadow({
        color: "rgba(255,204,0,0.55)",
        blur: 22,
        offsetX: 0,
        offsetY: 8
      }),
      fontFamily: "Cinzel",
      fontWeight: "900"
    },

    silver: {
      fill: "#f2f2f2",
      stroke: "#777777",
      strokeWidth: 1.2,
      shadow: new fabric.Shadow({
        color: "rgba(255,255,255,0.35)",
        blur: 18,
        offsetX: 0,
        offsetY: 6
      }),
      fontFamily: "Montserrat",
      fontWeight: "900"
    },

    neon: {
      fill: "#00e5ff",
      stroke: "#003844",
      strokeWidth: 1,
      shadow: new fabric.Shadow({
        color: "#00e5ff",
        blur: 30,
        offsetX: 0,
        offsetY: 0
      }),
      fontFamily: "Orbitron",
      fontWeight: "900"
    },

    fire: {
      fill: "#ff9f1c",
      stroke: "#7a2500",
      strokeWidth: 1.5,
      shadow: new fabric.Shadow({
        color: "rgba(255,80,0,0.75)",
        blur: 26,
        offsetX: 0,
        offsetY: 8
      }),
      fontFamily: "Anton",
      fontWeight: "900"
    },

    luxury: {
      fill: "#d4af37",
      stroke: "#111111",
      strokeWidth: 1,
      shadow: new fabric.Shadow({
        color: "rgba(0,0,0,0.75)",
        blur: 20,
        offsetX: 0,
        offsetY: 8
      }),
      fontFamily: "Georgia",
      fontWeight: "900"
    },

    outline: {
      fill: "#ffffff",
      stroke: "#111111",
      strokeWidth: 3,
      shadow: new fabric.Shadow({
        color: "rgba(0,0,0,0.45)",
        blur: 10,
        offsetX: 2,
        offsetY: 4
      }),
      fontFamily: "Archivo Black",
      fontWeight: "900"
    },

    pink: {
      fill: "#ff66c4",
      stroke: "#4d0030",
      strokeWidth: 1,
      shadow: new fabric.Shadow({
        color: "rgba(255,102,196,0.85)",
        blur: 28,
        offsetX: 0,
        offsetY: 0
      }),
      fontFamily: "Poppins",
      fontWeight: "900"
    },

    deep3d: {
      fill: "#ffffff",
      stroke: "#111111",
      strokeWidth: 2,
      shadow: new fabric.Shadow({
        color: "rgba(0,0,0,0.85)",
        blur: 0,
        offsetX: 8,
        offsetY: 8
      }),
      fontFamily: "Anton",
      fontWeight: "900"
    },

glossyGold: {
  fill: "#ffe08a",
  stroke: "#8a5a00",
  strokeWidth: 1.5,
  shadow: new fabric.Shadow({
    color: "rgba(255,215,80,0.75)",
    blur: 28,
    offsetX: 0,
    offsetY: 6
  }),
  fontFamily: "Cinzel",
  fontWeight: "900"
},

royalGold: {
  fill: "#d4af37",
  stroke: "#1a1200",
  strokeWidth: 2,
  shadow: new fabric.Shadow({
    color: "rgba(0,0,0,0.85)",
    blur: 18,
    offsetX: 4,
    offsetY: 8
  }),
  fontFamily: "Playfair Display",
  fontWeight: "900"
},

chrome: {
  fill: "#ffffff",
  stroke: "#777777",
  strokeWidth: 1.5,
  shadow: new fabric.Shadow({
    color: "rgba(255,255,255,0.55)",
    blur: 24,
    offsetX: 0,
    offsetY: 4
  }),
  fontFamily: "Archivo Black",
  fontWeight: "900"
},

diamond: {
  fill: "#ffffff",
  stroke: "#00e5ff",
  strokeWidth: 1,
  shadow: new fabric.Shadow({
    color: "rgba(0,229,255,0.75)",
    blur: 30,
    offsetX: 0,
    offsetY: 0
  }),
  fontFamily: "Montserrat",
  fontWeight: "900"
},

tech: {
  fill: "#4cc9f0",
  stroke: "#001d2b",
  strokeWidth: 1,
  shadow: new fabric.Shadow({
    color: "rgba(76,201,240,0.85)",
    blur: 24,
    offsetX: 0,
    offsetY: 0
  }),
  fontFamily: "Orbitron",
  fontWeight: "900"
},

redPower: {
  fill: "#ff2d2d",
  stroke: "#4b0000",
  strokeWidth: 1.5,
  shadow: new fabric.Shadow({
    color: "rgba(255,45,45,0.75)",
    blur: 24,
    offsetX: 0,
    offsetY: 6
  }),
  fontFamily: "Anton",
  fontWeight: "900"
},

greenFresh: {
  fill: "#00d084",
  stroke: "#003820",
  strokeWidth: 1.2,
  shadow: new fabric.Shadow({
    color: "rgba(0,208,132,0.75)",
    blur: 22,
    offsetX: 0,
    offsetY: 4
  }),
  fontFamily: "Poppins",
  fontWeight: "900"
},

purpleGlow: {
  fill: "#a66bff",
  stroke: "#23004d",
  strokeWidth: 1.2,
  shadow: new fabric.Shadow({
    color: "rgba(166,107,255,0.85)",
    blur: 28,
    offsetX: 0,
    offsetY: 0
  }),
  fontFamily: "Orbitron",
  fontWeight: "900"
}


  };

  active.set(styles[effect]);
  canvas.renderAll();

  if (typeof refreshLayers === "function") {
    refreshLayers();
  }
}

document.addEventListener("DOMContentLoaded", renderTextStyleLibrary);