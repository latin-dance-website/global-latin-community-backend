const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUserRole,
  updateProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.put('/profile', protect, updateProfile);

module.exports = router;