//animation stuff
const pMove = 20; //distance to move for most of the animations
const sMove = 40; //distance for the score assets

const fadeInTime = .3; //(seconds)
const fadeOutTime = .2;
let introDelay = .8; //all animations will get this delay when the html loads (use this so it times with your transition)

//to avoid the code constantly running the same method over and over
let p1CharacterPrev, p1SkinPrev, p1ScorePrev, p1ColorPrev, p1wlPrev;
let p2CharacterPrev, p2SkinPrev, p2ScorePrev, p2ColorPrev, p2wlPrev;
let bestOfPrev;

//max text sizes (used when resizing back)
const roundSize = '32px';
const casterSize = '24px';
const twitterSize = '20px';

//variables for the twitter/twitch constant change
let socialInt1;
let socialInt2;
let twitter1, twitch1, twitter2, twitch2;
let socialSwitch = true; //true = twitter, false = twitch
const socialInterval = 12000;


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

async function getData(scInfo) {
	let p1Name = scInfo['p1Name'];
	let p1Team = scInfo['p1Team'];
	let p1Score = scInfo['p1Score'];
	let p1Color = scInfo['p1Color'];
	let p1Character = scInfo['p1Character'];
	let p1Skin = scInfo['p1Skin'];
	let p1WL = scInfo['p1WL'];
	
	let p2Name = scInfo['p2Name'];
	let p2Team = scInfo['p2Team'];
	let p2Score = scInfo['p2Score'];
	let p2Color = scInfo['p2Color'];
	let p2Character = scInfo['p2Character'];
	let p2Skin = scInfo['p2Skin'];
	let p2WL = scInfo['p2WL'];

	let round = scInfo['round'];
	let bestOf = scInfo['bestOf'];

	let caster1 = scInfo['caster1Name'];
	twitter1 = scInfo['caster1Twitter'];
	twitch1 = scInfo['caster1Twitch'];
	let caster2 = scInfo['caster2Name'];
	twitter2 = scInfo['caster2Twitter'];
	twitch2 = scInfo['caster2Twitch'];;


	//first, things that will happen only the first time the html loads
	if (startup) {
		//of course, we have to start with the cool intro stuff
		const allowIntro = scInfo['allowIntro']; //to know if the intro is allowed
		if (allowIntro) {

			//this variable is only used in the intro
			const tournamentName = scInfo['tournamentName'];

			//lets see that intro
			document.getElementById('overlayIntro').style.opacity = 1;

			//this vid is just the bars moving (todo: maybe do it through javascript?)
			setTimeout(() => { 
				document.getElementById('introVid').setAttribute('src', 'Resources/Webms/Intro.webm');
				document.getElementById('introVid').play();
			}, 0); //if you need it to start later, change that 0 (and also update the introDelay)

			if (p1Score + p2Score == 0) { //if this is the first game, introduce players

				const p1IntroEL = document.getElementById('p1Intro');
				const p2IntroEL = document.getElementById('p2Intro');

				p1IntroEL.textContent = p1Name; //update player 1 intro text
				p1IntroEL.style.fontSize = '85px'; //resize the font to its max size
				resizeText(p1IntroEL); //resize the text if its too large
				p2IntroEL.style.fontSize = '85px';
				p2IntroEL.textContent = p2Name; //p2
				resizeText(p2IntroEL);

				//change the color of the player text shadows
				p1IntroEL.style.textShadow = '0px 0px 20px ' + getHexColor(p1Color);
				p2IntroEL.style.textShadow = '0px 0px 20px ' + getHexColor(p2Color);

				//player 1 name fade in
				gsap.fromTo("#p1Intro",
					{x: -pMove}, //from
					{delay: introDelay, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime}); //to

				//same for player 2
				gsap.fromTo("#p2Intro",
					{x: pMove},
					{delay: introDelay, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});

			} else { //if its not the first game, show game count
				const midTextEL = document.getElementById('midTextIntro');
				if ((p1Score + p2Score) != 4) { //if its not the last game of a bo5

					//just show the game count in the intro
					midTextEL.textContent = "Game " + (p1Score + p2Score + 1);

				} else { //if game 5

					if ((round.toUpperCase() == "True Finals".toUpperCase())) { //if true finals
						midTextEL.textContent = "True Final Game"; //i mean shit gets serious here
					} else {
						midTextEL.textContent = "Final Game";
						//if GF, we dont know if its the last game or not, right?
						if (round.toLocaleUpperCase() == "Grand Finals".toLocaleUpperCase() && !(p1WL == "L" && p2WL == "L")) {
							gsap.to("#superCoolInterrogation", {delay: introDelay+.5, opacity: 1, ease: "power2.out", duration: 1.5});
						}

					}
				}
			}

			document.getElementById('roundIntro').textContent = round;
			document.getElementById('tNameIntro').textContent = tournamentName;
			
			//round, tournament and VS/GameX text fade in
			gsap.to(".textIntro", {delay: introDelay-.2, opacity: 1, ease: "power2.out", duration: fadeInTime});

			//aaaaand fade out everything
			gsap.to("#overlayIntro", {delay: introDelay+1.6, opacity: 0, ease: "power2.out", duration: fadeInTime+.2});

			//lets delay everything that comes after this so it shows after the intro
			introDelay = 2.6;
		}

		//finally out of the intro, now lets start with player 1 first
		//update player name and team name texts
		updatePlayerName('p1Wrapper', 'p1Name', 'p1Team', p1Name, p1Team);
		//sets the starting position for the player text, then fades in and moves the p1 text to the next keyframe
		gsap.fromTo("#p1Wrapper", 
			{x: -pMove}, //from
			{delay: introDelay+.1, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime}); //to

		//set the character image and saga icon for the player
		await updateChar(p1Character, p1Skin, 'p1Character', 'sagaIconP1');
		//when the image finishes loading, fade-in-move the images to the overlay
		initCharaFade("#p1Character", "#sagaIconP1", -pMove);
		//save the character/skin so we run the character change code only when this doesnt equal to the next
		p1CharacterPrev = p1Character;
		p1SkinPrev = p1Skin;

		//if its grands, we need to show the [W] and/or the [L] on the players
		updateWL(p1WL, "1");
		//save for later so the animation doesn't repeat over and over
		p1wlPrev = p1WL;

		//set the current score
		updateScore(1, p1Score, p1Color);
		//play a sick animation for the score ticks
		moveScoresIntro(1, bestOf, p1WL, sMove);
		//yeah same thing here
		p1ScorePrev = p1Score;

		//set the color
		updateColor('p1Color', 'p1Name', p1Color);
		p1ColorPrev = p1Color;


		//took notes from player 1? well, this is exactly the same!
		updatePlayerName('p2Wrapper', 'p2Name', 'p2Team', p2Name, p2Team);
		gsap.fromTo("#p2Wrapper", 
			{x: pMove},
			{delay: introDelay+.1, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});

		await updateChar(p2Character, p2Skin, 'p2Character', 'sagaIconP2');
		initCharaFade("#p2Character", "#sagaIconP2");
		p2CharacterPrev = p2Character;
		p2SkinPrev = p2Skin;

		updateWL(p2WL, "2");
		p2wlPrev = p2WL;

		updateScore(2, p2Score, p2Color);
		moveScoresIntro(2, bestOf, p2WL, -sMove);
		p2ScorePrev = p2Score;

		updateColor('p2Color', 'p2Name', p2Color);
		p2ColorPrev = p2Color;


		//set this for later
		bestOfPrev = bestOf;


		//update the round text
		updateRound(round);
		//update the best of text
		if (bestOf == "Bo5") {
			document.getElementById('bestOf').textContent = "Best of 5";
		} else {
			document.getElementById('bestOf').textContent = "Best of 3";
		}
		//fade them in (but only if round text is not empty)
		if (round != "") {
			gsap.to("#overlayRound", {delay: introDelay, opacity: 1, ease: "power2.out", duration: fadeInTime+.2});
		}

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

		//keep changing this boolean for the previous intervals
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


		//check if the team has a logo we can place on the overlay
		updateTeamLogo("teamLogoP1", p1Team);
		updateTeamLogo("teamLogoP2", p2Team);
		//animate them
		fadeIn("#teamLogoP1");
		fadeIn("#teamLogoP2");


		startup = false; //next time we run this function, it will skip all we just did
	}

	//now things that will happen constantly
	else {
		
		//player 1 time!
		if (document.getElementById('p1Name').textContent != p1Name ||
			document.getElementById('p1Team').textContent != p1Team) {
			//move and fade out the player 1's text
			fadeOutMove("#p1Wrapper", -pMove, () => {
				//now that nobody is seeing it, quick, change the text's content!
				updatePlayerName('p1Wrapper', 'p1Name', 'p1Team', p1Name, p1Team);
				//fade the name back in with a sick movement
				fadeInMove("#p1Wrapper");
			});
		}

		//player 1's character portrait change
		if (p1CharacterPrev != p1Character || p1SkinPrev != p1Skin) {
			//fade out the images while also moving them because that always looks cool
			fadeOutChara("#p1Character", "#sagaIconP1", -pMove, async () => {
				//now that nobody can see them, lets change the images!
				updateChar(p1Character, p1Skin, 'p1Character', 'sagaIconP1'); //will return scale
				//and now, fade them in
				fadeInChara("#p1Character", '#sagaIconP1');
			});
			p1CharacterPrev = p1Character;
			p1SkinPrev = p1Skin;
		}

		//the [W] and [L] status for grand finals
		if (p1wlPrev != p1WL) {
			//move it away!
			gsap.to("#wlP1", {x: -pMove, opacity: 0, ease: "power1.in", duration: fadeOutTime, onComplete: pwlMoved});
			function pwlMoved() {
				//change the thing!
				updateWL(p1WL, 1);
				//move it back!
				if (p1WL != "Nada") {
					gsap.to("#wlP1", {delay: .3, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
				} else {
					gsap.to("#wlP1", {x: 0, duration: fadeInTime});
				}
			}
			p1wlPrev = p1WL;
		}


		//score check
		if (p1ScorePrev != p1Score) {
			updateScore(1, p1Score, p1Color);
			p1ScorePrev = p1Score;
		}

		//change the player's colors
		if (p1ColorPrev != p1Color) {
			updateColor('p1Color', 'p1Name', p1Color);
			updateScore(1, p1Score, p1Color);
			p1ColorPrev = p1Color;
		}

		//check if the team has a logo we can place on the overlay
		if (document.getElementById('p1Team').textContent != p1Team) {
			fadeOut("#teamLogoP1", () => {
				updateTeamLogo("teamLogoP1", p1Team);
				fadeIn("#teamLogoP1");
			});
		}


		//did you pay attention earlier? Well, this is the same as player 1!
		if (document.getElementById('p2Name').textContent != p2Name ||
			document.getElementById('p2Team').textContent != p2Team){
			fadeOutMove("#p2Wrapper", pMove, () => {
				updatePlayerName('p2Wrapper', 'p2Name', 'p2Team', p2Name, p2Team);
				fadeInMove("#p2Wrapper");
			});
		}

		if (p2CharacterPrev != p2Character || p2SkinPrev != p2Skin) {
			fadeOutChara("#p2Character", "#sagaIconP2", -pMove, async () => {
				updateChar(p2Character, p2Skin, 'p2Character', 'sagaIconP2');
				fadeInChara("#p2Character", "#sagaIconP2", -pMove);
			});
			p2CharacterPrev = p2Character;
			p2SkinPrev = p2Skin;
		}

		if (p2wlPrev != p2WL) {
			gsap.to("#wlP2", {x: pMove, opacity: 0, ease: "power1.in", duration: fadeOutTime, onComplete: pwlMoved});
			function pwlMoved() {
				updateWL(p2WL, 2);
				if (p2WL != "Nada") {
					gsap.to("#wlP2", {delay: .3, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
				} else {
					gsap.to("#wlP2", {x: 0, duration: fadeInTime});
				}
			}
			p2wlPrev = p2WL;
		}

		if (p2ScorePrev != p2Score) {
			updateScore(2, p2Score, p2Color);
			p2ScorePrev = p2Score;
		}

		if (p2ColorPrev != p2Color) {
			updateColor('p2Color', 'p2Name', p2Color);
			updateScore(2, p2Score, p2Color);
			p2ColorPrev = p2Color;
		}

		if (document.getElementById('p2Team').textContent != p2Team) {
			fadeOut("#teamLogoP2", () => {
				updateTeamLogo("teamLogoP2", p2Team);
				fadeIn("#teamLogoP2");
			});
		}


		//hide or show score ticks depending of the Best Of status
		if (bestOfPrev != bestOf) {
			if (bestOf == "Bo5") {
				gsap.fromTo('#win3P1',
					{x: -pMove},
					{x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
				gsap.fromTo('#win3P2',
					{x: pMove},
					{x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
				gsap.to('#win4P1',
					{x: -pMove, opacity: 0, ease: "power2.out", duration: fadeInTime});
				gsap.to('#win4P2',
					{x: pMove, opacity: 0, ease: "power2.out", duration: fadeInTime});
				
				fadeOut("#bestOf", () => {
					document.getElementById('bestOf').textContent = "Best of 5";
					fadeIn("#bestOf");
				});
			} else if (bestOf == "Bo7") {
				gsap.fromTo('#win3P1',
					{x: -pMove},
					{x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
				gsap.fromTo('#win4P1',
					{x: -pMove},
					{x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});

				gsap.fromTo('#win3P2',
					{x: -pMove},
					{x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
				gsap.fromTo('#win4P2',
					{x: -pMove},
					{x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
				fadeOut("#bestOf", () => {
					document.getElementById('bestOf').textContent = "Best of 7";
					fadeIn("#bestOf");
				});
			}
			else {
				gsap.to('#win3P1',
					{x: -pMove, opacity: 0, ease: "power2.in", duration: fadeInTime});
				gsap.to('#win3P2',
					{x: pMove, opacity: 0, ease: "power2.in", duration: fadeInTime});
				gsap.to('#win4P1',
					{x: -pMove, opacity: 0, ease: "power2.out", duration: fadeInTime});
				gsap.to('#win4P2',
					{x: pMove, opacity: 0, ease: "power2.out", duration: fadeInTime});

				fadeOut("#bestOf", () => {
					document.getElementById('bestOf').textContent = "Best of 3";
					fadeIn("#bestOf");
				});
			}
			bestOfPrev = bestOf;
		}

		
		//update the round text
		if (document.getElementById('round').textContent != round){
			fadeOut("#overlayRound", () => {
				updateRound(round);
				if (round != "") {
					fadeIn("#overlayRound");
				}
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


//score change, pretty simple
function updateScore(pNum, pScore, pColor) {
	const score1EL = document.getElementById('win1P'+pNum);
	const score2EL = document.getElementById('win2P'+pNum);
	const score3EL = document.getElementById('win3P'+pNum);
	const score4EL = document.getElementById('win4P'+pNum);


	if (pScore >= 1) {
		scoreChange(score1EL, getHexColor(pColor));
	} else if (score1EL.style.fill != "rgb(65, 65, 65)") {
		scoreChange(score1EL, "#414141");
	}
	if (pScore >= 2) {
		scoreChange(score2EL, getHexColor(pColor));
	} else if (score2EL.style.fill != "rgb(65, 65, 65)") {
		scoreChange(score2EL, "#414141");
	}
	if (pScore >= 3) {
		scoreChange(score3EL, getHexColor(pColor));
	} else if (score3EL.style.fill != "rgb(65, 65, 65)") {
		scoreChange(score3EL, "#414141");
	}
	if (pScore == 4) {
		scoreChange(score4EL, getHexColor(pColor));
	} else if (score4EL.style.fill != "rgb(65, 65, 65)") {
		scoreChange(score4EL, "#414141");
	}
}
function scoreChange(scoreEL, color) {
	gsap.to(scoreEL, {fill: "#ffffff", duration: fadeInTime})
	gsap.to(scoreEL, {delay: fadeInTime, fill: color, duration: fadeInTime})
}

//updates the player's text and portrait background colors
function updateColor(colorID, textID, pColor) {
	const colorEL = document.getElementById(colorID);
	const textEL = document.getElementById(textID);

	gsap.to(colorEL, {backgroundColor: getHexColor(pColor), duration: fadeInTime});
	gsap.to(textEL, {color: getHexColor(pColor), duration: fadeInTime});
}

//team logo change
function updateTeamLogo(logoID, pTeam) {
	//search for an image with the team name
	const logoEL = document.getElementById(logoID);
	logoEL.setAttribute('src', 'Resources/TeamLogos/' + pTeam + '.png');
	//no image? show nothing
	if (startup) {logoEL.addEventListener("error", () => {showNothing(logoEL)})}
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
	nameEL.style.fontSize = '30px'; //set original text size
	nameEL.textContent = pName; //change the actual text
	const teamEL = document.getElementById(teamID);
	teamEL.style.fontSize = '20px';
	teamEL.textContent = pTeam;
	resizeText(document.getElementById(wrapperID)); //resize if it overflows
}

//round change
function updateRound(round) {
	const roundEL = document.getElementById('round');
	roundEL.style.fontSize = roundSize; //set original text size
	roundEL.textContent = round; //change the actual text
	resizeText(roundEL); //resize it if it overflows
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


//fade out
function fadeOut(itemID, funct) {
	gsap.to(itemID, {opacity: 0, duration: fadeOutTime, onComplete: funct});
}

//fade out but with movement
function fadeOutMove(itemID, move, funct) {
	gsap.to(itemID, {x: -move, opacity: 0, ease: "power1.in", duration: fadeOutTime, onComplete: funct});
}

//fade out but for character/saga icon
function fadeOutChara (itemID, sagaID, move, funct) {
	gsap.to(itemID, {x: -move, opacity: 0, ease: "power1.in", duration: fadeOutTime, onComplete: funct});
	gsap.to(sagaID, {opacity: 0, ease: "power1.in", duration: fadeOutTime});
}

//fade in
function fadeIn(itemID) {
	gsap.to(itemID, {delay: .2, opacity: 1, duration: fadeInTime});
}

//fade in but with movement
function fadeInMove(itemID) {
	gsap.to(itemID, {delay: .3, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
}

//fade in but for the character/saga icon
function fadeInChara(itemID, sagaID, move = pMove) {
	gsap.to(itemID, {delay: .2, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	gsap.fromTo(sagaID,
		{x: -move},
		{delay: .3, x: 0, opacity: .3, ease: "power1.in", duration: fadeOutTime});
}

//fade in for the characters when first loading
function initCharaFade(charaID, sagaID, move = pMove) {
	gsap.fromTo(charaID,
		{x: pMove},
		{delay: introDelay, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	gsap.fromTo(sagaID,
		{x: move},
		{delay: introDelay+.2, x: 0, opacity: .3, ease: "power2.out", duration: fadeInTime});
}

//played when loading the html
function moveScoresIntro(pNum, bestOf, pWL, move) {
	const score1EL = document.getElementById('win1P'+pNum);
	const score2EL = document.getElementById('win2P'+pNum);
	const score3EL = document.getElementById('win3P'+pNum);
	const score4EL = document.getElementById('win4P'+pNum);
	const wlEL = document.getElementById('wlP'+pNum);

	gsap.fromTo(score1EL, 
		{x:-move},
		{delay: introDelay+.2, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	gsap.fromTo(score2EL, 
		{x:-move},
		{delay: introDelay+.4, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	if (bestOf == "Bo5") {
		gsap.fromTo(score3EL, 
			{x:-move},
			{delay: introDelay+.6, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	}
	if (bestOf == "Bo7") {
		gsap.fromTo(score3EL, 
			{x:-move},
			{delay: introDelay+.6, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
		gsap.fromTo(score4EL, 
			{x:-move},
			{delay: introDelay+.6, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	}
	if (pWL == "W" || pWL == "L") {
		gsap.fromTo(wlEL, 
			{x:-move},
			{delay: introDelay+.8, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	}

}


//check if winning or losing in a GF, then change image
function updateWL(pWL, playerNum) {
	const pWLEL = document.getElementById('wlP' + playerNum + 'Text');
	if (pWL == "W") {
		pWLEL.setAttribute('src', 'Resources/Overlay/[W].png')
	} else if (pWL == "L") {
		pWLEL.setAttribute('src', 'Resources/Overlay/[L].png')
	}
	if (startup) {pWLEL.addEventListener("error", () => {
		showNothing(pWLEL)
	})}
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

//character portrait and saga icon change
async function updateChar(pCharacter, pSkin, charID, sagaID) {
	const charEL = document.getElementById(charID);
	//change the image path depending on the character and skin
	charEL.setAttribute('src', 'Resources/Characters/Portraits/' + pCharacter + '/' + pSkin + '.png');
	//add a listener to show the random portrait if the image fails to load
	if (startup) {charEL.addEventListener("error", () => {
		if (charEL == document.getElementById("p1Character")) {
			charEL.setAttribute('src', 'Resources/Characters/Portraits/Random CPU.png');
		} else {
			charEL.setAttribute('src', 'Resources/Characters/Portraits/Random CPU 2.png');
		}
	})}

	//update the saga icon depending on the character
	const sagaEL = document.getElementById(sagaID);
	const charInfo = await getCharInfo(pCharacter);
	sagaEL.setAttribute('src', 'Resources/Characters/Saga Icons/' + charInfo.saga + '.png')
	//add a listener to show nothing if the image fails to load
	if (startup) {sagaEL.addEventListener("error", () => {showNothing(sagaEL)})}
}