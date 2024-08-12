<script lang="ts" setup>
import Desk from "../../components/desk/Desk.vue";
import {computed, defineProps, onMounted, ref, toRef, toRefs, watch} from 'vue'
import {appStore} from '../../store'
import {useRouter} from "vue-router";
import {nanoid} from "nanoid";
import {cardStore} from "../../store/card";
import ThreadSelect from "../../components/sns/ThreadSelect.vue";
import {apiPost} from "../../js/axios/request";
import {message} from "ant-design-vue";

const props = defineProps({
  shareCode: {
    type: String,
  },
  sharedData: {
    type: Object
    , default: () => ({})
  }
})

const showContentDetail = ref(true)
const {userInfo} = toRefs(appStore())
const desk = ref({})
const canEdit=ref(false)
onMounted(() => {
  try {
    desk.value = JSON.parse(JSON.parse(props.sharedData.data))
    console.log(props.sharedData, 'shareddata')
  } catch (e) {
    console.error(e)
  }

  canEdit.value= userInfo.value.uid===props.sharedData.uid

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
const hideTip=ref(localStorage.getItem('hideSourceTip')==='1')

const setHideTip=()=>{
  localStorage.setItem('hideSourceTip','1')
  hideTip.value=true
}
const setShowTip=()=>{
  localStorage.removeItem('hideSourceTip')
  hideTip.value=false
}
const saveDesk = () => {
  let g = desk.value
  const {freeLayoutState, freeLayoutData} = g

  let oldId = g.id;
  //修正一下老版本导出的数据
  if (g.cardsHeight) {
    g.deskHeight = g.cardsHeight;
  }
  if (g.settings.cardZoom) {
    g.settings.zoom = g.settings.cardZoom;
  }
  // let cardZoom = (
  //   (g.settings.zoom * cardsHeight) /
  //   g.deskHeight
  // ).toFixed();
  g.icon = "desktop";
  g.name='保存的桌面'
  g.new=true
  // g.settings.zoom = parseInt(cardZoom);
  g.id = nanoid(8);
  // 将导入的便签重新修改时间
  g?.cards?.forEach((item, index) => {
    //移除桌面相关的便签卡片
    if (item.name === "notes" && !this.$usePlat('client')) {
      const now = new Date().getTime();
      const obj = {
        ...item,
        id: now,
        _id: "note:" + now,
        createTime: now,
        updateTime: now,
        isDelete: false,
        deskId: g.id,
        deskName: g.name,
      };
      if (!this.$usePlat('client')) {
        tsbApi.db.put(obj);
      }
      g.cards[index] = obj;
    }
  });

  // if (freeLayoutState[oldId]) {
  //   this.freeLayoutData[g.id] = freeLayoutData[oldId];
  //   this.freeLayoutState[g.id] = freeLayoutState[oldId];
  // }
  cardStore().desks.unshift(g);
  $ui.confirm('桌面保存成功', '已为您成功保存桌面，您可以在个人首页看到保存的桌面，点击确认切换到个人主页。', {
    mask: true,
    no: () => {

    },
    ok: () => {
      $app.$router.push({
        name: 'home'
      })
    },
  })

}
const liked=ref(props.sharedData.liked)

const doLike=async () => {
  let rs = await apiPost('/app/like/doLike', {
    "businessId": "10001",
    "entityId": props.shareCode,
    like:1
  })
  if(rs.status){
    if(rs.data.like===1){
      props.sharedData.likeCount++
      liked.value=true
      message.success('点赞成功')
    }else{
      props.sharedData.likeCount--
      liked.value=false
      message.success('取消点赞成功')
    }
  }else{
    message.error('操作失败')
  }
}
</script>

<template>
  <div class="p-4 gap-4 flex flex-col " style="height: 100vh" v-if="Object.keys(desk).length>0">
    <div style="flex:1;height:0">
      <Desk :freeLayout="false" v-if="Object.keys(desk).length>0" :key="shareCode" :settings="deskSettings"
            :current-desk="desk" :editing="false">
      </Desk>
    </div>
    <div style="height: 54px;overflow: visible">
      <div
        style="position:absolute;left: 50%;margin-left: -200px;bottom: 10px;border: 1px solid var(--divider); backdrop-filter: blur(50px);width: 400px;z-index:99"
        class="xt-bg xt-shadow rounded-2xl p-3  items-center justify-between communityNav m-auto">

        <div v-if="showContentDetail && (sharedData.threadInfo || canEdit)">

          <div>
            <div v-if="canEdit">
              管理面板
            </div>
            <div v-else>
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
          <div v-if="sharedData.threadInfo" class="xt-bg-2 p-2 m-4 rounded-md content-area">
            <a-row >
              <a-col :span="8">
                <img class="rounded-md w-[100px] h-[60px] object-cover"
                     src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Q_Cj-9a1K-qpok-mvCL"/>
              </a-col>
              <a-col :span="16">
                <div class="font-16 xt-text text-more">分享一个适合独立游戏开发者的桌面</div>
                <div>
                  <a-avatar :src="sharedData.userInfo.avatar"></a-avatar>
                  {{ sharedData.userInfo.nickname }}
                </div>
              </a-col>
            </a-row>
          </div>
          <div v-else-if="canEdit && !hideTip" class="xt-bg-2 p-2 m-4 rounded-md content-area">
            <div class="font-16 xt-text text-more">此桌面暂未关联内容</div>
            <div class="font-14 xt-text-2">您可以在元社区发表任意内容，发表内容会自动与此桌面进行关联。可大大增加桌面曝光。</div>
            <div  class="m-2">
              <div>请输入帖子id或者帖子标题进行查找。</div>
              <ThreadSelect ></ThreadSelect>
            </div>
            <a-row >

              <div class="flex gap-2 m-2">
                <xt-button size="md" @click="setHideTip" type="default">不再提示</xt-button>    <xt-button size="md" @click="" type="theme">确认关联</xt-button>   <xt-button  size="md" @click="" type="theme">发内容</xt-button>
              </div>

            </a-row>


          </div>
          <div class="flex gap-1 m-2" v-if="canEdit">
            <xt-button ifyIcon="fluent:sound-source-20-filled"  @click="setShowTip">来源</xt-button>  <xt-button ifyIcon="fluent:document-edit-16-filled" >编辑</xt-button>  <xt-button ifyIcon="fluent:save-16-filled" >保存</xt-button>  <xt-button ifyIcon="fluent:delete-16-filled" >删除</xt-button>
          </div>
        </div>
        <div v-if="!showContentDetail && (sharedData.threadInfo || canEdit)" @click="showContentDetail=true" class="xt-bg-2 rounded-lg p-1 btn-show pointer">

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
            <div @click="saveDesk" class="relative flex items-center justify-center collect-icon"
                 style="border-radius: 12px; width: 150px; height: 54px;">
              <xt-new-icon icon="fluent:collections-16-regular">
              </xt-new-icon>&nbsp;
              保存此桌面&nbsp;
              {{ sharedData.collectCount || '' }}
            </div><!---->
            <div @click="doLike" class="relative flex items-center justify-center"
                 style="border-radius: 12px; width: 54px; height: 54px;">

              <xt-new-icon v-if="liked" icon="fluent:thumb-like-16-filled">
              </xt-new-icon>&nbsp;
              <xt-new-icon v-else  icon="fluent:thumb-like-16-regular">
              </xt-new-icon>&nbsp;
              {{ sharedData.likeCount || '' }}
            </div><!---->
            <div class="relative flex items-center justify-center"
                 style="border-radius: 12px; width: 54px; height: 54px;">
              <xt-new-icon icon="fluent:comment-multiple-16-regular">
              </xt-new-icon>&nbsp;
              {{ sharedData.collectCount || '' }}
            </div>
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
  &:hover {
    opacity: .9;
  }

  background: var(--active-bg);
  color: var(--active-text);
}

.content-area:hover {
  opacity: .9;
}

.btn-show {
  position: absolute;
  right: -55px;
  margin-left: -10px;
  top: 12px;
  width: 40px;
  height: 40px;
  border: 1px solid var(--divider);
}
</style>
