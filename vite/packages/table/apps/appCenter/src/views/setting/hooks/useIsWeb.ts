import { usePlat } from "../../../../../../permission/usePlat";

export const useIsWeb = () => {
    const plat = usePlat(["web"]);
    if(plat) {
        window.$ui.confirm(
            'web端暂不支持此功能,',
            '请下载客户端体验完整内容。',
            {
                noText: '稍后再说',
                okText: '立即下载',
                ok: () => {
                    window.open('https://www.apps.vip/download/');
                },
                okButtonWidth: '95',
                noButtonWidth: '95',
            }
        )
    }
}