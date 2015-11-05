/**
 * Created by daniel on 05.10.15.
 */

yfValidators = {
    required (value) {
        "use strict";
        if (typeof value === "undefined" || value.length <= 0) {
            throw new Meteor.Error('validation', i18n('validators.required'));
        }
        return value;
    },
    email (value) {
        "use strict";
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if (!re.test(value)) {
            throw new Meteor.Error('validation', i18n('validators.emailRequired'));
        }
        return value
    }
};
