const groupTpl = `
   <a-dropdown  :trigger="['contextmenu']" >
                    <!--分组-->
                      <div  class="app app-group-2x2" @contextmenu.stop="" @mousedown.stop="" v-if="w===2 && h==2" >
                      <div @mousemove.stop="mouseMove"  @mousedown.stop="mouseDown" @mouseup.stop="mouseUp" class="group-icons allow-drag">
                        <div class="icon"  v-for="(iconEl,index) in item.element.data"  >
                          <div v-if="index===8" class="more" >

                           <img :src="iconEl.element.data.icon" :style="iconStyle(iconEl.element.data)">
                            <div class="place-handler" >

                            </div>
                          <div class="app-name">其他</div>
                            </div>
                           <div v-else @mouseup.stop="appMouseUp($event,iconEl.element.data.url)">
                           <img :src="iconEl.element.data.icon" :style="iconStyle(iconEl.element.data)" onerror="this.src='../../icons/default.svg'">
                          <div>{{iconEl.element.data.name}}</div>
                            </div>
                        </div>
                      </div>
                      <div class="name allow-drag" @mousedown.stop="">
                        {{ item.element.name }}
                      </div>
                    </div>
                    <div  v-else class="app" @contextmenu.stop="" @mousedown.stop="" >
                      <div @mousemove.stop="mouseMove"  @mousedown.stop="mouseDown" @mouseup.stop="mouseUp" class="group-icons allow-drag">
                        <div class="icon" v-if="iconEl.element.type==='app'" v-for="iconEl in item.element.data" >
                          <img :src="iconEl.element.data.icon" :style="iconStyle(iconEl.element.data)" onerror="this.src='../../icons/default.svg'">
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
  props: ['item','w','h'],
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
    }, openUrl (url) {
      location.href = url
    },
  },
  destroyed () {
  }
})
