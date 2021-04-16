import * as _ from "lodash";
export default {
  methods: {
    findItem(collection, name) {
      var item = _.find(collection, (item) => {
        return item.name === name;
      });

      return item;
    },
    findIndex(collection, name) {
      var itemIndex = _.findIndex(collection, (item) => {
        return item.name === name;
      });

      return itemIndex;
    },
    hasRequirement(collection) {
      return collection && collection.length;
    },
    craftable(item, house, houseAddOns) {
      // must have all components
      var componentsMet =
        item.components && item.components.length > 0
          ? _.filter(item.components, (component) => {
              var inventoryItem = this.findItem(this.inventory, component.name);
              return inventoryItem && inventoryItem.amount >= component.amount;
            }).length === item.components.length
          : true;

      // must have one requirement
      var requirementsMet =
        item.gearRequirements && item.gearRequirements.length > 0
          ? _.filter(item.gearRequirements, (requirement) => {
              return (
                _.filter(this.gear, (gear) => {
                  return gear.name === requirement;
                }).length > 0
              );
            }).length > 0
          : true;

      var addOnsMet =
        item.addOnRequirements &&
        item.addOnRequirements.length > 0 &&
        houseAddOns
          ? _.filter(item.addOnRequirements, (requirement) => {
              return (
                _.filter(houseAddOns, (addOn) => {
                  return addOn.name === requirement && addOn.built === true;
                }).length > 0
              );
            }).length > 0
          : true;

      var bedsMet =
        house && item.bedRequirement ? item.bedRequirement <= house.beds : true;

      // check if inventory contains at least one of the inputs (i.e. player cannot unlock smelter until an ore has been mined)

      return componentsMet && requirementsMet && addOnsMet && bedsMet;
    },
  },
};
