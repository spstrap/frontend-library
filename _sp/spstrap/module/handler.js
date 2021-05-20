/*
 * 모듈 호출
 */
import { 
    SP_VAR
} from './modules.js';

/*
 * 모드
 */
'use strict';

/*
 * 클래스 선언
 */
class SP_HANDLER {

    /*
     * 초기화
     */
    constructor(){

        const _ = this;

        /*
         * extends class
         */
        _.var = SP_VAR;

    }

    /*
     * path 가져오기
     */
    getPath(type) {

        const _ = this;

        switch (type) {
            case 'href': return window.location.href; break;									// 문서의 URL 주소		위 주소 전체                 
            case 'host': return window.location.host; break;									// 호스트 이름과 포트	https://www.naver.com/8080
            case 'hostname': return window.location.hostname; break;							// 호스트 컴퓨터이름		https://www.naver.com     
            case 'hash': return window.location.hash; break;									// 앵커이름			#top                      
            case 'pathname': return window.location.pathname; break;							// 디렉토리 이하 경로	/entry/list.jsp           
            case 'pathrole': return $$('meta[name="path_role"]' ).attr('content'); break;		// 카페24의 패스를 이용한다.
            case 'folder': return (window.location.pathname+'/').split('/')[1]; break;			// 첫번째 폴더명 추출
            case 'port': return window.location.port; break;									// 포트번호 부분		8080                      
            case 'protocol': return window.location.protocol; break;							// 프로토콜 종류		https                     
            case 'search': return window.location.search; break;								// 조회부분			manage/posts/page=1       
            default: return '';
        }

    }

    /*
     * jquery on 구현
     */
    on(eventType, selector, callback) {

        const _ = this;

        // 자신이거나, 자신의 부모중에 한명을 찾는다.
        document.body.addEventListener(eventType, function (event) {
            if (event.target.matches(selector)
                || _.getClosest(event.target, selector)) {
                callback.call(event.target, event);
            }
        });
        
    }

    /*
    ** ajaxComplete 구현
    */    
    ajaxComplete(string, callback) {

        const _ = this;

        const send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() { 
            this.addEventListener('load', function() {

                // console.log('global handler', this.responseText)
                // add your global handler here
                if ( this.responseURL.indexOf(string) != -1 ){
                    if (typeof callback === 'function') {
                        setTimeout(() => {
                            callback();
                        }, _.var.ajax.gapDelay);
                    }
                }

            })
            return send.apply(this, arguments);
        }

    }

    /*
    ** json 데이터 파싱
    */    
    parseJson(string) {

        const _ = this;

        let json;

        if (!string) {
            return '';
        }

        // json 데이터라면 그 자체를 리턴해준다.
        // 리소스 소비가 있지만, 오류를 줄일 수 있다.
        try {
            json = JSON.parse(string);
        } catch(e) {
            json = '';
        }

        return json;

    }

