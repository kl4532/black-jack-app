'use strict';

let deck = [],
  shuffled = [],
  cardNum = 0,
  value = 0,
  numOfDecks = 2,
  ace_hard_p = 0,
  ace_hard_d = 0,
  ace_soft_p = 0,
  ace_soft_d = 0,
  playerValueInitial;
let dealerValue = 0,
  playerValue = 0,
  aces_d = false,
  aces_p = false,
  notEmpty = false,
  hidden,
  hiddenSymbol;
let bet,
    balance,
    initBalance = 500,
    i = 1000;
const URL = "http://localhost:3000/players"

const el = {
  bet: document.getElementById("input-bet"),
  playerName: document.getElementById("input-name"),
  balance: document.getElementById("balance"),
  dealerValue: document.getElementById("dealerValue"),
  playerValue: document.getElementById("playerValue"),
  dealerCards: document.getElementById("dealerCards"),
  playerCards: document.getElementById("playerCards"),
  playerHeader: document.querySelector("#playerValue > h2"),
  dealerHeader: document.querySelector("#dealerValue > h2"),
  dialog: document.querySelector(".dialog"),
  dialogMessage: document.querySelector(".dialog-message"),
  tbody: document.querySelector("tbody"),
  inputDecks: document.querySelector(".decks input")
}

getScoreboard();
init();

// Initial conditions
function init() {
  deactivateElement('input-decks', false);
  balance = initBalance;
  setDeck(); // creates unshuffled deck
  deck = multiplyArray(deck, numOfDecks); // multiply deck
  shuffle(deck, shuffled);
  deactivateElement('btn-cashout', true);
}

function initialDeal() {
  deactivateElement('input-decks', true);
  numOfDecks = el.inputDecks.value;
  if (numOfDecks<1 || numOfDecks>20) {
    alert('Number of decks should be between 1 and 20!');
    return;
  }
  if(!el.playerName.value) {
    alert("What's your name? Fill the input, please.")
    return;
  }

  deactivateElement('input-name', true);
  showWinner('none');
  bet = parseInt(el.bet.value);
  balance = parseInt(el.balance.textContent);

  // if player chose valid amount of money
  if (bet <= balance && bet > 4) {
    balance -= bet;
    el.balance.textContent = balance;
    el.dealerHeader.textContent = 'Dealer: 0';
    el.playerHeader.innerHTML = 'Player: 0';
    deactivateElement('btn-bet', true);
    deactivateElement('btn-cashout', true);

    if (notEmpty) {
      // set initial values for every next hand, except initial hand
      playerValue = 0;
      dealerValue = 0;
      aces_p = false;
      aces_d = false;
      ace_hard_p = 0;
      ace_hard_d = 0;
      // remove all cards from display
      deleteCards("player");
      deleteCards("dealer");
    }
    notEmpty = true; // add with every hand, starting with first

    // ADDING CARDS ALGORITHM
    addCard("playerCards");
    setTimeout("addCardInitial('playerCards')", 400);
    setTimeout("addCard('dealerCards')", 800);
    setTimeout("addCard('hidden');", 1200);
    setTimeout(function () {
      if (playerValueInitial === 21) {
        // stand when player hit 21
        playerValue = 21;
        stand();
      }
    }, 1700);
    setTimeout(function () {
      deactivateElement('btn-hit', false); // activate buttons after cards dealed
      deactivateElement('btn-stand', false);
    }, 1699);
  } else if (bet <= 5) {
    alert('Bet has to be > 5...');
  } else {
    alert("You don't have enough money...");
  }
}

function deleteCards(person) {
  const per = document.getElementById(person + "Cards");
  while (per.firstChild) {
    // remove playerCards
    per.removeChild(per.firstChild);
  }
}

