<template>
  <div class="medal-wrapper">
    <tippy trigger="mouseenter click" placement="left">
      <div class="badge-box" style="border:none;background: none;zoom: 0.5;margin: 0">
        <div style="width: 100px;height: 100px;position: relative">
          <img style="width: 100px;margin-top: 10px" :src="iconLarge">
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
            <a-col :span="24">
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
  props: ['medal'],
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

.badge-box {
  padding: 18px;
  padding-top: 10px;
  margin-top: 18px;
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
