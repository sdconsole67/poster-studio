let undoStack = [];
let redoStack = [];
let isRestoringState = false;
const canvas = new fabric.Canvas("posterCanvas", {
  preserveObjectStacking: true,
  selection: true,
});

canvas.guidelines = true;

let canvasOriginalWidth = 1080;
let canvasOriginalHeight = 1080;
let currentZoom = 1;

const PRESETS = {
  instagram: { width: 1080, height: 1080 },
  facebook: { width: 1200, height: 630 },
  flyer: { width: 1080, height: 1350 },
  banner: { width: 1600, height: 600 },
  thumbnail: { width: 1280, height: 720 },
};

function initCanvas() {
  canvas.setWidth(canvasOriginalWidth);
  canvas.setHeight(canvasOriginalHeight);
  canvas.backgroundColor = "#10131a";
  canvas.renderAll();
  setTimeout(fitCanvas, 300);
  canvas.on("mouse:down", function (e) {
    if (!e.target) {
      openPanel("backgroundPanel");
    }
  });
}

initCanvas();

/* START FROM HOME */
const startType = localStorage.getItem("editorStartType");

if (startType && PRESETS[startType]) {
  canvasOriginalWidth = PRESETS[startType].width;
  canvasOriginalHeight = PRESETS[startType].height;

  canvas.setWidth(canvasOriginalWidth);
  canvas.setHeight(canvasOriginalHeight);

  const sizePreset = document.getElementById("sizePreset");
  if (sizePreset) sizePreset.value = startType;

  canvas.renderAll();
  setTimeout(fitCanvas, 300);
}

if (startType === "custom") {
  const sizePreset = document.getElementById("sizePreset");
  if (sizePreset) sizePreset.value = "custom";
}

/* PANEL */
function openPanel(panelId) {
  const sidePanel = document.getElementById("sidePanel");
  const panel = document.getElementById(panelId);

  if (!sidePanel || !panel) return;

  const alreadyOpen = panel.classList.contains("active");

  document.querySelectorAll(".panel").forEach(function (p) {
    p.classList.remove("active");
  });

  if (alreadyOpen && window.innerWidth < 800) {
    sidePanel.classList.remove("open");
    return;
  }

  panel.classList.add("active");
  sidePanel.classList.add("open");

  if (panelId === "layersPanel") refreshLayers();
}

/* CANVAS SIZE */
function applyCanvasSize() {
  const preset = document.getElementById("sizePreset").value;

  let width = 1080;
  let height = 1080;

  if (preset === "custom") {
    width = parseInt(document.getElementById("customWidth").value) || 1080;
    height = parseInt(document.getElementById("customHeight").value) || 1080;
  } else {
    width = PRESETS[preset].width;
    height = PRESETS[preset].height;
  }

  canvasOriginalWidth = width;
  canvasOriginalHeight = height;

  canvas.setWidth(width);
  canvas.setHeight(height);
  canvas.calcOffset();
  canvas.renderAll();

  setTimeout(fitCanvas, 100);
}

const sizePresetInput = document.getElementById("sizePreset");
if (sizePresetInput) {
  sizePresetInput.addEventListener("change", applyCanvasSize);
}

/* FIT / ZOOM */
function fitCanvas() {
  const wrapper = document.querySelector(".canvas-scroll");
  if (!wrapper) return;

  const maxWidth = wrapper.clientWidth - 40;
  const maxHeight = wrapper.clientHeight - 40;

  const scaleX = maxWidth / canvasOriginalWidth;
  const scaleY = maxHeight / canvasOriginalHeight;

  currentZoom = Math.min(scaleX, scaleY, 0.55);
  applyZoom();
}

function applyZoom() {
  canvas.setZoom(currentZoom);

  canvas.setWidth(canvasOriginalWidth * currentZoom);
  canvas.setHeight(canvasOriginalHeight * currentZoom);

  canvas.calcOffset();
  canvas.renderAll();
  updateZoomLabel();
}

function zoomIn() {
  currentZoom = Math.min(currentZoom + 0.1, 2);
  applyZoom();
}

function zoomOut() {
  currentZoom = Math.max(currentZoom - 0.1, 0.15);
  applyZoom();
}

function updateZoomLabel() {
  const label = document.getElementById("zoomLabel");
  if (label) label.innerText = Math.round(currentZoom * 100) + "%";
}

/* TEXT */
function addText() {
  const text = new fabric.Textbox("NEW TEXT", {
    left: 120,
    top: 120,
    width: 700,
    fontSize: 70,
    fill: "#ffffff",
    fontFamily: "Montserrat",
    fontWeight: "900",
    charSpacing: 60,
    lineHeight: 1.1,
    shadow: new fabric.Shadow({
      color: "rgba(0,0,0,0.55)",
      blur: 18,
      offsetX: 2,
      offsetY: 5,
    }),
    stroke: "rgba(0,0,0,0.25)",
    strokeWidth: 1,
  });

  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();
  refreshLayers();
}

function updateSelectedText() {
  const active = canvas.getActiveObject();

  if (!active || (active.type !== "textbox" && active.type !== "text")) {
    return;
  }

  const textInput = document.getElementById("textInput");

  if (!textInput) return;

  // EMPTY হলে text remove হবে না
  if (textInput.value.trim() === "") {
    return;
  }

  // ONLY TEXT UPDATE
  active.text = textInput.value;

  canvas.renderAll();

  refreshLayers();
}
function syncControls() {
  const active = canvas.getActiveObject();

  if (!active || (active.type !== "textbox" && active.type !== "text")) return;

  document.getElementById("textInput");
  const fontFamilyInput = document.getElementById("fontFamilyInput");
  const fontSizeInput = document.getElementById("fontSizeInput");
  const letterSpacingInput = document.getElementById("letterSpacingInput");
  const colorInput = document.getElementById("colorInput");

  if (textInput) textInput.value = active.text || "";
  if (fontFamilyInput)
    fontFamilyInput.value = active.fontFamily || "Montserrat";
  if (fontSizeInput) fontSizeInput.value = active.fontSize || 60;
  if (letterSpacingInput) letterSpacingInput.value = active.charSpacing || 0;
  if (colorInput) colorInput.value = active.fill || "#ffffff";
}

function liveUpdate(property, value) {
  const active = canvas.getActiveObject();
  if (!active) return;

  active.set(property, value);
  canvas.renderAll();
  refreshLayers();
}

