'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, Deal } from '@/lib/api';
import { Button, Card, CardHeader, CardBody, CardFooter, Badge, Skeleton, NetworkError, EmptyState, Modal } from '@/components/ui';

const categories = [
  { id: 'all', label: 'All Categories', icon: '🎯' },
  { id: 'cloud', label: 'Cloud', icon: '☁️' },
  { id: 'productivity', label: 'Productivity', icon: '⚡' },
  { id: 'development', label: 'Development', icon: '💻' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'marketing', label: 'Marketing', icon: '📢' },
  { id: 'legal', label: 'Legal', icon: '⚖️' },
  { id: 'support', label: 'Support', icon: '💬' },
];

const accessLevels = [
  { id: 'all', label: 'All Deals' },
  { id: 'public', label: 'Public' },
  { id: 'locked', label: 'Verified Only' },
];

export default function DealsPage() {
  const { user, isAuthenticated } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAccess, setSelectedAccess] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);

  // Fetch deals on mount
  useEffect(() => {
    fetchDeals();
  }, []);

  // Filter deals whenever filters change
  useEffect(() => {
    filterDeals();
  }, [deals, searchQuery, selectedCategory, selectedAccess]);

  const fetchDeals = async () => {
    setIsLoading(true);
    setError(null);
    const response = await api.get<{ deals: Deal[] }>('/deals?limit=100');
    
    if (response.error) {
      setError(response.error);
    } else if (response.data?.deals) {
      setDeals(response.data.deals);
    }
    
    setIsLoading(false);
  };

  const filterDeals = () => {
    let filtered = [...deals];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (deal) =>
          deal.title.toLowerCase().includes(query) ||
          deal.description.toLowerCase().includes(query) ||
          deal.partnerName.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((deal) => deal.category === selectedCategory);
    }

    // Access level filter
    if (selectedAccess !== 'all') {
      filtered = filtered.filter((deal) => deal.accessLevel === selectedAccess);
    }

    setFilteredDeals(filtered);
  };

  const isLocked = (deal: Deal) => {
    return deal.accessLevel === 'locked' && !user?.isVerified;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.2,
      }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b sticky top-0 z-40 backdrop-blur-lg bg-white/90"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Browse Deals
              </h1>
              <p className="text-gray-600 mt-1">
                {isAuthenticated 
                  ? user?.isVerified 
                    ? 'Access all exclusive benefits' 
                    : 'Get verified for locked deals'
                  : 'Sign in to claim deals'
                }
              </p>
            </div>
            <div className="flex gap-2">
              {!isAuthenticated ? (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">Get Started</Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search deals by name, partner, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="space-y-6 mb-8">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Access Level Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Access Level</h3>
            <div className="flex gap-2">
              {accessLevels.map((level) => (
                <motion.button
                  key={level.id}
                  onClick={() => setSelectedAccess(level.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedAccess === level.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {level.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between text-sm text-gray-600"
          >
            <span>
              Showing <strong>{filteredDeals.length}</strong> {filteredDeals.length === 1 ? 'deal' : 'deals'}
            </span>
            {(searchQuery || selectedCategory !== 'all' || selectedAccess !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedAccess('all');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-start">
                    <Skeleton width={100} height={24} />
                    <Skeleton circle width={60} height={24} />
                  </div>
                  <Skeleton width="100%" height={20} />
                  <Skeleton width="80%" height={16} />
                  <Skeleton width="100%" height={60} />
                  <Skeleton width="100%" height={40} />
                </CardBody>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <Card>
            <CardBody>
              <NetworkError onRetry={fetchDeals} />
            </CardBody>
          </Card>
        )}

        {/* Deals Grid */}
        {!isLoading && !error && (
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              {filteredDeals.length === 0 ? (
                <Card>
                  <CardBody>
                    <EmptyState
                      title="No deals found"
                      message="Try adjusting your filters or search query to find what you're looking for."
                      icon="🔍"
                      actionText="Clear All Filters"
                      onAction={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedAccess('all');
                      }}
                    />
                  </CardBody>
                </Card>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredDeals.map((deal) => {
                    const locked = isLocked(deal);
                    const isHovered = hoveredCard === deal._id;

                    return (
                      <motion.div
                        key={deal._id}
                        layout
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onHoverStart={() => setHoveredCard(deal._id)}
                        onHoverEnd={() => setHoveredCard(null)}
                        style={{
                          transformStyle: 'preserve-3d',
                        }}
                        whileHover={
                          !locked
                            ? {
                                y: -8,
                                rotateX: 2,
                                rotateY: isHovered ? 2 : 0,
                                transition: { duration: 0.2 },
                              }
                            : { y: -4 }
                        }
                      >
                        <Card className="h-full relative overflow-hidden">
                          {/* Lock Overlay */}
                          {locked && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/70 to-black/80 backdrop-blur-sm z-10 flex items-center justify-center"
                            >
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-center px-6"
                              >
                                <motion.div
                                  animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, -5, 5, 0]
                                  }}
                                  transition={{ 
                                    repeat: Infinity, 
                                    duration: 2 
                                  }}
                                  className="text-6xl mb-4"
                                >
                                  🔒
                                </motion.div>
                                <h4 className="text-white font-bold text-lg mb-2">
                                  Verification Required
                                </h4>
                                <p className="text-gray-200 text-sm mb-4">
                                  This deal requires a verified account to claim
                                </p>
                                {!isAuthenticated ? (
                                  <Link href="/register">
                                    <Button variant="primary" size="sm">
                                      Get Started
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setShowVerificationInfo(true);
                                    }}
                                  >
                                    Contact Support
                                  </Button>
                                )}
                              </motion.div>
                            </motion.div>
                          )}

                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {deal.title}
                                </h3>
                                <p className="text-sm text-gray-600">{deal.partnerName}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Badge
                                  variant={deal.accessLevel === 'locked' ? 'warning' : 'success'}
                                  size="sm"
                                >
                                  {deal.accessLevel === 'locked' ? '🔒 Locked' : '✓ Public'}
                                </Badge>
                                <Badge variant="info" size="sm">
                                  {categories.find((c) => c.id === deal.category)?.icon || '📦'}{' '}
                                  {deal.category}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>

                          <CardBody>
                            <p className="text-gray-700 line-clamp-3">{deal.description}</p>
                          </CardBody>

                          <CardFooter>
                            <div className="flex gap-2 w-full">
                              <Link href={`/deals/${deal.slug}`} className="flex-1">
                                <Button variant="outline" size="sm" fullWidth>
                                  Learn More
                                </Button>
                              </Link>
                              {!locked && (
                                <Link href={isAuthenticated ? `/deals/${deal.slug}` : '/login'} className="flex-1">
                                  <Button variant="primary" size="sm" fullWidth>
                                    {isAuthenticated ? 'Claim Deal' : 'Sign In'}
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        )}
      </div>

      {/* Verification Info Modal */}
      <Modal 
        isOpen={showVerificationInfo} 
        onClose={() => setShowVerificationInfo(false)}
        title="Account Verification Required"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700 mb-3">
              To access locked deals, you need to verify your startup account. This ensures exclusive benefits go to genuine startups.
            </p>
            <p className="text-gray-700 font-medium mb-2">
              📧 Contact support to get verified:
            </p>
            <a 
              href="mailto:support@benefitshub.com" 
              className="text-blue-600 font-mono text-sm hover:underline"
            >
              support@benefitshub.com
            </a>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="primary" 
              onClick={() => setShowVerificationInfo(false)}
              fullWidth
            >
              Got it
            </Button>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" fullWidth>
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
