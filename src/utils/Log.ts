/**
 * @module utils
 */

const MAX_TAG_SIZE: number = 10;

enum LogSeverity {
    Debug,
    Info,
    Warning,
    Error,
    Critical
}

enum BackgroundColor {
    Blue = "\u001b[44;1m",
    Green = "\u001b[42;1m",
    Red = "\u001b[41;1m",
    Reset = "\u001b[0m",
    White = "\u001b[47m",
    Yellow = "\u001b[43;1m"
}

enum TextColor {
    Black = "\u001b[30;1m",
    Red = "\u001b[31;1m",
    Yellow = "\u001b[33;1m"
}

export function debug(tag: string, message: string|Error): void {
    print(tag, LogSeverity.Debug, message);
}

export function info(tag: string, message: string|Error): void {
    print(tag, LogSeverity.Info, message);
}

export function warning(tag: string, message: string|Error): void {
    print(tag, LogSeverity.Warning, message);
}

export function error(tag: string, message: string|Error): void {
    print(tag, LogSeverity.Error, message);
}

export function critical(tag: string, message: string|Error): void {
    print(tag, LogSeverity.Critical, message);
}

function print(tag: string, severity: LogSeverity, message: string|Error): void {

    // format the message for display
    if (message instanceof Error) { // if this message is an error, display it as a string
        message = `${message.name}: ${message.message}\n${message.stack}`;
    } else {
        message = message.trim();
    }

    // add tag to message
    const paddingLen: number = (MAX_TAG_SIZE / 2) -
        Math.floor((tag.length <= MAX_TAG_SIZE ? tag.length : MAX_TAG_SIZE) / 2);
    for (let i = 0; i < paddingLen; i++) { // add padding for left side
        tag = ` ${tag}`;
    }
    for (let i = 0; i < paddingLen; i++) { // add padding for right side
        tag = `${tag} `;
    }
    if (tag.length % 2 !== 1) { // odd-length tag, add 1 extra space to the right
        tag += " ";
    }
    if (tag.length > MAX_TAG_SIZE) { // tag exceeds space limit, truncate it
        tag = tag.substring(0, MAX_TAG_SIZE);
    }
    tag = `${BackgroundColor.Green} ${tag} ${BackgroundColor.Reset}`;

    // create severity symbol
    let symbol: string;
    switch (severity) {
        case LogSeverity.Debug:
            symbol = `${BackgroundColor.White}${TextColor.Black} λ ${BackgroundColor.Reset}`;
            break;
        case LogSeverity.Info:
            symbol = `${BackgroundColor.Blue} i ${BackgroundColor.Reset}`;
            break;
        case LogSeverity.Warning:
            symbol = `${BackgroundColor.Yellow} w ${BackgroundColor.Reset}`;
            break;
        case LogSeverity.Error:
            symbol = `${BackgroundColor.Red} ! ${BackgroundColor.Reset}`;
            break;
        case LogSeverity.Critical:
            symbol = `${BackgroundColor.Red} ‼ ${BackgroundColor.Reset}`;
    }

    // add background to message
    switch (severity) {
        case LogSeverity.Info:
            message = `${message}`;
            break;
        case LogSeverity.Warning:
            message = `${TextColor.Yellow}${message}`;
            break;
        case LogSeverity.Error:
            message = `${TextColor.Red}${message}`;
            break;
        case LogSeverity.Critical:
            message = `${BackgroundColor.Red}${message}`;
    }

    // print message to console
    console.log(`${tag}${symbol}\t${message}${BackgroundColor.Reset}`);
}
