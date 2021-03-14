class FileHandler
{
  constructor(input, processData, type = 'csv')
  {
    this.m_input = input;
    this.m_processData = processData;
    this.m_type = type;
    this.registerFileInput();
  }
  registerFileInput(e)
  {
    let callback = () =>
    {
      this.m_input.addClass('bg-success');
      setTimeout(()=>
      {
        this.m_input.parent()[0].reset();
        this.m_input.removeClass('bg-success');
      },3000)
    }
    this.m_input.bind('change',e=>this.handleFiles(e, callback));
  }

  handleFiles(e, callback)
  {
    var files = e.target.files;
    if (window.FileReader) 
    {
      this.readAsText(files[0], callback, e);
    }
    else 
    {
      alert('FileReader are not supported in this browser.');
    }
  }

  readAsText(fileToRead, callback, btnEvent)
  {
    var reader = new FileReader();
    if(!fileToRead)
    {
      console.log('No file to read!');
      return;
    }
    var fileName = fileToRead.name;
    // Handle errors load
    reader.onload = e =>
    {
      var result = e.target.result;
      if(!result)
      {
        console.log('No valid file!');
        if(callback)
          callback();
        return;
      }
      try
      {
        this.processData(result, btnEvent, fileName);
      }
      catch(err)
      {
        console.log(err);
      }

      if(callback)
          callback();
    }
    reader.onerror = e =>
    {
      throw 'Error reading file ' + fileName + '!';
    } 
    reader.readAsText(fileToRead);
  };

  processData(importData, btnEvent, fileName)
  {
    if(this.m_type == 'csv')
    {
      let lines = [];
      let allTextLines = importData.split(/\r\n|\n/);
      for (var i=0; i<allTextLines.length; i++) 
      {
        let data = allTextLines[i].split(';');
        let tarr = [];
        for (let j=0; j<data.length; j++) 
          tarr.push(data[j]);
        lines.push(tarr);
      }
      this[this.m_processData](lines, importData, btnEvent, fileName);
    }
    else
    { 
      this[this.m_processData](importData, btnEvent, fileName);
    };
  };
}
// new FileHandler($('#importBtn'),(data)=>{console.log(data,importData)})

//..............................................................................
class FileExport
{
  constructor()
  {

  }
  initDownloadButton(btn, parser, fileName, extension, skipDownload)
  {   
    btn.bind('touchend mouseup', (e) =>
    {
      e.preventDefault();
      this.exportData(btn, parser, fileName, extension, skipDownload);
    });
  }
  exportData(btn, parser, fileName, extension, skipDownload, forceType)
  {
    if(skipDownload)
    {
      parser()
    }
    else
    {
      let parsedName = typeof fileName == 'string' ? fileName : fileName(btn);
      let name = parsedName + '.' + extension;
      let type = forceType ? {type: "application/"+extension+";charset=utf-8"} : undefined;
      let file = new File([parser(btn)], name, type);
      saveAs(file, name, type);
    }      
  }
}