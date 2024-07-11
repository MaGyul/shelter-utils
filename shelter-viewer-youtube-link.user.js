// ==UserScript==
// @name         쉘터 글 유튜브 링크
// @namespace    shelter.id
// @version      1.1.5
// @description  쉘터 글 유튜브에 연결된 링크 클릭시 유튜브 Embed 생성
// @author       MaGyul
// @match        *://shelter.id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shelter.id
// @updateURL    https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-viewer-youtube-link.user.js
// @downloadURL  https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-viewer-youtube-link.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const logger = {
        info: (...data) => console.log.apply(console, ['[sy]', ...data]),
        warn: (...data) => console.warn.apply(console, ['[sy]', ...data]),
        error: (...data) => console.error.apply(console, ['[sy]', ...data])
    };

    const modalReg = /\(modal:\w\/(\w+-?\w+)\/(\d+)\)/;
    const youtubeReg = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/|live\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

    (function(history){
        var pushState = history.pushState;
        history.pushState = function(state, _, pathname) {
            main('history', pathname);
            return pushState.apply(history, arguments);
        };
        var replaceState = history.replaceState;
        history.replaceState = function(state, _, pathname) {
            main('history', pathname);
            return replaceState.apply(history, arguments);
        };
    })(window.history);

    function main(type, pathname) {
        if (modalReg.test(pathname)) {
            if (type == 'history') {
                patchYoutubeLink();
            } else {
                wait(1150).then(patchYoutubeLink);
            }
        }

        if (type == 'script-injected') {
            logger.info('쉘터 글 유튜브 링크 스크립트 준비 완료');
        }
    }

    function patchYoutubeLink() {
        findDom('article.art_container .art_txt a[href*="youtu"]', true, (eles) => {
            for (let ele of eles) {
                let href = undefined;
                if (ele.href) {
                    href = ele.href;
                } else {
                    href = ele.getAttribute('href');
                }
                if (href && youtubeReg.test(href)) {
                    ele.removeAllListeners('click');
                    ele.addEventListener('click', youtubeLinkClick);
                }
            }
        });
    }

    function youtubeLinkClick(event) {
        let target = event.target;
        let href = undefined;
        if (target.href) {
            href = target.href;
        } else {
            href = target.getAttribute('href');
        }

        if (href) {
            event.preventDefault();
            let url = new URL(href);
            let match = href.match(youtubeReg);
            let id = match[1];
            if (id) {
                let t = url.searchParams.get('t') ?? url.searchParams.get('start') ?? '0';
                addYoutubeEmbed(target.parentElement, id, t);
                target.remove();
            } else {
                open(href);
            }
        }
    }

    function addYoutubeEmbed(target, id, t) {
        let iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&start=${t}`;
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('width', '100%');
        iframe.style.aspectRatio = '16 / 9';
        target.appendChild(iframe);
    }

    async function findDom(path, all, callback) {
        if (callback) {
            let dom = all ? document.querySelectorAll(path) : document.querySelector(path);
            if ((all ? dom.length != 0 : dom != null)) {
                callback(dom);
                return;
            }
        }
        await wait(500);
        return findDom(path, all, callback);
    }

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    main('script-injected', location.pathname);
})();
