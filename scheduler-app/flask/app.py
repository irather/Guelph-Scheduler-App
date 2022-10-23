from flask import Flask, render_template


app = Flask(__name__)

@app.route('/profile')
def my_profile():
    response_body = {
        "name": "Brandon",
        "about" :"God I hope this works"
    }

    return response_body


@app.route('/')
def index():
        return render_template("index.html")

@app.route('/test')
def get_current_time():
        return {"BEEAN":"BEAN FOR THE BEAN GOD"}

if __name__ == "__main__":
    app.run(debug=True)

