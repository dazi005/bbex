/**
 * @author William Cui
 * @description 使用Promise封装接口请求方法
 * @param url {string} 请求地址 【必填】
 * @param method {string} 请求方式 【必填】
 * @param headers {object} 请求头对象 【选填】
 * @param data {object} 请求参数对象 【选填】
 * @return Promise 对象
 * @date 2017-08-25
 **/
function request(url, { method = 'POST', headers, body } = {}) {
  //键值对转换为字符串
  function params(body) {
    var arr = [];
    Object.keys(body).forEach((key, index) => {
      arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(body[key]));
    });
    return arr.join('&');
  }

  return new Promise((resolve, reject) => {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...headers
      }
    };

    if (body) {
      if (method === 'POST') {
        opts.body = params(body);
      } else {
        url = `${url}?${params(body)}`;
      }
    }

    //如果已经登录了要把stoken放入headers
    if (sessionStorage.getItem('account')) {
      const account = JSON.parse(sessionStorage.getItem('account'));
      opts.headers['stoken'] = account.token;
    }

    fetch(`/bbex${url}`, opts)
      .then(response => {
        if (response.ok) {
          return response.status === 200 ? response.json() : { status: response.status };
        }
        switch (response.status) {
          case -2:
            reject({
              status: response.status,
              msg: '全局错误'
            });
            break;
          case 403:
            reject({
              status: response.status,
              msg: '没有权限，需要谷歌验证'
            });
            break;
          case -5:
            reject({
              status: response.status,
              msg: '没有登录，请先登录'
            });
            break;
          case 500:
            reject({
              status: response.status,
              msg: '服务器内部错误 [500].'
            });
            break;
          default:
            reject({
              status: response.status,
              msg: response.statusText
            });
        }
      })
      .then(json => {
        resolve(json);
      })
      .catch(e => {
        console.log('fetchjson: ', e);
      });
  });
}

export default request;
