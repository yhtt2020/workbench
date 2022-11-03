<template>
  <h3>开发向导

  </h3>
  <div style="background: white;padding: 20px;border-radius: 4px">

    <a-steps v-model:current="currentStep" direction="vertical">
      <a-step v-for="step in steps" :title="step.title" :sub-title="step.subTitle">
        <template #description>
          <a-list size="small" :data-source="step.nodes">
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <div v-if="!item.target && item.href">

                    <a-progress :width="20" v-if="item.hasPercent" type="circle" :strokeWidth="20"
                                :format="()=>{return ''}" :percent="item.percent()"
                                style="margin-right: 10px"></a-progress>
                    <a @click="go(item.href)">{{ item.hrefText || '去设置' }}</a>
                    <!--                      <router-link :to="{path:item.href}">{{item.href}}去设置</router-link>-->
                  </div>
                  <div v-else-if="item.target==='_tab'">
                    <a @click="addTab(item.href)">{{ item.hrefText || '打开' }}</a>
                  </div>
                </template>
                <a-list-item-meta :description="item.description">
                  <template #title>
                    <a-checkbox v-if="item.type==='checkbox'" :checked="item.checked()">
                      {{ item.title }}
                    </a-checkbox>
                    <span v-else> {{ item.title }}</span>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </template>
      </a-step>
    </a-steps>

  </div>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../../store'
import { CodeTwoTone } from '@ant-design/icons-vue'

export default {
  name: 'develop',
  components: {
    CodeTwoTone
  },
  data () {
    return {
      currentStep: '',
      steps: []
    }
  },
  mounted () {
    const steps = [
      {
        title: '基础设置',
        subTitle: '千里之行始于足下',
        nodes: [
          {
            title: '学习在线文档',
            description: '建议在开发前，先系统学习在线文档。',
            href: 'https://a.apps.vip/docs',
            hrefText: '去学习',
            target: '_tab'
          },
          {
            title: '完善基本信息',
            progress: null,
            hasPercent: true,
            percent: () => {
              let done = 0
              let count = Object.keys(this.devApp).length
              Object.keys(this.devApp).forEach(key => {
                if (!!!this.devApp[key]) {
                  done++
                }
              })
              console.log(done)
              console.log(Object.keys(this.devApp))
              return ((done / count) * 100).toFixed(0)
            },
            href: '/setting/baseDev'
          }, {
            title: '设置权限',
            progress: null,
            description: '根据实际需求选择权限，不需要的不要勾选，以免造成用户流失',
            href: '/setting/authDev'
          },
        ]
      },
      {
        title: '开发',
        subTitle: 'coding',
        nodes: [
          {
            type: 'checkbox',
            title: '设置项目目录',
            description: '设置了目录才可以导出minifest和打包',
            href: '/setting/baseDev',
            hrefText: '去设置',
            checked: () => {
              return !!this.devApp.local_dir
            }
          }, {
            type: 'checkbox',
            title: '申请唯一包名',
            description: '只有注册了唯一包名的应用才可以使用api',
            href: '/setting/baseDev',
            hrefText: '去申请',
            checked: () => {
              return !!this.devApp.package
            }
          },
          {
            title: '加入开发者学院',
            description: '在元社区假如开发者学院，学习开发知识',
            href: '',
            target: '_tab'
          },
          {
            title: '加入轻聊开发者学院群聊',
            description: '通过加入元社区圈子自动加入群聊'
          },

        ]
      }, {
        title: '打包',
        subTitle: '大功告成',
        nodes: [
          {
            title: '导出离线安装包'
          }
        ]
      }, {
        title: '上架',
        subTitle: '',
        nodes: [
          {
            title: '开发者入驻'
          },
          {
            title: '申请上架'
          }, {
            title: '分享应用',
            description: '赶紧发给你的亲朋好友体验一下吧。'
          }
        ]
      }, {
        title: '运营',
        subTitle: '',
        nodes: [
          {
            title: '开通元社区版块'
          },
          {
            title: '开通轻聊群聊'
          }
        ]
      }
    ]
    this.steps = steps
  },
  computed: {
    ...mapWritableState(appStore, ['app', 'debugMod', 'devApp'])
  },
  methods: {
    ...mapActions(appStore, ['toggleDebug']),
    go (path) {
      this.$router.push({ path })
    },
    addTab (url) {
      ipc.send('addTab', { url: url })
    }
  }
}
</script>

<style scoped>

</style>
