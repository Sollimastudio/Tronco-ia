import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";
import path from "path";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

if (ffprobePath?.path) {
  ffmpeg.setFfprobePath(ffprobePath.path);
}

export interface VideoDimensions {
  width: number;
  height: number;
}

export async function getVideoInfo(inputPath: string): Promise<ffmpeg.FfprobeData> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (error, metadata) => {
      if (error) return reject(error);
      resolve(metadata);
    });
  });
}

export async function extractAudio(inputPath: string, outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .audioChannels(1)
      .audioFrequency(16000)
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (error) => reject(new Error(`Failed to extract audio: ${error.message}`)))
      .run();
  });
}

export async function trimVideo(
  inputPath: string,
  outputPath: string,
  startTime: number,
  duration: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions(["-pix_fmt yuv420p"])
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (error) => reject(new Error(`Failed to trim video: ${error.message}`)))
      .run();
  });
}

export async function concatVideos(inputPaths: string[], outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (inputPaths.length === 0) {
      return reject(new Error("No input files to concatenate"));
    }

    const command = ffmpeg();
    inputPaths.forEach((file) => command.input(file));

    command
      .on("end", () => resolve(outputPath))
      .on("error", (error) => reject(new Error(`Failed to concatenate videos: ${error.message}`)))
      .mergeToFile(outputPath, path.dirname(outputPath));
  });
}

export async function addSubtitles(
  inputPath: string,
  assFile: string,
  outputPath: string
): Promise<string> {
  const normalizedAssPath = assFile.replace(/\\/g, "/");

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters(`ass='${normalizedAssPath}'`)
      .videoCodec("libx264")
      .audioCodec("copy")
      .outputOptions(["-pix_fmt yuv420p"])
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (error) => reject(new Error(`Failed to add subtitles: ${error.message}`)))
      .run();
  });
}

export async function addBackgroundMusic(
  inputVideo: string,
  musicAudio: string,
  outputPath: string,
  musicVolume = 0.3
): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputVideo)
      .input(musicAudio)
      .complexFilter([
        "[0:a]volume=1.0[v1]",
        `[1:a]volume=${musicVolume}[v2]`,
        "[v1][v2]amix=inputs=2:duration=first:dropout_transition=2[a]",
      ])
      .outputOptions(["-map 0:v", "-map [a]"])
      .videoCodec("copy")
      .audioCodec("aac")
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (error) => reject(new Error(`Failed to add background music: ${error.message}`)))
      .run();
  });
}
