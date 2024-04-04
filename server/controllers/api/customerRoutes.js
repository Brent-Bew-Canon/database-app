const router = require('express').Router();
const { Customer } = require('../../models');
const { Resend } = require('resend');

const resend = new Resend("re_rQn1c9rp_AenqccoMhV58CvyptK5UK24u");

router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, tier, address, email, signDate, equipment, nextServiceDate, lastServiceDate, phone, notes } = req.body;
        const newCust = await Customer.create({
            firstName,
            lastName,
            tier,
            address,
            email,
            signDate,
            equipment,
            nextServiceDate,
            lastServiceDate,
            phone,
            notes
        });
        // send status, json messsage "success", and data
        res.status(200).json({ message: 'Customer created successfully', data: newCust });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/', async (req, res) => {
    try {
        const custData = await Customer.findAll({
        });
        res.status(200).json(custData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, tier, address, email, signDate, equipment, nextServiceDate, lastServiceDate, phone, notes, lastEmailSent, numUnits } = req.body;
        const updateCust = await Customer.update({
            firstName,
            lastName,
            tier,
            address,
            email,
            signDate,
            nextServiceDate,
            lastServiceDate,
            phone,
            notes,
            lastEmailSent,
            equipment,
            numUnits
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ message: 'Customer updated successfully', data: updateCust });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/updateEmail/:id', async (req, res) => {
    try {
        const updateCust = await Customer.update({
            lastEmailSent: Date.now(),
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ message: 'Customer email updated successfully', data: updateCust });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/autoUpdate/:id', async (req, res) => {
    try {
        if (req.body.key === process.env.KEY) {
            const updateCust = await Customer.update({
                lastEmailSent: Date.now(),
            }, {
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json({ message: 'Customer email updated successfully', data: updateCust });
        }
        else {
            res.status(400).json({ message: 'Invalid key' });
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const delCust = await Customer.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ message: 'Customer deleted successfully', data: delCust });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
