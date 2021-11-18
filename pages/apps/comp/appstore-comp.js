const appstoreTpl = `
<div>
<a-tree :tree-data="appstoreList" :block-node="true" show-icon :default-selected-keys="['local']"
        @select="onSelect"
        >
          <a-avatar slot="folder" shape="square" style="width: 1.2em;height: auto " src="../../icons/svg/internet.svg"></a-avatar>
          <a-avatar slot="list-icon" shape="square" style="width: 1.3em;height: auto " src="../../icons/svg/collection.svg"></a-avatar>
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
