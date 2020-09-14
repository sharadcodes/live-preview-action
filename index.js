const exec = require('child_process').exec;
const core = require('@actions/core');
const ngrok = require('ngrok');
const fetch = require('node-fetch');

const PORT = parseInt(process.env.INPUT_PORT);
const MINUTES = parseInt(process.env.INPUT_MINUTES);
const COMMAND = process.env.INPUT_COMMAND;
const DISCORD_WEBHOOK_URL = process.env.INPUT_DISCORD_WEBHOOK_URL;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessage(message) {
  return await fetch(DISCORD_WEBHOOK_URL, {
    method: 'post',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        content: message
    })
  })
}

(async function () {
    try {  
          exec(COMMAND, (error, stdout, stderr) => {
            if (error) {
                console.error(error)
                core.setFailed(error);
            }
            if (stderr) {
                console.error(stderr)
                core.setFailed(stderr);
            }
            console.log(`stdout: ${stdout}`);
        });
        const URL = await ngrok.connect(PORT);
        await sendMessage(`PORT: ${PORT}\nCOMMAND: ${COMMAND}\n${URL}`);
        console.table({
            'PORT': PORT,
            'URL': URL
        })
        await sleep(1000 * 60 * parseInt(MINUTES));
        await ngrok.kill();
        await sendMessage('Time over, server killed');
        process.exit(0);
    } catch (error) {
        console.error(error);
        core.setFailed(error.message);
    }
})();
