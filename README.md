# Spstrap - website creation library.

![alt text](https://img.shields.io/badge/team-spstrap-brightgreen) ![alt text](https://img.shields.io/badge/version-v.1.0.1-blue)

이 문서는 Spstrap 라이브러리 사용 방법에 대한 설명서 입니다.<br>
개인적으로 정리해서 사용하던 코드를 공개하기 때문에 만족스럽지 않을 수 있습니다.

[SPSTRAP 라이브러리 데모](https://spstrap.pandassi.com) , 
[모캔버스](https://www.pandassi.com/) , 
[판다씨](https://www.pandassi.com/)

<br>

> 기본적으로 이 라이브러리는 빠른 마크업을 위해 제작되었습니다.<br>
> 지극히 개인적으로 사용하기 위해 제작되었기 때문에 호불호가 크게 갈릴 수 있습니다.<br>
> 혹여라도 도움이 되실 소수의 분들을 위해서 코드를 정리해서 등록했습니다.<br>

> 폴더 구조가 /_sp/ 에 아무런 파일이 없이 spstrap 폴더가 있는 이유는<br>
> 이후에 /_sp/*****/ 이런 형태로 서비스 자체가 추가됨을 염두한 구조입니다.<br>

> * 패키지에 포함된 외부 라이브러리는 총 4개 입니다.<br>
> * Code highlight : Highlight.js 10.5.0 ( 메뉴얼에서만 사용됩니다 )<br>
> * Browser check : https://github.com/lancedikson/bowser<br>
> * Scrollbars : https://github.com/KingSora/OverlayScrollbars<br>
> * Slider : https://swiperjs.com

<br>

# Content

CSS
 - [Animation](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/animation.html)
 - [Social Icon](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/social.html)
 - [Dropdown](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/dropdown.html)
 - [Svg Icon](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/icon.html)
 - [Button](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/button.html)
 - [Box Layout](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/box.html)
 - [Video](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/video.html)
 - [Title Package](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/title.html)
 - [Decoration](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/decoration.html)
 - [Table Package](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/table.html)
 - [Form](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/form.html)
 - [Tooltip](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/tooltip.html)

JS
 - [Cookies](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/cookie.html)
 - [Accodian](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/accordion.html)
 - [Scroll Event](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/scrollevent.html)
 - [Scrollbar](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/scrollbar.html)
 - [Popup Event](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/popup.html)
 - [Tab Layout](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/tab.html)
 - [Toggle Event](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/toggle.html)
 - [Modal](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/modal.html)
 - [Ajax Package](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/ajax.html)
 - [Slider](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/slider.html)
 - [Goto](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/goto.html)
 - [Trigger Event](https://spstrap.pandassi.com/_sp/spstrap/doc/demo/trigger.html)

<br>

# Usage
```
폴더 전체를 다운받아서 아래와 같이 3줄의 코드를 입력하세요.
ie.js 는 ie를 지원하지 않음을 안내하는 코드이며, 이미지가 포함되어 있습니다.
```
```html
<!-- Spstrap : library -->
<script defer type="text/javascript" src="[your root]/_sp/spstrap/module/ie.js"></script>
<script defer type="module" src="[your root]/_sp/spstrap/spstrap.js"></script>
<link rel="stylesheet" href="[your root]/_sp/spstrap/css/spstrap.css">
```

<br>

# Button Example
```html
<a href="#!" class="sp--btn" theme="fill-primary-round">
    <span>
        버튼 &nbsp; 
        <i class="sp--icon" ico="bracket"></i>
    </span>
</a>
```

<br>

# Language used
![alt text](https://img.shields.io/badge/css-3-green)
![alt text](https://img.shields.io/badge/html-4-green)
![alt text](https://img.shields.io/badge/javascript-es6-green)
![alt text](https://img.shields.io/badge/jquery-not_used-lightgray)

<br>

# Browser Support
```
Edge 15 +, 
Firefox 54 +,
Chrome 51 +,
Safari 10 +,
Opera 38 +,
Safari on iOS 10 +,
Android Browser 10 +,
Opera Mobile 62 +,
Chrome for Android 90 +,
Firefox for Android 87 +,
UC Browser for Android 12.12 +,
Samsung Internet 5 +

es6 기준으로 작성되었습니다.
```

<br>

# License
###### © 2021 — SPSTRAP License / dev.spstrap@gmail.com
