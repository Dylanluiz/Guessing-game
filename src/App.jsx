import React, {useState, useEffect} from 'react'
import HomePage from './components/HomePage'
import QuestionPage from './components/QuestionPage'
import Level from './components/Level'
import { nanoid } from 'nanoid'

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [displayQuestion, setDisplayQuestion] =useState([])
  const [rendered, setRendered] = useState(false)
  const [checkGame, setCheckGame] = useState(false)
  const [count, setCount] = useState(0)
  // const [categories, setCategories] = useState([]) 
  const [isFetched, setIsFetched] = useState(false)
  const [options, setOptions] = useState([])
  const [chosenOption, setChosenOption] = useState('')

  const [player, setPlayer] = useState({})
  const initialPlayer = {level: 0, xp: 0, xpStack: 100}
  const [currentLevel, setCurrentLevel] = useState()
  const [currentXp, setCurrentXp] = useState()
  const [xpStack, setXpStack] = useState()

  useEffect(() => {
    const isData = localStorage.getItem('player')

    if (isData) {
      const parsedData = JSON.parse(isData)
      setPlayer(parsedData)
      setCurrentLevel(player.currentLevel)
      setCurrentXp(player.currentXp)
      setXpStack(player.xpStack)
    
    } else {
       setPlayer(initialPlayer)  
    }

  }, [])

  useEffect(() => {
      localStorage.setItem('player', JSON.stringify(player))
 
  }, [player])

  function startGame() {
    setIsGameStarted(prevState => !prevState)
  }

  useEffect(() => {
    const getCategories = async () => {
        const res = await fetch('https://opentdb.com/api_category.php')
        const data = await res.json() 
        optionsArray(data.trivia_categories)
    }
    getCategories()
    setIsFetched(prevFetch => !prevFetch)
  }, [])

  const handleChange = (event) => {
    setChosenOption(Number(event.target.value))
    console.log(chosenOption)
    setIsFetched(true)
  }

  function optionsArray(categories) {
    setOptions(categories.map(item => ({name: item.name, value: item.id})))
   }
  
  useEffect(() => {
    let isMounted = true
    if (isGameStarted && isMounted){
      console.log(chosenOption)
      async function getQuestions() {
      try {
        const res = await fetch(`https://opentdb.com/api.php?amount=5&category=${chosenOption}&type=multiple`)
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

        function radnomizeArray(array) {
          const randomNum = () => Math.floor(Math.random() * array.length)
          const newArray = new Array(array.length)

          for (let i = 0; i < newArray.length; i++) {
            const randomIndex = randomNum()
            if (randomIndex !== -1) {
              newArray[i] = array.splice(randomIndex, 1)
            }
          }
          return newArray.flat(newArray.length)
        }

        const newQuestion = {
          id: nanoid(),
          question: answer.question,
          answer: radnomizeArray(answerObj)
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
     setCount(0)
      async function getQuestions() {
        try {
          const res = await fetch(`https://opentdb.com/api.php?amount=5&category=${chosenOption}&type=multiple`)
          const data = await res.json()
          setQuestions(data.results)
          setRendered(true)
        } catch (error) {
          console.log("error")
        }
        }
      getQuestions()
  }

  function takeMeHome() {
    setIsGameStarted(prevGame => !prevGame)
    setCount(0)
    setQuestions([])
    setDisplayQuestion([])
    setRendered(false)
    setChosenOption(10)
    setCheckGame(false)
  }

 useEffect(() => {
  function calcXp() {
    const xpGain = count * 10
    setPlayer(prev => ({
        level: prev.level, 
        xp: prev.xp + xpGain, 
        xpStack: prev.xpStack + xpGain
    }))
    
    if (player.xpStack >= 200) {
      setPlayer(prev => ({
        ...player,
        level: prev.level + 1,
        xpStack: prev.xpStack - 100 + 10
      }))
    }
    
  }
  calcXp() 
 }, [count])

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

  const optionsElements = options.map(option => 
  <option 
    key={option.value} 
    value={option.value}>{option.name}</option>)

  return (
      <main className={`${!isGameStarted ? "menu" : "game"}`}>
        <Level
          player={player}
        />
        {!isGameStarted ? <HomePage 
          startGame={startGame}
          optionsElements={optionsElements}
          handleChange={() => handleChange(event)} 
        /> :
          <></>
        }
       {rendered ? 
       <div className='content-container'>
        <>
          <i className="fa-solid fa-arrow-left" onClick={takeMeHome}></i>
          {questionElements}
        </>
          {checkGame && <p className='score'> {count} / 5 correct Answers</p>}
          {rendered && <button 
            className="check-btn" 
            onClick={checkGame ? () => playAgain() : () => checkResults()}>
              {checkGame ? "Play again" : "Check answers"}
              </button>}
        </div> : <></>}
      </main>
  )
}

export default App
