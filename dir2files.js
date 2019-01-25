module.exports = function (RED) {

    const FS = require('fs-extra');
    const PATH = require('path');

    function Dir2FilesNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {

            const dirname = config.dirname || msg.dirname || './';
            const regex = new RegExp(config.pathRegex || msg.pathRegex || '.*');
            let isRecursive = config.isRecursive;
            if (!(msg.isRecursive === null || msg.isRecursive === void 0)) {
                isRecursive = msg.isRecursive;
            }
            let findDir = config.findDir;
            if (!(msg.findDir === null || msg.findDir === void 0)) {
                findDir = msg.findDir;
            }
            let isArray = config.isArray;
            if (!(msg.isArray === null || msg.isArray === void 0)) {
                isArray = msg.isArray;
            }

            let filenames = [];
            const readTopDirSync = ((dirname) => {
                let items = FS.readdirSync(dirname);
                items = items.map((itemname) => {
                    return PATH.join(dirname, itemname);
                });
                items.forEach((itempath) => {
                    if (FS.statSync(itempath).isFile() && !findDir && regex.test(itempath)) {
                        filenames.push(itempath);
                    }
                    if (FS.statSync(itempath).isDirectory()) {
                        if (findDir && regex.test(itempath)) {
                            filenames.push(itempath);
                        }
                        if (isRecursive) {
                            readTopDirSync(itempath);
                        }
                    }
                });
            });
            readTopDirSync(dirname);

            if (isArray) {
                msg.payload = filenames;
                node.send(msg);
            } else {
                const lastIndex = filenames.length - 1;
                for (let i = 0; i < lastIndex; i++) {
                    msg.payload = filenames[i];
                    node.send(msg);
                }

                msg.payload = (filenames[lastIndex] === void 0 ? '' : filenames[lastIndex]);
                node.send(msg);
            }
        });
    }

    RED.nodes.registerType('dir2files', Dir2FilesNode);
}
