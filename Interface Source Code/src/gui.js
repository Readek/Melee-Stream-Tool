window.onload = init;

const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, '..', '..', 'Stream Tool', 'Resources', 'Texts');
const charPath = path.join(__dirname, '..', '..', 'Stream Tool', 'Resources', 'Characters');

//yes we all like global variables
let charP1 = "Random";
let charP2 = "Random";
let skinP1 = "";
let skinP2 = "";
let colorP1, colorP2;
let currentP1WL = "Nada";
let currentP2WL = "Nada";
let currentBestOf = "Bo5";

let movedSettings = false;
let charP1Active = false;


const viewport = document.getElementById('viewport');

const p1NameInp = document.getElementById('p1Name');
const p1TagInp = document.getElementById('p1Tag');
const p2NameInp = document.getElementById('p2Name');
const p2TagInp = document.getElementById('p2Tag');

const charImgP1 = document.getElementById('p1CharImg');
const charImgP2 = document.getElementById('p2CharImg');

const p1Win1 = document.getElementById('winP1-1');
const p1Win2 = document.getElementById('winP1-2');
const p1Win3 = document.getElementById('winP1-3');
const p1Win4 = document.getElementById('winP1-4');
const p2Win1 = document.getElementById('winP2-1');
const p2Win2 = document.getElementById('winP2-2');
const p2Win3 = document.getElementById('winP2-3');
const p2Win4 = document.getElementById('winP2-4');
p1Win4.style.display = 'none';
p2Win4.style.display = 'none';

const p1W = document.getElementById('p1W');
const p1L = document.getElementById('p1L');
const p2W = document.getElementById('p2W');
const p2L = document.getElementById('p2L');

const roundInp = document.getElementById('roundName');

const forceWL = document.getElementById('forceWLToggle');


