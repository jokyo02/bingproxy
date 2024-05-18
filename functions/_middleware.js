// pages/functions/_middleware.js

export async function onRequest(context) {
  const { request, env } = context;

  // 处理 CORS 请求
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  // 处理 WebSocket 请求
  if (request.headers.get('Upgrade') === 'websocket') {
    return handleWebSocket(request);
  }

  // 处理普通 HTTP 请求
  return handleRequest(request, env);
}

function handleOptions(request) {
  // 设置 CORS 头部
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || '',
    'Access-Control-Max-Age': '86400',
  };

  return new Response(null, { headers: corsHeaders });
}

async function handleWebSocket(request) {
  // 在这里添加您的 WebSocket 处理逻辑
  // ...
}

async function handleRequest(request, env) {
  // 在这里添加您的 HTTP 请求处理逻辑
  // ...

  // 示例：将请求转发到另一个服务器
  const serverUrl = 'https://sydney.bing.com';
  const currentUrl = new URL(request.url);
  const fetchUrl = new URL(serverUrl + currentUrl.pathname + currentUrl.search);

  let serverRequest = new Request(fetchUrl, request);
  serverRequest.headers.set('origin', 'https://www.bing.com');
  serverRequest.headers.set('referer', 'https://www.bing.com/search?q=Bing+AI');

  // 添加或修改其他头部
  const cookie = serverRequest.headers.get('Cookie') || '';
  let cookies = cookie; 
  if (!cookie.includes('_U=')) {
      cookies += '; _U=1NssJY8JoQgpNNg8';
  }

  serverRequest.headers.set('Cookie', cookies);
  serverRequest.headers.set('user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410427012');

  const response = await fetch(serverRequest);
  const newResponse = new Response(response.body, response);

  // 设置 CORS 头部
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
  newResponse.headers.set('Access-Control-Allow-Headers', '*');

  // 获取客户端 IP 地址
  const guestIp = request.headers.get('cf-connecting-ip');
  newResponse.headers.set('Guestip', guestIp);

  // 返回新的响应对象
  return newResponse;
}
