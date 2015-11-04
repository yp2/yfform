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
                //let formFieldValue = t.fieldsVal.get(fieldName) || (t.fields.get(fieldName) ? t.fields.get(fieldName).params.value: null);
                let formFieldValue = t.fieldsVal.get(fieldName);
                try {
                    let val = formObj.validateField(fieldName, formFieldValue);
                    t.fieldsVal.set(fieldName, val);
                    yfForm.runFieldCallbacks(t, formObjField.successCallbacks);
                } catch (error) {
                    if (!formFieldValue) {
                        t.fieldsVal.set(fieldName, null);
                    }
                    t.fieldsVal.set(fieldName, formFieldValue);
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
            collection : t.data.collection || "",
            formElementData: t.$("form").data() || {}
        };
        //TODO: clean form after successful save based on option (t.fieldsVal, t.fields)
        // validation dataForMethod
        if (!_.keys(t.fieldsErrors.all()).length && t.data.method) {

            yfForm.runFormCallbacks(t, formObj.successCallbacks);

            if (typeof t.data.method === "string") {
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
                        //TODO: po insercie możemy zwaraca obiekt i podstawić go pod data.obj
                        //
                        //run form success save callback
                        //t.data.obj = {title: 'gggg'};
                        yfForm.runFormCallbacks(t, formObj.saveSuccessCallbacks);
                    }
                });
            } else {
                try {
                    t.data.method(dataForMethod);
                    //run form success save callback
                    yfForm.runFormCallbacks(t, formObj.saveSuccessCallbacks);

                } catch (error) {
                    yfForm.runFormCallbacks(t, formObj.saveErrorCallbacks);

                    if (error.reason && error.reason.field) {
                        t.fieldsErrors.set(error.reason.field, new Meteor.Error('save', error.reason.reason));
                    } else {
                        console.log(error);
                    }
                }
            }
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
    })
    
    //self.autorun(function () {
    //
    //    if (!self.data.obj) {
    //        self.data.obj = {};
    //    }
    //    let fieldList = _.keys(self.fields.all());
    //    for (let i = 0; i < fieldList.length; i++) {
    //        let fieldName = fieldList[i];
    //        let fieldValue;
    //
    //        if (self.data.obj) {
    //            fieldValue = self.data.obj[fieldName];
    //        } else {
    //            self.fieldsVal.delete(fieldName);
    //            self.fieldsErrors.delete(fieldName);
    //        }
    //        if (fieldValue) {
    //            //console.log('set value', fieldName, fieldValue);
    //            self.fieldsVal.set(fieldName, fieldValue);
    //            self.fieldsErrors.delete(fieldName);
    //        }
    //    }
    //})
});

Template.yfForm.onRendered(function () {
    let self = this;
});

Template.yfForm.onDestroyed(function () {
    //add your statement here
});

