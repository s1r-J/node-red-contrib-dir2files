/** Absolutely not enough. */
const should = require("should");
const helper = require("node-red-node-test-helper");
const dir2filesNode = require("../dir2files.js");

helper.init(require.resolve('node-red'));

describe('dir2files Node', function () {

    afterEach(function () {
        helper.unload();
    });

    it('should be loaded', function (done) {
        var flow = [{
            id: 'n1',
            type: 'dir2files',
            name: 'dir2files'
        }];
        helper.load(dir2filesNode, flow, function () {
            let n1 = helper.getNode('n1');
            n1.should.have.property('name', 'dir2files');
            done();
        });
    });
});
