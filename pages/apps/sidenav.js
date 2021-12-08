const tpl = `
<div style="padding: 15px;">
  <div class="logo">
    <img src="../../icons/svg/discover.svg" style="width: 2em">
    网址导航
  </div>
  <template>
    <h4 style="color: #999;font-size: 12px">网络导航</h4>
    <appstore-comp @get-tab="getTab"></appstore-comp>
    <h4 style="color: #999;font-size: 12px">本地导航</h4>
    <local-comp @get-tab="getTab"></local-comp>
    <h4 style="color: #999;font-size: 12px">云端导航</h4>

    <cloud-comp @get-tab="getTab"></cloud-comp>
    <!--        <a-tree style="padding: 10px" :tree-data="[cloudLists]" :block-node="true" show-icon default-expand-all :default-selected-keys="['local']"-->
    <!--        @select="onSelect"-->
    <!--        >-->
    <!--           <a-avatar slot="team" shape="square" style="width: 1.3em;height: auto " src="../../icons/svg/team.svg"></a-avatar>-->
    <!--   <a-avatar slot="cloud" shape="square" style="width: 1.3em;height: auto " src="../../icons/svg/cloud.svg"></a-avatar>-->

    <!--          <a-icon slot="lock" type="lock"> </a-icon>-->
    <!--          <a-icon slot="star" style="font-size: 18px" type="star"> </a-icon>-->
    <!--          <a-avatar slot="list-icon" src="../../icons/svg/collection"></a-avatar>-->

    <!--          <template slot="custom" slot-scope="{ selected }">-->
    <!--            <a-icon :type="selected ? 'frown' : 'frown-o'" ></a-icon>-->
    <!--          </template>-->
    <!--          <template #title="{ key: treeKey, title }">-->
    <!--      <a-dropdown :trigger="['contextmenu']" @visibleChange="checkMenuDisable($event,treeKey)">-->
    <!--        <span>{{ title }}</span>-->
    <!--        <template #overlay>-->
    <!--          <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">-->
    <!--            <a-menu-item key="createList" :disabled="disableCreate"><a-icon type="plus-square"></a-icon>  创建列表</a-menu-item>-->
    <!--            <a-menu-item key="createChildList" :disabled="disableCreateChild"><a-icon type="plus-circle"></a-icon>  创建子列表</a-menu-item>-->
    <!--            <a-menu-item key="copyList" :disabled="disableCopy"><a-icon type="copy"></a-icon>  复制列表</a-menu-item>-->
    <!--            <a-menu-item key="renameList" :disabled="disableRename"><a-icon type="edit"></a-icon> 重命名列表</a-menu-item>-->
    <!--            <a-menu-item key="deleteList" :disabled="disableDelete"><a-icon type="delete"></a-icon> 删除列表</a-menu-item>-->
    <!--          </a-menu>-->
    <!--        </template>-->
    <!--      </a-dropdown>-->
    <!--    </template>-->
    <!--        </a-tree>-->
    <h4 style="color: #999;font-size: 12px">团队导航</h4>
    <group-comp @get-tab="getTab"></group-comp>
  </template>
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

const getNameInputValue=function (){
  return document.getElementById('nameInput').value
}
require('./comp/local-comp.js')
require('./comp/appstore-comp.js')
require('./comp/group-comp.js')
require('./comp/cloud-comp.js')
Vue.component('sidenav', {
  name: 'sidenav',
  component:{localComp:"local-comp",appstoreComp:"appstore-comp",groupComp:"group-comp"},
  data () {
    return {
      current: ['myapp'],
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



      cloudLists:{
        title:'云端导航',
        key:'cloud',
        slots:{
          icon:'cloud'
        },
        children:[]
      }
    }
  },
  template: tpl,
  mounted(){

  },
  methods: {
    getTab(){
      this.$emit('get-tab', window.tab)
    },
    titleClick (e) {
      console.log('titleClick', e)
    },

    onSelect (selectedKeys, info) {
      window.tab = selectedKeys[0]
      this.$emit('get-tab', window.tab)
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

    },
    /**
     * 处理菜单的重命名列表事件
     * @param treeKey
     */
    handleMenuRenameList(treeKey){
      let that=this
      },
    /**
     * 处理菜单的创建列表事件
     */
    handleMenuCreateList(treeKey){
      let that=this
     if(this.isType(treeKey,'cloud')){
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
