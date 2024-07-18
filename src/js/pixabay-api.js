import axios from "axios";

const API_KEY = '44841461-2c7fd944dee0b14672f32444a';

async function fetchImages({ q = '', page = 1, per_page = 15 } = {}) {
    return (await axios.get('https://pixabay.com/api/', {
        params: {
            key: API_KEY,
            q,
            image_type: 'photo',
            orientation: "horizontal",
            safesearch: true,
            page,
            per_page
        }
    })).data
}
export default fetchImages