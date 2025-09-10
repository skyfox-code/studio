
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

// --- Constants ---
const GRID_SIZE = 20;
const CELL_SIZE = 20; // in pixels
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_SPEED = 200; // ms
const SPEED_INCREMENT = 5; // ms to decrease per food eaten

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

export default function SnakePage() {
    const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
    const [food, setFood] = useState<Position>({ x: 15, y: 15 });
    const [direction, setDirection] = useState<Direction>("UP");
    const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
    const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
    const [score, setScore] = useState(0);

    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
    // Ref to prevent direction change twice in one move
    const directionChangeLock = useRef(false);

    const generateFood = useCallback(() => {
        let newFoodPosition: Position;
        do {
            newFoodPosition = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
        } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
        setFood(newFoodPosition);
    }, [snake]);

    const startGame = () => {
        setSnake(INITIAL_SNAKE);
        setDirection("UP");
        setSpeed(INITIAL_SPEED);
        setScore(0);
        generateFood();
        setGameState("playing");
    };

    const gameOver = () => {
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
        }
        setGameState("gameover");
    };

    const moveSnake = useCallback(() => {
        setSnake(prevSnake => {
            const newSnake = [...prevSnake];
            const head = { ...newSnake[0] };

            switch (direction) {
                case "UP": head.y -= 1; break;
                case "DOWN": head.y += 1; break;
                case "LEFT": head.x -= 1; break;
                case "RIGHT": head.x += 1; break;
            }

            // --- Collision Detection ---
            // Wall collision
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                gameOver();
                return prevSnake;
            }
            // Self collision
            for (let i = 1; i < newSnake.length; i++) {
                if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
                    gameOver();
                    return prevSnake;
                }
            }

            newSnake.unshift(head);

            // --- Food Consumption ---
            if (head.x === food.x && head.y === food.y) {
                setScore(s => s + 10);
                setSpeed(s => Math.max(50, s - SPEED_INCREMENT));
                generateFood();
            } else {
                newSnake.pop();
            }

            directionChangeLock.current = false; // Unlock direction change
            return newSnake;
        });
    }, [direction, food.x, food.y, generateFood]);

    // --- Game Loop ---
    useEffect(() => {
        if (gameState === "playing") {
            gameLoopRef.current = setInterval(moveSnake, speed);
            return () => {
                if (gameLoopRef.current) {
                    clearInterval(gameLoopRef.current);
                }
            };
        }
    }, [moveSnake, speed, gameState]);


    // --- Keyboard Controls ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
             if (directionChangeLock.current) return;

            let newDirection: Direction | null = null;
            switch (e.key) {
                case "ArrowUp":
                    if (direction !== "DOWN") newDirection = "UP";
                    break;
                case "ArrowDown":
                    if (direction !== "UP") newDirection = "DOWN";
                    break;
                case "ArrowLeft":
                    if (direction !== "RIGHT") newDirection = "LEFT";
                    break;
                case "ArrowRight":
                    if (direction !== "LEFT") newDirection = "RIGHT";
                    break;
            }
            if (newDirection) {
                setDirection(newDirection);
                directionChangeLock.current = true;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction]);


    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-mono">
            <h1 className="text-4xl font-bold mb-2 text-primary">Snake</h1>
             <div className="flex justify-between w-full max-w-md text-lg mb-2">
                <div>Score: <span className="text-accent font-semibold">{score}</span></div>
            </div>
            
            <div
                className="relative bg-muted/30 border-2 border-primary shadow-lg shadow-primary/30 grid"
                style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                    width: `${GRID_SIZE * CELL_SIZE}px`,
                    height: `${GRID_SIZE * CELL_SIZE}px`,
                }}
            >
                {/* Render Snake */}
                {snake.map((segment, index) => (
                    <div
                        key={index}
                        className={`absolute rounded-sm ${index === 0 ? 'bg-accent' : 'bg-primary'}`}
                        style={{
                            left: `${segment.x * CELL_SIZE}px`,
                            top: `${segment.y * CELL_SIZE}px`,
                            width: `${CELL_SIZE}px`,
                            height: `${CELL_SIZE}px`,
                        }}
                    />
                ))}

                {/* Render Food */}
                <div
                    className="absolute bg-destructive rounded-full"
                    style={{
                        left: `${food.x * CELL_SIZE}px`,
                        top: `${food.y * CELL_SIZE}px`,
                        width: `${CELL_SIZE}px`,
                        height: `${CELL_SIZE}px`,
                    }}
                />
                
                {gameState === "start" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                        <h2 className="text-5xl font-bold mb-4">SNAKE</h2>
                        <Button onClick={startGame} className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl py-6 px-8">
                            <Gamepad2 className="mr-3 h-6 w-6" /> Start Game
                        </Button>
                        <p className="mt-8 text-slate-400">Use <span className="font-semibold text-accent">Arrow Keys</span> to move</p>
                    </div>
                )}

                {gameState === "gameover" && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                        <h2 className="text-5xl font-bold text-red-500 mb-4">GAME OVER</h2>
                        <p className="text-2xl mb-6">Final Score: {score}</p>
                        <Button onClick={startGame} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            <RotateCcw className="mr-2 h-4 w-4" /> Play Again
                        </Button>
                    </div>
                )}
            </div>
            
            <div className="mt-4 text-center text-slate-500 text-sm">
                <Link href="/" className="hover:text-primary underline">
                    &larr; Back to App Showcase
                </Link>
            </div>
        </div>
    );
}

