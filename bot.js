const { Telegraf, Markup } = require('telegraf')
const weather = require('openweather-apis')
require("dotenv").config()

// Open Weather API configuration 
weather.setLang('en')
weather.setAPPID(process.env.OWAPI)

// Bot Initialization
const bot = new Telegraf(process.env.TGAPI)

// start command handler
bot.start((ctx) => {
    ctx.reply(`Hello, I am weather bot by @casticode`, Markup.keyboard([
        Markup.button.locationRequest('Check weather')
    ]).resize())
})

// recieve location
bot.on("location",(ctx)=>{
    weather.setCoordinate(ctx.message.location.latitude, ctx.message.location.longitude)
    ctx.reply("Loading...")
        .then((msgInfo)=>{
            weather.getWeatherOneCall((err, data)=>{ 
                let message
                if (!err) {
                    let pres = data.current.pressure
                    let temp = data.current.temp
                    let feels = data.current.feels_like
                    let weather = data.current.weather[0].main
                    let wind = data.current.wind_speed
                    message = `Current Weather\nPressure: ${pres} hPa\nTemperature: ${temp}°C\nFeels like: ${feels}°C\n${weather}\nWind Speed: ${wind} mps`
                } else {
                    console.log(err.message)
                    message = "Error occurred: We can`t proceed your request. \nPlease, try again or contact support @casticode"
                }
                ctx.telegram.editMessageText(msgInfo.chat.id, msgInfo.message_id, msgInfo.message_id, message)
            })
        }) 
})

// Bot launching 
bot.launch()