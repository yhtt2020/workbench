<script lang="ts">
import {defineComponent} from 'vue'
import {message} from "ant-design-vue";
import {appStore} from "../../store";

export default defineComponent({
  name: "QueryWallpaperSettingMethod",
  data() {
    return {
      url: '',
      open: false,
    }
  },
  methods: {
    show(url) {
      this.open = true
      this.url = url
    },
    onConfirmClick(type = "common") {
      if (type === "common") {
        this.updateCommonBg(this.url);
      } else if (type === "independent") {
        // updateIndependentBg(currentImg.value);
        this.$bus.emit("setIndependentBg", this.url);
      }
      this.open = false
    },
    updateCommonBg(url) {
      if (url) {
        message.info("正在为您设置背景");
      }
      // proxy.$bus.emit("setIndependentBg",false);
      if (url.startsWith('http:') || url.startsWith('https:')) {
        appStore().setBackgroundImage({
          path: url
        });
      } else {
        appStore().setBackgroundImage({path: "", runpath: `file://${url}`});
      }
    },
    setDeskPaper() {
      this.$bus.emit("setDeskBg", this.url);
    }
  }
})
</script>

<template>
  <xt-modal
    v-model="open"
    @close="open = false"
    v-if="open"
    :index="999999"
    :mask="true"
    ref="confirm"
    title="设置壁纸"
  >

    <a-image :preview="false" class="rounded-xl mb-2" style="width: 350px;aspect-ratio: 16/9;object-fit: cover" :src="url"></a-image>
    <div class="gap-2 flex flex-col ">
      <div class="p-4 xt-bg-3 rounded-xl">
        <div class="ml-2 flex gap-1 mb-3">
          <a-avatar :size="24" src="/icons/logo128.png"></a-avatar> 设置为工作台背景
        </div>

        <div class="flex gap-2">

          <xt-button
            :w="120"
            h="40"
            class="ml-3"
            @click="onConfirmClick('common')"
          >通用桌面
          </xt-button>
          <xt-button
            :w="120"
            h="40"
            class="ml-3"
            type="theme"
            @click="onConfirmClick('independent')"
          >当前桌面
          </xt-button>
        </div>
      </div>

      <div class="p-4 xt-bg-3 rounded-xl ">
      <div class="mt-4  ml-2 flex gap-1 mb-3">
       <xt-new-icon icon="mingcute:windows-fill"></xt-new-icon> 设置为电脑壁纸
      </div>

      <xt-button
        :w="120"
        h="40"
        class="ml-3"
        @click="setDeskPaper"
      >设置
      </xt-button>

    </div>
    </div>

  </xt-modal>
</template>

<style scoped lang="scss">

</style>
