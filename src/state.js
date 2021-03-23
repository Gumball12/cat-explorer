import NodeVo from './classes/NodeVo.js';
import mvvm from './utils/mvvm.js';
import { reqRoot, reqDirectory } from './utils/req.js';

window.customElements.define(
  'mvvm-state-component',
  class extends mvvm {
    constructor() {
      super({
        html: '',
        data: {
          // state
          isLoading: false,
          isModal: false,

          // location
          ls: [], // [NodeVo]
          path: [], // [NodeVo]
          pwd: null, // NodeVo

          // data
          modalImgSrc: '',
        },
        methods: {
          init: () => {
            // set root pwd
            this.$methods.changePwd(
              new NodeVo({
                id: '0',
                name: 'root',
                type: 'DIRECTORY',
                path: null,
                parentId: null,
              }),
            );
          },
          gotoPrev: () => {
            // update path
            this.$data.path = this.$data.path.slice(0, -1);

            // set parmas
            const parentNodeVo = this.$data.path.pop();

            // update pwd
            this.$methods.changePwd(parentNodeVo);
          },
          gotoPathId: (id) => {
            // set params
            const pathIndex = this.$data.path.findIndex(({ id: pathId }) => pathId === id);
            const targetNodeVo = this.$data.path[pathIndex];

            // update path
            this.$data.path = this.$data.path.slice(0, pathIndex);

            // update pwd
            this.$methods.changePwd(targetNodeVo);
          },
          changePwd: async (nodeVo) => {
            this.$data.isLoading = true;

            // set pwd
            this.$data.pwd = nodeVo;

            // update path
            this.$data.path = [...this.$data.path, nodeVo];

            // update ls
            if (nodeVo.name === 'root') {
              this.$data.ls = await reqRoot();
            } else {
              this.$data.ls = await reqDirectory(nodeVo.name);
            }

            this.$data.isLoading = false;
          },
          openModal: (src) => {
            this.$data.modalImgSrc = src;
            this.$data.isModal = true;
          },
          closeModal: () => {
            this.$data.isModal = false;
          },
        },
      });
    }
  },
);

const state = document.createElement('mvvm-state-component');
document.body.appendChild(state);

export default state;
