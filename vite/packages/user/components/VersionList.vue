<template>
  <div style="margin-top: 10px">
    <a-empty style="margin-top: 30px" v-if="versions.length===0" description="">
    </a-empty>
    <a-timeline>
      <a-timeline-item @dblclick="restoreVersion(version)" @click="setActive(version)" v-for="version in versions" color="green">
        <div :class="{active:this.activeVersion===version}" class="version-item">
          <div class="name">{{ version.name }}</div>
          <div class="info">
            <a-tag>{{ version.count_task }}组</a-tag>
            <a-tag>{{ version.count_tab }}标签</a-tag>
          </div>
          <div class="summary" v-html="friendlyDate(version.save_time)">
          </div>
        </div>

      </a-timeline-item>
    </a-timeline>
  </div>

</template>

<script>
export default {
  name: 'VersionList',
  props: {
    versions: [],
    activeVersion: {}
  },
  data(){
    return {
      activeVersion:{}
    }
  },
  emits: ['setActive']
  , methods: {
    friendlyDate: window.tsbApi.util.friendlyDate,
    setActive (version) {
      this.activeVersion=version
      this.$emit('setActive', version)
    },
    restoreVersion(version){
      this.$emit('restoreVersion',version)
    }
  }
}
</script>

<style scoped lang="scss">
.version-item {
  cursor: pointer;
  box-sizing: border-box;
  &.active{
    border: 1px solid #c1c1c1;
    background: rgba(227, 227, 227, 0.71);
  }
  .name {
    font-size: 14px;
    font-weight: bold;
  }

  .info {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  background: rgba(243, 243, 243, 0.61);
  border-radius: 4px;
  padding: 5px;

  .summary {
    font-size: 12px;
    color: #999;
  }
}
</style>