function setupLiveTextControls() {
  const textInput = document.getElementById("textInput");
  const fontFamilyInput = document.getElementById("fontFamilyInput");
  const fontSizeInput = document.getElementById("fontSizeInput");
  const letterSpacingInput = document.getElementById("letterSpacingInput");
  const colorInput = document.getElementById("colorInput");

  if (textInput) {
    textInput.addEventListener("input", function () {
      liveUpdate("text", this.value);
    });
  }

  if (fontFamilyInput) {
    fontFamilyInput.addEventListener("change", function () {
      liveUpdate("fontFamily", this.value);
    });
  }

  if (fontSizeInput) {
    fontSizeInput.addEventListener("input", function () {
      liveUpdate("fontSize", parseInt(this.value));
    });
  }

  if (letterSpacingInput) {
    letterSpacingInput.addEventListener("input", function () {
      liveUpdate("charSpacing", parseInt(this.value));
    });
  }

  if (colorInput) {
    colorInput.addEventListener("input", function () {
      liveUpdate("fill", this.value);
    });
  }
}

setupLiveTextControls();

/* TEXT EFFECTS */
function toggleBold() {
  const active = canvas.getActiveObject();
  if (!active || (active.type !== "textbox" && active.type !== "text")) return;

  active.set(
    "fontWeight",
    active.fontWeight === "bold" || active.fontWeight === "900" ? "400" : "900",
  );
  canvas.renderAll();
}

function toggleItalic() {
  const active = canvas.getActiveObject();
  if (!active || (active.type !== "textbox" && active.type !== "text")) return;

  active.set("fontStyle", active.fontStyle === "italic" ? "normal" : "italic");
  canvas.renderAll();
}

function applyTextStroke() {
  const active = canvas.getActiveObject();
  if (!active || (active.type !== "textbox" && active.type !== "text")) return;

  active.set({
    stroke: "#000000",
    strokeWidth: 2,
  });

  canvas.renderAll();
}

function applyTextShadow() {
  const active = canvas.getActiveObject();
  if (!active || (active.type !== "textbox" && active.type !== "text")) return;

  active.set({
    shadow: new fabric.Shadow({
      color: "rgba(0,0,0,0.6)",
      blur: 16,
      offsetX: 3,
      offsetY: 5,
    }),
  });

  canvas.renderAll();
}

function makeUppercase() {
  const active = canvas.getActiveObject();
  if (!active || !active.text) return;

  active.set("text", active.text.toUpperCase());
  canvas.renderAll();
}

function makeLowercase() {
  const active = canvas.getActiveObject();
  if (!active || !active.text) return;

  active.set("text", active.text.toLowerCase());
  canvas.renderAll();
}

function removeTextEffects() {
  const active = canvas.getActiveObject();
  if (!active) return;

  active.set({
    shadow: null,
    stroke: null,
    strokeWidth: 0,
  });

  canvas.renderAll();
}

/* UPLOAD */
function triggerImageUpload() {
  const input = document.getElementById("imageUpload");
  if (input) input.click();
}

function triggerLogoUpload() {
  const input = document.getElementById("logoUpload");
  if (input) input.click();
}

function triggerBgUpload() {
  const input = document.getElementById("backgroundUpload");
  if (input) input.click();
}

function addImageFromFileInput(inputId, scaleRatio) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      fabric.Image.fromURL(e.target.result, function (img) {
        img.scaleToWidth(canvasOriginalWidth * scaleRatio);

        img.set({
          left: canvasOriginalWidth / 2,
          top: canvasOriginalHeight / 2,
          originX: "center",
          originY: "center",
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        refreshLayers();
      });
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  });
}

addImageFromFileInput("imageUpload", 0.35);
addImageFromFileInput("logoUpload", 0.15);

/* BACKGROUND */
const bgInput = document.getElementById("backgroundUpload");

if (bgInput) {
  bgInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      fabric.Image.fromURL(e.target.result, function (img) {
        const scale = Math.max(
          canvasOriginalWidth / img.width,
          canvasOriginalHeight / img.height,
        );

        img.set({
          originX: "center",
          originY: "center",
          left: canvasOriginalWidth / 2,
          top: canvasOriginalHeight / 2,
          scaleX: scale,
          scaleY: scale,
        });

        fabric.Image.fromURL(
          e.target.result,

          function (img) {
            const scale = Math.max(
              canvasOriginalWidth / img.width,

              canvasOriginalHeight / img.height,
            );

            img.set({
              left: 0,
              top: 0,

              scaleX: scale,
              scaleY: scale,

              selectable: true,

              evented: true,

              hasControls: true,

              lockRotation: false,

              cornerStyle: "circle",

              transparentCorners: false,
            });

            img.customType = "backgroundImage";

            canvas.add(img);

            canvas.sendToBack(img);

            canvas.setActiveObject(img);

            canvas.renderAll();

            refreshLayers();
          },
        );
      });
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  });
}

function applyBackgroundColor() {
  const color = document.getElementById("bgColorInput").value;

  canvas.backgroundColor = color;
  canvas.renderAll();

  saveBackground("color", color);
  saveCanvasToLocal();
}

function applyGradientBackground() {
  const start = document.getElementById("gradientStartInput").value;
  const end = document.getElementById("gradientEndInput").value;

  canvas.backgroundColor = new fabric.Gradient({
    type: "linear",
    coords: {
      x1: 0,
      y1: 0,
      x2: canvasOriginalWidth,
      y2: canvasOriginalHeight,
    },
    colorStops: [
      { offset: 0, color: start },
      { offset: 1, color: end },
    ],
  });

  canvas.renderAll();
}

/* LAYERS */
function refreshLayers() {
  const layerList = document.getElementById("layerList");
  if (!layerList) return;

  layerList.innerHTML = "";

  const objects = canvas.getObjects();

  objects
    .slice()
    .reverse()
    .forEach(function (object, reversedIndex) {
      const actualIndex = objects.length - 1 - reversedIndex;

      const item = document.createElement("div");
      item.className = "layer-item";
      item.draggable = true;
      item.dataset.index = actualIndex;

      let label = object.type.toUpperCase();
      if (object.type === "textbox") {
        label = object.text ? object.text.slice(0, 22) : "TEXT";
      }

      item.innerText = label;

      item.onclick = function () {
        canvas.setActiveObject(object);
        canvas.renderAll();
        syncControls();
      };

      item.addEventListener("dragstart", function () {
        item.classList.add("dragging");
      });

      item.addEventListener("dragend", function () {
        item.classList.remove("dragging");
      });

      item.addEventListener("dragover", function (e) {
        e.preventDefault();
      });

      item.addEventListener("drop", function () {
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const fromIndex = parseInt(dragging.dataset.index);
        const toIndex = parseInt(item.dataset.index);

        const movedObject = objects[fromIndex];

        canvas.remove(movedObject);
        canvas.insertAt(movedObject, toIndex, false);

        canvas.renderAll();
        refreshLayers();
      });

      layerList.appendChild(item);
    });
}

