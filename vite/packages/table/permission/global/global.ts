import { currentEnv, useEnv } from "../useEnv";
import { TT } from "./type";
import { useMit } from "../../hooks";

export const tt: TT = {
  runTime: {
    isEnv: useEnv,
    env: currentEnv(),
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
