import craftingData from "./craftables.json";
import houseData from "./houses.json";
import taskData from "./tasks.json";
import foodData from "./food.json";
import houseAddOnData from "./house-add-ons.json";
import fortificationData from "./fortifications.json";
import enemyData from "./enemies.json";
import bossData from "./bosses.json";
export default {
  day: {
    dayLength: process.env.NODE_ENV === "production" ? 24 : 24,
    dayTicks: 0,
    totalDays: 0,
  },
  flags: {
    gameStart: false,
    combatUnlocked: false,
  },
  journal: [],
  worldTier: 0,
  activeTab: "vikings",
  combat: false,
  bossCombat: false,
  newDay: false,
  battleLog: "",
  attackTicks: 6,
  encounterChance: 0.25,
  baseEncounterChance: 0.25,
  maxVikings: 10,
  maxFood: 3,
  comfort: 0,
  baseComfort: 0,
  fortification: 0,
  baseFortification: 0,
  vikings: [],
  ripVikings: [],
  tasks: taskData,
  inventory: [],
  gear: [],
  food: foodData,
  craftables: craftingData,
  house: { name: "None", beds: 0 },
  houses: houseData,
  houseAddOns: houseAddOnData,
  fortifications: fortificationData,
  enemies: [],
  enemyList: enemyData,
  bossList: bossData,
};
