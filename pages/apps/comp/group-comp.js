const groupTpl = `
<div>
  <a-tree :tree-data="groupLists" :block-node="true" show-icon :selected-keys="selectedValues" @select="onSelect">
    <a-avatar class="tree-icon" slot="folder-text" shape="square" src="../../icons/svg/foldertext.svg"></a-avatar>
    <a-avatar slot="folder" shape="square" class="tree-icon" src="../../icons/svg/team.svg"></a-avatar>
    <a-avatar slot="list-icon" shape="square" class="tree-icon" src="../../icons/svg/plan.svg"></a-avatar>
    <a-avatar slot="group-icon" shape="square" class="tree-icon" src="../../icons/svg/team.svg"></a-avatar>
    <template slot="custom" slot-scope="item">
      <a-avatar shape="square" class="tree-icon" :src="item.logo"></a-avatar>
    </template>
    <template #title="{ key: treeKey, title }">
      <a-dropdown :trigger="['contextmenu']" @visibleChange="checkMenuDisable($event,treeKey)">
        <span @dragenter.prevent="dragEnter($event)" @dragleave.prevent="dragLeave($event)"
        @dragover.prevent="allowDrop($event,treeKey)" @drop.prevent="drop($event,treeKey)">{{ title }}</span>
        <template #overlay>
          <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
            <a-menu-item key="createList" :disabled="disableCreate"><a-icon type="plus-square"></a-icon>创建云端团队导航</a-menu-item>
            <a-menu-item key="renameList" :disabled="disableRename"><a-icon type="edit"></a-icon> 重命名云端团队导航</a-menu-item>
            <a-menu-item key="deleteList" :disabled="disableDelete"><a-icon type="delete"></a-icon> 删除云端团队导航</a-menu-item>
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

const { appList, treeUtil } = require('../../util/model/appListModel.js')
const groupModel = require('../../util/model/groupModel')
const getNameInputValue = function () {
  return document.getElementById('nameInput').value
}
Vue.component('group-comp', {
  name: 'group-comp',
  template: groupTpl,
  data () {
    return {
      //创建列表的弹窗可见
      createListVisible: false,
      createTitle: '',//创建列表的标题
      //下拉菜单控制属性
      disableCreate: false,
      disableCreateChild: false,
      disableCopy: false,
      disableRename: false,
      disableDelete: false,
      selectedValues: [],
      handleNameInput: () => {},
      groupLists: [
        {
          title: '团队列表',
          key: 'group',
          slots: {
            icon: 'folder-text'
          },
          children: []
        }
      ]
    }
  },
  async mounted () {
    window.$trees.push({
      name: 'group',
      comp: this
    })
    await this.refreshNavs()
  },
  computed: {
    // hideD(treeKey) {
    //   console.log(treeKey, 'treeKeytreeKey')
    //   return true
    // }
  },
  methods: {
    async refreshNavs() {
      await this.$store.dispatch('getMyGroups')
      if(this.groupLists[0].children.length > 0 ) {
        this.groupLists[0].children = []
        this.groupLists[0].children= groupModel.convertTreeNode(this.$store.getters.getMyGroups, 'app_group_list', 'custom', 'list-icon')
      } else {
        this.groupLists[0].children = groupModel.convertTreeNode(this.$store.getters.getMyGroups, 'app_group_list', 'custom', 'list-icon')
      }
    },
    async onSelect (selectedKeys, info) {
      console.log(selectedKeys, 'selectedKeys__~')
      if(selectedKeys[0] === 'group') {
        this.$router.push({ name: 'groupList', query: {t: Date.now()}})
        resetOtherTree('group', selectedKeys)
      } else if (selectedKeys[0].startsWith('L1')) {
        const id = Number(selectedKeys[0].split('-')[1])
        this.$router.push({ name: 'groupNavs', query: {id: id, t: Date.now()}})
        resetOtherTree('group', selectedKeys)
      } else if (selectedKeys[0].startsWith('L2')) {
        //点二级菜单的时候先需要去获取一级
        await this.$store.dispatch('getAppGroupNavs', Number(selectedKeys[0].split('-')[1]))
        const jump = Number(selectedKeys[0].split('-')[2])
        let type = Number
        let name = '默认列表'
        let summary = '描述'
        let group_id = Number(selectedKeys[0].split('-')[1])
        this.$store.getters.getAppGroupNavs.forEach((item) => {
          if (item.id === jump) {
            type = item.type
            name = item.name
            summary = item.summary
          }
        })
        this.$router.push({ name: 'group', query: { groupId: group_id, listId: jump, t: Date.now(), type: type, name: name, summary: summary } })
        resetOtherTree('group', selectedKeys)
      }
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
      const result = groupModel.findTreeNode(this.groupLists[0].children, treeKey)
      this.$confirm({
        title: `确认删除列表： ${result.title} ？`,
        content: `删除后无法撤销，请谨慎操作！`,
        okText: '确认删除，不后悔',
        cancelText: '保留',
        async onOk() {
          const data = {
            ids: [Number(treeKey.split('-')[2])],
            group_id: Number(treeKey.split('-')[1])
          }
          const result = await that.$store.dispatch('deleteAppGroupNav', data)
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
    handleMenuRenameList (treeKey) {
      const result = groupModel.findTreeNode(this.groupLists[0].children, treeKey)
      this.createList(async ()=> {
        const name = getNameInputValue()
        if (!!!name) {
          appVue.$message.error({ content: '请输入列表名称。' })
          return
        }
        const data =  {
          id: Number(treeKey.split('-')[2]),
          name: name,
          summary: '描述',
          group_id: Number(treeKey.split('-')[1])
        }
        const result = await this.$store.dispatch('updateAppGroupNav', data)
        if(result.code === 1000) {
          this.createListVisible = false
          await this.refreshNavs()
          appVue.$message.success({ content: '重命名列表成功' })
        } else {
          appVue.$message.error({ content: '重命名列表失败!' })
        }
      }, result.title, '重命名')
    },
    /**
     * 处理菜单的创建列表事件
     */
    handleMenuCreateList (treeKey) {
      this.createList(
        async () => {
          let list = {
            name: getNameInputValue(),
            summary: '描述',
            group_id: Number(treeKey.split('-')[1])
          }
          if (!!!list.name) {
            appVue.$message.error({ content: '请输入列表名称。' })
            return
          }
          const result = await this.$store.dispatch('addAppGroupNav', list)
          if(result.code === 1000) {
            this.createListVisible = false
            await this.refreshNavs()
            appVue.$message.success({ content: '添加列表成功。' })
          } else {
            appVue.$message.error({ content: '添加列表失败。' })
          }
        },
        '请输入云端团队导航名',
        '云端'
      )
    },

    /**
     * 检查菜单的可用性   右键创建的可用性
     * @param visible
     * @param treeKey
     */
    checkMenuDisable (visible, treeKey) {
      if(treeKey.startsWith('group')) {
          this.disableCreate = true
          this.disableRename = true
          this.disableDelete = true
      } else if (treeKey.startsWith('L2')) {
          this.disableCreate = true
          this.disableRename = false
          this.disableDelete = false
      } else if(treeKey.startsWith('L1')) {
        this.disableCreate = false
        this.disableRename = true
        this.disableDelete = true
      }
    },

    // 拖拽元素放置到了目的地元素上面
    allowDrop(e, key) {
      console.log(key, '拖拽key～～～')
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
      if (key === 'group' || key.startsWith('L1') || Number(key.split('-')[2]) === window.$listId) {
        e.preventDefault()
        appVue.$message.error({ content: '注意移动目标!' })
      } else {
        let ids = []
        window.$selectedApps.forEach(e => {
          ids.push(Number(e))
        })
        const data  = {
          ids,
          list_id: Number(key.split('-')[2]),
        }
        const result = await this.$store.dispatch('updateGroupNavApps', data)
        if(result.code === 1000){
          window.$selectedApps = []
          window.$removeApps()
          appVue.$message.success({ content: '移动应用成功。' })
        } else {
          console.log(result)
          appVue.$message.success({ content: '移动应用失败！' })
        }
      }
    },
  }
})
