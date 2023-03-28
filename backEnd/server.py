# save this as app.py
from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
app.config["JWT_SECRET_KEY"] = "key-of-datBase-secret"
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)
db = SQLAlchemy()
db.init_app(app)
jwt = JWTManager(app)


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
class adminModel(db.Model):
    """
    admin model (person who can log in to the system)
    """
    __tablename__ = "admin"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)

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
    faculty = db.Column(db.String(80), nullable=False)
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
    matricule = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<login %r>" % self.email


class createStudentModel(db.Model):
    """
    create student model (unique for each
    """
    ___tablename__ = "createStudent"
    matricule = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)


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
    teacher = db.Column(db.Integer, db.ForeignKey("teacher.id"), nullable=False)

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
    yearSchool = db.Column(db.String(15), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<courseStudent %r>" % self.name


class courseFacilitiesModel(db.Model):
    """
    course facilities model (LIST) --> for each student (unique)
    """
    __tablename__ = "courseFacilities"
    id = db.Column(db.Integer, primary_key=True)
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
    id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.String(20), db.ForeignKey("course.id_aa"), nullable=False)
    student = db.Column(db.Integer, db.ForeignKey("student.matricule"), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    locale = db.Column(db.String(50), nullable=False)
    yearSchool = db.Column(db.String(7), nullable=False)  # ie 22-23 for 2022-2023

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<exam %r>" % self.name


class examFacilitiesModel(db.Model):
    """
    exam facilities model (LIST) --> for each student (unique)
    """
    __tablename__ = "examFacilities"
    id = db.Column(db.Integer, primary_key=True)
    exam = db.Column(db.Integer, db.ForeignKey("exam.id"), nullable=False)
    student = db.Column(db.Integer, db.ForeignKey("student.matricule"), nullable=False)
    facilities = db.Column(db.Integer, db.ForeignKey("facilities.id"), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<examFacilities %r>" % self.name


# ------------------- RESOURCES -------------------
# define all resource :
class addAdmin(Resource):
    def post(self):
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
        admin = db.session.query(adminModel).filter_by(name="admin").first()
        rtn = admin.as_dict()
        del rtn["password"]  # remove password from the response
        return rtn, 200


class getStudent(Resource):
    def get(self, id):
        student = db.session.query(studentModel).filter_by(matricule=id).first()
        rtn = student.as_dict()
        return rtn, 200


class addNewStudent(Resource):
    def post(self):
        arguments = request.get_json()

        newStudent = createStudentModel(**arguments)
        studentModel.query.session.add(newStudent)
        db.session.commit()

        return "", 201


class getNewStudent(Resource):
    def get(self, id):
        student = db.session.query(createStudentModel).filter_by(matricule=id).first()
        rtn = {"name": student.name, "surname": student.surname, "matricule": student.matricule, "email": student.email}
        return rtn, 200


class postStudent(Resource):
    def post(self):
        arguments = request.get_json()

        pwd = generate_password_hash('admin123')
        matricule = arguments.get("matricule")
        mail = arguments.get("email")

        student = studentModel(**arguments)
        studentModel.query.session.add(student)
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
        super().__init__(createStudentModel)


class postTeacher(Resource):
    def post(self):
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
        arguments = request.get_json()
        course = courseModel(**arguments)
        courseModel.query.session.add(course)
        db.session.commit()

        return "", 201


class postLinkCourseStudent(Resource):
    def post(self):
        arguments = request.get_json()
        link = courseStudentModel(**arguments)
        courseStudentModel.query.session.add(link)
        db.session.commit()

        return "", 201


class getListCourseStudent(AbstractListResourceById):  # TODO add name of teacher
    def __init__(self):
        super().__init__(courseModel)

    def get(self, id):
        course = db.session.query(courseStudentModel).filter_by(student=id)
        list = []
        for c in course:
            list.append(db.session.query(courseModel).filter_by(id_aa=c.course).first())
        return [c.as_dict() for c in list], 200


class getListCourse(AbstractListResource):
    def __init__(self):
        super().__init__(courseModel)


class postFacilities(Resource):
    def post(self):
        arguments = request.get_json()
        facilities = facilitiesModel(**arguments)
        facilitiesModel.query.session.add(facilities)
        db.session.commit()

        return arguments, 201


class getListFacilitiesCourse(AbstractListResourceById):
    def __init__(self):
        super().__init__(facilitiesModel)

    def get(self, id):
        facilities = db.session.query(facilitiesModel).filter_by(student=id).filter_by(type="course")
        return [f.as_dict() for f in facilities], 200


class getListFacilitiesExam(AbstractListResourceById):
    def __init__(self):
        super().__init__(facilitiesModel)

    def get(self, id):
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
            var = {"id": student.matricule}, {"token": create_access_token(identity=student.matricule)}
            return var, 200
        else:
            return "", 401


class updateStudentPassword(Resource):
    def post(self):
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


# ------------------- ROUTES -------------------
# All resource (API) :


api.add_resource(addAdmin, "/admin-add")
api.add_resource(getAdmin, "/admin-get")
api.add_resource(addNewStudent, "/new-student-add")  # example : {"matricule" : 191919, "name" : "testR", "surname" : "none", "email" : "none@none.be"}
api.add_resource(getNewStudent, "/new-student-get/<id>")  # example : 191919
api.add_resource(getListNewStudent, "/new-student-list")
api.add_resource(postStudent, "/student-add")  # {"matricule" : 110122,"name":"name2","surname":"surname2","email":"test2@none.com","phone": "01256300","email_private": "private2@none.be","faculty": "sciences","password": "test1234"}
api.add_resource(getListStudent, "/student-list")  # empty body
api.add_resource(getStudent, "/student-get/<id>")  # 110122
api.add_resource(postTeacher, "/teacher-add")  # {"id" : 202022, "name" : "TheBest", "surname" : "NoExist", "email" : "no.exit@mail.be"}
api.add_resource(getListTeacher, "/teacher-list")  # empty body
api.add_resource(postCourse, "/course-add")  # {"id_aa": "AA07785","name": "informatiqueA","year": "Master 2","quadrimester": 2,"teacher": 202022}
api.add_resource(getListCourseStudent, "/courseStudent-list/<id>")  # empty body
api.add_resource(postLinkCourseStudent, "/courseStudent-add")  # {"course" : "AA07785","student" : "191919","yearSchool" : "2022-2023"}
api.add_resource(getListCourse, "/course-list")  # empty body
api.add_resource(postFacilities, "/facilities-add")  # {"student" : 191919, "yearSchool" : "2022-2023", "facilities" : "test"}
api.add_resource(getListFacilitiesCourse, "/facilitiesCourse-list/<id>")  # empty body
api.add_resource(getListFacilitiesExam, "/facilitiesExam-list/<id>")  # empty body
api.add_resource(loginStudent, "/login-student")
api.add_resource(updateStudentPassword, "/studentPassword-update")
api.add_resource(updateStudentModel, "/studentInfo-update")


# ------------------- MAIN -------------------
# Main :
@app.route("/")
def hello():
    return "Test web site for the Flask API"


def main():
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=8080, debug=True)


if __name__ == "__main__":
    main()
