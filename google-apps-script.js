/**
 * Google Apps Script for Google Sheets Data Management
 * 구글 시트 데이터 관리를 위한 앱스크립트
 * 
 * 설정 방법:
 * 1. script.google.com에서 새 프로젝트 생성
 * 2. 이 코드를 붙여넣기
 * 3. YOUR_SPREADSHEET_ID를 실제 시트 ID로 변경
 * 4. 배포 → 새 배포 → 웹앱으로 배포
 * 5. 실행 권한: 나, 액세스 권한: 모든 사용자
 */

// ========== 설정 구역 ==========
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID', // 여기에 실제 구글 시트 ID 입력
  DEFAULT_SHEET: 'Sheet1', // 기본 시트 이름
  ENABLE_LOGGING: true, // 로깅 활성화 여부
  MAX_ROWS: 1000, // 최대 처리 행 수
  ALLOWED_ORIGINS: ['*'] // CORS 허용 도메인 ('*'는 모든 도메인 허용)
};

// ========== GET 요청 처리 (데이터 읽기) ==========
function doGet(e) {
  try {
    logRequest('GET', e.parameter);
    
    const action = e.parameter.action || 'read';
    const sheetName = e.parameter.sheet || CONFIG.DEFAULT_SHEET;
    const range = e.parameter.range;
    
    // CORS 헤더 설정
    const output = ContentService.createTextOutput();
    
    switch(action) {
      case 'read':
        return readData(sheetName, range);
      case 'info':
        return getSpreadsheetInfo();
      case 'sheets':
        return getSheetsList();
      default:
        return createResponse(false, 'Invalid action: ' + action);
    }
    
  } catch (error) {
    logError('doGet', error);
    return createResponse(false, error.toString());
  }
}

// ========== POST 요청 처리 (데이터 쓰기/추가) ==========
function doPost(e) {
  try {
    logRequest('POST', e.postData);
    
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const data = postData.data;
    const sheetName = postData.sheet || CONFIG.DEFAULT_SHEET;
    const range = postData.range;
    
    switch(action) {
      case 'write':
        return writeData(sheetName, data, range);
      case 'append':
        return appendData(sheetName, data);
      case 'update':
        return updateData(sheetName, data, range);
      case 'delete':
        return deleteData(sheetName, postData.rowIndex);
      case 'clear':
        return clearSheet(sheetName);
      default:
        return createResponse(false, 'Invalid action: ' + action);
    }
    
  } catch (error) {
    logError('doPost', error);
    return createResponse(false, error.toString());
  }
}

// ========== 데이터 읽기 함수 ==========
function readData(sheetName, range) {
  try {
    const sheet = getSheet(sheetName);
    let data;
    
    if (range) {
      // 특정 범위 읽기
      data = sheet.getRange(range).getValues();
    } else {
      // 전체 데이터 읽기
      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();
      
      if (lastRow === 0 || lastCol === 0) {
        return createResponse(true, [], 'No data found');
      }
      
      data = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    }
    
    // 빈 행 제거
    data = data.filter(row => row.some(cell => cell !== ''));
    
    logInfo('readData', `Read ${data.length} rows from ${sheetName}`);
    return createResponse(true, data, `Successfully read ${data.length} rows`);
    
  } catch (error) {
    logError('readData', error);
    return createResponse(false, error.toString());
  }
}

// ========== 데이터 쓰기 함수 ==========
function writeData(sheetName, data, range) {
  try {
    const sheet = getSheet(sheetName);
    
    // 기존 데이터 삭제
    sheet.clear();
    
    let values;
    if (Array.isArray(data)) {
      values = data;
    } else if (typeof data === 'object') {
      // 객체를 2D 배열로 변환
      values = Object.keys(data).map(key => [key, data[key]]);
    } else {
      throw new Error('Invalid data format');
    }
    
    if (values.length > 0) {
      const numRows = values.length;
      const numCols = Math.max(...values.map(row => row.length));
      sheet.getRange(1, 1, numRows, numCols).setValues(values);
    }
    
    logInfo('writeData', `Wrote ${values.length} rows to ${sheetName}`);
    return createResponse(true, null, `Successfully wrote ${values.length} rows`);
    
  } catch (error) {
    logError('writeData', error);
    return createResponse(false, error.toString());
  }
}

// ========== 데이터 추가 함수 ==========
function appendData(sheetName, data) {
  try {
    const sheet = getSheet(sheetName);
    
    let values;
    if (Array.isArray(data)) {
      if (Array.isArray(data[0])) {
        // 2D 배열인 경우
        values = data;
      } else {
        // 1D 배열인 경우
        values = [data];
      }
    } else if (typeof data === 'object') {
      // 객체인 경우
      values = [Object.values(data)];
    } else {
      throw new Error('Invalid data format');
    }
    
    values.forEach(row => {
      sheet.appendRow(row);
    });
    
    logInfo('appendData', `Appended ${values.length} rows to ${sheetName}`);
    return createResponse(true, null, `Successfully appended ${values.length} rows`);
    
  } catch (error) {
    logError('appendData', error);
    return createResponse(false, error.toString());
  }
}

// ========== 데이터 업데이트 함수 ==========
function updateData(sheetName, data, range) {
  try {
    const sheet = getSheet(sheetName);
    
    if (!range) {
      throw new Error('Range is required for update operation');
    }
    
    let values;
    if (Array.isArray(data)) {
      values = data;
    } else if (typeof data === 'object') {
      values = Object.keys(data).map(key => [key, data[key]]);
    } else {
      throw new Error('Invalid data format');
    }
    
    const targetRange = sheet.getRange(range);
    targetRange.setValues(values);
    
    logInfo('updateData', `Updated range ${range} in ${sheetName}`);
    return createResponse(true, null, `Successfully updated range ${range}`);
    
  } catch (error) {
    logError('updateData', error);
    return createResponse(false, error.toString());
  }
}

