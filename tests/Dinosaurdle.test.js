import Dinosaurdle from "../Dinosaurdle.js";
import R from "../ramda.js";

const emptyBoard = Dinosaurdle.emptyBoard;

describe("Empty board", function (){
    it("Calling the empty_board will create a 5x7 2D-Array", function(){
        const width = 5;
        const height = 6;
        const result = emptyBoard(width,height);
        const expected = [["","","","",""],
                          ["","","","",""],
                          ["","","","",""],
                          ["","","","",""],
                          ["","","","",""],
                          ["","","","",""]];
        if (!R.equals(result, expected)) {
            throw new Error(
                `for width ${width} and height ${height}` +
                ` the wrong grid was returned, ${result}`
            );}
        }
    );
});

const checkValid = Dinosaurdle.checkValid;
//check for 4 letter and 0 letter word

describe("Check valid input", function(){
    it("Giving a 5 letter word should return True.", function(){
        const input = "space";
        const result = checkValid(input);
        const expected = true;
        if (!R.equals(result,expected)){
            throw new Error(
                `${input} was given and ${expected} was expected` +
                ` but `
            );
        };
    });
    it("Giving a 6 letter word should return False.", function(){
        const input = "cherry";
        const result = checkValid(input);
        const expected = false;
        if (!R.equals(result,expected)){
            throw new Error(
                `${input} was given and ${expected} was expected` +
                ` but ${result} was given instead.`
            );
        }
    });
});

const makeArray = Dinosaurdle.makeArray;

describe("Make array", function(){
    it("Calling this function converts the string into a " +
    "list of strings consisting of the letters.", function(){
        const input = "chaos";
        const result = makeArray(input);
        const expected = ["c","h","a","o","s"];
        if (!R.equals(result,expected)){
            throw new Error(
                `for input ${input}, ${expected} was expected` +
                `, but ${result} was returned instead.`
            );
        }
    });
});


const checkAnswer = Dinosaurdle.checkAnswer;

describe("Check answer", function(){
    it("Tests to make sure that the game knows if the answer " +
    "is correct", function(){
        const input = "chaos";
        const correct_answer = "chaos";
        const result = checkAnswer(input, correct_answer);
        const expected = true;
        if (!R.equals(result,expected)){
            throw new Error(
                `for input ${input} and answer ${correct_answer}, ${expected} `+
                `was expected, but ${result} was returned instead.`
            );
        }
    });
    it("Test to make sure it knows answer is wrong", function(){
        const input = "chaos";
        const correct_answer = "place";
        const result = checkAnswer(input, correct_answer);
        const expected = false;
        if (!R.equals(result,expected)){
            throw new Error(
                `for input ${input} and answer ${correct_answer}, ${expected} `+
                `was expected, but ${result} was returned instead.`
            );
        }
    });
});

const answerDictionary = Dinosaurdle.answerDictionary;

describe("Answer Dictionary Form", function(){
    it("Test to make sure that the map is working, " +
    "where if CHAOS is given, a map with each letter " +
    "as its key and number of times it shows up as its value " +
    "is returned.", function (){
        const answer = ["c","h","a","o","s"];
        const result = answerDictionary(answer);
        const expected = {"c":1, "h":1, "a":1, "o":1, "s":1};
        if (!R.equals(result,expected)){
            throw new Error(
                `for an answer of ${answer}, ${expected} was expected but `+
                `${result} was given instead.`
            );
        }
    });
    it("If IGLOO was given, it should catch the O's twice.", function (){
        const answer = ["i","g","l","o","o"];
        const result = answerDictionary(answer);
        const expected = {"i":1, "g":1, "l":1, "o":2};
        if (!R.equals(result,expected)){
            throw new Error(
                `for an answer of ${answer}, ${expected} was expected but `+
                `${result} was given instead.`
            );
        }
    });
});

const correctLetter = Dinosaurdle.correctLetter;

