const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const config = require("./config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./src/views"));
app.use(
    session({
        name: "my-session",
        secret: "jangankepo",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 5 // 5 Menit
        },
    })
);

app.use(flash());


app.get("/", home);
app.post("/", homePost);
app.get("/register", registerMe);
app.post("/register", registerMePost);
app.get("/login", loginMe);
app.post("/login", loginMePost);
app.post("/logout", logoutPost);


async function home(req, res) {
    const user = req.session.user;
    console.log(user);

    const query = `SELECT collections_tb.* ,users_tb.id from collections_tb INNER JOIN users_tb ON collections_tb.user_id = users_tb.id;`

    const projects = await sequelize.query(query, { type: QueryTypes.SELECT })

    res.render("index", { projects, user });
}


app.post("/", homePost);
async function homePost(req, res) {
    const { id } = req.session.user;
    const { name } = req.body;

    console.log(name);
    console.log(id);

    const query = `INSERT INTO collections_tb(name, user_id) VALUES('${name}', '${id}')`;

    try {
        const project = await sequelize.query(query, { type: QueryTypes.INSERT });
        console.log("Project berhasil ditambahkan: ", project);
        res.redirect("/");
    } catch (error) {
        console.error("Error saat menambahkan project:", error);
        res.status(500).send("Terjadi kesalahan saat menambahkan project");
    }
}




function registerMe(req, res) {
    res.render("register");
}

async function registerMePost(req, res) {
    const { email, username, password } = req.body;
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO users_tb(email,username,password) VALUES('${email}', '${username}', '${hashedPassword}')`;
    await sequelize.query(query, { type: QueryTypes.INSERT });

    res.redirect("login");
}


function loginMe(req, res) {
    res.render("login");
}

async function loginMePost(req, res) {
    const { email, password } = req.body;

    // Verifikasi Email
    const query = `SELECT * FROM users_tb WHERE email='${email}'`;
    const user = await sequelize.query(query, { type: QueryTypes.SELECT });

    if (!user.length) {
        req.flash("error", "Email / password salah!");
        return res.redirect("/login");
    }
    console.log(password, user[0].password)

    const isVerfied = await bcrypt.compare(password, user[0].password)
    console.log("isVerfied Password: ", isVerfied)

    if (!isVerfied) {
        req.flash("error", "Email / password salah!");
        return res.redirect("/login");
    }

    req.flash("success", "Berhasil login!");
    req.session.user = user[0]

    res.redirect("/")
}

function logoutPost(req, res) {
    req.session.destroy(
        (err) => {
            if (err) return console.error("logout gagal")
            console.log("logout berhasil");
            res.redirect("/");
        }
    );

}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});