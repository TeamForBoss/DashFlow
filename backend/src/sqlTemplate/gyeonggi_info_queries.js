const tableName = `gyeonggi_info`;

const queries = {
    weather: `SELECT id, lat, lon, city_en FROM ${tableName}`,
    accident: `SELECT id, city_en, accident_code FROM ${tableName}`,
    crime: `SELECT id, city_ko FROM ${tableName} WHERE city_en = ?`,
}

module.exports = queries;