const PLACEHOLDER_SRC =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const IMAGE_ROOT_SELECTOR = ".post-content, .moment-body";
const IMAGE_SKIP_SELECTOR =
  ".waline-container, .moment-header, .logo, header, nav, .profile";

let lazyImageObserver;

function getLazyImageObserver() {
  if (!("IntersectionObserver" in window)) {
    return null;
  }

  if (!lazyImageObserver) {
    lazyImageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          observer.unobserve(entry.target);
          delete entry.target.dataset.lazyObserved;
          startLazyLoad(entry.target);
        });
      },
      {
        rootMargin: "240px 0px",
        threshold: 0.01,
      }
    );
  }

  return lazyImageObserver;
}

function isEnhanceableImage(img) {
  if (!(img instanceof HTMLImageElement)) {
    return false;
  }

  if (!img.closest(IMAGE_ROOT_SELECTOR)) {
    return false;
  }

  if (img.closest(IMAGE_SKIP_SELECTOR)) {
    return false;
  }

  return img.dataset.imageSkip !== "true";
}

function getManagedImage(wrapper) {
  return wrapper?.querySelector("img.responsive-image, img") || null;
}

function getStage(wrapper) {
  return wrapper?.querySelector(".post-img-stage") || null;
}

function createErrorUI() {
  const errorUI = document.createElement("span");
  errorUI.className = "post-img-error-ui";
  errorUI.setAttribute("aria-live", "polite");

  const label = document.createElement("span");
  label.className = "post-img-error-label";
  label.textContent = "图片加载失败";
  errorUI.appendChild(label);

  return errorUI;
}

function ensureErrorUI(wrapper, img) {
  const stage = getStage(wrapper);
  if (!stage) {
    return;
  }

  let errorUI = stage.querySelector(".post-img-error-ui");
  if (!errorUI) {
    errorUI = createErrorUI();
    stage.appendChild(errorUI);
  }

  if (img.dataset.retryable === "true" && !errorUI.querySelector(".post-img-retry")) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "post-img-retry";
    button.textContent = "重试";
    button.addEventListener("click", () => retryImage(img));
    errorUI.appendChild(button);
  }
}

function parseDimension(value) {
  if (!value || !/^\d+$/.test(value)) {
    return 0;
  }

  return Number(value);
}

function setStageMetrics(wrapper, img) {
  const stage = getStage(wrapper);
  if (!stage) {
    return;
  }

  const attrWidth = parseDimension(img.getAttribute("width"));
  const attrHeight = parseDimension(img.getAttribute("height"));
  const naturalWidth = attrWidth || img.naturalWidth || 0;
  const naturalHeight = attrHeight || img.naturalHeight || 0;
  const rect = img.getBoundingClientRect();
  const renderedWidth = Math.round(rect.width);
  const width = renderedWidth || naturalWidth || 0;
  const height = naturalHeight || Math.round(rect.height) || 0;

  if (width > 0 && height > 0) {
    stage.style.setProperty("--post-img-stage-width", `${width}px`);
    stage.style.setProperty(
      "--post-img-aspect-ratio",
      `${naturalWidth || width} / ${naturalHeight || height}`
    );
    stage.style.setProperty("--post-img-width", `${naturalWidth || width}`);
    stage.style.setProperty("--post-img-height", `${naturalHeight || height}`);
    return;
  }

  stage.style.setProperty("--post-img-stage-width", "100%");
  stage.style.setProperty("--post-img-aspect-ratio", "16 / 10");
  stage.style.setProperty("--post-img-width", "16");
  stage.style.setProperty("--post-img-height", "10");
}

function setImageState(wrapper, state) {
  wrapper.classList.remove("is-loading", "is-loaded", "is-error");
  if (state) {
    wrapper.classList.add(state);
  }
}

function handleLoad(img) {
  const wrapper = img.closest(".post-img-view");
  if (!wrapper) {
    return;
  }

  requestAnimationFrame(() => {
    setStageMetrics(wrapper, img);
    setImageState(wrapper, "is-loaded");
  });
}

function handleError(img) {
  const wrapper = img.closest(".post-img-view");
  if (!wrapper) {
    return;
  }

  setImageState(wrapper, "is-error");
}

function startLazyLoad(img) {
  if (img.dataset.lazyStarted === "true") {
    return;
  }

  const wrapper = img.closest(".post-img-view");
  if (!wrapper) {
    return;
  }

  setImageState(wrapper, "is-loading");

  img.dataset.lazyStarted = "true";
  delete img.dataset.placeholderActive;
  if (img.dataset.srcset) {
    img.setAttribute("srcset", img.dataset.srcset);
  }
  if (img.dataset.src) {
    img.setAttribute("src", img.dataset.src);
  }
}

function observeLazyImage(img) {
  const observer = getLazyImageObserver();
  if (!observer) {
    startLazyLoad(img);
    return;
  }

  if (img.dataset.lazyObserved === "true") {
    return;
  }

  observer.observe(img);
  img.dataset.lazyObserved = "true";
}

function retryImage(img) {
  const wrapper = img.closest(".post-img-view");
  if (!wrapper) {
    return;
  }

  setImageState(wrapper, "is-loading");

  delete img.dataset.lazyStarted;
  if (img.dataset.srcset) {
    img.removeAttribute("srcset");
  }
  img.dataset.placeholderActive = "true";
  img.setAttribute("src", PLACEHOLDER_SRC);

  requestAnimationFrame(() => {
    startLazyLoad(img);
  });
}

function wrapBareImage(img) {
  if (!isEnhanceableImage(img) || img.closest(".post-img-view")) {
    return img.closest(".post-img-view");
  }

  const mediaNode =
    img.parentElement &&
    img.parentElement.tagName === "A" &&
    img.parentElement.childElementCount === 1
      ? img.parentElement
      : img;

  const parent = mediaNode.parentNode;
  if (!parent) {
    return null;
  }

  const wrapper = document.createElement("span");
  wrapper.className = "post-img-view post-img-view--raw";
  wrapper.dataset.imageEnhanced = "runtime";

  const stage = document.createElement("span");
  stage.className = "post-img-stage";

  parent.insertBefore(wrapper, mediaNode);
  wrapper.appendChild(stage);
  stage.appendChild(mediaNode);

  img.classList.add("responsive-image");
  setStageMetrics(wrapper, img);
  ensureErrorUI(wrapper, img);

  return wrapper;
}

function bindImage(img) {
  if (!isEnhanceableImage(img)) {
    return;
  }

  const wrapper = img.closest(".post-img-view") || wrapBareImage(img);
  if (!wrapper) {
    return;
  }

  ensureErrorUI(wrapper, img);
  setStageMetrics(wrapper, img);

  if (img.dataset.imageBound !== "true") {
    img.dataset.imageBound = "true";
    img.addEventListener("load", () => handleLoad(img));
    img.addEventListener("error", () => handleError(img));
  }

  if (img.dataset.src || img.dataset.srcset) {
    setImageState(wrapper, "is-loading");
    observeLazyImage(img);
    return;
  }

  if (img.complete) {
    if (img.naturalWidth > 0) {
      handleLoad(img);
    } else {
      handleError(img);
    }
    return;
  }

  setImageState(wrapper, "is-loading");
}

function refreshImages(root = document) {
  root.querySelectorAll("img").forEach((img) => {
    bindImage(img);
  });
}

function initImageLoading() {
  refreshImages(document);
}

window.ImageLoading = {
  refreshImages,
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initImageLoading, { once: true });
} else {
  initImageLoading();
}
