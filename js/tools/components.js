var app;

function loadVue() {

    Vue.component('num-text', {
		props: ['val', 'label'],
		methods: {
			plural(d, str) {
                if (str == '') { return str; }
				d = new Decimal(d.replace(',', ''));
				if (str.slice(-3)=='ies') { return (d.eq(1) ? (str.slice(0, -3)+'y') : str); }
				else { return (d.eq(1) ? str.slice(0, -1) : str); }
			},
		},
		template: `
		<span v-html="val + ' ' + plural(val, label)"></span>
		`
	})

	Vue.component('num-text-plain', {
		props: ['val', 'label'],
		methods: {
			plural(d, str) {
                if (str == '') { return str; }
				d = new Decimal(d.replace(',', ''));
				if (str.slice(-3)=='ies') { return (d.eq(1) ? (str.slice(0, -3)+'y') : str); }
				else { return (d.eq(1) ? str.slice(0, -1) : str); }
			},
		},
		template: `
		<span v-html="val + ' ' + plural(val, label)"></span>
		`
	})

    Vue.component('miracle-button', {
		props: [],
		template: `
		<div>
			<button v-on:click="miracleClick()" id="miracle-but" v-bind:class="{ cant: !canCastMiracle(), can: canCastMiracle() }">
                <h4 v-html="player.isCult ? 'Perform Minor Miracle' : 'Bestow Grace'"></h4>
                <span>Gain <num-text :val="formatWhole(player.miracleGain)" label="followers"></num-text><br></span>
                <span v-if="player.isCult">Costs {{ formatWhole(player.miracleCost) }} worship<br></span>
                <span v-if="player.miracleOnCooldown">Cooldown: {{ format(player.timeLeft/1000) }}s</span>
			</button>
		</div>
		`
	})

    Vue.component('advance-button', {
		props: ['data'],
		template: `
		<div v-if="DATA.adv[data].showButton()">
			<button v-on:click="advancePopup(DATA.adv[data].optOne.title, DATA.adv[data].optTwo.title, DATA.adv[data].optOne.desc, DATA.adv[data].optTwo.desc, data)" id="cult-advance-but" v-bind:class="{ 'advance-but': true, cant: !DATA.adv[data].canAdvance(), can: DATA.adv[data].canAdvance() }">
                <h4>{{ DATA.adv[data].buttonTitle }}</h4>
                <span>{{ DATA.adv[data].buttonDesc }}</span>
			</button>
		</div>
		`
	})

    Vue.component('adv-choice-popup', {
		props: [],
		data() {
			return {
				isActivePop: false,
                opt1Title: '',
                opt2Title: '',
                opt1Desc: '',
                opt2Desc: '',
				arg: null,
			}
		},
		template: `
		<div v-if="isActivePop" class="adv-popup">
			<div v-if="arg=='cult'">
                <h3>Develop a Cult</h3>
			    <div style="margin: auto;">
                    Your followers have formed a cult! They will now automatically recruit followers and produce worship. Worship is used to perform miracles and other godly feats.<br>
                    Now, you must decide the most basic type of cult you will lead.
                </div>
            </div>
			<div style="display: flex; justify-content: center; margin: 10px auto;">
				<div style="flex: 1; margin: 5px;"><button class="adv-choice-but" v-on:click="DATA.adv[arg].optOne.onChoose()">
                    <h4>{{ opt1Title }}</h4>
                    <span>{{ opt1Desc }}</span>
                </button></div>
				<div style="flex: 1; margin: 5px;"><button class="adv-choice-but" v-on:click="DATA.adv[arg].optTwo.onChoose()">
                    <h4>{{ opt2Title }}</h4>
                    <span>{{ opt2Desc }}</span>
                </button></div>
			</div>
		</div>
		`
	})

    Vue.component('upgrade-button', {
		props: [],
		template: `
		<div>
			<button v-on:click="miracleClick()" id="miracle-but" v-bind:class="{ cant: !canCastMiracle(), can: canCastMiracle() }">
                <h4 v-html="player.isCult ? 'Perform Minor Miracle' : 'Bestow Grace'"></h4>
                <span>Gain <num-text :val="formatWhole(player.miracleGain)" label="followers"></num-text><br></span>
                <span v-if="player.isCult">Costs {{ formatWhole(player.miracleCost) }} worship<br></span>
                <span v-if="player.miracleOnCooldown">Cooldown: {{ format(player.timeLeft/1000) }}s</span>
			</button>
		</div>
		`
	})

    app = new Vue({
		el: "#app",
		data: {
			player,
            DATA,
			Decimal,
			format,
			formatWhole,
            formatDefault,
            getFollowers,
            castMiracle,
            miracleTimer,
            canCastMiracle,
            miracleClick,
            advancePopup,
		},
	})

    
}