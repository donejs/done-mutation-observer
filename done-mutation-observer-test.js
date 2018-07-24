import QUnit from 'steal-qunit';
import plugin from './done-mutation-observer';

QUnit.module('done-mutation-observer');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the done-mutation-observer plugin');
});
