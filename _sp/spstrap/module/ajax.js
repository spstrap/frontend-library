/*
 * 모듈 호출
 */
import {
    SP_VAR,
    SP_REGEX,
    SP_HANDLER,
    SP_SLIDER,
    SP_EVENT,
    SP_COOKIE,
    SP_SCROLLBAR,
    SP_VIDEO,
} from './modules.js';

/*
 * 모드
 */
'use strict';

/*
 * 클래스 선언
 */
class SP_AJAX {

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
        _.slider = SP_SLIDER;
        _.event = SP_EVENT;
        _.cookie = SP_COOKIE;
        _.scrollbar = SP_SCROLLBAR;
        _.video = SP_VIDEO

        _.init();

    }

    /*
     * 최초수행
     */
    init() {

        const _ = this;

        _.ajaxBtn();
        _.loadAjax(false);

    }

    /*
     * 아작스 수행
     */
    callAjax(element, e) {

        const _ = this;

        let xhr = new XMLHttpRequest();
        let url = element.dataset.url || '';
        let type = element.dataset.type || '';
        let effect = element.dataset.effect || '';
        let repeat = element.dataset.repeat || '';
        let scope = element.dataset.scope || '';
        let target = element.dataset.target;
        let cookie = element.dataset.cookie || '';
        let targetElement = document.querySelector(target) || '';
        let method = element.dataset.method || 'GET';

        // 로드 형태면 타겟이 없을시 자신을 타켓으로 한다.
        if (!e && !targetElement) {
            targetElement = element;

        // 버튼인데 타켓이 없다면 바디로 타켓을 정해준다.
        } else if (!targetElement) {
            targetElement = document.body;
        }

        // 주소값이 없다면 리턴
        if (!xhr || !url) {
            return false;
        }

        // 만약 타겟에 컨텐츠가 들어갔음이 선언되었다면 리턴
        if (_.handler.hasClass(targetElement, _.var.trim(_.var.init.ajax))) {
            // 반복할 수 있는 옵션이 있다면 예외처리
            if (!repeat) {
                return false;
            }
        }

        // 만약 쿠키와 연결되어 있고, 값이 있다면 리턴
        if (cookie && _.cookie.getCookie(cookie)) {
            return false;
        }

        // 로딩 시작
        _.event.loaderStart(type, e);
        xhr.timeout = _.var.ajax.timeout;
        xhr.open(method, url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        // 완료
        xhr.onload = () => {

            // 검수
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {

                    // 유일한 성공
                    _.getAjax(xhr, targetElement, effect, scope);
        
                    // 반복성 버튼이 아니라면 로드 후 제거한다.
                    if (e && !repeat) {
                        element.remove();
                    }

                } else {

                    // 오류
                    resetHash();

                    // 알수없는 오류 / 세션이 만료됐거나, 로그인 정보 체크 실패
                    console.error(`알수 없는 오류 ( ${xhr.status} )`);
                    //_.event.message('알수 없는 오류 ('+ xhr.status +')<br />화면을 새로고침 하시고<br />다시 시도해보시길 바랍니다.', 'dark', 'to_slideup');

                }
            } else {

                // 오류
                resetHash();

                // 알수없는 오류 / readyState가 4가 아닌 모든 경우.
                console.error(`알수 없는 오류 ( ${xhr.readyState} )`);
                //_.event.message('알수 없는 오류 ('+ xhr.readyState +')<br />화면을 새로고침 하시고<br />다시 시도해보시길 바랍니다.', 'dark', 'to_slideup');

            }

            // 로딩 종료
            _.event.loaderEnd();

        };
          
        xhr.ontimeout = (e) => {

            // 오류
            resetHash();

            // 로딩 종료
            _.event.loaderEnd();

            // 메세지 출력 ( 시간초과 )
            console.error(`제한시간 초과 ( ${_.var.ajax.timeout} )`);
			//_.event.message('제한시간이 초과 되었습니다.<br />화면을 새로고침 하시고<br />다시 시도해보시길 바랍니다.', 'dark', 'to_slideup');

        };

        xhr.onerror = (e) => {

            // 오류
            resetHash();

            // 로딩 종료
            _.event.loaderEnd();

            // 메세지 출력 ( 알수 없는 오류 )
            console.error(`알수 없는 오류 ( ${url} )`);
            //_.event.message('알수 없는 오류 입니다.<br />화면을 새로고침 하시고<br />다시 시도해보시길 바랍니다.', 'dark', 'to_slideup');

        };

        /******************************************************************
            예외처리 : pandassi banner
        ******************************************************************/
        let formData = new FormData();
        let formDataString = element.dataset.formdata;
        let meta = document.querySelector('meta[name="pandassiBannerCHN"]');
        let value = meta ? meta.getAttribute('content') : '' ;
        let param = Object.fromEntries(new URLSearchParams(formDataString));

        // 해쉬값이 있는 경우엔 헤더 정보를 업데이트
        function resetHash() {
            if (meta) meta.setAttribute('content', xhr.getResponseHeader('pandassiBannerCTN'));
        }

        Object.entries(param).forEach( (val, key, arr) => {
            formData.append(val[0], val[1]);
        });
        formData.append('pandassiBannerCTN', value);
        /******************************************************************/

        // 전송
        xhr.send(formData);

    }

    /*
     * 아작스 화면 로드후 수행
     */
    loadAjax(status) {

        const _ = this;

        let delay;

        // 온로드
        if (!status) {

            window.addEventListener('load', () => {
                _.loadAjax(true);
            });
            return;
        }

        // 온로드 후 아작스 더미 체크
        if (!document.querySelector(_.var.ajax.container)) {
            return;
        }

        // 아작스 로드 컨텐츠 배열
        document.querySelectorAll(_.var.ajax.container +`:not(${_.var.init.ajaxload})`).forEach( container => {

            // 지정된 시간 구하기
            delay = container.dataset.delay || _.var.ajax.delay ;
            delay = _.regex.getNumber(delay);

            // 지정된 시간 후에 아작스를 수행
            setTimeout(() => {
                _.callAjax(container);
            }, delay);

            // 기 수행 체크
            container.classList.add(_.var.trim(_.var.init.ajaxload));

        });

    }

    /*
     * 아작스 수행
     */
    getAjax(xhr, target, effect, scope) {

        const _ = this;

        let result;
        let content;
        let dummy = document.createElement('div');

        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {

                dummy.innerHTML = xhr.responseText;
                result = dummy.querySelector(_.var.ajax.result) 
                       ? dummy.querySelector(_.var.ajax.result) : '';
                content = result ? result.innerHTML : dummy.innerHTML ;

                /******************************************************************
                    예외처리 : pandassi banner
                ******************************************************************/
                let json = _.handler.parseJson(xhr.responseText);
                if (json && json.html) {

                    dummy.innerHTML = json.html;
                    result = dummy.querySelector(_.var.ajax.result) 
                           ? dummy.querySelector(_.var.ajax.result) : '';
                    content = result ? result.innerHTML : dummy.innerHTML ;

                    let meta = document.querySelector('meta[name="pandassiBannerCHN"]');
                    let value = xhr.getResponseHeader('pandassiBannerCTN');
            
                    // 해쉬에 값이 있다면 보안코드 변경
                    meta.setAttribute('content', value);

                }
                /******************************************************************/

                // 삽입형태
                if (scope === 'replace') {

                    _.handler.html(target, content).then( contents => { 

                        // 이펙트 요소가 있다면 클래스 생성
                        if (_.var.trim(_.var.animation[effect])) {
                            contents.classList.add(_.var.trim(_.var.animation[effect]));
                        }
    
                        // 기 수행 체크
                        target.classList.add(_.var.trim(_.var.init.ajax));
                        contents.classList.add(_.var.trim(_.var.init.ajaxcontents));
    
                    });

                } else if (scope === 'prepend') {

                    //

                } else {

                    _.handler.append(target, content).then( contents => { 

                        // 이펙트 요소가 있다면 클래스 생성
                        if (_.var.trim(_.var.animation[effect])) {
                            contents.classList.add(_.var.trim(_.var.animation[effect]));
                        }
    
                        // 기 수행 체크
                        target.classList.add(_.var.trim(_.var.init.ajax));
                        contents.classList.add(_.var.trim(_.var.init.ajaxcontents));
    
                    });

                }

                //콜백
                _.ajaxCallback(result);

            } else {

                // error

            }
        }

    }

    /*
     * 아작스 버튼 이벤트
     */
    ajaxBtn() {

        const _ = this;

        // 아작스 버튼 클릭 리스너
        document.querySelectorAll(_.var.ajax.btn +`:not(${_.var.init.ajaxbtn})`).forEach( btn => {

            btn.addEventListener('click', e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                _.callAjax(btn, e);

            });

            // 기 수행 체크
            btn.classList.add(_.var.trim(_.var.init.ajaxbtn));

        });

    }

    /*
     * 아작스 콜백 펑션
     * 콜백 기능이 string 형태이므로 정확하게 입력하는것이 핵심
     * 과도한 요청은 하지 않는것이 좋다. ( new class )
     */
    ajaxCallback(result) {

        const _ = this;

        if (!result.dataset) {
            return false;
        }

        let callback = result.dataset ? result.dataset.callback : '' ;
        callback = callback ? callback : '' ;

        // 배너를 요청 ( 판다씨 배너관리 )
        if (callback.indexOf('banner') != -1) {

            // 배너 모듈이 있다면 수행
            if (typeof pandassiBannerManage === 'object') {
                pandassiBannerManage.init();
            }

        }
        if (callback.indexOf('slider') != -1) {
            _.slider.init();
            _.event.dragElement(result);
        }
        if (callback.indexOf('cookie') != -1) {
            _.cookie.cookieButton();
        }
        if (callback.indexOf('modal') != -1) {
            _.event.modalButton();
        }
        if (callback.indexOf('currentlink') != -1) {
            _.event.currentLink();
        }
        if (callback.indexOf('tab') != -1) {
            _.event.tabsLayout();
        }
        if (callback.indexOf('scrollbar') != -1) {
            _.scrollbar.init();
        }
        if (callback.indexOf('video') != -1) {
            _.video.init();
        }

    }

}

/*
 * 생성하기
 */
const SP_AJAX_NEW = new SP_AJAX();

/*
 * 내보내기
 */
export {
    SP_AJAX_NEW as SP_AJAX
}