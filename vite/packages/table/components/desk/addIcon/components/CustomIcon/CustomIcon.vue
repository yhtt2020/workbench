<template>
    <customLink 
        v-if="linkVisible" 
        v-model="linkVisible" 
        @save="saveIcon" 
        ref="customLink" 
        :linkLimit="{hideTab:false,hideIcon:false}">
    </customLink>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import CustomLink from '../../../navigationBar/components/CustomLink.vue';

const linkVisible = ref(false)
const emit = defineEmits(['addIcon'])

const saveIcon = (item) => {
    emit('addIcon',item)
    linkVisible.value = false
}

onMounted( () => {
    linkVisible.value = true
}) 

</script>
<style lang='scss' scoped></style>