import React, {useEffect, useState} from 'react'

export default function Level({player, setPlayer}) {

    const color = player.level === 0 ? 
    "#fffffc" :
    player.level === 1 ?
     "#ffc6ff" :
    player.level === 2 ?
    "#bdb2ff" :
    player.level === 3 ?
    "#a0c4ff" :
    player.level === 4 ?
    "#9bf6ff" :
    player.level === 5 ?
    "#caffbf" :
    player.level === 6 ?
    "#caffbf" :
    player.level === 7 ?
    "#fdffb6" :
    player.level === 8 ?
    "#ffd6a5" :
    player.level === 9 ?
    "#ffadad" :
    player.level >= 10 ?
    "#10002b" : ''

    const xpCalc = player.xpStack - 100
    const playerStyle = {width: `${xpCalc}%`, backgroundColor: color}
    return (
        <div className='player-level-container'>
        <section className='level-rank'><p>Level: {player.level}</p></section>
        <div className='level-xp-container'>
            <div className='xp' style={playerStyle}></div>    
        </div>    
        </div>
    )
}