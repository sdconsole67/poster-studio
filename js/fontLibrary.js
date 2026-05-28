const premiumFonts = [

  "Anton",
  "Bebas Neue",
  "Montserrat",
  "Poppins",
  "Oswald",

  "Raleway",
  "Roboto",
  "Lato",
  "Open Sans",
  "Inter",

  "Playfair Display",
  "Cinzel",
  "Orbitron",
  "Teko",
  "Russo One",

  "Archivo Black",
  "Abril Fatface",
  "Alfa Slab One",
  "Fredoka",
  "DM Serif Display",

  "Exo 2",
  "Sora",
  "Space Grotesk",
  "Kanit",
  "Barlow Condensed",

  "Lobster",
  "Bangers",
  "Permanent Marker",
  "Pacifico",
  "Righteous",

  "Rubik",
  "Nunito",
  "Quicksand",
  "Josefin Sans",
  "Josefin Slab",

  "Merriweather",
  "Libre Baskerville",
  "Prata",
  "Yeseva One",
  "Fjalla One",

  "Staatliches",
  "Black Ops One",
  "Changa",
  "Rajdhani",
  "Prompt",

  "Urbanist",
  "Manrope",
  "Outfit",
  "Noto Sans Bengali"

];

function renderFontLibrary() {

  const grid =
    document.getElementById(
      "fontGrid"
    );

  if (!grid) return;

  grid.innerHTML = "";

  premiumFonts.forEach(

    function (font) {

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "font-card";

      card.innerHTML = `

        <span
        style="
        font-family:
        '${font}'
        ">

        ${
          font ===
          "Noto Sans Bengali"

          ? "বাংলা ফন্ট"

          : font
        }

        </span>

      `;

      card.onclick =
        function () {

          applyPremiumFont(
            font
          );

        };

      grid.appendChild(
        card
      );

    }

  );

}

function applyPremiumFont(
  fontFamily
) {

  const active =
    canvas.getActiveObject();

  if (

    !active ||

    (
      active.type !==
      "textbox" &&

      active.type !==
      "text"
    )

  ) {

    alert(
      "Select text first."
    );

    return;

  }

  active.set({

    fontFamily

  });

  canvas.renderAll();

}

document.addEventListener(

  "DOMContentLoaded",

  renderFontLibrary

);