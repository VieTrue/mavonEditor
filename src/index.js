/**
 * Created by zhy on 2017/4/1.
 */
'use strict';

/**
 * mavonEditor
 * @author hinesboy
 */
// const mavonEditor = require('./mavon-editor.vue');
const viewEditor = require('./mavon-editor-view-min.vue');
const VueMavonEditor = {
    // markdownIt: mavonEditor.mixins[0].data().markdownIt,
    // mavonEditor: mavonEditor,
    viewEditor: viewEditor,
    // LeftToolbar: require('./components/md-toolbar-left'),
    // RightToolbar: require('./components/md-toolbar-right'),
    install: function(Vue) {
        // Vue.component('mavon-editor', mavonEditor);
        Vue.component('view-editor', viewEditor);
    }
};

module.exports = VueMavonEditor;