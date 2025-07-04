import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

// media query match that indicates mobile/tablet width
// const isDesktop = window.matchMedia('(min-width: 900px)');
const isDesktop = false;

// function closeOnEscape(e) {
//   if (e.code === 'Escape') {
//     const nav = document.getElementById('nav');
//     const navSections = nav.querySelector('.nav-sections');
//     const navSectionExpanded = navSections.querySelector(
//       '[aria-expanded="true"]',
//     );
//     if (navSectionExpanded && isDesktop) {
//       // eslint-disable-next-line no-use-before-define
//       toggleAllNavSections(navSections);
//       navSectionExpanded.focus();
//     } else if (!isDesktop) {
//       // eslint-disable-next-line no-use-before-define
//       toggleMenu(nav, navSections);
//       nav.querySelector('button').focus();
//     }
//   }
// }

// function closeOnFocusLost(e) {
//   const nav = e.currentTarget;
//   if (!nav.contains(e.relatedTarget)) {
//     const navSections = nav.querySelector('.nav-sections');
//     const navSectionExpanded = navSections.querySelector(
//       '[aria-expanded="true"]',
//     );
//     if (navSectionExpanded && isDesktop) {
//       // eslint-disable-next-line no-use-before-define
//       toggleAllNavSections(navSections, false);
//     } else if (!isDesktop) {
//       // eslint-disable-next-line no-use-before-define
//       toggleMenu(nav, navSections, false);
//     }
//   }
// }

// function openOnKeydown(e) {
//   const focused = document.activeElement;
//   const isNavDrop = focused.className === 'nav-drop';
//   if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
//     const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
//     // eslint-disable-next-line no-use-before-define
//     toggleAllNavSections(focused.closest('.nav-sections'));
//     focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
//   }
// }

// function focusNavSection() {
//   document.activeElement.addEventListener('keydown', openOnKeydown);
// }

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections
    .querySelectorAll(".nav-sections .default-content-wrapper > ul > li")
    .forEach((section) => {
      section.setAttribute("aria-expanded", expanded);
    });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
// TODO disable for POC
// function toggleMenu(nav, navSections, forceExpanded = null) {
// const expanded = forceExpanded !== null
//   ? !forceExpanded
//   : nav.getAttribute('aria-expanded') === 'true';
// const button = nav.querySelector('.nav-hamburger button');
// document.body.style.overflowY = expanded || isDesktop ? '' : 'hidden';
// nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
// toggleAllNavSections(navSections, expanded || isDesktop ? 'false' : 'true');
// button.setAttribute(
//   'aria-label',
//   expanded ? 'Open navigation' : 'Close navigation',
// );
// // enable nav dropdown keyboard accessibility
// const navDrops = navSections.querySelectorAll('.nav-drop');
// if (isDesktop) {
//   navDrops.forEach((drop) => {
//     if (!drop.hasAttribute('tabindex')) {
//       drop.setAttribute('tabindex', 0);
//       drop.addEventListener('focus', focusNavSection);
//     }
//   });
// } else {
//   navDrops.forEach((drop) => {
//     drop.removeAttribute('tabindex');
//     drop.removeEventListener('focus', focusNavSection);
//   });
// }
// // enable menu collapse on escape keypress
// if (!expanded || isDesktop) {
//   // collapse menu on escape press
//   window.addEventListener('keydown', closeOnEscape);
//   // collapse menu on focus lost
//   nav.addEventListener('focusout', closeOnFocusLost);
// } else {
//   window.removeEventListener('keydown', closeOnEscape);
//   nav.removeEventListener('focusout', closeOnFocusLost);
// }
// }

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata("nav");
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : "/nav";
  const fragment = await loadFragment(navPath);

  const path = window.location.pathname;
  let locale = "";
  if (path.startsWith("/en/")) locale = "/en";
  else if (path.startsWith("/de/")) locale = "/de";

  // decorate nav DOM
  block.textContent = "";
  const nav = document.createElement("nav");
  nav.id = "nav";
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ["brand", "sections", "tools"];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector(".nav-brand");
  const brandLink = navBrand.querySelector(".button");
  if (brandLink) {
    brandLink.className = "";
    brandLink.closest(".button-container").className = "";
  }

  const navSections = nav.querySelector(".nav-sections");
  if (navSections) {
    navSections
      .querySelectorAll(":scope .default-content-wrapper > ul > li")
      .forEach((navSection) => {
        if (navSection.querySelector("ul"))
          navSection.classList.add("nav-drop");
        navSection.addEventListener("click", () => {
          if (isDesktop) {
            const expanded =
              navSection.getAttribute("aria-expanded") === "true";
            toggleAllNavSections(navSections);
            navSection.setAttribute(
              "aria-expanded",
              expanded ? "false" : "true"
            );
          }
        });
      });
  }

  // hamburger for mobile
  const hamburger = document.createElement("div");
  hamburger.classList.add("nav-hamburger");
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;

  const homeBtn = document.createElement("a");
  homeBtn.classList.add("nav-home");
  homeBtn.setAttribute("href", "/");
  homeBtn.setAttribute("aria-label", "Home");
  homeBtn.innerHTML = '<span class="nav-home-icon"></span>';

  // wrap both in a container
  const mobileBtns = document.createElement("div");
  mobileBtns.classList.add("nav-buttons");
  mobileBtns.append(hamburger, homeBtn);

  // prepend the container to nav
  nav.prepend(mobileBtns);

  // hamburger.addEventListener("click", () => toggleMenu(nav, navSections));
  nav.setAttribute("aria-expanded", "false");
  // prevent mobile nav behavior on window resize
  // toggleMenu(nav, navSections, isDesktop);

  const navWrapper = document.createElement("div");
  navWrapper.className = "nav-wrapper";
  navWrapper.append(nav);
  block.append(navWrapper);

  const search = document.querySelector("span.icon-search")?.closest("a");
  search.href = locale + "/search" || "/search"; // fallback to root search if no locale
}
