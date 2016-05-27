/**
 * 可切换的元素
 * @author ydr.me
 * @create 2016年05月26日11:31:01
 */

'use strict';

var events = require('blear.classes.events');
var object = require('blear.utils.object');
var time = require('blear.utils.time');
var event = require('blear.core.event');
var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');


var reHash = /^#/;
var defaults = {
    el: null,
    activeClass: 'active',
    activeIndex: 0,
    triggerEvent: 'click'
};
var Switchable = events.extend({
    className: 'Switchable',
    constructor: function (options) {
        var the = this;

        Switchable.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_initNode]();
        the[_initEvent]();

        time.nextTick(function () {
            the.change(the[_options].activeIndex);
        });
    },


    /**
     * 改变索引值
     * @param index {Number} 索引值
     * @returns {Switchable}
     */
    change: function (index) {
        var the = this;
        var itemEl = selector.children(the[_navEl])[index];

        if (!itemEl) {
            return the;
        }

        var anchorEl = selector.children(itemEl)[0];
        event.emit(anchorEl, 'click');
        return the;
    },

    destroy: function () {
        var the = this;

        event.un(the[_navEl], the[_options].triggerEvent, the[_onChange]);
        Switchable.parent.destroy(the);
    }
});
var _options = Switchable.sole();
var _initNode = Switchable.sole();
var _initEvent = Switchable.sole();
var _navEl = Switchable.sole();
var _onChange = Switchable.sole();
var _lastIndex = Switchable.sole();


/**
 * 初始化元素
 */
Switchable.method(_initNode, function () {
    var the = this;

    the[_navEl] = selector.query(the[_options].el)[0];
});


/**
 * 初始化事件
 */
Switchable.method(_initEvent, function () {
    var the = this;
    var options = the[_options];
    var activeClass = options.activeClass;

    event.on(the[_navEl], the[_options].triggerEvent, 'a', the[_onChange] = function (ev) {
        var el = this;
        var parentEl = selector.parent(el)[0];
        var index = selector.index(parentEl);
        var href = attribute.attr(el, 'href');

        if (the[_lastIndex] !== index) {
            the[_lastIndex] = index;
            var contentEl = selector.query(href)[0];

            attribute.addClass(parentEl, activeClass);

            if (contentEl) {
                attribute.addClass(contentEl, activeClass);
            }

            the.emit('change', index, parentEl, contentEl);
        }

        if (reHash.test(href)) {
            ev.preventDefault();
        }
    });
});

module.exports = Switchable;
