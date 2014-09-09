exports.config = {
  modules: [ "testem-simple", "copy"],
  testemSimple: {
    configFile: ["foo", 3],
    port: 12345,
    exclude: ["foo", /foo/, 3],
    watch: ["foo", 2, 3]
  }
}