import asyncHandler from 'express-async-handler';
import { getCompanyUserAccount } from '../services/companyApi.js';

// @desc    Fetch user account from company API by login ID
// @route   GET /api/company/account/:loginId
// @access  Private
const getCompanyAccount = asyncHandler(async (req, res) => {
  const { loginId } = req.params;

  if (!loginId) {
    res.status(400);
    throw new Error('Login ID is required');
  }

  try {
    const accountData = await getCompanyUserAccount(loginId);
    res.status(200).json({
      success: true,
      data: accountData,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch account from company API';
    res.status(status);
    throw new Error(message);
  }
});

export { getCompanyAccount };
