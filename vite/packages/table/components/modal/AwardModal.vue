<script lang="ts">
import Reward from "../../apps/task/components/Reward.vue";
import ShowReward from "../../apps/task/components/ShowReward.vue";
import TaskUserInfo from "../../apps/task/components/userinfo/TaskUserInfo.vue";
import MyProp from "../team/MyProp.vue";

export default {
  name: "AwardModal",
  components: {MyProp, TaskUserInfo, ShowReward, Reward},
  emits:['close'],
  props: {
    tip:'恭喜，您获得奖励：',
    visible:false,
    items: []
  },

  data(){
    return {
      modalVisible:false,
      itemsVisible:false,
      audio:'communityPoints'
    }
  },
  mounted() {
    this.itemsVisible=true
  },
  watch:{
    'visible':{
      handler(){
        this.modalVisible=this.visible
      }
    }
  },
  methods: {
    close(){
      this.$emit('close')
    },
    getAudio (data)  {
      //寻找对应奖励，优先展示硬币声音
      this.audio= this.items.some(item=>{
        //找出类型为经验的
        return item.originType?.type==='score' && item.originType?.id===2
      })?'communityPoints':"experience"
    }
  }
}

</script>

<template>
  <xt-modal v-if="modalVisible" :footer="0" v-model="modalVisible" index="999" @close="close">
    <div
      class=" flex justify-center items-center flex-col"
      style="width: 500px"
    >
      <audio controls class="hidden" style="" autoplay :volume="0.1">
        <source :src="'./'+audio+'.mp3'"
          type="audio/mpeg"
        />
      </audio>
      <div  class="mb-3 xt-text xt-font font-16">
        🎉<span v-html="tip"></span>
      </div>
      <transition
        name="animate__animated animate__bounce"
        enter-active-class="animate__bounceIn"
        leave-active-class="animate__bounceOut"
      >
        <div class="flex mb-5 gap-2 flex-wrap item-content" v-if="itemsVisible">
          <Reward v-for="item in items" v-bind="item"></Reward>
        </div>
      </transition>

      <TaskUserInfo :show-task-user="true" :showPointGood="true"/>
    </div>
    <div class="flex item-content mt-5">
      <div></div>
      <div class="flex items-center">
        <xt-button type="theme"  @click="close">
          开心收下
        </xt-button>
      </div>
    </div>
  </xt-modal>

</template>

<style scoped lang="scss">

</style>
