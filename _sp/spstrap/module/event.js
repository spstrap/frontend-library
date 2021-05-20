/*
 * 모듈 호출
 */
import { 
    SP_VAR,
    SP_REGEX,
    SP_HANDLER,
    SP_ANIMATE
} from './modules.js';

/*
 * 모드
 */
'use strict';

/*
 * 클래스 선언
 */
class SP_EVENT {

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
        _.animate = SP_ANIMATE;

        // 링크 처리
        _.currentLink();

        // 페이지가 온로드 되면 한번 더 수행
        window.addEventListener('load', function(){
            _.currentLink();
        });

        _.init();

    }

    /*
     * 최초수행
     */
    init() {

        const _ = this;

        _.pageLoader();
        _.modalButton();
        _.popupButton();
        _.gotoButton();
        _.triggerButton();
        _.messageBtn();
        _.tabsLayout();
        _.dragElement();

    }

    /*
     * 아작스 리턴 ( with promise )
     */
    goAjax(data) {

        const _ = this;

        if (!data){
            data = {};
        }

        let url = data.url;
        let method = data.method || 'get' ;
        let timeout = data.timeout || 3000 ;
        let selector = data.selector || 'body' ;

        let result, contents;
        let dummy = document.createElement('div');

        // 프로미스 수행
        return new Promise( resolve => { 

            let json;
            let xhr = new XMLHttpRequest();
            xhr.timeout = timeout;
            xhr.open(method, url, true);
            xhr.onload = () => {

                // json 데이터라면 그 자체를 리턴해준다.
                // 리소스 소비가 있지만, 오류를 줄일 수 있다.
                try {
                    json = JSON.parse(xhr.responseText);
                } catch(e) {
                    json = '';
                }
                if (typeof json === 'object') {

                    // 리턴
                    resolve(json);

                // HTML 형태의 데이터라면 가공해서 중요 부분만 리턴해준다.
                } else {

                    dummy.innerHTML = xhr.responseText;
                    result = dummy.querySelector(selector) 
                           ? dummy.querySelector(selector) : '';
                    contents = result ? result.innerHTML : dummy.innerHTML ;

                    // 리턴
                    resolve([contents, result]);

                }

            };
            xhr.send();

        });

    }

    /*
     * 현재 페이지를 on 시켜주는 기능
     */
    currentLink() {

        const _ = this;

        let btnHref;
        let currentPage = _.handler.getPath('href') || '' ;
        let currendNode, currendChain;

        // 현재 링크로 체크를 원하는 버튼 배열
        document.querySelectorAll(_.var.currentlink.btn +`:not(${_.var.init.currentlink})`).forEach( btn => {

            btnHref = btn.getAttribute('href') || '' ;
            if (currentPage.indexOf(btnHref) != -1) {

                btn.classList.add(_.var.trim(_.var.currentlink.active));

                /* 카페24 부모 카테고리 연결 *************************************************/
                // 첫번째 부모 체인
                currendNode = _.handler.getClosest(btn, 'div');
                currendNode = _.handler.getClosest(currendNode, 'li');
                currendChain = currendNode ? currendNode.querySelector(':scope > ' + _.var.currentlink.btn) : '' ;
                if (currendChain) {
                    currendChain.classList.add(_.var.trim(_.var.currentlink.active));

                    // 두번째 부모 체인
                    currendNode = _.handler.getClosest(currendChain, 'div');
                    currendNode = _.handler.getClosest(currendNode, 'li');
                    currendChain = currendNode ? currendNode.querySelector(':scope > ' + _.var.currentlink.btn) : '' ;
                    if (currendChain) {
                        currendChain.classList.add(_.var.trim(_.var.currentlink.active));

                        // 세번째 부모 체인
                        currendNode = _.handler.getClosest(currendChain, 'div');
                        currendNode = _.handler.getClosest(currendNode, 'li');
                        currendChain = currendNode ? currendNode.querySelector(':scope > ' + _.var.currentlink.btn) : '' ;
                        if (currendChain) {
                            currendChain.classList.add(_.var.trim(_.var.currentlink.active));
                        }
                    }

                }
                /***************************************************************************/
                

            }

            // 기 수행 체크
            btn.classList.add(_.var.trim(_.var.init.currentlink));

        });

    }

    /*
     * 팝업창 띄우기 
     */
    openPopup(btn) {

        /*
            직접 호출하려면
            popup( {href:'URL'} );
            버튼을 클릭해서 이벤트를 받으려면
            <button href="URL" class="sp-popupbtn" data-width="100" data-height="300">버튼</button>
        */
       
        const _ = this;

        const baseWidth = screen.width * .9;
        const baseHeight = screen.height * .8;
        const baseTarget = '';

        if (typeof btn === 'object' && btn.href) {
            btn.width = btn.width || baseWidth;
            btn.height = btn.height || baseHeight;
            btn.target = btn.target || baseTarget;
        } else if (typeof btn != 'object') {
            return `${typeof btn} 버튼이 오브젝트가 아닙니다.`;
        } else if (typeof btn.getAttribute === 'undefined') {
            return `버튼이 href 속성을 포함하지 않습니다.`;
        }

        let top,left,option;
        let url = btn.href || btn.getAttribute('href');
        let width = btn.dataset.width || btn.width || baseWidth;
        let height = btn.dataset.height || btn.height || baseHeight;
        let target = btn.target || btn.dataset.target || baseTarget;

        if (width.toString().indexOf('%') != -1) {
            width = screen.width * _.regex.getNumber(width) / 100;
        }
        if (height.toString().indexOf('%') != -1) {
            height = screen.height * _.regex.getNumber(height) / 100;
        }

        top = (screen.height/2)-(height/2)-50;
        left = (screen.width/2)-(width/2);

        option  = 'toolbar=no,';
        option += 'location=no,';
        option += 'directories=no,';
        option += 'status=no,';
        option += 'menubar=no,';
        option += 'scrollbars=yes,';
        option += 'resizable=yes,';
        option += 'copyhistory=no,';
        option += 'location=no,';
        option += 'width='+ width +',';
        option += 'height='+ height +',';
        option += 'top='+ top +',';
        option += 'left='+ left +',';
    
        return window.open( url, target, option );

    }

    /*
     * 팝업창 띄우는 버튼 클릭
     */
    popupButton() {

        const _ = this;
        
        // 팝업창 버튼 이벤트
        document.querySelectorAll(_.var.popup.btn +`:not(${_.var.init.popupbtn})`).forEach( btn => {
            
            btn.addEventListener('click', e => {

                // 리스너 초기화
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                _.openPopup(btn);

            });

            // 기 수행 체크
            btn.classList.add(_.var.trim(_.var.init.popupbtn));

        });

    }

    /*
     * 모달창 띄우기 
     */
    showModal(btn) {

        const _ = this;

        let target = btn.dataset.target;
        let url = btn.dataset.url || '' ;
        let container = document.querySelector(target);

        if (!container) {
            return false;
        }

        container.classList.add(_.var.trim(_.var.modal.active));
        _.animate.fadeIn(container, _.var.css.duration_fast).then( () => { 
            //
        });

    }

    /*
     * 모달창 닫기
     */
    hideModal(btn) {

        const _ = this;

        let fromAjax = _.handler.getClosest(btn, _.var.init.ajaxcontents);
        let container = _.handler.getClosest(btn, _.var.modal.container);

        _.animate.fadeOut(container, _.var.css.duration_fast).then( () => { 

            container.classList.remove(_.var.trim(_.var.modal.active));
            if (fromAjax) {
                fromAjax.remove();
            }

        });

    }

    /*
     * 모달창 띄우는 버튼 클릭
     */
    modalButton() {

        const _ = this;

        // 모달창 열기 이벤트
        document.querySelectorAll(_.var.modal.btn +`:not(${_.var.init.modalbtn})`).forEach( btn => {

            btn.addEventListener('click', e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                _.showModal(btn);

            });

            // 기 수행 체크
            btn.classList.add(_.var.trim(_.var.init.modalbtn));

        });

        // 모달창 닫기 이벤트
        document.querySelectorAll(_.var.modal.hidebtn +`:not(${_.var.init.modalbtn})`).forEach( btn => {

            btn.addEventListener('click', e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                _.hideModal(btn);

            });

            // 기 수행 체크
            btn.classList.add(_.var.trim(_.var.init.modalbtn));

        });

        // 모달창 외부 클릭 이벤트
        if (document.querySelector(_.var.modal.container)) {
            document.querySelectorAll(_.var.modal.container +`:not(${_.var.init.modalbtn})`).forEach( container => {

                container.addEventListener('click', e => {

                    // 리스너 초기화
                    //e.stopImmediatePropagation();
                    
                    if (e.target.classList.contains(_.var.trim(_.var.modal.container))) {
                        _.hideModal(e.target);
                    }

                });

                // 기 수행 체크
                container.classList.add(_.var.trim(_.var.init.modalbtn));

            });
        }

        // 모달이 떠있을때, esc 키를 누르면 다 닫는다.
        document.addEventListener('keydown', e => {

            // 리스너 초기화
            //e.stopImmediatePropagation();

            if (e.keyCode === 27) {
                if (document.querySelectorAll(_.var.modal.container + _.var.modal.active).length) {
                    document.querySelectorAll(_.var.modal.container + _.var.modal.active).forEach( container => {

                        _.hideModal(container);

                    });
                }
            }
            
        });
        
    }

    /*
     * 바디 로더
     */
    pageLoader() {

        const _ = this;

    }

    /*
     * loading start
     */
    loaderStart(type, event) {

        const _ = this;

        let win = _.handler.getWindow();
        let posX = event ? event.x : 0 ;
        let posY = event ? window.scrollY + event.y : 0 ;
        let position = posX 
                     ? `top:${posY}px;left:${posX}px;`
                     : `position:fixed;bottom:30px;right:30px;` ;

        let container = document.querySelector('body');
        let loader = (type === 'cover') ? 
        `
            <div class="sp--loader" scope="cover">
                <div class="sp--loader-cover">
                    <div class="sp--loader-circle">
                        <svg viewBox="25 25 50 50" ><circle cx="50" cy="50" r="20" fill="none" stroke="#000" stroke-width="2" /></svg>
                    </div>
                </div>
            </div>
        ` : `
            <div class="sp--loader" style="${position}">
                <div class="sp--loader-cover">
                    <div class="sp--loader-circle">
                        <svg viewBox="25 25 50 50" ><circle cx="50" cy="50" r="20" fill="none" stroke="#000" stroke-width="2" /></svg>
                    </div>
                </div>
            </div>
        `;

        _.handler.append(container, loader);

    }

    /*
     * loading ebd
     */
    loaderEnd() {

        const _ = this;

        document.querySelectorAll(_.var.loader.container +`:not(${_.var.init.loader})`).forEach( container => {

            _.animate.fadeOut(container, _.var.css.duration_slow).then( () => { 
                container.remove();
            });

            setTimeout(() => {
                container.remove();
            }, _.var.css.duration_slow * 2);

            // 기 수행 체크
            container.classList.add(_.var.trim(_.var.init.loader));

        });

    }

    /*
     * drag element
     */
    dragElement(element) {

        const _ = this;

        let option = {};
        let handler;

        // 드래그 엘리먼트 리스너 추가
        document.querySelectorAll(_.var.drag.container +`:not(${_.var.init.drag})`).forEach( container => {

            handler = container.querySelector(_.var.drag.handler)
                    ? container.querySelector(_.var.drag.handler) : container ;

            handler.addEventListener('mousedown', e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                _.dragElementDown(e, container, handler);

            });

            // 기 수행 체크
            container.classList.add(_.var.trim(_.var.init.drag));

        });

    }

    /*
     * drag element down
     */
    dragElementDown(e, container, handler) {

        const _ = this;

        e = e || window.event;
        e.preventDefault();

        let option = {};
        let style = window.getComputedStyle(container);
        let matrix = style.transform
                   || style.webkitTransform 
                   || style.mozTransform;

        option.rect = _.handler.getRect(container);

        option.top = style.top != '0px' ? option.rect.top : 0 ;
        option.left = style.left != '0px' ? option.rect.left : 0 ;

        option.matrix = matrix.replace(/[^0-9\-.,]/g, '').split(',');
        option.x = option.matrix[12] || option.matrix[4] || 0 ;
        option.y = option.matrix[13] || option.matrix[5] || 0 ;
        
        option.pos3 = e.clientX;
        option.pos4 = e.clientY;
        option.gapX = option.pos3 - option.rect.x - option.x;
        option.gapY = option.pos4 - option.rect.y - option.y;
        
        document.onmouseup = () => {
            _.dragElementStop();
        }
        document.onmousemove = e => {
            _.dragElementMove(e, container, handler, option);
        }

    }

    /*
     * drag element move
     */
    dragElementMove(e, container, handler, option) {

        const _ = this;

        e = e || window.event;
        e.preventDefault();

        option.pos1 = e.clientX - option.left - option.gapX;
        option.pos2 = e.clientY - option.top - option.gapY;

        container.style.transform = 'translate3d(' + option.pos1 + 'px, ' + option.pos2 + 'px, 0)';

    }

    /*
     * drag element stop
     */
    dragElementStop() {

        const _ = this;

        document.onmousemove = null;
        document.onmousemove = null;

    }

    /*
     * 트리거 이벤트 생성
     */
    triggerButton() {

        const _ = this;

        let data;
        let target;

        /**
         * Simulate a click event.
         * @public
         * @param {Element} elem  the element to simulate a click on
         */
        let simulateClick = function (elem) {
            // Create our event (with options)
            let evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            // If cancelled, don't dispatch our event
            let canceled = !elem.dispatchEvent(evt);
        };

        // 트리거 버튼 리스너
        document.querySelectorAll(_.var.trigger.btn +`:not(${_.var.init.triggerbtn})`).forEach( btn => {
            
            btn.addEventListener('click', e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                data = btn.dataset;
                if (data.trigger) {
                    target = document.querySelector(`[trigger="${data.trigger}"]`);
                    simulateClick(target);
                }

            });

            // 기 수행 체크
            btn.classList.add(_.var.trim(_.var.init.triggerbtn));

        });

    }

    /*
     * go to 기능 구현
     */
    gotoButton() {

        const _ = this;

        let data;
        let speed;
        let target;
        let element;
        let gap;
        let regex = /^\#|^\./gi;

        // 스크롤 버튼 리스너       
        document.querySelectorAll(_.var.goto.btn +`:not(${_.var.init.gotobtn})`).forEach( btn => {

            btn.addEventListener('click', e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                data = btn.dataset;
                speed = data.speed === '0' ? 0 : _.regex.getNumber(data.speed) || _.var.css.duration ;

                gap = _.regex.getNumber(data.gap) || 0;
                target = data.target;
                
                if (target.match(regex)) {
                    element = document.querySelector(target);
                } else {
                    element = document.querySelector(`a[name="${target}"]`);
                }

                element = element || _.regex.getNumber(target) ;
                if (element || _.regex.isNumber(element)) {
                    _.handler.goto(element, speed, gap);
                }

            });

        });

    }

    /*
     * 탭 디자인
     */
    tabsLayout() {

        const _ = this;

        // 탭 배열
        document.querySelectorAll(_.var.tabs.container +`:not(${_.var.init.tab})`).forEach( container => {

             // 개별 수행
             _.initTabs(container);

            // 기 수행 체크
            container.classList.add(_.var.trim(_.var.init.tab));

        });

    }

    /*
     * 탭 현재상태 켜주기
     */
    tabsChoose(container, controler, contents, index, effect, result) {

        const _ = this;

        if (index === 'hold') {
            return;
        }

        if (container.dataset.tabevent != 'disabled') {
            container.querySelectorAll(_.var.tabs.active).forEach( btn => {
                btn.classList.remove(_.var.trim(_.var.tabs.active));
            });
        }

        if (controler.children && controler.children[index]) {
            controler.children[index].classList.add(_.var.trim(_.var.tabs.active));
        }

        if (contents.children && contents.children[index]) {
            contents.children[index].classList.add(_.var.trim(_.var.tabs.active));

            // 만약 ajax 컨텐츠가 있다면 넣어주고,
            if (result) {
                contents.children[index].innerHTML = result;
            }

            if (effect === 'fade') {

                // 페이드 인
                contents.children[index].classList.add(_.var.trim(_.var.animation.to_fadein));

            } else if (effect === 'slideup') {

                // 슬라이드 인 ( fixed 요소에는 사용할 수 없다 )
                contents.children[index].classList.add(_.var.trim(_.var.animation.to_slideup));

            } else if (effect === 'slidedown') {

                // 슬라이드 인 ( fixed 요소에는 사용할 수 없다 )
                contents.children[index].classList.add(_.var.trim(_.var.animation.to_slidedown));

            }

            // 이펙트 요소가 있다면 클래스 생성
            if (_.var.trim(_.var.animation[effect])) {
                contents.children[index].classList.add(_.var.trim(_.var.animation[effect]));
            }

            // 탭을 선택 할 경우 스크롤을 상단으로 이동시켜주기
            let scrollInstance = _.handler.getClosest(contents, '.os-viewport');
            if (scrollInstance) {
                scrollInstance.scrollTo({top:0, left:0, behavior:'auto'});
            }

        }

    }

    /*
     * 탭 개별수행
     */
    initTabs(container) {

        const _ = this;

        let index;
        let controler = container.querySelector(_.var.tabs.controler);
        let contents = container.querySelector(_.var.tabs.contents);
        let effect = container.dataset.effect ? container.dataset.effect : '' ;
        let tabevent = container.dataset.tabevent ? container.dataset.tabevent : 'click' ;

        // 컨트롤러나 컨텐츠가 없으면 리턴
        if (!controler || !contents) {
            return false;
        }

        // 탭이 컨텐츠를 검수하고자 한다면,
        let rule = [];
        rule.data = container.dataset.rule ? container.dataset.rule : '' ;
        if (rule.data === 'strong') {
            rule.index = 0;
            rule.liveIndex = 0;
            rule.control = Array.from(controler.children);
            rule.content = Array.from(contents.children);
            rule.control.forEach( vControler => {

                rule.arrControl = rule.control[rule.index];
                rule.arrContent = rule.content[rule.index];
                rule.display = rule.arrContent ? _.handler.hasClass(rule.arrContent, '.displaynone') : false ;
                rule.html = rule.arrContent ? _.regex.trim(rule.arrContent.innerHTML) : '' ;

                // 컨텐츠가 숨겨져있거나,
                // 아예 없는 경우는 메뉴도 함께 삭제한다.
                if (rule.display || rule.html.length < 1 ) {
                    rule.arrControl ? rule.arrControl.remove() : '' ;
                    rule.arrContent ? rule.arrContent.remove() : '' ;
                } else {
                    rule.liveIndex++;
                }

                rule.index++;

            });

            // 탭 컨텐츠가 없다면, 모조리 삭제
            if (rule.liveIndex === 0) {
                container.remove();
            // 탭 컨텐츠가 1개 이하라면 컨트롤러 삭제
            } else if (rule.liveIndex < 2) {
                controler.remove();
            }
        }

		// 탭의 타이틀을 컨텐츠에서 가져온다면
        let title = [];
		title.index = 0;
		title.control = Array.from(controler.children);
        title.content = Array.from(contents.children);
		title.content.forEach( subtitle => {

			title.target = subtitle.querySelector('.sp--tabs-subtitle');
			title.contents = title.target && typeof title.target === 'object' ? title.target.innerHTML : '' ;
			if (title.contents && typeof title.control[title.index] === 'object') {

                title.arrControl = title.control[title.index].querySelector('.sp--tabs-subtitle-grab');
				title.arrControl.innerHTML = title.contents;

			}

			title.index++;

		});

        // 탭 시작점 조회
        let initialajax = container.dataset.initialajax;
        let initialclass = container.dataset.initialclass;
        let initialtab = container.dataset.initialtab ? _.regex.getNumber(container.dataset.initialtab)-1 : 0 ;
            if (initialtab < 0 || initialtab >= controler.children.length) {
                initialtab = 0;
            }

        // for cafe24.com
        // 만약 ajaxComplete를 체크해야 하는 경우라면 //////////////////////////////
        if (initialajax) {

            // 탭 상태를 홀드시키고
            initialtab = 'hold';
            _.handler.ajaxComplete(initialajax, () => {

                index = 0;
                controler.querySelectorAll(':scope > li').forEach( select => {
                    // 만족하는 클래스를 selected 라고 가정.
                    if (_.handler.hasClass(select, initialclass)) {
                        initialtab = index;
                    }
                    index++;
                });
                
                // 상태 업데이트
                _.tabsChoose(container, controler, contents, initialtab, effect);

            });

        } ///////////////////////////////////////////////////////////////////////

        // 상태 업데이트
        _.tabsChoose(container, controler, contents, initialtab, effect);

        // 탭 버튼 리스너
        controler.querySelectorAll(':scope > *').forEach( (btn, index) => {
            btn.addEventListener(tabevent, e => {

                // 리스너 초기화
                // 동시 실행의 경우가 존재한다.
                //e.stopImmediatePropagation();

                // 인덱스 구하기
                index = Array.prototype.slice.call(controler.children).indexOf(btn);

                /*
                ** 탭에서 ajax 컨텐츠를 요구하는 경우
                */
                let data = btn.dataset;
                if (data && data.url) {

                    // 로딩 시작
                    _.loaderStart('this', e);
                    _.goAjax(data).then( result => {

                        // 로딩 종료
                        _.loaderEnd();

                        // ajax 형태로 로드
                        _.tabsChoose(container, controler, contents, index, effect, result[0]);

                        // 콜백
                        _.tabAjaxCallback(result[1]);

                    });

                /*
                ** 탭이 라디오 버튼과 체인인 경우
                */
                } else if (data && data.chain && data.value) {

                    let chain = document.querySelector(data.chain);
                    chain.value = data.value;

                    // 일반 탭 디자인 로드
                    _.tabsChoose(container, controler, contents, index, effect);

                } else {

                    // 일반 탭 디자인 로드
                    _.tabsChoose(container, controler, contents, index, effect);

                }

            });
        });

        // 준비가 완료되면 필요없는 클래스를 삭제한다.
        container.classList.remove(_.var.trim(_.var.css.notready));

    }

    /*
     * 아작스 콜백 펑션
     * 콜백 기능이 string 형태이므로 정확하게 입력하는것이 핵심
     * 과도한 요청은 하지 않는것이 좋다. ( new class )
     */
    tabAjaxCallback(result) {

        const _ = this;

        if (!result.dataset) {
            return false;
        }

        let callback = result.dataset ? result.dataset.callback : '' ;
        callback = callback ? callback : '' ;

        if (callback.indexOf('tab') != -1) {
            _.tabsLayout();
        }
        if (callback.indexOf('product') != -1) {
            window.SP_CAFE24.product.init();
        }

    }

    /*
     * 메세지 띄우기
     */
    message(msg, theme, effect) {

        const _ = this;

        let content = `
            <div class="sp--message">
                <div class="sp--message-contents">
                    <div class="sp--desc" theme="xl-roundmax" fill="${theme}" gap="2xl">
                        <div class="sp--font" gap="3xl-x">${msg}</div>
                    </div>
                </div>
            </div>
        `;
        let target = document.querySelector('body');
        let timeout = msg.length * _.var.message.unit || 1 ;
        if (timeout < _.var.message.min) {
            timeout = _.var.message.min;
        } else if (timeout > _.var.message.max) {
            timeout = _.var.message.max;
        }

        // 화면에 넣어주고
        _.handler.append(target, content).then( contents => { 

            // 이펙트 요소가 있다면 클래스 생성
            if (_.var.trim(_.var.animation[effect])) {
                contents.classList.add(_.var.trim(_.var.animation[effect]));
            }

            // 보기 싫은 사람이 클릭했다면,
            contents.addEventListener('click', e => {
                _.messageRemove(contents);
            });

            // 일정 시간이 흐르면
            setTimeout(() => {
                _.messageRemove(contents);
            }, timeout);

        });

    }

    /*
     * 메세지 띄우기 버튼
     */
    messageBtn() {

        const _ = this;

        let data, msg, theme, effect;

        // 메세지 버튼 배열
        document.querySelectorAll(_.var.message.btn +`:not(${_.var.init.messagebtn})`).forEach( btn => {

            btn.addEventListener('click', e => {

                // 리스너 초기화
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                data = btn.dataset;
                msg = data.msg
                theme = data.theme || 'primary' ;
                effect = data.effect || 'to_slideup' ;

                _.message(msg, theme, effect);

            });

            // 기 수행 체크
            btn.classList.add(_.var.trim(_.var.init.messagebtn));

        });

    }

    /*
     * 메세지 제거하기
     */
    messageRemove(contents) {

        const _ = this;

        // 페이드 아웃 뒤
        _.animate.fadeOut(contents, _.var.css.duration).then( () => { 

            // 메세지 DOM 제거
            contents.remove();

        });

    }

}

/*
 * 생성하기
 */
const SP_EVENT_NEW = new SP_EVENT();

/*
 * 내보내기
 */
export {
    SP_EVENT_NEW as SP_EVENT
}