const cloudTpl = `
<div>
  <a-tree ref="cloudTree" :tree-data="myAppsLists" :block-node="true" show-icon :selected-keys="selectedValues" @select="onSelect">
    <a-avatar slot="cloud" shape="square" style="width: 1.3em;height: auto " src="../../icons/svg/cloud.svg"></a-avatar>
    <a-avatar slot="folder" shape="square" class="tree-icon" src="../../icons/svg/folder.svg"></a-avatar>
    <a-avatar slot="list-icon" shape="square" class="tree-icon" src="../../icons/svg/plan.svg"></a-avatar>
    <template #title="{ key: treeKey, title }">
      <a-dropdown :trigger="['contextmenu']" @visibleChange="checkMenuDisable($event,treeKey)">
        <span @dragenter.prevent="dragEnter($event)" @dragleave.prevent="dragLeave($event)"
          @dragover.prevent="allowDrop($event,treeKey)" @drop.prevent="drop($event,treeKey)">{{ title }}</span>
        <template #overlay>
          <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
            <a-menu-item key="createList" :disabled="disableCreate">
              <a-icon type="plus-square"></a-icon> 创建列表
            </a-menu-item>
            <!--            <a-menu-item key="createChildList" :disabled="disableCreateChild"><a-icon type="plus-circle"></a-icon>  创建子列表</a-menu-item>-->
            <!--            <a-menu-item key="copyList" :disabled="disableCopy"><a-icon type="copy"></a-icon>  复制列表</a-menu-item>-->
            <a-menu-item key="renameList" :disabled="disableRename">
              <a-icon type="edit"></a-icon> 重命名列表
            </a-menu-item>
            <a-menu-item key="deleteList" :disabled="disableDelete">
              <a-icon type="delete"></a-icon> 删除列表
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-tree>
  <template>
    <div>
      <a-modal v-model="createListVisible" ok-text="创建" cancel-text="取消" :title="createTitle" @ok="handleNameInput">
        <p>输入列表名称</p>
        <p>
          <a-input id="nameInput" name="name"></a-input>
        </p>
      </a-modal>
    </div>
  </template>
</div>
  `
