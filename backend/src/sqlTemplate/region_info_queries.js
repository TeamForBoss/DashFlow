const tableName = `region_info`;

const queries = {
    weather: `SELECT id, lat, lon, city_en, sido_ko FROM ${tableName}`,
    accident: `SELECT id, city_en, sido_code, gugun_code , sido_ko FROM ${tableName}`,
    crime: `SELECT id, city_ko, sido_ko FROM ${tableName} WHERE city_en = ?`,
}

module.exports = queries;