// pages/functions/_middleware.js
import { isNetcraftIp, isNetcraftUa} from "./requestBlocker.js";
const CUSTOM_OPTIONS = {
  KievRPSSecAuth: '',
  _RwBf: '',
  MUID: '',
  _U: '',
}

const WEB_CONFIG = {
  WORKER_URL: '', // 如无特殊需求请，保持为''
};

const RAND_IP_COOKIE_NAME = 'BingAI_Rand_IP';
const SYDNEY_ORIGIN = 'https://sydney.bing.com';
const SYDNEY_WSS = 'wss://sydney.bing.com';
const BING_ORIGIN = 'https://www.bing.com';
const BING_PROXY = 'https://sokwith-proxybing.hf.space';
const R_ORIGIN = 'https://r.bing.com';
const BING_SOURCE_ORIGIN = 'https://th.bing.com';
const BING_SR_ORIGIN = 'https://sr.bing.com';
const EDGE_ORIGIN = 'https://edgeservices.bing.com';
const DESIGNER_ORIGIN = 'https://designer.microsoft.com';
const DESIGNER_CDN_ORIGIN = 'https://cdn.designerapp.osi.office.net';
const DESIGNER_APP_ORIGIN = 'https://designerapp.officeapps.live.com';
const DESIGNER_APP_EDOG_ORIGIN = 'https://designerapp.edog.officeapps.live.com';
const DESIGNER_DOCUMENT_ORIGIN = 'https://document.designerapp.officeapps.live.com';
const DESIGNER_USERASSETS_ORIGIN = 'https://userassets.designerapp.officeapps.live.com';
const DESIGNER_MEDIASUGGESTION_ORIGIN = 'https://mediasuggestion.designerapp.officeapps.live.com';
const DESIGNER_RTC_ORIGIN = 'https://rtc.designerapp.officeapps.live.com';
const KEEP_REQ_HEADERS = [
  'accept',
  'accept-encoding',
  'accept-language',
  'authorization',
  'connection',
  'cookie',
  'upgrade',
  'user-agent',
  'sec-websocket-extensions',
  'sec-websocket-key',
  'sec-websocket-version',
  'x-request-id',
  'content-length',
  'content-type',
  'access-control-request-headers',
  'access-control-request-method',
  'sec-ms-gec',
  'sec-ms-gec-version',
  'x-client-data',
  'x-ms-client-request-id',
  'x-ms-useragent',
];

const IP_RANGE = [
    ['4.150.64.0', '4.150.127.255'],       // Azure Cloud EastUS2 16382
    ['4.152.0.0', '4.153.255.255'],        // Azure Cloud EastUS2 131070
    ['13.68.0.0', '13.68.127.255'],        // Azure Cloud EastUS2 32766
    ['13.104.216.0', '13.104.216.255'],    // Azure EastUS2 256
    ['20.1.128.0', '20.1.255.255'],        // Azure Cloud EastUS2 32766
    ['20.7.0.0', '20.7.255.255'],          // Azure Cloud EastUS2 65534
    ['20.22.0.0', '20.22.255.255'],        // Azure Cloud EastUS2 65534
    ['40.84.0.0', '40.84.127.255'],        // Azure Cloud EastUS2 32766
    ['40.123.0.0', '40.123.127.255'],      // Azure Cloud EastUS2 32766
    ['4.214.0.0', '4.215.255.255'],        // Azure Cloud JapanEast 131070
    ['4.241.0.0', '4.241.255.255'],        // Azure Cloud JapanEast 65534
    ['40.115.128.0', '40.115.255.255'],    // Azure Cloud JapanEast 32766
    ['52.140.192.0', '52.140.255.255'],    // Azure Cloud JapanEast 16382
    ['104.41.160.0', '104.41.191.255'],    // Azure Cloud JapanEast 8190
    ['138.91.0.0', '138.91.15.255'],       // Azure Cloud JapanEast 4094
    ['151.206.65.0', '151.206.79.255'],    // Azure Cloud JapanEast 256
    ['191.237.240.0', '191.237.241.255'],  // Azure Cloud JapanEast 512
    ['4.208.0.0', '4.209.255.255'],        // Azure Cloud NorthEurope 131070
    ['52.169.0.0', '52.169.255.255'],      // Azure Cloud NorthEurope 65534
    ['68.219.0.0', '68.219.127.255'],      // Azure Cloud NorthEurope 32766
    ['65.52.64.0', '65.52.79.255'],        // Azure Cloud NorthEurope 4094
    ['98.71.0.0', '98.71.127.255'],        // Azure Cloud NorthEurope 32766
    ['74.234.0.0', '74.234.127.255'],      // Azure Cloud NorthEurope 32766
    ['4.151.0.0', '4.151.255.255'],        // Azure Cloud SouthCentralUS 65534
    ['13.84.0.0', '13.85.255.255'],        // Azure Cloud SouthCentralUS 131070
    ['4.255.128.0', '4.255.255.255'],      // Azure Cloud WestCentralUS 32766
    ['13.78.128.0', '13.78.255.255'],      // Azure Cloud WestCentralUS 32766
    ['4.175.0.0', '4.175.255.255'],        // Azure Cloud WestEurope 65534
    ['13.80.0.0', '13.81.255.255'],        // Azure Cloud WestEurope 131070
    ['20.73.0.0', '20.73.255.255'],        // Azure Cloud WestEurope 65534
  ];
  
  /**
   * 随机整数 [min,max)
   * @param {number} min
   * @param {number} max
   * @returns
   */
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  
  /**
   * ip 转 int
   * @param {string} ip
   * @returns
   */
  const ipToInt = (ip) => {
    const ipArr = ip.split('.');
    let result = 0;
    result += +ipArr[0] << 24;
    result += +ipArr[1] << 16;
    result += +ipArr[2] << 8;
    result += +ipArr[3];
    return result;
  };
  
  /**
   * int 转 ip
   * @param {number} intIP
   * @returns
   */
  const intToIp = (intIP) => {
    return `${(intIP >> 24) & 255}.${(intIP >> 16) & 255}.${(intIP >> 8) & 255}.${intIP & 255}`;
  };
  
  /**
   * Get Random IP
   * @returns {string}
   */
  export const getRandomIP = () => {
    const randIndex = getRandomInt(0, IP_RANGE.length);
    const startIp = IP_RANGE[randIndex][0];
    const endIp = IP_RANGE[randIndex][1];
    const startIPInt = ipToInt(startIp);
    const endIPInt = ipToInt(endIp);
    const randomInt = getRandomInt(startIPInt, endIPInt);
    const randomIP = intToIp(randomInt);
    return randomIP;
  };
  

