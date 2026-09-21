// A second (i) button that sits beside the PAN field and explains what the fourth
// letter of a PAN decides. Positioned by measuring the real input, so the product's
// own markup is left untouched.
import React, { useEffect, useState } from "react";
import { PAN_RULE } from "../content";
import { RulePanel } from "./InfoPopup";

export function PanRuleButton() {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    let tries = 0;

    const place = () => {
      tries += 1;
      const wrap = document.querySelector(".proto-screen-wrap") as HTMLElement | null;
      const input = wrap?.querySelector("input") as HTMLElement | null;
      if (wrap && input) {
        const w = wrap.getBoundingClientRect();
        const i = input.getBoundingClientRect();
        setPos({ top: i.top - w.top + i.height / 2 - 13, left: i.right - w.left + 10 });
        return;
      }
      if (tries < 60) frame = window.setTimeout(place, 80);
    };

    place();
    window.addEventListener("resize", place);
    return () => {
      window.clearTimeout(frame);
      window.removeEventListener("resize", place);
    };
  }, []);

  if (!pos) return null;

  return (
    <>
      <button
        type="button"
        className="proto-field-info"
        style={{ top: pos.top, left: pos.left }}
        onClick={() => setOpen(true)}
        title="How the PAN decides the business type"
        aria-label="How the PAN decides the business type"
      >
        i
      </button>

      {open && (
        <RulePanel title={PAN_RULE.title} onClose={() => setOpen(false)}>
          <p style={{ fontSize: 15.5, lineHeight: 1.5, marginTop: 0 }}>{PAN_RULE.intro}</p>
          <table className="proto-rule-table">
            <tbody>
              {PAN_RULE.rows.map((r) => (
                <tr key={r.letter}>
                  <td className="proto-rule-letter">{r.letter}</td>
                  <td>
                    <strong>{r.meaning}</strong>
                    <br />
                    {r.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 15, marginTop: 14, color: "#5a6484" }}>{PAN_RULE.footer}</p>
        </RulePanel>
      )}
    </>
  );
}
