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
 * @property {string} localIntro - Contexte local personnalisé (en-tête / spécificité métropole)
 * @property {string} localTip - Conseil et astuce démarche pour les habitants de la ville
 * @property {string[]} pointsRecueil - Liste des mairies de quartier / pôles équipés de stations biométriques
 * @property {string} [delaisInfo] - Information sur la tension des créneaux de RDV
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
		mapQuery: 'Place+de+l+Hôtel+de+Ville+75004+Paris',
		localIntro: 'À Paris, les délais de rendez-vous en mairie d\'arrondissement et dans les centres de titres d\'identité sont particulièrement tendus, avec souvent plusieurs semaines d\'attente pour déposer un dossier de passeport ou de CNI. Réaliser vos photos d\'identité certifiées ou votre code e-Photo ANTS chez vous avec IDidem vous permet d\'arriver au guichet avec un dossier 100% conforme et d\'éviter tout rejet de photo qui vous ferait perdre votre précieux créneau.',
		localTip: 'Pensez à effectuer votre pré-demande sur le portail ANTS avant votre rendez-vous. Vous pouvez déposer votre dossier dans n\'importe quelle mairie d\'arrondissement de Paris (15e, 18e, 11e, etc.) ou dans les antennes de la Préfecture de Police, quel que soit votre arrondissement de domicile.',
		pointsRecueil: [
			'Mairie du 15e (Rue Péclet)',
			'Mairie du 18e (Place Jules Joffrin)',
			'Mairie du 11e (Place Léon Blum)',
			'Mairie du 13e (Place d\'Italie)',
			'Antenne de Police du 12e (Avenue Daumesnil)'
		],
		delaisInfo: 'Forte affluence : anticipez votre prise de rendez-vous 2 à 3 mois à l\'avance, notamment avant les vacances scolaires.'
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
		mapQuery: 'Quai+du+Port+13002+Marseille',
		localIntro: 'Dans la cité phocéenne, la prise de rendez-vous pour un passeport ou une carte d\'identité s\'effectue auprès des différents bureaux municipaux de proximité (BMP) et mairies de secteur. Les créneaux partent très vite, notamment à l\'approche de la période estivale. Avec IDidem, générez vos e-photos ANTS et photos d\'identité certifiées depuis chez vous à Marseille sans subir la chaleur, les embouteillages ou les files d\'attente en cabine.',
		localTip: 'Les Marseillais peuvent déposer leur demande dans n\'importe quel Bureau Municipal de Proximité (BMP) de la ville, sans obligation d\'aller dans leur propre arrondissement. Arrivez avec votre planche de photos imprimée et votre numéro de pré-demande.',
		pointsRecueil: [
			'Mairie 1er/7e (La Canebière)',
			'Mairie 6e/8e (Villa Bagatelle)',
			'Mairie 4e/5e (Boulevard Blancarde)',
			'Mairie 11e/12e (Boulevard Bouyala d\'Arnaud)',
			'BMP Saint-Jérôme (13e)'
		],
		delaisInfo: 'Période de pointe de mai à juillet : privilégiez les créneaux matinaux dans les mairies de secteur périphériques.'
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
		mapQuery: '1+Place+de+la+Comédie+69001+Lyon',
		localIntro: 'À Lyon, les demandes de titres d\'identité se concentrent dans les mairies des 9 arrondissements, où les créneaux de dépôt sont souvent saturés plusieurs semaines à l\'avance. Prendre vos photos d\'identité ou votre e-Photo ANTS chez vous sur IDidem vous garantit des clichés 100% conformes aux exigences strictes de la Ville de Lyon et de la Préfecture du Rhône, sans risque de devoir reprendre rendez-vous suite à un rejet au guichet.',
		localTip: 'Les créneaux de rendez-vous sont mis à jour quotidiennement sur le site de la Ville de Lyon. Vous n\'êtes pas obligé de réserver dans votre arrondissement de résidence : les mairies du 3e (place Guichard), du 7e ou du 8e disposent souvent de plages supplémentaires.',
		pointsRecueil: [
			'Mairie du 3e arrondissement (Place Guichard)',
			'Mairie du 7e arrondissement (Place Jean Macé)',
			'Mairie du 8e arrondissement (Avenue Jean Mermoz)',
			'Mairie du 6e arrondissement (Rue de Sèze)',
			'Mairie du 9e (Place du Marché - Vaise)'
		],
		delaisInfo: 'Renouvellement quotidien des rendez-vous en ligne à 8h45 et 13h sur le portail de la Ville de Lyon.'
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
		mapQuery: 'Place+du+Capitole+31000+Toulouse',
		localIntro: 'Dans la métropole toulousaine, la Ville rose propose plusieurs pôles de formalités administratives et mairies de quartier pour déposer son passeport ou sa CNI. Les délais pouvant s\'allonger rapidement, avoir ses photos d\'identité prêtes et son code e-Photo ANTS en poche dès la prise de rendez-vous est essentiel pour fluidifier votre démarche.',
		localTip: 'À Toulouse, la Mairie du Capitole n\'est pas le seul lieu de recueil : privilégiez les mairies de quartier comme Saint-Cyprien, Minimes ou Saouzelong pour obtenir des délais de rendez-vous souvent plus courts et un accès facilité en métro ou avec parking.',
		pointsRecueil: [
			'Mairie de quartier Saint-Cyprien (Place Roguet)',
			'Mairie de quartier des Minimes (Place du Marché aux Cochons)',
			'Mairie de quartier Saouzelong (Avenue Albert Bedouce)',
			'Maison de la Citoyenneté Rive Gauche',
			'Mairie du Capitole'
		],
		delaisInfo: 'Ouverture de nouveaux créneaux chaque semaine sur le portail toulouse.fr.'
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
		mapQuery: '5+Rue+de+l+Hôtel+de+Ville+06300+Nice',
		localIntro: 'Sur la Côte d\'Azur, les services de l\'état civil de la Ville de Nice accueillent des milliers de demandes chaque mois pour les passeports, cartes d\'identité et permis de conduire. Grâce à IDidem, réalisez vos photos conformes OACI et e-photos ANTS directement depuis votre smartphone à Nice, évitant les cabines automatiques souvent bondées en centre-ville ou dans les centres commerciaux.',
		localTip: 'La Ville de Nice dispose d\'un réseau dense de mairies annexes (Thiole, Magnan, Saint-Roch, Le Ray, etc.). N\'hésitez pas à élargir votre recherche de créneau à l\'ensemble des mairies annexes niçoises pour trouver un créneau rapide.',
		pointsRecueil: [
			'Mairie annexe Thiole (Rue Malausséna)',
			'Mairie annexe Magnan (Rue de France)',
			'Mairie annexe Saint-Roch (Boulevard Saint-Roch)',
			'Mairie annexe Le Ray (Place Fontaine du Temple)',
			'Maison de l\'Habitant de l\'Ariane'
		],
		delaisInfo: 'Délai moyen d\'obtention de rendez-vous de 3 à 5 semaines sur l\'agglomération niçoise.'
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
		mapQuery: '2+Rue+de+l+Hôtel+de+Ville+44000+Nantes',
		localIntro: 'Dans la métropole nantaise, la demande de titres d\'identité est soutenue tout au long de l\'année. Les démarches se font soit à l\'Hôtel de Ville de Nantes, soit dans l\'une des 10 mairies de quartier. Avec IDidem, préparez votre dossier sereinement : notre validation biométrique garantit que votre photo sera acceptée sans accroc par les agents de la mairie nantaise.',
		localTip: 'Pour votre dépôt de dossier à Nantes, les mairies de quartier de Chantenay, Doulon ou Nantes Sud offrent un accueil très efficace et sont facilement accessibles en tramway ou avec des zones de stationnement gratuites à proximité.',
		pointsRecueil: [
			'Mairie de quartier Chantenay (Place de la Liberté)',
			'Mairie de quartier Doulon (Boulevard Louis Millet)',
			'Mairie de quartier Nantes Sud (Rue Saint-Jacques)',
			'Mairie de quartier Île de Nantes (Rue La Noue Bras de Fer)',
			'Mairie centrale (Rue de l\'Hôtel de Ville)'
		],
		delaisInfo: 'Prise de rendez-vous obligatoire en ligne via e-services.nantesmetropole.fr.'
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
		mapQuery: '1+Place+Georges+Frêche+34267+Montpellier',
		localIntro: 'À Montpellier, les dépôts de passeports et CNI sont gérés par l\'Hôtel de Ville central et plusieurs mairies de proximité réparties sur l\'ensemble des quartiers. Avec la forte croissance démographique héraultaise, les créneaux partent très vite. Réalisez votre photo d\'identité ou e-photo ANTS en 2 minutes chez vous à Montpellier avec IDidem pour sécuriser votre démarche.',
		localTip: 'Les mairies de proximité de Port Marianne, Mosson, Tastavin ou Croix-d\'Argent permettent de déposer votre dossier en évitant l\'affluence de l\'Hôtel de Ville de la place Georges Frêche.',
		pointsRecueil: [
			'Mairie de proximité Port Marianne (Place Georges Frêche)',
			'Mairie de proximité Mosson (Rue de la Paix)',
			'Mairie de proximité Tastavin (Avenue de la Justice de Castelnau)',
			'Mairie de proximité François Villon (Croix-d\'Argent)',
			'Mairie centrale de Montpellier'
		],
		delaisInfo: 'Pensez à surveiller les créneaux annulés libérés chaque matin sur le site montpellier.fr.'
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
		mapQuery: '1+Parc+de+l+Étoile+67076+Strasbourg',
		localIntro: 'Capitale européenne et pôle administratif majeur du Grand Est, Strasbourg concentre une activité intense pour la délivrance des passeports et cartes d\'identité. IDidem vous simplifie la vie : prenez votre photo d\'identité biométrique ou e-photo agréée ANTS confortablement chez vous à Strasbourg, 100% conforme aux directives de l\'Eurométropole et de la Préfecture du Bas-Rhin.',
		localTip: 'La Ville et l\'Eurométropole de Strasbourg disposent de nombreuses mairies de quartier équipées du dispositif de recueil (Neudorf, Cronenbourg, Robertsau, Hautepierre). Vous pouvez vous rendre dans la mairie de quartier de votre choix, même en dehors de votre zone d\'habitation.',
		pointsRecueil: [
			'Mairie de quartier Neudorf (Place du Marché Neudorf)',
			'Mairie de quartier Cronenbourg (Rue de Hochfelden)',
			'Mairie de quartier Robertsau (Rue Boecklin)',
			'Mairie de quartier Koenigshoffen (Rue du Tournant)',
			'Centre administratif (Parc de l\'Étoile)'
		],
		delaisInfo: 'Pensez à vous munir de votre récapitulatif de pré-demande imprimé avec votre photo IDidem aux normes 35x45mm.'
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
		mapQuery: 'Place+Pey+Berland+33000+Bordeaux',
		localIntro: 'À Bordeaux, la forte demande de passeports et de renouvellements de CNI sature régulièrement les plannings de la Mairie centrale et des 8 mairies de quartier. En utilisant IDidem depuis votre domicile bordelais, vous obtenez des photos conformes du premier coup, validées par un algorithme biométrique professionnel et conformes aux exigences de la Préfecture de la Gironde.',
		localTip: 'Plutôt que la Mairie centrale place Pey Berland, pensez aux mairies de quartier comme Caudéran, Nansouty ou Bordeaux Maritime, souvent plus accessibles en bus/tram avec des délais d\'attente sur place plus fluides.',
		pointsRecueil: [
			'Mairie de quartier Caudéran (Place des Martyrs de la Résistance)',
			'Mairie de quartier Nansouty (Place Nansouty)',
			'Mairie de quartier Bordeaux Maritime (Rue Achard)',
			'Mairie de quartier Grand Parc (Place de l\'Europe)',
			'Hôtel de Ville (Place Pey Berland)'
		],
		delaisInfo: 'Les créneaux de rendez-vous sont ouverts jusqu\'à 60 jours à l\'avance sur bordeaux.fr.'
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
		mapQuery: 'Place+Augustin+Laurent+59000+Lille',
		localIntro: 'Dans la capitale des Flandres, les démarches d\'état civil s\'effectuent à l\'Hôtel de Ville ou dans les mairies de quartier lilloises (Wazemmes, Fives, Vauban, etc.). Avec les exigences rigoureuses de la Préfecture du Nord, une photo non conforme signifie un rejet immédiat. IDidem sécurise vos démarches en vous fournissant une planche certifiée ou un code e-Photo ANTS en 2 minutes depuis votre canapé.',
		localTip: 'À Lille, les mairies de quartier de Wazemmes, Fives, Saint-Maurice Pellevoisin et Lille-Sud disposent de stations d\'enregistrement biométriques. Vous pouvez prendre rendez-vous dans n\'importe laquelle de ces mairies selon les disponibilités.',
		pointsRecueil: [
			'Mairie de quartier Wazemmes (Rue de l\'Abbé Aerts)',
			'Mairie de quartier Fives (Rue de Lannoy)',
			'Mairie de quartier Lille-Sud (Rue de l\'Asie)',
			'Mairie de quartier Saint-Maurice Pellevoisin (Rue Saint-Gabriel)',
			'Hôtel de Ville de Lille (Place Augustin Laurent)'
		],
		delaisInfo: 'Vérifiez régulièrement le module de prise de rendez-vous sur lille.fr où des désistements apparaissent en début de journée.'
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
		mapQuery: 'Place+de+la+Mairie+35000+Rennes',
		localIntro: 'À Rennes, la Ville et la Métropole proposent plusieurs pôles administratifs répartis dans les quartiers rennais pour enregistrer les demandes de passeports et cartes d\'identité. Pour éviter les trajets en centre-ville et les photomatons souvent défectueux ou mal réglés, faites votre photo avec IDidem : résultat instantané, conforme aux normes de la Préfecture d\'Ille-et-Vilaine.',
		localTip: 'Les mairies de quartier de Villejean, Le Blosne, Maurepas et Thabor-Saint-Hélier vous accueillent sur rendez-vous. Elles sont très bien desservies par les lignes de métro A et B et permettent un dépôt de dossier rapide.',
		pointsRecueil: [
			'Mairie de quartier Villejean (Rue de Bourgogne)',
			'Mairie de quartier Le Blosne (Place de Zagreb)',
			'Mairie de quartier Maurepas (Place Lucie et Raymond Aubrac)',
			'Mairie de quartier Thabor - Saint-Hélier (Rue de Châteaudun)',
			'Hôtel de Ville de Rennes (Place de la Mairie)'
		],
		delaisInfo: 'Les créneaux de RDV se réservent directement sur metropole.rennes.fr.'
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
		mapQuery: '9+Place+de+l+Hôtel+de+Ville+51100+Reims',
		localIntro: 'Dans la cité des Sacres, l\'obtention d\'un titre d\'identité nécessite un rendez-vous à l\'Hôtel de Ville ou dans l\'une des mairies de proximité de Reims. Grâce à IDidem, vous créez votre photo d\'identité officielle ou e-photo ANTS directement depuis votre smartphone en 2 minutes, avec la garantie d\'une validation totale auprès de la Mairie de Reims et de la Sous-Préfecture de la Marne.',
		localTip: 'Pour éviter l\'affluence du centre-ville, privilégiez les mairies de proximité rémoises de Murigny, Châtillons ou Orgeval, qui disposent de guichets biométriques et d\'accès faciles avec parkings à proximité.',
		pointsRecueil: [
			'Mairie de proximité Murigny (Place René Clair)',
			'Mairie de proximité Châtillons (Place des Argonautes)',
			'Mairie de proximité Orgeval (Place Thiers)',
			'Mairie de proximité Europe (Rue de l\'Escaut)',
			'Hôtel de Ville de Reims (Place de l\'Hôtel de Ville)'
		],
		delaisInfo: 'Réservation en ligne accessible 24h/24 sur le site reims.fr.'
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
		mapQuery: 'Avenue+de+la+République+83000+Toulon',
		localIntro: 'À Toulon, les dépôts de passeports biométriques et de cartes d\'identité sont assurés par l\'Hôtel de Ville et les mairies annexes disséminées dans les différents quartiers de la ville. Évitez de vous déplacer sous le soleil varois pour trouver une cabine photo : avec IDidem, votre cliché conforme OACI et votre code e-Photo ANTS sont prêts sur votre smartphone en 120 secondes.',
		localTip: 'Les mairies annexes du Mourillon, du Pont-du-Las, de Sainte-Musse et de Saint-Jean-du-Var sont habilitées pour les titres sécurisés. Elles sont souvent plus calmes et pratiques pour stationner que le centre ancien.',
		pointsRecueil: [
			'Mairie annexe Le Mourillon (Rue Lamalgue)',
			'Mairie annexe Pont-du-Las (Rue Castillon)',
			'Mairie annexe Sainte-Musse (Rue Félix Mayol)',
			'Mairie annexe Saint-Jean-du-Var (Avenue François Cuzin)',
			'Mairie centrale de Toulon (Avenue de la République)'
		],
		delaisInfo: 'Prise de rendez-vous centralisée sur le site de la Ville de Toulon.'
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
		mapQuery: 'Place+Hôtel+de+Ville+42000+Saint-Etienne',
		localIntro: 'Dans la préfecture de la Loire, les Stéphanois peuvent renouveler ou créer leurs titres d\'identité à l\'Hôtel de Ville ou dans les mairies de proximité réparties sur la commune. IDidem vous permet de réaliser chez vous une photo d\'identité 100% conforme aux exigences strictes de la Préfecture de la Loire, sans risquer un rejet pour cause de reflets ou de fond inadéquat.',
		localTip: 'Pensez aux mairies de proximité de Centre-Deux, Terrenoire, Montaud ou La Métare pour déposer votre dossier : les disponibilités y sont fréquemment plus rapides qu\'à l\'Hôtel de Ville principal.',
		pointsRecueil: [
			'Mairie de proximité Centre-Deux (Rue de la République)',
			'Mairie de proximité Terrenoire (Rue du Docteur Treille)',
			'Mairie de proximité Montaud (Rue Saint-Roch)',
			'Mairie de proximité La Métare (Boulevard Alexandre de Fraissinette)',
			'Hôtel de Ville de Saint-Étienne (Place Hôtel de Ville)'
		],
		delaisInfo: 'Munissez-vous de votre pré-demande ANTS et de vos 6 photos découpées au format 35x45mm.'
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
		mapQuery: '151+Rue+de+Paris+76600+Le+Havre',
		localIntro: 'Au Havre, première ville de Normandie, les demandes de passeports et CNI sont enregistrées à l\'Hôtel de Ville ainsi que dans les mairies annexes des quartiers hauts et bas. IDidem vous évite la course aux cabines dans les centres commerciaux et vous garantit une photo conforme OACI et un code e-Photo ANTS valide pour toutes vos démarches administratives locales.',
		localTip: 'Les mairies annexes de Caucriauville, Sanvic, Graville et Bléville disposent toutes de stations biométriques d\'enregistrement. Choisissez la mairie la plus proche de votre domicile ou lieu de travail sur le littoral havrais.',
		pointsRecueil: [
			'Mairie annexe Caucriauville (Rue Jules Vallès)',
			'Mairie annexe Sanvic (Rue Romain Rolland)',
			'Mairie annexe Graville (Rue de Verdun)',
			'Mairie annexe Bléville (Place Alphonse Martin)',
			'Hôtel de Ville du Havre (Rue de Paris)'
		],
		delaisInfo: 'Rendez-vous à réserver sur le portail lehavre.fr avec confirmation par SMS.'
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
		mapQuery: 'Place+de+la+Libération+21000+Dijon',
		localIntro: 'Dans la capitale des ducs de Bourgogne, la Ville de Dijon accueille les usagers pour leurs démarches de titres à l\'Hôtel de Ville et dans ses mairies de quartier. Prendre sa photo sur IDidem depuis son domicile dijonnais vous assure un cadrage biométrique millimétré, sans stress, validé pour l\'instruction par la Préfecture de Côte-d\'Or.',
		localTip: 'Les mairies de quartier des Grésilles, de Fontaine d\'Ouche, de Montchapet ou des Bourroches permettent d\'effectuer sa démarche d\'enregistrement d\'empreintes dans un cadre de proximité avec stationnement souvent plus aisé qu\'au centre historique.',
		pointsRecueil: [
			'Mairie de quartier Grésilles (Avenue des Grésilles)',
			'Mairie de quartier Fontaine d\'Ouche (Place de la Fontaine d\'Ouche)',
			'Mairie de quartier Montchapet (Rue de la Broche)',
			'Mairie de quartier Bourroches (Boulevard Eugène Fyot)',
			'Hôtel de Ville de Dijon (Place de la Libération)'
		],
		delaisInfo: 'Pensez à renouveler vos titres plusieurs mois avant la date d\'expiration.'
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
		mapQuery: '1+Boulevard+Jean+Pain+38000+Grenoble',
		localIntro: 'Au cœur de la métropole alpine, la Ville de Grenoble gère les demandes de passeports et cartes d\'identité au sein de ses différents secteurs municipaux. Avec IDidem, réalisez votre photo certifiée ou votre e-photo ANTS officielle chez vous en 2 minutes, adaptée à toute la famille et garantie sans rejet auprès des services de la Préfecture de l\'Isère.',
		localTip: 'Pour vos dépôts à Grenoble, les antennes de mairie des Secteurs 2, 3, 4 et 6 accueillent les usagers sur rendez-vous. Vous pouvez sélectionner librement l\'antenne qui propose le créneau le plus rapide sur grenoble.fr.',
		pointsRecueil: [
			'Antenne Mairie Secteur 2 (Hôtel de Ville - Boulevard Jean Pain)',
			'Antenne Mairie Secteur 3 (Rue Ampère)',
			'Antenne Mairie Secteur 4 (Rue Henri Duhamel)',
			'Antenne Mairie Secteur 6 (Avenue La Bruyère)',
			'Maison des Habitants Chorier-Berriat'
		],
		delaisInfo: 'Ouverture progressive de créneaux d\'urgence chaque semaine sur le site de la ville.'
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
		mapQuery: 'Boulevard+Résistance+et+Déportation+49000+Angers',
		localIntro: 'Dans la métropole angevine, la délivrance des passeports et cartes nationales d\'identité s\'effectue à l\'Hôtel de Ville ainsi que dans plusieurs relais mairie de quartier. IDidem vous simplifie la vie en Anjou : créez votre cliché biométrique conforme ou votre code e-Photo ANTS sur votre smartphone, validé à 100% par l\'administration du Maine-et-Loire.',
		localTip: 'Pensez aux relais mairie de Belle-Beille, de la Roseraie, des Deux-Croix ou de Monplaisir pour votre rendez-vous de dépôt. Ils offrent un service identique à l\'Hôtel de Ville avec un accueil de proximité fluide.',
		pointsRecueil: [
			'Relais Mairie Belle-Beille (Avenue Notre-Dame du Lac)',
			'Relais Mairie La Roseraie (Place Jean Vilar)',
			'Relais Mairie Deux-Croix (Boulevard des Deux Croix)',
			'Relais Mairie Monplaisir (Boulevard Auguste Allonneau)',
			'Hôtel de Ville d\'Angers (Boulevard Résistance et Déportation)'
		],
		delaisInfo: 'Prise de rendez-vous obligatoire via le portail angers.fr.'
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
		mapQuery: 'Place+Lazare+Goujon+69100+Villeurbanne',
		localIntro: 'Deuxième commune de la métropole lyonnaise, Villeurbanne compte plus de 150 000 habitants et une forte demande auprès de son service des titres d\'identité. Grâce à IDidem, obtenez immédiatement votre e-photo ANTS ou vos photos de passeport et CNI sans faire la queue dans les cabines des Gratte-Ciel ou du centre commercial. Conforme à 100% aux exigences de la Ville de Villeurbanne et de la Préfecture du Rhône.',
		localTip: 'Les dépôts de titres s\'effectuent à l\'Hôtel de Ville aux Gratte-Ciel ou à la Maison des Services Publics de Cusset. Vous pouvez également prendre rendez-vous dans les mairies d\'arrondissement de Lyon toutes proches si les créneaux villeurbannais sont complets.',
		pointsRecueil: [
			'Hôtel de Ville (Place Lazare-Goujon - Gratte-Ciel)',
			'Maison des Services Publics de Cusset (Rue Pierre-Voyant)',
			'Mairie de Lyon 3e (à 10 min en métro)',
			'Mairie de Lyon 6e (proche Charpennes)',
			'Préfecture du Rhône (Lyon 3e)'
		],
		delaisInfo: 'Dispositif d\'alerte SMS pour les rendez-vous libérés sur villeurbanne.fr.'
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
		mapQuery: 'Place+de+l+Hôtel+de+Ville+30000+Nîmes',
		localIntro: 'Dans la préfecture du Gard, les Nîmois effectuent leurs demandes de passeports et cartes d\'identité au centre d\'accueil de l\'Hôtel de Ville et dans les mairies annexes réparties sur la cité des Antonins. Avec IDidem, réalisez votre photo d\'identité conforme OACI et votre e-Photo ANTS chez vous au calme, évitant la chaleur et les contraintes de stationnement du centre nîmois.',
		localTip: 'Les mairies annexes de Pissevin, du Mas de Mingue, du Chemin Bas d\'Avignon et des Costières disposent de guichets de recueil biométrique. Elles sont idéales pour éviter l\'affluence du centre-ville et offrent des facilités de stationnement.',
		pointsRecueil: [
			'Mairie annexe Pissevin (Place Debussy)',
			'Mairie annexe Mas de Mingue (Rue François 1er)',
			'Mairie annexe Chemin Bas d\'Avignon (Avenue Jean Moulin)',
			'Mairie annexe Costières (Boulevard Salvador Allende)',
			'Hôtel de Ville de Nîmes (Place de l\'Hôtel de Ville)'
		],
		delaisInfo: 'Pensez à préparer votre pré-demande ANTS imprimée avec le QR code avant le rendez-vous.'
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
	mairie: 'votre mairie locale',
	adresseMairie: 'Mairie de votre commune',
	horairesMairie: 'Consultez les horaires de votre mairie',
	linkRdvMairie: 'https://passeport.ants.gouv.fr',
	mapQuery: 'France',
	localIntro: 'Prenez vos photos d\'identité biométriques et e-photos ANTS directement depuis votre smartphone partout en France, certifiées conformes aux exigences officielles.',
	localTip: 'Effectuez votre pré-demande en ligne sur le portail ANTS pour obtenir votre QR code avant votre rendez-vous en mairie.',
	pointsRecueil: [
		'Mairies équipées d\'un dispositif de recueil (DR)',
		'Préfectures et Sous-Préfectures'
	],
	delaisInfo: 'Anticipez vos démarches de 4 à 8 semaines avant toute échéance de voyage.'
};

