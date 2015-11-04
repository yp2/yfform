"use strict";

Template.yfInputF.helpers({
    getParams () {
        return yfForm.fieldParams(this, Template.instance());
    },

    error () {
       // todo save error change
        let t = Template.instance(),
            error = t.fieldError.get(),
            form;

        if (t.data.form) {
            form = t.data.form

        } else if (t.formTmpl) {
            form = t.formTmpl.data.form
        }

        if (error) {
            if (form && form.fields) {
                let field = form.fields[t.data.field];
                if (error.error === 'validation') {
                    yfForm.runFieldCallbacks(t, field.errorCallbacks)
                } else if (error.error === 'save') {
                    yfForm.runFieldCallbacks(t,field.saveErrorCallbacks)
                }

            }
            return error.reason
        }
    }
});

Template.yfInputF.events({
    //'keyup input, change input': _.debounce(function(e, t){
    'keyup input': _.debounce(function(e, t){
        yfForm.processField(e,t);
    }, 500 )

});

Template.yfInputF.onCreated(function () {
    var self = this;

    self.formTmpl = yfForm.getFormTemplate();
    self.fieldError = new ReactiveVar(null);

    self.autorun(function () {
        if (self.formTmpl) {
            let formFieldError = self.formTmpl.fieldsErrors.get(self.data.field);
            if (formFieldError) {
                self.fieldError.set(formFieldError);
            }
        }
    })

});

Template.yfInputF.onRendered(function () {
    //add your statement here
});

Template.yfInputF.onDestroyed(function () {
    //add your statement here
});

