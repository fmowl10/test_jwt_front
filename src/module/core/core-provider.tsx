import React, {
  FC, useState,
} from "react";
import {
  CoreContext,
  CoreContextProps,
} from "./core-context";

export const CoreProvider: FC = ({
  children,
}) => {
  const initalState: CoreContextProps = {
    key: "",
    token: "",
    setKey: (key: string) => {
      setCore({ ...core, key: key });
    },
    setToken: (token: string) => {
      setCore((prevState) => ({ ...prevState, token: token }));
    },
  };
  const [core, setCore] = useState<CoreContextProps>(initalState);
  return (
    <CoreContext.Provider value={core}>
      {children}
    </CoreContext.Provider>
  );
};