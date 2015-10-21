"use strict";

Template.yfInput.helpers({
    getParams () {
        console.log('helper this', this);
        //console.log('zz', this.obj = Template.instance().data.obj);

        return yfForm.fieldParams(this, Template.instance());
    },

    error () {
        //todo przenieść runFieldCallback errors tu - walidacja oraz zapiswyanie błędy
        // podzielić błedy na validation ora save dla rozróżnienia callbacków. Callback na form będą inne.
        let t = Template.instance(),
            error = t.fieldError.get();

        if (error) {
            return error.reason
        }
    }
});

Template.yfInput.events({
    //'keyup input, change input': _.debounce(function(e, t){
    'keyup input': _.debounce(function(e, t){
        yfForm.processField(e,t);
    }, 500 )
});

Template.yfInput.onCreated(function () {
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

Template.yfInput.onRendered(function () {
    //add your statement here
});

Template.yfInput.onDestroyed(function () {
    //add your statement here
});

