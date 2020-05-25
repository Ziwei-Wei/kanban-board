import React, {FunctionComponent, useState, useEffect} from "react";
import styled from "styled-components";

import DroppableBoard from "./DroppableBoard";

import {Board} from "../../../server/model/kanban";
import {RawCard, Card} from "../../../server/model/card";

import {getKanban, createCard, deleteCard, updateCard, updateBoards, uploadResume} from "../../api";

const KanbanDiv = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
`;

export type KanbanProps = {
  refresh: boolean;
  hidden: boolean;
  id: string;
};

const KanbanBoards: FunctionComponent<KanbanProps> = (props: KanbanProps) => {
  const [boards, setBoards] = useState<Board[]>([]);

  const updateKanban = async (): Promise<void> => {
    try {
      const data = await getKanban(props.id);
      if (data) setBoards(data.boards);
    } catch (error) {
      console.log(error);
    }
  };

  const getCardByIndex = (boardName: string, index: number): Card => {
    const card = boards.reduce((prev, curr) => {
      if (curr.name === boardName) {
        return curr.cards[index];
      } else {
        return prev;
      }
    }, {}) as Card;
    return card;
  };

  const move = async (
    oldBoardName: string,
    oldIndex: number,
    newBoardName: string,
    newIndex: number
  ): Promise<void> => {
    const oldCard = getCardByIndex(oldBoardName, oldIndex);
    const newBoards = boards
      .map((board) => {
        if (board.name === oldBoardName) {
          board.cards.splice(oldIndex, 1);
        }
        return board;
      })
      .map((board) => {
        if (board.name === newBoardName) {
          board.cards.splice(newIndex, 0, oldCard);
        }
        return board;
      });
    setBoards(newBoards);
    await updateBoards(props.id, newBoards);
  };

  const append = async (boardName: string, card: RawCard, resume?: Blob): Promise<void> => {
    const cardID = await createCard(props.id, boardName, card);
    console.log("!");
    if (resume) {
      console.log("!!");
      await uploadResume(props.id, boardName, cardID, resume);
    }
    await updateKanban();
  };

  const remove = async (boardName: string, cardIndex: number): Promise<void> => {
    const oldCard = getCardByIndex(boardName, cardIndex);
    const newBoards = boards.map((board) => {
      if (board.name === boardName) {
        board.cards.splice(cardIndex, 1);
      }
      return board;
    });
    setBoards(newBoards);
    if (oldCard._id) await deleteCard(props.id, boardName, oldCard._id);
  };

  const update = async (boardName: string, cardID: string, card: RawCard): Promise<void> => {
    await updateCard(props.id, boardName, cardID, card);
    await updateKanban();
  };

  useEffect(() => {
    updateKanban();
  }, [props.refresh]);

  return (
    <KanbanDiv hidden={props.hidden}>
      {boards.map((board, index) => (
        <DroppableBoard
          key={index}
          kanban={props.id}
          name={board.name}
          cards={board.cards}
          onCardMove={move}
          onCreateCard={append}
          onDeleteCard={remove}
          onEditCard={update}
        />
      ))}
    </KanbanDiv>
  );
};

export default KanbanBoards;
