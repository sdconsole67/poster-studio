const badgePresets = [
  { text:"50% OFF", bg:"#ffcc00", color:"#111", shape:"round" },
  { text:"SALE", bg:"#ff2d2d", color:"#fff", shape:"round" },
  { text:"NEW", bg:"#00e5ff", color:"#02131a", shape:"pill" },
  { text:"FREE", bg:"#00d084", color:"#03140d", shape:"pill" },
  { text:"LIMITED", bg:"#111111", color:"#ffd66b", shape:"round" },
  { text:"OFFER", bg:"#ff66c4", color:"#fff", shape:"round" },
  { text:"BUY 1 GET 1", bg:"#7b61ff", color:"#fff", shape:"pill" },
  { text:"HOT DEAL", bg:"#ff4d00", color:"#fff", shape:"circle" },
  { text:"BEST PRICE", bg:"#ffffff", color:"#111", shape:"round" },
  { text:"TODAY ONLY", bg:"#1f2635", color:"#ffcc00", shape:"pill" }
];

const badgeColors = [
  "#ffcc00","#ff2d2d","#00e5ff","#00d084","#ff66c4",
  "#7b61ff","#ff4d00","#ffffff","#111111","#d4af37"
];

const badgeTexts = [
  "50% OFF","SALE","NEW","FREE","LIMITED","OFFER",
  "BUY 1 GET 1","HOT DEAL","BEST PRICE","TODAY ONLY"
];

for(let i = 0; i < 90; i++){
  badgePresets.push({
    text: badgeTexts[i % badgeTexts.length],
    bg: badgeColors[i % badgeColors.length],
    color: i % 3 === 0 ? "#111111" : "#ffffff",
    shape: ["round","pill","circle"][i % 3]
  });
}

function renderBadgeLibrary(){
  const grid = document.getElementById("badgeGrid");
  if(!grid) return;

  grid.innerHTML = "";

  badgePresets.forEach(function(badge, index){
    const card = document.createElement("div");
    card.className = "badge-card";
    card.style.background = badge.bg;
    card.style.color = badge.color;
    card.style.borderRadius =
      badge.shape === "pill" ? "999px" :
      badge.shape === "circle" ? "50%" : "16px";

    card.innerText = badge.text;

    card.onclick = function(){
      addEditableBadge(badge);
    };

    grid.appendChild(card);
  });
}

function addEditableBadge(badge){
  const radius =
    badge.shape === "pill" ? 999 :
    badge.shape === "circle" ? 90 : 22;

  const width = badge.shape === "circle" ? 170 : 280;
  const height = badge.shape === "circle" ? 170 : 86;

  const rect = new fabric.Rect({
    left:0,
    top:0,
    width,
    height,
    fill:badge.bg,
    rx:radius,
    ry:radius
  });

  const text = new fabric.Textbox(badge.text, {
    left:14,
    top:height / 2 - 18,
    width:width - 28,
    fontSize:badge.shape === "circle" ? 30 : 34,
    fill:badge.color,
    fontFamily:"Montserrat",
    fontWeight:"900",
    textAlign:"center"
  });

  const group = new fabric.Group([rect,text], {
    left:120,
    top:120
  });

  group.customType = "editableBadge";
  group.badgeBg = badge.bg;
  group.badgeTextColor = badge.color;

  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();

  if(typeof refreshLayers === "function"){
    refreshLayers();
  }
}

document.addEventListener("DOMContentLoaded", renderBadgeLibrary);