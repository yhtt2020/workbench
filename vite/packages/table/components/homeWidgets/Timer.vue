<template>
  <HomeComponentSlot :options="options">
        <div class="timer-content ">
          <Icon
            style="
           width: 56px;
            height: 56px;
            vertical-align: middle;
            color: black;
          "
            icon="fanqie1"
          ></Icon>
          <div style="margin-top:20px;font-size: 18px;font-weight: 400;color: rgba(255, 255, 255, 0.85);">今日番茄：0</div>
          <div
            class="middle-button timer-btn suspension-item"
            @click="start"
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