/* OBJECT ACTIONS */
function duplicateSelected() {
  const active = canvas.getActiveObject();
  if (!active) return;

  active.clone(function (cloned) {
    cloned.set({
      left: active.left + 30,
      top: active.top + 30,
    });

    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.renderAll();
    refreshLayers();
  });
}

function deleteSelected() {
  const active = canvas.getActiveObject();
  if (!active) return;

  canvas.remove(active);
  canvas.discardActiveObject();
  canvas.renderAll();
  refreshLayers();
}

function lockSelected() {
  const active = canvas.getActiveObject();
  if (!active) return;

  active.set({
    selectable: false,
    evented: false,
    lockMovementX: true,
    lockMovementY: true,
  });

  canvas.discardActiveObject();
  canvas.renderAll();
  refreshLayers();
}

function unlockSelected() {
  canvas.getObjects().forEach(function (obj) {
    obj.set({
      selectable: true,
      evented: true,
      lockMovementX: false,
      lockMovementY: false,
    });
  });

  canvas.renderAll();
  refreshLayers();
}

/* MINI TOOLBAR */
function showMiniToolbar(target) {
  const toolbar = document.getElementById("objectMiniToolbar");

  if (!toolbar || !target) return;

  const rect = canvas.upperCanvasEl.getBoundingClientRect();

  const bounds = target.getBoundingRect();

  const left = rect.left + bounds.left + bounds.width / 2;

  const top = rect.top + bounds.top + bounds.height + 16;

  toolbar.style.left = left - 90 + "px";

  toolbar.style.top = top + "px";

  toolbar.classList.add("active");
}
function toggleMoreMenu() {
  const menu = document.getElementById("moreMenu");

  const toolbar = document.getElementById("objectMiniToolbar");

  if (!menu || !toolbar) return;

  const rect = toolbar.getBoundingClientRect();

  menu.style.left = rect.left + "px";

  menu.style.top = rect.bottom + 10 + "px";

  menu.classList.toggle("active");
}

function bringForwardObject() {
  const active = canvas.getActiveObject();

  if (!active) return;

  canvas.bringForward(active);

  canvas.renderAll();
}

function sendBackwardObject() {
  const active = canvas.getActiveObject();

  if (!active) return;

  canvas.sendBackwards(active);

  canvas.renderAll();
}

function hideMiniToolbar() {
  const toolbar = document.getElementById("objectMiniToolbar");
  if (toolbar) toolbar.classList.remove("active");
}

function openSelectedObjectEditor() {
  const active = canvas.getActiveObject();

  if (!active) return;

  if (active.type === "textbox" || active.type === "text") {
    openPanel("textPanel");
    syncControls();
    return;
  }

  if (active.type === "image") {
    openPanel("imagePanel");
    return;
  }

  if (
    active.type === "rect" ||
    active.type === "circle" ||
    active.type === "triangle" ||
    active.type === "group" ||
    active.customType === "editableBadge"
  ) {
    openPanel("stylePanel");
    return;
  }

  openPanel("stylePanel");
}

/* EVENTS */
canvas.on("selection:created", function (e) {
  syncControls();
  if (e.selected && e.selected[0]) showMiniToolbar(e.selected[0]);
});

canvas.on("selection:updated", function (e) {
  syncControls();
  if (e.selected && e.selected[0]) showMiniToolbar(e.selected[0]);
});

canvas.on("selection:cleared", function () {
  hideMiniToolbar();
});

canvas.on("object:moving", function (e) {
  showMiniToolbar(e.target);
});

canvas.on("object:scaling", function (e) {
  showMiniToolbar(e.target);
});

canvas.on("object:rotating", function (e) {
  showMiniToolbar(e.target);
});

canvas.on("object:added", refreshLayers);
canvas.on("object:removed", refreshLayers);
canvas.on("object:modified", refreshLayers);

/* DOWNLOAD */
function downloadPoster() {
  const oldZoom = currentZoom;

  canvas.setZoom(1);
  canvas.setWidth(canvasOriginalWidth);
  canvas.setHeight(canvasOriginalHeight);
  canvas.renderAll();

  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1,
    multiplier: window.innerWidth < 768 ? 1.5 : 3,
  });

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "postermaker-design.png";
  link.click();

  currentZoom = oldZoom;
  applyZoom();
}

/* PANEL RESIZE DESKTOP */
const resizeHandle = document.getElementById("panelResizeHandle");
const sidePanel = document.getElementById("sidePanel");

let isResizingPanel = false;

if (resizeHandle && sidePanel) {
  resizeHandle.addEventListener("mousedown", function () {
    isResizingPanel = true;
    document.body.style.cursor = "ew-resize";
  });

  document.addEventListener("mousemove", function (e) {
    if (!isResizingPanel) return;

    const newWidth = e.clientX - sidePanel.getBoundingClientRect().left;

    if (newWidth >= 220 && newWidth <= 520) {
      sidePanel.style.width = newWidth + "px";
      setTimeout(fitCanvas, 50);
    }
  });

  document.addEventListener("mouseup", function () {
    if (!isResizingPanel) return;

    isResizingPanel = false;
    document.body.style.cursor = "default";
    fitCanvas();
  });
}

/* OUTSIDE TAP CLOSE MOBILE */
document.addEventListener("click", function (e) {
  const sidePanel = document.getElementById("sidePanel");
  const toolbar = document.querySelector(".mobile-editor-nav");

  if (!sidePanel || !toolbar) return;

  const clickedInsidePanel = sidePanel.contains(e.target);
  const clickedToolbar = toolbar.contains(e.target);

  if (!clickedInsidePanel && !clickedToolbar && window.innerWidth < 800) {
    sidePanel.classList.remove("open");
  }
});

/* KEYBOARD */
document.addEventListener("keydown", function (e) {
  const tag = e.target.tagName.toLowerCase();

  if (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    e.target.isContentEditable
  ) {
    return;
  }

  const active = canvas.getActiveObject();

  if (e.ctrlKey && e.key.toLowerCase() === "z") {
    e.preventDefault();
    undo();
    return;
  }

  if (
    e.ctrlKey &&
    (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))
  ) {
    e.preventDefault();
    redo();
    return;
  }

  if ((e.key === "Delete" || e.key === "Backspace") && active) {
    e.preventDefault();
    deleteSelected();
    return;
  }
});

