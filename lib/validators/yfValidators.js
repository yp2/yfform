/**
 * Created by daniel on 05.10.15.
 */

yfValidators = {
    valueExist (value) {
        "use strict";
        if (!value) {
            throw new Meteor.Error('validation', "No value");
        }
        return value
    },
    required (value) {
        "use strict";
        if (value.length <= 0) {
            throw new Meteor.Error('validation', "Value required");
        }
        return value;
    }
}
