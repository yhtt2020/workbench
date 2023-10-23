<template>
  <Widget :options="options" :customIndex="customIndex" :desk="desk">
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
          <div class="mt-2 item-content">
            <xt-button
              size="small"  :w="100" :h="40" type="theme"
              @click="start"
            >
              立即开始
            </xt-button>
          </div>

        </div>
  </Widget>
</template>

<script>
import Widget from "../card/Widget.vue";
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
    },
    desk: {
      type: Object,
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
    Widget
  },
  methods: {
    start() {
      this.$router.push(
        {
          name:'tomatoStart'
        }
      );
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
