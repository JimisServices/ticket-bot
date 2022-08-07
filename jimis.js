const Discord = require('discord.js')
const jimis = new Discord.Client({partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'USER'],ws: {properties: {$browser: "Discord iOS"}} })
const giannakis = require('discord-buttons')
const { MessageButton } = require('discord-buttons');
const config = require(`./config.json`)
giannakis(jimis)


jimis.on('message', async (message) => {
    const args = message.content.slice(1).split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'ticket'){
        
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
        .setColor('RANDOM')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setTitle(`Ticket || Μιλήστε μαζί μας!`)
        .setDescription(`**Πιέστε το \`\`🎫\`\` για να ανοίξετε ticket, και θα σας απαντήσουμε σύντομα!**`)

        const button = new MessageButton()
        .setStyle('blurple')
        .setID(`jimis`)
        .setEmoji(`🎫`)

        message.channel.send({ embed: embed, button: button }).catch(() => {})

    }
})

jimis.on('clickButton', async (button) => {
    if(button.id === 'jimis'){
        await button.clicker.fetch();

        let ticketChannel = await button.guild.channels.create(`🎫ticket-${button.clicker.user.username}`, {

            type: 'text',
            parent: button.message.channel.parentID

        })

        ticketChannel.overwritePermissions([
            {
                id: button.guild.roles.everyone,
                deny: ['VIEW_CHANNEL']
            },
            {
                id: button.clicker.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            },
            {
                id: config['Allowed Role'],
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            }
        ])

        await button.reply.send(`\`\`Το ticket σας άνοιξε επιτυχώς!\`\` <#${ticketChannel.id}>`, true).catch(() => {})

        const embed = new Discord.MessageEmbed()
        .setAuthor(button.clicker.user.username, button.clicker.user.displayAvatarURL({ dynamic: true }))
        .setColor('RANDOM')
        .setDescription(`**Αν θέλετε να κλείσετε το ticket, πιέστε το** \`\`🔒\`\``)
        .setThumbnail(button.guild.iconURL({ dynamic: true }))

        const jimaras = new MessageButton()
        .setStyle('red')
        .setID('jimaras')
        .setEmoji('🔒')

        ticketChannel.send(`<@${button.clicker.id}>`, { embed: embed, button: jimaras }).catch(() => {})

    }
    if(button.id === 'jimaras'){
        await button.clicker.fetch();
        await button.reply.defer({}).catch(() => {})
        


        button.channel.delete({ timeout: 1500 }).catch(() => {})
    }
})

jimis.login(config.BotToken)
