// 组件选项
export interface IOption {
  // 类型，字符串
  type: string;
  // 是否显示卡片标题
  noTitle: boolean;
  // 是否隐藏组件
  hide?: boolean;
  // 删除前置任务
  beforeDelete?: boolean;
  // web端屏蔽
  web?: boolean;
  // 标题
  title?: string;
  // 图标
  icon?: string;
  // 标题右侧图标
  rightIcon?: string;
  // 背景色
  background?: string;
  titleRoute:any;
  // 便签全背景色
  showColor:boolean;
}

// 菜单项
export interface IMenuItem {
  // 标题
  title?: string;
  // 函数
  fn?: () => void;
  // 图标
  icon?: string;
  // 新图标
  newIcon?: string;
}


export interface TitleProps {
 // 左侧图标 适配旧版icon 适配新版newIcon
 icon: string,
 newIcon: string,
 // 右侧添加图标 true为打开 false为关闭
 add: boolean,
 // 右侧刷新图标 true为打开 false为关闭
 refresh: boolean,
 background: string,
}
