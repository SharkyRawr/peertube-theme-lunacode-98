function register () {
  const init = () => document.body.classList.add("pt98-theme");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}

export { register };
