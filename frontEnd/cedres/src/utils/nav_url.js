import {ADMIN, CONNEXION, STUDENT} from "./routes.js";





export const URL_CEDRES =
    [
        {
            "name" : "Elèves",
            "url" : ADMIN + '/students'
        }
    ]

export const URL_STUDENT =
    [
        {
            "name" : "Mes cours",
            "url" : STUDENT + '/courses'
        },
        {
            "name" : "Mes aménagements",
            "url" : STUDENT + '/facilities'
        },
        {
            "name" : "Mes demandes",
            "url" : STUDENT + '/ask'
        },
        {
            "name" : "Mes informations",
            "url" : STUDENT + '/aboutMe'
        },
    ]

export const URL_VISITOR =
    [
        {
            "name" : "Connexion",
            "url" : CONNEXION + '/student'
        },
    ]