<template>
  <div style="position: relative;">

    <div v-if="tag" class="rounded-xl w-10 tag"
         :style="{background:tagColor?tagColor:'rgba(0,0,0,0.8)'}"
    >
      {{ tag }}
    </div>


    <a-avatar :size="50" :src="avatar"></a-avatar>
  </div>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: ['avatar', 'tag', 'online', 'tagColor']
}
</script>

<style scoped>
.tag {
  position: absolute;
  display: inline-block;
  z-index: 9;
  bottom: -5px;
  transform: translateX(-50%);
  left: 50%;
  font-size: 0.8em;
  color: white
}
</style>
