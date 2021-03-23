import mvvm from '../utils/mvvm.js';
import state from '../state.js';

import './c-breadcrumb.js';

const html = `
<nav m-ref="crumbs"></nav>

<style scoped>
@import url('./src/styles/component.css');

:host {
  border-bottom: 1px solid #000;
  padding-bottom: 2px;
}

c-breadcrumb::after {
  content: '>';
}

c-breadcrumb:last-child::after {
  content: '';
}
</style>
`;

window.customElements.define(
  'c-breadcrumbs',
  class extends mvvm {
    constructor() {
      super({
        html,
        mounted: () => {
          state.$watcher.path.push((oldValue, nodes) => {
            nodes.forEach((node, ind) => {
              const breadcrumb = document.createElement('c-breadcrumb');
              breadcrumb.setAttribute('m-data-name', node.name);
              breadcrumb.setAttribute('m-data-id', node.id);

              // last child
              if (ind === nodes.length - 1) {
                breadcrumb.setAttribute('m-data-is-last-child', true);
              }

              this.$ref.crumbs.appendChild(breadcrumb);
            });
          });

          state.$watcher.isLoading.push((oldValue, isLoading) => {
            if (isLoading) {
              this.$ref.crumbs.innerHTML = '';
            }
          });
        },
      });
    }
  },
);