/* RESIZE */
window.addEventListener("resize", function () {
  fitCanvas();
});

function closePanel() {
  const sidePanel = document.getElementById("sidePanel");

  if (sidePanel) {
    sidePanel.classList.remove("open");
  }

  document.querySelectorAll(".panel").forEach(function (panel) {
    panel.classList.remove("active");
  });
}

function addShape(type) {
  let shape;

  if (type === "circle") {
    shape = new fabric.Circle({
      left: 120,
      top: 120,
      radius: 80,
      fill: "#ffcc00",
    });
  }

  if (type === "rect") {
    shape = new fabric.Rect({
      left: 120,
      top: 120,
      width: 220,
      height: 120,
      fill: "#2f6bff",
    });
  }

  if (type === "roundRect") {
    shape = new fabric.Rect({
      left: 120,
      top: 120,
      width: 240,
      height: 120,
      fill: "#7b61ff",
      rx: 28,
      ry: 28,
    });
  }

  if (type === "line") {
    shape = new fabric.Rect({
      left: 120,
      top: 120,
      width: 320,
      height: 8,
      fill: "#ffffff",
      rx: 4,
      ry: 4,
    });
  }

  if (type === "triangle") {
    shape = new fabric.Triangle({
      left: 120,
      top: 120,
      width: 180,
      height: 160,
      fill: "#ff4d00",
    });
  }

  if (type === "diamond") {
    shape = new fabric.Rect({
      left: 120,
      top: 120,
      width: 150,
      height: 150,
      fill: "#00e5ff",
      angle: 45,
    });
  }

  if (type === "pill") {
    shape = new fabric.Rect({
      left: 120,
      top: 120,
      width: 280,
      height: 80,
      fill: "#00d084",
      rx: 999,
      ry: 999,
    });
  }

  if (type === "star") {
    shape = new fabric.Polygon(createStarPoints(90, 40, 5), {
      left: 120,
      top: 120,
      fill: "#ffcc00",
    });
  }

  if (!shape) return;

  shape.customType = "shape";

  canvas.add(shape);
  canvas.setActiveObject(shape);
  canvas.renderAll();
  refreshLayers();
}

function createStarPoints(outerRadius, innerRadius, points) {
  const result = [];
  const step = Math.PI / points;

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;

    result.push({
      x: Math.cos(angle) * radius + outerRadius,
      y: Math.sin(angle) * radius + outerRadius,
    });
  }

  return result;
}

function addBadge(text) {
  const groupItems = [];

  const rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: 220,
    height: 78,
    fill: "#ffcc00",
    rx: 18,
    ry: 18,
  });

  const label = new fabric.Textbox(text.toUpperCase(), {
    left: 18,
    top: 18,
    width: 184,
    fontSize: 34,
    fill: "#111111",
    fontFamily: "Montserrat",
    fontWeight: "900",
    textAlign: "center",
  });

  groupItems.push(rect, label);

  const badge = new fabric.Group(groupItems, {
    left: 120,
    top: 120,
  });

  canvas.add(badge);
  canvas.setActiveObject(badge);
  canvas.renderAll();
  refreshLayers();
}

function addBadgeStyle(type) {
  const presets = {
    gold: { text: "50% OFF", bg: "#ffcc00", color: "#111111" },
    red: { text: "SALE", bg: "#ff2d2d", color: "#ffffff" },
    neon: { text: "NEW", bg: "#06131a", color: "#00e5ff" },
    glass: { text: "FREE", bg: "rgba(255,255,255,0.18)", color: "#ffffff" },
    black: { text: "LIMITED", bg: "#111111", color: "#ffd66b" },
    pink: { text: "OFFER", bg: "#ff66c4", color: "#ffffff" },
  };

  const p = presets[type];

  const rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: 260,
    height: 86,
    fill: p.bg,
    rx: 24,
    ry: 24,
    shadow: new fabric.Shadow({
      color: "rgba(0,0,0,0.45)",
      blur: 18,
      offsetX: 0,
      offsetY: 8,
    }),
  });

  const text = new fabric.Textbox(p.text, {
    left: 18,
    top: 24,
    width: 224,
    fontSize: 34,
    fill: p.color,
    fontFamily: "Montserrat",
    fontWeight: "900",
    textAlign: "center",
  });

  const group = new fabric.Group([rect, text], {
    left: 120,
    top: 120,
  });

  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  refreshLayers();
}

function toggleMoreMenu() {
  const menu = document.getElementById("moreMenu");
  const toolbar = document.getElementById("objectMiniToolbar");

  if (!menu || !toolbar) return;

  const rect = toolbar.getBoundingClientRect();

  menu.style.left = rect.left + "px";
  menu.style.top = rect.bottom + 8 + "px";

  menu.classList.toggle("active");
}

function bringForwardObject() {
  const active = canvas.getActiveObject();
  if (!active) return;

  canvas.bringForward(active);
  canvas.renderAll();
  refreshLayers();
}

function sendBackwardObject() {
  const active = canvas.getActiveObject();
  if (!active) return;

  canvas.sendBackwards(active);
  canvas.renderAll();
  refreshLayers();
}

const imageFilterPresets = [
  { name: "Normal", type: "normal" },
  { name: "Bright", type: "bright" },
  { name: "Dark", type: "dark" },
  { name: "Vintage", type: "vintage" },
  { name: "B&W", type: "bw" },
  { name: "Warm", type: "warm" },
  { name: "Cool", type: "cool" },
  { name: "Soft Blur", type: "blur" },
];

function renderImageFilterGrid() {
  const grid = document.getElementById("imageFilterGrid");
  if (!grid) return;

  grid.innerHTML = "";

  imageFilterPresets.forEach(function (preset) {
    const card = document.createElement("div");
    card.className = "image-filter-card";
    card.innerText = preset.name;

    card.onclick = function () {
      applyImageFilterPreset(preset.type);
    };

    grid.appendChild(card);
  });
}

function applyImageFilterPreset(type) {
  const img = getActiveImage();

  if (!img) {
    alert("Select an image first.");
    return;
  }

  const filters = {
    normal: [],

    bright: [
      new fabric.Image.filters.Brightness({ brightness: 0.25 }),
      new fabric.Image.filters.Contrast({ contrast: 0.12 }),
    ],

    dark: [
      new fabric.Image.filters.Brightness({ brightness: -0.25 }),
      new fabric.Image.filters.Contrast({ contrast: 0.25 }),
    ],

    vintage: [
      new fabric.Image.filters.Sepia(),
      new fabric.Image.filters.Contrast({ contrast: 0.15 }),
    ],

    bw: [new fabric.Image.filters.Grayscale()],

    warm: [
      new fabric.Image.filters.Sepia(),
      new fabric.Image.filters.Saturation({ saturation: 0.15 }),
    ],

    cool: [
      new fabric.Image.filters.Brightness({ brightness: 0.05 }),
      new fabric.Image.filters.Saturation({ saturation: -0.15 }),
    ],

    blur: [new fabric.Image.filters.Blur({ blur: 0.18 })],
  };

  img.filters = filters[type] || [];
  img.applyFilters();
  canvas.renderAll();
}

