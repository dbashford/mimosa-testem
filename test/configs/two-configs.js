exports.config = {
  modules: [ "testem-simple" , "copy"],
  testemSimple: {
    configFile: [ "test-config/testem.json", "test-config/testem2.json" ]
  }
}