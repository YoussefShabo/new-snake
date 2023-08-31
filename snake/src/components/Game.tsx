import * as React from 'react';
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from 'react-native';
import { PanGestureHandler } from "react-native-gesture-handler";
import { Colors } from "../styles/colors";
import { Coordinate, Direction, GestureEventType } from '../types/types';
import { View } from 'react-native';
import Snake from './snake';
import { checkGameOver } from '../utils/checkGameOver';
import Food from './Food';
import { checkEatsFood } from '../utils/checkEatsFood';
import { randomFoodPosition } from '../utils/randomFoodPosition';


const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5}];
const FOOD_INITIAL_POSITION = { x: 5, y: 20};
const GAME_BOUNDS = { xMin: 1, xMax: 35, yMin: 1, yMax: 72 };
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

export default function Game():JSX.Element {

    const [direction, setDirection] = useState<Direction>(Direction.Right);
    const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
    const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

    React.useEffect(() => {
        if (!isGameOver) {
            const intervalId = setInterval(() => {
                !isPaused && moveSnake();
            },MOVE_INTERVAL )
            return () => clearInterval(intervalId);
        }
    }, [snake, isGameOver, isPaused])

    const moveSnake = () => {
        const snakeHead = snake[0];
        const newHead = {  ...snakeHead } // creating a copy

if (checkGameOver(snakeHead, GAME_BOUNDS)) {
    setIsGameOver((prev => !prev));
    return;
}

        switch (direction) {
            case Direction.Up:
                newHead.y -= 1;
                break;
            case Direction.Down:
                newHead.y += 1;
                break;
            case Direction.Left:
                newHead.x -= 1;
                break;
            case Direction.Right:
                newHead.x += 1;
                break;
            default:
                break;
        }

    if (checkEatsFood(newHead, food, 2)) {
        setSnake([newHead, ...snake]);
        setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
        setScore(score + SCORE_INCREMENT);
    } else {
        setSnake([newHead, ...snake.slice(0,-1)]);
    }
};

    const handleGesture = (event: GestureEventType) => {
        const { translationX, translationY } = event.nativeEvent;
        if(Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0) {
                // Moving Right
                setDirection(Direction.Right);
            } else {
                //Moving Left
                setDirection(Direction.Left);
            }
        } else {
            if (translationY > 0) {
                // Moving Down
                setDirection(Direction.Down);
            } else {
                // MOving Up
                setDirection(Direction.Up);
            }
        }
    }

    return (
        <PanGestureHandler onGestureEvent={handleGesture}>
            <SafeAreaView style={styles.container}>
                <View style={styles.boundaries}>
                    <Snake snake={snake} />
                    <Food x={food.x} y={food.y} />
                </View>
            </SafeAreaView>
        </PanGestureHandler>

    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.primary,
    },
    boundaries: {
      flex: 1,
      borderColor: Colors.primary,
      borderWidth: 9,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      backgroundColor: Colors.tertiary,
    },
  });