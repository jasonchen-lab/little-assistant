const fs = require('fs').promises;
const path = require('path');

// 清理测试数据
async function cleanTestData() {
    const testConfigPath = path.join(__dirname, '../data/test-settings.json');
    try {
        await fs.unlink(testConfigPath);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
}

// 创建测试数据
async function createTestData(data) {
    const testConfigPath = path.join(__dirname, '../data/test-settings.json');
    await fs.writeFile(testConfigPath, JSON.stringify(data, null, 2));
}

module.exports = {
    cleanTestData,
    createTestData
}; 