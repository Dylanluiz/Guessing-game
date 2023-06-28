import { decode } from "html-entities";
import React from "react";

export default function Buttons({answer, isHeld, handelClick, isRight, id, checkGame}) {

    const styles = {
        backgroundColor: isHeld ? "#D6DBF5" : "#FFFFFF",
        border: isHeld ? "none" : "1px solid #4D5B9E"
    }

    const checkStyles = 
    isHeld && isRight ? {
        backgroundColor: "#94D7A2",
        border: "none"
    } : isHeld && !isRight ? {
        backgroundColor: "#F8BCBC",
        border: "none",
        opacity: "0.7"
    } : isRight ? {
        backgroundColor: "#94D7A2",
        border: "none"
    }: {
        backgroundColor: "#FFFFFF",
        border: "1px solid #4D5B9E",
        opacity: "0.7",
    }

    return (
        <>
            <button 
                className="choice-btn" 
                style={checkGame ? checkStyles : styles} 
                onClick={() => handelClick(id)}
                disabled={checkGame ? true : false }>{decode(answer)}</button>
        </>
    )
}