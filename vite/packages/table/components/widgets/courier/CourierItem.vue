<template>
  <div class="flex flex-col w-full mt-2 pointer courier">

    <div class="flex w-full">
      <div class="mr-4">
        <Cover :cover="courier.cover" :store="courier.store"></Cover>
      </div>
      <div class="w-full">
        <div class="flex justify-between">
          <div class="flex items-center">
            <div class="commerce-small" v-if="courier.store==='tb'"
                 style="background-color: #FA5000;color: rgba(255,255,255,0.85);"
            >淘
            </div>
            <div class=" commerce-small" v-if="courier.store==='jd'"
                 style="background-color: #E12419;color: rgba(255,255,255,0.85);"
            >JD
            </div>
            <div style="font-size: 16px;" class="mr-2 xt-text truncate w-4/5" :title="courier.title">
              {{ courier.title?.slice(0, 20) }}
            </div>
            <newIcon v-if="courier.followed" icon="fluent:star-16-filled" style="color:var(--warning);"/>
          </div>

          <div class="flex xt-text-2" style="font-size: 14px;text-align: center;">

            <div class="flex items-center pl-1 pr-1 rounded-md" :style="{ 'background': stateColors }"
                 style="color: rgba(255,255,255,0.85);">
              {{ switchState }}
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-1">
          <div class="flex">
            <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2 xt-text-2">
              {{ switchCompany }}
            </div>
            <!-- v-if="props?.courier.parentId" -->
            <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2 xt-text-2"
                 v-if="courier.content.parentOrderId">
              拆
            </div>
          </div>

          <div class="xt-text" v-if="courier.content.arrivalAt">
            {{ courier.content.arrivalAt }}
          </div>
        </div>

      </div>

    </div>
    <template v-if="courier.store==='jd' && courier.content?.latestNodes.length>0">
      <div class="mt-2 xt-text-2" style="font-size: 14px;">
        {{ courier.content.latestNodes[0].time }}
      </div>
      <div class="mt-2 xt-text omit" style="font-size: 14px;">
        {{ courier.content.latestNodes[0].txt }}
      </div>
    </template>
    <div v-if="!courier.store && courier.content.Traces?.length>0" class="mt-2 xt-text-2" style="font-size: 14px;">
      {{ lastTraces?.AcceptTime }}
    </div>
    <div class="mt-2 xt-text omit" style="font-size: 14px;">
      {{ lastTraces?.AcceptStation }}
    </div>


  </div>
  <!-- <a-divider style="height: 1px; background-color: var(--divider)" /> -->
  <!-- <hr class="divider"> -->
  <!-- <div class="divider"></div> -->

</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon as newIcon } from '@iconify/vue'
import { kdCompany, kdState, switchColor } from './mock'
import { courierStore } from '../../../apps/ecommerce/courier.ts'
import { appStore } from '../../../store'
import { autoCancelTime } from './courierModal/modalMock'
import Cover from './component/Cover.vue'

const props = defineProps({
  courier: Object,
  itemIndex: Number
})
const courier = props.courier
// console.log('查看数据',props.courier);
const useCourierStore = courierStore()
const useAppStore = appStore()
const stateColors = computed(() => {
  return switchColor(courier.content?.State)
})

const switchState = computed(() => {
  console.log(courier)
  if (courier.store) {
    return courier.content.status
  } else
    return kdState(courier.content?.State)
})

const switchCompany = computed(() => {
  if (courier.store) {
    if (courier.store === 'jd') {
      if (courier.content.expressType) {
        return courier.content.expressType
      } else {
        return '京东快递'
      }
    }

  } else {
    return kdCompany(courier.content?.ShipperCode)
  }

})

const orderDetail = ref({})

const courierTitle = computed(() => {

  const orderNum = props.courier?.LogisticCode
  const changCode = props.title  //`${currentDetail.slice(0, 4)}-${currentDetail.slice(-4)}`
  return changCode
})

const lastTraces = ref(null)

const newTraces = computed(() => {
  let content = courier.content
  switch (content?.State) {
    case '3':
      return {
        AcceptStation: content.Traces[content.Traces.length - 1]?.AcceptStation,
        AcceptTime: content.Traces[content.Traces.length - 1]?.AcceptTime
      }
    case '2':
      return {
        AcceptStation: content.Traces[0]?.AcceptStation,
        AcceptTime: content.Traces[0]?.AcceptTime
      }
  }
})

lastTraces.value = newTraces.value
// const deleteTime=computed(()=>{
//     switch (useAppStore.settings.courierSigned.courierTime) {
//         case '24小时':
//             return 24 * 60 * 60 * 1000
//             break;
//         case '48小时':
//             return 48 * 60 * 60 * 1000
//             break;
//         case '一周':
//             return 7 * 24 * 60 * 60 * 1000
//             break;
//         default:24 * 60 * 60 * 1000
//             break;
//     }
// })
const cancelTime = autoCancelTime.filter((item) => {
  return item.value === useAppStore.settings.courierSigned.courierTime
})
onMounted(() => {
  // console.log(lastTraces?.value.AcceptTime)
  // console.log(new Date(lastTraces?.value.AcceptTime).getTime())
  let nowDate = new Date().getTime()

  if (nowDate - new Date(lastTraces?.value?.AcceptTime).getTime() > (cancelTime[0].type)) {
    console.log('过期了', props.itemIndex)
    if (useAppStore.settings.courierSigned.blockSigned && props?.courier?.State === '3') {
      useCourierStore.removeDbData(props.itemIndex)
    }

  } else {
    console.log('没过期')
  }
  // console.log(cancelTime[0].type,'查看是否过期了');
})

</script>

<style lang='scss' scoped>
.omit {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.courier {
  // border: 1px solid var(--divider);
  border-radius: 12px;
  padding: 12px;
  transform: all 0.3s;
  // border-bottom: 1px solid var(--divider);
  &:hover {
    background-color: var(--active-secondary-bg);
  }

  // &::after{
  //     content: '';
  //     display: block;
  //     width: 100%;
  //     height: 1px;
  //     background-color: var(--divider);
  // }

}

.divider {
  width: 100%;
  height: 1px;
  background-color: var(--divider);
  margin-top: 6px;
}

.commerce {
  &-small {
    width: 24px;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    margin-right: 6px;
    text-align: center;
    color: var(--primary-text);
    border-radius: 6px;
  }
}</style>