function init() {

    //first, add listeners for the bottom bar buttons
    document.getElementById('updateRegion').addEventListener("click", writeScoreboard);
    document.getElementById('settingsRegion').addEventListener("click", moveViewport);

    //if the viewport is moved, click anywhere on the center to go back
    document.getElementById('goBack').addEventListener("click", goBack);

    //move the viewport to the center (this is to avoid animation bugs)
    viewport.style.right = "100%";
    

    /* OVERLAY */

    //load color slot list
    loadColors(1);
    loadColors(2);


    //set initial values for the character selectors
    document.getElementById('p1CharSelector').setAttribute('src', charPath + '/CSS/Random.png');
    document.getElementById('p2CharSelector').setAttribute('src', charPath + '/CSS/Random.png');
    //if clicking them, show the character roster
    document.getElementById('p1CharSelector').addEventListener("click", openChars);
    document.getElementById('p2CharSelector').addEventListener("click", openChars);

    //create the character roster
    createCharRoster();
    //if clicking the entirety of the char roster div, hide it
    document.getElementById('charRoster').addEventListener("click", hideChars);

    //update the character image (to random)
    charImgChange(charImgP1, "Random");
    charImgChange(charImgP2, "Random");

    //check whenever an image isnt found so we replace it with a "?"
    document.getElementById('p1CharImg').addEventListener("error", () => {
        document.getElementById('p1CharImg').setAttribute('src', charPath + '/Portraits/Random '+colorP1+'.png');
    });
    document.getElementById('p2CharImg').addEventListener("error", () => {
        document.getElementById('p2CharImg').setAttribute('src', charPath + '/Portraits/Random '+colorP2+'.png');
    });


    //score checks
    p1Win1.addEventListener("click", changeScoreTicks1);
    p2Win1.addEventListener("click", changeScoreTicks1);
    p1Win2.addEventListener("click", changeScoreTicks2);
    p2Win2.addEventListener("click", changeScoreTicks2);
    p1Win3.addEventListener("click", changeScoreTicks3);
    p2Win3.addEventListener("click", changeScoreTicks3);
    p1Win4.addEventListener("click", changeScoreTicks4);
    p2Win4.addEventListener("click", changeScoreTicks4);

    //set click listeners for the [W] and [L] buttons
    p1W.addEventListener("click", setWLP1);
    p1L.addEventListener("click", setWLP1);
    p2W.addEventListener("click", setWLP2);
    p2L.addEventListener("click", setWLP2);


    //check whenever the player's name has a skin
    p1NameInp.addEventListener("input", resizeInput);
    p2NameInp.addEventListener("input", resizeInput);

    //resize the box whenever the user types
    p1TagInp.addEventListener("input", resizeInput);
    p2TagInp.addEventListener("input", resizeInput);


    //set click listeners to change the "best of" status
    document.getElementById("bo3Div").addEventListener("click", changeBestOf);
    document.getElementById("bo5Div").addEventListener("click", changeBestOf);
    document.getElementById("bo7Div").addEventListener("click", changeBestOf);
    //set initial value
    document.getElementById("bo3Div").style.color = "var(--text2)";
    document.getElementById("bo5Div").style.backgroundImage = "linear-gradient(to top, #575757, #00000000)";
    document.getElementById("bo7Div").style.color = "var(--text2)";


    //check if the round is grand finals
    roundInp.addEventListener("input", checkRound);


    //add a listener to the swap button
    document.getElementById('swapButton').addEventListener("click", swap);
    //add a listener to the clear button
    document.getElementById('clearButton').addEventListener("click", clearPlayers);


    /* SETTINGS */

    //set a listener for the forceWL check
    forceWL.addEventListener("click", forceWLtoggles);


    /* KEYBOARD SHORTCUTS */

    Mousetrap.bind('enter', () => { 
        writeScoreboard();
        document.getElementById('botBar').style.backgroundColor = "var(--bg3)";
    }, 'keydown');
    Mousetrap.bind('enter', () => {
        document.getElementById('botBar').style.backgroundColor = "var(--bg5)";
     }, 'keyup');

    Mousetrap.bind('esc', () => {
        if (movedSettings) { //if settings are open, close them
            goBack();
        } else if (document.getElementById('charRoster').style.opacity == 1) {
            hideChars(); //if charRoster is visible, hide it
        } else {
            clearPlayers();
        }
    });

    Mousetrap.bind('f1', () => { giveWinP1() });
    Mousetrap.bind('f2', () => { giveWinP2() });
}


function moveViewport() {
    if (!movedSettings) {
        viewport.style.right = "140%";
        document.getElementById('overlay').style.opacity = "25%";
        document.getElementById('goBack').style.display = "block"
        movedSettings = true;
    }
}

function goBack() {
    viewport.style.right = "100%";
    document.getElementById('overlay').style.opacity = "100%";
    document.getElementById('goBack').style.display = "none";
    movedSettings = false;
}


//called whenever we need to read a json file
function getJson(fileName) {
    try {
        let settingsRaw = fs.readFileSync(mainPath + "/" + fileName + ".json");
        return JSON.parse(settingsRaw);
    } catch (error) {
        return undefined;
    }
}


