<template>
  <div class="pt-4">
    <!-- <b-button v-if="!map.data && vikings.length" @click="makeMap()"
      >Begin!</b-button
    > -->
    <div
      class="has-text-centered"
      v-if="mapHtml != ''"
      tabindex="0"
      @keydown.up.prevent="up"
      @keydown.down.prevent="down"
      @keydown.left.prevent="left"
      @keydown.right.prevent="right"
      @keydown.space.prevent="space"
      ref="map"
    >
      <div>
        <div class="map" v-html="mapHtml"></div>
      </div>
      <b-button
        v-if="atStart"
        @click="setField({ name: 'delve', value: false })"
        >Leave</b-button
      >
    </div>
  </div>
</template>

<script>
import * as _ from "lodash";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "DelveMap",
  data() {
    return {
      xStart: 0,
      yStart: 0,
      map: {
        spawns: [],
        totems: [],
        treasure: [],
        data: null,
      },
      mapData: null,
      mapHtml: "",
      chanceToBuild: 0.5,
      chanceForSpawn: 0.025,
      chanceForTotem: 0.025,
      chanceForTotemDrop: 0.25,
      chanceForTreasure: 0.025,
      spaces: ["X", "s", " ", "t", "e"],
      playerCoords: null,
      previousSpace: null,
      fog: 6,
      sizeDivisor: 3,
      start:
        "<span class='marker has-background-danger' style='color:white;'>S</span>",
      player:
        "<span class='marker has-background-primary' style='color:white'>@</span>",
      placeholder:
        "<span class='marker' style='background-color:grey;color:white;'>!</span>",
      enemy: "",
      totem:
        "<span class='marker' style='background-color:Fuchsia;color:white;'>T</span>",
      treasure:
        "<span class='marker has-background-warning' style='color:black;'>#</span>",
    };
  },
  props: {
    config: {
      required: true,
    },
  },
  computed: {
    ...mapState(["worldTier", "vikings", "combat"]),
    atStart() {
      return (
        this.playerCoords.x === this.xStart &&
        this.playerCoords.y === this.yStart
      );
    },
  },
  methods: {
    ...mapMutations(["setField"]),
    ...mapActions(["updateMapData", "setupCombat", "addTotem", "addTreasure"]),
    up() {
      if (
        this.playerCoords.y > 0 &&
        this.map.data[this.playerCoords.y - 1][this.playerCoords.x] !== "X"
      ) {
        this.movePlayer({ x: this.playerCoords.x, y: this.playerCoords.y - 1 });
      }
    },
    down() {
      if (
        this.playerCoords.y < this.config.yHeight &&
        this.map.data[this.playerCoords.y + 1][this.playerCoords.x] !== "X"
      ) {
        this.movePlayer({ x: this.playerCoords.x, y: this.playerCoords.y + 1 });
      }
    },
    left() {
      if (
        this.playerCoords.x > 0 &&
        this.map.data[this.playerCoords.y][this.playerCoords.x - 1] !== "X"
      ) {
        this.movePlayer({ x: this.playerCoords.x - 1, y: this.playerCoords.y });
      }
    },
    right() {
      if (
        this.playerCoords.x < this.config.xLength - 1 &&
        this.map.data[this.playerCoords.y][this.playerCoords.x + 1] !== "X"
      ) {
        this.movePlayer({ x: this.playerCoords.x + 1, y: this.playerCoords.y });
      }
    },
    space() {
      if (this.atStart) {
        this.setField({ name: "delve", value: false });
      }
    },
    movePlayer(coords) {
      if (this.combat) {
        return;
      }
      this.map.data[this.playerCoords.y][
        this.playerCoords.x
      ] = this.playerCoords.previousValue;
      this.playerCoords.y = coords.y;
      this.playerCoords.x = coords.x;
      var spawnIndex = null;
      if (
        _.findIndex(this.map.spawns, (spawn) => {
          return (
            spawn.x === this.playerCoords.x && spawn.y === this.playerCoords.y
          );
        }) >= 0
      ) {
        spawnIndex = _.findIndex(this.map.spawns, (spawn) => {
          return (
            spawn.x === this.playerCoords.x && spawn.y === this.playerCoords.y
          );
        });
        this.map.spawns.splice(spawnIndex, 1);
        this.playerCoords.previousValue = ".";
        this.setupCombat("Monsters jump out of the darkness!\n");
      } else if (
        _.findIndex(this.map.totems, (spawn) => {
          return (
            spawn.x === this.playerCoords.x && spawn.y === this.playerCoords.y
          );
        }) >= 0
      ) {
        spawnIndex = _.findIndex(this.map.totems, (spawn) => {
          return (
            spawn.x === this.playerCoords.x && spawn.y === this.playerCoords.y
          );
        });
        this.map.totems.splice(spawnIndex, 1);
        this.playerCoords.previousValue = ".";
        // give a totem
        this.addTotem(this.config);
      } else if (
        _.findIndex(this.map.treasure, (spawn) => {
          return (
            spawn.x === this.playerCoords.x && spawn.y === this.playerCoords.y
          );
        }) >= 0
      ) {
        spawnIndex = _.findIndex(this.map.treasure, (spawn) => {
          return (
            spawn.x === this.playerCoords.x && spawn.y === this.playerCoords.y
          );
        });
        this.map.treasure.splice(spawnIndex, 1);
        this.playerCoords.previousValue = ".";
        // give treasure
        this.addTreasure(this.config);
      } else {
        this.playerCoords.previousValue = this.map.data[this.playerCoords.y][
          this.playerCoords.x
        ];
      }

      this.map.data[this.playerCoords.y][this.playerCoords.x] =
        "<span class='marker' style='background-color:green;color:white'>@</span>";
      this.drawMap();
      //this.updateMapData()
    },
    shiftArray(array) {
      var first = array[0];
      var newArray = array.splice(1, array.length);
      newArray.push(first);
      return newArray;
    },
    initMap() {
      return Array.apply(null, Array(this.config.yHeight)).map(() => {
        return Array.apply(null, Array(this.config.xLength)).map(() => {
          return "X";
        });
      });
    },
    buildSpace(
      xNew,
      yNew,
      xCurr,
      yCurr,
      usedSpaces,
      newDirection,
      currDirection,
      array
    ) {
      // is it possible to build here
      if (array[yNew][xNew] === "X") {
        // should we build here?
        if (Math.random() < this.chanceToBuild) {
          // what to build?
          if (
            Math.random() < this.chanceForSpawn &&
            this.map.spawns.length < this.config.spawns
          ) {
            array[yNew][xNew] = this.placeholder;
            this.map.spawns.push({ x: xNew, y: yNew });
          } else if (
            Math.random() < this.chanceForTotem &&
            this.map.totems.length < this.config.totems
          ) {
            array[yNew][xNew] = this.placeholder;
            this.map.totems.push({ x: xNew, y: yNew });
          } else if (
            Math.random() < this.chanceForTreasure &&
            this.map.treasure.length < this.config.treasure
          ) {
            array[yNew][xNew] = this.placeholder;
            this.map.treasure.push({ x: xNew, y: yNew });
          } else {
            array[yNew][xNew] = "."; // this.spaces[item];
          }

          // move to new coord and break
          return {
            xCurr: xNew,
            yCurr: yNew,
            usedSpaces: usedSpaces + 1,
            currDirection: newDirection,
            built: true,
            array: array,
          };
        }
      }

      // move to new coord and break
      return {
        xCurr: xCurr,
        yCurr: yCurr,
        usedSpaces: usedSpaces,
        currDirection: currDirection,
        built: false,
        array: array,
      };
    },
    makeMap() {
      var array = this.initMap();
      this.xStart = this.randomIntFromInterval(1, this.config.xLength - 1);
      this.yStart = this.randomIntFromInterval(1, this.config.yHeight - 1);

      this.playerCoords = {
        x: this.xStart,
        y: this.yStart,
        previousValue: this.start,
      };
      array[this.yStart][this.xStart] = this.player;

      // set coordinates to starting point, follow path generator
      var xCurr = this.xStart;
      var yCurr = this.yStart;
      var usedSpaces = 0;
      var xNew, yNew;

      // track which direction we are moving, and try that direction first, i.e. if we hit left, then the order is left, up, right down
      // if we hit up, then the order is up, right, down, left
      var directions = ["left", "up", "right", "down"];
      var currDirection = "left";

      while (
        usedSpaces <=
        (this.config.xLength * this.config.yHeight) / this.sizeDivisor
      ) {
        var built = false;
        _.forEach(directions, (direction) => {
          if (!built) {
            switch (direction) {
              case "left":
                // check left for OOB
                if (xCurr != 0) {
                  xNew = xCurr - 1;
                  yNew = yCurr;

                  ({
                    xCurr,
                    yCurr,
                    usedSpaces,
                    currDirection,
                    built,
                    array,
                  } = this.buildSpace(
                    xNew,
                    yNew,
                    xCurr,
                    yCurr,
                    usedSpaces,
                    "left",
                    currDirection,
                    array
                  ));
                }
                break;
              case "up":
                // check top for OOB
                if (yCurr != 0) {
                  xNew = xCurr;
                  yNew = yCurr - 1;

                  ({
                    xCurr,
                    yCurr,
                    usedSpaces,
                    currDirection,
                    built,
                    array,
                  } = this.buildSpace(
                    xNew,
                    yNew,
                    xCurr,
                    yCurr,
                    usedSpaces,
                    "up",
                    currDirection,
                    array
                  ));
                }
                break;
              case "right":
                // check right for OOB
                if (xCurr != this.config.xLength - 1) {
                  xNew = xCurr + 1;
                  yNew = yCurr;

                  ({
                    xCurr,
                    yCurr,
                    usedSpaces,
                    currDirection,
                    built,
                    array,
                  } = this.buildSpace(
                    xNew,
                    yNew,
                    xCurr,
                    yCurr,
                    usedSpaces,
                    "right",
                    currDirection,
                    array
                  ));
                }
                break;
              case "down":
                // check bottom for OOB
                if (yCurr != this.config.yHeight - 1) {
                  xNew = xCurr;
                  yNew = yCurr + 1;

                  ({
                    xCurr,
                    yCurr,
                    usedSpaces,
                    currDirection,
                    built,
                    array,
                  } = this.buildSpace(
                    xNew,
                    yNew,
                    xCurr,
                    yCurr,
                    usedSpaces,
                    "down",
                    currDirection,
                    array
                  ));
                }
                break;
            }
          }
        });

        if (built) {
          while (currDirection !== directions[0]) {
            directions = this.shiftArray(directions);
          }
          continue;
        } else {
          // nothing built, move to first empty space or try again
          // note: at 0,0 gets stuck in a loop moving right and left, just move back to start for now and try it all again
          // if(xCurr === 0 && yCurr === 0) {
          //   xCurr = this.xStart;
          //   yCurr = this.yStart;
          //   continue;
          // }
          var moved = false;
          _.forEach(directions, (direction) => {
            if (!moved) {
              switch (direction) {
                case "left":
                  if (xCurr != 0 && array[yCurr][xCurr - 1] !== "X") {
                    xCurr = xCurr - 1;

                    moved = true;
                    currDirection = "left";
                  }
                  break;
                case "up":
                  if (yCurr != 0 && array[yCurr - 1][xCurr] !== "X") {
                    yCurr = yCurr - 1;

                    moved = true;
                    currDirection = "up";
                  }
                  break;
                case "right":
                  if (
                    xCurr != this.config.xLength - 1 &&
                    array[yCurr][xCurr + 1] !== "X"
                  ) {
                    xCurr = xCurr + 1;

                    moved = true;
                    currDirection = "right";
                  }
                  break;
                case "down":
                  if (
                    yCurr != this.config.yHeight - 1 &&
                    array[yCurr + 1][xCurr] !== "X"
                  ) {
                    yCurr = yCurr + 1;

                    moved = true;
                    currDirection = "down";
                  }
                  break;
              }
            }
          });
          if (moved) {
            while (currDirection !== directions[0]) {
              directions = this.shiftArray(directions);
            }
          } else {
            // couldn't move, what do?
            // shuffle directions
            directions = this.shiftArray(directions);

            continue;
          }
        }
      }

      this.map.data = array;
      this.drawMap();
    },
    drawMap() {
      var mapString = ""; // "x: " + this.playerCoords.x + " y: " + this.playerCoords.y;
      // iterate rows
      _.forEach(this.map.data, (row, y) => {
        //mapString += "Row " + (i < 10 ? "0" + i : i) + " ";
        _.forEach(row, (col, x) => {
          var pX = this.playerCoords.x;
          var pY = this.playerCoords.y;
          var distanceFromPlayer = Math.sqrt((x - pX) ** 2 + (y - pY) ** 2);
          mapString +=
            distanceFromPlayer <= this.fog
              ? col
              : "<span style='background-color:#999;color:grey;'>?</span>";
        });
        mapString += "<br/>";
      });

      this.mapHtml = mapString;
      this.$nextTick(() => {
        this.$refs.map.focus();
      });
    },
    randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
  },
  created() {
    if (this.config.mapData) {
      this.map.data = this.config.mapData;
      this.drawMap();
    } else {
      this.makeMap();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  font-family: "Courier New", Courier, monospace;
  line-height: 10px;
  letter-spacing: 1px;
  color: #999;
  cursor: default;
  border: 1px solid #999;
  display: inline-block;
}
.marker {
  background-clip: content-box;
  margin: 0;
  font-size: 5rem;
}
</style>
