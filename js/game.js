var mainLoop;

var player = {};

var dataKeys = {};

var DATA = {};

var miracleTimer;

var autosaveNotify = false;

var manSaveNotify = false;

var HT = HT || {};

var worldMap;

var countries = {};

var canvas;
var ctx;
var defaultCanvas;
var mouseX;
var mouseY;
var hovered;

var showWorldMap = false;

function init() {
    loadGame();

    startGame();
}

function loadGame() {
    setupData();
    player = {};
    var savePlayer = localStorage.getItem('ascsave');
    if (savePlayer === null || savePlayer === undefined) {
        copyData(player, START_PLAYER);
    } else {
        copyData(player, JSON.parse(window.atob(savePlayer)));
        if (Object.keys(player).length == 0) { copyData(player, START_PLAYER); }
    }
    worldMap = new HT.Grid(800, 600);
    var saveHexes = localStorage.getItem('aschexes');
    if (saveHexes !== null && saveHexes !== undefined) {
        if (JSON.parse(window.atob(saveHexes)) !== null) {
            var tempHexes = [];
            copyHexes(tempHexes, JSON.parse(window.atob(saveHexes)));
            if (tempHexes.length > 0) {
                worldMap.Hexes = [];
                copyHexes(worldMap.Hexes, tempHexes);
            }
        }
    }
    var saveCountries = localStorage.getItem('asccountries');
    if (saveCountries === null || saveCountries === undefined) {
        worldMap.generateCountries();
        worldMap.assignHomeCountry();
    } else {
        copyData(countries, JSON.parse(window.atob(saveCountries)));
        if (Object.keys(countries).length == 0) {
            worldMap.generateCountries();
            worldMap.assignHomeCountry();
        }
    }
    fixData(player, START_PLAYER); 

    miracleTimer = new Timer(function() {}, 0);
    if (player.branches.length==0) {
        player.branches.push(new Branch(0, new Decimal(0)));
        player.activeBranch = 0;
    }

    loadVue();
    if (player.canAutocast) {
        addAutocastListener();
    }
}

function addAutocastListener() {
    var autochk = document.getElementById('autocast-enabled-box');
    autochk.addEventListener('click', function(e) {
        console.log(e);
        e.stopPropagation();
        player.autocastOn = e.target.checked;
    })
}

function addData(id, name, data) {
    DATA[id] = {};
    copyData(DATA[id], data);
    dataKeys[id] = name;
}

function setupData() {
    addData('adv', 'advancements', ADVANCEMENTS);
    addData('upg', 'upgrades', UPGRADES);
}

function manualSave() {
    save();
    manSaveNotify = true;
    setTimeout(function() { manSaveNotify = false; }, 1500);
}

function save() {
    localStorage.setItem('ascsave', window.btoa(JSON.stringify(player)));
    localStorage.setItem('aschexes', window.btoa(JSON.stringify(worldMap.Hexes)));
    localStorage.setItem('asccountries', window.btoa(JSON.stringify(countries)));
}

function importSave() {
    let imp = prompt('Copy the text below for export, overwrite and click OK for import.', exportSave());

    if (imp !== undefined) {
        try {
            copyData(player, JSON.parse(window.atob(imp)));
            if (Object.keys(player).length == 0) { copyData(player, START_PLAYER); }
        } catch(e) {
            return;
        }
    }
    
    fixData(player, START_PLAYER); 
    save();
    window.location.reload();
}

function exportSave() {
    let exp = window.btoa(JSON.stringify(player));
    return exp;
}

function startGame() {
    player.lastUpdate = new Date();
    player.lastAutoSave = new Date();
    player.lastAutoCast = new Date();

    canvas = document.getElementById("hexCanvas");
    ctx = canvas.getContext('2d');
    ctx.canvas.addEventListener('mousemove', handleMapMouseover);
    canvas.addEventListener('mouseleave', handleMapMouseLeave);
    setupMap(); 

    save();

    startInterval();
}

