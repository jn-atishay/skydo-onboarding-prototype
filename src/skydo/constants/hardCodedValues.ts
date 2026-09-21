export const SKYDO_FEE_UNDER_SLAB = 19;
export const SKYDO_FEE_OVER_SLAB = 29;

export const SKYDO_CUTOFF_SLAB = 2000;

export const SKYDO_HIGH_VALUE_THRESHOLD = 10000;
export const SKYDO_HIGH_VALUE_PERCENTAGE = 0.003;

export const SKYDO_FEE_UNDER_SLAB_LABEL = `$${SKYDO_FEE_UNDER_SLAB}`;
export const SKYDO_FEE_OVER_SLAB_LABEL = `$${SKYDO_FEE_OVER_SLAB}`;
export const SKYDO_HIGH_VALUE_PERCENTAGE_LABEL = `${+(SKYDO_HIGH_VALUE_PERCENTAGE * 100).toFixed(2)}%`;

export const AMAZON_FEE_THRESHOLD = 10000;
export const AMAZON_FEE_UNDER_SLAB_LABEL = "0.5% (min $2)";
export const AMAZON_FEE_OVER_SLAB_LABEL = "0.3%";

export const GST_PERCENT = 0.18; //%

export const MIN_NAV_BAR_VAL = 1260;

export const getSkydoFeeInUSD = (usdAmount: number) => {
  let amount = usdAmount;
  let fees = 0;

  if (amount > 9971) {
    fees = amount * (1 / (1 - 0.003) - 1); // Calculate fees directly for amounts > 10K
  } else {
    while (amount > 0) {
      if (amount <= 1981) {
        amount -= 2000;
        fees += 19;
      } else {
        fees += 29;
        amount -= 10000;
      }
    }
  }

  return parseFloat(fees.toFixed(2)); // Ensure the fees have up to two decimal points
};


export const getSkydoFeeInUSDWithoutPassOn = (usdAmount: number) => {
  let amount = usdAmount;
  let fees = 0;

  if (amount > 10000) {
    fees = amount * 0.003; // Calculate fees directly for amounts > 10K
  }else if (amount > 2000) {
    fees = 29;
  }else {
    fees = 19;
  }

  return parseFloat(fees.toFixed(2)); // Ensure the fees have up to two decimal points
}

export const getSkydoFeeInUSDForAed = (usdAmount: number) => {
  
  let fees = 0;
  const tier1Total = usdAmount * (1.01) + 19;
  if (tier1Total <= 2000) {
    fees = (19 + 0.01 * usdAmount) / 0.99;
  } else {
    const tier2Total = usdAmount * (1.01) + 29;
    if (tier2Total <= 10000) {
      fees = (29 + 0.01 * usdAmount) / 0.99;
    } else {
      fees = usdAmount * (1/(1 - 0.013) - 1);
    }
  }

  return parseFloat(fees.toFixed(2)); // Ensure the fees have up to two decimal points
};


