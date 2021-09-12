<template>
  <div id="app">
    <router-view />
    <footer class="footer">
      <div class="content has-text-white">
        <div class="container">
          <div class="columns">
            <div class="column">
              <div>
                <a
                  href="https://github.com/raublekick/vikincremental"
                  target="_blank"
                  class="has-text-white"
                  ><b-icon icon="github" />
                  <span>https://github.com/raublekick/vikincremental</span></a
                >
              </div>
              <div>
                Special thanks to Ken Oh and DisposableHero for playtesting and
                being my rubber ducks to bounce ideas off of.
              </div>
              <div>
                All similarities to Valheim are intentional. Valheim is
                copyright Coffee Stain and Iron Gate AB. Check out Valheim!
                <a href="https://www.valheimgame.com/" target="_blank"
                  >Valheim</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.footer a {
  display: flex;
}
.footer span {
  margin-left: 0.5em;
}
</style>
