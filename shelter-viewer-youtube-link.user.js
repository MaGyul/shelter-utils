// ==UserScript==
// @name         쉘터 글 유튜브 링크
// @namespace    shelter.id
// @version      1.2.3
// @description  쉘터 글 유튜브에 연결된 링크 클릭시 유튜브 Embed 생성
// @author       MaGyul
// @match        *://shelter.id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shelter.id
// @require      https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-utils.js
// @updateURL    https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-viewer-youtube-link.user.js
// @downloadURL  https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-viewer-youtube-link.user.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';
    var logger;

    const btns = [];

    window.addEventListener('su-loaded', () => {
        logger = ShelterUtils.getLogger('youtube-link');
        main('su-loaded', location.href);
        logger.info('쉘터 글 유튜브 링크 스크립트 준비 완료');
    });

    window.addEventListener('history', (event) => {
        const { pathname } = event.detail;
        main('history', pathname);
    })

    async function main(type, pathname) {
        if (typeof ShelterUtils !== 'undefined') {
            if (ShelterUtils.modalReg.test(pathname)) {
                if (type == 'history') {
                    patchYoutubeLink();
                } else {
                    ShelterUtils.wait(1150).then(patchYoutubeLink);
                }
            }
        }

        if (type == 'script-injected') {
            if (typeof ShelterUtils === 'undefined') {
                const script = document.createElement('script');
                script.classList.add('shelter-utils');
                script.textContent = await fetch('https://raw.githubusercontent.com/MaGyul/shelter-utils/main/shelter-utils.js').then(r => r.text());
                document.head.appendChild(script);
            }
            initBtns();
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
        ShelterUtils.findDomAll('article.art_container .art_txt a[href*="youtu"]', (eles) => {
            if (!eles) return;
            for (let ele of eles) {
                if (ele.classList.contains('m-ypatch')) return;
                let href = undefined;
                if (ele.href) {
                    href = ele.href;
                } else {
                    href = ele.getAttribute('href');
                }
                if (href && ShelterUtils.youtubeReg.test(href)) {
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
        try {
            let target = event.target;
            if (target.tagName != 'A') {
                target = ShelterUtils.getDescendant('A', target, 10);
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
            if (!href) {
                event.preventDefault();
                logger.warn("유튜브 링크를 못 찾아 패치를 진행 할 수 없음");
                ori.click();
                return;
            }

            event.preventDefault();
            let url = new URL(href);
            let match = href.match(ShelterUtils.youtubeReg);
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
                logger.warn("유튜브 링크에서 Video ID를 못 찾아 패치를 진행 할 수 없음");
                ori.click();
            }
        } catch (err) {
            event.preventDefault();
            logger.error("유튜브 링크 패치도중 오류 발생");
            logger.error(err);
            ori.click();
        }
    }

    function addYoutubeEmbed(target, id, t, list) {
        let iframe = document.createElement('iframe');
        let src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=${Number(isAutoplay())}&playsinline=1&start=${t.replace('s', '')}`;
        if (isAutoloop()) {
            src += `&loop=1&playlist=${id}`
        }
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

    main('script-injected', location.pathname);
})();
