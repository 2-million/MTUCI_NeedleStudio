document.addEventListener("DOMContentLoaded", function () {
  const slidesWrapper = document.querySelector(".slides-wrapper");
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const dotsContainer = document.querySelector(".dots-container");

  let currentSlide = 0;
  const slideCount = slides.length;

  let startX = 0;
  let isDragging = false;
  const swipeThreshold = 50;

  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function goToSlide(slideIndex) {
    slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
    currentSlide = slideIndex;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === slideIndex);
    });
  }

  nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slideCount;
    goToSlide(currentSlide);
  });

  prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    goToSlide(currentSlide);
  });

  slidesWrapper.addEventListener("touchstart", handleSwipeStart);
  slidesWrapper.addEventListener("touchmove", handleSwipeMove);
  slidesWrapper.addEventListener("touchend", handleSwipeEnd);

  slidesWrapper.addEventListener("mousedown", handleSwipeStart);
  slidesWrapper.addEventListener("mousemove", handleSwipeMove);
  slidesWrapper.addEventListener("mouseup", handleSwipeEnd);
  slidesWrapper.addEventListener("mouseleave", handleSwipeEnd);

  function handleSwipeStart(e) {
    if (e.type === "touchstart") {
      startX = e.touches[0].clientX;
    } else {
      startX = e.clientX;
      isDragging = true;
    }
  }

  function handleSwipeMove(e) {
    if (!isDragging && e.type !== "touchmove") return;

    let currentX;
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }

    const diffX = startX - currentX;

    if (Math.abs(diffX) > 10) {
      e.preventDefault();
    }
  }

  function handleSwipeEnd(e) {
    if (!isDragging && e.type !== "touchend") return;

    let endX;
    if (e.type === "touchend") {
      endX = e.changedTouches[0].clientX;
    } else {
      endX = e.clientX;
    }

    const diffX = startX - endX;

    if (diffX > swipeThreshold) {
      currentSlide = (currentSlide + 1) % slideCount;
      goToSlide(currentSlide);
    } else if (diffX < -swipeThreshold) {
      currentSlide = (currentSlide - 1 + slideCount) % slideCount;
      goToSlide(currentSlide);
    }

    isDragging = false;
  }
});

const toggle = document.getElementById("theme-toggle");

function setTheme(isDark) {
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
    toggle.checked = true;
  } else {
    document.documentElement.removeAttribute("data-theme");
    toggle.checked = false;
  }
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  setTheme(true);
} else if (savedTheme === "light") {
  setTheme(false);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark);
}

toggle.addEventListener("change", () => {
  const isDark = toggle.checked;
  setTheme(isDark);

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (savedTheme === null) {
      setTheme(e.matches);
    }
  });

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

const navLinks = document.querySelectorAll(".nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("active");
    menuToggle.classList.remove("active");
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentNode;
    const isActive = item.classList.contains("active");

    document.querySelectorAll(".faq-item").forEach((el) => {
      el.classList.remove("active");
    });

    if (!isActive) {
      item.classList.add("active");
    }
  });
});

document.querySelectorAll(".details-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const modalId = button.getAttribute("data-modal");
    document.getElementById(modalId).classList.add("active");
  });
});

document.querySelectorAll(".close-btn").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".modal").classList.remove("active");
  });
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
});

document.querySelectorAll(".try").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("trialModal").style.display = "flex";
  });
});

document.querySelector(".close-btn").addEventListener("click", closeModal);

function closeModal() {
  document.getElementById("trialModal").style.display = "none";
}

window.addEventListener("click", (e) => {
  if (e.target === document.getElementById("trialModal")) {
    closeModal();
  }
});

document.getElementById("trialForm").addEventListener("submit", function (e) {
  e.preventDefault();

  closeModal();

  const notification = document.getElementById("notification");
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);

  this.reset();
});

document.getElementById("phone").addEventListener("input", function (e) {
  let x = e.target.value
    .replace(/\D/g, "")
    .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
  e.target.value = !x[2]
    ? x[1]
    : "+7 (" +
      x[2] +
      (x[3] ? ") " + x[3] : "") +
      (x[4] ? "-" + x[4] : "") +
      (x[5] ? "-" + x[5] : "");
});
