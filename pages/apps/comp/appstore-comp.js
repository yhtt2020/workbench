const appstoreTpl = `
<div>
<a-tree ref="appstoreTree" :tree-data="appstoreList" :block-node="true" show-icon  :selected-keys="selectedValues"
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
  props:{
  },
  data () {
    return {
      selectedValues:[],
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
    window.$trees.push({
      name:'appstore',
      comp:this
    })
  },
  methods: {
    onSelect (selectedKeys, info) {
      window.tab = selectedKeys[0]
      this.$router.push({path:'/appstore',query: { listId: selectedKeys[0]}})
      resetOtherTree('appstore',selectedKeys)
      this.$emit('get-tab', window.tab)
    }

  }
})
