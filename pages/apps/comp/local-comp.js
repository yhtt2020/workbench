const localTpl = `
<div>
<a-tree ref="myappTree" :tree-data="myAppsLists" :block-node="true" show-icon :selected-keys="selectedValues"
        @select="onSelect" >
            <a-avatar slot="folder" shape="square" class="tree-icon" src="../../icons/svg/folder.svg"></a-avatar>
          <a-avatar slot="list-icon" shape="square" class="tree-icon" src="../../icons/svg/plan.svg"></a-avatar>
          <template #title="{ key: treeKey, title }">
      <a-dropdown :trigger="['contextmenu']" @visibleChange="checkMenuDisable($event,treeKey)">
        <span>{{ title }}</span>
        <template #overlay>
          <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
            <a-menu-item key="createList" :disabled="disableCreate"><a-icon type="plus-square"></a-icon>  创建列表</a-menu-item>
            <a-menu-item key="createChildList" :disabled="disableCreateChild"><a-icon type="plus-circle"></a-icon>  创建子列表</a-menu-item>
            <a-menu-item key="copyList" :disabled="disableCopy"><a-icon type="copy"></a-icon>  复制列表</a-menu-item>
            <a-menu-item key="renameList" :disabled="disableRename"><a-icon type="edit"></a-icon> 重命名列表</a-menu-item>
            <a-menu-item key="deleteList" :disabled="disableDelete"><a-icon type="delete"></a-icon> 删除列表</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
        </a-tree>
          <template>
        <div>
          <a-modal v-model="createListVisible" ok-text="创建" cancel-text="取消"  :title="createTitle" @ok="handleNameInput">
            <p>输入列表名称</p>
            <p><a-input id="nameInput" name="name" ></a-input></p>
          </a-modal>
        </div>
      </template>
</div>
  `
const { appList, treeUtil } = require('../../util/appList.js')
const getNameInputValue = function () {
  return document.getElementById('nameInput').value
}
Vue.component('local-comp', {
  name: 'local-comp',
  template: localTpl,
  props:{

  },
  data () {
    return {
      //创建列表的弹窗可见
      createListVisible: false,
      createTitle: '',//创建列表的标题
      selectedValues:[],
      //下拉菜单控制属性
      disableCreate: false,
      disableCreateChild: false,
      disableCopy: false,
      disableRename: false,
      disableDelete: false,
      handleNameInput: () => {},
      myAppsLists: [
        {
          title: '本地列表',
          key: 'myapp',
          slots: {
            icon: 'folder'
          },
          children: []
        }]
    }
  }, mounted () {
    let that = this
    window.$trees.push({
      name:'myapp',
      comp:this
    })
    appList.list().then(data => {
      data.forEach((item) => {
        that.myAppsLists[0].children.push(appList.convertTreeNode(item))
      })
    })
  },
  methods: {
    onSelect (selectedKeys, info) {
      let jump=0
      console.log(selectedKeys)
      if(isNaN(Number(selectedKeys[0]))){
        console.log(selectedKeys)
        jump=0
      }else{
        jump=Number(selectedKeys[0])
      }
      console.log(jump)
      this.$router.push({path:'/myapp',query: { listId: jump}})
      resetOtherTree('myapp',selectedKeys)
    },
    onContextMenuClick (treeKey, menuKey) {
      if (menuKey === 'createList') {
        //创建列表菜单
        this.handleMenuCreateList(treeKey)
      } else if (menuKey === 'renameList') {
        this.handleMenuRenameList(treeKey)
      } else if (menuKey === 'deleteList') {
        this.handleMenuDeleteList(treeKey)
      }
    },
    createList (callback = () => {}, value = '', title = '') {
      this.createTitle = title
      this.createListVisible = true
      this.handleNameInput = callback
      appVue.$nextTick(() => {
        document.getElementById('nameInput').value = value
      })
    },
    handleMenuDeleteList (treeKey) {
      let that = this
      let { list, key } = treeUtil.findTreeNode(treeKey, that.myAppsLists[0].children)
      console.log(list)
      this.$confirm({
        title: `确认删除列表： ${list.title} ？`,
        content: `删除后无法撤销，请谨慎操作！`,
        okText: '确认删除，不后悔',
        cancelText: '保留',
        onOk () {
          appList.delete(Number(appList.getIdFromTreeKey(treeKey))).then(() => {
            that.$message.success({ content: '删除成功。' })
            that.myAppsLists[0].children.splice(key, 1)
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })

    },
    /**
     * 处理菜单的重命名列表事件
     * @param treeKey
     */
    handleMenuRenameList (treeKey) {
      let that = this
      const { list } = treeUtil.findTreeNode(treeKey, that.myAppsLists[0].children)
      that.createList(function () {
        const newName = getNameInputValue()
        appList.put({
          id: Number(appList.getIdFromTreeKey(treeKey)),
          name: newName,
          updateTime: Date.now()
        }).then(() => {
          list.title = newName
          that.$message.success({ content: '重命名成功。' })
          that.createListVisible = false
        }).catch(err => console.log(err))
      }, list.title, '重命名')

    },
    /**
     * 处理菜单的创建列表事件
     */
    handleMenuCreateList (treeKey) {
      let that = this
      this.createList(async function () {
        let name = getNameInputValue()
        let list = {}
        list.name = name
        list.createTime = Date.now()
        list.updateTime = Date.now()
        list.order = 0
        list.summary = ''
        list.appsCount = 0
        list.parentId = 0
        if (!!!list.name) {
          appVue.$message.error({ content: '请输入列表名称。' })
          return
        }
          appList.add(list).then(data => {
          appVue.$message.success({ content: '添加列表成功。' })
          that.myAppsLists[0].children.push(appList.convertTreeNode(list))
          that.createListVisible = false
          }, () => {
            appVue.$message.error({ content: '添加列表失败。' })

          }).catch(err => {
            console.log(err)
          })


      }, '本地列表', '本地')
    },

    /**
     * 检查菜单的可用性
     * @param visible
     * @param treeKey
     */
    checkMenuDisable (visible, treeKey) {
      this.disableCreate = false
      this.disableCreateChild = false
      this.disableCopy = false
      this.disableRename = false
      this.disableDelete = false
      if (visible === true) {//在创建菜单的时候对菜单的可用性进行调整
        if (treeKey === 'myapp') {
          this.disableCreateChild = true
          this.disableCopy = true
          this.disableRename = true
          this.disableDelete = true
        }
      }

    }
  }
})
