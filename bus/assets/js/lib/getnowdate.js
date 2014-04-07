/**
 *
 *  Title  : Get the Date & Time of Now
 *  Author : tknhs
 *
 **/

function now_date() {
  var date = new Date();
  var year = String(date.getFullYear());
  var month = String(Number(date.getMonth())+1);
  month = (month.length == 1) ? '0' + month : month;
  var day = String(date.getDate());
  day = (day.length == 1) ? '0' + day : day;
  var hours = String(date.getHours());
  hours = (hours.length == 1) ? '0' + hours : hours;
  var minutes = String(date.getMinutes());
  minutes = (minutes.length == 1) ? '0' + minutes : minutes;
  var date_today = year + '/' + month + '/' + day;
  var date_time = hours+':'+minutes;
  return [date_today, date_time];
}

