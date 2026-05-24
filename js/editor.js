const canvas = new fabric.Canvas("posterCanvas", {
  preserveObjectStacking: true
});

let currentZoom = 1;

const DESIGN_WIDTH = 1080;
const DESIGN_HEIGHT = 1080;

canvas.setWidth(DESIGN_WIDTH);
canvas.setHeight(DESIGN_HEIGHT);

const savedData =
  JSON.parse(
    localStorage.getItem("selectedDesign")
  );

if (savedData) {
  renderPoster(canvas, savedData);
}

setTimeout(() => {
  fitCanvas();
  refreshLayers();
}, 600);

/* =======================
   FIT / ZOOM
======================= */

function fitCanvas() {

  const stage =
    document.querySelector(".stage-scroll");

  const frameWidth =
    stage.clientWidth - 120;

  const frameHeight =
    stage.clientHeight - 120;

  const scaleX =
    frameWidth / DESIGN_WIDTH;

  const scaleY =
    frameHeight / DESIGN_HEIGHT;

  currentZoom =
    Math.min(scaleX, scaleY);

  if (currentZoom > 1)
    currentZoom = 1;

  canvas.setZoom(currentZoom);

  canvas.setDimensions({
    width:
      DESIGN_WIDTH * currentZoom,

    height:
      DESIGN_HEIGHT * currentZoom
  });

  updateZoomLabel();

}

function zoomIn() {

  currentZoom += 0.1;

  if (currentZoom > 2)
    currentZoom = 2;

  applyZoom();

}

function zoomOut() {

  currentZoom -= 0.1;

  if (currentZoom < 0.3)
    currentZoom = 0.3;

  applyZoom();

}

function applyZoom() {

  canvas.setZoom(currentZoom);

  canvas.setDimensions({
    width:
      DESIGN_WIDTH * currentZoom,

    height:
      DESIGN_HEIGHT * currentZoom
  });

  updateZoomLabel();

}

function updateZoomLabel() {

  document.getElementById(
    "zoomLabel"
  ).innerText =
    Math.round(currentZoom * 100)
    + "%";

}

/* =======================
   LAYERS
======================= */

function refreshLayers() {

  const layerList =
    document.getElementById(
      "layerList"
    );

  layerList.innerHTML = "";

  const objects =
    canvas.getObjects().reverse();

  objects.forEach((obj, index) => {

    const item =
      document.createElement("div");

    item.className =
      "layer-item";

    let name = obj.type;

    if (
      obj.type === "textbox"
    ) {
      name =
        obj.text?.slice(0, 18)
        || "Text";
    }

    item.innerText =
      `${index + 1}. ${name}`;

    item.onclick =
      function () {

        canvas.setActiveObject(obj);

        canvas.renderAll();

        syncControls();

      };

    layerList.appendChild(item);

  });

}

/* =======================
   TEXT CONTROL
======================= */

function syncControls() {

  const obj =
    canvas.getActiveObject();

  if (
    !obj ||
    obj.type !== "textbox"
  )
    return;

  document.getElementById(
    "textInput"
  ).value =
    obj.text || "";

  document.getElementById(
    "fontSizeInput"
  ).value =
    obj.fontSize || 60;

  document.getElementById(
    "letterSpacingInput"
  ).value =
    obj.charSpacing || 0;

  document.getElementById(
    "colorInput"
  ).value =
    obj.fill || "#ffffff";

  document.getElementById(
    "fontFamilyInput"
  ).value =
    obj.fontFamily || "Montserrat";

}

canvas.on(
  "selection:created",
  syncControls
);

canvas.on(
  "selection:updated",
  syncControls
);

function updateSelectedText() {

  const obj =
    canvas.getActiveObject();

  if (
    !obj ||
    obj.type !== "textbox"
  )
    return;

  obj.set({

    text:
      document.getElementById(
        "textInput"
      ).value,

    fontSize:
      parseInt(
        document.getElementById(
          "fontSizeInput"
        ).value
      ),

    charSpacing:
      parseInt(
        document.getElementById(
          "letterSpacingInput"
        ).value
      ),

    fill:
      document.getElementById(
        "colorInput"
      ).value,

    fontFamily:
      document.getElementById(
        "fontFamilyInput"
      ).value

  });

  canvas.renderAll();

  refreshLayers();

}

