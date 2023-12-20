import { useState } from 'react'
import './App.css'
import confetti from 'canvas-confetti'
import { Square } from './component/Squere'
import { TURNS } from './constants'
import { ModalWinner } from './component/ModalWinner'
import {checkWinnerFrom , checkEndGame} from './logic/board'





function App() {
  
  // Se le pasa una funcion para validar si en local storage existe alguna partida guardada,
  // Si no existe una se inician los valores en null  
  const [board, setBoard]= useState(()=>{
    const boardFromStorage = window.localStorage.getItem('board')
    if(boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  });
  const [turn, setTurn] = useState( ()=>{
    const turnFromStorage = window.localStorage.getItem('turn');
    return JSON.parse(turnFromStorage) ?? TURNS.X
  });
  const [winner, setWinner] = useState(null)



  const updateBoard=(index)=>{

    if(board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    // Guardar partida 
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', JSON.stringify(newTurn))
    // ganador
    const newWinner= checkWinnerFrom(newBoard);
    if(newWinner){
      confetti();
      setWinner(newWinner);
    }else if(checkEndGame(newBoard)){
      setWinner(false)
    }

  }

  const resetGame =()=>{
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    window.localStorage.removeItem('board');
    window.localStorage.removeItem('turn');
  }
  return (

    <main className='board'>

      <p>Tic-tac-toe</p>
      <button onClick={resetGame}>Resetear el juego</button>
      <section className='game'>
        {
         board.map((_, index)=>{
            return(
              <Square 
              key={index}
              index={index}
              updateBoard={updateBoard}
              >
                {board[index]}
              </Square>
            )
         })
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      <ModalWinner winner={winner} resetGame={resetGame}></ModalWinner>
    </main>
  )
}

export default App
