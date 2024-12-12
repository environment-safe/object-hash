/* global describe:false */
import { chai } from '@environment-safe/chai';
import { it } from '@open-automaton/moka';
import { hash } from '../src/index.mjs';
const should = chai.should();

describe('module', ()=>{
    describe('performs a simple test suite', async ()=>{
        it('hashes an object', async ()=>{
            const hashed = await hash({foo: 'bar'});
            should.exist(hashed);
        });
        
        it('rejects 2 similar objects', async ()=>{
            should.exist({});
            const hashed1 = await hash({
                foo: 'bar',
                baz: 'bat',
                groo: [
                    10, 1, 5, 8
                ]
            });
            const hashed2 = await hash({
                foo: 'stu',
                baz: 'boo',
                groo: [
                    0, 12, 65, 3
                ]
            });
            hashed1.should.not.equal(hashed2);
        });
        
        it('accept 2 similar objects w/o values', async ()=>{
            should.exist({});
            const hashed1 = await hash({
                foo: 'bar',
                baz: 'bat',
                groo: [
                    10, 1, 5, 8
                ]
            }, {excludeValues: true});
            const hashed2 = await hash({
                foo: 'stu',
                baz: 'boo',
                groo: [
                    0, 12, 65, 3
                ]
            }, {excludeValues: true});
            hashed1.should.equal(hashed2);
        });
    });
});