function liveUpdateSelectedText(property, value) {
  const obj = canvas.getActiveObject();

  if (!obj || obj.type !== "textbox") return;

  obj.set(property, value);
  canvas.renderAll();
  refreshLayers();
}

document.getElementById("fontSizeInput").addEventListener("input", function () {
  liveUpdateSelectedText("fontSize", parseInt(this.value));
});

document.getElementById("letterSpacingInput").addEventListener("input", function () {
  liveUpdateSelectedText("charSpacing", parseInt(this.value));
});

document.getElementById("colorInput").addEventListener("input", function () {
  liveUpdateSelectedText("fill", this.value);
});

document.getElementById("fontFamilyInput").addEventListener("change", function () {
  liveUpdateSelectedText("fontFamily", this.value);
});

document.getElementById("textInput").addEventListener("input", function () {
  liveUpdateSelectedText("text", this.value);
});

function addText() {

  const text =
    new fabric.Textbox(
      "NEW TEXT",
      {
        left: 120,
        top: 120,
        width: 400,
        fontSize: 60,
        fill: "#ffffff",
        fontFamily: "Montserrat",
        fontWeight: "900",
        charSpacing: 40
      }
    );

  canvas.add(text);

  canvas.setActiveObject(text);

  canvas.renderAll();

  refreshLayers();

}

/* =======================
   IMAGE UPLOAD
======================= */

function addImageFromInput(
  inputId,
  scaleWidth = 350
) {

  const input =
    document.getElementById(
      inputId
    );

  if (!input)
    return;

  input.addEventListener(
    "change",
    function (event) {

      const file =
        event.target.files[0];

      if (!file)
        return;

      const reader =
        new FileReader();

      reader.onload =
        function (e) {

          fabric.Image.fromURL(
            e.target.result,

            function (img) {

              img.set({
                left:
                  DESIGN_WIDTH * 0.5,

                top:
                  DESIGN_HEIGHT * 0.5,

                originX:
                  "center",

                originY:
                  "center"
              });

              img.scaleToWidth(
                scaleWidth
              );

              canvas.add(img);

              canvas.setActiveObject(
                img
              );

              canvas.renderAll();

              refreshLayers();

            }
          );

        };

      reader.readAsDataURL(
        file
      );

    }
  );

}

addImageFromInput(
  "productUpload",
  420
);

addImageFromInput(
  "logoUpload",
  160
);

/* =======================
   BACKGROUND CHANGE
======================= */

const backgroundUpload =
  document.getElementById(
    "backgroundUpload"
  );

if (backgroundUpload) {

  backgroundUpload.addEventListener(
    "change",
    function (event) {

      const file =
        event.target.files[0];

      if (!file)
        return;

      const reader =
        new FileReader();

      reader.onload =
        function (e) {

          fabric.Image.fromURL(
            e.target.result,

            function (img) {

              const scale =
                Math.max(
                  DESIGN_WIDTH / img.width,
                  DESIGN_HEIGHT / img.height
                );

              img.set({
                originX: "center",
                originY: "center",
                left:
                  DESIGN_WIDTH / 2,
                top:
                  DESIGN_HEIGHT / 2,
                scaleX: scale,
                scaleY: scale,
                selectable: false,
                evented: false
              });

              canvas.setBackgroundImage(
                img,
                canvas.renderAll.bind(canvas)
              );

            }
          );

        };

      reader.readAsDataURL(
        file
      );

    }
  );

}

/* =======================
   ARRANGE
======================= */

function bringForward() {

  const obj =
    canvas.getActiveObject();

  if (!obj)
    return;

  canvas.bringForward(obj);

  canvas.renderAll();

  refreshLayers();

}

function sendBackward() {

  const obj =
    canvas.getActiveObject();

  if (!obj)
    return;

  canvas.sendBackwards(obj);

  canvas.renderAll();

  refreshLayers();

}

function deleteSelected() {

  const obj =
    canvas.getActiveObject();

  if (!obj)
    return;

  canvas.remove(obj);

  canvas.renderAll();

  refreshLayers();

}

/* =======================
   DOWNLOAD
======================= */

function downloadPoster() {

  const dataURL =
    canvas.toDataURL({

      format: "png",

      quality: 1,

      multiplier: 3

    });

  const link =
    document.createElement("a");

  link.href = dataURL;

  link.download =
    "premium-poster.png";

  link.click();

}

/* =======================
   WINDOW RESIZE
======================= */

window.addEventListener(
  "resize",
  function () {

    fitCanvas();

  }
);

