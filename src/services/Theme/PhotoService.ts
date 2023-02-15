import axios from 'axios';

export default class PhotoService {
    async getImages() {
        const res = await axios.get('assets/demo/data/photos.json');
        return res.data.data;
    }
}