const { appListModel, treeUtil } = require('../../util/model/appListModel.js')
const getNameInputValue = function () {
  return document.getElementById('nameInput').value
}
Vue.component('cloud-comp', {
  name: 'cloud-comp',
  template: cloudTpl,
  props: {},
  data() {
    return {
      //创建列表的弹窗可见
      createListVisible: false,
      createTitle: '', //创建列表的标题
      selectedValues: [],
      //下拉菜单控制属性
      disableCreate: false,
      disableCreateChild: false,
      disableCopy: false,
      disableRename: false,
      disableDelete: false,
      handleNameInput: () => {},
      myAppsLists: [
        {
          title: '云端列表',
          key: 'cloud',
          slots: {
            icon: 'cloud',
          },
          children: [],
        },
      ],
    }
  },
  async mounted() {
    window.$trees.push({
      name: 'cloud',
      comp: this,
    })
    await this.refreshNavs()
    console.log(this.myAppsLists)
  },
  methods: {
    async refreshNavs() {
      await this.$store.dispatch('getAppUserNavs')
      if(this.myAppsLists[0].children.length > 0 ) {
        this.myAppsLists[0].children = []
        this.$store.getters.getAppUserNavs.forEach((element) => {
          this.myAppsLists[0].children.push(appListModel.convertTreeNode(element))
        })
      } else {
        this.$store.getters.getAppUserNavs.forEach((element) => {
          this.myAppsLists[0].children.push(appListModel.convertTreeNode(element))
        })
      }
    },
    onSelect(selectedKeys, info) {
      console.log(selectedKeys, 'sssss')
      console.log(info, 'info')
      let jump = 0
      if (isNaN(Number(selectedKeys[0]))) {
        jump = 0
      } else {
        jump = Number(selectedKeys[0])
      }
      //处理nav的type, 缩略图还是列表也远端处理了, 到时候选择相关的展现形式也要发起一个请求链接
      let type = Number
      let name = '默认列表'
      this.$store.getters.getAppUserNavs.forEach((item) => {
        if (item.id === selectedKeys[0]) {
          type = item.type
          name = item.name
        }
      })
      this.$router.push({ name: 'cloud', query: { listId: jump, t: Date.now(), type: type, name: name } })
      resetOtherTree('cloud', selectedKeys)
    },
    onContextMenuClick(treeKey, menuKey) {
      if (menuKey === 'createList') {
        //创建列表菜单
        this.handleMenuCreateList(treeKey)
      } else if (menuKey === 'renameList') {
        this.handleMenuRenameList(treeKey)
      } else if (menuKey === 'deleteList') {
        this.handleMenuDeleteList(treeKey)
      }
    },
    createList(callback = () => {}, value = '', title = '') {
      this.createTitle = title
      this.createListVisible = true
      this.handleNameInput = callback
      appVue.$nextTick(() => {
        document.getElementById('nameInput').value = value
      })
    },
    handleMenuDeleteList(treeKey) {
      let that = this
      const { list } = treeUtil.findTreeNode(treeKey, this.myAppsLists[0].children)
      this.$confirm({
        title: `确认删除列表： ${list.title} ？`,
        content: `删除后无法撤销，请谨慎操作！`,
        okText: '确认删除，不后悔',
        cancelText: '保留',
        async onOk() {
          const result = await that.$store.dispatch('deleteAppUserNav', { ids: [treeKey] })
          if(result.code === 1000) {
            that.createListVisible = false
            await that.refreshNavs()
            appVue.$message.success({ content: '列表删除成功' })
          } else {
            appVue.$message.error({ content: '列表删除失败!' })
          }
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    /**
     * 处理菜单的重命名列表事件
     * @param treeKey
     */
    handleMenuRenameList(treeKey) {
      console.log(treeKey)
      const { list } = treeUtil.findTreeNode(treeKey, this.myAppsLists[0].children)
      this.createList(async ()=> {
        const name = getNameInputValue()
        if (!!!name) {
          appVue.$message.error({ content: '请输入列表名称。' })
          return
        }
        const data =  {
          id: treeKey,
          name: name,
          summary: '云端导航列表的描述'
        }
        const result = await this.$store.dispatch('updateAppUserNav', data)
        if(result.code === 1000) {
          this.createListVisible = false
          await this.refreshNavs()
          appVue.$message.success({ content: '重命名列表成功' })
        } else {
          appVue.$message.error({ content: '重命名列表失败!' })
        }
      }, list.title, '重命名')
    },
    /**
     * 处理菜单的创建列表事件
     */
    handleMenuCreateList(treeKey) {
      this.createList(
        async () => {
          let list = {
            name: getNameInputValue(),
            summary: '云端导航列表的描述'
          }
          if (!!!list.name) {
            appVue.$message.error({ content: '请输入列表名称。' })
            return
          }
          const result = await this.$store.dispatch('addAppUserNav', list)
          if(result.code === 1000) {
            this.createListVisible = false
            await this.refreshNavs()
            appVue.$message.success({ content: '添加列表成功。' })
          } else {
            appVue.$message.error({ content: '添加列表失败。' })
          }
        },
        '👉请输入云端导航名',
        '云端'
      )
    },

    /**
     * 检查菜单的可用性
     * @param visible
     * @param treeKey
     */
    checkMenuDisable(visible, treeKey) {
      this.disableCreate = false
      this.disableCreateChild = false
      this.disableCopy = false
      this.disableRename = false
      this.disableDelete = false
      if (visible === true) {
        //在创建菜单的时候对菜单的可用性进行调整
        if (treeKey === 'myapp') {
          this.disableCreateChild = true
          this.disableCopy = true
          this.disableRename = true
          this.disableDelete = true
        }
      }
    },
    // 拖拽元素放置到了目的地元素上面
    allowDrop(e, key) {
      if (key === 'myapp') {
        key = 0
      }
      key = Number(key)
      if (key === window.$listId) {
        //todo 阻止放下
      }
    },
    dragEnter(e) {
      console.log('enter')
      console.log(e)
      e.target.classList.add('canDrag')
    },
    dragLeave(e) {
      console.log('leave')
      console.log(e)
      e.target.classList.remove('canDrag')
    },

    // 拖拽元素结束了操作
    async drop(e, key) {
      e.target.classList.remove('canDrag')
      if (key === 'myapp') {
        key = 0
      }
      let ids = []
      window.$selectedApps.forEach(e => {
        ids.push(Number(e))
      })
      const data  = {
        ids,
        list_id: Number(key),
      }
      const result = await this.$store.dispatch('updateUserNavApps', data)
      if(result.code === 1000){
        window.$selectedApps = []
        window.$removeApps()
        appVue.$message.success({ content: '移动应用成功。' })
      } else {
        appVue.$message.success({ content: '移动应用失败！' })
      }
    },
  },
})
