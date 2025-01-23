import dotenv from 'dotenv';
import fg from 'fast-glob';
import { Client, Events, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';

dotenv.config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent]});
client.commands = new Collection();
let commands = [];

(async() => {
    const files = await fg('./commands/**/*.js')
    for (const file of files) {
        const command = await import(file);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            // console.log(`found ${command.data.name} command.`);
        }
    }
    (async(commands) =>{
        try {
            const rest = new REST({ version: '10' }).setToken(TOKEN);
            console.log('Started refreshing application (/) commands.');
            const data = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })(commands);
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()){
        return;
    }
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);