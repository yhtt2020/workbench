<script lang="ts">
import {defineComponent} from 'vue'
import {
  avatarBgColor,
  avatarGainMethodText,
  avatarTagColor,
  drawHeaderImage,
  textTag,
  titleTagColor
} from "../../js/common/avatar";
import {mapActions, mapState} from "pinia";
import {frameStore} from "../../store/avatarFrame";
import {message} from 'ant-design-vue'
import {appStore} from "../../store";
import {teamStore} from "../../store/team";
import FrameAvatar from "../avatar/FrameAvatar.vue";
import Modal from "../Modal.vue";
import html2canvas from "html2canvas";


export default {
  name: "MyFrames",
  components: {Modal, FrameAvatar},
  data() {
    return {
      currentItem: {},
      downloadVisible: false,//下载
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      frameList: [],
      canvas:null,
      ctx:null
    }
  },
  computed: {
    ...mapState(teamStore, ['team']),
    ...mapState(appStore, ['userInfo'])
  },
  mounted() {
    this.getMyFrames().then(rs => {
      console.log('获取回的我的头像', rs)
      if (rs.status) {
        console.log(rs.data)
        this.frameList = rs.data.map(itemOwner => {

          return {
            ...itemOwner.item,
          }
        })
        console.log(this.frameList)

      }
    })
  },
  methods: {
    ...mapActions(frameStore, ['getMyFrames', 'equipFrame']),
    ...mapActions(appStore, ['getUserInfo']),
    ...mapActions(teamStore, ['refreshTeamUsers']),
    avatarTagColor, textTag, titleTagColor, avatarBgColor, avatarGainMethodText,
    async equip(item) {
      let rs = await this.equipFrame(item.nanoid)
      console.log(rs)
      if (rs && rs.status) {
        this.frameList.forEach(i => {
          i.equipped = false
        })
        item.equipped = true
        this.getUserInfo()
        this.refreshTeamUsers()
        message.success('装备成功。')
      } else {
        message.error('装备失败，请稍后再试。')
      }
    },
    unequip(item) {

    },
    download(item) {

      this.currentItem = item

      drawHeaderImage(128, 128, 80, 128, item.image, this.userInfo.avatar, (canvas, ctx) => {
        document.getElementById('downloadContainer').appendChild(canvas)
        this.canvas=canvas
        this.ctx=ctx
      })
      this.downloadVisible = true

    },
    // 下载头像实现
    async doDownload() {
      let filters = {name: '图片', extensions: ['png']}
      let savePath = await tsbApi.dialog.showSaveDialog({
        title: '选择保存位置',
        defaultPath: this.recentFileName,
        message: '选择保存的位置',
        filters: [filters],
        properties: [
          'createDirectory',
          'showOverwriteConfirmation'
        ]
      })
      const base64 = this.canvas.toDataURL('image/png',1)
      function dataURLToBlob(fileDataURL) {
        let arr = fileDataURL.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
      }
      require('fs').writeFile(savePath,Buffer.from(await dataURLToBlob(base64).arrayBuffer()), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

    }
  }
}
</script>

<template>
  <div v-if="frameList.length===0">
    <a-empty style="margin-top:40%" image="/img/test/load-ail.png" description="暂无可用头像框"/>
  </div>
  <vue-custom-scrollbar v-else @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"
                        style="flex:1;height: 0">
    <div v-for="item in frameList" class="w-full mb-3 rounded-lg flex flex-col p-3"
         :style="avatarBgColor(item.detail.rarity)">
      <div :id="'frameTop_'+item.nanoid" class="avatar-top flex mb-4">
        <div style="width: 100px;height: 100px;" :id="'frame_'+item.nanoid" class="p-3">
          <FrameAvatar :avatar-size="80" :frame-url="item.image" :avatar-url="userInfo.avatar"
                       class="w-full h-full object-fill" alt=""></FrameAvatar>
        </div>
        <div class="flex flex-col justify-center ml-4">
              <span class="avatar-font" :style="titleTagColor(item.detail.rarity)">
                {{ item.alias }}
              </span>
          <span class="w-11 h-6 rank-font rounded my-2.5" :style="avatarTagColor(item.detail.rarity)">
                {{ textTag(item.detail.rarity) }}
              </span>
          <span class="get-way-font">
                获得途径：{{ avatarGainMethodText(item.detail.gainMethod) }}
              </span>
        </div>
      </div>
      <a-row :gutter="10">
        <a-col :span="12">
          <a-button v-if="!item.equipped" @click="equip(item)" type="primary" class="rounded-xl h-12 w-full"
                    style="margin-right: 0;color: var(--active-text);">
            使用
          </a-button>
          <a-button v-else @click="unequip(item)" class="rounded-xl h-12  w-full xt-text-2"
                    style="margin-right: 0;color: var(--active-text);">
            使用中
          </a-button>
        </a-col>
        <a-col :span="12">
          <a-button @click="download(item)" class="rounded-xl h-12  w-full xt-bg xt-text-2">
            下载头像
          </a-button>
        </a-col>
      </a-row>


    </div>
  </vue-custom-scrollbar>
  <Modal blur-flag="true" v-model:visible="downloadVisible" v-if="downloadVisible">
    <div class="p-5">
      <div class="m-4" id="downloadContainer">
        <!--        <FrameAvatar id="downloadItem" :avatar-size="80"  :frame-url="currentItem.image" :avatar-url="userInfo.avatar" class="w-full h-full object-fill" alt=""></FrameAvatar>-->

      </div>
      <div class="mt-2">
        <a-button @click="doDownload" block type="primary" class="rounded-full">
          下载头像
        </a-button>
      </div>
    </div>


  </Modal>
</template>

<style scoped lang="scss">
.avatar-font {
  font-family: Oswald;
  font-size: 16px;
  font-weight: 500;
}

.rank-font {

  font-size: 14px;
  color: var(--active-text);
  font-weight: 500;
  text-align: center;
}

.get-way-font {

  font-size: 14px;
  color: var(--secondary-text);
  font-weight: 400;
}
</style>
