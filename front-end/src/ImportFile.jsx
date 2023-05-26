import React from 'react';
// import axios from 'axios';
// import { saveAs } from 'file-saver';

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
        fetch('http://192.168.74.20:4663/upload', {
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
                <p>Click "Upload File" button, select .csv file from File system. 
                *csv file must contain rows "Zip" and "Property Zip"
                Click "Submit" button and "output_file.csv" will be downloaded automatically, 
                containing the zip code distance in the last column "Zip Code Distance".</p>
                
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