<script lang="ts">
import {defineComponent} from 'vue'
import { formatTime, formatTimestamp } from '../../../util'
export default defineComponent({
  name: "HistoryList",
  props:['noteId'],
  data(){
    return{
      versions: [],
      selectVersion:null
    }
  },
  watch:{
    noteId:{
      async handler() {
        this.versions = await this.getHistory(this.noteId)
        if (this.versions.length > 0) {
          this.selectVersion = this.versions[0]
        }
      },
      immediate:true
    }
  },
  methods:{
    formatTime,
    async getHistory (id) {
      console.log(id, '要查询的id')
      const result = await tsbApi.db.find({
        selector: {
          noteId: {
            $eq: id
          }
        }
      })
      console.log(result, '查找到的版本历史')
      const history = result.docs.map(doc => doc)
      console.log(history, '查找到的历史')
      return history.reverse()
    },
  }
})
</script>

<template>
  <div>
    <div class="line-title">
      版本历史
    </div>
    <div style="height: 500px">
      <xt-scrollbar :y="true" :w="false" >
        <div @click="selectVersion=version;" :class="{'xt-bg':version===selectVersion}" class="pointer mb-2 pb-2 flex p-2 rounded-md" v-for="(version,index) in versions"
             style="gap:15px;border-bottom:1px solid var(--secondary-bg)">
          <div>
            <div style="font-size: 26px">
              #{{ versions.length - index }}
            </div>
            <div class="xt-text-2">{{ formatTime(version.createTime) }}</div>
          </div>
        </div>
      </xt-scrollbar>
    </div>

  </div>
  <div class="p-6 w-1/2" v-if="selectVersion" v-html="selectVersion.content"></div>
</template>

<style scoped lang="scss">

</style>
