/**
 * Export des fonctions helpers pour la spécification HAL
 * Voir la spécification HAL : https://stateless.group/hal_specification.html
 * Voir la spécification HAL (RFC, source) : https://datatracker.ietf.org/doc/html/draft-kelly-json-hal
 */

/**
 * Retourne un Link Object, conforme à la spécification HAL
 * @param {*} url 
 * @param {*} type 
 * @param {*} name 
 * @param {*} templated 
 * @param {*} deprecation 
 * @returns 
 */
function halLinkObject(url, type = '', name = '', templated = false, deprecation = false) {

    return {
        "href": url,
        "templated": templated,
        ...(type && { "type": type }),
        ...(name && { "name": name }),
        ...(deprecation && { "deprecation": deprecation })
    }
}

/**
 * Retourne une représentation Ressource Object (HAL) d'un user
 * @param {*} userData Données brutes d'un user
 * @returns un Ressource Object User (spec HAL)
 */
function mapUserResourceObject(userData, baseURL) {

    //La liste des users
    return {

        "_links": {
            "self": halLinkObject('/users/' + userData.id),
            "users": halLinkObject('/users')
        },

        pseudo: userData.pseudo,
        id : userData.id,
        
    }
}

function mapLoginResourceObject(userData, token) {
    return {
        "_links": {
            "self": halLinkObject('/login'),
            "user": halLinkObject('/users/' + userData.id),
            "logout": halLinkObject('/logout')	
        },
        token: token,
        type: "Bearer",
        pseudo: userData.pseudo,
        id : userData.id,
        isAdmin: userData.isAdmin
    }


}

function mapTerrainResourceObject(terrainData) {

    return {

        "_links": {
            "self": halLinkObject('/terrains/' + terrainData.id),
            "terrains": halLinkObject('/terrains')
        },

        name: terrainData.name,
        id : terrainData.id,
        isAvailable: terrainData.isAvailable,
        createdAt: terrainData.createdAt,
        updatedAt: terrainData.updatedAt
        
    }
}

function mapReservationResourceObject(reservationData) {

    return {

        "_links": {
            "self": halLinkObject('/reservations/' + reservationData.id),
            "reservations": halLinkObject('/reservations')
        },

        id: reservationData.id,
        userId: reservationData.userId,
        terrainId: reservationData.terrainId,
        startTime: reservationData.startTime,
        endTime: reservationData.endTime,
        createdAt: reservationData.createdAt,
        date: reservationData.date,
        createdAt: reservationData.createdAt,
        updatedAt: reservationData.updatedAt
        
    }
}

function mapReservationListToRessourceObject(reservationData) {

    const reservations = reservationData.map(reservation => mapReservationResourceObject(reservation));

    //la liste des reservations
    return {
        "_links": {
            "self": halLinkObject('/reservations')
        },
        "_embedded": {
            "reservations": reservations
        }
        
    }

}

function mapTerrainListToRessourceObject(terrainData) {
    
        const terrains = terrainData.map(terrain => mapTerrainResourceObject(terrain));
    
        //La liste des terrains
        return {
            "_links": {
                "self": halLinkObject('/terrains')
            },
            "_embedded": {
                "terrains": terrains
            }
            
        }
    }

function mapUserListToRessourceObject(userData) {

    const users = userData.map(user => mapUserResourceObject(user));


    //La liste des users
    return {
        "_links": {
            "self": halLinkObject('/users')
        },
        "_embedded": {
            "users": users
        }
        
    }
}


module.exports = { halLinkObject, mapUserResourceObject, mapUserListToRessourceObject, mapTerrainResourceObject, mapTerrainListToRessourceObject, mapReservationResourceObject, mapReservationListToRessourceObject, mapLoginResourceObject };
