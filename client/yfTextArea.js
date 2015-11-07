"use strict";

Template.yfTextArea.helpers({
    getParams () {
        let params = yfForm.fieldParams(this, Template.instance());
        params.rows = this.rows || 3;
        params.cols = this.cols || null;
        return params;
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

let debEvent = _.debounce(function (e, t) {
    yfForm.processField(e,t);
}, 500);

Template.yfTextArea.events({
    'keyup textarea': function(e, t){
        if (!t.formTmpl) {
            debEvent(e,t)
        } else {
            yfForm.processField(e,t, false);
        }
    },
    'blur input': function (e, t) {
        yfForm.processField(e, t, false);
    }
});

Template.yfTextArea.onCreated(function () {
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

Template.yfTextArea.onRendered(function () {
    //add your statement here
});

Template.yfTextArea.onDestroyed(function () {
    //add your statement here
});

