/**
 * Created by daniel on 05.10.15.
 */

yfValidators = {
    required (value) {
        "use strict";
        if (typeof value === "undefined" || value.length <= 0) {
            throw new Meteor.Error('validation', "Value required");
        }
        return value;
    }
}
