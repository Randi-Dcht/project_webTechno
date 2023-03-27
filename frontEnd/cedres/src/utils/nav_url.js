import {ADMIN, STUDENT} from "./routes.js";

export const URL_CEDRES =
    [
        {
            "name" : "Accueil",
            "url" : ADMIN
        },
        {
            "name" : "Elèves",
            "url" : ADMIN + '/students'
        }
    ]

export const URL_STUDENT =
    [
        {
            "name" : "Accueil",
            "url" : STUDENT
        },
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
    ]

export const URL_VISITOR =
    [
        {
            "name" : "Accueil",
            "url" : '/'
        },
    ]