<template>
  <template v-if="detail">
  <div class="mb-2 relative" >

    <a-avatar :size="350" :src="detail.goods_thumbnail_url" shape="square"></a-avatar>
    <div class="xt-bg text-center pt-8 p-5 rounded-lg" style="position: absolute;right:10px;top:10px" v-if="qrcodeVisible"   :blur-flag="false" :z-index="1010">
      <a-avatar :size="120" shape="square" :src="src"></a-avatar>
      <div class="m-2">
        使用拼多多或者微信扫码下单
      </div>
      <div class="flex item-content mt-2">
        <xt-button
          class=" right-3"
          @click="qrcodeVisible=false"
          icon="fluent:dismiss-16-regular"
          w="32"
          h="32"
          radius="8"
          iconSize="16"
        ></xt-button>
      </div>
    </div>
  </div>
  <div class="xt-text-2  mb-2">
    <a-avatar :size="24" :src="detail.mall_img_url" class="mr-2" shape="square"></a-avatar>
    {{ detail.mall_name }}

    {{ detail.brand_name }}
  </div>
  <div class="text-lg mb-2">
    {{ detail.goods_name }}
  </div>
  <div class="flex gap-2 mb-2 flex-wrap">
    <template v-for="tag in detail.unified_tags">
      <div v-if="tag?.trim().length>0" class="tag px-2 px-1">
        {{ tag }}
      </div>
    </template>
    <div class="text-right flex-1 w-0 xt-text-2 text-nowrap">
      销量 {{ detail.sales_tip }}
    </div>
  </div>


  <div class="price-area flex ">
    <div class="w-1/4">
      <div class="text-xl">
        {{ detail.min_group_price / 100 }}
      </div>

      <div class="xt-text-2 text-sm">
        券后
      </div>
    </div>


    <div class="w-1/4">
      <div class="highlight text-xl">{{
          (detail.min_group_price * detail.promotion_rate / 1000 / 100).toFixed(2)
        }}
      </div>
      <div class="xt-text-2 text-sm">
        佣金
      </div>
    </div>

    <div class="w-1/4">
      <div class="text-xl highlight">{{ (detail.promotion_rate / 10).toFixed(2) }}%</div>
      <div class="xt-text-2 text-sm">
        比例
      </div>
    </div>

    <div class="w-1/4">
      <xt-button :w="80" type="theme" @click="goView(detail.goods_sign)">去购买</xt-button>
    </div>

  </div>
  </template>
  <div v-else class="p-5 text-center">
    请在左侧选择商品。
  </div>
</template>

<script setup>
import { ref,watch } from 'vue'
import { goodsStore } from './goodsStore'
import QRCode from 'qrcode'

const { generateUrl } = goodsStore()
const props = defineProps(['detail'])
const generateQRCode = async ( url,size) => {
  try {
    const options = {
      e: 'M', //容错级别
      width: size,
      height: size,
      margin: 1,
      color: {
        dark: '#000', // 像素点颜色
        light: '#fff', // 背景色
      },
    }
    return await QRCode.toDataURL(url, options)
  } catch (error) {
    console.error('Error generating QR Code:', error)
  }
}
const qrcodeVisible =ref(false)
const src = ref('')
const goView = async (goodsSign) => {
  if(!goodsSign){
    return
  }
  let rs = await generateUrl([goodsSign], true, { uid: 40708858, 'sid': '22222' })
  console.log(rs?.data, '获取到的链接')
  if (rs.status) {
    const url = rs?.data?.goods_promotion_url_generate_response?.goods_promotion_url_list[0]?.short_url
    src.value = await generateQRCode(url)
    qrcodeVisible.value=true
    //window.open(rs?.data?.goods_promotion_url_generate_response?.goods_promotion_url_list[0]?.short_url)

  }
}

watch(()=>props?.detail?.goods_sign,()=>{
  qrcodeVisible.value=false
},{
  deep:true
})

</script>

<style lang="scss" scoped>

.tag {
  background: rgba(250, 123, 20, 0.1);
  border-radius: 4px;
  color: #FA7B14
}

.price-area {
  background: var(--primary-bg-solid);
  border-radius: 8px;
  padding: 20px;
  padding-bottom: 10px;
}

.highlight {
  color: #FF4D4F
}
</style>
