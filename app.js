
let express = require('express');
let bodyParser = require('body-parser');
let GuestbookEntry = require("./src/GuestbookEntry");
let fs = require('fs');


fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) throw err;
    let d = JSON.parse(data);

    let entries = [];
    for (let entry of d) {
        entries.push(new GuestbookEntry(entry.title, entry.content));
    }

    // Start Server
    let app = express();
    app.set('view engine', 'ejs');
    app.set('views', './views');

    // is being used as root directory for the path /public
    app.use(express.static('./public'));
    app.use(bodyParser.urlencoded({extended: true}));

    app.get("/index", (req, res) => {
        res.render('index', {
            entries: entries
        });
    });

    app.post("/guestbook/new", (req, res) => {
        let content = req.body.content;
        let title = req.body.title;

        let newEntry = new GuestbookEntry(title, content);
        entries.push(newEntry);

        // write to file
        fs.writeFile("./data.json", JSON.stringify(entries), (err) => {
            if (err) throw err;
            console.log("The file was saved!");
        });

        res.redirect("/index");
    });

    app.listen(3000, () => {
        console.log('Server is running at port 3000');
    });

});


