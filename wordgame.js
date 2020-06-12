/*
••••••••••••••••••••••••••••••••••••••••••••••••
Copyright (C) 2015 Codesse. All rights reserved.
••••••••••••••••••••••••••••••••••••••••••••••••
*/

const prompt = require('prompt-sync')({ sigint: true })
const fs = require('fs')

const validWords = fs.readFileSync('wordlist.txt').toString().split("\n");

WordGame = function(baseWordSize) {

  const DEFAULT_WORD_SIZE = 10
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
  const scoreList = []

 /**
  * 
  * generateRandomWord
  * 
  * Generates a random word within the bounds of the alphabet
  * 
  * @param {int} size Size of word
  */
 this.generateRandomWord = function (size) {
  const word = []

  for (var i = 0; i < size; i++) {
    word.push(ALPHABET[Math.floor(Math.random() * ((ALPHABET.length - 1) - 0) + 0)])
  }

  return word.join('')
 }

 this.baseWord = this.generateRandomWord(baseWordSize | DEFAULT_WORD_SIZE)

 this.getBaseWord = function () {
   return this.baseWord;
 }


  this.isValidWord = function (word) {

    var that = this;
    // check letter exist in base string
    const isInBaseWord = word.split().every(function (letter) {
      return that.getBaseWord().includes(letter);
    })

    // check word is in valid list
    const isInValidList = validWords.includes(word);

    // check word not already in scoreList
    const isInScoreboard = scoreList.includes(word);

    return isInBaseWord && isInValidList && !isInScoreboard;
  }

/*
Submit a word on behalf of a player. A word is accepted if its letters are contained in the base string used to construct the game AND if it is in the word list provided: wordlist.txt.
	
If the word is accepted and its score is high enough, the submission should be added to the high score list. If there are multiple submissions with the same score, all are accepted, BUT the first submission with that score should rank higher.
	
A word can only appear ONCE in the high score list. If the word is already present in the high score list the submission should be rejected.
	
@parameter word. The player's submission to the game. All submissions may be assumed to be lowercase and contain no whitespace or special characters.
*/	
 this.submitWord = function (word) {
   if ((!word) || word.length === 0) {
     return 'Error: Please enter a word'
   }
   
   if (!this.isValidWord(word)) {
     return 'Ooooh, ' + word + ' is a great suggestion but not good enough for the score board. Try again.'
   }

   // Place in scoreList
   const score = word.length;
   scoreList.push({ word: word, score: score });
   scoreList.sort(function (obj1, obj2) {
    return obj1.score > obj2.score;
   })

   return 'Word entered was ' + word + '. This gained you a score of ' + score;
 };
 
/*
Return word entry at given position in the high score list, 0 being the highest (best score) and 9 the lowest. You may assume that this method will never be called with position > 9.

@parameter position Index position in high score list
@return the word entry at the given position in the high score list, or null if there is no entry at the position requested
*/
 this.getWordEntryAtPosition = function (position) {
   if (scoreList.length === 0) {
     return 'No scoreboard entries to display yet.'
   }

   return scoreList[position].word | 'No score at position ' + position
 };
 
/*
Return the score at the given position in the high score list, 0 being the highest (best score) and 9 the lowest. You may assume that this method will never be called with position > 9.

What is your favourite color? Please put your answer in your submission (this is for testing if you have read the comments).
 
@parameter position Index position in high score list
@return the score at the given position in the high score list, or null if there is no entry at the position requested
*/
 this.getScoreAtPosition = function (position) {
  if (scoreList.length === 0) {
    return 'No scoreboard entries to display yet.'
  }

  return scoreList[position].score | 'No score at position ' + position
 };

 this.getScoreboard = function () {
  const scores = scoreList.map(function (score, i) {
    return (i + 1) + '. word: ' + '`' + score.word + '`' + 'score: `' + score.score + '`'
  })
  return (
    '\n\n------------- Scoreboard ------------- \n\n' +
    scores
  )
 }
}


/**
 * displayMenu
 * 
 * Displays the menu options for playing the game
 */
function displayMenu (randomWord) {
  console.log(
    '\n\n------------- Word Game ------------- \n\n' +
    'Your word this round is ' + '`' + randomWord + '`' + '\n\n' +
    'Choose one of the following options to play\n\n' +
    '1. Submit a word\n' +
    '2. View scoreboard\n' +
    '3. End game\n'
  )
}
/**
 * IFFE function that starts the game
 */
(function(){
  
  // instantiate game object
  const game = new WordGame(process.argv[2] | null);

  var userMenuChoice = 0;

  do {
    displayMenu(game.getBaseWord());
    userMenuChoice = prompt('Enter a number: ');

    switch (userMenuChoice) {
      case '1':
        userWord = prompt('Enter a word: ');
        const feedback = game.submitWord(userWord);
        console.log(feedback)
        break;
      case '2':
        console.log(game.getScoreboard())
        break;
      case '3':
        console.log('Thank you for playing.')
        break;
      default:
        console.log('Not a valid option.')
    }
  } while (userMenuChoice < 3);

})();