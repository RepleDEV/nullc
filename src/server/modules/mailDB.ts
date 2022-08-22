import * as mysql from "mysql";
import { v4 as uuidv4 } from "uuid";
import * as dayjs from "dayjs";

import { mailDB } from "../types/modules";

const stringify = (s: string) => `'${s}'`;

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

	constructor(connectionConfig: mysql.ConnectionConfig) {
		this.connection = mysql.createConnection(connectionConfig);
	}

	async connect() {
		return new Promise<void>((resolve, reject) => {
			this.connection.connect((err) => {
				if (err) return reject(err);
				resolve();
			});
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
		for (let i = 0; i < columns.length; i++) {
			const column = columns[i];

			const columnQuery: string[] = [];
			columnQuery.push(column.name);

			let dataType = column.dataType.name;
			if (column.dataType.size) dataType += `(${column.dataType.size})`;
			columnQuery.push(dataType);

			if (column.auto_increment) columnQuery.push("AUTO_INCREMENT");

			if (column.not_null) columnQuery.push("NOT NULL");

			if (column.unique) columnQuery.push("UNIQUE");

			if (column.primary_key) columnQuery.push("PRIMARY KEY");
			else if (column.foreign_key !== undefined)
				// TODO: Make this more readable, maybe
				columnQuery.push(
					`FOREIGN KEY REFERENCES ${
						Object.keys(column.foreign_key.references)[0]
					}(${Object.values(column.foreign_key.references)[0]})`
				);

			if (column.check) columnQuery.push(`CHECK ${column.check}`);

			if (column.default) columnQuery.push(`DEFAULT "${column.default}"`);

			columnsQuery.push(columnQuery.join(" "));
		}

		const query = `CREATE TABLE IF NOT EXISTS ${name} (${columnsQuery.join(
			", "
		)});`;

		return await this.query(query);
	}

	async selectTable<T = Record<string, unknown>>(
		table_name: string,
		columns?: string[],
		distinct?: boolean,
		where?: string,
		order_by?: string
	): Promise<T[]> {
		const selectQuery = ["SELECT"];
		const columnsQuery =
			columns && columns.length ? columns?.join(", ") : "*";
		if (distinct) selectQuery.push("DISTINCT");
		selectQuery.push(columnsQuery, "FROM", table_name);

		if (where && where.length) selectQuery.push("WHERE", where);
		if (order_by && order_by.length) selectQuery.push("ORDER BY", order_by);

		const selectQueryStr = selectQuery.join(" ") + ";";
		const result = (await this.query(selectQueryStr)) as T[];
		return result;
	}

	cleanApostrophes(v: any) {
		if (typeof v === "string")
			return v.split("").map((s, i, arr) => {
				if (s === "'" && arr[i - 1] !== "\\")
					return "\\'";
				return s;
			}).join("");
		return v;
	}

	async insertInto<T = Record<string, unknown>>(
		table_name: string,
		data: Partial<T>
	) {
		function dataMapHandler(v: unknown) {
			const type = typeof v;
			if (type === "string")
				return stringify(v as string);
			else if (type === "boolean")
				return +(v as boolean);
			return v;
		}

		return await this.query(
			`INSERT INTO ${table_name} ` +
				`(${Object.keys(data).join(", ")}) ` +
				`VALUES (${Object.values(data).map(this.cleanApostrophes).map(dataMapHandler).join(", ")});`
		);
	}

	async query(query: string): Promise<unknown> {
		return new Promise((resolve, reject) => {
			this.connection.query(query, (err, result) => {
				if (err) return reject(err);

				resolve(result);
			});
		});
	}
}

export default class MailDB extends DataBase {
	databaseName: string;
	tableName: string;
	cachedData: mailDB.MailObjectArray;
	cachedIndex: number;

	constructor(databaseName: string, config: mysql.ConnectionConfig) {
		super(config);

		this.databaseName = databaseName;
		this.tableName = "Mail";

		this.cachedData = [];
		this.cachedIndex = 0;
	}

	async checkTableExists(): Promise<boolean> {
		try {
			await this.query(`DESCRIBE ${this.tableName};`);

			return true;
		} catch (e) {
			return false;
		}
	}

	async setup(production = false) {
		if (!production) {
			await super.createDatabase(this.databaseName);
			await super.useDatabase(this.databaseName);
		}

		const tableExists = await this.checkTableExists();
		if (tableExists) {
			const queryRes = (await this.query(
				`DESCRIBE ${this.tableName};`
			)) as Record<string, unknown>[];

			const isOldTable =
				queryRes.filter((v) => v.Field === "tweet").length < 1;
			if (isOldTable)
				await this.query(
					`ALTER TABLE ${this.tableName} ADD COLUMN tweet BOOL DEFAULT 0;`
				);

			return;
		}

		const columns = [
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
			},
			{
				name: "timestamp",
				dataType: { name: "datetime" },
			},
			{
				name: "tweet",
				dataType: { name: "BOOL" },
				default: "0",
			},
		];

		await super.createTable(this.tableName, columns);
	}

	async addMail(author: string, message: string, tweet?: boolean) {
		await super.insertInto<mailDB.MailObject>(this.tableName, {
			uuid: uuidv4(),
			author,
			message,
			timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			tweet,
		});
	}
	async getMail(
		columns?: string[],
		where?: string
	): Promise<mailDB.MailObjectArray> {
		let _where = where || "";
		if (this.cachedIndex > 0)
			_where = `${_where && " AND "}ID>${this.cachedIndex}`;
		const mailTableContents = await this.selectTable<mailDB.MailObject>(
			"Mail",
			columns,
			false,
			_where,
			"ID ASC"
		);

		this.cachedData.push(...mailTableContents);
		this.cachedIndex = this.cachedData[this.cachedData.length - 1].ID;

		return this.cachedData;
	}
}
