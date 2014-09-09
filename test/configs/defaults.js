exports.config = {
  modules: [ "testem-simple", "copy"],
  testemSimple: {
    configFile: "test-config/testem.json",
    port: null,
    exclude: [],
    watch: []
  }
}


