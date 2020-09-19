
//animation stuff
const pCharMove = 30; //distance to move for the character images

const fadeInTime = .4; //(seconds)
const fadeOutTime = .3;
const introDelay = .5; //all animations will get this delay when the html loads (use this so it times with your transition)

//max text sizes (used when resizing back)
const roundSize = '54px';
const tournamentSize = '36px';
const casterSize = '36px';
const twitterSize = '26px';

//to avoid the code constantly running the same method over and over
let p1CharacterPrev, p1SkinPrev, p1ColorPrev;
let p2CharacterPrev, p2SkinPrev, p2ColorPrev;

//variables for the twitter/twitch constant change
let socialInt1;
let socialInt2;
let twitter1, twitch1, twitter2, twitch2;
let socialSwitch = true; //true = twitter, false = twitch
const socialInterval = 9000;


let startup = true;


window.onload = init;
function init() {
	async function mainLoop() {
		const scInfo = await getInfo();
		getData(scInfo);
	}

	mainLoop();
	setInterval( () => { mainLoop(); }, 500); //update interval
}

	
function getData(scInfo) {
	let p1Name = scInfo['p1Name'];
	let p1Team = scInfo['p1Team'];
	let p1Color = scInfo['p1Color'];
	let p1Character = scInfo['p1Character'];
	let p1Skin = scInfo['p1Skin'];
	
	let p2Name = scInfo['p2Name'];
	let p2Team = scInfo['p2Team'];
	let p2Color = scInfo['p2Color'];
	let p2Character = scInfo['p2Character'];
	let p2Skin = scInfo['p2Skin'];

	let round = scInfo['round'];
	let tournamentName = scInfo['tournamentName'];

	let caster1 = scInfo['caster1Name'];
	twitter1 = scInfo['caster1Twitter'];
	twitch1 = scInfo['caster1Twitch'];
	let caster2 = scInfo['caster2Name'];
	twitter2 = scInfo['caster2Twitter'];
	twitch2 = scInfo['caster2Twitch'];


	//first, things that will happen only the first time the html loads
	if (startup) {
		//starting with the player 1 name
		updatePlayerName('p1Wrapper', 'p1Name', 'p1Team', p1Name, p1Team);
		//fade in the player text
		fadeIn("#p1Wrapper", introDelay+.15);

		//same for player 2
		updatePlayerName('p2Wrapper', 'p2Name', 'p2Team', p2Name, p2Team);
		fadeIn("#p2Wrapper", introDelay+.15);


		//change the player info character text
		document.getElementById('p1CharInfo').textContent = p1Character;
		document.getElementById('p2CharInfo').textContent = p2Character;
		//sheik is complicated
		if (p1Skin.includes("Sheik")) {
			document.getElementById('p1CharInfo').textContent = "Sheik";
		}
		if (p2Skin.includes("Sheik")) {
			document.getElementById('p2CharInfo').textContent = "Sheik";
		}
		//fade it in
		fadeIn("#p1Info", introDelay+.15);
		fadeIn("#p2Info", introDelay+.15);


		//set p1 character
		updateChar(p1Character, p1Skin, p1Color, 'charP1', "Left");
		//move the character
		initCharaFade("#charaP1", -pCharMove);
		//save character info so we change them later if different
		p1CharacterPrev = p1Character;
		p1SkinPrev = p1Skin;

		//same for p2
		updateChar(p2Character, p2Skin, p2Color, 'charP2', "Right");
		initCharaFade("#charaP2", pCharMove);
		p2CharacterPrev = p2Character;
		p2SkinPrev = p2Skin;


		//set the colors
		updateColor('p1Slot', p1Color);
		updateColor('p2Slot', p2Color);
		p1ColorPrev = p1Color;
		p2ColorPrev = p2Color;


		//set the round text
		updateText("round", round, roundSize);

		//set the tournament text
		updateText("tournament", tournamentName, tournamentSize);


		//set the caster info
		updateSocialText("caster1N", caster1, casterSize, "caster1TextBox");
		updateSocialText("caster1Tr", twitter1, twitterSize, "caster1TwitterBox");
		updateSocialText("caster1Th", twitch1, twitterSize, "caster1TwitchBox");
		updateSocialText("caster2N", caster2, casterSize, "caster2TextBox");
		updateSocialText("caster2Tr", twitter2, twitterSize, "caster2TwitterBox");
		updateSocialText("caster2Th", twitch2, twitterSize, "caster2TwitchBox");

		//setup twitter/twitch change
		socialChange1("caster1TwitterBox", "caster1TwitchBox");
		socialChange2("caster2TwitterBox", "caster2TwitchBox");
		//set an interval to keep changing the names
		socialInt1 = setInterval( () => {
			socialChange1("caster1TwitterBox", "caster1TwitchBox");
		}, socialInterval);
		socialInt2 = setInterval(() => {
			socialChange2("caster2TwitterBox", "caster2TwitchBox");
		}, socialInterval);

		//keep changing this boolean for the previous intervals ()
		setInterval(() => {
			if (socialSwitch) { //true = twitter, false = twitch
				socialSwitch = false;
			} else {
				socialSwitch = true;
			}
		}, socialInterval);

		//if a caster has no name, hide its icon
		if (caster1 == "") {
			document.getElementById('caster1TextBox').style.opacity = 0;
		}
		if (caster2 == "") {
			document.getElementById('caster2TextBox').style.opacity = 0;
		}


		startup = false; //next time we run this function, it will skip all we just did
	}

	//now things that will happen constantly
	else {

		//player 1 name change
		if (document.getElementById('p1Name').textContent != p1Name ||
			document.getElementById('p1Team').textContent != p1Team) {
			//fade out player 1 text
			fadeOut("#p1Wrapper", () => {
				//now that nobody is seeing it, change the text content!
				updatePlayerName('p1Wrapper', 'p1Name', 'p1Team', p1Name, p1Team);
				//and fade the name back in
				fadeIn("#p1Wrapper", .2);
			});
		}

		//same for player 2
		if (document.getElementById('p2Name').textContent != p2Name ||
			document.getElementById('p2Team').textContent != p2Team){
			fadeOut("#p2Wrapper", () => {
				updatePlayerName('p2Wrapper', 'p2Name', 'p2Team', p2Name, p2Team);
				fadeIn("#p2Wrapper", .2);
			});
		}


		//player 1 character and skin
		if (p1CharacterPrev != p1Character || p1SkinPrev != p1Skin) {

			//move and fade out the character
			charaFadeOut("#charaP1", -pCharMove, async () => {
				//update the character image
				await updateChar(p1Character, p1Skin, p1Color, 'charP1', "Left");
				//move and fade them back
				charaFadeIn("#charaP1");
			});

			//change the player info text if the character is different or if changing between Zelda and Sheik
			if (p1CharacterPrev != p1Character ||
				(p1CharacterPrev == "Zelda" && p1Skin.includes("Sheik")) ||
				(p1Character == "Zelda" && p1SkinPrev.includes("Sheik"))) {
				fadeOut('#p1Info', () => {
					document.getElementById('p1CharInfo').textContent = p1Character;
					//sheik is complicated
					if (p1Skin.includes("Sheik")) {
						document.getElementById('p1CharInfo').textContent = "Sheik";
					}
					fadeIn('#p1Info');
				});
			}
			
			p1CharacterPrev = p1Character;
			p1SkinPrev = p1Skin;
		}

		//same for player 2
		if (p2CharacterPrev != p2Character || p2SkinPrev != p2Skin) {
			charaFadeOut("#charaP2", pCharMove, async () => {
				await updateChar(p2Character, p2Skin, p2Color, 'charP2', "Right");
				charaFadeIn("#charaP2");
			});

			if (p2CharacterPrev != p2Character ||
				(p2CharacterPrev == "Zelda" && p2Skin.includes("Sheik")) ||
				(p2Character == "Zelda" && p2SkinPrev.includes("Sheik"))) {
				fadeOut('#p2Info', () => {
					document.getElementById('p2CharInfo').textContent = p2Character;
					if (p2Skin.includes("Sheik")) {
						document.getElementById('p2CharInfo').textContent = "Sheik";
					}
					fadeIn('#p2Info');
				});
			}
		
			p2CharacterPrev = p2Character;
			p2SkinPrev = p2Skin;
		}


		//color change
		if (p1ColorPrev != p1Color) {
			fadeOut('#p1Slot', () => {
				updateColor('p1Slot', p1Color);
				fadeIn('#p1Slot');
			});
			p1ColorPrev = p1Color;
		}

		if (p2ColorPrev != p2Color) {
			fadeOut('#p2Slot', () => {
				updateColor('p2Slot', p2Color);
				fadeIn('#p2Slot');
			});
			p2ColorPrev = p2Color;
		}


		//update round text
		if (document.getElementById('round').textContent != round){
			fadeOut("#round", () => {
				updateText("round", round, roundSize);
				fadeIn("#round", .2);
			});
		}

		//update tournament text
		if (document.getElementById('tournament').textContent != tournamentName){
			fadeOut("#tournament", () => {
				updateText("tournament", tournamentName, tournamentSize);
				fadeIn("#tournament", .2);
			});
		}


		//update caster 1 info
		if (document.getElementById('caster1N').textContent != caster1){
			fadeOut("#caster1TextBox", () => {
				updateSocialText("caster1N", caster1, casterSize, 'caster1TextBox');
				//if no caster name, dont fade in the caster icon
				if (caster1 != "") {
					fadeIn("#caster1TextBox", .2);
				}
			});
		}
		//caster 1's twitter
		if (document.getElementById('caster1Tr').textContent != twitter1){
			updateSocial(twitter1, "caster1Tr", "caster1TwitterBox", twitch1, "caster1TwitchBox");
		}
		//caster 2's twitch (same as above)
		if (document.getElementById('caster1Th').textContent != twitch1){
			updateSocial(twitch1, "caster1Th", "caster1TwitchBox", twitter1, "caster1TwitterBox");
		}

		//caster 2, same as above
		if (document.getElementById('caster2N').textContent != caster2){
			fadeOut("#caster2TextBox", () => {
				updateSocialText("caster2N", caster2, casterSize, 'caster2TextBox');
				if (caster2 != "") {
					fadeIn("#caster2TextBox", .2);
				}
			});
		}
		if (document.getElementById('caster2Tr').textContent != twitter2){
			updateSocial(twitter2, "caster2Tr", "caster2TwitterBox", twitch2, "caster2TwitchBox");
		}

		if (document.getElementById('caster2Th').textContent != twitch2){
			updateSocial(twitch2, "caster2Th", "caster2TwitchBox", twitter2, "caster2TwitterBox");
		}
	}
}


