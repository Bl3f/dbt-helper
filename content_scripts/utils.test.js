describe('[utils.js] — cleanSQLName', function () {
    it('simple cleaning backtick', () => {
        expect(cleanSQLName("`project`.`gcs`.`table`")).toBe("project.gcs.table");
        expect(cleanSQLName("`project.gcs.table`")).toBe("project.gcs.table");
        expect(cleanSQLName("project.gcs.table")).toBe("project.gcs.table");
    });
});

describe('[utils.js] — findDbtObject', function () {
    it('find dbt object with one source', () => {
        const sources = {
            table: {
                relation_name: "table",
                name: "table",
                identifier: "table",
                schema: "gcs",
                resource_type: "source"
            }
        }
        const object = findDbtObject("`project`.`gcs`.`table`", sources);
        expect(object).toEqual(sources.table);
    });

    it('find dbt object with 2 similar sources', () => {
        const sources = {
            table: {
                relation_name: "table",
                name: "table",
                identifier: "table",
                schema: "gcs",
                resource_type: "source"
            },
            another_table: {
                relation_name: "another_table",
                name: "another_table",
                identifier: "another_table",
                schema: "gcs",
                resource_type: "source"
            }
        }
        const object = findDbtObject("`project`.`gcs`.`table`", sources);
        expect(object).toEqual(sources.table);
    });

    it('dont find the table', () => {
        const sources = {
            table: {
                relation_name: "table",
                name: "table",
                identifier: "table",
                schema: "gcs",
                resource_type: "source"
            },
            another_table: {
                relation_name: "another_table",
                name: "another_table",
                identifier: "another_table",
                schema: "gcs",
                resource_type: "source"
            }
        }
        const object = findDbtObject("`project`.`gcs`.`not_found`", sources);
        expect(object).toEqual({});
    });
});

describe('[utils.js] — replaceSQL', function () {
    it('super simple test with easy char', () => {
        const input = "SELECT * FROM gcs.table";
        const output = "SELECT * FROM {{ source('gcs', 'table') }}";
        const sources = {
            table: {
                relation_name: "table",
                name: "table",
                identifier: "table",
                schema: "gcs",
                resource_type: "source"
            }
        }
        expect(replaceSQL(input, sources)).toBe(output);
    });

    it('simple replace (1 occurrence)', () => {
        const input = "SELECT * FROM `project`.`gcs`.`table`";
        const output = "SELECT * FROM {{ source('gcs', 'table') }}";
        const sources = {
            table: {
                relation_name: "`project`.`gcs`.`table`",
                name: "table",
                identifier: "table",
                schema: "gcs",
                resource_type: "source"
            }
        }
        expect(replaceSQL(input, sources)).toBe(output);
    });

    it('replace with a inner join', () => {
        const input = "SELECT * FROM `project`.`gcs`.`table` INNER JOIN `project`.`gcs`.`second_table`";
        const output = "SELECT * FROM {{ source('gcs', 'table') }} INNER JOIN {{ source('gcs', 'second_table') }}";
        const sources = {
            table: {
                relation_name: "`project`.`gcs`.`table`",
                name: "table",
                identifier: "table",
                schema: "gcs",
                resource_type: "source"
            },
            second_table: {
                relation_name: "`project`.`gcs`.`second_table`",
                name: "second_table",
                identifier: "second_table",
                schema: "gcs",
                resource_type: "source"
            }
        }
        expect(replaceSQL(input, sources)).toBe(output);
    });

    it('replace twice the same table', () => {
        const input = "SELECT * FROM `project`.`gcs`.`table` INNER JOIN `project`.`gcs`.`table`";
        const output = "SELECT * FROM {{ source('gcs', 'table') }} INNER JOIN {{ source('gcs', 'table') }}";
        const sources = {
            table: {
                relation_name: "`project`.`gcs`.`table`",
                name: "table",
                identifier: "table",
                schema: "gcs",
                resource_type: "source"
            },
            second_table: {
                relation_name: "`project`.`gcs`.`second_table`",
                name: "second_table",
                identifier: "second_table",
                schema: "gcs",
                resource_type: "source"
            }
        }
        expect(replaceSQL(input, sources)).toBe(output);
    });

    it('simple replace but a ref', () => {
        const input = "SELECT * FROM `project`.`gcs`.`table`";
        const output = "SELECT * FROM {{ ref('table') }}";
        const sources = {
            table: {
                relation_name: "`project`.`gcs`.`table`",
                name: "table",
                schema: "gcs",
                resource_type: "model"
            }
        }
        expect(replaceSQL(input, sources)).toBe(output);
    });
});
