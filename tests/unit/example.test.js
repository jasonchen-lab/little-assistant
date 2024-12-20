const { functionToTest } = require('../../services/example');

describe('Example Test Suite', () => {
    beforeEach(() => {
        // 每个测试前的准备工作
    });

    afterEach(() => {
        // 每个测试后的清理工作
    });

    test('should do something', () => {
        const input = 'test';
        const result = functionToTest(input);
        expect(result).toBe('expected output');
    });
}); 