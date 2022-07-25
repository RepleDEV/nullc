const path = require("path");
const nodeExternals = require("webpack-node-externals");

const devMode = process.env.NODE_ENV != "production";

const serverConfig = {
	mode: devMode ? "development" : "production",
	entry: "./src/server/server-starter.ts",
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: "ts-loader",
				exclude: /node_modules/,
				options: {
					configFile: "tsconfig.server.json",
				},
			},
		],
	},
	resolve: {
		extensions: [".ts"],
	},
	output: {
		filename: "server.js",
		path: path.resolve(__dirname, "dist"),
	},
	target: "node",
	node: {
		__dirname: false,
	},
	externals: [nodeExternals()],
};

const clientConfig = {
	mode: devMode ? "development" : "production",
	entry: "./src/client/index.tsx",
	devtool: devMode ? "inline-source-map" : false,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				exclude: /node_modules/,
				options: {
					configFile: "tsconfig.client.json",
				},
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
	},
	output: {
		filename: "app.js",
		path: path.resolve(__dirname, "public/js"),
	},
};

module.exports = [serverConfig, clientConfig];
