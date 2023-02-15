import axios from 'axios';

export default class NodeService {
    async getTreeTableNodes() {
        const res = await axios.get('assets/demo/data/treetablenodes.json');
        return res.data.root;
    }

    async getTreeNodes() {
        const res = await axios.get('assets/demo/data/treenodes.json');
        return res.data.root;
    }
}
