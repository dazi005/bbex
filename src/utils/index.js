import { message } from 'antd';

/**
* @author William Cui
* @description 数字不够位数前面自动补零
* @param number {number} 需要格式化的数字
* @param n {number} 需要格式化成的位数
* @returns {string} 格式化后的字符串
**/
function fillZero(number, n) {
    return (Array(n).join(0) + number).slice(-n);
}

/**
* @author William Cui
* @description 根据后端返回的时间戳格式化成指定的格式
* @param timestamp {number} 需要格式化的时间戳
* @param patternStr {string} 指定的格式字符串 默认是'YYYY-MM-DD hh:mm:ss'
* @returns {string} 格式化后的日期时间字符串
Y: 代表年份， M: 代表月份， D: 代表一个月中的第几天， h: 代表小时， m: 代表分, s: 代表秒
**/
function stampToDate(timestamp, patternStr) {
    patternStr = patternStr || 'YYYY-MM-DD hh:mm:ss';
    const patternArray = patternStr.match(/\w+/g);
    const date = new Date(timestamp);
    const dateObj = {
        Y: date.getFullYear(),
        M: date.getMonth() + 1,
        D: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    };
    patternArray.forEach(pattern => {
        let replaceStr = fillZero(dateObj[pattern[0]], pattern.length);
        patternStr = patternStr.replace(pattern, replaceStr);
    });
    return patternStr;
}

/**
* @author William Cui
* @description 把日期字符串转成时间戳
* @param dateStr {string} 需要格式化的日期字符串
* @returns {number} 时间戳
**/
function dateToStamp(dateStr) {
    return new Date(dateStr).getTime();
}

/**
* @author William Cui
* @description 根据选择器复制元素的值或者文本
* @param e {string || event} 元素的选择器 或者是 event对象
* @returns 没有返回值
**/
function copy(e) {
    const ele = typeof e === 'string' ? document.querySelector(e) : e.currentTarget;

    if(ele.value) {
        ele.select();
    }else {
        const text = ele.innerText.trim();
        const textArea = document.createElement("textarea");
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
    
        setTimeout(() => {
            document.body.removeChild(textArea);
        }, 200);
    }

    try {
        document.execCommand('copy');
        message.destroy();
        message.success('复制成功!');
    } catch (err) {
        throw new Error('该浏览器不支持点击复制到剪贴板');
    }
    
}

export {
    fillZero,
    stampToDate,
    dateToStamp,
    copy,
}