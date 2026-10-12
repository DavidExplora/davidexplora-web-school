const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('planner choices do not alter the independent map selection', () => {
  const button = (destination, pressed='false') => ({
    dataset:{destination},attrs:{'aria-pressed':pressed},events:{},
    classList:{toggle(){}},addEventListener(name,fn){this.events[name]=fn;},
    setAttribute(name,value){this.attrs[name]=value;}
  });
  const safari=button('safari'),mountain=button('kilimanjaro'),map=button('serengeti','true');
  const document={body:{classList:{add(){}}},querySelector:()=>null,getElementById:()=>null,addEventListener(){},
    querySelectorAll:selector=>selector==='.planner-options button'||selector==='.planner-options [data-destination]'?[safari,mountain]:selector==='[data-destination]'?[safari,mountain,map]:[]};
  const window={DavidJourney:require('../journey.js'),matchMedia:()=>({matches:false})};
  vm.runInNewContext(fs.readFileSync('script.js','utf8'),{window,document});
  safari.events.click();
  assert.equal(safari.attrs['aria-pressed'],'true');
  assert.equal(mountain.attrs['aria-pressed'],'false');
  assert.equal(map.attrs['aria-pressed'],'true');
});
