declare module 'css-ns' {
  interface Options<R = undefined> {
    namespace: string;
    prefix?: string;
    include?: RegExp;
    exclude?: RegExp;
    self?: RegExp;
    glue?: string;
    escape?: string;
    React?: R;
  }

  type ClassMap = { [className: string]: boolean };
  type ReactElement = any;

  export interface NsFunction<R = undefined> {
    (classNames: string | any[] | ClassMap): string;
    <T extends ReactElement>(reactElement: T): T;
    React: R;
  }

  export const createCssNs: <R = undefined>(options: Options<R> | string) => NsFunction<R>;
}
