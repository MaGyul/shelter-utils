# Shelter Utils (쉘터 유틸)
쉘터를 쓰면서 유용한 유저 스크립트

[![license](https://img.shields.io/badge/license-GNU%20GPL%203.0-green)](LICENSE)
[![shelter](https://img.shields.io/badge/site-shelter.io-blue)](https://shelter.id/)

<div class="markdown-alert markdown-alert-warning" dir="auto">
  <p class="markdown-alert-title" dir="auto">
    <svg class="octicon octicon-alert mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>
    Warning
  </p>
  <p dir="auto">
    <strong>대충 쓴 글이라 가독성이 떨어짐</strong>
  </p>
</div>

## 목차
- [Show DateTime (날자 및 시간 표시)](#show-datetime-날자-및-시간-표시)
- [Hide Right Bar (오른쪽 바 숨기기)](#hide-right-bar-오른쪽-바-숨기기)
- [Viewer Youtube Link (글 내용 유튜브 링크)](#viewer-youtube-link-글-내용-유튜브-링크)
- [Zoom In Out (줌 인 아웃)](#zoom-in-out-줌-인-아웃)

## Show DateTime (날자 및 시간 표시)

[Download][show-datetime-download] | [Source][show-datetime-source]

**쉘터 기본 시간 표시는 몇일 전, 몇시간 전, 몇분 전 이렇게 표시되어<br>
언제인지 정확한 시간이 표시가 안되어 불편한 부분을 스크립트로 해결**

**날자가 목록에선 이런식으로 표시되고**

![image](https://github.com/user-attachments/assets/9f144ff3-9494-4773-a2d2-8018baa6dd6e)
![image](https://github.com/user-attachments/assets/9698866b-0174-4533-b09d-95d66bd90e3b)

**글 읽을땐 이렇게 표시되며**

![image](https://github.com/user-attachments/assets/20f650fe-f86b-45cd-8b87-652ed0b4aa05)

**글 목록 상단에 이런식으로 페이지 버튼과 검색 버튼이 표시됩니다.**

![image](https://github.com/user-attachments/assets/9d7481ba-5db5-40e6-aa4f-140e0d7ece7e)
<br>

## Hide Right Bar (오른쪽 바 숨기기)

[Download][hide-right-bar-download] | [Source][hide-right-bar-source]

**쉘터를 쓰면서 오른쪽 바가 불 필요하다고 느낀다면 있으면 좋은 스크립트**

![image](https://github.com/user-attachments/assets/3160d912-15c7-49e1-95e5-e82515f066d7)

<div class="markdown-alert markdown-alert-note" dir="auto">
  <p class="markdown-alert-title" dir="auto">
    <svg class="octicon octicon-info mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>
    Note
  </p>
  <p dir="auto">
    <img src="https://github.com/user-attachments/assets/2ee0e5b7-ed78-4e49-930a-7d5701d54c62" alt="image" style="max-width: 100%;">
    <img src="https://github.com/user-attachments/assets/3b8852b9-c466-4c6d-886c-2d201ab7d8c7" alt="image" style="max-width: 100%;">
  </p>
  <p dir="auto">상단 오른쪽에 생긴 ◀ or ▶ 버튼을 눌러 열고 닫을 수 있습니다.</p>
</div>

<div class="markdown-alert markdown-alert-tip" dir="auto">
  <p class="markdown-alert-title" dir="auto">
    <svg class="octicon octicon-light-bulb mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>
    Tip
  </p>
  <p dir="auto">해당 버튼으로 오른쪽 바가 없어져서 비어버린 양 사이드 빈 공간을 꽉 채워버립니다.</p>
  <p align="left" dir="auto">
    <img align="top" src="https://github.com/user-attachments/assets/a114cc73-4b54-4043-82c2-ae9b35b9a4f1" style="max-width: 100%;">
    <img width="300" src="https://github.com/user-attachments/assets/0b6eaba7-520b-4767-a08a-a78dbe75f396" style="max-width: 100%;">
  </p>
</div>

## Viewer Youtube Link (글 내용 유튜브 링크)

[Download][viewer-youtube-link-download] | [Source][viewer-youtube-link-source]

**글 내용에 유튜브 링크가 있을경우 링크 클릭시 유튜브로 이동이 아닌 글 안에 유튜브 임배드가 생성됩니다.**

![image](https://github.com/user-attachments/assets/dc91acc4-86ee-4e87-a7e5-126245e19b3c)

## Zoom In Out (줌 인 아웃)

[Download][zoom-in-out-download] | [Source][zoom-in-out-source]

**쉘터 글을 읽다가 안보이는 노안을 위한 스크립트**

<div class="markdown-alert markdown-alert-important" dir="auto">
  <p class="markdown-alert-title" dir="auto">
    <svg class="octicon octicon-report mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>
    Important
  </p>
  <p dir="auto">글자만 확대됩니다.</p>
</div>

<p align="left">
  <img width="450" src="https://github.com/user-attachments/assets/7d62f80c-d9cc-4a8a-913e-555ea9cedc47">
  <img width="450" align="top" src="https://github.com/user-attachments/assets/f32f1211-6dc0-4c67-827a-84f1042a2be2">
</p>

## LICENSE
[GNU GPL 3.0](LICENSE)

[show-datetime-download]: https://github.com/MaGyul/shelter-utils/raw/main/shelter-show-datetime.user.js
[show-datetime-source]: https://github.com/MaGyul/shelter-utils/blob/main/shelter-show-datetime.user.js
[hide-right-bar-download]: https://github.com/MaGyul/shelter-utils/raw/main/shelter-hide-right-bar.user.js
[hide-right-bar-source]: https://github.com/MaGyul/shelter-utils/blob/main/shelter-hide-right-bar.user.js
[viewer-youtube-link-download]: https://github.com/MaGyul/shelter-utils/raw/main/shelter-viewer-youtube-link.user.js
[viewer-youtube-link-source]: https://github.com/MaGyul/shelter-utils/blob/main/shelter-viewer-youtube-link.user.js
[zoom-in-out-download]: https://github.com/MaGyul/shelter-utils/raw/main/shelter-zoom-in-out.user.js
[zoom-in-out-source]: https://github.com/MaGyul/shelter-utils/blob/main/shelter-zoom-in-out.user.js
