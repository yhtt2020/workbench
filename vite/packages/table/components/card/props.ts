/**
 * 新增参数前，请先确定当前参数是否无法完成！
 * 新增参数前，请先确定当前参数是否无法完成！
 * 新增参数前，请先确定当前参数是否无法完成！
 *
 */
/**
 * 所有参数默认值请都设置为false 请勿随意修改默认值
 */
export const defaultProps = {
  // ----------下面都属于必填选参数----------
  /**
   * 小组件索引
   */
  customIndex: {
    type: Number || String,
    required: true,
    default: 0,
  },
  /**
   * 小组件数据
   */
  customData: {
    type: Object,
    required: true,
    default: () => {
      return {
        customSize: "2x2",
      };
    },
  },
  /**
   * 小组件所属桌面
   */
  desk: {
    type: Object,
    required: true,
  },
  /**
   * 小组件大小 默认 2x2
   */
  customSize: {
    type: String,
    default: "2x2",
  },
  // ----------下面都属于可选参数----------
  /**
   * 控制全部小组件区域
   */
  options: {
    type: Object,
    default: () => {
      return {
        // 自定义区域 开启后只保留全局右键功能
        custom: false,
        // 自定义全局背景色
        bg: "",
        // 自定义全局字体颜色
        color: "",
        // 是否允许删除组件
        disabledDelete: false,
        // 开启后，可拖拽小组件
        resize: false,
        // 作为弹窗时的尺寸
        modalSize: "",
        // 阴影开关 开启会关闭阴影
        shadow: false,
        // 卡片默认数据 传递后每次都会帮你校验数据，不存在的key会进行赋值
        defaultData: {},
        // 自定义删除打开后默认删除事件不执行，再删除回调上提供原删除事件
        customDel: false,
        customCopy:false,
        // 开启后所有事件相关提示信息会进行输出
        debug: false,
        // 是否开启下拉菜单右侧还是左侧显示
        rightMenuVisible: false,
        // 是否禁用标题拖拽
        disabledDrag: false,
        // 是否允许添加到导航栏
        disabledNav: false,
        // 在社群成员桌面的情况下禁用组件编辑
        disableEdit: false,
        /**
         * 无边框模式
         * 开启后会移除header部分和背景色
         */
        noBorder: false,
      };
    },
  },
  // 控制小组件头部区域
  header: {
    type: Object,
    default: () => {
      return {
        // 禁用头部区域
        disabled: false,
        // 左侧图标 新增 mixIcon: '直接传要显示的图标',
        mixIcon: "",
        // 左侧图标 废弃 （适配旧版icon 适配新版newIcon）
        icon: "",
        ifyIcon: "",
        /**
         * 右侧图标
         * {
         *    新增
         *    mixIcon: '直接传要显示的图标',
         *    fn: 点击回调,
         *    tip：'提示文字',
         *    disabled: 禁用 true为禁用 false为不禁用
         * }
         *    废弃 icon: '旧版图标',
         *    废弃 ifyIcon: '新版图标',
         *    废弃 showIcon: '图标选择器的图标 小庄定义的命名规范'
         */
        rightIcon: [],
        /**
         * 右侧刷新图标
         * {
         *    fn: lockClick,
         *    tip：'提示文字',
         *    disabled: 禁用 true为禁用 false为不禁用
         * }
         */
        refresh: false,
        // 标题背景色 true为打开 false为关闭
        bg: false,
        // 标题颜色
        color: "",
        // 鼠标经过显示 整个左侧可操作区域 左侧图标 + 标题区域  true为打开 false为关闭
        leftHover: false,
        // 鼠标经过显示 左侧图标 true为打开 false为关闭
        iconHover: false,
        // leftHover iconHover同用 leftHoverName leftHoverIcon 两个参数
        leftHoverName: "",
        leftHoverIcon: "",
        // 鼠标经过显示 标题区域  true为打开 false为关闭
        titleHover: false,
        titleHoverName: "",
      };
    },
  },
  // 控制小组件主体区域
  body: {
    type: Object,
    default: () => {
      return {
        // 是否开启滚动条边距
        scroll: false,
        // 自定义背景色
        bg: "",
        // 自定义字体颜色
        color: "",
      };
    },
  },
  /**
   * 小组件菜单列表
   * {
   *    icon: '旧版图标',
   *    newIcon: '新版图标',
   *    fn: 点击回调,
   *    disabled: 禁用 true为禁用 false为不禁用
   *    title: '提示文字'
   * }
   */
  menuList: {
    type: Array,
    default: () => [],
  },
  platLimit: {
    type: Array,
    default: () => [],
  },
  /**
   * 小组件大小列表
   * 参考格式 [{ name: '4x2'value: '4x2' }]
   */
  sizeList: {
    type: Array,
    default: () => [],
  },
  /**
   * 小组件不可用环境
   * 参数可选 ["web", "offline", "guest", "mac", "client", "single"]
   */
  envLimit: { type: Array, default: () => [] },
  /**
   * 返回小组件控制器所有信息
   * outside 鼠标是否悬浮与小组件
   */
  status: {},
  /**
   * 控制resize组件 会通过v-bind将对象传入组件中
   * 组件路径 vite\packages\table\components\card\Resize.vue
   */
  resizeOptions: {
    type: Object,
    default: () => {
      return {};
    },
  },
};
