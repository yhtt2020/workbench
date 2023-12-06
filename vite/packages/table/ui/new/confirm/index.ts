import { h, render } from "vue";
import ConfirmComponent from "./confirm.vue";

/**
 * 确认框
 * @param title 标题
 * @param content 内容
 * @param noText 取消按钮文字
 * @param okText 确认按钮文字
 * @param duration 动画持续时间
 * @param index 动画索引
 * @param mask 是否显示遮罩层
 * @param maskIndex 遮罩层索引
 */
export const confirm = (
  title: string,
  content?: string,
  {
    noText = "取消",
    okText = "确认",
    duration = "0.3s",
    index = 99999,
    mask = false,
    maskIndex = 99999,
  }: any = {}
) => {
  return new Promise<void>((resolve, reject) => {
    // 如果没传递内容 那么标题作为内容值
    if (title && !content) {
      content = title;
      title = "";
    }

    /**
     * 确认回调
     */
    const ok = () => {
      resolve();
    };
    /**
     * 取消回调
     */
    const no = () => {
      reject();
    };

    /**
     * 关闭回调
     */
    const close = () => {
      // 3 把渲染的 vNode 移除
      render(null, document.body);
    };

    // 1 生成 vNode
    const vNode = h(ConfirmComponent, {
      title,
      content,
      noText,
      okText,
      duration,
      index,
      mask,
      maskIndex,
      ok,
      no,
      close,
    });

    // 2 render 渲染
    render(vNode, document.body);
  });
};
