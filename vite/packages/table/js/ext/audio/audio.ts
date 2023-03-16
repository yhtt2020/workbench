import {getResPath, getResPathJoin} from "../../common/exec";
const  path = require('path');
const { exec, ChildProcess } =require('child_process');

//此类将外部的一个项目提取到了项目当中，进行了简化，防止这个包打包之后因为路径问题而无法使用。
//https://github.com/JosephusPaye/win-audio-outputs

interface CommandOutput {
  /**
   * The command's stdout, trimmed
   */
  stdout: string;

  /**
   * The command's stderr, trimmed
   */
  stderr: string;

  /**
   * The command's exit code
   */
  exitCode: number | null;
}

export interface AudioOutput {
  /**
   * The ID of the output, used for subsequent calls that control the output
   */
  id: string;

  /**
   * The name of the output
   */
  name: string;

  /**
   * The name of the output device
   */
  deviceName: string;

  /**
   * Whether this output is the default for multimedia
   */
  isDefaultForMultimedia: boolean;

  /**
   * Whether this output is the default for communications
   */
  isDefaultForCommunications: boolean;

  /**
   * Whether this output is muted
   */
  isMuted: boolean;

  /**
   * The current volume of the output, in the range [0, 100]
   */
  volume: number;
}

/**
 * The path to the binary directory, where the executables are.
 */
//const binDir = path.join(__dirname, '..', 'bin');
const binDir=getResPathJoin('nir')
/**
 * A Promise wrapper around child_process.exec()
 */
function execAsPromised(
  command: string,
  options: {
    cwd?: string;
    useChildProcess?: (child: ChildProcess) => void;
  } = {}
): Promise<CommandOutput> {
  return new Promise((resolve, reject) => {
    const child = exec(
      command,
      { cwd: options?.cwd },
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        }

        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: child.exitCode,
        });
      }
    );

    if (options?.useChildProcess !== undefined) {
      options.useChildProcess(child);
    }
  });
}

/**
 * Get a list of currently active (connected and non-disabled) audio outputs on the system.
 */
export async function listOutputs(): Promise<AudioOutput[]> {
  const {
    exitCode,
    stdout,
  } = await execAsPromised(
    'SoundVolumeView /stab "" | GetNir "Item ID, Name, Device Name, Default Multimedia, Default Communications, Muted, Volume Percent" "Type=Device && Direction=Render && DeviceState=Active"',
    { cwd: binDir }
  );

  const outputs: AudioOutput[] = [];

  if (exitCode === 0 && stdout.length > 0) {
    const entries = stdout.split('\r\n');

    for (const entry of entries) {
      const [
        id,
        name,
        deviceName,
        isDefaultForMultimedia,
        isDefaultForCommunications,
        isMuted,
        volume,
      ] = entry.split('\t');

      outputs.push({
        id: id ?? '',
        name: name ?? '',
        deviceName: deviceName ?? '',
        isDefaultForMultimedia: isDefaultForMultimedia === 'Render',
        isDefaultForCommunications: isDefaultForCommunications === 'Render',
        isMuted: isMuted === 'Yes',
        volume: Number((volume ?? '0').replace('%', '')),
      });
    }
  }

  return outputs;
}

/**
 * Get the id of the given output and check that it is valid
 */
function getValidId(output: AudioOutput | string): string {
  const id = typeof output === 'string' ? output : output.id;

  if (!id || typeof id !== 'string' || id.length === 0) {
    throw new Error('invalid output id: ' + id);
  }

  return id;
}

/**
 * Set the volume of the given output.
 *
 * @param output The output or id of the output
 * @param volume The volume to set, in the range [0, 100]
 * @throws       Throws when output id or volume is invalid
 */
export async function setVolume(output: AudioOutput | string, volume: number) {
  const id = getValidId(output);

  if (!volume || typeof volume !== 'number') {
    throw new Error('invalid volume: ' + volume);
  }

  if (volume < 0 || volume > 100) {
    throw new Error('volume must be in the range [0, 100]');
  }

  const volumeRounded = Math.round(volume * 10) / 10;

  await execAsPromised(`SoundVolumeView /SetVolume ${id} ${volumeRounded}`, {
    cwd: binDir,
  });
}

/**
 * Mute the given output.
 *
 * @param output The output or id of the output
 * @throws       Throws when output id is invalid
 */
export async function mute(output: AudioOutput | string) {
  const id = getValidId(output);

  await execAsPromised(`SoundVolumeView /SetVolume /Mute ${id}`, {
    cwd: binDir,
  });
}

/**
 * Unmute the given output.
 *
 * @param output The output or id of the output
 * @throws       Throws when output id is invalid
 */
export async function unmute(output: AudioOutput | string) {
  const id = getValidId(output);

  await execAsPromised(`SoundVolumeView /SetVolume /Unmute ${id}`, {
    cwd: binDir,
  });
}

const DefaultTypes = {
  all: 'all',
  multimedia: 1,
  communications: 2,
};

/**
 * Set the give output as the default output of the given type.
 *
 * @param output The output or id of the output
 * @param type   The type of default to set: 'multimedia', 'commcommunications', or 'all'
 * @throws       Throws when output id or default type is invalid
 */
export async function setAsDefault(
  output: AudioOutput | string,
  type: 'all' | 'multimedia' | 'communications' = 'multimedia'
) {
  const id = getValidId(output);

  if (['all', 'multimedia', 'communications'].includes(type) === false) {
    throw new Error('invalid default type: ' + type);
  }

  const defaultType = DefaultTypes[type];

  await execAsPromised(`SoundVolumeView /SetDefault ${id} ${defaultType}`, {
    cwd: binDir,
  });
}
