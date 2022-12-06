import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getAttempts, getChallenge, sendGuess } from "../ApiClient";
import LastAttempts from "./LastAttempts";

function Challenge() {
  const [attempt, setAttempt] = useState({
    alias: "",
    guess: "",
    factorA: "",
    factorB: "",
    lastAttempts: [],
  });

  const [message, setMessage] = useState("");

  const getNewChallenge = () => {
    getChallenge()
      .then((res) => {
        const { factorA, factorB } = res.data;
        setAttempt((prev) => {
          return {
            ...prev,
            factorA,
            factorB,
          };
        });
        updateLastAttempts(localStorage.getItem("alias"));
      })
      .catch((err) => {
        console.log(err);
        setMessage("Can't the reach server!");
      });
  };

  useEffect(() => {
    getNewChallenge();
    setAttempt(prev => {return {...prev, alias: 
      localStorage.getItem("alias")}})
  }, []);

  const refreshChallenge = () => {
    getNewChallenge();
    updateLastAttempts(localStorage.getItem("alias"));

    setAttempt((prev) => {
      return { ...prev, guess: "" };
    });
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setAttempt((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const updateLastAttempts = (alias) => {
    getAttempts(alias)
      .then((res) => {
        setAttempt((prev) => {
          return { ...prev, lastAttempts: res.data };
        });
      })
      .catch((err) => console.log(err));
  };

  const handleSubmitResult = (e) => {
    e.preventDefault();
    sendGuess(attempt)
      .then((res) => {
        const { data } = res;
        if (data.correct) setMessage("Congratulations! Your guess is correct");
        else
          setMessage(
            "Oops! Your guess " +
              data.resultAttempt +
              " is wrong, but keep playing!"
          );
        localStorage.setItem("alias", attempt.alias);
        refreshChallenge();
      })
      .catch((err) => {
        console.log(err);
        setMessage("Error: server error or not available");
      });
  };

  return (
    <div>
      <div>
        <h3>Your new challenge is</h3>
        <h1>
          {attempt.factorA} x {attempt.factorB}
        </h1>
      </div>
      <form onSubmit={handleSubmitResult}>
        <label>
          Your alias:
          <input
            type="text"
            maxLength="12"
            name="alias"
            value={attempt.alias}
            onChange={onChangeHandler}
          />
        </label>
        <br />
        <label>
          Your guess:
          <input
            type="number"
            min="0"
            name="guess"
            value={attempt.guess}
            onChange={onChangeHandler}
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
      <h4>{message}</h4>
      {attempt.lastAttempts.length > 0 && (
        <LastAttempts lastAttempts={attempt.lastAttempts} />
      )}
    </div>
  );
}

export default Challenge;
