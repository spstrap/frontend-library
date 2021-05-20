/*
 * Highlight js
 * https://github.com/highlightjs/highlight.js/
 */
import { hljs } from '../library/highlight/highlight.min.js';

/*
 * W3.JS HTML Includes
 * https://www.w3schools.com/w3js/w3js_html_include.asp
 */
import { w3 } from '../library/w3include/w3.js';

/*
 * 자동실행
 */
(function(){

    /*
     * 모드
     */
    'use strict';

    /*
     * 클래스 선언
     */
    class SP_DOC {

        /*
         * 초기화
         */
        constructor() {

            const _ = this;

            /*
            * extends class
            */
            _.var = {};

            /*
            ** Core file 명시
            **/
            _.var.script = 'doc.js';
            _.var.path = '/doc/module/doc.js';

            _.init();

        }

        /*
         * 최초수행
         */
        init() {

            const _ = this;

            // 라이브러리
            _.loadLibrary();

            // 링크정리
            _.relativePath();

            // 코드정리
            _.codeHighlight();

            /*
             * load css after init ( promiss )
             */
            _.importCss('/doc/library/highlight/hybrid.min.css').then( () => {

                hljs.initHighlighting();
                hljs.initLineNumbersOnLoad(); 

            });

        }

        /*
         * jquery on 구현
         */
        on(eventType, selector, callback) {

            const _ = this;

            document.body.addEventListener(eventType, function (event) {
                let container = _.getClosest(event.target, selector);
                if (container && container.matches(selector)) {
                    callback.call(container, event);
                }
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
         * jquery append 구현
         */
        append(target, string) {

            const _ = this;

            let contents;

            if (!target) {
                return;
            }

            return new Promise( resolve => { 

                contents = _.toDom(string);
                target.append(contents);
                resolve(contents);

            });

        }

        /*
        ** 라이브러리 루트 구하기
        **/
        getLibraryRoot() {

            const _ = this;

            let element = document.querySelector(`script[src*="${_.var.script}"]`);
            let url = new URL(element.src);
            let folder = url.pathname.replace(_.var.path, '');

            return folder;

        }

        /*
        ** 라이브러리 불러오기
        **/
        loadLibrary() {

            const _ = this;

            let head = document.querySelector(`head`);
            let scriptSrc = _.getLibraryRoot() +'/spstrap.js';
            let cssSrc = _.getLibraryRoot() +'/css/spstrap.css';

            let script = document.createElement('script');
            script.type= 'module';
            script.src= scriptSrc;
            script.setAttribute('defer', 'defer');

            let css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = cssSrc;

            head.appendChild(script);
            head.appendChild(css);

        }

        /*
        ** 상대경로 주소 맞춰주기 ( 링크 )
        **/
        relativePath() {

            const _ = this;

            /*
            ** get real script
            */
            let url;
            let script = document.querySelector(`script[src*="${_.var.script}"]`);

            _.on('click', '.sp--document-aside--inner > ul > li .sp--currentlink', function (e) {

                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                url = this.getAttribute('href') || this.dataset.url;
                url = script ? script.src.replace('/doc/module/doc.js', url) : url ;
                url = url.indexOf('http') != -1 ? url : url;

                window.location.href = url;

            });

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
        * css 파일 로드 ( after load )
        */
        importCss(url) {

            const _ = this;

            /*
            ** get real script
            */
            url = _.getLibraryRoot() + url;
            url = url.indexOf('http') != -1 ? url : url;

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
        * 코드만 추출하기
        * & is replaced with &amp;
        * < is replaced with &lt;
        * > is replaced with &gt;
        */
        getCode(string) {

            const _ = this;

            let i;
            let regex;
            let code = string;
            let found;
            let endcode;

            if (typeof code !='string') {
                return '';
            }

            regex = /(<)(.*)(textarea)([$>])/ig;
            code = _.trim(code.toString().replace(regex, ''));

            regex = /trickarea/ig;
            code = _.trim(code.toString().replace(regex, 'textarea'));

            regex = /(\[)(?!ignoretext)(.*?)(\])/ig;
            found = code.match(regex) || [] ;
            for (i=0; i < found.length; i++) {
                endcode = _.trim(found[i].replace(/(\[|\])|(=\"\")/gi,''));
                code = code.toString().replace(found[i], '<i>'+ endcode +'</i>');
            }

            return code;

        }

        /*
         * 코드 하이라이트
         */
        codeHighlight() {

            const _ = this;

            let data;
            let language;
            let content;
            let element;
            let preview;
            let origin;
            let parser;

            // 코드 배열
            document.querySelectorAll(`[data-hljs]`).forEach( container => {

                data = container.dataset;
                language = data.hljs;
                
                preview = container.querySelector('.sp--document-preview');
                content = preview ? preview.innerHTML : '' ;

                if (content) {

                    origin = container.innerHTML.replace(/\[|\]/gi,'');
                    origin = origin.replace(/textarea/gi, 'div');
                    origin = origin.replace(/trickarea/gi, 'textarea');

                    parser = document.createElement('textarea');
                    parser.innerHTML = origin;
                    origin = parser.value;

                    container.innerHTML = origin;
                    preview = container.querySelector('.sp--document-preview');
                    
                    let arr;
                    let row;
                    let space;
                    let regex;
                    let endcode;

                    arr = content.split('\n');
                    endcode = '';
                    for (let i = 0; i < arr.length; i++) {

                        row = arr[i];
                        if (row) {
                            regex = row.match(/(    )(.*?\S)/);
                            if (regex) {
                                space = space || regex[0].substring(regex[0].length-1, 1) +' ';
                                row = row.replace(space, '');
                            }
                        }
                        
                        if (row.indexOf('<!--//') != -1 || row.indexOf('//-->') != -1) {

                        } else {
                            endcode = endcode + '\n' + row;
                        }
            
                    }

                    element = `
                        <pre><code class="${language}"><textarea>
                            ${endcode}
                        </textarea></code></pre>
                    `;

                    _.after(preview, element);

                }
                
            });

            // 코드 배열
            document.querySelectorAll(`code`).forEach( code => {
                
                code.innerHTML = _.getCode(code.innerHTML.replace(/(="")/gi,''));
                
            });

        }

    }

    new SP_DOC();

}());

// 준비가 완료되면 필요없는 클래스를 삭제한다.
(function() {
    
    window.addEventListener('load', function(){
        //setTimeout(function(){
            document.querySelector(`body`).classList.add('ready');
        //}, 1000);
    });
 
})();