//did an image fail to load? this will be used to show nothing
function showNothing(itemEL) {
	itemEL.setAttribute('src', 'Resources/Literally Nothing.png');
}

//color change
function updateColor(pSlotID, color) {
	const pSlotEL = document.getElementById(pSlotID);
	pSlotEL.style.color = getHexColor(color);

	switch (color) {
		case "Red":
			pSlotEL.textContent = "P1"; break;
		case "Blue":
			pSlotEL.textContent = "P2"; break;
		case "Yellow":
			pSlotEL.textContent = "P3"; break;
		case "Green":
			pSlotEL.textContent = "P4"; break;
		case "CPU":
			pSlotEL.textContent = "CPU"; break;
		default:
			pSlotEL.textContent = "??";
	}
}
//color codes here!
function getHexColor(color) {
	switch (color) {
		case "Red":
			return "#e54c4c";
		case "Blue":
			return "#4b4ce5";
		case "Yellow":
			return "#ffcb00";
		case "Green":
			return "#00b200";
		case "CPU":
			return "#808080";
		default:
			return "#808080";
	}
}

//the logic behind the twitter/twitch constant change
function socialChange1(twitterWrapperID, twitchWrapperID) {

	const twitterWrapperEL = document.getElementById(twitterWrapperID);
	const twitchWrapperEL = document.getElementById(twitchWrapperID);

	if (startup) {

		//if first time, set initial opacities so we can read them later
		if (!twitter1 && !twitch1) { //if all blank
			twitterWrapperEL.style.opacity = 0;
			twitchWrapperEL.style.opacity = 0;
		} else if (!twitter1 && !!twitch1) { //if twitter blank
			twitterWrapperEL.style.opacity = 0;
			twitchWrapperEL.style.opacity = 1;
		} else {
			twitterWrapperEL.style.opacity = 1;
			twitchWrapperEL.style.opacity = 0;
		}
		

	} else if (!!twitter1 && !!twitch1) {

		if (socialSwitch) {
			fadeOut(twitterWrapperEL, () => {
				fadeIn(twitchWrapperEL, 0);
			});
		} else {
			fadeOut(twitchWrapperEL, () => {
				fadeIn(twitterWrapperEL, 0);
			});
		}

	}
}
//i didnt know how to make it a single function im sorry ;_;
function socialChange2(twitterWrapperID, twitchWrapperID) {

	const twitterWrapperEL = document.getElementById(twitterWrapperID);
	const twitchWrapperEL = document.getElementById(twitchWrapperID);

	if (startup) {

		if (!twitter2 && !twitch2) {
			twitterWrapperEL.style.opacity = 0;
			twitchWrapperEL.style.opacity = 0;
		} else if (!twitter2 && !!twitch2) {
			twitterWrapperEL.style.opacity = 0;
			twitchWrapperEL.style.opacity = 1;
		} else {
			twitterWrapperEL.style.opacity = 1;
			twitchWrapperEL.style.opacity = 0;
		}

	} else if (!!twitter2 && !!twitch2) {

		if (socialSwitch) {
			fadeOut(twitterWrapperEL, () => {
				fadeIn(twitchWrapperEL, 0);
			});
		} else {
			fadeOut(twitchWrapperEL, () => {
				fadeIn(twitterWrapperEL, 0);
			});
		}

	}
}
//function to decide when to change to what
function updateSocial(mainSocial, mainText, mainBox, otherSocial, otherBox) {
	//check if this is for twitch or twitter
	let localSwitch = socialSwitch;
	if (mainText == "caster1Th" || mainText == "caster2Th") {
		localSwitch = !localSwitch;
	}
	//check if this is their turn so we fade out the other one
	if (localSwitch) {
		fadeOut("#"+otherBox, () => {})
	}

	//now do the classics
	fadeOut("#"+mainBox, () => {
		updateSocialText(mainText, mainSocial, twitterSize, mainBox);
		//check if its twitter's turn to show up
		if (otherSocial == "" && mainSocial != "") {
			fadeIn("#"+mainBox, .2);
		} else if (localSwitch && mainSocial != "") {
			fadeIn("#"+mainBox, .2);
		} else if (otherSocial != "") {
			fadeIn("#"+otherBox, .2);
		}
	});
}

