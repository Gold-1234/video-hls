import express from "express"
import fs from "fs"
import hls from "hls-server"
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import hlsConvert from "./ffmpeg.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express()

hlsConvert()

const server = app.listen(8000, () => {
	console.log("server listening on PORT 8000")
})

app.get('/', (req, res) => {
	console.log(__dirname);
	
	return res.status(200).sendFile(path.join(__dirname, "client.html"))
})
 
new hls(server, {
    provider: {
		exists: (req, cb) => {
			const ext = req.url.split('.').pop(); // Get file extension
		
			if (ext !== 'm3u8' && ext !== 'ts') {
				return cb(null, true); // Only allow .m3u8 and .ts files
			}
			fs.access(__dirname + req.url, fs.constants.F_OK, function (err) {
				if (err) {
					console.log('File not exist');
					return cb(null, false); // File does not exist
				}
				cb(null, true); // File exists
			})
		},
		getManifestStream: (req, cb) => {
			const stream = fs.createReadStream(__dirname + req.url);
			cb(null, stream);
		},
		getSegmentStream: (req, cb) => {
			const stream = fs.createReadStream(__dirname + req.url);
			cb(null, stream);
		}
	}
})