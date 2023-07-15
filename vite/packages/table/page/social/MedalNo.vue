<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "MedalNo",
  props:['no']
})
</script>

<template>
 <span v-if="no === 1">
              <a-avatar src="/img/rankingList/one.png" :size="32"></a-avatar>
            </span>
  <span v-else-if="no === 2">
              <a-avatar src="/img/rankingList/two.png" :size="32"></a-avatar>
            </span>
  <span v-else-if="no === 3">
              <a-avatar src="/img/rankingList/three.png" :size="32"></a-avatar>
            </span>

  <div v-else class="ranking-back flex justify-center items-center" :style="no < 11 ? 'width:32px' : ''">{{ no }}</div>
</template>

<style scoped lang="scss">
.ranking-back {
  height: 32px;
  padding: 0 10px;
  line-height: 32px;
  border-radius: 8px;
  text-align: center;
  background: var(--mask-bg);
  font-size: 18px;
  color: var(--primary-text);
  font-weight: 500;
}
</style>
