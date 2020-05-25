import React, {FunctionComponent, useRef, useState} from "react";
import {MdClose} from "react-icons/md";

import StarRating from "../rate/StarRating";

import {ModalBackground, Modal} from "../../style/modal";
import {Form, Input, UploadInput, UploadLabel, Submit, Select} from "../../style/form";
import {Button} from "../../style/button";
import {ModalHeader} from "../../style/header";
import {Card, RawCard} from "../../../server/model/card";

type ModalProps = {
  kanban: string;
  board: string;
  card?: Card;
  isHidden: boolean;
  onClose: () => void;
  onSubmit: (card: RawCard, file?: Blob) => Promise<void>;
};

const CreateCandidateCardModal: FunctionComponent<ModalProps> = (props: ModalProps) => {
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

  const [initUserRating] = useState<number>(userRatingDefault(props.card));
  const [initAverageRating] = useState<number>(averageRatingDefault(props.card));
  const [initRateCount] = useState<number>(props.card?.ratings.length || 0);
  const [resume, setResume] = useState<Blob | null>(null);
  const [userRating, setUserRating] = useState<number>(initUserRating);
  const [averageRating, setAverageRating] = useState<number>(initAverageRating);

  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const educationRef = useRef<HTMLSelectElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  const setFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.currentTarget.files) {
      console.log("fileset");
      setResume(event.currentTarget.files[0]);
    }
  };

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const card: RawCard = {
      _id: props.card?._id,
      name: nameRef.current?.value || "",
      phone: phoneRef.current?.value || "",
      email: emailRef.current?.value || "",
      education: educationRef.current?.value || "Others",
      rating: userRating
    };

    if (resume) {
      await props.onSubmit(card, resume);
    } else {
      await props.onSubmit(card);
    }

    if (!props.card) {
      setUserRating(0);
      setAverageRating(0);
    }
    formRef.current?.reset();
  };

  const changeRating = (value: number): void => {
    const oldUserRating = initUserRating;
    const oldAverageRating = initAverageRating;
    if (oldUserRating === 0) {
      const newRateCount = initRateCount + (value > 0 ? 1 : 0);
      setUserRating(value);
      setAverageRating((oldAverageRating + value) / newRateCount);
    } else {
      const rateCount = initRateCount;
      setUserRating(value);
      setAverageRating((oldAverageRating - oldUserRating + value) / rateCount);
    }
  };

  return (
    <ModalBackground hidden={props.isHidden}>
      <Modal>
        <ModalHeader>
          <div />
          <Button onClick={props.onClose}>
            <MdClose />
          </Button>
        </ModalHeader>
        <Form ref={formRef} onSubmit={handleSubmitForm}>
          <label htmlFor={props.board + props.card?._id + "education"}>Name</label>
          <Input
            id={props.board + props.card?._id + "name"}
            type="text"
            defaultValue={props.card?.name}
            ref={nameRef}
          />
          <label htmlFor={props.board + props.card?._id + "education"}>Phone</label>
          <Input
            id={props.board + props.card?._id + "phone"}
            type="tel"
            defaultValue={props.card?.phone}
            ref={phoneRef}
          />
          <label htmlFor={props.board + props.card?._id + "education"}>Email</label>
          <Input
            id={props.board + props.card?._id + "email"}
            type="email"
            defaultValue={props.card?.email}
            ref={emailRef}
          />
          <label htmlFor={props.board + props.card?._id + "education"}>Education</label>
          <Select
            id={props.board + props.card?._id + "education"}
            defaultValue={props.card?.education || "Others"}
            ref={educationRef}
          >
            <option value="Others">Others</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Graduate">Graduate</option>
            <option value="Phd">Phd</option>
          </Select>
          <label>My rating</label>
          <StarRating editable={true} value={userRating} onValueChange={changeRating} />
          <label>Average rating</label>
          <StarRating editable={false} value={averageRating} />
          <label>Resume</label>
          {props.card && <a href={"/api/resume/" + props.card._id}>Link</a>}
          <UploadLabel htmlFor={props.board + props.card?._id + "resume"}>
            Upload Resume
          </UploadLabel>
          <UploadInput
            id={props.board + props.card?._id + "resume"}
            type="file"
            accept=".pdf"
            ref={resumeRef}
            onChange={setFile}
          />
          <Submit type="submit" name="Submit" />
        </Form>
      </Modal>
    </ModalBackground>
  );
};

export default CreateCandidateCardModal;
