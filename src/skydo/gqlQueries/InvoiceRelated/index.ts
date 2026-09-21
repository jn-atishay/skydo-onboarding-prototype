export const FetchCountryList = `
  query FetchCountryList {
    countries {
      name
      code2Alpha
      countryCode
    }
  }
`;

export type FetchCountryListResponse = {
  countries: {
    name: string;
    code2Alpha: string;
    countryCode: string;
  }[];
};
