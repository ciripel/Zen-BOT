const Discord = require('discord.js');
const fetch = require('node-fetch');
const client = new Discord.Client();
const auth = require('./auth.json');
let cmc_btc = {};
let svrstats = {};

client.on('ready', () => {
  fetch('https://api.coinmarketcap.com/v2/ticker/1/')
    .then(res => res.json())
    .then(json => cmc_btc = json)
    .catch(error => console.log(`Can't connect to https://api.coinmarketcap.com/v2/ticker/1/.\nError: \n-----------\n${error}\n-----------`));
  fetch('https://securenodes.eu.zensystem.io/api/srvstats')
    .then(res => res.json())
    .then(json => svrstats = json)
    .catch(error => console.log(`Can't connect to https://securenodes.eu.zensystem.io/api/srvstats.\nError: \n-----------\n${error}\n-----------`));
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', (e) => console.log(`Error on ready ...${e}`));

client.on('reconnecting',() =>
  console.log(`Bot ${client.user.tag} reconected!`));

client.on('disconnect',() => {
  console.log(`Bot ${client.user.tag} disconnected ... Attempted reconnecting... `);
  client.login(auth.token)
    .catch(error => console.log(`Can't login into discord due to ${error}`));
});

client.on('message', msg => {
  if(msg.content.substring(0, 1) === '?') {
    if(msg.webhookID === null) {
      if(msg.channel.name === 'bot-testing' || msg.channel.type === 'dm' || msg.member.roles.find('name', 'Team') || msg.member.roles.find('name', 'Mods') || msg.member.roles.find('name', 'Bot Developer')){
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        //var cmd1 = args[0];
        switch(cmd) {
        case 'netinfo':
          fetch('https://zen.zhash.pro/api/stats')
            .then(res => res.json())
            .then(json => msg.channel.send(`• Block Height •           **${json.pools.zen.poolStats.networkBlocks}**\n• Network Hashrate • **${json.pools.zen.poolStats.networkSolsString}**\n• Network Difficulty • **${Math.floor(json.pools.zen.poolStats.networkDiff*100)/100}**`))
            .catch(error => console.log(`Can't connect to https://zen.zhash.pro/api/stats.\nError: \n-----------\n${error}\n-----------`));
          break;
        case 'help':
          msg.channel.send('-- `?help` | This is your help.\n-- `?links` | Useful links.\n-- `?netinfo` | Show current network stats.\n-- `?sninfo` | Securenodes info.\n-- `?hpow [your Kh/s]` | Approximate ZEN per day/week.\n-- `?snrewards [no. of nodes]` | Approximate ZEN reward per day.\n-- `?zenusd [amount]` | Current price in USD.\n-- `?coininfo` | Show coin info.\n-- `?exchange` | Current ZenCash exchanges.\n-- `?pool [POOL]` | ZenCash mining pools [_connection info_].\n-- `?about` | Info about this bot.');
          break;
        case 'links':
          msg.channel.send('**ZenSystem Website** • <https://zensystem.io/>\n**ZenCash Announcement** • <https://bitcointalk.org/index.php?topic=2047435>\n**Zen Whitepaper** • <https://zencash.com/assets/files/Zen-White-Paper.pdf> | <https://zencash.com/assets/files/Zen-Application-Platform-Whitepaper.pdf>\n**ZenCash Github** • <https://github.com/ZencashOfficial>\n**ZenCash Wallets** • <https://zencash.com/wallets/>\n**ZenCash Block Explorer** • <https://explorer.zensystem.io/> | <http://explorer.zenmine.pro/insight/>\n**ZenSystem Community** • <https://twitter.com/zencashofficial> | <https://www.facebook.com/zencash/> | <https://blog.zencash.com/> | <https://medium.com/zencash> | <https://forum.zencash.com/> | <https://t.me/zencash> | <https://www.youtube.com/channel/UCQ0v_lUnZHIKUQUXJzfgqOg> | <https://www.reddit.com/r/ZenSys/>');
          break;
        case 'about':
          msg.channel.send('• Version 1.0\n• Author: ciripel _(Discord: Amitabha#0517)_\n• Source Code: <https://github.com/ciripel/Zen-BOT>\n• _This bot idea was born and grew with <https://akroma.io/>._');
          break;
        case 'hpow':
          fetch('https://zen.zhash.pro/api/stats')
            .then(res => res.json())
            .then(json => {switch (true) {
            case args[0]===undefined:
              msg.channel.send('Input your hashpower in KSol/s, like `?hpow 123`.');
              break;
            case isNaN(args[0]):
              msg.channel.send('Input your hashpower in KSon/s, like `?hpow 123`.');
              break;
            case args[0]==='0':
              msg.channel.send('Value = 0? Why stress me. You are no miner.');
              break;
            case args[0]<0:
              msg.channel.send('Hashpower must be positive number, don\'t you think?:thinking:');
              break;
            default:
              msg.channel.send(`Current network difficulty is **${Math.floor(json.pools.zen.poolStats.networkDiff*100)/100}**.\nA hashrate of **${args[0]} KSol/s** will get you approximately **${Math.floor(args[0]/json.pools.zen.poolStats.networkSols*0.88*3600000000*12.5*24/150)/1000} ZEN** per **day** and **${Math.floor(args[0]/json.pools.zen.poolStats.networkSols*0.88*3600000000*12.5*24*7/150)/1000} ZEN** per **week** at current network difficulty.`);
              break;
            }
            })
            .catch(error => console.log(`Can't connect to https://zen.zhash.pro/api/stats.\nError: \n-----------\n${error}\n-----------`));
          break;
        case 'zenusd':
          fetch('https://api.coinmarketcap.com/v2/ticker/1698/')
            .then(res => res.json())
            .then (json => {switch(true) {
            case args[0]===undefined:
              msg.channel.send(`_Today the approximate price of ***1 ZEN*** is ***${Math.floor(json.data.quotes.USD.price*1000)/1000}$.***_`);
              break;
            case isNaN(args[0]):
              msg.channel.send(`_Today the approximate price of ***1 ZEN*** is ***${Math.floor(json.data.quotes.USD.price*1000)/1000}$.***_`);
              break;
            case args[0]==='0':
              msg.channel.send('Welcome young one! We have all started with **0 ZEN** zilions of aeons ago!');
              break;
            case args[0]<0:
              msg.channel.send('Hmm! Yup! I feel sorry for you! You owe **ZEN**... I feel your pain friend!');
              break;
            default:
              msg.channel.send(`**${args[0]} ZEN** = **${Math.floor(json.data.quotes.USD.price*args[0]*1000/1000)}$**\n_Today the approximate price of ***1 ZEN*** is ***${Math.floor(json.data.quotes.USD.price*1000)/1000}$***_`);
              break;
            }
            })
            .catch(error => console.log(`Can't connect to https://api.coinmarketcap.com/v2/ticker/1698/.\nError: \n-----------\n${error}\n-----------`));
          break;
        case 'coininfo':
          fetch('https://api.coinmarketcap.com/v2/ticker/1/')
            .then(res => res.json())
            .then(json => cmc_btc = json)
            .catch(error => console.log(`Can't connect to https://api.coinmarketcap.com/v2/ticker/1/.\nError: \n-----------\n${error}\n-----------`));
          fetch('https://securenodes.eu.zensystem.io/api/srvstats')
            .then(res => res.json())
            .then(json => svrstats = json)
            .catch(error => console.log(`Can't connect to https://securenodes.eu.zensystem.io/api/srvstats.\nError: \n-----------\n${error}\n-----------`));
          fetch('https://api.coinmarketcap.com/v2/ticker/1698/')
            .then(res => res.json())
            .then(json => msg.channel.send(`• Current Price•          **${Math.floor(json.data.quotes.USD.price/cmc_btc.data.quotes.USD.price*100000)/100000} BTC** | **${Math.floor(json.data.quotes.USD.price*1000)/1000}$**\n• 24h Volume •           **${Math.floor(json.data.quotes.USD.volume_24h/cmc_btc.data.quotes.USD.price*100)/100} BTC** | **${Math.floor(json.data.quotes.USD.volume_24h)}$**\n• Market Cap•             **${Math.floor(json.data.quotes.USD.market_cap)}$**\n• Circulating Supply• **${Math.floor(json.data.circulating_supply)} ZEN**\n• Locked Coins•          **${42*(svrstats.global.total)} ZEN**\n• 24h Change•            **${json.data.quotes.USD.percent_change_24h}%**\n`))
            .catch(error => console.log(`Can't connect to https://api.coinmarketcap.com/v2/ticker/1698/.\nError: \n-----------\n${error}\n-----------`));
          break;
        default:
          msg.channel.send('Command not recognized. `?help` to get a list of commands.');
          break;
        }
      }
    }
  }
});

client.login(auth.token);
