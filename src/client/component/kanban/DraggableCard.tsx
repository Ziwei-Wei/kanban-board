import React, {FunctionComponent, useRef} from "react";
import Card, {CardProps} from "./Card";

import {Draggable} from "../../model/draggable";

type DraggableCardProps = CardProps & Draggable;

const DraggableCard: FunctionComponent<DraggableCardProps> = (props: DraggableCardProps) => {
  const selfRef = useRef<HTMLDivElement>(null);
  const onDragStart = (event: React.DragEvent<HTMLDivElement>): void => {
    event.dataTransfer.setData("index", String(props.index));
    event.dataTransfer.setData("id", props.id);
    event.dataTransfer.setData("board", props.board);
    event.dataTransfer.setData("kanban", props.kanban);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    const self = selfRef.current;
    const cardID = event.dataTransfer.getData("id");
    const cardElement = document.getElementById(cardID);
    if (self && cardElement) {
      const mouseY = event.pageY;

      const selfRect = self.getBoundingClientRect();
      const selfY = selfRect.top;
      const selfH = selfRect.height;
      const dist = mouseY - selfY;

      const newBoard = props.board;
      const newIndex = props.index;
      const oldBoard = event.dataTransfer.getData("board");
      const oldIndex = Number(event.dataTransfer.getData("index"));

      if (dist < selfH / 2) {
        props.onCardMove(oldBoard, oldIndex, newBoard, newIndex);
        console.log("top");
      } else {
        props.onCardMove(oldBoard, oldIndex, newBoard, newIndex + 1);
        console.log("bottom");
      }
    }
  };

  return (
    <div
      id={props.id}
      ref={selfRef}
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Card
        id={props.id}
        index={props.index}
        kanban={props.kanban}
        board={props.board}
        card={props.card}
        onEditCard={props.onEditCard}
        onDeleteCard={props.onDeleteCard}
      />
    </div>
  );
};
//
export default DraggableCard;
