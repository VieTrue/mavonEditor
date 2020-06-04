/**
 * @Author: HuaChao Chen <chc>
 * @Date:   2017-06-14T23:04:34+08:00
 * @Email:  chenhuachaoxyz@gmail.com
 * @Filename: extra-function.js
 * @Last modified by:   CHC
 * @Last modified time: 2017-12-19T17:46:48+08:00
 * @License: MIT
 * @Copyright: 2017
 */

/**
 * Created by zhy on 2017/4/24.
 */


export function loadScript(src, callback) {
    if (!(typeof callback === 'function')) {
        callback = function() {};
    }
    var check = document.querySelectorAll("script[src='" + src + "']");
    if (check.length > 0) {
        check[0].addEventListener('load', function() {
            callback();
        });
        callback();
        return;
    }
    var script = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.src = src;
    if (script.addEventListener) {
        script.addEventListener('load', function() {
            callback();
        }, false);
    } else if (script.attachEvent) {
        script.attachEvent('onreadystatechange', function() {
            var target = window.event.srcElement;
            if (target.readyState === 'loaded') {
                callback();
            }
        });
    }
    head.appendChild(script);
}

// <link href="https://cdn.bootcss.com/highlight.js/9.12.0/styles/agate.min.css" rel="stylesheet">
export function loadLink(src, callback) {
    if (!(typeof callback === 'function')) {
        callback = function() {};
    }
    var check = document.querySelectorAll("link[href='" + src + "']");
    if (check.length > 0) {
        callback();
        return;
    }
    var link = document.createElement('link');
    var head = document.getElementsByTagName('head')[0];
    link.rel = 'stylesheet';
    link.href = src;
    if (link.addEventListener) {
        link.addEventListener('load', function() {
            callback();
        }, false);
    } else if (link.attachEvent) {
        link.attachEvent('onreadystatechange', function() {
            var target = window.event.srcElement;
            if (target.readyState === 'loaded') {
                callback();
            }
        });
    }
    head.appendChild(link);
}

export const ImagePreviewListener = ($vm) => {
    // vShowContent
    $vm.$refs.vShowContent.addEventListener('click', function(event) {
        event = event ? event : window.event;
        let ele = event.srcElement ? event.srcElement : event.target;
        if (ele.tagName === 'IMG') {
            if ($vm.imageClick != null) {
                // 覆盖图片点击事件
                $vm.imageClick(ele);
            } else {
                $vm.d_preview_imgsrc = ele.src;
            }
        }
    })
}