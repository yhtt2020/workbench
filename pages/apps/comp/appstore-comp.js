const appstoreTpl = `
<div>
<a-tree ref="appstoreTree" :tree-data="appstoreList" :block-node="true" show-icon  :selected-keys="selectedValues"
        @select="onSelect"
        >
          <a-avatar slot="folder" shape="square" class="tree-icon" src="../../icons/svg/internet.svg"></a-avatar>
          <a-avatar slot="list-icon" shape="square" class="tree-icon" src="../../icons/svg/plan.svg"></a-avatar>
          <a-avatar slot="track" shape="square" class="tree-icon" src="../../icons/svg/track.svg"></a-avatar>
        </a-tree>
</div>
  `

Vue.component('appstore-comp', {
  name: 'appstore-comp',
  template: appstoreTpl,
  props: {},
  data () {
    return {
      selectedValues: [],
      //下拉菜单控制属性
      appstoreList: [
        {
          title: '在线导航',
          key: 'appstore',
          slots: {
            icon: 'folder'
          },

        //   children: [{
        //     title: '办公导航',
        //     key: '123',
        //     slots: {
        //       icon: 'list-icon'
        //     }
        //   },
        //     {
        //       title: '程序员导航',
        //       key: '1223',
        //       slots: {
        //         icon: 'list-icon'
        //       }
        //     }
        // ]
        },
        {
          title: '应用导航',
          key: 'apps',
          slots: {
            icon: 'track'
          }
        }

  ]
  }
}, mounted()
{
  window.$trees.push({
    name: 'appstore',
    comp: this
  })
}
,
methods: {
  onSelect(selectedKeys, info)
  {
    window.tab = selectedKeys[0]
    this.$router.push({ path: '/appstore', query: { listId: selectedKeys[0] } })
    resetOtherTree('appstore', selectedKeys)
    this.$emit('get-tab', window.tab)
  }

}
})
