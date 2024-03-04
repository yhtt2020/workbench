import { currentEnv, useEnv } from "../useEnv";
import { TT } from "./type";
import mitt from "mitt";
const Mit = mitt();
export { Mit };
export const tt: TT = {
  runTime: {
    isEnv: useEnv,
    env: currentEnv(),
  },
  ui: {
    chooseFile: (cb?: Function) => {
      Mit.emit("openFile", cb);
    },
    confirm,
  },
  user: {
    login: (cb) => {
      Mit.emit("openLogin", cb);
    },
  },
};
