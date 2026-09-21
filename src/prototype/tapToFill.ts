// Tap to fill: in the product screens no field takes typing. Tapping an empty field
// fills it with a sample value that suits the field; tapping a filled field clears
// it. This keeps a demo quick and stops anyone entering real customer details.
//
// Search-and-pick dropdowns are left alone, because tapping them opens their list,
// which is how an option is chosen. Read-only and disabled fields are left alone too.
import { getProto } from "./state";
import { SAMPLE, samplePan } from "../mocks/fixtures";

const SCOPE = ".proto-screen-wrap";

/**
 * Everything that says what a field is for: its name and placeholder, plus the
 * visible text around it (the product draws most labels as plain text, not <label>).
 * That text is taken from the largest wrapper that still holds only this one field.
 */
function describe(input: HTMLInputElement | HTMLTextAreaElement): string {
  const bits = [input.name, input.id, input.placeholder, input.getAttribute("aria-label"), input.type, input.inputMode];
  let el: HTMLElement | null = input.parentElement;
  let around = "";
  for (let i = 0; i < 6 && el && !el.matches(SCOPE); i++) {
    if (el.querySelectorAll("input, textarea").length > 1) break;
    around = (el.innerText || el.textContent || "").slice(0, 200);
    el = el.parentElement;
  }
  bits.push(around);
  return bits.filter(Boolean).join(" ").toLowerCase();
}

/** Is this field one of the people on the directors, partners or members list? */
function inPeopleList(input: Element) {
  const text = (input.closest("form") ?? document.querySelector(SCOPE))?.textContent ?? "";
  return /directors|partners|HUF members|Beneficial Owners/i.test(text) && getProto().step === "management";
}

function sampleFor(input: HTMLInputElement | HTMLTextAreaElement): string {
  const d = describe(input);
  if (input instanceof HTMLTextAreaElement || /describe|description|about your business/.test(d)) {
    return "Brand and web design for clients in the United States and the United Kingdom, found through LinkedIn and referrals.";
  }
  if (/e-?mail/.test(d)) return SAMPLE.email;
  if (/website|link|url|online presence|linkedin|upwork|fiverr/.test(d)) return "www.meridiandesign.example.com";
  if (/ifsc/.test(d)) return SAMPLE.ifsc;
  if (/account number|account no|accountnumber/.test(d)) return SAMPLE.bankAccount;
  if (/gst/.test(d)) return "29ABCPJ1234K1Z5";
  if (/\bpan\b|pan number|pannumber/.test(d)) return inPeopleList(input) ? "ABCPM5678L" : samplePan();
  if (/mobile|phone/.test(d)) return SAMPLE.phone;
  if (/percent|share|ownership|%/.test(d)) return "40";
  if (/name|address you/.test(d)) return inPeopleList(input) ? "ARJUN MEHTA" : SAMPLE.name.split(" ")[0];
  if (/amount|volume|revenue/.test(d) || input.inputMode === "numeric" || input.type === "number") return "1000";
  return "Sample text";
}

// --- writing values the way React expects ------------------------------------

let internal = false;

function setValue(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

const OTP_LABEL = /enter otp character/i;

/** The whole row of code boxes: each box has its own wrapper, so climb to the row. */
function otpBoxes(input: HTMLInputElement): HTMLInputElement[] {
  let el: HTMLElement | null = input.parentElement;
  for (let i = 0; i < 6 && el; i++, el = el.parentElement) {
    const boxes = (Array.from(el.querySelectorAll("input")) as HTMLInputElement[]).filter((b) =>
      OTP_LABEL.test(b.getAttribute("aria-label") ?? "")
    );
    if (boxes.length >= 4) return boxes;
  }
  return [input];
}

// A short pause for React to register focus. (Animation frames pause in background tabs.)
const nextFrame = () => new Promise<void>((r) => setTimeout(r, 30));

/**
 * Fills or clears a row of code boxes. The box component tracks which box is
 * focused, so each box is focused and allowed a frame to register it first.
 */
async function toggleOtp(input: HTMLInputElement) {
  const boxes = otpBoxes(input);
  if (!boxes.length) return;
  const filled = boxes.some((b) => b.value);
  // Any digits work on the code screens; show a recognisable sample.
  const digits = "482193".slice(0, boxes.length).padEnd(boxes.length, "0");
  internal = true;
  try {
    if (!filled) {
      // The boxes accept a whole code arriving in one box (as phone autofill does)
      // and spread it across the row.
      boxes[0].focus();
      await nextFrame();
      setValue(boxes[0], digits);
      await nextFrame();
    } else {
      // Start at the last box and press backspace; the row moves focus left itself.
      boxes[boxes.length - 1].focus();
      await nextFrame();
      for (let n = 0; n < boxes.length; n++) {
        const target = (document.activeElement as HTMLElement | null) ?? boxes[0];
        target.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", code: "Backspace", bubbles: true }));
        await nextFrame();
        await nextFrame();
      }
    }
    (document.activeElement as HTMLElement | null)?.blur();
  } finally {
    internal = false;
  }
}

// --- which fields take part ---------------------------------------------------

function isTextField(el: EventTarget | null): el is HTMLInputElement | HTMLTextAreaElement {
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return false;
  if (!el.closest(SCOPE) || el.closest(".proto-modal")) return false;
  if (el instanceof HTMLInputElement && !["text", "email", "tel", "number", "search", "url", "password", ""].includes(el.type))
    return false;
  return true;
}

/** A dropdown that is picked from a list: tapping it should open the list. */
function isPicker(el: HTMLInputElement | HTMLTextAreaElement) {
  return el.readOnly || el.disabled || /search|select|nationality|country|currency/i.test(el.placeholder ?? "");
}

// --- wiring ---------------------------------------------------------------------

function onClick(e: MouseEvent) {
  const el = e.target;
  if (!isTextField(el) || isPicker(el)) return;
  if (el instanceof HTMLInputElement && OTP_LABEL.test(el.getAttribute("aria-label") ?? "")) {
    void toggleOtp(el);
    return;
  }
  internal = true;
  try {
    setValue(el, el.value ? "" : sampleFor(el));
  } finally {
    internal = false;
  }
}

/** Typing, pasting and dropping are switched off in product fields. */
function onKeyDown(e: KeyboardEvent) {
  if (internal) return;
  const el = e.target;
  if (!isTextField(el) || isPicker(el)) return;
  const typing = e.key.length === 1 || e.key === "Backspace" || e.key === "Delete";
  if (typing && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function onPasteOrDrop(e: Event) {
  if (internal) return;
  const el = e.target;
  if (isTextField(el) && !isPicker(el)) {
    e.preventDefault();
    e.stopPropagation();
  }
}

let installed = false;

export function installTapToFill() {
  if (installed) return;
  installed = true;
  document.addEventListener("click", onClick, true);
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("paste", onPasteOrDrop, true);
  document.addEventListener("drop", onPasteOrDrop, true);
}
