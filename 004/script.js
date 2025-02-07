let tvl = 0;
let supply = 0;
let price = 1.00;
let rewardMultiplier = 1.00;
let kycEnabled = false;
let yieldRate = 0.01;

function updateStats() {
    document.getElementById('tvl').textContent = `$${tvl.toFixed(2)}`;
    document.getElementById('supply').textContent = supply.toFixed(2);
    document.getElementById('price').textContent = `$${price.toFixed(2)}`;
    document.getElementById('multiplier').textContent = `${rewardMultiplier.toFixed(2)}x`;
}

function addLogEntry(action, amount) {
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substr(0, 19);
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = `${action} ${amount.toFixed(2)} ${timeStr}`;
    document.getElementById('log-entries').prepend(logEntry);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('kyc').addEventListener('click', function() {
        kycEnabled = !kycEnabled;
        this.textContent = kycEnabled ? 'KYC ENABLED' : 'KYC';
        addLogEntry('KYC', 0.00);
    });

    document.getElementById('mint').addEventListener('click', function() {
        if (!kycEnabled) return;
        const mintAmount = 1000;
        tvl += mintAmount;
        supply += mintAmount;
        updateStats();
        addLogEntry('MINT', mintAmount);
    });

    document.getElementById('distribute').addEventListener('click', function() {
        if (supply === 0) return;
        const yieldAmount = supply * yieldRate;
        tvl += yieldAmount;
        supply += yieldAmount;
        rewardMultiplier += yieldRate;
        updateStats();
        addLogEntry('YIELD', yieldAmount);
    });

    document.getElementById('redeem').addEventListener('click', function() {
        if (supply === 0) return;
        const redeemAmount = supply;
        const redeemValue = redeemAmount * rewardMultiplier;
        tvl = 0;
        supply = 0;
        rewardMultiplier = 1.00;
        updateStats();
        addLogEntry('REDEEM', redeemValue);
    });

    document.getElementById('reset').addEventListener('click', function() {
        tvl = 0;
        supply = 0;
        price = 1.00;
        rewardMultiplier = 1.00;
        kycEnabled = false;
        document.getElementById('kyc').textContent = 'KYC';
        updateStats();
        addLogEntry('RESET', 0.00);
        document.getElementById('log-entries').innerHTML = '';
    });

    updateStats();
});