//player text change
function updatePlayerName(wrapperID, nameID, teamID, pName, pTeam) {
	const nameEL = document.getElementById(nameID);
	nameEL.style.fontSize = '80px'; //set original text size
	nameEL.textContent = pName; //change the actual text
	const teamEL = document.getElementById(teamID);
	teamEL.style.fontSize = '40px';
	teamEL.textContent = pTeam;

	resizeText(document.getElementById(wrapperID)); //resize if it overflows
}

//generic text changer
function updateText(textID, textToType, maxSize) {
	const textEL = document.getElementById(textID);
	textEL.style.fontSize = maxSize; //set original text size
	textEL.textContent = textToType; //change the actual text
	resizeText(textEL); //resize it if it overflows
}
//social text changer
function updateSocialText(textID, textToType, maxSize, wrapper) {
	const textEL = document.getElementById(textID);
	textEL.style.fontSize = maxSize; //set original text size
	textEL.textContent = textToType; //change the actual text
	const wrapperEL = document.getElementById(wrapper)
	resizeText(wrapperEL); //resize it if it overflows
}

//text resize, keeps making the text smaller until it fits
function resizeText(textEL) {
	const childrens = textEL.children;
	while (textEL.scrollWidth > textEL.offsetWidth || textEL.scrollHeight > textEL.offsetHeight) {
		if (childrens.length > 0) { //for team+player texts
			Array.from(childrens).forEach(function (child) {
				child.style.fontSize = getFontSize(child);
			});
		} else {
			textEL.style.fontSize = getFontSize(textEL);
		}
	}
}

