import mvvm from '../utils/mvvm.js';

const html = `
<article m-attr-node-id="id">
  <img m-ref="img">
  <p m-prop-text-content="name"></p>
</article>

<style scoped>
@import url('./src/styles/component.css');
@import url('./src/styles/typo.css');

:host {
  display: inline-block;
  margin-left: 4px;
  margin-right: 4px;
}

article {
  padding: 4px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #000;
}
</style>
`;

window.customElements.define(
  'c-node',
  class extends mvvm {
    constructor() {
      super({
        html,
        data: {
          id: 0,
          name: '',
          type: '',
          path: null,
          parentId: null,
        },
        watch: {
          type: [
            (oldValue, type) => {
              if (type === 'FILE') {
                this.$ref.img.src = './assets/image/icons/file.png';
              } else if (type === 'DIRECTORY') {
                this.$ref.img.src = './assets/image/icons/directory.png';
              } else if (type === 'PREV') {
                this.$ref.img.src = './assets/image/icons/prev.png';
              } else {
                console.error('node type error');
              }
            },
          ],
        },
      });
    }
  },
);
