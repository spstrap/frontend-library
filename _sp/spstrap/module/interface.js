/*
 * 모듈 호출
 */
import { 
    SP_VAR,
    SP_AJAX,
    SP_REGEX,
    SP_HANDLER,
    SP_ANIMATE,
    SP_EVENT
} from './modules.js';

/*
 * 모드
 */
'use strict';

/*
 * 클래스 선언
 */
class SP_INTERFACE {

    /*
     * 초기화
     */
    constructor() {

        const _ = this;

        /*
         * extends class
         */
        _.var = SP_VAR;
        _.ajax = SP_AJAX;
        _.regex = SP_REGEX;
        _.handler = SP_HANDLER;
        _.animate = SP_ANIMATE;
        _.event = SP_EVENT;

        _.init();

    }

    /*
     * 최초수행
     */
    init() {

        const _ = this;

        _.accordionLayout();
        _.toggleButton();
        _.dropdownEvent();
        _.responsiveTable();

    }

    /*
     * 아코디언 디자인
     */
    accordionLayout() {

        const _ = this;

        // 아코디언 배열
        document.querySelectorAll(_.var.accordion.cover +`:not(${_.var.init.accordion})`).forEach( container => {

            // 개별 수행
            _.initAccordion(container);

            // 기 수행 체크
            container.classList.add(_.var.trim(_.var.init.accordion));

        });

    }

    /*
     * 아코디언 현재상태 켜주기
     */
    accordionChoose(container, index, toggle, scope, effect) {

        const _ = this;

        let content;

        // 클릭의 경우 컨테이너 클래스 비워주기
        if (typeof toggle === 'boolean') {
            container.querySelectorAll(_.var.accordion.array).forEach( array => {
                array.classList.remove(_.var.trim(_.var.init.accordion));
            });
        }

        // 컨테이너 내부의 배열 요소 업데이트
        container.querySelectorAll(_.var.accordion.array).forEach( array => {

            content = array.querySelector(_.var.accordion.contents);
            
            if (!toggle) {
                if (effect === 'fade') {
                    if (scope === 'single') {
                        array.classList.remove(_.var.trim(_.var.accordion.active));
                        array.querySelector(_.var.accordion.contents).style.cssText = 'opacity:0;';
                    } else {
                        if (content.offsetHeight === 0) {
                            content.style.cssText = 'display:none;opacity:0;';
                        }
                    }
                } else if (effect === 'slide') {
                    if (scope === 'single') {
                        array.classList.remove(_.var.trim(_.var.accordion.active));
                        _.animate.slideUp(array.querySelector(_.var.accordion.contents));                        
                    }
                }
            }
            if (!effect) {
                if (scope === 'single') {
                    array.classList.remove(_.var.trim(_.var.accordion.active));
                }
            }

        });

        if (container.children && container.children[index]) {
            
            if (toggle) {
                if (effect === 'fade') {
                    _.animate.fadeToggle(container.children[index].querySelector(_.var.accordion.contents));
                } else if (effect === 'slide') {
                    _.animate.slideToggle(container.children[index].querySelector(_.var.accordion.contents));
                }
                container.children[index].classList.remove(_.var.trim(_.var.accordion.active));
            } else {
                if (effect === 'fade') {
                    _.animate.fadeIn(container.children[index].querySelector(_.var.accordion.contents));
                } else if (effect === 'slide') {
                    _.animate.slideDown(container.children[index].querySelector(_.var.accordion.contents));
                }
                container.children[index].classList.add(_.var.trim(_.var.accordion.active));
            }

            //if (!effect && toggle) {
            //    container.children[index].classList.remove(_.var.trim(_.var.accordion.active));
            //}

        }

    }

