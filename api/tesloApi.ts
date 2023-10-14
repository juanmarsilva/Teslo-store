

import axios from "axios";

const TesloApi = axios.create({
    baseURL: '/api'
});

export default TesloApi;