<template>
    <div class="shadow v-note-wrapper markdown-body">
        <div ref="vShowContent" v-html="d_render" class="v-show-content" id="vShowContent"></div>
        <div id="f-data" style="display:none;"></div>
        <!--编辑展示区域-->
        <!-- <div class="v-note-panel">
            <div class="v-note-show single-show">
                <div ref="vShowContent" v-html="d_render" class="v-show-content" id="vShowContent"></div>
                <div id="f-data" style="display:none;"></div>
            </div>
        </div> -->
        <!-- 预览图片 -->
        <transition name="fade">
            <div @click="d_preview_imgsrc=null" class="v-note-img-wrapper" v-if="d_preview_imgsrc">
                <img :src="d_preview_imgsrc" alt="none">
            </div>
        </transition>
    </div>
</template>

<script>
import $ from "jquery";
import hljsCss from './lib/core/hljs/lang.hljs.css.js'
// import hljsLangs from './lib/core/hljs/lang.hljs.js'
// const xss = require('xss');
import {
    loadLink,
    loadScript,
    ImagePreviewListener
} from './lib/core/extra-function.js'
import hljs from './lib/core/highlight.js'
import markdown from './lib/mixins/markdown.js'

import "./lib/font/css/fontello.css"
import './lib/css/md.css'
export default {
    mixins: [markdown],
    props: {
        value: { // 初始 value
            type: String,
            default: ''
        },
        codeStyle: { // <code></code> 样式
            type: String,
            default() {
                return 'github';
            }
        },
        ishljs: {
            type: Boolean,
            default: true
        },
        externalLink: {
            type: [Object, Boolean],
            default: true
        }
    },
    data() {
        return {
            d_value: '',// props 文本内容
            d_render: '',// props 文本内容render
            d_preview_imgsrc: null, // 图片预览地址
            s_external_link: {
                markdown_css: function() {
                    // return '/static/css/github-markdown.min.css';
                    return 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.9.0/github-markdown.min.css';
                },
                hljs_js: function() {
                    return '/static/js/highlight.min.js';
                    // return 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js';
                },
                hljs_css: function(css) {
                    if (hljsCss[css]) {
                        // return '/static/css/github.min.css';
                        return 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css';
                    }
                    return '';
                },
                katex_js: function() {
                    // return '/static/js/katex.min.js';
                    return 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.8.3/katex.min.js';
                },
                katex_css: function() {
                    // return '/static/css/katex.min.css';
                    return 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.8.3/katex.min.css';
                }
            },
            p_external_link: {},
        };
    },
    created() {
        var $vm = this;
        // 初始化语言
        this.initExternalFuc();
    },
    mounted() {
        var $vm = this;
        // 图片预览事件监听
        ImagePreviewListener(this);
        this.d_value = this.value;
        this.loadExternalLink('markdown_css', 'css');
        this.loadExternalLink('katex_css', 'css')
        this.loadExternalLink('katex_js', 'js', function() {
            $vm.iRender(true);
        })
        this.loadExternalLink('hljs_js', 'js', function() {
            $vm.iRender(true);
        })

        if (!(typeof $vm.externalLink === 'object' && typeof $vm.externalLink['markdown_css'] === 'function')) {
            // 没有外部文件要来接管markdown样式，可以更改markdown样式。
            $vm.codeStyleChange($vm.codeStyle, true)
        }
    },
    methods: {
        loadExternalLink(name, type, callback) {
            if (typeof this.p_external_link[name] !== 'function') {
                if (this.p_external_link[name] != false) {
                    console.error('external_link.' + name, 'is not a function, if you want to disabled this error log, set external_link.' + name, 'to function or false');
                }
                return;
            }
            var _obj = {
                'css': loadLink,
                'js': loadScript
            };
            if (_obj.hasOwnProperty(type)) {
                _obj[type](this.p_external_link[name](), callback);
            }
        },
        initExternalFuc() {
            var $vm = this;
            var _external_ = ['markdown_css', 'hljs_js', 'hljs_css', 'katex_js', 'katex_css'];
            var _type_ = typeof $vm.externalLink;
            var _is_object = (_type_ === 'object');
            var _is_boolean = (_type_ === 'boolean');
            for (var i = 0; i < _external_.length; i++) {
                if ((_is_boolean && !$vm.externalLink) || (_is_object && $vm.externalLink[_external_[i]] === false)) {
                    $vm.p_external_link[_external_[i]] = false;
                } else if (_is_object && typeof $vm.externalLink[_external_[i]] === 'function') {
                    $vm.p_external_link[_external_[i]] = $vm.externalLink[_external_[i]];
                } else {
                    $vm.p_external_link[_external_[i]] = $vm.s_external_link[_external_[i]];
                }
            }
        },
        codeStyleChange(val, isInit) {
            isInit = isInit ? isInit : false;
            if (typeof this.p_external_link.hljs_css !== 'function') {
                if (this.p_external_link.hljs_css != false)
                { console.error('external_link.hljs_css is not a function, if you want to disabled this error log, set external_link.hljs_css to function or false'); }
                return;
            }
            var url = this.p_external_link.hljs_css(val);
            if (url.length === 0 && isInit) {
                console.warn('hljs color scheme', val, 'do not exist, loading default github');
                url = this.p_external_link.hljs_css('github')
            }
            if (url.length > 0) {
                loadLink(url)
            } else {
                console.warn('hljs color scheme', val, 'do not exist, hljs color scheme will not change');
            }
        },
        iRender(toggleChange) {
            var $vm = this;
            this.$render($vm.d_value, function(res) {
                // render
                $vm.d_render = res;
                if (res) {
                    $('#f-data').html(res)
                    if($('#f-data').find('pre>div.hljs>code span')){
                        $('#f-data').find('pre>div.hljs>code').each(function(i,item){
                            if ($(item).text() != '') {
                                $(item).replaceWith('<ol class="'+$(item).attr('class')+'">'+$(item).html()+'</ol>')
                            } else {
                                $(item).parents('div.hljs').parents('pre').remove()
                            }
                        })
                        $vm.d_render = $('#f-data').html();
                        $('#f-data').html('')
                    }
                }
            })
        },
    },
    watch: {
        d_value: function (val, oldVal) {
            this.iRender();
        },
        value: function (val, oldVal) {
            if (val !== this.d_value) {
                this.d_value = val
            }
        },
        codeStyle: function (val) {
            this.codeStyleChange(val)
        }
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
    @import "lib/css/mavon-editor.styl"
</style>