//will load the color list to a color slot combo box
function loadColors(pNum) {
    let colorList = getJson("InterfaceInfo"); //check the color list

    //for each color found, add them to the color list
    for (let i = 0; i < Object.keys(colorList.colorSlots).length; i++) {

        //create a new div that will have the color info
        let newDiv = document.createElement('div');
        newDiv.style.display = "flex"; //so everything is in 1 line
        newDiv.title = "Also known as " + colorList.colorSlots["color"+i].hex;
        newDiv.className = "colorEntry";

        //if the div gets clicked, update the colors
        newDiv.addEventListener("click", updateColor);

        //create the color's name
        let newText = document.createElement('div');
        newText.innerHTML = colorList.colorSlots["color"+i].name;
        
        //create the color's rectangle
        let newRect = document.createElement('div');
        newRect.style.width = "13px";
        newRect.style.height = "13px";
        newRect.style.margin = "5px";
        newRect.style.backgroundColor = colorList.colorSlots["color"+i].hex;

        //add them to the div we created before
        newDiv.appendChild(newRect);
        newDiv.appendChild(newText);

        //now add them to the actual interface
        document.getElementById("dropdownColorP"+pNum).appendChild(newDiv);
    }

    //set the initial colors for the interface (the first color for p1, and the second for p2)
    if (pNum == 1) {
        document.getElementById("player1").style.backgroundImage = "linear-gradient(to bottom left, "+colorList.colorSlots["color"+0].hex+"50, #00000000, #00000000)";
        document.getElementById("p1ColorRect").style.backgroundColor = colorList.colorSlots["color"+0].hex;
    } else {
        document.getElementById("player2").style.backgroundImage = "linear-gradient(to bottom left, "+colorList.colorSlots["color"+1].hex+"50, #00000000, #00000000)";
        document.getElementById("p2ColorRect").style.backgroundColor = colorList.colorSlots["color"+1].hex;
    }

    //finally, set initial values for the global color variables
    colorP1 = "Red";
    colorP2 = "Blue";
}

function updateColor() {

    let pNum; //you've seen this one enough already, right?
    if (this.parentElement.parentElement == document.getElementById("p1Color")) {
        pNum = 1;
    } else {
        pNum = 2;
    }

    let clickedColor = this.textContent;
    let colorList = getJson("InterfaceInfo");

    //search for the color we just clicked
    for (let i = 0; i < Object.keys(colorList.colorSlots).length; i++) {
        if (colorList.colorSlots["color"+i].name == clickedColor) {
            let colorRectangle, colorGrad;

            colorRectangle = document.getElementById("p"+pNum+"ColorRect");
            colorGrad = document.getElementById("player"+pNum);
            
            //change the variable that will be read when clicking the update button
            if (pNum == 1) {
                colorP1 = colorList.colorSlots["color"+i].name;
            } else {
                colorP2 = colorList.colorSlots["color"+i].name;
            }

            //then change both the color rectangle and the background gradient
            colorRectangle.style.backgroundColor = colorList.colorSlots["color"+i].hex;
            colorGrad.style.backgroundImage = "linear-gradient(to bottom left, "+colorList.colorSlots["color"+i].hex+"50, #00000000, #00000000)";
        
            //also, if random is up, change its color
            if (pNum == 1) {
                if (charP1 == "Random") {
                    document.getElementById('p1CharImg').setAttribute('src', charPath + '/Portraits/Random '+colorP1+'.png');
                }
            } else {
                if (charP2 == "Random") {
                    document.getElementById('p2CharImg').setAttribute('src', charPath + '/Portraits/Random '+colorP2+'.png');
                }
            }

        }
    }

    //remove focus from the menu so it hides on click
    this.parentElement.parentElement.blur();
}


//change the image path depending on the character and skin
function charImgChange(charImg, charName, skinName = "Default") {
    if (charName == "Random") {
        charImg.setAttribute('src', charPath + '/Portraits/Random.png');
    } else {
        charImg.setAttribute('src', charPath + '/Portraits/' + charName + '/' + skinName + '.png');
    }
}


function createCharRoster() {
    //checks the character list which we use to order stuff
    const guiSettings = getJson("InterfaceInfo");

    //first row
    for (let i = 0; i < 9; i++) {
        let newImg = document.createElement('img');
        newImg.className = "charInRoster";
        newImg.setAttribute('src', charPath + '/CSS/'+guiSettings.charactersBase[i]+'.png');

        newImg.id = guiSettings.charactersBase[i]; //we will read this value later
        newImg.addEventListener("click", changeCharacter);

        document.getElementById("rosterLine1").appendChild(newImg);
    }
    //second row
    for (let i = 9; i < 18; i++) {
        let newImg = document.createElement('img');
        newImg.className = "charInRoster";

        newImg.id = guiSettings.charactersBase[i];
        newImg.addEventListener("click", changeCharacter);

        newImg.setAttribute('src', charPath + '/CSS/'+guiSettings.charactersBase[i]+'.png');
        document.getElementById("rosterLine2").appendChild(newImg);
    }
    //third row
    for (let i = 18; i < 26; i++) {
        let newImg = document.createElement('img');
        newImg.className = "charInRoster";

        newImg.id = guiSettings.charactersBase[i];
        newImg.addEventListener("click", changeCharacter);

        newImg.setAttribute('src', charPath + '/CSS/'+guiSettings.charactersBase[i]+'.png');
        document.getElementById("rosterLine3").appendChild(newImg);
    }
}