/**
 * Calcule la cible de redirection 301 pour une URL [type_photo]/[ville].
 * Retourne null si l'URL est canonique et doit renvoyer 200 OK.
 * @param {string} typePhoto 
 * @param {string} slugVille 
 * @returns {string | null}
 */
export function getRedirectTarget(typePhoto, slugVille) {
	if (!slugVille) return null;
	const normalizedCity = slugVille.toLowerCase();
	const normalizedType = (typePhoto || '').toLowerCase();

	const isKnownIntention = [
		'photo-identite-en-ligne',
		'e-photo-ants-en-ligne',
		'photo-passeport-en-ligne',
		'photo-carte-identite-en-ligne',
		'portrait-professionnel-en-ligne'
	].includes(normalizedType);

	if (!isKnownIntention) {
		return null;
	}

	const ville = villesSEO[normalizedCity];
	if (!ville) {
		// Ville non répertoriée dans nos métropoles officielles
		return '/photo';
	}

	// URL canonique officielle du sitemap
	const canonicalPath = `/photo-identite-en-ligne/${normalizedCity}`;

	// Si l'URL actuelle diffère de l'URL canonique (ancienne intention ou casse non normalisée)
	if (normalizedType !== 'photo-identite-en-ligne' || typePhoto !== 'photo-identite-en-ligne' || slugVille !== normalizedCity) {
		return canonicalPath;
	}

	return null;
}
