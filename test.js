
(async () => {
    const fetch = require('node-fetch')
    const fs = require('fs');
    const req = await fetch('https://www.youtube.com/feed/explore')
    const res = await req.text();
    const regex = /var ytInitialData = (.+);<\/script>/gm
    const m = regex.exec(res)
    // console.log(JSON.parse(m[1].split(';</script>')[0]))
    fs.writeFile('foo.json', m[1].split(';</script>')[0], (err) => { if (err) throw err; });
})();