import React, { useEffect, useState } from "react";
import Popup from "../../AtomicComponents/Popup";
import DateSelector from "../../AtomicComponents/DateSelector";
import SelectDropdown from "../../AtomicComponents/Dropdown/SelectDropdown";
import Button from "../../AtomicComponents/Button";
import Tooltip from "../../AtomicComponents/Tooltip";
import { BUTTON_SIZES, BUTTON_TYPES, TOOLTIP_POSITION } from "../../../constants/atomicConstants";
import Locale from "../../../util/locale/en";
import useInternationalAccountsStore from "../../../store/useInternationalAccountsStore";
import { Option } from "../../../types/atomicComponentTypes";
import { VirtualAccountDetail } from "../../../types";
import useAnalytics from "../../../analytics/useAnalytics";
import { Events } from "../../../analytics/EventConstants";
import USFlagIcon from "../../Icons/CountryFlags/USFlagIcon";
import CanadaFlagIcon from "../../Icons/CountryFlags/CanadaFlagIcon";
import UKFlagIcon from "../../Icons/CountryFlags/UKFlagIcon";
import EuropeFlagIcon from "../../Icons/CountryFlags/EuropeFlagIcon";
import UaeFlagIcon from "../../Icons/CountryFlags/UaeFlagIcon";
import SingaporeFlagIcon from "../../Icons/CountryFlags/SingaporeFlagIcon";
import AusFlagIcon from "../../Icons/CountryFlags/AusFlagIcon";
import ROWFlagIcon from "../../Icons/CountryFlags/ROWFlagIcon";
import BankIcon from "../../Icons/BankIcon";
import Image from "next/image";
import { BankHolidayNote, isSwiftAccount, toPaymentVendor } from "./catalog";
import { fetchData } from "../../../util/beCall";
import { uniqBy } from "remeda";
import { ALLOWED_METHODS } from "../../../constants/apiConstants";
import styles from "./index.module.css";

type EntryPoint = "unmapped_payments_active" | "unmapped_payments_empty" | "invoice_detail";

// Payment-mode dropdown sentinels (not real networks — handled client-side).
const MODE_DONT_KNOW = "DONT_KNOW";
const MODE_OTHERS = "OTHERS";

// ── Backend response shapes (fundingTimelineEstimate GraphQL query) ─────────────
// One estimate per payment network (rail). The backend owns the network list, the
// business-day window and the holiday-adjusted date — the FE computes none of it.

interface TransactionIncidentResp {
  incidentType: string;
  incidentDate: string; // YYYY-MM-DD
  incidentDescription: string | null;
}

interface PaymentModeEstimate {
  paymentNetwork: string; // enum name, e.g. "ACH" / "FEDWIRE" / "SWIFT"
  paymentNetworkLabel: string; // display label, e.g. "ACH" / "Instant SEPA"
  businessDays: number; // settlement duration; FE shows the window as "1 to this"
  expectedSettlementDate: string; // YYYY-MM-DD
  transactionIncidentReasons: TransactionIncidentResp[];
}

interface FundingTimelineEstimate {
  estimates: PaymentModeEstimate[];
}

const FX_BANK_HOLIDAY_INCIDENT = "FX_BANK_HOLIDAY";

type EstimateStatus = "EXPECTED" | "PASSED" | "TODAY";

// ── Component props ───────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formTitle?: string;
  entryPoint: EntryPoint;
  invoiceCurrency?: string;
}

// ── Currency flag map ─────────────────────────────────────────────────────────

const CURRENCY_FLAG_MAP: Record<string, JSX.Element> = {
  USD: <USFlagIcon isFx={true} width={20} height={20} />,
  CAD: <CanadaFlagIcon width={20} height={20} />,
  GBP: <UKFlagIcon width={20} height={20} />,
  EUR: <EuropeFlagIcon width={20} height={20} />,
  AED: <UaeFlagIcon width={20} height={20} />,
  SGD: <SingaporeFlagIcon width={20} height={20} />,
  AUD: <AusFlagIcon width={20} height={20} />,
  OTHER: <ROWFlagIcon width={20} height={20} />,
};

const getCurrencyFlag = (currency: string): JSX.Element | null =>
  CURRENCY_FLAG_MAP[currency] ?? null;

// Currencies always offered in the payment-currency dropdown (order preserved).
const SUPPORTED_CURRENCIES = ["USD", "CAD", "GBP", "EUR", "AED", "SGD", "AUD"];

// Real bank logos (already in /public) picked by bank name; otherwise the
// generic bank icon. e.g. "The Currency Cloud Limited" → cc.png, "DBS …" → DBS.svg.
// Every account icon renders in the same 18×18 slot so branded logos and the
// generic fallback line up at a consistent small size in the dropdown rows.
const getAccountIcon = (bankName?: string): JSX.Element => {
  const name = (bankName ?? "").toLowerCase();
  const inner = name.includes("currency cloud")
    ? <Image src={"/cc.png"} alt={""} width={18} height={18} />
    : name.includes("dbs")
      ? <Image src={"/DBS.svg"} alt={""} width={18} height={18} />
      : <BankIcon stroke={"#283C8B"} width={15} height={15} />;
  return <span className={"flex items-center justify-center w-[18px] h-[18px] flex-shrink-0"}>{inner}</span>;
};

