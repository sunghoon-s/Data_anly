/**
 * Google Sheets API 사용 예제
 * 
 * 이 파일은 Google Sheets API를 직접 사용하는 방법을 보여줍니다.
 */

// 설정
const CONFIG = {
    API_KEY: 'YOUR_API_KEY_HERE',
    SHEET_ID: 'YOUR_SHEET_ID_HERE',
    RANGE: 'Sheet1!A1:E10'
};

/**
 * 구글 시트 데이터 읽기
 */
async function readGoogleSheetData(sheetId, range, apiKey) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.values;
        
    } catch (error) {
        console.error('Error reading sheet data:', error);
        throw error;
    }
}

/**
 * 데이터를 HTML 테이블로 변환
 */
function createTable(data) {
    if (!data || data.length === 0) {
        return '<p>데이터가 없습니다.</p>';
    }
    
    let html = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    
    // 헤더
    if (data.length > 0) {
        html += '<thead><tr>';
        data[0].forEach(cell => {
            html += `<th style="padding: 8px; background-color: #f0f0f0;">${cell}</th>`;
        });
        html += '</tr></thead>';
    }
    
    // 데이터 행
    html += '<tbody>';
    for (let i = 1; i < data.length; i++) {
        html += '<tr>';
        data[i].forEach(cell => {
            html += `<td style="padding: 8px;">${cell || ''}</td>`;
        });
        html += '</tr>';
    }
    html += '</tbody></table>';
    
    return html;
}

/**
 * 사용 예제
 */
async function example() {
    try {
        // 데이터 읽기
        const data = await readGoogleSheetData(
            CONFIG.SHEET_ID,
            CONFIG.RANGE,
            CONFIG.API_KEY
        );
        
        // 테이블 생성
        const tableHtml = createTable(data);
        
        // 결과 표시
        document.getElementById('result').innerHTML = tableHtml;
        
        console.log('Data loaded successfully:', data);
        
    } catch (error) {
        console.error('Failed to load data:', error);
        document.getElementById('result').innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('Google Sheets API Example loaded');
    
    // 버튼 이벤트 추가
    const loadButton = document.getElementById('loadData');
    if (loadButton) {
        loadButton.addEventListener('click', example);
    }
});

/**
 * 추가 유틸리티 함수들
 */

// CSV 형태로 데이터 내보내기
function exportToCSV(data) {
    if (!data || data.length === 0) return '';
    
    return data.map(row => 
        row.map(cell => `"${cell || ''}"`).join(',')
    ).join('\n');
}

// JSON 형태로 데이터 변환
function convertToJSON(data) {
    if (!data || data.length < 2) return [];
    
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index] || '';
        });
        return obj;
    });
}

// 데이터 필터링
function filterData(data, columnIndex, filterValue) {
    if (!data || data.length === 0) return data;
    
    const headers = data[0];
    const filtered = data.filter((row, index) => {
        if (index === 0) return true; // 헤더는 항상 포함
        return row[columnIndex] && row[columnIndex].toString().toLowerCase().includes(filterValue.toLowerCase());
    });
    
    return filtered;
}

// 데이터 정렬
function sortData(data, columnIndex, ascending = true) {
    if (!data || data.length <= 1) return data;
    
    const headers = data[0];
    const rows = data.slice(1);
    
    rows.sort((a, b) => {
        const valueA = a[columnIndex] || '';
        const valueB = b[columnIndex] || '';
        
        // 숫자인지 확인
        const numA = parseFloat(valueA);
        const numB = parseFloat(valueB);
        
        if (!isNaN(numA) && !isNaN(numB)) {
            return ascending ? numA - numB : numB - numA;
        } else {
            return ascending ? 
                valueA.toString().localeCompare(valueB.toString()) :
                valueB.toString().localeCompare(valueA.toString());
        }
    });
    
    return [headers, ...rows];
}
