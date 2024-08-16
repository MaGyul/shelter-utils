((window) => {
    window.domCache = {};
    window.loggerCache = {};
    const logger = createLogger(console, 'shelter-utils');

    window.addEventListener('history', () => {
        for (let key in window.domCache) {
            let cache = window.domCache[key];
            if (document.body.contains(cache)) break;
            delete window.domCache[key];
        }
    });

    class ShelterUtils {
        static modalReg = /\(modal:\w\/(\w+-?\w+)\/(\d+)\)/;
        static youtubeReg = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/|live\/|playlist)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

        static getLogger(name) {
            if (window.loggerCache[name]) {
                return window.loggerCache[name];
            } else {
                return (window.loggerCache[name] = createLogger(console, name));
            }
        }

        static async getShelterId(pathname = location.href) {
            try {
                let href = undefined;
                if (!pathname.includes('/base/')) {
                    href = pathname.split('(')[0].replace(location.origin, '').substr(1);
                }
                if (href == undefined) {
                    let canonical = await findDom('head > link[rel="canonical"]');
                    href = canonical.href;
                }
                let split = href.replace(location.origin + '/', '').split('/');
                return split[0] === '' ? undefined : split[0];
            } catch(e) {
                logger.error('스크립트 동작 오류(getShelterId())', e);
                return undefined;
            }
        }

        static async getOwnerId(shelterId) {
            let data = await this.safeFetch(`https://rest.shelter.id/v1.0/list-items/angular/shelter-detail/${shelterId}`);
    
            return data.shelter.owner.id;
        }

        static safeFetch(path, options) {
            return fetch(path, options)
                .catch((err) => {return {json: () => {return {error: err}}}})
                .then(r => r.status == 204 ? {json: () => {return {error: new Error('No Content')}}} : r)
                .then(r => r.json())
        }

        /**
         * @param {string} path 찾을 html tag selector
         * @param {(ele: HTMLElement | undefined) => void} callback 반환될 callback 함수
         * @param {number} [limit=5] 찾기 시도할 횟수
         * @returns {HTMLElement | undefined} 동기 반환 callback 함수가 존재시 무조건 undefined
         */
        static async findDomAll(path, callback, limit = 5) {
            if (typeof callback === 'number') {
                limit = callback;
                callback = undefined;
            }
            if (typeof callback === 'function') {
                let dom = document.querySelectorAll(path);
                if (dom.length != 0) {
                    callback(dom);
                    return;
                }
            } else {
                let dom = document.querySelectorAll(path);
                if (dom.length != 0) {
                    return dom;
                }
            }
            if (limit-- == 0) {
                logger.warn('html 태그 찾기가 5회 이상 진행되었습니다.');
                logger.warn('5회 이상으로 태그가 없다고 판단되어 undefined가 반환됩니다.');
                if (typeof callback === 'function') {
                    callback(undefined);
                }
                return undefined;
            }
            await wait(500);
            return this.findDomAll(path, callback, limit);
        }

        /**
         * @param {string} path 찾을 html tag selector
         * @param {(ele: HTMLElement | undefined) => void} callback 반환될 callback 함수
         * @param {number} [limit=5] 찾기 시도할 횟수
         * @returns {HTMLElement | undefined} 동기 반환 callback 함수가 존재시 무조건 undefined
         */
        static async findDom(path, callback, limit = 5) {
            if (typeof callback === 'number') {
                limit = callback;
                callback = undefined;
            }
            if (typeof callback === 'function') {
                if (window.domCache[path] && document.body.contains(window.domCache[path])) {
                    callback(window.domCache[path]);
                    return undefined;
                }
                let dom = document.querySelector(path);
                if (dom != null) {
                    window.domCache[path] = dom;
                    callback(dom);
                    return undefined;
                }
            } else {
                if (window.domCache[path] && document.body.contains(window.domCache[path])) {
                    return window.domCache[path];
                }
                let dom = document.querySelector(path);
                if (dom != null) {
                    window.domCache[path] = dom;
                    return dom;
                }
            }
            if (limit-- == 0) {
                logger.warn('html 태그 찾기가 5회 이상 진행되었습니다.');
                logger.warn('5회 이상으로 태그가 없다고 판단되어 undefined가 반환됩니다.');
                if (typeof callback === 'function') {
                    callback(undefined);
                }
                return undefined;
            }
            await this.wait(500);
            return this.findDom(path, callback, limit);
        }

        /**
         * @param {string} parent 찾을 부모태그
         * @param {HTMLElement} child 현재 태그
         * @param {number} limit 시도 횟수
         * @returns 
         */
        static isDescendant(parent, child, limit = 5) {
            const isTag = parent == parent.toUpperCase();
            var node = child.parentNode;
            while (node != null) {
                if ((isTag ? (node.tagName == parent) : (node.classList?.contains(parent)))) {
                    return true;
                }
                if (limit-- == 0) return false;
                node = node.parentNode;
            }
            return false;
        }

        /**
         * @param {string} parent 찾을 부모태그
         * @param {HTMLElement} child 현재 태그
         * @param {number} limit 시도 횟수
         * @returns 
         */
        static getDescendant(parent, child, limit = 5) {
            const isTag = parent == parent.toUpperCase();
            var node = child.parentNode;
            while (node != null) {
                if ((isTag ? (node.tagName == parent) : (node.classList?.contains(parent)))) {
                    return node;
                }
                if (limit-- == 0) return false;
                node = node.parentNode;
            }
            return undefined;
        }

        static createStyle(content) {
            const style = document.createElement('style');
            style.textContent = content;
            return style;
        }

        static appendStyle(path) {
            const url = `https://raw.githubusercontent.com/MaGyul/shelter-utils/main/css/${path}`;
            // const style = document.createElement('link');
            // style.setAttribute('rel', 'stylesheet');
            // style.setAttribute('href', url);
            fetch(url).then(r => r.text()).then(css => {
                document.head.appendChild(this.createStyle(css));
            })
        }

        static wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    function createLogger(console, name) {
        return {
            info: (...msg) => console.log.apply(console, [`[SU/${name}]`, ...msg]),
            warn: (...msg) => console.warn.apply(console, [`[SU/${name}]`, ...msg]),
            error: (...msg) => console.error.apply(console, [`[SU/${name}]`, ...msg])
        };
    }

    window.addEventListener('load', () => {
        const loadedEvent = new CustomEvent('su-loaded', {
            bubbles: true,
            detail: {
                su: ShelterUtils
            }
        });
        
        window.dispatchEvent(loadedEvent);
    });

    (function(history){
        if (history.su_injected) return;
        var pushState = history.pushState;
        history.pushState = function(state, _, pathname) {
            window.dispatchEvent(new CustomEvent('history-push', {
                bubbles: true,
                detail: {
                    pathname
                }
            }));
            window.dispatchEvent(new CustomEvent('history', {
                bubbles: true,
                detail: {
                    pathname
                }
            }));
            return pushState.apply(history, arguments);
        };
        var replaceState = history.replaceState;
        history.replaceState = function(state, _, pathname) {
            window.dispatchEvent(new CustomEvent('history-replace', {
                bubbles: true,
                detail: {
                    pathname
                }
            }));
            window.dispatchEvent(new CustomEvent('history', {
                bubbles: true,
                detail: {
                    pathname
                }
            }));
            return replaceState.apply(history, arguments);
        };
        history.su_injected = true;
    })(window.history);

    window.ShelterUtils = ShelterUtils;
    window.su = ShelterUtils;

})(window);