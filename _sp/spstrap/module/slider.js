/*
 * Swiper
 */
import Swiper from '../library/swiperjs/swiper-bundle.min.js';

/*
 * 모듈 호출
 */
import { 
    SP_VAR,
    SP_REGEX,
    SP_HANDLER
} from './modules.js';

/*
 * 모드
 */
'use strict';

/*
 * 클래스 선언
 */
class SP_SLIDER {

    /*
     * 초기화
     */
    constructor() {

        const _ = this;

        /*
         * extends class
         */
        _.var = SP_VAR;
        _.regex = SP_REGEX;
        _.handler = SP_HANDLER;

        /*
         * load css after init ( promiss )
         */
        //_.handler.importCss('/library/swiperjs/swiper-bundle.min.css').then( function() {
            _.init();
        //});

    }

    /*
     * 최초수행
     */
    init() {

        const _ = this;

        let type;
        let options = {};
        let setting = {};

        /*
         * 기본값 정의
         */
        _.swiper = {
            stop: false,
            attrtype: 'data-type',
            attrchain: 'data-chain',
            attroption: 'data-swiper',
            data: '.swiper-data',
            container: '.swiper-container',
            pagination: '.swiper-pagination',
            prev: '.swiper-button-prev',
            next: '.swiper-button-next',
        };

        // 체인 배열 정의
        _.swiperChain = [];

        // 화면에 다시 돌아오면 슬라이더 수행
        window.addEventListener('focus', e => {

            // 리스너 초기화
            e.stopImmediatePropagation();

            _.swiper.stop = true;

        }, false);

        // 화면에서 벗어나면 슬라이더 중지
        window.addEventListener('blur', e => {

            // 리스너 초기화
            e.stopImmediatePropagation();
            
            _.swiper.stop = false;

        }, false);

        // 슬라이더 배열
        document.querySelectorAll(_.swiper.container +`:not(${_.var.init.slider})`).forEach( container => {

            /*
            * 기본옵션
            */
            setting = {
                initialSlide: 0,
                preloadImages: false,
                updateOnImagesReady: false,
                observer: true,
                observeParents: true,
                init: false,
                Threshold: 100,
                onSlideChangeEnd: (s) => {s.fixLoop();}
            };

            // 타입을 가져온다.
            type = container.getAttribute(_.swiper.attrtype);
            if (type) {

                // 타입이 있다면 지정된 옵션을 가져온다.
                _.combineArray(setting, _.getType(type));

                // 타입을 클래스에 추가해준다.
                container.classList.add(`swiper-${type}`);

            }

            // 커스텀으로 지정할 경우 attr을 분석한다.
            options = _.getAttrData(container, _.swiper.attroption);

            // 슬라이더에 숨겨진 요소들을 삭제한다.
            container.querySelectorAll('.swiper-slide').forEach( slider => {
                if (_.handler.getStyle(slider).display === 'none') {
                    slider.remove();
                }
            });

            // 슬라이더 개수를 얻는다.
            setting.count = container.querySelectorAll('.swiper-slide') ? container.querySelectorAll('.swiper-slide').length : 0 ;

            // 최소 슬라이더 수가 있고, 만족하지 않는다면 삭제한다.
            setting.min = container.dataset.min ? _.regex.getNumber(container.dataset.min) : '' ;
            if (setting.count < setting.min) {
                container.remove();
                return;
            }

            // 시작지점을 랜덤으로 요청한다면 수행한다.
            setting.start = container.dataset.initial ? container.dataset.initial : 0 ;
            if (setting.count > 1 && setting.start === 'random') {
                setting.initialSlide = _.handler.getRndNumber(0, setting.count-1);
            } else if (setting.count > 1 && setting.start === 'center') {
                setting.initialSlide = parseInt(setting.count / 2);
            }

            // 슬라이더 개수가 2개 이상일 경우에만 수행한다.
            if (setting.count > 1) {

                // 옵션 합쳐주기
                _.combineArray(setting, options);

                // 개별 수행
                _.initSlider(container, setting);

                // 기 수행 체크
                container.classList.add(_.var.trim(_.var.init.slider));

            } else {

                // 준비가 완료되면 필요없는 클래스를 삭제한다.
                container.classList.remove(_.var.trim(_.var.css.notready));

            }

        });

    }

