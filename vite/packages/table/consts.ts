//系统应用变量
const Server = {
  baseUrl: 'https://wad.apps.vip/api',
 //baseUrl:'http://test1.com:9001'
}

/**
 * 生成服务端url，斜杠开头
 * @param url 接口地址，斜杠开头
 */
function sUrl(url:string) {
  return Server.baseUrl+url
}

const SystemApps = {
  //网易云音乐
  wyyMusic: {
    theme: '#242424',
    name: 'wyyMusic',
    url: 'https://music.163.com',
    preload: 'wyyMusic',
    background: true,
  }
}
let ActionGroups = [
  {
    title: '常用',
    name: 'sendKeys',
    color: '#ff0aba',
    actions: [
      {
        title: '快捷键',
        name: 'sendKeys',
        summary: '调用全局快捷键，可实现音频控制等功能。直接输入单词即可，例如ctrl+x，<a href="https://www.yuque.com/tswork/mqon1y/mm28svv194g628gc" target="_blank">查看帮助</a>',
        inputs: [{
          rules: [{required: true, message: '必须填写快捷键'}],
          name: 'keys',
          title: '名称',
          type: 'input',
          width: '26em',
          placeholder: '请输入快捷键'
        }]
      }
    ]
  },
  {
    title: '浏览器',
    name: 'browser',
    color: '#0a84ff',
    actions: [
      {
        title: '打开网页',
        name: 'addTab',
        summary: '打开一个网页，可以选择打开的位置和方式',
        defaultValue: {
          url: '',
          position: 'builtin',
          tab: 'current'
        },
        inputs: [
          {
            rules: [{required: true, message: '必须填写需要打开的网址'}],
            name: 'url',
            placeholder: '输入完整的带协议的的地址，例如https://www.apps.vip',
            title: '打开的网址',
            type: 'input',
            width: '26em'
          },
          {
            name: 'position',
            placeholder: '',
            title: '打开的位置',
            type: 'radio',
            options: [
              {
                name: '内置浏览器',
                value: 'builtin'
              },
              {
                name: '系统浏览器',
                value: 'system'
              },
              {
                name: '工作台',
                value: 'table'
              }
            ]
          }, {
            assign: {position: 'builtin'},
            name: 'tab',
            title: '打开位置',
            type: 'radio',
            options: [{
              name: '当前标签组',
              value: 'current'
            }, {
              name: '创建新标签组打开',
              value: 'new'
            }]
          }
        ]
      },
      {
        summary: '在内置浏览器中创建一个标签组',
        title: '创建标签组',
        name: 'addTask',
        inputs: [{
          rules: [{required: true, message: '必须填写标签组名称'}],
          name: 'title',
          title: '名称',
          type: 'input',
          width: '26em',
          placeholder: '输入标签组名称'
        }]
      },
      {
        title: '打开密码管理器',
        summary: '直接打开内置的密码管理器',
        name: 'openPwdManager'
      },
      {
        title: '打开浏览器设置',
        summary: '直接打开浏览器的设置',
        name: 'openSettings'
      }
    ]
  },
  {
    title: '消息和通知',
    name: 'tip',
    color: 'orange',

    actions: [
      // {
      //   name: 'modal',
      //   title: '模态弹窗',
      //   summary: '弹窗提示',
      //   defaultValue:{
      //     closable:'true',
      //   },
      //   inputs: [
      //     {
      //
      //       name: 'closable',
      //       type: 'switch',
      //       title: '是否可关闭'
      //     }
      //   ]
      // },
      {
        name: 'dingRobot',
        title: '钉钉机器人',
        summary: '发送消息到钉钉机器人，具体需要如何配置，支持变量（需配合条件），可参考<a target="_blank" href="https://open.dingtalk.com/document/robots/custom-robot-access#title-7ur-3ok-s1a">钉钉官方文档</a>',
        defaultValue: {
          msgtype: 'text',

        },
        inputs: [{
          rules: [{required: true, message: '必须填写webhook地址'}],
          name: 'webhookUrl',
          title: 'Webhook地址',
          type: 'input',
          width: '26em',
          placeholder: '粘贴钉钉机器人webhook地址'
        },
          {
            name: 'msgtype',
            placeholder: '',
            title: '卡片类型',
            type: 'radio',
            options: [
              {
                name: 'text文本',
                value: 'text'
              },
              {
                name: 'markdown',
                value: 'markdown'
              },
              {
                name: 'ActionCard整体跳转',
                value: 'actionCard'
              },
              {
                name: 'ActionCard独立跳转',
                value: 'actionCard2'
              },
              {
                name: 'FeedCard动态卡片',
                value: 'feedCard'
              }
            ]
          },
          {
            name: 'content',
            title: '消息内容',
            type: 'textarea',
          },
          {
            name: 'atMobiles',
            title: '@人的手机号，一行一个',
            type: 'textarea',
          },
          {
            name: 'atUids',
            title: '@人的uid，一行一个',
            type: 'textarea',
          },
          {

            name: 'isAtAll',
            type: 'switch',
            title: '是否是@所有人'
          },
          {
            name: 'atUids',
            title: '@人的uid，一行一个',
            type: 'textarea',
          },

        ]
      }
    ]
  },
  {
    title: '命令行',
    name: 'cmd',
    color: '#999',
    actions: [
      {
        name: 'exe',
        title: '执行程序',
        summary: '选择一个外部程序，并执行相应的指令，支持单行和多行，具体可查看<a>此处帮助</a>',
        inputs: [
          {
            name: 'exe',
            title: '选择命令行工具：',
            type: 'file',
            rules: [{required: true, message: '必须选择一个命令行工具'}],
            placeholder: '点击选择命令行工具'
          },
          {
            name: 'cm',
            rules: [{required: true, message: '必须输入命令'}],
            title: '参数，回车换行，每行参数会顺序执行',
            type: 'textarea',
          }
        ]
      },
      {
        name: 'cmd',
        title: '执行终端（CMD）程序',
        summary: '直接执行系统的命令行，windows下执行命令提示符，mac、linux下执行终端（暂未支持这两个平台）',
        inputs: [
          {
            name: 'cm',
            title: '参数，回车换行，每行参数会顺序执行',
            type: 'textarea',
          }
        ]
      },
      {
        name: 'nircmd',
        title: '执行nircmd的命令行',
        summary: '直接执行工作台内置的nircmd，可查考此处的nircmd的命令，此操作不需要再安装nircmd，工作台自带了。点此查看<a target="_blank" href="https://www.yuque.com/tswork/mqon1y/ptyx9br06bceaaiv">nircmd的手册</a>。',
        inputs: [
          {
            name: 'cm',
            title: '参数，回车换行，每行参数会顺序执行',
            type: 'textarea',
          }
        ]
      },
      {
        name: 'svcmd',
        title: '执行SoundVolume命令',
        summary: '执行SoundVolumeView命令行工具，这个工具的音频设备操作能力比nircmd更强，可<a target="_blank" href="https://www.nirsoft.net/utils/sound_volume_view.html">参考此处</a>的命令。',
        inputs: [
          {
            name: 'cm',
            title: '参数，回车换行，每行参数会顺序执行',
            type: 'textarea',
          }
        ]
      },
      {
        name: 'mmtcmd',
        title: '执行MultiMonitorTool命令',
        summary: '执行MultiMonitorTool命令行工具，这个工具主要用于操作显示器，可<a target="_blank" href="https://www.nirsoft.net/utils/multi_monitor_tool.html">参考此处</a>的命令。',
        inputs: [
          {
            name: 'cm',
            title: '参数，回车换行，每行参数会顺序执行',
            type: 'textarea',
          }
        ]
      }
    ]
  }
]
export {SystemApps, ActionGroups, Server, sUrl}
