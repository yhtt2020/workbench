<template>
  <div class="flex flex-1  flex-col" style="width: 370px">
    <div class="flex-1 h-0">
      <xt-scrollbar :y="true" class=" h-full w-full">
        <GoodsList @showDetail="showDetail"  :list="myPromoGoods"></GoodsList>
      </xt-scrollbar>
    </div>
    <div class="p-2">
      已入库 {{myPromoGoods.length}}
    </div>
  </div>
  <div v-if="detail" class="flex flex-col xt-bg-2 p-3 rounded-lg" style="width: 373px">

    <GoodsDetail :detail="detail"></GoodsDetail>
  </div>
</template>

<script setup>
import { goodsStore } from './goodsStore'
import { ref, toRefs } from 'vue'
import GoodsList from './GoodsList.vue'
import GoodsDetail from './GoodsDetail.vue'
const detail = ref(null)
const { myPromoGoods } = toRefs(goodsStore())
const {  getDetail } = goodsStore()
const showDetail = async (goodsSign) => {
  let rs = await getDetail(goodsSign)


  if (rs.status) {
    detail.value = rs.data?.goods_detail_response?.goods_details[0]
    console.log(detail.value, '详情')
  }
}
</script>

<style scoped>

</style>