    /*
     * 기본적인 타입을 가져온다.
     */
    getType(type) {

        const _ = this;

        let options = {};

        switch (type) {
            case 'default' :
                options = {
                    centeredSlides: true,
                    autoplay: {
                        disableOnInteraction: false,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                }
                break;
            case 'fade' :
                options = {
                    effect: 'fade',
                    fadeEffect: { 
                        crossFade: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                }
                break;
            case 'scrollbar' :
                options = {
                    scrollbar: {
                        el: '.swiper-scrollbar',
                        hide: true,
                    },
                }
                break;
            case 'navigation' :
                options = {
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                }
                break;
            case 'pagination' :
                options = {
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                }
                break;
            case 'pagination-dynamic-bullets' :
                options = {
                    pagination: {
                        el: '.swiper-pagination',
                        dynamicBullets: true,
                        clickable: true,
                    },
                }
                break;
            case 'progress-pagination' :
                options = {
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'progressbar',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                }
                break;
            case 'fraction-pagination' :
                options = {
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'custom',
                        clickable: true,
                        renderCustom: function (swiper, current, total) {
                            return `
                                <div class="swiper-fraction">
                                    <span class="current">${current}</span>
                                    <span class="split">/</span>
                                    <span class="total">${total}</span>
                                </div>
                            `;
                        }
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                }
                break;
            case 'custom-pagination' :
                options = {
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                        renderBullet: function (index, className) {
                            let slides = this.el.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');
                            let btn = slides[index].dataset.page ? slides[index].dataset.page : index + 1 ;
                            return `
                                <button class="${className} ${className}-customize">${btn}</button>
                            `;
                        },
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                }
                break;
            case 'vertical-slider' :
                options = {
                    direction: 'vertical',
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    on: {
                        observerUpdate: function(swiper) {
                            _.heightUpdate(swiper, 'observerUpdate');
                        },
                        beforeResize: function(swiper) {
                            _.heightUpdate(swiper, 'beforeResize');
                        }
                    }
                }
                break;
            case 'multiple-slides-per-view' :
                options = {
                    slidesPerView: 3,
                    spaceBetween: 0,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }
                }
                break;
            case 'centered-slides' :
                options = {
                    slidesPerView: 4,
                    spaceBetween: 0,
                    centeredSlides: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                }
                break;
            case 'centered-slides-auto-slides-per-view' :
                options = {
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    spaceBetween: 0,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                }
                break;
            case 'multi-row-slides-layout' :
                options = {
                    slidesPerView: 3,
                    slidesPerColumn: 2,
                    slidesPerGroup: 2,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    on: {
                        observerUpdate: function(swiper) {
                            _.heightUpdate(swiper, 'observerUpdate');
                        },
                        beforeResize: function(swiper) {
                            _.heightUpdate(swiper, 'beforeResize');
                        }
                    }
                }
                break;
            case 'loop-mode-with-multiple-slides-per-group' :
                options = {
                    slidesPerView: 3,
                    spaceBetween: 0,
                    slidesPerGroup: 3,
                    loop: true,
                    loopFillGroupWithBlank: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                }
                break;
            case '3d-cube-effect' :
                options = {
                    effect: 'cube',
                    grabCursor: true,
                    cubeEffect: {
                        shadow: true,
                        slideShadows: true,
                        shadowOffset: 20,
                        shadowScale: 0.94,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                }
                break;
            case '3d-coverflow-effect' :
                options = {
                    effect: 'coverflow',
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    coverflowEffect: {
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                }
                break;
            case 'mousewheel-control' :
                options = {
                    direction: 'vertical',
                    slidesPerView: 1,
                    spaceBetween: 0,
                    mousewheel: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    on: {
                        observerUpdate: function(swiper) {
                            _.heightUpdate(swiper, 'observerUpdate');
                        },
                        beforeResize: function(swiper) {
                            _.heightUpdate(swiper, 'beforeResize');
                        }
                    }
                }
                break;
            case 'lazy-loading-images' :
                options = {
                    lazy: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                }
                break;
            default :
        }

        // 호출된 타입을 기록
        options.type = type;
        
        return options;

    }

    /*
     * 배열을 서로 합쳐준다. ( 커스텀 )
     */
    combineArray(options, object) {

        const _ = this;

        for (const [key, value] of Object.entries(object)) {
            if (typeof value === 'object') {
                for (const [skey, svalue] of Object.entries(value)) {
                    options[key] = options[key] || {} ;
                    options[key][skey] = svalue;
                }
            } else {
                if (value === 'delete') {
                    delete options[key];
                } else {
                    options[key] = value;
                }
            }
        }

        return options;

    }

    /*
     * 슬라이더 attribute 데이터 참조
     */
    getAttrData(element, name) {

        const _ = this;

        const data = _.regex.trim(element.getAttribute(name));
        const dataArr = data.split('\n');
        
        let attr;
        let attrSlice;
        let attrSubSlice;
        let attrKey;
        let attrValue;
        let array = {};

        for (let i = 0; i < dataArr.length; i++) {

            attr = _.regex.trimAll(dataArr[i]);
            attrSlice = attr.split('=');
            attrKey = attrSlice[0];
            attrValue = attrSlice[1];

            if (attrKey.indexOf('-') > 0) {
                attrSubSlice = attrKey.split('-');
                array[attrSubSlice[0]] = array[attrSubSlice[0]] || {} ;
                array[attrSubSlice[0]][attrSubSlice[1]] = _.regex.fixValue(attrValue);
            } else {
                array[attrKey] = _.regex.fixValue(attrValue);
            }

        }

        return array;
    
    }

    /*
     * 슬라이더 페이지, 스크롤바, 화살표 등록
     */
    makeControler(container, options) {

        const _ = this;

        if (options.navigation) {
            _.handler.append(container.querySelector(_.var.slider.thumbnail), '<div class="swiper-button"><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div>');
        }
        if (options.pagination) {
            _.handler.append(container, '<div class="swiper-pagination"></div>');
        }
        if (options.scrollbar) {
            _.handler.append(container, '<div class="swiper-scrollbar"></div>');
        }
        if (options.height) {
            container.style.height = options.height +'px';
        }

    }

    /*
     * 슬라이더 높이 업데이트
     * 멀티 로우 타입일때만 업데이트 된다.
     */
    heightUpdate(swiper, scope) {

        const _ = this;

        let container = swiper.wrapperEl;
        let perColumn = swiper.options.slidesPerColumn ? swiper.options.slidesPerColumn || 1 : 1 ;
        let between = swiper.options.spaceBetween ? swiper.options.spaceBetween * 2 || 0 : 0 ;
        let firstElement, blockSize, endHeight;
        if (swiper.slides.length) {

            setTimeout(() => {

                // 멀티 로우인 경우에만 높이를 특이하게 계산한다.
                if (swiper.options.type === 'multi-row-slides-layout') {

                    blockSize = 0;
                    swiper.slides.forEach( slides => {
                        if (slides.firstElementChild) {
                            blockSize = _.regex.getNumber(_.handler.getStyle(slides.firstElementChild).blockSize) > blockSize 
                                        ? _.regex.getNumber(_.handler.getStyle(slides.firstElementChild).blockSize) : blockSize ;
                        }
                    });

                // 일반 슬라이더라면 한개만 계산한다.
                } else {

                    firstElement = swiper.slides[0].firstElementChild;
                    blockSize = _.regex.getNumber(_.handler.getStyle(firstElement).blockSize) || 0 ;

                }
                endHeight = blockSize * perColumn + between + 'px';
                container.style.height = endHeight;
                swiper.update();

            }, 1);
            
        }

    }

    /*
     * 슬라이더 개별 수행
     */
    initSlider(container, options) {

        const _ = this;
        
        let chain;
        let wrapper;
        let slider = new Swiper(container, options);
        let videoPlayBtn, videoPauseBtn;

        // 체인 연결 ( 자동플레이, 컨트롤러 )
        chain = container.getAttribute(_.swiper.attrchain);

        // autoplay, controler 상호참조
        if (chain && _.swiperChain[chain]) {
            _.swiperChain[chain].autoplay = slider.autoplay;
            _.swiperChain[chain].controller.control = slider;
            slider.controller.control = _.swiperChain[chain];
            slider.autoplay = _.swiperChain[chain].autoplay;
        }
        _.swiperChain[chain] = slider;

        // 실행
        slider.options = options;
        slider.on('init', function(swiper) {   
            
            this.el.addEventListener('mouseenter', e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                _.swiper.stop = true;
                slider.autoplay.stop();

                return false;

            });
            this.el.addEventListener('mouseleave', e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                _.swiper.stop = false;
                slider.autoplay.start();

            });

            // 현재 윈도우에 들어왔을때만 실행한다.
            if (!_.swiper.stop && !_.handler.inScreen(this.el)) {
                slider.autoplay.stop();
            }

            // 준비가 완료되면 필요없는 클래스를 삭제한다.
            container.classList.remove(_.var.trim(_.var.css.notready));

        });

        // 애니메이션 시작 전
        slider.on('slideChangeTransitionStart', function() {  

            // 슬라이더가 넘아갈려고 하니 현재를 정지해준다.
            videoPlayBtn = this.slides[this.activeIndex] ? this.slides[this.activeIndex].querySelector(`${_.var.video.btn}[data-status="playVideo"]`) : '' ;
            videoPauseBtn = this.slides[this.previousIndex] ? this.slides[this.previousIndex].querySelector(`${_.var.video.btn}[data-status="pauseVideo"]`) : '' ;
            if (videoPlayBtn) videoPlayBtn.click();
            if (videoPauseBtn) videoPauseBtn.click();

            // 시작할때 플레이 상태를 인식한다.
            if (!_.swiper.stop && !_.handler.inScreen(this.el)) {
                slider.autoplay.stop();
            }

        });

        // 애니메이션 종료 후
        slider.on('slideChangeTransitionEnd', function() {       

            //

        });

        // 정지 실행 후
        slider.on('autoplayStop', function() {       

            slider.interval = setInterval(() => {
                if (!_.swiper.stop && _.handler.inScreen(this.el)) {
                    slider.autoplay.start();
                    clearInterval(slider.interval);
                }
            }, options.delay);

        });

        // 업데이트
        slider.on('update', function() {       

            //

        });

        // 옵저버 업데이트
        slider.on('observerUpdate', function(swiper) {       

            //

        });

        // 옵저버 업데이트
        slider.on('resize', function(swiper) {       

            //

        });

        // 클릭 업데이트
        slider.on('click', function() {       

            //

        });

        // 가상 요소 생성
        wrapper = document.createElement('div');
        wrapper.classList.add(_.var.trim(_.var.slider.thumbnail));

        // 현재 슬라이더를 한번 더 감싸줌
        slider.wrapperEl.parentNode.insertBefore(wrapper, slider.wrapperEl);
        wrapper.appendChild(slider.wrapperEl);

        // 컨트롤러 등록
        _.makeControler(container, options);

        // 슬라이더 실행
        slider.init();

    }

}

/*
 * 생성하기
 */
const SP_SLIDER_NEW = new SP_SLIDER();

/*
 * 내보내기
 */
export {
    SP_SLIDER_NEW as SP_SLIDER
}