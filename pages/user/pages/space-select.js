const userModel = require('../../../src/model/userModel')
const spaceModel = require('../../../src/model/spaceModel')
const { createVNode } = require('../../../ext/vue/vue3')
const tpl = `
<div>
  <div style="text-align: center" >
    <a-row style="margin-top: 20px">
      <a-col :span="12" style="text-align: right">
        <a-avatar :size="60" :src="user.avatar">
        </a-avatar>
      </a-col>
      <a-col :span="12" style="text-align: left;padding-left: 10px">
        <div style="margin-top: 10px">{{user.nickname}}</div>
        <p style="font-size: 16px">{{ spaces.length }} <span style="color: #999;font-size: 12px">空间</span></p>
      </a-col>
    </a-row>

  </div>
  <div v-if="user.uid" style="float: right;position: absolute;right: 20px;top: 20px;" ><a-button @click="importFromLocal" size="small">导入</a-button></div>
    <div v-else style="float: right;position: absolute;right: 20px;top: 20px;" ><a-checkbox @change="loadSpaces" v-model:checked="showBackup">显示备份空间</a-checkbox></div>
  <div style="text-align: center">
    <!--      <a-empty text="无空间" v-if="spaces.length===0"></a-empty>-->
    <div style="text-align: left;overflow-y: auto;max-height: 310px;margin-right: 20px;padding-top: 10px;padding-left: 40px;padding-bottom: 10px" class="scroller">
    <a-tooltip v-for="space,index in spaces" placement="bottom">
    <template #title>
    名称：{{space.name}}<br>
    保存时间：{{dateTime(space.sync_time)}}<br>修改时间：{{dateTime(space.update_time)}}<br>创建时间：{{dateTime(space.create_time)}}<br>
     <span v-if="space.client_id !==''">设备ID：{{space.client_id}}</span>
     </template>
        <a-card  v-if="space.type==='cloud'"
         :class="{'other-using':space.isOtherUsing,'self-using':space.isSelfUsing}"
          style="margin-left:20px;width: 250px;display: inline-block;margin-bottom: 10px;background-color: rgba(241,241,241,0.29)">
          <a-card-meta  >
          <template #title>
          <span v-if="space.type==='cloud'">【备份】</span> {{space.name}}

</template>
            <template #description>
              <span class="using-bandage" v-if="space.isOtherUsing">
              <span v-if="space.disconnect">
              其他设备离线使用中
</span><span v-else>
其他设备使用中
</span>
</span>
              <span class="using-bandage" v-if="space.isSelfUsing">
              <span v-if="space.disconnect">
         当前设备离线使用中
</span><span v-else>
当前使用中
</span>
</span>

              {{space.count_task+ ' 标签组  '+ space.count_tab+' 标签'}}
            </template>
            <template #avatar>
              <svg :class="{'offline':this.user.uid===0?true:false}" t="1648106444295" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32437" width="32" height="32"><path d="M512 938.666667C276.352 938.666667 85.333333 747.648 85.333333 512S276.352 85.333333 512 85.333333s426.666667 191.018667 426.666667 426.666667-191.018667 426.666667-426.666667 426.666667z m205.653333-210.090667A298.666667 298.666667 0 0 0 385.365333 241.408l41.6 74.88A213.333333 213.333333 0 0 1 725.333333 512h-91.733333a21.333333 21.333333 0 0 0-18.645333 31.701333l102.698666 184.874667z m-120.618666-20.864A213.333333 213.333333 0 0 1 298.666667 512h91.733333a21.333333 21.333333 0 0 0 18.645333-31.701333L306.346667 295.424a298.666667 298.666667 0 0 0 332.288 487.168l-41.6-74.88z" fill="#14D081" p-id="32438"></path></svg>
            </template>
          </a-card-meta>
        </a-card>
            </a-tooltip>




      <a-dropdown v-for="space,index in spaces" :trigger="['contextmenu']">
         <a-tooltip placement="bottom">
    <template #title>
    名称：{{space.name}}<br>
    保存时间：{{dateTime(space.sync_time)}}<br>修改时间：{{dateTime(space.update_time)}}<br>创建时间：{{dateTime(space.create_time)}}<br>
     <span v-if="space.client_id !==''">设备ID：{{space.client_id}}</span>
     </template>
        <a-card  v-if="space.type!=='cloud'" @click="switchSpace(space)"
         :class="{'other-using':space.isOtherUsing,'self-using':space.isSelfUsing}"
         hoverable style="margin-left:20px;width: 250px;display: inline-block;margin-bottom: 10px">
          <a-card-meta  >
          <template #title>
          <span v-if="space.type==='cloud'">【备份】</span> {{space.name}}

</template>
            <template #description>
              <span class="using-bandage" v-if="space.isOtherUsing">
              <span v-if="space.disconnect">
              其他设备离线使用中
</span><span v-else>
其他设备使用中
</span>
</span>
              <span class="using-bandage" v-if="space.isSelfUsing">
              <span v-if="space.disconnect">
         当前设备离线使用中
</span><span v-else>
当前使用中
</span>
</span>

              {{space.count_task+ ' 标签组  '+ space.count_tab+' 标签'}}
            </template>
            <template #avatar>
              <svg :class="{'offline':this.user.uid===0?true:false}" t="1648106444295" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32437" width="32" height="32"><path d="M512 938.666667C276.352 938.666667 85.333333 747.648 85.333333 512S276.352 85.333333 512 85.333333s426.666667 191.018667 426.666667 426.666667-191.018667 426.666667-426.666667 426.666667z m205.653333-210.090667A298.666667 298.666667 0 0 0 385.365333 241.408l41.6 74.88A213.333333 213.333333 0 0 1 725.333333 512h-91.733333a21.333333 21.333333 0 0 0-18.645333 31.701333l102.698666 184.874667z m-120.618666-20.864A213.333333 213.333333 0 0 1 298.666667 512h91.733333a21.333333 21.333333 0 0 0 18.645333-31.701333L306.346667 295.424a298.666667 298.666667 0 0 0 332.288 487.168l-41.6-74.88z" fill="#14D081" p-id="32438"></path></svg>
            </template>
          </a-card-meta>
        </a-card>
            </a-tooltip>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="showRenameSpace(space)" :key="'rename_'+index">重命名</a-menu-item>
            <a-menu-item @click="copySpace(space)" :key="'rename_'+index">复制</a-menu-item>
            <a-menu-item @click="deleteSpace(space)" :key="'delete_'+index">删除</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <a-card @click="showCreateSpace" hoverable style="width: 250px;display: inline-block;margin-left:20px;">
        <a-card-meta title="创建新空间" description="创建一个全新的空间">
          <template #avatar>
            <a-avatar :size="40" style="background-color: #eeeeee">
              <template #icon>
                <svg style="margin-top: 3px;width: 30px" t="1648099588078" class="icon" viewBox="0 0 1024 1024"
                     version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21372" width="36" height="36">
                  <path
                    d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 85.333333a384 384 0 1 0 0 768 384 384 0 0 0 0-768z m0 170.666667a42.666667 42.666667 0 0 1 42.666667 42.666666v128h128a42.666667 42.666667 0 0 1 0 85.333334h-128v128a42.666667 42.666667 0 0 1-85.333334 0v-128H341.333333a42.666667 42.666667 0 0 1 0-85.333334h128V341.333333a42.666667 42.666667 0 0 1 42.666667-42.666666z"
                    fill="#666666" p-id="21373"></path>
                </svg>
              </template>
            </a-avatar>
          </template>
        </a-card-meta>
      </a-card>
      <div>
      </div>
    </div>
  </div>

  <div style="position: absolute;bottom: 10px;width: 100%;padding: 30px;padding-bottom: 15px">
<!--    <div style="float: left;"><a-button size="small" shape="round">隐私空间</a-button></div>-->
    <div style="float:right;width: 200px;text-align: right">
      <a-button v-if="user.uid!==0" @click="setEnterPwd()" style="margin-right: 10px">设置密码</a-button>
      <a-button v-if="user.uid!==0" @click="deleteAccount(user.uid)">解绑账号</a-button>
    </div>
  </div>
 <a-modal
    centered
    v-model:visible="visibleRename"
    title="空间重命名"
    ok-text="修改"
    cancel-text="取消"
    width="300px"
    @ok="doRenameSpace"
  >
    <p>输入空间新名称</p>
    <p><a-input ref="spaceRenameInput" @keyup.enter="doRenameSpace" v-model:value="spaceRename" placeholder="新空间名"></a-input></p>
    <p></p>
  </a-modal>
  <a-modal
    centered
    v-model:visible="visibleCreate"
    title="创建空间"
    ok-text="创建"
    cancel-text="取消"
    width="300px"
    @ok="doCreateSpace"
  >
    <p>输入空间名称</p>
    <p><a-input ref="spaceNameInput" @keyup.enter="doCreateSpace" v-model:value="newSpaceName" placeholder="空间名称"></a-input></p>
    <p></p>
  </a-modal>
  <a-modal
    centered
    v-model:visible="visibleSetEnterPwd"
    title="设置空间密码"
    ok-text="设置"
    cancel-text="取消"
    width="300px"
    @ok="doSetEnterPwd"
  >
    <p>请设置新的空间密码，留空则不再使用空间密码。</p>
    <p><a-input-password ref="enterPwdInput" @keyup.enter="doSetEnterPwd" v-model:value="newEnterPwd" placeholder="留空不使用"></a-input-password></p>
    <p></p>
  </a-modal>
   <a-modal
    centered
    v-model:visible="visibleImport"
    title="导入本机空间"
    ok-text="导入"
    cancel-text="取消"
    width="400px"
    @ok="doImportSpaces"
  >
    <p>请选择本机空间导入，可一次导入多个空间。注意：不可导入使用中的空间。</p>
    <p><a-select
    v-model:value="value"
    mode="multiple"
    placeholder="可多选"
    style="width: 100%"
    v-model:value="selectedImportSpaces"
    :options="localOptions"
  ></a-select></p>
  </a-modal>
</div>
`
// const userModel = require('../../util/model/userModel')
const ipc = require('electron').ipcRenderer
const SpaceSelect = {
  template: tpl,
  data () {
    return {
      user: {
        uid: 0,
        spaces: [],
        clientId: ''
      },
      spaces: [],
      currentSpace: {},
      pwd: '',
      //导入
      visibleImport: false,
      localSpaces: [],
      localOptions: [],
      selectedImportSpaces: [],

      //创建
      visibleCreate: false,
      newSpaceName: '',

      //修改<a-modal

      visibleRename:false,
      renamingSpace:null,
      spaceRename:'',

      //设置空间密码
      visibleSetEnterPwd:false,
      showSetEnterPwd:true,
      newEnterPwd:'',

      clientId: '',


      showBackup:false,//默认不显示备份空间
    }
  },
  async mounted () {
    let user = {}
    let uid = Number(this.$route.params.uid)
    if (!uid) {
      user = {
        nickname: '本机空间',
        avatar: '../../icons/logo128.png',
        spaces: [],
        uid: 0
      }
      this.user = user
    } else {
      //网络用户
      user = await userModel.get({ uid: this.$route.params.uid })
      if (user) {
        this.user = user
      } else {
        console.warn(user)
        window.antd.message.error('获取用户信息失败，登录信息过期或用户账号异常。请尝试解绑用户后重新登陆账号。')
        this.$router.go(-1)
        return //如果异常，退回上一页，防止后续出错
      }

    }
    this.user.clientId = userModel.getClientId()
    try {
      this.currentSpace = await spaceModel.getCurrent()
    } catch (e) {

    }
    await this.loadSpaces()
    //获取网络空间用户信息

    // if (user) {
    //
    //   try{
    //     let result=await spaceModel.setUser(user).getUserSpaces(user.uid)
    //     //let result=await userApi.getMySpaceList(user)
    //     if(result.status===1){
    //       this.spaces= result.data
    //       console.log('result',result)
    //     }else{
    //       console.log('result',result)
    //       window.antd.message.error('获取用户空间失败。')
    //     }
    //   }catch (e){
    //     console.log('result',e)
    //     window.antd.message.error('获取用户空间失败，未知异常。')
    //   }
    // } else {
    //   console.error('user can\'t find')
    // }
  },
  methods: {
     setEnterPwd(){
      this.visibleSetEnterPwd=true
    },
    doSetEnterPwd(){
       if(this.newEnterPwd!==''){
         antd.Modal.confirm({
           title: '修改密码确认',
           content: '是否确认设置新的密码？请牢记密码，一旦忘记，则只能解绑后重新绑定账号。',
           centered: true,
           okText: '确认设置密码',
           cancelText: '取消',
           onOk: async () => {
             try {
               userModel.setEnterPwd(this.newEnterPwd,this.user.uid)
               this.user.enterPwd=this.newEnterPwd
               this.visibleSetEnterPwd=false
               window.antd.message.success('访问密码设置成功。')

             } catch (e) {
               console.log(e)
               window.antd.message.error('设置访问密码失败。未知异常。')
             }
           }
         })
      }else if(this.newEnterPwd==='' && this.user.enterPwd!==''){
         //原来有密码，清空了密码
         antd.Modal.confirm({
           title: '删除密码确认',
           content: '是否确认删除空间密码？',
           centered: true,
           okText: '删除',
           cancelText: '取消',
           onOk: async () => {
             try {
               userModel.setEnterPwd(this.newEnterPwd,this.user.uid)
               this.user.enterPwd=this.newEnterPwd
               this.visibleSetEnterPwd=false
               window.antd.message.success('删除访问密码成功。')

             } catch (e) {
               console.log(e)
               window.antd.message.error('删除访问密码失败。未知异常。')
             }
           }
         })
       }
    },
    /**
     * 导入本机空间
     */
    async importFromLocal () {
      //todo loadLocalSpaces()
      this.localSpaces = await spaceModel.getLocalSpaces()
      this.localOptions = this.localSpaces.map((space) => {
        return { label: space.name +'（ '+ space.data.state.tasks.length+' 标签组）', value: space.id }
      })
      for(let i=0;i<this.localOptions.length;i++){
        if(this.localOptions[i].value===this.currentSpace.spaceId){
          this.localOptions.splice(i,1)
          break
        }
      }
      this.visibleImport = true
    },
    /**
     * 导入空间
     * @returns {Promise<void>}
     */
    async doImportSpaces () {
      try {
        let selectedSpaces=this.selectedImportSpaces.map(space=>{
          let item=this.localSpaces.find((item)=>{
            return item.id===space
          })
          return {
            data:item.data,
            name:item.name+'_导入'
          }
        })
        if(selectedSpaces.length===0){
          window.antd.message.error('请选择需要导入的空间。')
          return
        }
        let result = await spaceModel.setUser(this.user).importFromLocal(selectedSpaces)
        if (result.status === 1) {
          window.antd.message.success('导入空间成功。')
          this.visibleImport = false
          await this.loadSpaces()
        } else {
          window.antd.message.error('导入空间失败。'+result.data)
        }
      } catch (e) {
        console.log(e)
        window.antd.message.error('导入空间失败。未知异常。')
      }
    },
    dateTime (time) {
      let date = new Date(time)
      //return date.getFullYear()+'年'+date.getMonth()+'月'+date.getDate()+'日 '+date.getHours()+':'+date.getMinutes()
      return date.toLocaleString()
    },
    async loadSpaces () {
      let spaces = []
      //下面开始获取用户空间
      try {
        let result = await spaceModel.setUser(this.user).getUserSpaces({showBackup:this.showBackup})
        if (result.status === 1) {
          spaces = result.data
          spaces.forEach(space => {
            if (this.user.uid) { //云端判断逻辑
              if (space.client_id && space.client_id !== this.user.clientId) {
                space.isOtherUsing = true
                space.isUsing = true
              } else if ((space.client_id === this.user.clientId)) {
                space.isSelfUsing = true
                space.isUsing = true
              } else {
                space.isUsing = false
              }
              if(Date.now()-space.sync_time>30000){
                space.disconnect=true
              }else{
                space.disconnect=false
              }
            } else {
              if (space.id === this.currentSpace.spaceId) {
                space.isSelfUsing = true
                space.isUsing = true
              }
            }
          })
        } else {
          window.antd.message.error('获取用户空间失败。失败原因：' + result.info)
          this.$router.go(-1)
          return
        }
      } catch (e) {
        if(e.toString().indexOf('ECONNREFUSED')>-1){
          console.warn(e)
          window.antd.message.error('无法连接到服务器，服务器异常，请稍后再试。')
        }else{
          window.antd.message.error('获取用户空间失败，可尝试在账号上右键，选择【解绑账户】，解绑后再重新登录。')
        }

        this.$router.go(-1)
        return
      }
      this.spaces = spaces
    },
    goLogin () {
      ipc.send('login')
      //https://s.apps.vip/login?response_type=code&client_id=10001&state=1
    },
    async doCreateSpace () {
      try {
        let result = await spaceModel.setUser(this.user).addSpace({ name: this.newSpaceName })
        if (result.status === 1) {
          this.newSpaceName = ''
          window.antd.message.success('创建空间成功。')
          this.spaces.push(result.data)
          this.visibleCreate = false
        } else {
          window.antd.message.error('空间名称长度在1-10个汉字，请重新输入。')//获取真实的错误信息
          this.$refs.spaceNameInput.input.select()
        }

        //let result=await userApi.addSpace(this.newSpaceName,this.user)
        // if(result.code===1000){
        //   this.newSpaceName=''
        //   window.antd.message.success('创建空间成功。')
        //   this.spaces.push(result.data)
        //   this.visibleCreate=false
        // }else{
        //   window.antd.message.error('空间名称长度在1-10个汉字，请重新输入。')
        //   this.$refs.spaceNameInput.input.select()
        // }
      } catch (e) {
        window.antd.message.error('创建空间失败，失败原因：')
        console.log(e)

      }
    },
    showCreateSpace () {
      this.visibleCreate = true
      setTimeout(() => {
        this.$refs.spaceNameInput.input.focus()
      }, 200)
    },

    showRenameSpace(space){
      this.visibleRename=true
      this.spaceRename=space.name
      this.renamingSpace=space
      setTimeout(() => {
        this.$refs.spaceRenameInput.input.select()
      }, 200)
      //     centered
      //     v-model:visible="visibleRenameCreate"
      //     title="空间重命名"
      //     ok-text="修改"
      //     cancel-text="取消"
      //     width="300px"
      //     @ok="doCreateSpace"
      //   >
      //     <p>输入空间新名称</p>
      //     <p><a-input ref="spaceRenameInput" @keyup.enter="doRenameSpace" v-model:value="spaceRename" placeholder="新空间名"></a-input></p>
      //     <p></p>
      //   </a-modal>
    },
    async doRenameSpace(){
      try {
        if(this.spaceRename===this.renamingSpace.name){
          window.antd.message.error('重命名的名称和原名称一致，请修改新名称。')
          return
        }
        if(this.spaceRename.trim()===''){
          window.antd.message.error('名称不能为空。')
          return
        }
        if(this.spaceRename.trim().length>10){
          window.antd.message.error('名称不能超过10个汉字。')
          return
        }
        let result = await spaceModel.setUser(this.user).renameSpace( this.spaceRename.trim(),this.renamingSpace )
        if (result.status === 1) {
          window.antd.message.success('重命名空间成功。')
          this.loadSpaces()
          this.visibleRename = false
        } else {
          window.antd.message.error('空间名称长度在1-10个汉字，请重新输入。')//获取真实的错误信息
          this.$refs.spaceRenameInput.input.select()
        }
      } catch (e) {
        window.antd.message.error('重命名空间失败，未知错误。')
        console.log(e)

      }
    },

    /**
     * 复制一个空间，右键菜单
     * @param space
     */
    async copySpace (space) {
      let result=await spaceModel.setUser(this.user).copy(space)
      if(result.status===1){
        window.antd.message.success('复制空间成功')
        this.loadSpaces()
      }else{
        window.antd.message.error('复制空间失败。')
      }
    },
    deleteSpace (space) {
      if (space.isUsing || space.isOtherUsing) {
        window.antd.message.info('不可删除正在使用中的空间。')
        return
      }

      antd.Modal.confirm({
        title: '删除空间确认',
        content: '是否确认删除 【' + space.name + '】 ？空间一旦被删除将无法恢复，所有标签组的设置将丢失。请务必确认后果。',
        centered: true,
        okText: '我已知晓后果，仍要删除',
        cancelText: '取消',
        onOk: async () => {
          try {
            let result = await spaceModel.setUser(this.user).deleteSpace(space)
            if (result.status) {
              window.antd.message.success('删除空间成功。')
              await this.loadSpaces()
            } else {
              window.antd.message.error('删除空间失败。')
            }
          } catch (e) {
            console.log(e)
            window.antd.message.error('删除空间失败。未知异常。')
          }
        }
      })
    },
    async doChangeSpaceCloud (space) {
      try {
        let result = await spaceModel.setUser(this.user).changeCurrent(space)
        console.log(result)
        if (result.status === 1) {
          window.antd.message.success('切换使用空间成功。')
        } else {
          window.antd.message.error('切换使用空间失败。')
        }
      } catch (e) {
        console.warn(e)
        window.antd.message.error('切换使用空间失败。意外错误。')
      }

    },
    async switchSpace (space) {
      if (this.user.uid === 0) {
        antd.Modal.confirm({
          title: '切换到本地空间',
          content: '是否更改当前空间，更改空间将重载浏览器，可能导致您网页上未保存的内容丢失，请确认已经保存全部内容。切换本地空间并不会更改当前登录账号。',
          centered: true,
          okText: '我已保存，切换空间',
          cancelText: '取消',
          onOk: async () => {
            spaceModel.setAdapter('local').changeCurrent(space)
          }
        })
      } else {
        if(space.isSelfUsing){
          if(space.disconnect){
            antd.Modal.confirm({
              title: '重新连接',
              content: '是否尝试重新连接此空间？',
              centered: true,
              okText: '重新连接',
              cancelText: '取消',
              onOk: async () => {
                this.doChangeSpaceCloud(space)
              }
            })
          }else{
            window.antd.message.info('不可切换到当前使用中的空间。')
          }
          return
        }
        if (space.isOtherUsing) {
          if(space.online){
            antd.Modal.confirm({
              title: '此空间正忙',
              content: '此空间正在被其他设备使用，如若切换到此空间，可能造成其他设备未同步的标签组丢失。是否仍然要强行切换？这将导致该设备上的浏览器强制下线。',
              centered: true,
              okText: '我已明确，切换空间',
              cancelText: '取消',
              onOk: async () => {
                this.doChangeSpaceCloud(space)
              }
            })
          }else{
            antd.Modal.confirm({
              title: '此空间使用设备异常离线',
              content: Vue.createVNode('div',{},
                [
                  Vue.createVNode('p',{},'此空间正在被其他设备使用，但是系统检测到此设备可能已经因为网络或者其他原因而离线。'),
                  Vue.createVNode('p',{},'所以此设备上可能存在未保存的标签组。如果切换到此空间，可能造成未保存的内容丢失。'),
                  Vue.createVNode('p',{},'建议到此设备商重新连接后正常关闭浏览器，以防止数据冲突。'),
                  Vue.createVNode('p',{},'如果您确认已无法恢复此设备的连接，则可切换到此设备在离线前最后一次保存的空间。'),
                  Vue.createVNode('p',{},'当此设备再次连接网络，会自动将无法保存的空间保存为本地空间做备份。')
                ]
              ),
              centered: true,
              okText: '我已明确，切换空间',
              cancelText: '取消',
              onOk: async () => {
                this.doChangeSpaceCloud(space)
              }
            })
          }

        } else {
          antd.Modal.confirm({
            title: '切换到云端空间',
            content: '是否切换到云端空间？切换到云端空间后会同时更换当前账号到此账号。请务必确认您网页上的内容已经保存。否则可能丢失未保存内容。',
            centered: true,
            okText: '我已保存，切换空间',
            cancelText: '取消',
            onOk: async () => {
              this.doChangeSpaceCloud(space)
            }
          })
        }
      }
    },

    deleteAccount (uid) {
      antd.Modal.confirm({
        title: '解绑此账号',
        content: '解绑账号并不会影响账号数据，仅仅是将本地账号退出。但是退出后无法再使用此账号下的所有空间。',
        centered: true,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          userModel.delete( {uid:uid} ).then(() => {
            window.antd.message.success('解绑账号成功。')
            this.$router.replace('/')
          }).catch(()=>{
            window.antd.message.error('解绑账号失败。')
          })
        }
      })
    },
  }
}

module.exports = SpaceSelect
