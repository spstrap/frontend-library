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
class SP_COOKIE {

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

        _.init();

    }

    /*
     * 최초수행
     */
    init() {

        const _ = this;

        _.cookieButton();
        _.setCookieLayout();

    }

    /*
     * 쿠키 가져오기
     */
    getCookie(name) {

        const _ = this;

        let cookieIndex;
        let cookieEndIndex;

        const cookie = document.cookie;

        if (cookie.length > 0) {
            cookieIndex = cookie.indexOf(name);
            if (cookieIndex != -1) {
                cookieIndex += name.length;
                cookieEndIndex = cookie.indexOf(";", cookieIndex);
                if (cookieEndIndex == -1) cookieEndIndex = cookie.length;
                return unescape(cookie.substring(cookieIndex+1, cookieEndIndex));
            }else{
                return false;
            }
        } else {
            return false;
        }

    }

    /*
     * 쿠키 설정하기
     */
    setCookie(name, value, date) {

        const _ = this;

        let today = new Date();

        today.setDate(today.getDate() + parseInt(date));
        document.cookie = name + '=' + escape(value) + '; path=/; expires=' + today.toGMTString() + ';';

    }

    /*
     * 쿠키 삭제하기
     */
    delCookie(name) {

        const _ = this;

        let expireData = new Date();

        expireData.setDate(expireData.getDate() - 1);
        document.cookie = name + '=; expires=' + expireData.toGMTString() + '; path=/';

    }

    /*
     * 쿠키 생성 버튼
     */
    cookieButton() {

        /*
            기본 태그 골격 ( 쿠키 구우면 sp--cookie-on 클래스 생성 )
            <div class="sp--cookie" data-cookie="test" style="display:none;">
                쿠키 컨텐츠
                <button class="sp--cookie-btn" data-cookie="test" data-scope="set" data-value="val" data-date="3" style="display:none;">쿠기 굽기</button>
            </div>
            <button class="sp--cookie-btn" data-cookie="test" data-scope="del" style="display:none;">쿠기 제거하기</button>
        */

        const _ = this;

        let name;
        let date;
        let scope;
        let value;
        let setBtn;
        let delBtn;
        let container;

        // 쿠키 버튼 리스너
        document.querySelectorAll(_.var.cookie.btnClass +`:not(${_.var.init.cookiebtn})`).forEach( btn => {

            btn.addEventListener('click', e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                // 쿠키 부모를 찾는다.
                name = btn.dataset.cookie || 'name';
                scope = btn.dataset.scope || 'set';
                value = btn.dataset.value || true;
                date = btn.dataset.date || 1;
                container = document.querySelector(`${_.var.cookie.cookieClass}[data-cookie=${name}]`);

                // 쿠키 버튼을 정의한다.
                setBtn = document.querySelector(`${_.var.cookie.btnClass}[data-scope="set"][data-cookie="${name}"]`);
                delBtn = document.querySelector(`${_.var.cookie.btnClass}[data-scope="del"][data-cookie="${name}"]`);

                // 쿠키 커버에 클래스를 생성한다.
                if (scope === 'set') {

                    // 클래스 업데이트
                    container.classList.add(_.var.cookie.cookieSwitch);

                    // 버튼 상태 업데이트
                    if (delBtn) delBtn.removeAttribute('style');
                    if (setBtn) setBtn.setAttribute('style', 'display:none;');

                    // 쿠키 구워주기
                    _.setCookie(name, value, date);

                } else if (scope === 'del') {

                    // 클래스 업데이트
                    container.classList.remove(_.var.cookie.cookieSwitch);

                    // 버튼 상태 업데이트
                    if (setBtn) setBtn.removeAttribute('style');
                    if (delBtn) delBtn.setAttribute('style', 'display:none;');

                    // 쿠키 삭제하기
                    _.delCookie(name);

                    // 만약 다시 보여줘야 하는 로직이 있다면
                    // 클릭해서 ajax를 호출해준다. 
                    // 순환참조 오류때문에 함수 호출이 불가능한 상황
                    let chainAjax = document.querySelector(`${_.var.ajax.container}[data-cookie=${name}]`);
                    if (chainAjax) {
                        let chainAjaxBtn = chainAjax.querySelector(`${_.var.ajax.btn}`);
                        if (chainAjaxBtn) {
                            chainAjaxBtn.click();    
                        }
                    }
            
                }

            });

            // 기 수행 체크
            btn.classList.add(_.var.trim(_.var.init.cookiebtn));

        });

    }

    /*
     * 쿠키가 설정된 레이아웃 정의
     */
    setCookieLayout() {

        const _ = this;

        let cookieName;
        let setBtn;
        let delBtn;

        // 쿠키 레이아웃 리스너
        document.querySelectorAll(_.var.cookie.cookieClass +`:not(${_.var.init.cookie})`).forEach( element => {

            // 쿠키 정보를 얻는다.
            cookieName = element.dataset.cookie || 'name';

            // 쿠키 버튼을 정의한다.
            setBtn = document.querySelector(`${_.var.cookie.btnClass}[data-scope="set"][data-cookie="${cookieName}"]`);
            delBtn = document.querySelector(`${_.var.cookie.btnClass}[data-scope="del"][data-cookie="${cookieName}"]`);

            if (!_.getCookie(cookieName)) {
                element.classList.remove(_.var.cookie.cookieSwitch);
                if (setBtn) setBtn.removeAttribute('style');
            } else {
                element.classList.add(_.var.cookie.cookieSwitch);
                if (delBtn) delBtn.removeAttribute('style');
            }

            //element.removeAttribute('style');

            // 기 수행 체크
            element.classList.add(_.var.trim(_.var.init.cookie));

        });

    }

}

/*
 * 생성하기
 */
const SP_COOKIE_NEW = new SP_COOKIE();

/*
 * 내보내기
 */
export {
    SP_COOKIE_NEW as SP_COOKIE
}