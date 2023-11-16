export interface DragProps {
  // 基于父级视图
  parent?: boolean
  // 边缘检测
  boundaryDetection?: boolean
  // 冲突检测
  collisionDetection?: boolean
  // 缩放比例
  scale?: number
  // 初始位置
  initTop?: number
  initLeft?: number
  // 拖拽结束吸附网格
  afterDragging?: boolean
  // 拖拽过程吸附网格
  whileDragging?: boolean
  // 拖拽显示网格位置
  showGrid?: boolean
  // 网格大小
  grid?: any
}
