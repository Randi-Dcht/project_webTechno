import {ADMIN, CONNEXION, STUDENT} from "./routes.js";


export const URL_CEDRES =
    [
        {
            "name" : "Elèves",
            "url" : ADMIN + '/students'
        },
        {
            "name" : "Annuaire",
            "url" : ADMIN + '/list'
        },
        {
            "name" : "Liste demandes",
            "url" : ADMIN + '/list-ask'
        },
        {
            "name" : "Log logiciel",
            "url" : ADMIN + '/log'
        },
        {
            "name" : "Agenda",
            "url" : ADMIN + '/deadline'
        },
        {
            "name" : "Paramètres",
            "url" : ADMIN + '/parameters'
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
        {
            "name" : "Mes documents",
            "url" : STUDENT + '/docs'
        },
        {
            "name" : "Mon calendrier",
            "url" : STUDENT + '/calendar'
        },
    ]

export const URL_VISITOR =
    [
        {
            "name" : "Connexion",
            "url" : CONNEXION + '/student'
        },
    ]

export const visitorUrl = {
    'Name' :'Cèdre Umons',
    'Root' : '/',
    'Url' : URL_VISITOR
}
export const studentUrl = {
    'Name' :'App élève',
    'Root' : STUDENT,
    'Url' : URL_STUDENT
}
export const adminUrl = {
    'Name' :'App adminitration',
    'Root' : ADMIN,
    'Url' : URL_CEDRES
}