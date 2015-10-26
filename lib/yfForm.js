_ = lodash;

yfForm = (function () {
    //TODO: server side validation
    //TODO: refactoring
    //TODO: zmienić sposób przekazywania danych do metody w jednym polu - tak jak
    // w formularzu - zdefiniować odpiednie obiekt;
    yfForm = function (fields, collection,
                       successCallback, errorCallbacks,
                       saveSuccessCallbacks, saveErrorCallbacks) {
        "use strict";

        let self = this;
        self.fields = fields;
        self.collection = collection;
        // array of callback
        self.successCallbacks = successCallback || [];
        self.errorCallbacks = errorCallbacks || [];
        self.saveSuccessCallbacks = saveSuccessCallbacks || [];
        self.saveErrorCallbacks = saveErrorCallbacks || [];

    };

    yfForm.registerField = function (fieldTmpl, flParams) {
        if (fieldTmpl.formTmpl) {
            fieldTmpl.formTmpl.fields.set(fieldTmpl.data.field,
                {
                    data: fieldTmpl.data,
                    params: flParams
                }
            )
        }
    };

    yfForm.formFieldValue = function (fieldTmpl, value) {
        if (fieldTmpl.formTmpl) {

            fieldTmpl.formTmpl.fieldsVal.set(fieldTmpl.data.field, value);
            fieldTmpl.formTmpl.fieldsErrors.delete(fieldTmpl.data.field)
        }
    };

    yfForm.formFieldError = function (fieldTmpl, error) {
        if (fieldTmpl.formTmpl) {
            fieldTmpl.formTmpl.fieldsErrors.set(fieldTmpl.data.field, error);
            fieldTmpl.formTmpl.fieldsVal.delete(fieldTmpl.data.field);
        }
    };

    yfForm.fieldParams = function (params, fieldTmpl) {
        let self = this;
        if (!params.field || !Match.test(params.field, String)) {
            throw new Meteor.Error(404, "Field name not set");
        }

        if (typeof params.obj === "undefined") {
            if (!fieldTmpl.formTmpl) {
                throw new Meteor.Error(404, "No object defined");
            } else if ( fieldTmpl.formTmpl.data.obj) {
                params.obj = fieldTmpl.formTmpl.data.obj;
            } else {
                params.obj = {}
            }
        }
        
        //console.log('flParmas', fieldTmpl.formTmpl, params.obj);
        
        let stdClasses = ' form-control yfForm';

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
        yfForm.registerField(fieldTmpl, flParams);
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
        let formObj = t.data.form;
        let saveMethod = t.data.method;
        let obj = t.data.obj;

        if (formObj) {
            field = formObj.fields[t.data.field];
        }

        if (saveMethod) {
            Meteor.call(saveMethod, obj, value, function (error, result) {
                if (error) {
                    // error save callback
                    if (field) {
                        //self.runFieldCallbacks(t, field.saveErrorCallbacks)
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
    yfForm.runFormCallbacks = function (t, callbacks) {
        callbacks.forEach(function (callback) {
            callback(t);
        })
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
        let formObj = t.data.form || t.formTmpl.data.form;
        let formTmpl = t.formTmpl;

        if (formObj && formObj.fields) {
            let field = formObj.fields[t.data.field];
            try {
                val = formObj.validateField(t.data.field, val);
                
                // validate success callbacks
                self.runFieldCallbacks(t, field.successCallbacks);
                
                if (!formTmpl) {
                    self.saveField(t, val);
                } else {
                    yfForm.formFieldValue(t, val);
                }

            } catch (error) {
                // validate error callback
                //self.runFieldCallbacks(t, field.errorCallbacks);

                t.fieldError.set(error)
                yfForm.formFieldError(t, error)
            }
        } else {
            // no form class no field validation and callbacks
            self.saveField(t, val);
        }

    };

    yfForm.getFormTemplate = function () {
        "use strict";
        let view = Blaze.currentView;
        while (view) {
            if (view.name === "InOuterTemplateScope") {
                if (view.originalParentView.name === "Template.yfForm") {
                    return view.originalParentView.templateInstance();
                }
            }
            view = view.parentView;
        }
        return undefined
    };

    yfForm.prototype.checkFieldType = function (field, value) {
        "use strict";
        if (typeof field.type !== "undefined") {
            if (typeof field.type() !== typeof value) {
                let fieldType = typeof field.type();
                let errorMessage = `Value must be ${fieldType}`;

                throw new Meteor.Error('validation', errorMessage );
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

