'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { api, Deal } from '@/lib/api';
import { Button, Card, CardBody, Badge, Skeleton, Modal, NotFoundError, NetworkError } from '@/components/ui';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [claimError, setClaimError] = useState('');

  const slug = params?.slug as string;

  // Fetch deal data
  const fetchDeal = async () => {
    setIsLoading(true);
    setError('');

    const response = await api.get<{ deals: Deal[] }>(`/deals?slug=${slug}`);

    if (response.error) {
      setError(response.error);
    } else if (response.data && response.data.deals.length > 0) {
      setDeal(response.data.deals[0]);
    } else {
      setError('Deal not found');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (slug) {
      fetchDeal();
    }
  }, [slug]);

  // Determine if user can claim this deal
  const canClaim = () => {
    if (!isAuthenticated) return { can: false, reason: 'login' };
    if (!deal) return { can: false, reason: 'loading' };
    if (deal.accessLevel === 'locked' && !user?.isVerified) {
      return { can: false, reason: 'verification' };
    }
    return { can: true, reason: null };
  };

  const claimStatus = canClaim();

  // Handle claim deal
  const handleClaim = async () => {
    if (!claimStatus.can) return;

    setIsClaiming(true);
    setClaimError('');

    const response = await api.post('/claims', {
      dealId: deal?._id,
    });

    setIsClaiming(false);

    if (response.error) {
      setClaimError(response.error);
    } else {
      setShowSuccessModal(true);
    }
  };

  // Loading state
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BenefitsHub
                </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Loading skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton width={200} height={20} className="mb-8" />
          <Card>
            <CardBody className="space-y-6">
              <Skeleton width="60%" height={40} />
              <Skeleton width="100%" height={20} />
              <Skeleton width="100%" height={100} />
              <Skeleton width="100%" height={50} />
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    const isNotFound = error === 'Deal not found' || !deal;
    const isNetworkError = error && error !== 'Deal not found';

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BenefitsHub
                </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Error message */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardBody>
                {isNotFound ? (
                  <NotFoundError 
                    resourceName="deal" 
                    redirectPath="/deals" 
                    redirectText="Browse All Deals"
                  />
                ) : (
                  <NetworkError onRetry={fetchDeal} />
                )}
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Category icons
  const categoryIcons: Record<string, string> = {
    cloud: '☁️',
    productivity: '⚡',
    dev: '💻',
    design: '🎨',
    marketing: '📢',
    legal: '⚖️',
    support: '💬',
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
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <Link href="/deals">
                    <Button variant="ghost" size="sm">Browse Deals</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <motion.div
        className="max-w-4xl mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>→</span>
          <Link href="/deals" className="hover:text-blue-600">Deals</Link>
          <span>→</span>
          <span className="text-gray-900 font-medium">{deal.title}</span>
        </div>

        {/* Deal Card */}
        <Card className="mb-8">
          <CardBody className="space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              {/* Title and Badges */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  {deal.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={deal.accessLevel === 'public' ? 'success' : 'warning'}
                    size="md"
                  >
                    {deal.accessLevel === 'public' ? '✓ Public' : '🔒 Locked'}
                  </Badge>
                  <Badge variant="info" size="md">
                    {categoryIcons[deal.category] || '📦'} {deal.category}
                  </Badge>
                </div>
              </div>

              {/* Partner Info */}
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl font-bold text-gray-400 shadow-sm">
                    {deal.partnerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Partner</p>
                    <h3 className="text-2xl font-bold text-gray-900">{deal.partnerName}</h3>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Description Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {deal.description}
              </p>
            </div>

            {/* Eligibility Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                📋 Eligibility Requirements
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Must have a valid startup or business account</span>
                </li>
                {deal.accessLevel === 'locked' && (
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-yellow-500 mt-1">⚠️</span>
                    <span><strong>Verified account required</strong> - Contact support to verify your startup</span>
                  </li>
                )}
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>One claim per user</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Terms and conditions apply</span>
                </li>
              </ul>
            </div>

            {/* Access Level Badge Info */}
            <motion.div
              className={`rounded-lg p-4 ${
                deal.accessLevel === 'public'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {deal.accessLevel === 'public' ? '🎉' : '🔐'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {deal.accessLevel === 'public' ? 'Public Deal' : 'Verified Members Only'}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {deal.accessLevel === 'public'
                      ? 'This deal is available to all registered users. Sign up and claim it now!'
                      : 'This exclusive deal requires account verification. Contact our support team to get verified and unlock premium benefits.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </CardBody>
        </Card>

        {/* Claim Section */}
        <Card>
          <CardBody>
            <AnimatePresence mode="wait">
              {/* Not logged in */}
              {!isAuthenticated && (
                <motion.div
                  key="not-logged-in"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-8"
                >
                  <div className="text-5xl mb-4">🔐</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Sign In to Claim This Deal
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create a free account or sign in to access this exclusive offer
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href={`/login?redirect=/deals/${slug}`}>
                      <Button variant="primary" size="lg">
                        Sign In
                      </Button>
                    </Link>
                    <Link href={`/register?redirect=/deals/${slug}`}>
                      <Button variant="outline" size="lg">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Logged in but unverified (for locked deals) */}
              {isAuthenticated && claimStatus.reason === 'verification' && (
                <motion.div
                  key="unverified"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-8"
                >
                  <div className="text-5xl mb-4">🔒</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Verification Required
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This premium deal is only available to verified startup accounts.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      ✨ Why verify your account?
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Access premium and locked deals</li>
                      <li>• Higher claim limits</li>
                      <li>• Priority support</li>
                      <li>• Exclusive partner offers</li>
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={() => setShowVerificationModal(true)}
                    >
                      Contact Support to Verify
                    </Button>
                    <Link href="/deals">
                      <Button variant="outline" size="lg">
                        Browse Public Deals
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Can claim */}
              {isAuthenticated && claimStatus.can && (
                <motion.div
                  key="can-claim"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-8"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Ready to Claim This Deal?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Click below to claim your exclusive {deal.partnerName} offer
                  </p>
                  
                  {claimError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 max-w-md mx-auto"
                    >
                      {claimError}
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleClaim}
                      isLoading={isClaiming}
                      disabled={isClaiming}
                    >
                      {isClaiming ? 'Claiming...' : 'Claim Deal Now'}
                    </Button>
                  </motion.div>

                  <p className="text-xs text-gray-500 mt-4">
                    By claiming, you agree to our terms and the partner's conditions
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardBody>
        </Card>

        {/* Back to Deals */}
        <div className="mt-8 text-center">
          <Link href="/deals" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2">
            ← Back to All Deals
          </Link>
        </div>
      </motion.div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push('/dashboard');
        }}
        title="Deal Claimed Successfully! "
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="text-6xl mb-4"
            >
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Congratulations!
            </h3>
            <p className="text-gray-600">
              You've successfully claimed the <strong>{deal.title}</strong> deal from {deal.partnerName}.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">What's Next?</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">1.</span>
                <span>Check your email for claim details and redemption instructions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">2.</span>
                <span>Your claim is pending approval (usually within 24-48 hours)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">3.</span>
                <span>View all your claims in your dashboard</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button variant="primary" fullWidth>
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/deals" className="flex-1">
              <Button variant="outline" fullWidth>
                Browse More Deals
              </Button>
            </Link>
          </div>
        </div>
      </Modal>

      {/* Verification Modal */}
      <Modal 
        isOpen={showVerificationModal} 
        onClose={() => setShowVerificationModal(false)}
        title="Account Verification Required"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700 mb-3">
              To access this deal, you'll need to verify your account. In production, this would be handled automatically.
            </p>
            <p className="text-gray-700 font-medium mb-2">
              📧 For support, contact:
            </p>
            <p className="text-blue-600 font-mono text-sm mb-4">
              support@benefitshub.com
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-gray-700 font-medium mb-2">
              🧪 For this demo:
            </p>
            <p className="text-gray-600 text-sm mb-3">
              Use the dev endpoint to verify your account instantly:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded p-3 font-mono text-xs space-y-2">
              <div>POST http://localhost:5000/dev/verify-me</div>
              <div className="text-gray-400">Authorization: Bearer YOUR_TOKEN</div>
            </div>
            <p className="text-gray-600 text-xs mt-3">
              💡 Copy your token from browser DevTools → Application → Local Storage
            </p>
          </div>

          <Button 
            variant="primary" 
            onClick={() => setShowVerificationModal(false)}
            fullWidth
          >
            Got it
          </Button>
        </div>
      </Modal>
    </div>
  );
}