document.addEventListener("DOMContentLoaded", renderImageFilterGrid);

function getActiveImage() {
  const active = canvas.getActiveObject();

  if (active && active.type === "image") {
    return active;
  }

  alert("Select an image first.");
  return null;
}

function applyImageShadow() {
  const img = getActiveImage();

  if (!img) return;

  img.set({
    shadow: new fabric.Shadow({
      color: "rgba(0,0,0,0.45)",

      blur: 25,

      offsetX: 0,

      offsetY: 12,
    }),
  });

  canvas.renderAll();
}

function applyImageGlow() {
  const img = getActiveImage();

  if (!img) return;

  img.set({
    shadow: new fabric.Shadow({
      color: "rgba(255,255,255,0.7)",

      blur: 35,

      offsetX: 0,

      offsetY: 0,
    }),
  });

  canvas.renderAll();
}

function removeImageEffects() {
  const img = getActiveImage();

  if (!img) return;

  img.set({
    shadow: null,
  });

  img.filters = [];

  img.applyFilters();

  canvas.renderAll();
}

function applyCustomImageShadow() {
  const img = getActiveImage();
  if (!img) return;

  const blur = parseInt(document.getElementById("imageShadowStrength").value);
  const offset = parseInt(document.getElementById("imageShadowOffset").value);
  const color = document.getElementById("imageShadowColor").value;

  img.set({
    shadow: new fabric.Shadow({
      color: color,
      blur: blur,
      offsetX: 0,
      offsetY: offset,
    }),
  });

  canvas.renderAll();
}

function updateImageShadowLive() {
  const img = getActiveImage();
  if (!img) return;

  const blur = parseInt(document.getElementById("imageShadowBlur").value);
  const offsetX = parseInt(document.getElementById("imageShadowX").value);
  const offsetY = parseInt(document.getElementById("imageShadowY").value);
  const color = document.getElementById("imageShadowColor").value;

  img.set({
    shadow: new fabric.Shadow({
      color: color,
      blur: blur,
      offsetX: offsetX,
      offsetY: offsetY,
    }),
  });

  canvas.renderAll();
}

["imageShadowBlur", "imageShadowX", "imageShadowY"].forEach(function (id) {
  document.getElementById(id)?.addEventListener("input", updateImageShadowLive);
});

document
  .getElementById("imageShadowColor")
  ?.addEventListener("input", updateImageShadowLive);

function getEditableTarget() {
  const active = canvas.getActiveObject();
  if (!active) return null;

  if (active.type === "group" && active.customType === "editableBadge") {
    return active;
  }

  return active;
}

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r},${g},${b},${opacity})`;
}

function updateUniversalStyle() {
  const obj = getEditableTarget();
  if (!obj) return;

  const fill = document.getElementById("objectFillColor")?.value || "#ffffff";
  const fillOpacity = parseFloat(
    document.getElementById("objectFillOpacity")?.value || 1,
  );

  const borderSize = parseInt(
    document.getElementById("objectBorderSize")?.value || 0,
  );
  const borderColor =
    document.getElementById("objectBorderColor")?.value || "#ffffff";
  const borderOpacity = parseFloat(
    document.getElementById("objectBorderOpacity")?.value || 1,
  );

  const shadowBlur = parseInt(
    document.getElementById("objectShadowBlur")?.value || 0,
  );
  const shadowX = parseInt(
    document.getElementById("objectShadowX")?.value || 0,
  );
  const shadowY = parseInt(
    document.getElementById("objectShadowY")?.value || 0,
  );
  const shadowColor =
    document.getElementById("objectShadowColor")?.value || "#000000";

  const shadow =
    shadowBlur > 0
      ? new fabric.Shadow({
          color: shadowColor,
          blur: shadowBlur,
          offsetX: shadowX,
          offsetY: shadowY,
        })
      : null;

  if (obj.type === "group" && obj.customType === "editableBadge") {
    const items = obj.getObjects();
    const bg = items.find(
      (item) => item.type === "rect" || item.type === "circle",
    );
    const text = items.find(
      (item) => item.type === "textbox" || item.type === "text",
    );

    if (bg) {
      bg.set({
        fill: hexToRgba(fill, fillOpacity),
        stroke: hexToRgba(borderColor, borderOpacity),
        strokeWidth: borderSize,
      });
    }

    if (text) {
      const textOpacity = parseFloat(
        document.getElementById("badgeTextOpacityInput")?.value || 1,
      );
      text.set({ opacity: textOpacity });
    }

    obj.set({ opacity: 1, shadow });
  } else {
    obj.set({
      fill: obj.type === "image" ? obj.fill : hexToRgba(fill, fillOpacity),
      opacity: 1,
      stroke: hexToRgba(borderColor, borderOpacity),
      strokeWidth: borderSize,
      shadow,
    });
  }

  canvas.renderAll();
  refreshLayers();
}

[
  "objectFillColor",
  "objectFillOpacity",
  "objectBorderSize",
  "objectBorderColor",
  "objectBorderOpacity",
  "objectShadowBlur",
  "objectShadowX",
  "objectShadowY",
  "objectShadowColor",
  "badgeTextOpacityInput",
].forEach(function (id) {
  document.getElementById(id)?.addEventListener("input", updateUniversalStyle);
});

function removeObjectStyle() {
  const obj = getEditableTarget();
  if (!obj) return;

  obj.set({
    opacity: 1,
    stroke: null,
    strokeWidth: 0,
    shadow: null,
  });

  canvas.renderAll();
}

function updateBadgeTextStyle() {
  const active = canvas.getActiveObject();

  if (!active || active.customType !== "editableBadge") return;

  const items = active.getObjects();
  const textObj = items.find(
    (obj) => obj.type === "textbox" || obj.type === "text",
  );

  if (!textObj) return;

  textObj.set({
    text: document.getElementById("badgeTextInput").value || textObj.text,
    fill: document.getElementById("badgeTextColorInput").value,
    fontSize: parseInt(document.getElementById("badgeTextSizeInput").value),
  });

  canvas.renderAll();
}

["badgeTextInput", "badgeTextColorInput", "badgeTextSizeInput"].forEach(
  function (id) {
    document
      .getElementById(id)
      ?.addEventListener("input", updateBadgeTextStyle);
  },
);

function updateAdvancedTextStyle() {
  const active = canvas.getActiveObject();

  if (!active || (active.type !== "textbox" && active.type !== "text")) {
    return;
  }

  const textColor = document.getElementById("colorInput")?.value || "#ffffff";

  const textOpacity = parseFloat(
    document.getElementById("textOpacityInput")?.value || 1,
  );

  const strokeSize = parseInt(
    document.getElementById("textStrokeSizeInput")?.value || 0,
  );

  const strokeColor =
    document.getElementById("textStrokeColorInput")?.value || "#000000";

  const strokeOpacity = parseFloat(
    document.getElementById("textStrokeOpacityInput")?.value || 1,
  );

  const bgColor =
    document.getElementById("textBgColorInput")?.value || "#000000";

  const bgOpacity = parseFloat(
    document.getElementById("textBgOpacityInput")?.value || 0,
  );

  active.set({
    opacity: 1,

    stroke: strokeSize > 0 ? hexToRgba(strokeColor, strokeOpacity) : null,

    strokeWidth: strokeSize,

    textBackgroundColor: bgOpacity > 0 ? hexToRgba(bgColor, bgOpacity) : "",
  });

  if (!active.isTextureText) {
    active.set({
      fill: hexToRgba(textColor, textOpacity),
    });
  }

  canvas.renderAll();
}
[
  "textOpacityInput",
  "textStrokeSizeInput",
  "textStrokeColorInput",
  "textBgColorInput",
  "textBgOpacityInput",
].forEach(function (id) {
  document
    .getElementById(id)
    ?.addEventListener("input", updateAdvancedTextStyle);
});

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r},${g},${b},${opacity})`;
}

