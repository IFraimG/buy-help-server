const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Advertisement = require("./Advertisement");

require("dotenv").config();

const generateRandomString = require('../../utils/generateRandomString');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');


module.exports = {
    name: "advertisements",
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }),
    model: Advertisement,
    actions: {
        /* 
        * поиск активного объявления для определенного нуждающегося
        */
        getOwnItem: {
            rest: "GET /get_own_item/:authorID",
            params: {
                authorID: { type: "string" }
            },
            async handler(ctx) {
                try {
                    const result = await this.adapter.model.findOne({ isSuccessDone: false, authorID: ctx.params.authorID }).exec()
                    if (result == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    
                    const currentDate = dayjs().tz("Europe/Moscow").format('YYYY-MM-DD HH:mm:ss');
                    const advertDate = dayjs(result.dateDone) 
                    const diffInHours = dayjs(currentDate).diff(advertDate, 'hour');    
                    if (diffInHours > 2) {
                      await this.adapter.model.deleteOne({ isSuccessDone: false, authorID: ctx.params.authorID })
                      ctx.meta.$statusCode = 404
                      return { message: "NotFound" }
                    }
                    
                    return result
                  } catch (err) {
                    console.log(err.message);
                    return { message: err.message }
                  }
            }
        },
        /* 
        * поиск все возможных активных объявлений
        */
        getActiveAdvert: {
            rest: "GET /get_active/:market",
            params: {
                market: { type: "string" }
            },
            async handler(ctx) {
                let market = ctx.params.market

                const currentDate = dayjs().tz("Europe/Moscow").format('YYYY-MM-DD HH:mm:ss');
                if ((dayjs(currentDate).hour() >= 23 || dayjs(currentDate).hour() < 10)) {
                    await this.adapter.model.deleteMany({ isSuccessDone: false })
                    let result = await this.getActiveController(market)
                    return result
                }
    
                let result = await this.broker.call("needy.getByMarket", { market: market })
                for (item of result) {
                    const advert = await this.adapter.model.findOne({ authorID: item._id, isSuccessDone: false }).exec()
                    if (advert == null) continue
    
                    const advertDate = dayjs(advert.dateDone) 
                    const diffInHours = dayjs(currentDate).diff(advertDate, 'hour');    
                    if (diffInHours > 2) {
                        await this.adapter.model.deleteOne({ authorID: item._id, isSuccessDone: false })
                        return { message: "Done!" }
                    }
                }
            }
        },
        /* 
        * поиск объявления для отдающего
        */
        getItemByID: {
            rest: "GET /get_item_by_id/:advertID",
            params: {
                advertID: { type: "string" }
            },
            async handler(ctx) {
                try {
                    const result = await this.adapter.model.findOne({ advertsID: ctx.params.advertID }).exec()
                    if (result == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    
                    return result
                  } catch (err) {
                    console.log(err.message);
                    return { message: err.message }
                  }
            }
        },
        /* 
        * успешное создание объявления
        */
        create: {
            rest: "POST /create",
            async handler(ctx) {
                try {
                    const info = ctx.params
                    await this.adapter.model.findOneAndUpdate({ authorID: info.authorID, isSuccessDone: false }, { isSuccessDone: true })
                
                    const advertID = generateRandomString(10)
                    const advertisement = new Advertisement({ 
                      title: info.title,
                      authorName: info.authorName,
                      advertsID: advertID,
                      authorID: info.authorID,
                      listProducts: info.listProducts
                    })
                  
                    try {
                      await advertisement.save()
                      return advertisement
                    } catch (err) {
                      console.log(err);
                      return { message: err.message }
                    }
                  } catch (err) {
                    console.log(err.message);
                    return { message: err.message }
                  }
            }
        },
        /* 
        * нуждающийся просто удаляет свое объявление
        */
        done: {
            rest: "DELETE /done/:advertID",
            params: {
                advertID: { type: "string" }
            },
            async handler(ctx) {
                try {
                    const result = await this.adapter.model.deleteOne({ advertsID: ctx.params.advertID })
                    return { isDelete: result.deletedCount >= 1 }
                  } catch (err) {
                    return {message: err.message}
                  }
            }
        },
        /* 
        * поиск активных объявлений определенного магазина
        */
        getActiveByMarket: {
            rest: "GET /get_active_by_market",
            async handler(ctx) {
                let users = await this.broker.call("needy.getByMarket", { market: ctx.params.market })

                const adverts = []
                for (let item of users) {
                  let result = await this.adapter.model.findOne({ authorID: item._id, isSuccessDone: false, userDoneID: null }).exec()
                  if (result != null) adverts.push(result)
                }
              
                const randomItem = Math.floor(Math.random() * (adverts.length + 1))
              
                if (adverts[randomItem] != null) return adverts[randomItem]
                else if (adverts.length > 0) return adverts[0]
                else ctx.meta.$statusCode = 404

                return { message: "NotFound" }
            }
        },
        /* 
        * нуждающийся получает информацию о том, что отдающий купил для него продукты
        */
        gettingProduct: {
            rest: "PUT /getting_product",
            params: {
                
            },
            async handler(ctx) {
                try {
                    const result = await this.adapter.model.findOneAndUpdate({ isSuccessDone: false, authorID: ctx.params.authorID }, 
                      { userDoneID: ctx.params.userDoneID, gettingProductID: ctx.params.gettingProductID, dateDone: dayjs().tz("Europe/Moscow").format('YYYY-MM-DD HH:mm:ss') })
                    
                    if (result == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    return result
                  } catch (err) {
                    console.log(err.message);
                    return { message: err.message }
                  }
            }
        },
        /* 
        * нуждающийся отменяет получение продуктов и указывает объявление завершенным
        */
        cancelGettingProduct: {
            rest: "PUT /cancel_getting_product",
            async handler(ctx) {
                try {
                    const result = await this.adapter.model.findOneAndUpdate({ isSuccessDone: false, authorID: ctx.params.authorID }, 
                      { isSuccessDone: true, userDoneID: "" })
                    
                    if (result == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    return result
                  } catch (err) {
                    console.log(err.message);
                    return { message: err.message }
                  }
            }
        },
        /* 
        * нуждающийся забирает в магазине продукты
        */
        finishGettingProduct: {
            rest: "PUT /finish_getting_product",
            async handler(ctx) {
                try {
                    const result = await this.adapter.model.findOneAndUpdate({ isSuccessDone: false, authorID: ctx.params.authorID }, { isSuccessDone: true })
                    
                    if (result == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }

                    return result
                  } catch (err) {
                    console.log(err.message);
                    return { message: err.message }
                  }
            }
        },
        /* 
        * поиск истории благотворительных покупок отдающего
        */
        findGiverAdvertisements: {
            rest: "GET /find_giver_advertisements/:userID",
            params: {
                userID: { type: "string" }
            },
            async handler(ctx) {
                try {
                    const result = await this.adapter.model.find({ userDoneID: ctx.params.userID, isSuccessDone: true }).exec()
                    if (result == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    return {advertisements: result}
                  } catch (error) {
                    ctx.meta.$statusCode = 400
                    return { message: err.message }
                  }
            }
        }
    },
    methods: {
        getOwnItem() {
            
        },
       async getActiveController(market) {
            try {
                let needies = await this.broker.call("needy.getByMarket", { market: market })
                if (needies == null) return { message: "NotFound" }
                const adverts = []
            
                for (item of needies) {
                    const advert = await this.adapter.model.findOne({ authorID: item._id, isSuccessDone: false, userDoneID: null }).exec()
                    if (advert != null) adverts.push(advert)
                }
            
                if (adverts.length == 0) return { message: "NotFound" }
                return { result: adverts }
            } catch (err) {
                console.log(err.message);
                return { message: err.message }
            }
        },
        getItemById() {},
        create() {},
        done() {},
        getActiveByMarket() {},
        gettingProduct() {},
        cancelGettingProduct() {},
        finishGettingProduct() {},
        findGiverAdvertisements() {}
    },

    started() {
        dayjs.extend(utc);
        dayjs.extend(timezone);
    }
}