var START_PLAYER = {
    realFollowers: new Decimal(0),
    followers: new Decimal(0),
    worship: new Decimal(0),

    timeLeft: 0,
    miracleOnCooldown: false,
    baseMiracleCost: new Decimal(10),
    lastMiracleCost: new Decimal(10),
    baseMiracleGain: new Decimal(1),
    totalMiracles: 0,

    isCult: false,
    cultType: 'none',
    baseFollowerProd: new Decimal(0),
    baseWorshipProd: new Decimal(0),

    lastUpdate: new Date(),
    lastAutoSave: new Date(),

    upgrades: {
        cult: {
            Proselyte: {
                1: false,
            },
            Clandestine: {
                1: false,
            }
        }
    }
}

var ADVANCEMENTS = {
    cult: {
        showButton: function() { return player.followers.gte(8)&&!player.isCult; },
        canAdvance: function() { return player.followers.gte(10)&&!player.isCult; },
        buttonTitle: 'Develop Cult',
        buttonDesc: 'Requires 10 followers',
        optOne: {
            title: 'Clandestine',
            desc: 'Develop a secretive cult: you will gain followers slower, but produce more worship.',
            metaDesc: '(This is a more active playstyle.)',
            opt: 'optOne',
            onChoose: function() {
                app.$refs['advpop'].isActivePop = false;
                player.isCult = true;
                player.cultType = 'Clandestine';
                player.baseFollowerProd = new Decimal(0.2);
                player.baseWorshipProd = new Decimal(1);
                player.baseMiracleGain = new Decimal(10);
            }
        },
        optTwo: {
            title: 'Proselyte',
            desc: 'Develop an evangelical cult: you will gain followers faster, but produce less worship.',
            metaDesc: '(This is a more idle playstyle.)',
            opt: 'optTwo',
            onChoose: function() {
                app.$refs['advpop'].isActivePop = false;
                player.isCult = true;
                player.cultType = 'Proselyte';
                player.baseFollowerProd = new Decimal(1);
                player.baseWorshipProd = new Decimal(0.5);
                player.baseMiracleGain = new Decimal(10);
            }
        },
    }
}

var UPGRADES = {
    cult: {
        Proselyte: {
            1: {
                id: 1,
                tier: 'cult',
                tenet: 'Proselyte',
                title: 'Dogma of Hell',
                desc: 'Instill an existential fear of hell in your followers, doubling the boost to worship generation based on followers.',
                shortDesc: 'Worship boost from followers x2',
                cost: function() {
                    return new Decimal(50);
                },
                requirement: {
                    amount: new Decimal(250),
                    resource: 'followers',
                    isMet: function() {
                        return player.followers.gte(this.amount);
                    }
                },
                show: function() {
                    return player.isCult && (player.cultType=='Proselyte');
                },
                effect: function() {
                    return new Decimal(2);
                },
                onBuy: function() {
                    return;
                },
                bought: function() {
                    return player.upgrades[this.tier][this.tenet][this.id];
                },
            },
        },
        Clandestine: {
            1: {
                id: 1,
                tier: 'cult',
                tenet: 'Clandestine',
                title: 'Initiation Ritual',
                desc: 'New followers are more devoted, doubling worship generation.',
                shortDesc: 'Worship generation x2',
                cost: function() {
                    return new Decimal(100);
                },
                requirement: {
                    amount: new Decimal(50),
                    resource: 'followers',
                    isMet: function() {
                        return player.followers.gte(this.amount);
                    }
                },
                show: function() {
                    return player.isCult && (player.cultType=='Clandestine');
                },
                effect: function() {
                    return new Decimal(2);
                },
                onBuy: function() {
                    return;
                },
                bought: function() {
                    return player.upgrades[this.tier][this.tenet][this.id];
                },
            },
        }
    }
}