function triggerTextImageFillUpload() {
  document.getElementById("textTextureUpload")?.click();
}

const textTextureInput = document.getElementById("textTextureUpload");

if (textTextureInput) {
  textTextureInput.addEventListener(
    "change",

    function (event) {
      const active = canvas.getActiveObject();

      if (!active || (active.type !== "textbox" && active.type !== "text")) {
        alert("Select text first.");
        return;
      }

      const file = event.target.files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = function (e) {
        fabric.Image.fromURL(
          e.target.result,

          function (img) {
            const pattern = new fabric.Pattern({
              source: img.getElement(),

              repeat: "repeat",
            });

            active.set({
              fill: pattern,
            });

            canvas.renderAll();
          },
        );
      };

      reader.readAsDataURL(file);
    },
  );
}

const textGradients = [
  {
    name: "Gold",
    colors: ["#ffcc00", "#ff8800"],
  },

  {
    name: "Silver",
    colors: ["#f5f5f5", "#9e9e9e"],
  },

  {
    name: "Neon",
    colors: ["#00e5ff", "#0066ff"],
  },

  {
    name: "Pink",
    colors: ["#ff66c4", "#7b2cff"],
  },

  {
    name: "Fire",
    colors: ["#ffcc00", "#ff2d2d"],
  },

  {
    name: "Luxury",
    colors: ["#111111", "#d4af37"],
  },
];

function renderTextGradientLibrary() {
  const grid = document.getElementById("textGradientGrid");

  if (!grid) return;

  grid.innerHTML = "";

  textGradients.forEach(function (item) {
    const card = document.createElement("div");

    card.className = "gradient-card";

    card.innerText = item.name;

    card.style.background = `linear-gradient(
        135deg,
        ${item.colors[0]},
        ${item.colors[1]}
      )`;

    card.onclick = function () {
      applyTextGradient(item.colors);
    };

    grid.appendChild(card);
  });
}

function applyTextGradient(colors) {
  const active = canvas.getActiveObject();

  if (!active || (active.type !== "textbox" && active.type !== "text")) {
    alert("Select text first.");
    return;
  }

  const gradient = new fabric.Gradient({
    type: "linear",

    coords: {
      x1: 0,
      y1: 0,
      x2: active.width,
      y2: 0,
    },

    colorStops: [
      {
        offset: 0,
        color: colors[0],
      },

      {
        offset: 1,
        color: colors[1],
      },
    ],
  });

  active.set({
    fill: gradient,

    isTextureText: true,
  });

  canvas.renderAll();
}

document.addEventListener("DOMContentLoaded", renderTextGradientLibrary);

function createGradientByDirection(colors, direction, width, height) {
  if (direction === "vertical") {
    return new fabric.Gradient({
      type: "linear",

      coords: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: height,
      },

      colorStops: [
        { offset: 0, color: colors[0] },
        { offset: 1, color: colors[1] },
      ],
    });
  }

  if (direction === "diagonal") {
    return new fabric.Gradient({
      type: "linear",

      coords: {
        x1: 0,
        y1: 0,
        x2: width,
        y2: height,
      },

      colorStops: [
        { offset: 0, color: colors[0] },
        { offset: 1, color: colors[1] },
      ],
    });
  }

  if (direction === "radial") {
    return new fabric.Gradient({
      type: "radial",

      coords: {
        x1: width / 2,
        y1: height / 2,
        r1: 10,

        x2: width / 2,
        y2: height / 2,
        r2: width / 1.2,
      },

      colorStops: [
        { offset: 0, color: colors[0] },
        { offset: 1, color: colors[1] },
      ],
    });
  }

  return new fabric.Gradient({
    type: "linear",

    coords: {
      x1: 0,
      y1: 0,
      x2: width,
      y2: 0,
    },

    colorStops: [
      { offset: 0, color: colors[0] },
      { offset: 1, color: colors[1] },
    ],
  });
}

function applyCustomTextGradient() {
  const active = canvas.getActiveObject();

  if (!active || (active.type !== "textbox" && active.type !== "text")) {
    alert("Select text first.");
    return;
  }

  const color1 = document.getElementById("gradientColor1").value;

  const color2 = document.getElementById("gradientColor2").value;

  const direction = document.getElementById("gradientDirection").value;

  const gradient = createGradientByDirection(
    [color1, color2],

    direction,

    active.width,

    active.height,
  );

  active.set({
    fill: gradient,

    isTextureText: true,
  });

  canvas.renderAll();
}

