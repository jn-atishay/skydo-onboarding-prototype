import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";

// The design pins the badge to a fixed-width circle, so anything wider than two
// digits has to be abbreviated rather than stretch it out of shape.
const MAX_DISPLAYED_COUNT = 99;

interface Props {
  count: number;
  // Sizing and fill live at the call site: the sidebar shows a 20px circle, the
  // collapsed rail a 14px one pinned to the icon's corner.
  className?: string;
  textClasses?: string;
}

const NavCountBadge = ({ count, className, textClasses }: Props) => (
  <div className={classNames("flex shrink-0 items-center justify-center rounded-full", className)}>
    <Typography
      text={count > MAX_DISPLAYED_COUNT ? `${MAX_DISPLAYED_COUNT}+` : count}
      type={TYPOGRAPHY_TYPES.PARA}
      size={TYPOGRAPHY_SIZES.X_X_SMALL}
      textClasses={classNames("!font-bold", textClasses)}
    />
  </div>
);

export default NavCountBadge;
