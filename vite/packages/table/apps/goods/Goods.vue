<template>
  <xt-container
    :header="header"
    v-model:customSize="customData.customSize "
    :envLimit="['guest', 'single', 'offline']"
    :desk="desk"
    :sizeList="sizeList"
    :options="options"
    :customIndex="customIndex"
    :customData="customData"
    :menuList="menuList"
    :env="env"

    ref="cardSlot"
    @delete="deleteCard">
    <div class="flex item-content pt-5">
      <xt-button @click="settingVisible=true" type="theme">去选品</xt-button>
    </div>
  </xt-container>
  <teleport to='body'>
    <Modal v-if="settingVisible" v-model:visible="settingVisible" :blur-flag="true"  :z-index="1001">
      <div class="flex rounded-lg overflow-hidden">


      <Settings @close="settingVisible=false"></Settings>
      </div>
    </Modal>
  </teleport>
</template>

<script>
import { Icon as newIcon } from '@iconify/vue'
import { mapWritableState, mapActions } from 'pinia'
import Modal from '../../components/Modal.vue'
import Widget from '../../components/card/Widget.vue'
import Settings from './Settings.vue'

export default {
  name: "goods",
  components: {
    Widget,
    newIcon,
    Modal,
    Settings
  },
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => { },
    },
    desk: {
      type: Object,
    },
    openWay:{
      type: String,
      default: "desk"
    }
  },
  data () {
    return {

      settingVisible:false,
      env: {
        web: false,
        mobile: false,
        client: false,
        single: true
      },
      menuList: [
        {
          newIcon: 'fluent:search-16-filled',
          title: '搜索商品',
          fn: () => {
            this.settingVisible=true
          },
        },
        {
          newIcon: 'fluent:box-16-filled',
          title: '商品库',
          fn: () => {
            this.settingVisible=true
          },
        },
        {
          icon: 'shezhi1',
          title: '设置',
          fn: () => {
            this.settingVisible=true
          }
        },

      ],
    }
  },
  methods: {

  },
  computed: {

    header(){
      return {
        title:'商品推荐',
        ifyIcon:'fluent:cart-16-filled',
        refresh:{
          fn:()=>{
            this.refreshFlag = true
            this.refreshAll().then(()=>{
              console.log(111111)
              this.refreshFlag = false
            })
          },
          tip:'刷新',
          state:false
        }
      }
    }
  },
  watch: {

  },
  async mounted () {


  },

  beforeDestroy () {

  },

}
</script>

<style lang="scss" scoped>
// .refresh {
//   // background-color: var(--primary-bg);

//   &:hover {
//     // background-color: var(--secondary-bg);
//   }
// }
.courier-item {
  &::after {
    content: '';
    width: 100%;
    height: 1px;
    background-color: var(--divider);
    margin-top: 6px;
  }
}

.divider {
  width: 100%;
  height: 1px;
  background-color: var(--divider);
  margin-top: 8px;

  margin-bottom: 8px;
}

.courier {
  .add-courier {
    display: none;
  }

  &:hover {
    .add-courier {
      display: block;
    }
  }
}
</style>

