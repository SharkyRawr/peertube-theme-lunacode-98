const WINDOW_SELECTORS = [
  "main section",
  "main article",
  "main aside",
  ".video-miniature",
  ".video-playlist-element",
  ".video-description",
  ".comment",
  ".card",
  ".block",
  ".playlist",
  ".channel-information"
];

const TITLED_WINDOW_SELECTORS = [
  "main section",
  "main article",
  ".video-description",
  ".channel-information",
  ".playlist"
];

const BUTTON_SELECTORS = [
  "button",
  ".btn",
  "a.btn",
  ".button",
  "a[role='button']"
];

const FIELD_SELECTORS = [
  "input:not([type='checkbox']):not([type='radio']):not([type='hidden'])",
  "textarea",
  "select"
];

const START_BUTTON_CLASS = "pt98-start-button";
const CLOCK_CLASS = "pt98-clock";
const TITLE_BAR_CLASS = "pt98-title-bar";
const WINDOW_BODY_CLASS = "pt98-window-body";
let clockTimer = null;

function getWindowTitle (el) {
  const heading = el.querySelector(":scope > h1, :scope > h2, :scope > h3");
  if (heading && heading.textContent) return heading.textContent.trim();
  if (el.classList.contains("video-description")) return "Description";
  if (el.classList.contains("channel-information")) return "Channel";
  if (el.classList.contains("playlist")) return "Playlist";
  if (el.matches("main section")) return "Section";
  if (el.matches("main article")) return "Window";
  return "PeerTube";
}

function ensureTitleBar (el) {
  if (el.querySelector(`:scope > .${TITLE_BAR_CLASS}`)) return;

  const titleBar = document.createElement("div");
  titleBar.classList.add("title-bar", TITLE_BAR_CLASS);

  const titleText = document.createElement("div");
  titleText.classList.add("title-bar-text");
  titleText.textContent = getWindowTitle(el);

  const controls = document.createElement("div");
  controls.classList.add("title-bar-controls");

  ["Minimize", "Maximize", "Close"].forEach(label => {
    const control = document.createElement("button");
    control.setAttribute("aria-label", label);
    control.disabled = true;
    control.tabIndex = -1;
    controls.appendChild(control);
  });

  titleBar.append(titleText, controls);
  el.insertBefore(titleBar, el.firstChild);
}

function ensureWindowBody (el) {
  if (el.querySelector(`:scope > .${WINDOW_BODY_CLASS}`)) return;

  const body = document.createElement("div");
  body.classList.add("window-body", WINDOW_BODY_CLASS);

  const movableNodes = Array.from(el.childNodes).filter(node => {
    return !(node.nodeType === 1 && node.classList.contains(TITLE_BAR_CLASS));
  });

  movableNodes.forEach(node => body.appendChild(node));
  el.appendChild(body);
}

function updateClock (clockEl) {
  const value = new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());
  clockEl.textContent = value;
}

function addClasses (root) {
  root.querySelectorAll(WINDOW_SELECTORS.join(",")).forEach(el => {
    if (el.classList.contains("pt98-window")) return;
    if (el.closest(".dropdown-menu, .modal-backdrop")) return;
    el.classList.add("window", "pt98-window");
  });

  root.querySelectorAll(TITLED_WINDOW_SELECTORS.join(",")).forEach(el => {
    if (!el.classList.contains("pt98-window")) return;
    if (el.closest(".modal-content, .dropdown-menu")) return;
    el.classList.add("pt98-window-with-title");
    ensureTitleBar(el);
    ensureWindowBody(el);
  });

  root.querySelectorAll(BUTTON_SELECTORS.join(",")).forEach(el => {
    el.classList.add("pt98-button");
  });

  root.querySelectorAll(FIELD_SELECTORS.join(",")).forEach(el => {
    el.classList.add("pt98-field");
  });
}

function decorateTopBar () {
  const taskbar = document.querySelector(
    "#header, header, .top-menu, .navbar, .instance-header"
  );
  if (!taskbar) return;
  taskbar.classList.add("pt98-taskbar");

  if (!taskbar.querySelector(`:scope > .${START_BUTTON_CLASS}`)) {
    const startButton = document.createElement("button");
    startButton.type = "button";
    startButton.classList.add("pt98-button", START_BUTTON_CLASS);

    const icon = document.createElement("span");
    icon.classList.add("pt98-start-icon");
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.textContent = "Start";

    startButton.append(icon, label);
    taskbar.insertBefore(startButton, taskbar.firstChild);
  }

  let clock = taskbar.querySelector(`:scope > .${CLOCK_CLASS}`);
  if (!clock) {
    clock = document.createElement("div");
    clock.classList.add("status-bar-field", CLOCK_CLASS);
    taskbar.appendChild(clock);
  }

  updateClock(clock);

  if (!clockTimer) {
    clockTimer = window.setInterval(() => {
      const currentClock = document.querySelector(`.${CLOCK_CLASS}`);
      if (currentClock) updateClock(currentClock);
    }, 30000);
  }
}

function register () {
  const init = () => {
    document.body.classList.add("pt98-theme");
    decorateTopBar();
    addClasses(document);

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        decorateTopBar();
        addClasses(document);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}

export { register };
