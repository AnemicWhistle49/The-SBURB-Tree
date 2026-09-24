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
        if (hasMilestone('lvl',1)) mult = mult.times(new Decimal(player.lvl.points).pow(0.65))
        if (hasUpgrade('XP',31)) mult = mult.times(upgradeEffect('XP',31))

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
            description:"Build up and up, reaching for Gate 1.<br>As you ascend, more and more enemies try to stop you.<br>Of course, this means more XP for you.<br>(Amount of XP Upgrades bought boosts XP gain.)",
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
                return player.g.points.pow(0.155)
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
            cost(x) { return new Decimal(15).pow(x)},
            effect() { let effect = new Decimal((new Decimal(2).pow(getBuyableAmount(this.layer, this.id))).add(1))
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
            effectDescription: "Unlock Shale and Mercury, you can now bulk Tier Up,\nyou now autobuy XP Upgrades!<br>Also, unlock upgrades for all building materials. (NOT DONE YET)",
            done() { return player.lvl.points.gte(25) }
        },

        4:
        {
            requirementDescription: "Tier 50: Pebble-Tier",
            effectDescription: "Unlock Alchemy, and more material upgrades!",
            done() { return player.lvl.points.gte(50) }
        },

        5:
        {
            requirementDescription: "Tier 100: Holder of Maybe Some Power",
            effectDescription: "Unlock Challenges, Tiers now do not reset anything.",
            done() { return player.lvl.points.gte(100) }
        },

        6:
        {
            requirementDescription: "Tier 500: Sandwicher of Knuckles",
            effectDescription: "More Challenges! Also Tiers are now automated, whether you like it or not!",
            done() { return player.lvl.points.gte(500) }
        },

        7:
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
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasMilestone('lvl',2) },          // Returns a bool for if this layer's node should be visible in the tree.

    effect() { let eff = player.g.points.add(10).log(10);
        return eff
    },

    passiveGeneration() {return hasMilestone('lvl',2)},

    effectDescription() {return "which are boosting base Point gain by +" + format(tmp.g.effect) },

    upgrades: {
        // Look in the upgrades docs to see what goes here!
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
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasMilestone('lvl',3) },          // Returns a bool for if this layer's node should be visible in the tree.

    effect() 
    { 
        let eff = player.s.points.add(10).log(10).div(300).add(1);
        return eff
    },

    passiveGeneration() {return hasMilestone('lvl',3)},

    effectDescription() {return "which are raising XP gain to " + format(tmp.s.effect) },

    upgrades: {
        // Look in the upgrades docs to see what goes here!
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

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasMilestone('lvl',3) },          // Returns a bool for if this layer's node should be visible in the tree.

    effect() 
    { 
        let eff = player.m.points.add(20).log(20);
        return eff
    },

    passiveGeneration() {return hasMilestone('lvl',3)},

    effectDescription() {return "which are passively generating " + format(tmp.m.effect) +"% of XP every second." },

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    }
})