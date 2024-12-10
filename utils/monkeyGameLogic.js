// Initialize game grid with only one monkey
import Swal from 'sweetalert2';

    export const initializeGameGrid = (rows, cols) => {
        const grid = [];
        let monkeyPlaced = false;
    
        for (let row = 0; row < rows; row++) {
        const newRow = [];
        for (let col = 0; col < cols; col++) {
            if (!monkeyPlaced && Math.random() < 1) {
            newRow.push("🐒"); // Place the monkey randomly once
            monkeyPlaced = true;
            } else if (Math.random() < 0.2) {
            newRow.push("🍌"); // Add banana randomly
            } else {
            newRow.push(""); // Empty space
            }
        }
        grid.push(newRow);
        }
        return grid;
    };

    let isGameOver = false; // Flag to check if game over has been triggered

    export const moveMonkey = (grid, direction, bananaAudio, setGameStarted, setGrid) => {
        let newGrid = [...grid];
        let monkeyRow, monkeyCol;
        let bananaEaten = false;
    
        // Find the current monkey position
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col] === "🐒") {
                    monkeyRow = row;
                    monkeyCol = col;
                    break;
                }
            }
        }
    
        if (monkeyRow !== undefined && monkeyCol !== undefined) {
            // Remove the monkey from the old position
            newGrid[monkeyRow][monkeyCol] = "";
    
            // Update the monkey's position based on direction
            switch (direction) {
                case "up":
                    if (monkeyRow > 0) monkeyRow -= 1;
                    break;
                case "down":
                    if (monkeyRow < grid.length - 1) monkeyRow += 1;
                    break;
                case "left":
                    if (monkeyCol > 0) monkeyCol -= 1;
                    break;
                case "right":
                    if (monkeyCol < grid[0].length - 1) monkeyCol += 1;
                    break;
                case "up-left":
                    if (monkeyRow > 0 && monkeyCol > 0) {
                        monkeyRow -= 1;
                        monkeyCol -= 1;
                    }
                    break;
                case "down-left":
                    if (monkeyRow < grid.length - 1 && monkeyCol > 0) {
                        monkeyRow += 1;
                        monkeyCol -= 1;
                    }
                    break;
                case "up-right":
                    if (monkeyRow > 0 && monkeyCol < grid[0].length - 1) {
                        monkeyRow -= 1;
                        monkeyCol += 1;
                    }
                    break;
                case "down-right":
                    if (monkeyRow < grid.length - 1 && monkeyCol < grid[0].length - 1) {
                        monkeyRow += 1;
                        monkeyCol += 1;
                    }
                    break;
                default:
                    break;
            }
    
            // Check if the monkey eats a banana
            if (newGrid[monkeyRow][monkeyCol] === "🍌") {
                bananaEaten = true;
            }
    
            // Place the monkey at the new position
            newGrid[monkeyRow][monkeyCol] = "🐒";
    
            // Handle banana eating
            if (bananaEaten && !isGameOver) { // Only trigger if game over hasn't been shown yet
                isGameOver = true; // Set the game over flag to true to prevent further alerts
    
                // Stop the banana sound and play the game over sound immediately
                stopBananaSound(bananaAudio); 
                playGameOverSound(); 
    
                // Delay to show SweetAlert after the banana is eaten
                setTimeout(() => {
                    // Show SweetAlert after the delay
                    Swal.fire({
                        title: "Game Over!",
                        text: "You have collected all the bananas!",
                        icon: "success",
                        confirmButtonText: "Play Again",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Restart the game when user clicks "Play Again"
                            setGameStarted(false);  // Set the game to not started
                            setGrid([]); // Reset the grid
                            isGameOver = false; // Reset the game over flag
                        }
                    });
                }, 2500);  // Delay before showing the SweetAlert
            }
        }
    
        return newGrid;
    };
    

  
  
    // Check if game is over (all bananas are collected)
    export const checkGameOver = (grid) => {
        for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === "🍌") {
            return false; // Bananas still exist, game not over
            }
        }
        }
        return true; // All bananas are collected, game over
    };
  
    // Play the banana eating sound and return the audio object
    export const playBananaSound = () => {
        const audio = new Audio("/sounds/The Game Show Theme Music.mp3");
        audio.load(); // Ensure audio is loaded
        audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        });
        return audio; // Return the audio instance to store and stop later
    };
    
    // Stop the banana sound
    export const stopBananaSound = (audio) => {
        if (audio) {
        audio.pause(); // Stop the audio
        audio.currentTime = 0; // Reset the playback position
        }
    };

    
    // Play the game over sound
    export const playGameOverSound = () => {
        const audio = new Audio("/sounds/Game Over Sound Effects High Quality.mp3");
        audio.load(); // Ensure audio is loaded
        audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        });
    };
  