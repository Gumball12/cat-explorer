import mvvm from './utils/mvvm.js';
import state from './state.js';

import './components/c-breadcrumbs.js';
import './components/c-header.js';
import './components/c-nodes.js';
import './components/c-modal.js';

const html = `
<c-header></c-header>

<main>
  <c-breadcrumbs></c-breadcrumbs>
  <c-nodes></c-nodes>
</main>

<c-modal></c-modal>

<style scoped>
@import url('./src/styles/component.css');

:host {
  display: flex;
  flex-direction: column;
  height: 100%;
}

c-header {
  margin-bottom: 12px;
}

c-breadcrumbs {
  margin-bottom: 12px;
}

main {
  height: 100%;
  background-color: #fff;
  border: 2px solid #ccc;
  padding: 12px;
}
</style>
`;

window.customElements.define(
  'cat-app',
  class extends mvvm {
    constructor() {
      super({
        html,
        mounted: () => {
          state.$methods.init();
        },
      });
    }
  },
);
