yfForms
=======

Another form package for Meteor.

Base on Meteor methods to save forms fields, with field validation.

Usage of this package: https://github.com/yp2/intranet

Alpha stage.


### Instalation

```
meteor add yp2:yfform
```

### Usage
Soon...

```
<template name="editForm">
    <!--{{> yfInput obj=this field="title" placeholder="Article title" method="saveArticleTitleNew" form=articleForm }}-->
    {{# yfForm method="saveObjFormMethod" form=articleForm collection="TestColl"}}
        {{> yfInput obj=yfObj field="title" placeholder="Article title" }}
        {{> yfInput obj=yfObj field="content" placeholder="Article Content"}}
        <!--<button type="submit" class="btn btn-default" disabled="{{yfFormCanSubmit}}">Save</button>-->
        <button type="submit" class="btn btn-default">Save insert to TestColl</button>
    {{/ yfForm}}

    {{# yfForm obj=this method="saveArticleFormMethod" form=articleForm collection="WikiArticle"}}
        {{> yfInput obj=yfObj field="title" placeholder="Article title" }}
        {{> yfInput obj=yfObj field="content" placeholder="Article Content"}}
        <!--<button type="submit" class="btn btn-default" disabled="{{yfFormCanSubmit}}">Save</button>-->
        <button type="submit" class="btn btn-default">Save</button>
    {{/ yfForm}}

    "use strict";

    let lengthValidator = (function (length) {
        return function (value) {
            if (value.length >= length){
                return value
            }
            throw new Meteor.Error('validation', "To short");
        }

    })(20);


    let articleFormFields = {
        title: new yfInputField( {
            validators : [yfValidators.required],
            type: String
        }),
        content: new yfInputField({
            validators: [yfValidators.required, lengthValidator],
            type: String
        })
    };

    MyApp.articleForm = new yfForm(articleFormFields, "WikiArticle");

    if (Meteor.isClient){
        Template.registerHelper("articleForm", function () {
            return MyApp.articleForm
        })
    }

```

</template>
