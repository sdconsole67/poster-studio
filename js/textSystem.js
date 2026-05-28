function initializeTextSystem() {

  setupLiveTextEditing();

  setupTextStyles();

}

function setupLiveTextEditing() {

  const input =
    document.getElementById(
      "textInput"
    );

  if (!input) return;

  input.addEventListener(
    "input",
    function () {

      const active =
        canvas.getActiveObject();

      if (
        !active ||
        (
          active.type !== "textbox" &&
          active.type !== "text"
        )
      ) {
        return;
      }

      active.text =
        this.value;

      refreshCanvas();

    }
  );

}

function addText() {

  const text =
    new fabric.Textbox(
      "New Text",
      {
        left: 120,
        top: 120,
        fontSize: 42,
        fill: "#ffffff"
      }
    );

  canvas.add(text);

  canvas.setActiveObject(text);

  refreshCanvas();

}