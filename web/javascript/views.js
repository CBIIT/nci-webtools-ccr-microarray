app.MainView = Backbone.View.extend({
    el: 'body',
    initialize: function() {
        this.template = _.template(app.templates.get('main'));
        this.render.apply(this);
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        app.models.inputs = new app.InputsModel({
            parent: this.$el
        });
        app.views.inputs = new app.InputsView({
            model: app.models.inputs
        });
    }
});

app.InputsView = Backbone.View.extend({
    el: '#map-inputs',
    initialize: function() {
        this.template = _.template(app.templates.get('inputs'));
        this.model.on({
            'change:project_id': this.showAnalysisType,
            'change:analysis_type': this.showFiles
        }, this);
        this.render.apply(this);
    },
    events: {
        'keyup input[type="text"]': 'restrictCharacters',
        'change select': app.events.updateModel
    },
    restrictCharacters: function(e) {
        $(e.target).val($(e.target).val().replace(/[^A-Za-z0-9._]/g,''));
        app.events.updateModel.call(this,e);
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    },
    showAnalysisType: function() {
        if (this.model.get('project_id') == '') {
            this.$el.find('[name="analysis_type"]')[0].selectedIndex = 0;
            this.model.set('analysis_type',"");
        }
        this.$el.find('[name="analysis_type"]').parent().toggleClass('show',this.model.get('project_id') !== '');
    },
    showFiles: function() {
        var type = this.model.get('analysis_type');
        if (app.views.files) app.views.files.remove();
        app.models.files = new app.FilesModel();
        switch (type) {
            case 'CEL':
                app.views.files = new app.CelsView({
                    model: app.models.files
                });
                break;
            case 'GEO':
                app.views.files = new app.GeoView({
                    model: app.models.files
                });
                break;
            default:
        }
    }
});

app.CelsView = Backbone.View.extend({
    el: '#map-files',
    initialize: function() {
        this.template = _.template(app.templates.get('cels'));
        this.model.on({
            'change:files': this.renderGrouping
        }, this);
        this.render.apply(this);
    },
    remove: function() {
        this.removeChildren.apply(this);
        this.$el.children().remove();
        var uploadView = this.model.get('uploadView');
        if (uploadView) uploadView.remove();
        this.model.set({
            uploadModel: null,
            uploadView: null
        }, {silent: true});
    },
    removeChildren: function() {
        if (app.views.grouping) app.views.grouping.remove();
        if (app.models.grouping) delete app.models.grouping;
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        var model = new app.UploadModel({
                accepts: '.cel',
                input: this.model,
                multiple: true,
                name: 'files'
            }),
            view = new app.UploadView({
                el: this.$el.find('#map-upload'),
                model: model
            });
        this.model.set({
            uploadModel: model,
            uploadView: view
        }, {silent: true});
    },
    renderGrouping: function() {
        var files = this.model.get('files');
        if (files.length < 2) {
            this.removeChildren.apply(this);
            if (files.length == 1) {
                new app.BootstrapDialogView({
                    model: new app.BootstrapDialogModel({
                        message: "You need at least 2 files to do a comparison.",
                        title: "Error"
                    })
                });        
            }
        } else {
            app.models.grouping = new app.GroupingModel({
                files: this.model.get('files').map((file) => {
                    return {
                        file: file,
                        group: null
                    }
                }),
                tableOrder: ['file', 'group']
            });
            app.views.grouping = new app.GroupingView({
                model: app.models.grouping
            });
        }
}
});

app.UploadView = Backbone.View.extend({
    initialize: function(e) {
        this.template = _.template(app.templates.get('upload'));
        this.render.apply(this);
    },
    events: {
        'change input': 'updateModel'
    },
    updateModel: function(e) {
        var input = e.target.files,
            arr = [];
        for (var i = 0; i < input.length; i++) {
            arr.push(e.target.files[i].name);
        }
        if (this.model.get('multiple')) {
            this.model.get('input').set(this.model.get('name'),arr);
        } else {
            this.model.get('input').set(this.model.get('name'),arr[0]);
        }
    },
    remove: function() {
        this.model.get('input').set(this.model.get('name'),[]);
        this.$el.children().remove();
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    }
});

app.GeoView = Backbone.View.extend({
    el: '#map-files',
    initialize: function() {
        this.template = _.template(app.templates.get('geo'));
        this.render.apply(this);
    },
    events: {
        'keyup input': app.events.updateModel,
        'click button': 'loadGSE'
    },
    loadGSE: function(e) {
        var $that = this;
        this.model.fetch({
            method: 'POST',
            data: {
                'gsecode': this.model.get('gsecode')
            }
        }).done(function() {
            app.models.grouping = new app.GroupingModel({
                files: $that.model.get('files'),
                tableOrder: $that.model.get('tableOrder')
            });
            app.views.grouping = new app.GroupingView({
                model: app.models.grouping
            });
        });
    },
    remove: function() {
        this.$el.children().remove();
        if (app.views.grouping) app.views.grouping.remove();
        if (app.models.grouping) delete app.models.grouping;
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    }
});

