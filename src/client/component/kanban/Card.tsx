import React, {FunctionComponent, useState} from "react";
import styled from "styled-components";

import StarRating from "../rate/StarRating";
import CardModal from "./CardModal";

import {Card, RawCard} from "../../../server/model/card";
import {FaTrashAlt, FaRegEdit} from "react-icons/fa";
import {uploadResume} from "../../api";

const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: 0rem;
  margin: 0rem 0.25rem;
  outline: none;
`;

const CardDiv = styled.div`
  user-select: none;
  background-color: white;
  border: 1px solid lightgrey;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  height: min-content;
  padding: 0.5rem;
  box-shadow: 0px 1px 0px lightgrey;

  display: flex;
  flex-direction: column;
  &:active {
    background-color: white;
    box-shadow: 0px 0px 10px 1px lightgrey;
    border: 1px solid black;
  }
`;

const CardHeader = styled.div`
  padding: 0rem 0.25rem;
  margin-bottom: 0.25rem;
  background-color: white;
  border-bottom: 1px solid lightgrey;

  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

export type CardProps = {
  id: string;
  index: number;
  kanban: string;
  board: string;
  card: Card;
  onDeleteCard: (boardName: string, cardIndex: number) => Promise<void>;
  onEditCard: (boardName: string, cardID: string, card: RawCard) => Promise<void>;
};

const CardItem: FunctionComponent<CardProps> = (props: CardProps) => {
  const [hideModal, setHideModalState] = useState<boolean>(true);

  const userRatingDefault = (card?: Card): number => {
    if (!card) return 0;
    return card.ratings.reduce((prev, curr) => {
      if (curr.user === localStorage.getItem("user")) {
        return curr.rating;
      }
      return prev;
    }, 0);
  };

  const averageRatingDefault = (card?: Card): number => {
    if (!card) return 0;
    return card.ratings.reduce((prev, curr) => prev + curr.rating, 0) / card.ratings.length;
  };

  const onDelete = (): void => {
    if (props.card._id) props.onDeleteCard(props.board, props.index);
  };

  const onEdit = (): void => {
    setHideModalState(false);
  };

  const onEditCard = async (card: RawCard, file?: Blob): Promise<void> => {
    if (props.card._id) {
      await props.onEditCard(props.board, props.card._id, card);
      if (file) {
        await uploadResume(props.kanban, props.board, props.card._id, file);
      }
    }
    setHideModalState(true);
  };

  return (
    <CardDiv>
      <CardModal
        card={props.card}
        kanban={props.kanban}
        board={props.board}
        isHidden={hideModal}
        onClose={() => {
          setHideModalState(true);
        }}
        onSubmit={onEditCard}
      />
      <CardHeader>
        <Button onClick={onDelete}>
          <FaTrashAlt />
        </Button>
        <Button>
          <FaRegEdit onClick={onEdit} />
        </Button>
      </CardHeader>
      <div>Name: {props.card.name}</div>
      <div>Phone: {props.card.phone}</div>
      <div>Email: {props.card.email}</div>
      <div>Education: {props.card.education}</div>
      <div>My Rating: </div>
      <StarRating editable={false} value={userRatingDefault(props.card)} />
      <div>Average Rating: </div>
      <StarRating editable={false} value={averageRatingDefault(props.card)} />
      <div>
        Resume: <a href={"/api/resume/" + props.card._id}>Link</a>
      </div>
    </CardDiv>
  );
};

export default CardItem;
