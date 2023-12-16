<template>
  <div class="flex flex-row items-center justify-center w-full h-full">
    <div @click.stop="()=>{}" class="w-1/2  h-82 max-w-lg rounded-lg flex flex-col  pt-6  mr-10 p-10 px-15"
         style="background: rgba(33, 33, 33, 1);">
      <div>
        <div class="text-center mb-5">
          <a-avatar :size="60" :src="avatar" shape="square"></a-avatar>
        </div>
        <div class="mb-5">
          <a-input placeholder="团队号" :value="no" disabled class="w-1/4 h-10 rounded-lg text-center mr-3"></a-input>
          <a-input  placeholder="团队名" v-model:value="name" class="w-2/3 h-10 rounded-lg text-center"></a-input>
        </div>
        <div class="mb-5"><strong class="text-white">注意：团队号为有限资源，一旦选定，终身有效，除非解散小队，</strong>
        </div>
        <a-row :gutter="10">
          <a-col :span="4">
            <div @click="roll" class="rounded-lg h-10 w-4/5 flex justify-center items-center mt-4 pointer text-white"
                 style="background: rgb(58,58,58);"><Icon id="touzi" ref="touzi" class=" " icon="touzi" style="font-size: 1.8em"></Icon>
            </div>
          </a-col>
          <a-col :span="20">
            <div @click="doCreate"
                 class="rounded-lg h-10 w-100 flex justify-center items-center mt-4 pointer text-white"
                 style="background: rgb(41,109,241);">立即创建
            </div>
          </a-col>
        </a-row>


      </div>

    </div>

  </div>

</template>

<script>
import { message, Modal } from 'ant-design-vue'
import { teamStore } from '../store/team'
import { mapActions,mapWritableState } from 'pinia'
import {completeTask} from "../apps/task/page/branch/task.ts"
const names = '发际线跟我作对,汤臣一品业组,我们做的都队,卷死其他组,精神小伙成双队,清华在校生组,素质教育漏网之鱼队,裸考过线组,下岗工人再就业队,光宗耀组,铁道游击队,没有这组,好好好你说的都队,花开富贵组,蒙的全队,所以爱会消失对不队,治安大队,校外施工队,斗地组,六神五组,重案六组,基因重组'

export default {
  name: 'CreateTeam',
  data () {
    return {
      avatar: '',
      name: '',
      randomName:true,
      i: 1,
      j: 1,
      k: 0,
      no: 0,
      timer:null
    }
  },
  emits:['created'],
  mounted () {
    this.roll(false)
  },
  computed:{
    ...mapWritableState(teamStore,['team'])
  },
  methods: {
    ...mapActions(teamStore, ['create','updateMy']),
    async doCreate () {
      if (this.avatar.trim() === '') {
        message.error('必须选择一个头像')
        return
      }
      if (this.name.trim() === '') {
        message.error('必须输入小队名称')
        return
      }
      if (!this.no) {
        message.error('必须输入小队号')
        return
      }
      if (!(this.no >= 1000 && this.no < 10000)) {
        message.error('小队号不符合规定，请使用随机生成。')
      }
      this.create(this.name, this.no, this.avatar).then(rs => {
        if (rs.code === 1000) {
          if(rs.data.status){
            this.team=rs.data.data
            Modal.success({
              content: '小队创建成功。',
              centered:true
            })
            // 支线任务点
            completeTask('Z0401')
            this.updateMy().then(()=>{
              this.$emit('created')
            })

          }else{
            Modal.error({
              content:rs.data.info,
              centered:true
            })
          }

        }else{
          Modal.error({
            content:'请求意外失败',
            centered:true
          })
        }
      }).catch(() => {
        message.error('网络繁忙，创建失败')
      })
    },
    rollAvatar () {
      let i = Math.ceil((Math.random() * 10))
      if (this.i === i) {
        this.rollAvatar()
        return
      }
      this.i = i
      this.avatar = `https://a.apps.vip/teamAvatar/avatar (${i}).svg`
    },
    rollName () {
      let groups = names.split(',')
      let j = Math.ceil((Math.random() * groups.length)) - 1
      if (this.j === j) {
        this.rollName()
        return
      }
      this.j = j
      this.name = groups[j]
    },
    rollNo () {
      let k = Math.ceil((Math.random() * 8999)) + 1000
      if (this.k === k) {
        this.rollName()
        return
      }
      this.k = k
      this.no = k
    },
    roll (animate=true) {
      if(animate){
        if(this.timer){
          clearTimeout(this.timer)
        }
        $('#touzi').addClass('animate-spin')
        this.timer=setTimeout(()=>{
          this.rollAvatar()
          this.rollName()
          this.rollNo()
          $('#touzi').removeClass('animate-spin')
        },400)
      }else{
        this.rollAvatar()
        this.rollName()
        this.rollNo()
      }



    }
  }
}
</script>

<style scoped>
.animate-spin{
  animation: spin .6s linear infinite !important;
}
</style>
