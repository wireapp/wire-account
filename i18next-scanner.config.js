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
    keySeparator: false,
    defaultValue: function(lng, ns, key) {
      return key;
    },
    resource: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      savePath: 'locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  },
};
