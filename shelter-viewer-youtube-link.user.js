// ==UserScript==
// @name         쉘터 글 유튜브 링크
// @namespace    shelter.id
// @version      1.2.0
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
    const youtubeReg = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/|live\/|playlist)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

    const btns = [];

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
            initBtns();
            logger.info('쉘터 글 유튜브 링크 스크립트 준비 완료');
        }
    }

    function initBtns() {
        if (typeof GM_unregisterMenuCommand !== 'undefined' && btns.length != 0) {
            btns.forEach(GM_unregisterMenuCommand);
            btns.length = 0;
        }
        initAutoplayBtn();
        initAutoloopBtn();
    }

    function initAutoplayBtn() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            let id = GM_registerMenuCommand(`자동 재생 ${isAutoplay() ? '켜짐' : '꺼짐'}`, function() {
                setAutoplay(!isAutoplay());
                initBtns();
            }, {
                autoClose: false,
                title: `클릭시 자동 재생을 ${isAutoplay() ? '끕' : '켭'}니다.`
            });
            btns.push(id);
        }
    }

    function initAutoloopBtn() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            let id = GM_registerMenuCommand(`자동 반복 ${isAutoloop() ? '켜짐' : '꺼짐'}`, function() {
                setAutoloop(!isAutoloop());
                initBtns();
            }, {
                autoClose: false,
                title: `클릭시 자동 반복을 ${isAutoloop() ? '끕' : '켭'}니다.`
            });
            btns.push(id);
        }
    }

    function patchYoutubeLink() {
        findDom('article.art_container .art_txt a[href*="youtu"]', true, (eles) => {
            for (let ele of eles) {
                if (ele.classList.contains('m-ypatch')) return;
                let href = undefined;
                if (ele.href) {
                    href = ele.href;
                } else {
                    href = ele.getAttribute('href');
                }
                if (href && youtubeReg.test(href)) {
                    let clone = ele.cloneNode(true);
                    ele.style.display = "none";
                    ele.classList.add('m-ypatch');
                    ele.classList.add('m-original');
                    clone.classList.add('m-ypatch');
                    ele.parentElement.appendChild(clone);
                    clone.addEventListener('click', (event) => youtubeLinkClick(event, ele));
                }
            }
        });
    }

    function youtubeLinkClick(event, ori) {
        let target = event.target;
        if (target.tagName != 'A') {
            target = getDescendantByTag('A', target, 10);
        }
        if (!target) {
            event.preventDefault();
            logger.warn("유튜브 링크가 포함된 A 태그를 못 찾아 패치를 진행 할 수 없음");
            ori.click();
            return;
        }
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
            if (url.pathname.includes('playlist')) {
                id = 'playlist';
            }
            if (id) {
                let t = url.searchParams.get('t') ?? url.searchParams.get('start') ?? '0';
                let list = url.searchParams.get('list');
                addYoutubeEmbed(target.parentElement, id, t, list);
                target.remove();
            } else {
                open(href);
            }
        }
    }

    function addYoutubeEmbed(target, id, t, list) {
        let iframe = document.createElement('iframe');
        let src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=${Number(isAutoplay())}&playsinline=1&start=${t}&loop=${Number(isAutoloop())}&playlist=${id}`;
        if (list) {
            src += `&list=${list}`;
        }
        iframe.src = src;
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

    function getDescendantByTag(parent, child, limit = 5) {
        var node = child.parentNode;
        while (node != null) {
            if (node.tagName == parent) {
                return node;
            }
            if (limit-- == 0) return false;
            node = node.parentNode;
        }
        return undefined;
    }

    function isAutoplay() {
        return getValue('m-autoplay', 'false') == 'true';
    }

    function setAutoplay(b) {
        setValue('m-autoplay', String(b));
    }

    function isAutoloop() {
        return getValue('m-autoloop', 'false') == 'true';
    }

    function setAutoloop(b) {
        setValue('m-autoloop', String(b));
    }

    function setValue(k, v) {
        if (typeof GM_setValue === 'undefined') {
            localStorage.setItem(k, v);
        } else {
            return GM_setValue(k, v);
        }
    }

    function getValue(k, d) {
        if (typeof GM_getValue === 'undefined') {
            return localStorage.getItem(k) ?? d;
        } else {
            return GM_getValue(k, d);
        }
    }

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    main('script-injected', location.pathname);
})();
