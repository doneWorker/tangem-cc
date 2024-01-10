const CLOSED_LS_KEY = "closed-alerts"; // There are might be more than one manually closed alert
let closedAlertIds = [];

window.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
  document.body.classList.add("loaded");
  const alerts = document.querySelectorAll(".alert");
  closedAlertIds = getClosedAlerts();

  closedAlertIds.forEach((id) =>
    document.getElementById(id).classList.add("hidden")
  );

  // Handle close event
  Array.from(alerts).forEach((item) => {
    const close = item.querySelector(".close");

    if (close) {
      close.addEventListener("click", onCloseClick.bind(item));
    }
  });

  // On first alert disappear
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0, // 0 because we need to appear second alert when the first one is gone
  };

  const observer = new IntersectionObserver(handleIntersection, options);
  observer.observe(alerts[0]);

  function handleIntersection(entries) {
    if (entries[0].isIntersecting === false && closedAlertIds.length === 0) {
      animateIn(alerts[1]);
    }
  }

  document.ondblclick = discardClosedAlerts; // for debug purposes
}

// Utils
function onCloseClick() {
  const item = this;

  animateOut(item, () => {
    closeAlert(item.id);
    closedAlertIds = getClosedAlerts();
  });
}

function animateOut(element, onEndCallback) {
  element.classList.remove("fade-in");
  element.classList.add("fade-out");

  element.addEventListener("animationend", () => {
    element.classList.replace("fade-out", "hidden");
    onEndCallback?.();
  });
}

function animateIn(element, onEndCallback) {
  element.classList.remove("hidden");
  element.classList.add("fade-in");

  element.addEventListener("animationend", () => {
    onEndCallback?.();
  });
}

function getClosedAlerts() {
  const lsRecord = localStorage.getItem(CLOSED_LS_KEY);
  let alreadyClosed = lsRecord ? lsRecord.split(",") : [];

  return alreadyClosed;
}

function closeAlert(id) {
  const alreadyClosed = getClosedAlerts();
  if (alreadyClosed.includes(id)) {
    return;
  }

  alreadyClosed.push(id);
  localStorage.setItem(CLOSED_LS_KEY, alreadyClosed.join(","));
}

function discardClosedAlerts() {
  localStorage.removeItem(CLOSED_LS_KEY);
  location.reload();
}
