import { plugin, onDocClick, onContainerBlur, onContainerFocus, onKeepFocus, onFocus, global, extend} from './container';
import { expect } from 'chai';
import { assert } from 'chai';
import 'mocha';

describe('test0', () => {
	it('test', () => {
		const result = plugin.setup;	 
		assert.isUndefined(result());
		assert.isFalse(global._appBlurred);
		assert.isFalse(global._keepFocus);
		assert.isFalse(global._containerBlurred);
		assert.isNull(global._focusTimer);
		assert.isDefined(global.focus); 
		assert.isUndefined(global.focus());
		assert.isDefined(global.blur);
		assert.isUndefined(global.blur());
		assert.isDefined(global.manageFocus);
		assert.isUndefined(global.manageFocus());
	});

	it('test', () => {
		const result = plugin.opened;	 
		assert.isDefined(result);
		assert.isUndefined(result());
	});

	it('test', () => {
		const result = plugin.close;	 
		assert.isDefined(result);
		assert.isUndefined(result());
	});

	it('test', () => {
		const result = plugin.teardown;	 
		assert.isUndefined(result());
		assert.isUndefined(global.focus);
		assert.isUndefined(global.blur);
		assert.isUndefined(global.manageFocus);
		assert.isUndefined(global._appBlurred);
		assert.isUndefined(global._focusTimer);
		assert.isUndefined(global._keepFocus);
		assert.isUndefined(global._containerBlurred);
		assert.isUndefined(global._onDocClick);
		assert.isUndefined(global._pageVisibility);
	});

});

describe('test1', () => {
	it('test setup', () => {
		plugin.setup();
		const result = onDocClick;	 
		const foo = { originalEvent: false, target: ["a","b","c"] };
		assert.isDefined(result);
		global.loaded = true;
		assert.isUndefined(result(foo));	
		global.loaded = false;
		assert.isUndefined(result(foo));
	});

});

describe('test2', () => {
	it('test setup', () => {
		const foo = {};
		const result = onContainerBlur(foo);	 
		assert.isUndefined(result);
		assert.isTrue(global._containerBlurred);
		assert.isTrue(global._appBlurred);
	});

});

describe('test3', () => {
	it('test setup', () => {
		plugin.setup();
		const foo = {};
		const result = onContainerFocus(foo);	 
		assert.isFalse(global._containerBlurred);
		assert.isUndefined(result);
	});

});

describe('test4', () => {
	it('test setup', () => {
		plugin.setup();
		let foo = {
			data: true
		}
		const result = onFocus(foo);	 
		assert.isFalse(global._appBlurred);
		foo.data = false;
		assert.isUndefined(onFocus(foo));
		assert.isTrue(global._appBlurred);
	});
});

describe('test5', () => {
	it('test setup', () => {
		plugin.setup();
		let foo = {
			data: true
		};
		const result = onKeepFocus(foo);	 
		assert.isTrue(global._keepFocus);
		foo.data = false;
		assert.isUndefined(onKeepFocus(foo));
		assert.isFalse(global._keepFocus);
	});

});

describe('test6', () => {
	it('test extend', () => {
		let bar = {};
		let foo = {pauseFocusSelector: "test"}
		const result = extend(foo, bar);	 
		assert.isDefined(result.old);
		assert.isDefined(result.pauseFocusSelector);
	});

});

