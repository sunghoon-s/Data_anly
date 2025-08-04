# Google Sheets Data Viewer - Vercel 배포 완료! 🚀

Vercel을 사용한 Google Sheets 데이터 뷰어가 완전히 준비되었습니다.

## 📦 생성된 파일들

### 🎯 Vercel 전용 파일들
- `index-vercel.html` - Vercel용 메인 HTML 파일 (환경변수 사용)
- `api/sheets.js` - Google Sheets API 서버리스 함수
- `vercel.json` - Vercel 배포 설정
- `docs/vercel-deployment.md` - 상세 배포 가이드

### 🔧 설정 파일들
- `.env.example` - 환경변수 설정 예시 (Vercel용 업데이트)
- `package.json` - Vercel 명령어 추가

## 🚀 배포 방법

### 1. 빠른 배포 (GitHub 연동)
```bash
# GitHub에 푸시 후
# Vercel 대시보드에서 GitHub 연동
# 자동 배포 완료!
```

### 2. Vercel CLI 사용
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 🔑 환경변수 설정 (중요!)

Vercel 대시보드에서 다음 환경변수를 설정하세요:

1. **GOOGLE_API_KEY**: Google Cloud에서 발급받은 API 키
2. **GOOGLE_SHEET_ID**: 구글 시트 URL에서 추출한 ID

### 환경변수 설정 방법
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 위 두 변수 추가
4. Production, Preview, Development 모든 환경에 적용

## 🌟 주요 특징

### ✅ 보안 강화
- API 키가 클라이언트에 노출되지 않음
- 환경변수로 민감한 정보 보호
- CORS 문제 해결

### ✅ 사용자 친화적
- 환경변수에서 자동으로 API 키 가져오기
- 깔끔한 UI/UX
- 실시간 데이터 로딩
- 오류 처리 및 가이드

### ✅ 개발자 친화적
- 서버리스 함수로 확장성 확보
- RESTful API 엔드포인트
- 상세한 문서화
- 디버깅 지원

## 📋 사용 방법

1. **환경변수 설정 완료 후**
2. **Vercel에 배포**
3. **배포된 URL 접속**
4. **"데이터 불러오기" 버튼 클릭**
5. **Google Sheets 데이터 확인!**

## 🔗 API 엔드포인트

### `/api/sheets`
- **GET**: Google Sheets 데이터 조회
- **파라미터**: `range` (선택사항, 기본값: Sheet1!A1:Z1000)
- **응답**: JSON 형태의 시트 데이터

**사용 예시:**
```javascript
fetch('/api/sheets?range=Sheet1!A1:E100')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🛠️ 추가 기능

원한다면 더 추가할 수 있는 기능들:
- 데이터 수정/추가 API
- 실시간 업데이트 (WebSocket)
- 데이터 내보내기 (CSV, Excel)
- 사용자 인증
- 데이터 시각화 (차트)

## 📞 문제해결

문제가 생기면:
1. 브라우저 개발자 도구 확인
2. Vercel 함수 로그 확인  
3. `docs/vercel-deployment.md` 문서 참고

---
**이제 Vercel에서 안전하고 빠른 Google Sheets 데이터 뷰어를 사용할 수 있습니다!** 🎉
