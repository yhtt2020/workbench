<script lang="ts" setup>
import Desk from "../../components/desk/Desk.vue";
import {computed, defineProps, h, onMounted, onUnmounted, ref, toRef, toRefs, watch} from 'vue'
import {appStore} from '../../store'
import {useRouter} from "vue-router";
import {nanoid} from "nanoid";
import {cardStore} from "../../store/card";
import ThreadSelect from "../../components/sns/ThreadSelect.vue";
import {apiPost} from "../../js/axios/request";
import {Button, message, notification} from "ant-design-vue";
import Interaction from "../../components/sns/Interaction.vue";
import shareHelper from "../../js/lib/shareHelper";
import ExtraMenu from "../../components/windowPanel/components/ExtraMenu.vue";
import {useAddCard, useAppModal} from "../../hooks";
import {useCustomLayout} from "../../components/desk/freeLayout/useCustomLayout";
import {headerData, mainData} from "../../components/desk/freeLayout/config";
import EditNewNavigation from "../../components/desk/addIcon/EditNewNavigation.vue";
import {registerFolder} from "../../apps/folder/src/hooks/register";
const isFreeLayout=ref(false)//todo 完成自由桌面

const addCardVisible=ref(false)
const editVisible=ref(false)

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
const selectThreadId = ref('')
const {userInfo} = toRefs(appStore())
const desk = ref({})
const canEdit = ref(false)
const threadInfo = ref({})
onMounted(() => {
  try {
    desk.value = JSON.parse(JSON.parse(props.sharedData.data))
    document.title=(props.sharedData.title||'桌面分享') +' - 分享桌面'
    console.log(props.sharedData, 'shareddata')
    if (props.sharedData.threadId) {
      threadInfo.value = JSON.parse(props.sharedData.threadInfo)
    }
  } catch (e) {
    console.error(e)
  }

  canEdit.value = userInfo.value.uid === props.sharedData.uid

  menus.value=deskMenus()
})
function deskMenus() {
  let currentHide = false;
  // if (this.isFreeLayout) {
  //   currentHide = this.getFreeLayoutState?.system?.hide;
  // } else {
  //   currentHide = this.hide;
  // }
  if(canEdit.value){
    return [
      {
        id: 1,
        newIcon: "fluent:add-16-filled",
        name: "添加图标",
        fn: newAddIcon,
      },
      {
        id: 2,
        newIcon: "fluent:collections-add-24-regular",
        name: "添加小组件",
        fn: newAddCard,
      },
      {
        id: 3,
        newIcon: "fluent:apps-add-in-20-filled",
        name: "添加更多",
        children: [
          {
            id: 2,
            newIcon: "fluent:app-folder-16-regular",
            name: "添加图标分组",
            fn: addFolder,
          },
          // {
          //   id: 3,
          //   newIcon: "mingcute:windows-line",
          //   name: "导入系统桌面图标",
          //   fn: this.arrange,
          //   disabled: !window.$usePlat("client"),
          // },
        ],
      },
      // { id: 5, divider: true },
      // {
      //   id: 5.1,
      //   newIcon: "fluent:glance-horizontal-16-regular",
      //   name: "整理桌面",
      //   disabled: !isFreeLayout.value,
      //   fn: () => {
      //     window.$ui.confirm(
      //       "整理桌面",
      //       `整理桌面会将当前自由布局卡片重新规整排列`,
      //       {
      //         ok: () => {
      //           useCustomLayout({
      //             mainList: desk.value.cards,
      //             // test: false,
      //             cb: (position) => {
      //               this.$bus.emit("cutCanvas", position);
      //             },
      //           });
      //         },
      //         type: "warning",
      //       }
      //     );
      //   },
      // },
      // {
      //   id: 6,
      //   newIcon: editing.value
      //     ? "fluent:record-stop-16-regular"
      //     : "fluent:window-new-16-regular",
      //   name: editing.value ? "停止调整" : "调整桌面布局",
      //   fn: toggleEditing,
      // },
      // {
      //   id: 7,
      //   newIcon: "fluent:resize-large-16-regular",
      //   name: "复原桌面位置",
      //   disabled: isFreeLayout.value ? false : true,
      //   fn: this.freeLayoutScrollbarRedirect,
      // },
      // {
      //   id: 9,
      //   newIcon: "fluent:image-multiple-16-regular",
      //   name: "更换壁纸",
      //   fn: () => {
      //     const { openApp } = useAppModal("galleryModalApp");
      //     openApp();
      //   },
      // },
      // {
      //   id: 20,
      //   newIcon: "fluent:more-horizontal-16-filled",
      //   name: "更多",
      //   lock: true,
      //   children: [
      //     {
      //       id: 0,
      //       newIcon: "fluent:settings-16-regular",
      //       name: "系统设置",
      //       fn: () => {
      //         this.$bus.emit("openSystemSet");
      //       },
      //       // disabled: import.meta.env.DEV ? false : true,
      //     },
      //     {
      //       id: 1,
      //       newIcon: "fluent:settings-16-regular",
      //       name: "桌面设置",
      //       fn: this.showSetting,
      //     },
      //     {
      //       id: 7,
      //       newIcon: this.hide
      //         ? "fluent:eye-16-regular"
      //         : "fluent:eye-off-16-regular",
      //       name: currentHide ? "显示小组件" : "隐藏小组件",
      //       fn: () => {
      //         // if (this.isFreeLayout) {
      //         //   this.getFreeLayoutState.system.hide =
      //         //     !this.getFreeLayoutState?.system?.hide;
      //         // } else {
      //         //   if (this.hide) {
      //         //     this.showDesk();
      //         //   } else {
      //         //     this.hideDesk();
      //         //   }
      //         // }
      //       },
      //       disabled: false,
      //     },
      //   ],
      // },
    ];
  }else{
    return []
  }

}
const editModalVisible = ref(false)
const menus=ref([])


