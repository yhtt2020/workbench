import { currentEnv, useEnv } from "../../permission/useEnv";
import { currentPlat, usePlat } from "../../permission/usePlat";
import { Confirm } from "../../ui/new/confirm";
import { useMit } from "./useMit";

type TT = {
  /**
   * 运行时相关指令
   */
  runtime: {
    /**
     * 判断所属环境
     */
    isEnv: (arr?: string | string[]) => string;
    isDev: (arr?: string | string[]) => string;
    /**
     * 获取当前环境
     */
    env: string;
    dev: string;
  };
  /**
   * UI相关指令
   */
  ui: {
    [key: string]: any;
    /**
     * 消息弹窗
     */
    confirm: Confirm;
    /**
     *获取文件弹窗
     * @param cb - 回调函数
     */
    chooseFile: (cb?: Function) => void;
  };
  /**
   * 用户相关指令
   */
  user: {
    [key: string]: any;
    /**
     * 打开登录窗口
     * @param cb - 回调函数
     */
    login: (cb?: Function) => void;
  };
  // 系统相关指令
  sys: {
    /**
     * 打开系统设置
     */
    openSystemSet: () => void;
  };
};
/**
 * @description: 天天工作台全局对象
 */
export const useTT: TT = {
  runtime: {
    isEnv: useEnv,
    isDev: usePlat,
    env: currentEnv(),
    dev: currentPlat(),
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