app.GroupingView = Backbone.View.extend({
    el: '#map-grouping',
    initialize: function() {
        this.template = _.template(app.templates.get('grouping'));
        this.model.on({
            'change:applying': this.renderApply,
            'change:files': this.renderPreFlight,
            'change:group_name': this.renderApply
        }, this);
        this.render.apply(this);
    },
    events: {
        'keyup input': app.events.updateModel,
        'click tbody tr': 'selectRow',
        'click button[name="apply"]': 'applyGroup'
    },
    selectRow: function(e) {
        var row = this.model.get('table').row(e.currentTarget);
        if (this.model.get('applying')) {
            var group_name = this.model.get('group_name');
            row.data().group = group_name;
            row.invalidate().draw('page');
            this.model.trigger('change:files');
        } else {
            if ($(row.node()).hasClass('selected')) {
                row.deselect();
            } else {
                row.select();
            }
        }
    },
    applyGroup: function(e) {
        var table = this.model.get('table'),
            group_name = this.model.get('group_name'),
            rows = table.rows({selected: true});
        if (rows[0].length > 0) {
            rows.data().map(function(e) { e.group = group_name; });
            rows.invalidate().draw('page').deselect();
            this.model.trigger('change:files');
        } else {
            this.model.set('applying',!this.model.get('applying'));
        }
    },
    remove: function() {
        this.model.get('table').destroy(true);
        this.$el.children().remove();
        if (app.views.preflight) app.views.preflight.remove();
        if (app.models.preflight) delete app.models.preflight;
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        this.model.set('table',this.$el.find('#map-grouping-table').DataTable({
            data: this.model.get('files'),
            columns: this.model.get('tableOrder').map(function(entry) { return {title:entry,data:entry}; })
        }));
        app.models.preflight = new app.PreFlightModel();
        app.views.preflight = new app.PreFlightView({
            model: app.models.preflight
        });
        this.model.set('preflightModel',app.models.preflight);
    },
    renderApply: function() {
        var applying = this.model.get('applying');
        this.$el.find('[name="group_name"]').prop('disabled',applying);
        this.$el.find('button[name="apply"]')
            .toggleClass('active',applying)
            .prop('disabled',this.model.get('group_name') == '');
    },
    renderPreFlight: function() {
        var groups = this.model.get('files').filter((file) => file.group).map((file) => file.group),
            unique = {};
        for (var index in groups) {
            unique[groups[index]] = true;
        }
        groups = [];
        for (var prop in unique) {
            groups.push(prop);
            groups.sort();
        }
        this.model.get('preflightModel').set('groups',groups);
    }
});

app.PreFlightView = Backbone.View.extend({
    el: '#map-preflight',
    initialize: function() {
        this.template = _.template(app.templates.get('preflight'));
        this.model.on({
            'change:groups': this.render,
            'change': this.renderXYZ
        }, this);
        this.render.apply(this);
    },
    events: {
        'change select': app.events.updateModel,
        'keyup input': app.events.updateModel,
        'click button[name="runXYZ"]': 'runXYZ'
    },
    runXYZ: function() {
        var resultsModel = app.models.results = new app.ResultsModel({
            gsecode: app.models.files.get('gsecode'),
            files: this.model.get('files')
        });
        resultsModel.save().done(() => {
            console.log(resultsModel.attributes);
        });
    },
    remove: function() {
        this.$el.children().remove();
    },
    render: function() {
        if (!this.model.get('groups').includes(this.model.get('primary_group'))) {
            this.model.set('primary_group',"");
        }
        if (!this.model.get('groups').includes(this.model.get('contrast_group'))) {
            this.model.set('contrast_group',"");
        }
        this.$el.html(this.template(this.model.attributes));
    },
    renderXYZ: function() {
        var groups = this.model.get('groups'),
            primary_group = this.model.get('primary_group'),
            contrast_group = this.model.get('contrast_group');
        this.$el.find('button[name="runXYZ"]').prop('disabled',!(groups.includes(primary_group) && groups.includes(contrast_group) && (primary_group != contrast_group)));
    }
});

app.BootstrapDialogView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    events: {
        'hidden.bs.modal': 'remove',
        'click .modal-footer button:not(.create)': 'close'
    },
    close: function(e) {
        e.preventDefault();
        this.$modal.close();
    },
    render: function() {
        this.$modal = BootstrapDialog.show({
            buttons: [{
                'cssClass': 'btn-primary',
                'label': "Close"
            }],
            closable: true,
            message: this.model.get('message'),
            title: this.model.get('title')
        });
        this.setElement(this.$modal.getModal());
    }
});
