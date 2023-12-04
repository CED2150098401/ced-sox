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
