var START_PLAYER = {
    realFollowers: new Decimal(0),
    followers: new Decimal(0),
    worship: new Decimal(0),

    timeLeft: 0,
    miracleOnCooldown: false,
    miracleCost: new Decimal(10),
    miracleGain: new Decimal(1),

    isCult: false,
    cultType: 'none',
    baseFollowerProd: new Decimal(0),
    baseWorshipProd: new Decimal(0),

    lastUpdate: new Date(),
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
            opt: 'optOne',
            onChoose: function() {
                app.$refs['advpop'].isActivePop = false;
                player.isCult = true;
                player.cultType = 'Clandestine';
                player.baseFollowerProd = new Decimal(0.2);
                player.baseWorshipProd = new Decimal(1);
                player.miracleGain = new Decimal(10);
            }
        },
        optTwo: {
            title: 'Proselyte',
            desc: 'Develop an evangelical cult: you will gain followers faster, but produce less worship.',
            opt: 'optTwo',
            onChoose: function() {
                app.$refs['advpop'].isActivePop = false;
                player.isCult = true;
                player.cultType = 'Proselyte';
                player.baseFollowerProd = new Decimal(1);
                player.baseWorshipProd = new Decimal(0.5);
                player.miracleGain = new Decimal(10);
            }
        },
    }
}

var UPGRADES = {
    cult: {
        Proselyte: {

        },
        Clandestine: {
            
        }
    }
}