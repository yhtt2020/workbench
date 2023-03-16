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
      <strong><strong>桌面图标</strong></strong>
      <p >
     <icon-selector v-model="icon"></icon-selector>
</p>
<div style="clear: both;margin-bottom: 10px"></div>
      <p><strong>桌面名称</strong></p>
      <div>
      <a-input default-value="新桌面"  @change="changeName">
</a-input>
</div>
    </a-modal>
  </div>
</div>
  `
const iconSelector=require('./components/icon-selector.js')
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
    'icon-selector':iconSelector
  },
  data () {
    return {
      name:'新桌面',
      icon:'bulb',
    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {

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
    handleCancel () {
      this.$emit('changeVisible', false)
    }

  }
  ,
  destroyed () {
  }
})
