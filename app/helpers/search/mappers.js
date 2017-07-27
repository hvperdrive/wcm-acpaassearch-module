var _ = require("lodash");

var generateTopHitSlug = function generateTopHitSlug(topHit, productSlug) {
	var topHitSource = _.get(topHit, "_source", {});

	switch (topHit._key) {
		case "apiS":
			return "/" + productSlug + "/" +
				topHitSource.version + "/" +
				topHitSource.apiSlug + "/" +
				topHitSource.slug;
		case "versionItems":
			return "/" + productSlug + "/" +
				topHitSource.version + "/" +
				topHitSource.slug;
		case "customItems":
			return "/" + productSlug + "/" +
				topHitSource.slug;
		default:
			return "/" + productSlug + "/" +
				topHit._key;
	}
};

var getProductTopInnerHit = function getProductTopInnerHit(product) {
	var allHits = _.reduce(_.get(product, "inner_hits", {}), function(acc, item, key) {
		var hits = _.map(_.get(item, "hits.hits", []), function(hit) {
			return Object.assign({},
				hit, {
					_key: key,
				}
			);
		});

		return acc.concat(hits);
	}, []);

	return _.maxBy(allHits, "_score");
};

var mapProducts = function mapProducts(category) {
	var products = _.get(category, "hits.hits.hits", []);

	return _.map(products, function(product) {
		var topHit = getProductTopInnerHit(product);
		var slug = generateTopHitSlug(topHit, _.get(product, "_source.meta.slug", null));

		return {
			_type: product._type,
			_score: product._score,
			slug: slug,
			title: _.get(product, "_source.fields.title.value"),
			description: _.get(product, "_source.fields.intro.intro"),
		};
	});
};

var mapCategories = function mapCategories(result) {
	var categories = _.get(result, "aggregations.byCategory.buckets", []);

	return _.map(categories, function(cat) {
		return {
			category: cat.key,
			count: cat.doc_count,
			products: mapProducts(cat),
		};
	});
};

module.exports.mapResults = function mapResults(result) {
	return mapCategories(result);
};
