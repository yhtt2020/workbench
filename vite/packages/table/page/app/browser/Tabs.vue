<script lang="ts">
import {mapActions, mapWritableState} from "pinia";
import {browserStore} from "../../../store/browser";
import BackBtn from "../../../components/comp/BackBtn.vue";
import Template from "../../../../user/pages/Template.vue";

export default {
  components: {Template, BackBtn},
  computed: {
    ...mapWritableState(browserStore, ['runningTabs','currentTab'])
  },
  methods: {
    ...mapActions(browserStore, ['updateAllCapture']),
    switchToTab(tab){
      this.currentTab=tab
      this.$router.push({
        name:'browser',
        params:{
          id:tab.id
        }
      })
    }
  },
  mounted() {
    //更新全部的截图
    this.updateAllCapture()
  }
}
</script>

<template>
  <back-btn></back-btn>
  <div class="ml-20">
    <template v-for="tab in runningTabs">

      <div @click="switchToTab(tab)" v-if="tab.url" class="s-bg p-2 rounded-md m-1 pointer" style="display: inline-block;vertical-align: top;width: 220px;">
        <div >
          <a-image  @click.stop class="mb-1 rounded-md" :width="200" :height="140" style="width: 200px;height:140px;object-fit: cover"
                   :src="'file://'+tab.capture">
          </a-image>
        </div>

        <a-tooltip :title=" tab.url.toLowerCase() ">
          <div class="mt-2 ml-1 truncate">
            <a-avatar shape="square" style="vertical-align: text-top" :size="18" :src="tab.favicons[0]" v-if="tab.favicons">
            </a-avatar>
            {{ tab.title ||'新标签页'}}
          </div>
        </a-tooltip>
      </div>

    </template>
  </div>
</template>

<style scoped lang="scss">

</style>