//returns a smaller fontSize for the given element
function getFontSize(textElement) {
	return (parseFloat(textElement.style.fontSize.slice(0, -2)) * .90) + 'px';
}

//fade out
function fadeOut(itemID, funct = console.log("Hola!"), dur = fadeOutTime) {
	gsap.to(itemID, {opacity: 0, duration: dur, onComplete: funct});
}

//fade in
function fadeIn(itemID, timeDelay, dur = fadeInTime) {
	gsap.to(itemID, {delay: timeDelay, opacity: 1, duration: dur});
}

//fade out for the characters
function charaFadeOut(itemID, charMove, funct) {
	gsap.to(itemID, {delay: .2, x: charMove, opacity: 0, ease: "power1.in", duration: fadeOutTime, onComplete: funct});
}

//fade in characters edition
function charaFadeIn(charaID) {
	gsap.to(charaID, {delay: .3, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime+.1});
}

//initial characters fade in
function initCharaFade(charaID, charMove) {
	gsap.fromTo(charaID,
		{x: charMove, opacity: 0},
		{delay: introDelay, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	}

//searches for the main json file
function getInfo() {
	return new Promise(function (resolve) {
		const oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqListener);
		oReq.open("GET", 'Resources/Texts/ScoreboardInfo.json');
		oReq.send();

		//will trigger when file loads
		function reqListener () {
			resolve(JSON.parse(oReq.responseText))
		}
	})
	//i would gladly have used fetch, but OBS local files wont support that :(
}

//searches for a json file with character data
function getCharInfo(pCharacter) {
	return new Promise(function (resolve) {
		const oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqListener);
		oReq.onerror = () => {resolve("notFound")}; //for obs local file browser sources
		oReq.open("GET", 'Resources/Texts/Character Info/' + pCharacter + '.json');
		oReq.send();

		function reqListener () {
			try {resolve(JSON.parse(oReq.responseText))}
			catch {resolve("notFound")} //for live servers
		}
	})
}

