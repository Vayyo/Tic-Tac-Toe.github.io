// USING MINIMAX AlGORITHM
// *Please Read About The MINIMAX Function Before Reading This Code!... I learnt from this article - https://codesweetly.com/minimax-algorithm
const allSlots = document.querySelectorAll(".marking");
const humanMark = "x";
const AIMark = "o";
let gameOver = false;
let humanScore = 0;
let AIScore = 0;
let tieScore = 0;
let cellsThatMatch;

//Step 1: Add interaction to the game board
allSlots.forEach((slot) => slot.addEventListener("click", addPlayerMark));

function addPlayerMark() {
  if (this.innerText === "x" || this.innerText === "o" || gameOver) return;

  //step 2: add player mark to board and run checkIfGameOver function
  this.innerText = humanMark;
  checkIfGameOver(humanMark);

  //step 3: add computer mark by using minimax func, then run checkIfGameOver function
  if (!gameOver) {
    addAIMark();
    checkIfGameOver(AIMark);
  }
}

function addAIMark() {
  // Step 4: create a fakeBoard to run all move possibilities
  const fakeGameBoard = [...allSlots].map((e, index) =>
    e.innerText ? e.innerText : index
  );

  // Step 5: depths variable for each time minimax is called
  let depths = 0;

  // Step 7: Create minimax function
  function minimax(currentGameBoard, whoseMark, depth) {
    // Step 8: Get index of emptycells in currentGameBoard
    const emptySlots = currentGameBoard.filter((e) => e !== "x" && e !== "o");
    // Step 9: Create Terminal states that stops minimax function by checking for a win combo, then return an OBJECT(not a value!!!!)
    //checkMatch function is created below addAIMark function.
    if (checkMatch(currentGameBoard, AIMark)) {
      return {
        score: 100 - depth,
      };
    } else if (checkMatch(currentGameBoard, humanMark)) {
      return {
        score: -100 - depth,
      };
    } else if (emptySlots.length === 0) {
      return {
        score: 0,
      };
    }

    // Step 10: Create an array that'd store all test moves done by minimax
    const allTests = [];
    // Step 11: Create a loop so minimax would check all empty slots
    for (let i = 0; i < emptySlots.length; i++) {
      // Step 12: Create empty object to store minimax current test
      const currentTest = {};
      // Step 13: Store index of Empty slot this loop is currently working on
      currentTest.index = currentGameBoard[emptySlots[i]];
      // Step 14: add the whose make to Empty slot this loop is currently working on
      currentGameBoard[emptySlots[i]] = whoseMark;

      // Step 15: Check whoseMark it is before invoking minimax with the opposite mark
      if (whoseMark === AIMark) {
        // Step 16: Recursively invoke minimax with altered board from step 14 and increase depth by 1 until a terminal state is reached
        const result = minimax(currentGameBoard, humanMark, depth + 1);
        // Step 17: store the terminal result from step 9 in current test object in step 12
        currentTest.score = result.score;
        // Step 18: store who invoked the current minimax function(Not Necessary!)
        currentTest.who = AIMark;
      } else {
        // Step 16: Recursively invoke minimax with altered board from step 14 and increase depth by 1 until a terminal state is reached
        const result = minimax(currentGameBoard, AIMark, depth + 1);
        // Step 17: store the terminal result from step 9 in current test object in step 12
        currentTest.score = result.score;
        // Step 18: store who invoked the current minimax function(Not Necessary!)
        currentTest.who = humanMark;
      }
      // Step 19: Change modified gameBoard of current loop from step 13 back to default
      currentGameBoard[emptySlots[i]] = currentTest.index;
      // Step 20: Store the currentTest object in all test array created in step 10
      allTests.push(currentTest);
    }

    // Step 21: Create a variable to get the best test from step 20
    let bestTest = null;
    if (whoseMark === AIMark) {
      // Step 22: create a minimum value to compare to get the best score among all scores in step 20
      let bestScore = -Infinity;
      for (let i = 0; i < allTests.length; i++) {
        // Step 23: Get the score that's the maximum among all test scores
        if (allTests[i].score > bestScore) {
          bestScore = allTests[i].score;
          bestTest = i;
        }
      }
    } else {
      // Step 22: create a minimum value to compare to get the best score among all scores in step 20
      let bestScore = Infinity;
      for (let i = 0; i < allTests.length; i++) {
        // Step 23: Get the score that's the minimum among all test scores
        if (allTests[i].score < bestScore) {
          bestScore = allTests[i].score;
          bestTest = i;
        }
      }
    }

    // Step 24: return the best test among the series of tests pushed in step 20 all tests
    return allTests[bestTest];
  }

  // Step 6: Invoke minimax for the first time...
  const AIDecision = minimax(fakeGameBoard, AIMark, depths);
  // Step 25: Index key in object returned by minimax func in step 24 would be where AI would play in Original Game Board of Step 1
  allSlots[AIDecision.index].innerText = AIMark;
}

