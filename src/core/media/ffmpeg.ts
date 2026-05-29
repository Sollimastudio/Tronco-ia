import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";
import path from "path";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

const resolvedFfprobePath =
  typeof ffprobeStatic === "string" ? ffprobeStatic : ffprobeStatic?.path;

if (resolvedFfprobePath) {
  ffmpeg.setFfprobePath(resolvedFfprobePath);
}

export type VideoClipPlan = {
  inputPath: string;
  outputPath: string;
  start?: number;
  duration?: number;
  width?: number;
  height?: number;
};

export function renderVideoClip(plan: VideoClipPlan): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(plan.inputPath);

    if (typeof plan.start === "number") {
      command.seekInput(plan.start);
    }

    if (typeof plan.duration === "number") {
      command.duration(plan.duration);
    }

    if (plan.width && plan.height) {
      command.size(`${plan.width}x${plan.height}`);
    }

    command
      .output(plan.outputPath)
      .on("end", () => resolve(plan.outputPath))
      .on("error", reject)
      .run();
  });
}

export function createSafeOutputPath(baseDir: string, filename: string) {
  return path.join(baseDir, filename.replace(/[^a-z0-9._-]/gi, "_"));
}
