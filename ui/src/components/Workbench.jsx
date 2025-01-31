import React, { useState, useEffect } from "react";
import { set as dbset, get as dbget } from "lockr";
import InputBoxes from "./InputBoxes";
import axios from "axios";
import HistoryBoxes from "./HistoryBoxes";
import verifier from "./verifier";

const historykey = new Date().toDateString().replace(/ /g, "-");

function Workbench({
  length,
  letters,
  complete,
  blacklist,
  onVerified,
  onSuccess,
}) {
  let oldhistory = dbget("guessHistory") || {};
  const [guesses, setGuesses] = useState(oldhistory[historykey] || []);
  const [highlightEmpty, setHighlightEmpty] = useState(false);

  const verify = () => {
    if (letters.length !== length) {
      setHighlightEmpty(true);
      return;
    }
    // call the API only when all the boxes are full
    let results = verifier(letters);
    setGuesses([...guesses, { letters, results }]);
    let wrongLetters = letters.filter(
      (l, i) => results[i] === "LETTER_NOT_FOUND"
    );
    onVerified({ wrongLetters });

    /*
    axios
      .post(
        "https://tamilwordle-maleycpqdq-el.a.run.app/verify-word-with-uyirmei",
        letters
      )
      .then((res) => {
        console.log(res.data);
        let results = res.data;
        if (res.status === 202) {
          results = Array(length).fill("LETTER_MATCHED");
          setGuesses([...guesses, { letters, results }]);
          onSuccess();
        } else {
          setGuesses([...guesses, { letters, results }]);
          let wrongLetters = letters.filter(
            (l, i) => results[i] === "LETTER_NOT_FOUND"
          );
          onVerified({ wrongLetters });
        }
      })
      .catch((e) => {
        console.log(e);
        alert("Error");
      });
      */
  };

  // reset red border when user starts to type again
  useEffect(() => {
    setHighlightEmpty(false);
  }, [letters]);

  // automatically save the guesses to localstorage
  useEffect(() => {
    let history = dbget("guessHistory") || {};
    history[historykey] = guesses;
    dbset("guessHistory", history);
  }, [guesses]);

  return (
    <div className="is-flex is-flex-direction-column is-justify-content-space-between workbench">
      <div id="historyboxes">
        {guesses.map((g, i) => (
          <HistoryBoxes key={i} guess={g} />
        ))}
      </div>
      {!complete ? (
        <div>
          <InputBoxes
            length={length}
            letters={letters}
            highlightEmpty={highlightEmpty}
            blacklist={blacklist}
          />
          <div className="my-3 buttons">
            <button
              id="verify-button"
              className="button is-primary mx-auto"
              onClick={() => verify()}
            >
              சரிபார்
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Workbench;
