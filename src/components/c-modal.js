import mvvm from '../utils/mvvm.js';
import state from '../state.js';
import { HOST } from '../utils/constants.js';
import { resolvePath } from '../utils/path.js';

const html = `
<article @click="clickArticle">
  <img m-prop-src="src">
</article>

<style scoped>
@import url('./src/styles/component.css');

:host {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
}

:host(.display) {
  display: block;
}

article {
  height: 100%;
  text-align: center;
}

img {
  height: 100%;
}
</style>
`;

window.customElements.define(
  'c-modal',
  class extends mvvm {
    constructor() {
      super({
        html,
        data: {
          src: '',
        },
        methods: {
          closeModal: () => {
            this.classList.remove('display');
          },
          clickArticle: ({ target: { tagName } }) => {
            if (tagName === 'ARTICLE') {
              this.$methods.closeModal();
            }
          },
        },
        mounted: () => {
          state.$watcher.isModal.push((oldValue, isModal) => {
            if (isModal) {
              this.$data.src = resolvePath(HOST, state.$data.modalImgSrc);
              this.classList.add('display');
            }
          });

          window.addEventListener('keydown', ({ code }) => {
            if (code === 'Escape') {
              this.$methods.closeModal();
            }
          });
        },
      });
    }
  },
);
