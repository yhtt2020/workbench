import { useAddCard } from "../../../../ui/hooks/useAddCard";

export const useRegisterCard = (data: object) => {
  useAddCard("TTAppCard", data);
};
