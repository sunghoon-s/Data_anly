# 🚀 구글 시트 & 앱스크립트 데이터 시스템

이 프로젝트는 구글 시트의 데이터를 웹에서 쉽게 읽고 쓸 수 있는 완전한 솔루션입니다.

## 📁 프로젝트 구조

```
Data_anly/
├── index.html                          # 🖥️ 메인 웹 인터페이스
├── google-apps-script.js               # ⚡ 구글 앱스크립트 코드
├── package.json                        # 📦 프로젝트 설정
├── .env.example                        # 🔧 환경 설정 예시
├── .gitignore                          # 🚫 Git 무시 파일
├── config/
│   └── config.json                     # ⚙️ 애플리케이션 설정
├── docs/
│   ├── installation.md                 # 📖 설치 가이드
│   └── api-reference.md                # 📚 API 문서
├── examples/
│   ├── simple-example.html             # 🎯 간단한 예제
│   └── google-sheets-api-example.js    # 💡 API 사용 예제
└── README.md                           # 📄 이 파일
```

## � 빠른 시작

### 1️⃣ 간단한 예제로 시작하기

가장 간단한 방법으로 시작하려면:

1. `examples/simple-example.html` 파일을 브라우저에서 열기
2. Google Cloud Console에서 API 키 발급
3. 구글 시트 생성 및 공유 설정
4. 예제 페이지에서 정보 입력 후 테스트

### 2️⃣ 메인 시스템 사용하기

완전한 기능을 사용하려면:

1. `index.html` 파일을 브라우저에서 열기
2. 🎯 "예시 데이터" 버튼으로 기본 기능 테스트
3. 실제 구글 시트 연동 설정
4. 다양한 기능 활용

### 3️⃣ 상세 설정

자세한 설정 방법은 [`docs/installation.md`](docs/installation.md)를 참조하세요.

### 1️⃣ Google Sheets API 방식