// ── Date / status helpers ───────────────────────────────────────────────────

const computeStatus = (expectedIso: string): EstimateStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expected = new Date(expectedIso + "T00:00:00");
  expected.setHours(0, 0, 0, 0);
  if (expected.getTime() < today.getTime()) return "PASSED";
  if (expected.getTime() === today.getTime()) return "TODAY";
  return "EXPECTED";
};

// The latest arrival date drives the modal title/footer when several mode cards
// are shown together (the "I don't know" path).
const latestDate = (estimates: PaymentModeEstimate[]): string =>
  estimates.reduce((latest, e) => (e.expectedSettlementDate > latest ? e.expectedSettlementDate : latest), "");

// Pulls the FX bank holidays out of the backend incident list (the only incident
// type the UI surfaces, to show the "+N day(s) due to bank holiday" note).
const toHolidayNotes = (incidents: TransactionIncidentResp[]): BankHolidayNote[] =>
  incidents
    .filter((incident) => incident.incidentType === FX_BANK_HOLIDAY_INCIDENT)
    .map((incident) => ({ date: incident.incidentDate, description: incident.incidentDescription }));

// ── Display helpers ───────────────────────────────────────────────────────────

const toDisplayDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const getOrdinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

// Month names indexed 0–11. Dates are formatted straight from the ISO string
// components (no Date object) so the displayed day never shifts by timezone —
// `new Date("2026-07-06T00:00:00")` is parsed in local time, and reading it back
// with getUTC* drops a day for users ahead of UTC (e.g. IST).
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ordinalDateLabel = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day}${getOrdinalSuffix(day)} ${MONTH_NAMES[month - 1]}, ${year}`;
};

// Short ordinal date for the bank-holiday tooltip lines, e.g. "17th June".
const ordinalDayMonth = (iso: string): string => {
  const [, month, day] = iso.split("-").map(Number);
  return `${day}${getOrdinalSuffix(day)} ${MONTH_NAMES[month - 1]}`;
};

// "End of day" only makes sense for a future arrival estimate — a date that has
// already passed isn't still awaiting its end, so PASSED omits it; TODAY keeps
// its own fixed copy.
const estimatedDateLabel = (iso: string, status: EstimateStatus): string => {
  if (status === "TODAY") return Locale.byEndOfDayToday;
  if (status === "PASSED") return `By ${ordinalDateLabel(iso)}`;
  return `By ${ordinalDateLabel(iso)} (${Locale.endOfDay})`;
};

// Window is always "1 to <businessDays>" — the min is fixed at 1 on the FE, the
// upper bound comes from the backend. → "1 business day" / "1–3 business days".
const businessDayRange = (businessDays: number): string =>
  businessDays <= 1 ? "1 business day" : `1–${businessDays} business days`;

const descriptorFor = (estimate: PaymentModeEstimate): string =>
  Locale.fundingTimelineArrivalDescriptor.replace(":range", businessDayRange(estimate.businessDays));

// ── Icons ─────────────────────────────────────────────────────────────────────

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333 2 14l.667-3.333L11.333 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={"block"} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#8898AA" strokeWidth="1.5" />
    <path
      d="M9.88 9.5a2.25 2.25 0 1 1 3.4 1.94c-.68.4-1.28.94-1.28 1.73v.33"
      stroke="#8898AA"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 16.75h.01" stroke="#8898AA" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const AlertIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="#e11900" strokeWidth="1.5" />
    <path d="M10 5.5v5.5M10 13.5v.01" stroke="#e11900" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ContinueArrowIcon = ({ color = "#FFFFFF" }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8h9M8.5 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── ResultCard ────────────────────────────────────────────────────────────────

const ResultCard = ({
  estimate,
  onBankHolidayTooltipView,
}: {
  estimate: PaymentModeEstimate;
  onBankHolidayTooltipView?: (notes: BankHolidayNote[]) => void;
}) => {
  const status = computeStatus(estimate.expectedSettlementDate);
  const bankHolidays = toHolidayNotes(estimate.transactionIncidentReasons ?? []);
  const holidayCount = bankHolidays.length;
  // One line per holiday hit in the window, e.g. "Bank holiday on 17th June, due to Eid".
  const holidayTooltip = (
    <div className={"text-start flex flex-col gap-1"}>
      {bankHolidays.map((holiday, index) => (
        <span key={`${holiday.date}-${index}`}>
          {Locale.bankHolidayOnDate
            .replace(":date", ordinalDayMonth(holiday.date))
            .replace(":festivalName", holiday.description ?? "Bank Holiday")}
        </span>
      ))}
    </div>
  );
  return (
    <div className={"bg-white rounded-10px p-4 border"} style={{ borderColor: "#62cfa6" }}>
      <div className={"flex items-start gap-2 mb-4"}>
        <span
          className={"inline-block text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0"}
          style={{ backgroundColor: "#d7f9ec", color: "#0a2540" }}
        >
          {estimate.paymentNetworkLabel}
        </span>
        <span className={"text-xs text-black-400 flex-1 min-w-0"}>{descriptorFor(estimate)}</span>
      </div>
      <hr className={"border-black-200 mb-3"} />
      <p className={"font-bold text-black-700"} style={{ fontSize: "18px", lineHeight: "30px" }}>
        {estimatedDateLabel(estimate.expectedSettlementDate, status)}
      </p>
      {holidayCount > 0 && (
        <p className={"text-xs text-black-400 mt-1"}>
          <span className={"font-bold"}>
            {Locale.includesExtraDays
              .replace(":days", String(holidayCount))
              .replace(":plural", holidayCount > 1 ? "s" : "")}
          </span>
          {" "}
          <span>{Locale.dueToBankHoliday.replace(":plural", holidayCount > 1 ? "s" : "")}</span>
          {" "}
          <Tooltip
            tooltipText={holidayTooltip}
            position={TOOLTIP_POSITION.TOP}
            arrow={true}
            tooltipTheme={"dark"}
            className={"cursor-help inline-flex align-middle leading-none"}
          >
            <span
              className={"inline-flex leading-none"}
              onMouseEnter={() => onBankHolidayTooltipView?.(bankHolidays)}
            >
              <InfoIcon size={12} />
            </span>
          </Tooltip>
        </p>
      )}
    </div>
  );
};

// A SWIFT (Currency Cloud) account shares one `accountNumber` across several
// currencies, so the account number alone is NOT a unique key — looking up by it
// returns the first match (wrong currency). Key accounts by currency + number.
const accountKey = (acc: VirtualAccountDetail): string => `${acc.currency}::${acc.accountNumber}`;

// ── Main modal ────────────────────────────────────────────────────────────────

const CheckPaymentStatusModal: React.FC<Props> = ({ isOpen, onClose, formTitle, entryPoint }) => {
  const [step, setStep] = useState<"form" | "result">("form");
  // True while the user is editing an already-computed selection (reached via the
  // pencil on the result). In this mode the form is pre-filled, nothing auto-advances
  // or gets wiped on a single-field change, and a "Continue" button recomputes.
  const [isEditing, setIsEditing] = useState(false);
  const [sentDate, setSentDate] = useState<string | null>(null);
  const [currency, setCurrency] = useState("");
  const [accountValue, setAccountValue] = useState("");
  // All payment-mode estimates for the selected account, computed on the backend.
  const [modeEstimates, setModeEstimates] = useState<PaymentModeEstimate[]>([]);
  // The chosen payment network, or a sentinel (MODE_DONT_KNOW / MODE_OTHERS).
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const analytics = useAnalytics();

  const { virtualAccounts, fetchData: fetchVirtualAccounts, isLoading: accountsLoading } =
    useInternationalAccountsStore();

  // On open: track the view, and make sure the user's virtual accounts are loaded.
  // The currency dropdown is built from `virtualAccounts`, which the modal only reads
  // — so if nothing else on the page has loaded them yet, fetch them here. Otherwise
  // the dropdown shows only the "Other currencies" fallback. Every estimate (network,
  // business-day window, bank-holiday-adjusted date) is computed on the backend via
  // /api/funding-timeline.
  useEffect(() => {
    if (!isOpen) return;
    analytics.trackAsync(Events.FUNDING_TIMELINE_MODAL_VIEWED, { entry_point: entryPoint });
    if (!virtualAccounts.length) fetchVirtualAccounts();
  }, [isOpen]);

  // Accounts still loading and none available yet → lock the currency dropdown so it
  // doesn't briefly offer only the "Other currencies" fallback.
  const accountsLoadingState = accountsLoading && !virtualAccounts.length;

  // Fixed set of supported currencies (regardless of which accounts the user
  // holds), plus a catch-all "Other currencies" option that is always offered.
  const currencyOptions: Option[] = [
    ...SUPPORTED_CURRENCIES.map((c) => ({ label: c, value: c })),
    { label: Locale.otherCurrencies, value: "OTHER" },
  ];

  // Short description of an account's type, e.g. "Local USD account" / "SWIFT account".
  const accountTypeLabel = (acc: VirtualAccountDetail): string =>
    isSwiftAccount(acc) ? Locale.swiftAccountLabel : Locale.localAccountLabel.replace(":currency", acc.currency);

  // The backend can return the same account once per payment rail (e.g. USD ACH
  // + FEDWIRE), which would list it twice — collapse to one entry per accountKey.
  const accountOptions: Option[] = uniqBy(
    virtualAccounts.filter((acc) => acc.currency === currency),
    accountKey
  )
    // Local accounts first, then SWIFT (stable within each group).
    .sort((a, b) => Number(isSwiftAccount(a)) - Number(isSwiftAccount(b)))
    .map((acc) => ({
      label: `${acc.bankName} (${accountTypeLabel(acc)})`,
      value: accountKey(acc),
      subText: `Account number: XXXX ${acc.accountNumber.slice(-4)}`,
    }));

  const selectedAccount = virtualAccounts.find((acc) => accountKey(acc) === accountValue);
  const effectiveCurrency = selectedAccount?.currency ?? currency;
  const accountIsSwift = !!selectedAccount && isSwiftAccount(selectedAccount);

  // Payment-mode dropdown options: the networks the backend returned for this
  // account, plus the two manual fallbacks ("I don't know" / "Others").
  const modeOptions: Option[] = [
    ...modeEstimates.map((e) => ({ label: e.paymentNetworkLabel, value: e.paymentNetwork })),
    { label: Locale.paymentModeIDontKnow, value: MODE_DONT_KNOW },
    { label: Locale.paymentModeOthers, value: MODE_OTHERS },
  ];

  // Estimates rendered on the result step:
  //  - a specific network → just that card
  //  - "I don't know" → every available network (one card each)
  //  - "Others" → none (the not-allowed message is shown instead)
  const displayedEstimates: PaymentModeEstimate[] =
    selectedMode === MODE_DONT_KNOW
      ? modeEstimates
      : selectedMode && selectedMode !== MODE_OTHERS
        ? modeEstimates.filter((e) => e.paymentNetwork === selectedMode)
        : [];

  const aggregateStatus: EstimateStatus = displayedEstimates.length
    ? computeStatus(latestDate(displayedEstimates))
    : "EXPECTED";

  const isOthers = selectedMode === MODE_OTHERS;
  const isDontKnow = selectedMode === MODE_DONT_KNOW;
  const isPassed = !isOthers && aggregateStatus === "PASSED";
  const isToday = !isOthers && aggregateStatus === "TODAY";

  // "I don't know" shows every network at once, so its support-email note sits
  // OUTSIDE the green box (in the footer) and only when at least one of those dates
  // has already passed. Every other path shows a single estimate: its support note
  // goes INSIDE the green box, below the card, when that one date has passed.
  const anyDatePassed = displayedEstimates.some(
    (e) => computeStatus(e.expectedSettlementDate) === "PASSED",
  );
  const showFooterSupport = isDontKnow && anyDatePassed;
  const showBoxSupport = !isDontKnow && isPassed;

  const selectedModeLabel = (): string | undefined => {
    if (accountIsSwift || (currency === "OTHER" && !selectedAccount)) return undefined; // SWIFT chip already in account label
    if (selectedMode === MODE_DONT_KNOW) return undefined; // "I don't know" → omit the mode from the summary pill
    if (selectedMode === MODE_OTHERS) return Locale.paymentModeOthers;
    if (selectedMode) return modeEstimates.find((e) => e.paymentNetwork === selectedMode)?.paymentNetworkLabel;
    return undefined;
  };

  const getSummaryText = (): string => {
    const currencyText = currency === "OTHER" && !selectedAccount ? Locale.otherCurrencies : effectiveCurrency;
    const parts = [
      currencyText,
      sentDate ? toDisplayDate(sentDate) : "",
      selectedAccount ? accountTypeLabel(selectedAccount) : Locale.swiftAccountLabel,
      selectedModeLabel(),
    ];
    return parts.filter(Boolean).join(" · ");
  };

  const trackResultViewed = (estimates: PaymentModeEstimate[], mode: string) => {
    analytics.trackAsync(Events.FUNDING_TIMELINE_RESULT_VIEWED, {
      currency: effectiveCurrency || "OTHER",
      account_type: selectedAccount?.accountProvider ?? "SWIFT",
      mode,
      date_provided: sentDate,
      bank_holiday_applied: estimates.some((e) => toHolidayNotes(e.transactionIncidentReasons ?? []).length > 0),
      modes_count: estimates.length,
    });
  };

  // ── Estimate ──────────────────────────────────────────────────────────────

  // Single backend call → the full list of payment-mode estimates for this account
  // (or a single SWIFT estimate when `swift=true`). `autoShowResult` is the SWIFT /
  // "Other currencies" path: one network, no mode step → go straight to the result.
  const requestEstimates = (params: {
    date: string;
    currency?: string;
    vendor?: string;
    swift?: boolean;
    autoShowResult: boolean;
    // Edit flow (local accounts): keep this previously-chosen mode after the refetch
    // if it's still offered, instead of clearing the selection.
    retainMode?: string;
    // When retaining a still-valid mode, also jump to the result (used by "Continue").
    navigateOnRetain?: boolean;
  }) => {
    setError(false);
    setLoading(true);
    setModeEstimates([]);
    setSelectedMode("");
    void fetchData({
      url: `/api/funding-timeline`,
      method: ALLOWED_METHODS.POST,
      body: { paymentDate: params.date, currency: params.currency, vendor: params.vendor, swift: params.swift },
      onSuccess: (response: { fundingTimelineEstimate?: FundingTimelineEstimate }) => {
        setLoading(false);
        const estimates = response?.fundingTimelineEstimate?.estimates ?? [];
        if (!estimates.length) {
          setError(true);
          return;
        }
        setModeEstimates(estimates);
        if (params.autoShowResult) {
          // SWIFT / "Other currencies": one network, no mode step.
          setSelectedMode(estimates[0].paymentNetwork);
          setStep("result");
          setIsEditing(false);
          trackResultViewed(estimates, estimates[0].paymentNetwork);
        } else if (params.retainMode !== undefined) {
          // Edit-flow refetch: keep the chosen mode if the (possibly new) account
          // still offers it; otherwise clear it so the user re-picks.
          const stillValid =
            params.retainMode === MODE_DONT_KNOW ||
            estimates.some((e) => e.paymentNetwork === params.retainMode);
          setSelectedMode(stillValid ? params.retainMode : "");
          if (stillValid && params.navigateOnRetain) {
            const shown =
              params.retainMode === MODE_DONT_KNOW
                ? estimates
                : estimates.filter((e) => e.paymentNetwork === params.retainMode);
            trackResultViewed(shown, params.retainMode);
            setStep("result");
            setIsEditing(false);
          }
        }
      },
      onError: () => {
        setLoading(false);
        setError(true);
      },
    });
  };

  // "Other currencies" → always treated as SWIFT and computed on the backend.
  const estimateOtherCurrencies = (date: string | null) => {
    if (!date) return;
    requestEstimates({ date, swift: true, autoShowResult: true });
  };

  // Fetches all mode estimates for a selected account + date. A SWIFT account (or a
  // provider that maps to no backend vendor) uses the SWIFT path and skips the mode
  // step; a local account stays on the form so the user can pick a payment mode.
  const fetchEstimates = (
    account: VirtualAccountDetail,
    date: string | null = sentDate,
    opts?: { retainMode?: string; navigateOnRetain?: boolean },
  ) => {
    if (!date) return;
    const vendor = toPaymentVendor(account.accountProvider);
    const isSwift = isSwiftAccount(account) || !vendor;
    requestEstimates({
      date,
      currency: account.currency,
      vendor: vendor ?? undefined,
      swift: isSwift ? true : undefined,
      autoShowResult: isSwift,
      retainMode: opts?.retainMode,
      navigateOnRetain: opts?.navigateOnRetain,
    });
  };

  // ── Form handlers ───────────────────────────────────────────────────────────

  const handleDateSelect = (date: string | null) => {
    setSentDate(date);
    analytics.trackAsync(Events.FUNDING_TIMELINE_DATE_ENTERED, { date_provided: date });
    // Edit mode: keep every other field as-is; the mode options don't depend on the
    // date, and "Continue" recomputes the dates. No auto-advance.
    if (isEditing) return;
    setSelectedMode("");
    if (!date) return;
    if (currency === "OTHER") {
      estimateOtherCurrencies(date);
      return;
    }
    if (selectedAccount) fetchEstimates(selectedAccount, date);
  };

  const handleCurrencySelect = (value: unknown) => {
    const newCurrency = value as string;
    setCurrency(newCurrency);
    // An account belongs to exactly one currency, so changing the currency
    // necessarily invalidates the selected account (and its mode).
    setAccountValue("");
    setModeEstimates([]);
    setSelectedMode("");
    analytics.trackAsync(Events.FUNDING_TIMELINE_CURRENCY_SELECTED, { currency: newCurrency });
    // Edit mode never auto-advances — the user picks the new account then hits Continue.
    if (!isEditing && newCurrency === "OTHER" && sentDate) estimateOtherCurrencies(sentDate);
  };

  const handleAccountSelect = (value: unknown) => {
    const newAccount = value as string;
    setAccountValue(newAccount);
    const acc = virtualAccounts.find((a) => accountKey(a) === newAccount);
    const accountRail = acc ? (isSwiftAccount(acc) ? "swift" : "local") : "unknown";
    analytics.trackAsync(Events.FUNDING_TIMELINE_ACCOUNT_SELECTED, {
      account_type: `${acc?.accountProvider ?? "UNKNOWN"}_${accountRail}`,
    });
    if (isEditing) {
      // Stay on the form (no auto-advance). For a local account, refresh the mode
      // options for the new account while keeping the chosen mode if still offered.
      if (acc && sentDate && !isSwiftAccount(acc)) {
        fetchEstimates(acc, sentDate, { retainMode: selectedMode, navigateOnRetain: false });
      } else {
        // SWIFT account (single rail) or no date yet → no mode dropdown; drop stale modes.
        setModeEstimates([]);
        setSelectedMode("");
      }
      return;
    }
    setSelectedMode("");
    // Local accounts then show the payment-mode dropdown; SWIFT accounts jump to result.
    if (acc && sentDate) fetchEstimates(acc);
  };

  const handleModeSelect = (value: unknown) => {
    const mode = value as string;
    setSelectedMode(mode);
    analytics.trackAsync(Events.FUNDING_TIMELINE_MODE_SELECTED, { mode });
    if (mode === MODE_OTHERS) {
      analytics.trackAsync(Events.FUNDING_TIMELINE_UNSUPPORTED_MODE_SHOWN, { currency: effectiveCurrency });
      // Stay on the form and surface the not-supported warning inline below the
      // mode dropdown — no result step for the unsupported "Others" path.
      return;
    }
    // Edit mode: just record the choice; "Continue" navigates to the result.
    if (isEditing) return;
    const shown = mode === MODE_DONT_KNOW ? modeEstimates : modeEstimates.filter((e) => e.paymentNetwork === mode);
    trackResultViewed(shown, mode);
    setStep("result");
  };

  const handleClose = (via: "x_button" | "got_it_button") => {
    analytics.trackAsync(Events.FUNDING_TIMELINE_MODAL_CLOSED, {
      closed_via: via,
      reached_result: step === "result",
    });
    setStep("form");
    setIsEditing(false);
    setSentDate(null);
    setCurrency("");
    setAccountValue("");
    setModeEstimates([]);
    setSelectedMode("");
    setLoading(false);
    setError(false);
    onClose();
  };

  const handleBankHolidayTooltipView = (notes: BankHolidayNote[]) => {
    analytics.trackAsync(Events.FUNDING_TIMELINE_BANK_HOLIDAY_TOOLTIP_VIEWED, {
      holiday_count: notes.length,
      holiday_names: notes.map((n) => n.description ?? "Bank Holiday").join(", "),
    });
  };

  const handleEditClick = () => {
    analytics.trackAsync(Events.FUNDING_TIMELINE_EDIT_CLICKED);
    // Re-open the form with every field pre-filled from the current selection. Edit
    // mode keeps them intact and shows a "Continue" button instead of auto-advancing.
    setIsEditing(true);
    setStep("form");
  };

  // "Continue" is only offered in edit mode. It's enabled once the current selection
  // is complete enough to compute a result.
  const canContinue = (() => {
    if (!sentDate) return false;
    if (currency === "OTHER" && !selectedAccount) return true; // Other currencies → SWIFT path
    if (!selectedAccount) return false;
    if (accountIsSwift) return true; // single rail, no mode needed
    return !!selectedMode && selectedMode !== MODE_OTHERS; // local → needs a supported mode
  })();

  const handleContinue = () => {
    if (!canContinue || !sentDate) return;
    if (currency === "OTHER" && !selectedAccount) {
      estimateOtherCurrencies(sentDate);
      return;
    }
    if (!selectedAccount) return;
    if (accountIsSwift) {
      fetchEstimates(selectedAccount, sentDate); // SWIFT: recompute and jump to result
      return;
    }
    // Local: recompute for the current date/account, then show the result for the
    // chosen mode (preserved across the refetch).
    fetchEstimates(selectedAccount, sentDate, { retainMode: selectedMode, navigateOnRetain: true });
  };

  const handleSupportEmailClick = () => {
    analytics.trackAsync(Events.FUNDING_TIMELINE_SUPPORT_EMAIL_CLICKED, {
      currency: effectiveCurrency,
      days_since_estimated_date: isPassed && displayedEstimates.length
        ? Math.floor(
            (new Date().setHours(0, 0, 0, 0) - new Date(latestDate(displayedEstimates) + "T00:00:00").setHours(0, 0, 0, 0)) /
              (1000 * 60 * 60 * 24),
          )
        : null,
    });
  };

  // The mode dropdown is shown once a local account's estimates have loaded.
  const showModeDropdown = currency !== "OTHER" && !!selectedAccount && !accountIsSwift && modeEstimates.length > 0;

  // ── Modal title / subtitle ──────────────────────────────────────────────────

  const modalTitle = (() => {
    if (step === "form") return formTitle ?? Locale.checkStatusOfYourPayment;
    if (isOthers) return Locale.checkStatusOfYourPayment;
    // "I don't know" shows every network at once, so the title (and the passed-date
    // footer) can't key off a single mode's status — it always uses the neutral
    // "here's when to expect it" heading.
    if (isDontKnow) return Locale.hereIsWhenToExpectYourPayment;
    if (isPassed) return Locale.yourPaymentHasNotArrivedYet;
    if (isToday) return Locale.yourPaymentShouldArriveToday;
    return Locale.hereIsWhenToExpectYourPayment;
  })();

  const modalSubtitle = step === "form" ? Locale.checkPaymentStatusSubtitle : undefined;

  // ── Render: form ────────────────────────────────────────────────────────────

  // "Others" → the payment mode isn't supported on this account. Shown inline
  // below the mode dropdown so the whole form stays visible (no result step).
  const renderUnsupportedNote = () => (
    <div
      className={"flex items-start gap-3 rounded-10px p-4 border"}
      style={{ backgroundColor: "#fdf3f1", borderColor: "#e11900" }}
    >
      <span className={"flex-shrink-0 mt-0.5"}>
        <AlertIcon size={20} />
      </span>
      <p className={"text-xs text-black-700 leading-5"}>
        {Locale.othersModeNotSupported}{" "}
        <a href="mailto:support@skydo.com" className={"underline text-black-700"} onClick={handleSupportEmailClick}>
          support@skydo.com
        </a>{" "}
        {Locale.othersModeNotSupportedSuffix}
      </p>
    </div>
  );

  const renderForm = () => (
    <div className={"flex flex-col gap-4"}>
      <DateSelector
        label={Locale.whenDidClientInitiatePayment}
        selectedDate={sentDate ? toDisplayDate(sentDate) : ""}
        onDateSelect={handleDateSelect}
        placeholder={"dd/mm/yyyy"}
        maxDate={new Date()}
        calendarContainerClass={"z-50"}
      />
      <SelectDropdown
        dropdownLabel={Locale.paymentCurrency}
        placeholder={accountsLoadingState ? Locale.loadingYourAccounts : Locale.selectPaymentCurrency.replace(":", "")}
        selectedValue={currency}
        options={currencyOptions}
        onSelect={handleCurrencySelect}
        isDisabled={accountsLoadingState}
        inputWrapperClass={accountsLoadingState ? "!bg-black-100" : undefined}
        inputClass={accountsLoadingState ? "!bg-black-100" : undefined}
        leftIcon={true}
        renderLeftIcon={(option) => {
          const flag = getCurrencyFlag(option.value);
          return flag ? <div className={"mr-2 flex-shrink-0"}>{flag}</div> : <></>;
        }}
        leftElement={currency ? () => {
          const flag = getCurrencyFlag(currency);
          return flag ? <div className={"mr-2 flex-shrink-0"}>{flag}</div> : null;
        } : undefined}
        optionsContainerClass={"!max-h-none"}
      />
      {/* "Other currencies" is treated as SWIFT, so no account step. */}
      {currency !== "OTHER" && (
        <SelectDropdown
          key={`account-${currency}`}
          dropdownLabel={Locale.whichAccountDidYouShare}
          placeholder={Locale.selectAccountNumber}
          selectedValue={accountValue}
          options={accountOptions}
          onSelect={handleAccountSelect}
          isDisabled={!sentDate || !currency}
          inputWrapperClass={!sentDate || !currency ? "!bg-black-100" : undefined}
          inputClass={!sentDate || !currency ? "!bg-black-100" : undefined}
          showSubtext={true}
          leftIcon={true}
          renderLeftIcon={(option) => {
            const acc = virtualAccounts.find((a) => accountKey(a) === option.value);
            return acc
              ? <div className={"flex-shrink-0"}>{getAccountIcon(acc.bankName)}</div>
              : <></>;
          }}
          leftElement={selectedAccount ? () => (
            <div className={"mr-2 flex-shrink-0"}>{getAccountIcon(selectedAccount.bankName)}</div>
          ) : undefined}
        />
      )}
      {/* Payment-mode step (local accounts only — SWIFT has a single rail). */}
      {showModeDropdown && (
        <SelectDropdown
          key={`mode-${accountValue}`}
          dropdownLabel={Locale.modeOfPayment}
          placeholder={Locale.selectModeOfPayment}
          selectedValue={selectedMode}
          options={modeOptions}
          onSelect={handleModeSelect}
          isDisabled={false}
        />
      )}
      {isOthers && renderUnsupportedNote()}
      {loading && <p className={"text-xs text-black-400"}>{Locale.fundingTimelineEstimating}</p>}
      {error && <p className={"text-xs"} style={{ color: "#e11900" }}>{Locale.fundingTimelineEstimateError}</p>}
    </div>
  );

  // ── Render: result ──────────────────────────────────────────────────────────

  const renderSummaryPill = () => (
    <div className={"flex items-center justify-between border border-black-300 rounded-10px px-4 py-3"}>
      <span className={"text-xs font-semibold text-black-700"}>{getSummaryText()}</span>
      <button
        onClick={handleEditClick}
        className={"ml-2 text-black-500 hover:text-black-700 flex-shrink-0"}
        aria-label="Edit payment details"
      >
        <PencilIcon />
      </button>
    </div>
  );

  const renderResult = () => {
    if (!displayedEstimates.length) return <></>;
    const estimatedReachLabel = isPassed
      ? Locale.yourPaymentWasEstimatedToReach
      : Locale.yourPaymentEstimatedToReach;
    return (
      <div className={"flex flex-col gap-4"}>
        {renderSummaryPill()}

        {/* The green box scrolls inside this gutter wrapper so many payment modes
            don't push the footer ("Got it") off the modal. The negative right margin
            + right padding place the grey scrollbar in the modal's right gutter,
            outside the green box. Roughly one card shows; the rest scroll. */}
        <div className={`${styles.scrollArea} max-h-[340px] overflow-y-auto -mr-8 pr-8`}>
          <div className={"rounded-10px p-4 flex flex-col gap-3"} style={{ backgroundColor: "#f0f9f4" }}>
            <p className={"text-sm font-semibold text-black-700"}>
              {estimatedReachLabel}
              {" "}
              <Tooltip
                tooltipText={Locale.estimatedTimelineTooltip}
                position={TOOLTIP_POSITION.TOP}
                arrow={true}
                className={"cursor-help inline-flex align-middle leading-none"}
              >
                <span className={"inline-flex leading-none"}><InfoIcon size={12} /></span>
              </Tooltip>
            </p>

            {displayedEstimates.map((estimate) => (
              <ResultCard
                key={estimate.paymentNetwork}
                estimate={estimate}
                onBankHolidayTooltipView={handleBankHolidayTooltipView}
              />
            ))}

            {/* Single-estimate passed case: the support line lives inside the green
                box, below the card. ("I don't know" shows it in the footer instead.) */}
            {showBoxSupport && (
              <p className={"text-sm text-black-700 leading-5"}>
                {Locale.pleaseEmailPaymentReceiptTo}{" "}
                <a
                  href="mailto:support@skydo.com"
                  className={"underline text-black-700"}
                  onClick={handleSupportEmailClick}
                >
                  support@skydo.com
                </a>{" "}
                {Locale.forAssistance}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popup
      open={isOpen}
      isCommonHeader={true}
      title={modalTitle}
      subtitle={modalSubtitle}
      closeIconClick={() => handleClose("x_button")}
      outsideClick={() => handleClose("x_button")}
      containerStyle={{ overflow: "visible" }}
      renderContent={() => (step === "form" ? renderForm() : renderResult())}
      renderCTAs={() =>
        step === "form" ? (
          // Only the edit flow shows a CTA on the form — a full-width "Continue" that
          // recomputes the estimate. The first-time form still advances on selection.
          isEditing ? (
            <div className={"w-full mt-4"}>
              <Button
                title={Locale.continue}
                type={BUTTON_TYPES.PRIMARY}
                size={BUTTON_SIZES.SMALL}
                isDisabled={!canContinue || loading}
                isLoading={loading}
                rightIcon={() => <ContinueArrowIcon color={!canContinue || loading ? "#8898AA" : "#FFFFFF"} />}
                buttonClass={"!w-full"}
                onButtonClick={handleContinue}
              />
            </div>
          ) : <></>
        ) : (
          // Pinned footer below the scrollable estimates: the "date has passed" note
          // (when applicable) on the left, "Got it" on the right. The full-bleed top
          // shadow (width + negative margin cancel the Popup's p-10 gutter) is only the
          // "content scrolls under" affordance for the "I don't know" path, where several
          // mode cards can scroll behind the footer. A single-mode result doesn't scroll,
          // so it keeps the original flat footer with no shadow.
          <div
            className={`flex items-end justify-between gap-4 w-[calc(100%+5rem)] -mx-10 px-10 mt-4 pt-4${
              selectedMode === MODE_DONT_KNOW ? " shadow-[0_-8px_12px_-6px_rgba(50,50,93,0.10)]" : ""
            }`}
          >
            {showFooterSupport ? (
              <div className={"flex flex-col gap-0.5 flex-1"}>
                <p className={"text-sm text-black-600 leading-5"}>
                  {Locale.expectedDatePassed}
                </p>
                <p className={"text-sm text-black-500 leading-5"}>
                  {Locale.sendPaymentReceiptTo}{" "}
                  <a
                    href="mailto:support@skydo.com"
                    className={"underline text-black-500"}
                    onClick={handleSupportEmailClick}
                  >
                    support@skydo.com
                  </a>
                </p>
              </div>
            ) : (
              <span />
            )}
            <Button
              title={Locale.gotIt}
              type={BUTTON_TYPES.PRIMARY}
              size={BUTTON_SIZES.SMALL}
              buttonClass={"flex-shrink-0"}
              onButtonClick={() => handleClose("got_it_button")}
            />
          </div>
        )
      }
    />
  );
};

export default CheckPaymentStatusModal;