function setupMap() {
    if (!player.displayFullMap) {
        ctx.save();
        //clipMap();
        setupHomeTooltip();
    } else {
        ctx.restore();
    }
    
    drawHexGrid(ctx);
    defaultCanvas = ctx.getImageData(0,0,800,600);
}

function unclipMap() {
    ctx.restore();
    drawHexGrid(ctx);
    defaultCanvas = ctx.getImageData(0,0,800,600);
}

function setupHomeTooltip() {
    let ttSpan = document.getElementById('home-tooltip');
    let coord = worldMap.getCountryCircleBound(player.homeCountryID);
    ttSpan.style.top = (coord[1]-10)+'px';
    ttSpan.style.left = (coord[0])+'px';
    ttSpan.style.transform = 'translate(-50%, -100%)';
    ttSpan.innerHTML = `<strong>${player.homeCountryName}</strong><br>Home Country`;
}

function clipMap() {
    let c = worldMap.getCountryCircleBound(player.homeCountryID);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(c[0], c[1], c[2], 0, 2* Math.PI);
    ctx.stroke();
    ctx.clip();
}

function startInterval() {
    mainLoop = setInterval(gameLoop, 50);
}

function gameLoop() {
    player.timeLeft = miracleTimer.getTimeLeft();
    player.activeBranch = app.selectedBranch;
    var currentUpdate = new Date().getTime();
    var diff = new Decimal(currentUpdate - player.lastUpdate); 

    if (player.genGold) {
        player.gold = player.gold.plus(goldPerSec().times(diff.div(1000)));
    }

    for (let i=0; i<player.branches.length; i++) {
        if (player.isCult) {
            player.branches[i].addFollowers(player.branches[i].followersPerSec().times(diff.div(1000)));
            player.worship = player.worship.plus(player.branches[i].worshipPerSec().times(diff.div(1000)));
        }
        player.branches[i].updateFollowers();
    }

    if (player.canAutocast) {
        if ((currentUpdate-player.lastAutoCast)>15000 && player.autocastOn) {
            if (canCastMiracle()) {
                player.lastAutoCast = currentUpdate;
                castMiracle();
            }
        }
    }

    if ((currentUpdate-player.lastAutoSave)>10000) { 
        player.lastAutoSave = currentUpdate;
        save();
        autosaveNotify = true;
        setTimeout(function() { autosaveNotify = false; }, 1500);
    }

    player.lastUpdate = currentUpdate;
}

//canvas

function showHideMap() {
    showWorldMap = !showWorldMap;
}

function copyHexes(newArray, oldArray) {
    for (let i=0; i<oldArray.length; i++) {
        newArray.push(new HT.Hexagon(oldArray[i].Id, oldArray[i].x, oldArray[i].y, oldArray[i].countryID, oldArray[i].countryName));
    }
}

function handleMapMouseover(e) {
    if (player.displayFullMap) {
        var rect = canvas.getBoundingClientRect();
        var ttSpan = document.getElementById('canvas-tooltip');
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        ttSpan.style.top = (mouseY-10)+'px';
        ttSpan.style.left = (mouseX)+'px';
        ttSpan.style.transform = 'translate(-50%, -100%)';
        let c = worldMap.findHoveredCountry(mouseX, mouseY);
        if (c<0) { return; }
        let name = countries[c].name;

        if (c>0) {
            if (c==player.homeCountryID) {
                ttSpan.innerHTML = `<strong>${name}</strong><br>Home Country`;
            } else {
                ttSpan.innerHTML = `<strong>${name}</strong>`;
            }
            if (c!=hovered) {
                ctx.putImageData(defaultCanvas, 0, 0);
                drawSingleCountry(c, true, ctx);
                hovered = c;
            }
        } else {
            ttSpan.innerHTML = '';
        }
    }
}

function handleMapMouseLeave(e) {
    if (player.displayFullMap) { ctx.putImageData(defaultCanvas, 0, 0); }
}

//miracle functions

function miracleClick() {
    if (canCastMiracle()) { castMiracle(); }
}

