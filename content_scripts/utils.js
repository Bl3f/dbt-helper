const tableRegExp = /(?<prefix>FROM|(?:LEFT|RIGHT|INNER|OUTER)? JOIN) (?<table>[A-Za-z0-9\.\`\'_]+)/gi;

const MODEL = 'model', SOURCE = 'source';

function cleanSQLName(table) {
    return table.replaceAll(/\`/g, "");
}

function findDbtObject(table, models) {
    const cleanedTable = cleanSQLName(table);
    const [name, source] = cleanedTable.split(".").reverse();
    const results = Object.entries(models).filter(([key, model]) => model.schema === source && model.name === name);

    if (results.length === 0) return {}

    const [[key, value]] = results;

    return value;
}

function replaceSQL(text, models) {
    let replacedText = (' ' + text).slice(1);

    const output = replacedText.replace(tableRegExp, (match, p1, p2, offset, string, groups) => {
        const { table, prefix } = groups;
        const dbtObject = findDbtObject(table, models);

        if (dbtObject.resource_type === MODEL) {
            return `${prefix} {{ ref('${dbtObject.name}') }}`
        } else if(dbtObject.resource_type === SOURCE) {
            return `${prefix} {{ source('${dbtObject.schema}', '${dbtObject.name}') }}`
        } else {
            return match;
        }
    });

    return output;
}