// Function to check for a win combo(horizontally, vertically or diagonally)
function checkMatch(currentGameBoard, whoseMark) {
  function checkCells(slot1, slot2, slot3) {
    // variable to store slots combo that may create a win so a styling can be added(Not Necessary)
    cellsThatMatch = [slot1, slot2, slot3];
    return (
      currentGameBoard[slot1] === whoseMark &&
      currentGameBoard[slot2] === whoseMark &&
      currentGameBoard[slot3] === whoseMark
    );
  }
  if (
    checkCells(0, 1, 2) ||
    checkCells(3, 4, 5) ||
    checkCells(6, 7, 8) ||
    checkCells(0, 3, 6) ||
    checkCells(1, 4, 7) ||
    checkCells(2, 5, 8) ||
    checkCells(0, 4, 8) ||
    checkCells(2, 4, 6)
  ) {
    return true;
  } else {
    return false;
  }
}

// Function to check if the game is a tie or someone won
function checkIfGameOver(whoseMark) {
  const gameBoardSlots = [...allSlots].map((e) => e.innerText);

  // invoke check match to check if there's a winner
  let foundWinner = checkMatch(gameBoardSlots, whoseMark);
  // it's a tie if no slot is empty
  let isTie = gameBoardSlots.every((e) => e === humanMark || e === AIMark);

  // Check for a winner first, if there isn't then check if the game is a tie
  if (foundWinner || isTie) {
    const block = document.querySelector(".block");
    block.style.display = "block";
    gameOver = true;

    switch (true) {
      case foundWinner:
        // Add matching color green to the slots that caused a win
        cellsThatMatch.forEach((each) => {
          allSlots[each].style.color = "#1fd655";
        });

        if (whoseMark === humanMark) {
          // Increase human score
          document.querySelector("#player").innerText = ++humanScore;
          scoreAnimation("#player");
        } else {
          // Increase AI score
          document.querySelector("#computer").innerText = ++AIScore;
          scoreAnimation("#computer");
        }
        break;
      case isTie:
        // Add Color red to all slots if it is a tie
        allSlots.forEach((e) => (e.style.color = "#cc0c0c"));
        // Increase Tie score
        document.querySelector("#tie").innerText = ++tieScore;
        scoreAnimation("#tie");
        break;
      default:
        break;
    }

    setTimeout(() => {
      //restart game after 2 seconds
      block.style.display = "none";
      isTie = false;
      cellsThatMatch = null;
      gameOver = false;
      allSlots.forEach((each) => {
        each.style.color = "#fff";
        each.innerText = "";
      });
    }, 2000);
  }
}

// Totally not neccessary
function scoreAnimation(id) {
  const currentScore = document.querySelector(id);
  currentScore.style.color = "#1fd655";
  if (id === "#tie") {
    currentScore.style.color = "#cc0c0c";
  }
  currentScore.style.transform = "scale(1.5)";
  setTimeout(() => {
    currentScore.style.color = "#fff";
    currentScore.style.transform = "none";
  }, 350);
}





