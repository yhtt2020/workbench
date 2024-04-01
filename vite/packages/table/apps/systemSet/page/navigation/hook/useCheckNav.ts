import { navStore } from './../../../../../store/nav';
import { message } from 'ant-design-vue';

message.config({
    maxCount: 1
})

export const useCheckNav = (value: string): void => {
    const store = navStore();
    const foot = store.navigationToggle[2] ? store.copyFootNav : [];
    const left = store.navigationToggle[0] ? store.sideNavigationList : [];
    const right = store.navigationToggle[1] ? store.rightNavigationList : [];

    const checkAndToggle = (listToCheck: Array<object>, toggleIndex: number): void => {
        if (checkList(listToCheck)) {
            store.navigationToggle[toggleIndex] = false;
            return;
        }
        store.navigationToggle[toggleIndex] = true;
        message.info("至少保留一个「首页」图标");
    };

    if (value === 'foot') {
        checkAndToggle([...left, ...right], 2);
    } else if (value === 'left') {
        checkAndToggle([...right, ...foot], 0);
    } else if (value === 'right') {
        checkAndToggle([...left, ...foot], 1);
    }
};

const checkList = (list: Array<object>): boolean => {
    if (list.some((item) => {
        if (item.type === 'folder') {
            checkList(item?.children);
        }
        return item.value === 'home';
    })) {
        return true;
    }
    return false;
}
