# save this as app.py
import json
import os
from datetime import datetime
import logging
from flask_mail import Mail
from flask_mail import Message
from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from jwt import DecodeError, ExpiredSignatureError
from pytest import console_main
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from werkzeug.utils import secure_filename

# ------------------- CONFIG FLASK -------------------

app = Flask(__name__)
mail = Mail(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
app.config["JWT_SECRET_KEY"] = "key-of-datBase-secret"
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)
db = SQLAlchemy()
db.init_app(app)
jwt = JWTManager(app)
actual_year = "2022-2023"
actual_quadri = 1

# ------------------- CONFIG LOGGER -------------------

app.logger.setLevel(logging.INFO)
file_handler = logging.FileHandler('app.log')
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(logging.Formatter('%(asctime)s ** %(levelname)s ** %(message)s'))
app.logger.addHandler(file_handler)
# add date and time to log
logging.basicConfig(format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')


# ------------------- METHOD -------------------

def send_mail(subject, sender, recipients, text_body, html_body):
    """
    send mail
    :param subject:
    :param sender:
    :param recipients:
    :param text_body:
    :param html_body:
    :return:
    """
    # msg = Message(subject, sender=sender, recipients=recipients)
    # msg.body = text_body
    # msg.html = html_body
    # mail.send(msg)


def send_mail_new_student(email, path_to_connect):
    print("<a href='http://localhost:5173/student/first/" + str(path_to_connect) + "'>Compléter votre inscription</a>")
    send_mail("Compléter votre inscription", "demo.dchtrnd.be", [email], "Compléter votre inscription",
              "<a href='http://localhost:5173/student/first/" + str(path_to_connect) + "'>Compléter votre inscription</a>")
    app.logger.info("send mail to " + email)


def send_mail_listing(email, path_to_connect, to_send):
    print("<a href='http://localhost:5173/invite/" + to_send + "/" + str(path_to_connect) + "'>Ma liste</a>")
    send_mail("Elève à besoin spécifique", "demo.dchtrnd.be", [email], "Voir les élèves à besoin spécifique",
              "<a href='http://localhost:5173/invite/" + to_send + "/" + str(path_to_connect) + "'>Ma liste</a>")
    app.logger.info("send mail to " + email)

# ------------------- METHOD -------------------


def check_quadrimester(id):
    if id == 1:
        return [8, 12]
    elif id == 2:
        return [11, 12]
    else:
        return [8, 11, 12]


def getExamList(id, quadri):
    exam = db.session.query(examModel).filter_by(student=id).filter_by(quadrimester=quadri).all()
    list = []
    for e in exam:
        subList = []
        facilities = db.session.query(examFacilitiesModel).filter_by(exam=e.id).all()
        statu = db.session.query(examStatusModel).filter_by(exam=e.id).first()
        for c in facilities:
            facil = db.session.query(facilitiesModel).filter_by(id=c.facilities).first()
            subList.append({"id": c.id, "name": facil.name})
        course = db.session.query(courseModel).filter_by(id_aa=e.course).first()
        list.append({"id": e.id, "date": e.date, "hour": e.hour, "locale": e.locale, "type": e.type, "aa": e.course,
                     "course": course.name, "facilities": subList, "status": statu.status, "hourEnd": e.hour_end})

    return list


# ------------------- RESOURCES -------------------
# All resource (abstract) :


class AbstractResource(Resource):
    def __init__(self, model: db.Model) -> None:  # type: ignore
        super().__init__()
        self.model = model

    def get(self, id):
        return db.session.query(self.model).filter_by(id=id).first().as_dict(), 200

    def delete(self, id):
        db.session.query(self.model).filter_by(id=id).delete()
        db.session.commit()
        return "", 204

    def put(self, id):
        db.session.query(self.model).filter_by(id=id).update(request.json)
        db.session.commit()
        return "", 201


class AbstractListResource(Resource):
    def __init__(self, model: db.Model) -> None:  # type: ignore
        super().__init__()
        self.model = model

    def get(self):
        return [item.as_dict() for item in db.session.query(self.model).all()], 200

    def post(self):
        db.session.add(self.model(**request.json))
        db.session.commit()
        return "", 201


class AbstractListResourceById(Resource):
    def __init__(self, model: db.Model) -> None:  # type: ignore
        super().__init__()
        self.model = model

    def get(self, id):
        return [item.as_dict() for item in db.session.query(self.model).filter_by(id=id).all()], 200

    def post(self):
        db.session.add(self.model(**request.json))
        db.session.commit()
        return "", 201


# ------------------- MODEL DataBase -------------------
# All model :
class actionDateModel(db.Model):
    """
    action date model
    """
    __tablename__ = "actionDate"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date_start = db.Column(db.String(25), nullable=False)
    date_end = db.Column(db.String(25), nullable=False)
    name = db.Column(db.String(80), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class exampleFacilitiesModel(db.Model):
    """
    list facilities model
    """
    __tablename__ = "exampleFacilities"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class localModel(db.Model):
    """
    local model
    """
    __tablename__ = "local"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<local %r>" % self.name


class facultyModel(db.Model):
    """
    faculty model
    """
    __tablename__ = "faculty"
    id = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    mail = db.Column(db.String(120), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<faculty %r>" % self.name


class adminModel(db.Model):
    """
    admin model (person who can log in to the system)
    """
    __tablename__ = "admin"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    grade = db.Column(db.String(80), nullable=False, default="admin")  # admin / worker

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<admin %r>" % self.name


class studentModel(db.Model):
    """
    student model
    """
    __tablename__ = "student"
    matricule = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email_private = db.Column(db.String(120), nullable=False)
    faculty = db.Column(db.String(80), db.ForeignKey("faculty.id"), nullable=False)
    # password = db.Column(db.String(120), nullable=False)
    actif = db.Column(db.Boolean, nullable=False, default=False)  # if student is actif or not

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<student %r>" % self.name


class loginStudentModel(db.Model):
    """
    login model
    """
    __tablename__ = "loginStudent"
    matricule = db.Column(db.Integer, db.ForeignKey("student.matricule"), primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<login %r>" % self.email


class teacherModel(db.Model):
    """
    teacher model
    """
    __tablename__ = "teacher"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<teacher %r>" % self.name


class facilitiesModel(db.Model):
    """
    facilities model (unique for each student)
    """
    __tablename__ = "facilities"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(300), nullable=False, default=" ")
    type = db.Column(db.String(10), nullable=False)  # course or exam
    student = db.Column(db.Integer, db.ForeignKey("student.matricule"), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<facilities %r>" % self.name


class courseModel(db.Model):
    """
    course model
    """
    __tablename__ = "course"
    id_aa = db.Column(db.String(20), primary_key=True)  # INFO-1AA
    name = db.Column(db.String(80), nullable=False)
    year = db.Column(db.String(15), nullable=False)  # Bachelor, Master, PhD
    quadrimester = db.Column(db.Integer, nullable=False)  # 1, 2, 3
    passExam = db.Column(db.Integer, nullable=False)

    # 1 = january, 4 = june, 7 = september
    # Session 1 : 8 or 12
    # Session 2 : 11 or 12
    # Session 3 : 8 or 11 or 12

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<course %r>" % self.name


class courseStudentModel(db.Model):
    """
    courseStudent model (unique for each student)
    """
    __tablename__ = "courseStudent"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course = db.Column(db.String(20), db.ForeignKey("course.id_aa"), nullable=False)
    student = db.Column(db.Integer, db.ForeignKey("student.matricule"), nullable=False)
    teacher = db.Column(db.Integer, db.ForeignKey("teacher.id"), nullable=False)
    isSuccess = db.Column(db.String(15), nullable=False, default='false')

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<courseStudent %r>" % self.name


class courseFacilitiesModel(db.Model):
    """
    course facilities model (LIST) --> for each student (unique)
    """
    __tablename__ = "courseFacilities"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course = db.Column(db.String(20), db.ForeignKey("course.id_aa"), nullable=False)
    student = db.Column(db.Integer, db.ForeignKey("student.matricule"), nullable=False)
    facilities = db.Column(db.Integer, db.ForeignKey("facilities.id"), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<courseFacilities %r>" % self.name


class examModel(db.Model):
    """
    exam model --> for each student (unique)
    """
    __tablename__ = "exam"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course = db.Column(db.String(20), db.ForeignKey("course.id_aa"), nullable=False)
    student = db.Column(db.Integer, db.ForeignKey("student.matricule"), nullable=False)
    date = db.Column(db.String(25), nullable=False)
    hour = db.Column(db.String(10), nullable=False)
    hour_end = db.Column(db.String(10), nullable=False, default=" ")
    locale = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(10), nullable=False)  # oral or written
    quadrimester = db.Column(db.Integer, nullable=False)  # 1, 2, 3

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<exam %r>" % self.name


class examStatusModel(db.Model):
    """
    exam status model --> for each student (unique)
    """
    __tablename__ = "examStatus"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    exam = db.Column(db.Integer, db.ForeignKey("exam.id"), nullable=False)
    status = db.Column(db.String(15), nullable=False, default='tovalide')  # created, verification, accepted, refused
    comment = db.Column(db.String(300), nullable=False, default=" ")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<examStatus %r>" % self.name


class examFacilitiesModel(db.Model):
    """
    exam facilities model (LIST) --> for each student (unique)
    """
    __tablename__ = "examFacilities"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    exam = db.Column(db.Integer, db.ForeignKey("exam.id"), nullable=False)
    student = db.Column(db.Integer, db.ForeignKey("student.matricule"), nullable=False)
    facilities = db.Column(db.Integer, db.ForeignKey("facilities.id"), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<examFacilities %r>" % self.name


class documentsModel(db.Model):
    """
    documents model
    """
    __tablename__ = "documents"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    name = db.Column(db.String(200), nullable=False)
    pushBy = db.Column(db.String(20), nullable=False)
    student = db.Column(db.Integer, db.ForeignKey("student.matricule"), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<documents %r>" % self.name


# ------------------- RESOURCES -------------------
# define all resource :

def verify(admin=False):
    """
    verify if the token is valid or not and if the user is admin or not
    :param admin: if the user must be admin or not
    """
    try:
        verify_jwt_in_request()
    except (DecodeError, ExpiredSignatureError):
        app.logger.info(
            "User tried to access the server with an invalid token {}...".format(request.headers.get("Authorization")[:20]))
        return {"msg": "Authentication required"}, 401
    t = request.headers.get("type")
    if t is None:
        app.logger.info("User {} with type {} and token {}... tried to access the server".format(get_jwt_identity(), t,
                                                                                              request.headers.get(
                                                                                                  "Authorization")[:20]))
        return {"msg": "Type not found"}, 401
    if admin:
        if t == "admin":
            app.logger.info("Admin {} with type {} and token {}... accessed the server".format(get_jwt_identity(), t,
                                                                                            request.headers.get(
                                                                                                "Authorization")[:20]))
            return True
        else:
            app.logger.info("User {} with type {} and token {}... tried to access the server".format(get_jwt_identity(), t,
                                                                                                  request.headers.get(
                                                                                                      "Authorization")[:20]))
            return {"msg": "Admin authentication required"}, 401
    # add the username, type and token to the log
    username = get_jwt_identity()
    app.logger.info("User {} with type {} and token {}... accessed the server".format(username, t, request.headers.get(
        "Authorization")[:20]))
    return True


class addAdmin(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        pwd = arguments.get("password")
        del arguments["password"]
        pwd = generate_password_hash(pwd)

        admin = adminModel(**arguments, password=pwd)
        adminModel.query.session.add(admin)
        db.session.commit()

        app.logger.info("Admin {} added a new admin : {}".format(get_jwt_identity(), admin.name))

        return "", 201


class getAdmin(Resource):

    def get(self):
        verif = verify()
        if verif is not True:
            return verif
        admin = db.session.query(adminModel).filter_by(name="admin").first()
        rtn = admin.as_dict()
        del rtn["password"]  # remove password from the response

        app.logger.info("Admin {} accessed the server to get the admin info".format(get_jwt_identity()))

        return rtn, 200


class loginAdmin(Resource):
    def post(self):
        arguments = request.get_json()
        admin = db.session.query(adminModel).filter_by(email=arguments.get('mail')).first()

        if admin is None:
            app.logger.info("User {} tried to login with an invalid email".format(arguments.get('mail')))
            return "", 404
        if check_password_hash(admin.password, arguments.get("password")):
            app.logger.info("User {} logged in".format(admin.name))
            var = {"id": admin.id}, {"token": create_access_token(identity=admin.id)}, {"type": "admin"}
            return var, 200
        else:
            app.logger.info("User {} tried to login with an invalid password".format(admin.name))
            return "", 401


class updatePasswordAdmin(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        admin = db.session.query(adminModel).filter_by(email=arguments.get('mail')).first()

        if admin is None:
            app.logger.info("User {} tried to update his password with an invalid email".format(arguments.get('mail')))
            return "", 404
        if check_password_hash(admin.password, arguments.get("password")):
            pwd = arguments.get("newPassword")
            pwd = generate_password_hash(pwd)
            admin.password = pwd
            db.session.commit()
            app.logger.info("User {} updated his password".format(admin.name))
            return "", 200
        else:
            app.logger.info("User {} tried to update his password with an invalid password".format(admin.name))
            return "", 401


class getStudent(Resource):

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        student = db.session.query(studentModel).filter_by(matricule=id).first()
        rtn = student.as_dict()
        app.logger.info("User {} accessed the server to get the student info".format(get_jwt_identity()))
        return rtn, 200


class addNewStudent(Resource):  # matricule / name / surname / email

    def post(self):
        arguments = request.get_json()

        matricule = arguments.get("matricule")
        email = arguments.get("email")
        name = arguments.get("name")
        surname = arguments.get("surname")
        self.sendmail(email, name, surname, matricule)
        newStudent = studentModel(matricule=matricule, name=name, surname=surname, email=email, phone="",
                                  email_private="", faculty="", actif=False)

        studentModel.query.session.add(newStudent)
        db.session.commit()

        app.logger.info("Added a new student : {}".format(newStudent.name))
        return "", 201

    def sendmail (self, receiver_email, name, surname, matricule):

        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText
        import smtplib, ssl

        SENDER_ADDRESS = 'noreplyprojetbdwebcedre@gmail.com'
        PASSWORD = 'mncbfyyjnosvjcoz'  # password for sender address
        RECIPIENT_EMAILS = [receiver_email]
        SUBJECT = "Inscription sur le site de gestion des étudiants du cèdres de l'UMons"

        message = MIMEMultipart()
        message['From'] = SENDER_ADDRESS
        message['To'] = RECIPIENT_EMAILS[0]
        message['Subject'] = SUBJECT

        text = "Bonjour" + str(surname) + " "+ str(name) + ", \n " \
               "Vous avez été inscrit sur le site de gestion des étudiants du cèdres de l'UMons. \n " \
               "Veuillez cliquer sur le lien suivant pour confirmer votre inscription : \n " \
               "http://localhost:5173/student/first/" + str(matricule) + "\n"  \

        part1 = MIMEText(text, "plain")

        message.attach(part1)

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(SENDER_ADDRESS, PASSWORD)
            server.sendmail(
                SENDER_ADDRESS, receiver_email, message.as_string().encode('utf-8')
            )


class getNewStudent(Resource):

    def get(self, id):
        student = db.session.query(studentModel).filter_by(matricule=id).filter_by(actif=False).first()
        rtn = {"name": student.name, "surname": student.surname, "matricule": student.matricule, "email": student.email}
        app.logger.info("Accessed the server to get the new student info : {}".format(student.name))
        return rtn, 200


class postStudent(Resource):

    def post(self):
        args = request.get_json()

        pwd = generate_password_hash('admin123')
        matricule = args.get("matricule")
        mail = args.get("email")

        student = db.session.query(studentModel).filter_by(matricule=matricule).first()
        if student is None:
            app.logger.info("Tried to add a new student with an invalid matricule : {}".format(matricule))
            return "", 404
        else:
            student.name = args.get("name")
            student.surname = args.get("surname")
            student.phone = args.get("phone")
            student.email_private = args.get("email_private")
            student.faculty = args.get("faculty")
            student.actif = True
            db.session.commit()

        login_student = loginStudentModel(matricule=matricule, password=pwd, email=mail)
        loginStudentModel.query.session.add(login_student)
        db.session.commit()
        app.logger.info("Added a new student with password : {}".format(student.name))
        return "", 201


class getListStudent(AbstractListResource):
    def __init__(self):
        super().__init__(studentModel)


class getListNewStudent(AbstractListResource):
    def __init__(self):
        super().__init__(studentModel, actif=False)


class postTeacher(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        teacher = teacherModel(**arguments)
        teacherModel.query.session.add(teacher)
        db.session.commit()
        app.logger.info("Admin {} added a new teacher : {}".format(get_jwt_identity(), teacher.name))
        return "", 201


class getListTeacher(AbstractListResource):
    def __init__(self):
        super().__init__(teacherModel)


class postCourse(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        course = courseModel(**arguments)
        courseModel.query.session.add(course)
        db.session.commit()
        app.logger.info("Admin {} added a new course : {}".format(get_jwt_identity(), course.name))
        return "", 201

    class removeCourse(Resource):

        def post(self):
            verif = verify()
            if verif is not True:
                return verif
            arguments = request.get_json()
            course = db.session.query(courseModel).filter_by(id=arguments.get('id')).first()
            if course is None:
                app.logger.info("Admin {} tried to remove a course with an invalid id".format(get_jwt_identity()))
                return "", 404
            db.session.delete(course)
            db.session.commit()
            app.logger.info("Admin {} removed a course : {}".format(get_jwt_identity(), course.name))
            return "", 200


class removeFacilities(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        facilities = db.session.query(facilitiesModel).filter_by(id=arguments.get('id')).first()
        if facilities is None:
            app.logger.info("Admin {} tried to remove a facilities with an invalid id".format(get_jwt_identity()))
            return "", 404
        db.session.delete(facilities)
        db.session.commit()
        app.logger.info("Admin {} removed a facilities : {}".format(get_jwt_identity(), facilities.name))
        return "", 200


class removeLinkCourseStudent(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        link = db.session.query(courseStudentModel).filter_by(course=arguments.get('course')).filter_by(
            student=arguments.get('student')).first()
        if link is None:
            app.logger.info("Admin {} tried to remove a link between course and student with an invalid id".format(
                get_jwt_identity()))
            return "", 404
        db.session.delete(link)
        db.session.commit()
        app.logger.info("Admin {} removed a link between course and student".format(get_jwt_identity()))
        return "", 200


class postLinkCourseStudent(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        link = courseStudentModel(**arguments)
        courseStudentModel.query.session.add(link)
        db.session.commit()

        list_facilities = db.session.query(facilitiesModel).filter_by(student=arguments.get('student')).filter_by(
            type='course').all()
        for f in list_facilities:
            addLink = courseFacilitiesModel(course=arguments.get('course'), facilities=f.id,
                                            student=arguments.get('student'))
            courseFacilitiesModel.query.session.add(addLink)
            db.session.commit()
        app.logger.info("Admin {} added a new link between course and student".format(get_jwt_identity()))
        return "", 201


class getListCourseFacilities(AbstractListResourceById):
    def __init__(self):
        super().__init__(courseFacilitiesModel)

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        listCourse = db.session.query(courseStudentModel).filter_by(student=id).all()
        list = []
        for course in listCourse:
            subList = []
            aCourse = db.session.query(courseModel).filter_by(id_aa=course.course).first()
            listFacilities = db.session.query(courseFacilitiesModel).filter_by(student=id).filter_by(
                course=course.course).all()
            for f in listFacilities:
                facilities = db.session.query(facilitiesModel).filter_by(id=f.facilities).first()
                subList.append({"id": facilities.id, "name": facilities.name, "description": facilities.description, })
            list.append({"id": aCourse.id_aa, "name": aCourse.name, "facilities": subList})
        app.logger.info(
            "Admin {} accessed the server to get the list of facilities for a student".format(get_jwt_identity()))
        return [h for h in list], 200


class getListCourseStudent(AbstractListResourceById):  # TODO add name of teacher
    def __init__(self):
        super().__init__(courseModel)

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        course = db.session.query(courseStudentModel).filter_by(student=id).all()
        list = []
        for c in course:
            crs = db.session.query(courseModel).filter_by(id_aa=c.course).first()
            teacher = db.session.query(teacherModel).filter_by(id=c.teacher).first()
            list.append({"id_aa": crs.id_aa, "name": crs.name, "teacher": teacher.name + " " + teacher.surname,
                         "mail": teacher.email, "isSuccess": c.isSuccess, "passExam": crs.passExam,
                         "quadrimester": crs.quadrimester})
        app.logger.info(
            "Admin {} accessed the server to get the list of courses for a student".format(get_jwt_identity()))
        return [h for h in list], 200


class getListCourse(AbstractListResource):
    def __init__(self):
        super().__init__(courseModel)


class postFacilities(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        facilities = facilitiesModel(**arguments)
        facilitiesModel.query.session.add(facilities)
        db.session.commit()
        app.logger.info("Admin {} added a new facilities : {}".format(get_jwt_identity(), facilities.name))
        return "", 201


class getListFacilitiesCourse(AbstractListResourceById):
    def __init__(self):
        super().__init__(facilitiesModel)

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        facilities = db.session.query(facilitiesModel).filter_by(student=id).filter_by(type="course")
        app.logger.info(
            "Admin {} accessed the server to get the list of facilities for a course".format(get_jwt_identity()))
        return [f.as_dict() for f in facilities], 200


class getListFacilitiesExam(AbstractListResourceById):
    def __init__(self):
        super().__init__(facilitiesModel)

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        facilities = db.session.query(facilitiesModel).filter_by(student=id).filter_by(type="exam")
        app.logger.info(
            "Admin {} accessed the server to get the list of facilities for an exam".format(get_jwt_identity()))
        return [f.as_dict() for f in facilities], 200


class loginStudent(Resource):
    def post(self):
        arguments = request.get_json()
        mail = arguments.get("mail")
        password = arguments.get("password")

        student = db.session.query(loginStudentModel).filter_by(email=mail).first()
        if student is None:
            app.logger.info("Someone tried to connect with the mail : {}".format(mail))
            return "", 404

        if check_password_hash(student.password, password):
            var = {"id": student.matricule}, {"token": create_access_token(identity=student.matricule)}, {
                "type": "student"}
            app.logger.info("Student {} connected to the server".format(student.matricule))
            return var, 200
        else:
            app.logger.info("Someone tried to connect with the mail but the password was wrong : {}".format(mail))
            return "", 401


class updateStudentPassword(Resource):

    def post(self):
        arguments = request.get_json()
        matricule = arguments.get("matricule")
        password = arguments.get("password")
        new_password = arguments.get("newPassword")

        student = db.session.query(loginStudentModel).filter_by(matricule=matricule).first()
        if student is None:
            app.logger.info(
                "Someone tried to change the password of the student {} but the matricule was wrong".format(matricule))
            return "", 404

        if check_password_hash(student.password, password):
            student.password = generate_password_hash(new_password)
            db.session.commit()
            app.logger.info("Student {} changed his password".format(matricule))
            return "", 200
        else:
            app.logger.info(
                "Someone tried to change the password of the student {} but the password was wrong".format(matricule))
            return "", 401


class updateStudentModel(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        args = request.get_json()
        matricule = args.get("matricule")
        name = args.get("name")
        surname = args.get("surname")
        email = args.get("email")
        phone = args.get("phone")
        email_private = args.get("email_private")
        faculty = args.get("faculty")

        student = db.session.query(studentModel).filter_by(matricule=matricule).first()
        if student is None:
            app.logger.info(
                "Someone tried to change the information of the student {} but the matricule was wrong".format(
                    matricule))
            return "", 404
        else:
            student.name = name
            student.surname = surname
            student.phone = phone
            student.email_private = email_private
            student.faculty = faculty
            db.session.commit()
            app.logger.info("Student {} changed his information".format(matricule))
            return "", 200


class getListSelectCourse(AbstractListResource):
    def __init__(self):
        super().__init__(courseModel)

    def get(self):
        course = db.session.query(courseModel).all()
        list = []
        for c in course:
            list.append({"key": c.id_aa, "value": c.name})
        app.logger.info("Accessed the server to get the list of courses")
        return [l for l in list], 200


class getListSelectTeacher(AbstractListResource):
    def __init__(self):
        super().__init__(teacherModel)

    def get(self):
        teacher = db.session.query(teacherModel).all()
        list = []
        for t in teacher:
            list.append({"key": t.id, "value": t.name + " " + t.surname})
        app.logger.info("Accessed the server to get the list of teachers")
        return [l for l in list], 200


def getRequestAdmin(status):
    quadri = int(db.session.query(actionDateModel).filter_by(name="quadri").first().date_start)
    list_request = db.session.query(examStatusModel).filter_by(status=status).all()
    list = []
    for ask in list_request:
        exam = db.session.query(examModel).filter_by(id=ask.exam).first()
        if exam.quadrimester == quadri:
            stud = db.session.query(studentModel).filter_by(matricule=exam.student).first()
            course = db.session.query(courseModel).filter_by(id_aa=exam.course).first()
            list.append(
                {"id": ask.id, "student": stud.name + " " + stud.surname, "exam": course.name,
                 "date": exam.date + " " + exam.hour + " à " + exam.hour_end, "status": ask.status,
                 "local": exam.locale,
                 "comment": ask.comment})
    return list


class getRequestToValidate(Resource):

    def get(self):
        list = getRequestAdmin('tovalide')
        app.logger.info("Accessed the server to get the list of requests to validate")
        return list, 201


class getRequestWait(Resource):

    def get(self):
        list = getRequestAdmin('update')
        app.logger.info("Accessed the server to get the list of requests waiting")
        return list, 201


class getRequestFinish(Resource):

    def get(self):
        list = getRequestAdmin('finish')
        app.logger.info("Accessed the server to get the list of requests finished")
        return list, 201


class getListSelectFalculty(AbstractListResource):
    def __init__(self):
        super().__init__(facultyModel)

    def get(self):
        faculty = db.session.query(facultyModel).all()
        list = []
        for f in faculty:
            list.append({"key": f.id, "value": f.name})
        app.logger.info("Accessed the server to get the list of faculties")
        return [l for l in list], 200


class getListSelectLocal(AbstractListResource):
    def __init__(self):
        super().__init__(localModel)

    def get(self):
        local = db.session.query(localModel).all()
        list = []
        for l in local:
            list.append({"key": l.name, "value": l.name})
        app.logger.info("Accessed the server to get the list of locals")
        return [l for l in list], 200


class postDocument(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif

        if 'file' not in request.files:
            app.logger.info("Someone tried to upload a document but no file was provided")
            return 'No file provided', 403

        file = request.files['file']
        if file.filename == '':
            app.logger.info("Someone tried to upload a document but no file was provided")
            return 'No file provided', 400
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        arguments = request.get_json()
        fil = arguments.get("file")
        arguments.pop("file")
        document = documentsModel(**arguments)
        documentsModel.query.session.add(document)
        db.session.commit()

        # fil.save(os.path.join(app.config['UPLOAD_FOLDER'], document.id + ".pdf")) TODO error
        app.logger.info("Admin {} uploaded a document".format(get_jwt_identity()))
        return "", 201


class getDocument(AbstractListResourceById):
    def __init__(self):
        super().__init__(documentsModel)

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        document = db.session.query(documentsModel).filter_by(student=id).all()
        if document is None:
            app.logger.info("Admin {} tried to get a document but it doesn't exist".format(get_jwt_identity()))
            return "", 404
        else:
            list = []
            for d in document:
                list.append({"id": d.id, "name": d.name, "pusbBy": d.pushBy, "date": "error"})
            app.logger.info("Admin {} accessed the server to get a document".format(get_jwt_identity()))
            return list, 200


class generateExamenFacilities(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arg = request.get_json()
        student = arg.get("student")
        quadrimester = arg.get("quadrimester")
        list_ok = check_quadrimester(quadrimester)

        to_pass = db.session.query(courseStudentModel).filter_by(student=student).filter_by(isSuccess='false').all()
        for t in to_pass:
            course = db.session.query(courseModel).filter_by(id_aa=t.course).first()
            ckeck_exist = db.session.query(examModel).filter_by(student=student).filter_by(
                course=course.id_aa).filter_by(quadrimester=quadrimester).first()
            if course.passExam in list_ok and ckeck_exist is None:
                facilities = examModel(course=course.id_aa, student=student, locale="", hour="", hour_end="", date="", type="",
                                       quadrimester=quadrimester)
                facilitiesModel.query.session.add(facilities)
                db.session.commit()
                status = examStatusModel(exam=facilities.id, status="create")
                examStatusModel.query.session.add(status)
                db.session.commit()
                listing = db.session.query(facilitiesModel).filter_by(student=student).filter_by(type="exam").all()
                for f in listing:
                    exam = examFacilitiesModel(facilities=f.id, student=student, exam=facilities.id)
                    examFacilitiesModel.query.session.add(exam)
                    db.session.commit()
        app.logger.info("Admin {} generated the exam facilities for the student {}".format(get_jwt_identity(), student))
        return "", 201


class updateStatusExam(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arg = request.get_json()
        id = arg.get("id")
        status = arg.get("status")
        status_db = db.session.query(examStatusModel).filter_by(exam=id).first()
        status_db.status = status
        db.session.commit()
        app.logger.info("Admin {} updated the status of the exam {}".format(get_jwt_identity(), id))
        return "", 201


class getExamFacilities1(AbstractListResourceById):
    def __init__(self):
        super().__init__(examModel)

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        app.logger.info("Admin {} accessed the server to get the list of exam facilities".format(get_jwt_identity()))
        return getExamList(id, 1), 200


class getExamFacilities2(AbstractListResourceById):
    def __init__(self):
        super().__init__(examModel)

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        app.logger.info("Admin {} accessed the server to get the list of exam facilities".format(get_jwt_identity()))
        return getExamList(id, 2), 200


class getExamFacilities3(AbstractListResourceById):
    def __init__(self):
        super().__init__(examModel)

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        app.logger.info("Admin {} accessed the server to get the list of exam facilities".format(get_jwt_identity()))
        return getExamList(id, 3), 200


class getListFaculty(AbstractListResource):
    def __init__(self):
        super().__init__(facultyModel)

    def get(self):
        verif = verify()
        if verif is not True:
            return verif
        faculty = db.session.query(facultyModel).all()
        list = []
        for f in faculty:
            list.append({"id": f.id, "name": f.name, "mail": f.mail})
        app.logger.info("Admin {} accessed the server to get the list of faculties".format(get_jwt_identity()))
        return [l for l in list], 200


class postFaculty(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        faculty = facultyModel(**arguments)
        facultyModel.query.session.add(faculty)
        db.session.commit()
        app.logger.info("Admin {} created a faculty".format(get_jwt_identity()))
        return "", 201


class getActionDate(Resource):

    def get(self):
        verif = verify()
        if verif is not True:
            return verif
        action = db.session.query(actionDateModel).all()
        list = []
        for a in action:
            list.append({"name": a.name, "start": str(a.date_start), "end": str(a.date_end)})
        app.logger.info("Admin {} accessed the server to get the list of action dates".format(get_jwt_identity()))
        return [l for l in list], 200


class getExampleFacilities(Resource):

    def get(self):
        verif = verify()
        if verif is not True:
            return verif
        facilities = db.session.query(exampleFacilitiesModel).all()
        list = []
        for f in facilities:
            list.append({"name": f.name, "key": f.name})
        app.logger.info("Admin {} accessed the server to get the list of example facilities".format(get_jwt_identity()))
        return [l for l in list], 200


class getMyExam(AbstractListResourceById):
    def __init__(self):
        super().__init__(examModel)

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        rtn = db.session.query(examModel).filter_by(id=id).first()
        course = db.session.query(courseModel).filter_by(id_aa=rtn.course).first()
        app.logger.info("Admin {} accessed the server to get the exam facilities {}".format(get_jwt_identity(), id))
        return {"id": rtn.id, "course": course.name, "aa": rtn.course, "date": rtn.date, "hour": rtn.hour, "hourEnd": rtn.hour_end,
                "local": rtn.locale, "type": rtn.type}, 200


class getMyExamFacilities(AbstractListResourceById):
    def __init__(self):
        super().__init__(examModel)

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        rtn = db.session.query(examFacilitiesModel).filter_by(exam=id).all()
        lst = []
        for r in rtn:
            tmp = db.session.query(facilitiesModel).filter_by(id=r.facilities).first()
            lst.append({"id": r.id, "facilitie": tmp.name})
        app.logger.info("Admin {} accessed the server to get the exam facilities {}".format(get_jwt_identity(), id))
        return [l for l in lst], 200


class removeExam(Resource):
    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        exam = examModel.query.filter_by(id=arguments.get("id")).first()
        db.session.delete(exam)
        db.session.commit()
        app.logger.info("Admin {} deleted the exam {}".format(get_jwt_identity(), arguments.get("id")))
        return "", 201


class removeExamFacilities(Resource):
    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        exam = examFacilitiesModel.query.filter_by(id=arguments.get("id")).first()
        db.session.delete(exam)
        db.session.commit()
        app.logger.info("Admin {} deleted the exam facilities {}".format(get_jwt_identity(), arguments.get("id")))
        return "", 201


class removeCourseFacilities(Resource):
    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        exam = courseFacilitiesModel.query.filter_by(id=arguments.get("id")).first()
        db.session.delete(exam)
        db.session.commit()
        app.logger.info("Admin {} deleted the course facilities {}".format(get_jwt_identity(), arguments.get("id")))
        return "", 201


class postMyExam(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        exam = examModel.query.filter_by(id=arguments.get("id")).first()
        exam.date = arguments.get("date")
        exam.hour = arguments.get("hour")
        exam.hour_end = arguments.get("hourEnd")
        exam.locale = arguments.get("local")
        exam.type = arguments.get("type")
        db.session.commit()
        app.logger.info("Admin {} updated the exam {}".format(get_jwt_identity(), arguments.get("id")))
        return "", 201


class getDeadLine(AbstractListResourceById):
    def __init__(self):
        super().__init__(actionDateModel)

    def get(self, id):
        verif = verify()
        if verif is not True:
            return verif
        rtn = db.session.query(actionDateModel).filter_by(name=id).first()
        app.logger.info("Admin {} accessed the server to get the deadline {}".format(get_jwt_identity(), id))
        return {"id": rtn.id, "date_start": str(rtn.date_start), "date_end": str(rtn.date_end)}, 200


class getDeadLineList(Resource):

    def get(self):
        verif = verify()
        if verif is not True:
            return verif
        rtn = db.session.query(actionDateModel).all()
        lst = []
        for r in rtn:
            lst.append({"id": r.id, "date_start": r.date_start, "date_end": r.date_end})
        app.logger.info("Admin {} accessed the server to get the list of deadlines".format(get_jwt_identity()))
        return [l for l in lst], 200


class postUpdateDeadLine(Resource):

    def post(self):
        verif = verify()
        if verif is not True:
            return verif
        arguments = request.get_json()
        action = actionDateModel.query.filter_by(id=arguments.get("id")).first()
        action.date_start = arguments.get("date_start")
        action.date_end = arguments.get("date_end")
        db.session.commit()
        app.logger.info("Admin {} updated the deadline {}".format(get_jwt_identity(), arguments.get("id")))
        return "", 201


class postUpdateQuadri(Resource):

        def post(self):
            verif = verify()
            if verif is not True:
                return verif
            arguments = request.get_json()
            actual_quadri = arguments.get("quadri")
            action = actionDateModel.query.filter_by(name="quadri").first()
            action.date_start = actual_quadri
            db.session.commit()

            return "", 201


class getQuadri(Resource):

        def get(self):
            verif = verify()
            if verif is not True:
                return verif
            q = db.session.query(actionDateModel).filter_by(name="quadri").first().date_start
            app.logger.info("Admin {} accessed the server to get the quadri".format(get_jwt_identity()))
            return {"quadri": q}, 200

class getLog(Resource):

    def get(self):
        verif = verify()
        if verif is not True:
            return verif
        with open("app.log", "r") as f:
            lines = f.readlines()
            ln = []
            for i in range(len(lines)):
                rmp = lines[i].replace("\n", "").split("**")
                ln.append({"date": rmp[0], "type": rmp[1], "message": rmp[2]})
        return ln, 200


class getActiveButton(Resource):

    def get(self):
        now_date = str(datetime.now().year) + "-" + str(datetime.now().month) + "-" + str(datetime.now().day)
        now_date = datetime.strptime(now_date, '%Y-%m-%d')

        rtn = None
        for r in db.session.query(actionDateModel).all():
            if r.name != "quadri" and datetime.strptime(str(r.date_start), '%Y-%m-%d') <= now_date <= datetime.strptime(str(r.date_end), '%Y-%m-%d'):
                rtn = r

        if rtn is None:
            active = "State0"
        else:
            active = rtn.name
        return {"active": active}, 200


class getListStudentInFaculty(AbstractListResourceById):

        def __init__(self):
            super().__init__(studentModel)

        def get(self, id):
            rtn = db.session.query(studentModel).filter_by(faculty=id).all()
            lst = []
            for r in rtn:
                lst.append({"name": r.name + " " + r.surname, "matricule": r.matricule, "mail": r.email})
            app.logger.info("Secretary of faculty accessed the server to get the list of students in faculty {}".format(id))
            return [l for l in lst], 200


class postAThingInDatabase(Resource):
    def post(self):
       # verif = verify()
       # if verif is not True:
       #     return verif
        arguments = request.get_json()
        research = arguments.get("data")
        List = []
        for r in db.session.query(studentModel).all():
            if research in r.name or research in r.surname or research in r.email or research == r.matricule:
                List.append({"name": r.name + " " + r.surname, "matricule": r.matricule, "mail": r.email, "type:": "student"})
        for r in db.session.query(teacherModel).all():
            if research in r.name or research in r.surname or research in r.email:
                List.append({"name": r.name + " " + r.surname, "mail": r.email, "type:": "teacher"})
        for r in db.session.query(localModel).all():
            if research in r.name:
                List.append({"name": r.name, "type:": "local"})
        for r in db.session.query(facultyModel).all():
            if research in r.name or research in r.mail:
                List.append({"name": r.name, "email": r.mail, "type:": "faculty"})
        for r in db.session.query(courseModel).all():
            if research in r.name or research in r.id_aa:
                List.append({"name": r.name, "description": r.id_aa, "type:": "course"})

        return [l for l in List], 200



# ------------------- INIT -------------------
# Initialisation database :

def initDataBase():
    if db.session.query(adminModel).filter_by(name="admin").first() is None:
        admin = adminModel(name="admin", password=generate_password_hash("admin"), email="admin@admin.be")
        app.logger.info(" * admin created !")
        adminModel.query.session.add(admin)
        db.session.commit()
        print(" * admin created !")

        date_year = "2023"

        action = actionDateModel(date_start=date_year + "-08-25", date_end=date_year + "-10-30", name="development")
        actionDateModel.query.session.add(action)
        db.session.commit()

        action = actionDateModel(date_start=date_year + "-09-15", date_end=date_year + "-11-01", name="course")
        actionDateModel.query.session.add(action)
        db.session.commit()

        action = actionDateModel(date_start=date_year + "-11-01", date_end=date_year + "-12-05", name="session1")
        actionDateModel.query.session.add(action)
        db.session.commit()

        action = actionDateModel(date_start=date_year + "-04-01", date_end=date_year + "-05-01", name="session2")
        actionDateModel.query.session.add(action)
        db.session.commit()

        action = actionDateModel(date_start=date_year + "-07-01", date_end=date_year + "-08-01", name="session3")
        actionDateModel.query.session.add(action)
        db.session.commit()

        action = actionDateModel(date_start="1", date_end="0", name="quadri")
        actionDateModel.query.session.add(action)
        db.session.commit()

        app.logger.info(" * actionDate created !")

        # read json file to database
        with open('data/faculty.json') as json_file:
            data = json.load(json_file)
            for p in data:
                faculty = facultyModel(id=p['id'], name=p['name'], mail=p['email'])
                facultyModel.query.session.add(faculty)
                db.session.commit()
        print(" * faculty created !")
        app.logger.info(" * faculty created !")

        with open('data/teacher.json') as json_file:
            data = json.load(json_file)
            for p in data:
                teacher = teacherModel(name=p['name'], surname=p['surname'], email=p['email'])
                teacherModel.query.session.add(teacher)
                db.session.commit()
        print(" * teacher created !")
        app.logger.info(" * teacher created !")

        with open('data/course.json') as json_file:
            data = json.load(json_file)
            for p in data:
                course = courseModel(id_aa=p['AA'], name=p['name'], passExam=p['passExam'], year=p['year'],
                                     quadrimester=p['quadrimester'])
                courseModel.query.session.add(course)
                db.session.commit()
        print(" * course created !")
        app.logger.info(" * course created !")

        with open('data/facilities.json') as json_file:
            data = json.load(json_file)
            for p in data:
                facilities = exampleFacilitiesModel(name=p['name'])
                exampleFacilitiesModel.query.session.add(facilities)
                db.session.commit()
        print(" * facilities created !")
        app.logger.info(" * facilities created !")

        with open('data/local.json') as json_file:
            data = json.load(json_file).get("locals")
            for p in data:
                local = localModel(name=p)
                localModel.query.session.add(local)
                db.session.commit()
        print(" * local created !")
        app.logger.info(" * local created !")


# ------------------- ROUTES -------------------
# All resource (API) :


api.add_resource(addAdmin, "/admin-add")  # {"name" : "pascal dd", "password" : "admin", "email":"pascal@none.be"}
api.add_resource(getAdmin, "/admin-get")
api.add_resource(loginAdmin, "/admin-login")  # {"password" : "admin", "mail":"pascal@none.be"}
api.add_resource(updatePasswordAdmin, "/adminPassword-update")
api.add_resource(addNewStudent,
                 "/new-student-add")  # example : {"matricule" : 191919, "name" : "testR", "surname" : "none", "email" : "none@none.be"}
api.add_resource(getNewStudent, "/new-student-get/<id>")  # example : 191919
api.add_resource(getListNewStudent, "/new-student-list")
api.add_resource(postStudent,
                 "/student-add")  # {"matricule" : 110122,"name":"name2","surname":"surname2","email":"test2@none.com","phone": "01256300","email_private": "private2@none.be","faculty": "sciences","password": "test1234"}
api.add_resource(getListStudent, "/student-list")  # empty body
api.add_resource(getStudent, "/student-get/<id>")  # 110122
api.add_resource(postTeacher,
                 "/teacher-add")  # {"id" : 202022, "name" : "TheBest", "surname" : "NoExist", "email" : "no.exit@mail.be"}
api.add_resource(getListTeacher, "/teacher-list")  # empty body
api.add_resource(getRequestToValidate, "/request-tovalide")
api.add_resource(getRequestWait, "/request-wait")
api.add_resource(getRequestFinish, "/request-finish")
api.add_resource(postCourse,
                 "/course-add")  # {"id_aa": "AA07785","name": "informatiqueA","year": "Master 2","quadrimester": 2,"passExam": 12}
api.add_resource(getListCourseStudent, "/courseStudent-list/<id>")  # empty body
api.add_resource(postLinkCourseStudent,
                 "/courseStudent-add")  # {"course" : "AA07785","student" : "191919","yearSchool" : "2022-2023"}
api.add_resource(getListCourse, "/course-list")  # empty body
api.add_resource(postFacilities,
                 "/facilities-add")  # {"student" : 191919, "yearSchool" : "2022-2023", "facilities" : "test"}
api.add_resource(getListFacilitiesCourse, "/facilitiesCourse-list/<id>")  # empty body
api.add_resource(getListFacilitiesExam, "/facilitiesExam-list/<id>")  # empty body
api.add_resource(loginStudent, "/student-login")
api.add_resource(updateStudentPassword, "/studentPassword-update")
api.add_resource(updateStudentModel, "/studentInfo-update")
api.add_resource(getListSelectCourse, "/select-list/course")
api.add_resource(getListSelectTeacher, "/select-list/teacher")
api.add_resource(postDocument, "/document-add")
api.add_resource(getListCourseFacilities, "/courseFacilities-list/<id>")
api.add_resource(getExamFacilities1, "/examFacilities-list-1/<id>")
api.add_resource(getExamFacilities2, "/examFacilities-list-2/<id>")
api.add_resource(getExamFacilities3, "/examFacilities-list-3/<id>")
api.add_resource(generateExamenFacilities, "/examFacilities-generate")
api.add_resource(getListFaculty, "/faculty-list")
api.add_resource(postFaculty, "/faculty-add")
api.add_resource(getActionDate, "/actions-list")
api.add_resource(getExampleFacilities, "/exampleFacilities-list")
api.add_resource(getMyExam, "/myExam/<id>")
api.add_resource(postMyExam, "/myExam-update")
api.add_resource(getMyExamFacilities, "/myExamList/<id>")
api.add_resource(getDeadLine, "/deadline/<id>")
api.add_resource(postUpdateDeadLine, "/deadline-update")
api.add_resource(getDeadLineList, "/deadline-list")
api.add_resource(getListSelectFalculty, "/faculty-select")
api.add_resource(getListSelectLocal, "/local-select")
api.add_resource(getDocument, "/list-document/<id>")
api.add_resource(getLog, "/log")
api.add_resource(getActiveButton, "/active-button")
api.add_resource(getListStudentInFaculty, "/faculty/<id>")
api.add_resource(updateStatusExam, "/update-status-exam")
api.add_resource(postUpdateQuadri, "/update-quadri")
api.add_resource(getQuadri, "/get-quadri")
api.add_resource(postAThingInDatabase, "/research")

app.logger.info(" * Flask server starting ...")


# ------------------- MAIN -------------------
# Main :
@app.route("/")
def hello():
    return "Test web site for the Flask API"


def main():
    with app.app_context():
        db.create_all()
        initDataBase()
    app.run(host='0.0.0.0', port=8080, debug=True)


if __name__ == "__main__":
    main()
