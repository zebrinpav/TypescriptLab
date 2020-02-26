"use strict";
/**
 * @module Container
 * @namespace springroll
 */
exports.__esModule = true;
var PageVisibility = /** @class */ (function () {
    function PageVisibility(_foo, _bar) {
        this.foo = _foo;
        this.bar = _bar;
    }
    PageVisibility.prototype.destroy = function () {
        this.foo = 0;
        this.bar = 0;
    };
    return PageVisibility;
}());
var Plugin = /** @class */ (function () {
    function Plugin() {
    }
    Plugin.prototype.setup = function () { };
    Plugin.prototype.opened = function () { };
    Plugin.prototype.close = function () { };
    Plugin.prototype.teardown = function () { };
    return Plugin;
}());
var Global = /** @class */ (function () {
    function Global() {
    }
    return Global;
}());
/**
 * @class Container
 */
exports.plugin = new Plugin();
exports.global = new Global();
function extend(optionsObj, old) {
    return {
        old: old,
        pauseFocusSelector: optionsObj.pauseFocusSelector
    };
}
exports.extend = extend;
exports.plugin.setup = function () {
    // Add the default option for pauseFocusSelector
    exports.global.options = extend({
        pauseFocusSelector: '.pause-on-focus'
    }, exports.global.options);
    /**
     * Handle the page visiblity change events, like opening a new tab
     * or blurring the current page.
     * @property {springroll.PageVisibility} _pageVisibility
     * @private
     */
    exports.global._pageVisibility = new PageVisibility(exports.onContainerFocus.bind(this), exports.onContainerBlur.bind(this));
    /**
     * Whether the Game is currently "blurred" (not focused) - for pausing/unpausing
     * @property {Boolean} _appBlurred
     * @private
     * @default  false
     */
    exports.global._appBlurred = false;
    /**
     * Always keep the focus on the application iframe
     * @property {Boolean} _keepFocus
     * @private
     * @default  false
     */
    exports.global._keepFocus = false;
    /**
     * Whether the Container is currently "blurred" (not focused) - for pausing/unpausing
     * @property {Boolean} _containerBlurred
     * @private
     * @default  false
     */
    exports.global._containerBlurred = false;
    /**
     * Delays pausing of application to mitigate issues with asynchronous communication
     * between Game and Container
     * @property {int} _focusTimer
     */
    exports.global._focusTimer = null;
    // Focus on the window on focusing on anything else
    // without the .pause-on-focus class
    exports.global._onDocClick = exports.onDocClick.bind(this);
    /**
     * Focus on the iframe's contentWindow
     * @method focus
     */
    exports.global.focus = function () {
        exports.global._containerBlurred = false;
        exports.global._keepFocus = true;
    };
    /**
     * Unfocus on the iframe's contentWindow
     * @method blur
     */
    exports.global.blur = function () {
        exports.global._containerBlurred = true;
    };
    /**
     * Manage the focus change events sent from window and iFrame
     * @method manageFocus
     * @protected
     */
    exports.global.manageFocus = function () {
        // Unfocus on the iframe
        if (this._keepFocus) {
            exports.global.blur();
        }
        // we only need one delayed call, at the end of any
        // sequence of rapidly-fired blur/focus events
        if (this._focusTimer) {
            clearTimeout(this._focusTimer);
        }
        // Delay setting of 'paused' in case we get another focus event soon.
        // Focus events are sent to the container asynchronously, and this was
        // causing rapid toggling of the pause state and related issues,
        // especially in Internet Explorer
        this._focusTimer = setTimeout(function () {
            this._focusTimer = null;
            // A manual pause cannot be overriden by focus events.
            // User must click the resume button.
            if (exports.global._isManualPause)
                return;
            exports.global.paused = exports.global._containerBlurred && exports.global._appBlurred;
            // Focus on the content window when blurring the app
            // but selecting the container
            if (exports.global._keepFocus && !exports.global._containerBlurred && exports.global._appBlurred) {
                exports.global.focus();
            }
        }.bind(this), 100);
    };
    // On elements with the class name pause-on-focus
    // we will pause the game until a blur event to that item
    // has been sent
    var self = this;
};
/**
 * When the document is clicked
 * @method _onDocClicked
 * @private
 * @param  {Event} e Click or focus event
 * @return void - returns nothing
 */
exports.onDocClick = function (e) {
    if (!exports.global.loaded)
        return;
    var target;
    // Firefox support
    if (!e.originalEvent) {
        target = e.originalEvent;
        return;
    }
    else {
        target = e.target;
    }
    if (!target.filter(function (elem) { return elem === exports.global._containerBlurred; }).length) {
        exports.global.focus();
        return false;
    }
};
/**
 * Handle the keep focus event for the window
 * @method onKeepFocus
 * @private
 */
exports.onKeepFocus = function (event) {
    exports.global._keepFocus = !!event.data;
    exports.global.manageFocus();
};
/**
 * Handle focus events sent from iFrame children
 * @method onFocus
 * @private
 */
exports.onFocus = function (e) {
    exports.global._appBlurred = !e.data;
    exports.global.manageFocus();
};
/**
 * Handle focus events sent from container's window
 * @method onContainerFocus
 * @private
 */
exports.onContainerFocus = function (e) {
    exports.global._containerBlurred = false;
    exports.global.manageFocus();
};
/**
 * Handle blur events sent from container's window
 * @method onContainerBlur
 * @private
 */
exports.onContainerBlur = function (e) {
    //Set both container and application to blurred,
    //because some blur events are only happening on the container.
    //If container is blurred because application area was just focused,
    //the application's focus event will override the blur imminently.
    exports.global._containerBlurred = exports.global._appBlurred = true;
    exports.global.manageFocus();
};
exports.plugin.opened = function () {
    exports.global.focus();
};
exports.plugin.close = function () {
    // Stop the focus timer if it's running
    if (exports.global._focusTimer) {
        clearTimeout(exports.global._focusTimer);
    }
};
exports.plugin.teardown = function () {
    delete exports.global._onDocClick;
    if (exports.global._pageVisibility) {
        exports.global._pageVisibility.destroy();
        delete exports.global._pageVisibility;
    }
    delete exports.global.focus;
    delete exports.global.blur;
    delete exports.global.manageFocus;
    delete exports.global._appBlurred;
    delete exports.global._focusTimer;
    delete exports.global._keepFocus;
    delete exports.global._containerBlurred;
};