/**
 * 生成随机字符串
 * @param {number} e
 * @returns
 */
const randomString = (e) => {
  e = e || 32;
  const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678_-+";
  var n = "";
  for (let i = 0; i < e; i++) n += t.charAt(getRandomInt(0, t.length));
  return n;
}

const replaceURL = (body) => {
  body = body.replaceAll(BING_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""));
  body = body.replaceAll(SYDNEY_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""));
  body = body.replaceAll(R_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""));
  body = body.replaceAll(EDGE_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""));
  body = body.replaceAll(BING_SOURCE_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/th');
  body = body.replaceAll(DESIGNER_CDN_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-cdn');
  body = body.replaceAll(DESIGNER_APP_EDOG_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-app-edog');
  body = body.replaceAll(DESIGNER_DOCUMENT_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-document');
  body = body.replaceAll(DESIGNER_USERASSETS_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-userassets');
  body = body.replaceAll(DESIGNER_MEDIASUGGESTION_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-mediasuggestion');
  body = body.replaceAll(DESIGNER_RTC_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-rtc');
  body = body.replaceAll(DESIGNER_APP_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-app');
  body = body.replaceAll(DESIGNER_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer');
  body = body.replaceAll(SYDNEY_WSS.replace("wss://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "").replace("wss://", ""));

  return body
}

const rewriteBody = async (res) => {
  const content_type = res.headers.get("Content-Type") || "";
  const content_encoding = res.headers.get("Content-Encoding") || "";
  let encoding = null;
  let body = res.body;
  if (content_type.startsWith("text/html") || res.url.endsWith("js")) {
    let decodedContent = null;
    decodedContent = new TextDecoder("utf-8").decode(new Int8Array(await res.clone().arrayBuffer()));
    if (decodedContent) {
      // @ts-ignore
      body = replaceURL(decodedContent);
    }
    return { body, encoding };
  }
  return { body, content_encoding };
}

const challengeResponseBody = `
<html><head><script type="text/javascript">//<![CDATA[
var CfConfig ={"captchaSuccessPostMessage":""};;
//]]></script></head><body><script type="text/javascript">//<![CDATA[
(function(){var n,t=CfConfig&&CfConfig.captchaSuccessPostMessage?CfConfig.captchaSuccessPostMessage:"verificationComplete";(n=window.parent)===null||n===void 0?void 0:n.postMessage(t,"*")})();
//]]></script></body></html>
`;

/**
 * challenge
 * @param {Request} request
 * @returns
 */
const challenge = async (request) => {
//  if (request.method != 'GET') {
//    return Response.json({ code: 405, message: 'Method Not Allowed', data: null }, { status: 405 });
//  }

//  const currentUrl = new URL(request.url);
//  const newRes = new Response(challengeResponseBody);
//  newRes.headers.set('Content-Type', 'text/html; charset=utf-8');
  const newHeaders = new Headers();
//  newHeaders.set('host', BING_ORIGIN);
//  newHeaders.set('origin', BING_ORIGIN);
//  newHeaders.set('referer', 'https://www.bing.com/chat?q=Bing+AI&showconv=1&FORM=hpcodx');
  newHeaders.set(
      'user-agent',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410427012'
    );
  const ccturl = 'https://jokyone-proxybing.hf.space/turing/captcha/challenge'; 
      const newReq = new Request(ccturl, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: 'manual',
    });
  const res = await fetch(newReq);
  let newRes = new Response(res.body, res);
// 设置其他需要的属性
newRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
newRes.headers.set('Access-Control-Allow-Credentials', 'true');
newRes.headers.set('Access-Control-Allow-Headers', '*');
newRes.headers.set('Access-Control-Allow-Origin', '*'); //允许所有域的访问
// 返回新的 Response 对象
  return newRes
};

/**
 * home
 * @param {string} pathname
 * @returns
 */
const home = async (pathname) => {
  let url = 'https://sokwith-proxybing.hf.space';
  const res = await fetch(url);
  const result = await rewriteBody(res);
  const newRes = new Response(result.body, res);
  if (pathname.endsWith('.js')) {
    newRes.headers.set('content-type', 'application/javascript');
  } else if (pathname.endsWith('.css')) {
    newRes.headers.set('content-type', 'text/css');
  } else if (pathname.endsWith('.svg')) {
    newRes.headers.set('content-type', 'image/svg+xml');
  } else if (pathname.endsWith('.ico') || pathname.endsWith('.png')) {
    newRes.headers.set('content-type', 'image/png');
  } else {
    newRes.headers.set('content-type', 'text/html; charset=utf-8');
  }
  newRes.headers.delete('content-security-policy');
  return newRes;
};

function processHeaders(request, targetHost) {
  const newHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (KEEP_REQ_HEADERS.includes(key)) {
      newHeaders.set(key, value);
    }
  });
  newHeaders.set('host', targetHost);
  newHeaders.set('origin', SYDNEY_ORIGIN);
  if (request.headers.has('referer') && request.headers.get('referer').indexOf('web/compose.html') != -1) {
    newHeaders.set('referer', 'https://edgeservices.bing.com/edgesvc/compose');
  } else {
    newHeaders.set('referer', 'https://www.bing.com/chat?q=Bing+AI&showconv=1&FORM=hpcodx');
  }
  const randIP = getRandomIP();
  newHeaders.set('X-Forwarded-For', randIP);
  const cookie = request.headers.get('Cookie') || '';
  let cookies = cookie;
  if (!cookie.includes('KievRPSSecAuth=')) {
    if (CUSTOM_OPTIONS.KievRPSSecAuth.length !== 0) {
      cookies += '; KievRPSSecAuth=' + CUSTOM_OPTIONS.KievRPSSecAuth;
    } else {
      cookies += '; KievRPSSecAuth=' + randomString(512);
    }
  }
  if (!cookie.includes('_RwBf=')) {
    if (CUSTOM_OPTIONS._RwBf.length !== 0) {
      cookies += '; _RwBf=' + CUSTOM_OPTIONS._RwBf
    }
  }
  if (!cookie.includes('MUID=')) {
    if (CUSTOM_OPTIONS.MUID.length !== 0) {
      cookies += '; MUID=' + CUSTOM_OPTIONS.MUID
    }
  }
  if (!cookie.includes('_U=')) {
    if (CUSTOM_OPTIONS._U.length !== 0) {
      const _Us = CUSTOM_OPTIONS._U.split(',');
      cookies += '; _U=' + _Us[getRandomInt(0, _Us.length)];
    }
  }  
  const cookieStr = cookies;
  let cookieObjects = {};
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split('=');
    const key = arr[0].trim();
    const val = arr.slice(1, arr.length+1).join('=').trim();
    cookieObjects[key] = val;
  })
  delete cookieObjects[RAND_IP_COOKIE_NAME];
  cookies = Object.keys(cookieObjects).map(key => key + '=' + cookieObjects[key]).join('; ');
  newHeaders.set('Cookie', cookies);
  const oldUA = request.headers.get('user-agent') || '';
  let isMobile = oldUA.includes('Mobile') || oldUA.includes('Android');
  if (isMobile ) {
    newHeaders.set(
      'user-agent',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410427012'
    );
  } else {
    newHeaders.set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.35');
  }
  return newHeaders;
}

export async function onRequest(context) {
  const { request, env } = context;
//防止安全扫描
  //const { request, env } = context;
  const clientIP = request.headers.get("CF-Connecting-IP");
  const userAgent = request.headers.get('user-agent');
  if (userAgent && isNetcraftUa(userAgent) || isNetcraftIp(clientIP)) {
    return new Response("Bad Request", { status: 400 });
  }
  
  // 处理 CORS 请求
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
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

async function handleRequest(request, env) {
  let uri = new URL(request.url);
     if (WEB_CONFIG.WORKER_URL == '') {
      WEB_CONFIG.WORKER_URL = uri.hostname;
    }
//if (uri.pathname.includes('/turing/captcha/challenge')){
//     return challenge(request);
//      }
if (uri.pathname.includes('/turing/conversation/') ||
    uri.pathname.includes('/turing/captcha/')){ 
     uri.hostname = 'free.nbing.eu.org'; 
     return fetch(new Request(uri.toString(), request));
}

 if (uri.pathname.includes('/images/create')){
//  if (uri.pathname.includes('/turing/conversation/') ||
//      uri.pathname.includes('/turing/captcha/') ||
//      uri.pathname.includes('/images/create')){
     uri.hostname = 'www.bing.com'; 
     let newHeaders = processHeaders(request, uri.host);
      const newReq = new Request(uri.toString(), {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: 'manual',
    });
 const imgres = await fetch(newReq);
 let   imgresult = await rewriteBody(imgres);
 let  imgnewRes = new Response(imgresult.body, imgres);
// 设置其他需要的属性
imgnewRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
imgnewRes.headers.set('Access-Control-Allow-Credentials', 'true');
imgnewRes.headers.set('Access-Control-Allow-Headers', '*');
imgnewRes.headers.set('Access-Control-Allow-Origin', '*'); //允许所有域的访问
return imgnewRes;
}
  if (uri.pathname.includes('/fd/ls/')){  
     uri.hostname = 'sokwith-proxybing.hf.space'; 
     return fetch(new Request(uri.toString(), request));
}
  if (uri.pathname.startsWith('/sydney/')){  
  //  uri.hostname = 'copilot.microsoft.com';
  //  uri.hostname = 'sydney.bing.com';
     uri.hostname = 'zbj.pages.dev';
     return fetch(new Request(uri.toString(), request));
     let newHeaders = processHeaders(request, uri.host);
      const newReq = new Request(uri.toString(), {
      method: request.method,
      headers: newHeaders,
  //      headers: request.headers,
      body: request.body,
      redirect: 'manual',
    });
 const imgres = await fetch(newReq);
 let   imgresult = await rewriteBody(imgres);
 let  imgnewRes = new Response(imgresult.body, imgres);
// 设置其他需要的属性
imgnewRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
imgnewRes.headers.set('Access-Control-Allow-Credentials', 'true');
imgnewRes.headers.set('Access-Control-Allow-Headers', '*');
imgnewRes.headers.set('Access-Control-Allow-Origin', '*'); //允许所有域的访问
return imgnewRes;
}
   if (uri.pathname.startsWith('/designer/')) {
       uri.hostname = 'designer.microsoft.com';
       uri.pathname = uri.pathname.replaceAll('/designer/', '/');
     return fetch(new Request(uri.toString(), request));
    }
   if (uri.pathname.startsWith('/th')) {
       uri.hostname = 'th.bing.com';
       uri.pathname = uri.pathname.replaceAll('/th/th', '/th');
     return fetch(new Request(uri.toString(), request));
    }
  if (uri.pathname.startsWith('/chat')) {
    uri = new URL('/search?q=Microsoft+Copilot&FORM=hpcodx&showconv=1&showconv=1', uri.origin);
    return Response.redirect(uri.toString(), 302);
  }


    if (uri.pathname.startsWith('/opaluqu')) {
       uri.hostname = 'sr.bing.com';
     return fetch(new Request(uri.toString(), request));
    }  
   if (uri.pathname.includes('/notifications/')) {
       uri.hostname = 'www.bing.com';
     return fetch(new Request(uri.toString(), request));
    }  
    if (uri.pathname.startsWith('/edgesvc')) {
       uri.hostname = 'edgeservices.bing.com';
     return fetch(new Request(uri.toString(), request));
    }
    if (uri.pathname.startsWith('/rewardsapp/')) {
      await fetch('https://getbingcibname.pages.dev/PUT');
       uri.hostname = 'edgeservices.bing.com';
     return fetch(new Request(uri.toString(), request));
     }
     if (uri.pathname.startsWith('/designer-cdn/')) {
      uri.hostname = 'cdn.designerapp.osi.office.net';
      uri.pathname = uri.pathname.replaceAll('/designer-cdn/', '/');
    return fetch(new Request(uri.toString(), request));
   }
   if (uri.pathname.startsWith('/designer-app/')) {
    uri.hostname = 'designerapp.officeapps.live.com';
    uri.pathname = uri.pathname.replaceAll('/designer-app/', '/');
   return fetch(new Request(uri.toString(), request));
   }  
   if (uri.pathname.startsWith('/designer-document/')) {
    uri.hostname = 'document.designerapp.officeapps.live.com';
    uri.pathname = uri.pathname.replaceAll('/designer-document/', '/');
   return fetch(new Request(uri.toString(), request));
  }   
  if (uri.pathname.startsWith('/designer-userassets/')) {
    uri.hostname = 'userassets.designerapp.officeapps.live.com';
    uri.pathname = uri.pathname.replaceAll('/designer-userassets/', '/');
   return fetch(new Request(uri.toString(), request));
  } 
  if (uri.pathname.startsWith('/designer-mediasuggestion/')) {
    uri.hostname = 'mediasuggestion.designerapp.officeapps.live.com';
    uri.pathname = uri.pathname.replaceAll('/designer-mediasuggestion/', '/');
   return fetch(new Request(uri.toString(), request));
   }
   if (uri.pathname.startsWith('/designer-rtc/')) {
    uri.hostname = 'rtc.designerapp.officeapps.live.com';
    uri.pathname = uri.pathname.replaceAll('/designer-rtc/', '/');
   return fetch(new Request(uri.toString(), request));
  }
 if (uri.pathname.startsWith('/fd/auth/signin')) {
  const domain = uri.hostname; // 获取请求的主机名
  const cctresp = await fetch('https://jokyone-cookiesvr.hf.space/GET?pwd=234567');
  let bBING_COOKIE = await cctresp.text();
  let data = JSON.parse(bBING_COOKIE);
  let Uallcookies = data.result.cookies;
  const keyValuePairs = Uallcookies.split(';');

  // 创建一个新的 Headers 对象
  let newHeaders = new Headers(cctresp.headers);
  // 清除原有的 Set-Cookie 头部
  newHeaders.delete('Set-Cookie');
  // 为每个键值对添加 Set-Cookie 头部
  keyValuePairs.forEach(pair => {
    const [key, value] = pair.trim().split('=');
    newHeaders.append('Set-Cookie', `${key}=${value}; Domain=${domain}; Path=/`);
  });
   // 创建并返回新的 Response 对象
  return new Response(null, {
    status: 204,
    headers: newHeaders
  });
}
  if (uri.pathname.startsWith('/rewards') || uri.pathname.startsWith('/shop')) {
   //  return; // 返回空，不执行任何操作
    const domain = uri.hostname; // 获取请求的主机名
  const cctresp = await fetch('https://bcct.pages.dev');
  let bBING_COOKIE = await cctresp.text();
  let data = JSON.parse(bBING_COOKIE);
  let Uallcookies = data.result.cookies;
  const keyValuePairs = Uallcookies.split(';');

  // 创建一个新的 Headers 对象
  let newHeaders = new Headers(cctresp.headers);
  // 清除原有的 Set-Cookie 头部
  newHeaders.delete('Set-Cookie');
  // 为每个键值对添加 Set-Cookie 头部
  keyValuePairs.forEach(pair => {
    const [key, value] = pair.trim().split('=');
    newHeaders.append('Set-Cookie', `${key}=${value}; Domain=${domain}; Path=/`);
  });
   // 创建并返回新的 Response 对象
  return new Response(null, {
    status: 204,
    headers: newHeaders
  });
   }
  
let newRes ;
// 获取原始路径的内容
 uri.hostname = 'sokwith-proxybing.hf.space';
 const res = await fetch(new Request(uri.toString(), request));
 let   result = await rewriteBody(res);
  newRes = new Response(result.body, res);
// 设置其他需要的属性
newRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
newRes.headers.set('Access-Control-Allow-Credentials', 'true');
newRes.headers.set('Access-Control-Allow-Headers', '*');
newRes.headers.set('Access-Control-Allow-Origin', '*'); //允许所有域的访问
// 返回新的 Response 对象
return newRes;
}
