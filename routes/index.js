var express = require("express");
var router = express.Router();
var fs = require("fs");

var found = null;
var hash = fs.readFileSync("./global.json");
var global = JSON.parse(hash);

function find(doc, param) {

    for (var i = 0; i < doc.length; i++){

        if (doc[i].name == param){
            found = doc[i];
        }

        if (doc[i].children){
            find(doc[i].children, param)
        };
    };
};

function add(doc, param) {

        for (var i = 0; i < doc.length; i++){

            if (doc[i].name == param.parent){

                if (doc[i].children){
                    doc[i].children.push(param);
                } else {
                    doc[i].children = [];
                    doc[i].children.push(param);
                };
            };
    
            if (doc[i].children){
                add(doc[i].children, param)
            };
        };
};

function update(doc, param) {
    console.log(param);
        for (var i = 0; i < doc.length; i++){
            console.log("param.name " + param.name);
            console.log(doc[i].name + "doc[i].name");
            if (doc[i].name == param.name){
                console.log("Совпадение? Не думаю")
                if (doc[i].created){
                    var created = doc[i].created;
                };
                var parent = doc[i].parent;
                doc[i] = param;
                var modified = new Date().toString();
                doc[i].modified = modified;
                doc[i].created = created;
                doc[i].parent = parent;
            }
    
            if (doc[i].children){
                update(doc[i].children, param);
            };
        };
};



router.get("/get", (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(global, null, 2));
});

router.get("/get/:name", (req, res, next) => {
    var name = req.params.name;
    
    find(global, name);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(found, null, 2));
});

router.get("/add/:options", (req, res, next) =>{
    var options = JSON.parse(req.params.options);
    add(global, options);

    var created = new Date().toString();
    options.created = created;
    options.modified = null;

    fs.writeFileSync("./global.json", JSON.stringify(global, null, " "));

    res.redirect("/get");
});

router.get("/update/:options", (req, res, next) =>{
    var options = JSON.parse(req.params.options);
    console.log(options);
    update(global, options);

    fs.writeFileSync("./global.json", JSON.stringify(global, null, " "));

    res.redirect("/get");
});

module.exports = router;

