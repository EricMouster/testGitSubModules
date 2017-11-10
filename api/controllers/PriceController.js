/**
 * PriceController
 *
 * @description :: Server-side logic for managing prices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: (req, res) => {
		Price.create({
			price: Math.floor(Math.random()*100) + 1
		})
			.then((price) => {
				return res.json({
					id: price.id
				})
			})
			.catch((err) => {
				return res.serverError(err)
			})
	},
	checkPrice: (req, res) => {
		let input;
		Price.findOne(req.param('id'))
			.then((price) => {
				if (!price.isStarted) {
					price.isStarted = true
					price.save()
				} else if (Date.now() - Date.parse(price.updatedAt) > 30000) {
					return res.json({
						response: false,
						error: 'Le délais est dépassé'
					})
				}
				if (!req.param('price') ) {
					return res.json({
						response: false,
						error: 'Il faut envoyer un prix...'
					})
				}
				input = Number.parseInt(req.param('price'))
				if (input > price.price) {
					return res.json({
						response: 'moins',
						error: false
					})
				} else if (input < price.price) {
					return res.json({
						response: 'plus',
						error: false
					})
				} else if(input == price.price) {
					return res.json({
						response: 'gagne',
						error: false
					})
				} else {
					return res.json({
                                                response: false,
                                                error: 'Il faut envoyer un prix...'
                                        })

				}
			})
			.catch((err) => {
				return res.error(err)
			})
	},
	getResult: (req, res) => {
		Price.findOne(req.param('id'))
			.then((price) => {
				if (price.isStarted && Date.now() - Date.parse(price.updatedAt) > 30000) {
					return res.json({
						price: price.price
					})
				} else {
					res.json({
						err: 'Tu triches...'
					})
				}
			})
	}
};
