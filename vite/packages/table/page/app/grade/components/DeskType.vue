  <template>
    <div class="text-center font-16 xt-text " style="padding-top: 80px;">定制你的桌面</div>
    <div class="mt-3 text-center xt-text-2 font-16 text-hidden">选择你的使用偏好，我们将为你添加推荐的数据，支持选择多个偏好。</div>
    <a-row :gutter="20" class="flex justify-center mt-6">
      <a-col v-for="item in deskType" :key="item.key">
        <div 
        class="px-4 pt-5 setting-panel pointer"
        @click="changeType(item.key)">
        <!-- :class="{'active':deskTypeObj[item.key]}" -->
          <div class="title">
            <Icon :icon="item.icon" width="56" height="56" />
            <div class="mt-2">{{ item.title }}</div>
          </div>
          <div class="mt-2 content">{{ item.content }}</div>
        </div>
      </a-col>
    </a-row>
  </template>
  
  <script> 
  import { Icon } from '@iconify/vue';
  
  export default {
    name: 'DeskType',
    props: ['deskTypeObj'],
    data() {
      return {
        deskType: [
          {
              title: '效率辅助',
              content: '为你推荐和效率辅助相关的数据。',
              key: 'assist',
              icon: 'fluent-emoji:rocket',
          },
          {
              title: '游戏娱乐',
              content: '为你推荐和游戏娱乐相关的数据。',
              key: 'game',
              icon: 'fluent-emoji:joystick',
          },
        ],
        
      }
    },
    async mounted(){
    },
    components: { 
      Icon,
    },
  
    computed:{
    },
    methods: {
      changeType(type){
        this.$emit('setDeskType', type)

      },

      
    }
  }
  </script>
  
  <style scoped lang="scss">
    .setting-panel {
      border: 2px solid transparent;
      border-radius: 0.5em;
      background: var(--secondary-bg);
      height:200px;
      width:200px;
    }

    .active {
      border: 2px solid #0a84ff;
      background: rgba(80,139,254,0.20);
    }

    .title {
      font-size: 18px;
      text-align: center;
      color: var(--primary-text);
    }

    .content{
      font-size: 16px;
      color: var(--secondary-text);
      text-align: center;
    }

    .text-hidden{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  </style>
  