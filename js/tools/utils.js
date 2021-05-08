//i stole this mostly from the modding tree and made some edits

function exponentialFormat(num, precision, mantissa = true) {
	let e = new Decimal(num.log10()).floor()
	let m = num.div(Decimal.pow(10, e))
	if(m.toStringWithDecimalPlaces(precision) == 10) {
		m = new Decimal(1)
		e = e.add(1)
	}
	e = (e.gte(10000) ? commaFormat(e, 0) : regularFormat(e, 0));
	if (mantissa)
		return commaFormat(m, precision)+"e"+e
		else return "e"+e
	}

function commaFormat(num, precision) {
	if (num === null || num === undefined) return "NaN"
	if (num.m < 0.001) return (0).toFixed(precision)
	return num.toFixed(precision).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}


function regularFormat(num, precision) {
	if (num === null || num === undefined) return "NaN"
	if (num.m < 0.001) return (0).toFixed(precision)
	return num.toFixed(precision)
}

function formatDefault(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	else if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e9)) return exponentialFormat(decimal, 2)
	else if (decimal.gte(1e6)) return exponentialFormat(decimal, 1)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else if (decimal.gt(0)) return commaFormat(decimal, 1)
	else return formatWhole(decimal)
}

function formatDefault2(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e9)) return exponentialFormat(decimal, 2)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else if (decimal.gt(100)) return commaFormat(decimal, 1)
	else if (decimal.gt(0)) return commaFormat(decimal, 2)
	else return formatWhole(decimal)
}

function formatUnitRow(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e4)) return exponentialFormat(decimal, 1)
	else if (decimal.gte(10)) return commaFormat(decimal, 0)
	else if (decimal.gt(0)) return commaFormat(decimal, 1)
	else return formatWhole(decimal)
}

function formatUnitRow2(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e6)) return exponentialFormat(decimal, 2)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else if (decimal.gt(100)) return commaFormat(decimal, 1)
	else if (decimal.gt(0)) return commaFormat(decimal, 2)
	else return formatWhole(decimal)
}

function formatWholeUnitRow(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	//if (decimal.gte(1e9)) return format(decimal, 2)
	if (decimal.lte(0.98) && !decimal.eq(0)) return format(decimal, 2)
	return formatUR(decimal, 0)
}

function formatUR(decimal, precision=2) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e6)) return exponentialFormat(decimal, precision)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else return commaFormat(decimal, precision)
}

function format(decimal, precision=2) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else return commaFormat(decimal, precision)
}

function formatNoComma(decimal, precision=2) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
	else if (decimal.gte(1e3)) return regularFormat(decimal, 0)
	else return regularFormat(decimal, precision)
}

function formatWhole(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	//if (decimal.gte(1e9)) return format(decimal, 2)
	if (decimal.lte(0.98) && !decimal.eq(0)) return format(decimal, 2)
	return format(decimal, 0)
}

function formatWholeNoComma(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	//if (decimal.gte(1e9)) return format(decimal, 2)
	if (decimal.lte(0.98) && !decimal.eq(0)) return format(decimal, 2)
	return formatNoComma(decimal, 0)
}

//end stolen

function formatWholePluralize(dec, str) {
	dec = new Decimal(dec);
	if (str=='galaxies') { return (formatWhole(dec)+(dec.eq(1) ? 'galaxy' : str)); }
	else if (str=='depleted galaxies') { return (formatWhole(dec)+(dec.eq(1) ? 'depleted galaxy' : str)); }
	else if (str=='research'||'void research') { return (formatWhole(dec)+str); }
	else { return (formatWhole(dec)+(dec.eq(1) ? str.slice(0, -1) : str)); }
}

//takes milliseconds as first argument and 'text' or 'num' as the second
function formatTime(time, format) {
	time = time/1000;
	let hours = Math.floor(time/3600);
	time = time % 3600;
	let minutes = Math.floor(time/60);
	time = Math.floor(time % 60);

	if (format == 'text') { return `${ hours>0 ? formatWhole(hours) + " hours, " : "" }${ (minutes>0 || hours>0) ? formatWhole(minutes) + " minutes, " : "" }${ formatWhole(time) + " seconds" }` }
	else { return `${ (hours<10 ? "0" : "") + formatWhole(hours) }:${ (minutes<10 ? "0" : "") + formatWhole(minutes) }:${ (time<10 ? "0" : "") + formatWhole(time) }` }
}

function addFactorial(num) {
	var f = 0;
	var n = parseInt(num);
	while (n > 0) {
		f = f+n;
		n--;
	}
	return f
}

//player data functions
function getFollowers() {
	if (player.isCult) {
		let f = new Decimal(0);
		for (let i=0; i<player.branches.length; i++) {
			f = f.plus(player.branches[i].getFollowers());
		}
		return f;
	} else {
		return player.branches[0].getFollowers();
	}
}

