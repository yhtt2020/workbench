<template>
  <div
    class="relative  rounded-xl"
    style="
      width: 64px;
      height: 64px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    "
  >
    <div
      class="absolute right-0 top-0 text-white text-xs flex justify-center items-center z-10 px-1"
      style="
        background: #508bfe;
        width: auto;
        height: 20px;
        border-radius: 0px 10px 0px 10px;
      "
    >
      {{ item.name || name}}
    </div>
    <template v-if="type==='item'">
      <!--   道具   -->
      <Popconfirm title="新头像框Get!" ok-text="立即佩戴" cancel-text="稍后再说" @confirm="confirm" @cancel="cancel">
        <!--        <div :style="{width:`${types[type].size}px`,height:`${types[type].size}px`}"-->
        <!--        class="flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">-->
        <!--         <img :src="types[type].icon" class="w-full h-full object-cover"/>-->
        <!--        </div>-->

        <!--        <div :style="{width:`${types[type].size}px`,height:`${types[type].size}px`}"-->
        <!--             class="flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">-->
        <!--          <img :src="types[type].icon" class="w-full h-full object-cover"/>-->
        <!--        </div>-->
        <!--        {{data}}-->
        <Item :item="data" :size="64" style="width:64px;height:64px"></Item>
      </Popconfirm>
    </template>

    <template v-else-if="type==='medal'">
      <!--  勋章    -->
      <Medal :size="60" style="margin-left: 2px" :medal="{medal:data}"></Medal>
    </template>
    <template v-else>
      <!--  积分    -->
      <a-tooltip title="经验可用于社区等级提升，积分可用于积分商城兑换礼品。">
        <div :style="{width:`${item.size}px`,height:`${item.size}px`}"
             class="flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <img :src="item.icon" class="w-full h-full object-cover"/>
        </div>
      </a-tooltip>

    </template>

    <!-- <a-avatar
      shape="square"
      :size="types[type].size"
      :src="types[type].icon"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    /> -->

    <!-- <xt-ify-icon
      v-if="type == 'communityPoints' || type == 'experience'"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :icon="types[type].icon"
      size="45"
    /> -->
    <div class="absolute z-10 bottom-0 text-sm" v-if="value" style="right: 4px">
      {{ value }}
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, computed } from 'vue'
import Medal from '../../../components/team/Medal.vue'
import Item from '../../../components/Item.vue'
import { Popconfirm } from 'ant-design-vue'

const props = defineProps({
  type: {},
  name:'',
  value: {},
  flag:'',
  data: {},
  icon: {},
  claim: false,
})
const { type } = toRefs(props)

const types = {
  medal: {
    name: '勋章',
    icon: props.icon,
    size: 56,
  },
  communityPoints: {
    name: '积分',
    icon: '/img/task/communityPoints.svg',
    size: 56,
  },
  experience: {
    name: '经验',
    icon: '/img/task/experience.png',
    size: 42,
  },
  item: {
    name: '头像框',
    icon: props.icon,
    size: 56,
  },
  score: {
    icon: '/img/task/communityPoints.svg',
    size: 56,
  },
}
const item = computed(() => {
  // console.log(props.type, types[props.type], 'xuyao')
  if(props.flag==='exp'){
    return types['experience']
  }
  return types[props.type]
})
const confirm = () => {

}
</script>

<style lang="scss" scoped></style>
