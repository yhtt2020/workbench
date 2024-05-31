import { useAppModal } from "../apps/appModal/src/hook/useAppModal";
import { useAddCard, useDelCard } from "./src/useCard";
import {
  useCardSize,
  useCardGridSize,
  useWidthToGrid,
  useHeightToGrid,
  useGridToWidth,
  useGridToHeight,
} from "./src/useCardSize";
import { useFindDesk, useGetDesk } from "./src/useDesk";
import { useElementSize, vElementSize } from "./src/useElementSize";
import { useMit } from "./src/useMit";
import { useTT } from "./src/useTT";
import { useDoubleClick } from "./src/useDoubleClick";
import { useStatus } from "./src/useStatus";
export {
  // useCard
  useAddCard,
  useDelCard,
  useCardSize,
  // useCardSize
  useCardGridSize,
  useWidthToGrid,
  useHeightToGrid,
  useGridToWidth,
  useGridToHeight,
  // useDesk
  useFindDesk,
  useGetDesk,
  // useElementSize
  useElementSize,
  vElementSize,
  // useMit
  useMit,
  // useTT
  useTT,
  // useDoubleClick
  useDoubleClick,
  useStatus,

  useAppModal,
};
