import React from "react";

function Cell({ letter, status }) {
  let sclass;
  switch (status) {
    case "LETTER_ELSEWHERE":
      sclass = "has-background-warning";
      break;
    case "LETTER_MATCHED":
      sclass = "has-background-success";
      break;
    case "LETTER_NOT_FOUND":
      sclass = "has-background-grey-lighter";
      break;
    default:
      sclass = "";
      break;
  }
  return <div className={`cell ${sclass}`}>{letter}</div>;
}

export default Cell;