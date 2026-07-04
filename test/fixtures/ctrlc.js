'use strict';

const prompts = require('../..');

(async () => {
  const res = await prompts({ type: 'text', name: 'v', message: 'q' });

  console.log(`RESULT:${JSON.stringify(res)}`);
})();
