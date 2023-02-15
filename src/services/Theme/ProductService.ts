import axios from 'axios';
export default class ProductService {
    async getProductsSmall() {
        const res = await axios.get('assets/demo/data/products-small.json');
        return res.data.data;
    }

    async getProducts() {
        const res = await axios.get('assets/demo/data/products.json');
        return res.data.data;
    }

    async getProductsMixed() {
        const res = await axios.get('assets/demo/data/products-mixed.json');
        return res.data.data;
    }

    async getProductsWithOrdersSmall() {
        const res = await axios.get('assets/demo/data/products-orders-small.json');
        return res.data.data;
    }
}
