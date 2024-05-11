import { nanoid } from "nanoid";
import { defaultData } from "../../../../../../ui/hooks/useDataConversion";

export const useTransform = (item) => {
    return {
        ...defaultData,
        ...item,
        isStart:item.isStart || false,
        icon:item.icon,
        name:item.name,
        id:item.id || nanoid(4),
        type: item.type || 'coolApp',
        value: item.type === 'ttapp' || item.type === 'lightApp' ? item.value : item.installPath || item.data,
    };
}