var assert = require('assert')
var vows = require('vows')
var rdfjsonify = require('../')


function convert(jsonObj, namespaces) {
    return rdfjsonify.translateNamespaces(jsonObj, namespaces)
}

function hasJson(json) {
    return function (result) {
      assert.equal(JSON.stringify(result), JSON.stringify(json));
    };
}

function doesntChange(json) {
    return {
        topic: convert(json), 'json should not be modified': hasJson(json)
      }
}

vows.describe('translation').addBatch({

    'When there are no namespaces defined': 
        [ 
          doesntChange({})
          ,
          doesntChange({ 
              'http://example.com/my-subject' : {} 
          })
          ,
          doesntChange({
              'http://example.com/my-subject' : { 
                  'http://example.com/myPredicate' : [] 
              } 
          })
          ,
          doesntChange({ 
              'http://example.com/my-subject' : { 
                  'http://example.com/myPredicate' : [
                      { type: 'uri', value: 'http://example.com/myvalue'}                   
                  ] 
              }
          })
          ,
          doesntChange({ 
              'http://example.com/my-subject' : { 
                  'http://example.com/myPredicate' : [
                      { type: 'literal', value: 'hello'}         
                  ] 
              }
          })
        ]
    ,

    'When I specify a namespace': {
        topic: convert(
            {
                'http://example.com/my-subject' : { 
                      'http://demo.com/myPredicate' : [
                          { type: 'uri', value: 'http://demo.com/myvalue'},
                          { type: 'literal', value: 'hello'}                          
                      ] 
                  } 
            }
            , 
            { 'ns1': 'http://example.com/' }
        ),
        'subjects should be transformed' : function(result) {
            assert.isUndefined(result['http://example.com/my-subject'])
            assert.isTrue(result['ns1_my-subject'] != undefined)
            assert.deepEqual(result['ns1_my-subject'], { 
                      'http://demo.com/myPredicate' : [
                          { type: 'uri', value: 'http://demo.com/myvalue'},
                          { type: 'literal', value: 'hello'}                          
                      ] 
                  })
        }
    }
    ,
    
    'When I specify a namespace multiple namespaces': {
        topic: convert(
            {
                'http://example.com/my-subject' : { 
                      'http://demo.com/myPredicate' : [
                          { type: 'uri', value: 'http://demo.com/myvalue'},
                          { type: 'literal', value: 'hello'}                          
                      ] 
                  } 
            }
            , 
            { 'ns1': 'http://example.com/', ns2: 'http://demo.com/' }
        ),
    'predicates and values should be transformed' : function(result) {
            assert.deepEqual(result, {
                'ns1_my-subject' : { 
                      'ns2_myPredicate' : [
                          { type: 'uri', value: 'ns2_myvalue'},
                          { type: 'literal', value: 'hello'}                          
                      ] 
                  } 
            })
        }
    }

}).export(module);