//whenever we click on the character change button
function openChars() {
    charP1Active = false; //simple check to know if this is P1 or P2, used on other functions
    if (this == document.getElementById('p1CharSelector')) {
        charP1Active = true;
    }

    document.getElementById('charRoster').style.display = "flex"; //show the thing
    setTimeout( () => { //right after, change opacity and scale
        document.getElementById('charRoster').style.opacity = 1;
        document.getElementById('charRoster').style.transform = "scale(1)";
    }, 0);
}
//to hide the character grid
function hideChars() {
    document.getElementById('charRoster').style.opacity = 0;
    document.getElementById('charRoster').style.transform = "scale(1.2)";
    setTimeout(() => {
        document.getElementById('charRoster').style.display = "none";
    }, 200);
}

//called whenever clicking an image in the character roster
function changeCharacter() {
    if (charP1Active) {
        charP1 = this.id;
        skinP1 = "Default";
        document.getElementById('p1CharSelector').setAttribute('src', charPath + '/CSS/'+charP1+'.png');
        charImgChange(charImgP1, charP1);
        addSkinIcons(1);
    } else {
        charP2 = this.id;
        skinP2 = "Default";
        document.getElementById('p2CharSelector').setAttribute('src', charPath + '/CSS/'+charP2+'.png');
        charImgChange(charImgP2, charP2);
        addSkinIcons(2);
    }
}
//same as above but for the swap button
function changeCharacterManual(char, pNum) {
    document.getElementById('p'+pNum+'CharSelector').setAttribute('src', charPath + '/CSS/'+char+'.png');
    if (pNum == 1) {
        charP1 = char;
        skinP1 = "Default";
        charImgChange(charImgP1, char);
        addSkinIcons(1);
    } else {
        charP2 = char;
        skinP2 = "Default";
        charImgChange(charImgP2, char);
        addSkinIcons(2);
    }
}
//also called when we click those images
function addSkinIcons(pNum) {
    document.getElementById('skinListP'+pNum).innerHTML = ''; //clear everything before adding
    let charInfo;
    if (pNum == 1) { //ahh the classic 'which character am i' check
        charInfo = getJson("Character Info/" + charP1);
    } else {
        charInfo = getJson("Character Info/" + charP2);
    }


    if (charInfo != undefined) { //if character doesnt have a list (for example: Random), skip this
        //add an image for every skin on the list
        for (let i = 0; i < charInfo.skinList.length; i++) {
            let newImg = document.createElement('img');
            newImg.className = "skinIcon";
            newImg.id = charInfo.skinList[i];
            newImg.title = charInfo.skinList[i];

            if (pNum == 1) {
                newImg.setAttribute('src', charPath + '/Stock Icons/'+charP1+'/'+charInfo.skinList[i]+'.png');
                newImg.addEventListener("click", changeSkinP1);
            } else {
                newImg.setAttribute('src', charPath + '/Stock Icons/'+charP2+'/'+charInfo.skinList[i]+'.png');
                newImg.addEventListener("click", changeSkinP2);
            }

            document.getElementById('skinListP'+pNum).appendChild(newImg);
        }
        //if the character is Zelda, we also need to add sheik
        if (charP1 == "Zelda") {
            if (!document.getElementById('skinListP1Sheik').children.length > 0) {
                for (let i = 0; i < charInfo.skinList.length; i++) {
                    let newImg = document.createElement('img');
                    newImg.className = "skinIcon";
                    newImg.id = "Sheik " + charInfo.skinList[i];
                    newImg.title = "Sheik " + charInfo.skinList[i];
        
                    newImg.setAttribute('src', charPath + '/Stock Icons/'+charP1+'/Sheik '+charInfo.skinList[i]+'.png');
                    newImg.addEventListener("click", changeSkinP1);

                    //increase the height of the skins box
                    document.getElementById('skinSelectorP1').style.height = "60px";
        
                    document.getElementById('skinListP1Sheik').appendChild(newImg);
                }
            }
            document.getElementById('skinListP1').style.marginTop = "0px";
        } else {
            document.getElementById('skinSelectorP1').style.height = "30px";
            document.getElementById('skinListP1').style.marginTop = "-1px";
            document.getElementById('skinListP1Sheik').innerHTML = '';
        }
        if (charP2 == "Zelda") {
            if (!document.getElementById('skinListP2Sheik').children.length > 0) {
                for (let i = 0; i < charInfo.skinList.length; i++) {
                    let newImg = document.createElement('img');
                    newImg.className = "skinIcon";
                    newImg.id = "Sheik " + charInfo.skinList[i];
                    newImg.title = "Sheik " + charInfo.skinList[i];
        
                    newImg.setAttribute('src', charPath + '/Stock Icons/'+charP2+'/Sheik '+charInfo.skinList[i]+'.png');
                    newImg.addEventListener("click", changeSkinP2);
                    document.getElementById('skinSelectorP2').style.height = "60px";
        
                    document.getElementById('skinListP2Sheik').appendChild(newImg);
                }
            }
            document.getElementById('skinListP2').style.marginTop = "0px";
        } else {
            document.getElementById('skinSelectorP2').style.height = "30px";
            document.getElementById('skinListP2').style.marginTop = "-1px";
            document.getElementById('skinListP2Sheik').innerHTML = '';
        }
    }

    //if the list only has 1 skin or none, hide the skin list
    if (document.getElementById('skinListP'+pNum).children.length <= 1) {
        document.getElementById('skinSelectorP'+pNum).style.opacity = 0;
    } else {
        document.getElementById('skinSelectorP'+pNum).style.opacity = 1;
    }
}
//whenever clicking on the skin images
function changeSkinP1() {
    skinP1 = this.id;
    charImgChange(charImgP1, charP1, skinP1);
}
function changeSkinP2() {
    skinP2 = this.id;
    charImgChange(charImgP2, charP2, skinP2);
}


