// src/lib/data/villes.js

/**
 * @typedef {Object} VilleSEO
 * @property {string} slug - Le paramètre d'URL (ex: 'paris', 'le-havre')
 * @property {string} name - Le nom propre de la ville (ex: 'Paris', 'Le Havre')
 * @property {string} prep - La préposition devant le nom (ex: 'à', 'au')
 * @property {string} prepArticle - Préposition + article combinés (ex: 'à Paris', 'au Havre')
 * @property {string} dep - Le numéro ou nom du département (ex: 'Paris (75)', 'Seine-Maritime (76)')
 * @property {string} depNum - Le numéro du département seul (ex: '75', '76')
 * @property {string} region - La région administrative (ex: 'Île-de-France', 'Normandie')
 * @property {string} prefecture - Le nom de la préfecture/commune associée
 * @property {string} mairie - Le nom de la mairie locale
 */

/** @type {Record<string, VilleSEO>} */
export const villesSEO = {
	'paris': {
		slug: 'paris',
		name: 'Paris',
		prep: 'à',
		prepArticle: 'à Paris',
		dep: 'Paris (75)',
		depNum: '75',
		region: 'Île-de-France',
		prefecture: 'la Préfecture de Police de Paris',
		mairie: 'les Mairies d\'arrondissement de Paris'
	},
	'marseille': {
		slug: 'marseille',
		name: 'Marseille',
		prep: 'à',
		prepArticle: 'à Marseille',
		dep: 'Bouches-du-Rhône (13)',
		depNum: '13',
		region: 'Provence-Alpes-Côte d\'Azur',
		prefecture: 'la Préfecture des Bouches-du-Rhône',
		mairie: 'l\'Hôtel de Ville de Marseille'
	},
	'lyon': {
		slug: 'lyon',
		name: 'Lyon',
		prep: 'à',
		prepArticle: 'à Lyon',
		dep: 'Rhône (69)',
		depNum: '69',
		region: 'Auvergne-Rhône-Alpes',
		prefecture: 'la Préfecture du Rhône',
		mairie: 'l\'Hôtel de Ville de Lyon'
	},
	'toulouse': {
		slug: 'toulouse',
		name: 'Toulouse',
		prep: 'à',
		prepArticle: 'à Toulouse',
		dep: 'Haute-Garonne (31)',
		depNum: '31',
		region: 'Occitanie',
		prefecture: 'la Préfecture de Haute-Garonne',
		mairie: 'la Mairie du Capitole de Toulouse'
	},
	'nice': {
		slug: 'nice',
		name: 'Nice',
		prep: 'à',
		prepArticle: 'à Nice',
		dep: 'Alpes-Maritimes (06)',
		depNum: '06',
		region: 'Provence-Alpes-Côte d\'Azur',
		prefecture: 'la Préfecture des Alpes-Maritimes',
		mairie: 'la Mairie de Nice'
	},
	'nantes': {
		slug: 'nantes',
		name: 'Nantes',
		prep: 'à',
		prepArticle: 'à Nantes',
		dep: 'Loire-Atlantique (44)',
		depNum: '44',
		region: 'Pays de la Loire',
		prefecture: 'la Préfecture de Loire-Atlantique',
		mairie: 'la Mairie de Nantes'
	},
	'montpellier': {
		slug: 'montpellier',
		name: 'Montpellier',
		prep: 'à',
		prepArticle: 'à Montpellier',
		dep: 'Hérault (34)',
		depNum: '34',
		region: 'Occitanie',
		prefecture: 'la Préfecture de l\'Hérault',
		mairie: 'la Mairie de Montpellier'
	},
	'strasbourg': {
		slug: 'strasbourg',
		name: 'Strasbourg',
		prep: 'à',
		prepArticle: 'à Strasbourg',
		dep: 'Bas-Rhin (67)',
		depNum: '67',
		region: 'Grand Est',
		prefecture: 'la Préfecture du Bas-Rhin',
		mairie: 'l\'Hôtel de Ville de Strasbourg'
	},
	'bordeaux': {
		slug: 'bordeaux',
		name: 'Bordeaux',
		prep: 'à',
		prepArticle: 'à Bordeaux',
		dep: 'Gironde (33)',
		depNum: '33',
		region: 'Nouvelle-Aquitaine',
		prefecture: 'la Préfecture de la Gironde',
		mairie: 'la Mairie de Bordeaux'
	},
	'lille': {
		slug: 'lille',
		name: 'Lille',
		prep: 'à',
		prepArticle: 'à Lille',
		dep: 'Nord (59)',
		depNum: '59',
		region: 'Hauts-de-France',
		prefecture: 'la Préfecture du Nord',
		mairie: 'l\'Hôtel de Ville de Lille'
	},
	'rennes': {
		slug: 'rennes',
		name: 'Rennes',
		prep: 'à',
		prepArticle: 'à Rennes',
		dep: 'Ille-et-Vilaine (35)',
		depNum: '35',
		region: 'Bretagne',
		prefecture: 'la Préfecture d\'Ille-et-Vilaine',
		mairie: 'la Mairie de Rennes'
	},
	'reims': {
		slug: 'reims',
		name: 'Reims',
		prep: 'à',
		prepArticle: 'à Reims',
		dep: 'Marne (51)',
		depNum: '51',
		region: 'Grand Est',
		prefecture: 'la Sous-Préfecture de Reims',
		mairie: 'la Mairie de Reims'
	},
	'toulon': {
		slug: 'toulon',
		name: 'Toulon',
		prep: 'à',
		prepArticle: 'à Toulon',
		dep: 'Var (83)',
		depNum: '83',
		region: 'Provence-Alpes-Côte d\'Azur',
		prefecture: 'la Préfecture du Var',
		mairie: 'la Mairie de Toulon'
	},
	'saint-etienne': {
		slug: 'saint-etienne',
		name: 'Saint-Étienne',
		prep: 'à',
		prepArticle: 'à Saint-Étienne',
		dep: 'Loire (42)',
		depNum: '42',
		region: 'Auvergne-Rhône-Alpes',
		prefecture: 'la Préfecture de la Loire',
		mairie: 'la Mairie de Saint-Étienne'
	},
	'le-havre': {
		slug: 'le-havre',
		name: 'Le Havre',
		prep: 'au',
		prepArticle: 'au Havre',
		dep: 'Seine-Maritime (76)',
		depNum: '76',
		region: 'Normandie',
		prefecture: 'la Sous-Préfecture du Havre',
		mairie: 'la Mairie du Havre'
	},
	'dijon': {
		slug: 'dijon',
		name: 'Dijon',
		prep: 'à',
		prepArticle: 'à Dijon',
		dep: 'Côte-d\'Or (21)',
		depNum: '21',
		region: 'Bourgogne-Franche-Comté',
		prefecture: 'la Préfecture de Côte-d\'Or',
		mairie: 'la Mairie de Dijon'
	},
	'grenoble': {
		slug: 'grenoble',
		name: 'Grenoble',
		prep: 'à',
		prepArticle: 'à Grenoble',
		dep: 'Isère (38)',
		depNum: '38',
		region: 'Auvergne-Rhône-Alpes',
		prefecture: 'la Préfecture de l\'Isère',
		mairie: 'la Mairie de Grenoble'
	},
	'angers': {
		slug: 'angers',
		name: 'Angers',
		prep: 'à',
		prepArticle: 'à Angers',
		dep: 'Maine-et-Loire (49)',
		depNum: '49',
		region: 'Pays de la Loire',
		prefecture: 'la Préfecture de Maine-et-Loire',
		mairie: 'la Mairie d\'Angers'
	},
	'villeurbanne': {
		slug: 'villeurbanne',
		name: 'Villeurbanne',
		prep: 'à',
		prepArticle: 'à Villeurbanne',
		dep: 'Rhône (69)',
		depNum: '69',
		region: 'Auvergne-Rhône-Alpes',
		prefecture: 'la Préfecture du Rhône',
		mairie: 'la Mairie de Villeurbanne'
	},
	'nimes': {
		slug: 'nimes',
		name: 'Nîmes',
		prep: 'à',
		prepArticle: 'à Nîmes',
		dep: 'Gard (30)',
		depNum: '30',
		region: 'Occitanie',
		prefecture: 'la Préfecture du Gard',
		mairie: 'la Mairie de Nîmes'
	}
};

/**
 * Ville générique de secours
 * @type {VilleSEO}
 */
export const villeGenerique = {
	slug: 'france',
	name: 'France',
	prep: 'en',
	prepArticle: 'en France',
	dep: 'France',
	depNum: 'FR',
	region: 'France',
	prefecture: 'votre préfecture ou mairie locale',
	mairie: 'votre mairie locale'
};
