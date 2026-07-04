'use strict';

const readline = require('readline');
const { action } = require('../util');
const EventEmitter = require('events');
const { beep, cursor } = require('sisteransi');
const color = require('kleur');

/**
 * Base prompt skeleton
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {Boolean} [opts.exitOnCtrlC] Re-raise SIGINT after cleanup when the prompt is aborted with Ctrl+C (default true)
 */
class Prompt extends EventEmitter {
  constructor(opts={}) {
    super();

    this.firstRender = true;
    this.in = opts.stdin || process.stdin;
    this.out = opts.stdout || process.stdout;
    this.onRender = (opts.onRender || (() => void 0)).bind(this);
    this.exitOnCtrlC = opts.exitOnCtrlC !== false;
    const rl = readline.createInterface({ input:this.in, escapeCodeTimeout:50 });
    readline.emitKeypressEvents(this.in, rl);

    if (this.in.isTTY) this.in.setRawMode(true);
    const isSelect = [ 'SelectPrompt', 'MultiselectPrompt' ].indexOf(this.constructor.name) > -1;
    const keypress = (str, key) => {
      let a = action(key, isSelect);
      if (a === false) {
        this._ && this._(str, key);
      } else if (typeof this[a] === 'function') {
        this[a](key);
      } else {
        this.bell();
      }
    };

    const closeImpl = () => {
      this.out.write(cursor.show);
      if (this.in.isTTY) this.in.setRawMode(false);
      rl.close();
      this.emit(this.aborted ? 'abort' : this.exited ? 'exit' : 'submit', this.value);
      this.closed = true;

      // The prompt was aborted with Ctrl+C: now that the terminal is restored,
      // re-raise SIGINT so the process terminates (or the app's own SIGINT
      // handler runs) — the default expectation for Ctrl+C in a CLI
      if (this.hitCtrlC && this.exitOnCtrlC) {
        process.kill(process.pid, 'SIGINT');
      }
    };

    this.close = () => {
      if (this.closing) return;
      this.closing = true;

      // Detach input handling synchronously so no further keypresses are
      // processed, but run the actual teardown on the next event-loop turn:
      // tearing the readline interface down from inside its own keypress
      // event leaves stdin in a state that keeps the process alive forever
      // (upstream #87)
      this.in.removeListener('keypress', keypress);
      setImmediate(closeImpl);
    };

    this.in.on('keypress', keypress);
  }

  sigint(key) {
    this.hitCtrlC = true;
    this.abort(key);
  }

  fire() {
    this.emit('state', {
      value: this.value,
      aborted: !!this.aborted,
      exited: !!this.exited
    });
  }

  bell() {
    this.out.write(beep);
  }

  render() {
    this.onRender(color);
    if (this.firstRender) this.firstRender = false;
  }
}

module.exports = Prompt;
