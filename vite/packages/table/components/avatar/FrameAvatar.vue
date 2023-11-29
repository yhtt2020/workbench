<!-- 带头像框组件 -->
<template>
  <tippy :z-index="9999999" :append-to="docBody" v-if="frameUrl" :trigger="frame.name?'mouseenter':''" :placement="framePlacement"  :interactive="true">
    <div style="position: relative !important;display: inline-block;zoom: 0.8;transform:translateX(0%) translateY(8%)"
         :style="{width:avatarSize+'px',height:avatarSize+'px'}">
      <transition name="fade">

        <a-avatar shape="square" :style="{'zoom':zoom}" :size="avatarSize+49" :src="frameUrl" v-if="frameUrl"
                  class="w-full h-full object-cover frame-position" style="" alt=""></a-avatar>
<!--        <RayMedal medalStyle="transform:scale(250%) !important"  :size="120"  style="transform: translateX(-20%) " :src="frameUrl">-->

<!--        </RayMedal>-->

      </transition>

      <transition name="fade">

        <a-avatar :src="avatarUrl" :style="{'zoom':zoom}" :size="avatarSize+8" class="avatar-position"></a-avatar>

      </transition>

    </div>
    <template #content>
      <div class="p-2"  v-if="frame?.name" style="width: 250px">
        <div class="mb-2">
          <a-row>
            <a-col :span="9">
              <template v-if="frame?.detail.rarity===4">
                <RayMedal medalStyle="transform:scale(250%) !important"  :size="120"  style="transform: translateX(-20%) " :src="frameUrl">

                </RayMedal>
              </template>
              <a-avatar v-else shape="square"  :size="70"  :src="frameUrl"
                        class="w-full h-full object-cover " style="" alt=""></a-avatar>
            </a-col>
            <a-col class="text-left" :span="15">
              <div class="mt-2 ">
                    <span class="avatar-font mr-2 font-bold" :style="titleTagColor(frame?.detail.rarity)">
                {{ frame?.alias }}
              </span>
                <span class="w-11 h-6 rank-font rounded my-2.5 px-1"  :style="avatarTagColor(frame?.detail.rarity)">
                {{ textTag(frame?.detail.rarity) }}
              </span>
              </div>
              <div style="font-size: 12px" class="xt-text-2 mt-1">
                {{ frame?.summary }}
              </div>

            </a-col>
          </a-row>
        </div>

       <div class="rounded-lg xt-bg-2 p-2 mb-2">
         获得方式：{{ avatarGainMethodText(frame?.detail.gainMethod) }}
       </div>


        <a-button @click="toggleStore" class="rounded-full" type="primary" block>头像框商店</a-button>
      </div>

    </template>
  </tippy>

  <div v-else :style="{width:avatarSize+'px',height:avatarSize+'px'}" style="display: inline-block">
    <a-avatar :src="avatarUrl" :style="{'zoom':zoom}" :size="avatarSize" class=""></a-avatar>
  </div>

  <!--  <Modal v-model:visible="frameStoreVisible" v-if="frameStoreVisible">-->
  <!--    <div class="card half mr-3" style="width: 370px;background: var(&#45;&#45;primary-bg);height: 100%">-->
  <!--      <FrameStoreWidget></FrameStoreWidget>-->
  <!--    </div>-->
  <!--  </Modal>-->

</template>

<script>
// import FrameStoreWidget from '../team/FrameStoreWidget.vue'
import Modal from '../Modal.vue'
import { avatarGainMethodText, avatarTagColor, textTag, titleTagColor } from '../../js/common/avatar'
import RayMedal from '../small/RayMedal.vue'

export default {
  components: { RayMedal, Modal },
  props: {
    framePlacement:{
      type:String,
      enum:[
        "auto" , "auto-start" ,"auto-end", "top", "bottom" , "right" , "left","top-start" , "top-end" , "bottom-start", "bottom-end",
        "right-start", "right-end" , "left-start" , "left-end"],
      default:'left'
    },
    frame: {
      type: Object,
      default: {}
    },
    zoom: {
      type: Number,
      default: 1
    },
    frameUrl: {
      type: String
    },
    avatarSize: {
      type: Number
    },
    avatarUrl: {
      type: String
    },
  },
  data () {
    return {
      frameStoreVisible: false,
      docBody:document.body
    }
  }

  , methods: {
    avatarGainMethodText,
    textTag,
    titleTagColor,
    avatarTagColor,
    toggleStore () {
      window.toggleFrameStore()
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-position {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(calc(-50%), calc(-50%)) !important;
  z-index: 2 !important;
}

.frame-position {
  img {
    border-radius: 0;
  }

  z-index: 3 !important;
  position: absolute !important;
  left: 50% !important;
  top: 50% !important;
  border-radius: 0 !important;
  transform: translate(calc(-50%), calc(-50%)) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
