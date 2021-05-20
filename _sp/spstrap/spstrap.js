/*
 * 로드 시간
 */
console.time('  · SPSTRAP script load');

/*
 * 모듈 호출
 */
import { 
    SP_VAR,
    SP_EVENT, 
    SP_REGEX, 
    SP_BROWSER,
    SP_INTERFACE,
    SP_HANDLER,
    SP_COOKIE,
    SP_SLIDER,
    SP_SCROLLBAR,
    SP_ANIMATE,
    SP_SCROLL,
    SP_AJAX,
    SP_VIDEO
} from './module/modules.js';

/*
 * 자동실행
 */
(function(){

    /*
     * 모드
     */
    'use strict';

    /*
     * 클래스 선언
     */
    class SPSTRAP {

        /*
         * 초기화
         */
        constructor() {

            const _ = this;

            _.var = SP_VAR;
            _.event = SP_EVENT;
            _.regex = SP_REGEX;
            _.browser = SP_BROWSER;
            _.interface = SP_INTERFACE;
            _.handler = SP_HANDLER;
            _.cookie = SP_COOKIE;
            _.slider = SP_SLIDER;
            _.scrollbar = SP_SCROLLBAR;
            _.animation = SP_ANIMATE;
            _.scroll = SP_SCROLL;
            _.ajax = SP_AJAX;
            _.video = SP_VIDEO;

            _.init();

        }

        /*
         * 최초수행
         */
        init() {

            const _ = this;

            // 온로드 후 카피라이트 생성
            window.addEventListener('load', function(){

                // 현재창이 최상위 창일 경우만 로드
                if (window.self === window.top) {
                    _.copyright();
                }

            });

        }

        /*
         * 카피라이트
         */
        copyright() {

            const _ = this;

            let style = [];

            style['gcs'] = _.handler.getStyle(document.body);
            style['white'] = style['gcs'].getPropertyValue('--white-color');
            style['light'] = style['gcs'].getPropertyValue('--light-color');
            style['gray'] = style['gcs'].getPropertyValue('--gray-color');
            style['dark'] = style['gcs'].getPropertyValue('--dark-color');
            style['black'] = style['gcs'].getPropertyValue('--black-color');
            style['primary'] = style['gcs'].getPropertyValue('--primary-color');

            // 색상 변환
            // document.body.style.setProperty('--primary-color', '#ff3300');

            console.log('---------------------------------------------------');

            style['1'] = 'padding:4px 17px 3px 13px; font-family:tahoma; line-height:15px; font-size:10px; background-color: '+ style['light'] +'; color: '+ style['dark'] ;
            style['2'] = 'padding:4px 17px 3px 13px; font-family:tahoma; line-height:15px; font-size:10px; background-color: '+ style['gray'] +'; color: '+ style['white'] ;
            style['3'] = 'font-family:verdana; line-height:32px; font-size:19px; padding:8px 2px 5px 40px; color: '+ style['white'] +'; background:'+ style['primary'] +' url(http://www.pandassi.com/web/upload/_panda/logo.white.gif) 15px center / auto auto no-repeat;'
            style['4'] = 'padding:4px 17px 3px 13px; font-family:tahoma; line-height:15px; font-size:10px; background-color: '+ style['dark'] +'; color: '+ style['white'] ;
            console.log('%c  PANDASSI · Spstrap  ', style['3']);
            console.log('%c · ver : '+ _.var.library.name +'.'+ _.var.library.version, style['4']);
            console.log('%c · cs center : '+ _.var.library.cscenter, style['1']);
            console.log('%c · website : '+ _.var.library.website, style['1']);
            console.log('%c · contact us : '+ _.var.library.email , style['1']);
            console.log('%c · COPYRIGHT © '+ _.var.library.design +' · '+ _.var.library.name , style[2]);
            console.log('%c · THANKS. ALL RIGHTS RESERVED.', style[2]);

            // 로드 시간
            console.timeEnd('  · SPSTRAP script load');
            console.log('---------------------------------------------------');

        }

    }

    window.SPSTRAP = new SPSTRAP();

}());