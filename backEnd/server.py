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


@app.route("/")
def hello():
    return "Test web site for the Flask API"


def main():
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=8080, debug=True)


if __name__ == "__main__":
    main()
