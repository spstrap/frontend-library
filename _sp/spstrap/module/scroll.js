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
class SP_SCROLL {

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
     * 스크롤 지연 이벤트
     */
    toFit(callback, { dismissCondition = () => false, triggerCondition = () => true }) {

        const _ = this;

        let tick = false;

        if (!callback) {
            throw Error('Invalid required arguments');
        }
        return function() {
            if (tick) {
                return;
            }
            tick = true;
            return requestAnimationFrame(() => {
                if (dismissCondition()) {
                    tick = false;
                    return;
                }
                if (triggerCondition()) {
                    tick = false;
                    return callback();
                }
            })
        }
        
    }

    /*
     * 최초수행
     */
    init() {
  
        const _ = this;

        let timer = null;

        // 각 요소 포지션 기록
        _.getElementPosition();

        // 스크롤 이벤트
        window.addEventListener(
            'scroll',
            _.toFit(
                () => {
                    _.setElementPosition();
                }, {
                // triggerCondition:
                // dismissCondition:
            }),
            { passive: true }
        );

        // 리사이즈 이벤트 ( 지연 )
        window.addEventListener('resize', function(){
            _.var.scroll.resize = true;
            clearTimeout(timer);
            timer = setTimeout(function(){

                _.var.scroll.resize = false;
                _.getElementPosition();

            }, _.var.scroll.sec);
        });

        // 돔 컨텐츠 로드시 수행
        window.addEventListener('DOMContentLoaded', () => {
            _.getElementPosition();
        });

        // 윈도우 로드시 수행
        window.addEventListener('load', () => {
            _.getElementPosition();
        });

        // 이전방식
        /*

            document.addEventListener(
                'scroll',
                e => {
                    _.var.scroll.works = true;
                }, 
                { passive: true }
            );
            setInterval(() => {
                if (_.var.scroll.works) {
                    _.var.scroll.works = false;
                    _.setElementPosition();
                }
            }, _.var.scroll.sec);

            setInterval(() => {
                _.getElementPosition();
            }, _.var.scroll.secs);

        */

    }

    /*
     * 각 요소들의 위치를 저장
     */
    getElementPosition() {

        const _ = this;

        let 
            rnd,
            data,
            height,
            navgap,
            navbutton,
            navigation,
            navstatus,
            navclass,
            body = document.body,
            html = document.documentElement;
    
        let fullHeight = Math.max( body.scrollHeight, body.offsetHeight, 
                     html.clientHeight, html.scrollHeight, html.offsetHeight );

        // 리사이즈 중이라면 밴
        if (_.var.scroll.resize) {
            return false;
        }
        // 이전과 높이가 같다면 밴
        if (_.var.scroll.height === fullHeight) {
            return false;
        }

        // 현재 높이 기록
        _.var.scroll.height = fullHeight;

        // 스크롤할 대상을 배열로 조회
        document.querySelectorAll(_.var.scroll.container).forEach( container => {

            // 데이터셋 정의
            data = container.dataset;

            // 포지션이 픽스되어 있다면 높이를 기록하지 않는다.
            if (_.handler.getStyle(container).position === 'fixed') {
                if (container.nextElementSibling) {
                    container.setAttribute('data-oritop', container.nextElementSibling.offsetTop);    
                }
            } else {
                container.setAttribute('data-oritop', container.offsetTop);
            }

            // 홀더 요청이 있는 엘리먼트라면 추가해주자.
            if (
                data.holder
                && container.nextElementSibling 
                && container.nextElementSibling.classList.contains(_.var.trim(_.var.scroll.holder))) {
                container.nextElementSibling.style.height = _.handler.getStyle(container).blockSize;
            } else if (data.holder) {
                _.handler.after(container, `<p class="${_.var.trim(_.var.scroll.holder)}"></p>`);
            }

            // 네비게이션에 등록할 아이템이라면 등록해주자.
            if (data.navigation) {

                // 네비게이션 컨텐츠 상태 체크
                navclass = data.class;
                navstatus = _.handler.getStyle(container) || '' ;
                
                // 존재하는 컨테이너의 버튼을 등록해주고,
                if (data.navname && navstatus && navstatus.display != 'none') {

                    rnd = _.handler.getRndString(10, 'numeng');
                    navgap = data.gap && _.regex.isNumber(data.gap) ? data.gap : 0 ;
                    navbutton = `<a href="#!" class="${_.var.trim(_.var.scrollnav.btn)} ${navclass}" data-gap="${navgap}" data-btn="${rnd}">${data.navname}</a>`;
                    navigation = document.querySelector(data.navigation);
                    navclass = data.class;

                    // 버튼 등록
                    _.handler.append(navigation, navbutton);

                    container.setAttribute('data-btn', rnd);
                    container.removeAttribute('data-navname');

                    // 버튼 이벤트 등록
                    document.querySelector(_.var.scrollnav.btn + `[data-btn="${rnd}"]`).addEventListener('click', e => {

                        // 이동하기전에 계산 한번 합시다. * 굿인데 이거 ?
                        _.getElementPosition();

                        // 네이게이션 버튼의 갭을 체크한다.
                        navgap = e.target.dataset ? e.target.dataset.gap : 0 ;

                        // 그리고 이동합시다. ( 컨텐츠의 크기가 변경됨을 인식하기 위해서 )
                        _.handler.goto(container, 300, navgap);
        
                    });

                }

                // 컨테이너 정보를 업데이트 한다.
                height = container.offsetHeight;
                container.setAttribute('data-height', height);

            }

        });

    }

