function startEditor(type) {
  localStorage.setItem("editorStartType", type);
  localStorage.removeItem("selectedDesign");
  localStorage.removeItem("editorDraft");

  window.location.href = "editor.html";
}