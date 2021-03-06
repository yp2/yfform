Package.describe({
    name: 'yp2:yfform',
    version: '0.3.10',
    summary: 'Forms for meteor',
    git: 'https://github.com/yp2/yfform',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.0.2');
    api.use(['templating', 'spacebars', 'ui', 'less', 'reactive-dict'], 'client');
    api.use('ecmascript');
    api.use("stevezhu:lodash@3.10.1");
    api.use("twbs:bootstrap@3.3.5");
    api.use("anti:i18n@0.4.3");


    api.addFiles([
        'client/yfForm.html',
        'client/yfForm.js',
        'client/yfInput.html',
        'client/yfInput.js',
        'client/yfInputF.html',
        'client/yfInputF.js',
        'client/yfSelect.html',
        'client/yfSelect.js',
        'client/yfTextArea.html',
        'client/yfTextArea.js',
        'client/yfTextAreaF.html',
        'client/yfTextAreaF.js',
        'client/styles/yfForm.less'
    ], "client");

    api.addFiles([
        'lib/validators/yfValidators.js',
        'lib/yfFields.js',
        'lib/yfForm.js',
        'i18n/en.i18n.js',
        'i18n/pl.i18n.js'
    ], ['client', 'server']);

    api.export([
        'yfValidators',
        'yfBaseField',
        'yfInputField',
        'yfSelectField',
        'yfTextAreaField',
        'yfForm'
    ]);
});
