const tpl = `
<div>
<div class="logo">
<img src="../../icons/apps.svg" style="width: 1.2em">
网址导航
</div>
      <template >
        <a-tree style="padding: 10px" :tree-data="[myAppsLists]" :block-node="true" show-icon default-expand-all :default-selected-keys="['local']"
        @select="onSelect"
        >
          <a-icon slot="user" type="user" > </a-icon>
          <a-icon slot="appstore" type="appstore" > </a-icon>
          <a-icon slot="meh" type="smile-o"> </a-icon>
          <a-icon slot="global" type="global"> </a-icon>
          <a-icon slot="team" type="team"> </a-icon>
          <a-icon slot="lock" type="lock"> </a-icon>
          <a-icon slot="star" type="star"> </a-icon>
          <a-icon slot="cloud" type="cloud"> </a-icon>
          <a-icon slot="list-icon" type="file-text"> </a-icon>

          <template slot="custom" slot-scope="{ selected }">
            <a-icon :type="selected ? 'frown' : 'frown-o'" ></a-icon>
          </template>
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
      </template>
      <template>
        <div>
          <a-modal v-model="createListVisible" ok-text="创建" cancel-text="取消"  :title="'创建'+createTitle+'列表'" @ok="handleNameInput">
            <p>输入列表名称</p>
            <p><a-input id="nameInput" name="name" ></a-input></p>
          </a-modal>
        </div>
      </template>




</div>

`
const {appList,treeUtil}=require('../util/appList.js')
const treeData = [
  {
    title: '本地导航',
    key: 'myapp',
    slots: {
      icon: 'star',
    },
    children: [
      {
        key:'myapp_1',
        title: '开发专用'
      },
      {
        key:'myapp_2',
        title: '视频剪辑'
      },
      {
        key:'myapp_3',
        title: '12大框架'
      }
    ]
  }, {
    title: '个人云导航',
    key: 'cloud',
    slots: {
      icon: 'cloud',
    },
    children: [
      {
        key:'cloud_1',
        title: '开发专用'
      },
      {
        key:'cloud_2',
        title: '视频剪辑'
      },
      {
        key:'cloud_3',
        title: '12大框架'
      }
    ]
  }, {
    title: '网络导航',
    key: 'appstore',
    slots: {
      icon: 'appstore',
    },
    children: [
      { title: '程序员', key: 'appstore_developer' },
      { title: '视频后期', key: 'appstore_video' },
      { title: '前端', key: 'appstore_frontend' },
    ],
  }, {
    title: '团队导航',
    key: 'group',

    slots: {
      icon: 'team',
    },
    children: [
          { title: '人人都是产品经理', key: 'group_1' ,slots: { icon: 'global' }},
          { title: '少数派Plus', key: 'group_2' ,slots: { icon: 'global' }},
          { title: '产研部', key: 'group_3' ,slots: { icon: 'lock' }},
          { title: '销售部', key: 'group_4',slots: { icon: 'lock' } },
    ],
  },
]
const getNameInputValue=function (){
  return document.getElementById('nameInput').value
}
Vue.component('sidenav', {
  name: 'sidenav',
  data () {
    return {
      current: ['myapp'],
      treeData,
      //创建列表的弹窗可见
      createListVisible:false,
      createTitle:'',//创建列表的标题
      //下拉菜单控制属性
      disableCreate:false,
      disableCreateChild:false,
      disableCopy:false,
      disableRename:false,
      disableDelete:false,
      nameValue:'',
      handleNameInput :()=>{},
      //下面是数据暂存属性
      myAppsLists:{
        title:'本地导航',
        key:'myapp',
        slots:{
          icon:'star'
        },
        children:[]
      }
    }
  },
  template: tpl,
  mounted(){
    let that=this
    appList.list().then(data=>{
      data.forEach((item)=>{
        that.myAppsLists.children.push(appList.convertTreeNode(item))
      })
    })



  },
  methods: {

    titleClick (e) {
      console.log('titleClick', e)
    },

    onSelect (selectedKeys, info) {
      window.tab = selectedKeys[0]
      this.$emit('gettab', window.tab)
    },
    onCheck (checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
    },
    createList(callback=()=>{},value="",title=""){
      this.createTitle=title
      this.createListVisible=true
      this.handleNameInput=callback
      appVue.$nextTick(()=>{
        document.getElementById('nameInput').value=value
      })
    },
    onContextMenuClick(treeKey, menuKey){
        if(menuKey==='createList'){
          //创建列表菜单
          this.handleMenuCreateList(treeKey)
        }else if(menuKey==='renameList'){
          this.handleMenuRenameList(treeKey)
        }else if(menuKey==='deleteList'){
          this.handleMenuDeleteList(treeKey)
        }
    },
    handleMenuDeleteList(treeKey){
      let that=this
      if(this.isType(treeKey,'myapp')) {
        let {list,key}=treeUtil.findTreeNode(treeKey,that.myAppsLists.children)
        console.log(list)
          appList.delete(Number(appList.getIdFromTreeKey(treeKey))).then(()=>{
            that.$message.success({content:"删除成功。"})
            that.myAppsLists.children.splice(key,1)
          })
      }
    },
    /**
     * 处理菜单的重命名列表事件
     * @param treeKey
     */
    handleMenuRenameList(treeKey){
      let that=this
      if(this.isType(treeKey,'myapp')) {
        const {list}=treeUtil.findTreeNode(treeKey,that.myAppsLists.children)
        that.createList(function () {
          const newName=getNameInputValue()
          appList.put({id:Number(appList.getIdFromTreeKey(treeKey)),name:newName,updateTime:Date.now()}).then(()=>{
            list.title=newName
            that.$message.success({content:"重命名成功。"})
            that.createListVisible=false
          }).catch(err=>console.log(err))
        },list.title,'重命名')
        }
      },
    /**
     * 处理菜单的创建列表事件
     */
    handleMenuCreateList(treeKey){
      let that=this
      if(this.isType(treeKey,'myapp')){
        this.createList(function (){
          let name=getNameInputValue()
          let list={}
          list.name=name
          list.createTime=Date.now()
          list.updateTime=Date.now()
          list.order=0
          list.summary=''
          list.appsCount=0
          list.parentId=0
          if(!!!list.name){
            appVue.$message.error({content:"请输入列表名称。"})
            return
          }
          appList.add(list).then(data=>{
            appVue.$message.success({content:'添加列表成功。'})
            console.log(list)
            that.myAppsLists.children.push(appList.convertTreeNode(list))
            that.createListVisible=false
          },()=>{
            appVue.$message.error({content:'添加列表失败。'})
          }).catch(err=>{
            console.log(err)
          })
        },'本地列表','本地')
      }else if(this.isType(treeKey,'cloud')){
        this.createList(function (){
          alert(getNameInputValue())
        },'云端列表','云端')
      }else if(this.isType(treeKey,'appstore')){
        //如果是网络导航，则不处理创建事件，防止恶意提交
      }else if(this.isType(treeKey,'group')){
        this.createList(function (){
          alert(getNameInputValue())
        },'团队列表','团队')
      }
    },
    isType(treeKey,type){
      return  treeKey===type || treeKey.startsWith(type+'_')
    },

    /**
     * 检查菜单的可用性
     * @param visible
     * @param treeKey
     */
    checkMenuDisable(visible,treeKey){
      this.disableCreate=false
      this.disableCreateChild=false
      this.disableCopy=false
      this.disableRename=false
      this.disableDelete=false
      if(visible===true){//在创建菜单的时候对菜单的可用性进行调整
        if(this.isType(treeKey,'appstore') ){
          this.disableCreate=true
          this.disableCreateChild=true
          this.disableCopy=true
          this.disableRename=true
          this.disableDelete=true
        }else{
        }
      }
      if(treeKey==='myapp'){
        this.disableCreateChild=true
        this.disableCopy=true
        this.disableRename=true
        this.disableDelete=true
      }
    }
  }
})
