"use strict";

Template.yfForm.helpers({
    yfFormCanSubmit () {
        let errors = Template.instance().fieldsErrors.all();
        return !!(_.keys(errors).length)
    },
    yfObj () {
        return Template.instance().data.obj;
    },
    getParams () {
        let omitElements = ['method', 'form', 'collection', 'obj'];
        return _.omit(this, omitElements);

    }

});

Template.yfForm.events({
    'submit form' (e,t) {
        e.preventDefault();

        //fields validation on submit
        let formObj = t.data.form;
        if (formObj && formObj.fields) {
            let fieldsList = _.keys(t.fields.all()); // registered form fields
            for (let i = 0; i < fieldsList.length; i++ ){
                let fieldName =  fieldsList[i];
                let formObjField = formObj.fields[fieldName];
                let formFieldValue = t.fieldsVal.get(fieldName) || (t.fields.get(fieldName) ? t.fields.get(fieldName).params.value: null);
                try {
                    let val = formObj.validateField(fieldName, formFieldValue);
                    t.fieldsVal.set(fieldName, val);

                } catch (error) {
                    t.fieldsErrors.set(fieldName, error);
                }
            }
        }
        
        let dataForMethod = {
            obj: t.data.obj || {},
            fields : t.fields.all(),
            fieldsValues : t.fieldsVal.all(),
            fieldsErrors : t.fieldsErrors.all(),
            formFields : t.data.form ? t.data.form.fields : {},
            collection : t.data.collection || ""
        };

        // walidacja dataForMethod
        console.log('gggg', t.fieldsErrors.all());
        if (!_.keys(t.fieldsErrors.all()).length && t.data.method) {

            yfForm.runFormCallbacks(t, formObj.successCallbacks);

            Meteor.call(t.data.method, dataForMethod, function (error, result) {
                if (error) {
                    yfForm.runFormCallbacks(t, formObj.saveErrorCallbacks);
                    if (error.reason.field) {
                        t.fieldsErrors.set(error.reason.field, new Meteor.Error('save', error.reason.reason));
                    } else {
                        console.log(error);
                    }

                }

                if (result) {
                    //run form succes save callback
                    yfForm.runFormCallbacks(t, formObj.saveSuccessCallbacks);
                }
            });
        } else {
            yfForm.runFormCallbacks(t, formObj.errorCallbacks);
        }

    }
});

Template.yfForm.onCreated(function () {
    let self = this;
    self.varReact = new ReactiveVar();

    self.fields = new ReactiveDict();
    self.fieldsVal = new ReactiveDict();
    self.fieldsErrors = new ReactiveDict();
    
    self.autorun(function () {

        if (!self.data.obj) {
            self.data.obj = {};
        }

        let fieldList = _.keys(self.fields.all());
        for (let i = 0; i < fieldList.length; i++) {
            let fieldName = fieldList[i];
            let fieldValue;

            if (self.data.obj) {
                fieldValue = self.data.obj[fieldName];
            } else {
                self.fieldsVal.delete(fieldName);
                self.fieldsErrors.delete(fieldName);
            }
            if (fieldValue) {
                self.fieldsVal.set(fieldName, fieldValue);
                self.fieldsErrors.delete(fieldName);
            }
        }
    })
});

Template.yfForm.onRendered(function () {
    let self = this;
});

Template.yfForm.onDestroyed(function () {
    //add your statement here
});

