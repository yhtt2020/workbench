<template>
  <div class="flex flex-1  flex-col h-full" style="width: 370px">
    <div class="flex-1 h-0">
      <xt-scrollbar :y="true" class=" h-full w-full">
        <GoodsList mod="my" :customData="customData" @showDetail="showDetail"  :list="myPromoGoods"></GoodsList>
      </xt-scrollbar>
    </div>
    <div class="p-2">
      已入库 {{myPromoGoods.length}}
    </div>
  </div>
  <div class="flex flex-col xt-bg-2 p-3 rounded-lg" style="width: 373px">
    <GoodsDetail :detail="detail"></GoodsDetail>
  </div>
</template>

<script setup>
import { goodsStore } from './goodsStore'
import { ref, toRefs,defineProps } from 'vue'
import GoodsList from './GoodsList.vue'
import GoodsDetail from './GoodsDetail.vue'
const detail = ref(null)
const { myPromoGoods } = toRefs(goodsStore())
const {  getDetail } = goodsStore()
const props=defineProps(['customData'])
const showDetail = async (goodsSign) => {
  let rs = await getDetail(goodsSign)
  if (rs.status) {
    detail.value = rs.data?.goods_detail_response?.goods_details[0]
  }
}
</script>

<style scoped>

</style>
