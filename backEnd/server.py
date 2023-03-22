# save this as app.py
from flask import Flask, request
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

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


@app.route("/")
def hello():
    return "Test web site for the Flask API"


def main():
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=8080, debug=True)


if __name__ == "__main__":
    main()
