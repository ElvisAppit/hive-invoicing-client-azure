import axios from 'axios';

export default class CountryService {
    async getCountries() {
        const res = await axios.get('assets/demo/data/countries.json');
        return res.data.data;
    }
}