	/*
	** 홀더 크기만 업데이트
	*/
	updateHolderSize(container, update) {

		const _ = this;

		// 업데이트 요청이 있을 경우만
		if (!update || !container.nextElementSibling) {
			return;
		}
		// 홀더가 존재하는 경우만
		if (
			container.nextElementSibling 
			&& container.nextElementSibling.classList.contains(_.var.trim(_.var.scroll.holder))) {

			// 홀더 사이즈 업데이트
			container.nextElementSibling.style.height = _.handler.getStyle(container).blockSize;

		}

	}

    /*
     * 각 요소들을 업데이트
     */
    setElementPosition() {

        const _ = this;

        let btn;
        let data;
        let top;
        let gap;
        let height;
        let oritop;
        let fixtop;
        let chain;
		let holder;
		let update;
        let chainrect;
        let winSize = _.handler.getWindow();
        let scrolltop = window.scrollY;

        // 스크롤할 대상을 배열로 조회
        document.querySelectorAll(_.var.scroll.container).forEach( container => {

            data = container.dataset;
            gap = data.gap ? _.regex.getNumber(data.gap) : 0 ;
            top = _.regex.getNumber(data.top) || 0;
            height = _.regex.getNumber(data.height) || 0;
            oritop = _.regex.getNumber(data.oritop) || 0;
            oritop = top ? oritop - top : oritop - _.var.scroll.gap ;
            fixtop = _.regex.getNumber(data.fix) || 0 ;
			update = data.update || '' ;
            chain = data.chain && document.querySelector(data.chain) ? document.querySelector(data.chain) : '' ;

            // 특정 엘리먼트와 연결
            // 시작은 요소를 만난 후 스크린의 반부터 시작
            // 종료는 요소의 끝점에서 종료
            if (chain) {

                chainrect = _.handler.getRect(chain);
                chainrect.fixtop = gap === 0 ? chainrect.top + scrolltop - (winSize.height/2) : chainrect.top + scrolltop ;
                chainrect.fixbottom = gap === 0 ? chainrect.top + chainrect.height + scrolltop - (winSize.height) : chainrect.top + chainrect.height + scrolltop ;

                if (scrolltop > chainrect.fixtop + gap && scrolltop < chainrect.fixbottom + gap) {

					if (!_.handler.hasClass(container, _.var.trim(_.var.scroll.active))) {

						// 위에서 아래로 진입한다.
						if (scrolltop < chainrect.fixbottom * .8) {

							container.classList.add(_.var.trim(_.var.scroll.active));

						// 아래에서 위로 진입한다.
						} else if (scrolltop > chainrect.fixbottom * .8) {

							_.updateHolderSize(container, update);
							container.classList.add(_.var.trim(_.var.scroll.active));

						}
						
					}

                } else {

					if (_.handler.hasClass(container, _.var.trim(_.var.scroll.active))) {
						container.classList.remove(_.var.trim(_.var.scroll.active));
					}

					_.updateHolderSize(container, update);

                }

            // 고정된 값으로 결정
            } else if (fixtop) {

                if (scrolltop > fixtop) {
                    container.classList.add(_.var.trim(_.var.scroll.active));
                } else {
                    container.classList.remove(_.var.trim(_.var.scroll.active));
                }

            // 일반적인 스크롤 인식
            } else if (scrolltop > oritop + gap) {

                container.classList.add(_.var.trim(_.var.scroll.active));
                container.style.top = top +'px';

            // 그 외 모든 상황
            } else {

                container.classList.remove(_.var.trim(_.var.scroll.active));
                container.style.top = 'auto';

            }

            // 버튼 컨트롤을 요청할 경우만
            btn = data.btn ? document.querySelector(`[data-btn="${data.btn}"]`) : null ;
            if (
                btn 
                && scrolltop >= oritop + gap
                && scrolltop < oritop + height + gap) {
                btn.classList.add(_.var.trim(_.var.scrollnav.active));
            } else if (btn) {
                btn.classList.remove(_.var.trim(_.var.scrollnav.active));
            }
            
        });

    }

}

/*
 * 생성하기
 */
const SP_SCROLL_NEW = new SP_SCROLL();

/*
 * 내보내기
 */
export {
    SP_SCROLL_NEW as SP_SCROLL
}