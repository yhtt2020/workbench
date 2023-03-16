<template>
  <div v-if="sharing" style="padding: 2em;padding-left: 4em;padding-bottom: 0">
    <h2>请选择您要分享的小组，勾选后，在底部选择需要分享的方式。</h2>
    <p>对于不希望分享的小组，可以不做勾选。</p>
  </div>
  <div v-if="sharing" class="sharing-bottom-panel" style="position: fixed;bottom: 0;padding: 2em;width: 100vw">
    <a-row>
      <a-col :span="12">
        当前选中的组：
        <span style="color: grey" v-if="selectedGrids.length===0">请选择希望分享的组!</span>
        <a-tag v-for="grid in selectedGrids">
          {{grid.title}}
        </a-tag>
      </a-col>
      <a-col :span="7" class="text-right">
        分享到：<a-select v-model:value="shareTo"><a-select-option value="json">代码</a-select-option><a-select-option disabled value="com">社区</a-select-option></a-select>
      </a-col>
      <a-col :span="5" style="text-align: right">
        <a-button class="mr-5" type="primary" @click="ensureShare">分享</a-button>
        <a-button @click="this.toggleSharing()">放弃分享</a-button>
      </a-col>
    </a-row>
  </div>
  <div :class="{sharing:sharing}" >
    <vue-custom-scrollbar  @contextmenu.stop="showMenu(-1,undefined,'wrapper')" :settings="scrollbarSettings"
                           style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">

      <div style="width: auto;white-space: nowrap">
        <div style="width: 20em;display: inline-block" v-for="(grid,index) in grids">
          <h3 class="pointer" v-if="sharing" ><a-checkbox  v-model:checked="selectedGridIds[grid.id]">{{grid.title}}</a-checkbox></h3>
          <h3 class="pointer" v-else @click="showEditTitle(grid)">{{grid.title}}</h3>
          <div>
            <!--      <div style="min-height: 3em" @contextmenu.stop="showMenu(index)" :id="'board-'+board.id" class="grid"-->
            <!--           v-for="(board,index) in decks">-->
            <!--        <DeckItem :id="item.id" :item="item" v-for="item in board.children"></DeckItem>-->
            <!--      </div>-->

            <vuuri :key="key" :drag-enabled="editing" group-id="grid.id" :ref="'grid'+grid.id" item-key="id"  class="grid" @contextmenu.stop="showMenu(grid.id)"
                   :get-item-width="getIconSize" :get-item-height="getIconSize"
                   v-model="grid.children"  >
              <template #item="{ item }">
                <Widget @contextmenu.stop="showMenu(item.id,{item,grid},'item')"   :item="item"
                        :uniqueKey="String(item.id)"
                        :title="item.title"
                        :showDelete="true"
                        :resizable="true"
                >
                  <DeckItem :id="item.id" :item="item"></DeckItem>
                </Widget>
              </template>
            </vuuri>




            <!--      <Grid :value="grid" :ref="'grid'+grid.id" class="grid" :id="grid.id" @contextmenu.stop="showMenu(grid.id)" v-for="(grid,index) in grids" :draggable="true" :showDelete="true" :resizable="false">-->
            <!--        <Widget  :w-id="widget.id" v-for="widget in grid.children"-->
            <!--          :uniqueKey="widget.id"-->
            <!--          :title="widget.title"-->
            <!--          :showDelete="true"-->
            <!--          :resizable="true"-->
            <!--        >-->
            <!--          <DeckItem :id="widget.id" :item="widget"></DeckItem>-->
            <!--        </Widget>-->
            <!--      </Grid>-->
          </div>
        </div>
      </div>

    </vue-custom-scrollbar>
  </div>
  <a-drawer
    title="设置分享信息"
    placement="right"
    :closable="true"
    v-model:visible="shareMenuComVisible"
    @close="onClose"
  >
    <div class="line">
     分享标题： <a-input v-model:value="shareData.title">      </a-input>

    </div>
    <div class="line">
      分享描述：<a-input v-model:value="shareData.summary"></a-input>
    </div>
    <div class="line">
      <a-button>确定</a-button>
    </div>

  </a-drawer>
  <a-drawer
    title="导出方案"
    placement="right"
    :closable="true"
    v-model:visible="shareMenuJsonVisible"
    @close="onClose"
  >
    <div class="line">
      请将下方文本发送给其他用户，其他用户粘贴导入后即可导入成功。<br>
      注意：代码超过聊天工具可发送文本长度，可选择保存为文件，以发送文件方式分享。

    </div>
    <div class="line">
      方案代码：
    </div>
    <div class="line">
      <a-textarea ref="shareCode" style="width: 100%;height: 22em" :value="getShareJson()"></a-textarea>
    </div>
    <div class="line">
      <a-button class="mr-5" type="primary" @click="copyCode">复制分享代码</a-button>
      <a-button @click="saveFile">保存为文件</a-button>
    </div>

  </a-drawer>
  <a-drawer
    :title="null"
    placement="bottom"
    :closable="true"
    v-model:visible="menuVisible"
    @close="onClose"
  >
    <div style="display: none">
      <Widget
               :uniqueKey="newItem.id"
               :title="newItem.title"
               :showDelete="true"
               :resizable="true"
      >
        <DeckItem :id="newItem.id" :item="newItem"></DeckItem>
      </Widget>
    </div>
    <a-row :gutter="20">
      <a-col v-if="menuType==='grid'">
        <div  @click="add()" class="btn">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div>添加按钮</div>
        </div>
      </a-col>
      <a-col v-if="menuType==='item'">
        <div  @click="edit()" class="btn">
          <Icon style="font-size: 3em" icon="shenqing"></Icon>
          <div>编辑按钮</div>
        </div>
      </a-col>
      <a-col v-if="menuType==='item'">
        <div  @click="remove()" class="btn">
          <Icon style="font-size: 3em" icon="shanchu"></Icon>
          <div>删除按钮</div>
        </div>
      </a-col>

      <a-col>
        <div @click="addBoard" class="btn">
          <Icon style="font-size: 3em" icon="tianjiawenjianjia"></Icon>
          <div>添加分组</div>
        </div>
      </a-col>
      <a-col v-if="menuType==='grid'">
        <div  @click="removeGrid()" class="btn">
          <Icon style="font-size: 3em" icon="shanchu"></Icon>
          <div>删除分组</div>
        </div>
      </a-col>
      <a-col>
        <div class="btn">
          <Icon style="font-size: 3em" icon="shezhi"></Icon>
          <div>设置</div>
        </div>
      </a-col>

      <a-col>
        <div @click="toggleEditing" class="btn">
          <Icon v-if="!this.editing" style="font-size: 3em" icon="bofang"></Icon>
          <Icon v-else style="font-size: 3em;color: orange" icon="tingzhi"></Icon>
          <div><span v-if="!this.editing">调整布局</span><span v-else style="color: orange">停止调整</span></div>
        </div>
      </a-col>
      <a-col>
        <div class="btn" @click="toggleSharing">
          <Icon style="font-size: 3em" icon="fenxiang"></Icon>
          <div>分享方案</div>
        </div>

      </a-col>
      <a-col>
        <div class="btn">
          <Icon style="font-size: 3em" icon="daoru"></Icon>
          <div>导入方案</div>
        </div>

      </a-col>
    </a-row>
    <a-row style="margin-top: 1em" :gutter="[20,20]">
      <a-col>
        <div @click="changeSize('large')"  class="btn">
          <a-avatar shape="square">大</a-avatar>
          <div>大图标</div>
        </div>
      </a-col>
      <a-col>
        <div @click="changeSize('middle')"  class="btn">
          <a-avatar shape="square">中</a-avatar>
          <div>中图标</div>
        </div>
      </a-col>
      <a-col>
        <div @click="changeSize('small')"  class="btn">
          <a-avatar shape="square">小</a-avatar>
          <div>小图标</div>
        </div>
      </a-col>



    </a-row>

  </a-drawer>
  <a-modal :key="addKey"
    v-model:visible="visibleAdd"
    :title="null"
    width="800px"
    centered
    height="500px"
    wrap-class-name="lg-modal"
    :footer="null"
  >
    <DeckAdd :data="this.currentItem" @add="doAdd"></DeckAdd>
  </a-modal>

  <Prompt @cancel="this.visiblePromptTitle=false" content="请输入分组标题" title="编辑组标题" placeholder="输入标题" :visible="visiblePromptTitle" @change-value="changeTitle"></Prompt>
