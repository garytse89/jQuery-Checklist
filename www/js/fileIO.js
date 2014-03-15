var fileSystem;

//generic getById
function getById(id) {
    return document.querySelector(id);
}

//generic error handler
function onError(e) {
    // getById("#content").innerHTML = "<h2>Error</h2>"+e.toString();
}

function doDeleteFile(e) {
    fileSystem.root.getFile("test.txt", {create:true}, function(f) {
        f.remove(function() {
            console.log("File removed<p/>"); 
        });
    }, onError);
}

function metadataFile(m) {
    console.log("File was last modified "+m.modificationTime+"<p/>");    
}

function doMetadataFile(e) {
    fileSystem.root.getFile("test.txt", {create:true}, function(f) {
        f.getMetadata(metadataFile,onError);
    }, onError);
}

function readFile(f) {
    reader = new FileReader();
    reader.onloadend = function(e) {
        console.log("go to end");
        console.log("<pre>" + e.target.result + "</pre><p/>");
    }
    reader.readAsText(f);
}

function doReadFile(e) {
    fileSystem.root.getFile("test.json", {create:true}, readFile, onError);
}

function appendFile(f) {

    f.createWriter(function(writerOb) {
        writerOb.onwrite=function() {
            console.log("Done writing to file.<p/>");
        }
        //go to the end of the file...
        writerOb.seek(writerOb.length);
        writerOb.write(JSON.stringify(bareListArray));
    })

}

function doAppendFile(e) {
    console.log("Share file");
    fileSystem.root.getFile("test.txt", {create:true}, appendFile, onError);
}

function gotFiles(entries) {
    var s = "";
    for(var i=0,len=entries.length; i<len; i++) {
        //entry objects include: isFile, isDirectory, name, fullPath
        s+= entries[i].fullPath;
        if (entries[i].isFile) {
            s += " [F]";
        }
        else {
            s += " [D]";
        }
        s += "<br/>";
        
    }
    s+="<p/>";
    console.log(s);
}

function doDirectoryListing(e) {
    //get a directory reader from our FS
    var dirReader = fileSystem.root.createReader();

    dirReader.readEntries(gotFiles,onError);        
}

function onFSSuccess(fs) {
    fileSystem = fs;

    // getById("#dirListingButton").addEventListener("touchstart",doDirectoryListing);            
    //getById("#shareDialogLaunch").addEventListener("touchstart",doAppendFile);            
    // getById("#readFileButton").addEventListener("touchstart",doReadFile);            
    // getById("#metadataFileButton").addEventListener("touchstart",doMetadataFile);            
    // getById("#deleteFileButton").addEventListener("touchstart",doDeleteFile);            
    
    console.log( "Got the file system: "+fileSystem.name +"<br/>" +
                                    "root entry name is "+fileSystem.root.name + "<p/>")    

    doDirectoryListing();
} 