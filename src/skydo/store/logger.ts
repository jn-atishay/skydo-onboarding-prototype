// Log every time state is changed
const log = (config: any) => (set: (arg0: any) => void, get: () => any, api: any) =>
  config(
    (...args: any) => {
      // @ts-ignore
      set(...args);
    },
    get,
    api
  );

export default log;
