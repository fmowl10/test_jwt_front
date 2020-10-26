import {
  createContext
} from "react"

export type CoreContextProps = {
  key: string;
  token: string;
  setKey: (key: string) => void;
  setToken: (token: string) => void;
}

const initailizeCoreContext: CoreContextProps = {
  key: "",
  token: "",
  setKey: (key: string) => { },
  setToken: (token: string) => { },
}

export const CoreContext = createContext(initailizeCoreContext);
