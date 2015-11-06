i18n.setDefaultLanguage('en');

_ = lodash;

yfForm = (function () {
    //TODO: refactoring
    //TODO: zmienić sposób przekazywania danych do metody w jednym polu - tak jak
    // w formularzu - zdefiniować odpiednie obiekt;
    "use strict";

    yfForm = function (fields, collection,
                       successCallback, errorCallbacks,
                       saveSuccessCallbacks, saveErrorCallbacks) {

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
        let omitElements = ['method', 'form', 'collection', 'obj', 'field', 'options'];

        let flParams = _.omit(params, omitElements);

        flParams["class"] = flParams.class ? flParams.class + stdClasses : stdClasses;
        flParams["type"] = flParams.type || "text";

        flParams['value'] = self.getFieldValue(params.field, params.obj);

        //if (fieldTmpl.formTmpl) {
        //    yfForm.formFieldValue(fieldTmpl, flParams.value)
        //}

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

    yfForm.saveField = function (t, value, runCallbacks) {
        let self = this;
        let field = null;
        let formObj = t.data.form;
        let saveMethod = t.data.method;
        let obj = t.data.obj;
        let fieldName = t.data.field;
        let callbacks = typeof runCallbacks === "undefiend" ? true: runCallbacks;

        if (formObj) {
            field = formObj.fields[t.data.field];
        }

        if (saveMethod && typeof saveMethod === 'string') {
            Meteor.call(saveMethod, obj, value, fieldName, function (error, result) {
                if (error) {
                    // error save callback move to field error
                    //if (field) {
                    //    //self.runFieldCallbacks(t, field.saveErrorCallbacks)
                    //}

                    t.fieldError.set(error);
                }
                if (result) {
                    // save success callback
                    if (field && callbacks) {
                        self.runFieldCallbacks(t, field.saveSuccessCallbacks)
                    }
                }
            })
        } else if (saveMethod && typeof saveMethod === 'function') {
            try {
                saveMethod(obj, value, fieldName);
                if (field && callbacks) {
                    self.runFieldCallbacks(t, field.saveSuccessCallbacks)
                }
            } catch (error) {
                t.fieldError.set(error);
            }
        } else {
            console.log("No save method defined for field ", t.data.field);
        }
    };
    yfForm.runFormCallbacks = function (t, callbacks) {
        callbacks.forEach(function (callback) {
            callback(t);
        })
    };

    yfForm.runFieldCallbacks = function (t, callbacks, fieldName) {
        let field = t.fields ? t.fields.get(fieldName) : "";
        let fieldId;
        if (field) {
            fieldId = field.data.id;
        } else {
            fieldId = t.data.id;
        }
        callbacks.forEach(function (callback) {
            callback(t, fieldId);
        })
    };

    yfForm.processField = function (e, t, runCallback) {
        "use strict";
        t.fieldError.set(null);

        // value from field
        let val = t.$(e.currentTarget).val();
        let self = this;
        let formObj = t.data.form || t.formTmpl.data.form;
        let formTmpl = t.formTmpl;
        let callbacks = typeof runCallback === "undefined" ? true: runCallback;
        if (formObj && formObj.fields) {
            let field = formObj.fields[t.data.field];
            try {

                if (field) {
                    val = formObj.validateField(t.data.field, val);
                }

                if (callbacks && field) {
                    self.runFieldCallbacks(t, field.successCallbacks);
                }

                if (!formTmpl) {
                    // validate success callbacks
                    self.saveField(t, val, callbacks);
                } else {
                    yfForm.formFieldValue(t, val);
                }

            } catch (error) {
                // validate error callback moved to field
                //self.runFieldCallbacks(t, field.errorCallbacks);

                if (error.error !== "validation") {
                    console.log(error);
                }

                t.fieldError.set(error);
                yfForm.formFieldError(t, error);
                yfForm.formFieldValue(t, val);
            }
        } else {
            // no form class no field validation and callbacks
            if (!formTmpl) {
                self.saveField(t, val);
            } else {
                yfForm.formFieldValue(t, val);
            }
        }

    };

    yfForm.getFormTemplate = function () {
        "use strict";
        let view = Blaze.currentView;
        while (view) {
            //console.log('ff', view);
            if (view.name === "InOuterTemplateScope") {
                //console.log(view.originalParentView.name);
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
        if (field.type) {
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

    yfForm.prototype.serverRunFieldValidators = function (field, value) {
        "use strict";
        let cleanedValue = value;
        if (typeof  field.serverValidators !== "undefined"
            && field.serverValidators.length ) {
            field.serverValidators.forEach(function (validator) {
                cleanedValue = validator(cleanedValue)
            })
        } else if (typeof field.validators !== "undefined"
            && field.validators.length) {
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
        validatedValue = this.runFieldValidators(formField, validatedValue);
        this.checkFieldType(formField, value);
        return validatedValue;
    };

    yfForm.prototype.serverValidateForm = function (fieldsValues) {
        "use strict";

        // todo: add required field validation

        var fields = _.keys(fieldsValues);
        var self = this;
        fields.forEach(function (field) {
            let formField = self.fields[field];
            if (typeof formField === "undefined") {
                throw new Meteor.Error(404, "No field definition");
            }
            try {
                self.serverRunFieldValidators(formField, fieldsValues[field]);
                self.checkFieldType(formField,fieldsValues[field]);
            } catch (error) {
                throw new Meteor.Error('serverValidation', {"field": field, reason: error.reason});
            }
        })
    }
    return yfForm;
})();

