<template>
  <div class="s-bg m-2 rounded-md px-5 xt-bg xt-text" style="height: calc(100% - 20px);">
    <back-btn class="xt-bg-2 xt-text"></back-btn>
    <div  style="font-size: 18px;display: flex;flex-direction: column;height: 100%">
      <h3 class="mt-3" style="text-align: center;">
      <span v-if="!this.id">
       添加自定义按钮
      </span>
        <span v-else>
        编辑 - {{ this.data.title }}
      </span>
      </h3>
      <vue-custom-scrollbar :settings="settings" style="height: 100%;flex:1;">
        <div v-if="tab==='input'" style="width: 100%;display: flex;flex-direction: row">
          <div>
            <div class="line preview" style="text-align: center">
              <div class="line-title" style="padding: 1em;text-align: center;">
                效果预览
              </div>
              <div class="item-wrapper">


                <div v-if="type==='font'">

                  <div class="text-icon"
                       :style="{'font-size':iconFontSize+'px',color:this.color,'background':this.bgColor}">
                    {{ iconText }}
                  </div>
                </div>
                <div v-else>
                  <CustomIcon v-if="icon" style="font-size: 60px;margin-top: 0.15em"
                              :icon="icon"></CustomIcon>
                </div>
              </div>
              <div style="text-align: center;margin-top: 1em;margin-right: 0">
                <a-button v-if="!this.data" type="primary" @click="doAdd" style="width: 8em">添加按钮</a-button>
                <a-button v-else type="primary" @click="doAdd">
                  保存按钮
                </a-button>
              </div>
            </div>
          </div>
          <div class="ml-4" style="flex:1">
            <div class="line-title">
              名称
            </div>
            <div class="line">
              <a-input @change="syncTitle" style="width: 20em" v-model:value="title" size="large"
                       placeholder="输入按钮名称"></a-input>
            </div>
            <div class="line-title ">图标</div>
            <div class="line">
              <a-radio-group v-model:value="type">
                <a-radio value="font">
                  文字按钮
                </a-radio>
                <a-radio value="icon">
                  图标按钮
                </a-radio>

              </a-radio-group>
            </div>

            <div v-if="type==='font'">
              <div class="line">
                按钮文字：
                <a-textarea style="width: 20em" v-model:value="iconText" placeholder="输入文字"></a-textarea>
              </div>
              <div class="line">
                字体大小：
                <a-input-number placeholder="字体大小" v-model:value="iconFontSize"></a-input-number>
              </div>
              <div class="line">
                文字颜色：
                <colorPicker v-model:hex="color"/>
              </div>
              <div class="line">
                背景颜色：
                <colorPicker v-model:hex="bgColor"/>
              </div>

            </div>

            <div v-else class="line"><span style="margin-right: 1em"><CustomIcon v-if="icon" style="font-size: 60px"
                                                                                 :icon="icon"></CustomIcon>

      <a-avatar v-else :size="60"></a-avatar></span>

              <div class="btn" @click="tab='icon'">选择图标</div>
            </div>
            <div class="line-title">功能</div>
            <div class="line">
              <div @click="editAction(data)" :style="{'border-left-color':data.group.color}"
                   v-for="(data,index) in actions" class="action">
                {{ data.action.title }}
                <Icon class="close-btn" @click.stop="removeAction(index)" style="font-size: 15px" icon="guanbi1"></Icon>
              </div>
              <a-button @click="addAction" class="xt-bg-2 xt-text">添加</a-button>

            </div>
          </div>

        </div>
        <div v-if="tab==='icon'">
          <IconList @onSelect="setIcon"></IconList>
        </div>
        <div v-if="tab==='action'">
          <DeckAction :data="editingAction" ref="_deckAction" @click="doAddAction"></DeckAction>
        </div>
      </vue-custom-scrollbar>
    </div>


  </div>

</template>

<script>
import IconList from '../../components/comp/IconList.vue'
import CustomIcon from '../../components/comp/CustomIcon.vue'
import DeckAction from './DeckAction.vue'
import {message} from 'ant-design-vue'
import VueCustomScrollbar from "../../../../src/components/vue-scrollbar.vue";
import BackBtn from "../../components/comp/BackBtn.vue";
import {deckStore} from "../../store/deck";
import {mapActions, mapWritableState} from 'pinia'

