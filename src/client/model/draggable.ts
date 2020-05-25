import {RawCard} from "../../server/model/card";

export type Draggable = {
  onCardMove: (
    oldBoardName: string,
    oldIndex: number,
    newBoardName: string,
    newIndex: number
  ) => Promise<void>;
  onCreateCard: (boardName: string, card: RawCard, resume?: Blob) => Promise<void>;
  onDeleteCard: (boardName: string, cardIndex: number) => Promise<void>;
  onEditCard: (boardName: string, cardID: string, card: RawCard) => Promise<void>;
};
