import { charCoords } from './main';
import { hidePreview } from './main';
import { positionPreview } from './main';
import { showPreview } from './main';
import { queryPreviewProviders } from './main';
import { expect } from 'chai';
import { assert } from 'chai';
import 'mocha';

describe('test0', () => {
	it('test ret', () => {
		const result = hidePreview();	 
		assert.isUndefined(result);
	});

});


describe('test1', () => {
	it('test ret ', () => {
		let foo = {
			charCoords: function(b){
				return {
					x: b,
					left: 15,
					y: undefined,
					top: 200,
					ybot: 12
				}
			}
		};

		const result = charCoords(foo, 100);
		expect(result).to.have.lengthOf(3);
	});
});

describe('test2', () => {
	it('test ret', () => {
		const result = positionPreview(100,200,300);	 
		assert.isUndefined(result);
	});

});

describe('test3', () => {
	it('test ret', () => {
		const result = showPreview(undefined,100,200,300);	 
		assert.equal(result, 1);
	});

});

describe('test4', () => {
	it('test ret', () => {
		let foo = {
			_codeMirror: {
				charCoords: function(b){
					return {
						x: 200,
						left: b,
						y: undefined,
						top: 200,
						ybot: 12
					}
				}
			},
			
			getRootElement: function(){
				return {
					width: function(){
						return 42;
					}
				}
			}
		};

		let bar = {
			line: 10,
			ch: 4 
		};

		let foo_bar = "magenta";
		const result = queryPreviewProviders(foo,bar,undefined,foo_bar,10);	 
		assert.equal(result, 1);
	});
});