//whenever clicking on the first score tick
function changeScoreTicks1() {
    let pNum = 1;
    if (this == p2Win1) {
        pNum = 2;
    }

    //deactivate wins 2 and 3
    document.getElementById('winP'+pNum+'-2').checked = false;
    document.getElementById('winP'+pNum+'-3').checked = false;
    document.getElementById('winP'+pNum+'-4').checked = false;
}
//whenever clicking on the second score tick
function changeScoreTicks2() {
    let pNum = 1;
    if (this == p2Win2) {
        pNum = 2;
    }

    //deactivate wins 2 and 3
    document.getElementById('winP'+pNum+'-1').checked = true;
    document.getElementById('winP'+pNum+'-3').checked = false;
    document.getElementById('winP'+pNum+'-4').checked = false;
}
//something something the third score tick
function changeScoreTicks3() {
    let pNum = 1;
    if (this == p2Win3) {
        pNum = 2;
    }

    //deactivate wins 2 and 3
    document.getElementById('winP'+pNum+'-1').checked = true;
    document.getElementById('winP'+pNum+'-2').checked = true;
    document.getElementById('winP'+pNum+'-4').checked = false;
}

//something something the fourth score tick
function changeScoreTicks4() {
    let pNum = 1;
    if (this == p2Win4) {
        pNum = 2;
    }

    //deactivate wins 2 and 3
    document.getElementById('winP'+pNum+'-1').checked = true;
    document.getElementById('winP'+pNum+'-2').checked = true;
    document.getElementById('winP'+pNum+'-3').checked = true;
}