function showHidden() {
  // at the beginning one of dealer cards is hidden, this func remove hidden card, and display score
  document
    .getElementById('hidden')
    .parentNode.removeChild(document.getElementById('hidden')); // remove cover for hidden card
  let place = el.dealerCards;
  let card = document.createElement('div');
  card.setAttribute('class', 'card');
  card.innerHTML =
    '<img alt = "hiddenSymbol" id = "symbol-top" class ="symbol-top" src = "./images/' +
    hiddenSymbol +
    '.png"/><div id="symbol-num" class="symbol-num">' +
    hidden +
    '</div><img alt = "hiddenSymbol" id = "symbol-bottom" class = "symbol-bottom" src = "./images/' +
    hiddenSymbol +
    '.png"/>';
  dealerValue += cardNumericalValue(hidden);
  hidden === "A" ? aces_d = true : aces_d;
  if (aces_d) {
    ace_hard_d = dealerValue + 10;
    ace_soft_d = dealerValue;
  } else {
    ace_soft_d = dealerValue;
    ace_hard_d = dealerValue;
  }
  if (ace_soft_d === 21 || ace_hard_d === 21) {
    el.dealerHeader.textContent = "Dealer: 21!";
    dealerValue = 21;
  } else
    el.dealerHeader.textContent =
      "Dealer: " + (ace_hard_d <= 21 ? ace_hard_d : ace_soft_d);
  value = count(hidden);
  cardNum++; // pointing to the next card in deck
  place.appendChild(card);
}

function stand() {
  // after player finish, dealing cards for dealer side
  deactivateElement("btn-stand", true);
  deactivateElement("btn-hit", true);
  showHidden();
  playerValue =
    playerValue > playerValueInitial ? playerValue : playerValueInitial; // when player stand after two cards
  // ace_hard = 0;
  dealerValue = (ace_hard_d <= 21 ? ace_hard_d : ace_soft_d);
  while ( dealerValue <= playerValue) {
    // add cards till less than 17
    if(dealerValue >= 17) {
      break;
    }
    addCard("dealerCards");
    i += 1000;
  }
  gameResult();
}

function gameResult() {
  // set winner regarding final card values
  dealerValue = ace_hard_d <= 21 ? ace_hard_d : ace_soft_d;
  playerValue = ace_hard_p <= 21 ? ace_hard_p : ace_soft_p;
  if ((dealerValue > 21 || playerValue > dealerValue) && playerValue <= 21) {
    showWinner("player");
    balance += 2 * bet;
  } else if (dealerValue === playerValue) {
    showWinner("push");
    balance += 1 * bet;
  } else {
    showWinner("dealer");
  }
  el.balance.textContent = balance;
  if (shuffled.length - cardNum < 10) {
    // shuffleDeck?
    shuffle(deck, shuffled);
    alert("Deck shuffling");
    cardNum = 0;
    value = 0;
  }
  deactivateElement("btn-bet", false); // activate btn bet again
  deactivateElement('btn-cashout', false);
  deactivateElement("btn-stand", true);
  deactivateElement("btn-hit", true);
  //alert(`playerValue: ${playerValue}\n dealerValue: ${dealerValue}`)
  // return compare playerValue and dealerValue
}
function showWinner(winnerId) {
  // highlight winner
  if (winnerId === "none") {
    el.dealerHeader.style.backgroundColor = "transparent";
    el.playerHeader.style.backgroundColor = "transparent";
  } else if (winnerId === "push") {
    el.dealerHeader.style.backgroundColor = "orange";
    el.playerHeader.style.backgroundColor = "orange";
  } else document.querySelector("#"  + winnerId + "Value> h2").style.backgroundColor = "yellow";
}

