# moment-date-math

**moment plugin to parse a date math, elasticsearch style**

This is a plugin to the Moment.js library to support date-math operations to the moment object. Date maths operations are inputted as a string whose format is based on elasticsearch date-math format (see <https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#date-math>).

This plugin does not have any dependencies beyond Moment.js itself, and may be used in the browser and in Node.js.

English is not my mother-tongue, so please forgive any mistakes and the incomprehensive readme. Any help with this documentation or source code is appreciated and welcomed

---

## Installation

**Node.js**

`npm install moment-date-math`

**Bower and other package managers**

I haven't tested yet, but it should be similar to npm installation

**Browser**
`<script src="path/to/moment-date-math.js"></script>`

When using this plugin in the browser, be sure to include moment.js on your page first.

---

## Usage

### Module

To use this plugin as a module, use the `require` function:
```
require("moment-date-math");
```

Or replace your existing
```
var moment = require("moment");
```
by
```
var moment = require("moment-date-math");
```
-------------------------

## Example: (run at time zone +07:00)
```javascript
// the following 2 lines are equivalent:
moment.parseMath('2016-06-12 21:00:00Z||+1y2M3w-4d5h6m7s').format()
moment('2016-06-12 21:00:00Z').parseMath('+1y2M3w-4d5h6m7s').format()
// => moment('2016-06-12 21:00:00Z').add(1, 'y').add(2, 'M').add(3, 'w').subtract(4, 'd').subtract(5, 'h').subtract(6, 'm').subtract(7, 's').format()
// => 2017-08-29T22:53:53+07:00
```

```javascript
moment.parseMath('May 6th 2016 10:23:23[Z]+ 1M2d /d - 3h 4m', 'MMM Do Y hh:mm:ss').format()
// => moment('May 6th 2016 10:23:23', 'MMM Do Y hh:mm:ss').utcOffset('Z').add(1, 'M').add(2, 'd').startOf('day').subtract(3, 'h').subtract(4, 'm').format()
// => 2016-06-07T20:56:00Z
```
  
```javascript
// the following 2 lines are equivalent:
moment.parseMath('now[+05:00]-28h/d + 15d/M').format()
moment().calc('[+05:00]-28h/d + 15d/M').format()
// => moment().utcOffset('+05:00').subtract(28, 'h').startOf('day').add(15, 'd').startOf('month')
// => 2016-06-01T00:00:00+05:00
```

```javascript
moment.parseMath('2016-06-12 13:00:00 +05:00 [@]- 28 h /d + 15 d /M').format()
// => moment('2016-06-12 13:00:00 +05:00').utcOffset('2016-06-12 20:00:00 +05:00').subtract(28, 'h').startOf('day').add(15, 'd').startOf('month')
// => 2016-06-01T00:00:00+05:00
```

## Usage
(Convention: I use x? for an optional parameter x)

**moment.parseMath**(fullExpression, format?): create a moment from a dateMath expression and format

**moment().calc**(mathExpression): apply a dateMath expression to existing moment

#### *where*:
fullExpression = < datePart > + < splitter? > + < mathExpression >
  * A splitter, if exists, must be '||'
  * moment.parseMath(fullExpression, format?) is equivalent to moment(datePart, format?).calc(mathExpression), except for:
     - the [@] operator, see below
     - if <datePart> is 'now' or '' (empty string), in which case it is equivalent to moment().calc(mathExpression)
  
A mathExpression is a string composed by consecutive dateMath operators, with optional spaces between them. There are 4 type of operators:
 - Set utcOffset operator: [@] or [Z] or [+XX:XX] or [-XX:XX], where each 'X' is a digit. It translates to the function call .utcOffset(<*whatever between the square brackets*>), with the exception of [@]
   + There should be at most 1 utcOffset operator, and if exists, it should be the first operator in the series
   + [@] should only be used in moment.parseMath, where the <datePart> contains a utc offset suffix, e.g: Z or +XX:XX. It translates to .utcOffset(< datePart >);
 - Add operator: has the format of +< number1 >< unit1 >< number2 >< unit2 >...< number_n >< unit_n >. Add operator is space tolerant, i.e there can be whitespaces in between
   + The numbers are non-negative integers. Each unit is a character from the set [yMdhms]
   + It translates to .add(< number1 >, < unit1 >).add(< number2 >, < unit2 >)....add(< number_n >, < unit_n >)
 - Subtract operator: similar to add operator but starts with a minus (-< number1 >< unit1 >< number2 >< unit2 >...< number_n >< unit_n >)
 - startOf operator: has the format of /[yMdhms]
   + Consecutive startOf operators are not allowed (and it doesn't make sense)
   + It tranlates to .startOf(< fullUnitNotation >) where < fullUnitNotation > is 'year', 'month', 'day', 'hour', 'minute', 'second' respectively
 
I know, I'm not good at writing documents, nor at English. Help is appreciated. Hope you get the basic idea what this plugin is for, at least from the examples. 