    /*
     * 아코디언 개별수행
     */
    initAccordion(container) {

        const _ = this;

        let index;
        let parent;
        let scope = container.dataset.scope ? container.dataset.scope : '' ;
        let effect = container.dataset.effect ? container.dataset.effect : '' ;
        let tabevent = container.dataset.tabevent ? container.dataset.tabevent : 'click' ;
        let initialtab = container.dataset.initialtab ? _.regex.getNumber(container.dataset.initialtab)-1 : 0 ;
            if (initialtab < 0 || initialtab >= container.children.length) {
                initialtab = -1; // 아코디언은 비선택 상태가 존재한다.
            }

        // 상태 업데이트
        _.accordionChoose(container, initialtab);

        // 아코디언 버튼 리스너
        container.querySelectorAll(_.var.accordion.btn).forEach( btn => {
            btn.addEventListener(tabevent, e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                // 버튼이 속한 부모 구하기
                parent = _.handler.getClosest(btn, _.var.accordion.array);
                
                // 부모의 인덱스 구하기
                index = Array.prototype.slice.call(container.children).indexOf(parent);
                
                // 상태 업데이트 ( 펼쳐져있지 않을때만 )
                _.accordionChoose(container, index, parent.classList.contains(_.var.trim(_.var.accordion.active)), scope, effect);

            });
        });

