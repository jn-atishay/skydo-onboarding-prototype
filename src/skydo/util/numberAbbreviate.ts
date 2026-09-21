export const numberAbbreviate = ({
  number,
  isShorterAbbreviation,
  currency,
}: {
  number: number;
  isShorterAbbreviation?: boolean;
  currency: string;
}) => {
  let val = String(number);
  if (currency === "INR") {
    if (Number(val) >= 10000000) val = (Number(val) / 10000000).toFixed(2) + " Cr";
    else if (Number(val) >= 100000) {
      val = (Number(val) / 100000).toFixed(2);
      if (Number(val) === 1) {
        val += isShorterAbbreviation ? " L" : " lakh";
      } else {
        val += isShorterAbbreviation ? " L" : " lakhs";
      }
    } else if (Number(val) >= 1000) val = (Number(val) / 1000).toFixed(2) + " K";
    return val;
  } else {
    if (Number(val) >= 1000000) {
      val = (Number(val) / 1000000).toFixed(2);
      if (Number(val) === 1) {
        val += isShorterAbbreviation ? " M" : " million";
      } else {
        val += isShorterAbbreviation ? " M" : " millions";
      }
    } else if (Number(val) >= 1000) val = (Number(val) / 1000).toFixed(2) + " K";
    return val;
  }
};
