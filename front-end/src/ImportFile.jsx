import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

export default class ImportFile extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    handleOnSubmit(e) {
        e.preventDefault();

        const data = new FormData();
        data.append('file', e.target[0].files[0]);
        data.append('filename', 'newfile');
        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: data,
        })
        .then(response => {
            const filename =  response.headers.get('Content-Disposition').split('filename=')[1];
            response.blob().then(blob => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = filename;
              a.click();
            });
          });
    }
    // .then((Response) => this.save('newfile.csv', Response.data));
// this.save('newfile.csv', Response.text().toString())
    // save(filename, data) {
    //     const blob = new Blob([data], {type: 'text/csv'});
    //     saveAs(blob, filename)
    // }

    render() {
        return (
            <div>
                <h1>File Upload</h1>
                <form onSubmit={this.handleOnSubmit}>
                    <p><input
                            ref = {(ref) => {this.uploadInput = ref; }} 
                            type="file"
                            name="file" 
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        />
                    </p>
                    <p><input type="submit"/></p>
                </form>
            </div>  
        );
    }
}