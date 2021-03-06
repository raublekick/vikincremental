import Vue from "vue";
import Vuex from "vuex";
import mixin from "@/store/mixin";
import * as _ from "lodash";
import vikingData from "./viking.json";
import idbs from "./idbService";

const store = "vikings";

import defaultState from "./state";

Vue.use(Vuex);

let defaultViking = vikingData;

export default new Vuex.Store({
  state: _.clone(defaultState),
  getters: {
    canRest: (state) => {
      // if has a fire
      return state.comfort > 0;
    },
    foodBestToWorst: (state) => {
      var edibleFood = _.filter(state.food, (food) => {
        return food.amount >= 1;
      });
      return _.orderBy(edibleFood, ["stamina"], ["desc"]);
    },
    foodWorstToBest: (state) => {
      var edibleFood = _.filter(state.food, (food) => {
        return food.amount >= 1;
      });
      return _.orderBy(edibleFood, ["stamina"], ["asc"]);
    },
    currentBiome: (state) => {
      return _.find(state.biomes, (biome) => {
        return biome.worldTier === state.worldTier;
      });
    },
  },
  mutations: {
    init(state, payload) {
      Object.assign(state, payload);
      // state.enemyList = defaultState.enemyList;
      // state.biomes = defaultState.biomes;
      // state.bossList = defaultState.bossList;
      // state.tasks = defaultState.tasks;
      // state.craftables = defaultState.craftables;
    },
    setField(state, payload) {
      state[payload.name] = payload.value;
    },
    addViking(state, payload) {
      state.vikings.push(payload);
    },
    addStamina(state, payload) {
      var stamina =
        Math.round(
          (state.vikings[payload.vikingIndex].stamina += payload.staminaCost) *
            10
        ) / 10;
      var maxStamina = state.vikings[payload.vikingIndex].maxStamina;
      if (stamina > maxStamina) {
        stamina = maxStamina;
      }
      state.vikings[payload.vikingIndex].stamina = stamina;
    },
    addEnemyStamina(state, payload) {
      var stamina = (state.enemies[payload.enemyIndex].stamina +=
        payload.staminaCost);
      var maxStamina = state.enemies[payload.enemyIndex].maxStamina;
      if (stamina > maxStamina) {
        stamina = maxStamina;
      }
      state.enemies[payload.enemyIndex].stamina = stamina;
    },
    addHealth(state, payload) {
      var health =
        Math.round(
          (state.vikings[payload.vikingIndex].health += payload.value) * 10
        ) / 10;
      var maxHealth = state.vikings[payload.vikingIndex].maxHealth;
      if (health > maxHealth) {
        health = maxHealth;
      }
      state.vikings[payload.vikingIndex].health = health;
    },
    incrementArtifact(state, payload) {
      var boss = mixin.methods.findItem(state.bossList, payload.enemyName);
      if (!boss.defeated) {
        var index = mixin.methods.findIndex(state["inventory"], payload.key);
        if (index >= 0) {
          state[payload.objectKey][index].amount += payload.amount;
        } else {
          state[payload.objectKey].push({
            name: payload.key,
            amount: payload.amount,
          });
        }
      }
    },
    incrementObject(state, payload) {
      var index = mixin.methods.findIndex(
        state[payload.objectKey],
        payload.key
      );
      if (index >= 0) {
        state[payload.objectKey][index].amount +=
          payload.amount * state.itemRateModifier;
      } else {
        state[payload.objectKey].push({
          name: payload.key,
          amount: payload.amount * state.itemRateModifier,
        });
      }
    },
    decrementObject(state, payload) {
      var index = mixin.methods.findIndex(
        state[payload.objectKey],
        payload.key
      );
      if (index >= 0) {
        state[payload.objectKey][index].amount -= payload.amount;
      }
    },
    addGear(state, gear) {
      state.gear.push(gear);
    },
    setHouse(state, house) {
      state.house = house;
    },
    assignGear(state, payload) {
      var index = mixin.methods.findIndex(state.gear, payload.item.name);
      var gear = state.gear[index];
      state.gear.splice(index, 1);
      state.vikings[payload.vikingIndex].gear.push(gear);
    },
    removeGear(state, payload) {
      var gear = state.vikings[payload.vikingIndex].gear[payload.gearIndex];
      state.vikings[payload.vikingIndex].gear.splice(payload.gearIndex, 1);
      state.gear.push(gear);
    },
    destroyVikingGear(state, payload) {
      state.ripVikings[payload.vikingIndex].gear.splice(payload.gearIndex, 1);
    },
    destroyGear(state, payload) {
      state.gear.splice(payload.index, 1);
    },
    removeTask(state, payload) {
      var taskIndex = _.findIndex(
        state.vikings[payload.vikingIndex].tasks,
        (task) => {
          return task.name === payload.task.name;
        }
      );

      state.vikings[payload.vikingIndex].tasks.splice(taskIndex, 1);
    },
    removeObject(state, payload) {
      state[payload.objectKey].splice(payload.index, 1);
    },
    setAddOnBuildState(state, payload) {
      var index = mixin.methods.findIndex(
        state[payload.objectKey],
        payload.key
      );
      if (index >= 0) {
        state[payload.objectKey][index].built = payload.state;
      }
    },
  },
  actions: {
    async initializeCombat({ state, dispatch }) {
      var tierEnemies = _.filter(state.enemyList, (enemy) => {
        return (
          enemy.worldTier === state.worldTier &&
          ((state.delve === true && enemy.delve === true) ||
            (state.delve === false && enemy.overworld === true))
        );
      });

      if (
        state.newDay &&
        state.vikings.length &&
        !state.bossCombat &&
        !state.delve &&
        tierEnemies.length > 0
      ) {
        var chance = Math.random();
        if (state.enemies.length) {
          state.combat = true;
        } else if (chance < state.encounterChance) {
          dispatch(
            "setupCombat",
            "Starting day " +
              state.day.totalDays +
              " on the battlefield...<br/>"
          );
        } else {
          state.enemies = [];
          state.combat = false;
        }
      }
    },
    async setupCombat({ state }, msg) {
      state.combat = true;
      state.flags.combatUnlocked = true;
      state.battleLog = msg;
      state.enemies = [];

      // get how many enemies to add
      var numberOfEnemies = mixin.methods.randomIntFromInterval(
        1,
        state.vikings.length + state.ripVikings.length
      );
      var threshold = Math.random();

      var tierEnemies = _.filter(state.enemyList, (enemy) => {
        return (
          enemy.worldTier === state.worldTier &&
          enemy.threshold < threshold &&
          ((state.delve === true && enemy.delve === true) ||
            (state.delve === false && enemy.overworld === true))
        );
      });

      for (var i = 1; i <= numberOfEnemies; i++) {
        var selectedEnemy = _.clone(
          tierEnemies[
            mixin.methods.randomIntFromInterval(0, tierEnemies.length - 1)
          ]
        );
        state.enemies.push(selectedEnemy);
        state.battleLog +=
          "A " + selectedEnemy.name + " has entered the battlefield!<br/>";
      }
    },
    async challengeBoss({ state }, boss) {
      state.bossCombat = true;
      state.combat = true;
      state.enemies = [_.clone(boss)];
      state.battleLog =
        "You have challenged the mighty " +
        boss.name +
        "! Do not fear, for even in death you may be rewarded for such bravery.<br/>";
    },
    async initializeDelve({ state }) {
      state.delve = true;
      state.battleLog = "You step down into the darkness...<br/>";
      state.biomes[state.worldTier].delve.mapData = null;
    },
    async updateMapData({ state }, { index, mapData }) {
      state.biomes[index].delve.mapData = mapData;
    },
    async addTotem({ state, commit }, payload) {
      var chance = Math.random();
      if (chance < payload.totemDropChance) {
        commit("incrementObject", {
          objectKey: "inventory",
          key: payload.totem,
          amount: 1,
        });
        state.battleLog +=
          "<span class='marker' style='background-color:Fuchsia;color:white;'>Upon a dusty altar you find an " +
          payload.totem +
          "</span><br/><br/>";
      } else {
        state.battleLog +=
          "A dusty altar sits before you, but it has nothing to offer.<br/>";
      }
    },
    async addTreasure({ state, commit }, payload) {
      state.battleLog += "You dig into an ancient chest...<br/>";
      var drops = 0;
      _.forEach(payload.treasures.items, (drop) => {
        var amount = mixin.methods.randomIntFromInterval(0, drop.max);
        if (amount > 0) {
          commit("incrementObject", {
            objectKey: "inventory",
            key: drop.name,
            amount: amount,
          });
          state.battleLog +=
            "<span class='marker has-background-warning' style='color:black;'>You find " +
            amount +
            " " +
            drop.name +
            "!</span><br/><br/>";
          drops++;
        }
      });
      _.forEach(payload.treasures.food, (drop) => {
        // bonus drops based on # of vikings
        var amount = mixin.methods.randomIntFromInterval(0, drop.max);
        if (amount > 0) {
          commit("incrementObject", {
            objectKey: "food",
            key: drop.name,
            amount: amount,
          });
          state.battleLog +=
            "<span class='marker has-background-warning' style='color:black;'>You find " +
            amount +
            " " +
            drop.name +
            "!</span><br/><br/>";
          drops++;
        }
      });
      if (drops === 0) {
        state.battleLog +=
          "If any treasure was once here, it is long gone...<br/>";
      }
    },
    async vikingTick({ state, commit, dispatch, getters }) {
      // fill inventory from task items
      _.forEach(state.vikings, (viking, i) => {
        var totalStaminaCost = 0,
          totalStaminaDrain = viking.staminaRegen;

        // if in combat, disable tasks
        if (!state.combat && !state.delve) {
          _.forEach(viking.tasks, (task) => {
            // get items first if stamina is positive
            if (viking.stamina > 0) {
              _.forEach(task.items, (item) => {
                if (!item.worldTier || item.worldTier <= state.worldTier) {
                  commit("incrementObject", {
                    objectKey: "inventory",
                    key: item.name,
                    amount: item.perSecond,
                  });
                }
              });

              _.forEach(task.food, (item) => {
                if (!item.worldTier || item.worldTier <= state.worldTier) {
                  commit("incrementObject", {
                    objectKey: "food",
                    key: item.name,
                    amount: item.perSecond,
                  });
                }
              });

              if (task.processing) {
                // if enough input exists in inventory, remove it and add output to inventory
                dispatch("processItems", task.processing);
              }
              // calculate stamina costs for this task
              totalStaminaCost += task.staminaCost;
            }
          });
        } else {
          // attack only on some of ticks dayTick % (dayLength / attackTicks) === 0
          if (
            state.day.dayTicks % (state.day.dayLength / state.attackTicks) ===
              0 &&
            viking.stamina > 0 &&
            state.enemies.length &&
            !state.newDay
          ) {
            // get target
            var targetIndex = mixin.methods.randomIntFromInterval(
              0,
              state.enemies.length - 1
            );
            // calculate damage
            var weapon = mixin.methods.getWeapon(viking.gear);
            var hit = Math.random() < weapon.combat.accuracy;
            var damage = hit ? weapon.combat.damage : 0;
            var staminaCost = weapon.combat.stamina;
            if (hit) {
              state.battleLog +=
                "<span class='has-background-success has-text-light'>" +
                viking.name +
                " hits " +
                state.enemies[targetIndex].name +
                " for " +
                damage +
                " damage and uses " +
                staminaCost +
                " stamina!</span><br/><br/>";
            } else {
              state.battleLog +=
                viking.name +
                " misses and uses " +
                staminaCost +
                " stamina...<br/><br/>";
            }
            // subtract damage from enemy health
            state.enemies[targetIndex].health -= damage;
            if (state.enemies[targetIndex].health <= 0) {
              state.battleLog +=
                "<span class='has-background-success has-text-light'>" +
                viking.name +
                " has defeated " +
                state.enemies[targetIndex].name +
                "!</span></br>";
              // get enemy drops
              _.forEach(state.enemies[targetIndex].drops, (drop) => {
                // bonus drops based on # of vikings
                var amount = state.bossCombat
                  ? drop.amount * state.vikings.length
                  : drop.amount;
                commit("incrementObject", {
                  objectKey: "inventory",
                  key: drop.name,
                  amount: amount,
                });
                state.battleLog +=
                  "<span class='has-background-warning has-text-black'>" +
                  state.enemies[targetIndex].name +
                  " drops " +
                  amount +
                  " " +
                  drop.name +
                  "!</span><br/><br/>";
              });

              _.forEach(state.enemies[targetIndex].artifacts, (drop) => {
                // bonus drops based on # of vikings
                var amount = drop.amount;
                commit("incrementArtifact", {
                  objectKey: "inventory",
                  key: drop.name,
                  amount: amount,
                  enemyName: state.enemies[targetIndex].name,
                });
                state.battleLog +=
                  "<span class='has-background-warning has-text-black'>" +
                  state.enemies[targetIndex].name +
                  " drops " +
                  amount +
                  " " +
                  drop.name +
                  "!</span><br/><br/>";
              });

              if (state.bossCombat) {
                // mark the boss as defeated
                var boss = mixin.methods.findItem(
                  state.bossList,
                  state.enemies[targetIndex].name
                );
                boss.defeated = true;
                _.forEach(state.vikings, (viking) => {
                  viking.bossesDefeated += 1;
                });
                boss.health = boss.maxHealth;
                boss.stamina = boss.maxStamina;
                if (boss.worldTier === state.worldTier) {
                  state.worldTier++;
                  if (state.worldTier >= state.biomes.length - 1) {
                    state.isPaused = true;
                    state.win = true;
                  } else if (state.biomes[state.worldTier]) {
                    state.biomes[state.worldTier].unlocked = true;
                  }
                }
              }
              commit("removeObject", {
                objectKey: "enemies",
                index: targetIndex,
              });
            }
            // subtract stamina from viking
            totalStaminaCost += staminaCost;

            // reset combat if all enemies are defeated
            if (!state.enemies.length) {
              state.combat = false;
              state.battleLog +=
                "<span class='has-background-success has-text-light'>You are victorious on this day!</span><br/>";
              if (state.bossCombat) {
                state.bossCombat = false;
              }
            }
          }
        }
        totalStaminaDrain -= totalStaminaCost;
        commit("addStamina", {
          vikingIndex: i,
          staminaCost: totalStaminaDrain,
        });
        commit("addHealth", {
          vikingIndex: i,
          value: viking.healthRegen,
        });

        // if this is a new day, eat and set each viking's stamina to the max, set stamina regen based on comfort
        if (state.newDay && getters.canRest === true) {
          // reset to default. If there is no edible food or not enough to eat, will not gain benefit from prior day
          viking.stamina = viking.baseStamina;
          viking.maxStamina = viking.baseStamina;
          viking.maxHealth = viking.baseHealth;

          let stamina = 0;
          let health = 0;
          let foodEaten = 0;
          var food = [];
          if (viking.foodPreference === "best") {
            food = getters.foodBestToWorst;
          } else {
            food = getters.foodWorstToBest;
          }
          _.forEach(food, (food) => {
            if (foodEaten >= state.maxFood) {
              return;
            }
            stamina += food.stamina;
            health += food.health;
            commit("decrementObject", {
              objectKey: "food",
              key: food.name,
              amount: 1,
            });
            foodEaten++;
          });
          viking.maxStamina += stamina;
          viking.stamina += stamina;
          viking.maxHealth += health;
          viking.staminaRegen =
            Math.round((state.comfort + 0.2 * viking.baseStamina - 4) * 10) /
            10;
          viking.healthRegen =
            Math.round((viking.baseHealth / 2 + state.comfort - 12.5) * 10) /
            10;
          commit("addHealth", { vikingIndex: i, value: health / 2 });
        }
      });
    },
    async enemyTick({ state, commit }) {
      if (state.combat && state.enemies.length && !state.newDay) {
        _.forEach(state.enemies, (enemy, i) => {
          var totalStaminaCost = 0,
            totalStaminaDrain = enemy.staminaRegen;
          if (
            state.day.dayTicks % (state.day.dayLength / state.attackTicks) ===
              0 &&
            enemy.stamina > 0 &&
            state.vikings.length
          ) {
            // get target
            var targetIndex = mixin.methods.randomIntFromInterval(
              0,
              state.vikings.length - 1
            );
            // calculate damage
            var weapon =
              enemy.attacks[
                mixin.methods.randomIntFromInterval(0, enemy.attacks.length - 1)
              ];
            var hit = Math.random() < weapon.accuracy;
            var armor = mixin.methods.getArmor(state.vikings[targetIndex].gear);
            var damage = hit ? weapon.damage - armor.armorTotal : 0;
            if (damage < 0) damage = 0;
            var staminaCost = weapon.stamina;
            if (hit) {
              state.battleLog +=
                "<span class='has-background-danger has-text-light'>" +
                enemy.name +
                " hits " +
                state.vikings[targetIndex].name +
                " for " +
                damage +
                " damage and uses " +
                staminaCost +
                " stamina!</span><br/><br/>";
            } else {
              state.battleLog +=
                enemy.name +
                " misses and uses " +
                staminaCost +
                " stamina...<br/><br/>";
            }
            // subtract damage from viking health
            state.vikings[targetIndex].health -= damage;
            if (state.vikings[targetIndex].health <= 0) {
              state.battleLog +=
                "<span class='has-background-danger has-text-light'>" +
                state.vikings[targetIndex].name +
                " has been defeated by " +
                enemy.name +
                "...</span><br/><br/>";
              //if (state.bossCombat) {
              var ripViking = _.clone(state.vikings[targetIndex]);
              state.ripVikings.push(ripViking);
              //}
              state.vikings.splice(targetIndex, 1);
            }
            // subtract stamina from viking
            totalStaminaCost += staminaCost;
          }
          totalStaminaDrain -= totalStaminaCost;

          if (state.vikings.length) {
            commit("addEnemyStamina", {
              enemyIndex: i,
              staminaCost: totalStaminaDrain,
            });
          } else {
            // reset combat if all enemies are defeated
            var msg = "Your party has been eliminated...";
            state.battleLog +=
              "<span class='has-background-danger has-text-light'>" +
              msg +
              "</span><br/><br/>";
            state.deathHeader = msg;

            // msg =
            //   "For your bravery, you are reborn with the following bonuses:";
            // state.battleLog += msg + "<br/>";
            // state.deathMessage = msg + "<br/>";
            state.isDead = true;
            state.isPaused = true;
            // _.forEach(state.ripVikings, (viking) => {
            //   var vMsg =
            //     viking.name +
            //     " gets " +
            //     viking.bossesDefeated +
            //     " point to maximum health, health regen, maximum stamina, and stamina regen.";
            //   state.battleLog += vMsg + "<br/>";
            //   state.deathMessage += vMsg + "<br/>";
            //   viking.tasks = [];
            //   // viking.gear = [];
            //   viking.baseHealthRegen += viking.bossesDefeated;
            //   viking.baseStaminaRegen += viking.bossesDefeated;
            //   viking.baseHealth += viking.bossesDefeated;
            //   viking.baseStamina += viking.bossesDefeated;
            //   viking.maxHealth = viking.baseHealth;
            //   viking.maxStamina = viking.baseStamina;
            //   viking.health = viking.baseHealth;
            //   viking.stamina = viking.baseStamina;
            //   viking.staminaRegen = viking.baseStaminaRegen;
            //   viking.healthRegen = viking.baseHealthRegen;
            //   viking.bossesDefeated = 0;
            // });
            // state.vikings = _.clone(state.ripVikings);
            // state.ripVikings = [];
          }
        });
      }
    },
    async clearDead({ state }) {
      // reset viking tasks, give bonus to base max health, stamina, health regen, and stamina regen, reset health and stamina
      if (state.bossCombat) {
        state.bossList[state.worldTier].health =
          state.bossList[state.worldTier].maxHealth;
        state.bossList[state.worldTier].stamina =
          state.bossList[state.worldTier].maxStamina;
      }

      _.forEach(state.ripVikings, (viking) => {
        viking.deathday = state.day.totalDays;
        state.memorial.push(_.clone(viking));
      });

      // reset world tier, reset ripVikings, remove artifacts, reset bosses, bosssesdefeated
      state.enemies = [];
      state.combat = false;
      state.delve = false;
      state.bossCombat = false;
      state.worldTier = 0;
      state.ripVikings = [];
      state.bossList = _.clone(defaultState.bossList);
      state.biomes = _.clone(defaultState.biomes);
      state.isPaused = false;
      state.isDead = false;
    },
    async processItems({ state, commit }, processing) {
      // if enough input exists in inventory, remove it and add output to inventory
      _.forEach(processing, (process) => {
        // check that every input is available
        var tmpItems = [];
        _.forEach(process.input, (item) => {
          var tmpItem = null;
          if (item.type && item.type === "food") {
            tmpItem = mixin.methods.findItem(state.food, item.name);
            if (tmpItem && tmpItem.amount >= item.amount) {
              tmpItems.push({ type: "food", item: item });
            }
          } else {
            tmpItem = mixin.methods.findItem(state.inventory, item.name);
            if (tmpItem && tmpItem.amount >= item.amount) {
              tmpItems.push({ type: "inventory", item: item });
            }
          }
        });
        // if all input items are available
        if (tmpItems.length === process.input.length) {
          _.forEach(tmpItems, (input) => {
            commit("decrementObject", {
              objectKey: input.type,
              key: input.item.name,
              amount: input.item.amount,
            });
          });
          commit("incrementObject", {
            objectKey: process.output.type,
            key: process.output.name,
            amount: process.output.amount,
          });
        }
      });
    },
    async processingTick({ state, dispatch }) {
      _.forEach(state.houseAddOns, (addOn) => {
        if (addOn.enabled) {
          // if enough input exists in inventory, remove it and add output to inventory
          dispatch("processItems", addOn.processing);
        }
      });
    },
    async tick({ state, dispatch }) {
      // check the day cycle
      if (state.worldTier > state.biomes.length) {
        state.isPaused = true;
        state.win = true;
      }
      state.newDay = false;
      if (state.day.dayTicks === state.day.dayLength) {
        state.day.dayTicks = 0;
        state.day.totalDays += 1;
        state.newDay = true;

        // set comfort level for the day
        state.comfort =
          state.baseComfort +
          _.sumBy(
            _.filter(state.houseAddOns, (addOn) => {
              return addOn.built === true && addOn.enabled === true;
            }),
            (addOn) => {
              return addOn.comfort ? addOn.comfort : 0;
            }
          );

        state.fortification =
          state.baseFortification +
          _.sumBy(
            _.filter(state.fortifications, (addOn) => {
              return addOn.built === true && addOn.enabled === true;
            }),
            (addOn) => {
              return addOn.fortification ? addOn.fortification : 0;
            }
          );

        state.encounterChance =
          state.baseEncounterChance +
          (state.vikings.length + state.ripVikings.length) / 100 +
          (state.comfort * 3) / 100 -
          (state.fortification * 2.5) / 100;
      }
      state.day.dayTicks++;

      // should we enter combat?
      await dispatch("initializeCombat");

      // viking tick
      await dispatch("vikingTick");

      // enemy battle
      await dispatch("enemyTick");

      // process enabled house add-ons
      await dispatch("processingTick");
    },
    async createViking({ state, commit }, name) {
      if (state.vikings.length + state.ripVikings.length < state.maxVikings) {
        let newViking = JSON.parse(JSON.stringify(defaultViking));
        newViking.birthday = state.day.totalDays;
        if (name) {
          newViking.name = name;
        } else {
          newViking.name = "Viking " + (state.vikings.length + 1);
        }

        commit("addViking", newViking);
      }
    },
    async burnViking({ state, commit }, viking) {
      var index = mixin.methods.findIndex(state["ripVikings"], viking.name);
      var newViking = _.clone(state.ripVikings[index]);
      commit("removeObject", {
        objectKey: "ripVikings",
        index: index,
      });

      _.forEach(newViking.gear, (gear) => {
        state.gear.push(gear);
      });
    },
    async reviveViking({ state, commit }, payload) {
      var viking = payload.viking;
      var cost = payload.cost;
      var vMsg =
        viking.name +
        " gets " +
        viking.bossesDefeated +
        " point to maximum health and stamina.";
      state.battleLog += vMsg + "<br/>";
      state.deathMessage += vMsg + "<br/>";
      viking.tasks = [];
      viking.baseHealthRegen += viking.bossesDefeated;
      viking.baseStaminaRegen += viking.bossesDefeated;
      viking.baseHealth += viking.bossesDefeated;
      viking.baseStamina += viking.bossesDefeated;
      viking.maxHealth = viking.baseHealth;
      viking.maxStamina = viking.baseStamina;
      viking.health = viking.baseHealth;
      viking.stamina = viking.baseStamina;
      viking.staminaRegen = viking.baseStaminaRegen;
      viking.healthRegen = viking.baseHealthRegen;
      viking.bossesDefeated = 0;
      state.vikings.push(_.clone(viking));

      commit("decrementObject", {
        objectKey: "inventory",
        key: "Ichor",
        amount: cost,
      });

      var index = mixin.methods.findIndex(state["ripVikings"], viking.name);
      commit("removeObject", {
        objectKey: "ripVikings",
        index: index,
      });
    },
    async convertVikingGear({ state, commit }, payload) {
      var ichor = payload.item.cost;
      commit("incrementObject", {
        objectKey: "inventory",
        key: "Ichor",
        amount: ichor,
      });
      commit("destroyVikingGear", {
        gearIndex: payload.gearIndex,
        vikingIndex: payload.vikingIndex,
      });

      // remove tasks that are no longer allowed
      var tasks = _.filter(
        state.ripVikings[payload.vikingIndex].tasks,
        (task) => {
          if (!task.requirements || !task.requirements.length) {
            return false;
          }

          var requirementsMet = _.filter(task.requirements, (requirement) => {
            return _.filter(
              state.ripVikings[payload.vikingIndex].gear,
              (gear) => {
                return gear.name === requirement;
              }
            ).length;
          }).length;

          return requirementsMet <= 0;
        }
      );

      _.forEach(tasks, (task) => {
        commit("removeTask", {
          vikingIndex: payload.vikingIndex,
          task: task,
        });
      });
    },
    async convertGear({ commit }, payload) {
      var ichor = payload.item.cost;

      commit("incrementObject", {
        objectKey: "inventory",
        key: "Ichor",
        amount: ichor,
      });

      commit("destroyGear", payload);
    },
    async unequipGear({ state, commit }, payload) {
      commit("removeGear", payload);

      // remove tasks that are no longer allowed
      var tasks = _.filter(state.vikings[payload.vikingIndex].tasks, (task) => {
        if (!task.gearRequirements || !task.gearRequirements.length) {
          return false;
        }

        var requirementsMet = _.filter(task.gearRequirements, (requirement) => {
          return _.filter(state.vikings[payload.vikingIndex].gear, (gear) => {
            return gear.name === requirement;
          }).length;
        }).length;

        return requirementsMet <= 0;
      });

      _.forEach(tasks, (task) => {
        commit("removeTask", {
          vikingIndex: payload.vikingIndex,
          task: task,
        });
      });
    },
    async craftGear({ commit }, payload) {
      let newGear = _.clone(payload);

      // decrement components from inventory
      _.forEach(payload.components, (component) => {
        commit("decrementObject", {
          objectKey: "inventory",
          key: component.name,
          amount: component.amount,
        });
      });
      // add new gear to gear store
      commit("addGear", newGear);
    },
    async updateHouse({ commit }, payload) {
      // create a new piece of gear to add
      let newHouse = Object.assign({}, payload);

      // decrement components from inventory
      _.forEach(payload.components, (component) => {
        commit("decrementObject", {
          objectKey: "inventory",
          key: component.name,
          amount: component.amount,
        });
      });
      // add new gear to gear store
      commit("setHouse", newHouse);
    },
    async craftAddOn({ commit }, payload) {
      // decrement components from inventory
      _.forEach(payload.components, (component) => {
        commit("decrementObject", {
          objectKey: "inventory",
          key: component.name,
          amount: component.amount,
        });
      });
      commit("setAddOnBuildState", {
        objectKey: "houseAddOns",
        key: payload.name,
        state: true,
      });
    },
    async craftFortification({ commit }, payload) {
      // decrement components from inventory
      _.forEach(payload.components, (component) => {
        commit("decrementObject", {
          objectKey: "inventory",
          key: component.name,
          amount: component.amount,
        });
      });
      commit("setAddOnBuildState", {
        objectKey: "fortifications",
        key: payload.name,
        state: true,
      });
    },
    async clear({ commit }, payload) {
      commit("setField", { name: "isLoading", value: true });
      idbs.clear(payload);
      commit("setField", { name: "isLoading", value: true });
    },
    async saveToDb({ state, commit, dispatch }) {
      commit("setField", { name: "isLoading", value: true });
      await dispatch("clear", store);
      try {
        await idbs.save(store, [state]);
      } catch (e) {
        console.log("Error saving " + store + ": " + e);
      }
      commit("setField", { name: "isLoading", value: true });
    },
    async reset({ commit }) {
      commit("init", _.clone(defaultState));
    },
    async newGame({ commit, dispatch }, payload) {
      var newGame = _.clone(defaultState);
      newGame.flags.gameStart = true;
      commit("init", newGame);
      dispatch("createViking", payload.name);
    },
    async initialize({ commit }) {
      commit("setField", { name: "isLoading", value: true });
      try {
        let data = await idbs.getAll(store);
        if (data === null) {
          throw new Error("Could not load save data!");
        } else if (data.length === 0) {
          console.log("No saved data found");
        } else {
          console.log("Loaded from save");
          commit("init", data[0]);
        }
      } catch (e) {
        // The value in storage was invalid or corrupt so just set it to blank
        console.log(e);
        //commit("init", { store, data: {} });
      }
      commit("setField", { name: "isLoading", value: false });
    },
  },
  modules: {},
});
