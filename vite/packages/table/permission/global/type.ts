import { Confirm } from "../../ui/new/confirm";
import { UseEnv, baseEnv } from "../useEnv";

/**
 * @description: 天天工作台全局对象
 */
export type TT = {
  /**
   * 运行时相关指令
   */
  runTime: {
    /**
     * 判断所属环境
     */
    isEnv: (arr?: string | string[]) => string;
    /**
     * 获取当前环境
     */
    env: string;
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
};

declare global {
  interface Window {
    /**
     * @description: 天天工作台全局对象
     */
    tt: TT;
  }
}
