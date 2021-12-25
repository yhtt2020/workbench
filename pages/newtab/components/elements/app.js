const appTpl=`
  <a-dropdown :trigger="['contextmenu']" >
                    <!--应用-->
                    <div @mousedown.stop="" @contextmenu.stop="" class="app">
                    <!-- draggable="true"  @dragstart="setDrag($event,item.element.data)"-->
                      <div   class="icon-wrapper allow-drag" @mousedown.stop="appMouseDown" @mousemove.stop="appMouseMove" @mouseup.stop="appMouseUp($event,item.element.data.url)"
                           :style="iconStyle(item.element.data)">
                        <img
                             :src="item.element.data.icon">
                      </div>
                      <div class="name allow-drag" :style="'background-color:'+item.element.data.textColor"
                           v-if="item.element.data.useTextBg">
                        {{ item.element.data.name}}
                      </div>
                      <div class="name allow-drag" v-else>
                        {{ item.element.data.name}}
                      </div>
                    </div>
                    <a-menu slot="overlay">
                      <a-menu-item @click="removeElement" key="remove">
                        移除组件
                      </a-menu-item>
                      <a-menu-item @click="editElement" key="edit">
                        编辑组件
                      </a-menu-item>
<!--                      <a-menu-item @mousedown.stop="" @click="composeSelectedElements()" key="3"-->
<!--                                   v-show="isSelected(item) && selectedElements.length>1">-->
<!--                        合并{{selectedElements.length}}个选中图标成组-->
<!--                      </a-menu-item>-->
                    </a-menu>
                  </a-dropdown>
  `
Vue.component('app', {
  template:appTpl,
  name: "app",
  props: ['item'],
  data () {
    return {
    }
  },
  mounted() {

  },
  methods: {
    openUrl(){
      this.$emit('open-url')
    },
    editElement(){
      this.$emit('edit-element')
    },
    removeElement(){
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
    appMouseDown(){
      this.mouseFlag=0
    },
    appMouseMove(){
      this.mouseFlag=1
    },
    appMouseUp(e,url){
      console.log(e)
      if(this.mouseFlag===0 && e.button===0) {
        this.openUrl(url)
      }
    }
  },
  destroyed() {
  }
})