//returns how much score does a player have
function checkScore(tick1, tick2, tick3, tick4) {
    let totalScore = 0;

    if (tick1.checked) {
        totalScore++;
    }
    if (tick2.checked) {
        totalScore++;
    }
    if (tick3.checked) {
        totalScore++;
    }
    if (tick4.checked) {
        totalScore++;
    }

    return totalScore;
}

//gives a victory to player 1 
function giveWinP1() {
    if (p1Win3.checked) {
        p1Win4.checked = true;
    } else if (p1Win2.checked) {
        p1Win3.checked = true;
    } else if (p1Win1.checked) {
        p1Win2.checked = true;
    } else if (!p1Win1.checked) {
        p1Win1.checked = true;
    }
}
//same with P2
function giveWinP2() {
    if (p2Win3.checked) {
        p2Win4.checked = true;
    } else if (p2Win2.checked) {
        p2Win3.checked = true;
    } else if (p2Win1.checked) {
        p2Win2.checked = true;
    } else if (!p2Win1.checked) {
        p2Win1.checked = true;
    }
}


function setWLP1() {
    if (this == p1W) {
        currentP1WL = "W";
        this.style.color = "var(--text1)";
        p1L.style.color = "var(--text2)";
        this.style.backgroundImage = "linear-gradient(to top, #575757, #00000000)";
        p1L.style.backgroundImage = "var(--bg4)";
    } else {
        currentP1WL = "L";
        this.style.color = "var(--text1)";
        p1W.style.color = "var(--text2)";
        this.style.backgroundImage = "linear-gradient(to top, #575757, #00000000)";
        p1W.style.backgroundImage = "var(--bg4)";
    }
}
function setWLP2() {
    if (this == p2W) {
        currentP2WL = "W";
        this.style.color = "var(--text1)";
        p2L.style.color = "var(--text2)";
        this.style.backgroundImage = "linear-gradient(to top, #575757, #00000000)";
        p2L.style.backgroundImage = "var(--bg4)";
    } else {
        currentP2WL = "L";
        this.style.color = "var(--text1)";
        p2W.style.color = "var(--text2)";
        this.style.backgroundImage = "linear-gradient(to top, #575757, #00000000)";
        p2W.style.backgroundImage = "var(--bg4)";
    }
}
function deactivateWL() {
    currentP1WL = "Nada";
    currentP2WL = "Nada";
    document.getElementById;

    pWLs = document.getElementsByClassName("wlBox");
    for (let i = 0; i < pWLs.length; i++) {
        pWLs[i].style.color = "var(--text2)";
        pWLs[i].style.backgroundImage = "var(--bg4)";
    }
}


//same code as above but just for the player tag
function resizeInput() {
    changeInputWidth(this);
}

//changes the width of an input box depending on the text
function changeInputWidth(input) {
    input.style.width = getTextWidth(input.value,
        window.getComputedStyle(input).fontSize + " " +
        window.getComputedStyle(input).fontFamily
        ) + 12 + "px";
}


//used to get the exact width of a text considering the font used
function getTextWidth(text, font) {
    let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
}


