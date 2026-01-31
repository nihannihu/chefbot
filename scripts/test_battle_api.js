const fetch = require('node-fetch');

async function testBattleAPI() {
    console.log("Testing Battle API...\n");

    try {
        const response = await fetch('http://localhost:3000/api/battle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients: 'rice, chicken' })
        });

        console.log("Status:", response.status);
        console.log("Status Text:", response.statusText);

        const data = await response.json();
        console.log("\nResponse Data:");
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Fetch Error:", error.message);
        console.error("Full Error:", error);
    }
}

testBattleAPI();
