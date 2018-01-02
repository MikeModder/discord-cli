const Discord = require('discord.js');
const readline = require('readline');
const color = require('ansi-color').set;
const util = require('util');

const client = new Discord.Client();

let cGuild, cChannel, token;
let config = require('./config.json');
token = config.token;

let guild, channel;

let rl = readline.createInterface(process.stdin, process.stdout);

rl.on('line', (line) => {
    if (line[0] === "/" && line.length > 1) {
        var cmd = line.match(/[a-z]+\b/)[0];
        var arg = line.substr(cmd.length+2, line.length);
        chat_command(cmd, arg);
    } else if(!cGuild || !cChannel){
        console_out(`<app> You haven't joined any channel/guild yet! Do /guild <guild name> then /channel <channel name>`);
    } else {
        //client.channels.get(cChannel).send(line);
        client.guilds.get(cGuild).channels.get(cChannel).send(line);
        rl.prompt(true);
    }
    
});

function getGuild(cClient){
    rl.question('<app> Please enter the name of a guild: ', (guildName) => {
        cClient.guilds.forEach(g => {
            if(g.name.toLowerCase() === guildName.toLowerCase()) return getChannel(g.id, cClient);
        });
        return null;
    });
}

function getChannel(guildId, cClient){
    rl.question('<app> Please enter the name of a channel: ', (channelName) => {
        cClient.guilds.get(guildId).channels.forEach(c => {
            if(c.name.toLowerCase() === channelName.toLowerCase()) return c.id;
        });
        return null;
    });
}

function console_out(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    rl.prompt(true);
}

function chat_command(cmd, args){
    switch(cmd){
        case "channel":
            //change channels
            let cname = args;
            if(!cGuild){
                console_out('<app> You must select a guild first with /guild <guild name>');
                return;
            }
            client.guilds.get(cGuild).channels.forEach(c => {
                let tcname = c.name.toLowerCase();
                let tsname = args.toLowerCase();
                if(tcname === tsname && c.type === "text"){
                    cChannel = c.id;
                    console_out(`<app> Switched to channel ${c.name}`);
                    return;
                }
            });
            console_out(`<app> Invalid channel name!`);
            break;
        case "guild":
            //change guilds
            client.guilds.forEach(g => {
                let gname = g.name.toLowerCase();
                let sgname = args.toLowerCase();
                if(gname === sgname){
                    cGuild = g.id;
                    console_out(`<app> Switched to guild ${gname}`);
                    return;
                }
            });
            console_out(`<app> Invalid guild name!`);
            break;
        default:
            //invalid command
            break;
    }
}

client.on('ready', () => {
    //guild = getGuild(client);
    
});

client.on('message', (message) => {
    if(!cGuild && !cChannel) return;
    if(message.channel.id !== cChannel) return;
    if(message.author.id === client.user.id) return;
    console_out(`[${message.author.tag}] ${message.cleanContent}`);
});

client.login(token);