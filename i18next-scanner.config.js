module.exports = {
  options: {
    debug: true,
    defaultLng: 'en',
    defaultNs: 'translation',
    func: {
      extensions: ['.js', '.html'],
      list: ['_'],
    },
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
    lngs: ['en', 'de'],
    nsSeparator: false,
    resource: {
      jsonIndent: 2,
      lineEnding: '\n',
      loadPath: 'dist/locales/{{lng}}.json',
      savePath: 'dist/locales/{{lng}}.json',
    },
  },
};
