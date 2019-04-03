import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { 
    Map,
    Character,
    Role
} from '../../models/index';

const getHtml = async (url) => {
    url = encodeURI(url);
    const res = await fetch(url);
    if(!res || !res.ok) {
        throw new Error('Page not found');
    }
    return await res.text()
}

const getMaps = async () => {
    const html = await getHtml('https://playoverwatch.com/en-us/game/overview');
    const $ = cheerio.load(html)
    let maps = []
    $('.maps .map-wrapper').each((i, e) => {
        maps.push(JSON.parse($(e).find('script').html().match(/{.*?}/)[0]));
    })
    try {
        return await Map.create(maps).exec();
    } catch(err) {
        return err
    }
}



const getHeroes = async () => {
    const html = await getHtml('https://playoverwatch.com/en-us/heroes');
    const roles = await Role.find({}).exec()
    const $ = cheerio.load(html)
    let heroes = []
    $('#heroes-selector-container .hero-portrait-detailed-container').each((i, e) => {
        let role = JSON.parse($(e).attr('data-groups'))[0]
        heroes.push({
            name: $(e).find('.portrait-title').text(),
            role: roles.find(e => e.name === role)._id,
            img: $(e).find('.portrait').attr('src'),
        })
    })
    try {
        return await Character.create(heroes).exec();
    } catch(err) {
        return err
    }
}

export default { getMaps, getHeroes }