//character update!
async function updateChar(pCharacter, pSkin, color, charID, direction) {

	//store so code looks cleaner later
	const charEL = document.getElementById(charID);

	//this will trigger whenever the image loaded cant be found
	if (startup) {
		//if the image fails to load, we will put a placeholder
		charEL.addEventListener("error", () => {
			if (direction == "Left") {
				charEL.setAttribute('src', 'Resources/Characters/Portraits/Random ' + color + '.png');
			} else {
				charEL.setAttribute('src', 'Resources/Characters/Portraits/Random ' + color + '.png');
			}
		})
	}

	//change the image path depending on the character, skin and direction
	charEL.setAttribute('src', 'Resources/Characters/VS Screen/' + pCharacter + '/' + pSkin + ' ' + direction + '.png');

	//get the character positions
	const charInfo = await getCharInfo(pCharacter);
	//             x, y, scale
	let charPos = [0, 0, 1];
	//now, check if the character or skin exists in the json file we checked earler
	if (charInfo != "notFound") {
		if (direction == "Left") { //player 1 positions
			if (pSkin.includes("Sheik")) {
				charPos[0] = charInfo.Left.xSheik;
				charPos[1] = charInfo.Left.ySheik;
				charPos[2] = charInfo.Left.scaleSheik;
			} else {
				charPos[0] = charInfo.Left.x;
				charPos[1] = charInfo.Left.y;
				charPos[2] = charInfo.Left.scale;
			}
		} else { //player 2 positions
			if (pSkin.includes("Sheik")) {
				charPos[0] = charInfo.Right.xSheik;
				charPos[1] = charInfo.Right.ySheik;
				charPos[2] = charInfo.Right.scaleSheik;
			} else {
				charPos[0] = charInfo.Right.x;
				charPos[1] = charInfo.Right.y;
				charPos[2] = charInfo.Right.scale;
			}
		}
	} else { //if the character isnt on the database, set positions for the "?" image
		//this condition is used just to position images well on both sides
		if (charEL == document.getElementById("charP1")) {
			charPos[0] = 400;
		} else {
			charPos[0] = 1400;
		}
		charPos[1] = 425;
		charPos[2] = 4;
	}

	//to position the character
	charEL.style.left = charPos[0] + "px";
	charEL.style.top = charPos[1] + "px";
	charEL.style.transform = "scale(" + charPos[2] + ")";
}
