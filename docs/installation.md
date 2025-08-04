# 🚀 Google Sheets Data System - 설치 가이드

## 📋 목차
1. [시스템 요구사항](#시스템-요구사항)
2. [Google Cloud Console 설정](#google-cloud-console-설정)
3. [Google Apps Script 설정](#google-apps-script-설정)
4. [프로젝트 설정](#프로젝트-설정)
5. [문제 해결](#문제-해결)

## 🔧 시스템 요구사항

- **웹 브라우저**: Chrome, Firefox, Safari, Edge (최신 버전)
- **인터넷 연결**: Google API 호출을 위해 필요
- **Google 계정**: Google Cloud Console 및 Google Sheets 사용
- **로컬 서버** (선택사항): 파일 프로토콜 제한 우회용

## ☁️ Google Cloud Console 설정

### 1단계: 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 상단 프로젝트 선택 드롭다운 클릭
3. "새 프로젝트" 선택
4. 프로젝트 이름 입력 (예: "MySheetProject")
5. "만들기" 버튼 클릭

### 2단계: Google Sheets API 활성화

1. 좌측 메뉴에서 "API 및 서비스" → "라이브러리" 선택
2. 검색창에 "Google Sheets API" 입력
3. "Google Sheets API" 클릭
4. "사용" 버튼 클릭

### 3단계: API 키 생성

1. "API 및 서비스" → "사용자 인증 정보" 선택
2. "+ 사용자 인증 정보 만들기" → "API 키" 선택
3. 생성된 API 키 복사
4. 필요시 "키 제한" 설정 (권장)

### 4단계: API 키 제한 설정 (선택사항)

1. 생성된 API 키 옆의 편집 아이콘 클릭
2. "애플리케이션 제한사항"에서 적절한 제한 설정
3. "API 제한사항"에서 "Google Sheets API"만 선택
4. "저장" 버튼 클릭

## 📊 Google Sheets 설정

### 1단계: 시트 생성 및 데이터 입력

1. [Google Sheets](https://sheets.google.com/) 접속
2. 새 스프레드시트 생성
3. 예시 데이터 입력:
   ```
   A1: 이름    B1: 나이    C1: 직업    D1: 도시
   A2: 홍길동  B2: 25     C2: 개발자   D2: 서울
   A3: 김영희  B3: 30     C3: 디자이너  D3: 부산
   ```

### 2단계: 시트 공유 설정

1. 우상단 "공유" 버튼 클릭
2. "링크 권한 변경" 클릭
3. "링크가 있는 모든 사용자" 선택
4. 권한을 "뷰어"로 설정
5. "완료" 클릭

### 3단계: 시트 ID 복사

브라우저 주소창에서 시트 ID 복사:
```
https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```
`[SHEET_ID]` 부분이 시트 ID입니다.

## ⚡ Google Apps Script 설정

### 1단계: 새 프로젝트 생성

1. [Google Apps Script](https://script.google.com/) 접속
2. "새 프로젝트" 클릭
3. 프로젝트 이름 변경 (예: "SheetDataAPI")

### 2단계: 코드 작성

1. 기본 `Code.gs` 파일을 열기
2. 기존 코드 삭제
3. `google-apps-script.js` 파일의 내용 복사하여 붙여넣기
4. `YOUR_SPREADSHEET_ID` 부분을 실제 시트 ID로 변경

### 3단계: 웹앱으로 배포

1. "배포" → "새 배포" 클릭
2. 설정:
   - **유형**: 웹앱
   - **설명**: "Google Sheets Data API"
   - **실행 권한**: 나
   - **액세스 권한**: 모든 사용자
3. "배포" 클릭
4. 권한 승인 (Google 계정 로그인 필요)
5. 생성된 웹앱 URL 복사

## 💻 프로젝트 설정

### 1단계: 환경 설정

1. `.env.example` 파일을 `.env`로 복사
2. 실제 값으로 수정:
   ```env
   GOOGLE_API_KEY=your_actual_api_key
   GOOGLE_SHEET_ID=your_actual_sheet_id
   APPS_SCRIPT_URL=your_actual_script_url
   ```

### 2단계: 로컬 서버 실행 (선택사항)

**Python 사용:**
```bash
python -m http.server 8000
```

**Node.js 사용:**
```bash
npx http-server -p 8080
```

**VS Code Live Server 사용:**
1. Live Server 확장 설치
2. `index.html` 우클릭 → "Open with Live Server"

### 3단계: 웹 페이지 접속

브라우저에서 다음 중 하나로 접속:
- 파일 직접 열기: `file:///path/to/index.html`
- 로컬 서버: `http://localhost:8000`
- VS Code 미리보기 사용

## 🧪 테스트

### 1단계: 기본 기능 테스트

1. 웹 페이지에서 "🎯 예시 데이터" 버튼 클릭
2. 테이블이 정상적으로 표시되는지 확인

### 2단계: API 연동 테스트

1. "API 방식" 탭 선택
2. 시트 ID, 범위, API 키 입력
3. "📥 데이터 불러오기" 버튼 클릭
4. 실제 구글 시트 데이터가 표시되는지 확인

### 3단계: Apps Script 테스트

1. "앱스크립트 방식" 탭 선택
2. 웹앱 URL 입력
3. "⚡ 실행" 버튼 클릭
4. 데이터가 정상적으로 로드되는지 확인

## 🔍 문제 해결

### API 키 관련 오류

**오류**: "API key not valid"
**해결방법**:
- API 키가 올바른지 확인
- Google Sheets API가 활성화되어 있는지 확인
- API 키 제한 설정 확인

### 권한 관련 오류

**오류**: "The caller does not have permission"
**해결방법**:
- 구글 시트가 "링크가 있는 모든 사용자" 권한으로 설정되어 있는지 확인
- 시트가 올바르게 공유되어 있는지 확인

### CORS 오류

**오류**: "Access to fetch... has been blocked by CORS policy"
**해결방법**:
- 로컬 웹 서버 사용 (file:// 프로토콜 대신 http://)
- 브라우저의 보안 정책으로 인한 제한

### Apps Script 오류

**오류**: "Script function not found"
**해결방법**:
- 앱스크립트 코드가 올바르게 배포되었는지 확인
- 웹앱 URL이 올바른지 확인
- 배포 설정에서 "모든 사용자" 액세스 권한 확인

## 📞 추가 도움말

더 자세한 정보는 다음을 참조하세요:
- [Google Sheets API 문서](https://developers.google.com/sheets/api)
- [Google Apps Script 가이드](https://developers.google.com/apps-script)
- [프로젝트 README.md](../README.md)

---

**설치 완료!** 🎉 이제 구글 시트 데이터를 웹에서 자유롭게 관리할 수 있습니다.
