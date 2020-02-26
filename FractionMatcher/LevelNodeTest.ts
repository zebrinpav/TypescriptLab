import { dropShapeToZone } from './LevelNode';
import { expect } from 'chai';
import { assert } from 'chai';
import 'mocha';

describe('test0', () => {
	it('test ret', () => {
		let foo = {
			view: undefined,
			dropZone: 100,
			numerator: 1,
			denominator: 3

		}
		const result = dropShapeToZone(foo, 1);	 
		assert.isUndefined(result);
	});
});


describe('test1', () => {
	it('test ret', () => {
		let foo = {
			view: {
				indexShape: 1,
				height: 10,
				moveToFront: function(){

				}
			},
			dropZone: 100,
			numerator: 1,
			denominator: 3

		}
		const result = dropShapeToZone(foo, 1);	 
		assert.isUndefined(result);
	});
});

