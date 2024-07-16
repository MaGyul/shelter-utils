// ==UserScript==
// @name         쉘터 오른쪽 사이드바 가리기
// @namespace    shelter.id
// @version      1.0.4
// @description  오른쪽 사이드바를 접거나 펼칠 수 있습니다.
// @author       MaGyul
// @match        *://shelter.id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shelter.id
// @updateURL    https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-hide-right-bar.user.js
// @downloadURL  https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-hide-right-bar.user.js
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const btn = createButton();
    const domCache = {};

    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand("꽉 찬 화면 토글", function() {
            main('toggle-fullmode');
        });
    }

    (function(history){
        var pushState = history.pushState;
        history.pushState = function() {
            if (typeof history.onpushstate == "function") {
                main('history');
            }
            return pushState.apply(history, arguments);
        };
    })(window.history);

    async function main(type) {
        if (type == 'toggle-fullmode') {
            if (localStorage.getItem('mg-fullmode')) {
                localStorage.removeItem('mg-fullmode');
            } else {
                localStorage.setItem('mg-fullmode', 'true');
            }
            if (!isSideBarOpen()) {
                closeSideBar();
            }
        }

        if (type == 'script-injected') {
            let style = document.createElement('style');
            style.textContent = `
            @media only screen and (max-width: 1170px) {
                .right-side-btn { display: none; }
            }
            @media only screen and (min-width: 1170px) {
                .main__layout__container > .main__layout { transition: grid-template-columns 100ms ease-in-out; }
                .right-side-btn { transform: rotateY(180deg); }
                .mg-side-close { transform: rotateY(0deg); }
                .mg-fullmode { grid-template-columns: 225px 1fr 0 !important; }
                .mg-normal { grid-template-columns: 225px 0.7fr 0 !important; }
                .main-content > .mc-banner > .status_settler > .right-side-btn {
                     position: absolute;
                     right: 0;
                     top: 24px;
                     background: transparent;
                     color: currentColor;
                     border: 2px solid currentColor;
                     aspect-ratio: 1 / 1;
                     padding-bottom: 4px !important;
                     padding-top: 4px !important;
                }
                :where(.mg-normal, .mg-fullmode) > div:nth-child(3) { max-height: 0px; }
            }
            `;
            document.head.appendChild(style);
            btn.onclick = () => {
                if (isSideBarOpen()) {
                    closeSideBar();
                } else {
                    openSideBar();
                }
            }
        }

        if (type == 'script-injected' || type == 'history') {
            await wait(1000);
            findDom('.main__layout__container > .main__layout div.board__header.font-label > div.header-right', dom => {
                if (!dom.contains(btn)) {
                    dom.appendChild(btn);
                }
            });
            findDom('.main-content > .mc-banner > .status_settler', dom => {
                if (!dom.contains(btn)) {
                    dom.appendChild(btn);
                }
            });
            if (!isSideBarOpen()) {
                closeSideBar();
            }
            if (type == 'script-injected') {
                main('history');
            }
        }
    }

    async function findDom(path, callback) {
        if (callback) {
            if (domCache[path] && document.body.contains(domCache[path])) {
                callback(domCache[path]);
                return;
            }
            let dom = document.querySelector(path);
            if (dom != null) {
                domCache[path] = dom;
                callback(dom);
                return;
            }
        } else {
            if (domCache[path] && document.body.contains(domCache[path])) {
                return domCache[path];
            }
            let dom = document.querySelector(path);
            if (dom != null) {
                domCache[path] = dom;
                return dom;
            }
        }
        await wait(500);
        return findDom(path, callback);
    }

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function isSideBarOpen() {
        return localStorage.getItem('mg-right-side-bar') == 'true';
    }

    function openSideBar() {
        findDom('.main__layout__container > .main__layout', dom => {
            dom.classList.remove('mg-fullmode');
            dom.classList.remove('mg-normal');
        });
        btn.classList.add('mg-side-close');
        localStorage.setItem('mg-right-side-bar', true);
    }

    function closeSideBar() {
        findDom('.main__layout__container > .main__layout', dom => {
            if (localStorage.getItem('mg-fullmode')) {
                dom.classList.add('mg-fullmode');
                dom.classList.remove('mg-normal');
            } else {
                dom.classList.remove('mg-fullmode');
                dom.classList.add('mg-normal');
            }
        });
        btn.classList.remove('mg-side-close');
        localStorage.setItem('mg-right-side-bar', false);
    }

    function createButton() {
        let btn = document.createElement('button');
        btn.setAttribute('aria-label', 'right-bar');
        btn.setAttribute('class', 'btn-wider smol right-side-btn');
        btn.innerHTML = '<svg viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg" width="13" height="13" aria-hidden="true" style="width: 13px;height: 13px;"><path fill="currentColor" d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z" _ngcontent-serverapp-c3290741586=""></path></svg>'
        return btn;
    }

    main('script-injected');
})();