function applyCustomBackgroundGradient() {
  const color1 = document.getElementById("bgGradientColor1").value;
  const color2 = document.getElementById("bgGradientColor2").value;
  const direction = document.getElementById("bgGradientDirection").value;

  const gradient = createGradientByDirection(
    [color1, color2],
    direction,
    canvasOriginalWidth,
    canvasOriginalHeight,
  );

  canvas.backgroundColor = gradient;
  canvas.renderAll();

  saveBackground("gradient", {
    color1,
    color2,
    direction,
  });

  saveCanvasToLocal();
}

document
  .getElementById("imageOpacityInput")
  ?.addEventListener("input", function () {
    const img = getActiveImage();
    if (!img) return;

    img.set("opacity", parseFloat(this.value));
    canvas.renderAll();
  });

function flipSelectedX() {
  const active = canvas.getActiveObject();
  if (!active) return;

  active.set("flipX", !active.flipX);
  canvas.renderAll();
  refreshLayers();
}

function flipSelectedY() {
  const active = canvas.getActiveObject();
  if (!active) return;

  active.set("flipY", !active.flipY);
  canvas.renderAll();
  refreshLayers();
}

function flipSelectedX() {
  const active = canvas.getActiveObject();

  if (!active) return;

  active.set({
    flipX: !active.flipX,
  });

  canvas.renderAll();

  if (typeof refreshLayers === "function") {
    refreshLayers();
  }
}

function flipSelectedY() {
  const active = canvas.getActiveObject();

  if (!active) return;

  active.set({
    flipY: !active.flipY,
  });

  canvas.renderAll();

  if (typeof refreshLayers === "function") {
    refreshLayers();
  }
}

document.addEventListener("click", function (e) {
  const moreMenu = document.getElementById("moreMenu");

  const moreButton = e.target.closest('[onclick="toggleMoreMenu()"]');

  if (!moreMenu) return;

  if (!moreMenu.contains(e.target) && !moreButton) {
    moreMenu.classList.remove("active");
  }
});

function updateObjectRadius() {
  const active = canvas.getActiveObject();

  if (!active) return;

  const radius = parseInt(
    document.getElementById("objectRadiusInput")?.value || 0,
  );

  if (active.type === "rect") {
    active.set({
      rx: radius,
      ry: radius,
    });
  }

  if (active.type === "image") {
    active.clipPath = new fabric.Rect({
      rx: radius,
      ry: radius,

      width: active.width,

      height: active.height,

      originX: "center",
      originY: "center",
    });
  }

  canvas.renderAll();
}

document
  .getElementById("objectRadiusInput")

  ?.addEventListener(
    "input",

    updateObjectRadius,
  );

canvas.on("object:moving", function (e) {
  const obj = e.target;

  const centerX = canvas.getWidth() / 2;

  const centerY = canvas.getHeight() / 2;

  const objCenter = obj.getCenterPoint();

  if (Math.abs(objCenter.x - centerX) < 8) {
    obj.set({
      left: centerX - obj.getScaledWidth() / 2,
    });
  }

  if (Math.abs(objCenter.y - centerY) < 8) {
    obj.set({
      top: centerY - obj.getScaledHeight() / 2,
    });
  }
});

let guideLines = [];

function clearGuides() {
  guideLines.forEach((line) => canvas.remove(line));
  guideLines = [];
}

function addGuideLine(points) {
  const line = new fabric.Line(points, {
    stroke: "#00e5ff",
    strokeWidth: 2,
    selectable: false,
    evented: false,
    excludeFromExport: true,
  });

  guideLines.push(line);
  canvas.add(line);
  line.bringToFront();
}

canvas.on("object:moving", function (e) {
  const obj = e.target;

  clearGuides();

  const centerX = canvasOriginalWidth / 2;
  const centerY = canvasOriginalHeight / 2;

  const objCenter = obj.getCenterPoint();

  if (Math.abs(objCenter.x - centerX) < 12) {
    obj.set({
      left: centerX - obj.getScaledWidth() / 2,
    });

    addGuideLine([centerX, 0, centerX, canvasOriginalHeight]);
  }

  if (Math.abs(objCenter.y - centerY) < 12) {
    obj.set({
      top: centerY - obj.getScaledHeight() / 2,
    });

    addGuideLine([0, centerY, canvasOriginalWidth, centerY]);
  }

  canvas.renderAll();
});

canvas.on("object:modified", clearGuides);
canvas.on("mouse:up", clearGuides);

function saveCanvasToLocal() {
  try {
    const json = canvas.toJSON([
      "customType",
      "isTextureText",
      "flipX",
      "flipY",
    ]);

    // SAVE BACKGROUND
    if (canvas.backgroundColor) {
      json.customBackground = canvas.backgroundColor;
    }

    localStorage.setItem("posterStudioCanvas", JSON.stringify(json));
  } catch (err) {
    console.log("Save failed", err);
  }
}

canvas.on("object:added", saveCanvasToLocal);

canvas.on("object:modified", saveCanvasToLocal);

canvas.on("object:removed", saveCanvasToLocal);

function loadCanvasFromLocal() {
  const saved = localStorage.getItem("posterStudioCanvas");

  if (!saved) return;

  const json = JSON.parse(saved);

  // RESTORE BG FIRST
  if (json.customBackground) {
    canvas.backgroundColor = json.customBackground;
  }

  canvas.loadFromJSON(
    json,

    function () {
      canvas.renderAll();

      if (typeof refreshLayers === "function") {
        refreshLayers();
      }
    },
  );
}

document.addEventListener("keydown", function (e) {
  const active = canvas.getActiveObject();

  // DELETE
  if (e.key === "Delete" || e.key === "Backspace") {
    if (active) {
      canvas.remove(active);

      canvas.renderAll();

      refreshLayers();
    }
  }

  // DUPLICATE
  if (e.ctrlKey && e.key.toLowerCase() === "d") {
    e.preventDefault();

    if (active) {
      active.clone(function (cloned) {
        cloned.set({
          left: active.left + 20,
          top: active.top + 20,
        });

        canvas.add(cloned);

        canvas.setActiveObject(cloned);

        canvas.renderAll();

        refreshLayers();
      });
    }
  }

  // COPY
  if (e.ctrlKey && e.key.toLowerCase() === "c") {
    e.preventDefault();

    if (active) {
      active.clone(function (cloned) {
        window._copiedObject = cloned;
      });
    }
  }

  // PASTE
  if (e.ctrlKey && e.key.toLowerCase() === "v") {
    e.preventDefault();

    if (window._copiedObject) {
      window._copiedObject.clone(function (clonedObj) {
        clonedObj.set({
          left: clonedObj.left + 20,
          top: clonedObj.top + 20,
        });

        canvas.add(clonedObj);

        canvas.setActiveObject(clonedObj);

        canvas.renderAll();

        refreshLayers();
      });
    }
  }

  // BRING FRONT
  if (e.ctrlKey && e.key === "]") {
    e.preventDefault();

    if (active) {
      canvas.bringForward(active);

      canvas.renderAll();

      refreshLayers();
    }
  }

  // SEND BACK
  if (e.ctrlKey && e.key === "[") {
    e.preventDefault();

    if (active) {
      canvas.sendBackwards(active);

      canvas.renderAll();

      refreshLayers();
    }
  }

  // FLIP X
  if (e.ctrlKey && e.key.toLowerCase() === "h") {
    e.preventDefault();

    flipSelectedX();
  }

  // FLIP Y
  if (e.ctrlKey && e.key.toLowerCase() === "j") {
    e.preventDefault();

    flipSelectedY();
  }

  // SAVE
  if (e.ctrlKey && e.key.toLowerCase() === "s") {
    e.preventDefault();

    saveCanvasToLocal();

    alert("Project Saved");
  }
});

