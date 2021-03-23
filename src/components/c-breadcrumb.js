import state from '../state.js';
import mvvm from '../utils/mvvm.js';

const html = `
<span m-prop-text-content="name" @click="gotoPath"></span>

<style scoped>
@import url('./src/styles/typo.css');

:host {
  display: inline-block;
}

:host(.link) span {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>
`;

window.customElements.define(
  'c-breadcrumb',
  class extends mvvm {
    constructor() {
      super({
        html,
        data: {
          name: '',
          id: '',
          isLastChild: false,
        },
        methods: {
          gotoPath: () => {
            if (!this.$data.isLastChild) {
              state.$methods.gotoPathId(this.$data.id);
            }
          },
        },
        mounted: () => {
          if (!this.$data.isLastChild) {
            this.classList.add('link');
          }
        },
      });
    }
  },
);
