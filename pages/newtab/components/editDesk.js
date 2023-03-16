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
      <a-input :value="desk.name" default-value="新桌面" @change="changeName">
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
    },
    deskId:Number//如果有桌面id为编辑
  },
  components: {

  },
  data () {
    return {
      icons: [
        'bulb','account-book', 'alert', 'api', 'appstore', 'audio', 'bank', 'bell', 'book', 'bug',  'calculator', 'build', 'calendar', 'camera', 'car'
      ]
    }
  },
  computed: {
    desk:()=>{
      console.log(this.deskId)
      if(this.deskId===-1){
        return {
          id:-1,
          name:'新桌面',
          icon:'bulb',
        }
      }else{
        return {
          id:111,
          name:'222xx',
          icon:'333'
        }
      }

    }
  },
  mounted () {
    console.log('挂载')
    console.log(this.deskId)
  },
  methods: {
    isSelectedIcon(icon){
      console.log(icon)
      console.log(this.desk.icon)
      return icon===this.desk.icon
    },
    visibleChange () {
      console.log('change')
      this.$emit('changeVisible', !this.visible)
    },
    changeName(e){
      this.desk.name=e.target.value
    },
    handleOk () {
      if(!!!this.desk.icon){
        this.$message.error('必须选择图标')
        return
      }
      if(!!!this.desk.name){
        this.$message.error('必须输入桌面名称')
        return
      }
      this.visibleChange()
      this.$emit('add-desk',{icon:this.desk.icon,name:this.desk.name})
    },
    selectIcon(icon){
      console.log('set')
      this.desk.icon=icon
    },
    handleCancel () {
      this.$emit('changeVisible', false)
    }

  }
  ,
  destroyed () {
  }
})
