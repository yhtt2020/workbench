<script  lang="ts">

import {EyeOutlined,EyeInvisibleOutlined,EllipsisOutlined,DeleteOutlined} from '@ant-design/icons-vue'
const columns = [
  {
    title: '网站',
    dataIndex: 'domain',
    key: 'domain',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '账号',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '密码',
    dataIndex: 'password',
    key: 'password',
  },
  {
    title: '',
    dataIndex: 'show',
    key: 'show',
  },{
  title:'',
    dataIndex: 'action',
    key:'action'
  }
];


export default {
  name: 'Passwords',
  components:{
    EyeOutlined,EyeInvisibleOutlined,EllipsisOutlined,DeleteOutlined
  },
  data() {
    return {
      columns,
      passwords:[]
    };
  },
  async mounted() {
    this.passwords = await ipc.invoke('credentialStoreGetCredentials')
      this.passwords.forEach(password=>{
        password.show=false
      })
      console.log(this.passwords)
  },
  methods:{
    async delAccount(account) {
      await ipc.invoke('credentialStoreDeletePassword', {
        domain: account.domain,
        username: account.username
      })
      this.passwords.splice(this.passwords.indexOf(account), 1)
    }
  }
}
</script>

<template>
  <a-table :columns="columns" :data-source="passwords">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined/>
          名称
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'domain'">
        <a :href="'http://'+record.domain" target="_blank">
          {{ record.domain }}
        </a>
      </template>
      <template v-else-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-if="column.key === 'password'">
        <span v-if="record.show">
           {{ record.password }}
        </span>
        <span v-else>
           {{ '•••••••••' }}
        </span>
         &nbsp;&nbsp;

      </template>
      <template v-else-if="column.key==='show'">
        <a-button @click="record.show=!record.show" type="primary" shape="circle" size="small">
          <span v-if="!record.show">
             <eye-outlined />
          </span>
          <span v-else>
            <eye-invisible-outlined />
          </span>

        </a-button>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
            v-for="tag in record.tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-dropdown>
          <span class="ant-dropdown-link" @click.prevent>
            <ellipsis-outlined style="font-size: 22px" />
          </span>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="delAccount(record)" href="javascript:;"><delete-outlined /> 删除</a>
              </a-menu-item>
<!--              <a-menu-item>-->
<!--                <a href="javascript:;">2nd menu item</a>-->
<!--              </a-menu-item>-->
<!--              <a-menu-item>-->
<!--                <a href="javascript:;">3rd menu item</a>-->
<!--              </a-menu-item>-->
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </a-table>
</template>

<style scoped>

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
