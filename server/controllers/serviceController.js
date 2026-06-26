const User = require('../models/User');

// @desc    Get all service providers with filters
// @route   GET /api/providers
// @access  Public
async function getProviders(req, res) {
  try {
    const { category, search } = req.query;
    const query = { role: 'provider' };

    if (category) {
      query['providerInfo.category'] = category;
    }

    let providers = await User.find(query);

    // Filter by search string if provided (handles case-insensitive match on name or bio)
    if (search) {
      const searchLower = search.toLowerCase();
      providers = providers.filter(provider => {
        const nameMatch = provider.name?.toLowerCase().includes(searchLower);
        const bioMatch = provider.providerInfo?.bio?.toLowerCase().includes(searchLower);
        return nameMatch || bioMatch;
      });
    }

    // Clean sensitive/unused fields before sending
    const cleanedProviders = providers.map(p => ({
      _id: p._id,
      name: p.name,
      email: p.email,
      avatar: p.avatar,
      phone: p.phone,
      address: p.address,
      providerInfo: p.providerInfo
    }));

    res.json(cleanedProviders);
  } catch (error) {
    console.error('Error fetching providers:', error.message);
    res.status(500).json({ message: 'Server error fetching providers' });
  }
}

// @desc    Get provider by ID
// @route   GET /api/providers/:id
// @access  Public
async function getProviderById(req, res) {
  try {
    const provider = await User.findById(req.params.id);
    if (!provider || provider.role !== 'provider') {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({
      _id: provider._id,
      name: provider.name,
      email: provider.email,
      avatar: provider.avatar,
      phone: provider.phone,
      address: provider.address,
      providerInfo: provider.providerInfo
    });
  } catch (error) {
    console.error('Error fetching provider profile:', error.message);
    res.status(500).json({ message: 'Server error fetching provider profile' });
  }
}

module.exports = {
  getProviders,
  getProviderById,
};
