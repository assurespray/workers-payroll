const express = require('express');
const {
  getContractors,
  getContractor,
  createContractor,
  updateContractor,
  deleteContractor,
  addSite,
  updateSite,
  deleteSite,
  getSites
} = require('../controllers/contractorController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.route('/')
  .get(getContractors)
  .post(createContractor);

router.route('/:id')
  .get(getContractor)
  .put(updateContractor)
  .delete(deleteContractor);

// Site routes
router.route('/:id/sites')
  .get(getSites)
  .post(addSite);

router.route('/:id/sites/:siteId')
  .put(updateSite)
  .delete(deleteSite);

module.exports = router;
