/**
 * Created by daniel on 06.10.15.
 */
_ = lodash;

var defaultCallbacks = {
    successCallbacks: [function (t) {
        console.log('default callback', t);
        t.$("input").closest('.form-group').removeClass("has-error has-feedback").addClass('has-success has-feedback').delay(2000).queue(function () {
            $(this).removeClass('has-success').dequeue()
        });

        t.$(".yfForm.error-feedback").hide();
        t.$(".yfForm.success-feedback").fadeIn(100).delay(1800).fadeOut(100)
    }],
    errorCallbacks: [function (t) {
        t.$("input").closest('.form-group').removeClass("has-success has-feedback").addClass('has-error has-feedback');
        t.$(".yfForm.success-feedback").hide();
        t.$(".yfForm.save-block").hide();
        t.$(".yfForm.error-feedback").show();
    }],
    saveSuccessCallbacks: [function (t) {
        t.$(".yfForm.save-block").fadeIn(300).delay(1800).fadeOut(100);
    }],
    saveErrorCallbacks: [function (t) {
        t.$("input").closest('.form-group').removeClass("has-success has-feedback").addClass('has-error has-feedback');
        t.$(".yfForm.success-feedback").hide();
        t.$(".yfForm.save-block").hide();
        t.$(".yfForm.error-feedback").show();
    }]
};

var textAreaCallbacks = {
    successCallbacks: [function (t) {
        console.log('text callback', t);
        t.$("textarea").closest('.form-group').removeClass("has-error has-feedback").addClass('has-success has-feedback').delay(2000).queue(function () {
            $(this).removeClass('has-success').dequeue()
        });

        t.$(".yfForm.error-feedback").hide();
        t.$(".yfForm.success-feedback").fadeIn(100).delay(1800).fadeOut(100)
    }],
    errorCallbacks: [function (t) {
        t.$("textarea").closest('.form-group').removeClass("has-success has-feedback").addClass('has-error has-feedback');
        t.$(".yfForm.success-feedback").hide();
        t.$(".yfForm.save-block").hide();
        t.$(".yfForm.error-feedback").show();
    }],
    saveSuccessCallbacks: [function (t) {
        t.$(".yfForm.save-block").fadeIn(300).delay(1800).fadeOut(100);
    }],
    saveErrorCallbacks: [function (t) {
        t.$("textarea").closest('.form-group').removeClass("has-success has-feedback").addClass('has-error has-feedback');
        t.$(".yfForm.success-feedback").hide();
        t.$(".yfForm.save-block").hide();
        t.$(".yfForm.error-feedback").show();
    }]
};

yfBaseField = function (data) {
    this.procData = this.setDefaults(data, defaultCallbacks);

    this.validators = this.procData.validators || [];
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
        this.successCallbacks = validators
    } else if (callbacks.constructor === Function) {
        this.successCallbacks.push(callbacks)
    }
};

yfBaseField.prototype.addErrorCallbacks = function (callbacks) {
    if (callbacks.constructor === Array) {
        this.errorCallbacks = validators
    } else if (callbacks.constructor === Function) {
        this.errorCallbacks.push(callbacks)
    }
};

yfBaseField.prototype.addSaveSuccessCallbacks = function (callbacks) {
    if (callbacks.constructor === Array) {
        this.saveSuccessCallbacks = validators
    } else if (callbacks.constructor === Function) {
        this.saveSuccessCallbacks.push(callbacks)
    }
};

yfBaseField.prototype.addSaveErrorCallbacks = function (callbacks) {
    if (callbacks.constructor === Array) {
        this.saveErrorCallbacks = validators
    } else if (callbacks.constructor === Function) {
        this.saveErrorCallbacks.push(callbacks)
    }
};

yfBaseField.prototype.setDefaults = function (data, defaultValues) {
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
    this.procData = this.setDefaults(data, textAreaCallbacks);
    yfBaseField.call(this, data);

};

yfTextAreaField.prototype = Object.create(yfBaseField.prototype);
yfTextAreaField.prototype.constructor = yfTextAreaField;
