export interface DragProps {
  // 禁用组件拖拽
  disabled?: boolean
  // 基于父级视图
  parent?: boolean
  // 边缘检测
  boundary?: boolean
  // 碰撞检测
  collision?: boolean
  collisionName?: string | number
  // 碰撞还原
  collisionRestore?: string
  // 磁吸检测
  magnet?: boolean
  // 磁吸名称
  magnetName?: string | number
  // 磁吸范围
  magnetRange?: number
  // 磁吸边距
  magnetMargin?: number
  // 双向绑定xyzr
  x?: number
  y?: number
  index?: number
  rotate?: number
  // 独立缩放
  scale?: number
  // 父级缩放
  parentScale?: number
  // 网格大小
  grid?: any
  // 拖拽后吸附网格
  afterDraggingAdsorbGrid?: boolean
  // 拖动时吸附网格
  whileDraggingAdsorbGrid?: boolean
  // 拖动网格位置
  gridLocation?: boolean
  // 网格边距
  gridMargin?: number
  // 拖拽元素的选择器
  handle?: string | string[] | null
  // 禁用拖拽元素的选择器
  disabledHandle?: string | string[] | null
  // 禁用默认事件
  disabledDefaultEvent?: boolean
  // 拖拽样式
  draggableClass?: string
  draggableStyle?: object | null
  // 网格样式
  gridClass?: string
  gridStyle?: object | null
  // 重置位置
  resetPosition?: boolean
  // 用户数据
  data?: any
  // 首次定位
  firstPosition?: string[] | number[] | null
}