function addCard(place_id) {
  // deal card to player or dealer, place_id is the name of the parent container to add a card
  if (place_id === "hidden") {
    // add hidden card(only once and only for dealer)
    let place = el.dealerCards;
    let card = document.createElement("div");
    card.setAttribute("class", "card");
    card.setAttribute("id", "hidden");
    place.appendChild(card);
    hidden = shuffled[cardNum][0];
    hiddenSymbol = shuffled[cardNum][1];
    cardNum++;
  } else {
    // when place id == dealer or player
    let place = document.getElementById(place_id); // create card
    let card = document.createElement("div");
    card.setAttribute("class", "card");
    card.innerHTML =
        '<img id="symbol-top" class="symbol-top" src= "./images/' +
        shuffled[cardNum][1] +
        '.png"/><div id="symbol-num" class="symbol-num">' +
        shuffled[cardNum][0] +
        '</div><img id="symbol-bottom" class="symbol-bottom" src= "./images/' +
        shuffled[cardNum][1] +
        '.png"/>';
    if (place_id === "dealerCards") {
      // add for dealer
      dealerValue += cardNumericalValue(shuffled[cardNum][0]); // card convert to numerical value
      shuffled[cardNum][0] === "A" ? aces_d = true : aces_d;
      if (aces_d) {
        // when ace apear
        ace_hard_d = dealerValue + 10;
        ace_soft_d = dealerValue;
      } else {
        ace_soft_d = dealerValue;
        ace_hard_d = dealerValue;
      }
      if (ace_hard_d > 21 && ace_soft_d > 21) {
        // when score is too high with soft(1) and hard(11) ace
        el.dealerHeader.textContent =
          "Dealer: " + ace_soft_d;
      } else if (ace_soft_d === 21 || ace_hard_d === 21) {
        // when score is 21 with one of aces(hard/soft)
        el.dealerHeader.textContent = "Dealer: 21!";
        dealerValue = 21;
      } else
        el.dealerHeader.textContent = "Dealer: " + (ace_hard_d <= 21 ? ace_hard_d : ace_soft_d); // display result using better ace
    } else {
      // add for player
      playerValue += cardNumericalValue(shuffled[cardNum][0]);
      shuffled[cardNum][0] === "A" ? aces_p = true : aces_d;
      if (aces_p) {
        ace_hard_p = playerValue + 10;
        ace_soft_p = playerValue;
      } else {
        ace_soft_p = playerValue;
        ace_hard_p = playerValue;
      }
      if (ace_hard_p > 21 && ace_soft_p > 21) {
        // when score is too high with soft(1) and hard(11) ace
        el.playerHeader.textContent =
          "Player: " + ace_soft_p;
        playerValue = ace_soft_p;
        showHidden(); // show dealer hidden card after player busted
        gameResult();
      } else if (ace_soft_p === 21 || ace_hard_p === 21) {
        // when score is 21 with one of aces(hard/soft)
        el.playerHeader.textContent = "Player: 21!";
        playerValue = 21;
        stand();
      } else
        el.playerHeader.textContent =
          "Player: " + (ace_hard_p <= 21 ? ace_hard_p : ace_soft_p); // display result using better ace
    }
    value = count(shuffled[cardNum][0]);
    cardNum++; // pointing to the next card in deck
    place.appendChild(card);
  }
}

function addCardInitial(place_id) {
  //used only at the start of turn, and only for player
  let place = document.getElementById(place_id); // create card
  let card = document.createElement("div");
  card.setAttribute("class", "card");
  card.innerHTML =
    '<img id="symbol-top" class="symbol-top" src= "./images/' +
    shuffled[cardNum][1] +
    '.png"/><div id="symbol-num" class="symbol-num">' +
    shuffled[cardNum][0] +
    '</div><img id="symbol-bottom" class="symbol-bottom" src= "./images/' +
    shuffled[cardNum][1] +
    '.png"/>';
  playerValue += cardNumericalValue(shuffled[cardNum][0]);
  shuffled[cardNum][0] === "A" ? (aces_p = true) :  aces_p;
  if (aces_p) {
    ace_hard_p = playerValue + 10;
    ace_soft_p = playerValue;
  } else {
    ace_soft_p = playerValue;
    ace_hard_p = playerValue;
  }
  el.playerHeader.textContent =
    "Player: " + (ace_hard_p <= 21 ? ace_hard_p : ace_soft_p);
  playerValueInitial = ace_hard_p <= 21 ? ace_hard_p : ace_soft_p;
  value = count(shuffled[cardNum][0]);
  cardNum++; // pointing to the next card in deck
  place.appendChild(card);
}
// This function was created to reduce code in addCard func, but it was not working properly
function checkStatus(
  currentValue,
  card,
  aces_x,
  ace_hard_x,
  ace_soft_x,
  id,
  name
) {
  currentValue += cardNumericalValue(card);
  card === "A" ? aces_x = true : aces_x;
  if (aces_x) {
    ace_hard_x = currentValue + 10;
    ace_soft_x = currentValue;
  } else {
    ace_soft_x = currentValue;
    ace_hard_x = currentValue;
  }
  if (ace_hard_x > 21 && ace_soft_x > 21) {
    if(name === 'player') {
      el.playerHeader.textContent = `${name}: ` + ace_soft_x;
    } else {
      el.dealerHeader.textContent = `${name}: ` + ace_soft_x;
    }
    if (currentValue === playerValue) {
      deactivateElement("btn-hit", true);
      deactivateElement("btn-stand", true);
      currentValue = ace_soft_x;
      showHidden(); // show dealer hidden card after player busted
      gameResult();
    }
  } else if (ace_soft_x === 21 || ace_hard_x === 21) {
    if(name === 'player') {
      el.playerHeader.textContent = `${name}: ` + 21;
    } else {
      el.dealerHeader.textContent = `${name}: ` + 21;
    }
    currentValue = 21;
    if (currentValue === playerValue) {
      deactivateElement("btn-hit", true);
      deactivateElement("btn-stand", true);
      stand();
    }
  } else
  if(name === 'player') {
    el.playerHeader.textContent = `${name}: ` + (ace_hard_x <= 21 ? ace_hard_x : ace_soft_x);
  } else {
    el.dealerHeader.textContent = `${name}: ` + (ace_hard_x <= 21 ? ace_hard_x : ace_soft_x);
  }
  // checkStatus(playerValue, shuffled[cardNum][0], aces_p, ace_hard_p, ace_soft_p, 'playerValue', 'Player');
}

