export type ModalProps = {
  // 控制弹窗是否显示
  modelValue?: boolean;
  // 弹窗标题
  title?: string;
  // 底部默认样式
  noName?: string;
  okName?: string;
  // 弹窗层级
  index?: number;
  // 遮罩层级
  maskIndex?: number;
  // 是否使用遮罩
  mask?: boolean;
  nav?: boolean;
  // 头部插槽是否开启
  header?: boolean;
  // 底部插槽是否开启
  footer?: boolean;
  // esc 关闭弹窗
  esc?: boolean;
  // 弹窗样式
  boxClass?: string;
  // 头部区样式
  headerClass?: string;
  // 内容区样式
  mainClass?: string;

  // 挂载前
  beforeMount?: () => boolean;
  // 卸载前
  beforeUnmount?: () => boolean;
  // 自定义插槽
  custom?: boolean;
  // 是否使用滚动条
  isScrollbar?: boolean;
  // 最小化
  min?: boolean;
  // 最大化
  max?: boolean;

  type?: string | null;
  // 自定义拖拽区域
  handle?: string;
  // 用于记录保存拖拽位置的key
  name?: string | null;

  scrollbarStyle?: any;
  isFullScreen?: boolean;
  isMaximize?: boolean;
};
