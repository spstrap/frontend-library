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
class SP_ANIMATE {

    /*
     * 초기화
     */
    constructor() {

        const _ = this;

        /*
         * anime cross browser
         */
        window.requestAnimFrame = (function(callback) {
            return window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.oRequestAnimationFrame || 
            window.msRequestAnimationFrame ||
            function(callback) { window.setTimeout(callback, 1000 / 60); };
        })();

        /*
         * extends class
         */
        _.var = SP_VAR;
        _.handler = SP_HANDLER;

        /*
         * variable
         */
        _.settime = {};

    }

    /*
     * jquery fadein 구현
     */
    fadeIn(element, speed) {

        const _ = this;

        let style;
        let display;

        speed = speed || _.var.css.duration_fast;

        style = _.handler.getStyle(element);
        display = style.display === 'none' ? 'block' : style.display ;

        return new Promise( resolve => { 

            let opacity;
            const fps = 1 / speed * 17.777;

            element.style.display = display;

            // 현재 슬라이더 상태 기록
            element.setAttribute('data-works', 'fadein');

            (function fadein() {

                opacity = element.style.opacity ? parseFloat(element.style.opacity) : 0 ;
                if (!((opacity += fps) >= 1)) {

                    element.style.opacity = opacity;
                    requestAnimationFrame(() => {
                        setTimeout(fadein, 1);
                    });

                } else {

                    element.style.opacity = 1;
                    resolve();

                }
                
            })();

        });

    }

    /*
     * jquery fadeout 구현  
     */
    fadeOut(element, speed) {

        const _ = this;

        let style;
        let display;

        speed = speed || _.var.css.duration_fast;

        style = _.handler.getStyle(element);
        display = style.display === 'block' ? 'none' : '' ;

        return new Promise( resolve => { 

            let opacity;
            const fps = 1 / speed * 17.777;

            opacity = parseFloat(element.style.opacity) || 1 ;

            // 현재 슬라이더 상태 기록
            element.setAttribute('data-works', 'fadeout');

            (function fadeout() {
                if (!((opacity -= fps) <= 0)) {

                    element.style.opacity = opacity.toFixed(2);
                    requestAnimationFrame(() => {
                        setTimeout(fadeout, 1);
                    });

                } else {

                    element.style.opacity = 0;
                    element.style.display = display ? display : '' ;
                    resolve();

                }
            })();

        });

    }

    /*
     * jquery fadeToggle 구현
     */
    fadeToggle(element, speed) {

        const _ = this;

        speed = speed || _.var.css.duration;
        let works = element.dataset.works || '' ;

        if (works === 'fadein') {
            _.fadeOut(element, speed);
        } else {
            _.fadeIn(element, speed);
        }

    }

    /*
     * jquery slideup 구현
     */
    slideUp(element, speed) {

        const _ = this;

        speed = speed || _.var.css.duration;

        // 동작중인것을 역으로 수행할때 타임아웃 제거
        clearTimeout( _.settime['slide'] );

        // 현재 슬라이더 상태 기록
        element.setAttribute('data-works', 'slideup');

        // 스타일 초기화
        element.style.willChange = 'height, padding';
        element.style.transitionProperty = 'height, padding';
        element.style.transitionDuration = speed + 'ms';
        element.style.height = element.offsetHeight + 'px';
        element.offsetHeight;
        element.style.overflow = 'hidden';
        element.style.height = 0;
        element.style.paddingTop = 0;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;

        // 애니메이션 종료 후 수행
        _.settime['slide'] = setTimeout( () => {

            element.style.display = 'none';
            element.style.removeProperty('will-change');
            element.style.removeProperty('height');
            element.style.removeProperty('padding-top');
            element.style.removeProperty('padding-bottom');
            element.style.removeProperty('margin-top');
            element.style.removeProperty('margin-bottom');
            element.style.removeProperty('overflow');
            element.style.removeProperty('transition-duration');
            element.style.removeProperty('transition-property');
            
            clearTimeout( _.settime['slide'] );

        }, speed);

    }

    /*
     * jquery slidedown 구현
     */
    slideDown(element, speed) {

        const _ = this;

        speed = speed || _.var.css.duration;

        // 동작중인것을 역으로 수행할때 타임아웃 제거
        clearTimeout( _.settime['slide'] );

        let style = window.getComputedStyle(element);
        let nowHeight = style.height === 'auto' ? '0px' : style.height ;
        let paddingTop = nowHeight === '0px' ? '0px' : style.paddingTop ;
        let paddingBottom = nowHeight === '0px' ? '0px' : style.paddingBottom ;

        element.style.cssText = '';
        element.style.display = 'block';

        let height = style.blockSize;

        // 현재 슬라이더 상태 기록
        element.setAttribute('data-works', 'slidedown');
        element.setAttribute('data-height', height);

        // 스타일 초기화
        element.style.willChange = 'height, padding';
        element.style.overflow = 'hidden';
        element.style.height = nowHeight;
        element.style.paddingTop = paddingTop;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;
        element.offsetHeight;

        element.style.transitionProperty = "height, padding";
        element.style.transitionDuration = speed + 'ms';
        element.style.height = height;
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');

        // 애니메이션 종료 후 수행
        _.settime['slide'] = setTimeout( () => {

            element.style.removeProperty('will-change');
            element.style.removeProperty('height');
            element.style.removeProperty('overflow');
            element.style.removeProperty('transition-duration');
            element.style.removeProperty('transition-property');

            clearTimeout( _.settime['slide'] );

        }, speed);

    }

    /*
     * jquery slidetoggle 구현
     */
    slideToggle(element, speed) {

        const _ = this;

        speed = speed || _.var.css.duration;
        let works = element.dataset.works || '' ;

        if (works === 'slidedown') {
            _.slideUp(element, speed);
        } else {
            _.slideDown(element, speed);
        }

    }

}

/*
 * 생성하기
 */
const SP_ANIMATE_NEW = new SP_ANIMATE();

/*
 * 내보내기
 */
export {
    SP_ANIMATE_NEW as SP_ANIMATE
}