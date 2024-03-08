<template>
  <!-- :popperOptions="popperOptions" -->
  <tippy 
    :placement="placement" 
    :interactive="true" 
    :appendTo="body" 
    :popperOptions="popperOptions"
    :arrow="false" 
    trigger="click"
    :zIndex="999999" 
    ref="tippyRef"
    @onCreate="create"
    @onTrigger="trigger">
    <Avatar :item="item"></Avatar>
    <template #content>
      <div class="flex flex-wrap w-[278px] h-[185px] rounded-xl xt-bg -m-3"
        style="padding-top: 6px; padding-bottom: 6px;backdrop-filter: blur(50px);">
        <div v-for="t in teamList" :key="t.title" class="team-item" @click="jump(t.type, t)">
          <a-avatar :src="t.img" :size="40"></a-avatar>
          <span>{{ t.title }}</span>
        </div>
        <div class="team-item" @click="openTask()">
          <a-avatar src="/img/task/star.png" :size="40"></a-avatar>
          <span>任务中心 {{ x }}  {{ y }}</span>
        </div>
      </div>
    </template>
  </tippy>
  <teleport to='body'>
    <TeamTip :key="teamKey" v-model:visible="showTeamTip"></TeamTip>
    <MyProp :showMyProp="showMyProp" @closeMyProp="closeMyProp"></MyProp>
  </teleport>
</template>

<script>
import TeamTip from '../TeamTip.vue'
import { mapWritableState, mapActions } from 'pinia'
import { teamStore } from '../../store/team'
import MyProp from '../team/MyProp.vue'
import Emoji from '../comp/Emoji.vue'
import { taskStore } from '../../apps/task/store'
import { offlineStore } from '../../js/common/offline'
import { renderIcon } from '../../js/common/common'
import Avatar from '../../components/desk/navigationBar/components/Avatar.vue'
import { useNavigationStore } from '../desk/navigationBar/navigationStore'
export default {
  name: "Team",
  components: {
    Emoji,
    TeamTip,
    MyProp,
    Avatar
  },
  props: {
    item: Object,
    shakeElement: Boolean,
    placement: {
      type: String,
      default: 'top'
    },
    x: Number,
    y: Number,
  },
  data() {
    return {
      teamList: [
        {
          img: '/img/bottomPanel/my.png',
          title: '我的',
          route: {
            name: 'socialMy'
          },
          type: 'route'
        },
        {
          img: '/img/bottomPanel/team.png',
          title: '小队',
          type: 'team'
        },
        {
          img: '/img/bottomPanel/rank.png',
          title: '榜单',
          route: {
            name: 'rank'
          },
          type: 'route'
        },
        {
          img: '/img/bottomPanel/prop.png',
          title: '我的道具',
          type: 'prop'
        },
        {
          img: '/img/bottomPanel/market.png',
          title: '道具商城',
          route: {
            name: 'prop'
          },
          type: 'route'
        },
      ],
      //显示小组提示
      showTeamTip: false,
      openTeam: false,
      showMyProp: false,
    }
  },
  computed: {
    ...mapWritableState(teamStore, ['team', 'teamVisible']),
    ...mapWritableState(taskStore, ['isTaskDrawer']),
    ...mapWritableState(offlineStore, ['isOffline']),
    body() {
      return document.body
    },
    // tippy自定义位置
    popperOptions() {
      return {
        modifiers: [
          {
            name: 'computeStyles',
            options: {
              adaptive: false, // 禁用自适应，否则将无法设置 fixed 位置
            },
          },
          {
            name: 'applyStyles',
            fn: ({ state }) => {
              this.$nextTick(()=>{
                Object.assign(state.elements.popper.style, {
                  position: 'fixed',
                  left: `${this.x}px`,
                  top: `${this.y}px`, 
                });
              })
            },
          },
        ],
      };
    },
  },
  methods: {
    renderIcon,
    ...mapActions(teamStore, ['updateMy']),
    openTask() {
      this.isTaskDrawer = true
      this.$refs.tippyRef.hide()
    },
    async jump(type, val) {
      switch (type) {
        case 'route':
          this.$router.push(val.route)
          break;
        case 'team':
          await this.updateMy(0)
          if (this.team.status === false) {
            this.teamKey = Date.now()

            this.showTeamTip = true
          } else {

            this.teamVisible = !this.teamVisible
          }
          break;
        case 'prop':
          this.showMyProp = true
          break;
      }
      this.openTeam = false
      this.$refs.tippyRef.hide()
    },
    toggleTeam() {
      this.openTeam = !this.openTeam
    },
    closeMyProp(val) {
      this.showMyProp = val
    },
    create(instance) {
      console.log('instance',this.x,this.y,instance)
      instance.popperInstance.modifiers[0].adaptive = false
      instance.popperInstance.modifiers[0].options = {
        adaptive: false
      }
      instance.popperInstance.options.modifiers[1].fn = ({ state }) => {
        this.$nextTick(() => {
          Object.assign(state.elements.popper.style, {
            position: 'fixed',
            left: `${this.x}px`,
            top: `${this.y}px`,
          });
        })
      }
    },
    trigger() {
      console.log('trigger')
    }
  },
  watch:{
    x(val){
      // console.log('x',val)
      // this.$refs.tippyRef.destroy()
      // this.create()
      this.$nextTick(()=>{
        this.$refs.tippyRef.popperInstance.update()
      })
    },
    y(val){
      // console.log('y',val)
      // this.$refs.tippyRef.popperInstance.update()
    }
  }
}
</script>

<style lang="scss" scoped>
.team-item {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  margin: 0 6px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 6px;
  cursor: pointer;
  color: var(--primary-text);

  &:hover {
    background: rgba(80, 139, 254, 0.20);
  }
}
</style>
