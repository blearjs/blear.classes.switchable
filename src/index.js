/**
 * 可切换的元素
 * @author ydr.me
 * @create 2016年05月26日11:31:01
 */

'use strict';

var events = require('blear.classes.events');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var time = require('blear.utils.time');
var event = require('blear.core.event');
var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');

var defaults = {
    el: null,
    activeClass: 'active',
    activeIndex: 0,
    triggerEvent: 'click',
    preventDefault: true
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

        the[_activeAnchor](selector.children(itemEl)[0]);
        return the;
    },

    /**
     * 获取索引值
     * @returns {*}
     */
    getIndex: function () {
        return this[_lastIndex];
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        event.un(the[_navEl], the[_options].triggerEvent, the[_onChange]);
        Switchable.invoke('destroy', the);
    }
});
var sole = Switchable.sole;
var _options = sole();
var _initNode = sole();
var _initEvent = sole();
var _navEl = sole();
var _activeAnchor = sole();
var _onChange = sole();
var _lastIndex = sole();
var pro = Switchable.prototype;

// 激活 anchor
pro[_activeAnchor] = function (anchorEl) {
    var the = this;
    var options = the[_options];
    var activeClass = options.activeClass;
    var parentEl = selector.parent(anchorEl)[0];
    var index = selector.index(parentEl);
    var href = attribute.attr(anchorEl, 'href');

    if (the[_lastIndex] !== index) {
        the[_lastIndex] = index;
        var contentEl = selector.query(href)[0];

        attribute.addClass(parentEl, activeClass);
        var siblingEls = selector.siblings(parentEl);
        array.each(siblingEls, function (index, siblingEl) {
            attribute.removeClass(siblingEl, activeClass);
        });

        if (contentEl) {
            siblingEls = selector.siblings(contentEl);
            attribute.addClass(contentEl, activeClass);
            array.each(siblingEls, function (index, siblingEl) {
                attribute.removeClass(siblingEl, activeClass);
            });
        }

        the.emit('change', index, parentEl, contentEl);
    }
};

// 初始化元素
pro[_initNode] = function () {
    var the = this;

    the[_navEl] = selector.query(the[_options].el)[0];
};

// 初始化事件
pro[_initEvent] = function () {
    var the = this;
    var options = the[_options];

    event.on(the[_navEl], options.triggerEvent, 'a', the[_onChange] = function (ev) {
        the[_activeAnchor](this);

        if (options.preventDefault) {
            ev.preventDefault();
        }
    });
};

module.exports = Switchable;
