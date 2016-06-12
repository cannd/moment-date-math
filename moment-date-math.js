/**
 * Created by cannd on 6/12/2016.
 */
(function(root, undefined) {
  var moment;
  if (typeof require === "function") {
    try { moment = require('moment'); }
    catch (e) {}
  }

  if (!moment && root.moment) {
    moment = root.moment;
  }

  if (!moment) {
    throw "moment-date-math cannot find Moment.js";
  }

  function applyOperator(m, op) {
    var fullNotation = {
      y: 'year', M: 'month', w: 'week', d: 'day', h: 'hour', m: 'minute', s: 'second'
    };
    if (op[0] === '/') return m.startOf(fullNotation[op[1]]);
    var durationRegex = /(\d+)([yMwdhms])/g;
    var match = null;
    while ((match = durationRegex.exec(op)) !== null) {
      if (op[0] === '+') m.add(parseInt(match[1]), match[2]);
      if (op[0] === '-') m.subtract(parseInt(match[1]), match[2]);
    }
  }

  function applyExpr(m, expr) {
    var operatorRegex = /(?:[+-](?:\d+[yMwdhms])+|\/[yMwdhms])/g;
    var match = null;
    while ((match = operatorRegex.exec(expr)) !== null) {
      applyOperator(m, match[0]);
    }

    return m;
  }

  function dateMath(expr, format) {
    var asInt = parseInt(expr);
    if (expr == '' + asInt) return moment(asInt);
    var regex = /(?:\|\|)?\s*(?:\[(@|Z|[+-]\d\d:\d\d)\])?((?:\/[yMwdhms])?\s*(?:[+-]\s*(?:\d+\s*[yMwdhms]\s*)+(?:\/[yMwdhms])?\s*)+)$/;
    var match = regex.exec(expr);
    var index = (match ? match.index : -1);

    var datePart = index < 0 ? expr : expr.slice(0, index);
    var date = moment.invalid();
    if (moment.isMoment(this)) {
      format = undefined;
      if (datePart === '') date = this;
    }
    else date = (datePart === '' || datePart.toLowerCase() === 'now') ? moment() : moment(datePart, format);
    if (!date.isValid()) return date;

    //  set the timezone (utcOffset), if any
    if (match[1]) {
      if (match[1] === '@') date.utcOffset(datePart);
      else date.utcOffset(match[1]);
    }
    return applyExpr(date, match[0].replace(/(\s+|\|\|)/g, ''));  //  get expression part and strip whitespaces, then apply
  }

  moment.parseMath = moment.fn.calc = dateMath;
  if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = moment;
})(this);
