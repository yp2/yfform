_ = lodash;

yfForm = (function () {

    yfForm = function (fields, collection) {
        "use strict";

        let self = this;
        self.fields = fields;
        self.collection = collection;

    };

    yfForm.fieldParams = function (params) {
        let self = this;
        if (!params.field || !Match.test(params.field, String)) {
            throw new Meteor.Error(404, "Field name not set");
        }

        if (typeof params.obj === "undefined") {
            if (!Template.parentData().data) {
                throw new Meteor.Error(404, "No object defined");
            }
            params.obj = Template.parentData().data.obj;
        }

        if (typeof params.obj === "undefined") {
            throw new Meteor.Error(404, "No object defined");
        }

        let stdClasses = ' form-control yfForms';

        let flParams = {
            "class": params.class ? params.class + stdClasses : stdClasses,
            "placeholder": params.placeholder || null,
            "id": params.id || null,
            "type": params.type || "text",
            "readonly": params.readonly ? (params.readonly ? "" : null) : null,
            "disabled": params.disabled ? (params.disabled ? "" : null) : null
        };

        flParams['value'] = self.getFieldValue(params.field, params.obj);

        if (params.fieldData) {
            for (var key in fieldData) {
                params['data-' + key] = params.fieldData[key];
            }
        }

        return flParams
    };

    yfForm.getFieldValue = function (field, obj) {
        let spField = field.split(".");
        while (spField.length && (obj = obj[spField.shift()]));
        return obj;
    };

    yfForm.saveField = function (t, value) {
        let self = this;
        let field = null;

        if (typeof t.data.form !== 'undefined') {
            field = t.data.form.fields[t.data.field];
        }

        if (typeof t.data.method !== "undefined") {
            Meteor.call(t.data.method, t.data.obj, value, function (error, result) {
                if (error) {
                    // error save callback
                    if (field) {
                        self.runFieldCallbacks(t, field.saveErrorCallbacks)
                    }

                    t.fieldError.set(error);
                }
                if (result) {
                    // save success callback
                    if (field) {
                        self.runFieldCallbacks(t, field.saveSuccessCallbacks)
                    }
                }
            })
        } else {
            console.log("No save method defined for field ", t.data.field);
        }
    };
    yfForm.runFieldCallbacks = function (t, callbacks) {
        callbacks.forEach(function (callback) {
            callback(t);
        })
    };
    yfForm.processField = function (e, t) {
        "use strict";
        t.fieldError.set(null);

        // value from field
        let val = t.$(e.currentTarget).val();
        let self = this;

        if (typeof t.data.form !== "undefined") {
            let field = t.data.form.fields[t.data.field];
            try {
                val = t.data.form.validateField(t.data.field, val);

                self.saveField(t, val);
                // validate success callbacks
                self.runFieldCallbacks(t, field.successCallbacks);

            } catch (error) {
                // validate error callback
                self.runFieldCallbacks(t, field.errorCallbacks);

                t.fieldError.set(error)
            }
        } else {
            // no form class no field validation and callbacks
            self.saveField(t, val);
        }

    };

    yfForm.prototype.checkFieldType = function (field, value) {
        "use strict";
        if (typeof field.type !== "undefined") {
            if (typeof field.type() !== typeof value) {
                let type = typeof field.type();
                throw new Meteor.Error(406, "Value must be ${type}");
            }
        }
        return true;
    };

    yfForm.prototype.runFieldValidators = function (field, value) {
        "use strict";
        let cleanedValue = value;
        if (typeof field.validators !== "undefined") {
            field.validators.forEach(function (validator) {
                cleanedValue = validator(cleanedValue)
            })
        }
        return cleanedValue
    };

    yfForm.prototype.validateField = function (fieldName, value) {
        "use strict";

        let formField = this.fields[fieldName],
            validatedValue = value;
        if (typeof formField === "undefined") {
            throw new Meteor.Error(404, "No field definition");
        }
        this.checkFieldType(formField, value);
        validatedValue = this.runFieldValidators(formField, validatedValue);
        return validatedValue;
    };
    return yfForm;
})();

