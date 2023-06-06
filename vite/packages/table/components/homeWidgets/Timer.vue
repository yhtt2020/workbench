<template>
  <HomeComponentSlot :options="options" :customIndex="customIndex">
        <div class="timer-content ">
          <Icon
            style="
           width: 56px;
            height: 56px;
            vertical-align: middle;
            color: var(--primary-text);
          "
            icon="fanqie1"
          ></Icon>
          <div style="margin-top:20px;font-size: 18px;font-weight: 400;">今日番茄：0</div>
          <div
            class="middle-button timer-btn s-item"
            @click="start"
            style="background: var(--primary-bg);"
          >
            立即开始
          </div>
        </div>
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from "./HomeComponentSlot.vue";
export default {
  name: "Timer",
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    }
  },
  data(){
    return {
      options:{
        className:'card small',
        title:'',
        icon:'',
        type:'timer',
        noTitle:true
      },
    }
  },
  components:{
    HomeComponentSlot
  },
  methods: {
    start() {
      this.$router.push("/tomatoStart");
    },
  },
};
</script>

<style scoped lang="scss">
.timer-btn {
  margin-top: 25px;
  font-size: 18px;
  font-weight: 400;
  line-height: 48px;
  text-align: center;
  &:hover {
    background: #676767;
    font-weight: bold;
    cursor: pointer;
  }
}
.timer-content{
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
