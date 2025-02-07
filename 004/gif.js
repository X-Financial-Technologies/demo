function createGif() {
    // Get timestamp for filename
    const timestamp = new Date().toISOString()
        .replace(/[-:]/g, '')
        .replace('T', '')
        .split('.')[0];

    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 1024,
        height: 400,
        workerScript: '/003/gif.worker.js'  // Local path to worker
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
        try {
            const canvas = await html2canvas(document.querySelector('.container'), {
                logging: false,
                useCORS: true
            });
            return canvas;
        } catch (error) {
            console.error('Frame capture failed:', error);
            return null;
        }
    }

    async function executeNextAction() {
        if (currentActionIndex >= actions.length) {
            try {
                gif.render();
                gif.on('finished', function(blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `usdx_flow_${timestamp}.gif`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                });
            } catch (error) {
                console.error('GIF generation failed:', error);
            }
            return;
        }

        try {
            const {action, delay} = actions[currentActionIndex];
            await new Promise(resolve => setTimeout(resolve, delay));
            
            const button = document.getElementById(action);
            if (button) {
                button.click();
                const frame = await captureFrame();
                if (frame) {
                    gif.addFrame(frame, {
                        delay: 1000,
                        copy: true
                    });
                }
            }
            
            currentActionIndex++;
            executeNextAction();
        } catch (error) {
            console.error('Action execution failed:', error);
        }
    }

    executeNextAction().catch(error => {
        console.error('GIF creation failed:', error);
    });
}

// Start recording after page loads
window.onload = function() {
    setTimeout(() => {
        try {
            createGif();
        } catch (error) {
            console.error('Failed to start GIF creation:', error);
        }
    }, 1000);
};