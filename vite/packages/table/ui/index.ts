import { App } from 'vue'

// 业务组件
import XtCanvas from "./components/Canvas/index.vue"
// import XtColorPicker from "./components/ColorPicker/index.vue"
import XtGuided from "./components/Guided/index.vue"
import XtLeftMenu from "./components/LeftMenu/index.vue"
import XtMenu from "./components/Menu/index.vue"
import XtModal from "./components/Modal/index.vue"
import XtTask from "./components/Task/index.vue"
import XtText from "./components/Text/index.vue"
import XtView from "./components/View/index.vue"
import XtZoom from "./components/Zoom/index.vue"
import XtSelectIcon from "./components/SelectIcon/index.vue"
// 基础组件
import XtBaseColor from "./libs/BaseColor/index.vue"
import XtBaseIcon from "./libs/BaseIcon/index.vue"
import XtButton from "./libs/Button/index.vue"
import XtCollapse from "./libs/Collapse/index.vue"
import XtColor from "./libs/Color/index.vue"
import XtDivider from "./libs/Divider/index.vue"
import XtDrawer from "./libs/Drawer/index.vue"
import XtIcon from "./libs/Icon/index.vue"
import XtImg from "./libs/Img/index.vue"
import XtInput from "./libs/Input/index.vue"
import XtMask from "./libs/Mask/index.vue"
import XtMessage from "./libs/Message/index.vue"
import XtNewIcon from "./libs/NewIcon/index.vue"
import XtPopover from "./libs/Popover/index.vue"
import XtRadio from "./libs/Radio/index.vue"
import XtSelect from "./libs/Select/index.vue"
import XtState from "./libs/State/index.vue"
import XtTab from "./libs/Tab/index.vue"
import XtTextarea from "./libs/Textarea/index.vue"
import XtTitle from "./libs/Title/index.vue"

export default function (app: App): void {
  app.component('XtCanvas', XtCanvas)
  app.component('XtGuided',XtGuided )
  app.component('XtLeftMenu', XtLeftMenu)
  app.component('XtMenu', XtMenu)
  app.component('XtModal', XtModal)
  app.component('XtTask', XtTask)
  app.component('XtText', XtText)
  app.component('XtView', XtView)
  app.component('XtZoom',XtZoom )
  app.component('XtBaseColor',XtBaseColor )
  app.component('XtBaseIcon',XtBaseIcon )
  app.component('XtButton',XtButton )
  app.component('XtCollapse',XtCollapse )
  app.component('XtColor',XtColor )
  app.component('XtDivider',XtDivider )
  app.component('XtDrawer',XtDrawer )
  app.component('XtIcon', XtIcon)
  app.component('XtImg',XtImg )
  app.component('XtInput', XtInput)
  app.component('XtMask', XtMask)
  app.component('XtMessage', XtMessage)
  app.component('XtNewIcon',XtNewIcon )
  app.component('XtPopover',XtPopover )
  app.component('XtRadio', XtRadio)
  app.component('XtSelect',XtSelect )
  app.component('XtState',XtState )
  app.component('XtTab',XtTab )
  app.component('XtTextarea', XtTextarea)
  app.component('XtTitle',XtTitle )
  app.component('XtSelectIcon',XtSelectIcon )
}
