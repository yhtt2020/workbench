<template>
  <ul class="space-list">
    <a-dropdown v-for="space,index in spaces" :trigger="['contextmenu']">
      <li @dblclick="switchSpace(space)" :class="{'active':this.activeSpace.nanoid===space.nanoid}"
          @click="setActive(space)">
        <div class="card">
          <a-row>
            <a-col :span="4">
              <a-avatar :size="24" shape="square" :src="getSpaceIcon(space)">
              </a-avatar>
            </a-col>
            <a-col :span="20">
              <div class="text-more" :title="space.name">{{ space.name }}</div>
            </a-col>
          </a-row>
          <a-row>
            <span class="info">{{ space.count_task }} 标签组 {{ space.count_tab }}标签</span>
          </a-row>
          <a-row>
            <span class="time" v-html="friendlyDate(space.sync_time)"></span>
          </a-row>
          <div style="margin-bottom: 5px" v-if="this.currentSpace.spaceId===space.nanoid">
            <a-tag  color="green">
              当前设备使用中
            </a-tag>
          </div>
          <div v-if="space.client_id">
            <div v-if="space.client_id !==this.user.clientId">
              <a-tag color="red" v-if="!this.offLine(space.sync_time)">
                其他设备使用中
              </a-tag>
              <a-tag v-else>
                其他设备离线使用中
              </a-tag>
            </div>
            <div>
              <a-tag title="设备名称" class="text-more" style="max-width: 100%">
                <desktop-outlined/>
                {{ space.client_name }}
              </a-tag>
            </div>
          </div>
        </div>
      </li>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="showRenameSpace(space)" :key="'rename_'+index">重命名</a-menu-item>
          <a-menu-item @click="copySpace(space)" :key="'rename_'+index">复制</a-menu-item>
          <a-menu-item @click="deleteSpace(space)" :key="'delete_'+index">删除</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </ul>
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
    <p>
      <a-input ref="spaceRenameInput" @keyup.enter="doRenameSpace" v-model:value="spaceRename"
               placeholder="新空间名"></a-input>
    </p>
    <p></p>
  </a-modal>
</template>

