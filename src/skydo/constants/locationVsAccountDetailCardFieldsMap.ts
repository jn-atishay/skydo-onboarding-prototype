import Locale from "../util/locale/en";
import { LOCATION_CODE, LOCATION_CURRENCY_MAP, PAYMENT_METHOD } from "./dashboardConstants";

export const LocationVsAccountDetailCardFieldsMap = {
  [LOCATION_CODE.USA]: {
    leftSection: {
      header: Locale.localCurrencyAccount.replace(":currency", LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]),
      benefits: [Locale.clientPayLocal],
    },
    rightSection: {
      fields: [
        {
          title: Locale.paymentMethod,
          valueKey: "paymentMethod",
          isClickable: true,
        },
        {
          title: Locale.accountCurrency,
          valueKey: "accountCurrency",
          isClickable: false,
        },
        {
          title: Locale.accountNumber,
          valueKey: "accountNumber",
        },
        {
          title: Locale.routingNumb,
          valueKey: "routingNumber",
        },
        {
          title: Locale.fedwireRoutingNumber,
          valueKey: "fedWireRoutingNumberUS",
        },
        {
          title: Locale.accountType,
          valueKey: "accountType",
        },
        {
          title: Locale.bankName,
          valueKey: "bankName",
        },
        {
          title: Locale.bankAddress,
          valueKey: "bankAddress",
        },
        {
          title: Locale.accountName,
          valueKey: "accountHolderName",
        },
      ],
    },
  },
  [LOCATION_CODE.UK]: {
    leftSection: {
      header: Locale.localCurrencyAccount.replace(":currency", LOCATION_CURRENCY_MAP[LOCATION_CODE.UK]),
      benefits: [Locale.clientPayLocal],
    },
    rightSection: {
      fields: [
        {
          title: Locale.paymentMethod,
          valueKey: "paymentMethod",
          isClickable: true,
        },
        {
          title: Locale.accountCurrency,
          valueKey: "accountCurrency",
          isClickable: false,
        },
        {
          title: Locale.accountNumber,
          valueKey: "accountNumber",
        },
        {
          title: Locale.sortCode,
          valueKey: "routingNumber",
        },
        {
          title: Locale.accountType,
          valueKey: "accountType",
        },
        {
          title: Locale.bankName,
          valueKey: "bankName",
        },
        {
          title: Locale.bankAddress,
          valueKey: "bankAddress",
        },
        {
          title: Locale.accountName,
          valueKey: "accountHolderName",
        },
      ],
    },
  },
  [LOCATION_CODE.UAE]: {
    leftSection: {
      header: Locale.localUaeAccount,
      benefits: [Locale.clientPayLocal, Locale.receivePaymentsInstantly],
    },
    rightSection: {
      fields: [
        {
          title: Locale.paymentMethod,
          valueKey: "paymentMethod",
          isClickable: true,
        },
        {
          title: Locale.accountCurrency,
          valueKey: "accountCurrency",
          isClickable: false,
        },
        {
          title: Locale.ibanAccountNumber,
          valueKey: "accountNumber",
        },
        {
          title: Locale.bicCode,
          valueKey: "routingNumber",
        },
        {
          title: Locale.accountType,
          valueKey: "accountType",
        },
        {
          title: Locale.bankName,
          valueKey: "bankName",
        },
        {
          title: Locale.bankAddress,
          valueKey: "bankAddress",
        },
        {
          title: Locale.accountName,
          valueKey: "accountHolderName",
        },
      ],
    },
  },
  [LOCATION_CODE.EUROPE]: {
    leftSection: {
      header: Locale.localCurrencyAccount.replace(":currency", LOCATION_CURRENCY_MAP[LOCATION_CODE.EUROPE]),
      benefits: [Locale.clientPayLocal],
    },
    rightSection: {
      fields: [
        {
          title: Locale.paymentMethod,
          valueKey: "paymentMethod",
          isClickable: true,
        },
        {
          title: Locale.accountCurrency,
          valueKey: "accountCurrency",
          isClickable: false,
        },
        {
          title: Locale.ibanAccountNumber,
          valueKey: "accountNumber",
        },
        {
          title: Locale.bicCode,
          valueKey: "routingNumber",
        },
        {
          title: Locale.accountType,
          valueKey: "accountType",
        },
        {
          title: Locale.bankName,
          valueKey: "bankName",
        },
        {
          title: Locale.bankAddress,
          valueKey: "bankAddress",
        },
        {
          title: Locale.accountName,
          valueKey: "accountHolderName",
        },
      ],
    },
  },
  [LOCATION_CODE.CA]: {
    leftSection: {
      header: Locale.localCurrencyAccount.replace(":currency", LOCATION_CURRENCY_MAP[LOCATION_CODE.CA]),
      benefits: [Locale.clientPayLocal],
    },
    rightSection: {
      fields: [
        {
          title: Locale.paymentMethod,
          valueKey: "paymentMethod",
          isClickable: true,
        },
        {
          title: Locale.accountCurrency,
          valueKey: "accountCurrency",
          isClickable: false,
        },
        {
          title: Locale.accountNumber,
          valueKey: "accountNumber",
        },
        {
          title: Locale.routingCode,
          valueKey: "routingNumber",
        },
        {
          title: Locale.institutionNumber,
          valueKey: "institutionNumber",
        },
        {
          title: Locale.transitNumber,
          valueKey: "transitNumber",
        },
        {
          title: Locale.accountType,
          valueKey: "accountType",
        },
        {
          title: Locale.bankName,
          valueKey: "bankName",
        },
        {
          title: Locale.bankAddress,
          valueKey: "bankAddress",
        },
        {
          title: Locale.accountName,
          valueKey: "accountHolderName",
        },
      ],
    },
  },
  [LOCATION_CODE.ROW]: {
    leftSection: {
      hideIcon: true,
      header: Locale.internationAccount,
      caution: [Locale.swiftChargesCaution],
    },
    rightSection: {
      fields: [
        {
          title: Locale.paymentMethod,
          valueKey: "paymentMethod",
          isClickable: true,
        },
        {
          title: Locale.ibanAccountNumber,
          valueKey: "accountNumber",
        },
        {
          title: Locale.bicCode,
          valueKey: "routingNumber",
        },
        {
          title: Locale.accountType,
          valueKey: "accountType",
        },
        {
          title: Locale.bankName,
          valueKey: "bankName",
        },
        {
          title: Locale.bankAddress,
          valueKey: "bankAddress",
        },
        {
          title: Locale.beneficiaryBankCountry,
          valueKey: "beneficiaryBankCountry",
        },
        {
          title: Locale.accountName,
          valueKey: "accountHolderName",
        },
      ],
    },
  },
  [LOCATION_CODE.IND]: {
    leftSection: {
      hideIcon: true,
      header: Locale.internationAccount,
      subTitle: Locale.internationAccountSubTitle,
      caution: [Locale.swiftChargesCaution],
    },
    rightSection: {
      fields: [
        {
          title: Locale.paymentMethod,
          valueKey: "paymentMethod",
          isClickable: true,
        },
        {
          title: Locale.bankName,
          valueKey: "bankName",
        },
        {
          title: Locale.bankAddress,
          valueKey: "bankAddress",
        },
        {
          title: Locale.beneficiaryBankCountry,
          valueKey: "beneficiaryBankCountry",
        },
        {
          title: Locale.accountName,
          valueKey: "accountHolderName",
        },
      ],
    },
  },
  [LOCATION_CODE.AUS]: {
    leftSection: {
      header: Locale.localCurrencyAccount.replace(":currency", LOCATION_CURRENCY_MAP[LOCATION_CODE.AUS]),
      benefits: [Locale.clientPayLocal],
    },
    rightSection: {
      fields: [
        {
          title: Locale.paymentMethod,
          valueKey: "paymentMethod",
        },
        {
          title: Locale.accountCurrency,
          valueKey: "accountCurrency",
          isClickable: false,
        },
        {
          title: Locale.accountNumber,
          valueKey: "accountNumber",
        },
        {
          title: Locale.bsbNumber,
          valueKey: "routingNumber",
        },
        {
          title: Locale.accountType,
          valueKey: "accountType",
        },
        {
          title: Locale.bankName,
          valueKey: "bankName",
        },
        {
          title: Locale.bankAddress,
          valueKey: "bankAddress",
        },
        {
          title: Locale.accountName,
          valueKey: "accountHolderName",
        },
      ],
    },
  },
  [LOCATION_CODE.SG]: {
    leftSection: {
      header: Locale.localCurrencyAccount.replace(":currency", LOCATION_CURRENCY_MAP[LOCATION_CODE.SG]),
      benefits: [Locale.clientPayLocal],
    },
    rightSection: {
      fields: [
        {
          title: Locale.paymentMethod,
          valueKey: "paymentMethod",
        },
        {
          title: Locale.accountCurrency,
          valueKey: "accountCurrency",
          isClickable: false,
        },
        {
          title: Locale.accountNumber,
          valueKey: "accountNumber",
        },
        {
          title: Locale.bicCode,
          valueKey: "routingNumber",
        },
        {
          title: Locale.accountType,
          valueKey: "accountType",
        },
        {
          title: Locale.bankName,
          valueKey: "bankName",
        },
        {
          title: Locale.accountName,
          valueKey: "accountHolderName",
        },
        {
          title: Locale.bankAddress,
          valueKey: "bankAddress",
        }
      ],
    },
  },
};

