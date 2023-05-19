# save this as app.py
import json
import os
from datetime import datetime

from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
app.config["JWT_SECRET_KEY"] = "key-of-datBase-secret"
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)
db = SQLAlchemy()
db.init_app(app)
jwt = JWTManager(app)

actual_year = "2022-2023"


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
        for c in facilities:
            facil = db.session.query(facilitiesModel).filter_by(id=c.facilities).first()
            subList.append({"id": c.id, "name": facil.name})
        course = db.session.query(courseModel).filter_by(id_aa=e.course).first()
        list.append({"id": e.id, "date": e.date, "hour": e.hour, "locale": e.locale, "type": e.type, "aa": e.course,
                     "course": course.name, "facilities": subList})

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

def verify() :
    """
    verify if the user is logged in (with jwt token and if the user is admin or not)
    """
    try:
        verify_jwt_in_request()
    except:
        return False
    current_user = get_jwt_identity() 
    #TODO : verify if the user type
    return True
    
class addAdmin(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arguments = request.get_json()
        pwd = arguments.get("password")
        del arguments["password"]
        pwd = generate_password_hash(pwd)

        admin = adminModel(**arguments, password=pwd)
        adminModel.query.session.add(admin)
        db.session.commit()

        return "", 201


class getAdmin(Resource):
    
    def get(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        admin = db.session.query(adminModel).filter_by(name="admin").first()
        rtn = admin.as_dict()
        del rtn["password"]  # remove password from the response
        return rtn, 200


class loginAdmin(Resource):
    def post(self):
        arguments = request.get_json()
        admin = db.session.query(adminModel).filter_by(email=arguments.get('mail')).first()

        if admin is None:
            return "", 404
        if check_password_hash(admin.password, arguments.get("password")):
            var = {"id": admin.id}, {"token": create_access_token(identity=admin.id)}, {"type": "admin"}
            return var, 200
        else:
            return "", 401


class updatePasswordAdmin(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arguments = request.get_json()
        admin = db.session.query(adminModel).filter_by(email=arguments.get('mail')).first()

        if admin is None:
            return "", 404
        if check_password_hash(admin.password, arguments.get("password")):
            pwd = arguments.get("newPassword")
            pwd = generate_password_hash(pwd)
            admin.password = pwd
            db.session.commit()
            return "", 200
        else:
            return "", 401


class getStudent(Resource):
    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
        student = db.session.query(studentModel).filter_by(matricule=id).first()
        rtn = student.as_dict()
        return rtn, 200


class addNewStudent(Resource):  # matricule / name / surname / email
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arguments = request.get_json()

        matricule = arguments.get("matricule")
        email = arguments.get("email")
        name = arguments.get("name")
        surname = arguments.get("surname")

        newStudent = studentModel(matricule=matricule, name=name, surname=surname, email=email, phone="",
                                  email_private="", faculty="", actif=False)
        studentModel.query.session.add(newStudent)
        db.session.commit()

        return "", 201


class getNewStudent(Resource):
    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
        student = db.session.query(studentModel).filter_by(matricule=id).filter_by(actif=False).first()
        rtn = {"name": student.name, "surname": student.surname, "matricule": student.matricule, "email": student.email}
        return rtn, 200


class postStudent(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        args = request.get_json()

        pwd = generate_password_hash('admin123')
        matricule = args.get("matricule")
        mail = args.get("email")

        student = db.session.query(studentModel).filter_by(matricule=matricule).first()
        if student is None:
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

        return "", 201


class getListStudent(AbstractListResource):
    def __init__(self):
        super().__init__(studentModel)


class getListNewStudent(AbstractListResource):
    def __init__(self):
        super().__init__(studentModel, actif=False)


class postTeacher(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arguments = request.get_json()
        teacher = teacherModel(**arguments)
        teacherModel.query.session.add(teacher)
        db.session.commit()

        return "", 201


class getListTeacher(AbstractListResource):
    def __init__(self):
        super().__init__(teacherModel)


class postCourse(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arguments = request.get_json()
        course = courseModel(**arguments)
        courseModel.query.session.add(course)
        db.session.commit()

        return "", 201


class postLinkCourseStudent(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
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

        return "", 201


class getListCourseFacilities(AbstractListResourceById):
    def __init__(self):
        super().__init__(courseFacilitiesModel)

    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
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
        return [h for h in list], 200


class getListCourseStudent(AbstractListResourceById):  # TODO add name of teacher
    def __init__(self):
        super().__init__(courseModel)

    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
        course = db.session.query(courseStudentModel).filter_by(student=id).all()
        list = []
        for c in course:
            crs = db.session.query(courseModel).filter_by(id_aa=c.course).first()
            teacher = db.session.query(teacherModel).filter_by(id=c.teacher).first()
            list.append({"id_aa": crs.id_aa, "name": crs.name, "teacher": teacher.name + " " + teacher.surname,
                         "mail": teacher.email, "isSuccess": c.isSuccess, "passExam": crs.passExam,
                         "quadrimester": crs.quadrimester})
        return [h for h in list], 200


class getListCourse(AbstractListResource):
    def __init__(self):
        super().__init__(courseModel)


class postFacilities(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arguments = request.get_json()
        facilities = facilitiesModel(**arguments)
        facilitiesModel.query.session.add(facilities)
        db.session.commit()

        return arguments, 201


class getListFacilitiesCourse(AbstractListResourceById):
    def __init__(self):
        super().__init__(facilitiesModel)

    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
        facilities = db.session.query(facilitiesModel).filter_by(student=id).filter_by(type="course")
        return [f.as_dict() for f in facilities], 200


class getListFacilitiesExam(AbstractListResourceById):
    def __init__(self):
        super().__init__(facilitiesModel)

    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
        facilities = db.session.query(facilitiesModel).filter_by(student=id).filter_by(type="exam")
        return [f.as_dict() for f in facilities], 200


class loginStudent(Resource):
    def post(self):
        arguments = request.get_json()
        mail = arguments.get("mail")
        password = arguments.get("password")

        student = db.session.query(loginStudentModel).filter_by(email=mail).first()
        if student is None:
            return "", 404

        if check_password_hash(student.password, password):
            var = {"id": student.matricule}, {"token": create_access_token(identity=student.matricule)}, {
                "type": "student"}
            return var, 200
        else:
            return "", 401


class updateStudentPassword(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arguments = request.get_json()
        matricule = arguments.get("matricule")
        password = arguments.get("password")
        new_password = arguments.get("newPassword")

        student = db.session.query(loginStudentModel).filter_by(matricule=matricule).first()
        if student is None:
            return "", 404

        if check_password_hash(student.password, password):
            student.password = generate_password_hash(new_password)
            db.session.commit()
            return "", 200
        else:
            return "", 401


class updateStudentModel(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
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
            return "", 404
        else:
            student.name = name
            student.surname = surname
            student.phone = phone
            student.email_private = email_private
            student.faculty = faculty
            db.session.commit()
            return "", 200


class getListSelectCourse(AbstractListResource):
    def __init__(self):
        super().__init__(courseModel)

    
    def get(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        course = db.session.query(courseModel).all()
        list = []
        for c in course:
            list.append({"key": c.id_aa, "value": c.name})
        return [l for l in list], 200


class getListSelectTeacher(AbstractListResource):
    def __init__(self):
        super().__init__(teacherModel)

    
    def get(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        teacher = db.session.query(teacherModel).all()
        list = []
        for t in teacher:
            list.append({"key": t.id, "value": t.name + " " + t.surname})
        return [l for l in list], 200


class getRequestToValidate(Resource):

    def get(self):
        print (db.session.query(examStatusModel).all())
        list_request = db.session.query(examStatusModel).filter_by(status='tovalide').all()
        list = []
        for ask in list_request:
            list.append(ask.as_dict())
        return list, 201

class getRequestWait(Resource):

    def get(self):
        list_request = db.session.query(examStatusModel).filter_by(status='wait').all()
        list = []
        for ask in list_request:
            list.append(ask.as_dict())
        return list, 201

class getRequestFinish(Resource):

    def get(self):
        list_request = db.session.query(examStatusModel).filter_by(status='finish').all()
        list = []
        for ask in list_request:
            list.append(ask.as_dict())
        return list, 201

class getListSelectFalculty(AbstractListResource):
    def __init__(self):
        super().__init__(facultyModel)

    
    def get(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        faculty = db.session.query(facultyModel).all()
        list = []
        for f in faculty:
            list.append({"key": f.id, "value": f.name})
        return [l for l in list], 200


class getListSelectLocal(AbstractListResource):
    def __init__(self):
        super().__init__(localModel)

    
    def get(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        local = db.session.query(localModel).all()
        list = []
        for l in local:
            list.append({"key": l.name, "value": l.name})
        return [l for l in list], 200


class postDocument(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arguments = request.get_json()
        fil = request.files['file']
        document = documentsModel(**arguments)
        documentsModel.query.session.add(document)
        db.session.commit()

        fil.save(os.path.join(app.config['UPLOAD_FOLDER'], str(document.id) + ".pdf"))

        return "", 201


class generateExamenFacilities(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arg = request.get_json()
        student = arg.get("student")
        quadrimester = arg.get("quadrimester")
        list_ok = check_quadrimester(quadrimester)

        to_pass = db.session.query(courseStudentModel).filter_by(student=student).filter_by(isSuccess='false').all()
        for t in to_pass:
            course = db.session.query(courseModel).filter_by(id_aa=t.course).first()
            ckeck_exist = db.session.query(examModel).filter_by(student=student).filter_by(course=course.id_aa).first()
            if course.passExam in list_ok and ckeck_exist is None:
                facilities = examModel(course=course.id_aa, student=student, locale="", hour="", date="", type="",
                                       quadrimester=quadrimester)
                facilitiesModel.query.session.add(facilities)
                db.session.commit()
                statusexam = examStatusModel(exam=facilities.id, status="tovalide")
                examStatusModel.query.session.add(statusexam)
                db.session.commit()
                listing = db.session.query(facilitiesModel).filter_by(student=student).filter_by(type="exam").all()
                for f in listing:
                    exam = examFacilitiesModel(facilities=f.id, student=student, exam=facilities.id)
                    examFacilitiesModel.query.session.add(exam)
                    db.session.commit()
        return "", 201


class getExamFacilities1(AbstractListResourceById):
    def __init__(self):
        super().__init__(examModel)

    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
        return getExamList(id, 1), 200


class getExamFacilities2(AbstractListResourceById):
    def __init__(self):
        super().__init__(examModel)

    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
        return getExamList(id, 2), 200


class getExamFacilities3(AbstractListResourceById):
    def __init__(self):
        super().__init__(examModel)

    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
        return getExamList(id, 3), 200


class getListFaculty(AbstractListResource):
    def __init__(self):
        super().__init__(facultyModel)

    
    def get(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        faculty = db.session.query(facultyModel).all()
        list = []
        for f in faculty:
            list.append({"id": f.id, "name": f.name, "mail": f.mail})
        return [l for l in list], 200


class postFaculty(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arguments = request.get_json()
        faculty = facultyModel(**arguments)
        facultyModel.query.session.add(faculty)
        db.session.commit()
        return "", 201


class getActionDate(Resource):
    
    def get(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        action = db.session.query(actionDateModel).all()
        list = []
        for a in action:
            list.append({"name": a.name, "start": str(a.date_start), "end": str(a.date_end)})
        return [l for l in list], 200


class getExampleFacilities(Resource):
    
    def get(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        facilities = db.session.query(exampleFacilitiesModel).all()
        list = []
        for f in facilities:
            list.append({"name": f.name, "key": f.name})
        return [l for l in list], 200


class getMyExam(AbstractListResourceById):
    def __init__(self):
        super().__init__(examModel)

    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
        rtn = db.session.query(examModel).filter_by(id=id).first()
        course = db.session.query(courseModel).filter_by(id_aa=rtn.course).first()
        return {"id": rtn.id, "course": course.name, "aa": rtn.course, "date": rtn.date, "hour": rtn.hour, "local": rtn.locale, "type": rtn.type}, 200


class getMyExamFacilities(AbstractListResourceById):
    def __init__(self):
        super().__init__(examModel)

    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
        rtn = db.session.query(examFacilitiesModel).filter_by(exam=id).all()
        lst = []
        for r in rtn:
            tmp = db.session.query(facilitiesModel).filter_by(id=r.facilities).first()
            lst.append({"id": r.id, "facilitie": tmp.name})

        return [l for l in lst], 200


class postMyExam(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arguments = request.get_json()
        exam = examModel.query.filter_by(id=arguments.get("id")).first()
        exam.date = arguments.get("date")
        exam.hour = arguments.get("hour")
        exam.locale = arguments.get("local")
        exam.type = arguments.get("type")
        db.session.commit()
        return "", 201


class getDeadLine(AbstractListResourceById):
    def __init__(self):
        super().__init__(actionDateModel)

    
    def get(self, id):
        if not verify():
          return {"msg": "Authentication required"}, 401
        rtn = db.session.query(actionDateModel).filter_by(name=id).first()
        return {"id": rtn.id, "date_start": str(rtn.date_start), "date_end": str(rtn.date_end)}, 200


class getDeadLineList(Resource):
    
    def get(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        rtn = db.session.query(actionDateModel).all()
        lst = []
        for r in rtn:
            lst.append({"id": r.id, "date_start": r.date_start, "date_end": r.date_end})
        return [l for l in lst], 200

class postUpdateDeadLine(Resource):
    
    def post(self):
        if not verify():
          return {"msg": "Authentication required"}, 401
        arguments = request.get_json()
        action = actionDateModel.query.filter_by(id=arguments.get("id")).first()
        action.date_start = arguments.get("date_start")
        action.date_end = arguments.get("date_end")
        db.session.commit()
        return "", 201

# ------------------- INIT -------------------
# Initialisation database :

def initDataBase():
    if db.session.query(adminModel).filter_by(name="admin").first() is None:
        admin = adminModel(name="admin", password=generate_password_hash("admin"), email="admin@admin.be")
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

        # read json file to database
        with open('data/faculty.json') as json_file:
            data = json.load(json_file)
            for p in data:
                faculty = facultyModel(id=p['id'], name=p['name'], mail=p['email'])
                facultyModel.query.session.add(faculty)
                db.session.commit()
        print(" * faculty created !")

        with open('data/teacher.json') as json_file:
            data = json.load(json_file)
            for p in data:
                teacher = teacherModel(name=p['name'], surname=p['surname'], email=p['email'])
                teacherModel.query.session.add(teacher)
                db.session.commit()
        print(" * teacher created !")

        with open('data/course.json') as json_file:
            data = json.load(json_file)
            for p in data:
                course = courseModel(id_aa=p['AA'], name=p['name'], passExam=p['passExam'], year=p['year'],
                                     quadrimester=p['quadrimester'])
                courseModel.query.session.add(course)
                db.session.commit()
        print(" * course created !")

        with open('data/facilities.json') as json_file:
            data = json.load(json_file)
            for p in data:
                facilities = exampleFacilitiesModel(name=p['name'])
                exampleFacilitiesModel.query.session.add(facilities)
                db.session.commit()
        print(" * facilities created !")

        with open('data/local.json') as json_file:
            data = json.load(json_file).get("locals")
            for p in data:
                local = localModel(name=p)
                localModel.query.session.add(local)
                db.session.commit()
        print(" * local created !")


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
