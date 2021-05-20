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
class SP_VIDEO {

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

        _.youtubeInit();

    }

    /*
     * 유튜브 준비
     */
    youtubeInit() {

        const _ = this;

        // 유튜브 영역이 없다면 전체 취소
        if (!document.querySelector(_.var.video.container)) {
            return false;
        }

        // 전역설정
        _.youtubePlayer = [];

        // create script eleemnt
        const tag = document.createElement('script');

        // insert script and callback
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // callback done
		window.onYouTubeIframeAPIReady = () => {
            _.youtubeMakePlayer();
		};

    }

    /*
     * 유튜브 플레이어 생성
     */
    youtubeMakePlayer() {

        const _ = this;

        let data;
        let loop;
        let videoid;
        let playlist;
        let player;
        let iframe;
        let videoiframe;
        let controller;
        let remote;
        let progress = [];

        // 팝업창 버튼 이벤트
        document.querySelectorAll(`${_.var.video.container}[data-flatform="youtube"]:not(${_.var.init.video})`).forEach( container => {

            data = container.dataset;
            videoid = data.videoid;
            loop = data.loop ? true : false ;
            playlist = loop ? videoid : '' ;
            controller = data.controller || '' ;

            // 가상 엘리먼트 생성 후 아이프레임을 생성해준다.
            iframe = document.createElement("div");
            videoiframe = document.createElement("div");
            videoiframe.classList.add('sp--video-iframe');
            videoiframe.appendChild(iframe);
            container.appendChild(videoiframe);

            // 컨트롤러를 요청한다면
            if (controller) {
                remote = `
                    <div class="sp--video-controller">
                        <div class="sp--video-remote">
                            <button class="sp--video-btn" icon="play" data-status="playVideo" tooltip-label="재생" tooltip-position="top">playVideo</button>
                            <button class="sp--video-btn" icon="pause" data-status="pauseVideo" tooltip-label="일시중지" tooltip-position="top">pauseVideo</button>
                            <p>
                                <button class="sp--video-btn" icon="mute" data-status="mute" tooltip-label="소리 끔" tooltip-position="left">mute</button>
                                <button class="sp--video-btn" icon="unmute" data-status="unMute" tooltip-label="소리 켬" tooltip-position="left">unMute</button>
                            </p>
                        </div>
                        <div class="sp--video-progress">
                            <div class="sp--video-progress-current"></div>
                            <div class="sp--video-progress-loaded"></div>
                            <div class="sp--video-progress-total"></div>
                        </div>
                    </div>
                `;
                _.handler.append(container, remote);
            }

            // 유튜브 아이디를 간단하게 검수
            if (_.regex.isYoutube(videoid)) {

                // 플레이어 생성
                player = new YT.Player(iframe, {
                    width: '640',
                    height: '360',
                    videoId: videoid,
                    playerVars: {
                        'allowScriptAccess': 'always',
                        'enablejsapi': 1,
                        'controls': controller ? 0 : 1 ,
                        'showinfo': 0,
                        'rel': 0,
                        'loop': loop,
                        'playlist': playlist,
                        'fs': 0,
                        'cc_load_policy': 0,
                        'iv_load_policy': 3,
                        'modestbranding': 1,
                        'autohide': 0,
                        'wmode': 'transparent',
                        'origin': _.handler.getPath('host')
                    },
                    events: {
                        'onReady': event => {

                            // 준비완료
                            _.youtubeOnPlayerReady(event);
                            _.youtubeSetButtons(event);

                        },
                        'onStateChange': event => {

                            // 플레이 상태 변경
                            if (event.data === YT.PlayerState.PLAYING) {

                                _.youtubeAllStop(event);

                                // 프로그래스바 시작
                                if (event.target.SPSTRAP.controller) {
                                    progress[event.target.h.id] = setInterval(() => {
                                        _.youtubeProgress(event);
                                    }, 300);
                                }

                            } else {

                                // 프로그래스바 종료
                                if (event.target.SPSTRAP.controller) {
                                    clearInterval(progress[event.target.h.id]);
                                }

                            }

                            // 유튜브 컨트롤러 업데이트
                            _.youtubeUpdateController(event);

                        },
                        'onVolumeChange': event => {
                           
                            // 볼륨상태 변경
                            // 유튜브 컨트롤러 업데이트
                            _.youtubeUpdateController(event);
                            
                        },
                        'onPlaybackQualityChange': event => {

                            // 퀄리티 상태 변경

                        },
                        'onPlaybackRateChange': event => {

                            // 재생 속도 변경

                        },
                        'onApiChange': event => {

                            // API 변경

                        },
                        'onError': event => {

                            // 에러

                        },
                    }
                });

                // 플레이어에 우리 값들을 전달
                player.SPSTRAP = {
                    data: data,
                    container: container,
                    controller: controller,
                    progress: {
                        container: container.querySelector(_.var.video.progress.container),
                        current: container.querySelector(_.var.video.progress.current),
                        loaded: container.querySelector(_.var.video.progress.loaded),
                        total: container.querySelector(_.var.video.progress.total),
                    }
                };

                // 플레이어 전체를 배열에 저장
                _.youtubePlayer.push(player);

            }

            // 기 수행 체크
            container.classList.add(_.var.trim(_.var.init.video));

            // 준비가 완료되면 필요없는 클래스를 삭제한다.
            container.classList.remove(_.var.trim(_.var.css.notready));

        });

    }

    /*
     * 유튜브 플레이어 버튼 속성 설정
     */
    youtubeUpdateController(event) {

        const _ = this;

        let container = event.target.SPSTRAP.container;

        if (typeof event.data === 'number') container.setAttribute('play', event.data);
        if (typeof event.data === 'object') container.setAttribute('mute', event.target.isMuted());

    }

    /*
     * 유튜브 플레이어 버튼 속성 설정
     */
    youtubeSetButtons(event) {

        const _ = this;

        let data;
        let status;
        let videoid;
        let container;
        let closer;

        // 버튼에 리스너 추가
        document.querySelectorAll(_.var.video.btn +`:not(${_.var.init.videobtn})`).forEach( btn => {

            btn.addEventListener('click', e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                data = btn.dataset;
                videoid = data.videoid;
                status = data.status;

                // 동영상 아이디 자체가 지정되었다면,
                container = document.querySelector(`${_.var.video.container}[data-videoid="${videoid}"] iframe`);

                // 컨테이너를 못찾은 경우라면 ( 클래스 자체에 버튼이 있는 경우 )
                if (!container) {
                    closer = _.handler.getClosest(btn, _.var.video.container);
                    container = closer.querySelector(`iframe`);
                }

                // 아이프레임에 메세지를 전달
                container.contentWindow.postMessage(JSON.stringify({
                    "event": "command",
                    "func": status
                }), "*");

            });

        });

        let rect;
        let percent;
        let currentContainer;
        let currentIframe;
        let jumpTo;

        // 프로그래스바를 클릭해서 버퍼 이동하기
        document.querySelectorAll(_.var.video.progress.container +`:not(${_.var.init.videobtn})`).forEach( btn => {

            btn.addEventListener('click', e => {

                // 리스너 초기화
                e.stopImmediatePropagation();

                rect = _.handler.getRect(btn);
                percent = (e.pageX - rect.x) / rect.width;

                currentContainer = _.handler.getClosest(btn, _.var.video.container);
                currentIframe = currentContainer.querySelector('iframe').id;

                // 생성된 모든 플레이어를 불러온다.
                _.youtubePlayer.forEach( player => {
                    
                    // 클릭된 플레이의 위치를 이동시킨다.
                    if (player.h.id === currentIframe) {

                        // 재생위치 구하기
                        jumpTo = parseInt(player.getDuration() * percent);

                        // 프로그래스바 변경
                        _.youtubeProgress({
                            target: player,
                            data: {}
                        }, percent);

                        // 재생위치 이동
                        player.seekTo(jumpTo);

                    }

                });

            });

        });

    }
    
    /*
     * 프로그래스 바
     */
    youtubeProgress(event, percent = null) {

        const _ = this;

        let progress = event.target.SPSTRAP.progress;
        let currentValue = percent * 100 || _.regex.toComma(event.target.getCurrentTime() / event.target.getDuration() * 100, 2);
        let loadedValue = _.regex.toComma(event.target.getVideoBytesLoaded() * 100, 2);

        // 스타일 변경
        progress.current.style.width = currentValue +'%';
        progress.loaded.style.width = loadedValue +'%';

        /*
            console.log(event.target)
            console.log(event.target.getDuration())
            console.log(event.target.getCurrentTime());
            console.log(event.target.getVideoLoadedFraction());
            console.log(event.target.getVideoBytesLoaded());
            console.log(event.target.getVideoBytesTotal());
        */

    }
    
    /*
     * 나 이외 모든 플레이어 중지
     */
    youtubeAllStop(event) {

        const _ = this;

        let currentPlayer = event.target;

        // 생성된 모든 플레이어를 불러온다.
        _.youtubePlayer.forEach( player => {
            
            // 현재 플레이된 플레이어가 아니고,
            // 현재 재생상태인 플레이어는 퍼즈를 걸어준다.
            if (player.h.id != currentPlayer.h.id 
                && currentPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            }

        });

    }

    /*
     * 유튜브 준비 후 첫번째 행동
     */
    youtubeOnPlayerReady(event) {

        const _ = this;

        let data = event.target.SPSTRAP.data;
        let volume = data.volume || _.var.video.volume;
        let container = event.target.SPSTRAP.container;

        // 볼륨은 기본적으로 크기를 맞춰주자.
        event.target.setVolume(volume);

        // autoplay 설정이 되어 있다면
        if (data.autoplay === 'true') {
            event.target.playVideo();
        } else {
            container.setAttribute('play', '2');
        }

        // 음소거 설정이 되어 있다면
        if (data.mute === 'true') {
            event.target.mute();
        }
        container.setAttribute('mute', data.mute);

    }

}

/*
 * 생성하기
 */
const SP_VIDEO_NEW = new SP_VIDEO();

/*
 * 내보내기
 */
export {
    SP_VIDEO_NEW as SP_VIDEO
}