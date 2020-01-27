var formatDate = (date) => {
    var year = date.getFullYear();  
    var month = date.getMonth() + 1;  
    month = month < 10 ? ('0' + month) : month;  
    var day = date.getDate();
    day = day < 10 ? ('0' + day) : day;  
    return year + '/' + month + '/' + day;  
};

var formatCuDate = (date) => {
  var year = date.getFullYear();  
  var month = date.getMonth() + 1;  
  month = month < 10 ? ('0' + month) : month;  
  var day = date.getDate();  
  day = day < 10 ? ('0' + day) : day;
  var hour = date.getHours();
  hour = hour < 10 ? ('0' + hour) : hour;
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  var second = date.getSeconds();
  second = second < 10 ? ('0' + second) : second;
  return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;  
}

var formatDateUSA = (date) => {
  var year = date.getFullYear();  
  var month = date.getMonth() + 1;  
  month = month < 10 ? ('0' + month) : month;  
  var day = date.getDate();
  day = day < 10 ? ('0' + day) : day;  
  return month + '/' + day + '/' + year;  
}

var formatCuDateUSA = (date) => {
  var year = date.getFullYear();  
  var month = date.getMonth() + 1;  
  month = month < 10 ? ('0' + month) : month;  
  var day = date.getDate();  
  day = day < 10 ? ('0' + day) : day;
  var hour = date.getHours();
  hour = hour < 10 ? ('0' + hour) : hour;
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  var second = date.getSeconds();
  second = second < 10 ? ('0' + second) : second;
  return month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;  
}

var formatExportDate = (date) => {
  var year = date.getFullYear();  
  var month = date.getMonth() + 1;  
  month = month < 10 ? ('0' + month) : month;  
  var day = date.getDate();  
  day = day < 10 ? ('0' + day) : day;
  var hour = date.getHours();
  hour = hour < 10 ? ('0' + hour) : hour;
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  var second = date.getSeconds();
  second = second < 10 ? ('0' + second) : second;
  return year + '_' + month + '_' + day + ' ' + hour + '_' + minute + '_' + second;
}

var transSq = (value) => {
  return value.replace(/'/g,"''")
}

var trimSpace = (value) => {
  var valueArr = value.split(',')
  for(let i = 0; i < valueArr.length; i++) {
    valueArr[i] = valueArr[i].trim();
  }
  return valueArr.join('~');
}

const orEC = "OR01"
const orCEC = "OR02"
const CC = "CC01"

module.exports = {
    formatDate: formatDate,
    formatDateUSA: formatDateUSA,
    transSq: transSq,
    formatCuDate: formatCuDate,
    formatCuDateUSA: formatCuDateUSA,
    formatExportDate: formatExportDate,
    orEC: orEC,
    orCEC: orCEC,
    CC: CC,
    trimSpace: trimSpace
}