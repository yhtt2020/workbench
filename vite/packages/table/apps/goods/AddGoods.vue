<template>
  <div class="flex flex-col gap-3 h-full" style="width:380px">
    <div>
      <a-input ref="searchInputRef" spellcheck="false" v-model:value="keyword" class="h-10 rounded-lg no-drag" placeholder="搜索" @change="keywordChanged">
        <template #prefix>
          <SearchOutlined style="cursor: pointer;color: rgba(255, 255, 255, 0.4);"/>
        </template>
      </a-input>
      <div class="xt-text-2 mt-2" v-if="keyword && !myPromoKeywords.includes(keyword) && list.length">您可以将 <strong class="xt-text">{{keyword}}</strong> 关键词添加到选品，系统会将相关商品随机推荐给用户。
      <span @click="addKeyword(keyword)" class="xt-active-text pointer">添加关键词</span>
      </div>
    </div>
    <div class="mt-2 xt-text-2" v-if="!list.length">
     <xt-mix-icon :size="24" icon="fluent:note-pin-16-filled" ></xt-mix-icon> 你可以在这里挑选价格优惠的商品，添加到你的桌面当中。当其他使用你创作的桌面用户购买了你分享的商品时，你将获得一定收益！
    <div>
      1.搜索选品2.添加到选品库3.设置到商品推荐组件
    </div>

    </div>
    <div class="flex flex-1 h-0"  >
      <div class="flex-1 h-full">
        <xt-scrollbar :y="true" class=" h-full w-full">
          <div class="flex  gap-3 flex-col ">
            <GoodsList @showDetail="showDetail" :list="list"></GoodsList>
          </div>
        </xt-scrollbar>
      </div>
    </div>
  </div>
  <div class="flex flex-col xt-bg-2 p-3 rounded-lg" style="width: 373px">

    <GoodsDetail :detail="detail"></GoodsDetail>
  </div>
</template>

<script setup>
import { ref ,toRefs,onMounted} from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { goodsStore } from './goodsStore'
import GoodsDetail from './GoodsDetail.vue'
import GoodsList from './GoodsList.vue'
const keyword = ref('')
const list = ref([])
const detail = ref(null)
const { searchGoods, getDetail } = goodsStore()
const {myPromoKeywords} = toRefs(goodsStore())
import _ from 'lodash-es'
const keywordChanged = async (value) => {
  let rs = await searchGoods(keyword.value)
  if (rs.status) {
    list.value = rs.data.goods_search_response?.goods_list
  }
  console.log(rs, '搜索结果')
}
const searchInputRef=ref(null)
const showDetail = async (goodsSign) => {
  let rs = await getDetail(goodsSign)


  if (rs.status) {
    detail.value = rs.data?.goods_detail_response?.goods_details[0]
    console.log(detail.value, '详情')
  }
}
const addKeyword=(keyword)=>{
  myPromoKeywords.value.unshift(keyword)
  myPromoKeywords.value=_.uniq(myPromoKeywords.value)
}
onMounted(()=>{
    searchInputRef.value.focus()
})
</script>