export default {
  name: 'DeckAdd',
  emits: ['add'],
  data() {
    return {
      currentGrid: {},
      settings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      tab: 'input',
      type: 'font',
      iconFontSize: 20,
      iconText: '',
      showIconList: false,
      color: '#ffffff',
      bgColor: '#0A83FDFF',

      icon: null,
      title: '',
      actions: [],//功能
      data:{},

      id: 0,

      editingAction: {}//正在编辑中的action

    }
  },
  mounted() {
    this.currentGrid = this.grids.find(g => {
      return String(g.id) === String(this.$route.params.gridId)
    })
    let id = this.$route.params.id
    if (id) {
      let data= this.currentGrid.children.find(b=>{
        return String(b.id)===String(id)
      })
      /**
       * {
       *         title: this.title,
       *         icon: this.icon,
       *         font:{
       *           size:this.iconFontSize,
       *           text:this.iconText,
       *           color:this.color,
       *           bgColor:this.bgColor
       *         },
       *         actions: this.actions,
       *         id: Date.now(),
       *         type: this.type
       */
      this.title = data.title
      this.icon = data.icon
      this.iconFontSize = data.font.size
      this.iconText = data.font.text
      this.color = data.font.color
      this.bgColor = data.font.bgColor
      this.actions = data.actions
      this.id = data.id
      this.type = data.type
      this.data=data
    }
  },
  components: {BackBtn, VueCustomScrollbar, DeckAction, CustomIcon, IconList},
  computed: {
    ...mapWritableState(deckStore, ['grids'])
  },
  methods: {
    ...mapActions(deckStore, ['addButton']),
    removeAction(index) {
      this.actions.splice(index, 1)
    },
    editAction(action) {
      this.tab = 'action'
      this.editingAction = action
      this.$nextTick(() => {
        this.$refs._deckAction.reset()

      })
    },
    addAction() {
      this.tab = 'action'
      this.editingAction = undefined
      this.$nextTick(() => {
        this.$refs._deckAction.reset()
      })

    },
    doAddAction(actionData) {
      this.tab = 'input';
      if (this.editingAction) {
        if (actionData) {
          let foundIndex = this.actions.findIndex(a => {
            return a === this.editingAction
          })
          this.actions.splice(foundIndex, 1)
          this.actions.splice(foundIndex, 0, actionData)
          this.editingAction = {}
        }
      } else {
        if (actionData) {
          this.actions.push(actionData)
        }
      }


    },
    setIcon(icon) {
      this.icon = icon
      this.tab = 'input'
    },
    doAdd() {
      if (!this.title) {
        message.error('请输入按钮名称')
        return
      }
      if (this.type === 'icon') {
        if (this.icon === null) {
          message.error('请选择图标')
          return
        }
      } else {
        if (this.iconText === '') {
          message.error('请输入按钮文字')
        }
      }

      let button = {
        title: this.title,
        icon: this.icon,
        font: {
          size: this.iconFontSize,
          text: this.iconText,
          color: this.color,
          bgColor: this.bgColor
        },
        actions: this.actions,
        id: this.id || Date.now(),
        type: this.type
      }
      if (this.addButton(button, this.currentGrid) === 'add') {
        message.success('添加按钮成功')
        this.$router.go(-1)
      } else {
        message.success('修改按钮成功')
        this.$router.go(-1)
      }
    },
    syncTitle(value) {
      this.iconText = this.title
    }
  }
}
</script>

<style scoped lang="scss">
.line {
  margin-top: 1em;
  margin-bottom: 1em;
}

.preview {

  text-align: center;
  vertical-align: middle;
}

.item-wrapper {
  display: inline-block;

  width: 80px;
  height: 80px;
  background: rgba(128, 128, 128, 0.34);
  border-radius: 0.3em;

  svg {
    vertical-align: middle;
  }
}

.close-btn {
  &:hover {
    background: red;
    color: white;
    border-radius: 2px;

  }
}
</style>
