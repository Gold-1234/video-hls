import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg"

try {
	ffmpeg.setFfmpegPath(ffmpegInstaller.path);
} catch (error) {
	console.log(error);
	
}

const hlsConvert = () => {
ffmpeg('video/video.mp4', { timeout: 432000 })
  .addOptions([
    '-profile:v baseline',
    '-level 3.0',
    '-start_number 0',
    '-hls_time 5',
    '-hls_list_size 0',
    '-f hls'
  ])
  .output('video/output.m3u8')
  .on('start', command => console.log('FFmpeg command:', command))
  .on('progress', progress => console.log('Processing:', progress.percent + '%'))
  .on('error', err => console.error('FFmpeg Error:', err.message))
  .on('end', () => console.log('Conversion completed!'))
  .run()

}

export default hlsConvert