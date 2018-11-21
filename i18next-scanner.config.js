module.exports = {
  options: {
    debug: true,
    func: {
      list: ['_'],
      extensions: ['.js', '.html']
    },
    lngs: ['en','de'],
    defaultLng: 'en',
    defaultNs: 'translation',
    nsSeparator: false,
    resource: {
      loadPath: 'dist/locales/{{lng}}.json',
      savePath: 'dist/locales/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  },
};
