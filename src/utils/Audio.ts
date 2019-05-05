import { Audio } from "expo";

export enum AlarmAudio {
    MusicBox = 0,
    Birds = 1,
    PagerBeeps = 2,
    Computer = 3,
    LoudAlarm = 4,
    NormalAlarm = 5,
    Special = 6
}

export async function getAlarmSound(audio: AlarmAudio): Promise<Audio.Sound> {
    const sound: Audio.Sound = new Audio.Sound();
    switch (audio) {
        case AlarmAudio.MusicBox:
            await sound.loadAsync(require("../../assets/audio/MusicBox.mp3"));
            break;
        case AlarmAudio.Birds:
            await sound.loadAsync(require("../../assets/audio/Birds.mp3"));
            break;
        case AlarmAudio.PagerBeeps:
            await sound.loadAsync(require("../../assets/audio/Pager.mp3"));
            break;
        case AlarmAudio.Computer:
            await sound.loadAsync(require("../../assets/audio/Computer.mp3"));
            break;
        case AlarmAudio.LoudAlarm:
            await sound.loadAsync(require("../../assets/audio/LoudAlarm.mp3"));
            break;
        case AlarmAudio.NormalAlarm:
            await sound.loadAsync(require("../../assets/audio/NormalAlarm.mp3"));
            break;
        case AlarmAudio.Special:
            await sound.loadAsync(require("../../assets/audio/Special.mp3"));
            break;
        default:
            throw new Error(`Audio ${audio} does not exist`);
    }
    return sound;
}
