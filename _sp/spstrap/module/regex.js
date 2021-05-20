/*
 * 모드
 */
'use strict';

/*
 * 클래스 선언
 */
class SP_REGEX {

    /*
     * 초기화
     */
    constructor() {

        const _ = this;

    }

    /*
     * id, class trim
     */
    selector(string) {

        const _ = this;

        if (typeof string !='string') {
            return '';
        }

        let regex = /^.|#/gi;
        let selector = string.toString().replace(regex, '');

        return selector;

    }

    /*
     * 앞뒤 공백만 제거하기
     */
    trim(string) {

        const _ = this;

        if (typeof string !='string') {
            return '';
        }

        let regex = /^\s*|\s*$/gi;
        let space = string.toString().replace(regex, '');

        return space;

    }

    /*
     * 모든 공백, 엔터 제거하기
     */
    trimAll(string) {

        const _ = this;

        if (typeof string !='string') {
            return '';
        }
        
        let regex = /(\s*)/gi;
        let spaceall = string.toString().replace(regex, '');

        return spaceall;

    }

    /*
     * 특수문자 모두 제거하기
     */
    removeSpecial(string) {

        const _ = this;

        if (typeof string !='string') {
            return '';
        }

        let regex = /[~!@#$%^&*()_+|<>?:{}]/gi;
        let special = string.toString().replace(regex, '');

        return special;

    }

    /*
     * 숫자만 추출하기
     */
    getNumber(string) {

        const _ = this;

        if (typeof string !='string' && typeof string != 'number') {
            return parseFloat(0);
        }

        let regex = /[^0-9.-]/gi;
        let number = string.toString().replace(regex, '');

        if (isNaN(number) || !number) {
            return parseFloat(0);
        }
        return parseFloat(number);

    }

    /*
     * 한글만 추출하기
     */
    getKorean(string) {

        const _ = this;

        if (typeof string !='string') {
            return '';
        }

        let regex = /[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/gi;
        let korean = string.toString().replace(regex, '');

        return korean;

    }

    /*
     * 영어만 추출하기
     */
    getEnglish(string) {

        const _ = this;

        if (typeof string !='string') {
            return '';
        }

        let regex = /[^a-zA-Z]/gi;
        let english = string.toString().replace(regex, '');

        return english;

    }

    /*
     * 숫자, 영어만 추출하기
     */
    getNumberEnglish(string) {

        const _ = this;

        if (typeof string !='string') {
            return '';
        }

        let regex = /[^a-z0-9]/gi;
        let numberEnglish = string.toString().replace(regex, '');

        return numberEnglish;

    }

    /*
     * 숫자 유효성 체크
     */
    isNumber(string) {

        const _ = this;
        
        if (typeof string !='string' && typeof string != 'number') {
            return false;
        }

        if (!isNaN(string-0)) {
            return true;
        }

        return false;

    }

    /*
     * 숫자에 콤마 찍기
     */
    toComma(string, fix = 0) {

        const _ = this;

        if (typeof string !='string' && typeof string != 'number') {
            return parseFloat(0);
        }

        let tostring = _.getNumber(string).toFixed(fix).toString();
        
        let regex = /\B(?=(\d{3})+(?!\d))/gi;
        let number = tostring.replace(regex, ',');

        return number;

    }

    /*
     * 이메일 유효성 체크
     */
    isEmail(string) {

        const _ = this;

        if (typeof string !='string') {
            return false;
        }

        let regex = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/gi;
        let email = string.match(regex);

        if (!email) {
            return false;
        }

        return true;

    }

    /*
     * 전화번호 유효성 체크
     */
    isPhoneNumber(string) {

        const _ = this;

        if (typeof string !='string') {
            return false;
        }

        let regex = /^\d{2,3}-\d{3,4}-\d{4}$/gi;
        let phoneNumber = string.match(regex);

        if (!phoneNumber) {
            return false;
        }

        return true;

    }

    /*
     * URL 유효성 체크
     */
    isUrl(string) {

        const _ = this;

        if (typeof string !='string') {
            return false;
        }

        let regex = /^(file|gopher|news|nntp|telnet|https?|ftps?|sftp):\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/gi;
        let url = string.match(regex);

        if (!url) {
            return false;
        }

        return true;

    }

    /*
     * 태그여부 체크
     */
    isTag(string) {

        const _ = this;

        if (typeof string !='string') {
            return false;
        }

        let regex = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;
        let url = string.match(regex);

        if (!url) {
            return false;
        }

        return true;

    }

    /*
    ** 모든 태그 제거
    */
    stripTag(string) {

        const _ = this;

        const html = string ? string.replace(/(<([^>]+)>)/gi, "") : '' ;

        return html;

    }

    /*
     * 이미지여부 체크 ( 확장자 기반 )
     */
    isImage(string) {

        const _ = this;

        if (typeof string !='string') {
            return false;
        }

        let regex = /([^\s]+(?=\.(jpg|gif|png))\.\2)/gi;
        let image = string.match(regex);

        if (!image) {
            return false;
        }

        return true;

    }

    /*
     * 유튜브 코드인지 체크
     */
    isYoutube(string) {

        const _ = this;

        if (typeof string !='string') {
            return false;
        }

        let regex = /[a-zA-Z0-9_-]{11}/gi;
        let youtube = string.match(regex);

        if (!youtube) {
            return false;
        }

        return true;

    }

    /*
     * 문자열을 숫자, 혹은 불린값으로 변환
     */
    fixValue(string) {

        const _ = this;

        if (_.isNumber(string)) {
            return Number(string);
        } else if (string === 'true') {
            return true;
        } else if (string === 'false') {
            return false;
        }
        return string;

    }

    /*
     * to escape
     */
    escape(string) {

        const _ = this;

        return escape(string);

    }

    /*
     * to unescape
     */
    unescape(string) {

        const _ = this;

        return unescape(string);

    }

    /*
     * to encodeURI
     */
    encodeURI(string) {

        const _ = this;

        return encodeURI(string);

    }

    /*
     * to encodeURLComponent
     */
    encodeURLComponent(string) {

        const _ = this;

        return encodeURLComponent(string);

    }

}

/*
 * 생성하기
 */
const SP_REGEX_NEW = new SP_REGEX();

/*
 * 내보내기
 */
export {
    SP_REGEX_NEW as SP_REGEX
}