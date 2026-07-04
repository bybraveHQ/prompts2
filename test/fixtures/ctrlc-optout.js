'use strict';

const prompts = require('../..');

(async () => {
  const res = await prompts({ type: 'text', name: 'v', message: 'q', exitOnCtrlC: false });

  console.log(`RESULT:${JSON.stringify(res)}`);
})();