//used when clicking on the "Best of" buttons
function changeBestOf() {
    let theOtherBestOf; //we always gotta know
    let theOtherBestOf2; //we always gotta know
    if (this == document.getElementById("bo5Div")) {
        currentBestOf = "Bo5";
        theOtherBestOf = document.getElementById("bo3Div");
        theOtherBestOf2 = document.getElementById("bo7Div");
        p1Win3.style.display = "block";
        p2Win3.style.display = "block";
        p1Win4.style.display = "none";
        p2Win4.style.display = "none";
    } else if (this == document.getElementById("bo7Div")) {
        currentBestOf = "Bo7";
        theOtherBestOf = document.getElementById("bo3Div");
        theOtherBestOf2 = document.getElementById("bo5Div");
        p1Win3.style.display = "block";
        p2Win3.style.display = "block";
        p1Win4.style.display = "block";
        p2Win4.style.display = "block";
    } else {
        currentBestOf = "Bo3";
        theOtherBestOf = document.getElementById("bo5Div");
        theOtherBestOf2 = document.getElementById("bo7Div");
        p1Win3.style.display = "none";
        p2Win3.style.display = "none";
        p1Win4.style.display = "none";
        p2Win4.style.display = "none";
    }

    //change the color and background of the buttons
    this.style.color = "var(--text1)";
    this.style.backgroundImage = "linear-gradient(to top, #575757, #00000000)";
    theOtherBestOf.style.color = "var(--text2)";
    theOtherBestOf.style.backgroundImage = "var(--bg4)";
    theOtherBestOf2.style.color = "var(--text2)";
    theOtherBestOf2.style.backgroundImage = "var(--bg4)";
}


function checkRound() {
    if (!forceWL.checked) {
        const wlButtons = document.getElementsByClassName("wlButtons");

        if (roundInp.value.toLocaleUpperCase().includes("Grand".toLocaleUpperCase())) {
            for (let i = 0; i < wlButtons.length; i++) {
                wlButtons[i].style.display = "inline";
            }
        } else {
            for (let i = 0; i < wlButtons.length; i++) {
                wlButtons[i].style.display = "none";
                deactivateWL();
            }
        }
    }
}


function swap() {
    let tempP1Name = p1NameInp.value;
    let tempP1Team = p1TagInp.value;
    let tempP2Name = p2NameInp.value;
    let tempP2Team = p2TagInp.value;

    p1NameInp.value = tempP2Name;
    p1TagInp.value = tempP2Team;
    p2NameInp.value = tempP1Name;
    p2TagInp.value = tempP1Team;

    changeInputWidth(p1NameInp);
    changeInputWidth(p1TagInp);
    changeInputWidth(p2NameInp);
    changeInputWidth(p2TagInp);


    let tempP1Char = charP1;
    let tempP2Char = charP2;
    let tempP1Skin = skinP1;
    let tempP2Skin = skinP2; 

    changeCharacterManual(tempP2Char, 1);
    changeCharacterManual(tempP1Char, 2);
    charImgChange(charImgP1, charP1, tempP2Skin);
    charImgChange(charImgP2, charP2, tempP1Skin);

    skinP1 = tempP2Skin;
    skinP2 = tempP1Skin;


    tempP1Score = checkScore(p1Win1, p1Win2, p1Win3, p1Win4);
    tempP2Score = checkScore(p2Win1, p2Win2, p2Win3, p2Win4);
    setScore(tempP2Score, p1Win1, p1Win2, p1Win3, p1Win4);
    setScore(tempP1Score, p2Win1, p2Win2, p2Win3, p2Win4);
}

function clearPlayers() {
    //clear player texts
    p1TagInp.value = "";
    p1NameInp.value = "";
    p2TagInp.value = "";
    p2NameInp.value = "";
    changeInputWidth(p1TagInp);
    changeInputWidth(p1NameInp);
    changeInputWidth(p2TagInp);
    changeInputWidth(p2NameInp);

    //reset characters to random
    document.getElementById('p1CharSelector').setAttribute('src', charPath + '/CSS/Random.png');
    charP1 = "Random";
    skinP1 = "";
    charImgChange(charImgP1, charP1);
    document.getElementById('skinListP1').innerHTML = '';
    document.getElementById('skinListP1Sheik').innerHTML = '';
    document.getElementById('skinSelectorP1').style.opacity = 0;

    document.getElementById('p2CharSelector').setAttribute('src', charPath + '/CSS/Random.png');
    charP2 = "Random";
    skinP2 = "";
    charImgChange(charImgP2, charP2);
    document.getElementById('skinListP2').innerHTML = '';
    document.getElementById('skinListP2Sheik').innerHTML = '';
    document.getElementById('skinSelectorP2').style.opacity = 0;

    //clear player scores
    let checks = document.getElementsByClassName("scoreCheck");
    for (let i = 0; i < checks.length; i++) {
        checks[i].checked = false;
    }
}

