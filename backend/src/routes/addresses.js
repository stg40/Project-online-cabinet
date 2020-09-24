const express = require('express');
const authenticateJWT = require("../middlewares/authenticateJWT");
const router = express.Router();
require('dotenv').config();
const fetch = require('node-fetch');

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const addressValidation = require("../middlewares/addresses_validation");
const {getAddressById, getAddresses, createAddress, updateAddress, deleteAddresses} = require("../services/addressService");

router.get('/', authenticateJWT, async (req, res) => {
        const user = req.user;
        try {
            res.status(200).json(await getAddresses(user.id));
        } catch (e){
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.get('/search', authenticateJWT, async (req, res) => {
    console.log(req.query.criteria)
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    const criteria = req.query.criteria;

    if (criteria) {
        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + process.env.DADATA_API_KEY
            },
            body: JSON.stringify({
                query: criteria
            })
        }

        const response = await fetch(url, options)
        res.status(200).json(await response.json());
    } else {
        res.status(200).json({"suggestions": []});
    }
});

router.get('/:id', authenticateJWT, async (req, res) => {
        const id = req.params.id;
        const user = req.user;
        try {
            const address = await getAddressById(user.id, id);
            if (address) {
                res.status(200).json(address);
            } else {
                res.sendStatus(404);
            }
        } catch (e){
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.post('/', [authenticateJWT, urlencodedParser, addressValidation], async (req, res) => {
        const user = req.user;
        const address = req.body.address;
        const apartments = req.body.apartments;
        const fias = req.body.fias_code;
        try {
            const createdAddress = await createAddress(user.id, address, apartments, fias);
            res.status(200).json(createdAddress);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.put('/:id', [authenticateJWT, urlencodedParser, addressValidation], async (req, res) => {
    const user = req.user;
    try {
        const address = await updateAddress({
            id: req.params.id,
            userId: user.id,
            address: req.body.address,
            apartments: req.body.apartments,
            fias: req.body.fias_code
        });

        res.status(200).json(address);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
    const id = req.params.id
    const user = req.user;
    try {
        await deleteAddresses(id, user.id);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

module.exports = router;