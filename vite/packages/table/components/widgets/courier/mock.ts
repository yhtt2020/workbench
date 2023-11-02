import exp from "constants"

export const courier=([
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已签收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:2
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'在途中',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:1
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已揽收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:2
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已签收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:3
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'在途中',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:4
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已揽收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:1
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已签收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:2
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'在途中',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:4
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已揽收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:3
    },
])
// 处理不同快递状态背景颜色
export const switchColor=(state)=>{
    switch (state) {
        case "0":
            return '#508BFE';
            break;
        case "1":
            return '#43CADE';
            break;
        case "2":
            return '#508BFE';
            break;
        case "3":
            return '#FA7B14';
            break;
        case "4":
            return '#52C41A';
            break;
        case "5":
            return '#508BFE';
            break;
        case "6":
            return '#508BFE';
            break;

        default:
            return '#508BFE';
    }
}
// 解析部分常见快递公司
export const kdCompany=(shipperCode)=>{
    switch (shipperCode) {
        case 'SF':
            return '顺丰快递';
            break;
        case 'ZTO':
            return '中通快递';
            break;
        case 'YTO':
            return '圆通快递';
            break;
        case 'HTKY':
            return '百世快递';
            break;
        case 'STO':
            return '申通快递';
            break;
        case 'YZPY':
            return '邮政快递包裹';
            break;
        case 'EMS':
            return 'EMS';
            break;
        case 'JD':
            return '京东快递';
            break;
        case 'YD':
            return '韵达快递';
            break;
        case 'JTSD':
            return '极兔速递';
            break;
        case 'CNSD':
            return '菜鸟直送';
            break;
        case 'CNCY':
            return '菜鸟橙运';
            break;
    }
}
// 获取快递状态
export const kdState=(state)=>{
    switch (state) {
        case "0":
            return '暂无轨迹信息';
            break;
        case "1":
            return '已揽收';
            break;
        case "2":
            return '在途中';
            break;
        case "3":
            return '已签收';
            break;
        case "4":
            return '问题件';
            break;
        case "5":
            return '转寄';
            break;
        case "6":
            return '清关';
            break;
        case "202":
            return "派送中";
            break;
        case "211":
            return "待取件";
            break;
    }
}

