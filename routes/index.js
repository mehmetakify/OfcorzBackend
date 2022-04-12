const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    const db = req.con;

    const user = req.query.user;

    let filter = "";
    if (user) {
        filter = 'WHERE name = ?';
    }

    db.query('SELECT * FROM user ' + filter, user, (err, rows) => {
        if (err) console.log(err);
        res.render('index', { title: 'User Information', data: rows, user: user });
    });

});

router.get('/users', (req, res) => {

    const db = req.con;

    const user = req.query.user;

    db.query('SELECT * FROM user', user, (err, rows) => {
        if (err) console.log(err);
        res.status(200).json(rows)
    });

});

router.get('/add', (req, res) => {
    res.render('userAdd', { title: 'Add User', msg: '' });
});

router.post('/userAdd', (req, res) => {

    const db = req.con;
    const name = req.body.name;
    db.query('SELECT name FROM user WHERE name = ?', name, (err, rows) => {
        if (err) {
            console.log(err);
        }

        const count = rows.length;
        if (count > 0) {
            res.render('userAdd', { title: 'Add User', msg: 'name already exists.' });
        } else {
            const sql = {
                name: req.body.name,
                password: req.body.password,
                email: req.body.email
            };

            db.query('INSERT INTO user SET ?', sql, function(err, rows) {
                if (err) console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.redirect('/');
            });
        }
    });


});

router.get('/userEdit',(req, res) => {

    const id = req.query.id;
    //console.log(id);

    const db = req.con;
    db.query('SELECT * FROM user WHERE id = ?', id, (err, rows) => {
        if (err) {
            console.log(err);
        }

        res.render('userEdit', { title: 'Edit user', data: rows });
    });

});


router.post('/userEdit',(req, res) => {

    const db = req.con;

    const id = req.body.id;

    const sql = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    };

    db.query('UPDATE user SET ? WHERE id = ?', [sql, id], function(err, rows) {
        if (err) console.log(err);

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/');
    });

});

router.get('/userDelete',(req, res) => {

    const id = req.query.id;
    const db = req.con;

    db.query('DELETE FROM user WHERE id = ?', id, err => {
        if (err) console.log(err);
        res.redirect('/');
    });
});

const getLocationOption = key => {
    switch (key) {
        case "c":
            return ["choose"]
        case "i":
            return ["instructor"]
        case "o":
            return ["online"]
        case "ci":
            return ["choose", "instructor"]
        case "co":
            return ["choose", "online"]
        case "io":
            return ["instructor", "online"]
        case "cio":
            return ["choose", "instructor", "online"]
        default:
            return []
    }
}

router.post('/login',(req, res) => {

    const db = req.con;
    const name = req.body.userName;
    const password = req.body.password;

    if (name && password) {
        db.query('SELECT id FROM user WHERE name = ? AND password = ?', [name, password], (err, rows) => {
            if (err) {
                console.log(err);
                res.sendStatus(404)
            }
            const userId = rows[0].id
            db.query('SELECT id, tagline, category, locationOption, travelFee FROM skill WHERE ownerId = ?', userId, (err, rows) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(404)
                }
                res.status(200).json({
                    userId: userId,
                    skills: rows.map(el => {
                        return {
                            ...el,
                            locationOption: getLocationOption(el.locationOption)
                        }
                    })
                })
            });
        });
    } else {
        res.sendStatus(406)
    }
});

router.get('/skills', (req, res) => {

    const db = req.con;
    const user = req.query.user;

    db.query('SELECT id, tagline, category, locationOption, travelFee FROM skill WHERE ownerId = ?', user, (err, rows) => {
        if (err) {
            console.log(err);
            res.sendStatus(404)
        }
        res.status(200).json(rows.map(el => {
            return {
                ...el,
                locationOption: getLocationOption(el.locationOption)
            }
        }))
    });

});

router.put('/skill', (req, res) => {

    const db = req.con;
    const id = req.body.id;
    const category = req.body.category;
    const tagline = req.body.tagline;
    const locationOption = req.body.locationOption;
    const travelFee = req.body.travelFee;

    db.query('UPDATE skill SET category = ?, tagline = ?, locationOption = ?, travelFee = ? WHERE id = ?',
        [category, tagline, locationOption, travelFee, id], (err, rows) => {
        if (err) {
            console.log(err);
            res.sendStatus(404)
        }
        res.status(200).json({
            id: id,
            category: category,
            tagline: tagline,
            locationOption: getLocationOption(locationOption),
            travelFee: travelFee
        })
    });
});

router.post('/skill', (req, res) => {

    const db = req.con;
    const ownerId = req.body.userId;
    const category = req.body.category;
    const tagline = req.body.tagline;
    const locationOption = req.body.locationOption;
    const travelFee = req.body.travelFee;

    db.query('INSERT INTO `skill` (`category`, `tagline`, `locationOption`, `travelFee`, `ownerId`) VALUES (?, ?, ?, ?, ?)',
        [category, tagline, locationOption, travelFee, ownerId], (err, row) => {
        if (err) {
            console.log(err);
            res.sendStatus(404)
        }
        res.status(200).json({
            id: row.insertId,
            ownerId: ownerId,
            category: category,
            tagline: tagline,
            locationOption: getLocationOption(locationOption),
            travelFee: travelFee
        })
    });
});

router.delete('/skill/:id', (req, res) => {

    const db = req.con;

    db.query('DELETE FROM skill WHERE id = ?;',
        [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
            res.sendStatus(404)
        }
        res.sendStatus(200)
    });
});

module.exports = router;
