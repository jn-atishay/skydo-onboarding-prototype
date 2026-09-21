// Stand-in for nookies. The prototype keeps nothing in cookies.
const store: Record<string, string> = {};
export const parseCookies = () => ({ ...store });
export const setCookie = (_ctx: any, key: string, value: string) => {
  store[key] = value;
};
export const destroyCookie = (_ctx: any, key: string) => {
  delete store[key];
};
export default { parseCookies, setCookie, destroyCookie };
