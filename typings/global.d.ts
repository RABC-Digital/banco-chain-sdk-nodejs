declare module 'camelcase-keys' {
  interface CamelcaseKeys {
    (arg: any, config?: { deep: boolean }): any;
  }
  const camelcaseKeys: CamelcaseKeys;

  export = camelcaseKeys;
}