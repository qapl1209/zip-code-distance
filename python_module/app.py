import os
from flask import Flask, request, flash, redirect, url_for, render_template, jsonify, make_response
from flask_cors import CORS
from io import StringIO
from werkzeug.utils import secure_filename

# from flask import Flask, render_template, request, redirect, url_for
# from flask_restful import Resource, Api, reqparse
import pandas as pd
import pgeocode as pg
import numpy as np

UPLOAD_FOLDER = '/downloads'
ALLOWED_EXTENSIONS = {'csv', 'xls', 'xlsx'}

app = Flask(__name__)
cors = CORS(app, expose_headers='Content-Disposition')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def add_distance_col(df):
    dist = pg.GeoDistance('us')
    mask = df['Property Zip'] != 0
    df['Zip'] = df['Zip'].map(str)
    df['Property Zip'] = df['Property Zip'].map(str)
    df['Zip Distance'] = dist.query_postal_code(df['Zip'].to_list(), df['Property Zip'].to_list())
    print(df)

def prep_req(df):
    with StringIO() as buffer:
        # forming a StringIO object  
        buffer = StringIO()
        buffer.write(df.to_csv())
        # forming a Response object with Headers to return from flask 
        response = make_response(buffer.getvalue())
        response.headers['Content-Disposition'] = 'attachment; filename=output_file.csv'
        response.mimetype = 'text/csv'
        # return the Response object
        return response

@app.route('/upload1', methods=['POST'])
def test_download():
    with StringIO() as buffer:
        # forming a StringIO object  
        buffer = StringIO()
        buffer.write('Just some letters.')
        # forming a Response object with Headers to return from flask 
        response = make_response(buffer.getvalue())
        response.headers['Content-Disposition'] = 'attachment; filename=output_file.csv'
        response.mimetype = 'text/csv'
        # return the Response object
        return response


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No file!')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            # filename = secure_filename(file.filename)
            df = pd.read_csv(request.files['file'])
            add_distance_col(df)
            return prep_req(df)


        #     # file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        #     # return redirect(url_for('download_file', name=filename))
    else:
        return '{"status": 0}'



# @app.route('/upload', methods=['POST'])
# def upload_file():
#     uploaded_file = request.files['file']
#     if uploaded_file.filename != '':
#         uploaded_file.save(uploaded_file.filename)
#         df = pd.read_csv(uploaded_file.filename)
#         dist = pg.GeoDistance('us')
#         df['Zip Code Distance'] = dist.query_postal_code(df[''], df[''])
        
#     return redirect(url_for('index'))