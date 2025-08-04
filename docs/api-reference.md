# 📖 API 문서

## Google Sheets API 엔드포인트

### 기본 URL
```
https://sheets.googleapis.com/v4/spreadsheets
```

### 1. 데이터 읽기

**엔드포인트**: `GET /{spreadsheetId}/values/{range}`

**매개변수**:
- `spreadsheetId`: 구글 시트 ID
- `range`: 데이터 범위 (예: "Sheet1!A1:E10")
- `key`: API 키

**예시**:
```javascript
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
const response = await fetch(url);
const data = await response.json();
```

**응답 형식**:
```json
{
  "range": "Sheet1!A1:E10",
  "majorDimension": "ROWS",
  "values": [
    ["이름", "나이", "직업"],
    ["홍길동", "25", "개발자"],
    ["김영희", "30", "디자이너"]
  ]
}
```

## Google Apps Script API

### 기본 구조

Apps Script는 웹앱으로 배포되어 REST API처럼 사용할 수 있습니다.

### 1. GET 요청 (데이터 읽기)

**엔드포인트**: `GET {webAppUrl}?action=read`

**매개변수**:
- `action`: 수행할 작업 ("read", "info", "sheets")
- `sheet`: 시트 이름 (선택사항)
- `range`: 데이터 범위 (선택사항)

**예시**:
```javascript
const url = `${webAppUrl}?action=read&sheet=Sheet1&range=A1:E10`;
const response = await fetch(url);
const result = await response.json();
```

### 2. POST 요청 (데이터 쓰기/수정)

**엔드포인트**: `POST {webAppUrl}`

**요청 본문**:
```json
{
  "action": "write",
  "sheet": "Sheet1",
  "data": [
    ["이름", "나이", "직업"],
    ["홍길동", "25", "개발자"]
  ]
}
```

**사용 가능한 액션**:
- `write`: 기존 데이터 삭제 후 새 데이터 쓰기
- `append`: 데이터 추가
- `update`: 특정 범위 업데이트
- `delete`: 행 삭제
- `clear`: 시트 전체 삭제

### 3. 응답 형식

**성공 응답**:
```json
{
  "success": true,
  "timestamp": "2025-08-04T10:30:00.000Z",
  "message": "Operation completed successfully",
  "data": [...]
}
```

**오류 응답**:
```json
{
  "success": false,
  "timestamp": "2025-08-04T10:30:00.000Z",
  "message": "Error description"
}
```

## JavaScript 클라이언트 라이브러리

### GoogleSheetsAPI 클래스

```javascript
class GoogleSheetsAPI {
  constructor(apiKey, sheetId) {
    this.apiKey = apiKey;
    this.sheetId = sheetId;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  async readData(range) {
    const url = `${this.baseUrl}/${this.sheetId}/values/${range}?key=${this.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.values;
  }

  async getSheetInfo() {
    const url = `${this.baseUrl}/${this.sheetId}?key=${this.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }
}
```

### GoogleAppsScriptAPI 클래스

```javascript
class GoogleAppsScriptAPI {
  constructor(webAppUrl) {
    this.webAppUrl = webAppUrl;
  }

  async readData(sheet = 'Sheet1', range = null) {
    let url = `${this.webAppUrl}?action=read&sheet=${sheet}`;
    if (range) {
      url += `&range=${range}`;
    }
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  }

  async writeData(data, sheet = 'Sheet1') {
    const response = await fetch(this.webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'write',
        sheet: sheet,
        data: data
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result;
  }

  async appendData(rowData, sheet = 'Sheet1') {
    const response = await fetch(this.webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'append',
        sheet: sheet,
        data: rowData
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result;
  }
}
```

## 사용 예제

### 1. 기본 데이터 읽기

```javascript
// API 방식
const sheetsAPI = new GoogleSheetsAPI('YOUR_API_KEY', 'YOUR_SHEET_ID');
const data = await sheetsAPI.readData('Sheet1!A1:E10');

// Apps Script 방식
const scriptAPI = new GoogleAppsScriptAPI('YOUR_WEBAPP_URL');
const data = await scriptAPI.readData('Sheet1', 'A1:E10');
```

### 2. 데이터 쓰기 (Apps Script만 가능)

```javascript
const scriptAPI = new GoogleAppsScriptAPI('YOUR_WEBAPP_URL');

// 전체 데이터 교체
await scriptAPI.writeData([
  ['이름', '나이', '직업'],
  ['홍길동', 25, '개발자'],
  ['김영희', 30, '디자이너']
]);

// 새 행 추가
await scriptAPI.appendData(['박민수', 28, '기획자']);
```

### 3. 오류 처리

```javascript
try {
  const data = await sheetsAPI.readData('Sheet1!A1:E10');
  console.log('Data loaded:', data);
} catch (error) {
  if (error.message.includes('403')) {
    console.error('권한 오류: 시트가 공개로 설정되어 있는지 확인하세요.');
  } else if (error.message.includes('400')) {
    console.error('요청 오류: 시트 ID나 범위를 확인하세요.');
  } else {
    console.error('알 수 없는 오류:', error.message);
  }
}
```

## 제한사항

### Google Sheets API
- **읽기 전용**: API 키로는 데이터 읽기만 가능
- **속도 제한**: 분당 100개 요청
- **할당량**: 일일 25,000개 요청

### Google Apps Script
- **실행 시간**: 최대 6분
- **트리거**: 시간 기반 트리거 20개 제한
- **동시 실행**: 동시 실행 30개 제한

## 보안 고려사항

1. **API 키 보호**: 클라이언트 사이드에서 API 키 노출 주의
2. **시트 권한**: 최소한의 권한만 부여
3. **입력 검증**: 사용자 입력 데이터 검증 필수
4. **HTTPS 사용**: 모든 API 호출은 HTTPS로

---

더 자세한 정보는 [Google Sheets API 공식 문서](https://developers.google.com/sheets/api)를 참조하세요.