function saveBackground(type, data) {
  localStorage.setItem(
    "posterStudioBackground",
    JSON.stringify({ type, data }),
  );
}

function loadBackground() {
  const saved = localStorage.getItem("posterStudioBackground");
  if (!saved) return;

  const bg = JSON.parse(saved);

  if (bg.type === "color") {
    canvas.backgroundColor = bg.data;
  }

  if (bg.type === "gradient") {
    canvas.backgroundColor = createGradientByDirection(
      [bg.data.color1, bg.data.color2],
      bg.data.direction,
      canvasOriginalWidth,
      canvasOriginalHeight,
    );
  }

  canvas.renderAll();
}

window.addEventListener("load", function () {
  loadCanvasFromLocal();

  setTimeout(function () {
    loadBackground();
  }, 300);
});

let currentProjectId = localStorage.getItem("currentProjectId") || null;

function getProjects() {
  return JSON.parse(localStorage.getItem("posterProjects") || "[]");
}

function saveProjects(projects) {
  localStorage.setItem("posterProjects", JSON.stringify(projects));
}

function createProjectPreview() {
  return canvas.toDataURL({
    format: "jpeg",
    quality: 0.45,
    multiplier: 0.25,
  });
}

function getProjectData() {
  return {
    canvas: canvas.toJSON(["customType", "isTextureText", "flipX", "flipY"]),
    background: JSON.parse(
      localStorage.getItem("posterStudioBackground") || "null",
    ),
    preview: createProjectPreview(),
    updatedAt: new Date().toLocaleString(),
  };
}

function saveCurrentProject() {
  const projects = getProjects();
  const data = getProjectData();

  if (currentProjectId) {
    const index = projects.findIndex(
      (p) => String(p.id) === String(currentProjectId),
    );

    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...data,
      };

      saveProjects(projects);
      alert("Project updated.");
      return;
    }
  }

  const newProject = {
    id: Date.now(),
    name: "Project " + new Date().toLocaleString(),
    ...data,
  };

  projects.unshift(newProject);
  saveProjects(projects);

  currentProjectId = newProject.id;
  localStorage.setItem("currentProjectId", currentProjectId);

  alert("Project saved.");
}

function newProject() {
  const shouldSave = confirm(
    "Do you want to save current project before creating a new one?",
  );

  if (shouldSave) {
    saveCurrentProject();
  }

  canvas.clear();
  canvas.backgroundColor = "#10131a";
  canvas.renderAll();

  currentProjectId = null;
  localStorage.removeItem("currentProjectId");
  localStorage.removeItem("posterStudioCanvas");
  localStorage.removeItem("posterStudioBackground");

  refreshLayers();
}

function openProjectsPanel() {
  openPanel("projectsPanel");
  renderProjectsList();
}

function renderProjectsList() {
  const box = document.getElementById("projectsList");
  if (!box) return;

  const projects = getProjects();

  box.innerHTML = "";

  if (projects.length === 0) {
    box.innerHTML = "<p>No saved projects yet.</p>";
    return;
  }

  projects.forEach(function (project) {
    const item = document.createElement("div");
    item.className = "project-card";

    item.innerHTML = `
      <img src="${project.preview}" class="project-preview" />

      <div class="project-info">
        <strong>${project.name}</strong>
        <small>${project.updatedAt || ""}</small>

        <div class="project-actions">
          <button onclick="loadProject(${project.id})">Open</button>
          <button onclick="deleteProject(${project.id})">Delete</button>
        </div>
      </div>
    `;

    box.appendChild(item);
  });
}

function loadProject(id) {
  const projects = getProjects();
  const project = projects.find((p) => p.id === id);

  if (!project) return;

  canvas.loadFromJSON(project.canvas, function () {
    if (project.background) {
      localStorage.setItem(
        "posterStudioBackground",
        JSON.stringify(project.background),
      );
      loadBackground();
    }

    currentProjectId = project.id;
    localStorage.setItem("currentProjectId", currentProjectId);

    canvas.renderAll();
    refreshLayers();
    closePanel();
  });
}

function deleteProject(id) {
  const ok = confirm("Delete this project?");
  if (!ok) return;

  const projects = getProjects().filter((p) => p.id !== id);
  saveProjects(projects);

  if (String(currentProjectId) === String(id)) {
    currentProjectId = null;
    localStorage.removeItem("currentProjectId");
  }

  renderProjectsList();
}

function saveUndoState() {
  if (isRestoringState) return;

  undoStack.push(
    JSON.stringify(
      canvas.toJSON(["customType", "isTextureText", "flipX", "flipY"]),
    ),
  );

  if (undoStack.length > 40) {
    undoStack.shift();
  }

  redoStack = [];
}

function undo() {
  if (undoStack.length < 2) return;

  redoStack.push(undoStack.pop());

  const prev = undoStack[undoStack.length - 1];

  isRestoringState = true;

  canvas.loadFromJSON(prev, function () {
    canvas.renderAll();
    refreshLayers();
    isRestoringState = false;
    saveCanvasToLocal();
  });
}

function redo() {
  if (redoStack.length === 0) return;

  const next = redoStack.pop();

  undoStack.push(next);

  isRestoringState = true;

  canvas.loadFromJSON(next, function () {
    canvas.renderAll();
    refreshLayers();
    isRestoringState = false;
    saveCanvasToLocal();
  });
}

canvas.on("object:added", saveUndoState);
canvas.on("object:modified", saveUndoState);
canvas.on("object:removed", saveUndoState);

setTimeout(saveUndoState, 500);