// ========== 행 삭제 함수 ==========
function deleteData(sheetName, rowIndex) {
  try {
    const sheet = getSheet(sheetName);
    
    if (!rowIndex || rowIndex < 1) {
      throw new Error('Valid row index is required');
    }
    
    sheet.deleteRow(rowIndex);
    
    logInfo('deleteData', `Deleted row ${rowIndex} from ${sheetName}`);
    return createResponse(true, null, `Successfully deleted row ${rowIndex}`);
    
  } catch (error) {
    logError('deleteData', error);
    return createResponse(false, error.toString());
  }
}

// ========== 시트 클리어 함수 ==========
function clearSheet(sheetName) {
  try {
    const sheet = getSheet(sheetName);
    sheet.clear();
    
    logInfo('clearSheet', `Cleared sheet ${sheetName}`);
    return createResponse(true, null, `Successfully cleared sheet ${sheetName}`);
    
  } catch (error) {
    logError('clearSheet', error);
    return createResponse(false, error.toString());
  }
}

// ========== 스프레드시트 정보 조회 ==========
function getSpreadsheetInfo() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheets = spreadsheet.getSheets();
    
    const info = {
      id: CONFIG.SPREADSHEET_ID,
      name: spreadsheet.getName(),
      url: spreadsheet.getUrl(),
      sheets: sheets.map(sheet => ({
        name: sheet.getName(),
        id: sheet.getSheetId(),
        rows: sheet.getLastRow(),
        columns: sheet.getLastColumn(),
        frozen: {
          rows: sheet.getFrozenRows(),
          columns: sheet.getFrozenColumns()
        }
      })),
      totalSheets: sheets.length,
      createdDate: new Date().toISOString()
    };
    
    return createResponse(true, info, 'Spreadsheet info retrieved successfully');
    
  } catch (error) {
    logError('getSpreadsheetInfo', error);
    return createResponse(false, error.toString());
  }
}

// ========== 시트 목록 조회 ==========
function getSheetsList() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheets = spreadsheet.getSheets().map(sheet => sheet.getName());
    
    return createResponse(true, sheets, 'Sheets list retrieved successfully');
    
  } catch (error) {
    logError('getSheetsList', error);
    return createResponse(false, error.toString());
  }
}

// ========== 유틸리티 함수들 ==========

// 시트 가져오기
function getSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet '${sheetName}' not found`);
  }
  
  return sheet;
}

// 응답 생성
function createResponse(success, data, message) {
  const response = {
    success: success,
    timestamp: new Date().toISOString(),
    message: message || (success ? 'Operation completed successfully' : 'Operation failed')
  };
  
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// 로깅 함수들
function logRequest(method, data) {
  if (CONFIG.ENABLE_LOGGING) {
    console.log(`[${method}] Request:`, data);
  }
}

function logInfo(func, message) {
  if (CONFIG.ENABLE_LOGGING) {
    console.log(`[INFO] ${func}: ${message}`);
  }
}

function logError(func, error) {
  if (CONFIG.ENABLE_LOGGING) {
    console.error(`[ERROR] ${func}:`, error);
  }
}

// ========== 고급 기능들 ==========

// 데이터 검색
function searchData(sheetName, searchTerm, column) {
  try {
    const sheet = getSheet(sheetName);
    const data = sheet.getDataRange().getValues();
    
    let results;
    if (column !== undefined) {
      // 특정 컬럼에서 검색
      results = data.filter((row, index) => {
        if (index === 0) return true; // 헤더 포함
        return row[column] && row[column].toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    } else {
      // 전체에서 검색
      results = data.filter((row, index) => {
        if (index === 0) return true; // 헤더 포함
        return row.some(cell => cell && cell.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      });
    }
    
    return createResponse(true, results, `Found ${results.length - 1} matching rows`);
    
  } catch (error) {
    logError('searchData', error);
    return createResponse(false, error.toString());
  }
}

// 데이터 정렬
function sortData(sheetName, columnIndex, ascending = true) {
  try {
    const sheet = getSheet(sheetName);
    const range = sheet.getDataRange();
    
    range.sort({
      column: columnIndex + 1, // Apps Script는 1-based 인덱스 사용
      ascending: ascending
    });
    
    logInfo('sortData', `Sorted ${sheetName} by column ${columnIndex}`);
    return createResponse(true, null, `Successfully sorted data by column ${columnIndex}`);
    
  } catch (error) {
    logError('sortData', error);
    return createResponse(false, error.toString());
  }
}

// 시트 생성
function createSheet(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const newSheet = spreadsheet.insertSheet(sheetName);
    
    logInfo('createSheet', `Created new sheet: ${sheetName}`);
    return createResponse(true, {
      name: newSheet.getName(),
      id: newSheet.getSheetId()
    }, `Successfully created sheet '${sheetName}'`);
    
  } catch (error) {
    logError('createSheet', error);
    return createResponse(false, error.toString());
  }
}

// 시트 삭제
function deleteSheet(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet '${sheetName}' not found`);
    }
    
    spreadsheet.deleteSheet(sheet);
    
    logInfo('deleteSheet', `Deleted sheet: ${sheetName}`);
    return createResponse(true, null, `Successfully deleted sheet '${sheetName}'`);
    
  } catch (error) {
    logError('deleteSheet', error);
    return createResponse(false, error.toString());
  }
}
