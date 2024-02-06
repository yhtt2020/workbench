<template>
  <div v-if="medal?.medal" class="medal-wrapper">
    <tippy trigger="mouseenter click" :placement="placement">
      <div class="badge-box" :style="{zoom}" style="border:none;background: none;margin: 0">
        <div :style="{width:size+'px',height:size+'px'}" style="position: relative">
          <img :style="{width:size+'px'}"  :src="iconLarge">
        </div>
      </div>
      <template #content>
        <div style="width: 280px" class="badge-box big ">
          <a-row :gap="[10,10]">
            <a-col :span="12">
              <img style="width: 110px;" :src="iconLarge">
            </a-col>
            <a-col style="line-height: 2" :span="12">
              <div style="font-size: 13px;font-weight: bold;">{{ title }}</div>
              <div class="" style="font-size: 12px;line-height: 1.5;color: #ccc">{{ summary }}</div>
            </a-col>
            <a-col :span="24" v-if="getReason">
              <div class="text-grey mt-3" style="font-size: 0.8em">获得原因：{{ getReason }}</div>
            </a-col>
          </a-row>

        </div>
      </template>
    </tippy>
  </div>
</template>

<script>
export default {
  name: 'Medal',
  props: {
    'medal':{},
    'size':100,
    'zoom':1,
    'placement':'left'
  },
  data () {
    return {
      title: '',
      summary: '',
      getReason: '',
      iconSmall: '',
      iconLarge: ''
    }
  },
  components: [],
  mounted () {
    let medal = this.medal
    if(!medal?.medal) return
    this.title = medal.medal.alias
    this.summary = medal.medal.summary
    this.getReason = medal.reason
    this.iconSmall = medal.medal.icon_sm
    this.iconLarge = medal.medal.icon_lg
  }
}
</script>

<style scoped lang="scss">
.medal-wrapper {
  display: inline-block;

  &:hover {
    .big {
      opacity: 1;

    }
  }

  .big {
    transition: opacity 0.3s ease 0.3s;
    opacity: 0;
    background: rgba(37, 37, 37, 0.6);
    backdrop-filter: blur(100px);
  }
}



.badge-box .badge-num {
  bottom: 12px;
  background-color: rgb(64, 116, 231);
  position: absolute;
  height: 10px;
  line-height: 10px;
  color: white;
  right: 14px;
  width: 15px;
  text-align: center;
  font-size: 12px;
  white-space: nowrap;
}

</style>
