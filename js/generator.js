let currentLimit = 20;
const posterGrid = document.getElementById("posterGrid");

const briefData =
  JSON.parse(localStorage.getItem("posterBrief")) || {};

  function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function generatePosters() {
  posterGrid.innerHTML = "";

  const keyword =
    nicheKeywords[briefData.niche] ||
    briefData.niche ||
    "business poster";

  let photos = [];

  try {
    photos = await getPexelsImages(keyword);
  } catch (error) {
    console.log("Pexels error:", error);
  }

const category =
  getTemplateCategory(
    briefData.niche
  );

const filteredTemplates = templates;

 const finalTemplates = shuffleArray(
  filteredTemplates.length > 0
    ? filteredTemplates
    : templates
).slice(0, currentLimit);

  const variationCount = 1;

  const designList = [];

  finalTemplates.forEach(function (template) {
    for (let i = 0; i < variationCount; i++) {
      designList.push({
        ...template,
        variation: i + 1
      });
    }
  });

  designList.forEach(function (template, index) {
    const apiImage =
      photos.length > 0
        ? photos[index % photos.length]?.src?.large
        : "";

        const dynamicStyle =
  generateDynamicStyle();

    const designData = createDesignData(
      template,
      briefData,
      apiImage,
      dynamicStyle
    );

    designData.dynamicStyle =
  JSON.parse(
    JSON.stringify(
      generateDynamicStyle()
    )
  );

designData.font =
  designData.dynamicStyle.fonts.title;

    const previewWidth = designData.width || 1080;
    const previewHeight = designData.height || 1080;

    const previewScale = 320 / previewWidth;
    const wrapperHeight = previewHeight * previewScale;

    const card = document.createElement("div");

    card.className = "poster-card";

    card.dataset.design = JSON.stringify(designData);

    card.innerHTML = `
      <div
        class="poster-preview-wrap"
        style="height:${wrapperHeight}px;"
      >
        <canvas id="previewCanvas-${index}"></canvas>
      </div>

      <div class="poster-bottom">
        <button onclick="goEditor(${index})">
          Edit Design
        </button>

        <button
          onclick="downloadPreview(${index})"
          class="download-btn"
        >
          Download
        </button>
      </div>
    `;

    posterGrid.appendChild(card);

    const canvas = new fabric.Canvas(`previewCanvas-${index}`, {
      selection: false
    });

    canvas.setWidth(previewWidth);
    canvas.setHeight(previewHeight);

    renderPoster(canvas, designData);

    const wrapper = card.querySelector(".poster-preview-wrap");
    const canvasContainer = wrapper.querySelector(".canvas-container");

    if (canvasContainer) {
      canvasContainer.style.transform = `scale(${previewScale})`;
      canvasContainer.style.transformOrigin = "top left";
    }
  });
}

generatePosters();

function goEditor(index) {
  const card = document.querySelectorAll(".poster-card")[index];

  const designData = JSON.parse(card.dataset.design);

  localStorage.setItem(
    "selectedDesign",
    JSON.stringify(designData)
  );

  window.location.href = "editor.html";
}

function downloadPreview(index) {
  const card = document.querySelectorAll(".poster-card")[index];

  const designData = JSON.parse(card.dataset.design);

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = designData.width || 1080;
  tempCanvas.height = designData.height || 1080;

  const canvas = new fabric.Canvas(tempCanvas, {
    selection: false
  });

  canvas.setWidth(designData.width || 1080);
  canvas.setHeight(designData.height || 1080);

  renderPoster(canvas, designData);

  setTimeout(function () {
    const link = document.createElement("a");

    link.download = `poster-${index + 1}.png`;

    link.href = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2
    });

    link.click();
  }, 1200);
}

const loadMoreBtn =
  document.getElementById(
    "loadMoreBtn"
  );

if (loadMoreBtn) {

  loadMoreBtn.addEventListener(
    "click",
    function () {

      currentLimit += 12;

      generatePosters();

    }
  );

}

function getTemplateCategory(niche) {

  const food = [
    "restaurant",
    "pizza",
    "burger",
    "bakery",
    "sweet",
    "cafe",
    "juice",
    "biryani",
    "fastFood",
    "iceCream"
  ];

  const business = [
    "realEstate",
    "finance",
    "ca",
    "insurance",
    "startup",
    "corporate",
    "agency"
  ];

  const professional = [
    "advocate",
    "doctor",
    "clinic",
    "dentist",
    "coaching",
    "school",
    "gym",
    "salon",
    "spa"
  ];

  const product = [
    "perfume",
    "watch",
    "shoes",
    "clothing",
    "cosmetics",
    "furniture",
    "electronics",
    "laptop",
    "mobile"
  ];

  const retail = [
    "grocery",
    "rice",
    "oil",
    "bread",
    "biscuit",
    "tea",
    "coffee"
  ];

  const festival = [
    "durgaPuja",
    "diwali",
    "eid",
    "christmas",
    "wedding",
    "birthday"
  ];

  if (food.includes(niche))
    return "food";

  if (business.includes(niche))
    return "business";

  if (professional.includes(niche))
    return "professional";

  if (product.includes(niche))
    return "product";

  if (retail.includes(niche))
    return "retail";

  if (festival.includes(niche))
    return "festival";

  return "business";

}