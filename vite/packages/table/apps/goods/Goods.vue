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
    <div class="flex item-content pt-2" v-if="!customData.goods || customData.goods.length===0">
      <div class="xt-bg-2 p-2 rounded-lg mb-2">
        通过选品并设置组件展示商品后，即可在当前桌面展示特定商品，通过组件购买的商品均可获得返佣。
      </div>
      <xt-button :w="80" :h="40" @click="settingVisible=true" type="theme">去选品</xt-button>
    </div>
    <div class="h-full" v-else>
      <xt-scrollbar :y="true" class=" h-full w-full">
      <GoodsList :hidePromoRate="true" :showTags="true" :list="customData.goods"></GoodsList>
      </xt-scrollbar>
    </div>
  </xt-container>
  <teleport to='body'>
    <Modal v-if="settingVisible" v-model:visible="settingVisible" :blur-flag="true"  :z-index="1001" >
      <div class="flex rounded-lg overflow-hidden" style="width: 1000px;min-height: 752px;max-height: 90vh">
      <Center style="height: 100%" :customData="customData" @close="settingVisible=false"></Center>
      </div>
    </Modal>
  </teleport>
</template>

<script>
import { Icon as newIcon } from '@iconify/vue'
import { mapWritableState, mapActions } from 'pinia'
import Modal from '../../components/Modal.vue'
import Widget from '../../components/card/Widget.vue'
import Center from './Center.vue'
import GoodsList from './GoodsList.vue'

export default {
  name: "goods",
  components: {
    GoodsList,
    Widget,
    newIcon,
    Modal,
    Center
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
      sizeList: [
        {
          value: '4x4',
          name: '4x4',
        },
        {
          value: '4x6',
          name: '4x6',
        },

      ],
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
    options () {
      return {
        defaultData: {
          _updateFlag: "24531",
          customSize: this.customData.customSize !== undefined ? this.customData.customSize : '4x4',
        },
      }
    },
    header(){
      return {

        title:'商品推荐',
        ifyIcon:'fluent:cart-16-filled',
        // refresh:{
        //   fn:()=>{
        //     this.refreshFlag = true
        //     this.refreshAll().then(()=>{
        //       console.log(111111)
        //       this.refreshFlag = false
        //     })
        //   },
        //   tip:'刷新',
        //   state:false
        // },
        rightIcon:[
          {
            ifyIcon: "fluent:search-16-filled",
           // class: props.header.refresh.state ? "refresh" : "",
            fn: ()=>{
              this.settingVisible=true
            },
            tip: '快速搜索商品',

          }
        ]
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

