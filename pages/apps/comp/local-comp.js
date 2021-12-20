const localTpl = `
<div>
<a-tree ref="myappTree" :tree-data="myAppsLists" :block-node="true" show-icon :selected-keys="selectedValues"
        @select="onSelect" @dragenter.prevent="onDragEnter" draggable @mousedown.stop="" @drop="onDrop"
    >
            <a-avatar slot="folder" shape="square" class="tree-icon" src="../../icons/svg/folder.svg"></a-avatar>
          <a-avatar slot="list-icon" shape="square" class="tree-icon" src="../../icons/svg/plan.svg"></a-avatar>
          <template #title="{ key: treeKey, title }">
      <a-dropdown :trigger="['contextmenu']" @visibleChange="checkMenuDisable($event,treeKey)">
        <span @mousedown.stop="" @dragenter.prevent="dragEnter($event)" @dragleave.prevent="dragLeave($event)" @dragover.prevent="allowDrop($event,treeKey)" @drop.prevent="drop($event,treeKey)">{{ title }}</span>
        <template #overlay>
          <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
            <a-menu-item key="createList" :disabled="disableCreate"><a-icon type="plus-square"></a-icon>  创建列表</a-menu-item>
            <a-menu-item key="createChildList" :disabled="disableCreateChild"><a-icon type="plus-circle"></a-icon>  创建子列表</a-menu-item>
<!--            <a-menu-item key="copyList" :disabled="disableCopy"><a-icon type="copy"></a-icon>  复制列表</a-menu-item>-->
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
const { appListModel, treeUtil } = require('../../util/model/appListModel.js')
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
  },mounted () {
    window.$trees.push({
      name:'myapp',
      comp:this
    })
    this.loadData()
    // appListModel.list().then(data => {
    //   data.forEach((item) => {
    //     that.myAppsLists[0].children.push(appListModel.convertTreeNode(item))
    //   })
    // })
  },
  methods: {
    async loadData(){
      this.myAppsLists[0].children=await appListModel.list()
    },
    onSelect (selectedKeys, info) {
      let jump=0
      if(isNaN(Number(selectedKeys[0]))){
        jump=0
      }else{
        jump=Number(selectedKeys[0])
      }
      this.$router.push({name:'myapp',query: { listId: jump,t:Date.now()}})
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
      }else if(menuKey==="createChildList"){
        this.handleMenuCreateChildList(treeKey)
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
      let result = treeUtil.findTreeNode(treeKey, that.myAppsLists[0].children)
      if(result.key===-1){
        that.$message.error({content:'需要删除的列表不存在！'})
        return
      }
      this.$confirm({
        title: `确认删除列表： ${result.list.title} ？`,
        content: `删除后无法撤销，请谨慎操作！`,
        okText: '确认删除，不后悔',
        cancelText: '保留',
        onOk () {
          appListModel.delete(Number(appListModel.getIdFromTreeKey(treeKey))).then(() => {
            that.$message.success({ content: '删除成功。' })
            that.loadData()
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
        appListModel.put({
          id: Number(appListModel.getIdFromTreeKey(treeKey)),
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
        console.log(name)
        let list = {}
        list.name = name
        list.createTime = Date.now()
        list.updateTime = Date.now()
        list.order = 0
        list.summary = ''
        list.appsCount = 0
        list.parentId = 0
        list.type = 0
        if (!!!list.name) {
          appVue.$message.error({ content: '请输入列表名称。' })
          return
        }
          appListModel.add(list).then(data => {
          appVue.$message.success({ content: '添加列表成功。' })
          that.myAppsLists[0].children.push(appListModel.convertTreeNode(list))
          that.createListVisible = false
          }, () => {
            appVue.$message.error({ content: '添加列表失败。' })

          }).catch(err => {
            console.log(err)
          })


      }, '本地列表', '本地')
    },
    /**
     * 处理菜单的创建子列表事件
     */
     handleMenuCreateChildList (treeKey) {
      let that = this
      console.log(treeKey)
      this.createList(async function () {
        let name = getNameInputValue()
        let list = {}
        list.name = name
        list.createTime = Date.now()
        list.updateTime = Date.now()
        list.parentId=Number(treeKey)
        list.order = 0
        list.summary = ''
        list.appsCount = 0
        list.type = 0
        if (!!!list.name) {
          appVue.$message.error({ content: '请输入子列表名称。' })
          return
        }
        appListModel.add(list).then(async data => {
          appVue.$message.success({ content: '添加列表成功。' })
          that.myAppsLists[0].children=await appListModel.list()
          that.createListVisible = false
        }, () => {
          appVue.$message.error({ content: '添加列表失败。' })

        }).catch(err => {
          console.log(err)
        })


      }, '子列表', '在列表中创建子列表')
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
    },
    // 拖拽元素放置到了目的地元素上面
    allowDrop (e,key) {
      if(key==="myapp"){
        key=0
      }
      key=Number(key)
      if(key===window.$listId){
        //todo 阻止放下
      }
    },
    dragEnter(e){
      console.log('enter')
      console.log(e)
      e.target.classList.add('canDrag')
    },
    dragLeave(e){
      console.log('leave')
      e.target.classList.remove('canDrag')
      console.log(e)
    },

    // 拖拽元素结束了操作
    drop (e,key) {
      e.target.classList.remove('canDrag')
      if(key==="myapp"){
        key=0
      }
      key=Number(key)

      //1.找到全部的选中apps
      //2.将选中apps的listId改为新的id即可
      appListModel.moveAppsToList(window.$selectedApps,key).then(movedApps=>{
        if(movedApps.length>0){
          appVue.$message.success({content:"成功移动"+movedApps.length+"个应用"})
          window.$selectedApps=[]
          window.$removeApps()
        }
      })
    },
    onDragEnter(info) {
      // expandedKeys 需要受控时设置
      // this.expandedKeys = info.expandedKeys
    },
    //节点丢弃，移动列表
    onDrop(info) {
      //console.log('移动列表')
      //console.log(info);
      const dropKey = info.node.eventKey;
      const dragKey = info.dragNode.eventKey;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr);
          }
          if (item.children) {
            return loop(item.children, key, callback);
          }
        });
      };
      const data = [...this.myAppsLists];

      // Find dragObject
      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!info.dropToGap) {
        // 移动到一个列表上
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj);

        });
      } else if (
        (info.node.children || []).length > 0 && // 存在子元素
        info.node.expanded && // 展开
        dropPosition === 1 // 在在底部沟上
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj);
          //todo 还需要排个序
        });
      } else {
        let ar;
        let i;
        loop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }

      }
      //console.log(data)
      appListModel.saveTree(data[0])
      this.myAppsLists = data;
    },

  }
})
