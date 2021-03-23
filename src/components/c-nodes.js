import mvvm from '../utils/mvvm.js';
import state from '../state.js';
import NodeVo from '../classes/NodeVo.js';

const html = `
<section m-ref="nodes" @click="clickNode"></section>

<style scoped>
@import url('./src/styles/component.css');
</style>
`;

window.customElements.define(
  'c-nodes',
  class extends mvvm {
    constructor() {
      super({
        html,
        methods: {
          clickNode: ({ target }) => {
            if (target.tagName !== 'C-NODE') {
              return;
            }

            const nodeVo = new NodeVo(target.$data);

            if (nodeVo.type === 'DIRECTORY') {
              state.$methods.changePwd(nodeVo);
            } else if (nodeVo.type === 'FILE') {
              state.$methods.openModal(nodeVo.path);
            } else if (nodeVo.type === 'PREV') {
              state.$methods.gotoPrev();
            }
          },
        },
        mounted: () => {
          state.$watcher.ls.push((oldValue, nodes) => {
            if (state.$data.path.length > 1) {
              nodes.unshift(
                new NodeVo({
                  id: -1,
                  name: '',
                  type: 'PREV',
                  path: null,
                  parentId: null,
                }),
              );
            }

            nodes.forEach((node) => {
              this.$ref.nodes.appendChild(node.genNode());
            });
          });

          state.$watcher.isLoading.push((oldValue, isLoading) => {
            if (isLoading) {
              this.$ref.nodes.innerHTML = '';
            }
          });
        },
      });
    }
  },
);