function setScore(score, tick1, tick2, tick3, tick4) {
    tick1.checked = false;
    tick2.checked = false;
    tick3.checked = false;
    tick4.checked = false;
    if (score > 0) {
        tick1.checked = true;
        if (score > 1) {
            tick2.checked = true;
            if (score > 2) {
                tick3.checked = true;
                if (score > 3) {
                    tick4.checked = true;
                }
            }
        }
    }
}


function forceWLtoggles() {
    const wlButtons = document.getElementsByClassName("wlButtons");

        if (forceWL.checked) {
            for (let i = 0; i < wlButtons.length; i++) {
                wlButtons[i].style.display = "inline";
            }
        } else {
            for (let i = 0; i < wlButtons.length; i++) {
                wlButtons[i].style.display = "none";
                deactivateWL();
            }
        }
}


//time to write it down
function writeScoreboard() {

    let scoreboardJson = {
        p1Name: p1NameInp.value,
        p1Team: p1TagInp.value,
        p1Character: charP1,
        p1Skin: skinP1,
        p1Color: colorP1,
        p1Score: checkScore(p1Win1, p1Win2, p1Win3, p1Win4),
        p1WL: currentP1WL,
        p2Name: p2NameInp.value,
        p2Team: p2TagInp.value,
        p2Character: charP2,
        p2Skin: skinP2,
        p2Color: colorP2,
        p2Score: checkScore(p2Win1, p2Win2, p2Win3, p2Win4),
        p2WL: currentP2WL,
        bestOf: currentBestOf,
        round: roundInp.value,
        tournamentName: document.getElementById('tournamentName').value,
        caster1Name: document.getElementById('cName1').value,
        caster1Twitter: document.getElementById('cTwitter1').value,
        caster1Twitch: document.getElementById('cTwitch1').value,
        caster2Name: document.getElementById('cName2').value,
        caster2Twitter: document.getElementById('cTwitter2').value,
        caster2Twitch: document.getElementById('cTwitch2').value,
        allowIntro: document.getElementById('allowIntro').checked,
    };

    let data = JSON.stringify(scoreboardJson, null, 2);
    fs.writeFileSync(mainPath + "/ScoreboardInfo.json", data);


    //simple .txt files
    fs.writeFileSync(mainPath + "/Simple Texts/Player 1.txt", p1NameInp.value);
    fs.writeFileSync(mainPath + "/Simple Texts/Player 2.txt", p2NameInp.value);

    fs.writeFileSync(mainPath + "/Simple Texts/Round.txt", roundInp.value);
    fs.writeFileSync(mainPath + "/Simple Texts/Tournament Name.txt", document.getElementById('tournamentName').value);

    fs.writeFileSync(mainPath + "/Simple Texts/Caster 1 Name.txt", document.getElementById('cName1').value);
    fs.writeFileSync(mainPath + "/Simple Texts/Caster 1 Twitter.txt", document.getElementById('cTwitter1').value);
    fs.writeFileSync(mainPath + "/Simple Texts/Caster 1 Twitch.txt", document.getElementById('cTwitch1').value);

    fs.writeFileSync(mainPath + "/Simple Texts/Caster 2 Name.txt", document.getElementById('cName2').value);
    fs.writeFileSync(mainPath + "/Simple Texts/Caster 2 Twitter.txt", document.getElementById('cTwitter2').value);
    fs.writeFileSync(mainPath + "/Simple Texts/Caster 2 Twitch.txt", document.getElementById('cTwitch2').value);

}