function castMiracle() {
    player.branches[player.activeBranch].addFollowers(miracleGain());
    if (player.isCult) {
        player.worship = player.worship.minus(miracleCost());
        if (player.branches[player.activeBranch].hasCultUpgrade(1, 'right')) { player.lastMiracleCost = new Decimal(miracleCost().div(player.branches[player.activeBranch].cultUpgradeEffect(1, 'right'))); }
        else { player.lastMiracleCost = new Decimal(miracleCost()); }
        player.totalMiracles++;
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
        return player.worship.gte(miracleCost());
    } else {
        return !player.miracleOnCooldown;
    }
}

//advancements

function advancePopup(title1, title2, desc1, desc2, meta1, meta2, advID) {
    if (DATA.adv[advID].canAdvance()) {
        app.$refs['advpop'].opt1Title = title1;
        app.$refs['advpop'].opt2Title = title2;
        app.$refs['advpop'].opt1Desc = desc1;
        app.$refs['advpop'].opt2Desc = desc2;
        app.$refs['advpop'].opt1Meta = meta1;
        app.$refs['advpop'].opt2Meta = meta2;
        app.$refs['advpop'].arg = advID;
        app.$refs['advpop'].isActivePop = true;
    }
}

//upgrades

function canAffordTypeUpgrade(id) {
    return (player.worship.gte(DATA.upg.type[player.cultType][id].cost())&&(!hasTypeUpgrade(id))&&DATA.upg.type[player.cultType][id].requirement.isMet());
}

function buyTypeUpgrade(id) {
    if (canAffordTypeUpgrade(id)) {
        player.worship = player.worship.minus(DATA.upg.type[player.cultType][id].cost());
        player.typeUpgrades[id-1] = true;
        DATA.upg.type[player.cultType][id].onBuy();
    }
}

function hasTypeUpgrade(id) {
    return DATA.upg.type[player.cultType][id].bought();
}

function typeUpgradeEffect(id) {
    return DATA.upg.type[player.cultType][id].effect();
}

function canAffordFeat(id) {
    return player.worship.gte(DATA.upg.feat[id].cost())&&!hasFeat(id);
}

function buyFeat(id) {
    if (canAffordFeat(id)) {
        player.worship = player.worship.minus(DATA.upg.feat[id].cost());
        player.feats[id-1] = true;
        DATA.upg.feat[id].onBuy();
    }
}

function hasFeat(id) {
    return DATA.upg.feat[id].bought();
}

function featEffect(id) {
    return DATA.upg.feat[id].effect();
}

function canBranch() {
    return getFollowers().gte(Decimal.pow(100, player.branches.length-1).times(1000));
}

function showBranch() {
    return getFollowers().gte(Decimal.pow(100, player.branches.length-1).times(1000).times(0.8));
}

function getBranchReq() {
    return Decimal.pow(100, player.branches.length-1).times(1000);
}

function newBranch() {
    if (canBranch()) {
        let ind = player.branches.length;
        player.branches.push(new Branch(ind, new Decimal(10)));
        app.selectedBranch = ind;
        player.activeBranch = ind;
    }
}

//fixes and data manipulation

function hardReset() {
    if (confirm('This will reset ALL of your progress and can\'t be undone.')) {
        player = null;
        worldMap.Hexes = null;
        countries = null;
        save();
        window.location.reload(true);
    }
}

function copyData(data, start) {
    for (item in start) {
        if (start[item] == null) {
            if (data[item] === undefined) {
                data[item] = null;
            }
        } else if (Array.isArray(start[item])) {
            data[item] = [];
            if (item=='branches' && start[item].length>0) {
                for (let i=0; i<start[item].length; i++) {
                    data[item][i] = new Branch(i, new Decimal(start[item][i].realFollowers), start[item][i].cultUpgrades);
                }
            } else {
                copyData(data[item], start[item]);
            }
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
            if (item=='branches' && start[item].length>0) {
                for (let i=0; i<start[item].length; i++) {
                    data[item][i] = new Branch(i, new Decimal(start[item][i].realFollowers), start[item][i].cultUpgrades);
                }
            } else {
                fixData(data[item], start[item]);
            }
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