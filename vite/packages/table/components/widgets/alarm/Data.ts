import { countDownStore } from './../../../store/countDown';
export const countDownData = () => {

    const useCountDown = countDownStore();
    return [
        {
            title:"3分钟",
            fn:() => {
                useCountDown.setCountDown({ hours: 0, minutes: 3, seconds: 0 })
            },
            isCustom:false
        },
        {
            title:"5分钟",
            fn:() => {
                useCountDown.setCountDown({ hours: 0, minutes: 5, seconds: 0 })
            },
            isCustom:false
        },
        {
            title:"10分钟",
            fn:() => {
                useCountDown.setCountDown({ hours: 0, minutes: 10, seconds: 0 })
            },
            isCustom:false
        },
        {
            title:"15分钟",
            fn:() => {
                useCountDown.setCountDown({ hours: 0, minutes: 15, seconds: 0 })
            },
            isCustom:false
        },
        {
            title:"30分钟",
            fn:() => {
                useCountDown.setCountDown({ hours: 0, minutes: 30, seconds: 0 })
            },
            isCustom:false
        },
        {
            title:"60分钟",
            fn:() => {
                useCountDown.setCountDown({ hours: 1, minutes: 0, seconds: 0 })
            },
            isCustom:false
        },
        {
            title:'自定义',
            fn:() => {
                console.log(111111)
            },
            isCustom:true
        }
    ]

}