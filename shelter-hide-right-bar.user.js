// ==UserScript==
// @name         쉘터 오른쪽 사이드바 가리기
// @namespace    shelter.id
// @version      1.0.5
// @description  오른쪽 사이드바를 접거나 펼칠 수 있습니다.
// @author       MaGyul
// @match        *://shelter.id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shelter.id
// @require      https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-utils.js
// @updateURL    https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-hide-right-bar.user.js
// @downloadURL  https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-hide-right-bar.user.js
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const btn = createButton();

    window.addEventListener('su-loaded', () => {
        main('su-loaded', location.href);
    });

    window.addEventListener('history-push', (event) => {
        const { pathname } = event.detail;
        main('history', pathname);
    })

    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand("꽉 찬 화면 토글", function() {
            main('toggle-fullmode');
        });
    }

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

        if (type == 'su-loaded') {
            ShelterUtils.appendStyle('hide-right-bar.style');
            btn.onclick = () => {
                if (isSideBarOpen()) {
                    closeSideBar();
                } else {
                    openSideBar();
                }
            }
        }

        if (type == 'su-loaded' || type == 'history') {
            await ShelterUtils.wait(1000);
            ShelterUtils.findDom('.main__layout__container > .main__layout div.board__header.font-label > div.header-right', dom => {
                if (!dom) return;
                if (!dom.contains(btn)) {
                    dom.appendChild(btn);
                }
            });
            ShelterUtils.findDom('.main-content > .mc-banner > .status_settler', dom => {
                if (!dom) return;
                if (!dom.contains(btn)) {
                    dom.appendChild(btn);
                }
            });
            if (!isSideBarOpen()) {
                closeSideBar();
            }
            if (type == 'su-loaded') {
                main('history');
            }
        }

        if (type === 'script-injected') {
            if (typeof ShelterUtils === 'undefined') {
                if (document.querySelector('.shelter-utils')) return;
                const script = document.createElement('script');
                script.classList.add('shelter-utils');
                script.textContent = await fetch('https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-utils.js').then(r => r.text());
                document.head.appendChild(script);
            }
        }
    }

    function isSideBarOpen() {
        return localStorage.getItem('mg-right-side-bar') == 'true';
    }

    function openSideBar() {
        ShelterUtils.findDom('.main__layout__container > .main__layout', dom => {
            if (!dom) return;
            dom.classList.remove('mg-fullmode');
            dom.classList.remove('mg-normal');
        });
        btn.classList.add('mg-side-close');
        localStorage.setItem('mg-right-side-bar', true);
    }

    function closeSideBar() {
        ShelterUtils.findDom('.main__layout__container > .main__layout', dom => {
            if (!dom) return;
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
