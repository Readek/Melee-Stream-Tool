![preview](https://cdn.discordapp.com/attachments/574303886869790730/752865123009298532/unknown.png)

# Melee-Stream-Tool
*Also available for [Rivals of Aether](https://github.com/Readek/RoA-Stream-Tool) and [Rushdown Revolt](https://github.com/Readek/Rushdown-Revolt-Stream-Tool)!*

So you're interested in doing SSBMelee streams, huh? Luckily for you, with this tool you'll be able to update all the variables you need for the provided overlays with the provided GUI, and easily customize the overlays to make them your own!

---

## Features
- [Handy interface](https://gfycat.com/linearglaringkitten) to quickly change everything you need, like player names, characters, scores, round, casters...
- [Easy and fast setup](https://gfycat.com/mediumtotalhalicore) using a browser source. Drag and drop!
- A [game overlay](https://gfycat.com/favorableidioticbeaver) is included, with renders for all characters and skins!
- A [VS Screen](https://gfycat.com/jitterymediumchimneyswift) is also included, to be used in pauses between games.
- Easy to customize! Made in html/javascript, every file can be edited at will!
- This is **not** a [Stream Control](http://farpnut.net/StreamControl) clone. It doesn't have anything to do with it, everything is custom made.

---

## Setup Guide
These are instructions for regular OBS Studio, but I imagine you can do the same with other streaming software:
- Get the [latest release](https://github.com/Readek/Melee-Stream-Tool/releases).
- Extract somewhere.
- Drag and drop `Game Scoreboard.htlm` into OBS, or add a new browser source in OBS pointing at the local file.
- If the source looks weird, manually set the source's properties to 1920 width and 1080 height, or set your OBS canvas resolution to 1080p, or make the source fit the screen.
- In the source's properties, change *Use custom frame rate* -> `60` (if streaming at 60fps of course).
- **Also tick** `Refresh browser when scene becomes active`.
- Manage it all with the `Melee ST` executable.

Repeat from the 3rd step to add the `VS Screen.html`, though I recommend you to do so on another scene.

### Interface shortcuts!
- Press `Enter` to update.
- Press either `F1` or `F2` to increase P1's or P2's score.
- Press `ESC` to clear player info.

2 basic transitions are included in the `Resources/OBS Transitions` folder, if you don't have a transition yourself of course. To use them on OBS:
- Add a new stinger transition.
- Set the video file to `Game In.webm` or `Swoosh.webm`.
- Transition point -> `350 ms`.
- I recommend you to set the Audio Fade Style to crossfade, just in case.
- On the scene's right click menu, set it to Transition Override to the transition you just created.

The interface will also update basic text files with the match info at `Resources/Texts/Simple Texts/` so you can add them to OBS with ease.

If you drop an image in `Resources/Team Logos/` and write the name of the image to the tag of a player, the image will appear on the game overlay.

---

## Customizing stuff

For the overlays/images, there are PSD files for both the game scoreboard and the VS screen to help you customize them.

For the video backgrounds, you can either replace them with other `.webm` files or just cover them with an image overlay.

And if you're brave enough to dive into the code, I tried my best to document everything inside the code so you have an easier time, so go grab those `html` and `js` files!

If you want to customize the GUI, thats going to be a bit complicated since you will have to learn how electron works yourself. In any case, the source code is also on this github!

And most importantly, this project was created using [RoA-Stream-Tool](https://github.com/Readek/RoA-Stream-Tool) as a base, so if you wanna go crazy on customizations, I really recomend you to check out that first, since it's way more documented (and also has a wiki!), especially if you wanna adapt this to other games. This Melee version is way more locked down.

---

Do you want to adapt this project to another game but can't figure out how to? Lucky for you, I'm open for commisions! Contact me on Twitter [@Readeku](https://twitter.com/Readeku) or on Discord `Readek#5869`!.

Do you want to support this project? [Buy me a ko-fi](https://ko-fi.com/readek) or tip me [directly](https://streamlabs.com/readek/tip)!

This is one of my first projects in Javascript, if you know your stuff and look at the code, you may find ways to make the thing a bit more optimized (because right now... it isn't), and I would be happy to hear how to! Please, use this github to leave suggestions on how to imporve things.

---

Resources: [The spriters resource](https://www.spriters-resource.com/search/?q=melee), the [Melee HD Asset Library](https://assets.melee.tv/), and the [VS poses](https://smashboards.com/threads/download-available-poses-for-classic-mode-vs.435797/).

