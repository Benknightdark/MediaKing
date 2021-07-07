
(async () => {
    const fetch = require('node-fetch')
    const fs = require('fs');

    const getfeedData = async () => {
        const req = await fetch('https://www.youtube.com/feed/explore')
        const res = await req.text();

        const regex = /var ytInitialData = (.+);<\/script>/gm
        const m = regex.exec(res)
        return JSON.parse(m[1].split(';</script>')[0])
        // if (m && m.length === 2) {
        //   return JSON.parse(m[0].split(',<script')[0])
        // } else return {}
    }
    const a = (await getfeedData())['contents']['twoColumnBrowseResultsRenderer']['tabs'][0]['tabRenderer']['content']['sectionListRenderer']['contents'][2]['itemSectionRenderer']['contents'][0]['shelfRenderer']['content']['expandedShelfContentsRenderer']['items']
    console.log(a)
})()