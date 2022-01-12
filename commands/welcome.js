import { MessageEmbed, MessageAttachment } from 'discord.js'
import Canvas from 'canvas';

const command = {
    name:"welcome-image",
    description:"Welcoming Message and Image",
    async execute(msg, /*member,*/ client){
        const channelJoinId = '783343899996323911'
        //const message = `Selamat datang di ${member.guild.name}, <@${member.id}>.\nTolong baca peraturan di <#919417694397268059> dulu. Semoga betah disini ya ⛺`
        //const channel = member.guild.channels.cache.get(channelJoinId)

        //const canvas = Canvas.createCanvas(918, 368);
        const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://wallpaperboat.com/wp-content/uploads/2020/06/03/42361/aesthetic-anime-01-920x518.jpg');

        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#FFC0CB';
        context.lineWidth = 15;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = '28px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText(`Selamat datang di ${msg.guild.name}`, canvas.width / 2.75, canvas.height / 3.5);

        context.font = applyText(canvas, msg.author.username);
        context.fillStyle = '#ffffff';
        context.fillText(msg.author.username, canvas.width / 2.75, canvas.height / 1.5);

        context.fillStyle = '#ff1493';
        context.beginPath();
        context.arc(125, 125, 110, 0, Math.PI * 2, true);
        context.fill();

        context.fillStyle = '#808080';
        context.beginPath();
        context.arc(125, 125, 105, 0, Math.PI * 2, true);
        context.fill();

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        const avatar = await Canvas.loadImage(msg.author.displayAvatarURL({ format: 'jpg' }));
	    context.drawImage(avatar, 25, 25, 200, 200);
    
        const attachment = new MessageAttachment(canvas.toBuffer(), 'user-image.png');

        msg.channel.send({files:[attachment]})
    }
}
export default command;

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return context.font;
};