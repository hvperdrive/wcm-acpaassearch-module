const _ = require("lodash");

const getAPISlug = (productSlug, topHitSource) => {
	return productSlug + "/" +
		topHitSource.version + "/" +
		topHitSource.api + "/" +
		topHitSource.slug;
};

const getVersionItemSlug = (productSlug, topHitSource) => {
	return productSlug + "/" +
		topHitSource.version + "/" +
		topHitSource.slug;
};

const getCustomItemSlug = (productSlug, topHitSource) => {
	return productSlug + "/" +
		topHitSource.slug;
};

const getDefaultItemSlug = (productSlug, topHit) => {
	const emptyKeys = ["title", "intro"];

	return productSlug +
		(emptyKeys.indexOf(topHit._key) >= 0 ? "" : ("/" + topHit._key));
};

const generateTopHitSlug = (topHit, productSlug) => {
	const topHitSource = _.get(topHit, "_source", {});

	switch (topHit._key) {
		case "apiS":
			return getAPISlug(productSlug, topHitSource);
		case "versionItems":
			return getVersionItemSlug(productSlug, topHitSource);
		case "customItems":
			if (topHitSource.api) {
				return getAPISlug(productSlug, topHitSource);
			}

			return getCustomItemSlug(productSlug, topHitSource);
		default:
			return getDefaultItemSlug(productSlug, topHit);
	}
};

const getProductTopInnerHit = (product) => {
	const allHits = _.reduce(_.get(product, "inner_hits", {}), (acc, item, key) => {
		const hits = _.map(_.get(item, "hits.hits", []), (hit) => {
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

const mapProducts = (products) => {
	return _.map(products, (product) => {
		const topHit = getProductTopInnerHit(product);
		let productSlug = "";

		if (["main_documentation", "news"].indexOf(_.get(product, "_source.fields.productCategory"))) {
			productSlug = "/" + _.get(product, "_source.meta.slug", "");
		}

		const slug = generateTopHitSlug(topHit, productSlug);

		return {
			_type: product._type,
			_score: product._score,
			category: _.get(product, "_source.fields.productCategory"),
			slug: slug,
			title: _.get(product, "_source.fields.title.value"),
			description: _.get(product, "_source.fields.intro.value"),
		};
	});
};

const mapCategories = (categories) => {
	return _.map(categories, (category) => ({
		category: category.key,
		count: category.doc_count,
		products: mapProducts(_.get(category, "hits.hits.hits", [])),
	}));
};

module.exports.mapResults = (result) => {
	return mapCategories(_.get(result, "aggregations.byCategory.buckets", []));
};

module.exports.mapSuggestionResults = (result) => {
	return mapProducts(_.get(result, "hits.hits", []));
};
