Package.describe({
  name: 'yp2:yfform',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'Forms for meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'git push -u origin master',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use(['templating', 'spacebars', 'ui'], 'client');
  api.use('ecmascript');
  api.use("stevezhu:lodash@3.10.1");
  api.use("twbs:bootstrap@3.3.5");


  api.addFiles([
    'client/yfInput.html',
    'client/yfInput.js'
  ], "client");

  api.addFiles([
      'lib/validators/yfValidators.js',
      'lib/yfFields.js',
      'lib/yfForm.js'
  ],['client','server']);

  api.export([
      'yfValidators',
      'yfBaseField',
      'yfInputField',
      'yfForm'
  ])
  api.addAssets('client/styles/yfForms.less', 'client');
});
