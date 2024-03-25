import { useAddCard } from "../../../../ui/hooks/useAddCard";

export const useRegisterModal = (name: string, data: object, id: string) => {
  useAddCard("name", data);
};
