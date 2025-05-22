function parseFormFields(fieldsArray) {
    const parsed = {};
    for (const field of fieldsArray) {
        parsed[field.label] = Array.isArray(field.value) ? field : field.value;
    }
    return parsed;
}

module.exports = { parseFormFields };
