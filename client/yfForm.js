"use strict";

Template.yfForm.helpers({
    canSubmit () {
        let errors = Template.instance().fieldsErrors.all();
        return !!(_.keys(errors).length)
    },
    yfObj () {
        return Template.instance().data.obj;
    },
    context () {
        let errors = Template.instance().fieldsErrors.all();
        let ctx = {
            objForm : Template.instance().data.obj,
            yfFormCanSubmit : !!(_.keys(errors).length)
        }
        console.log('ctx =', ctx);
        return ctx
    }

});

Template.yfForm.events({
    'submit form' (e,t) {
        e.preventDefault();
        // to można dać walidację mamy self.fields, self.data.form (walidatory jęzeli są ), self.fieldsVal
        // i self.fieldsError.

        //data validation
        let formObj = t.data.form;
        if (formObj && formObj.fields) {
            let fieldsList = _.keys(t.fields.all()); // registed form fields
            for (let i = 0; i < fieldsList.length; i++ ){
                let fieldName =  fieldsList[i];
                let formObjField = formObj.fields[fieldName];
                let formFieldValue = t.fieldsVal.get(fieldName) || (t.fields.get(fieldName) ? t.fields.get(fieldName).params.value: null);

                try {
                    let val = formObj.validateField(fieldName, formFieldValue);
                    t.fieldsVal.set(fieldName, val);

                } catch (error) {
                    // trzeba to przenieść do pola.
                    yfForm.runFieldCallbacks(t, formObjField.errorCallbacks);
                    t.fieldsErrors.set(fieldName, error);
                    console.log(error);
                }
            }
        }
        
        let dataForMethod = {
            obj: t.data.obj || {},
            fields : t.fields.all(),
            fieldsValue : t.fieldsVal.all(),
            fieldsError : t.fieldsErrors.all(),
            formFields : t.data.form ? t.data.form.fields : {},
            //collection : t.data.form ? t.data.form.collection:  null
        };

        // walidacja dataForMethod
        if (!_.keys(t.fieldsErrors.all()).length && t.data.method) {
            console.log('run method, data:', dataForMethod);
            Meteor.call(t.data.method, dataForMethod, function (error, result) {
                if (error) {
                    console.log('save error', error);
                }
                // set error na podstawie zwracanego błędu

                if (result) {
                    console.log('save success');
                }
            });
        } else {
            console.log('run validation error form callbacks');
        }

        console.log('submit');

    }
});

Template.yfForm.onCreated(function () {
    let self = this;
    self.varReact = new ReactiveVar();

    self.fields = new ReactiveDict();
    self.fieldsVal = new ReactiveDict();
    self.fieldsErrors = new ReactiveDict();
    let collection = window[self.data.collection || self.data.form.collection];
    
    self.autorun(function () {
        self.data.obj = collection.findOne(self.data.obj._id);
        // jak zmienia się obiekt musimy zmieniać wartości dla pól w fieldsVal - inaczej zapisuje
        // stare dane po submicie

        console.log('form yfForm temp', self.data.obj);
        //console.log('reg fields: ', self.fields);
        //console.log('reg fields: ', self.fields.all());
        //console.log('fields val', self.fieldsVal.all());
        //console.log('fields error', self.fieldsErrors.all());

    })
});

Template.yfForm.onRendered(function () {
    let self = this;
});

Template.yfForm.onDestroyed(function () {
    //add your statement here
});

