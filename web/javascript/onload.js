$(function() {
    app.templates = new app.TemplatesModel();
    app.templates.fetch().done(function() {
        app.views.main = new app.MainView();
    });
});
