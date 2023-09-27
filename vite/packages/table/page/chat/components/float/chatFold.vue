<template>
 <div class="collapse-container">
   <div class="header mb-2" @click="toggleCollapse">
     <div class="flex items-center justify-center" :class="['icon', { 'rotate': !collapsed }]">
       <CaretRightOutlined style="font-size: 1em;"/>
     </div>
     <span class="font-14 ml-2" style="color:var(--secondary-text);">
      {{ title }}
     </span>
   </div>
   <transition name="collapse">
    <!-- class="content" -->
    <div v-if="!collapsed" >
      <slot></slot>
    </div>
   </transition>
 </div>
</template>

<script>
import { ref } from 'vue';
import { CaretRightOutlined } from '@ant-design/icons-vue';

export default {
 props:['title'],
 components: {
   CaretRightOutlined
 },
 setup() {
   const collapsed = ref(false);

   const toggleCollapse = () => {
     collapsed.value = !collapsed.value;
   };

   return {
     collapsed,
     toggleCollapse
   };
 }
};
</script>

<style lang="scss" scoped>
.collapse-container {
 margin-bottom: 10px;
}

.header {
 cursor: pointer;
 display: flex;
 align-items: center;
}

.icon {
 transition: transform 0.3s;  /* 添加过渡效果 */
}

.rotate {
 transform: rotate(90deg);  /* 旋转图标 */
}

/**
.content {
 padding: 10px;
}
**/

/* 定义过渡效果样式 */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.1s ease;
  height: auto;
  opacity: 1;
}

.collapse-enter-from,
.collapse-leave-to {
  height: 0;
  opacity: 0;
}

.font-14{
 font-family: PingFangSC-Regular;
 font-size: 14px;
 font-weight: 400;
}
</style>
