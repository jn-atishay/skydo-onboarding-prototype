// Stand-in for axios. Any direct call resolves to an empty success so that a stray
// request can never reach the network from a static page.
const empty = async () => ({ data: { success: true, message: "", data: null }, status: 200 });
const axios: any = Object.assign(empty, {
  get: empty,
  post: empty,
  put: empty,
  patch: empty,
  delete: empty,
  request: empty,
  create: () => axios,
  defaults: { headers: { common: {} } },
  interceptors: { request: { use: () => {} }, response: { use: () => {} } },
  isAxiosError: () => false,
  CancelToken: { source: () => ({ token: null, cancel: () => {} }) },
});
export default axios;
export const isAxiosError = () => false;
export type AxiosError = any;
export type AxiosResponse = any;
