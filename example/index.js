/**
 * 文件描述
 * @author ydr.me
 * @create 2017-10-09 17:49
 * @update 2017-10-09 17:49
 */


'use strict';

var Switchable = require('../src/index');

new Switchable({
    el: '#nav0'
});

new Switchable({
    el: '#nav1',
    anchorSel: 'li'
});

