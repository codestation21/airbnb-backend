const {parse, join} = require("path");
const {createWriteStream} = require("fs");
const fs = require("fs");


module.exports.readFile = async (file) => {
    const {createReadStream, filename} = await file;
    const stream = createReadStream();
    var {ext, name} = parse(filename);
    name = `airbnb${Math.floor((Math.random() * 10000) + 1)}`;
    let url = join(__dirname, `../Upload/${name}-${Date.now()}${ext}`);
    const iamageStrem = await createWriteStream(url)
    await stream.pipe(iamageStrem);
    const baseUrl = process.env.BASE_URL
    const port = process.env.PORT
    url = `${baseUrl}${port}${url.split('Upload')[1]}`;
    return url;
}
module.exports.deleteFile = async (fileUrl) => {
    let deleteFile = fileUrl.split('\\')[1];
    fs.unlinkSync(join(__dirname, `../Upload/${deleteFile}`));
}

module.exports.multipleReadFile = async (file) => {
    let fileUrl = [];
    for (let i = 0; i < file.length; i++) {
        const {createReadStream, filename} = await file[i];
        const stream = createReadStream();
        var {ext, name} = parse(filename);
        name = `airbnb${Math.floor((Math.random() * 10000) + 1)}`;
        let url = join(__dirname, `../Upload/${name}-${Date.now()}${ext}`);
        const iamageStrem = await createWriteStream(url)
        await stream.pipe(iamageStrem);
        const baseUrl = process.env.BASE_URL
        const port = process.env.PORT
        url = `${baseUrl}${port}${url.split('Upload')[1]}`;
        fileUrl.push({url})
    }
    return fileUrl;
}
module.exports.multipleFileDelete = async (fileUrl) => {
    for (let i = 0; i < fileUrl.length; i++) {
        let deleteFiles = fileUrl[i].url.split('\\')[1];
        fs.unlinkSync(join(__dirname, `../Upload/${deleteFiles}`));
    }
}