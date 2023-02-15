import axios from 'axios';

export default class EventService {
    async getEvents() {
        const res = await axios.get('assets/demo/data/events.json');
        return res.data.data;
    }
}
