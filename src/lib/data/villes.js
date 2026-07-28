// src/lib/data/villes.js

/**
 * @typedef {Object} VilleSEO
 * @property {string} slug - Le paramètre d'URL (ex: 'paris', 'le-havre')
 * @property {string} name - Le nom propre de la ville (ex: 'Paris', 'Le Havre')
 * @property {string} prep - La préposition devant le nom (ex: 'à', 'au', 'aux')
 * @property {string} prepArticle - Préposition + article combinés (ex: 'à Paris', 'au Havre')
 * @property {string} dep - Le numéro ou nom du département (ex: 'Paris (75)', 'Seine-Maritime (76)')
 * @property {string} prefecture - Le nom de la préfecture/commune associée (ex: 'la préfecture de Paris', 'la préfecture de la Seine-Maritime')
 */

/** @type {Record<string, VilleSEO>} */
export const villesSEO = {
	'paris': {
		slug: 'paris',
		name: 'Paris',
		prep: 'à',
		prepArticle: 'à Paris',
		dep: 'Paris (75)',
		prefecture: 'la préfecture de Paris'
	},
	'marseille': {
		slug: 'marseille',
		name: 'Marseille',
		prep: 'à',
		prepArticle: 'à Marseille',
		dep: 'Bouches-du-Rhône (13)',
		prefecture: 'la préfecture des Bouches-du-Rhône'
	},
	'lyon': {
		slug: 'lyon',
		name: 'Lyon',
		prep: 'à',
		prepArticle: 'à Lyon',
		dep: 'Rhône (69)',
		prefecture: 'la préfecture du Rhône'
	},
	'toulouse': {
		slug: 'toulouse',
		name: 'Toulouse',
		prep: 'à',
		prepArticle: 'à Toulouse',
		dep: 'Haute-Garonne (31)',
		prefecture: 'la préfecture de Haute-Garonne'
	},
	'nice': {
		slug: 'nice',
		name: 'Nice',
		prep: 'à',
		prepArticle: 'à Nice',
		dep: 'Alpes-Maritimes (06)',
		prefecture: 'la préfecture des Alpes-Maritimes'
	},
	'nantes': {
		slug: 'nantes',
		name: 'Nantes',
		prep: 'à',
		prepArticle: 'à Nantes',
		dep: 'Loire-Atlantique (44)',
		prefecture: 'la préfecture de Loire-Atlantique'
	},
	'montpellier': {
		slug: 'montpellier',
		name: 'Montpellier',
		prep: 'à',
		prepArticle: 'à Montpellier',
		dep: 'Hérault (34)',
		prefecture: 'la préfecture de l\'Hérault'
	},
	'strasbourg': {
		slug: 'strasbourg',
		name: 'Strasbourg',
		prep: 'à',
		prepArticle: 'à Strasbourg',
		dep: 'Bas-Rhin (67)',
		prefecture: 'la préfecture du Bas-Rhin'
	},
	'bordeaux': {
		slug: 'bordeaux',
		name: 'Bordeaux',
		prep: 'à',
		prepArticle: 'à Bordeaux',
		dep: 'Gironde (33)',
		prefecture: 'la préfecture de la Gironde'
	},
	'lille': {
		slug: 'lille',
		name: 'Lille',
		prep: 'à',
		prepArticle: 'à Lille',
		dep: 'Nord (59)',
		prefecture: 'la préfecture du Nord'
	},
	'rennes': {
		slug: 'rennes',
		name: 'Rennes',
		prep: 'à',
		prepArticle: 'à Rennes',
		dep: 'Ille-et-Vilaine (35)',
		prefecture: 'la préfecture d\'Ille-et-Vilaine'
	},
	'reims': {
		slug: 'reims',
		name: 'Reims',
		prep: 'à',
		prepArticle: 'à Reims',
		dep: 'Marne (51)',
		prefecture: 'la sous-préfecture de Reims'
	},
	'toulon': {
		slug: 'toulon',
		name: 'Toulon',
		prep: 'à',
		prepArticle: 'à Toulon',
		dep: 'Var (83)',
		prefecture: 'la préfecture du Var'
	},
	'saint-etienne': {
		slug: 'saint-etienne',
		name: 'Saint-Étienne',
		prep: 'à',
		prepArticle: 'à Saint-Étienne',
		dep: 'Loire (42)',
		prefecture: 'la préfecture de la Loire'
	},
	'le-havre': {
		slug: 'le-havre',
		name: 'Le Havre',
		prep: 'au',
		prepArticle: 'au Le Havre',
		dep: 'Seine-Maritime (76)',
		prefecture: 'la sous-préfecture du Havre'
	},
	'dijon': {
		slug: 'dijon',
		name: 'Dijon',
		prep: 'à',
		prepArticle: 'à Dijon',
		dep: 'Côte-d\'Or (21)',
		prefecture: 'la préfecture de Côte-d\'Or'
	},
	'grenoble': {
		slug: 'grenoble',
		name: 'Grenoble',
		prep: 'à',
		prepArticle: 'à Grenoble',
		dep: 'Isère (38)',
		prefecture: 'la préfecture de l\'Isère'
	},
	'angers': {
		slug: 'angers',
		name: 'Angers',
		prep: 'à',
		prepArticle: 'à Angers',
		dep: 'Maine-et-Loire (49)',
		prefecture: 'la préfecture de Maine-et-Loire'
	},
	'villeurbanne': {
		slug: 'villeurbanne',
		name: 'Villeurbanne',
		prep: 'à',
		prepArticle: 'à Villeurbanne',
		dep: 'Rhône (69)',
		prefecture: 'la préfecture du Rhône'
	},
	'nimes': {
		slug: 'nimes',
		name: 'Nîmes',
		prep: 'à',
		prepArticle: 'à Nîmes',
		dep: 'Gard (30)',
		prefecture: 'la préfecture du Gard'
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
	prefecture: 'votre préfecture ou mairie locale'
};
