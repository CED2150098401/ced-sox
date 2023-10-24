import { Process } from "@ced2023/process";

import { AudioFormat } from "./enums/AudioFormat";
import { AudioEncoding } from "./enums/AudioEncoding";

export class AudioDevice {
  /**
   * 오디오 입출력 디바이스 ID.
   * undefined라면 시스템 기본 디바이스.
   */
  public readonly id?: string;

  constructor(id?: string) {
    this.id = id;
  }
}

export class SoXError extends Error {}

export interface SoXOptions {
  /**
   * AudioDevice: 디바이스.
   * string: 파일 명.
   * undefined: stdin.
   */
  source?: AudioDevice | string;
  /**
   * string: 파일 명.
   * undefined: stdout.
   */
  dest?: string;
  inputFormat?: AudioFormat;
  outputFormat?: AudioFormat;
  channels?: number;
  sampleRate?: number;
  precision?: 16 | 32;
  encoding?: AudioEncoding;
  showProgress?: boolean;
}

export class SoX extends Process<readonly []> {
  protected readonly command = "sox";
  private readonly arguments: string[] = ["-V1"];
  private readonly effects: string[] = [];

  constructor(options: SoXOptions) {
    super();

    if (options.channels !== undefined)
      this.arguments.push("-c", options.channels.toString());
    if (options.sampleRate !== undefined)
      this.arguments.push("-r", options.sampleRate.toString());
    if (options.precision !== undefined)
      this.arguments.push("-b", options.precision.toString());
    if (options.encoding !== undefined)
      this.arguments.push("-e", options.encoding);
    if (!options.showProgress) this.arguments.push("-q");

    if (options.source === undefined || typeof options.source == "string") {
      if (options.inputFormat !== undefined)
        this.arguments.push("-t", options.inputFormat);
      this.arguments.push(options.source || "-");
    } else this.arguments.push(options.source.id || "-d");

    if (options.outputFormat !== undefined)
      this.arguments.push("-t", options.outputFormat);
    if (options.dest === undefined) this.arguments.push("-");
    else this.arguments.push(options.dest);
  }

  public addEffect(...args: readonly string[]): void {
    this.effects.push(...args);
  }
  protected getArguments(): readonly string[] {
    return [...this.arguments, ...this.effects];
  }
}
