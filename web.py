from flask import Flask, jsonify, request, render_template
import hashlib
import os
import random
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

url = os.environ.get('DATABASE_URL') or "postgresql://localhost/testdb"
app.config['SQLALCHEMY_DATABASE_URI'] = url
db = SQLAlchemy(app)

class Word(db.Model):
    __tablename__ = "words"
    en = db.Column(db.String(), primary_key=True)
    ja = db.Column(db.String(), nullable=False)
    note = db.Column(db.String(), nullable=True)
    remember = db.Column(db.Boolean, nullable=False)

@app.route('/', methods=['GET'])
def root():
    return render_template('index.html')

@app.route('/auth', methods=['POST',"OPTIONS"])
def auth():
    return jsonify({"auth": hashlib.sha512(request.json.get("auth", "").encode("utf-8")).hexdigest() == "37c3dc7215155a8499365729b74fdf0ccbc36a3a13a84d52bb53c0de2c3f806d7b54b8637b02bf58494be7594af44b960febf254ab1b8c0491d3e0f386031ef4"})

#database
@app.route('/word', methods=['GET'])
def get_word():
    rand = random.randrange(0, Word.query.count())
    word = Word.query[rand]
    return jsonify({
        "en":word.en,
        "ja":word.ja,
        "note":word.note,
        "remember":word.remember
    })

@app.route('/words', methods=['GET'])
def get_words():
    words = Word.query.all()#offset limit
    return jsonify([
        {
            "en":word.en,
            "ja":word.ja,
            "note":word.note,
            "remember":word.remember
        } for word in words
    ])

@app.route('/word', methods=['POST',"OPTIONS"])
def post_word():
    word = Word()
    en = request.json.get("en", "")
    ja = request.json.get("ja", "")
    if len(en) == 0 or len(ja) == 0:
        return jsonify({"status":400})
    word.en = en
    word.ja = ja
    word.note = request.json.get("note", "")
    word.remember = False
    db.session.add(word)
    db.session.commit()
    return jsonify({"status":200})

@app.route('/word', methods=['PUT'])
def put_word():
    en = request.json.get("en", "")
    ja = request.json.get("ja", "")
    if len(en) == 0 or len(ja) == 0:
        return jsonify({"status":400})
    word = Word.query.get(en)
    if not word:
        return jsonify({"status":"not words"})
    word.ja = ja
    word.note = request.json.get("note", "")
    print(request.json.get("remember", False))
    word.remember = request.json.get("remember", False)
    
    db.session.commit()
    return jsonify({"status":200})

@app.route('/word', methods=['DELETE'])
def delete_word():
    en = request.json.get("en", "")
    if len(en) == 0:
        return jsonify({"status":400})
    word = Word.query.get(en)
    db.session.delete(word)
    db.session.commit()
    return jsonify({"status":200})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    