const deskSettings = computed(() => {
  const settings = desk.value.settings
  settings.cardMargin = settings.cardMargin || 6
  settings.cardZoom = settings.cardZoom || 100
  return settings
})
const goHome = () => {
  window.$app.$router.push({name: 'home'})
}
const hideTip = ref(localStorage.getItem('hideSourceTip') === '1')
const editing = ref(false)
const setHideTip = () => {
  localStorage.setItem('hideSourceTip', '1')
  hideTip.value = true
}
const setShowTip = () => {
  if (hideTip.value === true) {
    localStorage.removeItem('hideSourceTip')
    hideTip.value = false
  } else {
    setHideTip()
  }
}
const  newAddIcon=()=> {
  deskRef.value.newAddIcon()
}
// 添加图标
// const addIcon=()=> {
//   deskRef.value.newAddIcon();
// }
const newAddCard=()=> {
  deskRef.value.newAddCard()
}
const  addFolder=()=> {
  registerFolder(desk.value);
}

const toggleEditing=()=>{
  if (this.editing) {
    if (this.editing) {
      message.info("已关闭拖拽调整");
    } else {
      message.info("您可以直接拖拽图标调整位置");
    }
  }
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
  g.name = '保存的桌面'
  g.new = true
  // g.settings.zoom = parseInt(cardZoom);
  g.id = nanoid(8);

  const now = new Date().getTime();
  // 将导入的便签重新修改时间
  g?.cards?.forEach((item, index) => {
    //移除桌面相关的便签卡片
    let i=0
    if (item.name === "notes" && ! $usePlat('client')) {
      let time=now+i
      i++
      const obj = {
        ...item,
        id: nanoid(8),
        _id: "note:" + time,
        createTime: time,
        updateTime: time,
        isDelete: false,
        deskId: g.id,
        deskName: g.name,
      };
      if ($usePlat('client')) {
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
const liked = ref(props.sharedData.liked)

const doLike = async () => {
  let rs = await apiPost('/app/like/doLike', {
    "businessId": "10001",
    "entityId": props.shareCode,
    like: 1
  })
  if (rs.status) {
    if (rs.data.like === 1) {
      props.sharedData.likeCount++
      liked.value = true
      message.success('点赞成功')
    } else {
      props.sharedData.likeCount--
      liked.value = false
      message.success('取消点赞成功')
    }
  } else {
    message.error('操作失败')
  }
}


const setThreadId = async (val) => {
  if (val === undefined) {
    if (selectThreadId.value === undefined) {
      message.error('未设置有效内容ID')
      return
    }
    val = selectThreadId.value
  }
  val = Number(val)
  if (val === 0) {
    let rs = await apiPost('/app/share/edit', {
      code: props.shareCode,
      threadId: 0
    })
    if (rs.status) {
      props.sharedData.threadId = 0
      props.sharedData.threadInfo = {}
      selectThreadId.value = ''
      threadInfo.value = {}
      message.success('取消关联帖子成功')
    } else {
      message.error('取消关联帖子失败')
    }
  } else {

    let rs = await apiPost('/app/share/edit', {
      code: props.shareCode,
      threadId: val
    })
    if (rs.status) {
      props.sharedData.threadId = val
      threadInfo.value = JSON.parse(rs.data.threadInfo)
      message.success('关联帖子成功')
    } else {
      message.error('关联帖子失败')
    }
  }

}
const intRef = ref();
const publish = () => {
  intRef.value.showPublish()
}
const showThreadDetail = () => {
  intRef.value.showThreadDetail(threadInfo.value.id)
}
const publishOk = async (data) => {
  console.log('网上传3', data)
  await setThreadId(data.thread_id)
}
const hasToSave = ref(false)
const changeEdit = () => {
  if (canEdit) {
    editing.value = !editing.value
    if (editing.value) {

      notification.info({
        message: '分享小助手',
        description:
          '您已进入编辑模式，别忘了点击保存按钮保存桌面布局。',
        onClick: () => {
        }
      })
    } else {
      notification.info({
        message: '分享小助手',
        description:
          '您已经退出编辑模式，已为您用红色标记保存按钮，别忘了点击保存按钮保存桌面布局。',
      })
      hasToSave.value = true
    }
  } else {
    message.error('您不是此分享链接的创建者，无法进行编辑，您可以尝试保存此桌面，然后自行修改。')
  }
}
const getShareDeskData = (removeData = true) => {
  let cloneDesk = JSON.parse(JSON.stringify(desk.value))
  if (removeData) {
    //如果选择不保留数据，则进行清理，此处要对不同的组件进行不同的清理数据处理，不能一概而论
    cloneDesk.cards.forEach((item, index) => {
      if (item.name !== 'folder') {
        item.customData = {}
      }
    })
  }
  cloneDesk.cards.forEach((item, index) => {
    delete item._$muuri_id
  })

  let settings = {}
  if (cloneDesk.settings?.enableZoom) {
    settings = cloneDesk.settings
  } else {
    settings = this.settings
  }
  // settings.cardZoom = Number(settings.cardZoom) * Number(this.shareFullCardZoom)
  // settings.cardMargin = Number(settings.cardMargin) * Number(this.shareFullCardZoom)
  const template = JSON.stringify({
    cards: cloneDesk.cards,
    settings: settings,
    customData: {}
  })
  return template
}
const save = async () => {
  let rs = await apiPost('/app/share/edit', {
    code: props.shareCode,
    data: getShareDeskData(false)
  })
  if (rs.status) {
    hasToSave.value = false
    message.success('保存成功')
  } else {
    message.error('保存失败')
  }
}
const showEditModal = () => {
  form.value.title = props.sharedData.title
  form.value.summary = props.sharedData.summary
  editModalVisible.value = true
}
const saveEdit = async () => {
  let rs = await apiPost('/app/share/edit', {
    code: props.shareCode,
    title: form.value.title,
    summary: form.value.summary
  })
  if (rs.status) {
    editModalVisible.value = false
    props.sharedData.title = form.value.title
    props.sharedData.summary = form.value.summary
    document.title=props.sharedData.title +' - 分享桌面'
    message.success('保存成功')
  } else {
    message.error('保存失败')
  }
}
const remove = () => {
  let code = props.shareCode
  window.$ui.confirm(
    '删除确认',
    "确定删除此记录，删除后，分享链接将彻底失效。此操作不可撤销！",
    {
      noText: '立即删除',
      okText: '取消',
      no: () => {
        shareHelper.remove(code).then(data => {
          if (data.status) {
            message.success('删除成功，即将跳转回首页')
            setTimeout(() => {
              goHome()
            }, 3000)

          } else {
            message.error('删除失败')
          }
        })
      },
      okButtonWidth: '95',
      noButtonWidth: '95',
    })
}
const form = ref({
  title: '',
  summary: ''
})
onUnmounted(()=>{
    document.title='天天工作台'

})

const deskRef=ref()

</script>

<template>
  <div class="p-4 gap-4 flex flex-col " style="height: 100vh" v-if="Object.keys(desk).length>0">
    <div style="flex:1;height:0">
      <xt-mix-menu ref="mixMenu" :menus="menus" class="w-full h-full">
        <!-- 导航栏 -->
        <template #extraMenu>
          <ExtraMenu/>
        </template>
      <Desk ref="deskRef" :global-settings="{cardZoom:100}" :freeLayout="false" v-if="Object.keys(desk).length>0" :key="shareCode" v-model:settings="deskSettings"
            :current-desk="desk" :editing="editing" @changeEditing="changeEdit">
      </Desk>
      </xt-mix-menu>
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
          <div @click="showThreadDetail" v-if="sharedData.threadId"
               class="xt-bg-2 p-2 m-4 rounded-md content-area pointer relative">
            <a-row>
              <a-col :span="8" v-if="threadInfo.cover">
                <img class="rounded-md w-[100px] h-[60px] object-cover"
                     :src="threadInfo.cover"/>
              </a-col>
              <a-col :span="threadInfo.cover?16:24">
                <div class="font-16 xt-text text-more">{{ threadInfo.title }}</div>
                <div>
                  <a-avatar :src="sharedData.userInfo.avatar"></a-avatar>
                  {{ sharedData.userInfo.nickname }}
                </div>
              </a-col>
            </a-row>
            <div v-if="canEdit" @click.stop="setThreadId(0)" style="position:absolute;right:-15px;top:-15px">
              <xt-mix-icon
                icon="fluent:dismiss-16-filled"
                boxSize="32"
                style="background: none"
              />
            </div>
          </div>
          <div v-else-if="canEdit && !hideTip" class="xt-bg-2 p-2 m-4 rounded-md content-area">
            <div class="font-16 xt-text text-more">此桌面暂未关联内容</div>
            <div class="font-14 xt-text-2">
              您可以在元社区发表任意内容，发表内容会自动与此桌面进行关联。可大大增加桌面曝光。
            </div>
            <div class="m-2">
              <ThreadSelect v-model:value="selectThreadId"></ThreadSelect>
            </div>
            <a-row>

              <div class="flex gap-2 m-2">
                <xt-button size="md" @click="setHideTip" type="default">不再提示</xt-button>
                <xt-button size="md" @click="setThreadId" type="theme">确认关联</xt-button>
              </div>

            </a-row>


          </div>
          <div v-if="!sharedData.threadId" class="flex gap-2 m-2">
            <xt-button @click="publish" block size="md" type="theme">发内容并关联</xt-button>
          </div>
          <div class="flex gap-1 m-2" v-if="canEdit">
            <xt-button ifyIcon="fluent:sound-source-20-filled" @click="setShowTip">来源</xt-button>
            <xt-button @click="showEditModal" ifyIcon="fluent:document-edit-16-filled">编辑</xt-button>
            <xt-button @click="save"
                       :type="hasToSave?'error':'default'"
                       ifyIcon="fluent:save-16-filled">保存
            </xt-button>
            <xt-button @click="remove" ifyIcon="fluent:delete-16-filled">删除</xt-button>
          </div>
        </div>
        <div v-if="!showContentDetail && (sharedData.threadInfo || canEdit)" @click="showContentDetail=true"
             class="xt-bg-2 rounded-lg p-1 btn-show pointer">

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
              <xt-new-icon v-else icon="fluent:thumb-like-16-regular">
              </xt-new-icon>&nbsp;
              {{ sharedData.likeCount || '' }}
            </div><!---->

            <template v-if="sharedData.threadId">
              <div @click="showThreadDetail" class="relative flex items-center justify-center"
                   style="border-radius: 12px; width: 54px; height: 54px;">
                <xt-new-icon icon="fluent:comment-multiple-16-regular">
                </xt-new-icon>&nbsp;
                {{ threadInfo.replyCount || '' }}
              </div>
            </template>

          </div>
        </div>
      </div>
    </div>
  </div>

  <xt-modal v-model="editModalVisible" custom
            boxClass="rounded-xl"
            :mask="true"
            :index="850">
    <div style="width: 400px" class="p-4">
      <h2 style="text-align: center" class="mb-3">编辑分享桌面信息</h2>
      <div class="p-4 mb-4 text-base xt-bg-2 rounded-xl">
        <div class="mb-4">分享标题</div>
        <xt-input v-model="form.title" class="xt-modal xt-b mb-4"
                  placeholder="输入一个标题，用于显示在网页"></xt-input>
        <div class="mb-4">介绍内容</div>
        <xt-textarea v-model:data="form.summary" class="xt-modal xt-b mb-4" placeholder="输入介绍"></xt-textarea>
      </div>
      <div class="flex gap-8 justify-center">
        <xt-button @click="saveEdit" type="theme">保存</xt-button>
        <xt-button @click="editModalVisible=false" type="default">取消</xt-button>
      </div>

    </div>
  </xt-modal>
  <Interaction ref="intRef" @publishOk="publishOk"></Interaction>
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
