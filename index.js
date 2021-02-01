require('dotenv').config();
const axios = require('axios').default;
const fs = require('fs');

const BASE_URL = process.env.BASE_URL;
let currentStr = '';
let count = 0;

const fetchData = async (name = '') => {
    try {
        return await axios.post(`${BASE_URL}${name}`)
    } catch (error) {
        console.error(error)
    }
}

const writeToFile = () => {
    console.log(currentStr);
    console.log('total files scanned', count++)
    fs.appendFileSync('scrapped.txt', currentStr, (err) => {
        if (err)
            console.log(err);
    })
}

const saveCateogoryData = async (name) => {
    const categoryData = await fetchData(`${name}/`);
    if (categoryData.data.files) {
        categoryData.data.files.map(item => {
            currentStr = `${name}/${item.name}$`;
            writeToFile();
        });
    }

}

const startScrapping = async () => {
    const categories = await fetchData();
    if (categories.data) {
        const categoryList = categories.data.files;
        categoryList.forEach(item => {
            if (item.name !== 'snapchats' || item.name !== 'Celebrity')
                saveCateogoryData(item.name);
        })
    };
}

Promise.all([
    startScrapping()
])
    .then(value = () => {
        // writeToFile()
    });

