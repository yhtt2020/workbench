<template>
  <a-row v-if="stage.data" :gutter="10">
    <a-col :span="5">
      <div :style="{background: stage.data.bg}" class="text-xl stage">S{{stage.no}}</div>
    </a-col>
    <a-col :span="19" class="text-left">
      <div>
        <div>
          {{ stage.data.name }}：{{formatWan(stage.data.show[0])}}-{{formatWan(stage.data.show[1])}}
        </div>
        <div>
          预测：{{formatWan(stage.data.view) }}
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import bili from '../../js/watch/bili'

export default {
  name: 'BiliStage',
  props:[
    'stage',
    'size'
  ],
  mounted () {

  },
  methods:{
    formatWan:bili.formatWan,
    guessStage:bili.guessStage,
  },
  computed:{
    getSize(){
      if(!this.size){
        return 'small'
      }
    }
  }
}
</script>

<style scoped>
.stage {
  transform: rotate(30deg);
  background: #487cff;
  border-radius: 4px;
  width: 30px;
  display: inline-block;
  margin-top: 1em;
  font-weight: bold;
  font-size: 14px;
  line-height: 1.5;
}
</style>