1. **Google Cloud Console 설정**
   - [Google Cloud Console](https://console.cloud.google.com/) 접속
   - 새 프로젝트 생성 또는 기존 프로젝트 선택
   - "API 및 서비스" → "라이브러리"에서 "Google Sheets API" 검색 후 활성화
   - "API 및 서비스" → "사용자 인증 정보"에서 "사용자 인증 정보 만들기" → "API 키" 선택
   - 생성된 API 키 복사

2. **구글 시트 설정**
   - 구글 시트 생성 또는 기존 시트 열기
   - 시트 URL에서 ID 부분 복사 (예: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`)
   - 시트 공유 → "링크가 있는 모든 사용자" 읽기 권한 부여

### 2️⃣ Google Apps Script 방식

1. **앱스크립트 프로젝트 생성**
   - [script.google.com](https://script.google.com/) 접속
   - "새 프로젝트" 클릭
   - `google-apps-script.js` 파일의 내용을 복사하여 붙여넣기

2. **설정 수정**
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID', // 실제 시트 ID로 변경
     DEFAULT_SHEET: 'Sheet1', // 기본 시트 이름
     // ... 기타 설정
   };
   ```

3. **웹앱으로 배포**
   - "배포" → "새 배포" 클릭
   - 유형: "웹앱" 선택
   - 설명: "Google Sheets Data API" 입력
   - 실행 권한: "나"
   - 액세스 권한: "모든 사용자"
   - "배포" 클릭
   - 생성된 웹앱 URL 복사

## 🎯 사용 방법

### API 방식으로 데이터 읽기
```javascript
// 예시 URL
https://sheets.googleapis.com/v4/spreadsheets/SHEET_ID/values/Sheet1!A1:E10?key=API_KEY
```

### 앱스크립트 방식으로 데이터 조작

#### 데이터 읽기 (GET 요청)
```javascript
// 전체 데이터 읽기
fetch('WEB_APP_URL?action=read&sheet=Sheet1')

// 특정 범위 읽기
fetch('WEB_APP_URL?action=read&sheet=Sheet1&range=A1:E10')
```

#### 데이터 쓰기 (POST 요청)
```javascript
// 새 데이터 쓰기 (기존 데이터 삭제)
fetch('WEB_APP_URL', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    action: 'write',
    sheet: 'Sheet1',
    data: [
      ['이름', '나이', '직업'],
      ['홍길동', 25, '개발자'],
      ['김영희', 30, '디자이너']
    ]
  })
})

// 데이터 추가
fetch('WEB_APP_URL', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    action: 'append',
    sheet: 'Sheet1',
    data: ['박민수', 28, '기획자']
  })
})
```

## 🔧 고급 기능

### 1. 데이터 검색
```javascript
// 특정 컬럼에서 검색
searchData('Sheet1', '개발자', 2) // 2번째 컬럼에서 '개발자' 검색

// 전체에서 검색
searchData('Sheet1', '홍길동') // 모든 셀에서 '홍길동' 검색
```

### 2. 데이터 정렬
```javascript
// 첫 번째 컬럼 기준 오름차순 정렬
sortData('Sheet1', 0, true)

// 두 번째 컬럼 기준 내림차순 정렬
sortData('Sheet1', 1, false)
```

### 3. 시트 관리
```javascript
// 새 시트 생성
createSheet('NewSheet')

// 시트 삭제
deleteSheet('OldSheet')

// 시트 목록 조회
getSheetsList()
```

## 📊 API 응답 형식

### 성공 응답
```json
{
  "success": true,
  "timestamp": "2025-08-04T10:30:00.000Z",
  "message": "Operation completed successfully",
  "data": [
    ["이름", "나이", "직업"],
    ["홍길동", 25, "개발자"],
    ["김영희", 30, "디자이너"]
  ]
}
```

### 오류 응답
```json
{
  "success": false,
  "timestamp": "2025-08-04T10:30:00.000Z",
  "message": "Sheet 'InvalidSheet' not found"
}
```

## 🔐 보안 고려사항

1. **API 키 보안**
   - API 키를 코드에 하드코딩하지 마세요
   - 환경변수나 설정 파일을 사용하세요
   - 정기적으로 API 키를 재생성하세요

2. **CORS 설정**
   - 프로덕션에서는 특정 도메인만 허용하도록 설정하세요
   - `CONFIG.ALLOWED_ORIGINS`에서 허용할 도메인을 지정하세요

3. **데이터 검증**
   - 입력 데이터를 항상 검증하세요
   - SQL 인젝션과 같은 공격을 방지하세요

## 🐛 문제 해결

### 자주 발생하는 오류

1. **"API key not valid"**
   - API 키가 올바른지 확인
   - Google Sheets API가 활성화되어 있는지 확인

2. **"Requested entity was not found"**
   - 시트 ID가 올바른지 확인
   - 시트가 공개로 설정되어 있는지 확인

3. **"Script function not found"**
   - 앱스크립트 코드가 올바르게 배포되었는지 확인
   - 함수명이 올바른지 확인

### 디버깅 팁

1. **로그 확인**
   - 브라우저 개발자 도구의 콘솔 확인
   - 앱스크립트 로그 확인 (script.google.com → 실행 → 로그)

2. **네트워크 요청 확인**
   - 개발자 도구의 네트워크 탭에서 요청/응답 확인
   - 요청 URL과 파라미터가 올바른지 확인

## 📞 지원

문제가 발생하거나 질문이 있으시면:
1. 이 README의 문제 해결 섹션을 먼저 확인하세요
2. 코드의 주석을 자세히 읽어보세요
3. Google Apps Script 공식 문서를 참조하세요

## 📈 확장 가능성

이 시스템은 다음과 같이 확장할 수 있습니다:

1. **인증 시스템**: OAuth 2.0을 사용한 사용자 인증
2. **실시간 업데이트**: WebSocket을 사용한 실시간 데이터 동기화
3. **데이터 시각화**: Chart.js 등을 사용한 그래프 생성
4. **파일 업로드**: CSV/Excel 파일 업로드 기능
5. **이메일 알림**: 데이터 변경 시 이메일 알림

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자유롭게 사용, 수정, 배포하실 수 있습니다.

---

**Happy Coding! 🎉**
