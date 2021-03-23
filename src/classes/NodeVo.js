import '../components/c-node.js';

class NodeVo {
  id;
  name;
  type;
  path;
  parentId;

  constructor({ id, name, type, path, parentId }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.path = path;
    this.parentId = parentId;
  }

  genNode() {
    const cNode = document.createElement('c-node');

    cNode.setAttribute('m-data-id', this.id);
    cNode.setAttribute('m-data-name', this.name);
    cNode.setAttribute('m-data-type', this.type);
    cNode.setAttribute('m-data-path', this.path);
    cNode.setAttribute('m-data-parent-id', this.parentId);

    return cNode;
  }

  static jsonToVoArray(datas) {
    return datas.map((data) => new NodeVo(data));
  }
}

export default NodeVo;
