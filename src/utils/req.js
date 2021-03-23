import NodeVo from '../classes/NodeVo.js';
import { URL_BASE } from './constants.js';
import { resolvePath } from './path.js';

const req = async (uri) => {
  const url = resolvePath(URL_BASE, uri);
  const cached = window.localStorage.getItem(url);

  if (cached !== null) {
    console.log('cached!', url);
    return NodeVo.jsonToVoArray(JSON.parse(cached));
  }

  try {
    const resp = await fetch(url);

    if (resp.status !== 200) {
      throw Error();
    }

    const data = await resp.json();

    // caching
    window.localStorage.setItem(url, JSON.stringify(data));

    return NodeVo.jsonToVoArray(data);
  } catch (err) {
    console.error('Failed to request data');
  }
};

export const reqRoot = () => req('/assets/api/root.json');
export const reqDirectory = (dirName) => req(`/assets/api/${dirName}.json`);
export default {
  reqRoot,
  reqDirectory,
};
