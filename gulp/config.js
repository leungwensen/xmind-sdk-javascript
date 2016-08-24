// ports
module.exports.ports = {
  dev: 1026,
};

// for linting
module.exports.lintingDirs = [
  'bin',
  'gulp',
  'lib',
  'spec',
  'src',
];

// for jsdoc
module.exports.jsdocDirs = [
  'gulp',
  'src',
];

// for htmlhint
module.exports.htmlhintDirs = [
  'demo',
  'spec',
];

// for template2module
module.exports.templateDirs = [
  'lib',
  'src',
];

// for jsdoc
module.exports.jsdocConfig = {
  tags: {
    allowUnknownTags: true
  },
  source: {
    includePattern: '.+\\.js$',
    excludePattern: '(^|\\/|\\\\)_'
  },
  opts: {
    destination: './doc/jsdoc' // this field is TO BE OVERRIDDEN
  },
  plugins: [
    'plugins/markdown'
  ],
  templates: {
    cleverLinks: true,
    monospaceLinks: true,
    path: 'ink-docstrap',
    theme: 'cerulean',
    navType: 'vertical',
    linenums: true,
    dateFormat: 'YYYY-MM'
  }
};
