'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button, Card, CardHeader, CardBody, CardFooter, Badge, Skeleton, NetworkError, EmptyState } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { api, Claim, Deal } from '@/lib/api';

interface PopulatedClaim extends Omit<Claim, 'dealId'> {
  dealId: Deal;
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [claims, setClaims] = useState<PopulatedClaim[]>([]);
  const [isLoadingClaims, setIsLoadingClaims] = useState(true);
  const [claimsError, setClaimsError] = useState('');

  // Fetch user's claims
  const fetchClaims = async () => {
    setIsLoadingClaims(true);
    setClaimsError('');

    const response = await api.get<{ claims: PopulatedClaim[] }>('/claims/me');

    if (response.error) {
      setClaimsError(response.error);
    } else if (response.data) {
      setClaims(response.data.claims);
    }

    setIsLoadingClaims(false);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Get status badge variant and label
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return { variant: 'success' as const, label: '✓ Approved', icon: '✅' };
      case 'pending':
        return { variant: 'warning' as const, label: '⏳ Pending', icon: '⏳' };
      case 'rejected':
        return { variant: 'error' as const, label: '✗ Rejected', icon: '❌' };
      default:
        return { variant: 'info' as const, label: status, icon: '📋' };
    }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BenefitsHub
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/deals">
                <Button variant="ghost" size="sm">Browse Deals</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Welcome back, {user?.name}!</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Your Profile</h2>
                  <p className="text-sm text-gray-600">Manage your account information</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-lg text-gray-900 mt-1">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    <p className="text-lg text-gray-900 mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Member Since</label>
                    <p className="text-lg text-gray-900 mt-1">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Verification Status</label>
                    <div className="mt-2">
                      {user?.isVerified ? (
                        <Badge variant="success" size="md">✓ Verified</Badge>
                      ) : (
                        <Badge variant="warning" size="md">⚠ Unverified</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Account Role</label>
                    <p className="text-lg text-gray-900 mt-1">{user?.role || 'User'}</p>
                  </div>

                  {/* Access Level Info */}
                  <div className={`rounded-lg p-4 ${
                    user?.isVerified 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <p className={`text-sm font-semibold mb-1 ${
                      user?.isVerified ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {user?.isVerified ? '🎉 Premium Access' : '⚠️ Limited Access'}
                    </p>
                    <p className={`text-xs ${
                      user?.isVerified ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {user?.isVerified 
                        ? 'You have access to all deals including locked premium benefits.' 
                        : 'You can only access public deals. Contact support to get verified.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Claimed Deals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">My Claimed Deals</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Track your claimed benefits and approval status
                  </p>
                </div>
                {claims.length > 0 && (
                  <Badge variant="info" size="lg">
                    {claims.length} {claims.length === 1 ? 'Claim' : 'Claims'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {/* Loading State */}
              {isLoadingClaims && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Skeleton width="60%" height={24} className="mb-2" />
                          <Skeleton width="40%" height={16} />
                        </div>
                        <Skeleton width={100} height={28} />
                      </div>
                      <Skeleton width="100%" height={16} className="mb-2" />
                      <Skeleton width="80%" height={16} />
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {!isLoadingClaims && claimsError && (
                <NetworkError onRetry={fetchClaims} />
              )}

              {/* Empty State */}
              {!isLoadingClaims && !claimsError && claims.length === 0 && (
                <EmptyState
                  title="No Claims Yet"
                  message="You haven't claimed any deals yet. Browse our exclusive offers and start saving!"
                  icon="🎁"
                  actionText="Explore Deals"
                  onAction={() => router.push('/deals')}
                />
              )}

              {/* Claims List */}
              {!isLoadingClaims && !claimsError && claims.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <AnimatePresence>
                    {claims.map((claim, index) => {
                      const statusInfo = getStatusInfo(claim.status);
                      const deal = claim.dealId;

                      return (
                        <motion.div
                          key={claim._id}
                          variants={itemVariants}
                          layout
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {deal.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Partner: <span className="font-medium">{deal.partnerName}</span>
                              </p>
                            </div>
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Badge variant={statusInfo.variant} size="md">
                                {statusInfo.label}
                              </Badge>
                            </motion.div>
                          </div>

                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {deal.description}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              Claimed: {new Date(claim.claimedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <div className="flex gap-2">
                              <Badge variant="info" size="sm">
                                {deal.category}
                              </Badge>
                              <Link href={`/deals/${deal.slug}`}>
                                <Button variant="ghost" size="sm">
                                  View Deal →
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* Status-specific messages */}
                          {claim.status === 'pending' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 pt-3 border-t border-gray-200"
                            >
                              <p className="text-xs text-yellow-700 bg-yellow-50 px-3 py-2 rounded">
                                ⏳ Your claim is being reviewed. You'll receive an email once it's approved (usually within 24-48 hours).
                              </p>
                            </motion.div>
                          )}

                          {claim.status === 'approved' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 pt-3 border-t border-gray-200"
                            >
                              <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded">
                                ✅ Claim approved! Check your email for redemption instructions.
                              </p>
                            </motion.div>
                          )}

                          {claim.status === 'rejected' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 pt-3 border-t border-gray-200"
                            >
                              <p className="text-xs text-red-700 bg-red-50 px-3 py-2 rounded">
                                ❌ Claim was rejected. Contact support for more information.
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </CardBody>

            {/* Footer with CTA */}
            {!isLoadingClaims && claims.length > 0 && (
              <CardFooter>
                <div className="flex justify-center">
                  <Link href="/deals">
                    <Button variant="outline">
                      Claim More Deals
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
