const createDeskTpl = `
<div>
<div>
    <a-modal
    okText="创建"
      title="创建桌面"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"

      cancelText="取消">
      <p>桌面图标</p>
      <p >
      <ul class="icons-list">
      <li :class="{'active':isSelectedIcon(icon)}" @click="selectIcon(icon)" @mousedown.stop="" v-for="icon in icons">
      <a-icon :type="icon"></a-icon>
</li>
</ul>
</p>
<div style="clear: both"></div>
      <p>桌面名称</p>
      <div>
      <a-input default-value="新桌面" @change="changeName">
</a-input>
</div>
    </a-modal>
  </div>
</div>
  `
Vue.component('createDesk', {
  template: createDeskTpl,
  name: 'createDesk',
  model: {
    prop: ['visible'],
    event: 'changeVisible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {

  },
  data () {
    return {
      name:'新桌面',
      icon:'bulb',
      icons: [
        'bulb','account-book', 'alert', 'api', 'appstore', 'audio', 'bank', 'bell', 'book', 'bug',  'calculator', 'build', 'calendar', 'camera', 'car'
      ]
    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {
    isSelectedIcon(icon){
      return icon===this.icon
    },
    visibleChange () {
      this.$emit('changeVisible', !this.visible)
    },
    changeName(e){
      this.name=e.target.value
    },
    handleOk () {
      if(!!!this.icon){
        this.$message.error('必须选择图标')
        return
      }
      if(!!!this.name){
        this.$message.error('必须输入桌面名称')
        return
      }
      this.visibleChange()
      this.$emit('add-desk',{icon:this.icon,name:this.name})
    },
    selectIcon(icon){
      this.icon=icon
    },
    handleCancel () {
      this.$emit('changeVisible', false)
    }

  }
  ,
  destroyed () {
  }
})
