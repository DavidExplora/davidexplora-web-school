// =========================================
// DAVID EXPLORA
// BASIC WEBSITE JAVASCRIPT
// =========================================


// ---------- MOBILE NAVIGATION ----------

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {

    mainNav.classList.toggle("active");

});


// ---------- CLOSE MENU AFTER CLICK ----------

const navLinks = document.querySelectorAll(".main-nav a");

navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        mainNav.classList.remove("active");

    });

});


// ---------- CURRENT YEAR ----------

const yearElement = document.querySelector("#current-year");

const currentYear = new Date().getFullYear();

yearElement.textContent = currentYear;