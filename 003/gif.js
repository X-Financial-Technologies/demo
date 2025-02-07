function createGif() {
    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 1024,
        height: 400,
        workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js'
    });

    const actions = [
        {action: 'reset', delay: 0},
        {action: 'kyc', delay: 1000},
        {action: 'mint', delay: 2000},
        {action: 'distribute', delay: 3000},
        {action: 'distribute', delay: 4000},
        {action: 'redeem', delay: 5000}
    ];

    let currentActionIndex = 0;

    async function captureFrame() {
        const canvas = await html2canvas(document.querySelector('.container'));
        return canvas;
    }

    async function executeNextAction() {
        if (currentActionIndex >= actions.length) {
            gif.render();
            gif.on('finished', function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'usdx-demo.gif';
                a.click();
            });
            return;
        }

        const {action, delay} = actions[currentActionIndex];
        
        await new Promise(resolve => setTimeout(resolve, delay));
        document.getElementById(action).click();
        const frame = await captureFrame();
        gif.addFrame(frame, {delay: 1000});
        currentActionIndex++;
        executeNextAction();
    }

    executeNextAction();
}

window.onload = function() {
    setTimeout(createGif, 1000);
};