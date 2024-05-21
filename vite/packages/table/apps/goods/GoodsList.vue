<template>
  <xt-menu
    :menus="menus"
    class="relative"
  >
    <div
      v-for="item in list"
      :class="{active:currentItemSign===item.goods_sign}" class="mb-1 flex gap-2 item relative"
      @click="showDetail(item.goods_sign)"
      @contextmenu="setCurrentSign(item.goods_sign)">
      <div style="width: 110px">
        <a-avatar :size="110" :src="item.goods_thumbnail_url" shape="square"></a-avatar>
      </div>
      <div class="flex-1 w-0">
        <div class="mb-2">{{ item.goods_name }}</div>
        <div class="mb-2 xt-text-2">
          <span class="xt-text">¥ {{ (item.min_group_price / 100).toFixed(2) }}</span>
          &nbsp;&nbsp;热销 {{ item.sales_tip }} 件
        </div>
        <div class="highlight">
          赚/省 ¥ {{ (item.min_group_price * item.promotion_rate / 1000 / 100).toFixed(2) }} &nbsp;&nbsp;
          {{ (item.promotion_rate / 10).toFixed(2) }}%
        </div>
      </div>
      <span @click.stop>
    <xt-button v-if="!isMyProm(item.goods_sign)" :h="35" :radius="6" :w="100"
               style="position:absolute;bottom:5px;right:10px"
               type="theme" @click="addToMy(item)">添加到选品</xt-button>
  </span>
    </div>
  </xt-menu>
</template>

<script setup>
import { computed, defineEmits, defineProps, ref } from 'vue'
import { toRefs } from 'vue'
import { goodsStore } from './goodsStore'

const currentItemSign = ref('')
const { myPromoGoods } = toRefs(goodsStore())
const props = defineProps(['list'])
const emit = defineEmits(['showDetail'])
const addToMy = (item) => {
  myPromoGoods.value.unshift(item)
}
const setCurrentSign = (sign) => {
  currentItemSign.value = sign
}

const menus = computed(() => {
  let isMy = isMyProm(currentItemSign.value)
  let items = isMy ? [{
    newIcon: 'fluent:pin-16-filled',
    label: '置顶',
    callBack: () => {
      console.log(currentItemSign.value, 'ddd')
      let itemIndex = myPromoGoods.value.findIndex(g => {
        return g.goods_sign === currentItemSign.value
      })
      if (itemIndex > -1) {
        let old = myPromoGoods.value[itemIndex]
        myPromoGoods.value.splice(itemIndex, 1)
        myPromoGoods.value.unshift(old)
      }
    },
  }] : []
  items.push(isMy ? {
    newIcon: 'fluent:delete-16-filled',
    label: '删除',
    callBack: () => {
      removeFromMy(currentItemSign.value)
    },
  } : {
    newIcon: 'fluent:delete-16-filled',
    label: '添加到选品库',
    callBack: () => {
      myPromoGoods.value.unshift(props.list.find(i => {
        return i.goods_sign === currentItemSign.value
      }))
      console.log(currentItemSign.value, 'ee')
    },
  })
  console.log(items, '合并出')
  return items
})
const isMyProm = (goods_sign) => {
  return myPromoGoods.value.findIndex(item => {
    return item.goods_sign === goods_sign
  }) > -1
}

const removeFromMy = (goods_sign) => {
  let index = myPromoGoods.value.findIndex(item => {
    return item.goods_sign === goods_sign
  })
  if (index > -1) {
    myPromoGoods.value.splice(index, 1)
  }
}
const showDetail = (goodsSign) => {
  currentItemSign.value = goodsSign
  emit('showDetail', goodsSign)
}

</script>

<style lang="scss" scoped>
.highlight {
  color: #FF4D4F
}

.item {
  border-radius: 5px;
  padding-right: 6px;

  &:hover {
    opacity: .8;
  }

  &.active {
    border: 2px solid var(--active-bg);
    background: var(--secondary-bg);
  }

  border: 2px solid transparent;

}
</style>
