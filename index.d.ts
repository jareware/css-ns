declare module 'css-ns' {
  interface Options {
    namespace: string;
    prefix?: string;
    include?: RegExp;
    exclude?: RegExp;
    self?: RegExp;
    glue?: string;
    React?: any;
  }

  type ClassMap = { [className: string]: boolean };
  type ReactElement = any;

  export interface NsFunction {
    (classNames: string | any[] | ClassMap): string;
    <T extends ReactElement>(reactElement: T): T;
  }

  export const createCssNs: (options: Options | string) => NsFunction;
}
