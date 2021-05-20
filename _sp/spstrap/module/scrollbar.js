/*
 * OverlayScrollbar
 * https://github.com/KingSora/OverlayScrollbars
 */
import { Scrollbar as OverlayScrollbars } from '../library/scrollbar/OverlayScrollbars.js';

/*
 * 모듈 호출
 */
import { 
    SP_VAR,
    SP_HANDLER
} from './modules.js';

/*
 * 모드
 */
'use strict';

/*
 * 클래스 선언
 */
class SP_SCROLLBAR {

    /*
     * 초기화
     */
    constructor() {

        const _ = this;

        /*
         * extends class
         */
        _.var = SP_VAR;
        _.handler = SP_HANDLER;

        /*
         * load css after init ( promiss )
         */
        _.handler.importCss('/library/scrollbar/OverlayScrollbars.css').then( function() {
            _.init();
        });

    }
 
    /*
     * 최초수행
     */
    init() {
  
        const _ = this;

        let data;
        let options = {};
        let instance;

        // 스크롤바 컨테이트 배열
        document.querySelectorAll(_.var.scrollbar.container).forEach( container => {
            
            // 데이터 가져오기
            data = container.dataset;

            // 개별 옵션 정의
            options = {
                autoUpdate           : true,
                autoUpdateInterval   : 1,
            }
            options['className'] = data.class || 'os-theme-dark';
            options['scrollbars'] = data.autohide ? {
                autoHide: 'leave',
                autoHideDelay: 150,
                clickScrolling: true
            } : {} ;

            // 개별적인 스크롤바 생성
            instance = OverlayScrollbars(container, options);

            // 스크롤바 컨테이너에 마우스 엔터 - 업데이트
            /*
            container.addEventListener('mouseenter', function(){
                instance.scrollStop();
                instance.update();
            });
            container.addEventListener('mouseleave', function(){
                console.log('나감')
            });
            */

            // 준비가 완료되면 필요없는 클래스를 삭제한다.
            container.classList.remove(_.var.trim(_.var.css.notready));

        });

    }

}

/*
 * 생성하기
 */
const SP_SCROLLBAR_NEW = new SP_SCROLLBAR();

/*
 * 내보내기
 */
export {
    SP_SCROLLBAR_NEW as SP_SCROLLBAR
}