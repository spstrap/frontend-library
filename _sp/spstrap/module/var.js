/*
 * 모드
 */
'use strict';

/*
 * 전역 변수들을 관리한다.
 * 개별적 라이브러리에 대한 변수는 없다.
 * 예를 들어 슬라이더 변수는 해당 라이브러리에 있다.
 */
const SP_VAR = {

    /*
    ** 라이브러리
    **/
    library: {
        name: 'SPSTRAP',
        design: 'PANDASSI',
        website: 'https://www.pandassi.com',
        version: '1.0.1',
        cscenter: '070.7774.8646',
        email: '2verworks@naver.com',
        script: 'spstrap.js',
        path: '/spstrap.js',
    },

    /*
     * ID, CLASS 를 문자열화 한다.
     */
    trim: (string) => {
        if (typeof string !='string') {
            return '';
        }

        let regex = /(^\.|^#|^\[|\]$)/gi;
        let selector = string.toString().replace(regex, '');
        
        return selector;
    },

    /*
     * initialized
     * 리스너를 중복 방지 클래스
     */
    init: {
        ajax: '.sp--initialized-ajax',
        ajaxbtn: '.sp--initialized-ajaxbtn',
        ajaxload: '.sp--initialized-ajaxload',
        ajaxcontents: '.sp--initialized-ajaxcontents',
        cookie: '.sp--initialized-cookie',
        cookiebtn: '.sp--initialized-cookiebtn',
        popup: '.sp--initialized-popup',
        popupbtn: '.sp--initialized-popupbtn',
        modal: '.sp--initialized-modal',
        modalbtn: '.sp--initialized-modalbtn',
        drag: '.sp--initialized-drag',
        dropdown: '.sp--initialized-dropdown',
        dropdownfirstul: '.sp--initialized-dropdown-firstul',
        dropdownfirstli: '.sp--initialized-dropdown-firstli',
        dropdownsubli: '.sp--initialized-dropdown-subli',
        loader: '.sp--initialized-loader',
        accordion: '.sp--initialized-accordion',
        tab: '.sp--initialized-tab',
        toggle: '.sp--initialized-toggle',
        togglebtn: '.sp--initialized-togglebtn',
        slider: '.sp--initialized-slider',
        currentlink: '.sp--initialized-currentlink',
        gotobtn: '.sp--initialized-gotobtn',
        video: '.sp--initialized-video',
        videobtn: '.sp--initialized-videobtn',
        videomake: '.sp--initialized-videomake',
        triggerbtn: '.sp--initialized-triggerbtn',
        messagebtn: '.sp--initialized-messagebtn',
    },

    /*
     * set css variable 
     * spstrap에서 사용하는 전역 css를 정의한다.
     * 현재까진 크게 의미 없지만, 나중에 꼭 필요할것으로 예상
     */
    css: {
        duration: 300,
        duration_slow: 600,
        duration_fast: 100,
        notready: '.sp--css-notready',
    },

    /*
     * animation class
     */
    animation: {
        to_fadein: '.sp--animate-to-fadein',
        to_fadein_slow: '.sp--animate-to-fadein-slow',
        to_fadein_fast: '.sp--animate-to-fadein-fast',
        to_slideup: '.sp--animate-to-slideup',
        to_slideup_slow: '.sp--animate-to-slideup-slow',
        to_slideup_fast: '.sp--animate-to-slideup-fast',
        to_slidedown: '.sp--animate-to-slidedown',
        to_slidedown_slow: '.sp--animate-to-slidedown-slow',
        to_slidedown_fast: '.sp--animate-to-slidedown-fast',
        to_full_slideup: '.sp--animate-to-full-slideup',
        to_full_slideup_slow: '.sp--animate-to-full-slideup-slow',
        to_full_slideup_fast: '.sp--animate-to-full-slideup-fast',
        to_full_slidedown: '.sp--animate-to-full-slidedown',
        to_full_slidedown_slow: '.sp--animate-to-full-slidedown-slow',
        to_full_slidedown_fast: '.sp--animate-to-full-slidedown-fast',
    },

    /***********************************************************************************
     * 
     * library variable
     * 
     **********************************************************************************/

    /*
     * event.js
     */
    message: {
        container: '.sp--message',
        btn: '.sp--message-btn',
        unit: 100,
        min: 2500,
        max: 4500,
    },

    /*
     * slider.js
     */
    slider: {
        active: '.swiper-active',
        thumbnail: '.swiper-thumbnail',
    },

    /*
     * ajax.js
     */
    ajax: {
        container: '.sp--ajax',
        result: '#sp--ajax-result',
        btn: '.sp--ajax-btn',
        delay: 0,
        gapDelay: 300,
        timeout: 3000,
    },

    /*
     * cookie.js
     */
    cookie: {
        cookieClass: '.sp--cookie',
        cookieSwitch: 'sp--cookie-on',
        btnClass: '.sp--cookie-btn'
    },

    /*
     * interface.js
     */
    accordion: {
        cover: '.sp--accordion',
        array: '.sp--accordion-array',
        contents: '.sp--accordion-contents',
        active: '.sp--accordion-active',
        btn: '.sp--accordion-btn',
    },

    /*
     * interface.js
     */
    tabs: {
        container: '.sp--tabs',
        contents: '.sp--tabs-contents',
        controler: '.sp--tabs-controler',
        active: '.sp--tabs-active',
        btn: '.sp--accordion-btn',
    },

    /*
     * interface.js
     */
    toggle: {
        container: '.sp--toggle',
        active: '.sp--toggle-on',
        btn: '.sp--toggle-btn',
    },

    /*
     * interface.js
     */
    currentlink: {
        btn: '.sp--currentlink',
        active: '.sp--currentlink-on',
    },

    /*
     * interface.js
     */
    table: {
        container: '.sp--table',
    },

    /*
     * scroll.js
     */
    scroll: {
        container: '.sp--scroll',
        holder: '.sp--scroll-holder',
        active: '.sp--scroll-on',
        works: false,
        resize: false,
        height: 0,
        sec: 30,         // 스크롤 딜레이
        secs: 1000,      // 전체 높이 체크 딜레이,
        gap: 3,          // 스크롤 영역의 범위를 살짝 올려준다. ( 인식문제 )
    },

    /*
     * scroll.js
     */
    scrollnav: {
        btn: '.sp--scroll-btn',
        active: '.sp--scroll-btn-on',
    },

    /*
     * scrollbar.js
     */
    scrollbar: {
        container: '.sp--scrollbar',
    },

    /*
     * event.js
     */
    modal: {
        container: '.sp--modal',
        contents: '.sp--modal-contents',
        hidebtn: '.sp--modal-closebtn',
        active: '.sp--modal-on',
        btn: '.sp--modal-btn',
    },

    /*
     * event.js
     */
    trigger: {
        btn: '.sp--trigger-btn',
    },

    /*
     * event.js
     */
    drag: {
        container: '.sp--dragable',
        handler: '.sp--dragable-handler',
    },

    /*
     * event.js
     */
    dropdown: {
        container: '.sp--dropdown',
        firstul: '.sp--dropdown > ul',
        firstli: '.sp--dropdown > ul > li',
        subli: '.sp--dropdown ul li',
    },

    /*
     * event.js
     */
    loader: {
        container: '.sp--loader',
    },

    /*
     * event.js
     */
    popup: {
        container: '.sp--popup',
        btn: '.sp--popup-btn',
    },

    /*
     * event.js
     */
    goto: {
        btn: '.sp--goto-btn',
    },

    /*
     * video.js
     */
    video: {
        container: '.sp--video',
		make: '.sp--video-make',
        btn: '.sp--video-btn',
        volume: 50,
        progress: {
            container: '.sp--video-progress',
            current: '.sp--video-progress-current',
            loaded: '.sp--video-progress-loaded',
            total: '.sp--video-progress-total',
        }
    },
    
}

/*
 * 내보내기
 */
export {
    SP_VAR
}