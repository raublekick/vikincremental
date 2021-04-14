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
  },
};
