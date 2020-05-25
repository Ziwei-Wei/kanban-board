import React, {FunctionComponent} from "react";
import styled from "styled-components";

import {FaStar, FaRegStar} from "react-icons/fa";

const StarRatingDiv = styled.div`
  margin: 0.25rem 0rem;
  display: flex;
  flex-direction: row;
  justify-items: center;
`;

const StarDiv = styled.div`
  margin: 0rem 0.25rem;
`;

const SolidDiv = styled.div``;
const FrameDiv = SolidDiv;

type RatingProps = {
  editable: boolean;
  value: number;
  onValueChange?: (value: number) => void;
};

const StarRating: FunctionComponent<RatingProps> = (props: RatingProps) => {
  const solidColor = "gold";

  const edit = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    const val = Number(event.currentTarget.id);
    if (props.onValueChange) props.onValueChange(val);
  };

  const calculateColor = (val: number): string => {
    if (val < 0.33) {
      return "silver";
    } else if (val >= 0.33 && val < 0.66) {
      return "palegoldenrod";
    } else {
      return "gold";
    }
  };

  return (
    <StarRatingDiv>
      <StarDiv id="1" onClick={edit}>
        <SolidDiv hidden={props.value < 1}>
          <FaStar color={solidColor} />
        </SolidDiv>
        <FrameDiv hidden={props.value >= 1}>
          <FaRegStar color={calculateColor(props.value - 1)} />
        </FrameDiv>
      </StarDiv>
      <StarDiv id="2" onClick={edit}>
        <SolidDiv hidden={props.value < 2}>
          <FaStar color={solidColor} />
        </SolidDiv>
        <FrameDiv hidden={props.value >= 2}>
          <FaRegStar color={calculateColor(props.value - 2)} />
        </FrameDiv>
      </StarDiv>
      <StarDiv id="3" onClick={edit}>
        <SolidDiv hidden={props.value < 3}>
          <FaStar color={solidColor} />
        </SolidDiv>
        <FrameDiv hidden={props.value >= 3}>
          <FaRegStar color={calculateColor(props.value - 3)} />
        </FrameDiv>
      </StarDiv>
      <StarDiv id="4" onClick={edit}>
        <SolidDiv hidden={props.value < 4}>
          <FaStar color={solidColor} />
        </SolidDiv>
        <FrameDiv hidden={props.value >= 4}>
          <FaRegStar color={calculateColor(props.value - 4)} />
        </FrameDiv>
      </StarDiv>
      <StarDiv id="5" onClick={edit}>
        <SolidDiv hidden={props.value < 5}>
          <FaStar color={solidColor} />
        </SolidDiv>
        <FrameDiv hidden={props.value >= 5}>
          <FaRegStar color={calculateColor(props.value - 5)} />
        </FrameDiv>
      </StarDiv>
      <StarDiv id="value">{props.value > 0 ? Math.round(props.value * 10) / 10 : "?"}</StarDiv>
    </StarRatingDiv>
  );
};

export default StarRating;
