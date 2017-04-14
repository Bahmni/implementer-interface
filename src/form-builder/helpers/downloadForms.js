import fileDownload from 'react-file-download';
import filter from 'lodash/filter';
import {httpInterceptor} from "../../common/utils/httpInterceptor";
import {formBuilderConstants} from "../constants";

export class DownloadForms {

  constructor(forms, completedFunc) {
    this.forms = forms;
    this.downloads = {};
    this.completedFunc = completedFunc;
    forms.forEach(form => {
      const fileName = `${form.name}_${form.version}`;
      this.downloads[fileName] = {completed: false, success: false};
    });
  }

  completed(fileName, success) {
    if (this.downloads[fileName]) {
      this.downloads[fileName] = {completed: true, success};
      const uncompletedFiles = filter(this.downloads, file => !file.completed);
      if (uncompletedFiles.length <= 0) {
        this.completedFunc(this.downloads);
      }
    }
  }

  start() {
    const params =
      'v=custom:(id,uuid,name,version,published,auditInfo,' +
      'resources:(value,dataType,uuid))';

    this.forms.forEach(form => {
      const fileName = `${form.name}_${form.version}`;

      httpInterceptor
        .get(`${formBuilderConstants.formUrl}/${form.uuid}?${params}`)
        .then((data) => {
          fileDownload(JSON.stringify(data), `${fileName}.json`);
          this.completed(fileName, true);
        })
        .catch(() => {
          this.completed(fileName, false);
        })
    });
  }
}

