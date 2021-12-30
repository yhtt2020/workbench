const groupTpl = `
   <a-dropdown  :trigger="['contextmenu']" >
                    <!--分组-->
                    <div  class="app" @contextmenu.stop="" @mousedown.stop="">
                      <div @mousemove.stop="mouseMove"  @mousedown.stop="mouseDown" @mouseup.stop="mouseUp" class="group-icons allow-drag">
                        <div class="icon" v-if="iconEl.element.type==='app'" v-for="iconEl in item.element.data" >
                          <img :src="iconEl.element.data.icon" :style="iconStyle(iconEl.element.data)">
                        </div>
                        <div class="icon" v-else>
                          <div class="other">
                          </div>
                        </div>
                      </div>
                      <div class="name allow-drag" @mousedown.stop="">
                        {{ item.element.name }}
                      </div>
                    </div>
                    <a-menu slot="overlay">
                      <a-menu-item @click="removeElement(item)" key="remove">
                        移除整组
                      </a-menu-item>
<!--                      <a-menu-item @click="editElement(item)" key="2">-->
<!--                        编辑组件-->
<!--                      </a-menu-item>-->
<!--                      <a-menu-item @mousedown.stop="" @click="composeSelectedElements()" key="3"-->
<!--                                   v-show="isSelected(item) && selectedElements.length>1">-->
<!--                        解散组-->
<!--                      </a-menu-item>-->
                    </a-menu>
                  </a-dropdown>
  `
Vue.component('group', {
  template: groupTpl,
  name: 'app',
  props: ['item'],
  data () {
    return {
      mouseFlag: 0
    }
  },
  mounted () {

  },
  methods: {
    mouseDown(){
      this.mouseFlag=0
    },
    mouseMove(){
      this.mouseFlag=1
    },
    mouseUp (event) {
      if (this.mouseFlag===0) {
        this.$emit('open-group')
      }
      event.stopPropagation()
    },
    openGroup () {
      this.$emit('open-group')
    },
    editElement () {
      this.$emit('edit-group')
    },
    removeElement () {
      this.$emit('remove-element')
    },
    iconStyle: function (item) {
      const style = {}
      if (!!item.useBg) {
        style['background-color'] = item.color
      }
      if (!!item.useRadius) {
        style['border-radius'] = item.radius + '%'
      }
      return style
    },
    /**
     * app按钮上鼠标事件，区分移动和拖拽
     */
    appMouseDown () {
      this.mouseFlag = 0
    },
    appMouseMove () {
      this.mouseFlag = 1
    },
    appMouseUp (e, url) {
      console.log(e)
      if (this.mouseFlag === 0 && e.button === 0) {
        this.openUrl(url)
      }
    }
  },
  destroyed () {
  }
})
