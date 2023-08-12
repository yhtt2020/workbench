<template>
  <div class="face" id="face" style="padding-left:5px;">
     <!-- 重新将UI结构样式进行修改调整 -->
    <a-tooltip title="表情"  @click="toggleShow">
      <icon icon="smile" style="width: 24px;height: 24px;color: var(--secondary-text) !important;"></icon>
    </a-tooltip>

    <!--    <i class="icon icon-face" title="表情" ></i>-->

    <main class="face-main" :class="[isH5 && 'face-H5-main']" v-show="show" ref="dialog">
      <ul class="face-list" v-for="(item, index) in list" :key="index" v-show="currentIndex === index">
        <li
          class="face-list-item"
          v-for="(childrenItem, childrenIndex) in item"
          :key="childrenIndex"
          @click="select(childrenItem, childrenIndex)"
        >
          <img v-if="index === 0" :src="emojiUrl + emojiMap[childrenItem]" />
          <img class="face-img" v-else :src="faceUrl + childrenItem + '@2x.png'" />
        </li>
      </ul>
      <ul class="face-tab">
        <li class="face-tab-item" style="background: var();" @click="selectFace(0)">
          <Icon icon="smile" style="margin-top: 12px !important; width: 30px !important;height: 30px !important;"></Icon>
          <!-- <i class="icon icon-face"></i> -->
        </li>
        <li class="face-tab-item" v-for="(item, index) in bigEmojiList" :key="index" @click="selectFace(index + 1)">
          <img :src="faceUrl + item.list[0] + '@2x.png'" />
        </li>
      </ul>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watchEffect, toRefs, computed, ref } from 'vue';
import { emojiUrl, emojiMap, emojiName, faceUrl, bigEmojiList } from '../../utils/emojiMap';
import { onClickOutside } from '@vueuse/core';
import { handleErrorPrompts } from '../../../utils';

const Face = defineComponent({
  props: {
    show: {
      type: Boolean,
      default: () => false,
    },
    isMute: {
      type: Boolean,
      default: () => false,
    },
    isH5: {
      type: Boolean,
      default: () => false,
    },
    parentID: {
      type: String,
      default: () => '',
    },
  },
  setup(props: any, ctx: any) {
    const data = reactive({
      emojiUrl,
      emojiMap,
      emojiName,
      faceUrl,
      bigEmojiList:(window as any)?.TUIKitTUICore?.isOfficial && bigEmojiList || [],
      show: false,
      currentIndex: 0,
      isMute: false,
      transDom: false,
    });

    const dialog: any = ref();

    watchEffect(() => {
      data.show = props.show;
      data.isMute = props.isMute;
    });

    const toggleShow = () => {
      const main: any = document.getElementsByClassName('face-main')[0];
      if (!data.isMute) {
        main.style.display = main.style.display === 'none' ? 'flex' : 'none';
      }
      if (main.style.display === 'none') {
        selectFace(0);
      }
      toggleH5Show();
    };

    const toggleH5Show = () => {
      const parent = document.getElementById(props.parentID);
      const main = document.getElementsByClassName('face-H5-main')[0];
      if (props.isH5) {
        parent?.appendChild(main);
      }
    };

    onClickOutside(dialog, () => {
      const main: any = document.getElementsByClassName('face-main')[0];
      if (main) {
        main.style.display = 'none';
      }
    });

    const select = async (item: string, index: number) => {
      const options: any = {
        name: item,
      };
      if (data.currentIndex === 0) {
        options.type = 'emo';
        options.url = emojiUrl + emojiMap[item];
        options.template = `<img src="${emojiUrl + emojiMap[item]}">`;
        if (!props.isH5) {
          toggleShow();
        }
        return ctx.emit('send', options);
      }
      try {
        await Face.TUIServer.sendFaceMessage({
          // Change large expression display field
          index: data.bigEmojiList[data.currentIndex - 1].icon,
          data: data.bigEmojiList[data.currentIndex - 1].list[index],
        });
      } catch (error) {
        handleErrorPrompts(error, props);
      }
      if (!props.isH5) {
        toggleShow();
      }
    };

    const list = computed(() => {
      const emojiList = [data.emojiName];
      for (let i = 0; i < data.bigEmojiList.length; i++) {
        emojiList.push(data.bigEmojiList[i].list);
      }
      return emojiList;
    });

    const selectFace = (index: number) => {
      data.currentIndex = index;
    };

    return {
      ...toRefs(data),
      toggleShow,
      select,
      selectFace,
      list,
      dialog,
    };
  },
});
export default Face;
</script>

<style lang="scss" scoped src="./style/index.scss"></style>
<style lang="scss" scoped>
:deep(.face-list){
  background: var(--secondary-bg) !important;
  &::-webkit-scrollbar{
    width: 4px !important;
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1 !important;
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1 !important;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888 !important;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555 !important;
  }
}

:deep(.face-main){
  background: var(--secondary-bg) !important;
  padding-right: 0 !important;
}

</style>