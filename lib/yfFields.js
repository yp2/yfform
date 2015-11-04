/**
 * Created by daniel on 06.10.15.
 */
_ = lodash;

var defaultCallbacks = {
    successCallbacks: [function (t) {
        t.$("input").closest('.form-group').removeClass("has-error has-feedback").addClass('has-success has-feedback').delay(2000).queue(function () {
            $(this).removeClass('has-success').dequeue()
        });

        t.$("input").siblings(".yfForm.error-feedback").hide();
        t.$("input").siblings(".yfForm.error-block").hide();
        t.$("input").siblings(".yfForm.success-feedback").fadeIn(100).delay(1800).fadeOut(100)
    }],
    errorCallbacks: [function (t) {
        t.$("input").closest('.form-group').removeClass("has-success has-feedback").addClass('has-error has-feedback');
        t.$("input").siblings(".yfForm.success-feedback").hide();
        t.$("input").siblings(".yfForm.save-block").hide();
        t.$("input").siblings(".yfForm.error-feedback").show();
        t.$("input").siblings(".yfForm.error-block").show();
    }],
    saveSuccessCallbacks: [function (t) {
        t.$("input").siblings(".yfForm.save-block").fadeIn(300).delay(1800).fadeOut(100);
    }],
    saveErrorCallbacks: [function (t) {
        t.$("input").closest('.form-group').removeClass("has-success has-feedback").addClass('has-error has-feedback');
        t.$("input").siblings(".yfForm.success-feedback").hide();
        t.$("input").siblings(".yfForm.save-block").hide();
        t.$("input").siblings(".yfForm.error-feedback").show();
        t.$("input").siblings(".yfForm.error-block").show();
    }]
};

var textAreaCallbacks = {
    successCallbacks: [function (t) {
        t.$("textarea").closest('.form-group').removeClass("has-error has-feedback").addClass('has-success has-feedback').delay(2000).queue(function () {
            $(this).removeClass('has-success').dequeue()
        });

        t.$("textarea").siblings(".yfForm.error-feedback").hide();
        t.$("textarea").siblings(".yfForm.error-block").hide();
        t.$("textarea").siblings(".yfForm.success-feedback").fadeIn(100).delay(1800).fadeOut(100)
    }],
    errorCallbacks: [function (t) {
        t.$("textarea").closest('.form-group').removeClass("has-success has-feedback").addClass('has-error has-feedback');
        t.$("textarea").siblings(".yfForm.success-feedback").hide();
        t.$("textarea").siblings(".yfForm.save-block").hide();
        t.$("textarea").siblings(".yfForm.error-feedback").show();
        t.$("textarea").siblings(".yfForm.error-block").show();
    }],
    saveSuccessCallbacks: [function (t) {
        t.$("textarea").siblings(".yfForm.save-block").fadeIn(300).delay(1800).fadeOut(100);
    }],
    saveErrorCallbacks: [function (t) {
        t.$("textarea").closest('.form-group').removeClass("has-success has-feedback").addClass('has-error has-feedback');
        t.$("textarea").siblings(".yfForm.success-feedback").hide();
        t.$("textarea").siblings(".yfForm.save-block").hide();
        t.$("textarea").siblings(".yfForm.error-feedback").show();
        t.$("textarea").siblings(".yfForm.error-block").show();
    }]
};

yfBaseField = function (data) {
    this.procData = this.setDefaults(defaultCallbacks, data);

    this.validators = this.procData.validators || [];
    this.serverValidators = this.procData.serverValidators || [];
    this.type = this.procData.type || null;
    this.successCallbacks = this.procData.successCallbacks || [];
    this.errorCallbacks = this.procData.errorCallbacks || [];
    this.saveSuccessCallbacks = this.procData.saveSuccessCallbacks || [];
    this.saveErrorCallbacks = this.procData.saveErrorCallbacks || [];
};

yfBaseField.prototype.addValidators = function (validators) {
    if (validators.constructor === Array) {
        this.validators = validators
    } else if (validators.constructor === Function) {
        this.validators.push(validators)
    }
};

yfBaseField.prototype.setType = function (type) {
    this.type = type
};

yfBaseField.prototype.addSuccessCallbacks = function (callbacks) {
    if (callbacks.constructor === Array) {
        this.successCallbacks = callbacks
    } else if (callbacks.constructor === Function) {
        this.successCallbacks.push(callbacks)
    }
};

yfBaseField.prototype.addErrorCallbacks = function (callbacks) {
    if (callbacks.constructor === Array) {
        this.errorCallbacks = callbacks
    } else if (callbacks.constructor === Function) {
        this.errorCallbacks.push(callbacks)
    }
};

yfBaseField.prototype.addSaveSuccessCallbacks = function (callbacks) {
    if (callbacks.constructor === Array) {
        this.saveSuccessCallbacks = callbacks
    } else if (callbacks.constructor === Function) {
        this.saveSuccessCallbacks.push(callbacks)
    }
};

yfBaseField.prototype.addSaveErrorCallbacks = function (callbacks) {
    if (callbacks.constructor === Array) {
        this.saveErrorCallbacks = callbacks
    } else if (callbacks.constructor === Function) {
        this.saveErrorCallbacks.push(callbacks)
    }
};

yfBaseField.prototype.setDefaults = function (defaultValues, data) {
    var defaultKeys = _.keys(defaultValues);
    var procData = data || {};
    defaultKeys.forEach(function (key) {
        if(!procData[key]) {
            procData[key] = defaultValues[key]
        }
    });
    return procData
};


/*
    Input
 */

yfInputField = function (data) {
    yfBaseField.call(this, data);
};

yfInputField.prototype = Object.create(yfBaseField.prototype);
yfInputField.prototype.constructor = yfInputField;

/*
    TextArea
 */


yfTextAreaField = function (data) {
    this.procData = this.setDefaults(textAreaCallbacks, data );
    yfBaseField.call(this, data);

};

yfTextAreaField.prototype = Object.create(yfBaseField.prototype);
yfTextAreaField.prototype.constructor = yfTextAreaField;
