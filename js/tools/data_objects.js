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

    branches: [],
    activeBranch: 0,

    typeUpgrades: [false, false, false, false, false, false, false, false],
    feats: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
}

var ADVANCEMENTS = {
    cult: {
        showButton: function() { return player.branches[0].getFollowers().gte(8)&&!player.isCult; },
        canAdvance: function() { return player.branches[0].getFollowers().gte(10)&&!player.isCult; },
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
    },
}

var UPGRADES = {
    type: {
        Proselyte: {
            1: {
                id: 1,
                type: 'Proselyte',
                title: 'Dogma of Hell',
                desc: 'Instill an existential fear of hell in your followers, doubling the boost to worship generation based on followers.',
                shortDesc: 'Worship boost from followers x2',
                cost: function() {
                    return new Decimal(50);
                },
                requirement: {
                    amount: new Decimal(250),
                    resource: 'total followers',
                    isMet: function() {
                        return getFollowers().gte(this.amount);
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
                    return (player.cultType==this.type)&&player.typeUpgrades[this.id-1];
                },
            },
            2: {
                id: 2,
                type: 'Proselyte',
                title: 'Dogma of nothing',
                desc: 'does something',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'total followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return player.isCult && (player.cultType=='Proselyte');
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
                bought: function() {
                    return (player.cultType==this.type)&&player.typeUpgrades[this.id-1];
                },
            },
            3: {
                id: 3,
                type: 'Proselyte',
                title: 'Dogma of being too cool for school',
                desc: 'does something',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'total followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return player.isCult && (player.cultType=='Proselyte');
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
                bought: function() {
                    return (player.cultType==this.type)&&player.typeUpgrades[this.id-1];
                },
            },
            4: {
                id: 4,
                type: 'Proselyte',
                title: 'Dogma of farts',
                desc: 'does something',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'total followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return player.isCult && (player.cultType=='Proselyte');
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
                bought: function() {
                    return (player.cultType==this.type)&&player.typeUpgrades[this.id-1];
                },
            },
        },
        Clandestine: {
            1: {
                id: 1,
                type: 'Clandestine',
                title: 'Initiation Ritual',
                desc: 'New followers are more devoted, doubling worship generation.',
                shortDesc: 'Worship generation x2',
                cost: function() {
                    return new Decimal(100);
                },
                requirement: {
                    amount: new Decimal(50),
                    resource: 'total followers',
                    isMet: function() {
                        return getFollowers().gte(this.amount);
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
                    return (player.cultType==this.type)&&player.typeUpgrades[this.id-1];
                },
            },
            2: {
                id: 2,
                type: 'Clandestine',
                title: 'funny Ritual',
                desc: 'does something',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'total followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return player.isCult && (player.cultType=='Clandestine');
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
                bought: function() {
                    return (player.cultType==this.type)&&player.typeUpgrades[this.id-1];
                },
            },
            3: {
                id: 3,
                type: 'Clandestine',
                title: 'stupid Ritual',
                desc: 'does something',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'total followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return player.isCult && (player.cultType=='Clandestine');
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
                bought: function() {
                    return (player.cultType==this.type)&&player.typeUpgrades[this.id-1];
                },
            },
            4: {
                id: 4,
                type: 'Clandestine',
                title: 'sexy Ritual',
                desc: 'does something',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'total followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return player.isCult && (player.cultType=='Clandestine');
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
                bought: function() {
                    return (player.cultType==this.type)&&player.typeUpgrades[this.id-1];
                },
            },
        }
    },
    cult: {
        1: {
            cost: function() {
                return new Decimal(2500);
            },
            requirement: {
                amount: new Decimal(500),
                resource: 'branch followers',
                isMet: function() {
                    return getFollowers().gte(this.amount);
                }
            },
            show: function() {
                return (player.isCult && player.branches.length>1);
            },
            left: {
                id: 1,
                side: 'left',
                title: 'Ministry',
                desc: 'Boost follower recruitment in this branch based on amount of branch followers.',
                shortDesc: 'Followers boost follower gain',
                cost: function() {
                    return new Decimal(2500);
                },
                requirement: {
                    amount: new Decimal(500),
                    resource: 'branch followers',
                    isMet: function() {
                        return getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return (player.isCult && player.branches.length>1);
                },
                effect: function(branchID) {
                    let e = new Decimal(player.branches[branchID].getFollowers().log10()-1);
                    return e;
                },
                onBuy: function() {
                    return;
                },
            },
            right: {
                id: 1,
                side: 'right',
                title: 'Empowered Clergy',
                desc: 'Reduces the cost of miracles cast on this branch by 25%.',
                shortDesc: 'Miracle cost -25%',
                cost: function() {
                    return new Decimal(2500);
                },
                requirement: {
                    amount: new Decimal(500),
                    resource: 'branch followers',
                    isMet: function() {
                        return getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return (player.isCult && player.branches.length>1);
                },
                effect: function(branchID) {
                    return new Decimal(0.75);
                },
                onBuy: function() {
                    return;
                },
            }
        },
        2: {
            cost: function() {
                return new Decimal("Infinity");
            },
            requirement: {
                amount: new Decimal("Infinity"),
                resource: 'branch followers',
                isMet: function() {
                    return false;//getFollowers().gte(this.amount);
                }
            },
            show: function() {
                return (player.isCult && player.branches.length>1);
            },
            left: {
                id: 2,
                side: 'left',
                title: 'left',
                desc: 'does something.',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'branch followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return (player.isCult && player.branches.length>1);
                },
                effect: function(branchID) {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            right: {
                id: 2,
                side: 'right',
                title: 'right',
                desc: 'does something.',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'branch followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return (player.isCult && player.branches.length>1);
                },
                effect: function(branchID) {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            }
        },
        3: {
            cost: function() {
                return new Decimal("Infinity");
            },
            requirement: {
                amount: new Decimal("Infinity"),
                resource: 'branch followers',
                isMet: function() {
                    return false;//getFollowers().gte(this.amount);
                }
            },
            show: function() {
                return (player.isCult && player.branches.length>1);
            },
            left: {
                id: 3,
                side: 'left',
                title: 'left',
                desc: 'does something.',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'branch followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return (player.isCult && player.branches.length>1);
                },
                effect: function(branchID) {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            right: {
                id: 3,
                side: 'right',
                title: 'right',
                desc: 'does something.',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'branch followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return (player.isCult && player.branches.length>1);
                },
                effect: function(branchID) {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            }
        },
        4: {
            cost: function() {
                return new Decimal("Infinity");
            },
            requirement: {
                amount: new Decimal("Infinity"),
                resource: 'branch followers',
                isMet: function() {
                    return false;//getFollowers().gte(this.amount);
                }
            },
            show: function() {
                return (player.isCult && player.branches.length>1);
            },
            left: {
                id: 4,
                side: 'left',
                title: 'left',
                desc: 'does something.',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'branch followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return (player.isCult && player.branches.length>1);
                },
                effect: function(branchID) {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            right: {
                id: 4,
                side: 'right',
                title: 'right',
                desc: 'does something.',
                shortDesc: '',
                cost: function() {
                    return new Decimal("Infinity");
                },
                requirement: {
                    amount: new Decimal("Infinity"),
                    resource: 'branch followers',
                    isMet: function() {
                        return false;//getFollowers().gte(this.amount);
                    }
                },
                show: function() {
                    return (player.isCult && player.branches.length>1);
                },
                effect: function(branchID) {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            }
        },
    },
    feat: {
        1: {
            id: 1,
            title: 'Anoint High Priest',
            desc: 'Your high priest interprets miracles, doubling their base follower gain.',
            shortDesc: 'Miracle follower gain x2',
            cost: function() {
                return new Decimal(500);
            },
            show: function() {
                return player.isCult;
            },
            effect: function() {
                return new Decimal(2);
            },
            onBuy: function() {
                return;
            },
            bought: function() {
                return player.feats[this.id-1];
            },
        },
        2: {
            id: 2,
            title: 'create a sasquatch',
            desc: 'does something',
            shortDesc: '',
            cost: function() {
                return new Decimal("Infinity");
            },
            show: function() {
                return player.isCult;
            },
            effect: function() {
                return new Decimal(1);
            },
            onBuy: function() {
                return;
            },
            bought: function() {
                return player.feats[this.id-1];
            },
        },
        3: {
            id: 3,
            title: 'create the loch ness monster',
            desc: 'does something',
            shortDesc: '',
            cost: function() {
                return new Decimal("Infinity");
            },
            show: function() {
                return player.isCult;
            },
            effect: function() {
                return new Decimal(1);
            },
            onBuy: function() {
                return;
            },
            bought: function() {
                return player.feats[this.id-1];
            },
        },
        4: {
            id: 4,
            title: 'make scientology real',
            desc: 'does something',
            shortDesc: '',
            cost: function() {
                return new Decimal("Infinity");
            },
            show: function() {
                return player.isCult;
            },
            effect: function() {
                return new Decimal(1);
            },
            onBuy: function() {
                return;
            },
            bought: function() {
                return player.feats[this.id-1];
            },
        },
    }
}