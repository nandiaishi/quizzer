import React, { useEffect, useState } from "react";
import "./App.css";
import dataset from "./data/questions.json";

function App() {
  const [currentQuestion, setCurrentQuesion] = useState({
    question: "Loading ...",
    options: [],
    correctAnswer: "Loading",
  });
  const [answeredOption, setAnsweredOption] = useState("");
  const [previousIndexes, setPreviousIndexes] = useState([]);
  const [streak, setStreak] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    loadARandomQuestion();
    // eslint-disable-next-line 
  }, []);

  const resetState = () => {
    setShowModal(false);
    setShowSuccessModal(false);
    setPreviousIndexes([]);
    setStreak(0);
    loadARandomQuestion()
  }

  const resetQuestion = () => {
    setAnsweredOption("");
  };

  const loadARandomQuestion = () => {
    resetQuestion();

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * dataset.length);
    } while (previousIndexes.includes(randomIndex));

    const randomQuestion = dataset[randomIndex];
    setPreviousIndexes([...previousIndexes, randomIndex]);
    setCurrentQuesion(randomQuestion);
  };

  const checkAnswer = (clickedAnswer) => {
    if (answeredOption === "") {
      setAnsweredOption(clickedAnswer);
      if (clickedAnswer === currentQuestion.correctAnswer) {
        // correctly answered
        setStreak(streak + 1);
        setTimeout(() => {
          if(streak + 1 === 12){
            setShowSuccessModal(true);
          } else {
            loadARandomQuestion();
          }
        }, 1000);
      } else {
        // incorrectly answered
        setTimeout(() => {
          setShowModal(true);
          setTimeout(() => {
            resetState();
          }, 2000);
        }, 1000);
        
      }
    }
  };

  return (
    <div className="title">
      <div className="padded header">
        <div>
          <h4 className="font">Quizzer</h4>
        </div>
      </div>
      <div className="padded">
        <h2>{currentQuestion.question}</h2>
        <ul className="list">
          {currentQuestion.options.map((item, index) => {
            return (
              <li
                className={`normal ${
                  answeredOption === "" ? "" : "not-allowed"
                } ${
                  currentQuestion.correctAnswer === item && answeredOption !== ""
                    ? "correct"
                    : ""
                } ${
                  currentQuestion.correctAnswer !== item &&
                  answeredOption === item
                    ? "wrong"
                    : ""
                }`}
                key={index}
                onClick={() => checkAnswer(item)}
              >
                <div>{item}</div>
                {answeredOption === item ? (
                  <div>
                    {answeredOption === currentQuestion.correctAnswer
                      ? "✅"
                      : "❌"}
                  </div>
                ) : (
                  <div></div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="padded header">
        <div>
          <h4 className="font">
            Streak: <strong>{streak}</strong>
          </h4>
        </div>
        <button className="footer" onClick={() => loadARandomQuestion()}>
          Skip
        </button>
      </div>
      {showModal ? (
        <div className="modal">
          <div className="modal-content">
            <h6 className="modal-heading emoji">🤪</h6>
            <h1 className="modal-heading lost">You lost your streak!</h1>
            <h4 className="modal-heading try">Try again</h4>
          </div>
        </div>
      ) : null}
      {showSuccessModal ? (
        <div className="modal">
          <div className="modal-content">
            <h6 className="modal-heading emoji">🎉🥳🎁</h6>
            <h1 className="modal-heading won">Congratulations!!!</h1>
            <h4 className="modal-heading try">You have answered {streak} questions correctly in a row!</h4>
            <button className="start-button" onClick={()=> resetState()}>Start Over</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;