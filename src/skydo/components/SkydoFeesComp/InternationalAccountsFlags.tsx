import FlagPill from "./FlagPill";

/**
 * Row of overlapping flag pills shown in the International accounts card subtitle.
 * Row of overlapping flag pills — US, UK, EU, plus a globe/Rest-of-World indicator.
 */
const InternationalAccountsFlags = () => (
  <div className={"flex items-center"}>
    <FlagPill flag={"us"} className={"relative z-10"} />
    <FlagPill flag={"uk"} className={"relative z-20 -ml-1.5"} />
    <FlagPill flag={"eu"} className={"relative z-30 -ml-1.5"} />
    <FlagPill flag={"globe"} className={"relative z-40 -ml-1.5"} />
  </div>
);

export default InternationalAccountsFlags;
