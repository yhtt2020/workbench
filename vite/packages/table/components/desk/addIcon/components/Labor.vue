<template>
    <div class="absolute bottom-4 right-4">
        <!-- 添加到桌面 -->
        <xt-menu :menus="menus" model="click"  @mounted="changeMenu">
          <xt-button 
            class="absolute right-0 shadow tran" 
            :radius="8" 
            :w="32" 
            :h="32" 
            :class="checkFlag?'b-10 opacity-100':'bottom-0 opacity-0'"
            icon="fluent:add-20-regular"
            iconSize="16">
          </xt-button>
        </xt-menu>
        <!-- 菜单 -->
        <xt-button 
            @click="changeList" 
            type="theme" 
            :radius="8" 
            :w="32" 
            :h="32" 
            class="absolute bottom-0 right-0 shadow"
            iconSize="16"
            icon="fluent:grid-20-regular">
        </xt-button>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

const props = defineProps({
    checkFlag: Boolean, // 选项是否显示
    menus: Array,  // 菜单列表
})

const emit = defineEmits(['changeCheck'])

const changeList = () => {
    emit('changeCheck')
}

</script>
<style lang='scss' scoped>
    .tran{
        transition: all linear 0.3s;
    }

    .b-10{
        bottom: 40px;
    }
    .b-20{
        bottom: 80px;
    }

    .shadow{
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.03);
      box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);
      box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.2);
    }
</style>