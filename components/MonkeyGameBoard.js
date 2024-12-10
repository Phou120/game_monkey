import React, { useEffect, useState } from "react";
import styles from "../styles/MonkeyGameBoard.module.css";
import Swal from 'sweetalert2';

import { initializeGameGrid, moveMonkey, checkGameOver, playBananaSound, stopBananaSound, playGameOverSound } from "../utils/monkeyGameLogic";

const MonkeyGameBoard = () => {
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // State to trigger game start
  const [bananaAudio, setBananaAudio] = useState(null); // Store the audio instance

  // Initialize game grid when the game starts
  useEffect(() => {
    if (gameStarted) {
      const initialGrid = initializeGameGrid(5, 8); // 5 rows, 8 columns
      setGrid(initialGrid);
      setGameOver(false); // Reset game over status
    }
  }, [gameStarted]);

  const handleKeyPress = (event) => {
    if (gameOver || !gameStarted) return; // Don't move if game over or not started

    let direction = null;
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
      case "Home":
        direction = "up-left";
        break;
      case "End":
        direction = "down-left";
        break;
      case "PageUp":
        direction = "up-right";
        break;
      case "PageDown":
        direction = "down-right";
        break;
      default:
        return;
    }

    if (direction) {
      const newGrid = moveMonkey(grid, direction, bananaAudio, setGameStarted, setGrid);
      setGrid(newGrid);

      if (checkGameOver(newGrid)) {
        setGameOver(true);
        stopBananaSound(bananaAudio); // Stop the banana sound when game is over
        playGameOverSound(); // Play the game over sound
        // Show SweetAlert when game is over
        Swal.fire({
        title: 'Game Over!',
        text: 'You have collected all the bananas!',
        icon: 'success',
        confirmButtonText: 'Play Again'
        }).then((result) => {
        if (result.isConfirmed) {
            // Optionally, restart the game if the user clicks "Play Again"
            setGameStarted(false);
            setGameOver(false);
            setGrid([]); // Reset grid or reinitialize
        }
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [grid, gameOver]);

  // Start game and play sound when button clicked
  const handleStartGameClick = () => {
    setGameStarted(true); // Start the game
    const audio = playBananaSound(); // Play the banana sound and store the audio instance
    setBananaAudio(audio); // Store the audio instance
  };

  return (
    <div className={styles.body}>
    <div className={styles.container}>

      {/* <h1>Monkey Banana Game</h1> */}
      <div className={styles.container}>
        {!gameStarted && (
            <button className={styles.button} onClick={handleStartGameClick}>Start Game</button>
        )}
      </div>
      <div className={styles.grid}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className={styles.cell}>
              {cell}
            </div>
          ))
        )}
      </div>
      {gameOver && <h2></h2>}
        </div>
    </div>
  );
};

export default MonkeyGameBoard;