function followersPerSec() {
	if (player.isCult) {
		let f = new Decimal(0);
		for (let i=0; i<player.branches.length; i++) {
			f = f.plus(player.branches[i].followersPerSec());
		}
		return f;
	} else {
		return player.branches[0].followersPerSec();
	}
}

function worshipPerSec() {
	if (player.isCult) {
		let w = new Decimal(0);
		for (let i=0; i<player.branches.length; i++) {
			w = w.plus(player.branches[i].worshipPerSec());
		}
		return w;
	} else {
		return player.branches[0].worshipPerSec();
	}
}

function miracleCost() {
	let c = player.lastMiracleCost.plus(Decimal.floor(Decimal.sqrt(player.totalMiracles)));
	if (player.branches[player.activeBranch].hasCultUpgrade(1, 'right')) { c = c.times(player.branches[player.activeBranch].cultUpgradeEffect(1, 'right')) }
	return c;
}

function miracleGain() {
	let g = player.baseMiracleGain;
	if (hasFeat(1)) { g = g.times(featEffect(1)); }
	return g;
}

class Branch {
	constructor(nextID, startFollowers, upgs=[{bought: false, side: ''}, {bought: false, side: ''}, {bought: false, side: ''}, {bought: false, side: ''}, {bought: false, side: ''}, {bought: false, side: ''}, {bought: false, side: ''}, {bought: false, side: ''}]) {
		this.id = nextID;
		this.followers = Decimal.floor(startFollowers);
		this.realFollowers = startFollowers;
		this.cultUpgrades = [
			{ bought: upgs[0].bought, side: upgs[0].side }, 
			{ bought: upgs[1].bought, side: upgs[1].side },
			{ bought: upgs[2].bought, side: upgs[2].side },
			{ bought: upgs[3].bought, side: upgs[3].side },
			{ bought: upgs[4].bought, side: upgs[4].side },
			{ bought: upgs[5].bought, side: upgs[5].side },
			{ bought: upgs[6].bought, side: upgs[6].side },
			{ bought: upgs[7].bought, side: upgs[7].side },
		];

		this.updateFollowers = function() {
			this.followers = Decimal.floor(this.realFollowers);
		};

		this.getFollowers = function() {
			return this.followers;
		};

		this.addFollowers = function(val) {
			this.realFollowers = this.realFollowers.plus(val);
		};

		this.followersPerSec = function() {
			let f = player.baseFollowerProd;
			if (this.hasCultUpgrade(1, 'left')) { f = f.plus(this.cultUpgradeEffect(1, 'left')); }
			return f;
		};
		
		this.worshipPerSec = function() {
			let w = player.baseWorshipProd;
			let fBoost = new Decimal(this.followers.log10()-1);
			if (player.cultType=='Proselyte' && fBoost.gte(1)) { fBoost = fBoost.sqrt(); }
			else if (player.cultType=='Proselyte') { fBoost = fBoost.pow(2); }
			if (hasTypeUpgrade(1)&&(player.cultType=='Proselyte')) { fBoost = fBoost.times(typeUpgradeEffect(1)); }
			w = w.plus(fBoost);
			if (hasTypeUpgrade(1)&&(player.cultType=='Clandestine')) { w = w.times(typeUpgradeEffect(1)); }
			return w;
		};

		this.canAffordCultUpgrade = function(id) {
			return (player.worship.gte(DATA.upg.cult[id].cost())&&(!this.hasCultUpgradeTier(id))&&DATA.upg.cult[id].requirement.isMet());
		};
		
		this.buyCultUpgrade = function(id, side) {
			if (this.canAffordCultUpgrade(id)) {
				player.worship = player.worship.minus(DATA.upg.cult[id].cost());
				this.cultUpgrades[id-1].bought = true;
				this.cultUpgrades[id-1].side = side;
				DATA.upg.cult[id][side].onBuy();
			}
		};

		this.hasCultUpgradeTier = function(id) {
			return this.cultUpgrades[id-1].bought;
		};
		
		this.hasCultUpgrade = function(id, side) {
			return (this.cultUpgrades[id-1].side==side)&&this.cultUpgrades[id-1].bought;
		};
		
		this.cultUpgradeEffect = function(id, side) {
			return DATA.upg.cult[id][side].effect(this.id);
		};
	}
}

//timer
class Timer {
	constructor(callback, delay) {
		var id, started, remaining = delay, running;

		this.start = function () {
			running = true;
			started = new Date();
			id = setTimeout(callback, remaining);
		};

		this.pause = function () {
			running = false;
			clearTimeout(id);
			remaining -= new Date() - started;
		};

		this.getTimeLeft = function () {
			if (running) {
				this.pause();
				this.start();
			}

			return remaining;
		};

		this.getStateRunning = function () {
			return running;
		};
	}
}