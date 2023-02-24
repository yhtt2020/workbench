<template>
  <vue-custom-scrollbar :settings="scrollbarSettings"
                        style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">

    <div style="white-space: nowrap" @contextmenu.stop="showMenu(-1)">
      <div style="min-height: 3em" @contextmenu.stop="showMenu(index)" :id="'board-'+board.id" class="grid"
           v-for="(board,index) in decks">
        <DeckItem :id="item.id" :item="item" v-for="item in board.children"></DeckItem>
      </div>
    </div>
  </vue-custom-scrollbar>
  <a-drawer
    :title="null"
    placement="bottom"
    :closable="true"
    :visible="visible"
    @close="onClose"
  >
    <div style="display: none">
      <DeckItem id="newItem" :item="newItem"></DeckItem>
    </div>
    <a-row :gutter="20">
      <a-col>
        <div v-if="currentGridId!==-1" @click="add()" class="btn">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div>添加按钮</div>
        </div>
      </a-col>
      <a-col>
        <div @click="addBoard" class="btn">
          <Icon style="font-size: 3em" icon="tianjiawenjianjia"></Icon>
          <div>添加分组</div>
        </div>
      </a-col>
      <a-col>
        <div class="btn">
          <Icon style="font-size: 3em" icon="shezhi"></Icon>
          <div>设置</div>
        </div>
      </a-col>
      <a-col>
        <div @click="this.enableDrag=!this.enableDrag;this.visible=false" class="btn">
          <Icon v-if="!this.enableDrag" style="font-size: 3em" icon="bofang"></Icon>
          <Icon v-else style="font-size: 3em;color: orange" icon="tingzhi"></Icon>
          <div><span v-if="!this.enableDrag">调整布局</span><span v-else style="color: orange">停止调整</span></div>
        </div>
      </a-col>
    </a-row>

  </a-drawer>
  <a-modal
    v-model:visible="visibleAdd"
    :title="null"
    width="100%"
    wrap-class-name="full-modal"
    :footer="null"
  >
    <DeckAdd @add="doAdd"></DeckAdd>
  </a-modal>
</template>

<script>
import Muuri from 'muuri'
import DeckItem from './app/deck/DeckItem.vue'
import { appStore } from '../store'
import { mapWritableState } from 'pinia'
import Template from '../../user/pages/Template.vue'
import DeckAdd from './app/deck/DeckAdd.vue'
import {message} from 'ant-design-vue'
export default {
  name: 'Deck',
  components: {
    DeckAdd,
    Template,
    DeckItem
  },
  data () {
    return {
      enableDrag: false,
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
      currentGridId: -1,
      currentGrid: {},
      grids: [],
      cloneMap: [],
      visible: false,
      visibleAdd: false
    }
  },
  computed: {
    ...mapWritableState(appStore, ['decks'])
  },
  mounted () {

    this.decks.forEach(board => {
      this.initBoard(board)
    })
  },
  methods: {
    initBoard (board) {
      this.grids.push(new Muuri('#board-' + board.id, {
          dragEnabled: true,
          dragStartPredicate: (item, event) => {
            // Prevent first item from being dragged.
            if (!this.enableDrag) {
              return false
            }
            // For other items use the default drag start predicate.
            return Muuri.ItemDrag.defaultStartPredicate(item, event)
          },
          dragContainer: document.body,
          dragSort: () => {
            return this.grids
          }
        }).on('receive', (data) => {
          console.log(data)
          this.cloneMap[data.item._id] = {
            item: data.item,
            grid: data.fromGrid,
            index: data.fromIndex
          }
        }).on('send', (data) => {
          console.log(data)
          delete this.cloneMap[data.item._id]
        }).on('dragReleaseStart', (item) => {
          console.log(item)
          var cloneData = this.cloneMap[item._id]
          if (cloneData) {
            delete this.cloneMap[item._id]

            var clone = cloneData.item.getElement().cloneNode(true)
            clone.setAttribute('class', 'item')
            clone.children[0].setAttribute('style', '')
            // var items = cloneData.grid.add(clone, { index: cloneData.index, active: false })
            // cloneData.grid.show(items)
          }
        })
      )
    },
    onClose () {
      this.visible = false
    },
    add () {
      this.visibleAdd = true
      this.currentGrid.add(document.getElementById('newItem').cloneNode(true))
    },
    showMenu (id) {
      this.visible = true
      this.currentGridId = id
      this.currentGrid = this.grids[id]
    },
    addBoard () {
      let board = {
        id: Date.now(),
        title: '新组',
        children: []
      }
      console.log(this.decks)
      this.decks.push(board)
      this.$nextTick(() => {
        this.initBoard(board)
      })
      this.visible = false
    },
    doAdd (button) {
      this.visibleAdd = false
      this.visible = false
      this.newItem = {
        icon: button.icon,
        cover: '',
        title: button.title,
        fn: button.fn,
        id:button.id
      }

      this.decks[this.currentGridId].children.shift({
        icon: button.icon,
        cover: '',
        title: button.title,
        fn: button.fn,
        id:button.id
      })
      // this.currentGrid.add(document.getElementById(button.id))
      this.$nextTick(()=>{
        this.currentGrid.refreshItems()
      })
      message.success('添加按钮成功')
    }
  }
}
</script>

<style scoped>
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

.item {
  display: block;
  position: absolute;
  width: 100px;
  height: 100px;
  margin: 10px;
  z-index: 1;
  background: rgba(0, 0, 0, 0.58);
  color: #fff;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
}

.item.muuri-item-dragging {
  z-index: 3;
}

.item.muuri-item-releasing {
  z-index: 2;
}

.item.muuri-item-hidden {
  z-index: 0;
}

.item-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.item.muuri-item-dragging,
.item.muuri-item-releasing {
  opacity: 0.8
}

.btn {
  text-align: center;
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