        // 준비가 완료되면 필요없는 클래스를 삭제한다.
        container.classList.remove(_.var.trim(_.var.css.notready));

    }
    
    /*
     * 토글 수행
     */
    toggleEvent(btn, boolean) {

        const _ = this;

        let scope;
        let target;
        let siblings;
        let container;
        let toggleClass;
        let parent;

        // 토글 부모를 찾는다.
        target = btn.dataset.target || _.var.toggle.container ;
        container = _.handler.getClosest(btn, target)
                    || document.querySelector(target)
                    || _.handler.getClosest(btn, 'div') ;

        // 부모를 기억해두자.
        parent = btn.parentElement;

        // 자식과 부모를 이어준다.

        // 토글 커버의 시블링 요소들을 꺼준다. ( data-scope="chain" )
        scope = btn.dataset.scope || 'undefined';

        // 토글이 특정 클래스를 요구한다면 대체해준다.
        toggleClass = btn.dataset.class || _.var.toggle.active ;

        // 체인으로 연결되어 있다면
        if (scope === 'chain') {
            siblings = _.handler.getSibling(container, _.var.toggle.container);
            siblings.forEach((sibling, elem) => {
                sibling.classList.remove(_.var.trim(toggleClass));
            });

        // 모든 영역을 다 닫아준다
        // 패널 닫기 같은 경우이고, 나머지는 수행을 멈춘다.
        } else if (scope === "closeall") {

            _.toggleCloseAll();
            return false;

        }

        // 토글 커버의 클래스를 토글한다.
        if (boolean || !_.handler.hasClass(container, _.var.trim(toggleClass))) {

            container.classList.add(_.var.trim(toggleClass));
            if ( parent && target != _.var.toggle.container ){

                parent.classList.add(_.var.trim(toggleClass));
            }

        } else {

            container.classList.remove(_.var.trim(toggleClass));
            if ( parent && target != _.var.toggle.container ){
                parent.classList.remove(_.var.trim(toggleClass));
            }

        }

    }

    /*
     * 토글 버튼 리스터
     */
    toggleButton() {

        /*
            기본 태그 골격
            만약 attribute data-toggle 이 없다면, 기본 셀렉터는 div 이다.
            셀렉터는 css 선택자와 동일하게 수행하며, closest 이므로 자신을 포함한다.
            data-siblings="connect" 이 옵션은 부모의 sibling 요소들을 함께 off 시키는 목적이다.
            <div class="sp--toggle">
                <button class="sp--toggle-btn" data-target="div" data-scope="connect">토글 클래스</button>
            </div>
        */

        const _ = this;

        let data;
        let boolean;
        let toggleEvent;

        // 토글 버튼 리스너
        document.querySelectorAll(_.var.toggle.btn +`:not(${_.var.init.togglebtn})`).forEach( btn => {

            data = btn.dataset;
            toggleEvent = data && data.event ? data.event : 'click' ;

            // 클릭 이벤트
            if (toggleEvent === 'click') {

                btn.addEventListener('click', e => {

                    data = btn.dataset;
                    boolean = data.boolean;

                    // 리스너 초기화
                    e.stopImmediatePropagation();

                    // 이벤트 수행
                    _.toggleEvent(btn, boolean);

                });

            // 호버, 리브 이벤트
            } else if ( toggleEvent === 'hover' ) {

                btn.addEventListener('mouseenter', e => {

                    // 리스너 초기화
                    e.stopImmediatePropagation();

                    // 이벤트 수행
                    _.toggleEvent(btn, true);

                });
                btn.addEventListener('mouseleave', e => {

                    // 리스너 초기화
                    e.stopImmediatePropagation();

                    // 이벤트 수행
                    _.toggleEvent(btn, false);

                });

            // 호버 엔드 이벤트
            } else if ( toggleEvent === 'hoverfix' ) {

                btn.addEventListener('mouseenter', e => {

                    // 리스너 초기화
                    e.stopImmediatePropagation();

					// 모두 닫아주기
					_.toggleCloseAll(e, true);

                    // 이벤트 수행
                    _.toggleEvent(btn, true);

                });

            }

            // 기 수행 체크
            btn.classList.add(_.var.trim(_.var.init.togglebtn));

        });

        // 토글창을 esc 버튼으로 모두 닫아준다.
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                _.toggleCloseAll();
            }
        });

        // 토글 외부를 클릭했을때 모두를 닫아준다.
        document.querySelector('body').addEventListener('click', e => {
            _.toggleCloseAll(e);
        });

    }

    /*
     * 모든 토글 컨테이너 닫기
     */
    toggleCloseAll(e, fix) {

        const _ = this;

        let closest = e && _.handler.getClosest(e.target, _.var.toggle.container) ? false : true ;

        if (document.querySelectorAll(_.var.toggle.active).length) {
            if (closest) {
                document.querySelectorAll(_.var.toggle.active).forEach( container => {
					container.classList.remove(_.var.trim(_.var.toggle.active));
                });
            }
        }

    }

    /*
     * 드롭다운 이벤트
     */
    dropdownEvent() {

        const _ = this;

        let win;
        let rect;
        let style;

        // 드롭다운 위치가 우측으로 붙어있다면, 우측이라는 표시를 해준다.
        document.querySelectorAll(_.var.dropdown.firstli +`:not(${_.var.init.dropdownfirstli})`).forEach( container => {

            style = _.handler.getStyle(container);

            // 가로형 슬라이더에에만 적용한다.
            if (style.display != 'block') {

                container.addEventListener('mouseenter', e => {

                    // 리스너 초기화
                    e.stopImmediatePropagation();

                    win = _.handler.getWindow();
                    rect = _.handler.getRect(container);
                    style = _.handler.getStyle(container);

                    // 마우스 오버시 화면 끝에 붙어있는 레이어들을 정리해준다.
                    if (rect.left < 200) {
                        container.setAttribute('direction', 'ltr');
                    } else if (rect.right > win.width - 200 ) {
                        container.setAttribute('direction', 'rtl');
                    } else {
                        container.removeAttribute('direction');
                    }

                });

            };

            // 기 수행 체크
            container.classList.add(_.var.trim(_.var.init.dropdownfirstli));

        });

        let subcount;

        // 서브 메뉴들이 자식이 있는지 조회해서 표시해준다.
        document.querySelectorAll(_.var.dropdown.subli +`:not(${_.var.init.dropdownsubli})`).forEach( container => {

            if (container.querySelector(':scope > div')) {
                container.setAttribute('sub', 'true');
            }

            // 기 수행 체크
            container.classList.add(_.var.trim(_.var.init.dropdownsubli));

        });

    }

    /*
     * 드롭다운 이벤트
     */
    responsiveTable() {

        const _ = this;

        let i = 0;
        let head;
        let th, tr, td;

        // 반응형 명령이 있는 테이블만 조회한다.
        document.querySelectorAll(_.var.table.container +`[responsive]:not(${_.var.init.table})`).forEach( container => {

            head = container.querySelectorAll('thead tr th');

            th = [];
            head.forEach( head => {

                th[i] = head.innerHTML || '' ;
                i++;

            });

            tr = container.querySelectorAll('tbody tr');
            tr.forEach( tr => {

                i = 0;
                td = tr.querySelectorAll('td');
                td.forEach( td => {

                    if (th[i]) td.setAttribute('label', th[i]);
                    i++;

                });
                
            });

            // 기 수행 체크
            container.classList.add(_.var.trim(_.var.table.container +`[responsive]`));

        });

    }

}

/*
 * 생성하기
 */
const SP_INTERFACE_NEW = new SP_INTERFACE();

/*
 * 내보내기
 */
export {
    SP_INTERFACE_NEW as SP_INTERFACE
}