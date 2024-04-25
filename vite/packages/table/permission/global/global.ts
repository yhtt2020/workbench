import { currentEnv, useEnv } from "../useEnv";
import { currentDev, useDev } from "../useDev";

import { TT } from "./type";
import { useMit } from "../../hooks";

export const tt: TT = {
  runTime: {
    isEnv: useEnv,
    isDev: useDev,
    // isDev
    env: currentEnv(),
    dev: currentDev(),
  },
  ui: {
    chooseFile: (cb?: Function) => {
      useMit.emit("openFile", cb);
    },
    confirm,
  },
  user: {
    login: (cb) => {
      useMit.emit("openLogin", cb);
    },
  },
  sys: {
    openSystemSet: () => {
      useMit.emit("openSystemSet");
    },
  },
};
export { useMit };
