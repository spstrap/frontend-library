/*
* 모드
*/
 'use strict';

/*
 * 레이아웃 구성
 */
(function(){

    /*
     * 프로토타입 선언
     */
	var IE_NOT_SUPPORT = function(){
	
        const _ = this;
        
        // ie 일 경우에만 수행
        // ie service end of support
        if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
            _.init();
        }

    };
    
    /*
     * 수행
     */
    IE_NOT_SUPPORT.prototype.init = function(){
	
        const _ = this;

        // 루트 패스 구하기
        let script = '/spstrap.js';

        let element = document.querySelector('script[src*="'+ script +'"]');
        var newurl = element.src.replace(/^.*\/\/[^\/]+/, ''); // http or https
        let folder = newurl.replace(script, '');

        // 바디 돔
        let body = document.querySelector('body');

        // 스타일 생산
        let style = document.createElement('style');
        let styleHTML;
            styleHTML  = '#ie-not-support {';
            styleHTML += '    position:fixed;';
            styleHTML += '    top:0; left:0; right:0; bottom:0;';
            styleHTML += '    background-color:rgba(0,0,0,0.3);';
            styleHTML += '}';
            styleHTML += '#ie-not-support > ul {';
            styleHTML += '    display:table; width:100%; height:100%;';
            styleHTML += '}';
            styleHTML += '#ie-not-support > ul > li {';
            styleHTML += '    display:table-cell; text-align:center; vertical-align:middle; padding:0 0 5% 0;';
            styleHTML += '}';
            styleHTML += '#ie-not-support > ul > li strong {';
            styleHTML += '    display:block; padding:15px 0 0 0; font-size:21px;';
            styleHTML += '}';
            styleHTML += '#ie-not-support .browser-description {';
            styleHTML += '    display:inline-block; padding:50px 100px; background-color:#fff; border-radius:10px;';
            styleHTML += '}';
            styleHTML += '#ie-not-support .browser-description span {';
            styleHTML += '    color:#ff3300;';
            styleHTML += '}';
            styleHTML += '#ie-not-support .browser-description ul {';
            styleHTML += '    display:table;margin:0 auto;';
            styleHTML += '}';
            styleHTML += '#ie-not-support .browser-description ul li {';
            styleHTML += '    display:table-cell; font-size:11px; color:#999; padding:0 20px;';
            styleHTML += '}';
            styleHTML += '#ie-not-support > ul > li > p {';
            styleHTML += '    padding:15px 0 0 0; font-size:11px; color:#999;';
            styleHTML += '}';
            styleHTML += '#ie-not-support > ul > li img.support {';
            styleHTML += '    width:60px;';
            styleHTML += '}';
            styleHTML += '#ie-not-support > ul > li img.not-support {';
            styleHTML += '    width:40px;';
            styleHTML += '}';
            styleHTML += '#ie-not-support hr {';
            styleHTML += '    border:0; padding:0; margin:20px 0; border-top:1px solid #eaeaea;';
            styleHTML += '}';
        style.innerHTML = styleHTML;

        // 컨텐츠 생산
        let content = document.createElement('div');
        let contentHtml;
            content.id = 'ie-not-support';
            contentHtml  = '<ul>';
            contentHtml += '  <li>';
            contentHtml += '      <div class="browser-description">';
            contentHtml += '        <img src="'+ folder +'/image/browser/explorer.svg" class="not-support">';
            contentHtml += '        <strong>브라우저 업데이트 필요 !!</strong>';
            contentHtml += '        <hr />';
            contentHtml += '        <span>이 브라우저(IE)</span>는 더이상 지원되지 않습니다.<br />';
            contentHtml += '        브라우저를 업데이트해서 최적화된 쇼핑을 즐겨보세요.<br /><br /><br />';
            contentHtml += '        <ul>';
            contentHtml += '            <li><img src="'+ folder +'/image/browser/chrome.svg" class="support"><p>크롬 (추천)</p></li>';
            contentHtml += '            <li><img src="'+ folder +'/image/browser/firefox.svg" class="support"><p>파이어폭스</p></li>';
            contentHtml += '            <li><img src="'+ folder +'/image/browser/edge.svg" class="support"><p>엣지</p></li>';
            contentHtml += '            <li><img src="'+ folder +'/image/browser/safari.svg" class="support"><p>사파리</p></li>';
            contentHtml += '        </ul>';
            contentHtml += '      </div>';
            contentHtml += '      <p>';
            contentHtml += '          Opera Mini, UC Browser for Android, Baidu Browser, KaiOS Browser 지원 안함';
            contentHtml += '      </p>';
            contentHtml += '  </li>';
            contentHtml += '</ul>';
        content.innerHTML = contentHtml;

        // 화면에 넣어준다.
        body.appendChild(style);
        body.appendChild(content);

    };

    new IE_NOT_SUPPORT();

})();