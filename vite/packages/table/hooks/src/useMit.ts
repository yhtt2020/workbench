import mitt from "mitt";
/**
 * 通过mitt创建一个全局的事件总线
 * 导出统一使用该事件总线
 */
export const useMit = mitt();

