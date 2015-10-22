Package.describe({
    name: 'yp2:yfform',
    version: '0.0.2-5',
    summary: 'Forms for meteor',
    git: 'git push -u origin master',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.0.2');
    api.use(['templating', 'spacebars', 'ui', 'less', 'reactive-dict'], 'client');
    api.use('ecmascript');
    api.use("stevezhu:lodash@3.10.1");
    api.use("twbs:bootstrap@3.3.5");


    api.addFiles([
        'client/yfInput.html',
        'client/yfInput.js',
        'client/yfForm.html',
        'client/yfForm.js',
        'client/styles/yfForm.less'
    ], "client");

    api.addFiles([
        'lib/validators/yfValidators.js',
        'lib/yfFields.js',
        'lib/yfForm.js'
    ], ['client', 'server']);

    api.export([
        'yfValidators',
        'yfBaseField',
        'yfInputField',
        'yfForm'
    ]);
});