export const getAccountDetailHeaderByLocation = (location: string, paymentMethod: string) => {
  switch (location) {
    case LOCATION_CODE.USA:
      return {
        routingCode: paymentMethod === PAYMENT_METHOD.ACH ? Locale.routingNumb : Locale.fedwireRoutingNumber,
      };
    case LOCATION_CODE.UK:
      return {
        routingCode: Locale.sortCode,
      };
    case LOCATION_CODE.UAE:
      return {
        routingCode: Locale.bicCode,
      };
    case LOCATION_CODE.EUROPE:
      return {
        routingCode: Locale.bicCode,
      };
    case LOCATION_CODE.CA:
      return {
        routingCode: Locale.routingCode,
      };
    case LOCATION_CODE.ROW:
      return {
        routingCode: Locale.bicCode,
      };
    case LOCATION_CODE.AUS:
      return {
        routingCode: Locale.bsbNumber,
      };
    case LOCATION_CODE.SG:
      return {
        routingCode: Locale.bicCode,
      };
    default:
      return {
        routingCode: Locale.bicCode,
      };
  }
};

export const LocationVsAccountDetailCardFieldsMapForEmail = {
  [LOCATION_CODE.USA]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
    },
    {
      title: Locale.accountName,
      valueKey: "accountHolderName",
    },
    {
      title: Locale.accountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.routingNumb,
      valueKey: "routingNumber",
    },
    {
      title: Locale.fedwireRoutingNumber,
      valueKey: "fedWireRoutingNumberUS",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.address,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.UK]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
    },
    {
      title: Locale.accountName,
      valueKey: "accountHolderName",
    },
    {
      title: Locale.accountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.sortCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddress,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.EUROPE]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
    },
    {
      title: Locale.accountName,
      valueKey: "accountHolderName",
    },
    {
      title: Locale.ibanAccountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.bicCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddress,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.CA]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
    },
    {
      title: Locale.accountName,
      valueKey: "accountHolderName",
    },
    {
      title: Locale.accountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.routingCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.institutionNumber,
      valueKey: "institutionNumber",
    },
    {
      title: Locale.transitNumber,
      valueKey: "transitNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddress,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.ROW]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
    },
    {
      title: Locale.accountName,
      valueKey: "accountHolderName",
    },
    {
      title: Locale.ibanAccountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.bicCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddress,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.SG]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
    },
    {
      title: Locale.accountName,
      valueKey: "accountHolderName",
    },

    {
      title: Locale.accountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.bicCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddress,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.AUS]: [
    {
    title: Locale.paymentMethod,
    valueKey: "paymentMethod",
  },
    {
      title: Locale.accountName,
      valueKey: "accountHolderName",
    },

    {
      title: Locale.accountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.bsbNumber,
      valueKey: "routingNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddress,
      valueKey: "bankAddress",
    },
  ],
  [LOCATION_CODE.UAE]: [
    {
      title: Locale.paymentMethod,
      valueKey: "paymentMethod",
    },
    {
      title: Locale.accountName,
      valueKey: "accountHolderName",
    },
    {
      title: Locale.ibanAccountNumber,
      valueKey: "accountNumber",
    },
    {
      title: Locale.bicCode,
      valueKey: "routingNumber",
    },
    {
      title: Locale.accountType,
      valueKey: "accountType",
    },
    {
      title: Locale.bankName,
      valueKey: "bankName",
    },
    {
      title: Locale.bankAddress,
      valueKey: "bankAddress",
    },
  ]
};

