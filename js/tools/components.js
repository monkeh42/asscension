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
                <span>Gain <num-text :val="formatWhole(miracleGain())" :label="(player.isCult && player.branches.length>1) ? 'branch followers' : 'followers'"></num-text><br></span>
                <span v-if="player.isCult">Costs {{ formatWhole(miracleCost()) }} worship<br></span>
                <span v-if="player.miracleOnCooldown">Cooldown: {{ format(player.timeLeft/1000) }}s</span>
			</button>
		</div>
		`
	})

    Vue.component('advance-button', {
		props: ['data'],
		template: `
		<div v-if="DATA.adv[data].showButton()">
			<button v-on:click="advancePopup(DATA.adv[data].optOne.title, DATA.adv[data].optTwo.title, DATA.adv[data].optOne.desc, DATA.adv[data].optTwo.desc, DATA.adv[data].optOne.metaDesc, DATA.adv[data].optTwo.metaDesc, data)" id="cult-advance-but" v-bind:class="{ 'advance-but': true, cant: !DATA.adv[data].canAdvance(), can: DATA.adv[data].canAdvance() }">
                <h4>{{ DATA.adv[data].buttonTitle }}</h4>
                <span>{{ DATA.adv[data].buttonDesc }}</span>
			</button>
		</div>
		`
	})

    Vue.component('branch-button', {
		props: [],
		template: `
		<div v-if="showBranch()">
			<button v-on:click="newBranch()" id="new-branch-but" v-bind:class="{ 'branch-but': true, cant: !canBranch(), can: canBranch() }">
                <h4>Develop New Cult Branch</h4>
                <span>Requires {{ formatWhole(getBranchReq()) }} total followers</span>
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
                opt1Meta: '',
                opt2Meta: '',
				arg: null,
			}
		},
		template: `
		<div v-if="isActivePop" class="adv-popup">
			<div v-if="arg=='cult'">
                <h3>Develop a Cult</h3>
			    <div style="margin: auto;">
                    Your followers have formed a cult! They will now automatically recruit followers and produce worship. Worship is used to perform miracles and other godly feats.<br>
                    Now, you must decide the basic type of cult you will lead.
                </div>
            </div>
			<div style="display: flex; justify-content: center; margin: 10px auto;">
				<div style="flex: 1; margin: 5px;"><button class="adv-choice-but" v-on:click="DATA.adv[arg].optOne.onChoose()">
                    <h4>{{ opt1Title }}</h4>
                    <span>{{ opt1Desc }}</span><br>
                    <span>{{ opt1Meta }}</span>
                </button></div>
				<div style="flex: 1; margin: 5px;"><button class="adv-choice-but" v-on:click="DATA.adv[arg].optTwo.onChoose()">
                    <h4>{{ opt2Title }}</h4>
                    <span>{{ opt2Desc }}</span><br>
                    <span>{{ opt2Meta }}</span>
                </button></div>
			</div>
		</div>
		`
	})

    Vue.component('type-upgrade-button', {
		props: ['id'],
		template: `
		<div v-if="DATA.upg.type[player.cultType][id].show()">
			<button v-on:click="buyTypeUpgrade(id)" :id="'type-upg-button-' + player.cultType + '-' + id" v-bind:class="{ 'upgrade-but': !DATA.upg.type[player.cultType][id].bought(), 'bought-upgrade-but': DATA.upg.type[player.cultType][id].bought(), cant: (!canAffordTypeUpgrade(id))&&(!DATA.upg.type[player.cultType][id].bought()), can: canAffordTypeUpgrade(id)&&(!DATA.upg.type[player.cultType][id].bought()) }">
                <h4 v-html="DATA.upg.type[player.cultType][id].title"></h4>
				<div v-if="!DATA.upg.type[player.cultType][id].bought()">
					<span v-html="DATA.upg.type[player.cultType][id].desc"></span><br>
					<span>Requires {{ formatWhole(DATA.upg.type[player.cultType][id].requirement.amount) }} {{ DATA.upg.type[player.cultType][id].requirement.resource }}</span><br>
					<span>Costs {{ formatWhole(DATA.upg.type[player.cultType][id].cost()) }} worship</span>
				</div>
				<div v-else>
					<span v-html="DATA.upg.type[player.cultType][id].shortDesc"></span>
				</div>
			</button>
		</div>
		`
	})

    Vue.component('cult-upgrade-buttons', {
		props: ['id'],
		template: `
		<div v-if="DATA.upg.cult[id].show()">
			<div style="display: flex; justify-content: center; margin: 0 auto;">
				<div style="flex: 1; margin-right: 5px; max-width: 250px;">
					<button v-on:click="player.branches[player.activeBranch].buyCultUpgrade(id, 'left')" :id="'cult-upg-button-' + id + '-left'" v-bind:class="{ 'upgrade-but': !player.branches[player.activeBranch].hasCultUpgrade(id, 'left'), 'bought-upgrade-but': player.branches[player.activeBranch].hasCultUpgrade(id, 'left'), 'locked-upgrade-but': player.branches[player.activeBranch].hasCultUpgrade(id, 'right'), cant: (!player.branches[player.activeBranch].canAffordCultUpgrade(id))&&(!player.branches[player.activeBranch].hasCultUpgrade(id, 'left')), can: player.branches[player.activeBranch].canAffordCultUpgrade(id) }">
						<h4 v-bind:style="[player.branches[player.activeBranch].hasCultUpgrade(id, 'right') ? {'text-decoration': 'line-through', 'text-decoration-thickness': '2px'} : {'text-decoration': 'none'}]" v-html="DATA.upg.cult[id].left.title"></h4>
						<div v-if="!player.branches[player.activeBranch].hasCultUpgradeTier(id)">
							<span v-html="DATA.upg.cult[id].left.desc"></span><br>
							<span>Requires {{ formatWhole(DATA.upg.cult[id].requirement.amount) }} {{ DATA.upg.cult[id].requirement.resource }}</span><br>
							<span>Costs {{ formatWhole(DATA.upg.cult[id].cost()) }} worship</span>
						</div>
						<div v-else>
							<span v-bind:style="[player.branches[player.activeBranch].hasCultUpgrade(id, 'right') ? {'text-decoration': 'line-through'} : {'text-decoration': 'none'}]" v-html="DATA.upg.cult[id].left.shortDesc"></span>
						</div>
					</button>
				</div>
				<div style="flex: 1; margin-left: 5px; max-width: 250px;">
					<button v-on:click="player.branches[player.activeBranch].buyCultUpgrade(id, 'right')" :id="'cult-upg-button-' + id + '-right'" v-bind:class="{ 'upgrade-but': !player.branches[player.activeBranch].hasCultUpgrade(id, 'right'), 'bought-upgrade-but': player.branches[player.activeBranch].hasCultUpgrade(id, 'right'), 'locked-upgrade-but': player.branches[player.activeBranch].hasCultUpgrade(id, 'left'), cant: (!player.branches[player.activeBranch].canAffordCultUpgrade(id))&&(!player.branches[player.activeBranch].hasCultUpgrade(id, 'right')), can: player.branches[player.activeBranch].canAffordCultUpgrade(id) }">
						<h4 v-bind:style="[player.branches[player.activeBranch].hasCultUpgrade(id, 'left') ? {'text-decoration': 'line-through', 'text-decoration-thickness': '2px'} : {'text-decoration': 'none'}]" v-html="DATA.upg.cult[id].right.title"></h4>
						<div v-if="!player.branches[player.activeBranch].hasCultUpgradeTier(id)">
							<span v-html="DATA.upg.cult[id].right.desc"></span><br>
							<span>Requires {{ formatWhole(DATA.upg.cult[id].requirement.amount) }} {{ DATA.upg.cult[id].requirement.resource }}</span><br>
							<span>Costs {{ formatWhole(DATA.upg.cult[id].cost()) }} worship</span>
						</div>
						<div v-else>
							<span v-bind:style="[player.branches[player.activeBranch].hasCultUpgrade(id, 'left') ? {'text-decoration': 'line-through'} : {'text-decoration': 'none'}]" v-html="DATA.upg.cult[id].right.shortDesc"></span>
						</div>
					</button>
				</div>
			</div>
		</div>
		`
	})

    Vue.component('feat-button', {
		props: ['id'],
		template: `
		<div v-if="DATA.upg.feat[id].show()">
			<button v-on:click="buyFeat(id)" :id="'feat-button-' + id" v-bind:class="{ 'upgrade-but': !DATA.upg.feat[id].bought(), 'bought-upgrade-but': DATA.upg.feat[id].bought(), cant: (!canAffordFeat(id))&&(!DATA.upg.feat[id].bought()), can: canAffordFeat(id)&&(!DATA.upg.feat[id].bought()) }">
                <h4 v-html="DATA.upg.feat[id].title"></h4>
				<div v-if="!DATA.upg.feat[id].bought()">
					<span v-html="DATA.upg.feat[id].desc"></span><br>
					<span>Costs {{ formatWhole(DATA.upg.feat[id].cost()) }} worship</span>
				</div>
				<div v-else>
					<span v-html="DATA.upg.feat[id].shortDesc"></span>
				</div>
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
			hasTypeUpgrade,
			buyTypeUpgrade,
			canAffordTypeUpgrade,
			canBranch,
			showBranch,
			newBranch,
			selectedBranch: player.activeBranch,
		},
	})

    
}