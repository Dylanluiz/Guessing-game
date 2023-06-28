import React from "react"

export default function HomePage({startGame}) {
    return (
        <div className="home--container">
            <h1 className="site-name">Quizzical</h1>
            <p className="site-description">Select the correct answer out of the questions given</p>
            <button 
                className="run-btn"
                onClick={startGame}
                >Start quiz</button>
        </div>
    )   
}

