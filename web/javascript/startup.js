var app = {
    events: {
        updateModel: function (e) {
            var e = $(e.target);
            if (e.attr('type') == 'checkbox') {
                this.model.set(e.attr('name') || e.attr('id'), e.prop('checked'));
            } else {
                this.model.set(e.attr('name') || e.attr('id'), !e.hasClass('selectized') ? e.val() : e.val().length > 0 ? e.val().split(',') : []);
            }
        }
    },
    functions: {
        histRtoJS: function(data) {
            var reorder = Array(data.x[0].length);
            for (var i = 0; i < reorder.length; i++) {
                reorder[i] = {
                    x:[],
                    y:[],
                    mode: 'markers',
                    type: 'scatter'
                };
            }
            for (var i = 0; i < data.x.length; i++) {
                for (var j = 0; j < data.x[i].length; j++) {
                    reorder[j].x.push(data.x[i][j]);
                    reorder[j].y.push(data.y[i][j]);
                }
            }
            return reorder;
        },
        boxRtoJS: function(data) {
            var reorder = Array(Object.keys(data).length);
            var i = 0;
            for (var prop in data) {
                reorder[i++] = {
                    y: data[prop],
                    name: prop,
                    type: 'box'
                }
            }
            return reorder;
        }
    },
    models: {},
    views: {}
};
