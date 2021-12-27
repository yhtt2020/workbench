const appTpl=`
<div>
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
                      <a-menu-item @click="editElement(item)" key="edit">
                        编辑组件
                      </a-menu-item>
                      <a-menu-divider v-show="selectedMenuVisible"> </a-menu-divider>
                      <a-menu-item @click="composeGroup()" @mousedown.stop="" key="composeGroup"
                                   v-show="selectedMenuVisible">
                        合并选中图标成组
                      </a-menu-item>
                       <a-menu-item @click="removeSelected" @mousedown.stop="" key="removeSelected"  v-show="selectedMenuVisible">
                        移除选中组件
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
  <a-modal v-model="visibleEdit" :width="800" title="编辑组件" :centered="true" :footer="null">
        <template>
          <a-row type="flex">
            <a-col flex="100px">
              效果预览：
              <div
                style="background: rgba(0,0,0,0.1);display: inline-block;padding: 50px;margin: 20px;border-radius: 10px">
                <div class="app">
                  <div class="icon-wrapper" :style="this.iconStyle(this.formEdit)">
                    <img :src="formEdit.icon">
                  </div>
                  <div class="name" :style="'background-color:'+this.formEdit.textColor" v-if="this.formEdit.useTextBg">
                    {{ formEdit.name}}
                  </div>
                  <div class="name" v-else>
                    {{ formEdit.name}}
                  </div>
                </div>
              </div>

            </a-col>
            <a-col flex="1">
              <a-form-model :model="formEdit" :label-col="labelCol" :wrapper-col="wrapperCol">
                <template>
                  <a-form-item label="图标名称">
                    <a-input placeholder="输入组件名称" v-model="formEdit.name"></a-input>
                  </a-form-item>
                  <a-form-item label="链接">
                    <a-input placeholder="输入链接地址" v-model="formEdit.url"></a-input>
                  </a-form-item>
                  <a-form-item label="图标圆角">
                    <a-switch v-model="formEdit.useRadius"></a-switch>
                    <div >
                    <a-slider v-model="formEdit.radius"  :min="0" :max="50"></a-slider>
                    </div>
                  </a-form-item>
                  <a-form-item label="图标背景">
                    <a-switch v-model="formEdit.useBg"></a-switch>
                    <v-swatches class="color-select" v-model="formEdit.color" popover-x="left"></v-swatches>
                  </a-form-item>
                  <a-form-item label="文字背景色">
                    <a-switch v-model="formEdit.useTextBg"></a-switch>
                    <v-swatches class="color-select" v-model="formEdit.textColor" popover-x="left"></v-swatches>
                  </a-form-item>
                  <a-form-item label="说明">
                    <a-input v-model="formEdit.summary" type="textarea"></a-input>
                  </a-form-item>
                </template>
                <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                  <a-button type="primary" @click="onSubmitEdit">
                    保存
                  </a-button>
                  <a-button style="margin-left: 10px;" @click="visibleEdit=false">
                    取消
                  </a-button>
                </a-form-item>
              </a-form-model>
            </a-col>
          </a-row>
        </template>
      </a-modal>
</div>
  `
const swatches= window['vue-swatches']
Vue.component('app', {
  template:appTpl,
  name: "app",
  props: ['item','groupId','selectedMenuVisible'],
  components: {
    'v-swatches':swatches
  },
  data () {
    return {
      visibleEdit: false,

      labelCol: { span: 4 },
      wrapperCol: { span: 14 },


      formEdit: {
        id: 0,
        url: '',
        name: '',
        useBg: false,
        color: '#00000000',

        useTextBg: false,
        textColor: '#00000000',

        desc: '',
        type: 'app', //card group,
        useRadius: false,
        radius: '20',

        element: {
          type: ''
        }
      },
    }
  },
  computed:{

  },
  mounted() {

  },
  methods: {
    selectedElementsLength (){
      return window.selectedElements.length
    },
    /**
     * 编辑组件
     * @param item
     * @param groupId 组id用于分组组件编辑
     */
    editElement (item) {
      const element = item.element
      this.formEdit.type = element.type
      if (element.type === 'app' && !!!item.name) {
        this.formEdit.name = element.data.name
      } else {
        this.formEdit.name = item.name
      }
      if(this.groupId!==0){
        this.formEdit.groupId=this.groupId
      }else{
        this.formEdit.groupId=0
      }
      this.formEdit.url = element.data.url
      this.formEdit.icon = element.data.icon
      this.formEdit.useBg = element.data.useBg
      this.formEdit.color = element.data.color
      this.formEdit.textColor = element.data.textColor
      this.formEdit.useTextBg = element.data.useTextBg
      this.formEdit.useRadius = element.data.useRadius
      this.formEdit.radius = element.data.radius

      this.formEdit.summary = element.data.summary
      this.formEdit.element = item.element
      this.formEdit.id = item.i
      this.visibleEdit = true
    },
    onSubmitEdit(){
      this.$emit('edit-app',{data:this.formEdit})
      this.visibleEdit = false
    },
    openUrl(){
      this.$emit('open-url')
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
    },
    composeGroup(){
      this.$emit('compose-group')
    },
    removeSelected(){
      this.$emit('remove-selected')
    }

  },
  destroyed() {
  }
})
