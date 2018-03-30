let sync = Backbone.sync
Backbone.sync = function() {
    $('#spinner').addClass('show');
    return sync.apply(this,arguments).fail((resp) => {
        var resp = resp.responseJSON;
        new app.BootstrapDialogView({
            model: new app.BootstrapDialogModel({
                message: resp.error||resp,
                title: "Error"
            })
        });
    }).always(() => {
        $('#spinner').removeClass('show');
    });
}

app.TemplatesModel = Backbone.Model.extend({
    defaults: {},
    fetch: function() {
        var $that = this,
            templateList = ["main","inputs","upload","cels","geo","grouping","preflight","results"],
            templateObject = {},
            deferred = $.Deferred(),
            after = _.after(templateList.length,function() {
                $that.set(templateObject);
                deferred.resolve();
            });
        _.each(templateList,function(templateName) {
            $.get('templates/'+templateName+'.html').done(function(response) {
                templateObject[templateName] = response;
                after();
            });
        });
        return deferred;
    }
});

app.MainModel = Backbone.Model.extend({
    defaults: {
    }
});

app.InputsModel = Backbone.Model.extend({
    defaults: {
        parent: {},
        project_id: "",
        analysis_type: "",
        cel_files: []
    }
});

app.UploadModel = Backbone.Model.extend({
    defaults: {
        parent: {},
        input: {},
        name: "",
        multiple: false,
        accepts: null
    }
});

app.FilesModel = Backbone.Model.extend({
    defaults: {
        files: [],
        tableOrder: []
    },
    url: '/GSE',
    parse: function(resp) {
        resp.files.map(function(entry) {
            for (var prop in entry) {
                entry[prop] = entry[prop].split("")
                    .map(function (char) {
                        var charCode = char.charCodeAt(0);
                        return charCode > 127 ? '&#'+charCode+';' : char;
                    }).join("");
            }
            entry.group = null;
        });
        resp.tableOrder.push('group');
        console.log(resp);
        return resp;
    }
});

app.GroupingModel = Backbone.Model.extend({
    defaults: {
        applying: false,
        files: [],
        group_name: '',
        table: [],
        tableorder: []
    }
});

app.PreFlightModel = Backbone.Model.extend({
    defaults: {
        groups: [],
        primary_group: "",
        contrast_group: "",
        pvalue_degs: 0.05,
        fold_degs: 1.5,
        pvalue_pathways: 0.05,
        gene_set: "",
        pvalue_ssgsea: 1,
        fold_ssgsea: 0
    }
});

app.ResultsModel = Backbone.Model.extend({
    defaults: {
        rawbox: {},
        rawhist: [],
        rmabox: {},
        rmahist: []
    },
    url: '/runXYZ',
    parse: function(resp) {
        resp.rawhist = app.functions.histRtoJS(resp.rawhist);
        resp.rmahist = app.functions.histRtoJS(resp.rmahist);
        resp.rawbox = app.functions.boxRtoJS(resp.rawbox);
        resp.rmabox = app.functions.boxRtoJS(resp.rmabox);
        console.log(resp);
        return resp;
    }
});

app.PlotModel = Backbone.Model.extend({
    defaults: {
        data: [],
        title: "",
        xtitle: "",
        ytitle: ""
    }
});

app.BootstrapDialogModel = Backbone.Model.extend({
    defaults: {
        message: "",
        title: ""
    }
});
