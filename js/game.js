var mainLoop;

var player = {};

var dataKeys = {};

var DATA = {};

var miracleTimer;

function init() {
    loadGame();

    startGame();
}

function loadGame() {
    setupData();
    copyData(player, START_PLAYER);
    miracleTimer = new Timer(function() {}, 0);

    loadVue();
}

function addData(id, name, data) {
    DATA[id] = {};
    copyData(DATA[id], data);
    dataKeys[id] = name;
}

function setupData() {
    addData('adv', 'advancements', ADVANCEMENTS);
}

function startGame() {
    startInterval();
}

function startInterval() {
    mainLoop = setInterval(gameLoop, 50);
}

function gameLoop() {
    player.timeLeft = miracleTimer.getTimeLeft();

    if (player.isCult) {
        var currentUpdate = new Date().getTime();
        diff = new Decimal(currentUpdate - player.lastUpdate); 
        player.realFollowers = player.realFollowers.plus(followersPerSec().times(diff.div(1000)));
        player.worship = player.worship.plus(worshipPerSec().times(diff.div(1000)));
    }
    player.followers = Decimal.floor(player.realFollowers);

    player.lastUpdate = currentUpdate;
}

//miracle functions

function miracleClick() {
    if (canCastMiracle()) { castMiracle(); }
}

function castMiracle() {
    player.realFollowers = player.realFollowers.plus(player.miracleGain);
    if (player.isCult) {
        player.worship = player.worship.minus(player.miracleCost);
    } else {
        player.miracleOnCooldown = true;
        miracleTimer = new Timer(function() {
            player.miracleOnCooldown = false;
        }, 1000);
        miracleTimer.start();
    }
}

function canCastMiracle() {
    if (player.isCult) {
        return player.worship.gte(player.miracleCost);
    } else {
        return !player.miracleOnCooldown;
    }
}

//advancements

function advancePopup(title1, title2, desc1, desc2, advID) {
    if (DATA.adv[advID].canAdvance()) {
        app.$refs['advpop'].opt1Title = title1;
        app.$refs['advpop'].opt2Title = title2;
        app.$refs['advpop'].opt1Desc = desc1;
        app.$refs['advpop'].opt2Desc = desc2;
        app.$refs['advpop'].arg = advID;
        app.$refs['advpop'].isActivePop = true;
    }
}

function advanceChoice(advID, opt) {

}

//fixes and data manipulation

function copyData(data, start) {
    for (item in start) {
        if (start[item] == null) {
            if (data[item] === undefined) {
                data[item] = null;
            }
        } else if (Array.isArray(start[item])) {
            data[item] = [];
            copyData(data[item], start[item]);
        } else if (start[item] instanceof Decimal) {
            data[item] = new Decimal(start[item]);
        } else if (start[item] instanceof Date) {
            data[item] = new Date(start[item]);
        } else if ((!!start[item]) && (typeof start[item] === "object")) {
            data[item] = {};
            copyData(data[item], start[item]);
        } else {
            data[item] = start[item];
        }
    }

}

function fixData(data, start) {
    for (item in start) {
        if (start[item] == null) {
            if (data[item] === undefined) {
                data[item] = null;
            }
        } else if (Array.isArray(start[item])) {
            if (data[item] === undefined) {
                data[item] = [];
            }
            fixData(data[item], start[item]);
        } else if (start[item] instanceof Decimal) {
            if (data[item] === undefined) {
                data[item] = new Decimal(start[item]);
            } else {
                data[item] = new Decimal(data[item]);
            }
        } else if (start[item] instanceof Date) {
            if (data[item] === undefined) {
                data[item] = new Date(start[item]);
            } else { data[item] = new Date(data[item]); }
        } else if ((!!start[item]) && (typeof start[item] === "object")) {
            if (data[item] === undefined) {
                data[item] = {};
            }
            fixData(data[item], start[item]);
        } else {
            if (data[item] === undefined) {
                data[item] = start[item];
            }
        }
    }
}