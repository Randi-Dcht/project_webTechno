# save this as app.py
from flask import Flask, request
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
api = Api(app)
db = SQLAlchemy()
db.init_app(app)


class AbstractResource(Resource):
    def __init__(self, model: db.Model) -> None:  # type: ignore
        super().__init__()
        self.model = model
        self.primary_key = "id"

    def get(self, id):
        q = db.session.query(self.model).filter_by(**{self.primary_key: id}).first()
        if q is None:
            return "", 404
        else:
            return q.as_dict(), 200

    def delete(self, id):
        db.session.query(self.model).filter_by(**{self.primary_key: id}).delete()
        db.session.commit()
        return "", 204

    def put(self, id):
        db.session.query(self.model).filter_by(**{self.primary_key: id}).update(
            dict(**request.json)
        )
        db.session.commit()
        return "", 200


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
    password = db.Column(db.String(120), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<student %r>" % self.name


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
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(300), nullable=False)
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
    student = db.Column(db.Integer, db.ForeignKey("student.matricule"), nullable=False)
    year = db.Column(db.String(15), nullable=False)  # Bachelor, Master, PhD
    quadrimester = db.Column(db.Integer, nullable=False)  # 1, 2, 3
    yearSchool = db.Column(db.String(7), nullable=False)  # ie 22-23 for 2022-2023
    teacher = db.Column(db.Integer, db.ForeignKey("teacher.id"), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return "<course %r>" % self.name


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
class addAdmin(AbstractResource):
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


# ------------------- ROUTES -------------------
# All resource (API) :


api.add_resource(addAdmin, "/admin-add")
api.add_resource(getAdmin, "/admin-get")


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