/*
// My Own TIC TAC TOE Algorithm before learning minimax function.....It works but all i did was hardcode all possible move, yikes!! IT'S BAD
//  *There are 8 ways to win in tic-tac-toe to ME!!
//  *- horizontally 3 times
//  *- vertically 3 times
//  *- diagonally 2 times

let computerScore = 0;
let tieScore = 0;
let playerScore = 0;
let turn = 0;
let isTie = true; //becomes false if anyone wins
let emptySlot;
let random; // empty random where computer would play
let computerMatched = false;
const all = [...document.querySelectorAll(".marking")];
const gameBoard = document.querySelector(".game-board");

gameBoard.addEventListener("click", (e) => {
  let currentClick = e.target;

  //  if a slot has a value already
  if (currentClick.innerText === "x" || currentClick.innerText === "o") return;

  // player can't play until computer plays
  if (turn % 2 !== 0) return;

  //Player Turn To Play
  playerTurn(currentClick);
  if (turn >= 9) {
    // if all slots are filled or anyone wins
    disableActions();
    return;
  }

  //Computer turn to play
  console.log("It is Computer Turn");
  computerTurn();
  if (turn >= 9) {
    // if all slots are filled or anyone wins
    disableActions();
    return;
  }

  console.log("It is Player Turn");
});

function playerTurn(slotClicked) {
  //add 'X' to the slot player clicked on
  slotClicked.textContent = "x";
  //check if player won
  combinations("x", "player");
  console.log("Player Played");
  ++turn;
}

function computerTurn() {
  console.log("computer is thinking");

  do {
    let edgePlay = [1, 3, 5, 7].some((e) => all[e].innerText === "x");
    let emptyMiddle = all[4].innerText === "";

    if (emptyMiddle && !edgePlay) {
      //start in middle only if player does not play in edges
      random = 4;
    } else if (all[4].innerText === "x" && turn <= 3) {
      //if player plays in middle, comp plays in corners
      random = [0, 2, 6, 8][Math.floor(Math.random() * 4)];
    } else if (edgePlay && turn <= 3) {
      //if player plays in edge, ...
      if (emptyMiddle) {
        //...computer plays in middle slot if it is available
        random = 4;
      } else {
        //...computer plays in corners
        random = [0, 2, 6, 8][Math.floor(Math.random() * 4)];
      }
    } else if (!emptyMiddle && turn <= 3) {
      //reason i did this is too long to explain...just know i did it to fix a tiny bug
      random = [1, 3, 5, 7][Math.floor(Math.random() * 4)];
    } else {
      //would probably never get here
      random = Math.floor(Math.random() * 9);
    }

    //if there's a last empty slot that'd grant victory for computer, WIN
    checkMatch("o");
    if (!computerMatched) {
      //if there's a last empty slot that'd grant victory for player, if yes, Computer COUNTERS by playing in the empty slot
      checkMatch("x");
    }
  } while (all[random].innerText === "x" || all[random].innerText === "o");

  all[random].innerText = "o";
  console.log("computer played in slot", random);
  combinations("o", "computer");
  ++turn;
}

function checkMatch(sym) {
  //check for last empty slot that'd grant a win
  let counter1 = algorithm(0, 1, 2, "", sym, sym);
  let counter2 = algorithm(0, 1, 2, sym, "", sym);
  let counter3 = algorithm(0, 1, 2, sym, sym, "");
  let counter4 = algorithm(3, 4, 5, "", sym, sym);
  let counter5 = algorithm(3, 4, 5, sym, "", sym);
  let counter6 = algorithm(3, 4, 5, sym, sym, "");
  let counter7 = algorithm(6, 7, 8, "", sym, sym);
  let counter8 = algorithm(6, 7, 8, sym, "", sym);
  let counter9 = algorithm(6, 7, 8, sym, sym, "");
  let counter10 = algorithm(0, 3, 6, "", sym, sym);
  let counter11 = algorithm(0, 3, 6, sym, "", sym);
  let counter12 = algorithm(0, 3, 6, sym, sym, "");
  let counter13 = algorithm(1, 4, 7, "", sym, sym);
  let counter14 = algorithm(1, 4, 7, sym, "", sym);
  let counter15 = algorithm(1, 4, 7, sym, sym, "");
  let counter16 = algorithm(2, 5, 8, "", sym, sym);
  let counter17 = algorithm(2, 5, 8, sym, "", sym);
  let counter18 = algorithm(2, 5, 8, sym, sym, "");
  let counter19 = algorithm(0, 4, 8, "", sym, sym);
  let counter20 = algorithm(0, 4, 8, sym, "", sym);
  let counter21 = algorithm(0, 4, 8, sym, sym, "");
  let counter22 = algorithm(2, 4, 6, "", sym, sym);
  let counter23 = algorithm(2, 4, 6, sym, "", sym);
  let counter24 = algorithm(2, 4, 6, sym, sym, "");
  switch (true) {
    case counter1:
    case counter2:
    case counter3:
    case counter4:
    case counter5:
    case counter6:
    case counter7:
    case counter8:
    case counter9:
    case counter10:
    case counter11:
    case counter12:
    case counter13:
    case counter14:
    case counter15:
    case counter16:
    case counter17:
    case counter18:
    case counter19:
    case counter20:
    case counter21:
    case counter22:
    case counter23:
    case counter24:
      random = emptySlot;
      if (sym === "o") {
        //computer found a match and takes it, GAME OVER
        computerMatched = true;
      } else if (sym === "x") {
        //computer found a match for player and takes it, Countered successfully
        computerMatched = false;
      }
      break;
    default:
      computerMatched = false;
      break;
  }
}

function algorithm(
  firstSlot,
  secondSlot,
  thirdSlot,
  firstValue,
  secondValue,
  thirdValue
) {
  let slots = all.map((each) => each.innerText);

  if (
    slots[firstSlot] === firstValue &&
    slots[secondSlot] === secondValue &&
    slots[thirdSlot] === thirdValue
  ) {
    switch ("") {
      //find the slot that's empty among the 3 slots for player to win
      case slots[firstSlot]:
        emptySlot = firstSlot;
        break;
      case slots[secondSlot]:
        emptySlot = secondSlot;
        break;
      case slots[thirdSlot]:
        emptySlot = thirdSlot;
        break;
      default:
        break;
    }
    return true;
  } else {
    return false;
  }
}

function combinations(value, who) {
  let slots = all.map((each) => each.innerText);
  let checkSlots = (slot1, slot2, slot3, val) => {
    return slots[slot1] === val && slots[slot2] === val && slots[slot3] === val;
  };
  //anyone who has a completed 3 matching slots...wins
  let first = checkSlots(0, 1, 2, value);
  let second = checkSlots(3, 4, 5, value);
  let third = checkSlots(6, 7, 8, value);
  let fourth = checkSlots(0, 3, 6, value);
  let fifth = checkSlots(1, 4, 7, value);
  let sixth = checkSlots(2, 5, 8, value);
  let seventh = checkSlots(0, 4, 8, value);
  let eight = checkSlots(2, 4, 6, value);

  function result(v1, v2, v3) {
    all.forEach((each, index) => {
      //add color green to the completed 3 move to indicate WIN
      if (index === v1 || index === v2 || index === v3) {
        all[index].style.color = "#1fd655";
      }
    });
    console.log(`${who} won`);
    if (who === "player") {
      isTie = false;
      document.querySelector("#player").innerText = ++playerScore;
      scoreAnimation("#player");
    } else {
      //same as if(who === 'computer')
      isTie = false;
      document.querySelector("#computer").innerText = ++computerScore;
      scoreAnimation("#computer");
    }
    turn = 9;
  }

  switch (true) {
    case first:
      result(0, 1, 2);
      break;
    case second:
      result(3, 4, 5);
      break;
    case third:
      result(6, 7, 8);
      break;
    case fourth:
      result(0, 3, 6);
      break;
    case fifth:
      result(1, 4, 7);
      break;
    case sixth:
      result(2, 5, 8);
      break;
    case seventh:
      result(0, 4, 8);
      break;
    case eight:
      result(2, 4, 6);
      break;

    default:
      break;
  }
}

function disableActions() {
  //add a transparent background over the page to stop player from clicking until game restarts
  const block = document.querySelector(".block");
  block.style.display = "block";
  if (isTie) {
    all.forEach((each) => {
      //turn all slots value color to red
      each.style.color = "#cc0c0c";
    });
    console.log("It is a Tie");
    document.querySelector("#tie").innerText = ++tieScore;
    scoreAnimation("#tie");
  }
  console.log("Game Over");
  setTimeout(() => {
    //restart game after 2.5 seconds
    block.style.display = "none";
    isTie = true;
    turn = 0;
    all.forEach((each) => {
      each.style.color = "#fff";
      each.innerText = "";
    });
  }, 2500);
}

function scoreAnimation(id) {
  let currentScore = document.querySelector(id);
  currentScore.style.color = "#1fd655";
  if (id === "#tie") {
    currentScore.style.color = "#cc0c0c";
  }
  currentScore.style.transform = "scale(1.5)";
  setTimeout(() => {
    currentScore.style.color = "#fff";
    currentScore.style.transform = "none";
  }, 350);
}
*/
