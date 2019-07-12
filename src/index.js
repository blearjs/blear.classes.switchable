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
    preventDefault: true,
    anchorSel: 'a',
    itemSel: 'li'
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
            var activeIndex = the[_options].activeIndex;
            if (activeIndex > -1) {
                the.change(activeIndex);
            }
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

        the[_activeItem](itemEl);
        return the;
    },

    /**
     * 获取索引值
     * @returns {*}
     */
    getIndex: function () {
        var the = this;

        return the[_lastIndex] || the[_options].activeIndex;
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
var _activeItem = sole();
var _onChange = sole();
var _lastIndex = sole();
var pro = Switchable.prototype;

// 激活 anchor
// 这里的一个改动，是去除了 emit 参数
// 这个地方改动的频率有点大，这次去掉的原因是：
// 不管主动 change 还是事件触发 change，还是第一次初始化 change，
// 都应该触发 change 事件
// 2019年07月12日11:29:14
pro[_activeItem] = function (itemEl) {
    var the = this;
    var options = the[_options];
    var activeClass = options.activeClass;
    var index = selector.index(itemEl);
    var anchorEl = selector.children(itemEl)[0];
    var href = '';

    if (anchorEl) {
        href = attribute.attr(anchorEl, 'href');
    }

    if (the[_lastIndex] !== index) {
        the[_lastIndex] = index;
        attribute.addClass(itemEl, activeClass);
        var siblingEls = selector.siblings(itemEl);
        array.each(siblingEls, function (index, siblingEl) {
            attribute.removeClass(siblingEl, activeClass);
        });

        if (href) {
            var contentEl = selector.query(href)[0];

            if (contentEl) {
                siblingEls = selector.siblings(contentEl);
                attribute.addClass(contentEl, activeClass);
                array.each(siblingEls, function (index, siblingEl) {
                    attribute.removeClass(siblingEl, activeClass);
                });
            }
        }

        the.emit('change', index, itemEl, contentEl);
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

    event.on(the[_navEl], options.triggerEvent, options.anchorSel, the[_onChange] = function (ev) {
        the[_activeItem](selector.closest(this, options.itemSel)[0]);

        if (options.preventDefault) {
            ev.preventDefault();
        }
    });
};

module.exports = Switchable;
