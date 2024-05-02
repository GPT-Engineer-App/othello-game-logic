import React, { useState } from "react";
import { Box, Grid, GridItem, Button, useToast } from "@chakra-ui/react";

const boardSize = 8;

// Directions for adjacent cells
const directions = [
  { x: -1, y: 0 },
  { x: 1, y: 0 }, // Left, Right
  { x: 0, y: -1 },
  { x: 0, y: 1 }, // Up, Down
  { x: -1, y: -1 },
  { x: 1, y: 1 }, // Diagonal top-left, bottom-right
  { x: -1, y: 1 },
  { x: 1, y: -1 }, // Diagonal bottom-left, top-right
];

const Index = () => {
  const [board, setBoard] = useState(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState("black");
  const toast = useToast();

  function createInitialBoard() {
    const initialBoard = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null));
    const mid = boardSize / 2;
    initialBoard[mid - 1][mid - 1] = "white";
    initialBoard[mid][mid] = "white";
    initialBoard[mid - 1][mid] = "black";
    initialBoard[mid][mid - 1] = "black";
    return initialBoard;
  }

  function flipDiscs(x, y) {
    if (board[x][y] !== null) return false;

    let flipped = false;
    const newBoard = board.map((row) => [...row]);

    directions.forEach((dir) => {
      const discsToFlip = [];
      let i = x + dir.x,
        j = y + dir.y;

      while (i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[i][j] === (currentPlayer === "black" ? "white" : "black")) {
        discsToFlip.push([i, j]);
        i += dir.x;
        j += dir.y;
      }

      if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[i][j] === currentPlayer && discsToFlip.length > 0) {
        flipped = true;
        discsToFlip.forEach(([dx, dy]) => {
          newBoard[dx][dy] = currentPlayer;
        });
      }
    });

    if (flipped) {
      newBoard[x][y] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
    } else {
      toast({
        title: "Invalid move",
        description: "You must flip at least one opponent's disc.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }

    return flipped;
  }

  return (
    <Box w="100vw" h="100vh" p={4} bg="gray.100">
      <Grid templateColumns={`repeat(${boardSize}, 1fr)`} gap={0} justifyItems="center" alignItems="center">
        {board.map((row, x) => row.map((cell, y) => <GridItem w="40px" h="40px" key={`${x}-${y}`} bg={cell ? (cell === "black" ? "black" : "white") : "green.500"} onClick={() => flipDiscs(x, y)} />))}
      </Grid>
      <Button mt={4} colorScheme="blue" onClick={() => setBoard(createInitialBoard())}>
        Restart Game
      </Button>
    </Box>
  );
};

export default Index;
