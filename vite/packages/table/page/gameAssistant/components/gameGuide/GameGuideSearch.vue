<template>
  <div class="px-4 flex flex-col">
    <div class="line-title">关键词自定义</div>

    <div class="line">当游戏名存在无法被搜索到的情况时，请手动自定义关键词</div>

    <div class="line">视频攻略关键词：</div>

    <div class="line">
      <a-input
        placeholder="视频关键词"
        style="border-radius: 12px; background: var(--secondary-bg)"
        class="no-drag h-10 w-full"
        spellcheck="false"
        v-model:value="searchValue"
      />
    </div>

    <div class="line">图文攻略关键词：</div>

    <div class="line">
      <a-input
        placeholder="图文攻略关键词"
        style="border-radius: 12px; background: var(--secondary-bg)"
        class="no-drag h-10 w-full"
        spellcheck="false"
        v-model:value="searchValue"
      />
    </div>

    <div class="line-title">搜索</div>
    <div class="line">
      <a-input
        placeholder="搜索"
        class="no-drag h-10 w-full"
        style="border-radius: 12px; background: var(--secondary-bg)"
        v-model:value="searchValue"
        spellcheck="false"
      />
    </div>
    <xt-button w="420" h="40" type="theme" :radius="8" @click="getValue">
      搜索
    </xt-button>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { steamUserStore } from "../../../../store/steamUser";
import { gameGuideStore } from "../../store/gameGuideStore";
import _ from "lodash-es";

const { proxy } = getCurrentInstance();
const emit = defineEmits(['close']);

const { localGameList, steamGameList,recentGameList } = storeToRefs(steamUserStore());
const { gameAppId } = storeToRefs(gameGuideStore());

const props = defineProps({
  searchVal: {
    type: String,
  },
});
const { searchVal } = toRefs(props);
const searchValue = ref(searchVal.value)

// 获取搜索值
const getValue = () => {
  if(searchValue !== ''){
    const found = _.find(steamGameList.value,(item)=>{
      return String(item.name) === String(searchValue.value);
    })

    if(found !== undefined){
      const isSome = _.some(recentGameList.value,(item)=>{
        return String(item.appid) === String(found?.appid);
      })
      if(!isSome){
        recentGameList.value.push(found);
      }
    }
    gameAppId.value = found?.appid;
    proxy.$bus.emit("updateGameGuide",searchValue);
    emit('close')
  }
};
</script>

<style lang="scss" scoped>
</style>