describe("Correct letter", function(){
    it("Test to make sure that the function " +
    "catches correct letters without any duplicates.", function(){
        const input_array = ["h","o","u","s","e"];
        const answer = ["c","h","a","o","s"];
        const answer_map = {"c":1, "h":1, "a":1, "o":1, "s":1};
        const result = correctLetter(input_array,answer,answer_map);
        const expected = [1,1,0,1,0];
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input_array}, and the word ` +
                `${answer}, the expected answer should be ${expected}, ` +
                `but ${result} was given instead.`
            );
        }
    });

    it("A double lettered word to make sure that the function" +
    "catches the two letters.", function(){
        const input_array = ["i","g","l","o","o"];
        const answer = ["c","h","a","o","s"];
        const answer_map = {"c":1, "h":1, "a":1, "o":1, "s":1};
        const result = correctLetter(input_array,answer,answer_map);
        const expected = [0,0,0,2,0];
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input_array}, and the word ` +
                `${answer}, the expected answer should be ${expected}, ` +
                `but ${result} was given instead.`
            );
        }
    });

    it("A double letter word and both letters are registered to be in" +
    "the answer", function(){
        const input_array = ["b","r","o","o","m"];
        const answer = ["s","t","o","o","l"];
        const answer_map = {"s":1, "t":1, "o":2, "l":1};
        const result = correctLetter(input_array,answer,answer_map);
        const expected = [0,0,2,2,0];
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input_array}, and the word ` +
                `${answer}, the expected answer should be ${expected}, ` +
                `but ${result} was given instead.`
            );
        }
    });

    it("With a word which shares similar letters, the function should make " +
    "sure that the letter which is in the correct place is prioritised " +
    "over the letter which is in the word but in the wrong place.", function(){
        const input_array = ["c","r","e","e","d"];
        const answer = ["a","c","t","e","d"];
        const answer_map = {"a":1,"c":1,"t":1,"e":1,"d":1};
        const result = correctLetter(input_array,answer,answer_map);
        const expected = [1,0,0,2,2];
        if (!R.equals(result,expected)){
            throw new Error(
            `for an input of ${input_array}, and the word ` +
            `${answer}, the expected answer should be ${expected}, ` +
            `but ${result} was given instead.`
            );
        }
    });
});

const isLetter = Dinosaurdle.isLetter;

describe("Is Letter", function(){

    it("A test to determine if the inputted character is a letter." +
    "If the inputted character isn't a letter, false should be returned",
    function(){
        const input = "a";
        const result = isLetter(input);
        const expected = true;
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input}, the answer should be ` +
                `${expected}, but ${result} was returned instead.`
            );
        }
    });

    it("To test with 2 letters",function(){
        const input = "cl";
        const result = isLetter(input);
        const expected = false;
        if (!R.equals(result,expected)){
            throw new Error(`for an input of ${input}, the answer should be ` +
            `${expected}, but ${result} was returned instead.`
            );
        }
    });

    it("To test with a number",function(){
        const input = 2;
        const result = isLetter(input);
        const expected = false;
        if (!R.equals(result,expected)){
            throw new Error(`for an input of ${input}, the answer should be ` +
            `${expected}, but ${result} was returned instead.`
            );
        }
    });

    it("To test with punctuation letters",function(){
        const input = ".";
        const result = isLetter(input);
        const expected = false;
        if (!R.equals(result,expected)){
            throw new Error(`for an input of ${input}, the answer should be ` +
            `${expected}, but ${result} was returned instead.`
            );
        }
    });
});

const getCurrentWord = Dinosaurdle.getCurrentWord;

describe("Get Current Letter", function(){

    it("To test if given an array of letters which forms a word," +
    " it would return the word in a string.",
    function(){
        const input = ["c","h","a","o","s"];
        const result = getCurrentWord(input);
        const expected = "chaos";
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input}, the answer should be ` +
                `${expected}, but ${result} was returned instead.`
            );
        }
    });
});

const dinoScore = Dinosaurdle.dinoScore;

describe ("Dinosaur Score", function(){

    it("To test to make sure the number given by dinoScore is correct",
    function(){
        let game_state = {
            dinosaur_score: 5,
            wins: 0
        };
        const input = game_state;
        const result = dinoScore(input);
        const expected = 6;
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input}, the answer should be ` +
                `${expected}, but ${result} was returned instead.`
            );
        }
    });

    it("Second test",
    function(){
        let game_state = {
            dinosaur_score: 30,
            wins: 1
        };
        const input = game_state;
        const result = dinoScore(input);
        const expected = 31.1;
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input}, the answer should be ` +
                `${expected}, but ${result} was returned instead.`
            );
        }
    });
});

const addUserScore = Dinosaurdle.addUserScore;

describe("Adding User's Score", function(){

    it("To test that the user's score is adding up correctly.",
    function(){
        const input = [0,0,0,0,0];
        const result = addUserScore(input);
        const expected = 0;
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input}, the answer should be ` +
                `${expected}, but ${result} was returned instead.`
            );
        }
    });

    it("Random number array",
    function(){
        const input = [1,0,2,2,1];
        const result = addUserScore(input);
        const expected = 6;
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input}, the answer should be ` +
                `${expected}, but ${result} was returned instead.`
            );
        }
    });

    it("Another array",
    function(){
        const input = [0,1,2,1,0];
        const result = addUserScore(input);
        const expected = 4;
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input}, the answer should be ` +
                `${expected}, but ${result} was returned instead.`
            );
        }
    });
});

const multiplierScore = Dinosaurdle.multiplierScore;

describe("Multiplier Score", function(){
    it("Testing the function so that the score is multiplied correctly based" +
    " upon how many turns the user has had.",
    function(){
        const game_state = {
            currentRow: 1
        };
        const input = game_state;
        const result = multiplierScore(input);
        const expected = 30;
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input}, the answer should be ` +
                `${expected}, but ${result} was returned instead.`
            );
        }
    });

    it("Inputting a different number",
    function(){
        const game_state = {
            currentRow: 3
        };
        const input = game_state;
        const result = multiplierScore(input);
        const expected = 15;
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input}, the answer should be ` +
                `${expected}, but ${result} was returned instead.`
            );
        }
    });

    it("Random number",
    function(){
        const game_state = {
            currentRow: 5
        };
        const input = game_state;
        const result = multiplierScore(input);
        const expected = 10;
        if (!R.equals(result,expected)){
            throw new Error(
                `for an input of ${input}, the answer should be ` +
                `${expected}, but ${result} was returned instead.`
            );
        }
    });
});