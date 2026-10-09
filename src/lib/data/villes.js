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
 * @property {string} [adresseMairie] - L'adresse de la mairie
 * @property {string} [horairesMairie] - Les horaires de la mairie
 * @property {string} [linkRdvMairie] - Le lien de prise de RDV
 * @property {string} [mapQuery] - La requête pour Google Maps
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
		mairie: 'l\'Hôtel de Ville de Paris',
		adresseMairie: 'Place de l\'Hôtel de Ville, 75004 Paris',
		horairesMairie: 'Du Lundi au Vendredi : 08h30 - 17h00',
		linkRdvMairie: 'https://www.paris.fr/pages/un-rendez-vous-pour-votre-passeport-ou-votre-carte-d-identite-2053',
		mapQuery: 'Place+de+l+Hôtel+de+Ville+75004+Paris'
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
		mairie: 'l\'Hôtel de Ville de Marseille',
		adresseMairie: 'Quai du Port, 13002 Marseille',
		horairesMairie: 'Du Lundi au Vendredi : 08h30 - 17h30',
		linkRdvMairie: 'https://www.marseille.fr/demarches/passeport-et-carte-d-identite',
		mapQuery: 'Quai+du+Port+13002+Marseille'
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
		mairie: 'l\'Hôtel de Ville de Lyon',
		adresseMairie: '1 Place de la Comédie, 69001 Lyon',
		horairesMairie: 'Du Lundi au Vendredi : 08h45 - 16h45',
		linkRdvMairie: 'https://www.lyon.fr/demarche/papiers-didentite/carte-didentite-et-passeport-prise-de-rendez-vous',
		mapQuery: '1+Place+de+la+Comédie+69001+Lyon'
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
		mairie: 'la Mairie du Capitole de Toulouse',
		adresseMairie: 'Place du Capitole, 31000 Toulouse',
		horairesMairie: 'Du Lundi au Vendredi : 08h30 - 17h00',
		linkRdvMairie: 'https://www.toulouse.fr/web/demarches/-/carte-d-identite-et-passeport',
		mapQuery: 'Place+du+Capitole+31000+Toulouse'
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
		mairie: 'la Mairie de Nice',
		adresseMairie: '5 Rue de l\'Hôtel de Ville, 06300 Nice',
		horairesMairie: 'Du Lundi au Vendredi : 08h30 - 17h00',
		linkRdvMairie: 'https://www.nice.fr/fr/demarches/carte-nationale-d-identite-et-passeport',
		mapQuery: '5+Rue+de+l+Hôtel+de+Ville+06300+Nice'
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
		mairie: 'la Mairie de Nantes',
		adresseMairie: '2 Rue de l\'Hôtel de Ville, 44000 Nantes',
		horairesMairie: 'Du Lundi au Vendredi : 08h30 - 18h00',
		linkRdvMairie: 'https://metropole.nantes.fr/passeport-cni',
		mapQuery: '2+Rue+de+l+Hôtel+de+Ville+44000+Nantes'
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
		mairie: 'la Mairie de Montpellier',
		adresseMairie: '1 Place Georges Frêche, 34267 Montpellier',
		horairesMairie: 'Du Lundi au Vendredi : 08h30 - 17h30',
		linkRdvMairie: 'https://www.montpellier.fr/4134-prise-de-rendez-vous-en-ligne.htm',
		mapQuery: '1+Place+Georges+Frêche+34267+Montpellier'
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
		mairie: 'l\'Hôtel de Ville de Strasbourg',
		adresseMairie: '1 Parc de l\'Étoile, 67076 Strasbourg',
		horairesMairie: 'Du Lundi au Vendredi : 08h00 - 17h30',
		linkRdvMairie: 'https://www.strasbourg.eu/carte-identite-passeport',
		mapQuery: '1+Parc+de+l+Étoile+67076+Strasbourg'
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
		mairie: 'la Mairie de Bordeaux',
		adresseMairie: 'Place Pey Berland, 33000 Bordeaux',
		horairesMairie: 'Du Lundi au Vendredi : 08h30 - 17h00',
		linkRdvMairie: 'https://www.bordeaux.fr/p121666/passeport-et-carte-nationale-d-identite-cni-',
		mapQuery: 'Place+Pey+Berland+33000+Bordeaux'
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
		mairie: 'l\'Hôtel de Ville de Lille',
		adresseMairie: 'Place Augustin Laurent, 59000 Lille',
		horairesMairie: 'Du Lundi au Vendredi : 08h00 - 17h00',
		linkRdvMairie: 'https://www.lille.fr/Mes-demarches/Passeport-et-Carte-d-identite',
		mapQuery: 'Place+Augustin+Laurent+59000+Lille'
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
		mairie: 'la Mairie de Rennes',
		adresseMairie: 'Place de la Mairie, 35000 Rennes',
		horairesMairie: 'Du Lundi au Vendredi : 09h00 - 17h00',
		linkRdvMairie: 'https://metropole.rennes.fr/mes-demarches/carte-didentite-et-passeport',
		mapQuery: 'Place+de+la+Mairie+35000+Rennes'
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
		mairie: 'la Mairie de Reims',
		adresseMairie: '9 Place de l\'Hôtel de Ville, 51100 Reims',
		horairesMairie: 'Du Lundi au Vendredi : 08h30 - 17h00',
		linkRdvMairie: 'https://www.reims.fr/mes-demarches/carte-didentite-et-passeport',
		mapQuery: '9+Place+de+l+Hôtel+de+Ville+51100+Reims'
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
		mairie: 'la Mairie de Toulon',
		adresseMairie: 'Avenue de la République, 83000 Toulon',
		horairesMairie: 'Du Lundi au Vendredi : 08h30 - 16h30',
		linkRdvMairie: 'https://toulon.fr/mes-demarches/carte-didentite-et-passeport',
		mapQuery: 'Avenue+de+la+République+83000+Toulon'
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
		mairie: 'la Mairie de Saint-Étienne',
		adresseMairie: 'Place Hôtel de Ville, 42000 Saint-Étienne',
		horairesMairie: 'Du Lundi au Vendredi : 08h45 - 17h00',
		linkRdvMairie: 'https://www.saint-etienne.fr/demarches/passeport-cni',
		mapQuery: 'Place+Hôtel+de+Ville+42000+Saint-Etienne'
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
		mairie: 'la Mairie du Havre',
		adresseMairie: '151 Rue de Paris, 76600 Le Havre',
		horairesMairie: 'Du Lundi au Vendredi : 08h00 - 17h00',
		linkRdvMairie: 'https://www.lehavre.fr/demarches/carte-didentite-et-passeport',
		mapQuery: '151+Rue+de+Paris+76600+Le+Havre'
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
		mairie: 'la Mairie de Dijon',
		adresseMairie: 'Place de la Libération, 21000 Dijon',
		horairesMairie: 'Du Lundi au Vendredi : 08h30 - 17h00',
		linkRdvMairie: 'https://www.dijon.fr/Mes-demarches/Carte-d-identite-Passeport',
		mapQuery: 'Place+de+la+Libération+21000+Dijon'
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
		mairie: 'la Mairie de Grenoble',
		adresseMairie: '1 Boulevard Jean Pain, 38000 Grenoble',
		horairesMairie: 'Du Lundi au Vendredi : 08h00 - 17h00',
		linkRdvMairie: 'https://www.grenoble.fr/demarche/135/655-passeport-et-carte-d-identite.htm',
		mapQuery: '1+Boulevard+Jean+Pain+38000+Grenoble'
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
		mairie: 'la Mairie d\'Angers',
		adresseMairie: 'Boulevard Résistance et Déportation, 49000 Angers',
		horairesMairie: 'Du Lundi au Vendredi : 09h00 - 17h30',
		linkRdvMairie: 'https://www.angers.fr/mes-demarches/carte-d-identite-et-passeport/index.html',
		mapQuery: 'Boulevard+Résistance+et+Déportation+49000+Angers'
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
		mairie: 'la Mairie de Villeurbanne',
		adresseMairie: 'Place Lazare-Goujon, 69100 Villeurbanne',
		horairesMairie: 'Du Lundi au Vendredi : 08h30 - 17h00',
		linkRdvMairie: 'https://www.villeurbanne.fr/demarches/papiers-d-identite',
		mapQuery: 'Place+Lazare+Goujon+69100+Villeurbanne'
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
		mairie: 'la Mairie de Nîmes',
		adresseMairie: 'Place de l\'Hôtel de Ville, 30000 Nîmes',
		horairesMairie: 'Du Lundi au Vendredi : 08h00 - 17h00',
		linkRdvMairie: 'https://www.nimes.fr/demarches/cni-et-passeport.html',
		mapQuery: 'Place+de+l+Hôtel+de+Ville+30000+Nîmes'
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
