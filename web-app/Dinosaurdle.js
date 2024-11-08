//import R from "./ramda.js";
// import { empty, ifElse, indexOf } from "ramda";
import {WORDS} from "./words.js";

/**
 * @namespace Dinosaurdle
 * @author Alex Li
 * @version 2022/23
 */
const Dinosaurdle = Object.create(null);

/**
 * The new_board function creates an empty board, which is a 5x6 2D-Array
 * @memberof Dinosaurdle
 * @function
 * @param {number} [width = 5]
 * @param {number} [height = 6]
 * @returns {empty_board} An empty 2D array.
 */
Dinosaurdle.emptyBoard = function(width=5, height=6) {
    return(new Array(height).fill("").map(() => new Array(width).fill("")));
};
/**
 * This function checks if the user's input is a valid input. A valid input
 * is if the word exists in the given dictionary.
 * @memberof Dinosaurdle
 * @function
 * @param {string} input The user's guess.
 * @returns {boolean} If the user's guess is in the dictionary.
 */
Dinosaurdle.checkValid = function(input){
    return WORDS.includes(input);
};


/**
 * This function converts a string into an array.
 * @memberof Dinosaurdle
 * @function
 * @param {string} input The user's guess as a string.
 * @returns {inputArray} The user's guess as an array.
 */

Dinosaurdle.makeArray = function(input){
    let inputArray = [];
    input.split("").forEach(function(letter){
        inputArray.push(letter);
    });
    return inputArray;
};


/**
 * The check_answer function checks the players input if it is the correct
 * answer.
 * @memberof Dinosaurdle
 * @function
 * @param {string} input
 * @param {string} answer
 * @returns {boolean} If the user's guess is the answer.
 */
Dinosaurdle.checkAnswer = function(input, answer){
    return input === answer;
};

/**
 * The answer_dictionary function acts as a function which
 * converts the arrays into a dictionary. The purpose of this
 * dictionary is to make sure that when finding letters in the
 * word, it does not mark up a letter twice when it only exists
 * once. For example, if the user inputs IGLOO when the answer
 * is CHOSE, it marks up the O only once and not twice.
 * @memberof Dinosaurdle
 * @function
 * @param {array} answer The answer in an array form
 * @returns {answer_map} Which is a dictionary with key value pairs
 * corresponding to the letter and the amount of times it shows up.
 */
Dinosaurdle.answerDictionary = function(answer){
    const answer_map = {};
    answer.forEach(function(letter){
        if (letter in answer_map){
            answer_map[letter] += 1;
            }
        else {
            answer_map[letter] = 1;
            }
    });
    return answer_map;
};

/**
 * The correctLetter function iterates through the input_array, and by comparing
 * it to the answer_array and using the answer_map, it creates a number_array
 * with 0's meaning the letter not existing in the word, 1 meaning the
 * letter exists in the word but in the wrong position, and 2 being in the
 * word and in the right place. In order to ensure that double letter don't get
 * picked up, a dictionary (answer_map) is used where the key value pair is the
 * letter and the amount of times it shows up respectively.
 * @memberof Dinosaurdle
 * @function
 * @param {array} input_array User's guess as an array
 * @param {array} answer_array The answer as an array
 * @param {map} answer_map The dictionary created based upon the answer_array
 * @returns {number_array} The number_array which has 0s,1s, and 2s.
 */
Dinosaurdle.correctLetter = function(input_array, answer_array, answer_map){
    const number_array = [];
    input_array.forEach(function(letter,i){ // creed and acted
        if (letter === answer_array[i]){
            number_array.push(2);
            answer_map[letter] -= 1;
            if (answer_map[letter] === 0){
                delete answer_map[letter];
            }
        }
        else {
            number_array.push(0);
        }
    });
    input_array.forEach(function(letter,j){
        if (answer_map.hasOwnProperty(letter) && number_array[j] === 0){
            number_array[j] = 1;
            answer_map[letter] -= 1;
            if (answer_map[letter] === 0){
                delete answer_map[letter];
            }}
    });
    return number_array;
};

/**
 * The getCurrentWord function takes in the current guess and by using
 * the .reduce() function, creates a string out of the array, forming
 * the word.
 * @memberof Dinosaurdle
 * @function
 * @param {map} game_state The entire game_state from main.js is passed in.
 * @returns {string} The word in string form.
 */
Dinosaurdle.getCurrentWord = function(word_array){
    return word_array.reduce(
        (prev,curr) => prev + curr);
};

/**
 * The isLetter function ensure that the users input is a letter.
 * It ensure this by matching the letter from a-z and if the string
 * is 1 character long.
 * @memberof Dinosaurdle
 * @param {string} key The key clicked by the user
 * @returns {boolean} If the key is a valid letter.
 */
Dinosaurdle.isLetter = function(key){
    const letters = ["q","w","e","r","t","y","u","i","o","p",
    "a","s","d","f","g","h","j","k","l","z","x","c","v","b","n",
    "m"];
    if (key.length === 1 && letters.includes(key)){
        return true;
    }
    return false;
};

/**
 * The dinoScore function increases the dinosaur score every 0.5 seconds
 * as specified in the main.js file. The dinosaur will get more points every
 * 0.5s as the player gets more wins, to increase the difficulty of the game.
 * @memberof Dinosaurdle
 * @param {map} game_state The game state, which holds the user's score.
 * @returns {game_state.dinosaur_score} The score which would be added to the
 * current score.
 */
Dinosaurdle.dinoScore = function(game_state){
    game_state.dinosaur_score += (1 + (0.1 * game_state.wins));
    return game_state.dinosaur_score;
};

/**
 * The addUserScore function adds the user's score based upon the number_array
 * created from the guess. 1 point for letter guessed, and 2 points for correct
 * position. This is done through using the .reduce() function which adds all
 * the numbers in the array together.
 * @memberof Dinosaurdle
 * @param {array} number_array The number array of the user's guess
 * @returns {addedscore} The users' added score of their current guess
 */
Dinosaurdle.addUserScore = function(number_array){
    const addedscore = number_array.reduce((prev,curr) => prev + curr);
    return addedscore;
};

/**
 * The multiplierScore function awards point based upon how many tries it was
 * required for the user to guess the word.
 * @memberof Dinosaurdle
 * @param {map} game_state The game_state which holds the currentRow variable.
 * @returns {multiplied_score} The score multiplied based on the amount of
 * tries.
 */
Dinosaurdle.multiplierScore = function(game_state){
    const multiplied_score = (120 / (game_state.currentRow + 1)) / 2;
    return multiplied_score;
};

export default Object.freeze(Dinosaurdle);