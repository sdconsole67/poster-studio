const fontPairs = [

  {
    title: "Anton",
    body: "Poppins"
  },

  {
    title: "Bebas Neue",
    body: "Montserrat"
  },

  {
    title: "Oswald",
    body: "Raleway"
  },

  {
    title: "Playfair Display",
    body: "Montserrat"
  },

  {
    title: "Cinzel",
    body: "Poppins"
  },

  {
    title: "Orbitron",
    body: "Exo 2"
  },

  {
    title: "Teko",
    body: "Montserrat"
  },

  {
    title: "Abril Fatface",
    body: "Raleway"
  },

  {
    title: "Russo One",
    body: "Poppins"
  },

  {
    title: "Archivo Black",
    body: "Montserrat"
  }

];

const accentColors = [

  "#ffcc00",
  "#ff9f1c",
  "#ff4d00",
  "#00e5ff",
  "#d4af37",
  "#ff66c4",
  "#7b61ff",
  "#00d084",
  "#ff2d55",
  "#4cc9f0"

];

const overlayStyles = [

  {
    start: "rgba(0,0,0,0.72)",
    mid: "rgba(0,0,0,0.52)",
    end: "rgba(0,0,0,0.74)"
  },

  {
    start: "rgba(5,10,25,0.82)",
    mid: "rgba(5,10,25,0.55)",
    end: "rgba(0,0,0,0.82)"
  },

  {
    start: "rgba(35,10,0,0.72)",
    mid: "rgba(0,0,0,0.48)",
    end: "rgba(0,0,0,0.78)"
  }

];

const spacingStyles = [

  {
    title: 40,
    sub: 12,
    cta: 18
  },

  {
    title: 60,
    sub: 18,
    cta: 25
  },

  {
    title: 90,
    sub: 24,
    cta: 38
  }

];

function randomItem(array) {

  return array[
    Math.floor(
      Math.random() * array.length
    )
  ];

}

function generateDynamicStyle() {

  return {

    fonts:
      randomItem(fontPairs),

    accent:
      randomItem(accentColors),

    overlay:
      randomItem(overlayStyles),

    spacing:
      randomItem(spacingStyles)

  };

}