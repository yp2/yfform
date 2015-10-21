/**
 * Created by daniel on 18.10.15.
 */
Blaze.TemplateInstance.prototype.parentTemplate = function (levels) {
    var view = Blaze.currentView;
    if (typeof levels === "undefined") {
        levels = 1;
    }
    while (view) {
        if (view.name.substring(0, 9) === "Template." && !(levels--)) {
            return view.templateInstance();
        }
        view = view.parentView;
    }
};
