import { nanoid } from "nanoid";

export const useTransform = (item) => {
    return {
        ...item,
        icon:item.icon,
        name:item.name,
        id:nanoid(4),
        type: item.type || 'coolApp',
        value: item.installPath || item.data,
    };
}