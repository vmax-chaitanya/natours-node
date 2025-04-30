const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);


exports.checkID = (req, res, next, val) => {
    // console.log(`param id is ${val}`);


    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "error",
            message: "invalid id"
        })
    }
    next();
}

exports.checkBody = (req, res, next) => {
    if (req.body.name == null || req.body.price == null) {
        return res.status(404).json({
            status: "error",
            message: "name or price value is null"
        })
    }
    next();
}

exports.allTours = (req, res) => {
    res.status(200).json({
        status: "success",
        requestedAt: req.requestedTime,
        result: tours.length,
        data: {
            tours: tours
        }
    });
};

exports.getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    res.status(200).json({
        status: "success",
        data: {
            tour: tour
        }
    });

};


exports.createTour = (req, res) => {
    // console.log(tours.length);
    // res.send("donee");
    const newId = tours[tours.length - 1].id + 1;
    // console.log(newId);

    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            message: "record created",
            status: "created successfully",
            data: {
                tours: newTour
            }
        })
    })

};

exports.updateTour = (req, res) => {
    const id = req.params.id * 1;


    res.status(200).json({
        status: "updated",
        data: {
            tour: "updating..."
        }
    });

};


exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;


    res.status(204).json({
        status: "updated",
        data: {
            tour: null
        }
    });
};