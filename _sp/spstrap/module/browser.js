/*
 * Bowser
 */
import Bowser from "../library/bowser/bowser.js";

/*
 * 모드
 */
'use strict';

/*
 * 클래스 선언
 */
class SP_BROWSER {

    /*
     * 초기화
     */
    constructor() {

        const _ = this;

        _.browser = Bowser.parse(window.navigator.userAgent);

    }

    /*
     * 브라우저 정보 가져오기
     */
    getBrowser(message) {

        const _ = this;

        return _.browser

    }

}

/*
 * 생성하기
 */
const SP_BROWSER_NEW = new SP_BROWSER();

/*
 * 내보내기
 */
export {
    SP_BROWSER_NEW as SP_BROWSER
}