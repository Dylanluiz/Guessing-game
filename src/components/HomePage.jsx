import React, { useEffect, useState } from "react"

export default function HomePage({startGame, optionsElements, handleChange}) {
    // const [categories, setCategories] = useState([])
    // const [isFetched, setIsFetched] = useState(false)
    // const [options, setOptions] = useState([])

    // useEffect(() => {
    //     const getCategories = async () => {
    //         const res = await fetch('https://opentdb.com/api_category.php')
    //         const data = await res.json()
    //         setCategories(data.trivia_categories)
    //     }
    //     getCategories()
    //     optionsArray()
    //     setIsFetched(prevFetch => !prevFetch)
    // }, [])

    // function optionsArray() {
    //  return setOptions(categories.map(item => ({name: item.name, value: item.name})))
    // }

    // const optionsElements = options.map(option => <option value={option.value}>{option.name}</option>)

    return (
        <div className="home--container">
            <h1 className="site-name">Quizzical</h1>
            <p className="site-description">Select the correct answer out of the questions given</p>
            <select className="options-selector" onChange={handleChange}>
                {optionsElements}
            </select>
            <button 
                className="run-btn"
                onClick={startGame}
                >Start quiz</button>
        </div>
    )   
}