<script>
const { userModel, spaceModel } = window.$models
import { createVNode } from 'vue'
import {DesktopOutlined} from '@ant-design/icons-vue'
import { message ,Modal} from 'ant-design-vue'
export default {
  name: 'SpaceList',
  props: {
    spaces: Array,
    user: Object,
    currentSpace:Object,
    activeSpace: {nanoid:''},
  },
  components:{
    DesktopOutlined
  },
  data(){
    return {
      //修改<a-modal

      visibleRename: false,
      renamingSpace: null,
      spaceRename: '',
      lastReloadTime:Date.now(),
    }
  },
  emits: ['setActive','reloadSpaces'],
  methods: {
    friendlyDate(date){
      return tsbApi.util.friendlyDate(date)
    },
    offLine(time){
      return this.lastReloadTime-time>30*1000
    },
    reloadSpaces(){
      this.lastReloadTime=Date.now()
      this.$emit('reloadSpaces')
    },
    setActive(space){
      this.$emit('setActive',space)
    },
    getSpaceIcon (space) {
      let icon = '/icons/box.svg'
      //todo 支持自定义图标
      return icon
    },

    showRenameSpace (space) {
      this.visibleRename = true
      this.spaceRename = space.name
      this.renamingSpace = space
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
    }
    ,
    async doRenameSpace () {
      try {
        if (this.spaceRename === this.renamingSpace.name) {
          message.error('重命名的名称和原名称一致，请修改新名称。')
          return
        }
        if (this.spaceRename.trim() === '') {
          message.error('名称不能为空。')
          return
        }
        if (this.spaceRename.trim().length > 10) {
          message.error('名称不能超过10个汉字。')
          return
        }
        let result = await spaceModel.setUser(this.user).renameSpace(this.spaceRename.trim(), this.renamingSpace)
        if (result.status === 1) {
          message.success('重命名空间成功。')
          this.renamingSpace.name=this.spaceRename
          this.visibleRename = false
        } else {
          message.error('空间名称长度在1-10个汉字，请重新输入。')//获取真实的错误信息
          this.$refs.spaceRenameInput.input.select()
        }
      } catch (e) {
        message.error('重命名空间失败，未知错误。')
        console.warn(e)

      }
    }
    ,

    /**
     * 复制一个空间，右键菜单
     * @param space
     */
    async copySpace (space) {
      let result = await spaceModel.setUser(this.user).copy(space)
      if (result.status === 1) {
        message.success('复制空间成功')
        this.reloadSpaces()
      } else {
        message.error('复制空间失败。')
      }
    }
    ,
    deleteSpace (space) {
      if (space.isUsing || space.isOtherUsing) {
        message.info('不可删除正在使用中的空间。')
        return
      }

      Modal.confirm({
        title: '删除空间确认',
        content: '是否确认删除 【' + space.name + '】 ？空间一旦被删除将无法恢复，所有标签组的设置将丢失。请务必确认后果。',
        centered: true,
        okText: '我已知晓后果，仍要删除',
        cancelText: '取消',
        onOk: async () => {
          try {
            let result = await spaceModel.setUser(this.user).deleteSpace(space)
            if (result.status) {
              message.success('删除空间成功。')
              await this.reloadSpaces()
            } else {
              message.error('删除空间失败。')
            }
          } catch (e) {
            console.warn(e)
            message.error('删除空间失败。未知异常。')
          }
        }
      })
    },
    async doChangeSpaceCloud (space) {
      try {
        let result = await spaceModel.setUser(this.user).changeCurrent(space)
        if (result.status === 1) {
          message.success('切换使用空间成功。')
        } else {
          message.error('切换使用空间失败。')
        }
      } catch (e) {
        console.warn(e)
        message.error('切换使用空间失败。意外错误。')
      }

    }
    ,
    async switchSpace (space) {
      if (this.user.uid === 0) {
        Modal.confirm({
          title: '切换到本地空间',
          content: '是否更改当前空间，更改空间将重载浏览器，可能导致您网页上未保存的内容丢失，请确认已经保存全部内容。切换本地空间并不会更改当前登录帐号。',
          centered: true,
          okText: '我已保存，切换空间',
          cancelText: '取消',
          onOk: async () => {
            spaceModel.setAdapter('local').changeCurrent(space)
          }
        })
      } else {
        if (space.isSelfUsing) {
          if (space.disconnect) {
            Modal.confirm({
              title: '重新连接',
              content: '是否尝试重新连接此空间？',
              centered: true,
              okText: '重新连接',
              cancelText: '取消',
              onOk: async () => {
                this.doChangeSpaceCloud(space)
              }
            })
          } else {
            message.info('不可切换到当前使用中的空间。')
          }
          return
        }
        if (space.isOtherUsing) {
          if (space.online) {
            Modal.confirm({
              title: '此空间正忙',
              content: '此空间正在被其他设备使用，如若切换到此空间，可能造成其他设备未同步的标签组丢失。是否仍然要强行切换？这将导致该设备上的浏览器强制下线。',
              centered: true,
              okText: '我已明确，切换空间',
              cancelText: '取消',
              onOk: async () => {
                this.doChangeSpaceCloud(space)
              }
            })
          } else {
            Modal.confirm({
              title: '此空间使用设备异常离线',
              content: createVNode('div', {},
                [
                  createVNode('p', {}, '此空间正在被其他设备使用，但是系统检测到此设备可能已经因为网络或者其他原因而离线。'),
                  createVNode('p', {}, '所以此设备上可能存在未保存的标签组。如果切换到此空间，可能造成未保存的内容丢失。'),
                  createVNode('p', {}, '建议到此设备商重新连接后正常关闭浏览器，以防止数据冲突。'),
                  createVNode('p', {}, '如果您确认已无法恢复此设备的连接，则可切换到此设备在离线前最后一次保存的空间。'),
                  createVNode('p', {}, '当此设备再次连接网络，会自动将无法保存的空间保存为本地空间做备份。')
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
          Modal.confirm({
            title: '切换到云端空间',
            content: '是否切换到云端空间？切换到云端空间后会同时更换当前帐号到此帐号。请务必确认您网页上的内容已经保存。否则可能丢失未保存内容。',
            centered: true,
            okText: '我已保存，切换空间',
            cancelText: '取消',
            onOk: async () => {
              this.doChangeSpaceCloud(space)
            }
          })
        }
      }
    }
    ,
  }
}
</script>

<style scoped lang="scss">
.text-more {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.space-list {
  padding-left: 0;


li {
  user-select: none;
&:hover, &.active {
.card {
  background: white;
  border-radius: 4px;
  border: 1px solid #c1c1c1;
}
}
.card {
  border: 1px solid #f1f1f1;
  padding: 10px;
}

.info {
  font-size: 12px;
  color: grey;
  line-height: 24px;
}

border-bottom: 1px solid rgba(204, 204, 204, 0.51);
margin-left: 0;
list-style: none;
padding: 5px;

.time {
  font-size: 12px;
  color: grey;
}
}
}
</style>
