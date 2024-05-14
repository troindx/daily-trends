interface Colors {
    [key: string]: string;
}
export class Logger {
    private static colors : Colors = {
        reset: "\x1b[0m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m"
    };

    static log(...args: any[]) {
        const color = args[0] || "reset";
        if (!Logger.colors[color]) {
            console.error(`Invalid color: ${color}`);
            return;
        }
        if (process.stdout.isTTY) {
            console.log(`${Logger.colors[color]}`, ...args.slice(1), `${Logger.colors.reset}`);
        } else{
            console.log(...args.slice(1));
        }
    }

    static error(...args: any[]) {
        const color = args[0] || "red";
        if (!Logger.colors[color]) {
            console.error(`Invalid color: ${color}`);
            return;
        }
        if (process.stdout.isTTY) {
            console.error(`${Logger.colors[color]}`, ...args.slice(1), `${Logger.colors.reset}`);
        } else{
            console.error(...args.slice(1));
        }
    }

    static warn(...args: any[]) {
        const color = args[0] || "yellow";
        if (!Logger.colors[color]) {
            console.error(`Invalid color: ${color}`);
            return;
        }
        if (process.stdout.isTTY) {
            console.warn(`${Logger.colors[color]}`, ...args.slice(1), `${Logger.colors.reset}`);
        } else{
            console.warn(...args.slice(1));
        }
    }

    static info(...args: any[]) {
        const color = args[0] || "yellow";
        if (!Logger.colors[color]) {
            console.error(`Invalid color: ${color}`);
            return;
        }
        if (process.stdout.isTTY) {
            console.info(`${Logger.colors[color]}`, ...args.slice(1), `${Logger.colors.reset}`);
        } else{
            console.info(...args.slice(1));
        }
    }
}


