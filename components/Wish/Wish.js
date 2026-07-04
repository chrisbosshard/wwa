// IMPORT BASICS
import React, { useState } from "react";

// IMPORT COMPONENTS
import Slide from "@mui/material/Slide";

function TransitionUp(props) {
  return <Slide {...props} direction="right" />;
}

const Wish = (props) => {
  // PROPS
  const { wish, onSelect, small } = props;

  // FUNCTIONS
  // ******************************************
  // handleSelection
  // ******************************************
  const handleSelection = () => {
    if (onSelect) onSelect(wish.id);
  };

  const background = "/polaroid.png";
  const clsDiv = small ? "polaroid-small" : "polaroid";

  return (
    <>
      <div className={"card " + clsDiv} style={{ backgroundImage: `url("` + background + `")` }} onClick={() => handleSelection()}>
        <div>
          <div className={"card-content"}>
            <div className="flex aspect-square w-full items-center justify-center bg-white p-3">
              <img src={wish.image.url} alt="gift" className="max-h-full max-w-full object-contain" />
            </div>
            {!small && <h3 className={"card-title"}>{wish.description}</h3>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wish;