function setDeck() {
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const symbols = ['heart', 'diamond', 'club', 'spade'];
  deck = [];
  values.forEach(value => {
    for(const symbol of symbols){
      deck.push([value, symbol])
    }
  });

  shuffled = [];
  cardNum = 0;
  value = 0;
  document.getElementById("balance").innerHTML = "500";
}

function shuffle(arr1, arr2) {
  // shuffling arr1 to create arr2, arr1 is still available unchanged after function proceeded
  let temp = arr1.slice(0); // clone arr1 to save it, temp will be killed
  while (arr2.length < 52 * numOfDecks) {
    let pick = rand(0, temp.length - 1);
    arr2.push(temp[pick]);
    if (temp.length !== 0) {
      temp.splice(pick, 1);
    }
  }
}

function count(cards) {
  const minus = ["10", "J", "Q", "K", "A"];
  const plus = ["2", "3", "4", "5", "6"];
  if (minus.includes(cards)) {
    value--;
  } else if (plus.includes(cards)) {
    value++;
  }
  return value;
}

function rand(min, max) {
  return Math.floor(Math.random() * (1 + max - min)) + min;
}

function multiplyArray(arr, n) {
  let i = 0;
  let new_arr = [];
  while (i < n) {
    new_arr = new_arr.concat(arr);
    i++;
  }
  return new_arr;
}

function hint() {
  el.dialog.classList.remove('hidden');
  el.dialogMessage.innerHTML = `General winning strategy: the player can increase the
     starting bet if there are many aces and tens left in the deck(value is heigh)
      in the hope of hitting a blackjack.
      Card counting is most rewarding near
      the end of a complete shoe when as few as possible cards remain.
    <br><br>
    Card dealed: ${cardNum}/${shuffled.length}
    <br>
    Current value: ${value}\n
    <br>
    You are playing with ${numOfDecks} decks`
} //https://wizardofodds.com/games/blackjack/basics/

function cardNumericalValue(card) {
  if (card === "J" || card === "Q" || card === "K") {
    return 10;
  } else if (card === "A") {
    return 1;
  } else {
    return parseInt(card);
  }
}

function deactivateElement(btn, on) {
  document.getElementById(btn).disabled = on;
}

function closeDialog() {
  el.dialog.classList.add('hidden');
}

function cashout() {
  const answer = window.confirm("Are you sure?");
  if(answer) {
    sendResult();
    init();
  }
}

function sendResult() {
  const body = {
    name: el.playerName.value,
    score: balance,
    date: new Date()
  }

  fetch(URL, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
    .then(res => {
      if(res.status === 201) {
        deactivateElement('input-name', false);
        init();
      } else {
        alert(`Results not saved. Messsage: ${res.status}, ${res.statusText}`, );
      }
    })
    .then(()=> getScoreboard())
    .catch(err => {
      alert(err);
  });
}

function getScoreboard() {
  fetch(URL)
      .then(response => response.json())
      .then(data => reFillTable(data));
}

function reFillTable(players) {
  players.sort((a, b) => (a.score < b.score) ? 1 : -1);
  el.tbody.textContent = "";
  for(let i = 0; i<10; i++) {
    let miliseconds = Date.parse(players[i].date);
    const date = new Date(miliseconds);
    const isoDate =  `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${i+1}</td>
        <td>${players[i].name}</td>
        <td>${players[i].score}</td>
        <td>${isoDate}</td>
      `
    el.tbody.appendChild(row);
  }

}

