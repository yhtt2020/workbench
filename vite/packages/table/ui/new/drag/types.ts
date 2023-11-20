export interface DragProps {
  // 基于父级视图
  parent?: boolean;
  // 边缘检测
  boundaryDetection?: boolean;
  // 冲突检测
  collisionDetection?: boolean;
  // 缩放比例
  scale?: number;
  // 初始位置
  initTop?: number;
  initLeft?: number;
  // 拖拽结束吸附网格
  afterDragging?: boolean;
  // 拖拽过程吸附网格
  whileDragging?: boolean;
  // 拖拽显示网格位置
  showGrid?: boolean;
  // 网格大小
  grid?: any;
}

let a = {
  state: {
    system: {
      isFreeLayout: true,
      isFloatMenu: true,
      floatMenu: { top: 616, left: 1465 },
    },
    option: {
      afterDragging: false,
      whileDragging: false,
      collision: false,
      margin: 6,
      magnet: true,
    },
    line: {
      isAuxLine: true,
      isBorderLine: false,
      isCenterLine: false,
      centerLine: { x: 1000, y: 1000 },
    },
    canvas: { isInfinite: false, zoom: 1.1, width: 2000, height: 2000 },
  },
  data: {
    "1699845890773": {
      left: 56.493501143022,
      top: 71.34740447998047,
      index: 1,
      id: 1699845890773,
      name: "clocks",
      customData: {
        dragCardSize: "card small",
        width: 1,
        height: 1,
        cardSize: "card small",
        clockId: "clock4",
        imgUrl:
          "https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg",
        blurs: 3,
        bgZoom: 0,
        widgetSize: { width: 279.984375, height: 204.984375 },
      },
    },
    "1699845900880": {
      left: 408.99351501464844,
      top: 575.4545516967773,
      index: 1,
      id: 1699845900880,
      name: "clocks",
      customData: {
        dragCardSize: "card small",
        width: 1,
        height: 1,
        cardSize: "card small",
        clockId: "clock4",
        imgUrl:
          "https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg",
        blurs: 3,
        bgZoom: 0,
        widgetSize: { width: 279.984375, height: 204.984375 },
      },
    },
    "1699852732918": {
      left: 290.5194854736328,
      top: 360.9740295410156,
      index: 1,
      id: 1699852732918,
      name: "clocks",
      customData: {
        dragCardSize: "card small",
        width: 1,
        height: 1,
        cardSize: "card small",
        clockId: "clock4",
        imgUrl:
          "https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg",
        blurs: 3,
        bgZoom: 0,
        widgetSize: { width: 279.984375, height: 204.984375 },
      },
    },
    "1699852776585": {
      left: 473.1493488658558,
      top: 71.34740447998047,
      index: 1,
      id: 1699852776585,
      name: "AIaides",
      customData: { widgetSize: { width: 279.984375, height: 203.984375 } },
    },
    "1700118581920": {
      left: -0.0016021728515625,
      top: 392.99514389038086,
      index: 1,
      id: 1700118581920,
      name: "notes",
      customData: {
        title: "桌面便333签",
        background: "#57BF60",
        cardSize: "card",
        colors: "#ffffff",
        height: 2,
        width: 1,
        text: "\n",
        dragCardSize: "card",
        content: "",
      },
    },
    "1700122553063": {
      left: 803.5454614812677,
      top: 575.454548922452,
      index: 1,
      id: 1700122553063,
      name: "notes",
      customData: {
        title: "桌面便签",
        background: "#57BF60",
        cardSize: "card",
        colors: "#ffffff",
        height: 2,
        width: 1,
        text: "2222\n",
        dragCardSize: "card",
        content: "",
      },
    },
    "1700122560776": {
      left: 986.2662589333274,
      top: 70.82791900634766,
      index: 1,
      id: 1700122560776,
      name: "notes",
      customData: {
        title: "桌面便签",
        background: "#57BF60",
        cardSize: "card",
        colors: "#ffffff",
        height: 2,
        width: 1,
        text: "33333333333333333333333333333333333333333333333333333333333111\n",
        dragCardSize: "card",
        content: "",
      },
    },
  },
};