export const LocationVsAccountDetailCardFieldsMapForSimpleCard = {
  [LOCATION_CODE.USA]: {
    fields: [
      {
        title: Locale.paymentMethod,
        valueKey: "paymentMethod",
        isClickable: true,
      },
      {
        title: Locale.routingNumb,
        valueKey: "routingNumber",
      },
      {
        title: Locale.fedwireRoutingNumber,
        valueKey: "fedWireRoutingNumberUS",
      },
      {
        title: Locale.accountNumber,
        valueKey: "accountNumber",
      },
      {
        title: Locale.accountType,
        valueKey: "accountType",
      },
      {
        title: Locale.bankName,
        valueKey: "bankName",
      },
      {
        title: Locale.bankAddress,
        valueKey: "bankAddress",
      },
      {
        title: Locale.accountName,
        valueKey: "accountHolderName",
      },
    ],
  },
  [LOCATION_CODE.UK]: {
    fields: [
      {
        title: Locale.paymentMethod,
        valueKey: "paymentMethod",
        isClickable: true,
      },
      {
        title: Locale.sortCode,
        valueKey: "routingNumber",
      },

      {
        title: Locale.accountNumber,
        valueKey: "accountNumber",
      },
      {
        title: Locale.accountType,
        valueKey: "accountType",
      },
      {
        title: Locale.bankName,
        valueKey: "bankName",
      },
      {
        title: Locale.bankAddress,
        valueKey: "bankAddress",
      },
      {
        title: Locale.accountName,
        valueKey: "accountHolderName",
      },
    ],
  },
  [LOCATION_CODE.UAE]: {
    fields: [
      {
        title: Locale.paymentMethod,
        valueKey: "paymentMethod",
        isClickable: true,
      },
      {
        title: Locale.ibanAccountNumber,
        valueKey: "accountNumber",
      },
      {
        title: Locale.bicCode,
        valueKey: "routingNumber",
      },
      {
        title: Locale.accountType,
        valueKey: "accountType",
      },
      {
        title: Locale.bankName,
        valueKey: "bankName",
      },
      {
        title: Locale.bankAddress,
        valueKey: "bankAddress",
      },
      {
        title: Locale.accountName,
        valueKey: "accountHolderName",
      },
    ],
  },
  [LOCATION_CODE.EUROPE]: {
    fields: [
      {
        title: Locale.paymentMethod,
        valueKey: "paymentMethod",
        isClickable: true,
      },
      {
        title: Locale.ibanAccountNumber,
        valueKey: "accountNumber",
      },
      {
        title: Locale.bicCode,
        valueKey: "routingNumber",
      },
      {
        title: Locale.accountType,
        valueKey: "accountType",
      },
      {
        title: Locale.bankName,
        valueKey: "bankName",
      },
      {
        title: Locale.bankAddress,
        valueKey: "bankAddress",
      },
      {
        title: Locale.accountName,
        valueKey: "accountHolderName",
      },
    ],
  },
  [LOCATION_CODE.CA]: {
    fields: [
      {
        title: Locale.paymentMethod,
        valueKey: "paymentMethod",
        isClickable: true,
      },
      {
        title: Locale.accountNumber,
        valueKey: "accountNumber",
      },
      {
        title: Locale.routingCode,
        valueKey: "routingNumber",
      },
      {
        title: Locale.institutionNumber,
        valueKey: "institutionNumber",
      },
      {
        title: Locale.transitNumber,
        valueKey: "transitNumber",
      },
      {
        title: Locale.accountType,
        valueKey: "accountType",
      },
      {
        title: Locale.bankName,
        valueKey: "bankName",
      },
      {
        title: Locale.bankAddress,
        valueKey: "bankAddress",
      },
      {
        title: Locale.accountName,
        valueKey: "accountHolderName",
      },
    ],
  },
  [LOCATION_CODE.ROW]: {
    fields: [
      {
        title: Locale.paymentMethod,
        valueKey: "paymentMethod",
        isClickable: true,
      },
      {
        title: Locale.ibanAccountNumber,
        valueKey: "accountNumber",
      },
      {
        title: Locale.bicCode,
        valueKey: "routingNumber",
      },
      {
        title: Locale.accountType,
        valueKey: "accountType",
      },
      {
        title: Locale.bankName,
        valueKey: "bankName",
      },
      {
        title: Locale.bankAddress,
        valueKey: "bankAddress",
      },
      {
        title: Locale.beneficiaryBankCountry,
        valueKey: "beneficiaryBankCountry",
      },
      {
        title: Locale.accountName,
        valueKey: "accountHolderName",
      },
    ],
  },
  [LOCATION_CODE.IND]: {
    fields: [
      {
        title: Locale.paymentMethod,
        valueKey: "paymentMethod",
        isClickable: true,
      },
      {
        title: Locale.bankName,
        valueKey: "bankName",
      },
      {
        title: Locale.bankAddress,
        valueKey: "bankAddress",
      },
      {
        title: Locale.beneficiaryBankCountry,
        valueKey: "beneficiaryBankCountry",
      },
      {
        title: Locale.accountName,
        valueKey: "accountHolderName",
      },
    ],
  },
  [LOCATION_CODE.AUS]: {
    fields: [
      {
        title: Locale.paymentMethod,
        valueKey: "paymentMethod",
      },
      {
        title: Locale.accountNumber,
        valueKey: "accountNumber",
      },
      {
        title: Locale.bsbNumber,
        valueKey: "routingNumber",
      },
      {
        title: Locale.accountType,
        valueKey: "accountType",
      },
      {
        title: Locale.bankName,
        valueKey: "bankName",
      },
      {
        title: Locale.bankAddress,
        valueKey: "bankAddress",
      },
      {
        title: Locale.accountName,
        valueKey: "accountHolderName",
      },
    ],
  },
  [LOCATION_CODE.SG]: {
    fields: [
      {
        title: Locale.paymentMethod,
        valueKey: "paymentMethod",
      },
      {
        title: Locale.accountNumber,
        valueKey: "accountNumber",
      },
      {
        title: Locale.bicCode,
        valueKey: "routingNumber",
      },
      {
        title: Locale.accountType,
        valueKey: "accountType",
      },
      {
        title: Locale.bankName,
        valueKey: "bankName",
      },
      {
        title: Locale.accountName,
        valueKey: "accountHolderName",
      },
      {
        title: Locale.bankAddress,
        valueKey: "bankAddress",
      },
    ],
  },
};