import {DOMAttributes} from 'react'

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

export {}

declare global {
  interface Window {
    Module: any;
    QtLoader: any;

    randomString(length: number, letter: boolean,
                 uppercaseLetter: boolean, symbol: boolean): string;
  }
}
