// Marks the selected row so NavBar can re-reveal it when the scroll viewport resizes.
// An attribute rather than a ref because the row may be a nav item or a sub-nav item.
export const NAV_ACTIVE_ATTRIBUTE = "data-nav-active";

// The mobile drawer draws the same nav icons as the desktop rail, 1.2x larger (20px -> 24px).
export const MOBILE_NAV_ICON_SIZE = 24;

// No Tailwind width token matches, and arbitrary values are not allowed, so the drawer
// takes its width as an inline style.
export const MOBILE_NAV_DRAWER_WIDTH = "294px";
