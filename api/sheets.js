// Vercel Serverless Function for Google Sheets
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // 환경 변수에서 설정 읽기
    const API_KEY = process.env.GOOGLE_API_KEY;
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    
    if (!API_KEY || !SHEET_ID) {
      return res.status(500).json({
        success: false,
        error: 'API 키 또는 시트 ID가 환경 변수에 설정되지 않았습니다.'
      });
    }
    
    // 쿼리 파라미터에서 범위 가져오기 (기본값: Sheet1!A1:Z1000)
    const range = req.query.range || 'Sheet1!A1:Z1000';
    
    // Google Sheets API 호출
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // 성공 응답
    res.status(200).json({
      success: true,
      data: data.values || [],
      range: data.range,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
