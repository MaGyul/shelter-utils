// ==UserScript==
// @name         쉘터 글 줌 인 아웃
// @namespace    shelter.id
// @version      1.0.0
// @description  쉘터를 쓰는 노안들을 위한 확대 시스템
// @author       MaGyul
// @match        https://shelter.id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shelter.id
// @require      https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-utils.js
// @updateURL    https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-zoom-in-out.user.js
// @downloadURL  https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-zoom-in-out.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';
    var logger;

    window.addEventListener('su-loaded', () => {
        logger = window.ShelterUtils.getLogger('zoom-in-out');
        window.ShelterUtils.appendStyle('zoom-in-out.style');
        main('su-loaded', location.href);
    });

    window.addEventListener('history', (event) => {
        const { pathname } = event.detail;
        main('history', pathname);
    })

    async function main(type, pathname) {
        if (typeof window.ShelterUtils !== 'undefined') {
            if (ShelterUtils.modalReg.test(pathname)) {
                const modal = await ShelterUtils.findDom('body > app-root > ng-component > app-modal-wrapper');
                modal.style.setProperty('--noan-zoom', `${getValue('noan-zoom', 1)}`);
                const dom = await ShelterUtils.findDom('div.modal-ref-list > div.ref-scroll-container')
                if (!dom.querySelector('& input.zoom-in-out')) {
                    const input = document.createElement('input');
                    input.classList.add('zoom-in-out');
                    input.min = '100';
                    input.max = '200';
                    input.type = 'range';
                    input.step = '10';
                    input.value = '100';
                    input.addEventListener('input', async () => {
                        setValue('noan-zoom', input.value / 100)
                        modal.style.setProperty('--noan-zoom', `${input.value / 100}`);
                    });
                    dom.appendChild(input);
                }
            }
        }

        if (type === 'script-injected') {
            if (typeof window.ShelterUtils === 'undefined') {
                const script = document.createElement('script');
                script.setAttribute('src', 'https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-utils.js');
                document.body.appendChild(script);
            }
        }
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

    main('script-injected', location.href);
})();