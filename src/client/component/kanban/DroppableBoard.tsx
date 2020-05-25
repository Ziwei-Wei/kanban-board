import React, {FunctionComponent, useRef, useState} from "react";
import styled from "styled-components";

import DraggableCard from "./DraggableCard";
import CardModal from "./CardModal";
import AddCardButton from "../button/addCardButton";
import {Draggable} from "../../model/draggable";
import {Card, RawCard} from "../../../server/model/card";

const DropDiv = styled.div`
  height: 100%;
  width: 100%;
`;

const BoardDiv = styled.div`
  min-width: 12rem;
  padding: 0.5rem;
  margin: 5rem 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 10px 1px lightgrey;

  display: flex;
  flex-direction: column;
  justify-items: center;
`;

const BoardHeader = styled.div`
  padding-bottom: 0.25rem;
  margin-bottom: 0.5rem;
  background-color: white;
  border-bottom: 1px solid whitesmoke;
  text-align: center;
`;

export type BoardProps = Draggable & {
  kanban: string;
  name: string;
  cards: Card[];
};

const DroppableBoard: FunctionComponent<BoardProps> = (props: BoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);

  const [hideModal, setHideModalState] = useState<boolean>(true);

  const onDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const cardID = event.dataTransfer.getData("id");
    const cardElement = document.getElementById(cardID);
    if (cardElement) {
      cardElement.style.display = "block";
      const oldBoard = event.dataTransfer.getData("board");
      const oldIndex = Number(event.dataTransfer.getData("index"));
      props.onCardMove(oldBoard, oldIndex, props.name, props.cards.length);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onCreateCard = async (card: RawCard, file?: Blob): Promise<void> => {
    await props.onCreateCard(props.name, card, file);
    setHideModalState(true);
  };

  return (
    <DropDiv onDrop={onDrop} onDragOver={onDragOver}>
      <BoardDiv ref={boardRef}>
        <CardModal
          kanban={props.kanban}
          board={props.name}
          isHidden={hideModal}
          onClose={() => {
            setHideModalState(true);
          }}
          onSubmit={onCreateCard}
        />
        <BoardHeader>{props.name}</BoardHeader>
        {props.cards.map((card, index) => (
          <DraggableCard
            key={index}
            id={card._id || props.name + index}
            index={index}
            kanban={props.kanban}
            board={props.name}
            card={card}
            onCardMove={props.onCardMove}
            onCreateCard={props.onCreateCard}
            onEditCard={props.onEditCard}
            onDeleteCard={props.onDeleteCard}
          />
        ))}
        <AddCardButton
          onClick={() => {
            setHideModalState(false);
          }}
        ></AddCardButton>
      </BoardDiv>
    </DropDiv>
  );
};

export default DroppableBoard;
