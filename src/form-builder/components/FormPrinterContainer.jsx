import React, { Component } from 'react';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import PdfList from 'form-builder/components/PdfList.jsx';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import  {formBuilderConstants}  from 'form-builder/constants';

class FormPrinterContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: "",
      downloadLink: "",
      importBtnStatus: "",
      status: "Processing"
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
  }
  onFileChange(event) {
    event.preventDefault();
    this.setState({ selectedFile: event.target.files[0] });
  };

  onFileUpload(event) {
    var file = this.state.selectedFile;
    this.setState({ importBtnStatus: "clicked" });
    const self = this;
    const reader = new FileReader();
    // eslint-disable-next-line
    reader.onload = function () {
      try {

        const formData = JSON.parse(reader.result);
        httpInterceptor.post(formBuilderConstants.jsonToPdfConvertionUrl, formData).then((response) => {
          let fileName=response.pdfName;
          let link = formBuilderConstants.pdfDownloadUrl+fileName;
          self.setState({ downloadLink: link });
          self.setState({ status: "Completed" });
        });

      } catch (error) {
        self.setState({ status: "Error" })
      }
    };
    reader.readAsText(file);
  };


  render() {

    return (
      <div>
        <div>
          <FormBuilderHeader />
        </div>
        <div class="breadcrumb-wrap">
          <div class="breadcrumb-inner">
            <div style={{ display: "flex", flexWrap: "nowrap" }}>
              <label for="jsonName" style={{ paddingTop: "5px", marginRight: "10px" }}>Import JSON file:</label>
              <input type="text" id="jsonName" name="jsonName" value={this.state.selectedFile.name} readonly />
              <label for="files" class="button">Add</label>
              <input id="files" style={{ visibility: "collapse" }} type="file" accept=".json" onChange={this.onFileChange} />
              {this.state.selectedFile != "" && <button className="btn--highlight" onClick={this.onFileUpload}>
                Import
                </button>}

            </div>
          </div>

          {this.state.importBtnStatus != "" && <div>
            <div className="container-content-wrap">
              <div className="container-content">
                <div className="container-main form-list">
                  <h2 className="header-title">Generated PDF's</h2>
                  <PdfList downloadLink={this.state.downloadLink} status={this.state.status} />
                </div>
              </div>
            </div>
          </div>}

        </div>
      </div >
    );
  }
}
export default FormPrinterContainer;
