<template>
  <vue-custom-scrollbar  @contextmenu.stop="showMenu(-1,undefined,'wrapper')" :settings="scrollbarSettings"
                        style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">

    <div style="width: auto;white-space: nowrap">
      <div style="width: 20em;display: inline-block" v-for="(grid,index) in grids">
        <h3 class="pointer" @click="showEditTitle(grid)">{{grid.title}}</h3>
        <div  >
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
  <a-drawer
    :title="null"
    placement="bottom"
    :closable="true"
    :visible="menuVisible"
    @close="onClose"
    @getItemWidth="getIconSize"
    @getItemHeight="getIconSize"
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
        <div class="btn">
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
    <DeckAdd @add="doAdd"></DeckAdd>
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
export default {
  name: 'Deck',
  components: {
    Prompt,
    DeckAdd,
    Template,
    DeckItem,
    Widget: Widget,
    vuuri,
    key:Date.now()
  },
  data () {
    return {
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
    ...mapWritableState(appStore, []),
    ...mapWritableState(deckStore, ['grids','editing','settings']),
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
    add () {
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
      this.newItem = button

      this.$refs['grid'+this.currentGridId][0].update()
      this.currentGrid.children.push(this.newItem)

      // this.grids[this.currentGridId].children.shift({
      //   icon: button.icon,
      //   cover: '',
      //   title: button.title,
      //   fn: button.fn,
      //   id: button.id
      // })
      // console.log(this.$refs)
      // let refs=this.$refs['grid'+this.currentGridId]
      // console.log(refs,'refs',refs[0],'refs0')
      //
      // let grid=refs[0]
      // this.$nextTick(()=>{
      //   grid.handleAdd(this.newItem)
      // })

      // this.currentGrid.card(document.getElementById(button.id))
      // this.$nextTick(() => {
      //   this.currentGrid.refreshItems()
      // })
      message.success('添加按钮成功')
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



</style>