</template>

<script>
import DeckItem from '../components/muuri/DeckItem.vue'
import { appStore } from '../store'
import { mapWritableState } from 'pinia'
import Template from '../../user/pages/Template.vue'
import DeckAdd from './app/deck/DeckAdd.vue'
import { message } from 'ant-design-vue'
import { deckStore } from '../store/deck'
import Widget from "../components/muuri/Widget.vue";
import vuuri from '../components/vuuri/Vuuri.vue'
import Prompt from '../components/comp/Prompt.vue'
import {Modal} from 'ant-design-vue'
import BackBtn from '../components/comp/BackBtn.vue'
export default {
  name: 'Deck',
  components: {
    BackBtn,
    Prompt,
    DeckAdd,
    Template,
    DeckItem,
    Widget: Widget,
    vuuri,

  },
  data () {
    return {
      //分享相关的组
      selectedGridIds:{},//分享选中的组
      sharing:false,//分享状态
      shareTo:'json',//json file com
      shareMenuComVisible:false,//显示分享抽屉菜单
      shareMenuJsonVisible:false,
      shareData:{},

      key:Date.now(),

      addKey:Date.now(),
      editGrid:null,
      visiblePromptTitle:false,
      displayGrids:[],
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
      newItem: {
        icon: '',
        cover: '',
        title: '微信'
      },
      menuType:'',//菜单类型

      currentGridId: -1,//当前菜单选中的grid
      currentGrid: {},

      currentItemId:-1,//当前菜单的item
      currentItem:{},

      cloneMap: [],
      menuVisible: false,
      visibleAdd: false
    }
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen']),
    ...mapWritableState(deckStore, ['grids','editing','settings']),
    selectedGrids(){
      let selectedIds=Object.keys(this.selectedGridIds).filter(key=>{
        return this.selectedGridIds[key]
      })
      console.log(selectedIds)
      return this.grids.filter(g=>{
        return selectedIds.indexOf(String(g.id))>-1
      })
    }
  },
  mounted () {
    //进来之后就把存储的部分和初始化部分完全脱钩，这样，可以随意变更按钮，并即时存储，而不会影响到我们界面上的部分。
    //this.displayGrids=_.cloneDeep(this.grids)
    //window.gridsSave=_.cloneDeep(this.grids)
    // this.decks.forEach(board => {
    //   this.initBoard(board)
    // })
  },
  methods: {
    copyCode(){
      require('electron').clipboard.writeText(this.getShareJson())
      this.toggleSharing()
      this.shareMenuJsonVisible=false
      message.success("已为您复制到剪切板，赶紧去分享给其他小伙伴吧！")
    },
    async saveFile () {
      let savePath = await tsbApi.dialog.showSaveDialog({
        title: '选择保存位置',
        defaultPath: '我的分享.deck',
        message: '选择保存分享代码位置',
        filters: [{ name: 'deck存档', extensions: ['deck'] }],
        properties: [
          'createDirectory',
          'showOverwriteConfirmation'
        ]
      })
      const fs=require('fs')
      if(!savePath){
        return
      }
      fs.writeFile(savePath,this.getShareJson(),(err)=>{
        if(!err){
          message.success('导出成功。为您的分享精神点赞！')
          require('electron').shell.showItemInFolder(savePath)
          this.toggleSharing()
          this.shareMenuJsonVisible=false
          return
        }else{
          message.error('导出失败，请确认文件权限。')
        }
      })
    },
    ensureShare(){
      if(this.selectedGrids.length===0){
        message.error('您至少选择一个组。')
        return
      }
      if(this.shareTo==='com'){
        this.shareMenuComVisible=true
      }else{
        this.shareMenuJsonVisible=true
      }
    },
    getShareJson(){
      return JSON.stringify(this.selectedGrids)
    },
    toggleSharing(){
      this.selectedGridIds={}
      this.sharing=!this.sharing
      this.fullScreen=this.sharing
      this.menuVisible=false
    },
    toggleEditing(){
      this.editing=!this.editing
      if(this.editing){
        message.info('您可以直接拖拽图标调整位置，支持跨组调整')
      }else{
        message.info('已关闭拖拽调整')
      }
      this.menuVisible=false
      this.key=Date.now()
    },
    showEditTitle(grid){
      this.visiblePromptTitle=true;
      this.editGrid=grid
    },
    changeTitle(title){
      if(title.value.length>0){
        this.editGrid.title=title.value
        this.visiblePromptTitle=false
      }else{
        message.error('请输入分组标题')
      }

    },
    changeSize(size){
      this.settings.iconSize=size;
      this.menuVisible=false
      Object.keys(this.$refs).forEach(key=>{
        this.$refs[key][0].update()
      })

    },
    /**
     * 手动刷新全部Grids
     */
    updateAllGrids(){
      Object.keys(this.$refs).forEach(key=>{
        this.$refs[key][0].update()
      })
    },
    getIconSize(){
      let width=80
      switch(this.settings.iconSize){
        case 'small':
          width=40
          break
        case 'middle':
          width=80
          break
        case 'large':
          width=160
          break
        default:
          width=80
      }
      return width +'px'
    },
    initBoard (board) {
      // this.grids.push(new Muuri('#board-' + board.id, {
      //     dragEnabled: true,
      //     dragStartPredicate: (item, event) => {
      //       // Prevent first item from being dragged.
      //       if (!this.enableDrag) {
      //         return false
      //       }
      //       // For other items use the default drag start predicate.
      //       return Muuri.ItemDrag.defaultStartPredicate(item, event)
      //     },
      //     dragContainer: document.body,
      //     dragSort: () => {
      //       return this.grids
      //     }
      //   }).on('receive', (data) => {
      //     console.log(data)
      //     this.cloneMap[data.item._id] = {
      //       item: data.item,
      //       grid: data.fromGrid,
      //       index: data.fromIndex
      //     }
      //   }).on('send', (data) => {
      //     console.log(data)
      //     delete this.cloneMap[data.item._id]
      //   }).on('dragReleaseStart', (item) => {
      //     console.log(item)
      //     var cloneData = this.cloneMap[item._id]
      //     if (cloneData) {
      //       delete this.cloneMap[item._id]
      //
      //       var clone = cloneData.item.getElement().cloneNode(true)
      //       clone.setAttribute('class', 'item')
      //       clone.children[0].setAttribute('style', '')
      //       // var items = cloneData.grid.card(clone, { index: cloneData.index, active: false })
      //       // cloneData.grid.show(items)
      //     }
      //   })
      // )
    },
    onClose () {
      this.menuVisible = false
    },
    remove(){
      Modal.confirm({
        content:"确定删除按钮【"+this.currentItem.title+'】？此操作不可还原。请谨慎操作。',
        okText:'确认删除',
        onOk:()=>{
          this.currentGrid.children.splice(this.currentGrid.children.findIndex(item=>{
            return item.id===this.currentItemId
          }),1)
          this.menuVisible=false
        }
      })

    },
    edit(){
      this.addKey=Date.now()
      this.visibleAdd = true
    },
    add () {
      this.currentItem=undefined
      this.addKey=Date.now()
      this.visibleAdd = true
     // this.currentGrid.card(document.getElementById('newItem').cloneNode(true))
    },
    showMenu (id,data,type='grid') {
      this.menuVisible = true
      if(type==='grid'){
        this.menuType='grid'
        this.currentGridId = id
        this.currentGrid =this.grids.find(g=>{
          return g.id=== id
        })
      }else if(type==='item'){
        this.menuType='item'
        this.currentItemId = id
        this.currentItem =data.item
        this.currentGrid=data.grid
      }else{
        this.menuType='wrapper'
      }
    },
    addBoard () {
      let grid = {
        id: Date.now(),
        title: '新组',
        children: []
      }
      console.log(this.grids)
      this.grids.push(grid)
      // this.$nextTick(() => {
      //   this.initBoard(board)
      // })
      this.menuVisible = false
    },
    doAdd (button) {
      this.visibleAdd = false
      this.menuVisible = false
      if(!this.currentItem){
        this.newItem = button
        this.$refs['grid'+this.currentGridId][0].update()
        this.currentGrid.children.push(this.newItem)
        message.success('添加按钮成功')
      }else{
        Object.keys(this.currentItem).forEach(key=>{
          this.currentItem[key]=button[key]
        })
        message.success('修改按钮成功')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.grid {
  position: relative;
  width: 18em;
  display: inline-block;
  background: rgba(204, 204, 204, 0.3);
  border: 5px solid transparent;
  border-radius: 4px;
  vertical-align: top;
  margin: 1em;
}


.btn {
  text-align: center;
}

  :deep(.muuri-grid) {
    /* any styles to card on the muuri grid */
  }

:deep(.muuri-item ){
    /* any styles to card on the item container */
    /* only to override positioning */
    margin: 5px;
    .muuri-item-content {
      /* card any markup you like */
    }

    &.muuri-item-dragging {
    }

    &.muuri-item-releasing {
    }

    &.muuri-item-hidden {
    }
  }

  .muuri-item-placeholder {
    /* shadow element behind the dragging element */
  }



</style>
<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}

.btn {
  min-width: 7em;

  div {
    line-height: 2;
  }
}

.sharing{
  padding: 4em;padding-top: 0em;
}

</style>
