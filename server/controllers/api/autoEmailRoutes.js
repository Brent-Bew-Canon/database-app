const router = require('express').Router();
const { Customer } = require('../../models');
const { Resend } = require('resend');
const oneDay = require('../emails/oneDay');
const goldTier = require('../emails/goldTier');
const silverTier = require('../emails/silverTier');
const bronzeTier = require('../emails/bronzeTier');
const { authenticateToken } = require('../../utils/auth');
const dayjs = require('dayjs');

const resend = new Resend("re_rQn1c9rp_AenqccoMhV58CvyptK5UK24u");

router.get('/', async (req, res) => {
    try {
        let validCusts = []
        const custData = await Customer.findAll({
        });
        custData.forEach(cust => {
            console.log(cust.nextServiceDate);
            // send email if next service date is in 3 days or is tomorrow
            const nextServiceDate = dayjs(cust.nextServiceDate);
            const today = dayjs().startOf('day');
            const isNextDay = nextServiceDate.diff(today, 'days') === 1;
            const isInThreeDays = nextServiceDate.diff(today, 'days') === 3;

            if (isNextDay || isInThreeDays) {
                let html
                if (cust.tier === "Gold") {
                    html = goldTier(cust.firstName, dayjs(cust.nextServiceDate).format("MM/DD/YYYY"))
                }
                else if (cust.tier === "Silver") {
                    html = silverTier(cust.firstName, dayjs(cust.nextServiceDate).format("MM/DD/YYYY"))
                }
                else if (cust.tier === "Bronze") {
                    html = bronzeTier(cust.firstName, dayjs(cust.nextServiceDate).format("MM/DD/YYYY"))
                }
                const { data, error } = resend.emails.send({
                    from: "onboarding@resend.dev",
                    to: ["mrbuchmas@gmail.com"],
                    subject: "Appt. Reminder",
                    html: html
                });
                validCusts.push(cust.id)
            }
        });
        res.status(200).json({ message: 'Customer emailed successfully', data: validCusts });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/sendmail', async (req, res) => {
    let html
    try {
        if (req.body.tier === "Gold") {
            html = goldTier(req.body.firstName, req.body.nextServiceDate)
        }
        else if (req.body.tier === "Silver") {
            html = silverTier(req.body.firstName, req.body.nextServiceDate)
        }
        else if (req.body.tier === "Bronze") {
            html = bronzeTier(req.body.firstName, req.body.nextServiceDate)
        }
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: ["mrbuchmas@gmail.com"],
            subject: "Appt. Reminder",
            html: html,
        });
        res.status(200).json({ message: 'Customer emailed successfully', data: data });
    } catch (err) {
        res.status(400).json({ error: err, message: 'Customer not emailed successfully', data: req.body });
    }

})


module.exports = router;
