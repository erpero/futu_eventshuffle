const mongoose = require('mongoose');
const Event = mongoose.model('Event');

exports.add_vote = (req, res) => {
    Event.findOne({ 'id': req.params.id }, (err, event) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else if (event !== null) {
            for (let i = 0; i < req.body.votes.length; i++) {
                if (event.dates.indexOf(req.body.votes[i]) !== -1) {
                    const oldIndex = event.votes.findIndex((e) => { // Does date already exist in votes
                        return e.date === req.body.votes[i]
                    });
                    if (oldIndex < 0) {
                        event.votes
                            .push({ 'date': req.body.votes[i], 'people': [req.body.name] });
                    } else {
                        event.votes[oldIndex].people
                            .push(req.body.name);
                    }
                }
            }
            event.save((err, saved) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    const resObj = {
                        'id': req.params.id,
                        'name': saved.name,
                        'dates': saved.dates,
                        'votes': saved.votes
                    }
                    res.json(resObj);
                }
            });
        } else {
            res.status(404).send('Event with id: ' + req.params.id + ' not found');
        }
    });
};
