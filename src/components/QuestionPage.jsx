import React from "react";
import { decode } from "html-entities";
import Buttons from "./Buttons";
export default function QuestionPage({question, answers, handelClick, checkGame}) {
    
    const buttonElements = answers.map(item => 
       <Buttons
            key={item.id}
            id={item.id}
            answer={item.answer}
            isHeld={item.isHeld}
            isRight={item.isRight}
            handelClick={handelClick}
            checkGame={checkGame}
       />
    )

    return (
        <section className="question-container">
            <p className='question'>{decode(question)}</p>
            <div className="btn-container">
                {buttonElements}
            </div>
            <hr />
        </section>
    )
}

