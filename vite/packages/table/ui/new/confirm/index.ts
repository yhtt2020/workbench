import { h, render } from "vue";
import ConfirmComponent from "./Confirm.vue";

export default ConfirmComponent

interface ConfirmOptions {
  noText?: string | boolean | undefined;
  okText?: string;
  ok?: () => void;
  no?: () => void;
  duration?: string;
  index?: number;
  mask?: boolean;
  maskIndex?: number;
  type?: 'error' | 'link' |"success" |"warning"
}

/**
 * 确认框
 *
 * @param title - 标题
 * @param content - 内容
 *
 * @param options - 配置选项
 * @param options.ok - 确认回调
 * @param options.no - 取消回调
 * @param options.noText - 取消按钮文字（默认：'取消'）为空会隐藏取消按钮
 * @param options.okText - 确认按钮文字（默认：'确认'）
 * @param options.duration - 动画时间（默认：'0.3s'）
 * @param options.index - 动画索引（默认：1001）
 * @param options.mask - 是否显示遮罩层（默认：false）
 * @param options.maskIndex - 遮罩层索引（默认：1000）
 * @param options.type - icon 的样式类型 （默认：link）
 */
export const confirm = (
  title: string,
  content?: string,
  options: ConfirmOptions = {
    noText: "取消",
    okText: "确认",
    ok: () => {},
    no: () => {},
    duration: "0.3s",
    index: 1001,
    mask: false,
    maskIndex: 1000,
    type:'link'
  }
) => {
  const { noText, okText, duration, index, mask, maskIndex, ok, no, type} = options;

  // 3 把渲染的 vNode 移除
  const close = () => {
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
    type
  });

  // 2 render 渲染

   let component=render(vNode, document.body)
  return {
    component,
    close
  }
};
