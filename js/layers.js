addLayer("XP", {
    name: "XP", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "XP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ff7300",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Experience Points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.35, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('XP',14)) mult = mult.times(upgradeEffect('XP',14))
        if (hasUpgrade('XP',15)) mult = mult.times(upgradeEffect('XP',15))
        if (hasUpgrade('XP',22)) mult = mult.times(upgradeEffect('XP',22))
        if (hasUpgrade('XP',24)) mult = mult.times(3)
        if (hasUpgrade('XP',25)) mult = mult.times(buyableEffect('XP',11))
        if (hasMilestone('lvl',1)) mult = mult.times(new Decimal(player.lvl.points).pow(0.5))
        if (hasUpgrade('XP',31)) mult = mult.times(upgradeEffect('XP',31))
        if (hasUpgrade('m',11)) mult = mult.times(upgradeEffect('m',11))
        if (hasUpgrade('s',15)) mult = mult.times(upgradeEffect('s',15))
        if (hasUpgrade('a',11)) mult = mult.times(3)

        if (hasMilestone('lvl',3)) mult = mult.pow(tmp.s.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "x", description: "X: Convert Points into XP", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    branches: ['lvl'],
    
    passiveGeneration() { return (hasMilestone('lvl', 3))?(tmp.m.effect.div(100)):0 },
    
    autoUpgrade() { return (hasMilestone('lvl',3))?1:0 },

    softcap: 1e100,
    softcapPower: 0.2,

    upgrades:
    {
        11:
        {
            title:"Genesis",
            description:"Double Point Gain",
            cost: new Decimal(1),
            unlocked() {return hasMilestone('lvl',0)}
        },
        12:
        {
            title:"The Usual Upgrade",
            description:"XP boosts point gain",
            cost: new Decimal(2),
            effect() 
            {
                return player[this.layer].points.add(1).pow(0.4)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        13:
        {
            title:"Strange Formulas",
            description:"Points boost points",
            cost: new Decimal(5),
            effect() 
            {
                if(hasUpgrade(this.layer,34))
                {
                    return player.points.add(1).pow(0.205)
                }
                else
                {
                    return player.points.add(1).pow(0.175)
                }
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        14:
        {
            title:"This is getting repetitive",
            description:"Points boost XP gain",
            cost: new Decimal(10),
            effect() 
            {
                return player.points.add(1).pow(0.04)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        15:
        {
            title:"Last one for now!",
            description:"XP boosts XP gain",
            cost: new Decimal(10),
            effect() 
            {
                return player[this.layer].points.add(1).pow(0.04)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        21:
        {
            title:"Nope! Not the last!",
            description:"Tiers boost Point gain",
            cost: new Decimal(20),
            effect() 
            {
                return player.lvl.points.add(1).pow(1.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,15)}
        },
        22:
        {
            title:"Okay maybe I should give upgrades a meaningful name",
            description:"Tiers boost XP gain",
            cost: new Decimal(50),
            effect() 
            {
                return player.lvl.points.add(1).pow(0.7)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        23:
        {
            title:"Maybe next row",
            description:"x10 points",
            cost: new Decimal(100),
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        24:
        {
            title:"Maybe right now!!",
            description:"x3 XP",
            cost: new Decimal(300),
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        25:
        {
            title:"Repetition",
            description:"Unlock a buyable",
            cost: new Decimal(5000),
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        31:
        {
            title:"Build Up",
            description:"Build up and up, reaching for Gate 1.<br>(Amount of XP Upgrades bought boosts XP gain.)",
            cost:new Decimal(1e9),
            effect() 
            {
                let eff = Decimal.pow(1.4, player.XP.upgrades.length);
                return eff;
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return hasMilestone('lvl',2) && hasUpgrade(this.layer,25) }
        },
        32:
        {
            title:"What is this?",
            description:"Grist fills you with curiosity.<br>Grist boosts Point gain.",
            cost: new Decimal(1e13),
            effect() 
            {
                return player.g.points.pow(0.091)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        33:
        {
            title:"Exponential",
            description:"Raise points to a power based on XP",
            cost: new Decimal(1e15),
            effect() 
            {
                return player.XP.points.log(22).div(150).add(1)
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        34:
        {
            title:"Nostalgia",
            description:"Think back on older upgrades.<br>'Strange Formulas' is now slighly stronger.",
            cost: new Decimal(1e18),
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        35:
        {
            title:"Faster Ascent",
            description:"Dynamically boost Point gain based on both Points and time played.",
            cost: new Decimal(1e22),
            effect()
            {
                return player.points.plus(10).log(10).times(player.timePlayed).pow(0.35)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        }
    },

    buyables:
    {
        11:
        {
            unlocked() {return hasUpgrade(this.layer,25)},

            /*cost(x) { return new Decimal(1).mul(x) },
            display() { return "Blah" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() 
            {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }*/
            title:"More Imps to slay!",
            cost(x) { return new Decimal(13.5).pow(x)},
            effect() { let effect = new Decimal((new Decimal(2).pow(getBuyableAmount(this.layer, this.id))))
                return effect},
            display() { return "Multiplies XP gain by " + format(this.effect()) + "<br>Cost: " + format(this.cost()) + " XP"},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() 
            {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        }
    }
}),

addLayer("lvl", {
    name: "lvl", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ff0000",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Echeladder Tiers", // Name of prestige currency
    baseResource: "XP", // Name of resource prestige is based on
    baseAmount() {return player.XP.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base:10,


    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Tier up!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    canBuyMax() { return hasMilestone('lvl',3)?1:0 },

    milestones:
    {
        0:
        {
            requirementDescription: "Tier 1: Half-Assed Jack-Ass",
            effectDescription: "Unlock XP Upgrades, Tiers mutliply points equally to their amount!",
            done() { return player.lvl.points.gte(1) }
        },

        1:
        {
            requirementDescription: "Tier 5: Unemployed Bum",
            effectDescription: "Double Tier 1 effect and make it affect XP gain at a reduced rate.",
            done() { return player.lvl.points.gte(5) }
        },

        2:
        {
            requirementDescription: "Tier 10: Good Enough Nobody",
            effectDescription: "Unlock Grist and some more XP Upgrades",
            done() { return player.lvl.points.gte(10) }
        },

        3:
        {
            requirementDescription: "Tier 25: Not-so-bad Weakling",
            effectDescription: "Unlock Shale and Mercury, you can now bulk Tier Up,\nyou now autobuy XP Upgrades!<br>Also, unlock upgrades for all building materials.",
            done() { return player.lvl.points.gte(25) }
        },

        4:
        {
            requirementDescription: "Tier 35: Professional Slack Back",
            effectDescription: "Unlock one more material upgrade for all materials.",
            done() { return player.lvl.points.gte(35) }
        },

        5:
        {
            requirementDescription: "Tier 50: Pebble-Tier",
            effectDescription: "Unlock Alchemy, and more material upgrades!",
            done() { return player.lvl.points.gte(50) }
        },

        6:
        {
            requirementDescription: "Tier 100: Holder of Maybe Some Power",
            effectDescription: "Unlock Challenges, Tiers now do not reset anything, Autobuy material upgrades.",
            done() { return player.lvl.points.gte(100) }
        },

        7:
        {
            requirementDescription: "Tier 200: Automation Master",
            effectDescription: "Tiers are now automated, whether you like it or not!",
            done() { return player.lvl.points.gte(200) }
        },

        8:
        {
            requirementDescription: "Tier 250: Bloodbather",
            effectDescription: "Unlock more in Alchemy and unlock more challenges.",
            done() { return player.lvl.points.gte(250) }
        },

        9:
        {
            requirementDescription: "Tier 1000: Potential Man",
            effectDescription: "0.1% of the way there! Unlock more upgrades everywhere and square Rank 1 effect!<br>However.. The Denizens are not liking your fast progress..",
            done() { return player.lvl.points.gte(1000) }
        }
    }
}),

addLayer("g", {
    name: "g", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0,
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#13bffd",                       // The color for this layer, which affects many elements.
    resource: "Grist",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 1,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1) 
        if (hasUpgrade('g',12)) mult = mult.times(upgradeEffect('g',12))
        if (hasUpgrade('g',13)) mult = mult.times(1e3)
        if (hasUpgrade('g',14)) mult = mult.times(upgradeEffect('g',14))
        if (hasUpgrade('a',11)) mult = mult.times(3)


        if (player['g'].points.gte(new Decimal('1.8e308'))) mult = new Decimal(0)
        return mult
    },
    gainExp() 
    {                             // Returns the exponent to your gain of the prestige resource.
        let exp = new Decimal(1)
        if(hasUpgrade('a',12)) exp = exp.add(0.5)
        return exp
    },

    layerShown() { return hasMilestone('lvl',2) },          // Returns a bool for if this layer's node should be visible in the tree.

    effect() { let eff = player.g.points.add(10).log(10);
        return eff
    },

    passiveGeneration() {return hasMilestone('lvl',2)},

    effectDescription() {return "which are boosting base Point gain by +" + format(tmp.g.effect) },

    softcap: new Decimal(1e50),
    softcapPower: new Decimal(0.25),

    infoboxes:
    {
        lore:
        {
            title: "How does this work?",
            body() 
            {
                if (player['g'].points.gte(new Decimal("1.8e308"))) { { return "Grist is passively generated from slaying monsters, meaning you do not have to reset for it.<br><span style=\"color: rgb(95, 0, 0)\">" + "HARDCAP! The SBURB client cannot hold any more Grist.. Cannot gain Grist past 1.8e308!</span><br><h2>Formulas</h2><br>Gain: Points/sec<br>Effect: log<sub>10</sub>(Grist)" } }
                else if(player['g'].points.gte(new Decimal(1e50))) { { return "Grist is passively generated from slaying monsters, meaning you do not have to reset for it.<br><span style=\"color: rgb(255, 0, 0)\">" + "SOFTCAP! Grist is starting to grow scarce in the world already.. Gain past 1e50 is rooted to the fourth power!</span><br><h2>Formulas</h2><br>Gain: Points/sec<br>Effect: log<sub>10</sub>(Grist)" } }
                else { { return "Grist is passively generated from slaying monsters, meaning you do not have to reset for it.<br><br><h2>Formulas</h2><br>Gain: Points/sec<br>Effect: log<sub>10</sub>(Grist)"} };
            },
        }
    },

    upgrades: 
    {
        11:
        {
            title:"These will be unoriginal.",
            description:"Grist boosts point gain.",
            cost: new Decimal(1e6),
            effect() 
            {
                return player.g.points.log(1.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasMilestone('lvl',3)}
        },
        12:
        {
            title:"The power of dodecahedrons",
            description:"Boost Grist based on itself.",
            cost: new Decimal(1e10),
            effect() 
            {
                return player.g.points.plus(100).log(40).pow(1.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        13:
        {
            title:"Nameless Upgrade",
            description:"Here's a 1e3x to Grist production.",
            cost: new Decimal(1e15),
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        14:
        {
            title:"Synergysm Mk. G",
            description:"Grist gain boosted by Shale and Mercury.",
            cost: new Decimal(1e20),
            effect() 
            {
                return player.s.points.pow(0.035).times(player.m.points.pow(0.075))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        15:
        {
            title:"Softcaps? Already? This sucks.",
            description:"Point gain boosted based on amount of Grist post softcap.",
            cost: new Decimal(1e50),
            effect()
            {
                return player.g.points.add(1e50).div(1e50).log(1.5).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer,this.id))+"x"},
            unlocked() { return hasUpgrade(this.layer,(this.id)-1) && hasMilestone('lvl',4) && player.g.points.gte(1e50)}
        }
    }
}),

addLayer("s", {
    name: "s", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0,
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#9501f8",                       // The color for this layer, which affects many elements.
    resource: "Shale",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.4,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1) 
        if (hasUpgrade('s',12)) mult = mult.times(upgradeEffect('s',12))
        if (hasUpgrade('s',13)) mult = mult.times(10)
        if (hasUpgrade('s',14)) mult = mult.times(upgradeEffect('s',14))
        if (hasUpgrade('a',11)) mult = mult.times(3)

        if (player['s'].points.gte(new Decimal('1.8e308'))) mult = new Decimal(0)
        return mult
    },
    gainExp() 
    {                             // Returns the exponent to your gain of the prestige resource.
        let exp = new Decimal(1)
        if(hasUpgrade('a',12)) exp = exp.add(0.27)
        return exp
    },

    layerShown() { return hasMilestone('lvl',3) },          // Returns a bool for if this layer's node should be visible in the tree.

    effect() 
    { 
        let eff = player.s.points.add(10).log(10).div(308).add(1);
        return eff
    },

    passiveGeneration() {return hasMilestone('lvl',3)},

    effectDescription() {return "which are raising XP gain to " + format(tmp.s.effect) },

    infoboxes:
    {
        lore:
        {
            title: "How does this work?",
            body() 
            {
                if (player['s'].points.gte(new Decimal("1.8e308"))) { { return "Shale is too passively generated from slaying monsters, meaning you do not have to reset for it.<br><span style=\"color: rgb(95, 0, 0)\">" + "HARDCAP! The SBURB client cannot hold any more Shale.. Cannot gain Shale past 1.8e308!</span><br><h2>Formulas</h2><br>Gain: Points<sup>0.4</sup>/sec<br>Effect: (log<sub>10</sub>(Shale)/300)+1" } }
                else if(player['s'].points.gte(new Decimal(1e25))) { { return "Shale is too passively generated from slaying monsters, meaning you do not have to reset for it.<br><span style=\"color: rgb(255, 0, 0)\">" + "SOFTCAP! Shale is starting to grow scarce in the world already.. Gain past 1e25 is rooted to the third power!</span><br><h2>Formulas</h2><br>Gain: Points<sup>0.4</sup>/sec<br>Effect: (log<sub>10</sub>(Shale)/300)+1" } }
                else { { return "Shale is too passively generated from slaying monsters, meaning you do not have to reset for it.<br><br><h2>Formulas</h2><br>Gain: Points<sup>0.4</sup>/sec<br>Effect: (log<sub>10</sub>(Shale)/300)+1"} };
            
                
                //return "Shale is too passively generated from slaying monsters, meaning you do not have to reset for it.<br><br><h2>Formulas</h2><br>Gain: Points<sup>0.4</sup>/sec<br>Effect: (log<sub>10</sub>(Shale)/300)+1"
            },
        },
    },

    softcap: new Decimal(1e25),
    softcapPower: new Decimal(0.3),

    upgrades: 
    {
        11:
        {
            title:"More!",
            description:"Shale boosts point gain.",
            cost: new Decimal(1e6),
            effect() 
            {
                return player.s.points.log(1.35)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasMilestone('lvl',3)}
        },
        12:
        {
            title:"Self-Production",
            description:"Boost Shale based on itself.",
            cost: new Decimal(1e10),
            effect() 
            {
                return player.s.points.plus(100).log(25).pow(1.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        13:
        {
            title:"Flat boosts suck",
            description:"Yeah. But I digress, here's a 10x to Shale production.",
            cost: new Decimal(1e15),
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        14:
        {
            title:"Synergysm Mk. S",
            description:"Shale gain boosted by Grist and Mercury.",
            cost: new Decimal(1e20),
            effect() 
            {
                return player.g.points.pow(0.015).times(player.m.points.pow(0.075))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        15:
        {
            title:"Grape Flavour",
            description:"XP gain boosted based on amount of Shale post softcap.",
            cost: new Decimal(1e25),
            effect()
            {
                return player.s.points.add(1e25).div(1e25).log(1.75).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer,this.id))+"x"},
            unlocked() { return hasUpgrade(this.layer,(this.id)-1) && hasMilestone('lvl',4) && player.s.points.gte(1e25)}
        }
    }
}),

addLayer("m", {
    name: "m", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0,
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#626262",                       // The color for this layer, which affects many elements.
    resource: "Mercury",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.1,                          // "normal" prestige gain is (currency^exponent).

    gainMult() 
    {
        let mult = new Decimal(1)
        if (hasUpgrade('m',12)) mult = mult.times(upgradeEffect('m',12))
        if (hasUpgrade('m',13)) mult = mult.times(2)
        if (hasUpgrade('m',14)) mult = mult.times(upgradeEffect('m',14))
        if (hasUpgrade('a',11)) mult = mult.times(3)

        if (player['m'].points.gte(new Decimal('1.8e308'))) mult = new Decimal(0) 
        return mult               
    },
    gainExp() 
    {
        let exp = new Decimal(1)
        if(hasUpgrade('a',12)) exp = exp.add(0.23)
        return exp
    },

    layerShown() { return hasMilestone('lvl',3) },          // Returns a bool for if this layer's node should be visible in the tree.

    effect() 
    { 
        let eff = player.m.points.add(16).log(16);
        if(hasUpgrade(this.layer,15)) eff = eff.times(upgradeEffect('m',15))
        if(hasUpgrade('a',14)) eff = eff.times(upgradeEffect('a',14))
        return eff
    },

    softcap: new Decimal(1e10),
    softcapPower: new Decimal(0.5),

    passiveGeneration() {return hasMilestone('lvl',3)},

    effectDescription() {return "which are passively generating " + format(tmp.m.effect) +"% of XP every second." },

    infoboxes:
    {
        lore:
        {
            title: "How does this work?",
            body()
            {
                if (player['m'].points.gte(new Decimal("1.8e308"))) { { return "Mercury, like other materials, are passively generated from slaying monsters, meaning you do not have to reset for it.<br>It's toxic nature passively kills monsters, earning you XP passively.<br><span style=\"color: rgb(95, 0, 0)\">" + "HARDCAP! The SBURB client cannot hold any more Mercury.. Cannot gain Mercury past 1.8e308!</span><br><h2>Formulas</h2><br>Gain: Points<sup>0.1</sup>/sec<br>Effect: log<sub>16</sub>(Mercury)" } }
                else if(player['m'].points.gte(new Decimal(1e10))) { { return "Mercury, like other materials, are passively generated from slaying monsters, meaning you do not have to reset for it.<br>It's toxic nature passively kills monsters, earning you XP passively.<br><span style=\"color: rgb(255, 0, 0)\">" + "SOFTCAP! Mercury is starting to grow scarce in the world already.. Gain past 1e10 is square rooted!</span><br><h2>Formulas</h2><br>Gain: Points<sup>0.1</sup>/sec<br>Effect: log<sub>16</sub>(Mercury)" } }
                else { { return "Mercury, like other materials, are passively generated from slaying monsters, meaning you do not have to reset for it.<br>It's toxic nature passively kills monsters, earning you XP passively.<br><h2>Formulas</h2><br>Gain: Points<sup>0.1</sup>/sec<br>Effect: log<sub>16</sub>(Mercury)"} };
            }
            
            //body() {return "Mercury, like other materials, are passively generated from slaying monsters, meaning you do not have to reset for it.<br>It's toxic nature passively kills monsters, earning you XP passively.<br>More Mercury=Higher XP rate.<br><br><h2>Formulas</h2><br>Gain: Points<sup>0.1</sup>/sec<br>Effect: log<sub>16</sub>(Mercury)"},
        },
    },

    

    upgrades: 
    {
        11:
        {
            title:"Deudlier",
            description:"You're drenched in Mercury..<br>XP gain boosted by Mercury.",
            cost: new Decimal(10000),
            effect() 
            {
                return player.m.points.div(4).log(1.05).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasMilestone('lvl',3)}
        },
        12:
        {
            title:"Can this thing scale any better?",
            description:"No. But here's a little boost to its gain based on itself.",
            cost: new Decimal(100000),
            effect() 
            {
                return player.m.points.log(16).pow(1.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        13:
        {
            title:"Wow, this is useless.",
            description:"Double Mercury gain",
            cost: new Decimal(1e6),
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        14:
        {
            title:"Synergysm Mk. M",
            description:"Mercury gain boosted by Grist and Shale.",
            cost: new Decimal(2.5e7),
            effect() 
            {
                return player.g.points.pow(0.015).times(player.s.points.pow(0.035))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade(this.layer,(this.id)-1)}
        },
        15:
        {
            title:"Amalgams",
            description:"Mercury effect boosted by amount of Mercury post softcap.",
            cost: new Decimal(1e10),
            effect()
            {
                return player.m.points.add(1e10).div(1e10).log(10).pow(0.65).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer,this.id))+"x"},
            unlocked() { return hasUpgrade(this.layer,(this.id)-1) && hasMilestone('lvl',4) && player.m.points.gte(1e10)}
        }
    }
},
),

addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#ffffff",                       // The color for this layer, which affects many elements.
    resource: "Alchemy",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    type: "none",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() {return hasMilestone('lvl',5)}, 

    branches: ['g','s','m'],

    upgrades: 
    {
        11:
        {
            title:"The Boundful of Caps",
            description:"Looks like a sword made out of bottle caps. <br>Funny, because it costs as much as the softcaps for materials. <br>Not very effective, but triples XP, Grist, Shale and Mercury gain.<br><br> Costs: 1e50 Grist, <br>1e25 Shale, <br>1e10 Mercury.",
            costs: 
            {
                g: 1e50,
                s: 1e25,
                m: 1e10
            },
            canAfford() 
            {
                return player.g.points.gte(this.costs.g)
                && player.s.points.gte(this.costs.s)
                && player.m.points.gte(this.costs.m)
            },
            buy() 
            {
                player.g.points = player.g.points.minus(this.costs.g);
                player.s.points = player.s.points.minus(this.costs.s);
                player.m.points = player.m.points.minus(this.costs.m);
            },
            unlocked() { return player.m.points.gte(1e10) || hasUpgrade(this.layer,this.id)}
        },

        12:
        {
            title:"Self-Replicative Looter",
            description:"Now we're talking. Replicates the materials dropped upon slaying monsters, essentially making more of it. Makes the material softcaps slightly less brutal.<br><br> Costs: 1e55 Grist, <br>2.5e27 Shale, <br>1e11 Mercury.",
            costs: 
            {
                g: 1e55,
                s: 2.5e27,
                m: 1e11
            },
            canAfford() 
            {
                return player.g.points.gte(this.costs.g)
                && player.s.points.gte(this.costs.s)
                && player.m.points.gte(this.costs.m)
            },
            buy() 
            {
                player.g.points = player.g.points.minus(this.costs.g);
                player.s.points = player.s.points.minus(this.costs.s);
                player.m.points = player.m.points.minus(this.costs.m);
            },
            unlocked() { return hasUpgrade(this.layer,(this.id)-1)}
        },

        13:
        {
            title:"Untangible Replicator",
            description:"You cannot quite see this one. However, you feel as if it boosts your point gain by itself.. Whats the deal with this replication anyway? You have a bad feeling about this..<br><br> Costs: 1e65 Grist, <br>1e31 Shale, <br>2.5e13 Mercury.<br>",
            costs: 
            {
                g: 1e65,
                s: 1e31,
                m: 2.5e13
            },
            canAfford() 
            {
                return player.g.points.gte(this.costs.g)
                && player.s.points.gte(this.costs.s)
                && player.m.points.gte(this.costs.m)
            },
            buy() 
            {
                player.g.points = player.g.points.minus(this.costs.g);
                player.s.points = player.s.points.minus(this.costs.s);
                player.m.points = player.m.points.minus(this.costs.m);
            },
            effect()
            {
                return player.points.log(1.1).log(1.05).log(1.03).log(1.01)
            },
            effectDisplay() { return format(upgradeEffect(this.layer,this.id))+"x"},
            unlocked() { return hasUpgrade(this.layer,(this.id)-1)}
        },

        14:
        {
            title:"Replicative Obliterator",
            description:"You feel a heavy sense of Deja Vu. But I digress, this one is made out of Mercury, making Mercury's effect slightly even stronger based on XP.<br><br>Costs: 1e14 Mercury.",
            costs: 
            {
                m: 1e14
            },
            canAfford() 
            {
                return player.m.points.gte(this.costs.m)
            },
            buy() 
            {
                player.m.points = player.m.points.minus(this.costs.m);
            },
            effect()
            {
                return player.XP.points.log(10).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer,this.id))+"x"},
            unlocked() { return hasUpgrade(this.layer,(this.id)-1)}
        },
        
        15:
        {
            title() 
            {
                if(!hasUpgrade(this.layer,this.id)) return "??????????"
                return "Replicanti"
            },
            description()
            {
                if(!hasUpgrade(this.layer,this.id)) return "What is this..? Looks like you can't preview what you're making..<br>Unlocks a new side layer.<br><br>Costs: 1e73 Grist<br>5e34 Shale<br>5e14 Mercury<br>1e62 XP<br>1e85 Points.."
                return "Oh no.. You knew this was coming.. Welp. It's too late now. The Replication has already started. [Not really tho. End of the line rn, Replicanti update soon enough i hope]"
            },
            costs: 
            {
                g: 1e73,
                s: 1e34,
                m: 5e14,
                XP: 1e62,
                points: 1e85
            },
            canAfford() 
            {
                return player.g.points.gte(this.costs.g)
                && player.s.points.gte(this.costs.s)
                && player.m.points.gte(this.costs.m)
                && player.XP.points.gte(this.costs.XP)
                && player.points.gte(this.costs.points)
            },
            buy() 
            {
                player.g.points = player.g.points.minus(this.costs.g);
                player.s.points = player.s.points.minus(this.costs.s);
                player.m.points = player.m.points.minus(this.costs.m);
                player.XP.points = player.XP.points.minus(this.costs.XP);
                player.points = player.points.minus(this.costs.points);
            },
            unlocked() { return hasUpgrade(this.layer,(this.id)-1)}
        }
    },

    infoboxes:
    {
        lore:
        {
            title: "What is this layer?",
            body() { return "Well.. Not really a layer by any means.<br> Here, you will find upgrades that cost materials (Grist, Shale and/or Mercury) that boost a whole lotta stuff! As well as unlock a whole lotta stuff.. Who knows."}
        },
    },
}
)