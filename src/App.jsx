import React, {useState, useEffect} from 'react'
import HomePage from './components/HomePage'
import QuestionPage from './components/QuestionPage'
import { nanoid } from 'nanoid'

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [displayQuestion, setDisplayQuestion] =useState([])
  const [rendered, setRendered] = useState(false)
  const [checkGame, setCheckGame] = useState(false)
  const [count, setCount] = useState(0)

  function startGame() {
    setIsGameStarted(prevState => !prevState)
  }

  useEffect(() => {
    let isMounted = true

    if (isGameStarted && isMounted){
      async function getQuestions() {
      try {
        const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        const data = await res.json()
        setQuestions(data.results)
        setRendered(true)
      } catch (error) {
        console.log("error")
      }
      }
      getQuestions()
    } 

    return () => {
      isMounted = false
    }

  }, [isGameStarted])

  useEffect(() => {
      const newArray = 
        questions.map(answer => {
        const answers = [...answer.incorrect_answers, answer.correct_answer]
        const answerObj = answers.map((item, index) => {
          if (index === 3) {
            return {
              id: nanoid(),
              answer: item,
              isHeld: false, 
              isRight: true}
          } else {
           return {
            id: nanoid(),
            answer: item, 
            isHeld: false, 
            isRight: false}
          }
        })

        const randomNum = (index) => Math.floor(Math.random() * index + 1)
        
        function radnomizeArray() {
          
        }

        const newQuestion = {
          id: nanoid(),
          question: answer.question,
          answer: answerObj
        }
        return newQuestion
      })
      setDisplayQuestion(newArray)

  }, [questions])

  function chooseAnswer(id) {
      setDisplayQuestion(prevQuestion => 
        prevQuestion.map(item => {
          if (item.answer.some(item => item.id === id )) {
            return {
              ...item, 
              answer: item.answer.map(item => 
                item.id === id ? 
                  {...item, isHeld: !item.isHeld} : 
                  {...item, isHeld: false})}
          } else {
            return item
          }
        })
      ) 
  }

  function checkResults() {
    setCheckGame(true)
    displayQuestion.map(item => {
      item.answer.map(item => {
        if (item.isHeld && item.isRight) {
          setCount(prevCount => prevCount + 1)
        }
      })
    })
  }

  function playAgain() {
     setCheckGame(prevCheck => !prevCheck)

  }

  const questionElements = displayQuestion.map(item => 
    <QuestionPage 
      key={item.id}
      id={item.id}
      answers={item.answer}
      question={item.question}
      handelClick={chooseAnswer}
      checkGame={checkGame}
    />
    
  )

  return (
      <main className={`${!isGameStarted ? "menu" : "game"}`}>
        {!isGameStarted ? <HomePage 
          startGame={startGame}
        /> : 
        questionElements
        }
        {checkGame && <span> {count} / 5 correct Answers</span>}
        {rendered && <button 
          className="check-btn" 
          onClick={checkGame ? playAgain : checkResults}>
            {checkGame ? "Play again" : "Check answers"}
            </button>}
      </main>
  )
}

export default App



// setDisplayQuestion(prevQuestion => 
//   prevQuestion.map(item => {
//     return {
//       ...item, 
//       answer: item.answer.map(item => 
//         {return item.id === id ? 
//           {...item, isHeld: !item.isHeld} : 
//           {...item, isHeld: false}})}
//   })
// ) 