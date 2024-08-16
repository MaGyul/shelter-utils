// ==UserScript==
// @name         쉘터 글 줌인아웃
// @namespace    shelter.id
// @version      1.0.0
// @description  쉘터를 쓰는 노안들을 위한 확대 시스템
// @author       MaGyul
// @match        https://shelter.id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shelter.id
// @require      https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-utils.js
// @updateURL    https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-zoom-in-out.user.js
// @downloadURL  https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-zoom-in-out.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var logger;

    window.addEventListener('su-loaded', () => {
        logger = window.ShelterUtils.getLogger('zoom-in-out');
        window.ShelterUtils.appendStyle('zoom-in-out.css');
        main('su-loaded', location.href);
    });

    window.addEventListener('history', (event) => {
        const { pathname } = event.detail;
        main('history', pathname);
    })

    async function main(type, pathname) {
        if (typeof window.ShelterUtils !== 'undefined') {
            if (ShelterUtils.modalReg.test(pathname)) {
                const dom = await ShelterUtils.findDom('div.modal-ref-list > div.ref-scroll-container')
                if (!dom.querySelector('& input.zoom-in-out')) {
                    const input = document.createElement('input');
                    input.classList.add('zoom-in-out');
                    input.min = '100';
                    input.max = '200';
                    input.type = 'range';
                    input.step = '10';
                    input.value = '100';
                    input.addEventListener('change', () => {
                        logger.info(input.value);
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

    main('script-injected', location.href);
})();