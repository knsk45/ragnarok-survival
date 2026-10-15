// Runs before game modules: initialization/resource failures must not leave a green screen.
(function () {
  let pending = "";
  function reveal(message) {
    pending = message;
    const panel = document.getElementById("fatal"),
      text = document.getElementById("fatalText");
    if (!panel || !text) return;
    text.textContent = "Сборка 0.8.0: " + message;
    panel.classList.remove("hide");
    document.getElementById("start")?.classList.add("hide");
    const reload = document.getElementById("fatalReload");
    if (reload) reload.onclick = () => location.reload();
  }
  addEventListener(
    "error",
    (event) => {
      if (event.target?.tagName === "SCRIPT")
        reveal("Не загружен модуль " + event.target.getAttribute("src"));
      else if (!window.RS_BOOTED && event.message) reveal(event.message);
    },
    true,
  );
  addEventListener("DOMContentLoaded", () => {
    if (pending) reveal(pending);
    else if (!window.RS_BOOTED)
      reveal("Инициализация не завершилась. Перезагрузите страницу.");
  });
})();
