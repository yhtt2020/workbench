import service from "../../table/components/card/hooks/request";

export const getResult = (data) => {
  return service.post("/app/translate", { ...data });
};
