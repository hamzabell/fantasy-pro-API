/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    /* conditions specifying which dependencies are excluded
       from the dependency-cruiser graph
    */
    doNotFollow: {
      path: "node_modules",
    },

    /* pattern(s) that identify (parts of) files that should be
       "collapsed" (grouped) in the graphical output.
       ...
    */
    // collapsePattern: "node_modules/[^/]+",

    /* options to pass on to the reporter */
    reporterOptions: {
      mermaid: {
        /* options to pass on to the mermaid reporter */
        // theme: "default",
      },
    },
  },
};
