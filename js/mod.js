let modInfo = {
	name: "The SBURB Tree",
	author: "roxieeeeeeeeeeeeeeeeeeeeeee",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Alchemy Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0413</h3><br>
		- Added things.<br>
		- Added stuff.
		<h3>v0.1</h3><br>
		- Added Material Upgrades<br>
		- Added Alchemy and its upgrades<br>
		- Balanced until ??????????`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal((tmp.g.effect))
	if (hasUpgrade('XP',11)) gain = gain.times(2)
	if (hasUpgrade('XP',23)) gain = gain.times(10)
	if (hasUpgrade('XP',12)) gain = gain.times(upgradeEffect('XP',12))
	if (hasUpgrade('XP',13)) gain = gain.times(upgradeEffect('XP',13))
	if (hasUpgrade('XP',21)) gain = gain.times(upgradeEffect('XP',21))
	if (hasMilestone('lvl',0)) 
	{
		if(hasMilestone('lvl',1)) { gain = gain.times((player.lvl.points * 2)) }
		else { gain = gain.times((player.lvl.points)) }
	}
	if (hasUpgrade('XP',32)) gain = gain.times(upgradeEffect('XP',32))
	if (hasUpgrade('XP',35)) gain = gain.times(upgradeEffect('XP',35))
	if (hasUpgrade('g',15)) gain = gain.times(upgradeEffect('g',15))
	if (hasUpgrade('a',13)) gain = gain.times(upgradeEffect('a',13))

	if (hasUpgrade('XP',33)) gain = gain.pow(upgradeEffect('XP',33))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() 
{
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}