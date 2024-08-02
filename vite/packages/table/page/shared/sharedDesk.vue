<script lang="ts" setup>
import Desk from "../../components/desk/Desk.vue";
import {computed, defineProps, onMounted, ref, toRef, toRefs, watch} from 'vue'
import {appStore} from '../../store'
import {useRouter} from "vue-router";

const props = defineProps({
  shareCode: {
    type: String,
  },
  sharedData: {
    type: Object
    , default: () => ({})
  }
})

const showContentDetail=ref(true)
const {userInfo} = toRefs(appStore)
const desk = ref({})
onMounted(() => {
  try {
    desk.value = JSON.parse(JSON.parse(props.sharedData.data))
    console.log(props.sharedData, 'shareddata')
  } catch (e) {
    console.error(e)
  }


})

const deskSettings = computed(() => {
  const settings = desk.value.settings
  settings.cardMargin = settings.cardMargin || 6
  settings.cardZoom = settings.cardZoom || 100
  return settings
})
const goHome = () => {
  window.$app.$router.push({name: 'home'})
}
</script>

<template>
  <div class="p-4 gap-4 flex flex-col " style="height: 100vh"   v-if="Object.keys(desk).length>0">
    <div style="flex:1;height:0">
      <Desk :freeLayout="false" v-if="Object.keys(desk).length>0" :key="shareCode" :settings="deskSettings"
            :current-desk="desk" :editing="false">
      </Desk>
    </div>
    <div style="height: 54px;overflow: visible">
      <div style="position:absolute;left: 50%;margin-left: -200px;bottom: 10px;border: 1px solid var(--divider); backdrop-filter: blur(50px);width: 400px;z-index:99"
        class="xt-bg xt-shadow rounded-2xl p-3  items-center justify-between communityNav m-auto">

        <div v-if="showContentDetail">
        <div>
          <div>
            桌面来源
          </div>

          <div @click="showContentDetail=false" style="position:absolute;right:10px;top:10px">
            <xt-mix-icon
              icon="fluent:chevron-down-24-filled"
              boxSize="32"
              style="background: none"
            />
          </div>
        </div>
        <div  class="xt-bg-2 p-2 m-4 rounded-md content-area">
          <a-row>
            <a-col :span="8">
              <img class="rounded-md w-[100px] h-[60px] object-cover"  src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Q_Cj-9a1K-qpok-mvCL"/>
            </a-col>
            <a-col :span="16">
              <div class="font-16 xt-text text-more">分享一个适合独立游戏开发者的桌面</div>
              <div>
                <a-avatar :src="sharedData.userInfo.avatar"></a-avatar> {{sharedData.userInfo.nickname}}
              </div>
            </a-col>
          </a-row>

        </div>
        </div>
        <div v-else @click="showContentDetail=true" class="xt-bg-2 rounded-lg p-1 btn-show pointer" >

          <xt-mix-icon
            icon="fluent:chevron-up-24-filled"
            color="#333"
            @click="close"
            boxSize="32"
            style="background: none"
          />

        </div>
        <div class="flex">
          <div class="flex items-center">
            <div @click="goHome" class="communityNav-more pointer"><!--teleport start--><!--teleport end-->
              <div class="relative  items-center justify-center content-item"
                   style="border-radius: 12px; width: 54px; height:54px;"><span
                class="ant-avatar ant-avatar-square ant-avatar-image"
                style="width: 54px; height: 54px; line-height: 54px; font-size: 18px; border-radius: 12px;"><img
                src="/logo/home.svg"></span>
              </div>
            </div>
            <div class="ant-divider ant-divider-vertical" role="separator"
                 style="height: 32px; margin: 0px 14px; border-top: 1px solid var(--divider) !important;"><!----></div>
          </div>
          <div class="flex pointer" style="gap: 20px;"><!---->
            <div class="relative flex items-center justify-center collect-icon"
                 style="border-radius: 12px; width: 150px; height: 54px;">
              <xt-new-icon icon="fluent:collections-16-regular">
              </xt-new-icon>&nbsp;
              收藏此桌面&nbsp;
              {{ sharedData.collectCount || 0 }}
            </div><!---->
            <div class="relative flex items-center justify-center"
                 style="border-radius: 12px; width: 54px; height: 54px;">
              <xt-new-icon icon="fluent:thumb-like-16-regular">
              </xt-new-icon>&nbsp;
              {{ sharedData.supportCount || 0 }}
            </div><!---->
            <div class="relative flex items-center justify-center"
                 style="border-radius: 12px; width: 54px; height: 54px;">
              <xt-new-icon icon="fluent:comment-multiple-16-regular">
              </xt-new-icon>&nbsp;
              {{ sharedData.collectCount || 0 }}
            </div>
          </div>
          <div v-if="sharedData.uid===userInfo?.uid">
            操作面板
          </div>
        </div>
      </div>
    </div>
  </div>



  <!--  <Desk-->
  <!--    :muuriOptions="muuriOptions"-->
  <!--    :freeLayout="false"-->
  <!--    :currentDesk="displayScheme"-->
  <!--    :settings="displayScheme.settings"-->
  <!--    :notTrigger="true"-->
  <!--    :editing="false"-->
  <!--  ></Desk>-->
</template>

<style scoped lang="scss">
.collect-icon {
  &:hover{
    opacity: .9;
  }
  background: var(--active-bg);
  color: var(--active-text);
}
.content-area:hover{
  opacity: .9;
}
.btn-show{
  position: absolute;
  right: -55px;
  margin-left: -10px;
  top: 12px;
  width: 40px;
  height: 40px;
  border: 1px solid var(--divider);
}
</style>
