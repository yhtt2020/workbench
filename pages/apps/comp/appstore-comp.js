const appstoreTpl = `
<div>
<a-tree :tree-data="appstoreList" :block-node="true" show-icon :default-selected-keys="['local']"
        @select="onSelect"
        >
           <a-icon slot="folder" type="folder"> </a-icon>
          <a-icon slot="list-icon" type="file-text"> </a-icon>
        </a-tree>

</div>
  `

Vue.component('appstore-comp', {
  name: 'appstore-comp',
  template: appstoreTpl,
  data () {
    return {
      //下拉菜单控制属性
      appstoreList: [
        {
          title: '在线导航',
          key: 'appstore',
          slots: {
            icon: 'folder'
          },
          children: []
        }]
    }
  }, mounted () {

  },
  methods: {
    onSelect (selectedKeys, info) {
      window.tab = selectedKeys[0]
      this.$emit('get-tab', window.tab)
    }

  }
})
