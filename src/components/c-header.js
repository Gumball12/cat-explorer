import mvvm from '../utils/mvvm.js';

const html = `
<header>
  <h1>고양이 탐색기</h1>
</header>

<style scoped>
@import url('./src/styles/component.css');
@import url('./src/styles/typo.css');

h1 {
  text-align: center;
}
</style>
`;

window.customElements.define(
  'c-header',
  class extends mvvm {
    constructor() {
      super({
        html,
      });
    }
  },
);
