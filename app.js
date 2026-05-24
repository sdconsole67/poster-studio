const briefForm = document.getElementById("briefForm");

briefForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const productImageInput = document.getElementById("productImage");
  const logoInput = document.getElementById("logo");

  const briefData = {
    posterType: document.getElementById("posterType")?.value || "",
    niche: document.getElementById("niche")?.value || "",
    businessName: document.getElementById("businessName")?.value || "",
    headline: document.getElementById("headline")?.value || "",
    subHeading: document.getElementById("subHeading")?.value || "",
    offer: document.getElementById("offer")?.value || "",
    phone: document.getElementById("phone")?.value || "",
    cta: document.getElementById("cta")?.value || "",
    website: document.getElementById("website")?.value || "",
    address: document.getElementById("address")?.value || "",
    productImage: "",
    logo: ""
  };

  function saveAndGo() {
    localStorage.setItem("posterBrief", JSON.stringify(briefData));
    window.location.href = "generate.html";
  }

  const productFile = productImageInput?.files[0];
  const logoFile = logoInput?.files[0];

  if (productFile) {
    const reader = new FileReader();

    reader.onload = function (e) {
      briefData.productImage = e.target.result;

      if (logoFile) {
        const logoReader = new FileReader();

        logoReader.onload = function (logoEvent) {
          briefData.logo = logoEvent.target.result;
          saveAndGo();
        };

        logoReader.readAsDataURL(logoFile);
      } else {
        saveAndGo();
      }
    };

    reader.readAsDataURL(productFile);
  } else {
    saveAndGo();
  }
});


function sendFeedback() {
  const feedback =
    document.getElementById("feedbackText").value.trim();

  if (!feedback) {
    alert("Please write your feedback first.");
    return;
  }

  const message =
    `Poster Studio Feedback:%0A%0A${encodeURIComponent(feedback)}`;

  window.open(
    `https://wa.me/918972316100?text=${message}`,
    "_blank"
  );
}