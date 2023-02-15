import axios from 'axios';

export default class CustomerService {
    async getCustomersSmall() {
        const res = await axios.get('assets/demo/data/customers-small.json');
        return res.data.data;
    }

    getCustomersMedium() {
        return axios.get('assets/demo/data/customers-medium.json').then((res) => res.data.data);
    }

    getCustomersLarge() {
        return axios.get('assets/demo/data/customers-large.json').then((res) => res.data.data);
    }

    getCustomersXLarge() {
        return axios.get('assets/demo/data/customers-xlarge.json').then((res) => res.data.data);
    }
}
