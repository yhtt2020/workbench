  <template>
    <xt-selectIcon :menus="['icon','emoji']" v-model="modelValue" @getAvatar="getAvatar" isUpload="true"></xt-selectIcon>
    <div class="flex items-center justify-center overflow-hidden"
      :style="{
        'height': `${boxW}px`,
        'width': `${boxH}px`,
        'border-radius': `${r}px`,
        'background': `${bg}px`,
        'pointer': isClick?true:false,
      }"
      @click =" modelValue = isClick"
      >
        <a-avatar :size="w" :src="avatarUrl"
        :style="{'filter': bgColor?`drop-shadow(#${bgColor} 200px 0)`:'',transform:bgColor?'translateX(-200px)':''}"/>
    </div>
  </template>
  
  <script setup>
  import { ref, toRefs, onMounted, onBeforeUnmount, computed,  } from "vue";
  

  //解析出来的颜色
  const bgColor = ref('')
  const modelValue = ref('')
  const avatarUrl = ref('')

  const props = defineProps({
    // 是否支持点击打开选择器
    isClick: {
      default: true,
    },
    // 外部宽
    boxW: {
      default: 40,
    },
    // 外部高
    boxH: {
      default: 40,
    },
    // 内部宽
    w: {
      default: 20,
    },
    // 内部高
    h: {
      default: 20,
    },
    // 圆角
    r: {
      default: 0,
    },
    // 背景
    bg:{
      default: '',
    }
  });

   

    // 获取头像
    const getAvatar = (avatar) => {
      if (avatar.indexOf('color=') >= 0) {
        let color = avatar.substr(avatar.indexOf('color=') + 7, 6)
        bgColor.value = color
      } else {
        bgColor.value = ''
      }
      avatarUrl.value = avatar
    }

    

    </script>
  
  <style lang="scss" scoped>

  </style>
  