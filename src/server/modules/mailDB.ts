import * as mysql from "mysql";

import { v4 as uuidv4 } from "uuid";

interface SQLColumnDataType {
    name: string;
    size?: number;
}
interface SQLColumnType {
    name: string;
    dataType: SQLColumnDataType;
    auto_increment?: boolean;
    not_null?: boolean;
    unique?: boolean;
    primary_key?: boolean;
    foreign_key?: {
        references: {
            [key: string]: string;
        };
    };
    check?: string;
    default?: string;
}
export class DataBase {
    connection: mysql.Connection;
    connected: boolean;

    constructor(connectionConfig: mysql.ConnectionConfig) {
        this.connection = mysql.createConnection(connectionConfig);
        this.connected = false;

        this.connection.connect((err) => {
            if (err)
                throw err;
            this.connected = true;
        });
    }

    async createDatabase(name: string): Promise<unknown> {
        return await this.query(`CREATE DATABASE IF NOT EXISTS ${name};`);
    }
    
    async useDatabase(name: string) {
        return await this.query(`USE ${name};`);
    }
    
    async createTable(name: string, columns: SQLColumnType[]) {
        const columnsQuery: string[] = [];
        for (let i = 0;i < columns.length;i++) {
            const column = columns[i];

            const columnQuery: string[] = [];
            columnQuery.push(column.name);

            let dataType = column.dataType.name;
            if (column.dataType.size)
                dataType += `(${column.dataType.size})`;
            columnQuery.push(dataType);

            if (column.auto_increment)
                columnQuery.push("AUTO_INCREMENT");

            if (column.not_null)
                columnQuery.push("NOT NULL");
            
            if (column.unique)
                columnQuery.push("UNIQUE");
            
            if (column.primary_key)
                columnQuery.push("PRIMARY KEY");
            else if (column.foreign_key !== undefined)
                // TODO: Make this more readable, maybe
                columnQuery.push(`FOREIGN KEY REFERENCES ${Object.keys(column.foreign_key.references)[0]}(${Object.values(column.foreign_key.references)[0]})`);
            
            if (column.check)
                columnQuery.push(`CHECK ${column.check}`);
            
            if (column.default)
                columnQuery.push(`DEFAULT "${column.default}"`);
            
            columnsQuery.push(columnQuery.join(" "));
        }

        const query = `CREATE TABLE IF NOT EXISTS ${name} (${columnsQuery.join(", ")});`;

        return await this.query(query);
    }

    async insertInto(table_name: string, data: Record<string, unknown>) {
        return await this.query(
            `INSERT INTO ${table_name} ` +
            `(${Object.keys(data).join(", ")}) ` + 
            `VALUES (${Object.values(data).join(", ")});`
        );
    }

    async query(query: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, result) => {
                if (err)
                    return reject(err);
                
                resolve(result);
            });
        });
    }
}

export default class MailDB extends DataBase {
    databaseName: string;
    tableName: string;
    constructor(databaseName: string, config: mysql.ConnectionConfig) {
        super(config);

        this.databaseName = databaseName;
        this.tableName = "Mail";
    }

    async setup() {
        await super.createDatabase(this.databaseName);
        await super.useDatabase(this.databaseName);
        await super.createTable(this.tableName, [
            {
                name: "ID",
                dataType: { name: "int" },
                auto_increment: true,
                not_null: true,
                unique: true,
            },
            {
                name: "uuid",
                dataType: { name: "char", size: 36 },
                primary_key: true,
            },
            {
                name: "author",
                dataType: { name: "varchar", size: 255 },
            },
            {
                name: "message",
                dataType: { name: "text" },
            }
        ]);
    }

    async addMail(author: string, message: string) {
        await super.insertInto(this.tableName, {
            uuid: `"${uuidv4()}"`,
            author: `"${author}"`,
            message: `"${message}"`
        });
    }
}