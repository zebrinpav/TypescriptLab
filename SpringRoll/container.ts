/**
 * @module Container
 * @namespace springroll
 */

class PageVisibility {
	foo: any;
	bar: any;

	constructor(_foo, _bar){
		this.foo = _foo;
		this.bar = _bar;
	}

	destroy() {
		this.foo = 0;
		this.bar = 0;
	}
}


class Plugin {
	setup(){}
	opened(){}
	close(){}
	teardown(){}
}

class Global {
	_appBlurred: boolean;
	options: any;
	_pageVisibility: any;
	_keepFocus: boolean;
	_containerBlurred: boolean;
	_focusTimer: any;
	_onDocClick: Function;
	focus: Function;
	blur: Function;
	manageFocus: Function;
	_isManualPause: any;
	paused: any;
	loaded: boolean;
	client: any;
}


/**
 * @class Container
 */
export var plugin = new Plugin();
export var global = new Global();

export function extend(optionsObj,old){
	return {
		old: old,
		pauseFocusSelector: optionsObj.pauseFocusSelector
	}
}

plugin.setup = function()
{
	// Add the default option for pauseFocusSelector
	global.options = extend(
		{
			pauseFocusSelector: '.pause-on-focus'
		},
		global.options);

	/**
	 * Handle the page visiblity change events, like opening a new tab
	 * or blurring the current page.
	 * @property {springroll.PageVisibility} _pageVisibility
	 * @private
	 */
	global._pageVisibility = new PageVisibility(
		onContainerFocus.bind(this),
		onContainerBlur.bind(this)
	);

	/**
	 * Whether the Game is currently "blurred" (not focused) - for pausing/unpausing
	 * @property {Boolean} _appBlurred
	 * @private
	 * @default  false
	 */
	global._appBlurred = false;

	/**
	 * Always keep the focus on the application iframe
	 * @property {Boolean} _keepFocus
	 * @private
	 * @default  false
	 */
	global._keepFocus = false;

	/**
	 * Whether the Container is currently "blurred" (not focused) - for pausing/unpausing
	 * @property {Boolean} _containerBlurred
	 * @private
	 * @default  false
	 */
	global._containerBlurred = false;

	/**
	 * Delays pausing of application to mitigate issues with asynchronous communication
	 * between Game and Container
	 * @property {int} _focusTimer
	 */
	global._focusTimer = null;

	// Focus on the window on focusing on anything else
	// without the .pause-on-focus class
	global._onDocClick = onDocClick.bind(this);

	/**
	 * Focus on the iframe's contentWindow
	 * @method focus
	 */
	global.focus = function()
	{
		global._containerBlurred = false;
		global._keepFocus = true;
	};

	/**
	 * Unfocus on the iframe's contentWindow
	 * @method blur
	 */
	global.blur = function()
	{
		global._containerBlurred = true;
	};

	/**
	 * Manage the focus change events sent from window and iFrame
	 * @method manageFocus
	 * @protected
	 */
	global.manageFocus = function()
	{
		// Unfocus on the iframe
		if (this._keepFocus)
		{
			global.blur();
		}

		// we only need one delayed call, at the end of any
		// sequence of rapidly-fired blur/focus events
		if (this._focusTimer)
		{
			clearTimeout(this._focusTimer);
		}

		// Delay setting of 'paused' in case we get another focus event soon.
		// Focus events are sent to the container asynchronously, and this was
		// causing rapid toggling of the pause state and related issues,
		// especially in Internet Explorer
		this._focusTimer = setTimeout(
			function()
			{
				this._focusTimer = null;
				// A manual pause cannot be overriden by focus events.
				// User must click the resume button.
				if (global._isManualPause) return;

				global.paused = global._containerBlurred && global._appBlurred;

				// Focus on the content window when blurring the app
				// but selecting the container
				if (global._keepFocus && !global._containerBlurred && global._appBlurred)
				{
					global.focus();
				}

			}.bind(this),
			100
		);
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
export var onDocClick = function(e)
{
	if (!global.loaded) return;

	var target;

	// Firefox support
	if (!e.originalEvent)
	{
		target = e.originalEvent;
        return;
	}
	else
	{
		target = e.target;
	}
	if (!target.filter(elem => elem === global._containerBlurred).length)
	{
		global.focus();
		return false;
	}
};

/**
 * Handle the keep focus event for the window
 * @method onKeepFocus
 * @private
 */
export var onKeepFocus = function(event)
{
	global._keepFocus = !!event.data;
	global.manageFocus();
};

/**
 * Handle focus events sent from iFrame children
 * @method onFocus
 * @private
 */
export var onFocus = function(e)
{
	global._appBlurred = !e.data;
	global.manageFocus();
};

/**
 * Handle focus events sent from container's window
 * @method onContainerFocus
 * @private
 */
export var onContainerFocus = function(e)
{
	global._containerBlurred = false;
	global.manageFocus();
};

/**
 * Handle blur events sent from container's window
 * @method onContainerBlur
 * @private
 */
export var onContainerBlur = function(e)
{
	//Set both container and application to blurred,
	//because some blur events are only happening on the container.
	//If container is blurred because application area was just focused,
	//the application's focus event will override the blur imminently.
	global._containerBlurred = global._appBlurred = true;
	global.manageFocus();
};



plugin.opened = function()
{
	global.focus();
};

plugin.close = function()
{
	// Stop the focus timer if it's running
	if (global._focusTimer)
	{
		clearTimeout(global._focusTimer);
	}
};

plugin.teardown = function()
{
	delete global._onDocClick;
	if (global._pageVisibility)
	{
		global._pageVisibility.destroy();
		delete global._pageVisibility;
	}
	delete global.focus;
	delete global.blur;
	delete global.manageFocus;
	delete global._appBlurred;
	delete global._focusTimer;
	delete global._keepFocus;
	delete global._containerBlurred;
};


