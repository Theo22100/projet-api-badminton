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
            "self": halLinkObject('/users/$(userData.id)'),
            "users": halLinkObject('/users')
        },

        pseudo: userData.pseudo,
        id : userData.id,
        
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


module.exports = { halLinkObject, mapUserResourceObject, mapUserListToRessourceObject };