    /*
     * parameter 가져오기
     */
    getParam(param, string) {

        const _ = this;

        const url = ( string ) ? string : window.location.href ;
        const parameter = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        
        let regex = new RegExp('[\\?&]' + parameter + '=([^&#]*)'),
            results = regex.exec(url);
            
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));

    }

    /*
     * 배열 섞어주기
     */
    shuffle(array) {

        const _ = this;

        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;

    }

    /*
     * 객체가 화면안에 있는지 체크
     */
    inScreen(element) {

        const _ = this;

        const screenHeight = window.innerHeight;
        const rect = _.getRect(element);

        if (rect.y > screenHeight) {
            return false;
        } else {
            if (rect.height + rect.y > 0) {
                return true;
            } else {
                return false;
            }
        }

        return false;

    }

    /*
     * string to dom
     */
    toDom(string) {

        const _ = this;

        let contents;
        let firstchild;

        contents = document.createElement('div');
        contents.innerHTML = string;
        firstchild = _.getFirstChild(contents);

        return firstchild;

    }

    /*
     * first child 가져오기
     */
    getFirstChild(element) {

        const _ = this;

        let contents = element.firstChild;

        if (element.childElementCount != 1) {
            contents = element;
        } else {
            while (contents != null && contents.nodeType == 3) {
                contents = contents.nextSibling;
            }
        }

        return contents;

    }

    /*
     * jquery hasClass 구현
     */
    hasClass(element, className) {

        const _ = this;

        let domlist = false, classlist = false;

        if (!element || !element.classList) {
            return false;
        }

        // getElementsByClassName
        if (element && element.getElementsByClassName(className)) {
            if (element.getElementsByClassName(className).length) {
                domlist = true;
            }
        }

        // classList
        if (!domlist) {
            if (element.classList.contains(className)) {
                classlist = true;
            }
        }

        // 최종 결정
        if (domlist || classlist) {
            return true;
        } else {
            return false;
        }

    }

    /*
     * jquery html 구현
     */
    html(target, string) {

        const _ = this;

        if (!target) {
            return;
        }

        return new Promise( resolve => { 

            target.innerHTML = string;
            let contents = target.children[0];

            resolve(contents);

        });

    }

    /*
     * jquery append 구현
     */
    append(target, string) {

        const _ = this;

        if (!target) {
            return;
        }

        return new Promise( resolve => { 

            let contents = target;
            let dummy = document.createElement('div');
            dummy.innerHTML = string;

            while (dummy.children.length > 0) {
                contents = dummy.children[0];
                target.appendChild(contents);
            }

            resolve(contents);

        });

    }

    /*
     * jquery prepend 구현
     */
    prepend(target, string) {

        const _ = this;

        if (!target) {
            return;
        }

        return new Promise( resolve => { 

            let contents = target;
            let dummy = document.createElement('div');
            dummy.innerHTML = string;

            while (dummy.children.length > 0) {
                contents = dummy.children[0];
                target.prepend(contents);
            }

            resolve(contents);

        });

    }

    /*
     * jquery after 구현
     */
    after(target, string) {

        const _ = this;

        let contents;
        
        if (!target) {
            return;
        }

        return new Promise( resolve => { 
                        
            contents = _.toDom(string);
            target.parentNode.insertBefore(contents, target.nextSibling);
            resolve(contents);

        });

    }

    /*
     * jquery before 구현
     */
    before(target, string) {

        const _ = this;

        let contents;

        if (!target) {
            return;
        }

        return new Promise( resolve => { 
            
            contents = _.toDom(string);
            target.parentNode.insertBefore(contents, target.previousSibling);
            resolve(contents);

        });

    }
    
    /*
     * jquery Closest 구현
     */
    getClosest(element, selector) {

        const _ = this;

        let closest;

        // 최신 브라우저
        closest = element.closest(selector);

        // 올드 브라우저 ( 테스트 하기도 귀찮지만, 여지를 남겨두자. )
        return closest;

    }

    /*
     * jquery Siblings 구현
     */
    getSibling(element, selector) {

        const _ = this;

        // Setup siblings array and get the first sibling
        const siblings = [];
        let sibling = element.parentNode.firstChild;

        // Loop through each sibling and push to the array
        while (sibling) {
            if (sibling.nodeType === 1 
                && sibling.matches(selector)
            ) {
                siblings.push(sibling);
            }
            sibling = sibling.nextSibling
        }

        return siblings;

    }

    /*
     * jquery getNextSibling 구현
     */
    getNextSibling(element, selector) {

        const _ = this;

        // Get the next sibling element
        let sibling = element.nextElementSibling;

        // If there's no selector, return the first sibling
        if (!selector) return sibling;

        // If the sibling matches our selector, use it
        // If not, jump to the next sibling and continue the loop
        while (sibling) {
            if (sibling.matches(selector)) return sibling;
            sibling = sibling.nextElementSibling
        }

        return sibling;

    }

    /*
     * jquery getPreviousSibling 구현
     */
    getPreviousSibling(element, selector) {

        const _ = this;

        // Get the next sibling element
        let sibling = element.previousElementSibling;

        // If there's no selector, return the first sibling
        if (!selector) return sibling;

        // If the sibling matches our selector, use it
        // If not, jump to the next sibling and continue the loop
        while (sibling) {
            if (sibling.matches(selector)) return sibling;
            sibling = sibling.previousElementSibling;
        }

        return sibling;

    }

    /*
     * 랜덤 숫자 범위로 생성
     */
    getRndNumber(min = 0, max = 100) {

        const _ = this;

        if (isNaN(min)) {
            min = 0;
        }
        if (isNaN(max)) {
            max = 100;
        }

        return Math.floor(Math.random() * (max-min+1)) + min;

    }

    /*
     * 랜덤 인자를 생성해서 리턴
     */
    getRndString(length = 10, scope = 'numeng') {

        const _ = this;

        let char;
        let randomChar = '';

        switch (scope) {
            case 'num':
                char = '0123456789';
                break;
            case 'eng':
                char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                break;
            case 'numeng':
                char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                break;
            default:
                char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        }
        const charLength = char.length;

        for (let i = 0; i < length; i++) {

            randomChar += char.charAt(Math.floor(Math.random() * charLength));

        }

        return randomChar;
        
    }

    /*
     * string의 바이트를 계산
     */
    getByte(string) {

        const _ = this;

        if (typeof string !='string') {
            return 0;
        }

        let totalByte = string.length;
        let stringLength = string.length ? string.length-1 : 0 ;
        let charCode;

        for (let i = stringLength; i >= 0; i--) {

            charCode = string.charCodeAt(i);

            if ( charCode > 0x7f && charCode <= 0x7ff ) {
                totalByte++;
            } else if ( charCode > 0x7ff && charCode <= 0xffff ) {
                totalByte += 2;
            }
            if ( charCode >= 0xDC00 && charCode <= 0xDFFF ) {
                i--;
            }

        }

        return totalByte;

    }

    /*
     * get window property
     */
    getWindow() {

        const _ = this;

        let win = {};

        win.width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

        win.height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

        win.fullWidth = Math.max(
            document.body.scrollWidth, document.documentElement.scrollWidth,
            document.body.offsetWidth, document.documentElement.offsetWidth,
            document.body.clientWidth, document.documentElement.clientWidth
        );

        win.fullHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );

        return win;

    }

    /*
     * Dom rect
     */
    getRect(element) {

        const _ = this;

        return element.getBoundingClientRect();

    }

    /*
     * getComputedStyle
     */
    getStyle(element) {

        const _ = this;

        return window.getComputedStyle(element);

    }

    /*
    ** 라이브러리 루트 구하기
    **/
    getLibraryRoot() {

        const _ = this;

        let element = document.querySelector(`script[src*="${_.var.library.script}"]`);
        let url = new URL(element.src);

        // 외부에서 불러온다면, 호스트를 함께 적어준다.
        let folder = url.href.indexOf(_.getPath('host')) === -1
                     ? url.href.replace(_.var.library.path, '')
                     : url.pathname.replace(_.var.library.path, '') ;

        return folder;

    }

    /*
     * css 파일 로드 ( after load )
     *
     */
    importCss(url) {

        const _ = this;

        url = url.indexOf('http') != -1 ? url : _.getLibraryRoot() + url ;

        return new Promise( function( resolve ) {

            let link = document.createElement('link');
            link.rel  = 'stylesheet';
            link.href = url;
            document.head.appendChild( link );
            link.onload = function() { 
                resolve();
            };
        });

    }
    
    /*
     * go to 기능 구현
     */
    goto(element, speed, gap, callback, context) {

        const _ = this;

        let start,
            end,
            step,
            elapsed,
            clock = Date.now();

        context = context || window;
        speed = speed === '0' || speed === 0 ? 0 : speed || _.var.css.duration ;
        start = context.scrollTop || window.pageYOffset;
        gap = isNaN(gap) ? 0 : parseInt(gap) ;
        gap = gap || 0 ;

        // Get the top position of an element in the document
        let getTop = function(element, start) {
            // return value of html.getBoundingClientRect().top ... IE : 0, other browsers : -pageYOffset
            if(element.nodeName === 'HTML') return -start
            return element.getBoundingClientRect().top + start
        }

        // ease in out function thanks to:
        // http://blog.greweb.fr/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
        let easeInOutCubic = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }

        // calculate the scroll position we should be in
        // given the start and end point of the scroll
        // the time elapsed from the beginning of the scroll
        // and the total speed of the scroll (default 500ms)
        let position = function(start, end, elapsed, speed) {
            if (elapsed > speed) return end;
            return start + (end - start) * easeInOutCubic(elapsed / speed); // <-- you can change the easing funtion there
            // return start + (end - start) * (elapsed / speed); // <-- this would give a linear scroll
        }

        // get end position
        if (typeof element === 'number') {
            if (element === '-1' || element === -1) {
                end = _.getWindow().fullHeight;
            } else {
                end = parseInt(element);
            }
        } else {
            end = getTop(element, start + gap);
        }

        // step by animation frame
        step = function(){
            elapsed = Date.now() - clock;
            if (context !== window) {
                context.scrollTop = position(start, end, elapsed, speed);
            } else {
                window.scroll(0, position(start, end, elapsed, speed));
            }
            if (elapsed > speed) {
                if (typeof callback === 'function') {
                    callback(element);
                }
            } else {
                window.requestAnimationFrame(step);
            }
        }
        step();

    }

    /*
     * 특정 문자로 구분된 문자열을 배열로 변환
     */
    restToArray(string, division) {

        const _ = this;

        let array = string.split(division);

        return array;

    }

}

/*
 * 생성하기
 */
const SP_HANDLER_NEW = new SP_HANDLER();

/*
 * 내보내기
 */
export {
    SP_HANDLER_NEW as SP_HANDLER
}